import React, { useEffect, useRef } from 'react';
import { DemoEvent, SentrySignals, ArbiterDecision } from '../types.ts';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  FastForward,
  Clock,
  ShieldAlert,
  ShieldCheck,
  CreditCard,
  KeyRound,
  UserCheck,
  Building,
  Smartphone,
  PhoneCall,
} from 'lucide-react';
import { StepExplainer } from './StepExplainer.tsx';
import { TierBadge } from './TierBadge.tsx';

interface JourneyTimelineProps {
  events: DemoEvent[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  currentSignals?: SentrySignals | null;
  currentDecision?: ArbiterDecision | null;
  scenarioId: string;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({
  events,
  currentIndex,
  onSelectIndex,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  currentSignals,
  currentDecision,
  scenarioId,
}) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const interval = (2800 / speed);
      timerRef.current = setInterval(() => {
        onSelectIndex(Math.min(currentIndex + 1, events.length - 1));
        if (currentIndex >= events.length - 1) {
          setIsPlaying(false);
        }
      }, interval);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex, events.length, speed, onSelectIndex, setIsPlaying]);

  if (!events || events.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#D0D9E2] p-8 text-center text-[#5B6B7A]">
        Pick a demo member to begin replaying event history.
      </div>
    );
  }

  const currentEvent = events[currentIndex] || events[0];

  const getEventIcon = (event: DemoEvent) => {
    switch (event.event_type) {
      case 'Failed Login':
      case 'Password Reset':
        return <KeyRound className="w-3.5 h-3.5 text-amber-600" />;
      case 'Email Change':
      case 'Phone Change':
      case 'Address Change':
        return <UserCheck className="w-3.5 h-3.5 text-[#0082CA]" />;
      case 'Recipient Added':
      case 'Payment Initiated':
        return <CreditCard className="w-3.5 h-3.5 text-[#002D72]" />;
      case 'Member Inquiry':
        return <PhoneCall className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-[#5B6B7A]" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-[#D0D9E2] p-4 sm:p-5 mb-6">
      {/* Header & Playback Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D0D9E2]">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-[#002D72] uppercase tracking-wide">
            Event Journey Replay
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#E1F0F8] text-[#002D72] font-semibold">
            Step {currentIndex + 1} of {events.length}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onSelectIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="p-1.5 rounded-md border border-[#D0D9E2] bg-white text-[#1B2733] hover:bg-[#F4F8FA] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Previous Event Step"
            aria-label="Previous step"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-colors cursor-pointer ${
              isPlaying
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-[#002D72] text-white hover:bg-[#1F4A8C]'
            }`}
            aria-label={isPlaying ? 'Pause replay' : 'Play replay'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Replay</span>
              </>
            )}
          </button>

          <button
            onClick={() => onSelectIndex(Math.min(events.length - 1, currentIndex + 1))}
            disabled={currentIndex === events.length - 1}
            className="p-1.5 rounded-md border border-[#D0D9E2] bg-white text-[#1B2733] hover:bg-[#F4F8FA] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Next Event Step"
            aria-label="Next step"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Speed Toggle */}
          <button
            onClick={() => setSpeed(speed === 1 ? 2 : 1)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-md border border-[#D0D9E2] text-xs font-semibold text-[#5B6B7A] hover:bg-[#F4F8FA] cursor-pointer"
            title="Replay Speed"
          >
            <FastForward className="w-3 h-3 text-[#0082CA]" />
            <span>{speed}x</span>
          </button>
        </div>
      </div>

      {/* Horizontal Steps Bar */}
      <div className="py-4 overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-2 min-w-max pb-1">
          {events.map((ev, idx) => {
            const isCurrent = idx === currentIndex;
            const isPassed = idx < currentIndex;
            const isPayment = ev.event_type === 'Payment Initiated';
            const isATOQuarantine =
              isPayment && scenarioId === 'sarah_ato' && ev.synthetic_member_id === 'M1003';
            const isMoverLight =
              isPayment && scenarioId === 'mover_legitimate' && ev.synthetic_member_id === 'M1039';

            return (
              <button
                key={ev.event_id}
                onClick={() => onSelectIndex(idx)}
                className={`flex flex-col text-left p-2.5 rounded-lg border-2 transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-[#0082CA] bg-[#E1F0F8]/50 ring-2 ring-[#0082CA]/20 shadow-xs'
                    : isPassed
                    ? 'border-[#D0D9E2] bg-[#F4F8FA] hover:border-[#0082CA]/50'
                    : 'border-dashed border-[#D0D9E2] bg-white opacity-70 hover:opacity-100 hover:border-solid hover:border-[#0082CA]/50'
                }`}
                style={{ width: '160px' }}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-tabular text-[#5B6B7A] font-medium">
                    {ev.event_timestamp.slice(11, 16)}
                  </span>
                  <span className="p-1 rounded-full bg-white border border-[#D0D9E2]">
                    {getEventIcon(ev)}
                  </span>
                </div>

                <div className="text-xs font-semibold text-[#1B2733] truncate">
                  {ev.event_type}
                </div>

                <div className="text-[10px] text-[#5B6B7A] truncate mt-0.5">
                  {isPayment ? (
                    <span className="font-tabular font-bold text-[#002D72]">
                      ${ev.amount.toFixed(2)} ({ev.payment_rail})
                    </span>
                  ) : (
                    ev.channel
                  )}
                </div>

                {isATOQuarantine && (
                  <div className="mt-1.5">
                    <TierBadge tier="QUARANTINE" size="sm" />
                  </div>
                )}
                {isMoverLight && (
                  <div className="mt-1.5">
                    <TierBadge tier="LIGHT" size="sm" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Explainer */}
      <StepExplainer
        currentEvent={currentEvent}
        signals={currentSignals}
        decision={currentDecision}
        isATO={scenarioId === 'sarah_ato'}
        isMover={scenarioId === 'mover_legitimate'}
        isBranchJames={scenarioId === 'james_branch'}
      />
    </div>
  );
};
