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
  Calendar
} from 'lucide-react';
import Header from '@/components/common/Header';
import BadgeDisplay from '@/components/common/BadgeDisplay';
import StreakDisplay from '@/components/common/StreakDisplay';
import ProgressTracker from '@/components/progress/ProgressTracker';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function Progress() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: progress, isLoading } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.UserProgress.filter({ user_email: user.email });
      return results[0] || null;
    },
    enabled: !!user?.email,
  });

  const stats = [
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
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <h2 className="font-bold text-slate-800">Your Milestones</h2>
          </div>
          
          <ProgressTracker progress={progress} />
        </motion.div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-slate-800">Your Badges</h2>
          </div>
          
          <BadgeDisplay badges={progress?.badges || []} size="md" />
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