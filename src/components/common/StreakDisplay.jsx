import React from 'react';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function StreakDisplay({ streak = 0, className }) {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full",
        className
      )}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Flame className="w-5 h-5" />
      </motion.div>
      <span className="font-bold text-lg">{streak}</span>
      <span className="text-sm opacity-90">day streak</span>
    </motion.div>
  );
}