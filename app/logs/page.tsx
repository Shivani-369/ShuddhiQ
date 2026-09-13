'use client';

import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Calendar,
  Database,
  ShieldCheck,
  Building2,
  Users
} from 'lucide-react';
import { useDashboard } from '../../lib/store';

export default function LogsPage() {
  const { auditLogs, restrooms } = useDashboard();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRestroom, setSelectedRestroom] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.restroomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (log.cleanerName && log.cleanerName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || log.category === selectedCategory;
    const matchesRestroom = selectedRestroom === 'ALL' || log.restroomName === selectedRestroom;

    return matchesSearch && matchesCategory && matchesRestroom;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/80">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <History className="w-7 h-7 text-cyan-400" /> Two-Month Log Storage Database (60-Day Archive)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Securely retains daily cleaner activity, sensor telemetry, escalations, and hygiene logs for at least two months.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-xs font-mono">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>DATABASE RETENTION: <strong className="text-emerald-400">60 DAYS ACTIVE</strong></span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action, cleaner, or keyword..."
            className="w-full glass-input pl-10 pr-4 py-2.5 rounded-2xl text-xs"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedRestroom}
            onChange={(e) => setSelectedRestroom(e.target.value)}
            className="glass-input px-3 py-2 rounded-xl text-xs"
          >
            <option value="ALL" className="bg-slate-900">All Restrooms</option>
            {restrooms.map(r => (
              <option key={r.id} value={r.name} className="bg-slate-900">
                {r.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            {['ALL', 'Cleaner Activity', 'Sensor', 'Escalation', 'Violation'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-[11px] font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 60-Day Audit Log Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" /> Filtered Historical Entries ({filteredLogs.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">Retained Entries: 60-Day Compliant</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Category</th>
                <th className="p-3">Restroom Location</th>
                <th className="p-3">Cleaner Name</th>
                <th className="p-3">Action Description</th>
                <th className="p-3">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.slice(0, 40).map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 text-slate-400 text-[11px]">{log.timestamp}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-cyan-300 border border-slate-700">
                      {log.category}
                    </span>
                  </td>
                  <td className="p-3 text-slate-200">{log.restroomName}</td>
                  <td className="p-3 text-cyan-300">{log.cleanerName || '—'}</td>
                  <td className="p-3 text-slate-300 font-sans text-xs">{log.action}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] border ${
                        log.severity === 'Critical'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : log.severity === 'Warning'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
