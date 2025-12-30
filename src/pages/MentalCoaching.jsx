import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Target, RefreshCw, Heart } from 'lucide-react';
import Header from '@/components/common/Header';
import MentalRoutineCard from '@/components/mental/MentalRoutineCard';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all', label: 'All', icon: Brain },
  { id: 'confidence', label: 'Confidence', icon: Sparkles },
  { id: 'focus', label: 'Focus', icon: Target },
  { id: 'recovery', label: 'Recovery', icon: RefreshCw },
  { id: 'pre-performance', label: 'Pre-Match', icon: Heart },
];

const mindfulnessQuotes = [
  "The mind is everything. What you think, you become.",
  "Stay present. The ball is in your hands right now.",
  "Breathe in confidence, breathe out doubt.",
  "Every moment is a fresh start. Reset and refocus.",
  "Your thoughts create your reality on the field.",
  "Calmness is a superpower in cricket.",
  "Focus on the process, not the outcome.",
  "Champions train their minds as hard as their bodies.",
  "In stillness, you find your greatest strength.",
  "Let go of the last ball, focus on this one.",
  "Your breath is your anchor in pressure moments.",
  "Confidence comes from preparation and presence.",
  "The space between your ears is your biggest asset.",
  "Visualize success, then make it happen.",
  "Patience and persistence break through any defense.",
  "Trust your training when doubt creeps in.",
  "Mental toughness is choosing to stay positive.",
  "Your attitude determines your altitude in cricket.",
  "Embrace the pressure - it's your chance to shine.",
  "The greatest battles are won in the mind first.",
];

function getMindfulnessQuote() {
  const today = new Date().toDateString();
  const stored = localStorage.getItem('mindfulness_quote_date');
  const storedQuote = localStorage.getItem('mindfulness_quote');
  
  if (stored === today && storedQuote) {
    return storedQuote;
  }
  
  const randomQuote = mindfulnessQuotes[Math.floor(Math.random() * mindfulnessQuotes.length)];
  localStorage.setItem('mindfulness_quote_date', today);
  localStorage.setItem('mindfulness_quote', randomQuote);
  return randomQuote;
}

export default function MentalCoaching() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: routines = [], isLoading } = useQuery({
    queryKey: ['mentalRoutines'],
    queryFn: () => base44.entities.MentalRoutine.list(),
  });

  const filteredRoutines = selectedCategory === 'all' 
    ? routines 
    : routines.filter(r => r.category === selectedCategory);

  // Sort by duration (easier/shorter first)
  const sortedRoutines = [...filteredRoutines].sort((a, b) => 
    (a.duration_seconds || 0) - (b.duration_seconds || 0)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-24">
      <Header title="Mental Training" showSettings={false} />
      
      {/* Hero */}
      <div className="px-6 py-6 max-w-lg mx-auto">
        {/* Mindfulness Quote of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-5 text-white mb-4 border-2 border-amber-300"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-sm">Mindfulness Quote of the Day</h3>
          </div>
          <p className="text-white italic text-sm font-medium leading-relaxed">
            "{getMindfulnessQuote()}"
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-6 text-white mb-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Train Your Mind</h2>
              <p className="text-purple-100 text-sm">Cricket is 90% mental!</p>
            </div>
          </div>
          <p className="text-purple-100 text-sm">
            Build confidence, stay focused, and recover quickly from setbacks with these guided exercises.
          </p>
        </motion.div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all",
                  selectedCategory === cat.id
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-200"
                    : "bg-white text-slate-600 border border-slate-200"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{cat.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Routines List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredRoutines.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Brain className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No routines found in this category.</p>
            </motion.div>
          ) : (
            sortedRoutines.map((routine, index) => (
              <motion.div
                key={routine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <MentalRoutineCard
                  routine={routine}
                  onClick={() => navigate(createPageUrl(`MentalRoutinePlayer?id=${routine.id}`))}
                />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}