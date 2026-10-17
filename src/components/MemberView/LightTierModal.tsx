import React from 'react';
import { ShieldCheck, CheckCircle2, PhoneCall, AlertCircle, Clock } from 'lucide-react';
import { TierBadge } from '../TierBadge.tsx';

interface LightTierModalProps {
  amount: number;
  lang: 'en' | 'es';
  isConfirmed: boolean;
  onConfirmYes: () => void;
  onConfirmNo: () => void;
  onRequestHelp: () => void;
}

export const LightTierModal: React.FC<LightTierModalProps> = ({
  amount,
  lang,
  isConfirmed,
  onConfirmYes,
  onConfirmNo,
  onRequestHelp,
}) => {
  const isEs = lang === 'es';

  if (isConfirmed) {
    return (
      <div className="bg-[#ECFDF3] border-2 border-[#A6F4C5] rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-[#D1FADF] text-[#067647] shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#054F31]">
              {isEs ? 'Listo. Su pago está en camino.' : 'Done. Your payment is on its way.'}
            </h3>
            <p className="text-sm text-[#054F31] leading-relaxed">
              {isEs
                ? 'Gracias por confirmar. Esto tomó 8 segundos.'
                : 'Thanks for confirming. This took 8 seconds.'}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#067647] pt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {isEs ? 'Liberado automáticamente sin demora' : 'Auto-cleared via LIGHT verification'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFAEB] border-2 border-[#FEDF89] rounded-xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full bg-[#FEF0C7] text-[#B54708] shrink-0">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-serif text-lg font-bold text-[#93370D]">
              {isEs ? 'Verificación rápida: ¿fue usted?' : 'Quick check: was this you?'}
            </h3>
            <TierBadge tier="LIGHT" size="sm" />
          </div>

          <p className="text-sm text-[#7A2E0E] leading-relaxed">
            {isEs
              ? `Recientemente restableció su contraseña y actualizó su dirección, y este es un nuevo destinatario. Toque a continuación para confirmar este pago de $${amount.toFixed(2)}.`
              : `You recently reset your password and updated your address, and this is a new payee. Tap below to confirm this $${amount.toFixed(2)} payment.`}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
            <button
              onClick={onConfirmYes}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#067647] hover:bg-[#054F31] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEs ? 'Sí, fui yo' : 'Yes, this was me'}</span>
            </button>

            <button
              onClick={onConfirmNo}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#B42318] hover:bg-[#912018] text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{isEs ? 'No, no fui yo' : "No, this wasn't me"}</span>
            </button>

            <button
              onClick={onRequestHelp}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-[#93370D] border border-[#FEDF89] font-medium text-xs transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{isEs ? 'Deseo hablar con alguien' : "I'd like to talk to someone"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
