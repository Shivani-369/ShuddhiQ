import './globals.css';
import React from 'react';
import { DashboardProvider } from '../lib/store';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

export const metadata = {
  title: 'ShuddhiQ | Central LoRa Restroom & Cleaner Management System',
  description: 'Centralized Monitoring & Management System for Restroom Hygiene, Cleaner Activity, Sensor Telemetry, and Automated Escalations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <DashboardProvider>
          <div className="flex min-h-screen bg-[#090d16] text-slate-100 relative overflow-x-hidden">
            {/* Ambient Cyber Background Grid Glow */}
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-slate-950 to-slate-950 z-0" />

            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Viewport */}
            <div className="flex-1 flex flex-col min-w-0 z-10">
              <Header />
              <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </DashboardProvider>
      </body>
    </html>
  );
}
