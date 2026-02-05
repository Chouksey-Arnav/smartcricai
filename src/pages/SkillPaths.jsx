import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle, Lock, Star, Zap, Target, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const pathData = {
  beginner: {
    name: 'Beginner Path',
    color: 'emerald',
    icon: '🌱',
    items: [
      { id: 'stance', name: 'Perfect Your Stance', xp: 50 },
      { id: 'grip', name: 'Learn Proper Grip', xp: 50 },
      { id: 'basic-defense', name: 'Basic Defense Shot', xp: 75 },
      { id: 'straight-drive', name: 'Straight Drive Basics', xp: 75 },
      { id: 'catching-basics', name: 'Catching Fundamentals', xp: 50 },
      { id: 'confidence-routine', name: 'Confidence Building Routine', xp: 100 }
    ],
    badge: 'Beginner Champion'
  },
  intermediate: {
    name: 'Intermediate Path',
    color: 'blue',
    icon: '🎯',
    items: [
      { id: 'shot-selection', name: 'Shot Selection Skills', xp: 100 },
      { id: 'footwork', name: 'Advanced Footwork', xp: 100 },
      { id: 'bowling-rhythm', name: 'Bowling Rhythm Training', xp: 125 },
      { id: 'field-awareness', name: 'Field Awareness', xp: 75 },
      { id: 'running-smart', name: 'Smart Running Between Wickets', xp: 75 },
      { id: 'basic-tactics', name: 'Basic Match Tactics', xp: 150 }
    ],
    badge: 'Intermediate Master',
    unlockXP: 400
  },
  advanced: {
    name: 'Advanced Path',
    color: 'purple',
    icon: '⚡',
    items: [
      { id: 'match-awareness', name: 'Match Situation Awareness', xp: 150 },
      { id: 'building-innings', name: 'Building an Innings', xp: 200 },
      { id: 'mental-toughness', name: 'Mental Toughness Routines', xp: 150 },
      { id: 'advanced-drills', name: 'Advanced Skill Drills', xp: 200 },
      { id: 'pressure-practice', name: 'Pressure Situation Practice', xp: 200 },
      { id: 'leadership', name: 'Team Leadership Skills', xp: 100 }
    ],
    badge: 'Advanced Elite',
    unlockXP: 1000
  }
};

