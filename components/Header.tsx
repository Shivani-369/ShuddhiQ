'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  Clock,
  Radio,
  UserCheck,
  Search,
  LogOut,
  ChevronDown,
  AlertTriangle,
  RefreshCw,
  ShieldAlert
} from 'lucide-react';
import { useDashboard } from '../lib/store';

export const Header: React.FC = () => {
  const {
    adminUser,
    logoutAdmin,
    alerts,
    isLoRaSimulating,
    toggleLoRaSimulation,
    recentPackets
  } = useDashboard();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showAlertMenu, setShowAlertMenu] = useState<boolean>(false);

  // Capture exact computer date & time continuously
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      setCurrentDate(now.toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }));
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadAlerts = alerts.filter(a => !a.resolved);
  const latestPacket = recentPackets[0];

  return (
    <header className="h-16 glass-panel border-b border-slate-800 sticky top-0 z-20 px-6 flex items-center justify-between">
      {/* Left: Search & Live Clock */}
      <div className="flex items-center gap-6">
        {/* Live Computer Clock Display */}
        <div className="flex items-center gap-3 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-inner">
          <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold text-white tracking-widest">{currentTime || '16:02:41'}</span>
            <span className="text-[10px] text-slate-400">{currentDate}</span>
          </div>
        </div>

        {/* Live LoRa Telemetry Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800/80">
          <Radio className={`w-3.5 h-3.5 ${isLoRaSimulating ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
          <span className="text-xs text-slate-300">
            LoRa Feed: <span className="font-mono text-emerald-400">{isLoRaSimulating ? 'STREAMING (868 MHz)' : 'PAUSED'}</span>
          </span>
          <button
            onClick={toggleLoRaSimulation}
            className="ml-1 p-1 hover:bg-slate-800 rounded-md transition text-slate-400 hover:text-cyan-300"
            title="Toggle Live LoRa Telemetry Stream"
          >
            <RefreshCw className={`w-3 h-3 ${isLoRaSimulating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Center: Dynamic Alert Ticker */}
      {unreadAlerts.length > 0 && (
        <div className="hidden xl:flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-full max-w-md overflow-hidden">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
          <span className="text-xs text-rose-300 truncate font-mono">
            {unreadAlerts[0].message}
          </span>
        </div>
      )}

      {/* Right Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowAlertMenu(!showAlertMenu)}
            className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
          >
            <Bell className="w-4 h-4 text-slate-300" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {/* Alert Popover */}
          {showAlertMenu && (
            <div className="absolute right-0 mt-2 w-80 glass-panel bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" /> Active Hygiene Alerts
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">{unreadAlerts.length} Active</span>
              </div>
              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                {unreadAlerts.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">All restroom sensors within safe range.</p>
                ) : (
                  unreadAlerts.map(alert => (
                    <div
                      key={alert.id}
                      className="p-2.5 rounded-xl bg-slate-950/60 border border-rose-500/20 flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-rose-300">{alert.restroomName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{alert.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-300">{alert.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold text-xs">
              AD
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-medium text-white">{adminUser?.name || 'Facility Admin'}</p>
              <p className="text-[10px] text-cyan-400 font-mono">{adminUser?.role || 'System Admin'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 glass-panel bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
              <div className="p-3 border-b border-slate-800">
                <p className="text-xs font-semibold text-white">{adminUser?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{adminUser?.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/login"
                  onClick={() => {
                    logoutAdmin();
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" /> Sign Out Admin Session
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
