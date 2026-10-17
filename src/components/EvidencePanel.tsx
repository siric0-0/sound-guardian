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
  const [activeTab, setActiveTab] = useState<'summary' | 'atoJourneys' | 'legitimateJourneys' | 'methodology'>('summary');
  const [isExpanded, setIsExpanded] = useState(true);

  // 12 synthetic ATO test journeys
  const atoJourneys = [
    { id: 'ATO-01', member: 'MBR_7F3A (Sarah)', rail: 'P2P', amount: '$1,574.18', payeeAdded: '22:19', firstPayment: '22:22', leadTime: '3 min', ruleFired: 'Payee Added (22:19)', preventedLoss: '$3,006.33' },
    { id: 'ATO-02', member: 'MBR_1A92 (David)', rail: 'P2P', amount: '$2,100.00', payeeAdded: '19:40', firstPayment: '19:44', leadTime: '4 min', ruleFired: 'Payee Added (19:40)', preventedLoss: '$4,200.00' },
    { id: 'ATO-03', member: 'MBR_3C88 (Elena)', rail: 'P2P', amount: '$950.00', payeeAdded: '23:05', firstPayment: '23:14', leadTime: '9 min', ruleFired: 'Payee Added (23:05)', preventedLoss: '$1,900.00' },
    { id: 'ATO-04', member: 'MBR_8K42 (Marcus)', rail: 'ACH', amount: '$3,400.00', payeeAdded: '01:12', firstPayment: '01:18', leadTime: '6 min', ruleFired: 'Payee Added (01:12)', preventedLoss: '$3,400.00' },
    { id: 'ATO-05', member: 'MBR_9B10 (Chloe)', rail: 'P2P', amount: '$1,250.00', payeeAdded: '14:20', firstPayment: '14:25', leadTime: '5 min', ruleFired: 'Payee Added (14:20)', preventedLoss: '$2,500.00' },
    { id: 'ATO-06', member: 'MBR_5D19 (Thomas)', rail: 'Wire', amount: '$6,800.00', payeeAdded: '11:02', firstPayment: '11:09', leadTime: '7 min', ruleFired: 'Payee Added (11:02)', preventedLoss: '$6,800.00' },
    { id: 'ATO-07', member: 'MBR_2A77 (Rachel)', rail: 'P2P', amount: '$1,820.00', payeeAdded: '20:15', firstPayment: '20:18', leadTime: '3 min', ruleFired: 'Payee Added (20:15)', preventedLoss: '$3,640.00' },
    { id: 'ATO-08', member: 'MBR_6F51 (Brian)', rail: 'P2P', amount: '$2,450.00', payeeAdded: '18:30', firstPayment: '18:36', leadTime: '6 min', ruleFired: 'Payee Added (18:30)', preventedLoss: '$4,900.00' },
    { id: 'ATO-09', member: 'MBR_4B33 (Sophia)', rail: 'ACH', amount: '$4,100.00', payeeAdded: '09:45', firstPayment: '09:53', leadTime: '8 min', ruleFired: 'Payee Added (09:45)', preventedLoss: '$4,100.00' },
    { id: 'ATO-10', member: 'MBR_7E12 (Kevin)', rail: 'P2P', amount: '$1,650.00', payeeAdded: '21:50', firstPayment: '21:55', leadTime: '5 min', ruleFired: 'Payee Added (21:50)', preventedLoss: '$3,300.00' },
    { id: 'ATO-11', member: 'MBR_8J99 (Jessica)', rail: 'P2P', amount: '$890.00', payeeAdded: '22:40', firstPayment: '22:44', leadTime: '4 min', ruleFired: 'Payee Added (22:40)', preventedLoss: '$1,780.00' },
    { id: 'ATO-12', member: 'MBR_3D44 (Daniel)', rail: 'P2P', amount: '$1,920.00', payeeAdded: '16:10', firstPayment: '16:17', leadTime: '7 min', ruleFired: 'Payee Added (16:10)', preventedLoss: '$3,840.00' },
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
                Sound Guardian Evidence & Precision Evaluation
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                100% Precision
              </span>
            </div>
            <p className="text-xs text-[#E1F0F8]/90 mt-0.5">
              Strict deterministic rule performance across 116 synthetic member evaluation journeys.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
        <div className="p-4 sm:p-6 space-y-6">
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: ATO Detection */}
            <div className="bg-[#ECFDF3] border-2 border-[#A6F4C5] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#067647] uppercase tracking-wide">
                  ATO Journeys Caught
                </span>
                <CheckCircle2 className="w-4 h-4 text-[#067647]" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-tabular text-[#054F31]">
                12 / 12
              </div>
              <div className="text-xs font-semibold text-[#067647] mt-1">
                100% Sensitivity (Recall)
              </div>
              <p className="text-[11px] text-[#054F31]/80 mt-1.5 leading-tight">
                Strict rule caught every single account takeover attempt at payee addition.
              </p>
            </div>

            {/* Card 2: False Positive Rate */}
            <div className="bg-[#E1F0F8] border-2 border-[#0082CA]/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#002D72] uppercase tracking-wide">
                  False Positive Rate
                </span>
                <ShieldCheck className="w-4 h-4 text-[#0082CA]" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-tabular text-[#002D72]">
                0 / 104
              </div>
              <div className="text-xs font-semibold text-[#0082CA] mt-1">
                0.0% False Positive Rate
              </div>
              <p className="text-[11px] text-[#5B6B7A] mt-1.5 leading-tight">
                Zero legitimate members blocked. Movers route to LIGHT tier (8s one-tap).
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
                Step-up engages the second new payee is added, stopping funds before submit.
              </p>
            </div>

            {/* Card 4: P2P Capital Saved */}
            <div className="bg-[#F8F9FA] border-2 border-[#D0D9E2] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#1B2733] uppercase tracking-wide">
                  Irrevocable P2P Rails
                </span>
                <TrendingUp className="w-4 h-4 text-[#002D72]" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-tabular text-[#002D72]">
                $42,666
              </div>
              <div className="text-xs font-semibold text-[#067647] mt-1">
                Total Synthetic Loss Prevented
              </div>
              <p className="text-[11px] text-[#5B6B7A] mt-1.5 leading-tight">
                P2P cannot be recalled after network submission. Shift-left saves 100%.
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
              <span>12 ATO Journeys Caught</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                12/12
              </span>
            </button>
            <button
              onClick={() => setActiveTab('legitimateJourneys')}
              className={`pb-2.5 cursor-pointer border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'legitimateJourneys'
                  ? 'border-[#0082CA] text-[#002D72] font-bold'
                  : 'border-transparent hover:text-[#002D72]'
              }`}
            >
              <span>104 Legitimate Journeys Tested</span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px]">
                0/104 false
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
                      <strong className="text-[#002D72]">P2P Cannot Be Paused After Submit:</strong> Once a Zelle or P2P transfer enters clearing, settlement is irreversible within milliseconds. No fraud recall mechanism exists on P2P rails.
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
                      <strong className="text-[#002D72]">Average 3 to 9 Minutes Earlier:</strong> In Sarah's journey, the payee was added at 22:19. The payment attempts happened at 22:22 and 22:30. Sound Guardian blocked the attack 3 full minutes before money was even typed into the form.
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

          {/* Tab 2: 12 ATO Journeys */}
          {activeTab === 'atoJourneys' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#5B6B7A]">
                  Every takeover journey contained the ATO signature: Password Reset + Dual Contact Change (Email/Phone) + New Payee Enrollment.
                </span>
                <span className="text-xs font-bold text-[#067647]">12 / 12 Caught</span>
              </div>
              <div className="overflow-x-auto border border-[#D0D9E2] rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F4F8FA] border-b border-[#D0D9E2] font-semibold text-[#002D72]">
                      <th className="py-2.5 px-3">Journey ID</th>
                      <th className="py-2.5 px-3">Member Token</th>
                      <th className="py-2.5 px-3">Rail</th>
                      <th className="py-2.5 px-3">Payee Added</th>
                      <th className="py-2.5 px-3">1st Payment</th>
                      <th className="py-2.5 px-3">Lead Time</th>
                      <th className="py-2.5 px-3">Shift-Left Trigger</th>
                      <th className="py-2.5 px-3">Loss Prevented</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D0D9E2]">
                    {atoJourneys.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono font-bold text-[#002D72]">{j.id}</td>
                        <td className="py-2 px-3 font-mono">{j.member}</td>
                        <td className="py-2 px-3 font-medium">{j.rail}</td>
                        <td className="py-2 px-3 font-mono text-[#B42318] font-semibold">{j.payeeAdded}</td>
                        <td className="py-2 px-3 font-mono text-slate-500">{j.firstPayment}</td>
                        <td className="py-2 px-3">
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <Clock className="w-3 h-3" />
                            <span>{j.leadTime}</span>
                          </span>
                        </td>
                        <td className="py-2 px-3 text-[#067647] font-semibold">{j.ruleFired}</td>
                        <td className="py-2 px-3 font-tabular font-bold text-[#002D72]">{j.preventedLoss}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: 104 Legitimate Journeys */}
          {activeTab === 'legitimateJourneys' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#5B6B7A]">
                  Tested against diverse normal member behavioral profiles across 104 synthetic event streams.
                </span>
                <span className="font-bold text-[#0082CA]">0 / 104 False Positives (0.0%)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#F4F8FA] p-3.5 rounded-lg border border-[#D0D9E2] space-y-1">
                  <div className="font-bold text-[#002D72]">Legitimate Movers (42 cases)</div>
                  <p className="text-[#5B6B7A] text-[11px] leading-relaxed">
                    Address changes accompanied by password resets routed strictly to LIGHT tier. Resolved via one-tap "Was this you?" in an average of 8–14 seconds.
                  </p>
                </div>
                <div className="bg-[#F4F8FA] p-3.5 rounded-lg border border-[#D0D9E2] space-y-1">
                  <div className="font-bold text-[#002D72]">Routine Payee Additions (38 cases)</div>
                  <p className="text-[#5B6B7A] text-[11px] leading-relaxed">
                    Adding friends or billers without preceding credentials/phone changes processed instantaneously without step-up interference.
                  </p>
                </div>
                <div className="bg-[#F4F8FA] p-3.5 rounded-lg border border-[#D0D9E2] space-y-1">
                  <div className="font-bold text-[#002D72]">Assisted Branch/Wire Transfers (24 cases)</div>
                  <p className="text-[#5B6B7A] text-[11px] leading-relaxed">
                    Large cash or wire requests guided by human teller protocols, voluntary trusted contacts, and inquiry notes without unwarranted digital blocks.
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
