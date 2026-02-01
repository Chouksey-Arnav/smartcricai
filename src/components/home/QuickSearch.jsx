import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';

const searchablePages = [
  { name: 'Drills', keywords: ['drill', 'practice', 'training', 'batting', 'bowling'] },
  { name: 'Coach', keywords: ['coach', 'ai', 'help', 'assistant', 'chat'] },
  { name: 'MiniMatch', keywords: ['mini', 'match', 'scenario', 'game', 'play'] },
  { name: 'Quizzes', keywords: ['quiz', 'test', 'knowledge', 'learn'] },
  { name: 'MentalCoaching', keywords: ['mental', 'mind', 'meditation', 'focus', 'calm'] },
  { name: 'VideoAnalysis', keywords: ['video', 'analysis', 'technique', 'record'] },
  { name: 'Goals', keywords: ['goal', 'target', 'objective', 'plan'] },
  { name: 'Progress', keywords: ['progress', 'stats', 'achievement', 'xp'] },
  { name: 'Leaderboard', keywords: ['leaderboard', 'rank', 'top', 'compete'] },
  { name: 'SkillPaths', keywords: ['skill', 'path', 'journey', 'roadmap'] },
  { name: 'WorkoutBuilder', keywords: ['workout', 'fitness', 'exercise', 'gym'] },
  { name: 'Schedule', keywords: ['schedule', 'calendar', 'plan', 'time'] },
  { name: 'Social', keywords: ['social', 'community', 'friends', 'connect'] },
  { name: 'Profile', keywords: ['profile', 'account', 'me', 'settings'] },
  { name: 'TeamMode', keywords: ['team', 'group', 'coach', 'squad'] },
  { name: 'MatchTracker', keywords: ['match', 'tracker', 'stats', 'game'] },
  { name: 'WhyDidIGetOut', keywords: ['dismissal', 'out', 'wicket', 'mistake'] },
  { name: 'CricketHub', keywords: ['hub', 'news', 'cricket', 'world'] },
  { name: 'Premium', keywords: ['premium', 'upgrade', 'pro', 'subscription'] }
];

export default function QuickSearch() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredPages = searchablePages.filter(page => 
    page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.keywords.some(keyword => keyword.includes(searchTerm.toLowerCase()))
  );

  const handleSelect = (pageName) => {
    navigate(createPageUrl(pageName));
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Quick search: Drills, Coach, Goals..."
          className="w-full h-14 pl-12 pr-12 rounded-2xl border-2 border-slate-200 focus:border-emerald-400 focus:outline-none bg-white text-slate-800 placeholder:text-slate-400 text-sm"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setIsOpen(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && searchTerm && filteredPages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border-2 border-slate-100 max-h-64 overflow-y-auto z-50"
          >
            {filteredPages.slice(0, 6).map((page, index) => (
              <button
                key={page.name}
                onClick={() => handleSelect(page.name)}
                className="w-full px-5 py-3 text-left hover:bg-emerald-50 transition-colors border-b border-slate-100 last:border-b-0 flex items-center gap-3"
              >
                <Search className="w-4 h-4 text-emerald-500" />
                <span className="font-medium text-slate-800">{page.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && searchTerm && filteredPages.length > 0 && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}