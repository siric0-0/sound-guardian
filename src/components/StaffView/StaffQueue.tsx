import React from 'react';
import { TierBadge } from '../TierBadge.tsx';
import {
  Clock,
  AlertTriangle,
  Moon,
  ArrowRight,
  Shield,
  Building2,
  Calendar,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { TierType } from '../../types.ts';

export interface QueueItem {
  paymentId: string;
  memberId: string;
  memberToken: string;
  amount: number;
  rail: string;
  tier: TierType;
  reasonCode: string;
  reasonPlain: string;
  timeLeft: string;
  isAfterHours: boolean;
  isNextBusinessHours?: boolean;
  branchPriority?: boolean;
  existingRiskScore: number;
  flaggedEvents: { id: string; time: string; type: string; detail: string }[];
  status: 'HELD' | 'RELEASED' | 'STOPPED';
  timestamp: string;
}

interface StaffQueueProps {
  queueItems: QueueItem[];
  selectedPaymentId: string;
  onSelectPayment: (paymentId: string) => void;
}

export const StaffQueue: React.FC<StaffQueueProps> = ({
  queueItems,
  selectedPaymentId,
  onSelectPayment,
}) => {
  // Sort queue items: Branch requests to the very top, then active holds, then newest
  const sortedQueue = [...queueItems].sort((a, b) => {
    if (a.branchPriority && !b.branchPriority) return -1;
    if (!a.branchPriority && b.branchPriority) return 1;
    if (a.status === 'HELD' && b.status !== 'HELD') return -1;
    if (a.status !== 'HELD' && b.status === 'HELD') return 1;
    return 0;
  });

  return (
    <div className="bg-white rounded-xl border border-[#D0D9E2] shadow-xs overflow-hidden mb-6">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#D0D9E2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F4F8FA]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-base text-[#002D72] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0082CA]" />
              <span>Fraud Operations & Held Payment Queue</span>
            </h3>
            {sortedQueue.some((q) => q.branchPriority) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300 animate-pulse">
                <Building2 className="w-3 h-3 text-purple-700" />
                <span>Branch Priority Active</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#5B6B7A] mt-0.5">
            Displaying deterministic reason codes and flagged events alongside existing risk scores. In-person branch requests sorted to top.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E1F0F8] text-[#002D72]">
            {sortedQueue.filter((q) => q.status === 'HELD').length} Active Holds
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
            {sortedQueue.filter((q) => q.branchPriority).length} In-Branch Requests
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#D0D9E2] bg-white text-[#5B6B7A] font-semibold">
              <th className="py-3 px-4">Member Token & Priority</th>
              <th className="py-3 px-4">Amount & Rail</th>
              <th className="py-3 px-4">Existing Risk Score & Reason Code</th>
              <th className="py-3 px-4">Exact Flagged Events</th>
              <th className="py-3 px-4">Hold Expiry & Queue</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D0D9E2]">
            {sortedQueue.map((item) => {
              const isSelected = selectedPaymentId === item.paymentId;
              return (
                <tr
                  key={item.paymentId}
                  onClick={() => onSelectPayment(item.paymentId)}
                  className={`cursor-pointer transition-colors ${
                    item.branchPriority
                      ? isSelected
                        ? 'bg-purple-100/70 border-l-4 border-purple-600'
                        : 'bg-purple-50/50 hover:bg-purple-100/40 border-l-4 border-purple-500'
                      : isSelected
                      ? 'bg-[#E1F0F8]/70 border-l-4 border-[#0082CA]'
                      : 'hover:bg-[#F4F8FA] bg-white'
                  }`}
                >
                  {/* Member Token & Priority */}
                  <td className="py-3 px-4 align-top">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-tabular font-mono font-bold text-[#002D72]">
                          {item.memberToken}
                        </span>
                        {item.branchPriority && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-purple-600 text-white font-bold tracking-wide shadow-2xs">
                            <Building2 className="w-3 h-3" />
                            <span>BRANCH PRIORITY</span>
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] text-[#5B6B7A] font-mono">
                        {item.paymentId}
                      </span>

                      {item.isAfterHours && (
                        <span
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-medium w-max"
                          title="Initiated after 8:00 PM"
                        >
                          <Moon className="w-2.5 h-2.5 text-slate-500" />
                          <span>After-Hours (10:22 PM)</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Amount & Rail */}
                  <td className="py-3 px-4 align-top">
                    <div className="font-tabular font-bold text-sm text-[#1B2733]">
                      ${item.amount.toFixed(2)}
                    </div>
                    <div className="text-[11px] font-semibold text-[#0082CA]">{item.rail}</div>
                    <div className="mt-1">
                      <TierBadge tier={item.tier} size="sm" />
                    </div>
                  </td>

                  {/* Existing Risk Score NEXT TO Reason Code */}
                  <td className="py-3 px-4 align-top max-w-xs">
                    <div className="space-y-1.5">
                      {/* Side by side: Existing legacy risk score & deterministic reason code */}
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-[11px]">
                          <span className="text-[#5B6B7A] font-medium">Risk Score:</span>
                          <span
                            className={`font-mono font-bold ${
                              item.existingRiskScore >= 75
                                ? 'text-red-700'
                                : item.existingRiskScore >= 40
                                ? 'text-amber-700'
                                : 'text-emerald-700'
                            }`}
                          >
                            {item.existingRiskScore}/100
                          </span>
                        </div>

                        <span className="text-slate-300">|</span>

                        <span className="font-mono text-[11px] font-bold text-[#002D72] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {item.reasonCode}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#5B6B7A] leading-relaxed">
                        {item.reasonPlain}
                      </p>
                    </div>
                  </td>

                  {/* Exact Flagged Events */}
                  <td className="py-3 px-4 align-top">
                    <div className="flex flex-col gap-1 max-w-[260px]">
                      {item.flaggedEvents.map((ev, i) => (
                        <div
                          key={ev.id || i}
                          className="flex items-center gap-1.5 text-[10px] bg-[#F4F8FA] px-2 py-1 rounded border border-[#D0D9E2]"
                        >
                          <span className="font-mono text-slate-500 font-semibold shrink-0">
                            {ev.time}
                          </span>
                          <span className="font-bold text-[#002D72] shrink-0">{ev.type}</span>
                          <span className="text-[#5B6B7A] truncate" title={ev.detail}>
                            {ev.detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Hold Expiry & Automated Status */}
                  <td className="py-3 px-4 align-top">
                    <div className="space-y-1 text-[11px]">
                      <div className="flex items-center gap-1 font-tabular text-[#1B2733] font-semibold">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{item.status === 'HELD' ? item.timeLeft : 'Resolved'}</span>
                      </div>

                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-200">
                        Next Business Hours (8 AM)
                      </span>

                      {item.status !== 'HELD' && (
                        <div
                          className={`font-bold text-[10px] mt-0.5 ${
                            item.status === 'STOPPED'
                              ? 'text-[#B42318]'
                              : 'text-[#067647]'
                          }`}
                        >
                          [{item.status}]
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Action link */}
                  <td className="py-3 px-4 align-top text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPayment(item.paymentId);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0082CA] hover:text-[#002D72] cursor-pointer"
                    >
                      <span>Investigate</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
