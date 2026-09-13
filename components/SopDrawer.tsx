'use client';

import React from 'react';
import { X, CheckSquare, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { Restroom } from '../lib/types';

interface SopDrawerProps {
  restroom: Restroom | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SopDrawer: React.FC<SopDrawerProps> = ({ restroom, isOpen, onClose }) => {
  if (!isOpen || !restroom) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Cleaning Requirements & SOP</h3>
                <p className="text-xs text-slate-400 font-mono">{restroom.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Standard Operating Procedure Checklist */}
          <div className="space-y-4">
            <div className="bg-cyan-500/10 border border-cyan-500/20 p-3.5 rounded-2xl flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-xs text-cyan-200">
                Mandatory Restroom Hygiene Standards: All cleaners must complete and sign off these steps during every cleaning cycle.
              </p>
            </div>

            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Step-by-Step Cleaning Verification Checklist
            </h4>

            <div className="space-y-2.5">
              {restroom.sopRequirements.map((sopItem, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3 text-xs text-slate-200"
                >
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <span>{sopItem}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800/80 pt-4 space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Required Frequency:</span>
                <span className="font-mono text-cyan-400 font-bold">Every {restroom.cleaningIntervalMinutes} mins</span>
              </div>
              <div className="flex justify-between">
                <span>Assigned Cleaner:</span>
                <span className="font-medium text-white">{restroom.assignedCleanerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Target Ammonia Ceiling:</span>
                <span className="font-mono text-emerald-400">&lt; 25 PPM</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
        >
          Close Guidelines
        </button>
      </div>
    </div>
  );
};
