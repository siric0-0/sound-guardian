import React, { useState, useMemo } from 'react';
import {
  DemoEvent,
  ArbiterDecision,
  SentrySignals,
  AuditEntry,
  AssistedNote,
  ScenarioId,
} from '../../types.ts';
import { QueueItem } from './StaffQueue.tsx';
import { TierBadge } from '../TierBadge.tsx';
import { TwoStaffApprovalModal } from './TwoStaffApprovalModal.tsx';
import { EvidencePanel } from '../EvidencePanel.tsx';
import { maskPhone, maskAccount, tokenizeMemberId } from '../../lib/tokenization.ts';
import { StaffAssistResponse } from '../../lib/api.ts';
import {
  LayoutDashboard,
  FolderOpen,
  Building2,
  Database,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Clock,
  ArrowRight,
  ArrowLeft,
  Moon,
  Phone,
  PhoneCall,
  CheckCircle2,
  Lock,
  Sparkles,
  RefreshCw,
  FileText,
  AlertTriangle,
  UserCheck,
  Home,
  Download,
} from 'lucide-react';
import rulesConfig from '../../config/rules.config.json';

interface StaffConsoleProps {
  queueItems: QueueItem[];
  allEvents: DemoEvent[];
  currentEvent: DemoEvent;
  decision?: ArbiterDecision | null;
  signals?: SentrySignals | null;
  staffAssist?: StaffAssistResponse | null;
  isLoadingAi: boolean;
  onRefreshAi: () => void;
  auditLog: AuditEntry[];
  onActionStopATO: () => void;
  onActionReleaseQuarantine: (approver1: string, approver2: string, reason: string) => void;
  onActionContactPreChangePhone: () => void;
  onActionCreateCase: () => void;
  onActionRequestRecall: () => void;
  onAddAssistedNote: (text: string) => void;
  isStopped: boolean;
  isReleased: boolean;
  isCaseCreated: boolean;
  isRecallRequested: boolean;
  scenarioId: ScenarioId;
  isJamesCancelled: boolean;
  onJamesCancelWithdrawal: () => void;
  onJamesProceed: () => void;
  onTellerAskQuestion: () => void;
  onOpenScamReport: () => void;
  onReturnToStories?: () => void;
  initialTab?: 'dashboard' | 'cases' | 'branch' | 'evidence';
  lang: 'en' | 'es';
}

