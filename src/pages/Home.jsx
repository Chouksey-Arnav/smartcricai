import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Target, 
  Brain, 
  Trophy, 
  Flame,
  BookOpen,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import StreakDisplay from '@/components/common/StreakDisplay';
import DailyFact from '@/components/daily/DailyFact';

const quickActions = [
  { 
    name: 'Ask Coach', 
    icon: MessageCircle, 
    color: 'bg-emerald-500',
    page: 'Coach',
    description: 'Get instant cricket tips'
  },
  { 
    name: 'Practice', 
    icon: Target, 
    color: 'bg-blue-500',
    page: 'Drills',
    description: 'Start a drill session'
  },
  { 
    name: 'Mind Training', 
    icon: Brain, 
    color: 'bg-purple-500',
    page: 'MentalCoaching',
    description: 'Build mental strength'
  },
  { 
    name: 'Quiz', 
    icon: BookOpen, 
    color: 'bg-amber-500',
    page: 'Quizzes',
    description: 'Test your knowledge'
  },
];

export default function Home() {
  const [greeting, setGreeting] = useState('');
  
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

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const displayName = progress?.display_name || user?.full_name?.split(' ')[0] || 'Champ';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 pb-24">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-500 px-6 pt-8 pb-16">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
        
        <div className="relative max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <p className="text-emerald-100 text-sm">{greeting}!</p>
              <h1 className="text-2xl font-bold text-white">Hey, {displayName} 👋</h1>
            </div>
            {(progress?.current_streak || 0) > 0 && (
              <StreakDisplay streak={progress.current_streak} />
            )}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3"
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">
                {progress?.completed_drills?.length || 0}
              </p>
              <p className="text-xs text-emerald-100">Drills Done</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">
                {progress?.total_practice_minutes || 0}
              </p>
              <p className="text-xs text-emerald-100">Minutes</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">
                {progress?.badges?.length || 0}
              </p>
              <p className="text-xs text-emerald-100">Badges</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-8 max-w-lg mx-auto space-y-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-4"
        >
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Let's Train!
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Link
                key={action.name}
                to={createPageUrl(action.page)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-slate-50 hover:bg-slate-100 rounded-xl p-4 transition-colors"
                >
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 text-sm">{action.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Daily Cricket Fact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DailyFact />
        </motion.div>

        {/* New Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl shadow-lg p-4"
        >
          <h2 className="font-semibold text-slate-800 mb-4">Explore More</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to={createPageUrl('PlayerLookup')}>
              <div className="bg-blue-50 hover:bg-blue-100 rounded-xl p-4 transition-colors">
                <div className="text-3xl mb-2">🏏</div>
                <h3 className="font-semibold text-slate-800 text-sm">Player Lookup</h3>
                <p className="text-xs text-slate-500 mt-0.5">Learn from pros</p>
              </div>
            </Link>
            <Link to={createPageUrl('MiniMatch')}>
              <div className="bg-purple-50 hover:bg-purple-100 rounded-xl p-4 transition-colors">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold text-slate-800 text-sm">Mini-Match</h3>
                <p className="text-xs text-slate-500 mt-0.5">Game situations</p>
              </div>
            </Link>
            <Link to={createPageUrl('SkillPaths')}>
              <div className="bg-emerald-50 hover:bg-emerald-100 rounded-xl p-4 transition-colors">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold text-slate-800 text-sm">Skill Paths</h3>
                <p className="text-xs text-slate-500 mt-0.5">Level up journey</p>
              </div>
            </Link>
            <Link to={createPageUrl('TeamMode')}>
              <div className="bg-amber-50 hover:bg-amber-100 rounded-xl p-4 transition-colors">
                <div className="text-3xl mb-2">👥</div>
                <h3 className="font-semibold text-slate-800 text-sm">Team Mode</h3>
                <p className="text-xs text-slate-500 mt-0.5">Connect & train</p>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link to={createPageUrl('Progress')}>
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-4 flex items-center justify-between hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Your Progress</h3>
                  <p className="text-sm text-slate-500">
                    {progress?.badges?.length || 0} badges earned
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}