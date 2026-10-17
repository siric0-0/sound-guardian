import React from 'react';
import { TierType } from '../types.ts';
import { ShieldAlert, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface TierBadgeProps {
  tier: TierType | string;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

export const TierBadge: React.FC<TierBadgeProps> = ({
  tier,
  size = 'md',
  showDescription = false,
}) => {
  const normalizedTier = (tier || '').toUpperCase();

  if (normalizedTier === 'QUARANTINE') {
    return (
      <span
        role="status"
        aria-label="Tier: Quarantine, Pre-send pause applied"
        className={`inline-flex items-center gap-1.5 font-semibold rounded-md border ${
          size === 'sm'
            ? 'px-2 py-0.5 text-xs'
            : size === 'lg'
            ? 'px-3 py-1.5 text-sm'
            : 'px-2.5 py-1 text-xs'
        } bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]`}
      >
        <ShieldAlert className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} aria-hidden="true" />
        <span>QUARANTINE</span>
        {showDescription && (
          <span className="font-normal text-[#912018] ml-1 text-[11px]">
            (Pre-send Pause)
          </span>
        )}
      </span>
    );
  }

  if (normalizedTier === 'LIGHT') {
    return (
      <span
        role="status"
        aria-label="Tier: Light, One-tap confirmation required"
        className={`inline-flex items-center gap-1.5 font-semibold rounded-md border ${
          size === 'sm'
            ? 'px-2 py-0.5 text-xs'
            : size === 'lg'
            ? 'px-3 py-1.5 text-sm'
            : 'px-2.5 py-1 text-xs'
        } bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]`}
      >
        <ShieldCheck className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} aria-hidden="true" />
        <span>LIGHT TIER</span>
        {showDescription && (
          <span className="font-normal text-[#93370D] ml-1 text-[11px]">
            (1-Tap Verify)
          </span>
        )}
      </span>
    );
  }

  return (
    <span
      role="status"
      aria-label="Tier: Standard, Processed normally"
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${
        size === 'sm'
          ? 'px-2 py-0.5 text-xs'
          : size === 'lg'
          ? 'px-3 py-1.5 text-sm'
          : 'px-2.5 py-1 text-xs'
      } bg-[#ECFDF3] text-[#067647] border-[#A6F4C5]`}
    >
      <CheckCircle2 className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} aria-hidden="true" />
      <span>NO ACTION</span>
      {showDescription && (
        <span className="font-normal text-[#054F31] ml-1 text-[11px]">
          (Standard)
        </span>
      )}
    </span>
  );
};
