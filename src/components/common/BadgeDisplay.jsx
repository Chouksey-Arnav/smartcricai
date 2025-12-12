import React from 'react';
import { Star, Flame, Target, Award, Zap, Trophy, Crown, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';

const BADGE_CONFIG = {
  'first-drill': { 
    name: 'First Steps', 
    icon: Star, 
    color: 'bg-amber-100 text-amber-600',
    description: 'Completed your first drill'
  },
  'streak-3': { 
    name: '3-Day Streak', 
    icon: Flame, 
    color: 'bg-orange-100 text-orange-600',
    description: 'Practiced 3 days in a row'
  },
  'streak-7': { 
    name: 'Week Warrior', 
    icon: Flame, 
    color: 'bg-red-100 text-red-600',
    description: 'Practiced 7 days in a row'
  },
  'drill-master': { 
    name: 'Drill Master', 
    icon: Target, 
    color: 'bg-emerald-100 text-emerald-600',
    description: 'Completed 10 drills'
  },
  'quiz-ace': { 
    name: 'Quiz Ace', 
    icon: Award, 
    color: 'bg-purple-100 text-purple-600',
    description: 'Got 100% on a quiz'
  },
  'quick-learner': { 
    name: 'Quick Learner', 
    icon: Zap, 
    color: 'bg-blue-100 text-blue-600',
    description: 'Completed 5 quizzes'
  },
  'all-rounder': { 
    name: 'All-Rounder', 
    icon: Trophy, 
    color: 'bg-teal-100 text-teal-600',
    description: 'Practiced all categories'
  },
  'champion': { 
    name: 'Champion', 
    icon: Crown, 
    color: 'bg-yellow-100 text-yellow-600',
    description: 'Reached 100 practice minutes'
  },
  'mental-master': { 
    name: 'Mind Master', 
    icon: Medal, 
    color: 'bg-indigo-100 text-indigo-600',
    description: 'Completed 5 mental routines'
  },
};

export default function BadgeDisplay({ badges = [], size = 'md' }) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10'
  };

  if (badges.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <Trophy className="w-12 h-12 mx-auto mb-2 opacity-30" />
        <p className="text-sm">No badges earned yet. Keep practicing!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {badges.map((badgeId) => {
        const badge = BADGE_CONFIG[badgeId];
        if (!badge) return null;
        
        return (
          <div 
            key={badgeId}
            className="flex flex-col items-center gap-1"
          >
            <div className={cn(
              "rounded-full flex items-center justify-center",
              sizeClasses[size],
              badge.color
            )}>
              <badge.icon className={iconSizes[size]} />
            </div>
            <span className="text-xs font-medium text-slate-600 text-center max-w-[80px]">
              {badge.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export { BADGE_CONFIG };