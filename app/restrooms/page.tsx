'use client';

import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { useDashboard } from '../../lib/store';
import { HygieneCard } from '../../components/HygieneCard';
import { RelocateDeviceModal } from '../../components/RelocateDeviceModal';
import { ThresholdModal } from '../../components/ThresholdModal';
import { SopDrawer } from '../../components/SopDrawer';
import { AttendanceModal } from '../../components/AttendanceModal';
import { Restroom } from '../../lib/types';

export default function RestroomsPage() {
  const { restrooms } = useDashboard();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedRestroomForSop, setSelectedRestroomForSop] = useState<Restroom | null>(null);
  const [selectedRestroomForRelocate, setSelectedRestroomForRelocate] = useState<Restroom | null>(null);
  const [selectedRestroomForLog, setSelectedRestroomForLog] = useState<Restroom | null>(null);
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState<boolean>(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);

  const filteredRestrooms = restrooms.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.zone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/80">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Building2 className="w-7 h-7 text-cyan-400" /> Real-Time Hygiene Status Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Displaying hygiene conditions based on live LoRa sensor readings across all airport restroom facilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsThresholdModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Threshold Rules</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search restroom name or zone..."
            className="w-full glass-input pl-10 pr-4 py-2.5 rounded-2xl text-xs"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-xs w-full sm:w-auto">
          {['ALL', 'Optimal', 'Action Required', 'Critical'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition ${
                statusFilter === status
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {status} {status !== 'ALL' && `(${restrooms.filter(r => r.status === status).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Restroom Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestrooms.map((restroom) => (
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
