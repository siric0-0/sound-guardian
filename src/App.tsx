import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  DemoEvent,
  ScenarioId,
  SentrySignals,
  ArbiterDecision,
  AuditEntry,
  AssistedNote,
} from './types.ts';
import { loadDemoCSV } from './lib/csvParser.ts';
import { buildSentrySignals } from './lib/sentry.ts';
import { runArbiter } from './lib/arbiter.ts';
import {
  validateSentrySignals,
  validateArbiterDecision,
  loadSavedState,
  saveState,
  clearSavedState,
  OrchestratorState,
} from './lib/orchestrator.ts';
import {
  checkAiStatus,
  fetchGuardianCopy,
  fetchStaffAssist,
  GuardianExplainResponse,
  StaffAssistResponse,
} from './lib/api.ts';
import { tokenizeMemberId, maskPhone } from './lib/tokenization.ts';

import { TopBar } from './components/TopBar.tsx';
import { SCENARIOS } from './components/ScenarioPicker.tsx';
import { ChooseStoryScreen } from './components/ChooseStoryScreen.tsx';
import { PhoneApp } from './components/MemberView/PhoneApp.tsx';
import { GuidedStoryBar } from './components/MemberView/GuidedStoryBar.tsx';
import { StaffConsole } from './components/StaffView/StaffConsole.tsx';
import { QueueItem } from './components/StaffView/StaffQueue.tsx';
import { WhyDrawer } from './components/WhyDrawer.tsx';
import { AboutDataModal } from './components/AboutDataModal.tsx';
import { ScamReportModal } from './components/MemberView/ScamReportModal.tsx';
import { SCUFooter } from './components/SCUFooter.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // Screen mode: Start on 'story_picker' per user request, then transition to 'app'
  const [currentScreen, setCurrentScreen] = useState<'story_picker' | 'app'>('story_picker');

  // Master Event List from CSV
  const [allEvents, setAllEvents] = useState<DemoEvent[]>([]);
  const [csvLoading, setCsvLoading] = useState(true);
  const [csvError, setCsvError] = useState<string | null>(null);

  // Orchestrator Persistent Session State
  const [session, setSession] = useState<OrchestratorState>(() => loadSavedState());

  // Phone App Internal Navigation Tabs: Home · Pay · Activity · Help
  const [activePhoneTab, setActivePhoneTab] = useState<'home' | 'pay' | 'activity' | 'help'>('home');
  const [payStep, setPayStep] = useState<1 | 2 | 3 | 4>(1);

  // Staff Console Tab selection
  const [staffInitialTab, setStaffInitialTab] = useState<'dashboard' | 'cases' | 'branch' | 'evidence'>('dashboard');

  // Technical Explainer Drawer (Closed by default)
  const [isWhyDrawerOpen, setIsWhyDrawerOpen] = useState(false);

  // Modals
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isScamModalOpen, setIsScamModalOpen] = useState(false);

  // AI Service Status & Cache
  const [aiStatus, setAiStatus] = useState<{
    aiStatus: 'live' | 'offline';
    provider: string;
    model: string;
  }>({
    aiStatus: 'offline',
    provider: 'none',
    model: 'deterministic_templates',
  });
  const [staffAssist, setStaffAssist] = useState<StaffAssistResponse | null>(null);
  const [guardianCopy, setGuardianCopy] = useState<GuardianExplainResponse | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Load CSV dataset on mount
  useEffect(() => {
    loadDemoCSV()
      .then((data) => {
        setAllEvents(data);
        setCsvLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load demo CSV:', err);
        setCsvError(err.message || 'Error loading CSV dataset');
        setCsvLoading(false);
      });

    // Check AI status
    checkAiStatus().then(setAiStatus);
  }, []);

  // Save session state to localStorage on changes
  useEffect(() => {
    saveState(session);
  }, [session]);

  // Active scenario definition
  const scenarioDef = useMemo(() => {
    return SCENARIOS.find((s) => s.id === session.scenarioId) || SCENARIOS[0];
  }, [session.scenarioId]);

  // Events filtered and sorted for active member
  const memberEvents = useMemo(() => {
    if (!allEvents.length) return [];
    return allEvents
      .filter((ev) => ev.synthetic_member_id === scenarioDef.memberId)
      .sort((a, b) => a.event_sequence - b.event_sequence);
  }, [allEvents, scenarioDef.memberId]);

  const currentEvent = useMemo(() => {
    if (!memberEvents.length) {
      return {} as DemoEvent;
    }
    return memberEvents[session.stepIndex] || memberEvents[0];
  }, [memberEvents, session.stepIndex]);

  // Sentry Signals Engine (strictly deterministic)
  const currentSignals = useMemo<SentrySignals | null>(() => {
    if (!currentEvent || !currentEvent.event_type) return null;
    const isTargetEvent =
      currentEvent.event_type === 'Recipient Added' ||
      currentEvent.event_type === 'Payment Initiated';
    if (!isTargetEvent) return null;

    const signals = buildSentrySignals(currentEvent, memberEvents);
    const validation = validateSentrySignals(signals);
    if (!validation.valid) {
      console.warn('Sentry validation failed:', validation.error);
    }
    return signals;
  }, [currentEvent, memberEvents]);

  // Arbiter Decision Engine (strictly deterministic)
  const currentDecision = useMemo<ArbiterDecision | null>(() => {
    if (!currentSignals) return null;
    const decision = runArbiter(currentSignals);
    const validation = validateArbiterDecision(decision);
    if (!validation.valid) {
      console.warn('Arbiter validation failed:', validation.error);
    }
    return decision;
  }, [currentSignals]);

  // Sync phone tab and step whenever currentEvent changes (guided story mode)
  useEffect(() => {
    if (!currentEvent || !currentEvent.event_type) return;

    if (currentEvent.event_type === 'Recipient Added') {
      setActivePhoneTab('pay');
      setPayStep(1); // Payee step
    } else if (currentEvent.event_type === 'Payment Initiated') {
      setActivePhoneTab('pay');
      setPayStep(3); // Review & Protection Screen
    } else if (currentEvent.event_type === 'Payment Cancelled') {
      setActivePhoneTab('pay');
      setPayStep(4); // Outcome
    }
  }, [currentEvent.event_id, currentEvent.event_type]);

  // Fetch AI copy when payment/tier or payee enrollment is active
  const triggerAiGenerations = useCallback(async () => {
    if (!currentEvent) return;
    const isTargetEvent =
      currentEvent.event_type === 'Recipient Added' ||
      currentEvent.event_type === 'Payment Initiated';
    if (!isTargetEvent) return;
    setIsLoadingAi(true);

    const tier = currentDecision?.tier || 'QUARANTINE';
    const rail = currentEvent.payment_rail || 'P2P';
    const amount = currentEvent.amount || 1574.18;
    const citations = currentDecision?.citations || [
      'password_reset_recent',
      'Email Change',
      'Phone Change',
      'recipient_status (New)',
    ];

    try {
      const [gCopy, sAssist] = await Promise.all([
        fetchGuardianCopy({
          tier,
          amount,
          maskedPhone: maskPhone('(206) 555-4821'),
          lang: session.lang,
          rail,
        }),
        fetchStaffAssist({
          tier,
          amount,
          rail,
          maskedPrePhone: maskPhone('(206) 555-4821'),
          citations,
          isBranch: session.scenarioId === 'james_branch',
          eventNote: currentEvent.event_note,
        }),
      ]);
      setGuardianCopy(gCopy);
      setStaffAssist(sAssist);
    } catch (e) {
      console.warn('AI fetch error, using fallbacks:', e);
    } finally {
      setIsLoadingAi(false);
    }
  }, [currentEvent, currentDecision, session.lang, session.scenarioId]);

  useEffect(() => {
    if (
      currentEvent.event_type === 'Recipient Added' ||
      currentEvent.event_type === 'Payment Initiated'
    ) {
      triggerAiGenerations();
    }
  }, [currentEvent.event_id, currentEvent.event_type, triggerAiGenerations]);

  // Audit trail helper
  const addAuditEntry = (action: string, who: string, reason: string) => {
    const newEntry: AuditEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      who,
      what: action,
      reason,
      payment_id: currentEvent.payment_id || `P-${currentEvent.event_id}`,
    };
    setSession((prev) => ({
      ...prev,
      auditLog: [newEntry, ...prev.auditLog],
    }));
  };

  // Action Handlers
  const handleFreezeAndRecover = () => {
    setSession((prev) => ({
      ...prev,
      stepIndex: prev.scenarioId === 'sarah_ato' ? Math.max(prev.stepIndex, 8) : prev.stepIndex,
      memberActions: { ...prev.memberActions, frozen: true },
      staffActions: {
        ...prev.staffActions,
        stoppedPayments: Array.from(new Set([
          ...prev.staffActions.stoppedPayments,
          currentEvent.payment_id || 'P1003-007',
          'P1003-007',
          'P1003-008',
        ])),
        createdCases: Array.from(new Set([...prev.staffActions.createdCases, 'C-2026-1003'])),
      },
    }));
    addAuditEntry(
      'Account Frozen & Stop (ATO) Applied',
      'Member (Pre-Change Phone Check)',
      'Member confirmed unapproved credentials change and requested immediate rail freeze.'
    );
  };

  const handleConfirmLegitimate = () => {
    setSession((prev) => ({
      ...prev,
      memberActions: { ...prev.memberActions, fastPathRequested: false },
      staffActions: {
        ...prev.staffActions,
        releasedPayments: [...prev.staffActions.releasedPayments, currentEvent.payment_id || 'P1003-007'],
      },
    }));
    addAuditEntry(
      'Quarantine Payment Released',
      'Member Verified (In-Branch ID Check)',
      'Member verified identity with government photo ID at branch; approved contact updates.'
    );
  };

  const handleConfirmMoverYes = () => {
    setSession((prev) => ({
      ...prev,
      memberActions: { ...prev.memberActions, confirmedMover: true },
      staffActions: {
        ...prev.staffActions,
        releasedPayments: [...prev.staffActions.releasedPayments, currentEvent.payment_id || 'P1039-002'],
      },
    }));
    addAuditEntry(
      'LIGHT Tier One-Tap Authorized',
      'Member (Unchanged Primary Phone)',
      'Member tapped "Yes, this was me" in 8 seconds. Rent payment released to clearing.'
    );
  };

  const handleConfirmMoverNo = () => {
    setSession((prev) => ({
      ...prev,
      memberActions: { ...prev.memberActions, confirmedMover: false, frozen: true },
      staffActions: {
        ...prev.staffActions,
        stoppedPayments: [...prev.staffActions.stoppedPayments, currentEvent.payment_id || 'P1039-002'],
      },
    }));
    addAuditEntry(
      'LIGHT Tier Transfer Denied',
      'Member (Unchanged Primary Phone)',
      'Member tapped "No, this wasn\'t me". Rails frozen.'
    );
  };

  const handleJamesCancelWithdrawal = () => {
    setSession((prev) => ({
      ...prev,
      memberActions: { ...prev.memberActions, cancelledJames: true },
      staffActions: {
        ...prev.staffActions,
        stoppedPayments: [...prev.staffActions.stoppedPayments, 'P1004-001'],
      },
    }));
    addAuditEntry(
      'Cash Withdrawal Cancelled',
      'Member (In-Branch Teller Guidance)',
      'Member realized phone instruction was fraudulent imposter and cancelled $7,000 withdrawal.'
    );
  };

  const handleStaffStopATO = () => {
    setSession((prev) => ({
      ...prev,
      memberActions: { ...prev.memberActions, frozen: true },
      staffActions: {
        ...prev.staffActions,
        stoppedPayments: [...prev.staffActions.stoppedPayments, currentEvent.payment_id || 'P1003-007'],
      },
    }));
    addAuditEntry(
      'Stop Payment (ATO) Executed',
      'Fraud Analyst E-4819',
      'ATO signature confirmed: dual contact change + new payee P2P attempt. Unauthorized credentials terminated.'
    );
  };

  const handleStaffReleaseWithDualApproval = (
    approver1: string,
    approver2: string,
    reason: string
  ) => {
    setSession((prev) => ({
      ...prev,
      staffActions: {
        ...prev.staffActions,
        releasedPayments: [...prev.staffActions.releasedPayments, currentEvent.payment_id || 'P1003-007'],
      },
    }));
    addAuditEntry(
      'Dual-Staff Quarantine Release',
      `${approver1} & ${approver2}`,
      reason
    );
  };

  const handleStaffContactPreChangePhone = () => {
    addAuditEntry(
      'Outbound Call Dispatched',
      'Fraud Analyst E-4819',
      `Calling pre-change phone (${maskPhone('(206) 555-4821')}) with STAFF ASSIST verification script.`
    );
  };

  const handleStaffCreateCase = () => {
    setSession((prev) => ({
      ...prev,
      staffActions: {
        ...prev.staffActions,
        createdCases: [...prev.staffActions.createdCases, 'C-2026-1003'],
      },
    }));
    addAuditEntry(
      'Case Created (#C-2026-1003)',
      'Fraud Analyst E-4819',
      'Case assigned to Senior Investigator; evidence package compiled with observable timestamps.'
    );
  };

  const handleStaffRequestRecall = () => {
    setSession((prev) => ({
      ...prev,
      staffActions: {
        ...prev.staffActions,
        recallRequested: [...prev.staffActions.recallRequested, currentEvent.payment_id || 'P1003-007'],
      },
    }));
    addAuditEntry(
      'Network Recall & ACH Return Transmitted',
      'Operations Specialist E-1044',
      'Emergency indemnification wire notice dispatched to receiving depository institution.'
    );
  };

  const handleAddAssistedNote = (text: string) => {
    addAuditEntry('AssistedNote Added', 'E-4819 (Fraud Analyst)', text);
  };

  const handleRequestAtBranch = () => {
    setSession((prev) => ({
      ...prev,
      memberActions: { ...prev.memberActions, branchPriority: true },
    }));
    addAuditEntry(
      'Member Requested In-Branch Verification (PRIORITY)',
      'Member Self-Service (Sound Digital Banking)',
      'Member requested in-branch identity verification. Case marked BRANCH PRIORITY in branch & fraud operations queue.'
    );
  };

  const handleResetDemo = () => {
    clearSavedState();
    setSession({
      scenarioId: 'sarah_ato',
      stepIndex: 0,
      viewMode: 'member',
      lang: 'en',
      largeText: false,
      memberActions: {},
      staffActions: {
        releasedPayments: [],
        stoppedPayments: [],
        createdCases: [],
        recallRequested: [],
      },
      auditLog: [],
      validationErrors: [],
    });
    setActivePhoneTab('home');
    setPayStep(1);
    setCurrentScreen('story_picker');
  };

  // Staff queue items computed dynamically for all 3 personas
  const queueItems = useMemo<QueueItem[]>(() => {
    const list: QueueItem[] = [
      {
        paymentId: 'P1004-001',
        memberId: 'M1004',
        memberToken: tokenizeMemberId('M1004'),
        amount: 7000.0,
        rail: 'Cash',
        tier: 'NONE',
        reasonCode: 'IN_BRANCH_HIGH_RISK_CASH_WITHDRAWAL',
        reasonPlain: 'High-risk in-branch cash withdrawal attempt under active imposter coercion',
        timeLeft: 'In branch now',
        isAfterHours: false,
        isNextBusinessHours: false,
        branchPriority: true,
        existingRiskScore: 35,
        flaggedEvents: [
          { id: 'E1004-001', time: '11:30', type: 'Member Inquiry', detail: 'Inquired on daily cash limits & wire speed' },
          { id: 'E1004-002', time: '16:17', type: 'Payment Initiated', detail: 'In-branch $7,000 cash withdrawal attempt' },
        ],
        status: session.memberActions.cancelledJames || session.staffActions.stoppedPayments.includes('P1004-001')
          ? 'STOPPED'
          : 'HELD',
        timestamp: '2026-10-15 16:17:00',
      },
      {
        paymentId: 'P1003-007',
        memberId: 'M1003',
        memberToken: tokenizeMemberId('M1003'),
        amount: 1574.18,
        rail: 'P2P',
        tier: 'QUARANTINE',
        reasonCode: 'RESET_PLUS_EMAIL_PHONE_CHANGE_NEW_PAYEE',
        reasonPlain: 'Password reset + Email/Phone change + New Payee (enrolled 22:19)',
        timeLeft: '3h 38m',
        isAfterHours: true,
        isNextBusinessHours: true,
        branchPriority: !!session.memberActions.branchPriority,
        existingRiskScore: 84,
        flaggedEvents: [
          { id: 'E1', time: '22:09', type: 'Password Reset', detail: 'Mobile self-service reset' },
          { id: 'E2', time: '22:14', type: 'Email Change', detail: 'Notice to sarah.m****@email.com' },
          { id: 'E3', time: '22:15', type: 'Phone Change', detail: 'Attacker phone (555) 019-2834' },
          { id: 'E4', time: '22:19', type: 'Recipient Added', detail: 'New payee quick_transfer_p2p enrolled' },
        ],
        status: session.memberActions.frozen ||
        (session.scenarioId === 'sarah_ato' && session.stepIndex >= 8) ||
        session.staffActions.stoppedPayments.includes('P1003-007')
          ? 'STOPPED'
          : session.staffActions.releasedPayments.includes('P1003-007')
          ? 'RELEASED'
          : 'HELD',
        timestamp: '2026-10-15 22:22:00',
      },
      {
        paymentId: 'P1003-008',
        memberId: 'M1003',
        memberToken: tokenizeMemberId('M1003'),
        amount: 1432.15,
        rail: 'P2P',
        tier: 'QUARANTINE',
        reasonCode: 'HIGH_VELOCITY_DRAIN_UNCONFIRMED_PAYEE',
        reasonPlain: 'Second transfer in rapid succession (8m delta) to unconfirmed payee',
        timeLeft: '3h 46m',
        isAfterHours: true,
        isNextBusinessHours: true,
        branchPriority: !!session.memberActions.branchPriority,
        existingRiskScore: 89,
        flaggedEvents: [
          { id: 'E5', time: '22:19', type: 'Recipient Added', detail: 'Unconfirmed payee quick_transfer_p2p' },
          { id: 'E6', time: '22:22', type: 'Payment Initiated', detail: '1st P2P transfer ($1,574.18) blocked' },
          { id: 'E7', time: '22:30', type: 'Payment Initiated', detail: '2nd P2P transfer ($1,432.15) blocked' },
        ],
        status: session.memberActions.frozen ||
        (session.scenarioId === 'sarah_ato' && session.stepIndex >= 8) ||
        session.staffActions.stoppedPayments.includes('P1003-007') ||
        session.staffActions.stoppedPayments.includes('P1003-008')
          ? 'STOPPED'
          : 'HELD',
        timestamp: '2026-10-15 22:30:00',
      },
      {
        paymentId: 'P1039-002',
        memberId: 'M1039',
        memberToken: tokenizeMemberId('M1039'),
        amount: 4151.68,
        rail: 'ACH',
        tier: 'LIGHT',
        reasonCode: 'RESET_PLUS_ADDRESS_CHANGE_NEW_PAYEE',
        reasonPlain: 'Password reset + Address-only change + New Payee (Landlord)',
        timeLeft: '3h 59m',
        isAfterHours: false,
        isNextBusinessHours: false,
        branchPriority: false,
        existingRiskScore: 42,
        flaggedEvents: [
          { id: 'EM1', time: 'Oct 5, 14:15', type: 'Password Reset', detail: 'Web password reset' },
          { id: 'EM2', time: 'Oct 5, 14:28', type: 'Address Change', detail: '1420 5th Ave Seattle (Phone untouched)' },
          { id: 'EM3', time: 'Oct 6, 09:15', type: 'Recipient Added', detail: 'Belltown Properties LLC' },
        ],
        status: session.staffActions.releasedPayments.includes('P1039-002')
          ? 'RELEASED'
          : 'HELD',
        timestamp: '2026-10-06 09:20:00',
      },
    ];

    // If emergency scam report was submitted by member, create a prioritized case in queue
    if (session.memberActions.scamReported) {
      const memberLast4 = (scenarioDef.memberId.replace(/\D/g, '') || '1003').slice(-4);
      const isBranch = !!session.memberActions.branchPriority;
      const reportedCaseId = `C-2026-${memberLast4}`;

      // Only add if not already in list
      if (!list.some((item) => item.paymentId === reportedCaseId)) {
        list.unshift({
          paymentId: reportedCaseId,
          memberId: scenarioDef.memberId,
          memberToken: tokenizeMemberId(scenarioDef.memberId),
          amount: currentEvent.amount || (scenarioDef.memberId === 'M1003' ? 3006.33 : scenarioDef.memberId === 'M1039' ? 4151.68 : 7000.0),
          rail: currentEvent.payment_rail || (scenarioDef.memberId === 'M1004' ? 'Cash' : scenarioDef.memberId === 'M1039' ? 'ACH' : 'P2P'),
          tier: 'QUARANTINE',
          reasonCode: 'MEMBER_EMERGENCY_SCAM_REPORT',
          reasonPlain: `Member emergency scam report: ${isBranch ? 'In-branch visit planned (PRIORITY)' : 'Phone callback requested'}. Outgoing rails paused.`,
          timeLeft: isBranch ? 'Visiting branch now' : 'Callback requested',
          isAfterHours: false,
          isNextBusinessHours: false,
          branchPriority: isBranch,
          existingRiskScore: 95,
          flaggedEvents: [
            {
              id: `SCAM-${memberLast4}`,
              time: 'Now',
              type: 'Emergency Scam Reported',
              detail: `Member self-service report submitted (${isBranch ? 'Branch Priority' : 'Phone'})`,
            },
          ],
          status: 'HELD',
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Sort queue: branch priority at top
    return list.sort((a, b) => {
      if (a.branchPriority && !b.branchPriority) return -1;
      if (!a.branchPriority && b.branchPriority) return 1;
      return 0;
    });
  }, [session.staffActions, session.memberActions.branchPriority, session.memberActions.cancelledJames, session.memberActions.scamReported, scenarioDef.memberId, currentEvent.amount, currentEvent.payment_rail]);

  if (csvLoading) {
    return (
      <div className="min-h-screen bg-[#F4F8FA] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#0082CA] animate-spin mx-auto" />
          <h2 className="font-serif text-lg font-bold text-[#002D72]">
            Loading Sound Guardian Engine...
          </h2>
          <p className="text-xs text-[#5B6B7A]">
            Initializing deterministic Arbiter & parsing event dataset
          </p>
        </div>
      </div>
    );
  }

  if (csvError) {
    return (
      <div className="min-h-screen bg-[#F4F8FA] flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl border border-red-200 shadow-lg max-w-md text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
          <h2 className="font-serif text-lg font-bold text-red-700">Dataset Load Error</h2>
          <p className="text-xs text-[#5B6B7A]">{csvError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#002D72] text-white text-xs font-semibold rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallbackTitle="Sound Guardian Encountered an Issue"
      onReset={handleResetDemo}
      onReturnToStories={() => setCurrentScreen('story_picker')}
    >
      <div
        className={`min-h-screen bg-[#F4F8FA] text-[#1B2733] flex flex-col ${
          session.largeText ? 'text-[120%]' : ''
        }`}
      >
        {/* Slim Global Top Bar: "Sound Guardian" | Segmented toggle | EN/ES | Large text | AI pill */}
        <TopBar
          viewMode={session.viewMode}
          setViewMode={(m) => setSession((prev) => ({ ...prev, viewMode: m }))}
          lang={session.lang}
          setLang={(l) => setSession((prev) => ({ ...prev, lang: l }))}
          largeText={session.largeText}
          setLargeText={(b) => setSession((prev) => ({ ...prev, largeText: b }))}
          aiStatus={aiStatus}
          onChooseStory={() => setCurrentScreen('story_picker')}
          onResetDemo={handleResetDemo}
          onOpenAbout={() => setIsAboutOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-1.5 sm:py-2 flex flex-col justify-start">
          {/* ================= SCREEN 1: CHOOSE A STORY (START SCREEN) ================= */}
          {currentScreen === 'story_picker' ? (
            <ChooseStoryScreen
              onSelectAndStart={(id) => {
                setSession((prev) => ({
                  ...prev,
                  scenarioId: id,
                  stepIndex: 0,
                }));
                setActivePhoneTab('home');
                setPayStep(1);
                setCurrentScreen('app');
              }}
              onResetDemo={handleResetDemo}
              lang={session.lang}
            />
          ) : (
            /* ================= SCREEN 2: APPLICATION MAIN FLOW ================= */
            <div className="flex-1 flex flex-col justify-start">
              {session.viewMode === 'member' ? (
                /* MEMBER APP: Phone-sized frame with bottom tabs + Guided story bar */
                <div className="flex flex-col items-center justify-center py-0.5 sm:py-1 animate-in fade-in duration-150">
                  <PhoneApp
                    scenarioId={session.scenarioId}
                    events={memberEvents}
                    currentEvent={currentEvent}
                    decision={currentDecision}
                    signals={currentSignals}
                    lang={session.lang}
                    largeText={session.largeText}
                    memberActions={session.memberActions}
                    onFreezeAndRecover={handleFreezeAndRecover}
                    onConfirmLegitimate={handleConfirmLegitimate}
                    onConfirmMoverYes={handleConfirmMoverYes}
                    onConfirmMoverNo={handleConfirmMoverNo}
                    onOpenScamModal={() => setIsScamModalOpen(true)}
                    onRequestAtBranch={handleRequestAtBranch}
                    onRequestFastPath={() =>
                      setSession((prev) => ({
                        ...prev,
                        memberActions: {
                          ...prev.memberActions,
                          fastPathRequested: !prev.memberActions.fastPathRequested,
                        },
                      }))
                    }
                    onSwitchToStaffConsole={(tab) => {
                      setSession((prev) => ({ ...prev, viewMode: 'staff' }));
                      if (tab) setStaffInitialTab(tab);
                    }}
                    onReturnToStories={() => setCurrentScreen('story_picker')}
                    activeTab={activePhoneTab}
                    setActiveTab={setActivePhoneTab}
                    payStep={payStep}
                    setPayStep={setPayStep}
                  />

                  {/* Guided story mode bar under the phone */}
                  <GuidedStoryBar
                    currentIndex={session.stepIndex}
                    totalSteps={memberEvents.length}
                    eventTitle={currentEvent.event_type || 'Event'}
                    canPrev={session.stepIndex > 0}
                    canNext={session.stepIndex < memberEvents.length - 1}
                    onPrev={() =>
                      setSession((prev) => ({
                        ...prev,
                        stepIndex: Math.max(0, prev.stepIndex - 1),
                      }))
                    }
                    onNext={() =>
                      setSession((prev) => ({
                        ...prev,
                        stepIndex: Math.min(memberEvents.length - 1, prev.stepIndex + 1),
                      }))
                    }
                    onReturnToStories={() => setCurrentScreen('story_picker')}
                    lang={session.lang}
                  />
                </div>
              ) : (
                /* STAFF CONSOLE: Dashboard · Cases · Branch mode · Evidence & Data */
                <div className="animate-in fade-in duration-150 pb-8">
                  <StaffConsole
                    queueItems={queueItems}
                    allEvents={allEvents}
                    currentEvent={currentEvent}
                    decision={currentDecision}
                    signals={currentSignals}
                    staffAssist={staffAssist}
                    isLoadingAi={isLoadingAi}
                    onRefreshAi={triggerAiGenerations}
                    auditLog={session.auditLog}
                    onActionStopATO={handleStaffStopATO}
                    onActionReleaseQuarantine={handleStaffReleaseWithDualApproval}
                    onActionContactPreChangePhone={handleStaffContactPreChangePhone}
                    onActionCreateCase={handleStaffCreateCase}
                    onActionRequestRecall={handleStaffRequestRecall}
                    onAddAssistedNote={handleAddAssistedNote}
                    isStopped={session.staffActions.stoppedPayments.includes(
                      currentEvent.payment_id || 'P1003-007'
                    )}
                    isReleased={session.staffActions.releasedPayments.includes(
                      currentEvent.payment_id || 'P1003-007'
                    )}
                    isCaseCreated={
                      session.staffActions.createdCases.includes('C-2026-1003') ||
                      (session.scenarioId === 'sarah_ato' && session.stepIndex >= 8) ||
                      !!session.memberActions.frozen
                    }
                    isRecallRequested={session.staffActions.recallRequested.includes(
                      currentEvent.payment_id || 'P1003-007'
                    )}
                    scenarioId={session.scenarioId}
                    isJamesCancelled={!!session.memberActions.cancelledJames}
                    onJamesCancelWithdrawal={handleJamesCancelWithdrawal}
                    onJamesProceed={() =>
                      addAuditEntry(
                        'Member Overrode Inquiry',
                        'Tacoma Branch Teller #3',
                        'Member insisted on cash withdrawal despite teller inquiry.'
                      )
                    }
                    onTellerAskQuestion={() =>
                      addAuditEntry(
                        'Teller Security Question Posed',
                        'Tacoma Branch Teller #3',
                        'Teller asked: "Has anyone told you to keep this secret or to stay on the phone?"'
                      )
                    }
                    onOpenScamReport={() => setIsScamModalOpen(true)}
                    onReturnToStories={() => setCurrentScreen('story_picker')}
                    initialTab={staffInitialTab}
                    lang={session.lang}
                  />
                </div>
              )}
            </div>
          )}
        </main>

        {/* Collapsible "Why did this happen?" Drawer (Closed by default) */}
        {currentScreen === 'app' && (
          <WhyDrawer
            currentEvent={currentEvent}
            signals={currentSignals}
            decision={currentDecision}
            isOpen={isWhyDrawerOpen}
            onToggle={() => setIsWhyDrawerOpen(!isWhyDrawerOpen)}
            lang={session.lang}
          />
        )}

        {/* Slim Authentic SCU Footer */}
        <SCUFooter onOpenAbout={() => setIsAboutOpen(true)} />

        {/* Modals */}
        <AboutDataModal
          isOpen={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
        />

        <ScamReportModal
          isOpen={isScamModalOpen}
          onClose={() => setIsScamModalOpen(false)}
          lang={session.lang}
          memberId={scenarioDef.memberId}
          recentPayments={memberEvents}
          onSubmitReport={({ reason, description, selectedPaymentIds, contactMethod, memberLast4 }) => {
            const isBranch = contactMethod === 'branch';
            setSession((prev) => ({
              ...prev,
              memberActions: {
                ...prev.memberActions,
                scamReported: true,
                frozen: true,
                branchPriority: isBranch ? true : prev.memberActions.branchPriority,
              },
              staffActions: {
                ...prev.staffActions,
                createdCases: [...prev.staffActions.createdCases, `C-2026-${memberLast4}`],
                recallRequested: [...prev.staffActions.recallRequested, `RECALL-C-2026-${memberLast4}`],
              },
            }));
            addAuditEntry(
              'Emergency Scam Report Submitted',
              'Member Self-Service (Scam Report)',
              `Member reported scam: "${reason}". Details: ${description || 'None'}. Payments: ${selectedPaymentIds.join(', ')}. Reach via: ${isBranch ? 'Visit a branch (PRIORITY)' : 'Phone callback'}. Rails paused, case #C-2026-${memberLast4} opened.`
            );
          }}
        />
      </div>
    </ErrorBoundary>
  );
}
