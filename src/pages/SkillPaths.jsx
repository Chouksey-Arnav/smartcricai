import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle, Lock, Star, Zap, Target, X, ChevronRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { skillPathsData, getPathProgress } from '@/components/skillPaths/SkillPathsDatabase';
import Header from '@/components/common/Header';

export default function SkillPaths() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [showEarlyAccessDialog, setShowEarlyAccessDialog] = useState(false);
  const [earlyAccessTarget, setEarlyAccessTarget] = useState(null);

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

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.UserProgress.filter({ user_email: user.email });
      return results[0] || null;
    },
    enabled: !!user?.email,
  });

  const { data: premiumStatus } = useQuery({
    queryKey: ['premiumStatus', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const subscriptions = await base44.entities.PremiumSubscription.filter({ user_email: user.email });
      return subscriptions[0] || null;
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
      toast.success('Skill Path started! 🎯');
      setShowEarlyAccessDialog(false);
      setEarlyAccessTarget(null);
    },
  });

  const handleEarlyAccess = (level) => {
    setEarlyAccessTarget(level);
    setShowEarlyAccessDialog(true);
  };

  const confirmEarlyAccess = () => {
    if (earlyAccessTarget) {
      createPath.mutate(earlyAccessTarget);
    }
  };

  const completeItem = useMutation({
    mutationFn: async ({ itemId, xp }) => {
      const newCompleted = [...(skillPath.completed_items || []), itemId];
      const newXP = (skillPath.xp || 0) + xp;
      
      // Also update UserProgress XP
      const currentTotalXP = userProgress?.total_xp || 0;
      await base44.entities.UserProgress.update(userProgress.id, {
        total_xp: currentTotalXP + xp
      });

      // Update Leaderboard
      const leaderboards = await base44.entities.Leaderboard.filter({ user_email: user.email });
      if (leaderboards.length > 0) {
        await base44.entities.Leaderboard.update(leaderboards[0].id, {
          total_xp: currentTotalXP + xp
        });
      }
      
      return await base44.entities.SkillPath.update(skillPath.id, {
        completed_items: newCompleted,
        xp: newXP
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skillPath'] });
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      toast.success('Progress saved! 🎯');
    },
  });

  const unlockNextLevel = useMutation({
    mutationFn: async (newLevel) => {
      const currentPath = skillPathsData[skillPath.level];
      const newBadges = [...(skillPath.badges_earned || []), currentPath.badge.name];
      
      return await base44.entities.SkillPath.update(skillPath.id, {
        level: newLevel,
        badges_earned: newBadges,
        completed_items: []
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skillPath'] });
      toast.success('Level unlocked! 🏆');
    },
  });

  const resetPath = useMutation({
    mutationFn: async () => {
      return await base44.entities.SkillPath.delete(skillPath.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skillPath'] });
      toast.success('Skill path reset!');
    },
  });

  const currentPathData = skillPath ? skillPathsData[skillPath.level] : null;
  const completedItems = skillPath?.completed_items || [];
  const currentXP = skillPath?.xp || 0;

  const getNextLevel = (currentLevel) => {
    if (currentLevel === 'beginner') return 'intermediate';
    if (currentLevel === 'intermediate') return 'advanced';
    if (currentLevel === 'advanced') return 'pro';
    return null;
  };

  const canUnlockNext = () => {
    if (!skillPath || !currentPathData) return false;
    const totalItems = currentPathData.weeks.reduce((sum, week) => sum + week.items.length, 0);
    return completedItems.length >= totalItems;
  };

  // Path selection screen
  if (!skillPath) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-24 pt-6">
        <Header title="Skill Paths" showSettings={false} />
        <div className="max-w-lg mx-auto px-6 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Choose Your Path
            </h1>
            <p className="text-slate-600">
              Structured training to transform your cricket skills
            </p>
          </motion.div>

          <div className="space-y-4">
            {Object.entries(skillPathsData).map(([key, path], index) => {
              const isLocked = path.isPremium && !premiumStatus?.is_premium;
              const meetsXPRequirement = (userProgress?.total_xp || 0) >= path.unlockXP;
              const canStart = !isLocked && meetsXPRequirement;
              
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-2xl shadow-lg p-6 border-2 ${
                    canStart ? `border-${path.color}-200` : 'border-slate-200'
                  } relative`}
                >
                  {isLocked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="w-6 h-6 text-amber-500" />
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3 mb-4">
                    <div className="text-4xl">{path.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-800">{path.name}</h3>
                      <p className="text-sm text-slate-500 mb-1">{path.subtitle}</p>
                      {!meetsXPRequirement && !isLocked && (
                        <p className="text-xs text-amber-600 font-semibold">
                          Requires {path.unlockXP} XP (You have {userProgress?.total_xp || 0})
                        </p>
                      )}
                      {isLocked && <p className="text-xs text-amber-600 font-semibold">🔒 Premium Required</p>}
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className={`w-4 h-4 text-${path.color}-500`} />
                      <span className="text-sm font-semibold text-slate-700">Path Details</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">• {path.weeks.length} weeks of training</p>
                    <p className="text-xs text-slate-600 mb-2">• Total {path.totalXP} XP to earn</p>
                    <p className="text-xs text-slate-600">• Unlock: {path.badge.emoji} {path.badge.name}</p>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => canStart && createPath.mutate(key)}
                      disabled={!canStart || createPath.isPending}
                      className={`w-full ${
                        canStart 
                          ? key === 'beginner' ? 'bg-emerald-600 hover:bg-emerald-700' :
                            key === 'intermediate' ? 'bg-blue-600 hover:bg-blue-700' :
                            key === 'advanced' ? 'bg-purple-600 hover:bg-purple-700' :
                            'bg-amber-600 hover:bg-amber-700'
                          : 'bg-slate-300 cursor-not-allowed'
                      }`}
                    >
                      {isLocked ? '🔒 Premium Only' : !meetsXPRequirement ? '🔒 Need More XP' : 'Start This Path'}
                    </Button>
                    {(key === 'intermediate' || key === 'advanced') && !canStart && !isLocked && (
                      <Button
                        onClick={() => handleEarlyAccess(key)}
                        variant="outline"
                        className="w-full border-amber-500 text-amber-600 hover:bg-amber-50"
                      >
                        Access Early (Already Elite)
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Early Access Confirmation Dialog */}
          {showEarlyAccessDialog && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowEarlyAccessDialog(false)}
                className="fixed inset-0 bg-black/60 z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 w-[90%] max-w-md z-50"
              >
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">Access This Path Early?</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  This path typically requires {skillPathsData[earlyAccessTarget]?.unlockXP} XP.
                </p>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  If you are already elite at cricket and ready for this challenge, you can access it early. Are you sure you want to proceed?
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowEarlyAccessDialog(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmEarlyAccess}
                    disabled={createPath.isPending}
                    className="flex-1 bg-amber-500 hover:bg-amber-600"
                  >
                    {createPath.isPending ? 'Starting...' : 'Yes, I am Ready'}
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Active path screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-24 pt-6">
      <Header title="Skill Paths" showSettings={false} />
      <div className="max-w-lg mx-auto px-6 pt-4">
        {/* Exit Button */}
        <button
          onClick={() => {
            if (confirm(`Exit ${currentPathData.name}? All progress will be lost.`)) {
              resetPath.mutate();
            }
          }}
          className="mb-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Exit Path
        </button>

        {/* XP Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-r ${
            skillPath.level === 'beginner' ? 'from-emerald-400 to-emerald-500' :
            skillPath.level === 'intermediate' ? 'from-blue-400 to-blue-500' :
            skillPath.level === 'advanced' ? 'from-purple-400 to-purple-500' :
            'from-amber-400 to-amber-500'
          } rounded-2xl p-6 mb-6 text-white`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-90 mb-1">{currentPathData.name}</p>
              <p className="text-4xl font-bold">{currentXP} XP</p>
            </div>
            <div className="text-5xl">{currentPathData.icon}</div>
          </div>
          
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-500"
              style={{ width: `${getPathProgress(completedItems, skillPath.level)}%` }}
            />
          </div>
          <p className="text-sm mt-2 opacity-90">
            {completedItems.length} / {currentPathData.weeks.reduce((sum, w) => sum + w.items.length, 0)} completed
          </p>
        </motion.div>

        {/* Week Selection */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {currentPathData.weeks.map((week, idx) => {
        const weekColor = skillPath.level === 'beginner' ? 'emerald' :
                         skillPath.level === 'intermediate' ? 'blue' :
                         skillPath.level === 'advanced' ? 'purple' : 'amber';
        return (
          <button
            key={idx}
            onClick={() => setSelectedWeek(idx + 1)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              selectedWeek === idx + 1
                ? `bg-${weekColor}-500 text-white`
                : "bg-white border border-slate-200 text-slate-600"
            )}
          >
            Week {idx + 1}
          </button>
        );
        })}
        </div>

        {/* Week Content */}
        {currentPathData.weeks.map((week, weekIdx) => (
          selectedWeek === weekIdx + 1 && (
            <motion.div
              key={weekIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-3"
            >
              <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
                <h3 className="font-bold text-slate-800">{week.title}</h3>
              </div>

              {week.items.map((item, itemIdx) => {
                const isCompleted = completedItems.includes(item.id);
                const typeColors = {
                  batting: 'bg-blue-100 text-blue-700',
                  bowling: 'bg-green-100 text-green-700',
                  fielding: 'bg-purple-100 text-purple-700',
                  physical: 'bg-orange-100 text-orange-700',
                  mental: 'bg-pink-100 text-pink-700',
                  tactics: 'bg-amber-100 text-amber-700',
                  assessment: 'bg-red-100 text-red-700'
                };
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: itemIdx * 0.05 }}
                    className={`p-5 rounded-2xl border-2 transition-all ${
                      isCompleted
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
                      ) : (
                        <div className="w-6 h-6 border-2 border-slate-300 rounded-full shrink-0 mt-1" />
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={`font-semibold ${
                            isCompleted ? 'text-emerald-800' : 'text-slate-800'
                          }`}>
                            {item.name}
                          </h3>
                          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", typeColors[item.type])}>
                            {item.type}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-semibold text-amber-600">+{item.xp} XP</span>
                        </div>
                        {item.drillLink && (
                          <button
                            onClick={() => navigate(createPageUrl(`DrillDetail?id=${item.drillLink}`))}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          >
                            <Target className="w-3 h-3" />
                            Access Drill
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      
                      {!isCompleted && (
                        <Button
                          onClick={() => completeItem.mutate({ itemId: item.id, xp: item.xp })}
                          size="sm"
                          className={`shrink-0 ${
                            skillPath.level === 'beginner' ? 'bg-emerald-600 hover:bg-emerald-700' :
                            skillPath.level === 'intermediate' ? 'bg-blue-600 hover:bg-blue-700' :
                            skillPath.level === 'advanced' ? 'bg-purple-600 hover:bg-purple-700' :
                            'bg-amber-600 hover:bg-amber-700'
                          }`}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )
        ))}

        {/* Path Complete - Unlock Next */}
        {canUnlockNext() && getNextLevel(skillPath.level) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white text-center"
          >
            <Trophy className="w-12 h-12 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">🎉 Path Complete!</h3>
            <p className="text-amber-100 mb-4">
              You've earned the {currentPathData.badge.emoji} {currentPathData.badge.name} badge!
            </p>
            {getNextLevel(skillPath.level) && skillPathsData[getNextLevel(skillPath.level)].isPremium && !premiumStatus?.is_premium ? (
              <div className="bg-white/20 rounded-xl p-4">
                <Lock className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Pro Path requires Premium subscription</p>
              </div>
            ) : (
              <Button
                onClick={() => unlockNextLevel.mutate(getNextLevel(skillPath.level))}
                className="bg-white text-orange-600 hover:bg-amber-50 font-bold"
              >
                Unlock {skillPathsData[getNextLevel(skillPath.level)].name}
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}