import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp } from 'lucide-react';
import { calculateLevelInfo, getTierInfo } from './LevelSystemData';
import { cn } from '@/lib/utils';

export default function LevelProgressBar({ totalXP }) {
  const levelInfo = calculateLevelInfo(totalXP || 0);
  const tierInfo = getTierInfo(levelInfo.currentLevel);

  const tierColors = {
    emerald: 'from-emerald-400 to-teal-500',
    blue: 'from-blue-400 to-cyan-500',
    purple: 'from-purple-400 to-indigo-500',
    amber: 'from-amber-400 to-orange-500',
    rose: 'from-rose-400 to-pink-500',
    red: 'from-red-400 to-rose-500',
    indigo: 'from-indigo-400 to-purple-500',
    pink: 'from-pink-400 to-rose-500',
    violet: 'from-violet-400 to-purple-500',
    fuchsia: 'from-fuchsia-400 to-pink-500',
    yellow: 'from-yellow-400 to-amber-500'
  };

  const gradientClass = tierColors[tierInfo.color] || tierColors.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 border-2 border-slate-100 dark:border-slate-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center", gradientClass)}>
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Level {levelInfo.currentLevel}</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{levelInfo.levelName}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Tier {tierInfo.tier}</div>
          <div className={cn("text-sm font-bold", `text-${tierInfo.color}-600 dark:text-${tierInfo.color}-400`)}>{tierInfo.tierName}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-300 font-medium">Progress to Level {levelInfo.currentLevel + 1}</span>
          <span className="font-bold text-slate-800 dark:text-white">{Math.floor(levelInfo.progressPercent)}%</span>
        </div>
        <div className="relative h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelInfo.progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn("h-full bg-gradient-to-r rounded-full relative", gradientClass)}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{totalXP?.toLocaleString() || 0} XP</span>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{levelInfo.xpToNextLevel.toLocaleString()} XP to go</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total XP</p>
          <p className="text-lg font-bold text-slate-800 dark:text-white">{totalXP?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Next Level</p>
          <p className="text-lg font-bold text-slate-800 dark:text-white">{levelInfo.nextLevelXP.toLocaleString()}</p>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </motion.div>
  );
}