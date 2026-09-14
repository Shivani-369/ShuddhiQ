'use client';

import React, { useState } from 'react';
import { X, Sliders, ShieldAlert, CheckCircle } from 'lucide-react';
import { useDashboard } from '../lib/store';

interface ThresholdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThresholdModal: React.FC<ThresholdModalProps> = ({ isOpen, onClose }) => {
  const { thresholds, updateThresholds } = useDashboard();
  const [ammoniaMaxPpm, setAmmoniaMaxPpm] = useState<number>(thresholds.ammoniaMaxPpm);
  const [odorMaxIndex, setOdorMaxIndex] = useState<number>(thresholds.odorMaxIndex);
  const [humidityMaxPercent, setHumidityMaxPercent] = useState<number>(thresholds.humidityMaxPercent);
  const [overdueTimeoutMinutes, setOverdueTimeoutMinutes] = useState<number>(thresholds.overdueTimeoutMinutes);
  const [saved, setSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateThresholds({
      ammoniaMaxPpm,
      odorMaxIndex,
      humidityMaxPercent,
      overdueTimeoutMinutes
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="glass-panel w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Hygiene Alert Thresholds</h3>
            <p className="text-xs text-slate-400">Configure unsafe parameters triggering automatic admin alerts</p>
          </div>
        </div>

        {saved ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Threshold Configuration Saved!</h4>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Max Safe Ammonia Gas Level (PPM)</span>
                <span className="font-mono text-cyan-400 font-bold">{ammoniaMaxPpm} PPM</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={ammoniaMaxPpm}
                onChange={(e) => setAmmoniaMaxPpm(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Standard OSHA safe indoor limit: 25 PPM</span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Max Odor Intensity Index</span>
                <span className="font-mono text-purple-400 font-bold">{odorMaxIndex} / 10</span>
              </div>
              <input
                type="range"
                min="3"
                max="10"
                value={odorMaxIndex}
                onChange={(e) => setOdorMaxIndex(Number(e.target.value))}
                className="w-full accent-purple-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Max Ambient Relative Humidity (%)</span>
                <span className="font-mono text-blue-400 font-bold">{humidityMaxPercent}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={humidityMaxPercent}
                onChange={(e) => setHumidityMaxPercent(Number(e.target.value))}
                className="w-full accent-blue-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Overdue Cleaning Escalation Timeout (Minutes)</span>
                <span className="font-mono text-amber-400 font-bold">{overdueTimeoutMinutes} mins</span>
              </div>
              <input
                type="range"
                min="30"
                max="180"
                step="15"
                value={overdueTimeoutMinutes}
                onChange={(e) => setOverdueTimeoutMinutes(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="pt-3 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-glow-cyan/20"
              >
                Update Threshold Rules
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
