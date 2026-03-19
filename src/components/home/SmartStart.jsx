import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Zap, Brain, Target, Dumbbell, Lock, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quickStartWorkouts } from '@/components/fitness/QuickStartWorkouts';
import { ALL_MENTAL_ROUTINES } from '@/components/mental/MentalRoutinesData';
import toast from 'react-hot-toast';

export default function SmartStart({ isDarkMode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [recommendations, setRecommendations] = useState([]);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try { return await base44.auth.me(); } catch { return null; }
    },
  });

  const guestEmail = user?.email || 'guest@smartcrick.app';

  const { data: premiumStatus } = useQuery({
    queryKey: ['premiumStatus', guestEmail],
    queryFn: async () => {
      const subs = await base44.entities.PremiumSubscription.filter({ user_email: guestEmail });
      return subs[0] || null;
    },
  });

  const isPremium = premiumStatus?.is_premium || false;

  const { data: drills = [] } = useQuery({
    queryKey: ['drills'],
    queryFn: () => base44.entities.Drill.list(),
  });

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', guestEmail],
    queryFn: async () => {
      const results = await base44.entities.UserProgress.filter({ user_email: guestEmail });
      return results[0] || null;
    },
    staleTime: 10000,
  });

  const { data: completedWorkoutNames = [] } = useQuery({
    queryKey: ['completedWorkouts', guestEmail],
    queryFn: async () => {
      const workouts = await base44.entities.Workout.filter({ user_email: guestEmail, status: 'completed' });
      return workouts.map(w => w.name);
    },
    staleTime: 30000,
  });

  const startWorkoutMutation = useMutation({
    mutationFn: async (workout) => {
      // Build interleaved drills + rest blocks (same structure as FitnessBuilder)
      const drills = [];
      (workout.exercises || []).forEach(ex => {
        const sets = ex.sets || 3;
        const restSec = ex.rest_seconds || 60;
        for (let s = 1; s <= sets; s++) {
          drills.push({
            drill_id: `fitness_${Math.random().toString(36).substr(2, 9)}_set${s}`,
            drill_title: `${ex.name} — Set ${s}`,
            sets: 1,
            reps: ex.reps || 10,
            completed_sets: 0,
            type: 'exercise',
            category: 'fitness',
            instructions: ex.instructions || '',
            rest_seconds: restSec,
          });
          if (s < sets) {
            drills.push({
              drill_id: `rest_${Math.random().toString(36).substr(2, 9)}_${s}`,
              drill_title: 'Rest Period',
              sets: 1,
              reps: restSec,
              completed_sets: 0,
              type: 'rest',
              rest_seconds: restSec,
            });
          }
        }
      });
      localStorage.removeItem('workoutProgress');
      const newWorkout = await base44.entities.Workout.create({
        user_email: guestEmail,
        name: workout.name,
        drills,
        status: 'not_started',
        xp_value: workout.xp_value || 100
      });
      localStorage.setItem('fitnessbuilder_new_workout_id', newWorkout.id);
      return newWorkout;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userGeneratedWorkouts'] });
      toast.success('Workout saved! Starting now...');
      navigate(createPageUrl('AIWorkout'));
    },
  });

  // Local mental routines with stable IDs
  const localMentalRoutines = useMemo(() =>
    ALL_MENTAL_ROUTINES.map((r, i) => ({ ...r, id: `local_${i}` })),
    []
  );

  useEffect(() => {
    if (drills.length === 0 && localMentalRoutines.length === 0) return;

    const today = new Date().toDateString();
    // Per-user + per-date seed so each user gets unique picks
    const seedStr = today + guestEmail;
    const dayHash = seedStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

    const stablePick = (arr, count) => {
      if (arr.length === 0) return [];
      const shuffled = [...arr];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = (dayHash * (i + 1)) % shuffled.length;
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, count);
    };

    const availableDrills = drills.filter(d => !d.is_premium || isPremium);
    const availableRoutines = localMentalRoutines.filter(m => !m.is_premium || isPremium);
    const availableWorkouts = quickStartWorkouts.filter(w => !w.is_premium || isPremium);

    const countOptions = [3, 4, 5];
    const totalItems = countOptions[dayHash % 3];
    const mentalCount = totalItems === 5 ? 2 : 1;
    const drillCount = totalItems === 3 ? 1 : 2;

    const randomDrills = stablePick(availableDrills, drillCount);
    const randomMental = stablePick(availableRoutines, mentalCount);
    const randomWorkout = availableWorkouts.length > 0
      ? availableWorkouts[dayHash % availableWorkouts.length]
      : null;

    const recs = [];

    randomMental.forEach(m => recs.push({
      type: 'mental', id: m.id, title: m.title,
      category: m.category?.replace('-', ' ') || 'Mental Training',
      label: 'Mental Session', icon: 'brain',
    }));

    randomDrills.forEach(d => recs.push({
      type: 'drill', id: d.id, title: d.title,
      category: d.category, label: 'Cricket Drill', icon: 'target'
    }));

    if (randomWorkout) {
      recs.push({
        type: 'workout', id: randomWorkout.name, title: randomWorkout.name,
        category: `${randomWorkout.target} • ${randomWorkout.level}`,
        label: 'Featured Workout', icon: 'dumbbell',
        workoutData: randomWorkout,
        isPremium: !!randomWorkout.is_premium
      });
    }

    setRecommendations(recs);

    // Daily Smart Start notification (once per day per user)
    const notifKey = `smartstart_notif_${today}_${guestEmail}`;
    if (!localStorage.getItem(notifKey) && recs.length > 0) {
      localStorage.setItem(notifKey, '1');
      const itemList = recs.map(r => r.title).join(', ');
      base44.entities.Notification.create({
        user_email: guestEmail,
        type: 'schedule',
        title: 'Smart Start: New Personalised Picks!',
        message: `Today's personalised set: ${itemList}`,
      }).catch(() => {});
    }
  }, [drills, localMentalRoutines, isPremium, guestEmail]);

  // Track that user started this item from today's SmartStart
  const getStartedKey = () => `smartstart_started_${new Date().toDateString()}_${guestEmail}`;

  const markStarted = (item) => {
    const key = getStartedKey();
    const started = JSON.parse(localStorage.getItem(key) || '[]');
    const itemKey = `${item.type}_${item.id}`;
    if (!started.includes(itemKey)) {
      started.push(itemKey);
      localStorage.setItem(key, JSON.stringify(started));
    }
  };

  // Track completed items in state so UI re-renders immediately on completion
  const [completedKeys, setCompletedKeys] = useState([]);

  // Sync completedKeys from localStorage whenever guestEmail is resolved
  useEffect(() => {
    const today = new Date().toDateString();
    const key = `smartstart_completed_${today}_${guestEmail}`;
    setCompletedKeys(JSON.parse(localStorage.getItem(key) || '[]'));
  }, [guestEmail]);

  // Check if item was completed today — reads from state for instant re-render
  const isCompleted = (item) => {
    const itemKey = `${item.type}_${item.id}`;
    return completedKeys.includes(itemKey);
  };

  // Mark item as completed for today in localStorage (called by activity pages via a global event)
  useEffect(() => {
    const handler = (e) => {
      const { type, id } = e.detail || {};
      if (!type) return;
      const today = new Date().toDateString();
      const completedKey = `smartstart_completed_${today}_${guestEmail}`;
      const completedToday = JSON.parse(localStorage.getItem(completedKey) || '[]');
      const itemKey = `${type}_${id}`;
      if (!completedToday.includes(itemKey)) {
        completedToday.push(itemKey);
        localStorage.setItem(completedKey, JSON.stringify(completedToday));
        setCompletedKeys([...completedToday]);
      }
    };
    window.addEventListener('smartstart_item_completed', handler);
    return () => window.removeEventListener('smartstart_item_completed', handler);
  }, [guestEmail]);

  const handleClick = (item) => {
    markStarted(item);
    if (item.type === 'drill') {
      navigate(createPageUrl(`DrillDetail?id=${item.id}`));
    } else if (item.type === 'mental') {
      navigate(createPageUrl(`MentalRoutinePlayer?id=${item.id}`));
    } else if (item.type === 'workout') {
      if (item.isPremium && !isPremium) {
        toast('This workout requires Premium! Upgrade to access.', { duration: 3000 });
        return;
      }
      startWorkoutMutation.mutate(item.workoutData);
    }
  };

  const getIcon = (item) => {
    if (item.icon === 'brain') return <Brain className="w-5 h-5 text-purple-200 flex-shrink-0" />;
    if (item.icon === 'target') return <Target className="w-5 h-5 text-blue-200 flex-shrink-0" />;
    if (item.icon === 'dumbbell') return <Dumbbell className="w-5 h-5 text-orange-200 flex-shrink-0" />;
    return <Zap className="w-5 h-5 text-yellow-200 flex-shrink-0" />;
  };

  const getLabelColor = (item) => {
    if (item.icon === 'brain') return 'text-purple-200';
    if (item.icon === 'target') return 'text-blue-200';
    if (item.icon === 'dumbbell') return 'text-orange-200';
    return 'text-yellow-200';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`rounded-3xl shadow-2xl p-6 border mt-6 ${
        isDarkMode
          ? 'bg-gradient-to-br from-orange-600 to-red-600 border-orange-500'
          : 'bg-gradient-to-br from-orange-500 to-red-500 border-orange-400'
      }`}
    >
      <h2 className="font-bold mb-1 text-lg flex items-center gap-2 text-white">
        <Zap className="w-6 h-6 text-yellow-300" />
        <span>Smart Start</span>
      </h2>
      <p className="text-xs mb-4 text-orange-100">
        Personalised picks just for today — updated daily
      </p>
      <div className="space-y-2">
        {recommendations.map((rec, index) => {
          const done = isCompleted(rec);
          return (
            <motion.button
              key={`${rec.type}-${rec.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => handleClick(rec)}
              disabled={startWorkoutMutation.isPending}
              className={`w-full text-left p-4 rounded-xl backdrop-blur-sm transition-all border ${
                done
                  ? 'bg-white/30 border-white/50'
                  : 'bg-white/20 hover:bg-white/30 border-white/30 active:scale-98'
              }`}
            >
              <div className="flex items-center gap-3">
                {done
                  ? <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
                  : getIcon(rec)
                }
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm truncate ${done ? 'line-through text-white/70' : 'text-white'}`}>
                    {rec.title}
                  </p>
                  <p className={`text-xs capitalize ${done ? 'text-white/60' : getLabelColor(rec)}`}>
                    {done ? 'Done today — tap to do again' : `${rec.label} · ${rec.category}`}
                  </p>
                </div>
                {rec.isPremium && !isPremium && !done && (
                  <Lock className="w-4 h-4 text-amber-300 flex-shrink-0" />
                )}
                {done && (
                  <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium flex-shrink-0">Again</span>
                )}
                {startWorkoutMutation.isPending && rec.type === 'workout' && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
                )}
              </div>
            </motion.button>
          );
        })}
        {recommendations.length === 0 && (
          <div className="text-center py-4 text-orange-100 text-sm">
            Loading your picks...
          </div>
        )}
      </div>
    </motion.div>
  );
}