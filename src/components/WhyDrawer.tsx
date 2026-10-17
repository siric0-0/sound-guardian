import React, { useState } from 'react';
import { DemoEvent, SentrySignals, ArbiterDecision } from '../types.ts';
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Activity,
  Clock,
  Eye,
  ShieldCheck,
  X,
  Sparkles,
} from 'lucide-react';

interface WhyDrawerProps {
  currentEvent: DemoEvent;
  signals?: SentrySignals | null;
  decision?: ArbiterDecision | null;
  isOpen: boolean;
  onToggle: () => void;
  lang: 'en' | 'es';
}

export const WhyDrawer: React.FC<WhyDrawerProps> = ({
  currentEvent,
  signals,
  decision,
  isOpen,
  onToggle,
  lang,
}) => {
  const isEs = lang === 'es';
  const [activeTab, setActiveTab] = useState<'signal' | 'why_now' | 'member' | 'staff'>('signal');

  const isQuarantine = decision?.tier === 'QUARANTINE';
  const isLight = decision?.tier === 'LIGHT';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-[#D0D9E2] shadow-2xl transition-all">
      {/* Drawer Bar Header / Pill Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-12">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 text-xs font-bold text-[#002D72] hover:text-[#0082CA] transition-colors cursor-pointer py-2"
          aria-expanded={isOpen}
          aria-controls="why-drawer-content"
        >
          <div className="w-5 h-5 rounded-full bg-[#E1F0F8] text-[#002D72] flex items-center justify-center font-bold">
            ?
          </div>
          <span className="font-serif text-sm">
            {isEs ? '¿Por qué ocurrió esto?' : 'Why did this happen?'}
          </span>
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-[#0082CA]" />
          ) : (
            <ChevronUp className="w-4 h-4 text-[#0082CA]" />
          )}
        </button>

        <div className="flex items-center gap-2">
          {decision && (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F4F8FA] border border-[#D0D9E2] text-[#5B6B7A]">
              Tier: <strong className="text-[#002D72]">{decision.tier}</strong>
            </span>
          )}
          {isOpen && (
            <button
              onClick={onToggle}
              className="p-1 rounded text-[#5B6B7A] hover:text-[#1B2733] hover:bg-slate-100 cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Content (Closed by default) */}
      {isOpen && (
        <div id="why-drawer-content" className="border-t border-[#D0D9E2] bg-[#F4F8FA] p-4 sm:p-6 max-h-[45vh] overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-4">
            {/* Sub-tabs */}
            <div className="flex items-center gap-1.5 border-b border-[#D0D9E2] pb-2 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('signal')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'signal'
                    ? 'bg-[#002D72] text-white shadow-xs'
                    : 'bg-white text-[#5B6B7A] border border-[#D0D9E2] hover:text-[#002D72]'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Signal Extracted</span>
              </button>
              <button
                onClick={() => setActiveTab('why_now')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'why_now'
                    ? 'bg-[#002D72] text-white shadow-xs'
                    : 'bg-white text-[#5B6B7A] border border-[#D0D9E2] hover:text-[#002D72]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Why Now (Lead Time)</span>
              </button>
              <button
                onClick={() => setActiveTab('member')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'member'
                    ? 'bg-[#002D72] text-white shadow-xs'
                    : 'bg-white text-[#5B6B7A] border border-[#D0D9E2] hover:text-[#002D72]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Member Sees</span>
              </button>
              <button
                onClick={() => setActiveTab('staff')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'staff'
                    ? 'bg-[#002D72] text-white shadow-xs'
                    : 'bg-white text-[#5B6B7A] border border-[#D0D9E2] hover:text-[#002D72]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Staff Operations</span>
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'signal' && (
              <div className="bg-white rounded-xl p-4 border border-[#D0D9E2] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#002D72]">
                    Observable Sentry Signals
                  </h4>
                  <span className="text-[11px] text-[#5B6B7A]">
                    Source Event: <code className="font-mono">{currentEvent.event_id || 'N/A'}</code>
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-[#F4F8FA] p-3 rounded-lg border border-[#D0D9E2]">
                    <span className="text-[#5B6B7A] block text-[11px]">Password Reset (≤7d)</span>
                    <strong className={`text-sm ${signals?.password_reset_within_7d ? 'text-amber-700' : 'text-slate-700'}`}>
                      {signals?.password_reset_within_7d ? 'YES (Recent)' : 'NO'}
                    </strong>
                  </div>
                  <div className="bg-[#F4F8FA] p-3 rounded-lg border border-[#D0D9E2]">
                    <span className="text-[#5B6B7A] block text-[11px]">Contact Channel Changed</span>
                    <strong className={`text-sm ${signals?.contact_channel_changed_within_30d.length ? 'text-[#B42318]' : 'text-slate-700'}`}>
                      {signals?.contact_channel_changed_within_30d.join(', ') || 'None'}
                    </strong>
                  </div>
                  <div className="bg-[#F4F8FA] p-3 rounded-lg border border-[#D0D9E2]">
                    <span className="text-[#5B6B7A] block text-[11px]">Payee Status</span>
                    <strong className="text-sm text-[#002D72]">
                      {signals?.recipient_status || 'Existing'} (0 days old)
                    </strong>
                  </div>
                  <div className="bg-[#F4F8FA] p-3 rounded-lg border border-[#D0D9E2]">
                    <span className="text-[#5B6B7A] block text-[11px]">Baseline Spend Ratio</span>
                    <strong className="text-sm text-[#002D72]">
                      {signals?.amount_to_baseline_ratio ? `${signals.amount_to_baseline_ratio.toFixed(1)}x` : '1.0x Normal'}
                    </strong>
                  </div>
                </div>

                {decision?.citations && decision.citations.length > 0 && (
                  <div className="pt-2 border-t border-[#D0D9E2] flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold text-[#5B6B7A]">Citations:</span>
                    {decision.citations.map((c, i) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'why_now' && (
              <div className="bg-white rounded-xl p-4 border border-[#D0D9E2] space-y-2 text-xs">
                <h4 className="font-serif font-bold text-sm text-[#002D72]">
                  Shift-Left Timing Advantage
                </h4>
                <p className="text-[#5B6B7A] leading-relaxed">
                  In legacy fraud engines, rules only evaluate when the payment is submitted for clearing.
                  By shifting left to <strong>payee addition</strong>, Sound Guardian secures the account <strong>3 to 9 minutes before</strong> the first payment is even scheduled.
                </p>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 font-medium">
                  Result: Zero network liability, zero ACH return fees, and funds remain 100% in member account.
                </div>
              </div>
            )}

            {activeTab === 'member' && (
              <div className="bg-white rounded-xl p-4 border border-[#D0D9E2] space-y-2 text-xs">
                <h4 className="font-serif font-bold text-sm text-[#002D72]">
                  What the Member Sees & Experiences
                </h4>
                <p className="text-[#5B6B7A] leading-relaxed">
                  The member is shown non-blaming, calm language. Internal fraud scores and algorithms are never revealed.
                  Confirmation is routed strictly to the trusted pre-change phone number on file from Sound's 90-day history record.
                </p>
                <div className="p-3 bg-[#FFFAEB] rounded-lg border border-[#FEDF89] text-[#7A2E0E]">
                  <strong>Mandatory Coercion Warning:</strong> "This code approves a NEW payee and payments to it. Sound will never call or text asking for this code."
                </div>
              </div>
            )}

            {activeTab === 'staff' && (
              <div className="bg-white rounded-xl p-4 border border-[#D0D9E2] space-y-2 text-xs">
                <h4 className="font-serif font-bold text-sm text-[#002D72]">
                  Internal Operations Protocol
                </h4>
                <ul className="list-disc list-inside space-y-1 text-[#5B6B7A]">
                  <li>Quarantine tier releases require 2-staff sign-off with verifiable government photo ID.</li>
                  <li>Branch visits are prioritized to the top of the queue with visual PRIORITY badges.</li>
                  <li>Automated after-hours items safely roll over to the 8:00 AM PST business queue.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
