'use client';

import React, { useState } from 'react';
import {
  AlertOctagon,
  Wrench,
  PlusCircle,
  ShieldAlert,
  CheckCircle2,
  X,
  FileWarning,
  UserX
} from 'lucide-react';
import { useDashboard } from '../../lib/store';
import { MaintenanceTicket } from '../../lib/types';

export default function ViolationsMaintenancePage() {
  const {
    violations,
    tickets,
    cleaners,
    restrooms,
    addViolation,
    createTicket,
    resolveTicket
  } = useDashboard();

  const [isViolationModalOpen, setIsViolationModalOpen] = useState<boolean>(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState<boolean>(false);

  // New Violation state
  const [violCleanerId, setViolCleanerId] = useState<string>(cleaners[0]?.id || '');
  const [violRestroomId, setViolRestroomId] = useState<string>(restrooms[0]?.id || '');
  const [violTitle, setViolTitle] = useState<string>('Missed Scheduled Cleaning Window');
  const [violSeverity, setViolSeverity] = useState<'Minor' | 'Moderate' | 'Severe'>('Moderate');
  const [violDetails, setViolDetails] = useState<string>('Cleaner failed to initiate cleaning cycle within 45 mins of alert.');

  // New Ticket state
  const [tktRestroomId, setTktRestroomId] = useState<string>(restrooms[0]?.id || '');
  const [tktIssueType, setTktIssueType] = useState<MaintenanceTicket['issueType']>('Sensor Malfunction');
  const [tktPriority, setTktPriority] = useState<MaintenanceTicket['priority']>('High');
  const [tktDescription, setTktDescription] = useState<string>('LoRa Ammonia probe emitting noisy signal fluctuation.');

  const handleAddViolation = (e: React.FormEvent) => {
    e.preventDefault();
    addViolation(violCleanerId, violRestroomId, violTitle, violSeverity, violDetails);
    setIsViolationModalOpen(false);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    createTicket(tktRestroomId, tktIssueType, tktPriority, tktDescription);
    setIsTicketModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/80">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <AlertOctagon className="w-7 h-7 text-rose-400" /> Violations, Black Marks & Maintenance Issues
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Log cleaner performance violations, track strike counts, and manage restroom equipment/sensor maintenance tickets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsViolationModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-semibold transition"
          >
            <UserX className="w-4 h-4" />
            <span>Issue Black Mark</span>
          </button>
          <button
            onClick={() => setIsTicketModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-glow-cyan/20 transition"
          >
            <Wrench className="w-4 h-4" />
            <span>Report Maintenance Issue</span>
          </button>
        </div>
      </div>

      {/* Two Grid Layout: Black Marks Left, Maintenance Tickets Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Black Mark & Violation Logs Panel */}
        <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-rose-400" /> Black Mark & Violation History
            </h2>
            <span className="text-xs font-mono text-rose-400 font-bold">{violations.length} Total Strikes</span>
          </div>

          <div className="space-y-3">
            {violations.map((viol) => (
              <div
                key={viol.id}
                className="p-4 bg-slate-950/80 border border-rose-500/30 rounded-2xl space-y-2 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-rose-300 font-bold text-sm block">{viol.title}</span>
                    <span className="text-slate-400 text-[11px]">
                      Cleaner: <strong className="text-cyan-300">{viol.cleanerName}</strong> | Facility: {viol.restroomName}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    +{viol.blackMarkPoints} Black Marks
                  </span>
                </div>
                <p className="text-slate-300 font-sans text-[11px]">{viol.details}</p>
                <div className="text-[10px] text-slate-500 font-mono text-right">{viol.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Tickets Panel */}
        <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-cyan-400" /> Equipment & Sensor Maintenance Dispatch
            </h2>
            <span className="text-xs font-mono text-cyan-400">{tickets.filter(t => t.status !== 'Resolved').length} Open</span>
          </div>

          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-cyan-400 font-bold text-xs">{ticket.ticketNo}</span>
                    <h4 className="font-bold text-white text-sm">{ticket.issueType}</h4>
                    <span className="text-slate-400 text-[11px]">{ticket.restroomName}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        ticket.priority === 'Emergency' || ticket.priority === 'High'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {ticket.priority} Priority
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] border ${
                        ticket.status === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-slate-800 text-cyan-300 border-slate-700'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                </div>

                <p className="text-slate-300 text-[11px]">{ticket.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                  <span>Reported by: {ticket.reportedBy}</span>
                  {ticket.status !== 'Resolved' && (
                    <button
                      onClick={() => resolveTicket(ticket.id)}
                      className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg font-semibold border border-emerald-500/30"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Issue Black Mark Modal */}
      {isViolationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="glass-panel w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsViolationModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <UserX className="w-5 h-5 text-rose-400" /> Record Black Mark / Violation
            </h3>

            <form onSubmit={handleAddViolation} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Target Cleaner ID</label>
                <select
                  value={violCleanerId}
                  onChange={(e) => setViolCleanerId(e.target.value)}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                >
                  {cleaners.map(c => (
                    <option key={c.id} value={c.id} className="bg-slate-900">
                      {c.name} ({c.cleanerIdCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Restroom Facility</label>
                <select
                  value={violRestroomId}
                  onChange={(e) => setViolRestroomId(e.target.value)}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                >
                  {restrooms.map(r => (
                    <option key={r.id} value={r.id} className="bg-slate-900">
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Violation Category</label>
                  <input
                    type="text"
                    value={violTitle}
                    onChange={(e) => setViolTitle(e.target.value)}
                    className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Severity</label>
                  <select
                    value={violSeverity}
                    onChange={(e) => setViolSeverity(e.target.value as any)}
                    className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                  >
                    <option value="Minor" className="bg-slate-900">Minor (+1 Black Mark)</option>
                    <option value="Moderate" className="bg-slate-900">Moderate (+2 Black Marks)</option>
                    <option value="Severe" className="bg-slate-900">Severe (+3 Black Marks)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Detailed Findings</label>
                <textarea
                  value={violDetails}
                  onChange={(e) => setViolDetails(e.target.value)}
                  rows={3}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsViolationModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-glow-rose/20"
                >
                  Record Violation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Maintenance Issue Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="glass-panel w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsTicketModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-cyan-400" /> Dispatch Maintenance Ticket
            </h3>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Restroom Facility</label>
                <select
                  value={tktRestroomId}
                  onChange={(e) => setTktRestroomId(e.target.value)}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                >
                  {restrooms.map(r => (
                    <option key={r.id} value={r.id} className="bg-slate-900">
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Issue Category</label>
                  <select
                    value={tktIssueType}
                    onChange={(e) => setTktIssueType(e.target.value as any)}
                    className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                  >
                    <option value="Sensor Malfunction" className="bg-slate-900">Sensor Malfunction</option>
                    <option value="Plumbing Defect" className="bg-slate-900">Plumbing Defect</option>
                    <option value="Sanitize Dispenser Empty" className="bg-slate-900">Sanitize Dispenser Empty</option>
                    <option value="Hardware Failure" className="bg-slate-900">Hardware Failure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Priority</label>
                  <select
                    value={tktPriority}
                    onChange={(e) => setTktPriority(e.target.value as any)}
                    className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                  >
                    <option value="Low" className="bg-slate-900">Low</option>
                    <option value="Medium" className="bg-slate-900">Medium</option>
                    <option value="High" className="bg-slate-900">High</option>
                    <option value="Emergency" className="bg-slate-900">Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Description / Observations</label>
                <textarea
                  value={tktDescription}
                  onChange={(e) => setTktDescription(e.target.value)}
                  rows={3}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-glow-cyan/20"
                >
                  Dispatch Maintenance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
