import React, { useState } from 'react';
import {
  Building2,
  PhoneCall,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Shield,
  UserCheck,
} from 'lucide-react';
import { tokenizeMemberId } from '../../lib/tokenization.ts';

interface BranchModeProps {
  memberId: string;
  isCancelled: boolean;
  onTellerAskQuestion: () => void;
  onMemberCancelWithdrawal: () => void;
  onMemberProceed: () => void;
  onOpenScamReport: () => void;
}

export const BranchMode: React.FC<BranchModeProps> = ({
  memberId,
  isCancelled,
  onTellerAskQuestion,
  onMemberCancelWithdrawal,
  onMemberProceed,
  onOpenScamReport,
}) => {
  const memberToken = tokenizeMemberId(memberId);
  const [askedQuestion, setAskedQuestion] = useState(false);

  const handleAsk = () => {
    setAskedQuestion(true);
    onTellerAskQuestion();
  };

  return (
    <div className="bg-white rounded-xl border border-[#D0D9E2] shadow-xs p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D0D9E2]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#002D72] text-white">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-lg text-[#002D72]">
                Branch Teller Console · In-Person Transaction Mode
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {memberToken}
              </span>
            </div>
            <p className="text-xs text-[#5B6B7A]">
              Tacoma Branch · Teller Station #3 · Member In-Person
            </p>
          </div>
        </div>

        {/* Phase 2 Label */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200 self-start sm:self-auto">
          <Shield className="w-3.5 h-3.5 text-purple-600" />
          <span>Phase 2: Authorized-Scam Layer + Optional Trusted Contact</span>
        </div>
      </div>

      {/* Honest Miss Notice */}
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 space-y-2">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
          <span>Honest Evaluation: Digital ATO Rules Did Not Fire</span>
        </div>
        <p className="text-xs text-amber-900 leading-relaxed">
          Because the scammer coerced the member to withdraw funds themselves, there was no digital password reset, no email change, and no online recipient enrolled. Sound Guardian’s automated credential rules correctly did not trigger.
        </p>
        <p className="text-xs font-semibold text-amber-950">
          However, cross-channel intelligence and employee assisted notes empower the teller to intervene before cash leaves the branch.
        </p>
      </div>

      {/* Cross-Channel Context: Contact Center Note from Oct 14 */}
      <div className="bg-[#F4F8FA] rounded-xl border border-[#D0D9E2] p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#002D72] flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-[#0082CA]" />
            <span>Assisted Note from Contact Center (Oct 14, 11:30 AM):</span>
          </span>
          <span className="text-[11px] text-[#5B6B7A]">Logged 28 hours prior</span>
        </div>
        <blockquote className="bg-white p-3 rounded-lg border border-[#D0D9E2] text-xs text-[#1B2733] italic leading-relaxed">
          "Member called inquiring about maximum daily cash withdrawal limits and how fast a domestic wire arrives. Member sounded hurried, anxious, and hesitated when asked the purpose."
        </blockquote>
      </div>

      {/* Current Branch Action Details */}
      <div className="border border-[#D0D9E2] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-[#D0D9E2]">
          <span className="font-semibold text-[#1B2733]">Requested Branch Transaction:</span>
          <span className="font-tabular font-bold text-sm text-[#002D72]">$7,000.00 Cash Withdrawal</span>
        </div>

        {/* Teller Prompt Box */}
        <div className="bg-[#E1F0F8] rounded-xl border-2 border-[#0082CA] p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#002D72] uppercase tracking-wide">
            <MessageSquare className="w-4 h-4 text-[#0082CA]" />
            <span>Next-Best-Action Script for Branch Teller</span>
          </div>

          <p className="text-xs sm:text-sm font-serif font-medium text-[#002D72] bg-white p-3.5 rounded-lg border border-[#0082CA]/30 leading-relaxed">
            "Mr. James, before we count this cash, we care deeply about protecting our members. Has anyone told you to keep this transaction secret, or instructed you to stay on the phone right now?"
          </p>

          <div className="flex items-center gap-2">
            {!askedQuestion ? (
              <button
                onClick={handleAsk}
                className="px-4 py-2 rounded-lg bg-[#0082CA] hover:bg-[#002D72] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Ask Member This Question
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#067647]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Question Asked to Member</span>
              </span>
            )}
          </div>
        </div>

        {/* Member Decision Section */}
        <div className="pt-2 space-y-2">
          <div className="text-xs font-semibold text-[#1B2733]">
            Member's Response & Autonomous Decision:
          </div>

          {!isCancelled ? (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onMemberCancelWithdrawal}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#067647] hover:bg-[#054F31] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Member Cancels Withdrawal (Funds Kept Safe)</span>
              </button>

              <button
                onClick={onMemberProceed}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#F4F8FA] hover:bg-[#E1F0F8] text-[#5B6B7A] border border-[#D0D9E2] text-xs font-medium cursor-pointer"
              >
                <span>Member Insists on Cash</span>
              </button>
            </div>
          ) : (
            <div className="bg-[#ECFDF3] border border-[#A6F4C5] p-3.5 rounded-lg space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#067647]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Withdrawal Cancelled at 16:55 (Data Historical Record Verified)</span>
              </div>
              <p className="text-xs text-[#054F31]">
                Mr. James realized the caller was an imposter, ended the phone call, and kept his $7,000 safely in his account.
              </p>
              <div className="pt-2">
                <button
                  onClick={onOpenScamReport}
                  className="text-xs font-semibold text-[#0082CA] underline hover:text-[#002D72] cursor-pointer"
                >
                  File Imposter Incident Report & Check Trusted Contact Enrollment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
