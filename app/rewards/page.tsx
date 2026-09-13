'use client';

import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Gift,
  Star,
  Zap,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useDashboard } from '../../lib/store';
import confetti from 'canvas-confetti';

export default function RewardsPage() {
  const { cleaners } = useDashboard();
  const [claimedReward, setClaimedReward] = useState<string | null>(null);

  // Sort cleaners by performance points descending
  const leaderboard = [...cleaners].sort((a, b) => b.performancePoints - a.performancePoints);

  const rewardsCatalog = [
    {
      id: 'rwd-1',
      title: '6-Month Hygiene Star Excellence Bonus',
      pointsRequired: 1500,
      description: 'Cash performance bonus awarded for maintaining 95%+ consistency over 6 months.',
      badge: '6-Month Star',
      icon: Trophy
    },
    {
      id: 'rwd-2',
      title: 'Executive Shift Choice Pass',
      pointsRequired: 1000,
      description: 'Priority shift selection for upcoming month schedules.',
      badge: 'Gold Tier',
      icon: Star
    },
    {
      id: 'rwd-3',
      title: 'Annual Facility Hygiene Hero Plaque',
      pointsRequired: 1800,
      description: 'Engraved recognition plaque displayed in central terminal hall.',
      badge: 'Legend Tier',
      icon: Award
    }
  ];

  const handleClaimReward = (rewardTitle: string) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setClaimedReward(rewardTitle);
    setTimeout(() => setClaimedReward(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-purple-950/20 to-slate-900/90">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono mb-1">
              <Sparkles className="w-3.5 h-3.5" /> GAMIFICATION & 6-MONTH CONSISTENCY REWARDS
            </div>
            <h1 className="text-2xl font-extrabold text-white">Gamification & Cleaner Leaderboard</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Award points for proper and timely cleaning. Redeem rewards for consistent hygiene excellence over 6 months.
            </p>
          </div>
        </div>
      </div>

      {/* Leaderboard Top 3 Podium & Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cleaner Leaderboard Roster */}
        <div className="lg:col-span-2 glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> Facility Cleaner Leaderboard
            </h2>
            <span className="text-xs font-mono text-cyan-400">Ranked by Hygiene Points</span>
          </div>

          <div className="space-y-3">
            {leaderboard.map((cleaner, index) => {
              let rankBadgeClass = 'bg-slate-800 text-slate-400 border-slate-700';
              let rankText = `#${index + 1}`;

              if (index === 0) {
                rankBadgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-glow-amber/40';
                rankText = '🥇 #1 CHAMPION';
              } else if (index === 1) {
                rankBadgeClass = 'bg-slate-300/20 text-slate-200 border-slate-300/40';
                rankText = '🥈 #2 RUNNER UP';
              } else if (index === 2) {
                rankBadgeClass = 'bg-amber-700/20 text-amber-400 border-amber-700/40';
                rankText = '🥉 #3 BRONZE';
              }

              return (
                <div
                  key={cleaner.id}
                  className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl flex items-center justify-between gap-4 hover:border-cyan-500/30 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${rankBadgeClass}`}>
                      {rankText}
                    </span>
                    <img
                      src={cleaner.avatar}
                      alt={cleaner.name}
                      className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-white">{cleaner.name}</h4>
                      <p className="text-[11px] font-mono text-slate-400">
                        {cleaner.cleanerIdCode} | 6-Month Score: <strong className="text-emerald-400">{cleaner.sixMonthConsistencyScore}%</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-bold font-mono text-cyan-300 block">
                      {cleaner.performancePoints} Pts
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">{cleaner.tierBadge}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6-Month Reward Catalog Simulator */}
        <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-400" /> 6-Month Consistency Rewards
            </h3>
          </div>

          {claimedReward && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 text-center font-bold font-mono animate-bounce">
              🎉 Claimed: {claimedReward}!
            </div>
          )}

          <div className="space-y-3">
            {rewardsCatalog.map((reward) => {
              const Icon = reward.icon;
              return (
                <div
                  key={reward.id}
                  className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-white text-xs">{reward.title}</h4>
                      <span className="text-[10px] font-mono text-cyan-400">{reward.pointsRequired} Points Required</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-[11px]">{reward.description}</p>
                  <button
                    onClick={() => handleClaimReward(reward.title)}
                    className="w-full mt-2 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30 text-xs font-semibold transition"
                  >
                    Redeem Reward
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
