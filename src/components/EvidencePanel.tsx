import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  XCircle,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
  ArrowRight,
  Code2,
  Sliders,
  Copy,
  Check,
} from 'lucide-react';
import rulesConfig from '../config/rules.config.json';
import fallbackEvaluation from '../../public/data/evaluation.json';

interface EvidencePanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  isOpen = true,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'atoJourneys' | 'otherJourneys' | 'rulesConfig' | 'methodology'>('summary');
  const [isExpanded, setIsExpanded] = useState(true);
  const [evaluation, setEvaluation] = useState(fallbackEvaluation);
  const [copiedConfig, setCopiedConfig] = useState(false);

  // Dynamically load evaluation.json if updated
  useEffect(() => {
    fetch('/data/evaluation.json')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch evaluation.json');
      })
      .then((data) => setEvaluation(data))
      .catch((err) => {
        console.warn('Using bundled evaluation.json fallback:', err);
      });
  }, []);

  const headline = evaluation.headline;
  const atoJourneys = evaluation.ato_journeys || fallbackEvaluation.ato_journeys;

  const copyConfigToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(rulesConfig, null, 2));
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-[#D0D9E2] shadow-xs overflow-hidden mb-6">
      {/* Evidence Panel Header */}
      <div className="bg-gradient-to-r from-[#002D72] via-[#003882] to-[#0082CA] text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-lg bg-white/10 ring-1 ring-white/20 text-[#56BBEB] shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                Sound Guardian Evidence & Data Evaluation
              </h3>
              <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-white/15 text-[#E1F0F8] border border-white/20">
                {evaluation.total_members || 118} Evaluation Journeys
              </span>
              <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                v{rulesConfig.rule_version}
              </span>
            </div>
            <p className="text-xs text-[#E1F0F8]/90 mt-1 leading-relaxed max-w-3xl">
              Strict deterministic rule performance across {evaluation.total_members || 118} synthetic member evaluation journeys ({headline.ato_quarantined || 12} takeover, {headline.other_total || 106} other).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-white/70 italic hidden md:inline">
            (synthetic data, illustration only)
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            <span>{isExpanded ? 'Collapse' : 'Expand Evidence'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-5">
          {/* Headline Summary Callout */}
          <div className="bg-[#E1F0F8]/70 border border-[#0082CA]/30 rounded-xl p-4 text-xs text-[#002D72] leading-relaxed shadow-2xs">
            <div className="font-bold text-[11px] uppercase tracking-wider text-[#0082CA] mb-1">
              Headline Summary · Synthetic Data Evaluation (Rule v{rulesConfig.rule_version})
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#002D72] leading-normal">
              <strong>QUARANTINE</strong> fired on <strong>{headline.ato_quarantined} of {headline.ato_total}</strong> takeover journeys, <strong>{headline.lead_time_min}–{headline.lead_time_max} min</strong> before the first payment. <strong>{headline.other_quarantined} of {headline.other_total}</strong> other members quarantined (36 other scams, 50 routine, 20 look-alikes). <strong>LIGHT</strong> fired on <strong>{headline.light_fired} of {headline.lookalikes_total}</strong> look-alikes ({(headline.light_members || []).join(', ')}, all real movers). Takeover dollars in the data: <strong>${headline.dollars_attempted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> attempted, <strong>${headline.dollars_sent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> sent, <strong>${headline.net_loss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> net loss.
            </p>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: QUARANTINE Trigger */}
            <div className="bg-[#ECFDF3] border-2 border-[#A6F4C5] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#067647] uppercase tracking-wide">
                  QUARANTINE Fired
                </span>
                <CheckCircle2 className="w-4 h-4 text-[#067647]" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-tabular text-[#054F31]">
                {headline.ato_quarantined} / {headline.ato_total}
              </div>
              <div className="text-xs font-semibold text-[#067647] mt-1">
                Takeover Journeys Caught
              </div>
              <p className="text-[11px] text-[#054F31]/80 mt-1.5 leading-tight">
                Fired {headline.lead_time_min}–{headline.lead_time_max} min before the first payment upon recipient enrollment.
              </p>
            </div>

            {/* Card 2: Other Members Quarantined */}
            <div className="bg-[#E1F0F8] border-2 border-[#0082CA]/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#002D72] uppercase tracking-wide">
                  Other Members Quarantined
                </span>
                <ShieldCheck className="w-4 h-4 text-[#0082CA]" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-tabular text-[#002D72]">
                {headline.other_quarantined} / {headline.other_total}
              </div>
              <div className="text-xs font-semibold text-[#0082CA] mt-1">
                0 Quarantined (36 other scams, 50 routine, 20 look-alikes)
              </div>
              <p className="text-[11px] text-[#5B6B7A] mt-1.5 leading-tight">
                LIGHT fired on {headline.light_fired} of {headline.lookalikes_total} look-alikes ({(headline.light_members || []).join(', ')}, all real movers).
              </p>
            </div>

            {/* Card 3: Lead Time */}
            <div className="bg-[#FFFAEB] border-2 border-[#FEDF89] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#B54708] uppercase tracking-wide">
                  Intervention Lead Time
                </span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-tabular text-[#93370D]">
                {headline.lead_time_min} – {headline.lead_time_max} min
              </div>
              <div className="text-xs font-semibold text-[#B54708] mt-1">
                Before 1st Outgoing Payment
              </div>
              <p className="text-[11px] text-[#7A2E0E] mt-1.5 leading-tight">
                Pre-send lock engages upon payee addition before funds can be submitted.
              </p>
            </div>

            {/* Card 4: Takeover Dollars */}
            <div className="bg-[#F8F9FA] border-2 border-[#D0D9E2] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#1B2733] uppercase tracking-wide">
                  Takeover Dollars
                </span>
                <TrendingUp className="w-4 h-4 text-[#002D72]" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-tabular text-[#002D72]">
                ${headline.dollars_attempted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs font-semibold text-[#1B2733] mt-1">
                Attempted in Takeover Data
              </div>
              <p className="text-[11px] text-[#5B6B7A] mt-1.5 leading-tight">
                ${headline.dollars_sent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sent · ${headline.net_loss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} net loss across 12 takeover journeys.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-[#D0D9E2] flex items-center gap-4 text-xs font-semibold text-[#5B6B7A] overflow-x-auto">
            <button
              onClick={() => setActiveTab('summary')}
              className={`pb-2.5 cursor-pointer border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'summary'
                  ? 'border-[#0082CA] text-[#002D72] font-bold'
                  : 'border-transparent hover:text-[#002D72]'
              }`}
            >
              Architectural Shift-Left Insight
            </button>
            <button
              onClick={() => setActiveTab('atoJourneys')}
              className={`pb-2.5 cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'atoJourneys'
                  ? 'border-[#0082CA] text-[#002D72] font-bold'
                  : 'border-transparent hover:text-[#002D72]'
              }`}
            >
              <span>12 Takeover Journeys</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                {headline.ato_quarantined}/{headline.ato_total}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('otherJourneys')}
              className={`pb-2.5 cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'otherJourneys'
                  ? 'border-[#0082CA] text-[#002D72] font-bold'
                  : 'border-transparent hover:text-[#002D72]'
              }`}
            >
              <span>106 Other Member Journeys</span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px]">
                {headline.other_quarantined}/{headline.other_total} quarantined
              </span>
            </button>
            <button
              onClick={() => setActiveTab('rulesConfig')}
              className={`pb-2.5 cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'rulesConfig'
                  ? 'border-[#0082CA] text-[#002D72] font-bold'
                  : 'border-transparent hover:text-[#002D72]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-[#0082CA]" />
              <span>Active Rule Config</span>
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-mono">
                v{rulesConfig.rule_version}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('methodology')}
              className={`pb-2.5 cursor-pointer border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'methodology'
                  ? 'border-[#0082CA] text-[#002D72] font-bold'
                  : 'border-transparent hover:text-[#002D72]'
              }`}
            >
              Responsible Data Principles
            </button>
          </div>

          {/* Tab 1: Shift-Left Insight */}
          {activeTab === 'summary' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#002D72]">
                  Sound Team Feedback: Why Move Step-Up to Recipient Enrollment?
                </h4>
                <div className="bg-[#F4F8FA] p-4 rounded-xl border border-[#D0D9E2] space-y-2.5 text-xs text-[#1B2733] leading-relaxed">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#067647] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#002D72]">P2P Cannot Be Paused After Submit:</strong> Once a P2P transfer enters clearing, settlement is irreversible. No automated fraud recall mechanism exists on standard P2P rails.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#067647] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#002D72]">No Payment Pausing Needed:</strong> By locking newly added payees upfront until confirmed via Sound's 90-day pre-change records, the payment button is never pressed by the fraudster.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#067647] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#002D72]">Average 3 to 9 Minutes Earlier:</strong> In member M1003's journey, the payee was added at 22:19. The payment attempts happened at 22:22 and 22:30. Sound Guardian blocked the attack 3 full minutes before money was even typed into the form.
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#002D72]">
                  Coercion Protection & Automated 24/7 Clearance
                </h4>
                <div className="bg-[#FFFAEB] p-4 rounded-xl border border-[#FEDF89] space-y-2.5 text-xs text-[#93370D] leading-relaxed">
                  <p>
                    <strong className="text-[#7A2E0E]">Mandatory Coercion Shield Copy:</strong>
                    <br />
                    <em>"This code approves a NEW payee and payments to it. Sound will never call or text asking for this code."</em>
                  </p>
                  <p>
                    <strong>24/7 Self-Service:</strong> Legitimate members who updated their phone can confirm immediately via their secondary verified channel or government ID in-branch. Unresolved overnight items automatically queue for 8:00 AM PST business hours.
                  </p>
                  <p className="text-[11px] text-[#7A2E0E]/90">
                    <strong>Branch Priority:</strong> Members visiting a physical branch receive immediate teller priority with an explicit "Request at Branch" bypass flow.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: 12 Takeover Journeys Table */}
          {activeTab === 'atoJourneys' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#5B6B7A]">
                  QUARANTINE fired on {headline.ato_quarantined} of {headline.ato_total} takeover journeys, {headline.lead_time_min}–{headline.lead_time_max} min before the first payment.
                </span>
                <span className="font-bold text-[#067647]">{headline.ato_quarantined} / {headline.ato_total} Caught</span>
              </div>
              <div className="overflow-x-auto border border-[#D0D9E2] rounded-xl shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F4F8FA] border-b border-[#D0D9E2] font-semibold text-[#002D72]">
                      <th className="py-2.5 px-3">Member ID</th>
                      <th className="py-2.5 px-3">Payee Added</th>
                      <th className="py-2.5 px-3">First Payment</th>
                      <th className="py-2.5 px-3">Rail</th>
                      <th className="py-2.5 px-3">Lead Time</th>
                      <th className="py-2.5 px-3">Attempted</th>
                      <th className="py-2.5 px-3">Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D0D9E2]">
                    {atoJourneys.map((j: any) => (
                      <tr key={j.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#002D72]">{j.member}</td>
                        <td className="py-2.5 px-3 font-mono text-[#B42318] font-semibold">{j.payeeAdded}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{j.firstPayment}</td>
                        <td className="py-2.5 px-3 font-medium text-[#1B2733]">{j.rail}</td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <Clock className="w-3 h-3" />
                            <span>{j.leadTime}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-tabular font-bold text-[#002D72]">{j.attempted}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                              j.outcome === 'Prevented'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : j.outcome === 'Loss partly recovered'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {j.outcome}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: 106 Other Member Journeys */}
          {activeTab === 'otherJourneys' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#5B6B7A]">
                  {headline.other_quarantined} of {headline.other_total} other members quarantined (36 other scams, 50 routine, 20 look-alikes).
                </span>
                <span className="font-bold text-[#0082CA]">{headline.other_quarantined} / {headline.other_total} Quarantined</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#F4F8FA] p-3.5 rounded-lg border border-[#D0D9E2] space-y-1.5 shadow-2xs">
                  <div className="font-bold text-[#002D72]">Look-Alikes (20 members)</div>
                  <p className="text-[#5B6B7A] text-[11px] leading-relaxed">
                    LIGHT fired on 4 of 20 look-alikes (M1039, M1041, M1051, M1114, all real movers with address updates). Zero were quarantined. Resolved via 1-tap in 8–14 seconds.
                  </p>
                </div>
                <div className="bg-[#F4F8FA] p-3.5 rounded-lg border border-[#D0D9E2] space-y-1.5 shadow-2xs">
                  <div className="font-bold text-[#002D72]">Other Scams (36 members)</div>
                  <p className="text-[#5B6B7A] text-[11px] leading-relaxed">
                    36 non-takeover scam scenarios (e.g. imposter coercion, remote assistance, branch cash withdrawals). Zero quarantined by ATO rule; protected via teller inquiry scripts.
                  </p>
                </div>
                <div className="bg-[#F4F8FA] p-3.5 rounded-lg border border-[#D0D9E2] space-y-1.5 shadow-2xs">
                  <div className="font-bold text-[#002D72]">Routine Members (50 members)</div>
                  <p className="text-[#5B6B7A] text-[11px] leading-relaxed">
                    50 routine payee additions and transfers without preceding credential or phone changes processed instantaneously without step-up interference.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Active Rule Config (Read-Only) */}
          {activeTab === 'rulesConfig' && (
            <div className="space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F4F8FA] p-4 rounded-xl border border-[#D0D9E2]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#002D72]">{rulesConfig.rule_name}</span>
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#002D72] text-white font-bold">
                      v{rulesConfig.rule_version}
                    </span>
                  </div>
                  <p className="text-xs text-[#5B6B7A] mt-1">
                    {rulesConfig.description} (Effective: {rulesConfig.effective_date})
                  </p>
                </div>
                <button
                  onClick={copyConfigToClipboard}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D0D9E2] hover:bg-slate-50 text-[#002D72] font-semibold text-xs transition-colors cursor-pointer shrink-0"
                >
                  {copiedConfig ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#0082CA]" />}
                  <span>{copiedConfig ? 'Copied Config' : 'Copy JSON'}</span>
                </button>
              </div>

              {/* Windows & Thresholds Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-[#D0D9E2]">
                  <span className="text-[#5B6B7A] block text-[11px] font-semibold uppercase">Password Reset Window</span>
                  <div className="text-xl font-bold font-mono text-[#002D72] mt-1">
                    {rulesConfig.windows.password_reset_days} days
                  </div>
                  <p className="text-[11px] text-[#5B6B7A] mt-0.5">Prior self-service credentials reset</p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#D0D9E2]">
                  <span className="text-[#5B6B7A] block text-[11px] font-semibold uppercase">Contact Change Window</span>
                  <div className="text-xl font-bold font-mono text-[#002D72] mt-1">
                    {rulesConfig.windows.contact_channel_change_days} days
                  </div>
                  <p className="text-[11px] text-[#5B6B7A] mt-0.5">Email and/or Phone update delta</p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#D0D9E2]">
                  <span className="text-[#5B6B7A] block text-[11px] font-semibold uppercase">Pre-Change Lookup</span>
                  <div className="text-xl font-bold font-mono text-[#002D72] mt-1">
                    {rulesConfig.windows.pre_change_lookup_days} days
                  </div>
                  <p className="text-[11px] text-[#5B6B7A] mt-0.5">Sound historical phone verification record</p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#D0D9E2]">
                  <span className="text-[#5B6B7A] block text-[11px] font-semibold uppercase">Light Tier Hold</span>
                  <div className="text-xl font-bold font-mono text-[#002D72] mt-1">
                    {rulesConfig.windows.light_hold_duration_hours} hours
                  </div>
                  <p className="text-[11px] text-[#5B6B7A] mt-0.5">Self-service one-tap confirmation expiry</p>
                </div>
              </div>

              {/* Tier Actions & Reason Codes Table */}
              <div className="border border-[#D0D9E2] rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4F8FA] border-b border-[#D0D9E2] font-semibold text-[#002D72]">
                    <tr>
                      <th className="py-2.5 px-3">Tier Name</th>
                      <th className="py-2.5 px-3">Action Enforced</th>
                      <th className="py-2.5 px-3">Reason Code</th>
                      <th className="py-2.5 px-3">Policy Rationale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D0D9E2] bg-white">
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold font-mono">
                          {rulesConfig.tier_names.QUARANTINE}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[#002D72] font-semibold">
                        {rulesConfig.actions.QUARANTINE}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">
                        {rulesConfig.reason_codes.QUARANTINE}
                      </td>
                      <td className="py-2.5 px-3 text-[#5B6B7A]">
                        Payee enrollment quarantined pending verification on pre-change phone.
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold font-mono">
                          {rulesConfig.tier_names.LIGHT}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[#002D72] font-semibold">
                        {rulesConfig.actions.LIGHT}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">
                        {rulesConfig.reason_codes.LIGHT}
                      </td>
                      <td className="py-2.5 px-3 text-[#5B6B7A]">
                        Address-only change mover check: 4-hour one-tap verify to unchanged phone.
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold font-mono">
                          {rulesConfig.tier_names.NONE}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[#002D72] font-semibold">
                        {rulesConfig.actions.NONE}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">
                        {rulesConfig.reason_codes.NONE}
                      </td>
                      <td className="py-2.5 px-3 text-[#5B6B7A]">
                        Standard baseline activity processed normally without friction.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Read-Only Configuration JSON Inspector */}
              <div className="bg-[#1E293B] text-slate-200 p-4 rounded-xl border border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-700">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Code2 className="w-3.5 h-3.5 text-[#56BBEB]" />
                    <span>src/config/rules.config.json (Read-Only)</span>
                  </span>
                  <span className="font-mono text-slate-400">Deterministic Engine Active</span>
                </div>
                <pre className="font-mono text-[11px] leading-relaxed overflow-x-auto text-emerald-300 max-h-48">
                  {JSON.stringify(rulesConfig, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Tab 5: Methodology */}
          {activeTab === 'methodology' && (
            <div className="bg-[#F4F8FA] p-4 rounded-xl border border-[#D0D9E2] space-y-3 text-xs text-[#1B2733] leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-[#002D72]">
                <Info className="w-4 h-4 text-[#0082CA]" />
                <span>Zero Demographic Traits · Pure Observable Sequence Rules</span>
              </div>
              <p>
                Sound Guardian strictly evaluates <strong>observable account telemetry</strong>: password reset timestamps, email/phone delta timestamps, payee age (0 days), and payment rail. It never evaluates age, race, gender, geolocation inferences, device biometrics, or behavioral surveillance feeds.
              </p>
              <div className="text-[11px] text-[#5B6B7A] pt-1 border-t border-[#D0D9E2]">
                * Synthetic validation dataset compiled for HuskyHack 2026. Metrics serve as an illustrative demonstration of deterministic pre-send security architecture.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
