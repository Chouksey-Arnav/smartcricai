import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Lock, Star } from 'lucide-react';

export default function ProgressTracker({ progress, milestones }) {
  const completedCount = progress?.completed_drills?.length || 0;
  const totalMinutes = progress?.total_practice_minutes || 0;
  const quizzesTaken = progress?.completed_quizzes?.length || 0;

  const defaultMilestones = [
    { id: 1, name: 'First Drill', requirement: 1, type: 'drills', reward: '🎯 Starter Badge' },
    { id: 2, name: '5 Drills Complete', requirement: 5, type: 'drills', reward: '⭐ Dedicated Badge' },
    { id: 3, name: '10 Drills Master', requirement: 10, type: 'drills', reward: '🏆 Practice Pro Badge' },
    { id: 4, name: '30 Minutes Practice', requirement: 30, type: 'minutes', reward: '⏱️ Time Keeper Badge' },
    { id: 5, name: '1 Hour Training', requirement: 60, type: 'minutes', reward: '💪 Warrior Badge' },
    { id: 6, name: '5 Quizzes Done', requirement: 5, type: 'quizzes', reward: '🧠 Brain Power Badge' },
    { id: 7, name: '20 Drills Champion', requirement: 20, type: 'drills', reward: '🌟 Champion Badge' },
    { id: 8, name: '3 Hours Total', requirement: 180, type: 'minutes', reward: '🔥 Dedication Badge' },
    { id: 9, name: '10 Quiz Expert', requirement: 10, type: 'quizzes', reward: '📚 Knowledge Master' },
    { id: 10, name: '50 Drills Legend', requirement: 50, type: 'drills', reward: '👑 Legend Badge' },
  ];

  const milestonesToShow = milestones || defaultMilestones;

  const getMilestoneProgress = (milestone) => {
    let current = 0;
    if (milestone.type === 'drills') current = completedCount;
    if (milestone.type === 'minutes') current = totalMinutes;
    if (milestone.type === 'quizzes') current = quizzesTaken;
    
    const isCompleted = current >= milestone.requirement;
    const isLocked = current < milestone.requirement * 0.5;
    const percentage = Math.min((current / milestone.requirement) * 100, 100);
    
    return { isCompleted, isLocked, percentage, current };
  };

  return (
    <div className="space-y-4">
      {milestonesToShow.map((milestone, index) => {
        const { isCompleted, isLocked, percentage, current } = getMilestoneProgress(milestone);
        
        return (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-2xl border-2 transition-all ${
              isCompleted
                ? 'bg-emerald-50 border-emerald-200'
                : isLocked
                ? 'bg-slate-50 border-slate-200 opacity-60'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              {isCompleted ? (
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : isLocked ? (
                <Lock className="w-6 h-6 text-slate-400 shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
              )}
              
              <div className="flex-1">
                <h3 className={`font-semibold ${
                  isCompleted ? 'text-emerald-800' : isLocked ? 'text-slate-500' : 'text-blue-800'
                }`}>
                  {milestone.name}
                </h3>
                <p className={`text-sm ${
                  isCompleted ? 'text-emerald-600' : isLocked ? 'text-slate-400' : 'text-blue-600'
                }`}>
                  {current} / {milestone.requirement} {milestone.type}
                </p>
              </div>

              {!isLocked && (
                <div className="text-right">
                  <div className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Reward
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">{milestone.reward}</div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {!isCompleted && !isLocked && (
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                />
              </div>
            )}

            {isCompleted && (
              <div className="mt-2 px-3 py-1 bg-emerald-100 rounded-full text-xs font-semibold text-emerald-700 inline-block">
                ✓ Completed!
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}