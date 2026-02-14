import React from 'react';
import { Clock, Dumbbell, ChevronRight, Video, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const categoryColors = {
  batting: 'bg-blue-500',
  bowling: 'bg-red-500',
  fielding: 'bg-emerald-500',
  fitness: 'bg-purple-500'
};

const categoryBgs = {
  batting: 'bg-blue-50 border-blue-100',
  bowling: 'bg-red-50 border-red-100',
  fielding: 'bg-emerald-50 border-emerald-100',
  fitness: 'bg-purple-50 border-purple-100'
};

const levelColors = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-700'
};

export default function DrillCard({ drill, onClick, isCompleted, isPremium, isLocked }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300",
        categoryBgs[drill.category],
        isCompleted && "ring-2 ring-emerald-400",
        isLocked && "opacity-60"
      )}
    >
      {isLocked && (
        <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full p-2 shadow-lg">
          <Lock className="w-4 h-4 text-white" />
        </div>
      )}
      {isCompleted && !isLocked && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center text-white",
          categoryColors[drill.category]
        )}>
          <Dumbbell className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-800 dark:text-white">{drill.title}</h3>
            {drill.video_url && (
              <Video className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
            )}
          </div>
          
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {drill.duration_minutes} min
            </span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
              levelColors[drill.skill_level]
            )}>
              {drill.skill_level}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
              +{drill.xp_value || 50} XP
            </span>
            {isLocked && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                💎 Premium
              </span>
            )}
          </div>
        </div>
        
        <ChevronRight className="w-5 h-5 text-slate-400 self-center" />
      </div>
    </motion.div>
  );
}