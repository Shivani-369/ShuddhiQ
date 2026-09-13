'use client';

import React, { useState } from 'react';
import {
  Clock,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ShieldAlert,
  Sliders,
  UserCheck,
  Building2
} from 'lucide-react';
import { useDashboard } from '../../lib/store';

export default function SchedulesPage() {
  const {
    restrooms,
    escalations,
    updateRestroomSchedule,
    resolveEscalation
  } = useDashboard();

  const [selectedRestroomId, setSelectedRestroomId] = useState<string>(restrooms[0]?.id || '');
  const [newInterval, setNewInterval] = useState<number>(60);
  const [resolutionNotes, setResolutionNotes] = useState<string>('');
  const [resolvingEscId, setResolvingEscId] = useState<string | null>(null);

  const activeEscalations = escalations.filter(e => e.status !== 'Resolved');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/80">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Clock className="w-7 h-7 text-amber-400" /> Cleaning Schedules & Automated Escalations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure restroom cleaning intervals, monitor overdue alerts, and manage multi-tiered escalation flows.
          </p>
        </div>
      </div>

      {/* Automated Escalation Hierarchy Visualizer */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" /> Multi-Tier Automated Escalation Engine Hierarchy
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-1">
            <div className="flex items-center justify-between text-cyan-300 font-bold">
              <span>LEVEL 1: CLEANER ALERT</span>
              <span className="text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded-full">0 - 15 Mins</span>
            </div>
            <p className="text-slate-300 font-sans text-[11px]">
              Direct notification dispatched to assigned cleaner phone & wrist badge.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
            <div className="flex items-center justify-between text-amber-300 font-bold">
              <span>LEVEL 2: SUPERVISOR ESCALATION</span>
              <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full">15 - 45 Mins</span>
            </div>
            <p className="text-slate-300 font-sans text-[11px]">
              Escalated to floor supervisor for immediate cleaner re-assignment.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1">
            <div className="flex items-center justify-between text-rose-300 font-bold">
              <span>LEVEL 3: ADMIN MANAGER ALERT</span>
              <span className="text-[10px] bg-rose-500/20 px-2 py-0.5 rounded-full">&gt; 45 Mins</span>
            </div>
            <p className="text-slate-300 font-sans text-[11px]">
              High priority alert raised on Central Admin Dashboard. Black mark issued automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Active Overdue Escalations Monitor Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" /> Active Overdue Cleaning Escalations ({activeEscalations.length})
          </h2>
        </div>

        {activeEscalations.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 font-mono">
            No active overdue escalations. All restroom cleaning schedules compliant.
          </div>
        ) : (
          <div className="space-y-3">
            {activeEscalations.map((esc) => (
              <div
                key={esc.id}
                className="p-4 bg-slate-950/80 border border-rose-500/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {esc.currentLevel}
                    </span>
                    <h4 className="font-bold text-sm text-white">{esc.restroomName}</h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    Overdue Window: <strong className="text-rose-400 font-mono">{esc.overdueMinutes} Mins Overdue</strong> | Supervisor Assigned: <span className="text-cyan-300 font-medium">{esc.assignedSupervisor}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {resolvingEscId === esc.id ? (
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <input
                        type="text"
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                        placeholder="Resolution notes..."
                        className="glass-input px-3 py-1.5 rounded-xl text-xs"
                      />
                      <button
                        onClick={() => {
                          resolveEscalation(esc.id, resolutionNotes);
                          setResolvingEscId(null);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
                      >
                        Confirm
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setResolvingEscId(esc.id)}
                      className="px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 rounded-xl text-xs font-semibold transition"
                    >
                      Resolve Escalation
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Restroom Cleaning Interval Configuration Grid */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-cyan-400" /> Restroom Cleaning Interval Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restrooms.map((restroom) => (
            <div
              key={restroom.id}
              className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3 text-xs"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-white">{restroom.name}</h4>
                <span className="font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  Every {restroom.cleaningIntervalMinutes}m
                </span>
              </div>
              <p className="text-slate-400 text-[11px]">{restroom.location}</p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Adjust Cycle Interval:</span>
                <select
                  value={restroom.cleaningIntervalMinutes}
                  onChange={(e) => updateRestroomSchedule(restroom.id, Number(e.target.value))}
                  className="glass-input px-2.5 py-1 rounded-lg text-xs font-mono"
                >
                  <option value={30} className="bg-slate-900">30 Mins (High Traffic)</option>
                  <option value={60} className="bg-slate-900">60 Mins (Standard)</option>
                  <option value={90} className="bg-slate-900">90 Mins</option>
                  <option value={120} className="bg-slate-900">120 Mins (Low Traffic)</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
