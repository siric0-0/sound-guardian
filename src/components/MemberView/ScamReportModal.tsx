import React, { useState, useEffect, useRef } from 'react';
import {
  AlertOctagon,
  PhoneCall,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Building2,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import { DemoEvent } from '../../types.ts';
import { t, translateEventType } from '../../lib/dictionary.ts';

interface ScamReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'es';
  memberId?: string;
  recentPayments?: DemoEvent[];
  onSubmitReport: (details: {
    reason: string;
    description: string;
    selectedPaymentIds: string[];
    contactMethod: 'phone' | 'branch';
    memberLast4: string;
  }) => void;
}

export const ScamReportModal: React.FC<ScamReportModalProps> = ({
  isOpen,
  onClose,
  lang,
  memberId = 'M1003',
  recentPayments = [],
  onSubmitReport,
}) => {
  const isEs = lang === 'es';
  const memberLast4 = (memberId.replace(/\D/g, '') || '1003').slice(-4);
  const caseId = `C-2026-${memberLast4}`;

  // Step 1: What happened?
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [additionalText, setAdditionalText] = useState<string>('');

  // Step 2: Which payment?
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [isNotSurePayment, setIsNotSurePayment] = useState<boolean>(false);

  // Step 3: How should we reach you?
  const [contactMethod, setContactMethod] = useState<'phone' | 'branch'>('phone');

  // Confirmation state
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Focus restoration ref
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  // Save active element when opening and restore when closing
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;
      // Reset state for new report
      setStep(1);
      setSelectedReason('');
      setAdditionalText('');
      setSelectedPayments([]);
      setIsNotSurePayment(false);
      setContactMethod('phone');
      setIsSubmitted(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      if (previouslyFocusedElementRef.current && previouslyFocusedElementRef.current.focus) {
        previouslyFocusedElementRef.current.focus();
      }
    }, 50);
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const togglePaymentSelection = (paymentId: string) => {
    setIsNotSurePayment(false);
    setSelectedPayments((prev) =>
      prev.includes(paymentId)
        ? prev.filter((id) => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleNotSureToggle = () => {
    setIsNotSurePayment(!isNotSurePayment);
    if (!isNotSurePayment) {
      setSelectedPayments([]);
    }
  };

  const handleSubmit = () => {
    if (!selectedReason) return;

    onSubmitReport({
      reason: selectedReason,
      description: additionalText,
      selectedPaymentIds: isNotSurePayment ? ['UNSURE'] : selectedPayments,
      contactMethod,
      memberLast4,
    });

    setIsSubmitted(true);
  };

  // Filter outgoing payments for this persona
  const outgoingPayments = recentPayments.filter(
    (ev) => (ev.amount && ev.amount > 0) || ev.event_type === 'Payment Initiated'
  );

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scam-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#D0D9E2] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#002D72] text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <AlertOctagon className="w-5 h-5 text-amber-400" />
            <h3 id="scam-modal-title" className="font-serif font-bold text-base">
              {t('scam_modal_title', lang)}
            </h3>
          </div>

          <button
            onClick={handleClose}
            className="flex items-center gap-1 p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 cursor-pointer text-xs font-semibold transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
            <span>{t('scam_close', lang)}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {!isSubmitted ? (
            <>
              {/* Progress Bar (Step X of 3) */}
              <div className="flex items-center justify-between text-xs font-semibold text-[#002D72] pb-2 border-b border-[#D0D9E2]">
                <span>
                  {t('scam_progress', lang, {
                    step,
                    title:
                      step === 1
                        ? t('scam_step1_title', lang)
                        : step === 2
                        ? t('scam_step2_title', lang)
                        : t('scam_step3_title', lang),
                  })}
                </span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`h-2 rounded-full transition-all ${
                        step === s
                          ? 'w-6 bg-[#002D72]'
                          : step > s
                          ? 'w-2 bg-[#0082CA]'
                          : 'w-2 bg-[#D0D9E2]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Compassionate reassurance pill */}
              <div className="p-3 bg-[#F4F8FA] rounded-xl border border-[#D0D9E2] text-xs text-[#5B6B7A]">
                {t('scam_reassurance', lang)}
              </div>

              {/* ================= STEP 1: What happened? ================= */}
              {step === 1 && (
                <div className="space-y-3">
                  <h4 className="font-serif font-bold text-sm text-[#002D72]">
                    {t('scam_step1_header', lang)}
                  </h4>

                  <div className="space-y-2 text-xs">
                    {[
                      {
                        key: 'scam_opt_account',
                        en: 'Someone got into my account',
                      },
                      {
                        key: 'scam_opt_scammer',
                        en: 'I sent money to someone I now think is a scammer',
                      },
                      {
                        key: 'scam_opt_other',
                        en: 'Something else',
                      },
                    ].map((opt) => {
                      const isSelected = selectedReason === opt.en;
                      return (
                        <div
                          key={opt.key}
                          onClick={() => setSelectedReason(opt.en)}
                          className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-[#002D72] bg-[#E1F0F8]/50 text-[#002D72] font-semibold shadow-2xs'
                              : 'border-[#D0D9E2] bg-white hover:bg-slate-50 text-[#1B2733]'
                          }`}
                        >
                          <span>{t(opt.key, lang)}</span>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-[#002D72] bg-[#002D72]' : 'border-slate-400'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2">
                    <label className="block text-[11px] font-semibold text-[#5B6B7A] mb-1">
                      {t('scam_details_label', lang)}
                    </label>
                    <textarea
                      rows={2}
                      value={additionalText}
                      onChange={(e) => setAdditionalText(e.target.value)}
                      placeholder={t('scam_details_placeholder', lang)}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#D0D9E2] bg-white text-[#1B2733] focus:border-[#002D72] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* ================= STEP 2: Which payment? ================= */}
              {step === 2 && (
                <div className="space-y-3">
                  <h4 className="font-serif font-bold text-sm text-[#002D72]">
                    {t('scam_step2_header', lang)}
                  </h4>
                  <p className="text-[11px] text-[#5B6B7A]">
                    {t('scam_which_payment_desc', lang)}
                  </p>

                  <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
                    {outgoingPayments.length > 0 ? (
                      outgoingPayments.map((ev) => {
                        const pid = ev.payment_id || ev.event_id;
                        const isChecked = selectedPayments.includes(pid);
                        return (
                          <div
                            key={pid}
                            onClick={() => togglePaymentSelection(pid)}
                            className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                              isChecked
                                ? 'border-[#002D72] bg-[#E1F0F8]/50 text-[#002D72] font-semibold shadow-2xs'
                                : 'border-[#D0D9E2] bg-white hover:bg-slate-50 text-[#1B2733]'
                            }`}
                          >
                            <div>
                              <div className="font-mono text-xs">{pid}</div>
                              <div className="text-[10px] text-[#5B6B7A]">
                                {translateEventType(ev.event_type, lang)} · {ev.payment_rail || 'P2P'} · {ev.event_timestamp.slice(0, 16)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {ev.amount && ev.amount > 0 && (
                                <span className="font-mono font-bold text-xs text-[#002D72]">
                                  ${ev.amount.toFixed(2)}
                                </span>
                              )}
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="w-4 h-4 text-[#002D72] rounded cursor-pointer"
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg text-slate-600 text-xs text-center">
                        {t('scam_no_payments', lang)}
                      </div>
                    )}

                    {/* "I'm not sure" option */}
                    <div
                      onClick={handleNotSureToggle}
                      className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isNotSurePayment
                          ? 'border-[#002D72] bg-[#E1F0F8]/50 text-[#002D72] font-semibold shadow-2xs'
                          : 'border-[#D0D9E2] bg-white hover:bg-slate-50 text-[#1B2733]'
                      }`}
                    >
                      <span className="text-xs">
                        {t('scam_not_sure', lang)}
                      </span>
                      <input
                        type="checkbox"
                        checked={isNotSurePayment}
                        onChange={() => {}}
                        className="w-4 h-4 text-[#002D72] rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ================= STEP 3: How should we reach you? ================= */}
              {step === 3 && (
                <div className="space-y-3">
                  <h4 className="font-serif font-bold text-sm text-[#002D72]">
                    {t('scam_step3_header', lang)}
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    {/* Call me */}
                    <div
                      onClick={() => setContactMethod('phone')}
                      className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                        contactMethod === 'phone'
                          ? 'border-[#002D72] bg-[#E1F0F8]/50 text-[#002D72] shadow-2xs'
                          : 'border-[#D0D9E2] bg-white hover:bg-slate-50 text-[#1B2733]'
                      }`}
                    >
                      <PhoneCall className="w-4 h-4 text-[#0082CA] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-bold">{t('scam_reach_call', lang)}</div>
                        <p className="text-[11px] text-[#5B6B7A] mt-0.5">
                          {t('scam_reach_call_desc', lang)}
                        </p>
                      </div>
                    </div>

                    {/* Visit a branch */}
                    <div
                      onClick={() => setContactMethod('branch')}
                      className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                        contactMethod === 'branch'
                          ? 'border-purple-600 bg-purple-50 text-purple-950 shadow-2xs'
                          : 'border-[#D0D9E2] bg-white hover:bg-slate-50 text-[#1B2733]'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <span>{t('scam_reach_branch', lang)}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-200 text-purple-900 border border-purple-300">
                            PRIORITY
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5B6B7A] mt-0.5">
                          {t('scam_reach_branch_desc', lang)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="pt-2 border-t border-[#D0D9E2] space-y-2">
                <div className="flex items-center gap-2">
                  {step > 1 && (
                    <button
                      onClick={() => setStep((s) => (s - 1) as 1 | 2)}
                      className="px-4 py-2.5 rounded-lg border border-[#D0D9E2] text-[#002D72] text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{t('back', lang)}</span>
                    </button>
                  )}

                  {step < 3 ? (
                    <button
                      onClick={() => setStep((s) => (s + 1) as 2 | 3)}
                      disabled={step === 1 && !selectedReason}
                      className={`flex-1 h-12 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                        step === 1 && !selectedReason
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-[#002D72] hover:bg-[#001D4A] text-white shadow-xs'
                      }`}
                    >
                      <span>{t('next', lang)}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    /* Step 3: Full-Width Navy Submit Report Button */
                    <button
                      onClick={handleSubmit}
                      disabled={!selectedReason}
                      className={`flex-1 h-12 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                        !selectedReason
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-[#002D72] hover:bg-[#001D4A] text-white shadow-xs'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{t('submit_report', lang)}</span>
                    </button>
                  )}
                </div>

                {/* Cancel text link */}
                <div className="text-center pt-1">
                  <button
                    onClick={handleClose}
                    className="text-xs text-[#5B6B7A] hover:text-[#1B2733] hover:underline cursor-pointer"
                  >
                    {t('cancel', lang)}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* ================= STEP 4: GREEN CONFIRMATION SCREEN ================= */
            <div className="bg-[#ECFDF3] border-2 border-[#A6F4C5] rounded-xl p-5 text-xs text-[#054F31] space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#D1FADF] text-[#067647] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 stroke-[2.2]" />
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-bold text-base text-[#054F31]">
                  {t('scam_submitted_title', lang)}
                </h4>

                {/* EXACT REQUIRED TEXT */}
                <p className="text-xs text-[#067647] leading-relaxed font-medium">
                  {t('scam_submitted_reassurance', lang, { caseId })}
                </p>
              </div>

              <div className="bg-white/80 rounded-lg p-3 border border-[#A6F4C5] text-[11px] text-[#054F31] space-y-1 text-left">
                <div>
                  <strong>{t('scam_status_label', lang)}</strong>{' '}
                  {contactMethod === 'branch'
                    ? t('scam_status_branch', lang)
                    : t('scam_status_call', lang)}
                </div>
                <div>
                  <strong>{t('scam_protection_label', lang)}</strong>{' '}
                  {t('scam_protection_notice', lang)}
                </div>
              </div>

              {/* [Done] Button that closes the panel */}
              <button
                onClick={handleClose}
                className="w-full h-12 rounded-lg bg-[#067647] hover:bg-[#054F31] text-white font-semibold text-xs cursor-pointer transition-colors shadow-xs"
              >
                {t('done', lang)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
