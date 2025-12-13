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
  Sparkles,
  Star,
  TrendingDown
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
    name: 'Mental Training', 
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

const cricketJokes = [
  "Why did the cricket team go to the bank? To get their bowler!",
  "What do you call a cricket match in winter? A snow bowl!",
  "Why don't cricketers ever get lost? They always follow the pitch!",
  "What's a cricketer's favorite type of music? Swing!",
  "Why did the batsman bring string to the match? To tie the score!",
  "What do you call a cricket player who's always cold? A chilly fielder!",
  "Why was the cricket pitch so wet? The bowlers kept throwing wides!",
  "What's a cricketer's favorite drink? Root beer - for the perfect stance!",
  "Why did the ball go to school? To get better at its spin!",
  "What do you call a dinosaur playing cricket? A Tyrannosaurus Rex-tra cover drive!",
  "Why don't cricketers tell secrets? Because too many people are in the field!",
  "What's a ghost's favorite cricket shot? The boo-ncer!",
  "Why was the cricketer always calm? They knew how to handle the pressure!",
  "What do you call a cricket ball that won't stop talking? A chatterbox!",
  "Why did the wicket keeper go to art class? To work on their catches!",
];

function getCricketJoke() {
  const today = new Date().toDateString();
  const stored = localStorage.getItem('cricket_joke_date');
  const storedJoke = localStorage.getItem('cricket_joke');
  
  if (stored === today && storedJoke) {
    return storedJoke;
  }
  
  const randomJoke = cricketJokes[Math.floor(Math.random() * cricketJokes.length)];
  localStorage.setItem('cricket_joke_date', today);
  localStorage.setItem('cricket_joke', randomJoke);
  return randomJoke;
}

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 pb-24">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 px-6 pt-8 pb-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-24 -translate-x-24" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        
        <div className="relative max-w-lg mx-auto">
          {/* Joke of the Day */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 mb-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">😄</span>
              <h3 className="font-bold text-white text-sm">Cricket Joke of the Day</h3>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">{getCricketJoke()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
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
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/25 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 shadow-lg"
            >
              <div className="text-3xl mb-1">🎯</div>
              <p className="text-2xl font-bold text-white">
                {progress?.completed_drills?.length || 0}
              </p>
              <p className="text-xs text-emerald-50 font-medium">Drills</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/25 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 shadow-lg"
            >
              <div className="text-3xl mb-1">⏱️</div>
              <p className="text-2xl font-bold text-white">
                {progress?.total_practice_minutes || 0}
              </p>
              <p className="text-xs text-emerald-50 font-medium">Minutes</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/25 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 shadow-lg"
            >
              <div className="text-3xl mb-1">🏆</div>
              <p className="text-2xl font-bold text-white">
                {progress?.badges?.length || 0}
              </p>
              <p className="text-xs text-emerald-50 font-medium">Badges</p>
            </motion.div>
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
          className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-2xl shadow-slate-300/50 p-6 border border-white/50"
        >
          <h2 className="font-bold text-slate-800 mb-5 flex items-center gap-2 text-lg">
            <Sparkles className="w-6 h-6 text-amber-500" />
            Let's Train!
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={action.name}
                to={createPageUrl(action.page)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-br from-white to-slate-50 hover:from-slate-50 hover:to-slate-100 rounded-2xl p-5 transition-all shadow-lg hover:shadow-xl border border-slate-100"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3 shadow-md`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{action.name}</h3>
                  <p className="text-xs text-slate-600">{action.description}</p>
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
          className="bg-gradient-to-br from-white to-purple-50/30 rounded-3xl shadow-2xl shadow-slate-300/50 p-6 border border-white/50"
        >
          <h2 className="font-bold text-slate-800 mb-5 text-lg flex items-center gap-2">
            <Star className="w-6 h-6 text-purple-500" />
            Explore More
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to={createPageUrl('PlayerLookup')}>
              <motion.div 
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-2xl p-5 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="text-4xl mb-2">🏏</div>
                <h3 className="font-bold text-white text-sm mb-1">Player Lookup</h3>
                <p className="text-xs text-blue-50">Search any player</p>
              </motion.div>
            </Link>
            <Link to={createPageUrl('MiniMatch')}>
              <motion.div 
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl p-5 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="font-bold text-white text-sm mb-1">Mini-Match</h3>
                <p className="text-xs text-purple-50">Test your IQ</p>
              </motion.div>
            </Link>
            <Link to={createPageUrl('SkillPaths')}>
              <motion.div 
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-2xl p-5 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="text-4xl mb-2">🎯</div>
                <h3 className="font-bold text-white text-sm mb-1">Skill Paths</h3>
                <p className="text-xs text-emerald-50">Level up now</p>
              </motion.div>
            </Link>
            <Link to={createPageUrl('TeamMode')}>
              <motion.div 
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-2xl p-5 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="text-4xl mb-2">👥</div>
                <h3 className="font-bold text-white text-sm mb-1">Team Mode</h3>
                <p className="text-xs text-amber-50">Join your team</p>
              </motion.div>
            </Link>
            <Link to={createPageUrl('WhyDidIGetOut')}>
              <motion.div 
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-2xl p-5 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="text-4xl mb-2">🔍</div>
                <h3 className="font-bold text-white text-sm mb-1">Why Got Out?</h3>
                <p className="text-xs text-red-50">Analyze dismissals</p>
              </motion.div>
            </Link>
            <Link to={createPageUrl('VideoAnalysis')}>
              <motion.div 
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-2xl p-5 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="text-4xl mb-2">🎥</div>
                <h3 className="font-bold text-white text-sm mb-1">Video Analysis</h3>
                <p className="text-xs text-rose-50">Upload & analyze</p>
              </motion.div>
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
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl shadow-2xl p-6 flex items-center justify-between hover:shadow-2xl transition-all border border-emerald-400"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Your Progress</h3>
                  <p className="text-sm text-emerald-50 font-medium">
                    {progress?.badges?.length || 0} badges • {progress?.completed_drills?.length || 0} drills
                  </p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-white" />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}