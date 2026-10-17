import React, { useState } from 'react';
import { CreditCard, Send, X, ShieldAlert, ArrowRight, Lock } from 'lucide-react';
import { TierType } from '../../types.ts';
import { QuarantineScreen } from './QuarantineScreen.tsx';

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAmount?: number;
  defaultRecipient?: string;
  defaultRail?: string;
  lang: 'en' | 'es';
  currentTier?: TierType;
  isPausedBeforeSend?: boolean;
  onAttemptSend: (amount: number, recipient: string, rail: string) => void;
  onRequestFastPath: () => void;
  maskedPhone?: string;
}

export const SendMoneyModal: React.FC<SendMoneyModalProps> = ({
  isOpen,
  onClose,
  defaultAmount = 1574.18,
  defaultRecipient = 'P2P: quick_transfer_p2p (REC_8821)',
  defaultRail = 'P2P',
  lang,
  currentTier,
  isPausedBeforeSend,
  onAttemptSend,
  onRequestFastPath,
  maskedPhone = '•••-•••-4821',
}) => {
  const isEs = lang === 'es';
  const [amount, setAmount] = useState(defaultAmount.toString());
  const [recipient, setRecipient] = useState(defaultRecipient);
  const [rail, setRail] = useState(defaultRail);
  const [memo, setMemo] = useState('Urgent transfer');
  const [hasClickedSubmit, setHasClickedSubmit] = useState(false);

  if (!isOpen) return null;

  const numericAmount = parseFloat(amount) || 0;
  const isQuarantined = currentTier === 'QUARANTINE' || isPausedBeforeSend;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasClickedSubmit(true);
    onAttemptSend(numericAmount, recipient, rail);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#D0D9E2] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#002D72] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0082CA] flex items-center justify-center text-white font-bold text-xs">
              Z
            </div>
            <div>
              <h3 className="font-serif font-bold text-base leading-tight">
                {isEs ? 'Enviar Dinero con Zelle®' : 'Send Money with Zelle®'}
              </h3>
              <p className="text-[11px] text-[#E1F0F8]/80">
                Sound Credit Union Mobile Banking · Fast, Easy & Free
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {/* If intercepted by quarantine, display quarantine intercept right above/replacing submit */}
          {hasClickedSubmit && isQuarantined ? (
            <QuarantineScreen
              amount={numericAmount}
              maskedPhone={maskedPhone}
              lang={lang}
              onAcknowledge={onClose}
              onRequestFastPath={onRequestFastPath}
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1B2733] mb-1">
                  {isEs ? 'Destinatario' : 'Recipient'}
                </label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#D0D9E2] bg-white text-[#1B2733]"
                >
                  <option value="P2P: quick_transfer_p2p (REC_8821)">
                    P2P: quick_transfer_p2p (REC_8821) — Enrolled 10:19 PM
                  </option>
                  <option value="ACH: Belltown Properties LLC (REC_4412)">
                    ACH: Belltown Properties LLC (REC_4412) — Enrolled Oct 6
                  </option>
                  <option value="Existing: Electric Utility Co">
                    Existing: Electric Utility Co (••••5519)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1B2733] mb-1">
                    {isEs ? 'Monto ($)' : 'Amount ($)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full text-sm font-bold font-tabular p-2.5 rounded-lg border border-[#D0D9E2] bg-white text-[#002D72]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B2733] mb-1">
                    {isEs ? 'Riel de pago' : 'Payment Rail'}
                  </label>
                  <select
                    value={rail}
                    onChange={(e) => setRail(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#D0D9E2] bg-white text-[#1B2733]"
                  >
                    <option value="P2P">P2P (Instant transfer)</option>
                    <option value="ACH">ACH (1-2 business days)</option>
                    <option value="Wire">Wire Transfer (Same-day)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B2733] mb-1">
                  {isEs ? 'Nota / Memo' : 'Memo (Optional)'}
                </label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#D0D9E2] bg-white text-[#1B2733]"
                />
              </div>

              {/* Review Panel */}
              <div className="bg-[#F4F8FA] rounded-lg p-3 border border-[#D0D9E2] text-xs space-y-1">
                <div className="flex justify-between text-[#5B6B7A]">
                  <span>From Account:</span>
                  <span className="font-semibold text-[#1B2733]">Primary Checking (••••1003)</span>
                </div>
                <div className="flex justify-between text-[#5B6B7A]">
                  <span>Available Balance:</span>
                  <span className="font-tabular font-medium text-[#1B2733]">$5,420.50</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[#5B6B7A] hover:text-[#1B2733] cursor-pointer"
                >
                  {isEs ? 'Cancelar' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#002D72] hover:bg-[#1F4A8C] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isEs ? `Enviar $${numericAmount.toFixed(2)}` : `Send $${numericAmount.toFixed(2)}`}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
