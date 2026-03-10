import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Zap, Brain, Target, Dumbbell, Lock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quickStartWorkouts } from '@/components/fitness/QuickStartWorkouts';
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

  const { data: premiumStatus } = useQuery({
    queryKey: ['premiumStatus', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const subs = await base44.entities.PremiumSubscription.filter({ user_email: guestEmail });
      return subs[0] || null;
    },
  });

  const isPremium = premiumStatus?.is_premium || false;

  const { data: drills = [] } = useQuery({
    queryKey: ['drills'],
    queryFn: () => base44.entities.Drill.list(),
  });

  const { data: mentalRoutines = [] } = useQuery({
    queryKey: ['mentalRoutines'],
    queryFn: () => base44.entities.MentalRoutine.list(),
  });

  const startWorkoutMutation = useMutation({
    mutationFn: async (workout) => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      return await base44.entities.Workout.create({
        user_email: guestEmail,
        name: workout.name,
        drills: workout.exercises.map(ex => ({
          drill_id: `fitness_${Math.random().toString(36).substr(2, 9)}`,
          drill_title: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          completed_sets: 0,
          type: 'exercise',
          category: 'fitness',
          instructions: ex.instructions || '',
          rest_seconds: ex.rest_seconds || 60
        })),
        status: 'not_started',
        xp_value: workout.xp_value || 100
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userGeneratedWorkouts'] });
      toast.success('Workout saved! Starting now...');
      navigate(createPageUrl('AIWorkout'));
    },
  });

  useEffect(() => {
    if (drills.length === 0 && mentalRoutines.length === 0) return;

    const today = new Date().toDateString();
    const dayHash = today.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

    // Daily-stable random pick (changes each day)
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
    const availableRoutines = mentalRoutines.filter(m => !m.is_premium || isPremium);
    const availableWorkouts = quickStartWorkouts.filter(w => !w.is_premium || isPremium);

    const randomDrills = stablePick(availableDrills, 2);
    const randomMental = stablePick(availableRoutines, 1);
    const randomWorkout = availableWorkouts.length > 0
      ? availableWorkouts[dayHash % availableWorkouts.length]
      : null;

    const recs = [];

    randomMental.forEach(m => recs.push({
      type: 'mental', id: m.id, title: m.title,
      category: m.category?.replace('-', ' ') || 'Mental Training',
      label: 'Mental Session', icon: 'brain'
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
  }, [drills, mentalRoutines, isPremium]);

  const handleClick = (item) => {
    if (item.type === 'drill') {
      navigate(createPageUrl(`DrillDetail?id=${item.id}`));
    } else if (item.type === 'mental') {
      navigate(createPageUrl(`MentalRoutinePlayer?id=${item.id}`));
    } else if (item.type === 'workout') {
      if (item.isPremium && !isPremium) {
        toast('This workout requires Premium! 🔓', { icon: '💎', duration: 3000 });
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
        1 mental session · 2 drills · 1 featured workout — just for today
      </p>
      <div className="space-y-2">
        {recommendations.map((rec, index) => (
          <motion.button
            key={`${rec.type}-${rec.id}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            onClick={() => handleClick(rec)}
            disabled={startWorkoutMutation.isPending}
            className="w-full text-left p-4 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all border border-white/30 active:scale-98"
          >
            <div className="flex items-center gap-3">
              {getIcon(rec)}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-white truncate">{rec.title}</p>
                <p className={`text-xs capitalize ${getLabelColor(rec)}`}>
                  {rec.label} · {rec.category}
                </p>
              </div>
              {rec.isPremium && !isPremium && (
                <Lock className="w-4 h-4 text-amber-300 flex-shrink-0" />
              )}
              {startWorkoutMutation.isPending && rec.type === 'workout' && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
              )}
            </div>
          </motion.button>
        ))}
        {recommendations.length === 0 && (
          <div className="text-center py-4 text-orange-100 text-sm">
            Loading your picks...
          </div>
        )}
      </div>
    </motion.div>
  );
}