export const StaffConsole: React.FC<StaffConsoleProps> = ({
  queueItems,
  allEvents,
  currentEvent,
  decision,
  signals,
  staffAssist,
  isLoadingAi,
  onRefreshAi,
  auditLog,
  onActionStopATO,
  onActionReleaseQuarantine,
  onActionContactPreChangePhone,
  onActionCreateCase,
  onActionRequestRecall,
  onAddAssistedNote,
  isStopped,
  isReleased,
  isCaseCreated,
  isRecallRequested,
  scenarioId,
  isJamesCancelled,
  onJamesCancelWithdrawal,
  onJamesProceed,
  onTellerAskQuestion,
  onOpenScamReport,
  onReturnToStories,
  initialTab = 'dashboard',
  lang,
}) => {
  const isEs = lang === 'es';
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cases' | 'branch' | 'evidence'>(initialTab);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [caseSubTab, setCaseSubTab] = useState<'summary' | 'timeline' | 'actions' | 'audit'>('summary');
  const [caseFilter, setCaseFilter] = useState<'ALL' | 'QUARANTINE' | 'LIGHT' | 'BRANCH' | 'RESOLVED'>('ALL');
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  // Compute KPI metrics from replay
  const heldCount = queueItems.filter((q) => q.status === 'HELD').length;
  const quarantineCount = queueItems.filter((q) => q.tier === 'QUARANTINE').length;
  const quickChecksCount = queueItems.filter((q) => q.tier === 'LIGHT').length;
  const dollarsProtected = queueItems
    .filter((q) => q.status !== 'RELEASED')
    .reduce((sum, item) => sum + item.amount, 0);
  const branchPriorityCount = queueItems.filter((q) => q.branchPriority).length;

  // Filter queue items for Cases tab
  const filteredCases = useMemo(() => {
    return queueItems.filter((item) => {
      if (caseFilter === 'QUARANTINE') return item.tier === 'QUARANTINE';
      if (caseFilter === 'LIGHT') return item.tier === 'LIGHT';
      if (caseFilter === 'BRANCH') return item.branchPriority;
      if (caseFilter === 'RESOLVED') return item.status === 'RELEASED' || item.status === 'STOPPED';
      return true;
    });
  }, [queueItems, caseFilter]);

  // Selected Case Object
  const activeCase = useMemo(() => {
    return queueItems.find((q) => q.paymentId === selectedCaseId) || queueItems[0] || {} as QueueItem;
  }, [queueItems, selectedCaseId]);

  const handleExportCaseJson = (caseItem: QueueItem) => {
    const caseId = caseItem.paymentId ? (caseItem.paymentId.startsWith('C-') ? caseItem.paymentId : `C-2026-${caseItem.memberId.replace('M', '')}`) : 'C-2026-1003';
    const relevantAudit = auditLog.filter(
      (a) =>
        a.case_id === caseItem.paymentId ||
        a.case_id === caseId ||
        a.case_id?.includes(caseItem.memberId.replace('M', '')) ||
        a.payment_id === caseItem.paymentId
    );

    const exportPayload = {
      case_id: caseId,
      exported_at: new Date().toISOString(),
      rule_version: rulesConfig.rule_version,
      member: {
        synthetic_member_id: caseItem.memberId,
        member_token: caseItem.memberToken,
      },
      payment: {
        payment_id: caseItem.paymentId,
        amount: caseItem.amount,
        rail: caseItem.rail,
        status: caseItem.status,
      },
      decision: {
        tier: caseItem.tier,
        reason_code: caseItem.reasonCode,
        reason_plain: caseItem.reasonPlain,
        hold_expires_at: caseItem.timeLeft,
      },
      signals: signals || null,
      flagged_events: caseItem.flaggedEvents || [],
      audit_trail: relevantAudit.length > 0 ? relevantAudit : auditLog,
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `case-${caseItem.memberId || 'export'}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Staff Console Tabs Header: Dashboard · Cases · Branch mode · Evidence & Data */}
      <div className="bg-white rounded-xl border border-[#D0D9E2] p-1.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setSelectedCaseId(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#002D72] text-white shadow-xs'
                : 'text-[#002D72] hover:bg-[#F4F8FA]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('cases')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'cases'
                ? 'bg-[#002D72] text-white shadow-xs'
                : 'text-[#002D72] hover:bg-[#F4F8FA]'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Cases ({queueItems.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('branch');
              setSelectedCaseId(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'branch'
                ? 'bg-[#002D72] text-white shadow-xs'
                : 'text-[#002D72] hover:bg-[#F4F8FA]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Branch mode</span>
            {scenarioId === 'james_branch' && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('evidence');
              setSelectedCaseId(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'evidence'
                ? 'bg-[#002D72] text-white shadow-xs'
                : 'text-[#002D72] hover:bg-[#F4F8FA]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Evidence & Data</span>
          </button>
        </div>

        <div className="flex items-center gap-3 pr-2 text-xs">
          {onReturnToStories && (
            <button
              onClick={onReturnToStories}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0082CA] hover:underline cursor-pointer"
            >
              <Home className="w-3 h-3" />
              <span>Return to stories</span>
            </button>
          )}
          <span className="hidden md:inline text-[#5B6B7A]">
            Analyst: <strong className="text-[#002D72]">E-4819</strong>
          </span>
        </div>
      </div>

      {/* ================= 1. DASHBOARD TAB ================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          {/* Row of 6 KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-[#D0D9E2] shadow-2xs">
              <span className="text-[11px] font-medium text-[#5B6B7A] block">Held Now</span>
              <div className="font-mono text-xl font-bold text-[#B42318] mt-0.5">{heldCount}</div>
              <span className="text-[10px] text-[#7A271A]">Pre-send paused</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#D0D9E2] shadow-2xs">
              <span className="text-[11px] font-medium text-[#5B6B7A] block">Quarantine</span>
              <div className="font-mono text-xl font-bold text-[#002D72] mt-0.5">{quarantineCount}</div>
              <span className="text-[10px] text-[#5B6B7A]">2-staff release</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#D0D9E2] shadow-2xs">
              <span className="text-[11px] font-medium text-[#5B6B7A] block">Quick Checks</span>
              <div className="font-mono text-xl font-bold text-[#B54708] mt-0.5">{quickChecksCount}</div>
              <span className="text-[10px] text-[#5B6B7A]">1-tap verified</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#D0D9E2] shadow-2xs">
              <span className="text-[11px] font-medium text-[#5B6B7A] block">$ Protected</span>
              <div className="font-mono text-xl font-bold text-[#067647] mt-0.5">
                ${dollarsProtected.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-[#054F31]">Zero dollars lost</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#D0D9E2] shadow-2xs">
              <span className="text-[11px] font-medium text-[#5B6B7A] block">Median Release</span>
              <div className="font-mono text-xl font-bold text-[#0082CA] mt-0.5">8 sec</div>
              <span className="text-[10px] text-[#5B6B7A]">Legit movers</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#D0D9E2] shadow-2xs">
              <span className="text-[11px] font-medium text-[#5B6B7A] block">Branch Priority</span>
              <div className="font-mono text-xl font-bold text-purple-700 mt-0.5">{branchPriorityCount}</div>
              <span className="text-[10px] text-purple-900">In-person flagged</span>
            </div>
          </div>

          {/* Compact "Needs Attention" Table (Max 5 rows) */}
          <div className="bg-white rounded-xl border border-[#D0D9E2] shadow-xs overflow-hidden">
            <div className="px-5 py-3 border-b border-[#D0D9E2] bg-[#F4F8FA] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-sm text-[#002D72]">
                  Needs Attention (Active Holds)
                </h3>
                <p className="text-[11px] text-[#5B6B7A]">
                  Branch requests pinned on top. Sorted by urgency and observable risk signals.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('cases')}
                className="text-xs font-semibold text-[#0082CA] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all cases</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto max-h-[360px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#D0D9E2] bg-white text-[#5B6B7A] font-semibold">
                    <th className="py-2.5 px-4">Member Token</th>
                    <th className="py-2.5 px-4">Amount & Rail</th>
                    <th className="py-2.5 px-4">Tier Badge</th>
                    <th className="py-2.5 px-4">Plain Reason</th>
                    <th className="py-2.5 px-4">Time Left</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D0D9E2]">
                  {queueItems.slice(0, 5).map((item) => (
                    <tr
                      key={item.paymentId}
                      className={`hover:bg-[#F4F8FA] transition-colors ${
                        item.branchPriority ? 'bg-purple-50/50' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#002D72]">{item.memberToken}</span>
                          {item.branchPriority && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
                              PRIORITY
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-[#1B2733]">
                        ${item.amount.toFixed(2)} <span className="text-[10px] text-[#5B6B7A]">({item.rail})</span>
                      </td>
                      <td className="py-3 px-4">
                        <TierBadge tier={item.tier} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-[#5B6B7A] max-w-[240px] truncate" title={item.reasonPlain}>
                        {item.reasonPlain}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-[#5B6B7A]">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.timeLeft}</span>
                          {item.isNextBusinessHours && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-medium">
                              Next business hours
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedCaseId(item.paymentId);
                            setActiveTab('cases');
                          }}
                          className="px-2.5 py-1 rounded bg-[#002D72] hover:bg-[#001D4A] text-white text-[11px] font-semibold cursor-pointer"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. CASES TAB (QUEUE + DETAIL PAGE) ================= */}
      {activeTab === 'cases' && (
        <div className="space-y-4">
          {!selectedCaseId ? (
            /* Queue Table View */
            <div className="bg-white rounded-xl border border-[#D0D9E2] shadow-xs overflow-hidden">
              {/* Filter Chips Bar */}
              <div className="p-3 border-b border-[#D0D9E2] bg-[#F4F8FA] flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-[#5B6B7A] mr-1">Filter:</span>
                  {(['ALL', 'QUARANTINE', 'LIGHT', 'BRANCH', 'RESOLVED'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setCaseFilter(f)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        caseFilter === f
                          ? 'bg-[#002D72] text-white'
                          : 'bg-white text-[#5B6B7A] border border-[#D0D9E2] hover:text-[#002D72]'
                      }`}
                    >
                      {f === 'ALL' ? 'All' : f === 'BRANCH' ? 'Branch Priority' : f === 'LIGHT' ? 'Quick check' : f.charAt(0) + f.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-[#5B6B7A]">
                  Showing {filteredCases.length} of {queueItems.length} cases
                </span>
              </div>

              {/* Cases Table */}
              <div className="overflow-x-auto max-h-[460px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#D0D9E2] bg-white text-[#5B6B7A] font-semibold">
                      <th className="py-3 px-4">Payment ID & Member</th>
                      <th className="py-3 px-4">Amount & Rail</th>
                      <th className="py-3 px-4">Tier</th>
                      <th className="py-3 px-4">Reason & Score</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D0D9E2]">
                    {filteredCases.map((item) => (
                      <tr
                        key={item.paymentId}
                        onClick={() => setSelectedCaseId(item.paymentId)}
                        className="hover:bg-[#F4F8FA] transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-[#002D72]">{item.paymentId}</div>
                          <div className="text-[11px] text-[#5B6B7A]">{item.memberToken}</div>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-[#1B2733]">
                          ${item.amount.toFixed(2)} <span className="text-[10px] text-[#5B6B7A]">({item.rail})</span>
                        </td>
                        <td className="py-3 px-4">
                          <TierBadge tier={item.tier} size="sm" />
                        </td>
                        <td className="py-3 px-4 max-w-[280px]">
                          <div className="truncate font-medium text-[#1B2733]" title={item.reasonPlain}>
                            {item.reasonPlain}
                          </div>
                          <div className="text-[10px] font-mono text-[#5B6B7A]">
                            Score: {item.existingRiskScore}/100 · {item.reasonCode}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'STOPPED'
                              ? 'bg-red-100 text-red-800'
                              : item.status === 'RELEASED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCaseId(item.paymentId);
                            }}
                            className="px-3 py-1 rounded bg-[#002D72] hover:bg-[#001D4A] text-white text-[11px] font-semibold cursor-pointer"
                          >
                            Open Case
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Case Detail Page */
            <div className="bg-white rounded-xl border border-[#D0D9E2] shadow-xs p-5 space-y-4">
              {/* Back to Cases Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#D0D9E2]">
                <button
                  onClick={() => setSelectedCaseId(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0082CA] hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to cases</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#002D72]">{activeCase.paymentId}</span>
                  <TierBadge tier={activeCase.tier} size="sm" />
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {activeCase.status}
                  </span>
                </div>
              </div>

              {/* Sub-tabs: Summary · Timeline · Actions · Audit log */}
              <div className="flex items-center gap-1.5 border-b border-[#D0D9E2] pb-2 text-xs font-semibold">
                <button
                  onClick={() => setCaseSubTab('summary')}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                    caseSubTab === 'summary' ? 'bg-[#002D72] text-white shadow-xs' : 'bg-white text-[#5B6B7A] hover:text-[#002D72]'
                  }`}
                >
                  Summary
                </button>
                <button
                  onClick={() => setCaseSubTab('timeline')}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                    caseSubTab === 'timeline' ? 'bg-[#002D72] text-white shadow-xs' : 'bg-white text-[#5B6B7A] hover:text-[#002D72]'
                  }`}
                >
                  Timeline ({activeCase.flaggedEvents?.length || 0})
                </button>
                <button
                  onClick={() => setCaseSubTab('actions')}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                    caseSubTab === 'actions' ? 'bg-[#002D72] text-white shadow-xs' : 'bg-white text-[#5B6B7A] hover:text-[#002D72]'
                  }`}
                >
                  Actions
                </button>
                <button
                  onClick={() => setCaseSubTab('audit')}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                    caseSubTab === 'audit' ? 'bg-[#002D72] text-white shadow-xs' : 'bg-white text-[#5B6B7A] hover:text-[#002D72]'
                  }`}
                >
                  Audit Log ({auditLog.length})
                </button>
              </div>

              {/* Sub-tab 1: Summary */}
              {caseSubTab === 'summary' && (
                <div className="space-y-4 text-xs">
                  {/* 3-Line Staff Assist Briefing */}
                  <div className="bg-[#F4F8FA] rounded-xl p-4 border border-[#D0D9E2] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#002D72] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#0082CA]" />
                        <span>Staff Assist Operational Briefing</span>
                      </span>
                      <span className="text-[10px] text-[#5B6B7A]">
                        {staffAssist?.is_live_ai ? 'Live AI Guided' : 'Template message · Decision unaffected'}
                      </span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-[#1B2733]">
                      {staffAssist?.summary ? (
                        staffAssist.summary.map((s, idx) => <li key={idx}>{s}</li>)
                      ) : (
                        <>
                          <li>ATO signature detected: password reset and contact change prior to high-ratio P2P transfer.</li>
                          <li>Payment intercepted prior to network submission; funds remain in member account.</li>
                          <li>Pre-change contact verification required before any release.</li>
                        </>
                      )}
                    </ul>
                  </div>

                  {/* Risk Score & Reason Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white p-3.5 rounded-xl border border-[#D0D9E2]">
                      <span className="text-[#5B6B7A] block text-[11px]">Legacy Risk Score vs Deterministic Reason</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-xl font-bold text-[#B42318]">{activeCase.existingRiskScore}/100</span>
                        <code className="text-[11px] font-mono bg-slate-100 text-[#002D72] px-2 py-0.5 rounded border border-slate-300">
                          {activeCase.reasonCode}
                        </code>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-[#D0D9E2]">
                      <span className="text-[#5B6B7A] block text-[11px]">Contact Channel Comparison</span>
                      <div className="mt-1 space-y-0.5 text-[11px]">
                        <div>Verified (90-Day Pre-change): <strong className="text-emerald-700 font-mono">•••-•••-4821</strong></div>
                        <div>Current Unverified: <strong className="text-[#B42318] font-mono">(555) 019-2834</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 2: Timeline (Flagged Events) */}
              {caseSubTab === 'timeline' && (
                <div className="space-y-3 text-xs">
                  <div className="text-[11px] text-[#5B6B7A]">
                    Observable causal chain of events triggering the rule:
                  </div>
                  <div className="border border-[#D0D9E2] rounded-xl divide-y divide-[#D0D9E2]">
                    {(activeCase.flaggedEvents || []).map((fe) => (
                      <div key={fe.id} className="p-3 flex items-center justify-between bg-white hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-slate-500 text-[11px]">{fe.time}</span>
                          <div>
                            <span className="font-bold text-[#002D72]">{fe.type}</span>
                            <p className="text-[11px] text-[#5B6B7A]">{fe.detail}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {fe.id}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab 3: Actions */}
              {caseSubTab === 'actions' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
                    <strong>Action Control Panel:</strong> Quarantined items require dual-staff authorization or in-branch verification.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={onActionStopATO}
                      className="p-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-300 text-red-900 font-semibold text-left flex items-start gap-2.5 cursor-pointer transition-colors"
                    >
                      <Lock className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                      <div>
                        <div>Stop Payment (ATO)</div>
                        <span className="text-[10px] text-red-700 font-normal">Apply stop and revoke unauthorized credentials</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setIsApprovalModalOpen(true)}
                      className="p-3 rounded-xl bg-green-50 hover:bg-green-100 border border-green-300 text-green-900 font-semibold text-left flex items-start gap-2.5 cursor-pointer transition-colors"
                    >
                      <UserCheck className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                      <div>
                        <div>Release Payment (2-Staff Approval)</div>
                        <span className="text-[10px] text-green-700 font-normal">Requires secondary employee sign-off</span>
                      </div>
                    </button>

                    <button
                      onClick={onActionContactPreChangePhone}
                      className="p-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-900 font-semibold text-left flex items-start gap-2.5 cursor-pointer transition-colors"
                    >
                      <PhoneCall className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                      <div>
                        <div>Call Pre-Change Phone</div>
                        <span className="text-[10px] text-sky-700 font-normal">Contact member on verified 90-day number</span>
                      </div>
                    </button>

                    <button
                      onClick={onActionCreateCase}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold text-left flex items-start gap-2.5 cursor-pointer transition-colors"
                    >
                      <FileText className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                      <div>
                        <div>Create Fraud Case (#C-2026-1003)</div>
                        <span className="text-[10px] text-slate-600 font-normal">Compile observable dossier for investigator</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Sub-tab 4: Audit Log */}
              {caseSubTab === 'audit' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#D0D9E2]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#002D72]">
                        Immutable Audit Trail ({auditLog.length})
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        v{rulesConfig.rule_version}
                      </span>
                    </div>
                    <button
                      onClick={() => handleExportCaseJson(activeCase)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#002D72] hover:bg-[#001D4A] text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                      title="Download complete case dossier in JSON format"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export case (JSON)</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[350px] overflow-y-auto">
                    {auditLog.length === 0 ? (
                      <div className="p-4 text-center text-[#5B6B7A] bg-[#F4F8FA] rounded-xl border border-[#D0D9E2] italic">
                        No audit events recorded yet for this session.
                      </div>
                    ) : (
                      auditLog.map((entry) => (
                        <div
                          key={entry.id}
                          className="p-3 rounded-xl bg-white border border-[#D0D9E2] hover:border-[#0082CA]/40 transition-colors space-y-1.5 shadow-2xs"
                        >
                          {/* Row 1: Actor Role, Action, Rule Version, Timestamp */}
                          <div className="flex items-center justify-between text-[11px] gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                                  entry.actor_role?.includes('ARBITER')
                                    ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                    : entry.actor_role?.includes('MEMBER')
                                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                    : 'bg-purple-100 text-purple-900 border border-purple-200'
                                }`}
                              >
                                {entry.actor_role || entry.who}
                              </span>
                              <span className="font-semibold text-[#002D72]">
                                {entry.action || entry.what}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 text-[#5B6B7A]">
                              <span className="font-mono text-[10px]">
                                {entry.rule_version ? `v${entry.rule_version}` : `v${rulesConfig.rule_version}`}
                              </span>
                              <span>·</span>
                              <span className="font-mono text-[10px]">
                                {entry.timestamp.includes('T')
                                  ? new Date(entry.timestamp).toLocaleTimeString()
                                  : entry.timestamp}
                              </span>
                            </div>
                          </div>

                          {/* Row 2: Case ID, Reason Code */}
                          <div className="flex items-center gap-2 flex-wrap text-[11px]">
                            <span className="text-[#5B6B7A]">Case ID:</span>
                            <span className="font-mono font-bold text-[#002D72] bg-slate-100 px-1.5 py-0.5 rounded">
                              {entry.case_id || entry.payment_id}
                            </span>
                            <span className="text-[#5B6B7A]">Reason Code:</span>
                            <code className="font-mono text-[10px] bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200">
                              {entry.reason_code || 'STAFF_ACTION'}
                            </code>
                          </div>

                          {/* Reason / Narrative */}
                          <p className="text-[11px] text-[#1B2733] leading-relaxed">
                            {entry.reason || entry.what}
                          </p>

                          {/* Source Event IDs */}
                          {entry.source_event_ids && entry.source_event_ids.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100 text-[10px] text-[#5B6B7A]">
                              <span>Source Events:</span>
                              {entry.source_event_ids.map((eid, idx) => (
                                <span
                                  key={idx}
                                  className="font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200"
                                >
                                  {eid}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= 3. BRANCH MODE (JAMES VIEW) ================= */}
      {activeTab === 'branch' && (
        <div className="bg-white rounded-xl border border-[#D0D9E2] shadow-xs p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#D0D9E2]">
            <div>
              <h3 className="font-serif font-bold text-base text-[#002D72] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0082CA]" />
                <span>Tacoma Branch Mode · Member James (M1004)</span>
              </h3>
              <p className="text-xs text-[#5B6B7A] mt-0.5">
                In-person teller assist protocol for active imposter/government coercion scams.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs">
              $7,000.00 Cash Request
            </span>
          </div>

          {/* Assisted Note from Contact Center */}
          <div className="bg-[#F4F8FA] rounded-xl p-4 border border-[#D0D9E2] space-y-1 text-xs">
            <span className="font-bold text-[#002D72]">Cross-Channel Context (Contact Center Note):</span>
            <p className="text-[#5B6B7A] italic">
              "Member called at 11:30 AM inquiring about daily cash withdrawal limits and wire arrival speed. Sounded hurried and anxious."
            </p>
          </div>

          {/* The Scam Question Card */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 text-amber-950 space-y-3">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
              Mandatory Branch Inquiry Script
            </span>
            <blockquote className="font-serif text-sm sm:text-base font-semibold italic text-[#002D72] leading-relaxed">
              "Mr. James, before we complete this cash withdrawal, our policy is to pause and ask one important question: Has anyone told you to keep this secret, stay on the phone, or transfer these funds to protect your money? We are here to protect you."
            </blockquote>
          </div>

          {/* Member-Decides Choice */}
          <div className="pt-2 space-y-3">
            <span className="text-xs font-bold text-[#002D72] block">Member Decision:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={onJamesCancelWithdrawal}
                className="p-4 rounded-xl bg-[#002D72] hover:bg-[#001D4A] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Member Cancels Withdrawal ($7,000 Saved)</span>
              </button>

              <button
                onClick={onJamesProceed}
                className="p-4 rounded-xl bg-white hover:bg-slate-50 border border-[#D0D9E2] text-[#5B6B7A] font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>Member Overrides & Proceeds</span>
              </button>
            </div>

            {isJamesCancelled && (
              <div className="p-3 bg-[#ECFDF3] border border-[#A6F4C5] rounded-lg text-xs text-[#054F31] font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#067647]" />
                <span>Withdrawal cancelled. Funds remained safe in James's account. Zero losses.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= 4. EVIDENCE & DATA TAB ================= */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <EvidencePanel isOpen={true} />
        </div>
      )}

      {/* Dual Staff Approval Modal */}
      <TwoStaffApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onConfirmRelease={(app1, app2, rsn) => {
          onActionReleaseQuarantine(app1, app2, rsn);
          setIsApprovalModalOpen(false);
        }}
        amount={activeCase.amount || 1574.18}
        paymentId={activeCase.paymentId || 'P1003-007'}
      />
    </div>
  );
};
