import React from 'react';
import { SoundLogo } from './SoundLogo.tsx';
import {
  Users,
  Smartphone,
  Globe,
  Type,
  Sparkles,
  Info,
  Shield,
  Phone,
  Landmark,
  User,
  CheckCircle2,
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
  onOpenAbout: () => void;
  onOpenHelp: () => void;
  memberToken?: string;
  showEvidence?: boolean;
  onToggleEvidence?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  viewMode,
  setViewMode,
  lang,
  setLang,
  largeText,
  setLargeText,
  aiStatus,
  onOpenAbout,
  onOpenHelp,
  memberToken = 'MBR_7F3A',
  showEvidence = false,
  onToggleEvidence,
}) => {
  const isEs = lang === 'es';

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-[#D0D9E2]">
      {/* Top SCU Utility Bar */}
      <div className="bg-[#002D72] text-[#E1F0F8] text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-[#001D4A]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="hidden md:inline-flex items-center gap-1.5 font-medium text-white">
              <Landmark className="w-3.5 h-3.5 text-[#0082CA]" />
              <span>Routing Number:</span>
              <strong className="font-mono text-white tracking-wider">325183220</strong>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[#E1F0F8]/80">
              <Phone className="w-3 h-3 text-[#0082CA]" />
              <span>800.562.8130</span>
            </span>
            <span className="hidden lg:inline text-white/60">·</span>
            <span className="hidden lg:inline text-white/80 italic font-serif">
              "Standing with you through all waves of life"
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* AI Status Pill */}
            <div
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                aiStatus.aiStatus === 'live'
                  ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-600/40'
              }`}
              title={`Provider: ${aiStatus.provider} | Model: ${aiStatus.model}`}
            >
              <Sparkles
                className={`w-3 h-3 ${
                  aiStatus.aiStatus === 'live'
                    ? 'text-emerald-400 animate-pulse'
                    : 'text-slate-400'
                }`}
              />
              <span className="hidden sm:inline">AI Engine:</span>
              <span>{aiStatus.aiStatus === 'live' ? 'Live' : 'Offline'}</span>
            </div>

            {/* Language Switcher (Sound style: English | Español) */}
            <div className="flex items-center gap-1 font-medium text-white/90">
              <button
                onClick={() => setLang('en')}
                className={`px-1 py-0.5 rounded hover:text-white cursor-pointer ${
                  lang === 'en' ? 'text-white font-bold underline underline-offset-2' : 'text-white/70'
                }`}
              >
                English
              </button>
              <span className="text-white/40">|</span>
              <button
                onClick={() => setLang('es')}
                className={`px-1 py-0.5 rounded hover:text-white cursor-pointer ${
                  lang === 'es' ? 'text-white font-bold underline underline-offset-2' : 'text-white/70'
                }`}
              >
                Español
              </button>
            </div>

            {/* Large Text Accessible Toggle */}
            <button
              onClick={() => setLargeText(!largeText)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors border ${
                largeText
                  ? 'bg-[#0082CA] text-white border-white/40'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
              }`}
              title="Large text mode (125% scale & 48px tap targets)"
              aria-label="Toggle large text mode"
            >
              <Type className="w-3 h-3" />
              <span className="hidden sm:inline">Text</span>
            </button>

            {/* Evidence Evaluation Button */}
            {onToggleEvidence && (
              <button
                onClick={onToggleEvidence}
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold transition-colors border cursor-pointer ${
                  showEvidence
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-2xs'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
                title="Strict deterministic rule evidence: 12/12 ATO caught, 0/104 false positives, 3-9 min lead time"
                aria-label="Toggle Evidence Panel"
              >
                <Shield className="w-3 h-3 text-emerald-300" />
                <span className="hidden sm:inline">Evidence:</span>
                <span className="font-bold text-emerald-200">12/12</span>
              </button>
            )}

            {/* About Data & Design button */}
            <button
              onClick={onOpenAbout}
              className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="About Sound Guardian architecture & responsible data design"
              aria-label="About Sound Guardian architecture"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Sound Credit Union Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Sound Credit Union Brand Logo */}
          <div className="flex items-center gap-3">
            <SoundLogo variant="compact" showGuardianSubtitle />
          </div>

          {/* Center: System Integration View Switcher */}
          <div className="hidden lg:flex items-center bg-[#F4F8FA] p-1.5 rounded-xl border border-[#D0D9E2] shadow-2xs">
            <button
              onClick={() => setViewMode('member')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'member'
                  ? 'bg-[#002D72] text-white shadow-xs'
                  : 'text-[#002D72] hover:bg-[#E1F0F8]/60'
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#0082CA]" />
              <span>Sound Digital Banking</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 text-white font-medium">
                Member View
              </span>
            </button>
            <button
              onClick={() => setViewMode('staff')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'staff'
                  ? 'bg-[#002D72] text-white shadow-xs'
                  : 'text-[#002D72] hover:bg-[#E1F0F8]/60'
              }`}
            >
              <Users className="w-4 h-4 text-[#0082CA]" />
              <span>Fraud & Branch Console</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 text-white font-medium">
                Operations
              </span>
            </button>
          </div>

          {/* Right: Sound Member Status Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-[#D0D9E2]">
              <div className="w-8 h-8 rounded-full bg-[#E1F0F8] text-[#002D72] flex items-center justify-center font-bold text-xs ring-2 ring-[#0082CA]/30">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#002D72] leading-tight flex items-center gap-1.5">
                  <span>Sarah M.</span>
                  <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1 py-0.2 rounded">
                    {memberToken}
                  </span>
                </div>
                <span className="text-[10px] text-[#067647] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>Authenticated Member</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View Switcher Bar */}
        <div className="flex lg:hidden items-center justify-center pb-3 pt-1 gap-2 border-t border-[#D0D9E2]">
          <button
            onClick={() => setViewMode('member')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold ${
              viewMode === 'member'
                ? 'bg-[#002D72] text-white shadow-xs'
                : 'text-[#002D72] bg-[#F4F8FA] border border-[#D0D9E2]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Digital Banking</span>
          </button>
          <button
            onClick={() => setViewMode('staff')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold ${
              viewMode === 'staff'
                ? 'bg-[#002D72] text-white shadow-xs'
                : 'text-[#002D72] bg-[#F4F8FA] border border-[#D0D9E2]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Staff Console</span>
          </button>
        </div>
      </div>
    </header>
  );
};
