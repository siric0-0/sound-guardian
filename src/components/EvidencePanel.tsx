import React, { useState } from 'react';
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
} from 'lucide-react';

interface EvidencePanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  isOpen = true,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'atoJourneys' | 'otherJourneys' | 'methodology'>('summary');
  const [isExpanded, setIsExpanded] = useState(true);

  // 12 synthetic ATO test journeys (synthetic data, illustration only)
  const atoJourneys = [
    { id: 'ATO-01', member: 'M1003', payeeAdded: '10/15 22:19', firstPayment: '22:22', rail: 'P2P', leadTime: '3 min', attempted: '$3,006.33', outcome: 'Loss' },
    { id: 'ATO-02', member: 'M1007', payeeAdded: '10/14 23:13', firstPayment: '23:17', rail: 'P2P', leadTime: '4 min', attempted: '$3,461.24', outcome: 'Loss partly recovered' },
    { id: 'ATO-03', member: 'M1010', payeeAdded: '10/15 12:58', firstPayment: '13:05', rail: 'P2P', leadTime: '7 min', attempted: '$3,541.94', outcome: 'Prevented' },
    { id: 'ATO-04', member: 'M1016', payeeAdded: '10/17 07:07', firstPayment: '07:11', rail: 'P2P', leadTime: '4 min', attempted: '$3,240.16', outcome: 'Loss' },
    { id: 'ATO-05', member: 'M1027', payeeAdded: '10/13 22:35', firstPayment: '22:44', rail: 'External Transfer', leadTime: '9 min', attempted: '$3,100.18', outcome: 'Prevented' },
    { id: 'ATO-06', member: 'M1046', payeeAdded: '10/17 12:26', firstPayment: '12:31', rail: 'External Transfer', leadTime: '5 min', attempted: '$3,097.56', outcome: 'Prevented' },
    { id: 'ATO-07', member: 'M1047', payeeAdded: '10/12 19:23', firstPayment: '19:28', rail: 'External Transfer', leadTime: '5 min', attempted: '$2,452.57', outcome: 'Prevented' },
    { id: 'ATO-08', member: 'M1050', payeeAdded: '10/10 21:37', firstPayment: '21:41', rail: 'P2P', leadTime: '4 min', attempted: '$2,909.04', outcome: 'Prevented' },
    { id: 'ATO-09', member: 'M1058', payeeAdded: '10/16 20:11', firstPayment: '20:17', rail: 'External Transfer', leadTime: '6 min', attempted: '$2,960.47', outcome: 'Loss' },
    { id: 'ATO-10', member: 'M1105', payeeAdded: '10/08 13:05', firstPayment: '13:10', rail: 'P2P', leadTime: '5 min', attempted: '$3,199.34', outcome: 'Loss partly recovered' },
    { id: 'ATO-11', member: 'M1111', payeeAdded: '10/19 21:18', firstPayment: '21:25', rail: 'External Transfer', leadTime: '7 min', attempted: '$3,377.17', outcome: 'Loss' },
    { id: 'ATO-12', member: 'M1115', payeeAdded: '10/20 22:03', firstPayment: '22:12', rail: 'P2P', leadTime: '9 min', attempted: '$3,509.17', outcome: 'Prevented' },
  ];

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
                118 Evaluation Journeys
              </span>
            </div>
            <p className="text-xs text-[#E1F0F8]/90 mt-1 leading-relaxed max-w-3xl">
              Strict deterministic rule performance across 118 synthetic member evaluation journeys (12 takeover, 106 other).
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
              Headline Summary · Synthetic Data Evaluation
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#002D72] leading-normal">
              <strong>QUARANTINE</strong> fired on <strong>12 of 12</strong> takeover journeys, <strong>3–9 min</strong> before the first payment. <strong>0 of 106</strong> other members quarantined (36 other scams, 50 routine, 20 look-alikes). <strong>LIGHT</strong> fired on <strong>4 of 20</strong> look-alikes (M1039, M1041, M1051, M1114, all real movers). Takeover dollars in the data: <strong>$37,855.17</strong> attempted, <strong>$19,244.71</strong> sent, <strong>$15,665.88</strong> net loss.
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
                12 / 12
              </div>
              <div className="text-xs font-semibold text-[#067647] mt-1">
                Takeover Journeys Caught
              </div>
              <p className="text-[11px] text-[#054F31]/80 mt-1.5 leading-tight">
                Fired 3–9 min before the first payment upon recipient enrollment.
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
                0 / 106
              </div>
              <div className="text-xs font-semibold text-[#0082CA] mt-1">
                0 Quarantined (36 other scams, 50 routine, 20 look-alikes)
              </div>
              <p className="text-[11px] text-[#5B6B7A] mt-1.5 leading-tight">
                LIGHT fired on 4 of 20 look-alikes (M1039, M1041, M1051, M1114, all real movers).
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
                3 – 9 min
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
                $37,855.17
              </div>
              <div className="text-xs font-semibold text-[#1B2733] mt-1">
                Attempted in Takeover Data
              </div>
              <p className="text-[11px] text-[#5B6B7A] mt-1.5 leading-tight">
                $19,244.71 sent · $15,665.88 net loss across 12 takeover journeys.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-[#D0D9E2] flex items-center gap-4 text-xs font-semibold text-[#5B6B7A]">
            <button
              onClick={() => setActiveTab('summary')}
              className={`pb-2.5 cursor-pointer border-b-2 transition-colors ${
                activeTab === 'summary'
                  ? 'border-[#0082CA] text-[#002D72] font-bold'
                  : 'border-transparent hover:text-[#002D72]'
              }`}
            >
              Architectural Shift-Left Insight
            </button>
            <button
              onClick={() => setActiveTab('atoJourneys')}
              className={`pb-2.5 cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'atoJourneys'
                  ? 'border-[#0082CA] text-[#002D72] font-bold'
                  : 'border-transparent hover:text-[#002D72]'
              }`}
            >
              <span>12 Takeover Journeys</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                12/12
              </span>
            </button>
            <button
              onClick={() => setActiveTab('otherJourneys')}
              className={`pb-2.5 cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'otherJourneys'
                  ? 'border-[#0082CA] text-[#002D72] font-bold'
                  : 'border-transparent hover:text-[#002D72]'
              }`}
            >
              <span>106 Other Member Journeys</span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px]">
                0/106 quarantined
              </span>
            </button>
            <button
              onClick={() => setActiveTab('methodology')}
              className={`pb-2.5 cursor-pointer border-b-2 transition-colors ${
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
                  QUARANTINE fired on 12 of 12 takeover journeys, 3–9 min before the first payment.
                </span>
                <span className="font-bold text-[#067647]">12 / 12 Caught</span>
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
                    {atoJourneys.map((j) => (
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
                  0 of 106 other members quarantined (36 other scams, 50 routine, 20 look-alikes).
                </span>
                <span className="font-bold text-[#0082CA]">0 / 106 Quarantined</span>
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

          {/* Tab 4: Methodology */}
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
