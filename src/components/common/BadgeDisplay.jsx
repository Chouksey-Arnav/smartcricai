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
  'drill-master-50': {
    name: 'Drill Master Pro',
    icon: Target,
    color: 'bg-purple-100 text-purple-600',
    description: 'Completed 50 drills'
  },
  'quiz-genius': {
    name: 'Quiz Genius',
    icon: Medal,
    color: 'bg-cyan-100 text-cyan-600',
    description: 'Scored 100% on 10 quizzes'
  },
  'mental-warrior': {
    name: 'Mental Warrior',
    icon: Medal,
    color: 'bg-purple-100 text-purple-600',
    description: 'Completed 25 mental routines'
  },
  'video-pro': {
    name: 'Video Pro',
    icon: Star,
    color: 'bg-red-100 text-red-600',
    description: 'Analyzed 5 videos'
  },
  'dismissal-learner': {
    name: 'Dismissal Learner',
    icon: Award,
    color: 'bg-orange-100 text-orange-600',
    description: 'Analyzed 10 dismissals'
  },
  'scenario-expert': {
    name: 'Scenario Expert',
    icon: Zap,
    color: 'bg-amber-100 text-amber-600',
    description: 'Completed 20 scenarios'
  },
  'team-captain': {
    name: 'Team Captain',
    icon: Crown,
    color: 'bg-blue-100 text-blue-600',
    description: 'Led a team for 30 days'
  },
  'consistent-trainer': {
    name: 'Consistent Trainer',
    icon: Flame,
    color: 'bg-emerald-100 text-emerald-600',
    description: 'Practiced 100 days total'
  },
  'power-hitter': {
    name: 'Power Hitter',
    icon: Trophy,
    color: 'bg-red-100 text-red-600',
    description: 'Completed 15 batting drills'
  },
  'bowling-machine': {
    name: 'Bowling Machine',
    icon: Target,
    color: 'bg-blue-100 text-blue-600',
    description: 'Completed 15 bowling drills'
  },
  'fielding-ninja': {
    name: 'Fielding Ninja',
    icon: Zap,
    color: 'bg-gray-100 text-gray-600',
    description: 'Completed 15 fielding drills'
  },
  'fitness-freak': {
    name: 'Fitness Freak',
    icon: Flame,
    color: 'bg-lime-100 text-lime-600',
    description: 'Completed 20 fitness drills'
  },
  'early-bird': {
    name: 'Early Bird',
    icon: Star,
    color: 'bg-yellow-100 text-yellow-600',
    description: 'Practiced before 7am 10 times'
  },
  'night-owl': {
    name: 'Night Owl',
    icon: Medal,
    color: 'bg-indigo-100 text-indigo-600',
    description: 'Practiced after 8pm 10 times'
  },
  'knowledge-seeker': {
    name: 'Knowledge Seeker',
    icon: Trophy,
    color: 'bg-blue-100 text-blue-600',
    description: 'Completed all quiz categories'
  },
  'perfect-practice': {
    name: 'Perfect Practice',
    icon: Star,
    color: 'bg-pink-100 text-pink-600',
    description: 'Completed 5 drills with 100%'
  },
  'comeback-king': {
    name: 'Comeback King',
    icon: Crown,
    color: 'bg-yellow-100 text-yellow-600',
    description: 'Recovered streak after break'
  },
  'speed-demon': {
    name: 'Speed Demon',
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-600',
    description: 'Completed drills in record time'
  },
  'focused-mind': {
    name: 'Focused Mind',
    icon: Medal,
    color: 'bg-indigo-100 text-indigo-600',
    description: 'Completed all focus routines'
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