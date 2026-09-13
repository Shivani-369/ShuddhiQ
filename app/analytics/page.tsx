'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Calendar,
  Layers,
  Sparkles,
  PieChart
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { useDashboard } from '../../lib/store';

export default function AnalyticsPage() {
  const { cleaners } = useDashboard();
  const [timeRange, setTimeRange] = useState<'Daily' | 'Weekly' | 'Monthly' | '6-Month'>('Monthly');

  // Bar Chart Data: Points vs Completed Cleanings
  const barChartData = cleaners.map(c => ({
    name: c.name.split(' ')[0],
    fullName: c.name,
    points: c.performancePoints,
    completed: c.completedCleaningsCount,
    missed: c.missedCleaningsCount * 10
  }));

  // Historical Performance Trend Simulation Data
  const trendData = [
    { month: 'Apr', avgScore: 88, cleanings: 420, violations: 4 },
    { month: 'May', avgScore: 91, cleanings: 510, violations: 3 },
    { month: 'Jun', avgScore: 94, cleanings: 580, violations: 2 },
    { month: 'Jul', avgScore: 92, cleanings: 610, violations: 3 },
    { month: 'Aug', avgScore: 96, cleanings: 690, violations: 1 },
    { month: 'Sep', avgScore: 98, cleanings: 745, violations: 1 },
  ];

  // Cleaner Comparative Radar Data
  const radarData = [
    { subject: 'Cleaning Speed', CleanerA: 95, CleanerB: 82, CleanerC: 98 },
    { subject: 'SOP Compliance', CleanerA: 98, CleanerB: 88, CleanerC: 96 },
    { subject: 'Timeliness', CleanerA: 92, CleanerB: 74, CleanerC: 99 },
    { subject: 'Odor Control', CleanerA: 96, CleanerB: 80, CleanerC: 94 },
    { subject: 'Consistency', CleanerA: 94, CleanerB: 78, CleanerC: 97 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/80">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-cyan-400" /> Cleaning Performance Analytics & Comparison
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Analyze daily, weekly, monthly, and 6-month cleaner stats and comparative metrics.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
          {(['Daily', 'Weekly', 'Monthly', '6-Month'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition ${
                timeRange === range
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Top Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cleaner Performance Comparison Bar Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" /> Cleaner Points & Task Completion Comparison
            </h3>
            <span className="text-xs text-slate-400 font-mono">{timeRange} View</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="points" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Points" />
                <Bar dataKey="completed" fill="#10b981" radius={[6, 6, 0, 0]} name="Completed Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6-Month Hygiene Performance & Task Volume Trend Area Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> 6-Month Facility Hygiene Trend
            </h3>
            <span className="text-xs text-emerald-400 font-mono">+14% Growth</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorClean" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="cleanings" stroke="#10b981" fillOpacity={1} fill="url(#colorClean)" name="Total Cleanings" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Multi-Dimensional Radar Comparison Chart */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" /> Multi-Dimensional Cleaner Skill & SOP Radar
          </h3>
          <span className="text-xs text-slate-400 font-mono">Skill Matrix Index</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="h-72 w-full lg:col-span-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
                <Radar name="Rajesh Kumar (Gold)" dataKey="CleanerA" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                <Radar name="Priya Sharma (Silver)" dataKey="CleanerB" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                <Radar name="Vikram Singh (Legend)" dataKey="CleanerC" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs">
            <h4 className="font-bold text-white mb-2">Performance Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">Top Speed Cleaner:</span>
                <span className="text-emerald-400 font-bold">Vikram Singh (98%)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-400">SOP Compliance Rate:</span>
                <span className="text-cyan-400 font-bold">Rajesh Kumar (98%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Overall Facility Average:</span>
                <span className="text-purple-400 font-bold">94.2 Score</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
