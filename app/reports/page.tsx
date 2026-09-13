'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  FileText,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useDashboard } from '../../lib/store';
import { downloadCSV, printPDFReport } from '../../lib/exportUtils';

export default function ReportsPage() {
  const { restrooms, cleaners, cleaningLogs, violations, auditLogs } = useDashboard();
  const [reportType, setReportType] = useState<'HygieneSummary' | 'CleanerPerformance' | 'ViolationAudit'>('HygieneSummary');

  const handleExportCSV = () => {
    if (reportType === 'HygieneSummary') {
      const data = restrooms.map(r => ({
        Restroom_ID: r.id,
        Restroom_Name: r.name,
        Location: r.location,
        Hygiene_Status: r.status,
        Ammonia_PPM: r.sensorReadings.ammoniaPpm,
        Odor_Index: r.sensorReadings.odorIndex,
        Humidity_Percent: r.sensorReadings.humidityPercent,
        Daily_Footfall: r.sensorReadings.totalFootfall,
        Assigned_Cleaner: r.assignedCleanerName,
        Last_Cleaned: r.lastCleanedAt
      }));
      downloadCSV('Restroom_Hygiene_Summary_Report', data);
    } else if (reportType === 'CleanerPerformance') {
      const data = cleaners.map(c => ({
        Cleaner_ID: c.cleanerIdCode,
        Cleaner_Name: c.name,
        Phone: c.phone,
        Status: c.status,
        Tier_Badge: c.tierBadge,
        Performance_Points: c.performancePoints,
        Completed_Tasks: c.completedCleaningsCount,
        Black_Marks: c.blackMarkCount,
        Six_Month_Consistency: `${c.sixMonthConsistencyScore}%`
      }));
      downloadCSV('Cleaner_Performance_Report', data);
    } else {
      const data = violations.map(v => ({
        Violation_ID: v.id,
        Cleaner_Name: v.cleanerName,
        Restroom_Name: v.restroomName,
        Violation_Title: v.title,
        Severity: v.severity,
        Black_Mark_Points: v.blackMarkPoints,
        Date: v.date,
        Details: v.details
      }));
      downloadCSV('Hygiene_Violation_Audit_Report', data);
    }
  };

  const handlePrintPDF = () => {
    let htmlContent = '';

    if (reportType === 'HygieneSummary') {
      htmlContent = `
        <h2>Restroom Hygiene & Sensor Telemetry Summary</h2>
        <table>
          <thead>
            <tr>
              <th>Restroom Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Ammonia (PPM)</th>
              <th>Odor Index</th>
              <th>Footfall</th>
              <th>Assigned Cleaner</th>
            </tr>
          </thead>
          <tbody>
            ${restrooms.map(r => `
              <tr>
                <td><strong>${r.name}</strong></td>
                <td>${r.location}</td>
                <td><span class="badge ${r.status === 'Optimal' ? 'badge-optimal' : r.status === 'Action Required' ? 'badge-action' : 'badge-critical'}">${r.status}</span></td>
                <td>${r.sensorReadings.ammoniaPpm} PPM</td>
                <td>${r.sensorReadings.odorIndex} / 10</td>
                <td>${r.sensorReadings.totalFootfall}</td>
                <td>${r.assignedCleanerName}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else if (reportType === 'CleanerPerformance') {
      htmlContent = `
        <h2>Cleaner Performance & Attendance Audit</h2>
        <table>
          <thead>
            <tr>
              <th>Cleaner ID</th>
              <th>Cleaner Name</th>
              <th>Tier Badge</th>
              <th>Points</th>
              <th>Tasks Completed</th>
              <th>Black Marks</th>
              <th>6-Month Score</th>
            </tr>
          </thead>
          <tbody>
            ${cleaners.map(c => `
              <tr>
                <td><strong>${c.cleanerIdCode}</strong></td>
                <td>${c.name}</td>
                <td>${c.tierBadge}</td>
                <td>${c.performancePoints} Pts</td>
                <td>${c.completedCleaningsCount}</td>
                <td>${c.blackMarkCount}</td>
                <td>${c.sixMonthConsistencyScore}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      htmlContent = `
        <h2>Hygiene Violation & Black Mark Report</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Cleaner Name</th>
              <th>Restroom</th>
              <th>Violation</th>
              <th>Severity</th>
              <th>Black Marks</th>
            </tr>
          </thead>
          <tbody>
            ${violations.map(v => `
              <tr>
                <td>${v.date}</td>
                <td><strong>${v.cleanerName}</strong></td>
                <td>${v.restroomName}</td>
                <td>${v.title}</td>
                <td>${v.severity}</td>
                <td>+${v.blackMarkPoints}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    printPDFReport(`Report_${reportType}`, htmlContent);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/80">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-7 h-7 text-emerald-400" /> Reports & Data Export Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate summarized hygiene and cleaner-performance reports for administrative review and record keeping.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-glow-emerald/20 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF Export</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setReportType('HygieneSummary')}
          className={`p-5 rounded-2xl border text-left transition ${
            reportType === 'HygieneSummary'
              ? 'glass-panel bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
              : 'glass-card text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Building2 className="w-6 h-6 mb-2 text-cyan-400" />
          <h3 className="font-bold text-sm text-white">Restroom Hygiene Summary</h3>
          <p className="text-xs text-slate-400 mt-1">Sensor readings, status, ammonia PPM, odor index & footfall.</p>
        </button>

        <button
          onClick={() => setReportType('CleanerPerformance')}
          className={`p-5 rounded-2xl border text-left transition ${
            reportType === 'CleanerPerformance'
              ? 'glass-panel bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              : 'glass-card text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Users className="w-6 h-6 mb-2 text-emerald-400" />
          <h3 className="font-bold text-sm text-white">Cleaner Performance Audit</h3>
          <p className="text-xs text-slate-400 mt-1">Attendance, cleaner IDs, completed cleanings & points earned.</p>
        </button>

        <button
          onClick={() => setReportType('ViolationAudit')}
          className={`p-5 rounded-2xl border text-left transition ${
            reportType === 'ViolationAudit'
              ? 'glass-panel bg-rose-500/10 border-rose-500/40 text-rose-300'
              : 'glass-card text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-6 h-6 mb-2 text-rose-400" />
          <h3 className="font-bold text-sm text-white">Violation & Strike Report</h3>
          <p className="text-xs text-slate-400 mt-1">Missed schedules, black marks, and hygiene compliance breaches.</p>
        </button>
      </div>

      {/* Live Preview Box */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" /> Report Document Live Preview
          </h3>
          <span className="text-xs font-mono text-cyan-400">PDF / CSV Ready</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 overflow-x-auto">
          {reportType === 'HygieneSummary' && (
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-2">Facility Name</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Ammonia PPM</th>
                  <th className="p-2">Odor Index</th>
                  <th className="p-2">Daily Footfall</th>
                  <th className="p-2">Cleaner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {restrooms.map(r => (
                  <tr key={r.id}>
                    <td className="p-2 font-bold text-white">{r.name}</td>
                    <td className="p-2 text-emerald-400">{r.status}</td>
                    <td className="p-2">{r.sensorReadings.ammoniaPpm} PPM</td>
                    <td className="p-2">{r.sensorReadings.odorIndex}/10</td>
                    <td className="p-2">{r.sensorReadings.totalFootfall}</td>
                    <td className="p-2 text-cyan-300">{r.assignedCleanerName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'CleanerPerformance' && (
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-2">Cleaner ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Badge Tier</th>
                  <th className="p-2">Points</th>
                  <th className="p-2">Tasks Completed</th>
                  <th className="p-2">Consistency Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {cleaners.map(c => (
                  <tr key={c.id}>
                    <td className="p-2 text-cyan-300 font-bold">{c.cleanerIdCode}</td>
                    <td className="p-2 font-bold text-white">{c.name}</td>
                    <td className="p-2 text-amber-400">{c.tierBadge}</td>
                    <td className="p-2">{c.performancePoints} Pts</td>
                    <td className="p-2">{c.completedCleaningsCount}</td>
                    <td className="p-2 text-emerald-400">{c.sixMonthConsistencyScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'ViolationAudit' && (
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-2">Date</th>
                  <th className="p-2">Cleaner</th>
                  <th className="p-2">Facility</th>
                  <th className="p-2">Violation</th>
                  <th className="p-2">Black Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {violations.map(v => (
                  <tr key={v.id}>
                    <td className="p-2 text-slate-400">{v.date}</td>
                    <td className="p-2 font-bold text-white">{v.cleanerName}</td>
                    <td className="p-2">{v.restroomName}</td>
                    <td className="p-2 text-rose-400">{v.title}</td>
                    <td className="p-2 text-rose-400 font-bold">+{v.blackMarkPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
