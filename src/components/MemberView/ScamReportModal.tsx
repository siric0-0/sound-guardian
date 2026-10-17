import React, { useState } from 'react';
import {
  AlertOctagon,
  PhoneCall,
  Lock,
  ArrowRight,
  CheckCircle2,
  X,
  FileText,
  Shield,
} from 'lucide-react';

interface ScamReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'es';
  onSubmitReport: (details: { description: string; rail: string; amount: string }) => void;
  isReported: boolean;
  caseId?: string;
}

export const ScamReportModal: React.FC<ScamReportModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSubmitReport,
  isReported,
  caseId = 'C-2026-9812',
}) => {
  const isEs = lang === 'es';
  const [description, setDescription] = useState('');
  const [selectedRail, setSelectedRail] = useState('P2P');
  const [amountStr, setAmountStr] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#D0D9E2] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#B42318] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertOctagon className="w-5 h-5" />
            <h3 className="font-serif font-bold text-base">
              {isEs ? 'Reporte de Emergencia de Fraude' : 'Emergency Scam Reporting & Recovery'}
            </h3>
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
          {!isReported ? (
            <>
              {/* Primary Compassionate Copy */}
              <div className="bg-[#FEF3F2] p-4 rounded-xl border border-[#FECDCA] space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#912018]">
                  {isEs
                    ? 'Estamos aquí para ayudarle, y no es su culpa.'
                    : "We're here to help, and it's not your fault."}
                </h4>
                <p className="text-xs sm:text-sm text-[#7A271A] leading-relaxed">
                  {isEs
                    ? 'Los estafadores engañan a personas cuidadosas todos los días. Cuéntenos qué ocurrió y actuaremos de inmediato. Cuanto antes informe, mayores serán las probabilidades de recuperar su dinero.'
                    : 'Scams fool careful people every day. Tell us what happened and we will act right away. The sooner you report, the better the chance we can get money back.'}
                </p>
              </div>

              {/* Four automatic actions Sound will take */}
              <div className="space-y-1.5 text-xs text-[#1B2733]">
                <span className="font-semibold text-[#002D72]">
                  {isEs
                    ? 'Al enviar este reporte, Sound Credit Union activará inmediatamente:'
                    : 'Upon submission, Sound Credit Union will immediately:'}
                </span>
                <ul className="space-y-1 text-[11px] text-[#5B6B7A]">
                  <li className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#B42318]" />
                    <span>Freeze all outgoing payment rails instantly to prevent further movement</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#0082CA]" />
                    <span>Initiate emergency Wire Recall and ACH Return requests with correspondent networks</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#067647]" />
                    <span>Open a dedicated Priority Fraud Investigation Case</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-purple-600" />
                    <span>Book an immediate fraud investigator phone callback to your trusted line</span>
                  </li>
                </ul>
              </div>

              {/* Brief form */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#1B2733] mb-1">
                    {isEs ? '¿Qué tipo de transacción ocurrió?' : 'Transaction Rail (if known)'}
                  </label>
                  <select
                    value={selectedRail}
                    onChange={(e) => setSelectedRail(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-[#D0D9E2] bg-white text-[#1B2733]"
                  >
                    <option value="P2P">P2P (Quick / Instant transfer)</option>
                    <option value="Wire">Wire Transfer</option>
                    <option value="ACH">ACH Transfer / Direct Debit</option>
                    <option value="Cash">In-Branch Cash Withdrawal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B2733] mb-1">
                    {isEs ? 'Monto aproximado (opcional)' : 'Approximate Amount ($)'}
                  </label>
                  <input
                    type="text"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    placeholder="e.g. 1574.18"
                    className="w-full text-xs p-2 rounded-lg border border-[#D0D9E2] bg-white text-[#1B2733]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B2733] mb-1">
                    {isEs ? 'Cuéntenos brevemente qué sucedió' : 'Briefly tell us what happened'}
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Received a text asking to verify account, or someone instructed to make a payment..."
                    className="w-full text-xs p-2 rounded-lg border border-[#D0D9E2] bg-white text-[#1B2733]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
                <button
                  onClick={() =>
                    onSubmitReport({
                      description,
                      rail: selectedRail,
                      amount: amountStr,
                    })
                  }
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#B42318] hover:bg-[#912018] text-white font-semibold text-xs shadow-xs cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isEs ? 'Comenzar Ahora (Bloquear y Recuperar)' : 'Start Now (Freeze & Recover)'}</span>
                </button>

                <button
                  onClick={() =>
                    onSubmitReport({
                      description: 'Member requested immediate phone callback',
                      rail: selectedRail,
                      amount: amountStr,
                    })
                  }
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#F4F8FA] hover:bg-[#E1F0F8] text-[#002D72] border border-[#D0D9E2] font-medium text-xs cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{isEs ? 'Llámenme de inmediato' : 'Call Me Immediately'}</span>
                </button>
              </div>
            </>
          ) : (
            /* Successful report submitted state */
            <div className="bg-[#ECFDF3] border border-[#A6F4C5] rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-3 text-[#067647]">
                <div className="p-2 rounded-full bg-[#D1FADF]">
                  <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#054F31]">
                    {isEs ? 'Caso Abierto y Rieles Pausados' : 'Emergency Actions Executed'}
                  </h4>
                  <span className="font-tabular text-xs font-semibold text-[#067647]">
                    Case ID: {caseId}
                  </span>
                </div>
              </div>

              <div className="text-xs text-[#054F31] space-y-1.5 leading-relaxed">
                <p>
                  <strong>Outgoing Rails:</strong> Frozen across online, mobile, and card networks.
                </p>
                <p>
                  <strong>Recalls Dispatched:</strong> Automated network recall and return notices transmitted to recipient institution.
                </p>
                <p>
                  <strong>Callback Scheduled:</strong> A fraud investigator will call your pre-change verified phone within 20 minutes.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full mt-2 py-2 px-4 rounded-lg bg-[#067647] hover:bg-[#054F31] text-white font-semibold text-xs cursor-pointer"
              >
                {isEs ? 'Entendido' : 'Return to Banking'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
