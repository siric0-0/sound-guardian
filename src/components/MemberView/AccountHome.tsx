import React, { useState } from 'react';
import {
  CreditCard,
  Send,
  AlertOctagon,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
  Smartphone,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { DemoEvent, ArbiterDecision, SentrySignals, ScenarioId } from '../../types.ts';
import { maskAccount, maskPhone, tokenizeMemberId } from '../../lib/tokenization.ts';
import { SendMoneyModal } from './SendMoneyModal.tsx';
import { RealMemberAlert } from './RealMemberAlert.tsx';
import { LightTierModal } from './LightTierModal.tsx';
import { QuarantineFastPath } from './QuarantineFastPath.tsx';
import { QuarantineScreen } from './QuarantineScreen.tsx';

interface AccountHomeProps {
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
  onRequestHelp: () => void;
  onOpenScamModal: () => void;
  onRequestFastPath: () => void;
  onRequestAtBranch?: () => void;
}

export const AccountHome: React.FC<AccountHomeProps> = ({
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
  onRequestHelp,
  onOpenScamModal,
  onRequestFastPath,
  onRequestAtBranch,
}) => {
  const isEs = lang === 'es';
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [showRealPhoneSimulator, setShowRealPhoneSimulator] = useState(true);

  const memberToken = tokenizeMemberId(currentEvent.synthetic_member_id);
  const isATO = scenarioId === 'sarah_ato';
  const isMover = scenarioId === 'mover_legitimate';
  const isJames = scenarioId === 'james_branch';

  const checkingBalance = currentEvent.available_balance_after || 5420.50;
  const isQuarantineActive = decision?.tier === 'QUARANTINE';
  const isLightActive = decision?.tier === 'LIGHT';

  return (
    <div className={`space-y-6 ${largeText ? 'text-lg' : ''}`}>
      {/* SCU Digital Banking Navigation Header */}
      <div className="bg-white rounded-xl border border-[#D0D9E2] shadow-xs overflow-hidden">
        {/* Portal Greeting Banner */}
        <div className="bg-[#002D72] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-serif font-bold text-xl sm:text-2xl text-white">
                {isEs ? 'Bienvenida a la Banca Digital de Sound, Sarah' : 'Welcome to Sound Digital Banking, Sarah'}
              </span>
              <span className="font-tabular text-xs font-mono px-2 py-0.5 rounded bg-white/20 text-[#E1F0F8] border border-white/20">
                {memberToken}
              </span>
            </div>
            <p className="text-xs text-[#E1F0F8]/80 font-serif italic">
              {isEs
                ? 'A su lado en todas las olas de la vida · Miembro desde 2019'
                : 'Standing with you through all waves of life · Member since 2019'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* System Integration Badge */}
            <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0082CA]/30 border border-[#0082CA]/50 text-[#E1F0F8] text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-[#56BBEB]" />
              <span>Sound Guardian Pre-Send Hook Active</span>
            </div>

            {/* Emergency "I think I've been scammed" Button */}
            <button
              onClick={onOpenScamModal}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FEF3F2] hover:bg-[#FEE4E2] text-[#B42318] border-2 border-[#FECDCA] font-bold text-xs transition-all shadow-xs cursor-pointer ${
                largeText ? 'min-h-[48px] px-5 py-3 text-sm' : ''
              }`}
              aria-label="I think I've been scammed emergency report button"
            >
              <AlertOctagon className="w-4 h-4 shrink-0 text-[#B42318]" />
              <span>{isEs ? 'Creo que me han estafado' : "I think I've been scammed"}</span>
            </button>
          </div>
        </div>

        {/* Digital Banking Feature Tabs */}
        <div className="bg-[#F4F8FA] px-4 sm:px-6 py-2 border-t border-[#D0D9E2] flex items-center justify-between overflow-x-auto text-xs font-semibold text-[#002D72]">
          <div className="flex items-center gap-6 min-w-max">
            <button className="text-[#0082CA] border-b-2 border-[#0082CA] py-1.5 font-bold cursor-pointer">
              {isEs ? 'Cuentas y Saldos' : 'Accounts & Balances'}
            </button>
            <button
              onClick={() => setIsSendModalOpen(true)}
              className="hover:text-[#0082CA] py-1.5 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-[#0082CA]" />
              <span>{isEs ? 'Enviar con Zelle®' : 'Send with Zelle®'}</span>
            </button>
            <button className="hover:text-[#0082CA] py-1.5 transition-colors cursor-pointer">
              {isEs ? 'Transferencias y Pagos' : 'Transfers & Bill Pay'}
            </button>
            <button className="hover:text-[#0082CA] py-1.5 transition-colors cursor-pointer">
              {isEs ? 'Estados de Cuenta' : 'Statements & Documents'}
            </button>
          </div>

          <span className="hidden sm:inline-block text-[11px] text-[#5B6B7A] font-normal">
            Sound Routing: <strong className="font-mono text-[#002D72]">325183220</strong>
          </span>
        </div>
      </div>

      {/* ATO Interactive Intercept Section */}
      {isATO && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#002D72] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#0082CA]" />
              <span>Real-Time ATO Defense Layer (Pre-Send Intercept)</span>
            </h3>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#5B6B7A]">Simulated Device:</span>
              <button
                onClick={() => setShowRealPhoneSimulator(false)}
                className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                  !showRealPhoneSimulator
                    ? 'bg-[#002D72] text-white'
                    : 'bg-white border border-[#D0D9E2] text-[#1B2733]'
                }`}
              >
                Attacker Session
              </button>
              <button
                onClick={() => setShowRealPhoneSimulator(true)}
                className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                  showRealPhoneSimulator
                    ? 'bg-[#002D72] text-white'
                    : 'bg-white border border-[#D0D9E2] text-[#1B2733]'
                }`}
              >
                Real Member's Phone
              </button>
            </div>
          </div>

          {showRealPhoneSimulator ? (
            /* Real Sarah's Phone Alert */
            <RealMemberAlert
              amount={currentEvent.amount || 1574.18}
              timeFormatted={
                currentEvent.event_type === 'Recipient Added'
                  ? '10:19 PM'
                  : currentEvent.event_timestamp?.includes(' ')
                  ? currentEvent.event_timestamp.split(' ')[1]?.slice(0, 5) || '10:19 PM'
                  : '10:19 PM'
              }
              lang={lang}
              isFrozen={!!memberActions.frozen}
              isBranchPriority={!!memberActions.branchPriority}
              onFreezeAndRecover={onFreezeAndRecover}
              onConfirmLegitimate={onConfirmLegitimate}
              onRequestAtBranch={onRequestAtBranch}
            />
          ) : (
            /* Attacker's Intercepted Session */
            <QuarantineScreen
              amount={currentEvent.amount || 1574.18}
              maskedPhone="•••-•••-4821"
              lang={lang}
              onAcknowledge={() => {}}
              onRequestFastPath={onRequestFastPath}
              onRequestAtBranch={onRequestAtBranch}
              isBranchPriority={!!memberActions.branchPriority}
            />
          )}

          {/* Fast Path Modal if toggled */}
          {memberActions.fastPathRequested && (
            <QuarantineFastPath
              lang={lang}
              onClose={onRequestFastPath}
              onSimulateBranchVerify={onConfirmLegitimate}
            />
          )}
        </div>
      )}

      {/* Mover Light Tier One-Tap Section */}
      {isMover && isLightActive && (
        <div className="space-y-2">
          <LightTierModal
            amount={currentEvent.amount || 4151.68}
            lang={lang}
            isConfirmed={!!memberActions.confirmedMover}
            onConfirmYes={onConfirmMoverYes}
            onConfirmNo={onConfirmMoverNo}
            onRequestHelp={onRequestHelp}
          />
        </div>
      )}

      {/* James Imposter Scam Note in Member View */}
      {isJames && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 sm:p-5 text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <AlertOctagon className="w-4 h-4 text-amber-700" />
            <span>Sound Credit Union Security Advisory</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed">
            {isEs
              ? 'Recuerde: Ningún empleado de Sound Credit Union, agente de la ley o agencia gubernamental le pedirá que retire efectivo con urgencia, compre tarjetas de regalo o transfiera fondos en secreto.'
              : 'Remember: No Sound Credit Union employee, law enforcement officer, or government agency will ever ask you to withdraw cash urgently, purchase gift cards, or keep a transfer secret.'}
          </p>
          <div className="pt-1">
            <button
              onClick={onOpenScamModal}
              className="text-xs font-semibold text-amber-800 underline hover:text-amber-900 cursor-pointer"
            >
              {isEs ? 'Reportar una llamada o mensaje sospechoso' : 'Report a suspicious call or instruction'}
            </button>
          </div>
        </div>
      )}

      {/* Account Balances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Checking Account Card */}
        <div className="bg-white rounded-xl border border-[#D0D9E2] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#5B6B7A] mb-2">
              <span className="font-semibold text-[#1B2733]">
                {isEs ? 'Cuenta Corriente Principal' : 'Primary Checking'}
              </span>
              <span className="font-tabular font-mono">{maskAccount('1003')}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-tabular text-[#002D72]">
              ${checkingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-[#067647] font-medium">Available Balance</span>
          </div>

          <div className="flex items-center gap-2 pt-5 border-t border-[#D0D9E2]/60 mt-4">
            <button
              onClick={() => setIsSendModalOpen(true)}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#002D72] hover:bg-[#1F4A8C] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer ${
                largeText ? 'min-h-[48px] py-3 text-sm' : ''
              }`}
            >
              <Send className="w-3.5 h-3.5 text-[#56BBEB]" />
              <span>{isEs ? 'Enviar con Zelle®' : 'Send with Zelle®'}</span>
            </button>

            <button
              className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#F4F8FA] hover:bg-[#E1F0F8] text-[#002D72] border border-[#D0D9E2] text-xs font-medium transition-colors cursor-pointer ${
                largeText ? 'min-h-[48px] py-3 text-sm' : ''
              }`}
            >
              <span>{isEs ? 'Transferir' : 'Transfer'}</span>
            </button>
          </div>
        </div>

        {/* Savings Account Card */}
        <div className="bg-white rounded-xl border border-[#D0D9E2] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#5B6B7A] mb-2">
              <span className="font-semibold text-[#1B2733]">
                {isEs ? 'Ahorros de Alto Rendimiento' : 'High-Yield Savings'}
              </span>
              <span className="font-tabular font-mono">{maskAccount('8821')}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-tabular text-[#002D72]">
              $14,250.00
            </div>
            <span className="text-[11px] text-[#067647] font-medium">Available Balance</span>
          </div>

          <div className="flex items-center gap-2 pt-5 border-t border-[#D0D9E2]/60 mt-4">
            <button
              className={`w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#F4F8FA] hover:bg-[#E1F0F8] text-[#002D72] border border-[#D0D9E2] text-xs font-medium transition-colors cursor-pointer ${
                largeText ? 'min-h-[48px] py-3 text-sm' : ''
              }`}
            >
              <span>{isEs ? 'Ver Estado de Cuenta' : 'View Statements'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl border border-[#D0D9E2] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#D0D9E2] flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#002D72]">
            {isEs ? 'Actividad Reciente de la Cuenta' : 'Recent Account Activity'}
          </h4>
          <span className="text-xs text-[#5B6B7A]">Observable Event Stream</span>
        </div>

        <div className="divide-y divide-[#D0D9E2]">
          {events.slice(0, 6).map((ev) => {
            const isOut = ev.transaction_direction === 'Outgoing' || ev.event_type.includes('Payment');
            return (
              <div
                key={ev.event_id}
                className="px-5 py-3 flex items-center justify-between hover:bg-[#F4F8FA] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      isOut ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    {isOut ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#1B2733]">
                      {ev.event_type}
                    </div>
                    <div className="text-[11px] text-[#5B6B7A]">
                      {ev.event_timestamp} · {ev.channel}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {ev.amount > 0 ? (
                    <div
                      className={`font-tabular text-xs font-bold ${
                        isOut ? 'text-[#B42318]' : 'text-[#067647]'
                      }`}
                    >
                      {isOut ? '-' : '+'}${ev.amount.toFixed(2)}
                    </div>
                  ) : (
                    <span className="text-[11px] text-[#5B6B7A]">{ev.event_category}</span>
                  )}
                  <div className="text-[10px] text-[#5B6B7A]">
                    {ev.payment_status || 'Processed'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Send Money Modal */}
      <SendMoneyModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        lang={lang}
        currentTier={decision?.tier}
        isPausedBeforeSend={decision?.action === 'PAUSE_BEFORE_SEND'}
        onAttemptSend={() => {}}
        onRequestFastPath={onRequestFastPath}
        maskedPhone={maskPhone()}
      />
    </div>
  );
};
