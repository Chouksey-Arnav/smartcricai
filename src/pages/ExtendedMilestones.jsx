import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Star, Crown, Zap, Target, Flame, Award, ChevronLeft } from 'lucide-react';
import Header from '@/components/common/Header';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const allBadges = [
  // XP Milestones
  { name: 'First Steps', icon: '👟', requirement: { type: 'xp', threshold: 50 }, rarity: 'common', description: 'Earn your first 50 XP' },
  { name: 'Rising Star', icon: '⭐', requirement: { type: 'xp', threshold: 100 }, rarity: 'common', description: 'Reach 100 XP' },
  { name: 'Century Maker', icon: '💯', requirement: { type: 'xp', threshold: 500 }, rarity: 'rare', description: 'Hit 500 XP' },
  { name: 'XP Warrior', icon: '⚔️', requirement: { type: 'xp', threshold: 1000 }, rarity: 'rare', description: 'Reach 1000 XP' },
  { name: 'XP Legend', icon: '👑', requirement: { type: 'xp', threshold: 2500 }, rarity: 'epic', description: '2500 XP milestone' },
  { name: 'XP Champion', icon: '🏆', requirement: { type: 'xp', threshold: 5000 }, rarity: 'epic', description: '5000 XP achieved' },
  { name: 'XP Master', icon: '🎖️', requirement: { type: 'xp', threshold: 10000 }, rarity: 'legendary', description: '10000 XP reached' },
  { name: 'XP God', icon: '⚡', requirement: { type: 'xp', threshold: 25000 }, rarity: 'legendary', description: '25000 XP mastery' },
  
  // Drill Completion
  { name: 'First Drill', icon: '🎯', requirement: { type: 'drills', threshold: 1 }, rarity: 'common', description: 'Complete first drill' },
  { name: 'Practice Regular', icon: '📋', requirement: { type: 'drills', threshold: 5 }, rarity: 'common', description: 'Complete 5 drills' },
  { name: 'Drill Enthusiast', icon: '🔥', requirement: { type: 'drills', threshold: 10 }, rarity: 'rare', description: 'Complete 10 drills' },
  { name: 'Drill Master', icon: '💪', requirement: { type: 'drills', threshold: 25 }, rarity: 'rare', description: '25 drills completed' },
  { name: 'Training Beast', icon: '🦁', requirement: { type: 'drills', threshold: 50 }, rarity: 'epic', description: '50 drills completed' },
  { name: 'Drill Perfectionist', icon: '✨', requirement: { type: 'drills', threshold: 100 }, rarity: 'epic', description: '100 drills milestone' },
  { name: 'Practice Legend', icon: '🌟', requirement: { type: 'drills', threshold: 200 }, rarity: 'legendary', description: '200 drills completed' },
  
  // Streak Achievements
  { name: 'On Fire', icon: '🔥', requirement: { type: 'streak', threshold: 3 }, rarity: 'common', description: '3-day streak' },
  { name: 'Week Warrior', icon: '⏰', requirement: { type: 'streak', threshold: 7 }, rarity: 'rare', description: '7-day streak' },
  { name: 'Two Weeks Strong', icon: '💥', requirement: { type: 'streak', threshold: 14 }, rarity: 'rare', description: '14-day streak' },
  { name: 'Monthly Champion', icon: '📅', requirement: { type: 'streak', threshold: 30 }, rarity: 'epic', description: '30-day streak' },
  { name: 'Consistency King', icon: '👑', requirement: { type: 'streak', threshold: 60 }, rarity: 'epic', description: '60-day streak' },
  { name: 'Unstoppable', icon: '⚡', requirement: { type: 'streak', threshold: 100 }, rarity: 'legendary', description: '100-day streak!' },
  
  // Quiz Achievements
  { name: 'Quiz Starter', icon: '📝', requirement: { type: 'quizzes', threshold: 1 }, rarity: 'common', description: 'Complete first quiz' },
  { name: 'Knowledge Seeker', icon: '🧠', requirement: { type: 'quizzes', threshold: 5 }, rarity: 'common', description: 'Complete 5 quizzes' },
  { name: 'Quiz Expert', icon: '🎓', requirement: { type: 'quizzes', threshold: 10 }, rarity: 'rare', description: '10 quizzes completed' },
  { name: 'IQ Booster', icon: '💡', requirement: { type: 'quizzes', threshold: 20 }, rarity: 'epic', description: '20 quizzes passed' },
  { name: 'Mental Athlete', icon: '🧩', requirement: { type: 'quizzes', threshold: 50 }, rarity: 'legendary', description: '50 quizzes mastered' },
  
  // Workout Completion
  { name: 'First Workout', icon: '🏋️', requirement: { type: 'workouts', threshold: 1 }, rarity: 'common', description: 'Complete first workout' },
  { name: 'Fitness Starter', icon: '💪', requirement: { type: 'workouts', threshold: 5 }, rarity: 'common', description: 'Complete 5 workouts' },
  { name: 'Workout Warrior', icon: '🦾', requirement: { type: 'workouts', threshold: 10 }, rarity: 'rare', description: '10 workouts done' },
  { name: 'Fitness Beast', icon: '🐯', requirement: { type: 'workouts', threshold: 25 }, rarity: 'epic', description: '25 workouts completed' },
  { name: 'Gym Legend', icon: '🏆', requirement: { type: 'workouts', threshold: 50 }, rarity: 'legendary', description: '50 workouts milestone' },
  
  // Mental Training
  { name: 'Mind Starter', icon: '🧘', requirement: { type: 'mental_routines', threshold: 1 }, rarity: 'common', description: 'First mental routine' },
  { name: 'Mental Focus', icon: '🎯', requirement: { type: 'mental_routines', threshold: 5 }, rarity: 'common', description: '5 mental routines' },
  { name: 'Mental Warrior', icon: '🧠', requirement: { type: 'mental_routines', threshold: 10 }, rarity: 'rare', description: '10 mental sessions' },
  { name: 'Zen Master', icon: '☯️', requirement: { type: 'mental_routines', threshold: 25 }, rarity: 'epic', description: '25 mental routines' },
  { name: 'Mind Champion', icon: '🌟', requirement: { type: 'mental_routines', threshold: 50 }, rarity: 'legendary', description: '50 mental sessions' },
  
  // Match Tracking
  { name: 'Match Logger', icon: '📊', requirement: { type: 'matches', threshold: 1 }, rarity: 'common', description: 'Log first match' },
  { name: 'Match Tracker', icon: '📈', requirement: { type: 'matches', threshold: 5 }, rarity: 'rare', description: 'Log 5 matches' },
  { name: 'Match Analyst', icon: '🔍', requirement: { type: 'matches', threshold: 10 }, rarity: 'epic', description: 'Log 10 matches' },
  { name: 'Match Master', icon: '🎯', requirement: { type: 'matches', threshold: 25 }, rarity: 'legendary', description: 'Log 25 matches' },
  
  // Special Achievements
  { name: 'Early Bird', icon: '🌅', requirement: { type: 'special', threshold: 1 }, rarity: 'rare', description: 'Practice before 7 AM' },
  { name: 'Night Owl', icon: '🌙', requirement: { type: 'special', threshold: 1 }, rarity: 'rare', description: 'Practice after 10 PM' },
  { name: 'Weekend Warrior', icon: '🏖️', requirement: { type: 'special', threshold: 1 }, rarity: 'rare', description: 'Train on weekends' },
  { name: 'Perfect Week', icon: '⭐', requirement: { type: 'special', threshold: 1 }, rarity: 'epic', description: 'Train every day for a week' },
  { name: 'All-Rounder', icon: '🎭', requirement: { type: 'special', threshold: 1 }, rarity: 'epic', description: 'Complete all drill types' },
  { name: 'Quiz Champion', icon: '🏅', requirement: { type: 'special', threshold: 1 }, rarity: 'legendary', description: 'Score 100% on 5 quizzes' },
];

