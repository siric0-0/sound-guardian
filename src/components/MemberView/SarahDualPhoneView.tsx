import React, { useState, useMemo } from 'react';
import { DemoEvent } from '../../types.ts';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  AlertTriangle,
  ArrowRight,
  Home,
  Send,
  List,
  HelpCircle,
  PhoneCall,
  X,
  CreditCard,
  UserCheck,
  Signal,
  Wifi,
  Battery,
} from 'lucide-react';

interface SarahDualPhoneViewProps {
  events: DemoEvent[];
  currentEvent: DemoEvent;
  stepIndex: number;
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
  onOpenScamModal: () => void;
  onRequestAtBranch?: () => void;
  onSwitchToStaffConsole?: (tab?: 'branch' | 'cases' | 'dashboard') => void;
  onReturnToStories?: () => void;
  activeTab: 'home' | 'pay' | 'activity' | 'help';
  setActiveTab: (tab: 'home' | 'pay' | 'activity' | 'help') => void;
}

export const SarahDualPhoneView: React.FC<SarahDualPhoneViewProps> = ({
  events,
  currentEvent,
  stepIndex,
  lang,
  largeText,
  memberActions,
  onFreezeAndRecover,
  onConfirmLegitimate,
  onOpenScamModal,
  onRequestAtBranch,
  onSwitchToStaffConsole,
  onReturnToStories,
  activeTab,
  setActiveTab,
}) => {
  const isEs = lang === 'es';
  const isFrozen = !!memberActions.frozen || stepIndex >= 8;

  // Step 8 is index 7 (2nd payment attempt $1432.15); Step 9 is index 8 (Secured)
  const isStep8 = stepIndex === 7;
  const isStep9 = stepIndex >= 8;
  const isQuarantineStep = stepIndex >= 5 && !isStep9 && !memberActions.frozen;

  const currentAmount = isStep8 ? 1432.15 : 1574.18;
  const checkingBalance = currentEvent.available_balance_after || 5420.50;

  // Handle Cancel on Left Phone
  const handleLeftCancel = () => {
    setActiveTab('home');
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col min-[900px]:flex-row items-center justify-center gap-12 py-1 select-none">
      {/* ========================================================================= */}
      {/* LEFT PHONE: Session that added the payee (Attacker Session)                */}
      {/* ========================================================================= */}
      <div className="flex flex-col items-center w-full min-[900px]:w-auto">
        {/* Frame Label Above */}
        <div className="w-full text-center mb-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{isEs ? 'Sesión que agregó al destinatario' : 'Session that added the payee'}</span>
          </span>
        </div>

        {/* Phone Frame Container: Exact real phone proportions */}
        <div
          className="relative select-none mx-auto transition-all duration-150
                     border-[10px] border-slate-900 rounded-[44px] shadow-2xl bg-slate-900
                     max-sm:border-0 max-sm:rounded-none max-sm:shadow-none max-sm:w-full max-sm:h-full max-sm:max-w-none max-sm:aspect-auto"
          style={{
            height: 'min(780px, calc(100vh - 170px))',
            aspectRatio: '9 / 19.5',
            width: 'auto',
          }}
        >
          {/* Inner Screen (34px radius) */}
          <div className="w-full h-full rounded-[34px] max-sm:rounded-none overflow-hidden flex flex-col bg-white relative">
            {/* Dynamic-island pill centered at the top (120×30, black) */}
            <div className="w-[120px] h-[30px] bg-black rounded-full absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center justify-between px-3 max-sm:hidden">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900/60" />
            </div>

            {/* Status bar 44px tall: time left, signal/wifi/battery right */}
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
                  {isEs ? 'Banca Móvil · Sesión Safari' : 'Mobile Banking · Safari Session'}
                </span>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#0082CA] text-white flex items-center justify-center font-bold text-xs">
                S
              </div>
            </div>

            {/* Scrollable Screen Body with 15px base font scaling with largeText */}
            <div
              className="flex-1 overflow-y-auto p-4 bg-[#F4F8FA] space-y-3.5"
              style={{ fontSize: largeText ? '17px' : '15px' }}
            >
              {/* STEPS 1-5: Pre-Payee Setup (Failed login, SMS OTP, Password Reset, Email/Phone updates) */}
              {stepIndex < 5 && (
                <div className="bg-white rounded-xl p-4 border border-[#D0D9E2] space-y-3 shadow-2xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#D0D9E2]">
                    <span className="text-xs font-bold text-[#002D72]">
                      {isEs ? `Paso ${stepIndex + 1}: ${currentEvent.event_type}` : `Step ${stepIndex + 1}: ${currentEvent.event_type}`}
                    </span>
                  </div>

                  {stepIndex === 0 && (
                    <div className="text-xs space-y-2 text-[#5B6B7A]">
                      <p className="text-amber-800 font-semibold bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                        {isEs
                          ? 'Intento de inicio de sesión fallido registrado desde agente móvil no reconocido.'
                          : 'Failed login recorded from unrecognized mobile user agent.'}
                      </p>
                      <p className="text-[11px]">
                        {isEs
                          ? 'El atacante está intentando acceder a la cuenta de Sarah.'
                          : 'Attacker is probing access to Sarah’s mobile banking account.'}
                      </p>
                    </div>
                  )}

                  {stepIndex === 1 && (
                    <div className="text-xs space-y-2 text-[#5B6B7A]">
                      <p className="text-[#002D72] font-semibold bg-blue-50 p-2.5 rounded-lg border border-blue-200">
                        {isEs
                          ? 'Código de acceso único (OTP) solicitado.'
                          : 'One-time passcode (OTP) requested.'}
                      </p>
                      <div className="p-3 bg-slate-50 rounded border border-slate-200 text-center font-mono text-sm tracking-widest text-[#002D72]">
                        • • • • • •
                      </div>
                    </div>
                  )}

                  {stepIndex === 2 && (
                    <div className="text-xs space-y-2 text-[#5B6B7A]">
                      <p className="text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                        {isEs
                          ? 'Contraseña restablecida exitosamente en el portal.'
                          : 'Password reset completed via self-service portal.'}
                      </p>
                      <p className="text-[11px]">
                        {isEs
                          ? 'Nueva contraseña activada en esta sesión.'
                          : 'New password activated in this attacker session.'}
                      </p>
                    </div>
                  )}

                  {stepIndex === 3 && (
                    <div className="text-xs space-y-2 text-[#5B6B7A]">
                      <p className="text-amber-800 font-semibold bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                        {isEs
                          ? 'Correo electrónico actualizado a dirección del atacante.'
                          : 'Email changed to attacker address.'}
                      </p>
                      <p className="text-[11px]">
                        {isEs
                          ? 'Aviso de seguridad enviado al correo original sarah.m****@email.com.'
                          : 'Security notice dispatched to original sarah.m****@email.com.'}
                      </p>
                    </div>
                  )}

                  {stepIndex === 4 && (
                    <div className="text-xs space-y-2 text-[#5B6B7A]">
                      <p className="text-amber-800 font-semibold bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                        {isEs
                          ? 'Número de teléfono actualizado a (555) 019-2834.'
                          : 'Phone number updated to (555) 019-2834.'}
                      </p>
                      <p className="text-[11px]">
                        {isEs
                          ? 'El número previo verificado de Sarah era (206) 555-4821.'
                          : 'Pre-change verified phone on file was (206) 555-4821.'}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 text-[11px] text-[#5B6B7A] text-center italic">
                    {isEs ? 'Avance al siguiente paso para ver el intento de retiro.' : 'Advance to Next step to see the transfer attempt.'}
                  </div>
                </div>
              )}

              {/* STEPS 6, 7, 8: QUARANTINE INTERCEPT ON LEFT PHONE */}
              {isQuarantineStep && (
                <div className="space-y-3">
                  {/* Outgoing Payment Summary Card */}
                  <div className="bg-white rounded-xl p-3.5 border border-[#D0D9E2] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#D0D9E2]">
                      <span className="text-[#5B6B7A]">{isEs ? 'Cuenta de origen:' : 'From Account:'}</span>
                      <strong className="text-[#002D72]">Classic Checking (··9412)</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#D0D9E2]">
                      <span className="text-[#5B6B7A]">{isEs ? 'Destinatario:' : 'To Payee:'}</span>
                      <strong className="text-[#002D72]">quick_transfer_p2p (REC_8821)</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#D0D9E2]">
                      <span className="text-[#5B6B7A]">{isEs ? 'Monto:' : 'Amount:'}</span>
                      <strong className="font-mono text-sm text-[#002D72]">${currentAmount.toFixed(2)}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5B6B7A]">{isEs ? 'Riel de pago:' : 'Payment Rail:'}</span>
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-[#002D72] font-semibold">
                        P2P
                      </span>
                    </div>
                  </div>

                  {/* THE BLOCKED QUARANTINE CARD ON LEFT PHONE */}
                  <div className="bg-[#FEF3F2] border-2 border-[#FECDCA] rounded-xl p-4 text-xs text-[#7A271A] space-y-3 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-[#B42318] shrink-0" />
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#912018]">
                          {isStep8
                            ? isEs
                              ? 'Segundo Intento Bloqueado ($1,432.15)'
                              : 'Second Attempt Blocked ($1,432.15)'
                            : isEs
                            ? 'Destinatario Bloqueado'
                            : 'Payee Blocked'}
                        </h4>
                        <span className="text-[10px] text-[#7A271A]">
                          {isEs ? 'Protección anticipada de Sound Guardian' : 'Sound Guardian pre-send lock'}
                        </span>
                      </div>
                    </div>

                    {/* MANDATORY EXACT TEXT ON LEFT PHONE */}
                    <p className="text-[12px] leading-relaxed font-medium text-[#912018] bg-white/70 p-2.5 rounded-lg border border-[#FECDCA]">
                      {isEs
                        ? 'Esperando confirmación en su teléfono anterior. Este destinatario no puede recibir dinero hasta que se confirme allí.'
                        : "Waiting for confirmation on your previous phone. This payee can't receive money until it's confirmed there."}
                    </p>

                    {/* NO APPROVE BUTTON ON LEFT PHONE. ONLY Cancel & Get help with >=44px tap targets */}
                    <div className="space-y-2 pt-1">
                      <button
                        onClick={handleLeftCancel}
                        className="w-full h-11 min-h-[44px] rounded-lg bg-[#F4F8FA] hover:bg-[#E1F0F8] text-[#002D72] border border-[#D0D9E2] font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{isEs ? 'Cancelar' : 'Cancel'}</span>
                      </button>

                      <div className="text-center pt-0.5">
                        <button
                          onClick={onOpenScamModal}
                          className="min-h-[44px] inline-flex items-center justify-center text-xs text-[#0082CA] hover:text-[#002D72] hover:underline cursor-pointer px-3"
                        >
                          {isEs ? 'Obtener ayuda' : 'Get help'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 9: ACCOUNT SECURED (TERMINATED SESSION ON LEFT) */}
              {isStep9 && (
                <div className="bg-[#FEF3F2] border-2 border-[#FECDCA] rounded-xl p-5 text-center space-y-3 shadow-2xs">
                  <div className="w-10 h-10 rounded-full bg-[#FEE4E2] text-[#B42318] flex items-center justify-center mx-auto">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#912018]">
                    {isEs ? 'Sesión Desconectada' : 'Session Terminated'}
                  </h4>
                  <p className="text-xs text-[#7A271A] leading-relaxed">
                    {isEs
                      ? 'Los rieles de pago fueron congelados tras la confirmación en el teléfono previo. Esta sesión no autorizada no puede realizar transferencias.'
                      : 'All outgoing payment rails have been frozen following pre-change phone confirmation. This session cannot initiate transfers.'}
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={onOpenScamModal}
                      className="min-h-[44px] inline-flex items-center justify-center text-xs text-[#0082CA] hover:underline cursor-pointer px-3"
                    >
                      {isEs ? 'Obtener ayuda' : 'Get help'}
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
                  <span className="text-[11px]">{isEs ? 'Inicio' : 'Home'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('pay')}
                  className={`min-h-[44px] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                    activeTab === 'pay' ? 'text-[#002D72] font-bold' : 'text-[#5B6B7A] hover:text-[#002D72]'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  <span className="text-[11px]">{isEs ? 'Pagar' : 'Pay'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`min-h-[44px] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                    activeTab === 'activity' ? 'text-[#002D72] font-bold' : 'text-[#5B6B7A] hover:text-[#002D72]'
                  }`}
                >
                  <List className="w-5 h-5" />
                  <span className="text-[11px]">{isEs ? 'Actividad' : 'Activity'}</span>
                </button>
                <button
                  onClick={onOpenScamModal}
                  className="min-h-[44px] flex flex-col items-center justify-center gap-1 text-[#B42318] hover:text-[#912018] cursor-pointer"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="text-[11px]">{isEs ? 'Ayuda' : 'Help'}</span>
                </button>
              </div>
              <div className="pb-1.5 pt-0.5 flex justify-center bg-white max-sm:pb-3">
                <div className="w-[134px] h-[5px] bg-slate-300 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT PHONE: Sarah's phone on file before the change (•••-4821)           */}
      {/* ========================================================================= */}
      <div className="flex flex-col items-center w-full min-[900px]:w-auto">
        {/* Frame Label Above */}
        <div className="w-full text-center mb-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{isEs ? 'Teléfono registrado de Sarah previo al cambio (•••-4821)' : "Sarah's phone on file before the change (•••-4821)"}</span>
          </span>
        </div>

        {/* Phone Frame Container: Exact real phone proportions */}
        <div
          className="relative select-none mx-auto transition-all duration-150
                     border-[10px] border-slate-900 rounded-[44px] shadow-2xl bg-slate-900
                     max-sm:border-0 max-sm:rounded-none max-sm:shadow-none max-sm:w-full max-sm:h-full max-sm:max-w-none max-sm:aspect-auto"
          style={{
            height: 'min(780px, calc(100vh - 170px))',
            aspectRatio: '9 / 19.5',
            width: 'auto',
          }}
        >
          {/* Inner Screen (34px radius) */}
          <div className="w-full h-full rounded-[34px] max-sm:rounded-none overflow-hidden flex flex-col bg-[#F4F8FA] relative">
            {/* Dynamic-island pill centered at the top (120×30, black) */}
            <div className="w-[120px] h-[30px] bg-black rounded-full absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center justify-between px-3 max-sm:hidden">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900/60" />
            </div>

            {/* Status bar 44px tall: time left, signal/wifi/battery right */}
            <div className="h-[44px] bg-[#002D72] text-white px-6 flex items-center justify-between text-xs font-semibold shrink-0 relative z-20">
              <span className="font-mono text-xs pl-1">9:41</span>
              <div className="flex items-center gap-1.5 pr-1">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* SMS / Push Header */}
            <div className="bg-[#002D72] text-white px-4 py-2 flex items-center justify-between shrink-0 border-b border-[#001D4A]">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#0082CA]" />
                <div>
                  <span className="font-serif font-bold text-sm tracking-tight block">
                    Sound Guardian Alert
                  </span>
                  <span className="text-[10px] text-[#E1F0F8]/80 font-mono">
                    Line: •••-4821 (Verified record)
                  </span>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                ✓
              </div>
            </div>

            {/* Scrollable Screen Body with 15px base font scaling with largeText */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-100/60"
              style={{ fontSize: largeText ? '17px' : '15px' }}
            >
              {/* STEPS 1-5: SMS Notifications Received on Sarah's Real Phone */}
              {stepIndex < 5 && (
                <div className="bg-white rounded-xl p-4 border border-[#D0D9E2] space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[#D0D9E2]">
                    <span className="font-bold text-[#002D72]">
                      {isEs ? 'Mensajes de Seguridad Sound' : 'Sound Security Messages'}
                    </span>
                    <span className="text-[10px] text-[#5B6B7A] font-mono">76863 (SCU)</span>
                  </div>

                  {stepIndex === 0 && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-[#5B6B7A] space-y-1">
                      <div className="text-[10px] text-slate-400 font-mono">22:02</div>
                      <p>
                        {isEs
                          ? 'Sound: Intento de inicio de sesión no reconocido registrado.'
                          : 'Sound: Unrecognized login attempt detected on your mobile banking.'}
                      </p>
                    </div>
                  )}

                  {stepIndex === 1 && (
                    <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-200 text-xs text-[#002D72] space-y-1">
                      <div className="text-[10px] text-blue-500 font-mono">22:06</div>
                      <p className="font-medium">
                        {isEs
                          ? 'Sound: Su código de verificación es 849-210. No comparta este código con nadie.'
                          : 'Sound: Your one-time verification passcode is 849-210. Never share this code with anyone.'}
                      </p>
                    </div>
                  )}

                  {stepIndex === 2 && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-[#5B6B7A] space-y-1">
                      <div className="text-[10px] text-slate-400 font-mono">22:09</div>
                      <p>
                        {isEs
                          ? 'Sound: Se completó el restablecimiento de contraseña de su cuenta.'
                          : 'Sound: Password was reset for your digital banking account.'}
                      </p>
                    </div>
                  )}

                  {stepIndex === 3 && (
                    <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
                      <div className="text-[10px] text-amber-600 font-mono">22:14</div>
                      <p className="font-medium">
                        {isEs
                          ? 'Sound: Su correo de perfil fue modificado. Si no lo reconoció, contáctenos inmediatamente.'
                          : 'Sound: Your profile email was updated. If you did not make this change, contact us immediately.'}
                      </p>
                    </div>
                  )}

                  {stepIndex === 4 && (
                    <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
                      <div className="text-[10px] text-amber-600 font-mono">22:15</div>
                      <p className="font-medium">
                        {isEs
                          ? 'Sound Alerta: Se detectó una solicitud para cambiar su teléfono registrado a (555) 019-2834.'
                          : 'Sound Alert: A request to update your registered phone to (555) 019-2834 was detected.'}
                      </p>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 text-center pt-2">
                    {isEs ? 'Esperando eventos de destinatario...' : 'Waiting for payee enrollment events...'}
                  </div>
                </div>
              )}

              {/* STEPS 6, 7, 8: THE CRITICAL QUARANTINE ALERT ON SARAH'S PRE-CHANGE PHONE */}
              {isQuarantineStep && (
                <div className="bg-white rounded-2xl p-4 border-2 border-[#002D72]/20 shadow-md space-y-3.5">
                  {/* Alert Header */}
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-lg bg-[#FEF3F2] text-[#B42318] shrink-0 mt-0.5">
                      <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#002D72] leading-tight">
                        {isEs
                          ? 'Sound Credit Union: Verificación de Nuevo Destinatario'
                          : 'Sound Credit Union: New Payee Authorization Required'}
                      </h4>
                      <span className="text-[10px] text-[#B42318] font-semibold block mt-0.5">
                        {isEs ? 'Enviado a su línea de confianza (•••-4821)' : 'Dispatched to your trusted line (•••-4821)'}
                      </span>
                    </div>
                  </div>

                  {/* MANDATORY EXACT ALERT TEXT */}
                  <div className="bg-[#FFFAEB] border-2 border-[#FEDF89] rounded-xl p-3 text-xs text-[#7A2E0E] space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#B54708]">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{isEs ? 'Aviso de Seguridad' : 'Security Alert'}</span>
                    </div>
                    <p className="font-semibold text-xs leading-relaxed text-[#7A2E0E]">
                      {isEs
                        ? '¿Acaba de restablecer su contraseña y agregar un nuevo destinatario? … Este código aprueba un NUEVO destinatario. Sound nunca le llamará ni le enviará mensajes solicitando este código.'
                        : 'Did you just reset your password and add a new payee? … This code approves a NEW payee. Sound will never call or text asking for this code.'}
                    </p>
                  </div>

                  {/* Payee Attempt Details */}
                  <div className="bg-[#F4F8FA] p-3 rounded-lg border border-[#D0D9E2] space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#5B6B7A]">{isEs ? 'Destinatario nuevo:' : 'New Payee:'}</span>
                      <strong className="text-[#002D72]">quick_transfer_p2p</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#5B6B7A]">{isEs ? 'Monto intentado:' : 'Attempted Amount:'}</span>
                      <strong className="font-mono text-[#002D72]">${currentAmount.toFixed(2)}</strong>
                    </div>
                    {isStep8 && (
                      <div className="text-[11px] text-[#B42318] font-semibold pt-1 border-t border-[#D0D9E2]">
                        {isEs ? 'Segundo intento detectado en 8 minutos' : 'Second transfer attempt detected within 8m'}
                      </div>
                    )}
                  </div>

                  {/* MANDATORY BUTTONS: [Freeze & Recover] and [Yes, this was me] with >=44px tap targets */}
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={onFreezeAndRecover}
                      className="w-full h-12 min-h-[44px] rounded-lg bg-[#002D72] hover:bg-[#001D4A] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{isEs ? 'Congelar y Recuperar' : 'Freeze & Recover'}</span>
                    </button>

                    <div className="text-center pt-0.5">
                      <button
                        onClick={onConfirmLegitimate}
                        className="min-h-[44px] inline-flex items-center justify-center text-xs text-[#067647] hover:underline cursor-pointer font-medium px-3"
                      >
                        {isEs ? 'Sí, fui yo' : 'Yes, this was me'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 9: YOUR ACCOUNT IS SECURED (GREEN CONFIRMATION & CASE IN QUEUE) */}
              {isStep9 && (
                <div className="bg-[#ECFDF3] border-2 border-[#A6F4C5] rounded-2xl p-5 text-center space-y-3.5 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-[#D1FADF] text-[#067647] flex items-center justify-center mx-auto shadow-2xs">
                    <CheckCircle2 className="w-7 h-7 stroke-[2.2]" />
                  </div>

                  {/* MANDATORY EXACT TITLE & OUTCOME */}
                  <div className="space-y-1.5">
                    <h4 className="font-serif font-bold text-base text-[#054F31]">
                      {isEs ? 'Su cuenta está protegida' : 'Your account is secured'}
                    </h4>
                    <p className="text-xs text-[#067647] leading-relaxed font-medium">
                      {isEs
                        ? 'Destinatario no autorizado bloqueado y saldos protegidos. Ningún fondo salió de su cuenta.'
                        : 'Unauthorized payee blocked and balances protected. Zero money left your account.'}
                    </p>
                  </div>

                  {/* Case in Staff Queue Notice */}
                  <div className="bg-white/80 rounded-xl p-3 border border-[#A6F4C5] text-left text-xs space-y-1 text-[#054F31]">
                    <div className="flex items-center justify-between font-bold">
                      <span>{isEs ? 'Caso de Fraude:' : 'Fraud Case:'}</span>
                      <span className="font-mono text-[#002D72]">#C-2026-1003</span>
                    </div>
                    <div className="text-[11px] text-[#5B6B7A]">
                      {isEs
                        ? 'Estado: DETENIDO en la cola de personal de Sound.'
                        : 'Status: STOPPED in Sound staff operations queue.'}
                    </div>
                    <div className="text-[11px] text-[#5B6B7A]">
                      {isEs
                        ? 'Total protegido: $3,006.33 ($1,574.18 + $1,432.15)'
                        : 'Total protected: $3,006.33 ($1,574.18 + $1,432.15)'}
                    </div>
                  </div>

                  {/* View Case in Staff Console Link/Button */}
                  <button
                    onClick={() => onSwitchToStaffConsole?.('cases')}
                    className="w-full h-11 min-h-[44px] rounded-lg bg-[#067647] hover:bg-[#054F31] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                  >
                    <span>{isEs ? 'Ver caso en consola de personal' : 'View case in staff queue'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Bottom: 5px home indicator bar (134px wide, rounded) */}
            <div className="bg-[#F4F8FA] border-t border-[#D0D9E2]/40 shrink-0 py-2 flex justify-center max-sm:pb-3">
              <div className="w-[134px] h-[5px] bg-slate-300 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
