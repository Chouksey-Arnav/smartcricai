import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const categories = [
  { id: 'all', label: 'All', emoji: '🏏' },
  { id: 'batting', label: 'Batting', emoji: '🏏' },
  { id: 'bowling', label: 'Bowling', emoji: '🎯' },
  { id: 'fielding', label: 'Fielding', emoji: '🧤' },
  { id: 'fitness', label: 'Fitness', emoji: '💪' },
];

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(cat.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300",
            selected === cat.id
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          )}
        >
          <span>{cat.emoji}</span>
          <span className="text-sm font-medium">{cat.label}</span>
        </motion.button>
      ))}
    </div>
  );
}