import React from 'react';
import { Clock, Play, Heart, Target, RefreshCw, Sparkles, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const categoryConfig = {
  confidence: { 
    icon: Sparkles, 
    color: 'bg-amber-500',
    bgColor: 'bg-amber-50 border-amber-100'
  },
  focus: { 
    icon: Target, 
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50 border-blue-100'
  },
  recovery: { 
    icon: RefreshCw, 
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-50 border-emerald-100'
  },
  'pre-performance': { 
    icon: Heart, 
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50 border-purple-100'
  },
};

export default function MentalRoutineCard({ routine, onClick, isLocked }) {
  const config = categoryConfig[routine.category] || categoryConfig.focus;
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative p-4 rounded-2xl border-2 cursor-pointer transition-all",
        config.bgColor,
        isLocked && "opacity-60"
      )}
    >
      {isLocked && (
        <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full p-2 shadow-lg">
          <Lock className="w-4 h-4 text-white" />
        </div>
      )}
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center text-white",
          config.color
        )}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800 mb-1" style={{ color: '#1e293b' }}>{routine.title}</h3>
          <p className="text-sm mb-2 line-clamp-2" style={{ color: '#64748b' }}>
            {routine.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                {Math.round(routine.duration_seconds / 60)} min
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                +{routine.xp_value || 75} XP
              </span>
              {isLocked && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                  💎 Premium
                </span>
              )}
            </div>
            
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0",
              config.color
            )}>
              <Play className="w-4 h-4 ml-0.5" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}