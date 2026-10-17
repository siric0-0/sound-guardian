import React from 'react';
import { ShieldAlert, Phone, HelpCircle, AlertTriangle, Building2 } from 'lucide-react';
import { TierBadge } from '../TierBadge.tsx';

interface QuarantineScreenProps {
  amount?: number;
  payeeName?: string;
  maskedPhone: string;
  lang: 'en' | 'es';
  onAcknowledge: () => void;
  onRequestFastPath: () => void;
  onRequestAtBranch?: () => void;
  isBranchPriority?: boolean;
}

export const QuarantineScreen: React.FC<QuarantineScreenProps> = ({
  amount = 1574.18,
  payeeName = 'quick_transfer_p2p (REC_8821)',
  maskedPhone,
  lang,
  onAcknowledge,
  onRequestFastPath,
  onRequestAtBranch,
  isBranchPriority,
}) => {
  const isEs = lang === 'es';

  return (
    <div className="bg-[#FEF3F2] border-2 border-[#FECDCA] rounded-xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full bg-[#FEE4E2] text-[#B42318] ring-4 ring-[#FEF3F2] shrink-0">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="space-y-3.5 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#912018]">
                {isEs ? 'Destinatario Bloqueado · Confirmación Requerida' : 'Payee Blocked · Pre-Change Confirmation Required'}
              </h3>
              <p className="text-xs text-[#7A271A]">
                {isEs ? 'Activado al momento de agregar el destinatario (10:19 PM)' : 'Fired at payee enrollment (10:19 PM). Payee cannot receive money.'}
              </p>
            </div>
            <TierBadge tier="QUARANTINE" size="sm" />
          </div>

          {/* Mandatory Coercion Warning */}
          <div className="bg-[#FFFAEB] border border-[#FEDF89] rounded-lg p-3 text-xs text-[#93370D] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#B54708]">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Mandatory Coercion Warning</span>
            </div>
            <p className="font-semibold text-xs text-[#7A2E0E]">
              {isEs
                ? '"Este código aprueba un NUEVO destinatario y pagos hacia él. Sound nunca le llamará ni le enviará mensajes solicitando este código."'
                : '"This code approves a NEW payee and payments to it. Sound will never call or text asking for this code."'}
            </p>
          </div>

          <p className="text-sm text-[#7A271A] leading-relaxed">
            {isEs
              ? `Para proteger sus fondos, enviamos una confirmación al teléfono de confianza registrado antes de las modificaciones recientes (${maskedPhone}). Este destinatario no puede recibir fondos hasta que sea confirmado allí.`
              : `To keep your money safe, a confirmation was dispatched to the phone number on file before recent account modifications (${maskedPhone}). Sound keeps this contact history on hand for 90 days. Because P2P cannot be recalled after submit, payments to this payee are locked upfront.`}
          </p>

          <div className="bg-white/90 rounded-lg p-3 border border-[#FECDCA] text-xs text-[#7A271A] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#912018]">Automated 24/7 Verification Status:</span>
              <span className="font-mono text-[11px] bg-red-100 px-2 py-0.5 rounded text-red-900 font-bold">
                Unresolved · Next Business Hours Queue
              </span>
            </div>
            <p className="text-[11px] text-[#5B6B7A] leading-relaxed">
              Automated verification runs 24/7 at any hour with zero staff required. If unresolved, items roll to the 8:00 AM PST business hours queue.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              onClick={onAcknowledge}
              className="px-4 py-2 rounded-lg bg-[#B42318] hover:bg-[#912018] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              {isEs ? 'Entendido' : 'Okay'}
            </button>

            {onRequestAtBranch && (
              <button
                onClick={onRequestAtBranch}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  isBranchPriority
                    ? 'bg-purple-100 text-purple-900 border-purple-300 ring-2 ring-purple-400'
                    : 'bg-white hover:bg-slate-50 text-[#002D72] border-[#D0D9E2]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-[#0082CA]" />
                <span>{isBranchPriority ? 'Marked Branch Priority' : 'Request at Branch (Priority)'}</span>
              </button>
            )}

            <button
              onClick={onRequestFastPath}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white hover:bg-slate-50 text-[#912018] border border-[#FECDCA] text-xs font-medium transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Fast-Path Options</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