const rarityConfig = {
  common: { color: 'bg-slate-100 border-slate-300 text-slate-700', glow: 'shadow-slate-200' },
  rare: { color: 'bg-blue-100 border-blue-300 text-blue-700', glow: 'shadow-blue-200' },
  epic: { color: 'bg-purple-100 border-purple-300 text-purple-700', glow: 'shadow-purple-200' },
  legendary: { color: 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-400 text-amber-800', glow: 'shadow-amber-300' }
};

export default function ExtendedMilestones() {
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: progress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.UserProgress.filter({ user_email: user.email });
      return results[0] || null;
    },
    enabled: !!user?.email,
  });

  const { data: workoutHistory = [] } = useQuery({
    queryKey: ['workoutHistory', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.WorkoutHistory.filter({ user_email: user.email });
    },
    enabled: !!user?.email,
  });

  const { data: matches = [] } = useQuery({
    queryKey: ['matches', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.Match.filter({ user_email: user.email });
    },
    enabled: !!user?.email,
  });

  const checkBadgeEarned = (badge) => {
    if (!progress) return false;
    
    const stats = {
      xp: progress.total_xp || 0,
      drills: (progress.completed_drills || []).length,
      quizzes: (progress.completed_quizzes || []).length,
      streak: progress.current_streak || 0,
      workouts: workoutHistory.length,
      matches: matches.length,
      mental_routines: 0 // TODO: Track separately
    };
    
    return stats[badge.requirement.type] >= badge.requirement.threshold;
  };

  const earnedCount = allBadges.filter(checkBadgeEarned).length;
  const progressPercentage = (earnedCount / allBadges.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24">
      <Header title="All Milestones" showSettings={false} />

      <div className="px-6 py-4 max-w-lg mx-auto space-y-6">
        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl p-6 text-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8" />
            <div>
              <h2 className="font-bold text-xl">Badge Collection</h2>
              <p className="text-amber-100 text-sm">{earnedCount} / {allBadges.length} earned</p>
            </div>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              className="h-full bg-white rounded-full"
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Badge Grid */}
        <div className="grid grid-cols-2 gap-3">
          {allBadges.map((badge, index) => {
            const isEarned = checkBadgeEarned(badge);
            const config = rarityConfig[badge.rarity];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className={cn(
                  'p-4 rounded-2xl border-2 transition-all',
                  isEarned ? `${config.color} ${config.glow} shadow-lg` : 'bg-slate-50 border-slate-200 opacity-40 grayscale'
                )}
              >
                <div className="text-4xl mb-2">{isEarned ? badge.icon : '🔒'}</div>
                <h3 className="font-bold text-sm mb-1">{badge.name}</h3>
                <p className="text-xs opacity-75 leading-tight">{badge.description}</p>
                <div className="mt-2">
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    isEarned ? 'bg-white/50' : 'bg-slate-200 text-slate-600'
                  )}>
                    {badge.rarity}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}