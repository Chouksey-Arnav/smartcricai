import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Target, Brain, Dumbbell, BookOpen, Trophy, Video, ChevronRight } from 'lucide-react';

const smartStartActions = [
  { icon: Target, label: 'Start a Drill', page: 'Drills', color: 'from-blue-500 to-purple-500', emoji: '🎯' },
  { icon: Brain, label: 'Mental Session', page: 'MentalCoaching', color: 'from-purple-500 to-indigo-500', emoji: '🧠' },
  { icon: Dumbbell, label: 'Fitness Workout', page: 'FitnessBuilder', color: 'from-orange-500 to-red-500', emoji: '💪' },
  { icon: BookOpen, label: 'Take a Quiz', page: 'Quizzes', color: 'from-amber-500 to-yellow-500', emoji: '📚' },
  { icon: Trophy, label: 'Mini-Match', page: 'MiniMatch', color: 'from-pink-500 to-rose-500', emoji: '⚡' },
  { icon: Video, label: 'Find Drill Videos', page: 'DrillYouTubeFinder', color: 'from-red-500 to-pink-500', emoji: '🎥' },
];

export default function SmartStart({ isDarkMode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className={`rounded-3xl shadow-2xl p-6 border ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700' 
          : 'bg-gradient-to-br from-white to-indigo-50/30 border-white/50'
      }`}
    >
      <h2 className={`font-bold mb-5 text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
        <Target className="w-6 h-6 text-indigo-500" />
        Smart Start
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {smartStartActions.map((action, index) => (
          <Link key={action.page} to={createPageUrl(action.page)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-gradient-to-r ${action.color} rounded-2xl p-4 transition-all shadow-lg hover:shadow-xl`}
            >
              <div className="text-3xl mb-2">{action.emoji}</div>
              <p className="font-bold text-white text-sm">{action.label}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}