import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Trophy, Target, Clock, Flame, TrendingUp, Brain, Dumbbell, 
  Star, Calendar, Zap, ArrowLeft, BarChart2, CheckCircle
} from 'lucide-react';
import Header from '@/components/common/Header';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PieChart, Pie, Cell } from 'recharts';
import { format, subDays } from 'date-fns';
import LevelProgressBar from '@/components/xp/LevelProgressBar';

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function ExpandedProgress() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('all');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try { return await base44.auth.me(); } catch { return null; }
    },
  });

  const guestEmail = user?.email || localStorage.getItem('smartcrick_guest_id') || 'guest@smartcrick.app';

  const { data: progress, isLoading } = useQuery({
    queryKey: ['userProgress', guestEmail],
    queryFn: async () => {
      const results = await base44.entities.UserProgress.filter({ user_email: guestEmail });
      return results[0] || null;
    },
  });

  const { data: leaderboard } = useQuery({
    queryKey: ['leaderboard', guestEmail],
    queryFn: async () => {
      const results = await base44.entities.Leaderboard.filter({ user_email: guestEmail });
      return results[0] || null;
    },
  });

  const { data: workoutHistory = [] } = useQuery({
    queryKey: ['workoutHistory', guestEmail],
    queryFn: async () => {
      const results = await base44.entities.Workout.filter({ user_email: guestEmail });
      return results.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
  });

  const { data: matches = [] } = useQuery({
    queryKey: ['matches', guestEmail],
    queryFn: async () => {
      return await base44.entities.Match.filter({ user_email: guestEmail });
    },
  });

  const totalXP = progress?.total_xp || 0;
  const drillsCompleted = progress?.completed_drills?.length || 0;
  const quizzesCompleted = progress?.completed_quizzes?.length || 0;
  const mentalSessions = progress?.completed_mental_routines?.length || 0;
  const practiceMinutes = progress?.total_practice_minutes || 0;
  const currentStreak = progress?.current_streak || 0;
  const longestStreak = progress?.longest_streak || 0;

  const quizScores = progress?.quiz_scores || [];
  const quizChartData = quizScores.slice(-10).map((s, i) => ({
    name: s.date ? format(new Date(s.date), 'MMM d') : `Quiz ${i + 1}`,
    score: s.score,
  }));

  const activityBreakdown = [
    { name: 'Drills', value: drillsCompleted, color: '#10b981' },
    { name: 'Quizzes', value: quizzesCompleted, color: '#6366f1' },
    { name: 'Mental', value: mentalSessions, color: '#8b5cf6' },
    { name: 'Workouts', value: workoutHistory.filter(w => w.status === 'completed').length, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  const matchStats = {
    won: matches.filter(m => m.result === 'won').length,
    lost: matches.filter(m => m.result === 'lost').length,
    tied: matches.filter(m => m.result === 'tied').length,
    total: matches.length,
  };

  const bigStats = [
    { label: 'Total XP', value: totalXP.toLocaleString(), icon: Zap, color: 'from-yellow-400 to-orange-400', textColor: 'text-yellow-600' },
    { label: 'Drills Done', value: drillsCompleted, icon: Target, color: 'from-blue-400 to-indigo-400', textColor: 'text-blue-600' },
    { label: 'Practice Hrs', value: Math.round(practiceMinutes / 60 * 10) / 10, icon: Clock, color: 'from-emerald-400 to-teal-400', textColor: 'text-emerald-600' },
    { label: 'Quizzes', value: quizzesCompleted, icon: Brain, color: 'from-purple-400 to-pink-400', textColor: 'text-purple-600' },
    { label: 'Best Streak', value: `${longestStreak}d`, icon: Flame, color: 'from-red-400 to-orange-400', textColor: 'text-red-600' },
    { label: 'Matches', value: matchStats.total, icon: Trophy, color: 'from-amber-400 to-yellow-400', textColor: 'text-amber-600' },
  ];

  const badges = progress?.badges || [];

  const badgeInfo = {
    first_steps: { label: 'First Steps', desc: 'Completed your very first drill', icon: '👟' },
    rising_star: { label: 'Rising Star', desc: 'Earned 500+ XP', icon: '⭐' },
    on_fire: { label: 'On Fire', desc: 'Maintained a 3-day streak', icon: '🔥' },
    drill_master: { label: 'Drill Master', desc: 'Completed 10+ drills', icon: '💪' },
    quiz_expert: { label: 'Quiz Expert', desc: 'Aced a quiz with 100% score', icon: '🧠' },
    week_warrior: { label: 'Week Warrior', desc: 'Practiced 7 days in a row', icon: '⏰' },
    mental_champion: { label: 'Mental Champion', desc: 'Completed 5 mental sessions', icon: '🧘' },
    'first-drill': { label: 'First Drill', desc: 'Started your training journey', icon: '🏏' },
    'streak-3': { label: '3-Day Streak', desc: 'Practiced 3 days in a row', icon: '🔥' },
    'streak-7': { label: '7-Day Streak', desc: 'A full week of practice!', icon: '💎' },
    'drill-master': { label: 'Drill Master', desc: 'Completed 10+ drills', icon: '🏆' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-950 pb-24">
      <Header title="Expanded Progress" showBack={true} onBack={() => navigate(-1)} showSettings={false} />

      <div className="px-4 py-4 max-w-2xl mx-auto space-y-6">
        {/* Level Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl">
          <h2 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" /> Level & XP Progress
          </h2>
          <LevelProgressBar totalXP={totalXP} />
          <div className="mt-4 text-center">
            <p className="text-3xl font-black text-yellow-500">{totalXP.toLocaleString()} XP</p>
            <p className="text-sm text-slate-500">Total Experience Points Earned</p>
          </div>
        </motion.div>

        {/* Big Stats Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <h2 className="font-bold text-lg text-slate-800 dark:text-white mb-3 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-500" /> Overall Stats
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {bigStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-white text-center shadow-lg`}
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 opacity-90" />
                <p className="text-2xl font-black">{stat.value}</p>
                <p className="text-xs opacity-80 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Streak Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl">
          <h2 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" /> Streak Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 text-center">
              <p className="text-4xl font-black text-orange-500">{currentStreak}</p>
              <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">Current Streak</p>
              <p className="text-xs text-slate-500 mt-1">days in a row</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 text-center">
              <p className="text-4xl font-black text-red-500">{longestStreak}</p>
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">Best Streak</p>
              <p className="text-xs text-slate-500 mt-1">personal record</p>
            </div>
          </div>
          {progress?.last_practice_date && (
            <p className="text-sm text-slate-500 text-center mt-3">
              Last practiced: {format(new Date(progress.last_practice_date), 'MMMM d, yyyy')}
            </p>
          )}
        </motion.div>

        {/* Activity Breakdown Pie Chart */}
        {activityBreakdown.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl">
            <h2 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" /> Activity Breakdown
            </h2>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={activityBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {activityBreakdown.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {activityBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{item.name}</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Quiz Score History */}
        {quizChartData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl">
            <h2 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-500" /> Quiz Score History
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={quizChartData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => `${val}%`} />
                <Bar dataKey="score" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-500 text-center mt-2">
              Average score: {quizChartData.length > 0 ? Math.round(quizChartData.reduce((s, d) => s + d.score, 0) / quizChartData.length) : 0}%
            </p>
          </motion.div>
        )}

        {/* Match Record */}
        {matchStats.total > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl">
            <h2 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> Match Record
            </h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-3 text-center">
                <p className="text-3xl font-black text-emerald-500">{matchStats.won}</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">Won</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-3 text-center">
                <p className="text-3xl font-black text-red-500">{matchStats.lost}</p>
                <p className="text-xs text-red-700 dark:text-red-300">Lost</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-3 text-center">
                <p className="text-3xl font-black text-slate-600 dark:text-slate-300">{matchStats.tied}</p>
                <p className="text-xs text-slate-500">Tied</p>
              </div>
            </div>
            {matchStats.total > 0 && (
              <div className="text-center">
                <p className="text-lg font-bold text-slate-800 dark:text-white">
                  Win Rate: {Math.round((matchStats.won / matchStats.total) * 100)}%
                </p>
                <p className="text-sm text-slate-500">{matchStats.total} total matches</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Badges Showcase */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 shadow-xl border-2 border-amber-200 dark:border-amber-800">
          <h2 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" /> Badges Earned ({badges.length})
          </h2>
          {badges.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-slate-500 dark:text-slate-400 text-sm">Complete activities to earn badges!</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {badges.map((badge, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2 border-amber-300 dark:border-amber-700 cursor-pointer"
                >
                  {badgeEmojis[badge] || '🏆'}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Practice Minutes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl">
          <h2 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-500" /> Practice Time Summary
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Total Minutes</span>
              <span className="text-2xl font-black text-emerald-600">{practiceMinutes}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Total Hours</span>
              <span className="text-2xl font-black text-blue-600">{(practiceMinutes / 60).toFixed(1)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <span className="text-slate-700 dark:text-slate-300 font-medium">This Week (min)</span>
              <span className="text-2xl font-black text-purple-600">{leaderboard?.weekly_minutes || 0}</span>
            </div>
          </div>
        </motion.div>

        {/* Completed Workouts */}
        {workoutHistory.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl">
            <h2 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-orange-500" /> Fitness Workouts
            </h2>
            <div className="space-y-2">
              {workoutHistory.slice(0, 5).map((w, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${w.status === 'completed' ? 'bg-emerald-100' : 'bg-slate-200 dark:bg-slate-600'}`}>
                    {w.status === 'completed' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Dumbbell className="w-4 h-4 text-slate-400" />}
                  </div>
                  <span className="flex-1 text-sm font-medium text-slate-800 dark:text-white truncate">{w.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${w.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300'}`}>
                    {w.status === 'completed' ? '✓ Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back Button */}
        <Button
          onClick={() => navigate(createPageUrl('Progress'))}
          variant="outline"
          className="w-full h-12"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Progress
        </Button>
      </div>
    </div>
  );
}