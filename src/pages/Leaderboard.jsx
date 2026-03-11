import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Target, Brain, Flame, TrendingUp, Gem, Users, Loader2 } from 'lucide-react';
import Header from '@/components/common/Header';
import { cn } from '@/lib/utils';

const categoryTabs = [
  { id: 'xp', label: 'Total XP', icon: Gem },
  { id: 'drills', label: 'Drills', icon: Target },
  { id: 'streak', label: 'Streak', icon: Flame },
  { id: 'match_iq', label: 'Match IQ', icon: Brain },
  { id: 'weekly_minutes', label: 'Weekly Minutes', icon: TrendingUp },
];

export default function Leaderboard() {
  const [selectedTab, setSelectedTab] = useState('xp');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch {
        return null;
      }
    },
  });

  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ['leaderboard', selectedTab],
    queryFn: async () => {
      const all = await base44.entities.Leaderboard.list();
      const sortField = {
        xp: 'total_xp',
        drills: 'drills_completed',
        streak: 'highest_streak',
        match_iq: 'match_iq',
        weekly_minutes: 'weekly_minutes',
      }[selectedTab];
      
      return all.sort((a, b) => (b[sortField] || 0) - (a[sortField] || 0)).slice(0, 50);
    },
    staleTime: 60000,
  });

  const guestEmail = user?.email || 'guest@smartcrick.app';

  // Keep leaderboard username in sync with profile username
  const { data: profile } = useQuery({
    queryKey: ['profile', guestEmail],
    queryFn: async () => {
      const profiles = await base44.entities.Profile.filter({ user_email: guestEmail });
      return profiles[0] || null;
    },
    enabled: !!guestEmail,
  });

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', guestEmail],
    queryFn: async () => {
      const results = await base44.entities.UserProgress.filter({ user_email: guestEmail });
      return results[0] || null;
    },
    enabled: !!guestEmail,
    staleTime: 60000,
  });

  // Sync username AND stats to leaderboard whenever profile or progress changes
  useEffect(() => {
    if (!guestEmail) return;
    const myEntry = leaderboard.find(e => e.user_email === guestEmail);
    if (!myEntry) return;

    const updates = {};

    // Username: use profile username first, then user full_name, then email prefix
    const bestUsername = profile?.username || user?.full_name || guestEmail.split('@')[0];
    if (bestUsername && myEntry.username !== bestUsername) {
      updates.username = bestUsername;
    }

    if (userProgress) {
      const currentStreak = userProgress.current_streak || 0;
      const longestStreak = userProgress.longest_streak || 0;
      const totalXp = userProgress.total_xp || 0;
      // Always sync current_streak
      if (currentStreak !== (myEntry.current_streak || 0)) updates.current_streak = currentStreak;
      // highest_streak = max of longest_streak and current_streak
      const bestStreak = Math.max(longestStreak, currentStreak);
      if (bestStreak > (myEntry.highest_streak || 0)) updates.highest_streak = bestStreak;
      if (totalXp !== (myEntry.total_xp || 0)) updates.total_xp = totalXp;
    }

    if (Object.keys(updates).length > 0) {
      base44.entities.Leaderboard.update(myEntry.id, updates);
    }
  }, [profile?.username, user?.full_name, userProgress, leaderboard, guestEmail]);

  const userRank = leaderboard.findIndex(entry => entry.user_email === guestEmail) + 1;

  const getRankMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 pb-24">
      <Header title="Leaderboard" />

      <div className="px-6 py-6 max-w-2xl mx-auto">
        {/* User's Rank */}
        {userRank > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl p-6 text-white mb-6"
          >
            <div className="text-center">
              <Trophy className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm text-purple-100 mb-1">Your Rank</p>
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
                    ? "bg-indigo-500 text-white shadow-lg"
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
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
            <p className="text-slate-600 mt-3">Loading leaderboard...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Rankings Yet!</h3>
            <p className="text-slate-500">Start completing drills and quizzes to earn XP and climb the leaderboard.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => {
              const isCurrentUser = entry.user_email === guestEmail;
              const value = {
                xp: entry.total_xp,
                drills: entry.drills_completed,
                streak: entry.highest_streak,
                match_iq: entry.match_iq,
                weekly_minutes: entry.weekly_minutes,
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
                      {entry.username || "Anonymous"}
                    </p>
                    {isCurrentUser && (
                      <p className="text-xs text-emerald-600 font-medium">That's you!</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">{value || 0}</p>
                    <p className="text-xs text-slate-500 capitalize">{selectedTab.replace('_', ' ')}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}