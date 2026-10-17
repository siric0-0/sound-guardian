import React from 'react';
import { DemoEvent, SentrySignals, ArbiterDecision } from '../types.ts';
import { Activity, HelpCircle, Eye, ShieldCheck, AlertCircle, Building2 } from 'lucide-react';
import { maskPhone, maskAccount } from '../lib/tokenization.ts';

interface StepExplainerProps {
  currentEvent: DemoEvent;
  signals?: SentrySignals | null;
  decision?: ArbiterDecision | null;
  isATO: boolean;
  isMover: boolean;
  isBranchJames: boolean;
}

export const StepExplainer: React.FC<StepExplainerProps> = ({
  currentEvent,
  signals,
  decision,
  isATO,
  isMover,
  isBranchJames,
}) => {
  const isPaymentInitiated = currentEvent.event_type === 'Payment Initiated';
  const isRecipientAdded = currentEvent.event_type === 'Recipient Added';

  // Card 1: Signal details
  const renderSignalContent = () => {
    if (isRecipientAdded && signals) {
      return (
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[#1B2733] font-medium pb-1 border-b border-[#D0D9E2]">
            <span>Shift-Left Payee Enrollment:</span>
            <span className="font-tabular font-bold text-[#B42318] bg-red-50 px-2 py-0.5 rounded border border-red-200">
              QUARANTINE Fired at 22:19
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
            <div>
              <span className="text-[#5B6B7A] inline-flex items-center gap-0.5">
                <span>Recipient:</span>
                <span className="relative group inline-block cursor-help">
                  <HelpCircle className="w-2.5 h-2.5 text-slate-400 group-hover:text-[#0082CA] transition-colors" />
                  <span className="pointer-events-none absolute bottom-full left-0 mb-1 hidden group-hover:block group-focus:block z-30 w-48 p-2 rounded-md bg-[#002D72] text-white text-[10px] leading-tight shadow-lg border border-[#1F4A8C]">
                    <strong className="block text-sky-200 mb-0.5">Recipient Age (0 days)</strong>
                    New payees enrolled within minutes of an outgoing transfer are a hallmark ATO signal.
                  </span>
                </span>
              </span>
              <span className="font-semibold text-[#1B2733] block">New Payee (0 days old)</span>
            </div>
            <div>
              <span className="text-[#5B6B7A] inline-flex items-center gap-0.5">
                <span>Lead Time:</span>
                <span className="relative group inline-block cursor-help">
                  <HelpCircle className="w-2.5 h-2.5 text-slate-400 group-hover:text-[#0082CA] transition-colors" />
                  <span className="pointer-events-none absolute bottom-full right-0 mb-1 hidden group-hover:block group-focus:block z-30 w-48 p-2 rounded-md bg-[#002D72] text-white text-[10px] leading-tight shadow-lg border border-[#1F4A8C]">
                    <strong className="block text-sky-200 mb-0.5">Shift-Left Advantage</strong>
                    Stopping the threat at payee addition halts the attack 3 full minutes before payment submission.
                  </span>
                </span>
              </span>
              <span className="font-tabular font-semibold text-emerald-700 block">3 min before payment</span>
            </div>
            <div>
              <span className="text-[#5B6B7A]">Password Reset (≤7d): </span>
              <span className="font-semibold block text-amber-700">
                YES (10m ago at 22:09)
              </span>
            </div>
            <div>
              <span className="text-[#5B6B7A]">Contact Changed (≤30d): </span>
              <span className="font-semibold block text-[#B42318]">
                Email + Phone (4m ago)
              </span>
            </div>
          </div>
          <div className="text-[11px] text-[#5B6B7A] pt-1 flex items-center justify-between">
            <span className="inline-flex items-center gap-1">
              <span className="font-medium text-[#1B2733]">Sound 90-Day Record:</span>
              <span className="relative group inline-block cursor-help">
                <HelpCircle className="w-2.5 h-2.5 text-slate-400 group-hover:text-[#0082CA] transition-colors" />
                <span className="pointer-events-none absolute bottom-full left-0 mb-1 hidden group-hover:block group-focus:block z-30 w-52 p-2 rounded-md bg-[#002D72] text-white text-[10px] leading-tight shadow-lg border border-[#1F4A8C]">
                  <strong className="block text-sky-200 mb-0.5">90-Day Historical Record</strong>
                  Sound preserves verified contact numbers on hand for 90 days. Confirmations bypass attacker's altered phone.
                </span>
              </span>
            </span>
            <span className="font-tabular text-[#002D72] font-semibold">•••-•••-4821</span>
          </div>
        </div>
      );
    }

    if (isPaymentInitiated && signals) {
      return (
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[#1B2733] font-medium pb-1 border-b border-[#D0D9E2]">
            <span>Payment Rail & Amount:</span>
            <span className="font-tabular font-bold text-[#002D72]">
              {signals.rail} · ${signals.amount.toFixed(2)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
            <div>
              <span className="text-[#5B6B7A] inline-flex items-center gap-0.5">
                <span>Recipient:</span>
                <span className="relative group inline-block cursor-help">
                  <HelpCircle className="w-2.5 h-2.5 text-slate-400 group-hover:text-[#0082CA] transition-colors" />
                  <span className="pointer-events-none absolute bottom-full left-0 mb-1 hidden group-hover:block group-focus:block z-30 w-48 p-2 rounded-md bg-[#002D72] text-white text-[10px] leading-tight shadow-lg border border-[#1F4A8C]">
                    <strong className="block text-sky-200 mb-0.5">Recipient Age (0 days)</strong>
                    New payees enrolled within minutes of an outgoing transfer are a hallmark ATO signal.
                  </span>
                </span>
              </span>
              <span className="font-semibold text-[#1B2733] block">{signals.recipient_status} (0 days old)</span>
            </div>
            <div>
              <span className="text-[#5B6B7A] inline-flex items-center gap-0.5">
                <span>Baseline Ratio:</span>
                <span className="relative group inline-block cursor-help">
                  <HelpCircle className="w-2.5 h-2.5 text-slate-400 group-hover:text-[#0082CA] transition-colors" />
                  <span className="pointer-events-none absolute bottom-full right-0 mb-1 hidden group-hover:block group-focus:block z-30 w-48 p-2 rounded-md bg-[#002D72] text-white text-[10px] leading-tight shadow-lg border border-[#1F4A8C]">
                    <strong className="block text-sky-200 mb-0.5">Spending Baseline</strong>
                    Compares payment size to the member's 90-day typical transaction average.
                  </span>
                </span>
              </span>
              <span className="font-tabular font-semibold text-[#1B2733] block">{signals.amount_to_baseline_ratio}x baseline</span>
            </div>
            <div>
              <span className="text-[#5B6B7A]">Password Reset (≤7d): </span>
              <span className={`font-semibold block ${signals.password_reset_within_7d ? 'text-amber-700' : 'text-[#5B6B7A]'}`}>
                {signals.password_reset_within_7d ? 'YES (Within 7d)' : 'None'}
              </span>
            </div>
            <div>
              <span className="text-[#5B6B7A]">Contact Changed (≤30d): </span>
              <span className={`font-semibold block ${signals.contact_channel_changed_within_30d.length > 0 ? 'text-[#B42318]' : 'text-emerald-700'}`}>
                {signals.contact_channel_changed_within_30d.length > 0
                  ? signals.contact_channel_changed_within_30d.join(' + ')
                  : signals.address_only_change_within_30d
                  ? 'Address Only'
                  : 'None'}
              </span>
            </div>
          </div>
          <div className="text-[11px] text-[#5B6B7A] pt-1 flex items-center justify-between">
            <span className="inline-flex items-center gap-1">
              <span className="font-medium text-[#1B2733]">Payment Velocity:</span>
              <span className="relative group inline-block cursor-help">
                <HelpCircle className="w-2.5 h-2.5 text-slate-400 group-hover:text-[#0082CA] transition-colors" />
                <span className="pointer-events-none absolute bottom-full left-0 mb-1 hidden group-hover:block group-focus:block z-30 w-52 p-2 rounded-md bg-[#002D72] text-white text-[10px] leading-tight shadow-lg border border-[#1F4A8C]">
                  <strong className="block text-sky-200 mb-0.5">Payment Velocity</strong>
                  Rapid succession of outgoing payments (e.g. 2 P2P drains within 8 minutes) to drain available balances.
                </span>
              </span>
            </span>
            <span className="font-tabular text-[#002D72] font-semibold">{signals.minutes_since_last_change}m delta</span>
          </div>
        </div>
      );
    }

    if (isBranchJames && currentEvent.channel === 'Branch') {
      return (
        <div className="space-y-1 text-xs">
          <div className="font-semibold text-amber-900">Branch Cash Withdrawal ($7,000.00)</div>
          <div className="text-[#5B6B7A] text-[11px]">
            No automated digital credentials changed. Observable signals: in-person cash request + urgent cross-channel contact center inquiry 24h prior.
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-1 text-xs">
        <div className="font-semibold text-[#002D72]">
          {currentEvent.event_category} · {currentEvent.event_type}
        </div>
        <p className="text-[11px] text-[#5B6B7A] leading-relaxed">
          {currentEvent.event_note || 'Standard banking activity logged to audit trail.'}
        </p>
        <div className="text-[11px] text-[#5B6B7A]">
          Channel: <span className="font-medium text-[#1B2733]">{currentEvent.channel}</span> · Sequence: #{currentEvent.event_sequence}
        </div>
      </div>
    );
  };

  // Card 2: Why now
  const renderWhyNowContent = () => {
    if (isRecipientAdded && decision?.tier === 'QUARANTINE') {
      return (
        <p className="text-xs text-[#1B2733] leading-relaxed">
          <strong className="text-[#B42318]">Shift-Left Step-Up (Sound Team Feedback):</strong> Sound cannot pause P2P after submit because P2P clearing is irreversible. Therefore, QUARANTINE engages at the exact moment a new recipient is added. The payee cannot receive money until confirmed via pre-change contact info (Sound keeps on hand for 90 days).
        </p>
      );
    }

    if (decision?.tier === 'QUARANTINE') {
      return (
        <p className="text-xs text-[#1B2733] leading-relaxed">
          <strong className="text-[#B42318]">Pre-Send Pause Required:</strong> P2P rail transfers finalize instantly and cannot be recalled through standard banking rails. Payee was locked at enrollment (22:19). Send button remains disabled; money never leaves Sarah's account.
        </p>
      );
    }

    if (decision?.tier === 'LIGHT') {
      return (
        <p className="text-xs text-[#1B2733] leading-relaxed">
          <strong className="text-[#B54708]">Frictionless Verification:</strong> Mover profile signature detected. Address changed, but primary phone and email remain verified. Rather than a harsh block, a 1-tap "Was this you?" confirmation is triggered to release in seconds.
        </p>
      );
    }

    if (isBranchJames && currentEvent.channel === 'Branch') {
      return (
        <p className="text-xs text-[#1B2733] leading-relaxed">
          <strong className="text-amber-800">Assisted-Channel Human Protocol:</strong> Digital ATO rules did not fire because credentials were not compromised. The teller leverages the prior Contact Center inquiry note to intervene with protective inquiry.
        </p>
      );
    }

    return (
      <p className="text-xs text-[#5B6B7A] leading-relaxed">
        Event recorded in the member's observable security sequence. Establishes the baseline behavioral audit trail for subsequent payment requests.
      </p>
    );
  };

  // Card 3: What the member sees
  const renderMemberSeesContent = () => {
    if (decision?.tier === 'QUARANTINE') {
      return (
        <div className="text-xs text-[#1B2733] space-y-1">
          <div className="bg-[#FEF3F2] p-2 rounded border border-[#FECDCA] text-[11px]">
            <span className="font-bold text-[#B42318]">Attacker's Session:</span> Payee shows pending confirmation status; Send button disabled; sees notice routed to pre-change phone ({maskPhone()}).
          </div>
          <div className="bg-[#FFFAEB] p-2 rounded border border-[#FEDF89] text-[11px]">
            <span className="font-bold text-[#B54708]">Real Sarah's Phone:</span> Coercion warning: <em>"This code approves a NEW payee and payments to it. Sound will never call or text asking for this code."</em> [Freeze & Recover]
          </div>
        </div>
      );
    }

    if (decision?.tier === 'LIGHT') {
      return (
        <div className="bg-[#FFFAEB] p-2 rounded border border-[#FEDF89] text-xs text-[#1B2733]">
          <span className="font-bold text-[#B54708]">One-Tap Prompt:</span> "Quick check: was this you? Tap below to confirm this ${currentEvent.amount.toFixed(2)} payment." [Yes, this was me]
        </div>
      );
    }

    if (isBranchJames && currentEvent.channel === 'Branch') {
      return (
        <div className="bg-amber-50 p-2 rounded border border-amber-200 text-xs text-amber-900">
          <span className="font-bold">Teller Consultation:</span> Teller gently asks: "Has anyone told you to keep this secret or to stay on the phone?" Member retains final decision authority.
        </div>
      );
    }

    return (
      <div className="text-xs text-[#5B6B7A]">
        Standard digital banking screen with masked balances ({maskAccount()}) and normal transaction status.
      </div>
    );
  };

  // Card 4: What staff sees
  const renderStaffSeesContent = () => {
    if (decision?.tier === 'QUARANTINE') {
      return (
        <div className="text-xs text-[#1B2733] space-y-1">
          <div className="flex items-center justify-between font-semibold text-[#B42318]">
            <span>Automated 24/7 Verification</span>
            <span className="font-tabular text-[10px] bg-red-100 text-red-900 px-1.5 py-0.5 rounded font-bold">
              Next Business Hours Queue
            </span>
          </div>
          <p className="text-[11px] text-[#5B6B7A]">
            Runs automatically at any hour with zero staff. Unresolved items route to 8:00 AM PST business hours. Members tapping "Request at branch" mark case PRIORITY.
          </p>
        </div>
      );
    }

    if (decision?.tier === 'LIGHT') {
      return (
        <div className="text-xs text-[#1B2733] space-y-1">
          <div className="flex items-center justify-between font-semibold text-[#B54708]">
            <span>LIGHT Queue (Auto-Clearing)</span>
            <span className="text-[11px] text-[#067647]">Resolves in &lt;30s</span>
          </div>
          <p className="text-[11px] text-[#5B6B7A]">
            One-tap dispatch monitored. Will auto-release upon member tap. One-click staff release available if member phones in.
          </p>
        </div>
      );
    }

    if (isBranchJames) {
      return (
        <div className="text-xs text-[#1B2733] space-y-1">
          <div className="font-semibold text-[#002D72]">Branch Teller Advisory Note</div>
          <p className="text-[11px] text-[#5B6B7A]">
            Previous Contact Center assisted note flagged on screen. Teller follows next-best-action conversational guide.
          </p>
        </div>
      );
    }

    return (
      <div className="text-xs text-[#5B6B7A]">
        Standard audit event streamed into telemetry. No operational review queue entry needed.
      </div>
    );
  };

  return (
    <div className="mt-4 bg-[#F4F8FA] rounded-xl border border-[#D0D9E2] p-4">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D0D9E2]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#002D72] flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5" />
          <span>Step Explainer (4-Point Decision Context)</span>
        </h3>
        <span className="text-[11px] text-[#5B6B7A]">
          Step #{currentEvent.event_sequence} · {currentEvent.event_timestamp}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Box 1: Signal */}
        <div className="bg-white rounded-lg p-3.5 border border-[#D0D9E2] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#002D72] mb-2 pb-1 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#0082CA]" />
                <span>1. Signal</span>
              </div>
              <div className="relative group">
                <button
                  type="button"
                  className="text-slate-400 hover:text-[#0082CA] transition-colors p-0.5 rounded cursor-help focus:outline-none focus:ring-1 focus:ring-[#0082CA]"
                  aria-label="Educational definition of ATO signals"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
                <div className="pointer-events-none absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 hidden group-hover:block group-focus-within:block z-40 w-64 p-3 rounded-lg bg-[#002D72] text-white text-[11px] leading-relaxed shadow-xl border border-[#1F4A8C] animate-in fade-in duration-100">
                  <div className="font-serif font-bold text-sky-200 mb-1.5 pb-1 border-b border-white/20">
                    Observable ATO Signals
                  </div>
                  <ul className="space-y-1.5 text-[10px] text-white/90">
                    <li>
                      <strong className="text-amber-300">Recipient Age:</strong> Days since the payee was added. Account takeovers almost exclusively push funds to recipients enrolled 0 days ago.
                    </li>
                    <li>
                      <strong className="text-amber-300">Payment Velocity:</strong> The short time elapsed (delta) between contact changes and outbound transfer attempts.
                    </li>
                    <li>
                      <strong className="text-amber-300">Baseline Ratio:</strong> Multiple of transaction size against the member's historical 90-day spending profile.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {renderSignalContent()}
          </div>
        </div>

        {/* Box 2: Why now */}
        <div className="bg-white rounded-lg p-3.5 border border-[#D0D9E2] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#002D72] mb-2 pb-1 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>2. Why Now</span>
              </div>
              <div className="relative group">
                <button
                  type="button"
                  className="text-slate-400 hover:text-amber-600 transition-colors p-0.5 rounded cursor-help focus:outline-none focus:ring-1 focus:ring-amber-600"
                  aria-label="Educational definition of why action is taken now"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
                <div className="pointer-events-none absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 hidden group-hover:block group-focus-within:block z-40 w-64 p-3 rounded-lg bg-[#002D72] text-white text-[11px] leading-relaxed shadow-xl border border-[#1F4A8C] animate-in fade-in duration-100">
                  <div className="font-serif font-bold text-sky-200 mb-1.5 pb-1 border-b border-white/20">
                    Pre-Send Intervention Timing
                  </div>
                  <ul className="space-y-1.5 text-[10px] text-white/90">
                    <li>
                      <strong className="text-amber-300">Irrevocable Rail (P2P):</strong> Instant rails cannot be recalled once sent. Pausing before submit prevents total loss.
                    </li>
                    <li>
                      <strong className="text-amber-300">Dual-Contact Signature:</strong> Modifying both Email & Phone alongside a password reset triggers QUARANTINE; Address-only changes route to LIGHT tier.
                    </li>
                    <li>
                      <strong className="text-amber-300">Pre-Change Channel:</strong> Confirmations route strictly to the verified phone on file before the change occurred.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {renderWhyNowContent()}
          </div>
        </div>

        {/* Box 3: What the member sees */}
        <div className="bg-white rounded-lg p-3.5 border border-[#D0D9E2] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#002D72] mb-2 pb-1 border-b border-slate-100">
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>3. Member Sees</span>
            </div>
            {renderMemberSeesContent()}
          </div>
        </div>

        {/* Box 4: What staff sees */}
        <div className="bg-white rounded-lg p-3.5 border border-[#D0D9E2] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#002D72] mb-2 pb-1 border-b border-slate-100">
              <ShieldCheck className="w-3.5 h-3.5 text-[#067647]" />
              <span>4. Staff Sees</span>
            </div>
            {renderStaffSeesContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
