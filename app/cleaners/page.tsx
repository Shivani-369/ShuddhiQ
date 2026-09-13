'use client';

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Phone,
  ShieldAlert,
  Calendar,
  X,
  Plus
} from 'lucide-react';
import { useDashboard } from '../../lib/store';
import { AttendanceModal } from '../../components/AttendanceModal';
import { Cleaner } from '../../lib/types';

export default function CleanersPage() {
  const {
    cleaners,
    attendanceRecords,
    cleaningLogs,
    createCleaner,
    cleanerCheckIn,
    cleanerCheckOut
  } = useDashboard();

  const [isAddCleanerModalOpen, setIsAddCleanerModalOpen] = useState<boolean>(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState<boolean>(false);
  const [newCleanerName, setNewCleanerName] = useState<string>('');
  const [newCleanerPhone, setNewCleanerPhone] = useState<string>('');
  const [createdCleaner, setCreatedCleaner] = useState<Cleaner | null>(null);

  const handleCreateCleaner = (e: React.FormEvent) => {
    e.preventDefault();
    const created = createCleaner(newCleanerName, newCleanerPhone, ['rst-1']);
    setCreatedCleaner(created);
    setNewCleanerName('');
    setNewCleanerPhone('');

    setTimeout(() => {
      setCreatedCleaner(null);
      setIsAddCleanerModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/80">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-cyan-400" /> Cleaner Management & Attendance Tracking
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create unique Cleaner IDs, track check-in/out times, and view timestamped activity logs captured from computer clock.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddCleanerModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white text-xs font-semibold shadow-glow-cyan/20 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Cleaner ID</span>
          </button>
          <button
            onClick={() => setIsAttendanceModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Log Duty Activity</span>
          </button>
        </div>
      </div>

      {/* Cleaner Directory Roster Cards */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white tracking-wide">
          Registered Cleaner Roster ({cleaners.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cleaners.map((cleaner) => {
            const hasCheckedIn = attendanceRecords.some(a => a.cleanerId === cleaner.id && !a.checkOutTime);

            return (
              <div
                key={cleaner.id}
                className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={cleaner.avatar}
                      alt={cleaner.name}
                      className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-white">{cleaner.name}</h3>
                      <p className="text-[11px] font-mono text-cyan-400 font-bold">{cleaner.cleanerIdCode}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                      hasCheckedIn
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {hasCheckedIn ? 'On Duty' : 'Off Duty'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tier Badge</span>
                    <span className="font-bold text-amber-400">{cleaner.tierBadge}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Points Earned</span>
                    <span className="font-bold text-cyan-300">{cleaner.performancePoints} Pts</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Cleanings Completed</span>
                    <span className="text-slate-200">{cleaner.completedCleaningsCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Black Marks</span>
                    <span className={cleaner.blackMarkCount > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                      {cleaner.blackMarkCount}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" /> {cleaner.phone}
                  </span>

                  {hasCheckedIn ? (
                    <button
                      onClick={() => cleanerCheckOut(cleaner.id)}
                      className="px-3 py-1 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 rounded-lg text-[11px] border border-rose-500/30 font-semibold"
                    >
                      Check-Out
                    </button>
                  ) : (
                    <button
                      onClick={() => cleanerCheckIn(cleaner.id, 'Shift Morning')}
                      className="px-3 py-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded-lg text-[11px] border border-emerald-500/30 font-semibold"
                    >
                      Check-In Duty
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Date & Time-Based Cleaner Activity Logs Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" /> Timestamped Cleaner Activity Log (Computer Clock Ingest)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Computer Timestamp Verified</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {cleaningLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 text-cyan-300 font-bold">{log.cleanerName}</td>
                  <td className="p-3 text-slate-200">{log.restroomName}</td>
                  <td className="p-3 text-slate-400">Duration: {log.durationMinutes} mins</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-sans font-semibold">
                      SOP Verified
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 text-[11px] font-sans">{log.notes}</td>
                  <td className="p-3 text-right text-slate-500 text-[10px]">{log.computerTimestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Cleaner ID Modal */}
      {isAddCleanerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="glass-panel w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddCleanerModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Create New Cleaner ID</h3>
                <p className="text-xs text-slate-400">Assign unique Cleaner ID code automatically</p>
              </div>
            </div>

            {createdCleaner ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Cleaner Profile Created!</h4>
                <p className="text-xs font-mono text-cyan-400">Cleaner ID: {createdCleaner.cleanerIdCode}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateCleaner} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Cleaner Full Name
                  </label>
                  <input
                    type="text"
                    value={newCleanerName}
                    onChange={(e) => setNewCleanerName(e.target.value)}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                    placeholder="e.g. Ramesh Chandra"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={newCleanerPhone}
                    onChange={(e) => setNewCleanerPhone(e.target.value)}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                    placeholder="+91 98765 00000"
                    required
                  />
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddCleanerModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-glow-cyan/20"
                  >
                    Generate Cleaner ID
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Log Activity Modal */}
      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
      />
    </div>
  );
}
