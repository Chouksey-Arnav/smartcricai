import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  MessageCircle,
  Target,
  Brain,
  BookOpen,
  Trophy,
  Users,
  Search,
  Zap,
  TrendingUp,
  Calendar,
  Video,
  Settings,
  TrendingDown,
  Dumbbell,
  User,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  // Top 3 - Always Fixed
  { name: '✨ Get to Know You', icon: Sparkles, page: 'GetToKnowYou', color: 'text-pink-500', highlight: true },
  { name: 'Home', icon: Home, page: 'NewHome', color: 'text-emerald-500' },
  { name: '🎯 Goals', icon: Target, page: 'Goals', color: 'text-purple-600', highlight: true },
  
  // Community & Social
  { name: 'Community', icon: Users, page: 'Social', color: 'text-blue-600' },
  { name: 'AI Coach', icon: MessageCircle, page: 'Coach', color: 'text-blue-500' },
  { name: 'Player Lookup', icon: Search, page: 'PlayerLookup', color: 'text-cyan-500' },
  { name: 'Team Mode', icon: Users, page: 'TeamMode', color: 'text-red-500' },
  
  // Training & Skills
  { name: 'Skill Paths', icon: TrendingUp, page: 'SkillPaths', color: 'text-teal-500' },
  { name: 'Drills', icon: Target, page: 'Drills', color: 'text-purple-500' },
  { name: 'Drill Workout', icon: Target, page: 'DrillWorkoutCreator', color: 'text-blue-500' },
  
  // Fitness & Workouts
  { name: 'Workout Builder', icon: Dumbbell, page: 'WorkoutBuilder', color: 'text-purple-600' },
  { name: 'AI Workout', icon: Sparkles, page: 'AIWorkout', color: 'text-pink-500' },
  { name: 'Fitness Builder', icon: Zap, page: 'FitnessBuilder', color: 'text-orange-500' },
  
  // Mental & Knowledge
  { name: 'Mental Training', icon: Brain, page: 'MentalCoaching', color: 'text-indigo-500' },
  { name: 'Mental Creator', icon: Brain, page: 'MentalTrainingCreator', color: 'text-purple-500' },
  { name: 'Quizzes', icon: BookOpen, page: 'Quizzes', color: 'text-amber-500' },
  
  // Game & Performance
  { name: 'Video Analysis', icon: Video, page: 'VideoAnalysis', color: 'text-rose-500' },
  { name: 'Match Tracker', icon: Trophy, page: 'MatchTracker', color: 'text-green-600' },
  { name: 'Mini-Match', icon: Zap, page: 'MiniMatch', color: 'text-orange-500' },
  { name: 'Schedule', icon: Calendar, page: 'Schedule', color: 'text-violet-500' },
  { name: 'Why Did I Get Out?', icon: TrendingDown, page: 'WhyDidIGetOut', color: 'text-red-600' },
  { name: 'Progress', icon: Trophy, page: 'Progress', color: 'text-pink-500' },
  { name: 'Leaderboard', icon: Trophy, page: 'Leaderboard', color: 'text-amber-500' },
  
  // Resources & Profile - Always at Bottom
  { name: 'Cricket Hub', icon: Zap, page: 'CricketHub', color: 'text-red-600' },
  { name: 'My Profile', icon: User, page: 'Profile', color: 'text-indigo-600' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Menu Button - Always Visible */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-200"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-500 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Pro Cricket AI</h2>
                <p className="text-emerald-100 text-sm">Elite Cricket Coaching</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Menu Items - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
              {menuItems.map((item, index) => (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={() => setIsOpen(false)}
                  className="group"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ x: 4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                      "hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-md active:bg-slate-100"
                    )}
                  >
                    <div className={cn("p-2 rounded-lg transition-colors duration-200", 
                      item.highlight ? "bg-gradient-to-r from-purple-100 to-pink-100 group-hover:from-purple-200 group-hover:to-pink-200" : "bg-slate-50 group-hover:bg-white", 
                      item.color)}>
                      <item.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                    </div>
                    <span className={cn("font-medium transition-colors", 
                      item.highlight ? "text-purple-700 group-hover:text-purple-900" : "text-slate-700 group-hover:text-slate-900")}>
                      {item.name}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}