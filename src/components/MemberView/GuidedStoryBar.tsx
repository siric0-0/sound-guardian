import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface GuidedStoryBarProps {
  currentIndex: number;
  totalSteps: number;
  eventTitle: string;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  lang: 'en' | 'es';
}

export const GuidedStoryBar: React.FC<GuidedStoryBarProps> = ({
  currentIndex,
  totalSteps,
  eventTitle,
  onPrev,
  onNext,
  canPrev,
  canNext,
  lang,
}) => {
  const isEs = lang === 'es';

  return (
    <div className="w-full max-w-[420px] mx-auto mt-3 bg-white rounded-xl border border-[#D0D9E2] shadow-xs p-2.5 flex items-center justify-between gap-2">
      {/* Back Button */}
      <button
        onClick={onPrev}
        disabled={!canPrev}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          canPrev
            ? 'bg-[#F4F8FA] hover:bg-[#E1F0F8] text-[#002D72] border border-[#D0D9E2]'
            : 'opacity-40 text-slate-400 border border-transparent cursor-not-allowed'
        }`}
        aria-label="Previous step"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{isEs ? 'Atrás' : 'Back'}</span>
      </button>

      {/* Center: Step Count & Event Title */}
      <div className="text-center truncate px-2">
        <span className="text-[11px] font-bold text-[#002D72] block truncate">
          {isEs ? `Paso ${currentIndex + 1} de ${totalSteps}` : `Step ${currentIndex + 1} of ${totalSteps}`}
        </span>
        <span className="text-[10px] text-[#5B6B7A] truncate block max-w-[180px]">
          {eventTitle}
        </span>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={!canNext}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
          canNext
            ? 'bg-[#002D72] hover:bg-[#001D4A] text-white shadow-xs'
            : 'opacity-40 bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
        aria-label="Next step"
      >
        <span>{isEs ? 'Siguiente' : 'Next'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
