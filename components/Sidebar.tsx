'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Radio,
  Building2,
  Users,
  Clock,
  AlertOctagon,
  BarChart3,
  Trophy,
  History,
  FileSpreadsheet,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useDashboard } from '../lib/store';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { alerts, escalations, tickets, loraDevices, cleaners } = useDashboard();

  const activeAlertsCount = alerts.filter(a => !a.resolved).length;
  const activeEscalationsCount = escalations.filter(e => e.status !== 'Resolved').length;
  const openTicketsCount = tickets.filter(t => t.status !== 'Resolved').length;

  const navItems = [
    {
      name: 'Overview Dashboard',
      href: '/',
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: 'LoRa Data Reception',
      href: '/lora-network',
      icon: Radio,
      badge: `${loraDevices.length} Nodes`
    },
    {
      name: 'Real-Time Hygiene',
      href: '/restrooms',
      icon: Building2,
      badge: activeAlertsCount > 0 ? `${activeAlertsCount} Alerts` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    {
      name: 'Cleaner Roster & Duty',
      href: '/cleaners',
      icon: Users,
      badge: `${cleaners.length} Active`
    },
    {
      name: 'Schedules & Escalation',
      href: '/schedules',
      icon: Clock,
      badge: activeEscalationsCount > 0 ? `${activeEscalationsCount} Overdue` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      name: 'Violations & Maintenance',
      href: '/violations-maintenance',
      icon: AlertOctagon,
      badge: openTicketsCount > 0 ? `${openTicketsCount} Issues` : null,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    },
    {
      name: 'Cleaner Analytics',
      href: '/analytics',
      icon: BarChart3,
      badge: null
    },
    {
      name: 'Gamification & Rewards',
      href: '/rewards',
      icon: Trophy,
      badge: 'Leaderboard'
    },
    {
      name: '60-Day Audit Archive',
      href: '/logs',
      icon: History,
      badge: '2-Month'
    },
    {
      name: 'Reports & Export Engine',
      href: '/reports',
      icon: FileSpreadsheet,
      badge: 'PDF / CSV'
    }
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800 shrink-0 hidden md:flex flex-col justify-between h-screen sticky top-0 z-30">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-0.5 shadow-glow-cyan flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-[17px] tracking-wide text-white flex items-center gap-0.5">
              Shuddhi<span className="text-cyan-400 font-extrabold">Q</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Central LoRa Matrix</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/10 text-cyan-300 border border-cyan-500/30 shadow-glow-cyan/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] rounded-full border font-mono ${
                      item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-mono text-emerald-400 font-semibold">LORA GATEWAY ACTIVE</span>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="text-[10px] text-slate-500 mt-1 font-mono">FW: v4.8.2 | 868.1 MHz</p>
      </div>
    </aside>
  );
};
