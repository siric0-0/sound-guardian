import React, { useState } from 'react';
import { SoundLogo } from './SoundLogo.tsx';
import {
  Smartphone,
  Users,
  Sparkles,
  Type,
  MoreVertical,
  BookOpen,
  RotateCcw,
  Info,
} from 'lucide-react';

interface TopBarProps {
  viewMode: 'member' | 'staff';
  setViewMode: (mode: 'member' | 'staff') => void;
  lang: 'en' | 'es';
  setLang: (lang: 'en' | 'es') => void;
  largeText: boolean;
  setLargeText: (enabled: boolean) => void;
  aiStatus: {
    aiStatus: 'live' | 'offline';
    provider: string;
    model: string;
  };
  onChooseStory: () => void;
  onResetDemo: () => void;
  onOpenAbout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  viewMode,
  setViewMode,
  lang,
  setLang,
  largeText,
  setLargeText,
  aiStatus,
  onChooseStory,
  onResetDemo,
  onOpenAbout,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#D0D9E2] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16 gap-2">
        {/* Left: Sound Guardian Logo / Wordmark */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={onChooseStory}>
          <SoundLogo variant="compact" showGuardianSubtitle={false} />
          <span className="font-serif font-bold text-base sm:text-lg text-[#002D72] tracking-tight">
            Sound Guardian
          </span>
        </div>

        {/* Center: Big Segmented Toggle [Member app] [Staff console] */}
        <div className="flex items-center bg-[#F4F8FA] p-1 rounded-xl border border-[#D0D9E2]">
          <button
            onClick={() => setViewMode('member')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'member'
                ? 'bg-[#002D72] text-white shadow-xs'
                : 'text-[#002D72] hover:bg-[#E1F0F8]'
            }`}
            aria-pressed={viewMode === 'member'}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Member app</span>
          </button>
          <button
            onClick={() => setViewMode('staff')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'staff'
                ? 'bg-[#002D72] text-white shadow-xs'
                : 'text-[#002D72] hover:bg-[#E1F0F8]'
            }`}
            aria-pressed={viewMode === 'staff'}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Staff console</span>
          </button>
        </div>

        {/* Right: EN/ES | Large Text | AI Pill | Small Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* EN/ES toggle */}
          <div className="flex items-center bg-[#F4F8FA] rounded-lg border border-[#D0D9E2] p-0.5 text-xs font-medium">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded cursor-pointer ${
                lang === 'en'
                  ? 'bg-white font-bold text-[#002D72] shadow-2xs'
                  : 'text-[#5B6B7A] hover:text-[#002D72]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('es')}
              className={`px-2 py-1 rounded cursor-pointer ${
                lang === 'es'
                  ? 'bg-white font-bold text-[#002D72] shadow-2xs'
                  : 'text-[#5B6B7A] hover:text-[#002D72]'
              }`}
            >
              ES
            </button>
          </div>

          {/* Large text toggle */}
          <button
            onClick={() => setLargeText(!largeText)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              largeText
                ? 'bg-[#0082CA] text-white border-[#0082CA]'
                : 'bg-white text-[#002D72] border-[#D0D9E2] hover:bg-[#F4F8FA]'
            }`}
            title="Toggle large text mode"
            aria-label="Toggle large text mode"
          >
            <Type className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Text</span>
          </button>

          {/* AI Pill */}
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
              aiStatus.aiStatus === 'live'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}
            title={`AI Engine: ${aiStatus.aiStatus} (${aiStatus.model})`}
          >
            <Sparkles
              className={`w-3 h-3 ${
                aiStatus.aiStatus === 'live'
                  ? 'text-emerald-600 animate-pulse'
                  : 'text-slate-500'
              }`}
            />
            <span className="hidden md:inline">AI:</span>
            <span>{aiStatus.aiStatus === 'live' ? 'Live' : 'Offline'}</span>
          </div>

          {/* Small Menu for Reset Demo & Choose Story */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 rounded-lg border border-[#D0D9E2] bg-white hover:bg-[#F4F8FA] text-[#002D72] cursor-pointer"
              aria-label="Menu"
              aria-expanded={isMenuOpen}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#D0D9E2] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onChooseStory();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#F4F8FA] text-[#002D72] font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#0082CA]" />
                  <span>Choose a story</span>
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onResetDemo();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#F4F8FA] text-[#002D72] flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset demo state</span>
                </button>
                <div className="border-t border-[#D0D9E2] my-1" />
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenAbout();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#F4F8FA] text-[#5B6B7A] flex items-center gap-2 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>About data & design</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