export default function SkillPaths() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: skillPath } = useQuery({
    queryKey: ['skillPath', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.SkillPath.filter({ user_email: user.email });
      return results[0] || null;
    },
    enabled: !!user?.email,
  });

  const createPath = useMutation({
    mutationFn: async (level) => {
      return await base44.entities.SkillPath.create({
        user_email: user.email,
        level: level,
        completed_items: [],
        badges_earned: [],
        xp: 0
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skillPath'] });
    },
  });

  const updatePath = useMutation({
    mutationFn: async ({ itemId, xp }) => {
      const newCompleted = [...(skillPath.completed_items || []), itemId];
      const newXP = (skillPath.xp || 0) + xp;
      
      return await base44.entities.SkillPath.update(skillPath.id, {
        completed_items: newCompleted,
        xp: newXP
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skillPath'] });
    },
  });

  const unlockNextLevel = useMutation({
    mutationFn: async (newLevel) => {
      const newBadges = [...(skillPath.badges_earned || []), pathData[skillPath.level].badge];
      
      return await base44.entities.SkillPath.update(skillPath.id, {
        level: newLevel,
        badges_earned: newBadges,
        completed_items: []
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skillPath'] });
    },
  });

  const resetPathMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.SkillPath.delete(skillPath.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skillPath'] });
      toast.success('Skill path reset! Choose a new path.');
    },
  });

  const handleStartPath = (level) => {
    createPath.mutate(level);
  };

  const handleCompleteItem = (itemId, xp) => {
    updatePath.mutate({ itemId, xp });
  };

  const handleUnlockNext = (nextLevel) => {
    unlockNextLevel.mutate(nextLevel);
  };

  const currentPathData = skillPath ? pathData[skillPath.level] : null;
  const completedItems = skillPath?.completed_items || [];
  const currentXP = skillPath?.xp || 0;

  const getNextLevel = (currentLevel) => {
    if (currentLevel === 'beginner') return 'intermediate';
    if (currentLevel === 'intermediate') return 'advanced';
    return null;
  };

  const canUnlockNext = (currentLevel) => {
    const path = pathData[currentLevel];
    const allCompleted = path.items.every(item => 
      completedItems.includes(item.id)
    );
    return allCompleted;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-24 pt-6">
      <div className="max-w-lg mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            🎯 Skill Level Paths
          </h1>
          <p className="text-slate-600">
            Your cricket learning journey with clear milestones!
          </p>
        </motion.div>

        {/* XP Display */}
        {skillPath && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-6 mb-6 text-white relative"
          >
            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset your current skill path? This will allow you to choose a new path.')) {
                  resetPathMutation.mutate();
                }
              }}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              title="Reset skill path"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm mb-1">Total XP</p>
                <p className="text-4xl font-bold">{currentXP}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8" />
              </div>
            </div>
            
            {skillPath.badges_earned?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-amber-100 text-sm mb-2">Badges Earned</p>
                <div className="flex flex-wrap gap-2">
                  {skillPath.badges_earned.map((badge, index) => (
                    <span key={index} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      ⭐ {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Path Selection or Current Path */}
        {!skillPath ? (
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-800 mb-4">Choose Your Starting Path</h2>
            {Object.entries(pathData).map(([key, path], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`bg-white rounded-2xl shadow-lg p-6 border-2 border-${path.color}-200`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{path.icon}</div>
                  <div>
                    <h3 className={`text-xl font-bold text-${path.color}-700`}>{path.name}</h3>
                    <p className="text-sm text-slate-500">{path.items.length} items to complete</p>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-4">
                  {path.items.slice(0, 3).map((item) => (
                    <li key={item.id} className="text-sm text-slate-600 flex items-center gap-2">
                      <Target className="w-4 h-4 text-slate-400" />
                      {item.name}
                    </li>
                  ))}
                  {path.items.length > 3 && (
                    <li className="text-sm text-slate-400">+ {path.items.length - 3} more...</li>
                  )}
                </ul>

                <Button
                  onClick={() => handleStartPath(key)}
                  disabled={key !== 'beginner' && createPath.isPending}
                  className={`w-full bg-${path.color}-600 hover:bg-${path.color}-700`}
                >
                  {key === 'beginner' ? 'Start Here!' : 'Choose This Path'}
                </Button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current Path */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">{currentPathData.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{currentPathData.name}</h2>
                  <p className="text-slate-500">
                    {completedItems.length} / {currentPathData.items.length} completed
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(completedItems.length / currentPathData.items.length) * 100}%` 
                    }}
                    className={`h-full bg-gradient-to-r from-${currentPathData.color}-500 to-${currentPathData.color}-600`}
                  />
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {currentPathData.items.map((item, index) => {
                  const isCompleted = completedItems.includes(item.id);
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isCompleted
                          ? 'border-emerald-200 bg-emerald-50'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                          ) : (
                            <div className="w-6 h-6 border-2 border-slate-300 rounded-full shrink-0" />
                          )}
                          <div>
                            <h3 className={`font-semibold ${
                              isCompleted ? 'text-emerald-800' : 'text-slate-800'
                            }`}>
                              {item.name}
                            </h3>
                            <p className="text-sm text-slate-500">+{item.xp} XP</p>
                          </div>
                        </div>
                        
                        {!isCompleted && (
                          <Button
                            onClick={() => handleCompleteItem(item.id, item.xp)}
                            size="sm"
                            className={`bg-${currentPathData.color}-600 hover:bg-${currentPathData.color}-700`}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Unlock Next Level */}
            {canUnlockNext(skillPath.level) && getNextLevel(skillPath.level) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white text-center"
              >
                <Trophy className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-xl font-bold mb-2">🎉 Path Complete!</h3>
                <p className="text-amber-100 mb-4">
                  You've earned the {pathData[skillPath.level].badge} badge!
                </p>
                <Button
                  onClick={() => handleUnlockNext(getNextLevel(skillPath.level))}
                  className="bg-white text-orange-600 hover:bg-amber-50"
                >
                  Unlock {pathData[getNextLevel(skillPath.level)].name}
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}