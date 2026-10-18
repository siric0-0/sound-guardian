import React, { useState, useEffect, useMemo } from 'react';
import {
  DemoEvent,
  ArbiterDecision,
  SentrySignals,
  ScenarioId,
} from '../../types.ts';
import {
  Home,
  Send,
  List,
  HelpCircle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Lock,
  PhoneCall,
  Building2,
  AlertTriangle,
  ArrowRight,
  CreditCard,
  ChevronRight,
  Clock,
  X,
  ArrowLeft,
  Signal,
  Wifi,
  Battery,
} from 'lucide-react';
import { maskPhone } from '../../lib/tokenization.ts';
import { SarahDualPhoneView } from './SarahDualPhoneView.tsx';
import { t, translateEventType, translateChannel } from '../../lib/dictionary.ts';

interface PhoneAppProps {
  scenarioId: ScenarioId;
  stepIndex?: number;
  events: DemoEvent[];
  currentEvent: DemoEvent;
  decision?: ArbiterDecision | null;
  signals?: SentrySignals | null;
  lang: 'en' | 'es';
  largeText: boolean;
  memberActions: {
    frozen?: boolean;
    confirmedMover?: boolean;
    cancelledJames?: boolean;
    fastPathRequested?: boolean;
    scamReported?: boolean;
    branchPriority?: boolean;
  };
  onFreezeAndRecover: () => void;
  onConfirmLegitimate: () => void;
  onConfirmMoverYes: () => void;
  onConfirmMoverNo: () => void;
  onOpenScamModal: () => void;
  onRequestAtBranch?: () => void;
  onRequestFastPath?: () => void;
  onSwitchToStaffConsole?: (tab?: 'branch' | 'cases' | 'dashboard') => void;
  onReturnToStories?: () => void;
  activeTab: 'home' | 'pay' | 'activity' | 'help';
  setActiveTab: (tab: 'home' | 'pay' | 'activity' | 'help') => void;
  payStep: 1 | 2 | 3 | 4;
  setPayStep: (step: 1 | 2 | 3 | 4) => void;
}

