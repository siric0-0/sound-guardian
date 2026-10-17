import React from 'react';
import { SoundLogo } from './SoundLogo.tsx';
import { Phone, MessageSquare, MapPin, ShieldCheck, ExternalLink } from 'lucide-react';

interface SCUFooterProps {
  onOpenAbout: () => void;
}

export const SCUFooter: React.FC<SCUFooterProps> = ({ onOpenAbout }) => {
  const pugetSoundBranches = [
    'Alderwood', 'Auburn', 'Bellevue', 'Bonney Lake', 'Bothell', 'Burien',
    'Downtown Olympia', 'Downtown Tacoma', 'Edmonds', 'Everett', 'Federal Way',
    'Gig Harbor', 'Graham', 'Kent', 'Key Center', 'Lakewood', 'Lynnwood',
    'Mukilteo', 'Olympia', 'Pacific Ave', 'Parkland', 'Puyallup', 'Redmond',
    'Shoreline', 'Southcenter', 'Westgate'
  ];

  return (
    <footer className="bg-white border-t-2 border-[#D0D9E2] text-[#1B2733] pt-10 pb-8 mt-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Footer Row: Logo, Slogan, and Contact */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-[#D0D9E2]">
          <div className="space-y-3 md:col-span-1">
            <SoundLogo variant="compact" showGuardianSubtitle />
            <p className="text-xs text-[#5B6B7A] leading-relaxed">
              Standing with you through all waves of life. Local, member-owned, and not-for-profit since 1940.
            </p>
          </div>

          {/* Connect Column */}
          <div className="space-y-2">
            <h5 className="font-serif font-bold text-sm text-[#002D72] uppercase tracking-wider">
              Connect With Us
            </h5>
            <ul className="space-y-1.5 text-xs text-[#5B6B7A]">
              <li className="flex items-center gap-1.5 font-medium text-[#1B2733]">
                <Phone className="w-3.5 h-3.5 text-[#0082CA]" />
                <span>800.562.8130</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#0082CA]" />
                <span>Chat with Us (Live Support)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0082CA]" />
                <span>26 Branch Locations & 30,000+ ATMs</span>
              </li>
            </ul>
          </div>

          {/* Routing Number Box (from SCU website screenshot) */}
          <div className="space-y-2">
            <h5 className="font-serif font-bold text-sm text-[#002D72] uppercase tracking-wider">
              Sound Routing Number
            </h5>
            <div className="bg-[#F4F8FA] border-2 border-[#002D72] rounded-xl p-3 text-center">
              <span className="text-[11px] text-[#5B6B7A] block font-medium">Direct Deposit & Wires</span>
              <span className="font-tabular font-mono text-xl font-bold text-[#002D72] tracking-widest block mt-0.5">
                325183220
              </span>
            </div>
          </div>

          {/* Architecture & Responsible AI */}
          <div className="space-y-2">
            <h5 className="font-serif font-bold text-sm text-[#002D72] uppercase tracking-wider">
              HuskyHack 2026 System
            </h5>
            <p className="text-[11px] text-[#5B6B7A] leading-relaxed">
              Sound Guardian is designed to seamlessly integrate into Sound Digital Banking and core ACH/P2P transaction routing.
            </p>
            <button
              onClick={onOpenAbout}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0082CA] hover:text-[#002D72] underline cursor-pointer"
            >
              <span>Responsible Design & Data Ethics</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Serving Puget Sound Directory (From SCU website) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h5 className="font-serif font-bold text-xs uppercase tracking-wider text-[#002D72]">
              Serving Puget Sound Communities
            </h5>
            <span className="text-[11px] text-[#5B6B7A]">Washington's Favorite Credit Union</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#5B6B7A]">
            {pugetSoundBranches.map((branch) => (
              <span key={branch} className="hover:text-[#002D72] transition-colors">
                {branch}
              </span>
            ))}
          </div>
        </div>

        {/* Official Disclosures & Prototype Notice */}
        <div className="pt-4 border-t border-[#D0D9E2] flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-[#5B6B7A]">
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 rounded bg-slate-100 text-[#002D72] font-bold text-[10px] border border-slate-200">
              NCUA
            </div>
            <span>FEDERALLY INSURED BY NCUA. Equal Housing Opportunity.</span>
          </div>

          <div className="bg-[#FEF3F2] text-[#B42318] px-3 py-1 rounded-md border border-[#FECDCA] font-medium text-center">
            Synthetic data only · Educational prototype · Not a Sound Credit Union production system.
          </div>

          <div>
            © 2026 Sound Credit Union. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
