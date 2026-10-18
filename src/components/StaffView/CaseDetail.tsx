import React, { useState } from 'react';
import {
  ShieldAlert,
  Phone,
  PhoneCall,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  UserCheck,
  Send,
  Sparkles,
  RefreshCw,
  Clock,
  Lock,
  MessageSquare,
  Download,
} from 'lucide-react';
import rulesConfig from '../../config/rules.config.json';
import {
  DemoEvent,
  ArbiterDecision,
  SentrySignals,
  AuditEntry,
  AssistedNote,
} from '../../types.ts';
import { TierBadge } from '../TierBadge.tsx';
import { TwoStaffApprovalModal } from './TwoStaffApprovalModal.tsx';
import { maskPhone, maskAccount, tokenizeMemberId } from '../../lib/tokenization.ts';
import { StaffAssistResponse } from '../../lib/api.ts';

interface CaseDetailProps {
  currentEvent: DemoEvent;
  decision?: ArbiterDecision | null;
  signals?: SentrySignals | null;
  allMemberEvents: DemoEvent[];
  staffAssist?: StaffAssistResponse | null;
  isLoadingAi: boolean;
  onRefreshAi: () => void;
  assistedNotes: AssistedNote[];
  onAddAssistedNote: (text: string) => void;
  auditTrail: AuditEntry[];
  onActionStopATO: () => void;
  onActionReleaseQuarantine: (approver1: string, approver2: string, reason: string) => void;
  onActionContactPreChangePhone: () => void;
  onActionCreateCase: () => void;
  onActionRequestRecall: () => void;
  isStopped: boolean;
  isReleased: boolean;
  isCaseCreated: boolean;
  isRecallRequested: boolean;
}

