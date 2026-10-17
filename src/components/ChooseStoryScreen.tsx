import React from 'react';
import { ScenarioId, ScenarioDefinition } from '../types.ts';
import { SCENARIOS } from './ScenarioPicker.tsx';
import { ShieldAlert, ShieldCheck, Building2, ArrowRight, RotateCcw } from 'lucide-react';
import { TierBadge } from './TierBadge.tsx';

interface ChooseStoryScreenProps {
  onSelectAndStart: (id: ScenarioId) => void;
  onResetDemo: () => void;
  lang: 'en' | 'es';
}

export const ChooseStoryScreen: React.FC<ChooseStoryScreenProps> = ({
  onSelectAndStart,
  onResetDemo,
  lang,
}) => {
  const isEs = lang === 'es';

  const storyDetails: Record<ScenarioId, {
    title: string;
    subtitle: string;
    oneLiner: string;
    badge: React.ReactNode;
    metricLabel: string;
    metricVal: string;
    icon: React.ReactNode;
  }> = {
    sarah_ato: {
      title: isEs ? 'Sarah: Ataque Detenido' : 'Sarah: Takeover Stopped',
      subtitle: isEs ? 'Defensa de Apropiación de Cuenta (ATO)' : 'Account Takeover (ATO) Defense',
      oneLiner: isEs
        ? 'Ataque de phishing modifica datos de contacto; bloqueo frontal al registrar destinatario antes de que salgan $3,006.33.'
        : 'Phished via SMS; attacker changes contact info and tries to drain $3,006.33. Blocked upfront at payee addition before money moves.',
      badge: <TierBadge tier="QUARANTINE" size="sm" />,
      metricLabel: isEs ? 'Fondos Protegidos' : 'Funds Protected',
      metricVal: '$3,006.33',
      icon: <ShieldAlert className="w-6 h-6 text-[#B42318]" />,
    },
    mover_legitimate: {
      title: isEs ? 'Mudanza: Verificación Rápida' : 'Mover: Quick Check',
      subtitle: isEs ? 'Cambio Legítimo de Domicilio' : 'Look-Alike Profile Change',
      oneLiner: isEs
        ? 'Cambio legítimo de dirección tras mudanza; verificado en 8 segundos mediante 1 toque sin colas de espera telefónicas.'
        : 'Legitimate address update after moving; verified in 8 seconds via a one-tap check with zero call-center queue.',
      badge: <TierBadge tier="LIGHT" size="sm" />,
      metricLabel: isEs ? 'Tiempo de Liberación' : 'Release Speed',
      metricVal: '8 seconds',
      icon: <ShieldCheck className="w-6 h-6 text-[#067647]" />,
    },
    james_branch: {
      title: isEs ? 'James: Lo que se nos Pasó' : 'James: What We Missed',
      subtitle: isEs ? 'Estafa de Suplantación en Sucursal' : 'In-Branch Imposter Scam',
      oneLiner: isEs
        ? 'Retiro coaccionado de $7,000 en sucursal. Las reglas digitales no detectan estafas de suplantación; la consulta empática del cajero salva los fondos.'
        : 'Coerced $7,000 cash withdrawal. Digital rules miss imposter scams, but compassionate teller inquiry saves the funds.',
      badge: (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
          <Building2 className="w-3.5 h-3.5 text-amber-700" />
          <span>BRANCH ASSIST</span>
        </span>
      ),
      metricLabel: isEs ? 'Salvado en Sucursal' : 'Saved in Branch',
      metricVal: '$7,000.00',
      icon: <Building2 className="w-6 h-6 text-amber-700" />,
    },
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 px-4">
      {/* Title & One-line Explanation */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#002D72] tracking-tight">
          {isEs ? 'Elija una Historia' : 'Choose a Story'}
        </h1>
        <p className="text-sm text-[#5B6B7A] mt-2">
          {isEs
            ? 'Seleccione uno de los 3 escenarios interactivos para ver cómo Sound Guardian detiene el fraude antes de que el dinero se mueva.'
            : 'Select one of 3 interactive scenarios to explore how Sound Guardian stops scams before the money moves.'}
        </p>
      </div>

      {/* 3 Large Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {SCENARIOS.map((scenario) => {
          const detail = storyDetails[scenario.id];
          return (
            <div
              key={scenario.id}
              className="bg-white rounded-2xl border-2 border-[#D0D9E2] hover:border-[#0082CA] shadow-sm hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header: Icon & Badge */}
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[#F4F8FA] border border-[#D0D9E2]">
                    {detail.icon}
                  </div>
                  <div>{detail.badge}</div>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#002D72] leading-snug">
                    {detail.title}
                  </h2>
                  <p className="text-xs text-[#0082CA] font-medium mt-0.5">
                    {detail.subtitle}
                  </p>
                </div>

                {/* One-line Description */}
                <p className="text-xs text-[#5B6B7A] leading-relaxed">
                  {detail.oneLiner}
                </p>

                {/* Key Metric Pill */}
                <div className="bg-[#F4F8FA] rounded-lg p-3 border border-[#D0D9E2] flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#5B6B7A]">
                    {detail.metricLabel}
                  </span>
                  <span className="font-mono font-bold text-xs text-[#002D72]">
                    {detail.metricVal}
                  </span>
                </div>
              </div>

              {/* 48px Navy Primary Button */}
              <div className="pt-6">
                <button
                  onClick={() => onSelectAndStart(scenario.id)}
                  className="w-full h-12 rounded-lg bg-[#002D72] hover:bg-[#001D4A] active:bg-[#001433] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs focus:ring-2 focus:ring-[#0082CA] focus:outline-none"
                >
                  <span>{isEs ? 'Comenzar Historia' : 'Start'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Small Reset Demo Footer Action */}
      <div className="flex items-center justify-center gap-2 text-xs text-[#5B6B7A]">
        <span>Need a clean slate?</span>
        <button
          onClick={onResetDemo}
          className="inline-flex items-center gap-1 text-[#0082CA] hover:underline font-medium cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset demo state</span>
        </button>
      </div>
    </div>
  );
};
