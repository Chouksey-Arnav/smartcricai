import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle, Lock, Zap, X, ChevronLeft, Dumbbell, Brain, Target, Activity, Swords, ShieldCheck, Crown, Play, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { skillPathsData, getPathData, getPathProgress, getNextLevel } from '@/components/skillPaths/SkillPathsDatabase';
import Header from '@/components/common/Header';
import { quickStartWorkouts } from '@/components/fitness/QuickStartWorkouts';
import { ALL_MENTAL_ROUTINES } from '@/components/mental/MentalRoutinesData';

const CATEGORY_CONFIG = {
  batting:        { label: 'Batting Path',       Icon: Swords,      bg: 'from-blue-500 to-cyan-500',     btn: 'bg-blue-600 hover:bg-blue-700'    },
  bowling:        { label: 'Bowling Path',        Icon: Activity,    bg: 'from-green-500 to-emerald-500',  btn: 'bg-green-600 hover:bg-green-700'  },
  wicket_keeping: { label: 'Wicket Keeping Path', Icon: ShieldCheck, bg: 'from-purple-500 to-indigo-500',  btn: 'bg-purple-600 hover:bg-purple-700' },
};

// Badge icon map
const BADGE_ICON_MAP = { Target, Zap, Trophy, Crown };

// Build lookup: workout name → workout data (for navigation)
const WORKOUT_MAP = Object.fromEntries(quickStartWorkouts.map(w => [w.name, w]));

// Build lookup: mental routine title → local index (for MentalRoutinePlayer)
const MENTAL_MAP = Object.fromEntries(ALL_MENTAL_ROUTINES.map((r, i) => [r.title, i]));

const LEVEL_CONFIG = {
  beginner:     { label: 'Beginner',     color: 'emerald', border: 'border-emerald-200', bg: 'bg-emerald-50' },
  intermediate: { label: 'Intermediate', color: 'blue',    border: 'border-blue-200',    bg: 'bg-blue-50'    },
  advanced:     { label: 'Advanced',     color: 'purple',  border: 'border-purple-200',  bg: 'bg-purple-50'  },
  pro:          { label: 'Pro',          color: 'amber',   border: 'border-amber-200',   bg: 'bg-amber-50'   },
};

