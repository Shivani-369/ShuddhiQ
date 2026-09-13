'use client';

import React, { useState } from 'react';
import {
  Building2,
  Radio,
  Users,
  ShieldAlert,
  Sliders,
  FileText,
  Clock,
  Zap,
  TrendingUp,
  Activity,
  PlusCircle,
  AlertTriangle
} from 'lucide-react';
import { useDashboard } from '../lib/store';
import { HygieneCard } from '../components/HygieneCard';
import { RelocateDeviceModal } from '../components/RelocateDeviceModal';
import { ThresholdModal } from '../components/ThresholdModal';
import { SopDrawer } from '../components/SopDrawer';
import { AttendanceModal } from '../components/AttendanceModal';
import { Restroom } from '../lib/types';
import Link from 'next/link';

export default function DashboardPage() {
  const {
    restrooms,
    loraDevices,
    cleaners,
    alerts,
    escalations,
    recentPackets,
    isLoRaSimulating
  } = useDashboard();

  const [selectedRestroomForSop, setSelectedRestroomForSop] = useState<Restroom | null>(null);
  const [selectedRestroomForRelocate, setSelectedRestroomForRelocate] = useState<Restroom | null>(null);
  const [selectedRestroomForLog, setSelectedRestroomForLog] = useState<Restroom | null>(null);
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState<boolean>(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);

  const optimalCount = restrooms.filter(r => r.status === 'Optimal').length;
  const actionRequiredCount = restrooms.filter(r => r.status === 'Action Required').length;
  const criticalCount = restrooms.filter(r => r.status === 'Critical').length;
  const activeCleanersCount = cleaners.filter(c => c.status === 'On Duty' || c.status === 'Active').length;
  const onlineLoraNodes = loraDevices.filter(d => d.status === 'Online').length;

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-cyan-950/20 to-slate-900/90">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
            <Zap className="w-4 h-4 animate-pulse" /> CENTRALIZED RESTROOM MONITORING SYSTEM
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Central Facility Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-Time Wireless LoRa Hygiene Monitoring, Sensor Data Ingestion, Cleaner Activity Tracking & Automated Escalations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsThresholdModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Threshold Settings</span>
          </button>
          <button
            onClick={() => {
              setSelectedRestroomForLog(null);
              setIsLogModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white text-xs font-semibold shadow-glow-cyan/20 transition"
          >
            <Clock className="w-4 h-4" />
            <span>Log Cleaner Activity</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Monitored Restrooms */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Monitored Restrooms</p>
            <h3 className="text-2xl font-bold text-white mt-1 font-mono">{restrooms.length}</h3>
            <p className="text-[10px] text-emerald-400 font-mono mt-0.5">
              {optimalCount} Optimal | {criticalCount} Critical
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* LoRa Telemetry Network */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 font-medium">LoRa Node Status</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
              {onlineLoraNodes}/{loraDevices.length}
            </h3>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">868.1 MHz Wireless</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* On-Duty Cleaners */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Active Cleaner Roster</p>
            <h3 className="text-2xl font-bold text-white mt-1 font-mono">{activeCleanersCount}</h3>
            <p className="text-[10px] text-cyan-400 font-mono mt-0.5">Check-in logged</p>
          </div>
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Hygiene Alerts */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Active Hygiene Alerts</p>
            <h3 className={`text-2xl font-bold mt-1 font-mono ${alerts.filter(a=>!a.resolved).length > 0 ? 'text-rose-400 glow-text-rose' : 'text-slate-300'}`}>
              {alerts.filter(a => !a.resolved).length}
            </h3>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Threshold triggers</p>
          </div>
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        {/* Automated Escalations */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Overdue Escalations</p>
            <h3 className="text-2xl font-bold text-amber-400 mt-1 font-mono">
              {escalations.filter(e => e.status !== 'Resolved').length}
            </h3>
            <p className="text-[10px] text-amber-400/80 font-mono mt-0.5">Supervisor Alerted</p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Real-Time Restroom Matrix Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" /> Real-Time Hygiene Status Grid
            </h2>
            <p className="text-xs text-slate-400">Live wireless sensor metrics updated continuously via LoRa Layer</p>
          </div>
          <Link
            href="/restrooms"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono underline decoration-cyan-500/30"
          >
            View Restroom Matrix &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restrooms.map((restroom) => (
            <HygieneCard
              key={restroom.id}
              restroom={restroom}
              onOpenSop={(r) => setSelectedRestroomForSop(r)}
              onRelocateDevice={(r) => setSelectedRestroomForRelocate(r)}
              onQuickLogCleaning={(r) => {
                setSelectedRestroomForLog(r);
                setIsLogModalOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom Section: Live LoRa Wireless Telemetry Log & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live LoRa Wireless Ingestion Log */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
              <div>
                <h3 className="text-sm font-bold text-white">Centralized LoRa Data Telemetry Stream</h3>
                <p className="text-[11px] text-slate-400">Incoming data packets without Wi-Fi requirement at field sensors</p>
              </div>
            </div>
            <Link
              href="/lora-network"
              className="text-xs font-mono text-cyan-400 hover:underline"
            >
              Network Diagnostics &rarr;
            </Link>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {recentPackets.slice(0, 5).map((pkt) => (
              <div
                key={pkt.id}
                className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <div>
                    <span className="text-cyan-300 font-bold">{pkt.hardwareId}</span>
                    <span className="text-slate-400 text-[11px] ml-2">({pkt.restroomName})</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-300 text-[11px]">
                  <span>Ammonia: <strong className="text-emerald-400">{pkt.ammoniaPpm} PPM</strong></span>
                  <span>Odor: <strong className="text-purple-400">{pkt.odorIndex}/10</strong></span>
                  <span className="text-slate-500">{pkt.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations Widget */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Operational Quick Actions
            </h3>
            <p className="text-xs text-slate-400 mb-4">Direct dispatch for central facility administrators</p>

            <div className="space-y-2.5">
              <Link
                href="/cleaners"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-200 transition group"
              >
                <span className="group-hover:text-cyan-300">Create New Cleaner ID</span>
                <PlusCircle className="w-4 h-4 text-cyan-400" />
              </Link>
              <Link
                href="/schedules"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 text-xs text-slate-200 transition group"
              >
                <span className="group-hover:text-amber-300">Manage Overdue Escalations</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </Link>
              <Link
                href="/reports"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-200 transition group"
              >
                <span className="group-hover:text-emerald-300">Export PDF / CSV Reports</span>
                <FileText className="w-4 h-4 text-emerald-400" />
              </Link>
            </div>
          </div>

          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-[11px] text-cyan-300 text-center font-mono">
            60-Day Historical Database Active & Log Storage Compliant
          </div>
        </div>
      </div>

      {/* Modals & Drawers */}
      <RelocateDeviceModal
        restroom={selectedRestroomForRelocate}
        isOpen={!!selectedRestroomForRelocate}
        onClose={() => setSelectedRestroomForRelocate(null)}
      />

      <ThresholdModal
        isOpen={isThresholdModalOpen}
        onClose={() => setIsThresholdModalOpen(false)}
      />

      <SopDrawer
        restroom={selectedRestroomForSop}
        isOpen={!!selectedRestroomForSop}
        onClose={() => setSelectedRestroomForSop(null)}
      />

      <AttendanceModal
        isOpen={isLogModalOpen}
        defaultRestroom={selectedRestroomForLog}
        onClose={() => setIsLogModalOpen(false)}
      />
    </div>
  );
}
