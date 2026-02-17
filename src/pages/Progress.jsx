import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Clock, 
  Flame,
  TrendingUp,
  Calendar,
  Gem,
  BarChart2,
  ChevronRight
} from 'lucide-react';
import Header from '@/components/common/Header';
import BadgeDisplay from '@/components/common/BadgeDisplay';
import StreakDisplay from '@/components/common/StreakDisplay';
import ProgressTracker from '@/components/progress/ProgressTracker';
import LevelProgressBar from '@/components/xp/LevelProgressBar';
import LevelUpNotification from '@/components/xp/LevelUpNotification';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Progress() {
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

  const { data: progress, isLoading } = useQuery({
    queryKey: ['userProgress', user?.email || 'guest'],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.UserProgress.filter({ user_email: user.email });
      return results[0] || null;
    },
    enabled: !!user?.email,
  });

  const stats = [
    {
      label: 'Total XP',
      value: progress?.total_xp || 0,
      icon: Gem,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Drills Completed',
      value: progress?.completed_drills?.length || 0,
      icon: Target,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Practice Minutes',
      value: progress?.total_practice_minutes || 0,
      icon: Clock,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Quizzes Taken',
      value: progress?.completed_quizzes?.length || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Longest Streak',
      value: progress?.longest_streak || 0,
      icon: Flame,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-24">
      <Header title="Your Progress" showSettings={false} />
      
      <div className="px-6 py-4 max-w-lg mx-auto space-y-6">
        {/* Level Progress Bar */}
        <LevelProgressBar totalXP={progress?.total_xp || 0} />
        <LevelUpNotification totalXP={progress?.total_xp || 0} />

        {/* Streak Header */}
        {(progress?.current_streak || 0) > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <StreakDisplay streak={progress.current_streak} />
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "p-4 rounded-2xl",
                stat.bgColor
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3",
                stat.color
              )}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Leaderboard Link */}
        <Link to={createPageUrl('Leaderboard')}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg p-5 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Global Leaderboard</h3>
                <p className="text-indigo-100 text-sm">See where you rank!</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-white" />
          </motion.div>
        </Link>

        {/* Last Practice */}
        {progress?.last_practice_date && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Last Practice</p>
                <p className="font-semibold text-slate-800">
                  {format(new Date(progress.last_practice_date), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Interactive Progress Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <h2 className="font-bold text-slate-800">Your Milestones</h2>
            </div>
            <Link to={createPageUrl('ExtendedMilestones')}>
              <button className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
          
          <ProgressTracker progress={progress} />
        </motion.div>

        {/* Earned Badges Section - 3D Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-xl border-2 border-amber-200 p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-200/30 to-transparent rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-600" />
                <h2 className="font-bold text-slate-800 text-lg">Earned Badges</h2>
              </div>
              <Link to={createPageUrl('ExtendedMilestones')}>
                <button className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            
            {(progress?.badges || []).length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-3 bg-amber-100 rounded-2xl flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-amber-400" />
                </div>
                <p className="text-slate-600 text-sm">Complete challenges to earn badges!</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {(progress?.badges || []).slice(0, 8).map((badge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div className="w-full aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl shadow-lg flex items-center justify-center text-3xl transform transition-all group-hover:scale-110 group-hover:shadow-2xl group-hover:rotate-6 border-2 border-amber-300">
                      {badge === 'first_steps' && '👟'}
                      {badge === 'rising_star' && '⭐'}
                      {badge === 'on_fire' && '🔥'}
                      {badge === 'drill_master' && '💪'}
                      {badge === 'quiz_expert' && '🧠'}
                      {badge === 'week_warrior' && '⏰'}
                      {!['first_steps', 'rising_star', 'on_fire', 'drill_master', 'quiz_expert', 'week_warrior'].includes(badge) && '🏆'}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Quiz Scores */}
        {progress?.quiz_scores?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
          >
            <h2 className="font-bold text-slate-800 mb-4">Recent Quiz Scores</h2>
            <div className="space-y-3">
              {progress.quiz_scores.slice(-5).reverse().map((score, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                >
                  <span className="text-sm text-slate-600">
                    {format(new Date(score.date), 'MMM d')}
                  </span>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    score.score >= 80 ? "bg-emerald-100 text-emerald-700" :
                    score.score >= 50 ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  )}>
                    {score.score}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!progress && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Trophy className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Start Your Journey!
            </h3>
            <p className="text-slate-500">
              Complete drills and quizzes to track your progress and earn badges.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}