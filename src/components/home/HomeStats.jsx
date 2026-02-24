import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Flame, Clock, Brain, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HomeStats({ progress }) {
  const stats = [
    {
      icon: Zap,
      label: 'Total XP',
      value: progress?.total_xp || 0,
      color: 'from-yellow-400 to-orange-500',
      textColor: 'text-yellow-700'
    },
    {
      icon: Target,
      label: 'Drills',
      value: progress?.completed_drills?.length || 0,
      color: 'from-blue-400 to-cyan-500',
      textColor: 'text-blue-700'
    },
    {
      icon: Brain,
      label: 'Mental',
      value: progress?.completed_mental_routines?.length || 0,
      color: 'from-purple-400 to-indigo-500',
      textColor: 'text-purple-700'
    },
    {
      icon: Clock,
      label: 'Minutes',
      value: progress?.total_practice_minutes || 0,
      color: 'from-emerald-400 to-teal-500',
      textColor: 'text-emerald-700'
    },
    {
      icon: Flame,
      label: 'Streak',
      value: progress?.current_streak || 0,
      color: 'from-orange-400 to-red-500',
      textColor: 'text-orange-700'
    },
    {
      icon: Trophy,
      label: 'Match IQ',
      value: progress?.match_iq || 50,
      color: 'from-amber-400 to-yellow-500',
      textColor: 'text-amber-700'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-3 gap-3"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.05 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-100 dark:border-slate-700"
        >
          <div className={cn(
            "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-2",
            stat.color
          )}>
            <stat.icon className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}