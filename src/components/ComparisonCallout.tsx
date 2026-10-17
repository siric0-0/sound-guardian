import React from 'react';
import { ArrowRight, CheckCircle2, XCircle, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';

interface ComparisonCalloutProps {
  originalOutcome: string;
  guardianOutcome: string;
  dollarsAtRisk: number;
  dollarsSaved: number;
}

export const ComparisonCallout: React.FC<ComparisonCalloutProps> = ({
  originalOutcome,
  guardianOutcome,
  dollarsAtRisk,
  dollarsSaved,
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#D0D9E2] shadow-xs p-5 mb-6">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D0D9E2]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0082CA]" />
          <h3 className="font-serif font-bold text-sm text-[#002D72]">
            Outcome Impact Comparison (HuskyHack 2026 Evaluation)
          </h3>
        </div>
        <span className="text-[11px] text-[#5B6B7A] italic">
          Illustration from synthetic event stream, not a real-world statistical forecast.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Historical Original Outcome */}
        <div className="bg-[#FEF3F2] border-2 border-[#FECDCA] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 font-bold text-xs text-[#B42318]">
                <XCircle className="w-4 h-4 text-[#B42318]" />
                <span>Historical Baseline (Without Sound Guardian)</span>
              </span>
              <span className="font-tabular font-bold text-xs text-[#B42318] bg-red-100 px-2 py-0.5 rounded">
                -${dollarsAtRisk.toFixed(2)} Lost
              </span>
            </div>
            <p className="text-xs text-[#7A271A] leading-relaxed">
              {originalOutcome}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#FECDCA] text-[11px] text-[#7A271A] flex items-center justify-between">
            <span>Time to Member Report:</span>
            <span className="font-semibold font-tabular">2 days after loss</span>
          </div>
        </div>

        {/* With Sound Guardian Outcome */}
        <div className="bg-[#ECFDF3] border-2 border-[#A6F4C5] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 font-bold text-xs text-[#067647]">
                <CheckCircle2 className="w-4 h-4 text-[#067647]" />
                <span>With Sound Guardian (Pre-Send Intercept)</span>
              </span>
              <span className="font-tabular font-bold text-xs text-[#067647] bg-emerald-100 px-2 py-0.5 rounded">
                ${dollarsSaved.toFixed(2)} Protected
              </span>
            </div>
            <p className="text-xs text-[#054F31] leading-relaxed">
              {guardianOutcome}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#A6F4C5] text-[11px] text-[#054F31] flex items-center justify-between">
            <span>Intervention Latency:</span>
            <span className="font-semibold font-tabular">0 minutes (Before Network Submit)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
