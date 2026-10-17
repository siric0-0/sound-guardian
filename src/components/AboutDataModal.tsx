import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Lock,
  UserCheck,
  Scale,
  Users,
  EyeOff,
  Database,
  X,
} from 'lucide-react';

interface AboutDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutDataModal: React.FC<AboutDataModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#D0D9E2] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#002D72] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-[#0082CA]" />
            <div>
              <h3 className="font-serif font-bold text-lg">
                About the Data & Responsible Design
              </h3>
              <p className="text-xs text-[#E1F0F8]/80">
                Sound Credit Union · HuskyHack 2026 AI Ethics & Privacy Principles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#1B2733] leading-relaxed">
          {/* Section 1: Data Used vs NOT Used */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#002D72] mb-2 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#0082CA]" />
              <span>1. Data Minimization: Used vs. Explicitly Excluded</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Data Used */}
              <div className="bg-[#ECFDF3] border border-[#A6F4C5] p-3.5 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#067647]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>DATA USED (Observable Events Only)</span>
                </div>
                <ul className="space-y-1 text-[11px] text-[#054F31] list-disc list-inside">
                  <li>Event sequence & exact timestamp</li>
                  <li>Event category & type (Password Reset, Profile Change)</li>
                  <li>Which contact field changed (Email, Phone, vs Address)</li>
                  <li>Recipient status (New vs Existing, age in days)</li>
                  <li>Payment rail (P2P, Wire, ACH, Cash) & amount</li>
                  <li>Ratio to member baseline spending</li>
                  <li>Channel of interaction (Mobile, Web, Branch)</li>
                </ul>
              </div>

              {/* Data NOT Used */}
              <div className="bg-[#FEF3F2] border border-[#FECDCA] p-3.5 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#B42318]">
                  <XCircle className="w-4 h-4" />
                  <span>DATA STRICTLY EXCLUDED</span>
                </div>
                <ul className="space-y-1 text-[11px] text-[#7A271A] list-disc list-inside">
                  <li>NO age, gender, race, or demographic traits</li>
                  <li>NO device intelligence or telemetry fingerprinting</li>
                  <li>NO behavioral biometrics (keystroke, mouse dynamics)</li>
                  <li>NO telecom carrier or SIM swap feeds</li>
                  <li>NO member email/SMS content, browsing or calls</li>
                  <li>NO consortium external blacklists</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: Deterministic Rules vs LLM Boundary */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#002D72] mb-2 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#0082CA]" />
              <span>2. Strict Boundary: Rules Decide, LLM Only Explains</span>
            </h4>
            <p className="bg-[#F4F8FA] p-3 rounded-lg border border-[#D0D9E2]">
              All security decisions (QUARANTINE, LIGHT, NO_ACTION) are executed strictly by deterministic TypeScript code in <strong>ARBITER</strong>. The LLM (Gemini 2.5 Flash) has <strong>zero authority to hold, pause, or release funds</strong>. The LLM is used solely to generate clear, calm, empathetic member copy and employee call scripts. If the LLM is offline, deterministic static templates handle 100% of workflows without degradation.
            </p>
          </div>

          {/* Section 3: Tokenization & Zero LLM Retention */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#002D72] mb-2 flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-[#0082CA]" />
              <span>3. Tokenization & Zero Data Retention</span>
            </h4>
            <p className="text-[#5B6B7A]">
              Member IDs are tokenized into opaque identifiers (e.g. <code>MBR_7F3A</code>). Phone numbers and account numbers are strictly masked before reaching any UI or LLM prompt. The LLM processes tokenized context statelessly with zero external storage or training retention.
            </p>
          </div>

          {/* Section 4: Appeal, Override & Human Escalation */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#002D72] mb-2 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#0082CA]" />
              <span>4. Democratic Oversight & Appeal Paths</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-[#1B2733] list-disc list-inside">
              <li><strong>Member Rights:</strong> Legitimate members who genuinely updated their phone can verify via branch ID check or dedicated phone support. Outgoing rails can be paused immediately at member request.</li>
              <li><strong>Dual-Staff Authorization:</strong> Release of a quarantined hold requires independent secondary employee sign-off to prevent social engineering of frontline staff.</li>
              <li><strong>Honest Misses:</strong> For authorized scams (James M1004), the system does not invent false digital confidence; human tellers and cross-channel assisted notes provide the safety net.</li>
            </ul>
          </div>

          {/* Section 5: Phase 2 Trusted Contacts */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#002D72] mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#0082CA]" />
              <span>5. Phase 2: Trusted Contacts (Voluntary & Informed Only)</span>
            </h4>
            <p className="text-[#5B6B7A]">
              Trusted contacts (e.g. Linda M1001) are voluntary, revocable at any moment, and <strong>informed-only</strong>. A trusted contact is never granted account access or transaction approval rights, protecting members against potential caregiver financial exploitation.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#F4F8FA] px-6 py-3.5 border-t border-[#D0D9E2] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[#5B6B7A]">
            Synthetic data only · Educational prototype · HuskyHack 2026
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#002D72] hover:bg-[#1F4A8C] text-white text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
