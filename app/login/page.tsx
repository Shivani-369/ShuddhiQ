'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { useDashboard } from '../../lib/store';

export default function LoginPage() {
  const { loginAdmin } = useDashboard();
  const router = useRouter();

  const [email, setEmail] = useState<string>('admin@airport-hygiene.gov');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      loginAdmin(email);
      setIsLoading(false);
      router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center">
      <div className="w-full max-w-md glass-panel bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />

        {/* Logo & Title */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-0.5 shadow-glow-cyan">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Zap className="w-7 h-7 text-cyan-400 animate-pulse" />
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Admin Authentication
          </h2>
          <p className="text-xs text-slate-400">
            Centralized Restroom Hygiene & LoRa Telemetry Monitoring Command Portal
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Admin Email Identity
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input pl-10 pr-4 py-2.5 rounded-2xl text-xs font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Secure Security Credential / PIN
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-10 pr-4 py-2.5 rounded-2xl text-xs font-mono"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-cyan-500 rounded" />
              <span>Remember authenticated session</span>
            </label>
            <span className="text-cyan-400 font-mono">LoRa Layer Protected</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-emerald-600 to-cyan-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold text-xs tracking-wide shadow-glow-cyan/30 transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="font-mono animate-pulse">Authenticating Central Credentials...</span>
            ) : (
              <>
                <span>Access Central Command Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 text-center text-[10px] text-slate-500 font-mono">
          Confidential Facility Infrastructure &bull; Central Control Node #01
        </div>
      </div>
    </div>
  );
}
