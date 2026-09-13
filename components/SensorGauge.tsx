'use client';

import React from 'react';

interface SensorGaugeProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  threshold: number;
  icon?: React.ReactNode;
}

export const SensorGauge: React.FC<SensorGaugeProps> = ({
  label,
  value,
  max,
  unit,
  threshold,
  icon
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const isCritical = value >= threshold;
  const isWarning = value >= threshold * 0.8 && !isCritical;

  let barColor = 'bg-cyan-500 shadow-glow-cyan/50';
  let textColor = 'text-cyan-400';

  if (isCritical) {
    barColor = 'bg-rose-500 shadow-glow-rose/80 animate-pulse';
    textColor = 'text-rose-400 glow-text-rose';
  } else if (isWarning) {
    barColor = 'bg-amber-500 shadow-glow-amber/60';
    textColor = 'text-amber-400';
  }

  return (
    <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
          {icon}
          <span>{label}</span>
        </div>
        <span className={`font-mono font-bold text-sm ${textColor}`}>
          {value} <span className="text-[10px] text-slate-500 font-normal">{unit}</span>
        </span>
      </div>

      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 relative">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
        <span>0</span>
        <span className="text-rose-400/80">Limit: {threshold} {unit}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};