export const CaseDetail: React.FC<CaseDetailProps> = ({
  currentEvent,
  decision,
  signals,
  allMemberEvents,
  staffAssist,
  isLoadingAi,
  onRefreshAi,
  assistedNotes,
  onAddAssistedNote,
  auditTrail,
  onActionStopATO,
  onActionReleaseQuarantine,
  onActionContactPreChangePhone,
  onActionCreateCase,
  onActionRequestRecall,
  isStopped,
  isReleased,
  isCaseCreated,
  isRecallRequested,
}) => {
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);

  const memberToken = tokenizeMemberId(currentEvent.synthetic_member_id);
  const isQuarantine = decision?.tier === 'QUARANTINE';

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    onAddAssistedNote(noteInput.trim());
    setNoteInput('');
  };

  const copyScriptToClipboard = () => {
    if (staffAssist?.script) {
      navigator.clipboard.writeText(staffAssist.script);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#D0D9E2] shadow-xs p-5 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D0D9E2]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-lg text-[#002D72]">
              Case Investigation & Action Terminal
            </h3>
            <span className="font-tabular font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-[#002D72] font-semibold">
              {memberToken}
            </span>
          </div>
          <p className="text-xs text-[#5B6B7A]">
            Payment ID: <span className="font-mono text-[#1B2733]">{decision?.payment_id || currentEvent.payment_id}</span> · Rail: <span className="font-semibold">{currentEvent.payment_rail}</span> · Amount: <span className="font-bold text-[#002D72]">${currentEvent.amount.toFixed(2)}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {decision && <TierBadge tier={decision.tier} size="lg" showDescription />}
        </div>
      </div>

      {/* Outcome Status Banners if stopped or released */}
      {isStopped && (
        <div className="bg-[#FEF3F2] border border-[#FECDCA] rounded-xl p-4 flex items-center gap-3 text-xs text-[#912018]">
          <XCircle className="w-5 h-5 text-[#B42318] shrink-0" />
          <div>
            <span className="font-bold">STOP (ATO) APPLIED: </span>
            This outgoing transaction was cancelled, unauthorized credentials terminated, and the member’s balance ($5,420.50) preserved in full.
          </div>
        </div>
      )}

      {isReleased && (
        <div className="bg-[#ECFDF3] border border-[#A6F4C5] rounded-xl p-4 flex items-center gap-3 text-xs text-[#067647]">
          <CheckCircle2 className="w-5 h-5 text-[#067647] shrink-0" />
          <div>
            <span className="font-bold">PAYMENT RELEASED: </span>
            Identity verified via dual-staff supervisor protocol. Payment released to clearing network.
          </div>
        </div>
      )}

      {/* Grid: Contact History Comparison & Signals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact History: Pre-change (verified) vs Current (unverified) */}
        <div className="bg-[#F4F8FA] rounded-xl border border-[#D0D9E2] p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#002D72] uppercase tracking-wide pb-1 border-b border-[#D0D9E2]">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#0082CA]" />
              <span>Contact History Audit</span>
            </span>
            <span className="text-[10px] text-[#5B6B7A]">Pre vs Post Change</span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Pre-Change Phone (Verified) */}
            <div className="bg-white p-3 rounded-lg border-2 border-emerald-500/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-800 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pre-Change Phone (VERIFIED RECORD)</span>
                </span>
                <span className="font-tabular font-mono text-emerald-900 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {maskPhone('(206) 555-4821')}
                </span>
              </div>
              <p className="text-[11px] text-[#5B6B7A]">
                On file for 3+ years prior to 10:15 PM incident. All Sound Guardian outbound confirmations route strictly here.
              </p>
            </div>

            {/* Current Phone (Unverified) */}
            <div className="bg-white p-3 rounded-lg border-2 border-red-400/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-red-800 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  <span>Current Account Phone (UNVERIFIED / ATTACKER)</span>
                </span>
                <span className="font-tabular font-mono text-red-900 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  {maskPhone('(555) 019-2834')}
                </span>
              </div>
              <p className="text-[11px] text-[#5B6B7A]">
                Changed at 10:15 PM (7 minutes prior to payment initiation). Intercept prevents step-up codes going here.
              </p>
            </div>
          </div>
        </div>

        {/* Signals & Citations */}
        <div className="bg-[#F4F8FA] rounded-xl border border-[#D0D9E2] p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#002D72] uppercase tracking-wide pb-1 border-b border-[#D0D9E2]">
            <span>Deterministic Arbiter Rules & Citations</span>
            <span className="text-[10px] text-[#5B6B7A]">No LLM In Decision</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-[#D0D9E2]">
              <span className="text-[#5B6B7A] block text-[11px]">Reason Code:</span>
              <span className="font-mono font-bold text-[#002D72] text-[11px]">
                {decision?.reason_code || 'RESET_PLUS_EMAIL_PHONE_CHANGE_NEW_PAYEE'}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-[#D0D9E2]">
              <span className="text-[#5B6B7A] block text-[11px]">Plain-Language Reason:</span>
              <p className="text-xs text-[#1B2733] mt-0.5 leading-relaxed">
                {decision?.reason_plain || 'Password reset accompanied by email and phone change prior to new payee transfer.'}
              </p>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-[#D0D9E2]">
              <span className="text-[#5B6B7A] block text-[11px] mb-1">Observable Field Citations:</span>
              <div className="flex flex-wrap gap-1">
                {(decision?.citations || [
                  'password_reset_recent',
                  'Email Change',
                  'Phone Change',
                  'recipient_status (New)',
                  'payment_rail (P2P)',
                ]).map((cit) => (
                  <span
                    key={cit}
                    className="font-mono text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200"
                  >
                    {cit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STAFF ASSIST: AI Script & 3-Line Case Summary */}
      <div className="bg-white rounded-xl border-2 border-[#0082CA]/40 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0082CA]" />
            <h4 className="font-serif font-bold text-sm text-[#002D72]">
              STAFF ASSIST (Operational Script & Case Summary)
            </h4>
          </div>

          <button
            onClick={onRefreshAi}
            disabled={isLoadingAi}
            className="inline-flex items-center gap-1 text-xs text-[#0082CA] hover:text-[#002D72] cursor-pointer disabled:opacity-50"
            title="Refresh explanation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
            <span>{isLoadingAi ? 'Generating...' : 'Refresh AI'}</span>
          </button>
        </div>

        {/* 3-Line Summary */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-[#1B2733]">3-Line Case Briefing:</div>
          <ul className="space-y-1 text-xs text-[#1B2733] list-disc list-inside bg-[#F4F8FA] p-3 rounded-lg border border-[#D0D9E2]">
            {(staffAssist?.summary || [
              `Account Takeover signature detected: Recent password reset and dual contact change (Email + Phone) prior to high-ratio P2P transfer ($${currentEvent.amount.toFixed(2)}).`,
              `Payment intercepted prior to network submission; funds remain safely in member account.`,
              `Citations: password_reset_recent, Email Change, Phone Change, recipient_status (New).`,
            ]).map((line, idx) => (
              <li key={idx} className="leading-relaxed">
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* Verbatim Script */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#1B2733] flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-[#067647]" />
              <span>Recommended Outbound Call Script (Read to Pre-Change Number):</span>
            </span>
            <button
              onClick={copyScriptToClipboard}
              className="text-[11px] text-[#0082CA] hover:underline cursor-pointer"
            >
              {copiedScript ? 'Copied to clipboard!' : 'Copy Script'}
            </button>
          </div>

          <blockquote className="bg-[#E1F0F8]/50 p-3.5 rounded-lg border border-[#0082CA]/30 text-xs font-serif text-[#002D72] leading-relaxed italic">
            "{staffAssist?.script ||
              `Hello, this is Sound Credit Union Fraud Prevention calling for our member. We paused an outgoing P2P payment of $${currentEvent.amount.toFixed(2)} requested after recent credentials and contact updates. We are verifying directly via your pre-change number (${maskPhone()}) to ensure your account security.`}"
          </blockquote>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-[#F4F8FA] rounded-xl border border-[#D0D9E2] p-4 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wide text-[#002D72]">
          Action Bar (Authorized Interventions)
        </h4>

        <div className="flex flex-wrap gap-2.5">
          {/* Stop (ATO) */}
          <button
            onClick={onActionStopATO}
            disabled={isStopped}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#B42318] hover:bg-[#912018] disabled:opacity-40 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Stop Payment (ATO)</span>
          </button>

          {/* Release (Requires 2-Staff Approval) */}
          <button
            onClick={() => setIsApprovalModalOpen(true)}
            disabled={isReleased || isStopped}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#067647] hover:bg-[#054F31] disabled:opacity-40 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Release (Dual-Staff Approval)</span>
          </button>

          {/* Contact via Pre-Change Number */}
          <button
            onClick={onActionContactPreChangePhone}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-[#002D72] border border-[#D0D9E2] text-xs font-medium transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#0082CA]" />
            <span>Call Pre-Change Phone ({maskPhone()})</span>
          </button>

          {/* Create Fraud Case */}
          <button
            onClick={onActionCreateCase}
            disabled={isCaseCreated}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-[#1B2733] border border-[#D0D9E2] text-xs font-medium transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-purple-600" />
            <span>{isCaseCreated ? 'Case Active (#C-2026-1003)' : 'Create Case'}</span>
          </button>

          {/* Request Recall / ACH Return */}
          <button
            onClick={onActionRequestRecall}
            disabled={isRecallRequested}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-[#1B2733] border border-[#D0D9E2] text-xs font-medium transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
            <span>{isRecallRequested ? 'Recall Requested' : 'Request Network Recall'}</span>
          </button>
        </div>
      </div>

      {/* AssistedNote Thread & Input */}
      <div className="bg-white rounded-xl border border-[#D0D9E2] p-4 space-y-3">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-[#D0D9E2]">
          <span className="font-bold text-[#002D72] flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#0082CA]" />
            <span>AssistedNotes (Human-Observed Cross-Channel Context)</span>
          </span>
          <span className="text-[11px] text-[#5B6B7A]">Shared across Contact Center & Branches</span>
        </div>

        {/* Existing notes */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {assistedNotes.map((note) => (
            <div
              key={note.id}
              className="bg-[#F4F8FA] p-3 rounded-lg border border-[#D0D9E2] text-xs space-y-1"
            >
              <div className="flex items-center justify-between text-[11px] text-[#5B6B7A]">
                <span className="font-semibold text-[#002D72]">
                  {note.author} ({note.channel})
                </span>
                <span className="font-tabular">{note.timestamp}</span>
              </div>
              <p className="text-[#1B2733] leading-relaxed">{note.text}</p>
            </div>
          ))}
        </div>

        {/* Add Note Input */}
        <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
          <input
            type="text"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Add operational note (e.g. Member confirmed phone change at branch)..."
            className="flex-1 text-xs p-2 rounded-lg border border-[#D0D9E2] bg-white text-[#1B2733]"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-lg bg-[#002D72] hover:bg-[#1F4A8C] text-white text-xs font-semibold cursor-pointer"
          >
            Add Note
          </button>
        </form>
      </div>

      {/* Audit Trail Log */}
      <div className="bg-white rounded-xl border border-[#D0D9E2] p-4 space-y-3">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-[#D0D9E2]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#002D72]">Immutable Audit Trail ({auditTrail.length})</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              v{rulesConfig.rule_version}
            </span>
          </div>
          <button
            onClick={() => {
              const exportPayload = {
                case_id: decision?.payment_id || currentEvent.payment_id || `C-2026-${currentEvent.synthetic_member_id.replace('M', '')}`,
                exported_at: new Date().toISOString(),
                rule_version: rulesConfig.rule_version,
                member: {
                  synthetic_member_id: currentEvent.synthetic_member_id,
                  member_token: memberToken,
                },
                payment: {
                  payment_id: currentEvent.payment_id,
                  amount: currentEvent.amount,
                  rail: currentEvent.payment_rail,
                },
                decision: decision || null,
                signals: signals || null,
                audit_trail: auditTrail,
              };
              const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
                type: 'application/json',
              });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `case-${currentEvent.synthetic_member_id || 'export'}-${Date.now()}.json`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#002D72] hover:bg-[#001D4A] text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export case (JSON)</span>
          </button>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto text-[11px]">
          {auditTrail.length === 0 ? (
            <span className="text-[#5B6B7A] italic">No manual actions taken yet for this session.</span>
          ) : (
            auditTrail.map((entry) => (
              <div
                key={entry.id}
                className="p-2.5 rounded-lg bg-[#F4F8FA] border border-[#D0D9E2] space-y-1"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold font-mono px-1.5 py-0.2 rounded bg-slate-200 text-[#002D72]">
                      {entry.actor_role || entry.who}
                    </span>
                    <span className="font-semibold text-[#002D72]">
                      {entry.action || entry.what}
                    </span>
                  </div>
                  <span className="font-mono text-[#5B6B7A]">
                    {entry.timestamp.includes('T') ? new Date(entry.timestamp).toLocaleTimeString() : entry.timestamp}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#5B6B7A]">
                  <span>Case: <strong className="font-mono text-[#002D72]">{entry.case_id || entry.payment_id}</strong></span>
                  <span>Reason Code: <code className="font-mono bg-white px-1 rounded border border-slate-200">{entry.reason_code || 'STAFF_ACTION'}</code></span>
                </div>
                <p className="text-[#1B2733] text-[11px] leading-tight">{entry.reason || entry.what}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dual Staff Release Modal */}
      <TwoStaffApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onConfirmRelease={(app1, app2, reason) => {
          setIsApprovalModalOpen(false);
          onActionReleaseQuarantine(app1, app2, reason);
        }}
        amount={currentEvent.amount}
        paymentId={decision?.payment_id || currentEvent.payment_id}
      />
    </div>
  );
};