export const PhoneApp: React.FC<PhoneAppProps> = ({
  scenarioId,
  stepIndex,
  events,
  currentEvent,
  decision,
  signals,
  lang,
  largeText,
  memberActions,
  onFreezeAndRecover,
  onConfirmLegitimate,
  onConfirmMoverYes,
  onConfirmMoverNo,
  onOpenScamModal,
  onRequestAtBranch,
  onRequestFastPath,
  onSwitchToStaffConsole,
  onReturnToStories,
  activeTab,
  setActiveTab,
  payStep,
  setPayStep,
}) => {
  const isEs = lang === 'es';
  const [selectedActivityItem, setSelectedActivityItem] = useState<DemoEvent | null>(null);

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isQuarantine = decision?.tier === 'QUARANTINE';
  const isLight = decision?.tier === 'LIGHT';
  const isFrozen = !!memberActions.frozen;
  const isMoverConfirmed = !!memberActions.confirmedMover;
  const isJamesCancelled = !!memberActions.cancelledJames;

  // Extract persona's payment data row from CSV
  const paymentRow = useMemo(() => {
    return (
      events.find((e) => e.event_type === 'Payment Initiated' && e.amount > 0) ||
      events.find((e) => e.amount > 0)
    );
  }, [events]);

  const payeeName = useMemo(() => {
    if (scenarioId === 'mover_legitimate') return 'Belltown Properties LLC';
    if (scenarioId === 'james_branch') return 'Cash Withdrawal (Branch)';
    return 'quick_transfer_p2p (REC_8821)';
  }, [scenarioId]);

  const paymentAmount = useMemo(() => {
    if (paymentRow?.amount && paymentRow.amount > 0) return paymentRow.amount;
    if (currentEvent.amount && currentEvent.amount > 0) return currentEvent.amount;
    if (scenarioId === 'sarah_ato') return 1574.18;
    if (scenarioId === 'mover_legitimate') return 4151.68;
    if (scenarioId === 'james_branch') return 7000.0;
    return 1574.18;
  }, [paymentRow, currentEvent.amount, scenarioId]);

  const paymentRail = useMemo(() => {
    if (paymentRow?.payment_rail) return paymentRow.payment_rail;
    if (scenarioId === 'mover_legitimate') return 'ACH';
    if (scenarioId === 'james_branch') return 'Cash';
    return 'P2P';
  }, [paymentRow, scenarioId]);

  const checkingBalance = currentEvent.available_balance_after || 5420.50;

  // Recent 3 items for Home
  const recentThreeItems = useMemo(() => {
    return [...events]
      .filter((e) => e.event_sequence <= (currentEvent.event_sequence || 1))
      .slice(-3)
      .reverse();
  }, [events, currentEvent.event_sequence]);

  // =========================================================================
  // SARAH ATO STORY: RENDER TWO PHONES SIDE BY SIDE
  // =========================================================================
  if (scenarioId === 'sarah_ato') {
    const stepIdx =
      typeof stepIndex === 'number'
        ? stepIndex
        : events.findIndex((e) => e.event_id === currentEvent.event_id) >= 0
        ? events.findIndex((e) => e.event_id === currentEvent.event_id)
        : currentEvent.event_sequence
        ? currentEvent.event_sequence - 1
        : 0;

    return (
      <SarahDualPhoneView
        events={events}
        currentEvent={currentEvent}
        stepIndex={stepIdx}
        lang={lang}
        largeText={largeText}
        memberActions={memberActions}
        onFreezeAndRecover={onFreezeAndRecover}
        onConfirmLegitimate={onConfirmLegitimate}
        onOpenScamModal={onOpenScamModal}
        onRequestAtBranch={onRequestAtBranch}
        onSwitchToStaffConsole={onSwitchToStaffConsole}
        onReturnToStories={onReturnToStories}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    );
  }

  return (
    <div
      className={
        isMobile
          ? "w-full max-w-full bg-white relative flex flex-col"
          : "relative select-none mx-auto transition-all duration-150 border-[10px] border-slate-900 rounded-[44px] shadow-2xl bg-slate-900"
      }
      style={
        isMobile
          ? { width: '100%', height: 'auto', minHeight: 'calc(100vh - 140px)' }
          : {
              height: 'min(780px, calc(100vh - 170px))',
              aspectRatio: '9 / 19.5',
              width: 'auto',
            }
      }
    >
      {/* Screen inside radius 34px (none on mobile) */}
      <div className={`w-full h-full ${isMobile ? 'rounded-none' : 'rounded-[34px]'} overflow-hidden flex flex-col bg-white relative`}>
        {/* Dynamic-island pill centered at the top (120×30, black) - hidden on mobile */}
        {!isMobile && (
          <div className="w-[120px] h-[30px] bg-black rounded-full absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center justify-between px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900/60" />
          </div>
        )}

        {/* Status bar 44px tall: time left, signal/wifi/battery icons right (use lucide icons, not "5G 100%" text) */}
        <div className="h-[44px] bg-[#002D72] text-white px-6 flex items-center justify-between text-xs font-semibold shrink-0 relative z-20">
          <span className="font-mono text-xs pl-1">9:41</span>
          <div className="flex items-center gap-1.5 pr-1">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* App Header */}
        <div className="bg-[#002D72] text-white px-4 py-2 flex items-center justify-between shrink-0 border-b border-[#001D4A]">
          <div>
            <span className="font-serif font-bold text-sm tracking-tight block">
              Sound Credit Union
            </span>
            <span className="text-[10px] text-[#E1F0F8]/80">
              {t('brand_sub', lang)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onReturnToStories && (
              <button
                onClick={onReturnToStories}
                className="text-[10px] bg-white/10 hover:bg-white/20 text-[#E1F0F8] px-2 py-1 rounded transition-colors cursor-pointer"
                title="Return to story selector"
              >
                {t('exit', lang)}
              </button>
            )}
            <div className="w-7 h-7 rounded-full bg-[#0082CA] text-white flex items-center justify-center font-bold text-xs">
              S
            </div>
          </div>
        </div>

        {/* Content area scrolls inside the screen only; base font 15px inside the phone; large-text scales content */}
        <div
          className="flex-1 overflow-y-auto p-4 bg-[#F4F8FA]"
          style={{ fontSize: largeText ? '17px' : '15px' }}
        >
        {/* ================= HOME TAB ================= */}
        {activeTab === 'home' && (
          <div className="space-y-3.5">
            {/* Balance Card */}
            <div className="bg-white rounded-xl p-4 border border-[#D0D9E2] shadow-2xs">
              <span className="text-[11px] font-medium text-[#5B6B7A] block">
                {t('balance_available', lang)}
              </span>
              <div className="font-mono text-2xl font-bold text-[#002D72] tracking-tight mt-0.5">
                ${checkingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="mt-2 pt-2 border-t border-[#D0D9E2] flex items-center justify-between text-xs text-[#5B6B7A]">
                <span>{t('classic_checking', lang)}</span>
                <span className="font-mono font-semibold text-[#1B2733]">
                  ${checkingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Alert Card: Quarantine Alert */}
            {isQuarantine && !isFrozen && (
              <div className="bg-[#FEF3F2] border-2 border-[#FECDCA] rounded-xl p-3.5 text-xs text-[#7A271A] space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#912018]">
                  <ShieldAlert className="w-4 h-4 text-[#B42318] shrink-0" />
                  <span>{t('home_quarantine_title', lang)}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {t('home_quarantine_body', lang)}
                </p>
                <button
                  onClick={() => {
                    setActiveTab('pay');
                    setPayStep(3);
                  }}
                  className="w-full py-2 rounded-lg bg-[#B42318] hover:bg-[#912018] text-white font-semibold text-xs text-center cursor-pointer transition-colors shadow-2xs"
                >
                  {t('home_quarantine_btn', lang)}
                </button>
              </div>
            )}

            {/* Alert Card: Light Tier Check */}
            {isLight && !isMoverConfirmed && (
              <div className="bg-[#FFFAEB] border-2 border-[#FEDF89] rounded-xl p-3.5 text-xs text-[#7A2E0E] space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#B54708]">
                  <ShieldCheck className="w-4 h-4 text-[#B54708] shrink-0" />
                  <span>{t('home_light_title', lang)}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {t('home_light_body', lang, { amount: `$${paymentAmount.toFixed(2)}`, payee: payeeName })}
                </p>
                <button
                  onClick={() => {
                    setActiveTab('pay');
                    setPayStep(3);
                  }}
                  className="w-full py-2 rounded-lg bg-[#067647] hover:bg-[#054F31] text-white font-semibold text-xs text-center cursor-pointer transition-colors shadow-2xs"
                >
                  {t('home_light_btn', lang)}
                </button>
              </div>
            )}

            {/* Alert Card: Account Secured */}
            {isFrozen && (
              <div className="bg-[#ECFDF3] border-2 border-[#A6F4C5] rounded-xl p-3.5 text-xs text-[#054F31] space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-[#067647]">
                  <CheckCircle2 className="w-4 h-4 text-[#067647] shrink-0" />
                  <span>{t('home_secured_title', lang)}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {t('home_secured_body', lang)}
                </p>
              </div>
            )}

            {/* 3 Recent Items */}
            <div className="bg-white rounded-xl p-3.5 border border-[#D0D9E2] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#002D72]">
                <span>{t('recent_activity', lang)}</span>
                <button
                  onClick={() => setActiveTab('activity')}
                  className="text-[11px] text-[#0082CA] hover:underline cursor-pointer"
                >
                  {t('view_all', lang)}
                </button>
              </div>
              <div className="divide-y divide-[#D0D9E2]">
                {recentThreeItems.map((ev) => (
                  <div
                    key={ev.event_id}
                    onClick={() => {
                      setSelectedActivityItem(ev);
                      setActiveTab('activity');
                    }}
                    className="py-2 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 px-1 rounded transition-colors"
                  >
                    <div>
                      <div className="font-medium text-[#1B2733]">{translateEventType(ev.event_type, lang)}</div>
                      <div className="text-[10px] text-[#5B6B7A]">{ev.event_timestamp.slice(11, 16)} · {translateChannel(ev.channel, lang)}</div>
                    </div>
                    {ev.amount && ev.amount > 0 ? (
                      <span className="font-mono font-semibold text-[#002D72]">
                        -${ev.amount.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#5B6B7A]">{t('info', lang)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action to Pay (or Note for James) */}
            {scenarioId === 'james_branch' ? (
              <button
                onClick={() => setActiveTab('pay')}
                className="w-full h-12 rounded-lg bg-[#002D72] hover:bg-[#001D4A] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <Building2 className="w-4 h-4 text-[#0082CA]" />
                <span>{t('check_digital_payments', lang)}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setActiveTab('pay');
                  setPayStep(1);
                }}
                className="w-full h-12 rounded-lg bg-[#002D72] hover:bg-[#001D4A] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{t('send_money', lang)}</span>
              </button>
            )}
          </div>
        )}

        {/* ================= PAY TAB ================= */}
        {activeTab === 'pay' && (
          <div className="space-y-4">
            {/* SPECIAL CASE: JAMES HAS NO DIGITAL PAYMENT */}
            {scenarioId === 'james_branch' ? (
              <div className="bg-white rounded-xl p-5 border border-[#D0D9E2] text-center space-y-4 shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-base text-[#002D72]">
                    {t('no_digital_title', lang)}
                  </h3>
                  <p className="text-xs text-[#5B6B7A] leading-relaxed max-w-xs mx-auto">
                    {t('no_digital_body', lang)}
                  </p>
                </div>
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      if (onSwitchToStaffConsole) {
                        onSwitchToStaffConsole('branch');
                      }
                    }}
                    className="w-full h-12 rounded-lg bg-[#002D72] hover:bg-[#001D4A] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>{t('open_branch_mode', lang)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="w-full text-xs text-[#0082CA] hover:underline cursor-pointer py-1"
                  >
                    {t('return_to_home', lang)}
                  </button>
                </div>
              </div>
            ) : (
              /* REGULAR 4-STEP PAY FLOW FOR SARAH & MOVER */
              <>
                {/* Progress Dot Row */}
                <div className="bg-white rounded-xl p-3 border border-[#D0D9E2] flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#002D72]">
                    {t('step_progress', lang, {
                      step: payStep,
                      label:
                        payStep === 1
                          ? t('step_payee', lang)
                          : payStep === 2
                          ? t('step_amount', lang)
                          : payStep === 3
                          ? t('step_review', lang)
                          : t('step_result', lang),
                    })}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`w-2 h-2 rounded-full transition-all ${
                          payStep === step
                            ? 'w-5 bg-[#002D72]'
                            : payStep > step
                            ? 'bg-[#0082CA]'
                            : 'bg-[#D0D9E2]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* STEP 1: PAYEE */}
                {payStep === 1 && (
                  <div className="bg-white rounded-xl p-4 border border-[#D0D9E2] space-y-4">
                    <div>
                      <h3 className="font-serif font-bold text-sm text-[#002D72]">
                        {t('payee_heading', lang)}
                      </h3>
                      <p className="text-[11px] text-[#5B6B7A]">
                        {t('payee_subheading', lang)}
                      </p>
                    </div>

                    <div className="p-3 bg-[#F4F8FA] rounded-lg border border-[#D0D9E2] space-y-1">
                      <span className="text-[10px] text-[#5B6B7A] uppercase font-bold tracking-wider">
                        {t('active_payee', lang)}
                      </span>
                      <div className="font-bold text-xs text-[#002D72]">{payeeName}</div>
                      <div className="text-[11px] text-amber-700 font-medium">
                        {t('new_payee_today', lang)}
                      </div>
                    </div>

                    <button
                      onClick={() => setPayStep(2)}
                      className="w-full h-12 rounded-lg bg-[#002D72] hover:bg-[#001D4A] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                    >
                      <span>{t('continue_to_amount', lang)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="text-center">
                      <button
                        onClick={() => setActiveTab('home')}
                        className="text-xs text-[#0082CA] hover:underline cursor-pointer"
                      >
                        {t('back_to_home', lang)}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: AMOUNT */}
                {payStep === 2 && (
                  <div className="bg-white rounded-xl p-4 border border-[#D0D9E2] space-y-4">
                    <div>
                      <h3 className="font-serif font-bold text-sm text-[#002D72]">
                        {t('transfer_amount', lang)}
                      </h3>
                      <p className="text-[11px] text-[#5B6B7A]">
                        {t('to_payee', lang, { payee: payeeName })}
                      </p>
                    </div>

                    <div className="p-4 bg-[#F4F8FA] rounded-lg border border-[#D0D9E2] text-center">
                      <span className="font-mono text-3xl font-bold text-[#002D72]">
                        ${paymentAmount.toFixed(2)}
                      </span>
                      <span className="block text-[11px] text-[#5B6B7A] mt-1">
                        {t('from_rail_note', lang, { rail: paymentRail })}
                      </span>
                    </div>

                    <button
                      onClick={() => setPayStep(3)}
                      className="w-full h-12 rounded-lg bg-[#002D72] hover:bg-[#001D4A] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                    >
                      <span>{t('review_payment_btn', lang)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="text-center">
                      <button
                        onClick={() => setPayStep(1)}
                        className="text-xs text-[#0082CA] hover:underline cursor-pointer"
                      >
                        {t('back_to_payee', lang)}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: REVIEW / PROTECTION INTERCEPT (ALWAYS SHOWS PAYMENT ROW) */}
                {payStep === 3 && (
                  <div className="space-y-3">
                    {/* ALWAYS VISIBLE PAYMENT DETAILS CARD FILLED FROM CSV */}
                    <div className="bg-white rounded-xl p-3.5 border border-[#D0D9E2] space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#D0D9E2]">
                        <span className="text-[#5B6B7A]">{t('from_account_label', lang)}</span>
                        <strong className="text-[#002D72]">{t('classic_checking', lang)}</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#D0D9E2]">
                        <span className="text-[#5B6B7A]">{t('to_payee_label', lang)}</span>
                        <strong className="text-[#002D72]">{payeeName}</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#D0D9E2]">
                        <span className="text-[#5B6B7A]">{t('amount_label', lang)}</span>
                        <strong className="font-mono text-sm text-[#002D72]">${paymentAmount.toFixed(2)}</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#5B6B7A]">{t('payment_rail_label', lang)}</span>
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-[#002D72] font-semibold">
                          {paymentRail}
                        </span>
                      </div>
                    </div>

                    {/* LEGITIMATE MOVER: LIGHT TIER CHECK */}
                    {scenarioId === 'mover_legitimate' && !isMoverConfirmed && (
                      <div className="bg-[#FFFAEB] border-2 border-[#FEDF89] rounded-xl p-4 text-xs text-[#7A2E0E] space-y-3">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-[#B54708] shrink-0" />
                          <div>
                            <h4 className="font-serif font-bold text-sm text-[#93370D]">
                              {t('light_title', lang)}
                            </h4>
                            <span className="text-[10px] text-[#7A2E0E]">
                              {t('light_sub', lang)}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] leading-relaxed">
                          {t('light_body', lang, { amount: `$${paymentAmount.toFixed(2)}` })}
                        </p>

                        {/* Primary 48px Navy Button */}
                        <button
                          onClick={() => {
                            onConfirmMoverYes();
                            setPayStep(4);
                          }}
                          className="w-full h-12 rounded-lg bg-[#002D72] hover:bg-[#001D4A] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t('light_yes', lang)}</span>
                        </button>

                        <div className="text-center pt-1">
                          <button
                            onClick={() => {
                              onConfirmMoverNo();
                              setPayStep(4);
                            }}
                            className="text-xs text-[#B42318] hover:underline cursor-pointer"
                          >
                            {t('light_no', lang)}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* If already frozen or confirmed */}
                    {(isFrozen || isMoverConfirmed) && (
                      <div className="bg-white rounded-xl p-4 border border-[#D0D9E2] text-center space-y-2">
                        <span className="text-xs text-[#067647] font-semibold block">
                          {isFrozen ? t('status_protected', lang) : t('status_approved', lang)}
                        </span>
                        <button
                          onClick={() => setPayStep(4)}
                          className="w-full h-12 rounded-lg bg-[#002D72] text-white font-semibold text-xs cursor-pointer shadow-xs hover:bg-[#001D4A] transition-colors"
                        >
                          {t('view_outcome', lang)}
                        </button>
                      </div>
                    )}

                    {/* Way Out: Back to Amount */}
                    <div className="text-center pt-1">
                      <button
                        onClick={() => setPayStep(2)}
                        className="text-xs text-[#0082CA] hover:underline cursor-pointer"
                      >
                        {t('back_to_amount', lang)}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: RESULT (SHORT GREEN OUTCOME CARDS) */}
                {payStep === 4 && (
                  <div className="bg-[#ECFDF3] border-2 border-[#A6F4C5] rounded-xl p-5 text-xs text-[#054F31] space-y-3 text-center shadow-xs">
                    <div className="w-10 h-10 rounded-full bg-[#D1FADF] text-[#067647] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
                    </div>

                    {isFrozen ? (
                      <>
                        <h3 className="font-serif font-bold text-base text-[#054F31]">
                          {t('home_secured_title', lang)}
                        </h3>
                        <p className="text-[11px] leading-relaxed text-[#067647]">
                          {t('home_secured_body', lang)}
                        </p>
                      </>
                    ) : isMoverConfirmed ? (
                      <>
                        <h3 className="font-serif font-bold text-base text-[#054F31]">
                          {t('outcome_sent', lang)}
                        </h3>
                        <p className="text-[11px] leading-relaxed text-[#067647]">
                          {t('outcome_sent_body', lang)}
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="font-serif font-bold text-base text-[#054F31]">
                          {t('outcome_processed', lang)}
                        </h3>
                        <p className="text-[11px] leading-relaxed text-[#067647]">
                          {t('outcome_processed_body', lang)}
                        </p>
                      </>
                    )}

                    <button
                      onClick={() => {
                        setActiveTab('home');
                        setPayStep(1);
                      }}
                      className="w-full h-10 rounded-lg bg-[#067647] hover:bg-[#054F31] text-white font-semibold text-xs cursor-pointer transition-colors shadow-2xs"
                    >
                      {t('back_to_home', lang)}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ================= ACTIVITY TAB ================= */}
        {activeTab === 'activity' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-[#002D72]">
                {t('activity_history', lang)}
              </h3>
              <span className="text-[11px] text-[#5B6B7A]">
                {t('events_count', lang, { count: events.length })}
              </span>
            </div>

            <div className="bg-white rounded-xl border border-[#D0D9E2] divide-y divide-[#D0D9E2] overflow-hidden">
              {events.map((ev) => (
                <div
                  key={ev.event_id}
                  onClick={() => setSelectedActivityItem(ev)}
                  className="p-3 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div>
                    <div className="font-semibold text-[#1B2733]">{translateEventType(ev.event_type, lang)}</div>
                    <div className="text-[10px] text-[#5B6B7A]">
                      {ev.event_timestamp.slice(0, 16)} · {translateChannel(ev.channel, lang)}
                    </div>
                  </div>
                  {ev.amount && ev.amount > 0 ? (
                    <span className="font-mono font-bold text-[#002D72]">
                      -${ev.amount.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {t('event_badge', lang)}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Way Out */}
            <div className="text-center pt-1">
              <button
                onClick={() => setActiveTab('home')}
                className="text-xs text-[#0082CA] hover:underline cursor-pointer"
              >
                {t('return_to_home', lang)}
              </button>
            </div>

            {/* Selected Activity Item Modal / Detail */}
            {selectedActivityItem && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
                <div className="bg-white rounded-xl p-4 max-w-xs w-full border border-[#D0D9E2] shadow-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b pb-2">
                    <strong className="text-[#002D72]">{translateEventType(selectedActivityItem.event_type, lang)}</strong>
                    <button
                      onClick={() => setSelectedActivityItem(null)}
                      className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-1 text-[#5B6B7A] text-[11px]">
                    <div>{t('time_label', lang)} {selectedActivityItem.event_timestamp}</div>
                    <div>{t('channel_label', lang)} {translateChannel(selectedActivityItem.channel, lang)}</div>
                    {selectedActivityItem.amount && <div>{t('amount_label', lang)} ${selectedActivityItem.amount.toFixed(2)}</div>}
                    <div>{t('note_label', lang)} {selectedActivityItem.event_note || t('standard_log_entry', lang)}</div>
                  </div>
                  <button
                    onClick={() => setSelectedActivityItem(null)}
                    className="w-full h-9 rounded bg-[#002D72] text-white font-semibold text-xs cursor-pointer"
                  >
                    {t('close', lang)}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= HELP TAB ================= */}
        {activeTab === 'help' && (
          <div className="space-y-3.5">
            <div>
              <h3 className="font-serif font-bold text-sm text-[#002D72]">
                {t('security_and_help', lang)}
              </h3>
              <p className="text-[11px] text-[#5B6B7A]">
                {t('here_to_protect', lang)}
              </p>
            </div>

            {/* Big Red Outline Button: I think I've been scammed */}
            <button
              onClick={onOpenScamModal}
              className="w-full h-12 rounded-xl border-2 border-[#D83B01] bg-red-50 hover:bg-red-100 text-[#D83B01] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
            >
              <AlertTriangle className="w-4 h-4 text-[#D83B01]" />
              <span>{t('think_scammed', lang)}</span>
            </button>

            {/* Talk to someone */}
            <div className="bg-white rounded-xl p-3.5 border border-[#D0D9E2] space-y-1">
              <span className="text-[11px] font-semibold text-[#002D72] flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-[#0082CA]" />
                <span>{t('talk_to_someone', lang)}</span>
              </span>
              <p className="text-[11px] text-[#5B6B7A]">
                {t('direct_fraud_line', lang)}
              </p>
              <a
                href="tel:8005628130"
                className="font-mono font-bold text-xs text-[#0082CA] hover:underline block"
              >
                800.562.8130
              </a>
            </div>

            {/* Visit a branch */}
            <div className="bg-white rounded-xl p-3.5 border border-[#D0D9E2] space-y-2">
              <span className="text-[11px] font-semibold text-[#002D72] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#0082CA]" />
                <span>{t('visit_branch', lang)}</span>
              </span>
              <p className="text-[11px] text-[#5B6B7A]">
                {t('branches_desc', lang)}
              </p>
              {onRequestAtBranch && (
                <button
                  onClick={onRequestAtBranch}
                  className="w-full py-2 rounded-lg bg-[#F4F8FA] border border-[#D0D9E2] hover:bg-[#E1F0F8] text-[#002D72] font-semibold text-xs cursor-pointer transition-colors"
                >
                  {memberActions.branchPriority ? t('priority_flagged_branch', lang) : t('notify_branch_visit', lang)}
                </button>
              )}
            </div>

            {/* Way Out */}
            <div className="text-center pt-1">
              <button
                onClick={() => setActiveTab('home')}
                className="text-xs text-[#0082CA] hover:underline cursor-pointer"
              >
                {t('return_to_home', lang)}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Phone Tabs (64px) + Home-indicator bar (5px tall, 134px wide) */}
      <div className="bg-white border-t border-[#D0D9E2] shrink-0">
        <div className="h-[64px] grid grid-cols-4 items-center text-center px-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
              activeTab === 'home' ? 'text-[#002D72] font-bold' : 'text-[#5B6B7A] hover:text-[#002D72]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[11px]">{t('tab_home', lang)}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('pay');
              if (scenarioId !== 'james_branch') {
                setPayStep(1);
              }
            }}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
              activeTab === 'pay' ? 'text-[#002D72] font-bold' : 'text-[#5B6B7A] hover:text-[#002D72]'
            }`}
          >
            <Send className="w-5 h-5" />
            <span className="text-[11px]">{t('tab_pay', lang)}</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
              activeTab === 'activity' ? 'text-[#002D72] font-bold' : 'text-[#5B6B7A] hover:text-[#002D72]'
            }`}
          >
            <List className="w-5 h-5" />
            <span className="text-[11px]">{t('tab_activity', lang)}</span>
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
              activeTab === 'help' ? 'text-[#002D72] font-bold' : 'text-[#5B6B7A] hover:text-[#002D72]'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-[11px]">{t('tab_help', lang)}</span>
          </button>
        </div>
        {/* 5px home indicator bar under it (134px wide, rounded) */}
        <div className="pb-1.5 pt-0.5 flex justify-center bg-white max-sm:pb-3">
          <div className="w-[134px] h-[5px] bg-slate-300 rounded-full" />
        </div>
      </div>
    </div>
  </div>
  );
};
