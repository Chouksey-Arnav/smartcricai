import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Animated fire SVG with bubbling, shimmering, particle effects
function FireEmoji() {
  return (
    <div className="relative w-7 h-7 flex items-center justify-center">
      {/* Particles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: i % 2 === 0 ? 4 : 3,
            height: i % 2 === 0 ? 4 : 3,
            background: i % 2 === 0 ? '#fde047' : '#fb923c',
            left: `${20 + i * 14}%`,
            top: '10%',
          }}
          animate={{
            y: [-2, -10, -16],
            opacity: [0.9, 0.5, 0],
            scale: [1, 0.8, 0.3],
          }}
          transition={{
            duration: 0.9 + i * 0.2,
            repeat: Infinity,
            delay: i * 0.22,
            ease: 'easeOut',
          }}
        />
      ))}
      {/* Main flame emoji with pulsate + shimmer */}
      <motion.span
        className="text-xl select-none"
        animate={{
          scale: [1, 1.25, 1, 1.15, 1],
          filter: [
            'brightness(1)',
            'brightness(1.5)',
            'brightness(1)',
            'brightness(1.35)',
            'brightness(1)',
          ],
        }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ display: 'inline-block', lineHeight: 1 }}
      >
        🔥
      </motion.span>
    </div>
  );
}

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
      <FireEmoji />
      <span className="font-bold text-lg">{streak}</span>
      <span className="text-sm opacity-90">day streak</span>
    </motion.div>
  );
}