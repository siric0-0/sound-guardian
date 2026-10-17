import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface SCUFooterProps {
  onOpenAbout: () => void;
}

export const SCUFooter: React.FC<SCUFooterProps> = ({ onOpenAbout }) => {
  return (
    <footer className="bg-white border-t border-[#D0D9E2] text-[#5B6B7A] py-3 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0082CA] shrink-0" />
          <span className="text-[11px]">
            Synthetic data only · Educational prototype · Not a Sound Credit Union production system.
          </span>
        </div>

        <button
          onClick={onOpenAbout}
          className="inline-flex items-center gap-1 text-[11px] text-[#0082CA] hover:underline cursor-pointer"
        >
          <Info className="w-3 h-3" />
          <span>About data & responsible design</span>
        </button>
      </div>
    </footer>
  );
};
