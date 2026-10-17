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
import { ScenarioPicker, SCENARIOS } from './components/ScenarioPicker.tsx';
import { JourneyTimeline } from './components/JourneyTimeline.tsx';
import { ComparisonCallout } from './components/ComparisonCallout.tsx';
import { EvidencePanel } from './components/EvidencePanel.tsx';
import { AccountHome } from './components/MemberView/AccountHome.tsx';
import { ScamReportModal } from './components/MemberView/ScamReportModal.tsx';
import { MetricsStrip } from './components/StaffView/MetricsStrip.tsx';
import { StaffQueue, QueueItem } from './components/StaffView/StaffQueue.tsx';
import { CaseDetail } from './components/StaffView/CaseDetail.tsx';
import { BranchMode } from './components/StaffView/BranchMode.tsx';
import { AboutDataModal } from './components/AboutDataModal.tsx';
import { SCUFooter } from './components/SCUFooter.tsx';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // Master Event List from CSV
  const [allEvents, setAllEvents] = useState<DemoEvent[]>([]);
  const [csvLoading, setCsvLoading] = useState(true);
  const [csvError, setCsvError] = useState<string | null>(null);

  // Orchestrator Persistent Session State
  const [session, setSession] = useState<OrchestratorState>(() => loadSavedState());

  // AI Service Status
  const [aiStatus, setAiStatus] = useState<{
    aiStatus: 'live' | 'offline';
    provider: string;
    model: string;
  }>({
    aiStatus: 'offline',
    provider: 'none',
    model: 'deterministic_templates',
  });

  // Replay Controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Modals & Panels
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isScamModalOpen, setIsScamModalOpen] = useState(false);
  const [isBranchConsoleTab, setIsBranchConsoleTab] = useState(false);
  const [showEvidence, setShowEvidence] = useState(true);

  // AI Content State
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

  // Filter events for the current active scenario
  const scenarioDef = useMemo(() => {
    return (
      SCENARIOS.find((s) => s.id === session.scenarioId) || SCENARIOS[0]
    );
  }, [session.scenarioId]);

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

  // Compute Sentry Signals strictly on payee enrollment and outgoing payment events
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

  // Deterministic Arbiter rules engine (No LLM in decision)
  const currentDecision = useMemo<ArbiterDecision | null>(() => {
    if (!currentSignals) return null;
    const decision = runArbiter(currentSignals);
    const validation = validateArbiterDecision(decision);
    if (!validation.valid) {
      console.warn('Arbiter validation failed:', validation.error);
    }
    return decision;
  }, [currentSignals]);

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

  // Add an entry to the immutable audit trail
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

  // Actions for Sarah ATO
  const handleFreezeAndRecover = () => {
    setSession((prev) => ({
      ...prev,
      memberActions: { ...prev.memberActions, frozen: true },
      staffActions: {
        ...prev.staffActions,
        stoppedPayments: [...prev.staffActions.stoppedPayments, currentEvent.payment_id || 'P1003-007'],
        createdCases: [...prev.staffActions.createdCases, 'C-2026-1003'],
      },
    }));
    addAuditEntry(
      'Account Frozen & Stop (ATO) Applied',
      'Member (Pre-Change Phone Verification)',
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

  // Actions for M1039 Mover
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

  // Actions for James M1004
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

  // Staff Action Handlers
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
    const newNote: AssistedNote = {
      id: `NOTE-${Date.now()}`,
      author: 'E-4819 (Fraud Analyst)',
      channel: 'Console',
      timestamp: new Date().toLocaleTimeString(),
      text,
    };
    setSession((prev) => ({
      ...prev,
      auditLog: [
        {
          id: `AUD-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          who: 'E-4819 (Fraud Analyst)',
          what: 'AssistedNote Added',
          reason: text,
          payment_id: currentEvent.payment_id || 'P1003-007',
        },
        ...prev.auditLog,
      ],
    }));
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

  // Reset Demo handler
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
    setIsPlaying(false);
  };

  // Dynamic Queue Items for Staff Queue
  const queueItems = useMemo<QueueItem[]>(() => {
    return [
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
        isAfterHours: true, // 10:22 PM is after 8 PM
        isNextBusinessHours: true,
        branchPriority: !!session.memberActions.branchPriority,
        existingRiskScore: 84,
        flaggedEvents: [
          { id: 'E1', time: '22:09', type: 'Password Reset', detail: 'Mobile self-service reset' },
          { id: 'E2', time: '22:14', type: 'Email Change', detail: 'Notice to sarah.m****@email.com' },
          { id: 'E3', time: '22:15', type: 'Phone Change', detail: 'Attacker phone (555) 019-2834' },
          { id: 'E4', time: '22:19', type: 'Recipient Added', detail: 'New payee quick_transfer_p2p enrolled' },
        ],
        status: session.staffActions.stoppedPayments.includes('P1003-007')
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
        status: session.staffActions.stoppedPayments.includes('P1003-007')
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
  }, [session.staffActions, session.memberActions.branchPriority]);

  // Compute metrics dynamically from queue & replay
  const heldCount = queueItems.filter((q) => q.status === 'HELD').length;
  const dollarsPaused = queueItems
    .filter((q) => q.status !== 'RELEASED')
    .reduce((sum, item) => sum + item.amount, 0);

  if (csvLoading) {
    return (
      <div className="min-h-screen bg-[#F4F8FA] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#0082CA] animate-spin mx-auto" />
          <h2 className="font-serif text-lg font-bold text-[#002D72]">
            Loading Sound Guardian Engine...
          </h2>
          <p className="text-xs text-[#5B6B7A]">
            Parsing synthetic event stream & initializing deterministic Arbiter
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
    <div
      className={`min-h-screen bg-[#F4F8FA] text-[#1B2733] flex flex-col ${
        session.largeText ? 'text-[120%]' : ''
      }`}
    >
      {/* Top Bar with Wordmark, Toggles, and AI status */}
      <TopBar
        viewMode={session.viewMode}
        setViewMode={(m) => setSession((prev) => ({ ...prev, viewMode: m }))}
        lang={session.lang}
        setLang={(l) => setSession((prev) => ({ ...prev, lang: l }))}
        largeText={session.largeText}
        setLargeText={(b) => setSession((prev) => ({ ...prev, largeText: b }))}
        aiStatus={aiStatus}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenHelp={() => setIsAboutOpen(true)}
        memberToken={tokenizeMemberId(scenarioDef.memberId)}
        showEvidence={showEvidence}
        onToggleEvidence={() => setShowEvidence((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Scenario Picker */}
        <ScenarioPicker
          currentScenarioId={session.scenarioId}
          onSelectScenario={(id) => {
            setSession((prev) => ({
              ...prev,
              scenarioId: id,
              stepIndex: 0,
            }));
            setIsPlaying(false);
          }}
          onResetDemo={handleResetDemo}
        />

        {/* Evidence Panel (Sound Team Feedback: 12/12 ATO caught, 0/104 false positives) */}
        {showEvidence && (
          <EvidencePanel
            isOpen={showEvidence}
            onClose={() => setShowEvidence(false)}
          />
        )}

        {/* Outcome Impact Callout (Illustration comparison) */}
        <ComparisonCallout
          originalOutcome={scenarioDef.originalOutcome}
          guardianOutcome={scenarioDef.guardianOutcome}
          dollarsAtRisk={session.scenarioId === 'sarah_ato' ? 3006.33 : session.scenarioId === 'james_branch' ? 7000.0 : 0}
          dollarsSaved={session.scenarioId === 'sarah_ato' ? 3006.33 : session.scenarioId === 'james_branch' ? 7000.0 : 4151.68}
        />

        {/* Journey Timeline Replay Engine with embedded StepExplainer */}
        <JourneyTimeline
          events={memberEvents}
          currentIndex={session.stepIndex}
          onSelectIndex={(idx) =>
            setSession((prev) => ({ ...prev, stepIndex: idx }))
          }
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          speed={speed}
          setSpeed={setSpeed}
          currentSignals={currentSignals}
          currentDecision={currentDecision}
          scenarioId={session.scenarioId}
        />

        {/* Dynamic View Body */}
        {session.viewMode === 'member' ? (
          /* Member View: Sound Digital Banking */
          <div className="animate-in fade-in duration-150">
            <AccountHome
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
              onRequestHelp={() => setIsScamModalOpen(true)}
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
            />
          </div>
        ) : (
          /* Staff View: Fraud & Branch Console */
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Operational Metrics Strip */}
            <MetricsStrip
              allEvents={allEvents}
              heldCount={heldCount}
              dollarsPaused={dollarsPaused}
            />

            {/* If in James Scenario, toggle between Queue or Branch Mode */}
            {session.scenarioId === 'james_branch' && (
              <div className="bg-white p-3 rounded-xl border border-[#D0D9E2] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#002D72]">
                  Viewing Imposter Scam Scenario (James M1004)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsBranchConsoleTab(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                      !isBranchConsoleTab
                        ? 'bg-[#002D72] text-white'
                        : 'bg-[#F4F8FA] border border-[#D0D9E2] text-[#1B2733]'
                    }`}
                  >
                    Fraud Queue View
                  </button>
                  <button
                    onClick={() => setIsBranchConsoleTab(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                      isBranchConsoleTab
                        ? 'bg-[#002D72] text-white'
                        : 'bg-[#F4F8FA] border border-[#D0D9E2] text-[#1B2733]'
                    }`}
                  >
                    Branch Teller In-Person Mode
                  </button>
                </div>
              </div>
            )}

            {isBranchConsoleTab && session.scenarioId === 'james_branch' ? (
              <BranchMode
                memberId={scenarioDef.memberId}
                isCancelled={!!session.memberActions.cancelledJames}
                onTellerAskQuestion={() =>
                  addAuditEntry(
                    'Teller Security Question Posed',
                    'Tacoma Branch Teller #3',
                    'Teller asked: "Has anyone told you to keep this secret or to stay on the phone?"'
                  )
                }
                onMemberCancelWithdrawal={handleJamesCancelWithdrawal}
                onMemberProceed={() =>
                  addAuditEntry(
                    'Member Overrode Inquiry',
                    'Tacoma Branch Teller #3',
                    'Member insisted on cash withdrawal despite teller inquiry.'
                  )
                }
                onOpenScamReport={() => setIsScamModalOpen(true)}
              />
            ) : (
              <>
                {/* Staff Queue */}
                <StaffQueue
                  queueItems={queueItems}
                  selectedPaymentId={currentEvent.payment_id || 'P1003-007'}
                  onSelectPayment={(pid) => {
                    // Jump to that event step
                    const matchIdx = memberEvents.findIndex(
                      (e) => e.payment_id === pid
                    );
                    if (matchIdx >= 0) {
                      setSession((prev) => ({ ...prev, stepIndex: matchIdx }));
                    }
                  }}
                />

                {/* Case Detail Terminal */}
                <CaseDetail
                  currentEvent={currentEvent}
                  decision={currentDecision}
                  signals={currentSignals}
                  allMemberEvents={memberEvents}
                  staffAssist={staffAssist}
                  isLoadingAi={isLoadingAi}
                  onRefreshAi={triggerAiGenerations}
                  assistedNotes={[
                    {
                      id: 'N1',
                      author: 'Contact Center Specialist',
                      channel: 'Inquiry',
                      timestamp: 'Oct 14, 11:30 AM',
                      text: 'Member called inquiring about daily withdrawal limits and wire delivery speeds. Sounded hurried.',
                    },
                    {
                      id: 'N2',
                      author: 'Sound Guardian System',
                      channel: 'Automated Rule',
                      timestamp: 'Oct 15, 10:22 PM',
                      text: 'Quarantine pause engaged before network submit. Confirmation dispatched to pre-change phone.',
                    },
                  ]}
                  onAddAssistedNote={handleAddAssistedNote}
                  auditTrail={session.auditLog}
                  onActionStopATO={handleStaffStopATO}
                  onActionReleaseQuarantine={handleStaffReleaseWithDualApproval}
                  onActionContactPreChangePhone={handleStaffContactPreChangePhone}
                  onActionCreateCase={handleStaffCreateCase}
                  onActionRequestRecall={handleStaffRequestRecall}
                  isStopped={session.staffActions.stoppedPayments.includes(
                    currentEvent.payment_id || 'P1003-007'
                  )}
                  isReleased={session.staffActions.releasedPayments.includes(
                    currentEvent.payment_id || 'P1003-007'
                  )}
                  isCaseCreated={session.staffActions.createdCases.includes('C-2026-1003')}
                  isRecallRequested={session.staffActions.recallRequested.includes(
                    currentEvent.payment_id || 'P1003-007'
                  )}
                />
              </>
            )}
          </div>
        )}
      </main>

      {/* Authentic Sound Credit Union Footer with Disclosures & Branches */}
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
        onSubmitReport={({ description, rail, amount }) => {
          setSession((prev) => ({
            ...prev,
            memberActions: {
              ...prev.memberActions,
              scamReported: true,
              frozen: true,
            },
            staffActions: {
              ...prev.staffActions,
              createdCases: [...prev.staffActions.createdCases, 'C-2026-EMERGENCY'],
              recallRequested: [...prev.staffActions.recallRequested, 'RECALL-EMERGENCY'],
            },
          }));
          addAuditEntry(
            'Emergency Scam Report Submitted',
            'Member Self-Service',
            `Member reported scam: ${description || 'Unspecified'}. Rail: ${rail}, Amount: $${amount || '0'}. Rails frozen, recall dispatched, callback scheduled.`
          );
        }}
        isReported={!!session.memberActions.scamReported}
        caseId="C-2026-9812"
      />
    </div>
  );
}
