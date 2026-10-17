import React from 'react';
import { Smartphone, Shield, Lock, PhoneCall, CheckCircle2, AlertTriangle, Building2 } from 'lucide-react';

interface RealMemberAlertProps {
  amount?: number;
  payeeName?: string;
  timeFormatted?: string;
  lang: 'en' | 'es';
  isFrozen: boolean;
  isBranchPriority?: boolean;
  onFreezeAndRecover: () => void;
  onConfirmLegitimate: () => void;
  onRequestAtBranch?: () => void;
}

export const RealMemberAlert: React.FC<RealMemberAlertProps> = ({
  amount = 1574.18,
  payeeName = 'quick_transfer_p2p (REC_8821)',
  timeFormatted = '10:19 PM',
  lang,
  isFrozen,
  isBranchPriority,
  onFreezeAndRecover,
  onConfirmLegitimate,
  onRequestAtBranch,
}) => {
  const isEs = lang === 'es';

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-[#002D72]/20 overflow-hidden">
      {/* Smartphone Banner Simulator */}
      <div className="bg-[#002D72] text-white px-4 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#0082CA]" />
          <span className="font-semibold tracking-wide">
            {isEs
              ? 'Teléfono Previo al Cambio (Historial de 90 Días Sound · •••-•••-4821)'
              : "Sarah's Trusted Phone (Sound 90-Day Pre-Change Record · •••-•••-4821)"}
          </span>
        </div>
        <span className="text-[11px] text-[#E1F0F8]/80 font-tabular">{timeFormatted}</span>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {!isFrozen ? (
          <>
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-[#FEF3F2] text-[#B42318] shrink-0">
                <Shield className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#002D72] leading-snug">
                  {isEs
                    ? 'Sound Credit Union: Verificación de Nuevo Destinatario'
                    : 'Sound Credit Union: New Payee Authorization Required'}
                </h4>
                <p className="text-xs text-[#B42318] font-semibold mt-0.5">
                  {isEs
                    ? 'Disparado automáticamente al registrar el destinatario (10:19 PM)'
                    : 'Dispatched automatically at 10:19 PM upon payee enrollment'}
                </p>
              </div>
            </div>

            {/* Mandatory Coercion Warning Box */}
            <div className="bg-[#FFFAEB] border-2 border-[#FEDF89] rounded-xl p-3.5 text-xs text-[#93370D] space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-sm text-[#B54708]">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  {isEs ? 'Advertencia Obligatoria contra Coerción' : 'Coercion & Imposter Warning'}
                </span>
              </div>
              <p className="font-semibold text-xs leading-relaxed text-[#7A2E0E]">
                {isEs
                  ? '"Este código aprueba un NUEVO destinatario y pagos hacia él. Sound nunca le llamará ni le enviará mensajes solicitando este código."'
                  : '"This code approves a NEW payee and payments to it. Sound will never call or text asking for this code."'}
              </p>
            </div>

            {/* Payee Details & Pre-Send Explanation */}
            <div className="bg-[#F4F8FA] p-3.5 rounded-lg border border-[#D0D9E2] space-y-2 text-xs text-[#1B2733]">
              <div>
                <span className="text-[#5B6B7A]">Payee Attempted: </span>
                <strong className="text-[#002D72]">{payeeName}</strong>
              </div>
              <p className="text-[11px] text-[#5B6B7A] leading-relaxed">
                {isEs
                  ? 'Debido a un cambio reciente de contraseña y teléfono, este destinatario no puede recibir fondos hasta que usted lo autorice desde su número de confianza.'
                  : 'Because your password and contact info were recently updated, this new payee is blocked from receiving money until you authorize it here. Sound cannot pause P2P after submit, so the payee is blocked upfront.'}
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-[#D0D9E2]">
                <span className="text-[11px] text-[#5B6B7A]">Automated Verification Code:</span>
                <span className="font-mono font-bold text-sm bg-white px-2.5 py-0.5 rounded border border-[#0082CA] text-[#002D72] tracking-wider">
                  849-210
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
              <button
                onClick={onFreezeAndRecover}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#B42318] hover:bg-[#912018] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>{isEs ? 'Congelar y Recuperar (No fui yo)' : 'Freeze & Recover (This Was Not Me)'}</span>
              </button>

              <button
                onClick={onConfirmLegitimate}
                className="inline-flex items-center justify-center px-4 py-3 rounded-lg bg-[#ECFDF3] hover:bg-[#D1FADF] text-[#067647] border border-[#A6F4C5] font-semibold text-xs transition-colors cursor-pointer"
              >
                <span>{isEs ? 'Aprobar Destinatario' : 'Approve Payee'}</span>
              </button>

              {onRequestAtBranch && (
                <button
                  onClick={onRequestAtBranch}
                  className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    isBranchPriority
                      ? 'bg-purple-100 text-purple-900 border-purple-300 ring-2 ring-purple-400'
                      : 'bg-white hover:bg-slate-50 text-[#002D72] border-[#D0D9E2]'
                  }`}
                  title="Marks case as PRIORITY for when you visit a branch"
                >
                  <Building2 className="w-4 h-4 text-[#0082CA]" />
                  <span>{isBranchPriority ? 'Priority Branch Flagged' : 'Request at Branch'}</span>
                </button>
              )}
            </div>

            <div className="text-[10px] text-[#5B6B7A] text-center pt-1">
              Unresolved automated items transfer to Sound's next business hours review queue at 8:00 AM PST.
            </div>
          </>
        ) : (
          /* Secured confirmation state */
          <div className="bg-[#ECFDF3] border border-[#A6F4C5] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-3 text-[#067647]">
              <div className="p-2 rounded-full bg-[#D1FADF]">
                <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h4 className="font-serif font-bold text-base text-[#054F31]">
                {isEs ? 'Su cuenta está protegida.' : 'Your account is secured.'}
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-[#054F31] leading-relaxed">
              {isEs
                ? 'El nuevo destinatario fue revocado permanentemente. Ningún pago de $1,574.18 ni de $1,432.15 pudo salir. Se abrió el caso de fraude #C-2026-1003 y nuestro equipo le llamará a su número de confianza.'
                : 'The unauthorized payee was immediately revoked. Neither the $1,574.18 nor $1,432.15 payments could be initiated. Fraud case #C-2026-1003 is open and a specialist will call your trusted number.'}
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-[#067647] font-medium">
              <PhoneCall className="w-4 h-4" />
              <span>Priority Fraud Recovery Dispatch (0 Minutes Latency)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
