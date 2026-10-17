import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { maskPhone } from '../../lib/tokenization.ts';

interface PhoneAppProps {
  scenarioId: ScenarioId;
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
  onSwitchToStaffConsole?: (tab?: 'branch' | 'cases') => void;
  onReturnToStories?: () => void;
  activeTab: 'home' | 'pay' | 'activity' | 'help';
  setActiveTab: (tab: 'home' | 'pay' | 'activity' | 'help') => void;
  payStep: 1 | 2 | 3 | 4;
  setPayStep: (step: 1 | 2 | 3 | 4) => void;
}

export const PhoneApp: React.FC<PhoneAppProps> = ({
  scenarioId,
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

  return (
    <div className="w-full max-w-[420px] mx-auto bg-white rounded-3xl shadow-xl border-4 border-slate-700 overflow-hidden flex flex-col h-[590px] sm:h-[630px] relative select-none">
      {/* Phone Status Bar */}
      <div className="bg-[#002D72] text-white px-5 pt-2 pb-1.5 flex items-center justify-between text-[11px] font-medium shrink-0">
        <span className="font-mono">9:41</span>
        <div className="w-16 h-4 bg-slate-800 rounded-full mx-auto" />
        <div className="flex items-center gap-1.5">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* App Header */}
      <div className="bg-[#002D72] text-white px-4 py-2.5 flex items-center justify-between shrink-0 border-b border-[#001D4A]">
        <div>
          <span className="font-serif font-bold text-sm tracking-tight block">
            Sound Credit Union
          </span>
          <span className="text-[10px] text-[#E1F0F8]/80">
            {isEs ? 'Banca Digital de Sound' : 'Sound Digital Banking'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onReturnToStories && (
            <button
              onClick={onReturnToStories}
              className="text-[10px] bg-white/10 hover:bg-white/20 text-[#E1F0F8] px-2 py-1 rounded transition-colors cursor-pointer"
              title="Return to story selector"
            >
              Exit
            </button>
          )}
          <div className="w-7 h-7 rounded-full bg-[#0082CA] text-white flex items-center justify-center font-bold text-xs">
            S
          </div>
        </div>
      </div>

      {/* Screen Body */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#F4F8FA]">
        {/* ================= HOME TAB ================= */}
        {activeTab === 'home' && (
          <div className="space-y-3.5">
            {/* Balance Card */}
            <div className="bg-white rounded-xl p-4 border border-[#D0D9E2] shadow-2xs">
              <span className="text-[11px] font-medium text-[#5B6B7A] block">
                {isEs ? 'Saldo Total Disponible' : 'Total Available Balance'}
              </span>
              <div className="font-mono text-2xl font-bold text-[#002D72] tracking-tight mt-0.5">
                ${checkingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="mt-2 pt-2 border-t border-[#D0D9E2] flex items-center justify-between text-xs text-[#5B6B7A]">
                <span>Classic Checking (··9412)</span>
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
                  <span>{isEs ? 'Destinatario Bloqueado · Acción Requerida' : 'Payee Blocked · Action Required'}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {isEs
                    ? 'Un nuevo destinatario requiere confirmación desde su teléfono previo al cambio.'
                    : 'A new payee was blocked upfront to protect your money. Check required before money can leave.'}
                </p>
                <button
                  onClick={() => {
                    setActiveTab('pay');
                    setPayStep(3);
                  }}
                  className="w-full py-2 rounded-lg bg-[#B42318] hover:bg-[#912018] text-white font-semibold text-xs text-center cursor-pointer transition-colors shadow-2xs"
                >
                  {isEs ? 'Revisar Destinatario' : 'Review Payee Check'}
                </button>
              </div>
            )}

            {/* Alert Card: Light Tier Check */}
            {isLight && !isMoverConfirmed && (
              <div className="bg-[#FFFAEB] border-2 border-[#FEDF89] rounded-xl p-3.5 text-xs text-[#7A2E0E] space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#B54708]">
                  <ShieldCheck className="w-4 h-4 text-[#B54708] shrink-0" />
                  <span>{isEs ? 'Verificación rápida: ¿fue usted?' : 'Quick check: was this you?'}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {isEs
                    ? `Confirme su pago de $${paymentAmount.toFixed(2)} a ${payeeName}.`
                    : `Confirm your $${paymentAmount.toFixed(2)} payment to ${payeeName}.`}
                </p>
                <button
                  onClick={() => {
                    setActiveTab('pay');
                    setPayStep(3);
                  }}
                  className="w-full py-2 rounded-lg bg-[#067647] hover:bg-[#054F31] text-white font-semibold text-xs text-center cursor-pointer transition-colors shadow-2xs"
                >
                  {isEs ? 'Confirmar Pago (8 segundos)' : 'Review 1-Tap Check'}
                </button>
              </div>
            )}

            {/* Alert Card: Account Secured */}
            {isFrozen && (
              <div className="bg-[#ECFDF3] border-2 border-[#A6F4C5] rounded-xl p-3.5 text-xs text-[#054F31] space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-[#067647]">
                  <CheckCircle2 className="w-4 h-4 text-[#067647] shrink-0" />
                  <span>{isEs ? 'Su cuenta está protegida' : 'Your account is secured'}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {isEs
                    ? 'Destinatario bloqueado y saldo protegido. Ningún fondo salió de su cuenta.'
                    : 'Unauthorized payee blocked and balances protected. Zero money left your account.'}
                </p>
              </div>
            )}

            {/* 3 Recent Items */}
            <div className="bg-white rounded-xl p-3.5 border border-[#D0D9E2] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#002D72]">
                <span>{isEs ? 'Actividad Reciente' : 'Recent Activity'}</span>
                <button
                  onClick={() => setActiveTab('activity')}
                  className="text-[11px] text-[#0082CA] hover:underline cursor-pointer"
                >
                  {isEs ? 'Ver Todo' : 'View all'}
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
                      <div className="font-medium text-[#1B2733]">{ev.event_type}</div>
                      <div className="text-[10px] text-[#5B6B7A]">{ev.event_timestamp.slice(11, 16)} · {ev.channel}</div>
                    </div>
                    {ev.amount && ev.amount > 0 ? (
                      <span className="font-mono font-semibold text-[#002D72]">
                        -${ev.amount.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#5B6B7A]">Info</span>
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
                <span>Check Digital Payments Status</span>
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
                <span>{isEs ? 'Enviar Dinero' : 'Send Money'}</span>
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
                    No digital payment in this story
                  </h3>
                  <p className="text-xs text-[#5B6B7A] leading-relaxed max-w-xs mx-auto">
                    James is being coerced in-person to withdraw $7,000 cash at the Tacoma branch. This scam does not use digital banking rails.
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
                    <span>Open Branch Mode in Staff Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="w-full text-xs text-[#0082CA] hover:underline cursor-pointer py-1"
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            ) : (
              /* REGULAR 4-STEP PAY FLOW FOR SARAH & MOVER */
              <>
                {/* Progress Dot Row */}
                <div className="bg-white rounded-xl p-3 border border-[#D0D9E2] flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#002D72]">
                    Step {payStep} of 4: {payStep === 1 ? 'Payee' : payStep === 2 ? 'Amount' : payStep === 3 ? 'Review' : 'Result'}
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
                        {isEs ? 'Seleccione o revise el destinatario' : 'Select or Review Payee'}
                      </h3>
                      <p className="text-[11px] text-[#5B6B7A]">
                        {isEs ? 'Pagos P2P o transferencias directas' : 'P2P payments & direct transfers'}
                      </p>
                    </div>

                    <div className="p-3 bg-[#F4F8FA] rounded-lg border border-[#D0D9E2] space-y-1">
                      <span className="text-[10px] text-[#5B6B7A] uppercase font-bold tracking-wider">
                        {isEs ? 'Destinatario Activo' : 'Active Payee'}
                      </span>
                      <div className="font-bold text-xs text-[#002D72]">{payeeName}</div>
                      <div className="text-[11px] text-amber-700 font-medium">
                        {isEs ? 'Destinatario nuevo agregado hoy' : 'New payee added today'}
                      </div>
                    </div>

                    <button
                      onClick={() => setPayStep(2)}
                      className="w-full h-12 rounded-lg bg-[#002D72] hover:bg-[#001D4A] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                    >
                      <span>{isEs ? 'Continuar al Monto' : 'Continue to Amount'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="text-center">
                      <button
                        onClick={() => setActiveTab('home')}
                        className="text-xs text-[#0082CA] hover:underline cursor-pointer"
                      >
                        {isEs ? 'Volver al Inicio' : 'Back to Home'}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: AMOUNT */}
                {payStep === 2 && (
                  <div className="bg-white rounded-xl p-4 border border-[#D0D9E2] space-y-4">
                    <div>
                      <h3 className="font-serif font-bold text-sm text-[#002D72]">
                        {isEs ? 'Monto a transferir' : 'Transfer Amount'}
                      </h3>
                      <p className="text-[11px] text-[#5B6B7A]">
                        {isEs ? `Para: ${payeeName}` : `To: ${payeeName}`}
                      </p>
                    </div>

                    <div className="p-4 bg-[#F4F8FA] rounded-lg border border-[#D0D9E2] text-center">
                      <span className="font-mono text-3xl font-bold text-[#002D72]">
                        ${paymentAmount.toFixed(2)}
                      </span>
                      <span className="block text-[11px] text-[#5B6B7A] mt-1">
                        From: Classic Checking (··9412) · Rail: {paymentRail}
                      </span>
                    </div>

                    <button
                      onClick={() => setPayStep(3)}
                      className="w-full h-12 rounded-lg bg-[#002D72] hover:bg-[#001D4A] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                    >
                      <span>{isEs ? 'Revisar Pago' : 'Review Payment'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="text-center">
                      <button
                        onClick={() => setPayStep(1)}
                        className="text-xs text-[#0082CA] hover:underline cursor-pointer"
                      >
                        {isEs ? 'Volver al Destinatario' : 'Back to Payee'}
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
                        <span className="text-[#5B6B7A]">From Account:</span>
                        <strong className="text-[#002D72]">Classic Checking (··9412)</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#D0D9E2]">
                        <span className="text-[#5B6B7A]">To Payee:</span>
                        <strong className="text-[#002D72]">{payeeName}</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#D0D9E2]">
                        <span className="text-[#5B6B7A]">Amount:</span>
                        <strong className="font-mono text-sm text-[#002D72]">${paymentAmount.toFixed(2)}</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#5B6B7A]">Payment Rail:</span>
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-[#002D72] font-semibold">
                          {paymentRail}
                        </span>
                      </div>
                    </div>

                    {/* SARAH ATO: QUARANTINE INTERCEPT */}
                    {scenarioId === 'sarah_ato' && !isFrozen && (
                      <div className="bg-[#FEF3F2] border-2 border-[#FECDCA] rounded-xl p-4 text-xs text-[#7A271A] space-y-3">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-5 h-5 text-[#B42318] shrink-0" />
                          <div>
                            <h4 className="font-serif font-bold text-sm text-[#912018]">
                              {isEs ? 'Destinatario Bloqueado · Confirmación Requerida' : 'Payee Blocked · Confirmation Required'}
                            </h4>
                            <span className="text-[10px] text-[#7A271A]">
                              {isEs ? 'Bloqueo previo al envío de fondos' : 'Pre-send lock engaged upfront'}
                            </span>
                          </div>
                        </div>

                        {/* Coercion Warning */}
                        <div className="bg-[#FFFAEB] border border-[#FEDF89] rounded-lg p-2.5 text-[11px] text-[#7A2E0E]">
                          <strong>Notice:</strong> Sound will never call or text asking for your confirmation code.
                        </div>

                        <p className="text-[11px] leading-relaxed">
                          To keep your money safe, a confirmation was sent to the phone on file before recent updates ({maskPhone('(206) 555-4821')}).
                          Payments to this payee are locked upfront.
                        </p>

                        {/* Primary 48px Navy Button */}
                        <button
                          onClick={() => {
                            onFreezeAndRecover();
                            setPayStep(4);
                          }}
                          className="w-full h-12 rounded-lg bg-[#002D72] hover:bg-[#001D4A] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                        >
                          <Lock className="w-4 h-4" />
                          <span>{isEs ? 'Congelar y Recuperar (No fui yo)' : 'Freeze & Recover (This Was Not Me)'}</span>
                        </button>

                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          {onRequestAtBranch && (
                            <button
                              onClick={onRequestAtBranch}
                              className="text-[#0082CA] hover:underline cursor-pointer"
                            >
                              {memberActions.branchPriority ? 'Marked Branch Priority' : 'Request at Branch'}
                            </button>
                          )}
                          <button
                            onClick={() => {
                              onConfirmLegitimate();
                              setPayStep(4);
                            }}
                            className="text-[#067647] hover:underline cursor-pointer font-medium"
                          >
                            Approve Payee
                          </button>
                        </div>
                      </div>
                    )}

                    {/* LEGITIMATE MOVER: LIGHT TIER CHECK */}
                    {scenarioId === 'mover_legitimate' && !isMoverConfirmed && (
                      <div className="bg-[#FFFAEB] border-2 border-[#FEDF89] rounded-xl p-4 text-xs text-[#7A2E0E] space-y-3">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-[#B54708] shrink-0" />
                          <div>
                            <h4 className="font-serif font-bold text-sm text-[#93370D]">
                              {isEs ? 'Verificación rápida: ¿fue usted?' : 'Quick check: was this you?'}
                            </h4>
                            <span className="text-[10px] text-[#7A2E0E]">
                              {isEs ? 'Comprobación de 1 toque en 8 segundos' : '1-tap check resolves in 8 seconds'}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] leading-relaxed">
                          You recently reset your password and updated your address, and this is a new payee.
                          Tap below to confirm this ${paymentAmount.toFixed(2)} payment.
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
                          <span>{isEs ? 'Sí, fui yo (Confirmar y Enviar)' : 'Yes, this was me (Confirm & Send)'}</span>
                        </button>

                        <div className="text-center pt-1">
                          <button
                            onClick={() => {
                              onConfirmMoverNo();
                              setPayStep(4);
                            }}
                            className="text-xs text-[#B42318] hover:underline cursor-pointer"
                          >
                            {isEs ? 'No, no fui yo (Detener)' : "No, this wasn't me"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* If already frozen or confirmed */}
                    {(isFrozen || isMoverConfirmed) && (
                      <div className="bg-white rounded-xl p-4 border border-[#D0D9E2] text-center space-y-2">
                        <span className="text-xs text-[#067647] font-semibold block">
                          Status: {isFrozen ? 'Account Protected & Rails Frozen' : 'Payment Approved & Dispatched'}
                        </span>
                        <button
                          onClick={() => setPayStep(4)}
                          className="w-full h-12 rounded-lg bg-[#002D72] text-white font-semibold text-xs cursor-pointer shadow-xs hover:bg-[#001D4A] transition-colors"
                        >
                          View Outcome Screen
                        </button>
                      </div>
                    )}

                    {/* Way Out: Back to Amount */}
                    <div className="text-center pt-1">
                      <button
                        onClick={() => setPayStep(2)}
                        className="text-xs text-[#0082CA] hover:underline cursor-pointer"
                      >
                        Back to Amount
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
                          {isEs ? 'Su cuenta está protegida' : 'Your account is secured'}
                        </h3>
                        <p className="text-[11px] leading-relaxed text-[#067647]">
                          {isEs
                            ? 'Bloqueamos adiciones de destinatarios no autorizados y detuvimos los pagos. Su saldo está a salvo.'
                            : "We've locked unauthorized payee additions, stopped outgoing payments, and protected your balance."}
                        </p>
                      </>
                    ) : isMoverConfirmed ? (
                      <>
                        <h3 className="font-serif font-bold text-base text-[#054F31]">
                          {isEs ? 'Pago enviado, tomó 8 segundos' : 'Payment sent, took 8 seconds'}
                        </h3>
                        <p className="text-[11px] leading-relaxed text-[#067647]">
                          {isEs
                            ? 'Listo. Su pago está en camino. Gracias por confirmar.'
                            : 'Done. Your payment is on its way. Thanks for confirming. This took 8 seconds.'}
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="font-serif font-bold text-base text-[#054F31]">
                          {isEs ? 'Pago procesado' : 'Payment processed'}
                        </h3>
                        <p className="text-[11px] leading-relaxed text-[#067647]">
                          {isEs ? 'Su transacción ha sido enviada.' : 'Your transaction has been submitted.'}
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
                      {isEs ? 'Volver al Inicio' : 'Back to Home'}
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
                {isEs ? 'Registro de Actividad' : 'Activity History'}
              </h3>
              <span className="text-[11px] text-[#5B6B7A]">
                {events.length} events
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
                    <div className="font-semibold text-[#1B2733]">{ev.event_type}</div>
                    <div className="text-[10px] text-[#5B6B7A]">
                      {ev.event_timestamp.slice(0, 16)} · {ev.channel}
                    </div>
                  </div>
                  {ev.amount && ev.amount > 0 ? (
                    <span className="font-mono font-bold text-[#002D72]">
                      -${ev.amount.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      Event
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
                Return to Home
              </button>
            </div>

            {/* Selected Activity Item Modal / Detail */}
            {selectedActivityItem && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
                <div className="bg-white rounded-xl p-4 max-w-xs w-full border border-[#D0D9E2] shadow-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b pb-2">
                    <strong className="text-[#002D72]">{selectedActivityItem.event_type}</strong>
                    <button
                      onClick={() => setSelectedActivityItem(null)}
                      className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-1 text-[#5B6B7A] text-[11px]">
                    <div>Time: {selectedActivityItem.event_timestamp}</div>
                    <div>Channel: {selectedActivityItem.channel}</div>
                    {selectedActivityItem.amount && <div>Amount: ${selectedActivityItem.amount.toFixed(2)}</div>}
                    <div>Note: {selectedActivityItem.event_note || 'Standard log entry'}</div>
                  </div>
                  <button
                    onClick={() => setSelectedActivityItem(null)}
                    className="w-full h-9 rounded bg-[#002D72] text-white font-semibold text-xs cursor-pointer"
                  >
                    Close
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
                {isEs ? 'Soporte y Seguridad' : 'Security & Help'}
              </h3>
              <p className="text-[11px] text-[#5B6B7A]">
                {isEs ? 'Estamos con usted en todo momento' : 'We are here to protect you 24/7'}
              </p>
            </div>

            {/* Big Red Outline Button: I think I've been scammed */}
            <button
              onClick={onOpenScamModal}
              className="w-full h-12 rounded-xl border-2 border-[#D83B01] bg-red-50 hover:bg-red-100 text-[#D83B01] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
            >
              <AlertTriangle className="w-4 h-4 text-[#D83B01]" />
              <span>{isEs ? "Creo que he sido víctima de una estafa" : "I think I've been scammed"}</span>
            </button>

            {/* Talk to someone */}
            <div className="bg-white rounded-xl p-3.5 border border-[#D0D9E2] space-y-1">
              <span className="text-[11px] font-semibold text-[#002D72] flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-[#0082CA]" />
                <span>Talk to someone</span>
              </span>
              <p className="text-[11px] text-[#5B6B7A]">
                Direct line to Sound Credit Union Fraud Specialists:
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
                <span>Visit a branch</span>
              </span>
              <p className="text-[11px] text-[#5B6B7A]">
                26 Puget Sound branches with in-person identity verification.
              </p>
              {onRequestAtBranch && (
                <button
                  onClick={onRequestAtBranch}
                  className="w-full py-2 rounded-lg bg-[#F4F8FA] border border-[#D0D9E2] hover:bg-[#E1F0F8] text-[#002D72] font-semibold text-xs cursor-pointer transition-colors"
                >
                  {memberActions.branchPriority ? 'Priority Flagged for Branch' : 'Notify Branch of In-Person Visit'}
                </button>
              )}
            </div>

            {/* Way Out */}
            <div className="text-center pt-1">
              <button
                onClick={() => setActiveTab('home')}
                className="text-xs text-[#0082CA] hover:underline cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Phone Tabs (Home · Pay · Activity · Help) */}
      <div className="bg-white border-t border-[#D0D9E2] grid grid-cols-4 py-2 px-1 text-center shrink-0">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
            activeTab === 'home' ? 'text-[#002D72] font-bold' : 'text-[#5B6B7A] hover:text-[#002D72]'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px]">{isEs ? 'Inicio' : 'Home'}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('pay');
            if (scenarioId !== 'james_branch') {
              setPayStep(1);
            }
          }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
            activeTab === 'pay' ? 'text-[#002D72] font-bold' : 'text-[#5B6B7A] hover:text-[#002D72]'
          }`}
        >
          <Send className="w-4 h-4" />
          <span className="text-[10px]">{isEs ? 'Pagar' : 'Pay'}</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
            activeTab === 'activity' ? 'text-[#002D72] font-bold' : 'text-[#5B6B7A] hover:text-[#002D72]'
          }`}
        >
          <List className="w-4 h-4" />
          <span className="text-[10px]">{isEs ? 'Actividad' : 'Activity'}</span>
        </button>

        <button
          onClick={() => setActiveTab('help')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
            activeTab === 'help' ? 'text-[#002D72] font-bold' : 'text-[#5B6B7A] hover:text-[#002D72]'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span className="text-[10px]">{isEs ? 'Ayuda' : 'Help'}</span>
        </button>
      </div>
    </div>
  );
};
