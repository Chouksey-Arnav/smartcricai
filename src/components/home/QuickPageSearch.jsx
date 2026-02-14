import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const allPages = [
  { name: 'Home', keywords: ['home', 'dashboard', 'main'] },
  { name: 'Drills', keywords: ['drills', 'practice', 'training', 'batting', 'bowling', 'fielding'] },
  { name: 'Coach', keywords: ['coach', 'ai', 'ask', 'help', 'advice'] },
  { name: 'MentalCoaching', keywords: ['mental', 'mindfulness', 'meditation', 'focus', 'confidence'] },
  { name: 'Quizzes', keywords: ['quiz', 'test', 'knowledge', 'learn', 'rules'] },
  { name: 'FitnessBuilder', keywords: ['fitness', 'workout', 'exercise', 'strength', 'cardio'] },
  { name: 'MiniMatch', keywords: ['mini', 'match', 'scenarios', 'iq', 'decisions'] },
  { name: 'SkillPaths', keywords: ['skill', 'path', 'level', 'progression'] },
  { name: 'Leaderboard', keywords: ['leaderboard', 'ranking', 'compete', 'top'] },
  { name: 'Progress', keywords: ['progress', 'stats', 'achievements', 'badges'] },
  { name: 'Schedule', keywords: ['schedule', 'calendar', 'plan', 'activities'] },
  { name: 'MatchTracker', keywords: ['match', 'tracker', 'score', 'performance'] },
  { name: 'WhyDidIGetOut', keywords: ['dismissal', 'analysis', 'got out', 'why'] },
  { name: 'WorkoutBuilder', keywords: ['workout', 'builder', 'create', 'custom'] },
  { name: 'DrillWorkoutCreator', keywords: ['drill', 'workout', 'creator'] },
  { name: 'Goals', keywords: ['goals', 'targets', 'objectives'] },
  { name: 'ThirtyDayChallenge', keywords: ['30', 'day', 'challenge', 'architect'] },
  { name: 'Premium', keywords: ['premium', 'upgrade', 'subscription'] },
  { name: 'Profile', keywords: ['profile', 'settings', 'account'] },
  { name: 'Settings', keywords: ['settings', 'preferences', 'configuration'] },
];

export default function QuickPageSearch({ isDarkMode }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const filteredPages = query.trim()
    ? allPages.filter(page =>
        page.name.toLowerCase().includes(query.toLowerCase()) ||
        page.keywords.some(k => k.includes(query.toLowerCase()))
      ).slice(0, 5)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="relative"
    >
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
        <input
          type="search"
          placeholder="Search pages..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className={`w-full pl-12 pr-4 h-14 text-base rounded-2xl shadow-lg border-2 transition-colors ${
            isDarkMode
              ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400'
              : 'bg-white/90 backdrop-blur-md border-white/50 text-slate-800'
          }`}
        />
      </div>

      <AnimatePresence>
        {isFocused && filteredPages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute top-full mt-2 w-full rounded-2xl shadow-2xl border-2 overflow-hidden z-20 ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200'
            }`}
          >
            {filteredPages.map((page, index) => (
              <button
                key={page.name}
                onClick={() => {
                  navigate(createPageUrl(page.name));
                  setQuery('');
                }}
                className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                  isDarkMode
                    ? 'hover:bg-slate-700 text-white border-slate-700'
                    : 'hover:bg-slate-50 text-slate-800 border-slate-100'
                } ${index !== filteredPages.length - 1 ? 'border-b' : ''}`}
              >
                <span className="font-medium">{page.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}