const ITEM_COLORS = {
  workout: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', icon: Dumbbell },
  mental:  { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', icon: Brain    },
  drill:   { bg: 'bg-blue-100 dark:bg-blue-900/30',     text: 'text-blue-700 dark:text-blue-300',     icon: Target   },
};

export default function SkillPaths() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(1);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => { try { return await base44.auth.me(); } catch { return null; } },
  });

  const guestEmail = user?.email || 'guest@smartcrick.app';

  const { data: skillPath } = useQuery({
    queryKey: ['skillPath', guestEmail],
    queryFn: async () => {
      const results = await base44.entities.SkillPath.filter({ user_email: guestEmail });
      return results[0] || null;
    },
  });

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', guestEmail],
    queryFn: async () => {
      const results = await base44.entities.UserProgress.filter({ user_email: guestEmail });
      return results[0] || null;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: premiumStatus } = useQuery({
    queryKey: ['premiumStatus', guestEmail],
    queryFn: async () => {
      const subs = await base44.entities.PremiumSubscription.filter({ user_email: guestEmail });
      return subs[0] || null;
    },
  });

  // Preload drills so drill deep-linking works from skill paths
  useQuery({
    queryKey: ['drills'],
    queryFn: () => base44.entities.Drill.list(),
    staleTime: 300000,
  });

  const isPremium = premiumStatus?.is_premium || false;
  const completedItems = skillPath?.completed_items || [];
  const currentCategory = skillPath?.category || 'batting';
  const currentLevel = skillPath?.level || 'beginner';
  const currentPathData = skillPath ? getPathData(currentCategory, currentLevel) : null;

  // Navigate to the correct activity page for a skill path item
  const handleStartItem = (item) => {
    if (item.type === 'drill') {
      // Try to find drill by name in allDrills cache for deep-linking
      const drillsCache = queryClient.getQueryData(['drills']);
      const matchedDrill = drillsCache?.find(d =>
        d.title?.toLowerCase().trim() === item.name?.toLowerCase().trim()
      );
      if (matchedDrill) {
        navigate(createPageUrl(`DrillDetail?id=${matchedDrill.id}&skillPathId=${skillPath?.id}&skillPathItemId=${item.id}`));
      } else {
        navigate(createPageUrl('Drills'));
      }
    } else if (item.type === 'mental') {
      const mentalIndex = MENTAL_MAP[item.name];
      if (mentalIndex !== undefined) {
        navigate(createPageUrl(`MentalRoutinePlayer?id=local_${mentalIndex}&skillPathId=${skillPath?.id}&skillPathItemId=${item.id}`));
      } else {
        navigate(createPageUrl('MentalCoaching'));
      }
    } else if (item.type === 'workout') {
      const workout = WORKOUT_MAP[item.name];
      if (workout) {
        // Store workout in localStorage so AIWorkout can pick it up
        const workoutPayload = {
          name: workout.name,
          exercises: workout.exercises,
          xp_value: workout.xp_value || 100,
          skillPathId: skillPath?.id,
          skillPathItemId: item.id,
        };
        localStorage.setItem('skillpath_pending_workout', JSON.stringify(workoutPayload));
        navigate(createPageUrl('AIWorkout'));
      } else {
        navigate(createPageUrl('FitnessBuilder'));
      }
    }
  };

  const createPath = useMutation({
    mutationFn: async ({ category, level }) => {
      return await base44.entities.SkillPath.create({
        user_email: guestEmail,
        category,
        level,
        completed_items: [],
        badges_earned: [],
        xp: 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skillPath'] });
      toast.success('Skill Path started!');
      setSelectedCategory(null);
    },
  });

  const completeItem = useMutation({
    mutationFn: async ({ itemId, xp, itemName }) => {
      if (!skillPath) throw new Error('No skill path');
      const alreadyDone = completedItems.includes(itemId);
      const newCompleted = alreadyDone ? [...completedItems] : [...completedItems, itemId];
      const earnedXP = alreadyDone ? 0 : xp;

      if (!alreadyDone) {
        if (userProgress?.id) {
          await base44.entities.UserProgress.update(userProgress.id, {
            total_xp: (userProgress.total_xp || 0) + earnedXP,
          });
        } else {
          await base44.entities.UserProgress.create({
            user_email: guestEmail,
            total_xp: earnedXP,
          });
        }
        const leaderboards = await base44.entities.Leaderboard.filter({ user_email: guestEmail });
        if (leaderboards.length > 0) {
          await base44.entities.Leaderboard.update(leaderboards[0].id, {
            total_xp: (leaderboards[0].total_xp || 0) + earnedXP,
          });
        }
      }
      return await base44.entities.SkillPath.update(skillPath.id, {
        completed_items: newCompleted,
        xp: (skillPath.xp || 0) + earnedXP,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skillPath'] });
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      toast.success('Item completed!');
    },
  });

  const unlockNextLevel = useMutation({
    mutationFn: async (newLevel) => {
      const badge = currentPathData?.badge?.name;
      const newBadges = [...(skillPath.badges_earned || []), badge].filter(Boolean);
      return await base44.entities.SkillPath.update(skillPath.id, {
        level: newLevel,
        badges_earned: newBadges,
        completed_items: [],
        xp: 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skillPath'] });
      setSelectedWeek(1);
      toast.success('Level unlocked!');
    },
  });

  // Listen for activity completion events dispatched by DrillDetail, MentalRoutinePlayer, AIWorkout
  React.useEffect(() => {
    const handler = (e) => {
      const { type, id, title } = e.detail || {};
      if (!skillPath || !type) return;
      // Find matching item in current path by title/name or id
      const allItems = currentPathData?.weeks.flatMap(w => w.items) || [];
      const matchedItem = allItems.find(item => {
        if (type === 'drill') return item.type === 'drill' && (item.name?.toLowerCase() === title?.toLowerCase());
        if (type === 'mental') return item.type === 'mental' && (item.name?.toLowerCase() === title?.toLowerCase());
        if (type === 'workout') return item.type === 'workout' && (item.name?.toLowerCase() === title?.toLowerCase());
        return false;
      });
      if (matchedItem && !completedItems.includes(matchedItem.id)) {
        completeItem.mutate({ itemId: matchedItem.id, xp: matchedItem.xp || 50, itemName: matchedItem.name });
      }
    };
    window.addEventListener('smartstart_item_completed', handler);
    return () => window.removeEventListener('smartstart_item_completed', handler);
  }, [skillPath, currentPathData, completedItems]);

  const resetPath = useMutation({
    mutationFn: async () => {
      if (!skillPath?.id) throw new Error('No path');
      await base44.entities.SkillPath.delete(skillPath.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skillPath'] });
      toast.success('Path reset!');
    },
  });

  const totalItems = currentPathData?.weeks.reduce((s, w) => s + w.items.length, 0) || 0;
  const progress = totalItems > 0 ? Math.round((completedItems.length / totalItems) * 100) : 0;
  const nextLevel = currentPathData ? getNextLevel(currentLevel) : null;
  const canUnlockNext = completedItems.length >= totalItems && totalItems > 0;

  // ── NO PATH: Category + Level Selection ──────────────────────────────────
  if (!skillPath) {
    const catConfig = selectedCategory ? CATEGORY_CONFIG[selectedCategory] : null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-900 dark:to-slate-950 pb-24">
        <Header title="Skill Paths" showSettings={false} />
        <div className="max-w-lg mx-auto px-4 py-6">
          {!selectedCategory ? (
            <>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Choose Your Path</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Structured training to transform your cricket skills</p>
              </motion.div>
              <div className="space-y-4">
                {Object.entries(CATEGORY_CONFIG).map(([catKey, conf], i) => (
                  <motion.button
                    key={catKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(0,0,0,0.18)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedCategory(catKey)}
                    className={`w-full bg-gradient-to-r ${conf.bg} rounded-2xl p-6 text-white text-left shadow-lg transition-shadow`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                        <conf.Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{conf.label}</h3>
                        <p className="text-white/70 text-sm">4 levels • 5 weeks each • 8 activities/week</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 mb-4 hover:text-slate-900 dark:hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">Back to Categories</span>
              </button>
              <div className={`bg-gradient-to-r ${catConfig.bg} rounded-2xl p-5 text-white mb-6`}>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                  <catConfig.Icon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-bold">{catConfig.label}</h2>
                <p className="text-white/70 text-sm">Choose your level to get started</p>
              </div>
              <div className="space-y-3">
                {Object.entries(LEVEL_CONFIG).map(([levelKey, lConf], i) => {
                  const levelData = skillPathsData[selectedCategory]?.levels[levelKey];
                  if (!levelData) return null;
                  const isLocked = levelData.isPremium && !isPremium;
                  const meetsXP = (userProgress?.total_xp || 0) >= levelData.unlockXP;
                  const canStart = !isLocked && meetsXP;

                  const handleStartEarly = () => {
                    if (confirm(`⚠️ Start Early?\n\nThis path requires ${levelData.unlockXP.toLocaleString()} XP but you only have ${(userProgress?.total_xp || 0).toLocaleString()} XP.\n\nStarting early means this path will be more challenging. Are you sure you're ready to push yourself?\n\nTap OK to start early anyway.`)) {
                      createPath.mutate({ category: selectedCategory, level: levelKey });
                    }
                  };

                  return (
                    <motion.div
                      key={levelKey}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border-2 ${lConf.border} shadow-md`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-800 dark:text-white text-lg">{lConf.label}</h3>
                            {isLocked && <Lock className="w-4 h-4 text-amber-500" />}
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{levelData.subtitle}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            {levelData.weeks.length} weeks • {levelData.totalXP} XP to earn
                          </p>
                        </div>
                        {(() => { const BadgeIcon = BADGE_ICON_MAP[levelData.badge.lucideIcon] || Trophy; return <BadgeIcon className="w-6 h-6 text-amber-500" />; })()}
                      </div>
                      {!meetsXP && !isLocked && (
                        <p className="text-xs text-amber-600 font-semibold mb-2">
                          Requires {levelData.unlockXP.toLocaleString()} XP · You have {(userProgress?.total_xp || 0).toLocaleString()} XP
                        </p>
                      )}
                      {isLocked && (
                        <p className="text-xs text-amber-600 font-semibold mb-2 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Premium required
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => canStart && createPath.mutate({ category: selectedCategory, level: levelKey })}
                          disabled={isLocked || createPath.isPending}
                          className={`flex-1 ${canStart ? catConfig.btn : isLocked ? 'bg-slate-300 cursor-not-allowed' : catConfig.btn}`}
                        >
                          {isLocked ? 'Premium Only' : createPath.isPending ? 'Starting...' : 'Start This Path'}
                        </Button>
                        {!isLocked && !meetsXP && (
                          <Button
                            onClick={handleStartEarly}
                            disabled={createPath.isPending}
                            variant="outline"
                            className="text-xs border-amber-400 text-amber-600 hover:bg-amber-50"
                          >
                            Start Early
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── ACTIVE PATH ───────────────────────────────────────────────────────────
  const catConf = CATEGORY_CONFIG[currentCategory] || CATEGORY_CONFIG.batting;
  const lConf = LEVEL_CONFIG[currentLevel] || LEVEL_CONFIG.beginner;
  const gradientBg = `bg-gradient-to-r ${catConf.bg}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-900 dark:to-slate-950 pb-24">
      <Header title="Skill Paths" showSettings={false} />
      <div className="max-w-lg mx-auto px-4 py-4">

        {/* XP Banner */}
        <div className={`${gradientBg} rounded-2xl p-4 mb-4 text-white flex items-center justify-between`}>
          <div>
            <p className="text-xs text-white/70">Your Total XP</p>
            <p className="text-3xl font-bold">{(userProgress?.total_xp || 0).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/70">Path XP</p>
            <p className="text-xl font-bold">{skillPath.xp || 0}</p>
          </div>
        </div>

        {/* Path Header */}
        <div className={`${gradientBg} rounded-2xl p-5 mb-4 text-white`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-white/70">{catConf.label}</p>
              <h2 className="text-2xl font-bold capitalize">{currentLevel}</h2>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <catConf.Icon className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="bg-white/20 rounded-full h-2.5 overflow-hidden">
            <div className="bg-white h-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs mt-1.5 text-white/70">{completedItems.length} / {totalItems} items • {progress}%</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => { if (confirm(`Exit ${catConf.label} ${currentLevel}? Progress will be lost.`)) resetPath.mutate(); }}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 text-red-600 rounded-xl text-sm font-semibold transition-colors"
          >
            <X className="w-4 h-4" />
            Exit Path
          </button>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Trophy className="w-4 h-4 text-amber-500" />
            {currentPathData?.badge.name}
          </p>
        </div>

        {/* Week Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
          {currentPathData?.weeks.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedWeek(idx + 1)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                selectedWeek === idx + 1
                  ? `${catConf.btn} text-white`
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              )}
            >
              Week {idx + 1}
            </button>
          ))}
        </div>

        {/* Week Items */}
        {currentPathData?.weeks.map((week, wIdx) =>
          selectedWeek === wIdx + 1 ? (
            <motion.div key={wIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
              <div className="bg-white dark:bg-slate-800 rounded-xl px-4 py-3 shadow-sm mb-2">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm">{week.title}</h3>
              </div>
              {week.items.map((item, itemIdx) => {
                const isDone = completedItems.includes(item.id);
                const ItemIcon = ITEM_COLORS[item.type]?.icon || Zap;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: itemIdx * 0.04 }}
                    className={`rounded-2xl border-2 p-4 transition-all ${isDone ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-700' : 'border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700'}`}
                  >
                    <div className="flex items-start gap-3">
                      {isDone
                        ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        : <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-full shrink-0 mt-0.5" />
                      }
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1', ITEM_COLORS[item.type]?.bg, ITEM_COLORS[item.type]?.text)}>
                            <ItemIcon className="w-3 h-3" />
                            {item.type}
                          </span>
                          <span className="text-xs text-amber-600 font-bold flex items-center gap-0.5">
                            <Zap className="w-3 h-3" />+{item.xp} XP
                          </span>
                        </div>
                        <h4 className={`font-semibold text-sm ${isDone ? 'text-emerald-700 dark:text-emerald-300 line-through' : 'text-slate-800 dark:text-white'}`}>
                          {item.name}
                        </h4>
                      </div>
                      <Button
                        onClick={() => handleStartItem(item)}
                        disabled={completeItem.isPending}
                        size="sm"
                        className={cn('shrink-0 text-xs flex items-center gap-1', isDone ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300' : catConf.btn)}
                      >
                        {isDone ? <><RotateCcw className="w-3 h-3" /> Start Again</> : <><Play className="w-3 h-3" /> Start</>}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : null
        )}

        {/* Unlock Next Level */}
        {canUnlockNext && nextLevel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mt-6 ${gradientBg} rounded-2xl p-6 text-white text-center`}
          >
            <Trophy className="w-12 h-12 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Path Complete!</h3>
            <p className="text-white/80 mb-4">You earned the <strong>{currentPathData?.badge.name}</strong> badge!</p>
            {skillPathsData[currentCategory]?.levels[nextLevel]?.isPremium && !isPremium ? (
              <div className="bg-white/20 rounded-xl p-4">
                <Lock className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Pro level requires Premium</p>
              </div>
            ) : (
              <Button
                onClick={() => unlockNextLevel.mutate(nextLevel)}
                disabled={unlockNextLevel.isPending}
                className="bg-white text-slate-800 hover:bg-white/90 font-bold"
              >
                {unlockNextLevel.isPending ? 'Unlocking...' : `Unlock ${LEVEL_CONFIG[nextLevel]?.label} Level`}
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}