import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Target, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

// Pre-saved drill recommendations
const preSavedDrills = [
  { id: 'straight-drive', name: 'Straight Drive Practice', category: 'batting', emoji: '🏏' },
  { id: 'front-foot-defense', name: 'Front Foot Defense', category: 'batting', emoji: '🛡️' },
  { id: 'catching-basics', name: 'Catching Basics', category: 'fielding', emoji: '🧤' },
  { id: 'shadow-batting', name: 'Shadow Batting', category: 'batting', emoji: '⚡' },
  { id: 'throwing-accuracy', name: 'Throwing Accuracy', category: 'fielding', emoji: '🎯' },
  { id: 'balance-drill', name: 'Balance & Coordination', category: 'fitness', emoji: '💪' },
  { id: 'breathing-control', name: 'Breathing Control', category: 'mental', emoji: '🧠' },
  { id: 'confidence-routine', name: 'Confidence Builder', category: 'mental', emoji: '✨' },
  { id: 'running-drills', name: 'Running Between Wickets', category: 'tactics', emoji: '🏃' },
];

function getRandomDrills(count = 3) {
  const shuffled = [...preSavedDrills].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function SmartStart({ isDarkMode }) {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  useEffect(() => {
    // Get random drills when component mounts
    setRecommendations(getRandomDrills());
  }, []);

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
      <h2 className={`font-bold mb-3 text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
        <Sparkles className="w-6 h-6 text-indigo-500" />
        Smart Start - Quick Picks
      </h2>
      <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        Handpicked drills just for you
      </p>
      <div className="space-y-2">
        {recommendations.map((rec, index) => (
          <motion.button
            key={rec.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            onClick={() => navigate(createPageUrl('Drills'))}
            className={`w-full text-left p-3 rounded-xl transition-all ${
              isDarkMode 
                ? 'bg-slate-700 hover:bg-slate-600' 
                : 'bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{rec.emoji}</span>
              <div className="flex-1">
                <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {rec.name}
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {rec.category}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}