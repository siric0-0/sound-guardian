import React, { useState } from 'react';
import { ShieldCheck, UserCheck, AlertTriangle, X, Check } from 'lucide-react';

interface TwoStaffApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmRelease: (approver1: string, approver2: string, reason: string) => void;
  amount: number;
  paymentId: string;
}

export const TwoStaffApprovalModal: React.FC<TwoStaffApprovalModalProps> = ({
  isOpen,
  onClose,
  onConfirmRelease,
  amount,
  paymentId,
}) => {
  const [approver1, setApprover1] = useState('E-4819 (Fraud Analyst J. Miller)');
  const [approver2, setApprover2] = useState('E-1044 (Operations Supervisor K. Vance)');
  const [reason, setReason] = useState(
    'Member verified in-person at branch with Washington State Real ID driver license; confirmed contact update legitimate.'
  );
  const [verifiedIdChecked, setVerifiedIdChecked] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedIdChecked) return;
    onConfirmRelease(approver1, approver2, reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#D0D9E2] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#002D72] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0082CA]" />
            <h3 className="font-serif font-bold text-base">
              Dual-Staff Release Authorization
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div className="bg-[#FFFAEB] border border-[#FEDF89] p-3 rounded-lg text-xs text-[#93370D] flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#B54708] mt-0.5" />
            <div>
              <span className="font-bold">Quarantine Security Protocol:</span> Release of a quarantined payment (${amount.toFixed(2)}) requires independent secondary employee sign-off following physical or out-of-band identity verification.
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B2733] mb-1">
              Primary Investigator ID & Name
            </label>
            <input
              type="text"
              value={approver1}
              onChange={(e) => setApprover1(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-[#D0D9E2] bg-white text-[#1B2733]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B2733] mb-1">
              Secondary Approving Supervisor ID & Name
            </label>
            <input
              type="text"
              value={approver2}
              onChange={(e) => setApprover2(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-[#D0D9E2] bg-white text-[#1B2733]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B2733] mb-1">
              Identity Verification Reason & Evidence Notes
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-[#D0D9E2] bg-white text-[#1B2733]"
              required
            />
          </div>

          <label className="flex items-start gap-2.5 text-xs text-[#1B2733] cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={verifiedIdChecked}
              onChange={(e) => setVerifiedIdChecked(e.target.checked)}
              className="mt-0.5 rounded border-[#D0D9E2] text-[#002D72] focus:ring-[#0082CA]"
            />
            <span>
              I certify that an official physical ID or pre-change out-of-band voice verification was conducted with the account owner.
            </span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D0D9E2]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-[#5B6B7A] hover:text-[#1B2733] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!verifiedIdChecked}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#067647] hover:bg-[#054F31] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Authorize & Release Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
