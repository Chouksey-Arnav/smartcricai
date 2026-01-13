import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Medal, Target, Brain, Flame, TrendingUp } from 'lucide-react';
import Header from '@/components/common/Header';
import { cn } from '@/lib/utils';

const categoryTabs = [
  { id: 'xp', label: 'Total XP', icon: Trophy },
  { id: 'drills', label: 'Drills', icon: Target },
  { id: 'streak', label: 'Streak', icon: Flame },
  { id: 'match_iq', label: 'Match IQ', icon: Brain },
];

export default function Leaderboard() {
  const [selectedTab, setSelectedTab] = useState('xp');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: leaderboard = [] } = useQuery({
    queryKey: ['leaderboard', selectedTab],
    queryFn: async () => {
      const all = await base44.entities.Leaderboard.list();
      const sortField = {
        xp: 'total_xp',
        drills: 'drills_completed',
        streak: 'current_streak',
        match_iq: 'match_iq'
      }[selectedTab];
      
      return all.sort((a, b) => (b[sortField] || 0) - (a[sortField] || 0)).slice(0, 50);
    },
  });

  const userRank = leaderboard.findIndex(entry => entry.user_email === user?.email) + 1;

  const getRankMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24">
      <Header title="Leaderboard" />

      <div className="px-6 py-6 max-w-2xl mx-auto">
        {/* User's Rank */}
        {userRank > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 text-white mb-6"
          >
            <div className="text-center">
              <Trophy className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm text-amber-100 mb-1">Your Rank</p>
              <h2 className="text-4xl font-bold">#{userRank}</h2>
            </div>
          </motion.div>
        )}

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
          {categoryTabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all flex items-center gap-2",
                  selectedTab === tab.id
                    ? "bg-amber-500 text-white shadow-lg"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Leaderboard List */}
        <div className="space-y-3">
          {leaderboard.map((entry, index) => {
            const isCurrentUser = entry.user_email === user?.email;
            const value = {
              xp: entry.total_xp,
              drills: entry.drills_completed,
              streak: entry.current_streak,
              match_iq: entry.match_iq
            }[selectedTab];

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "rounded-2xl p-4 flex items-center gap-4",
                  isCurrentUser
                    ? "bg-gradient-to-r from-emerald-100 to-teal-100 border-2 border-emerald-300"
                    : "bg-white border border-slate-100"
                )}
              >
                <div className="text-2xl font-bold w-12 text-center">
                  {getRankMedal(index)}
                </div>
                <div className="flex-1">
                  <p className={cn(
                    "font-bold",
                    isCurrentUser ? "text-emerald-800" : "text-slate-800"
                  )}>
                    {entry.username}
                  </p>
                  {isCurrentUser && (
                    <p className="text-xs text-emerald-600 font-medium">That's you!</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-amber-600">{value || 0}</p>
                  <p className="text-xs text-slate-500 capitalize">{selectedTab.replace('_', ' ')}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}