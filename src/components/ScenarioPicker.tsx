import React from 'react';
import { ScenarioId, ScenarioDefinition } from '../types.ts';
import { RotateCcw, AlertTriangle, CheckCircle2, ShieldOff, ArrowRight } from 'lucide-react';
import { tokenizeMemberId } from '../lib/tokenization.ts';

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'sarah_ato',
    memberId: 'M1003',
    name: 'Sarah',
    personaTitle: 'Account Takeover (ATO)',
    verdict: 'CAUGHT',
    summary:
      'Phished via fake Sound SMS. Attacker resets password, changes Email + Phone, and attempts two P2P transfers totaling $3,006.33.',
    originalOutcome:
      'Both P2P sent ($3,006.33 lost); member reported 2 days later; recovery unsuccessful.',
    guardianOutcome:
      'QUARANTINE fires at payee enrollment (22:19). Payee locked pending pre-change confirmation. Real phone gets alert with coercion warning; Sarah taps Freeze & Recover. Both payments blocked before submit.',
  },
  {
    id: 'mover_legitimate',
    memberId: 'M1039',
    name: 'Legitimate Mover',
    personaTitle: 'Look-Alike Profile Change',
    verdict: 'RELEASED',
    summary:
      'Forgot password, updated address after apartment move, then paid $4,151.68 ACH deposit to new landlord.',
    originalOutcome:
      'Manual verification hold would cause hours of anxiety and call center queue.',
    guardianOutcome:
      'LIGHT tier intercepts with one-tap "Was this you?" on unchanged phone. Released in 8 seconds.',
  },
  {
    id: 'james_branch',
    memberId: 'M1004',
    name: 'James',
    personaTitle: 'Government Impersonation Scam',
    verdict: 'MISSED',
    summary:
      'Coerced by caller posing as US Marshal. No password reset or digital contact change. Attempts $7,000 in-branch cash withdrawal.',
    originalOutcome:
      'Automated digital rules miss authorized scam. Teller human inquiry saved the funds.',
    guardianOutcome:
      'Honest Miss for digital rules. AssistedNote carries cross-channel prompt: "Has anyone told you to keep this secret?"',
  },
];

interface ScenarioPickerProps {
  currentScenarioId: ScenarioId;
  onSelectScenario: (id: ScenarioId) => void;
  onResetDemo: () => void;
}

export const ScenarioPicker: React.FC<ScenarioPickerProps> = ({
  currentScenarioId,
  onSelectScenario,
  onResetDemo,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-xs border border-[#D0D9E2] p-4 sm:p-5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#D0D9E2]">
        <div>
          <h2 className="text-base font-semibold text-[#002D72] flex items-center gap-2">
            <span>Live Demonstration Scenarios</span>
            <span className="text-xs font-normal text-[#5B6B7A]">
              (HuskyHack 2026 Test Cases)
            </span>
          </h2>
          <p className="text-xs text-[#5B6B7A] mt-0.5">
            Switch between personas to test deterministic rule triggers, member intercepts, and staff response.
          </p>
        </div>
        <button
          onClick={onResetDemo}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#1B2733] bg-[#F4F8FA] hover:bg-[#E1F0F8] hover:text-[#002D72] border border-[#D0D9E2] transition-colors self-start sm:self-auto cursor-pointer"
          title="Reset playback and clear saved actions"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4">
        {SCENARIOS.map((sc) => {
          const isSelected = currentScenarioId === sc.id;
          const token = tokenizeMemberId(sc.memberId);

          return (
            <div
              key={sc.id}
              onClick={() => onSelectScenario(sc.id)}
              className={`text-left rounded-lg p-3.5 border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'border-[#0082CA] bg-[#E1F0F8]/40 shadow-sm ring-1 ring-[#0082CA]/30'
                  : 'border-[#D0D9E2] bg-white hover:border-[#0082CA]/50 hover:bg-[#F4F8FA]'
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectScenario(sc.id);
                }
              }}
              aria-pressed={isSelected}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-semibold text-[#002D72] text-sm">
                      {sc.name}
                    </span>
                    <span className="font-tabular text-[11px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono">
                      {token}
                    </span>
                  </div>

                  {sc.verdict === 'CAUGHT' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]">
                      <AlertTriangle className="w-3 h-3" />
                      CAUGHT
                    </span>
                  )}
                  {sc.verdict === 'RELEASED' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-[#ECFDF3] text-[#067647] border border-[#A6F4C5]">
                      <CheckCircle2 className="w-3 h-3" />
                      RELEASED
                    </span>
                  )}
                  {sc.verdict === 'MISSED' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      <ShieldOff className="w-3 h-3" />
                      MISSED (RULES)
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-medium text-[#1F4A8C] mb-1">
                  {sc.personaTitle}
                </div>
                <p className="text-xs text-[#1B2733] line-clamp-2 leading-relaxed">
                  {sc.summary}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#D0D9E2]/60 flex items-center justify-between text-[11px]">
                <span className="text-[#5B6B7A]">
                  {sc.verdict === 'MISSED' ? 'Branch Assisted' : 'Automated Defense'}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#0082CA]">
                  <span>{isSelected ? 'Active Scenario' : 'Switch'}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
