'use client';

import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle, UserCheck, CheckSquare, Sparkles } from 'lucide-react';
import { useDashboard } from '../lib/store';
import { Restroom } from '../lib/types';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRestroom?: Restroom | null;
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
  defaultRestroom
}) => {
  const { cleaners, restrooms, logCleaningActivity, cleanerCheckIn } = useDashboard();
  const [selectedCleanerId, setSelectedCleanerId] = useState<string>(cleaners[0]?.id || '');
  const [selectedRestroomId, setSelectedRestroomId] = useState<string>(defaultRestroom?.id || restrooms[0]?.id || '');
  const [durationMinutes, setDurationMinutes] = useState<number>(20);
  const [sopCompleted, setSopCompleted] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('Routine disinfectant wipe down and refill complete.');
  const [computerTime, setComputerTime] = useState<string>('');
  const [isLogged, setIsLogged] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setComputerTime(new Date().toLocaleString());
    }, 1000);
    setComputerTime(new Date().toLocaleString());
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logCleaningActivity(selectedCleanerId, selectedRestroomId, durationMinutes, sopCompleted, notes);
    setIsLogged(true);

    setTimeout(() => {
      setIsLogged(false);
      onClose();
    }, 1200);
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
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Date & Time-Based Cleaner Logging</h3>
            <p className="text-xs text-slate-400">Timestamp captured directly from computer clock</p>
          </div>
        </div>

        {isLogged ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-white">Cleaning Activity Recorded!</h4>
            <p className="text-xs text-slate-400 font-mono">Timestamped log stored & points awarded (+50 Pts)</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Live Computer Clock Bar */}
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Captured Computer Clock:</span>
              <span className="font-mono text-cyan-400 font-bold">{computerTime}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cleaner Identity (ID & Name)
              </label>
              <select
                value={selectedCleanerId}
                onChange={(e) => setSelectedCleanerId(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
              >
                {cleaners.map(c => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.name} ({c.cleanerIdCode}) - {c.status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Restroom Location
              </label>
              <select
                value={selectedRestroomId}
                onChange={(e) => setSelectedRestroomId(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
              >
                {restrooms.map(r => (
                  <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                    {r.name} ({r.zone})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Cleaning Duration (Mins)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-mono"
                  required
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <input
                    type="checkbox"
                    checked={sopCompleted}
                    onChange={(e) => setSopCompleted(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Full SOP Standards Met</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cleaner Operations Notes / Observations
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                placeholder="Details of sanitization, supplies restocked..."
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-glow-emerald/20 transition"
              >
                Record Log Entry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
