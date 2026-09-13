'use client';

import React from 'react';
import {
  Wind,
  Droplets,
  Users,
  Footprints,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Radio,
  FileCheck,
  MapPin,
  Sparkles
} from 'lucide-react';
import { Restroom } from '../lib/types';
import { SensorGauge } from './SensorGauge';
import { useDashboard } from '../lib/store';

interface HygieneCardProps {
  restroom: Restroom;
  onOpenSop: (restroom: Restroom) => void;
  onRelocateDevice: (restroom: Restroom) => void;
  onQuickLogCleaning: (restroom: Restroom) => void;
}

export const HygieneCard: React.FC<HygieneCardProps> = ({
  restroom,
  onOpenSop,
  onRelocateDevice,
  onQuickLogCleaning
}) => {
  const { thresholds } = useDashboard();

  let statusBadgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let statusIcon = <ShieldCheck className="w-4 h-4 text-emerald-400" />;

  if (restroom.status === 'Critical') {
    statusBadgeClass = 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-glow-rose/30 animate-pulse';
    statusIcon = <AlertTriangle className="w-4 h-4 text-rose-400" />;
  } else if (restroom.status === 'Action Required') {
    statusBadgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    statusIcon = <AlertTriangle className="w-4 h-4 text-amber-400" />;
  }

  const minutesSinceCleaned = Math.round(
    (Date.now() - new Date(restroom.lastCleanedAt).getTime()) / (1000 * 60)
  );

  const isOverdue = minutesSinceCleaned > restroom.cleaningIntervalMinutes;

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-sm tracking-wide group-hover:text-cyan-300 transition">
                {restroom.name}
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-cyan-400" /> {restroom.location}
            </p>
          </div>

          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass}`}
          >
            {statusIcon}
            <span>{restroom.status}</span>
          </span>
        </div>

        {/* LoRa Device Binding Badge */}
        <div className="flex items-center justify-between py-1.5 px-3 bg-slate-950/70 rounded-xl border border-slate-800/80 mb-4 text-[11px]">
          <div className="flex items-center gap-2 text-slate-400">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>LoRa Node:</span>
            <span className="font-mono text-cyan-300 font-semibold">{restroom.loraDeviceId}</span>
          </div>
          <button
            onClick={() => onRelocateDevice(restroom)}
            className="text-[10px] font-mono text-slate-400 hover:text-cyan-300 underline decoration-cyan-500/30"
          >
            Reconfigure Location
          </button>
        </div>

        {/* Real-time Sensor Metrics Matrix */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <SensorGauge
            label="Ammonia Gas"
            value={restroom.sensorReadings.ammoniaPpm}
            max={60}
            unit="PPM"
            threshold={thresholds.ammoniaMaxPpm}
            icon={<Wind className="w-3.5 h-3.5 text-cyan-400" />}
          />
          <SensorGauge
            label="Odor Index"
            value={restroom.sensorReadings.odorIndex}
            max={10}
            unit="/10"
            threshold={thresholds.odorMaxIndex}
            icon={<Sparkles className="w-3.5 h-3.5 text-purple-400" />}
          />
        </div>

        {/* Additional Telemetry Pills */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-[11px]">
          <div className="bg-slate-950/40 p-2 rounded-xl border border-slate-800/60 flex flex-col items-center">
            <span className="text-slate-400 flex items-center gap-1 text-[10px]">
              <Droplets className="w-3 h-3 text-blue-400" /> Humidity
            </span>
            <span className="font-mono font-bold text-slate-200 mt-0.5">
              {restroom.sensorReadings.humidityPercent}%
            </span>
          </div>
          <div className="bg-slate-950/40 p-2 rounded-xl border border-slate-800/60 flex flex-col items-center">
            <span className="text-slate-400 flex items-center gap-1 text-[10px]">
              <Users className="w-3 h-3 text-emerald-400" /> Occupants
            </span>
            <span className="font-mono font-bold text-slate-200 mt-0.5">
              {restroom.sensorReadings.occupancyCount}
            </span>
          </div>
          <div className="bg-slate-950/40 p-2 rounded-xl border border-slate-800/60 flex flex-col items-center">
            <span className="text-slate-400 flex items-center gap-1 text-[10px]">
              <Footprints className="w-3 h-3 text-amber-400" /> Daily Footfall
            </span>
            <span className="font-mono font-bold text-slate-200 mt-0.5">
              {restroom.sensorReadings.totalFootfall}
            </span>
          </div>
        </div>

        {/* Cleaner & Timing Info */}
        <div className="border-t border-slate-800/80 pt-3 mb-4 text-xs space-y-1.5">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400 text-[11px]">Assigned Cleaner:</span>
            <span className="font-medium text-cyan-300">{restroom.assignedCleanerName}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Last Cleaning:</span>
            <span className={`font-mono ${isOverdue ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
              {minutesSinceCleaned} mins ago {isOverdue && '(OVERDUE)'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
        <button
          onClick={() => onOpenSop(restroom)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-slate-200 transition border border-slate-700/60"
        >
          <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>View SOP</span>
        </button>
        <button
          onClick={() => onQuickLogCleaning(restroom)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-xs font-semibold text-white shadow-glow-cyan/20 transition"
        >
          <Clock className="w-3.5 h-3.5 text-white" />
          <span>Log Cleaning</span>
        </button>
      </div>
    </div>
  );
};
