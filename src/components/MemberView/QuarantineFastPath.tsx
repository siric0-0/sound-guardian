import React, { useState, useEffect } from 'react';
import { Building2, PhoneCall, Clock, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface QuarantineFastPathProps {
  lang: 'en' | 'es';
  onClose: () => void;
  onSimulateBranchVerify: () => void;
}

export const QuarantineFastPath: React.FC<QuarantineFastPathProps> = ({
  lang,
  onClose,
  onSimulateBranchVerify,
}) => {
  const isEs = lang === 'es';
  const [secondsRemaining, setSecondsRemaining] = useState(3 * 3600 + 42 * 60 + 10); // 3:42:10

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl border border-[#D0D9E2] shadow-sm p-5 space-y-4">
      <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#D0D9E2]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#E1F0F8] text-[#002D72]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-base text-[#002D72]">
              {isEs ? 'Verificación alternativa de identidad' : 'Quarantine Fast-Path Resolution'}
            </h4>
            <p className="text-xs text-[#5B6B7A]">
              {isEs
                ? 'Para socios legítimos que actualizaron recientemente su teléfono o correo'
                : 'For legitimate members who recently updated contact information'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-[#5B6B7A] hover:text-[#1B2733] rounded-md cursor-pointer"
          aria-label="Close fast path view"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-[#F4F8FA] rounded-lg p-4 border border-[#D0D9E2] space-y-2">
        <p className="text-xs sm:text-sm text-[#1B2733] leading-relaxed">
          {isEs
            ? 'Su pago está retenido de manera segura. Como su teléfono y correo electrónico cambiaron recientemente, necesitamos confirmarlo por otra vía. Visite cualquier sucursal con identificación o llámenos, y lo liberaremos de inmediato.'
            : "Your payment is safely on hold. Because your phone and email changed recently, we need to confirm it's you another way. Visit any branch with ID, or call us, and we'll release it right away."}
        </p>

        <div className="flex items-center gap-2 pt-2 text-[#002D72] font-semibold text-xs sm:text-sm">
          <Clock className="w-4 h-4 text-[#0082CA]" />
          <span>{isEs ? 'Tiempo restante de retención: ' : 'Time remaining on hold: '}</span>
          <span className="font-tabular bg-white px-2 py-0.5 rounded border border-[#D0D9E2] font-mono text-[#B42318]">
            {formatTimer(secondsRemaining)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="p-3.5 rounded-lg border border-[#D0D9E2] bg-white flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#002D72] mb-1.5">
            <Building2 className="w-4 h-4 text-[#0082CA]" />
            <span>{isEs ? 'Opción 1: En Sucursal' : 'Option 1: In-Branch ID Check'}</span>
          </div>
          <p className="text-[11px] text-[#5B6B7A] mb-3">
            {isEs
              ? 'Presente su documento de identidad con foto emitido por el gobierno en cualquier sucursal de Sound Credit Union.'
              : 'Present government-issued photo ID at any Sound branch teller window for immediate release.'}
          </p>
          <button
            onClick={onSimulateBranchVerify}
            className="w-full py-1.5 px-3 rounded-md bg-[#002D72] hover:bg-[#1F4A8C] text-white text-xs font-medium cursor-pointer"
          >
            {isEs ? 'Simular Verificación en Sucursal' : 'Simulate Branch In-Person ID Check'}
          </button>
        </div>

        <div className="p-3.5 rounded-lg border border-[#D0D9E2] bg-white flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#002D72] mb-1.5">
            <PhoneCall className="w-4 h-4 text-[#0082CA]" />
            <span>{isEs ? 'Opción 2: Centro de Contacto' : 'Option 2: Contact Center Call'}</span>
          </div>
          <p className="text-[11px] text-[#5B6B7A] mb-3">
            {isEs
              ? 'Llámenos directamente para completar una verificación fuera de banda.'
              : 'Call our dedicated member support line to complete out-of-band verification with an agent.'}
          </p>
          <button
            onClick={onSimulateBranchVerify}
            className="w-full py-1.5 px-3 rounded-md bg-[#F4F8FA] hover:bg-[#E1F0F8] text-[#002D72] border border-[#D0D9E2] text-xs font-medium cursor-pointer"
          >
            {isEs ? 'Simular Verificación Telefónica' : 'Simulate Phone Out-of-Band Check'}
          </button>
        </div>
      </div>
    </div>
  );
};
