import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Trophy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/common/Header';
import toast from 'react-hot-toast';

export default function SavedDrillWorkout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const workoutId = urlParams.get('id');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try { return await base44.auth.me(); } catch { return null; }
    },
  });

  const { data: workout, isLoading } = useQuery({
    queryKey: ['savedDrillWorkout', workoutId],
    queryFn: async () => {
      if (!workoutId) return null;
      const results = await base44.entities.CustomDrillWorkout.filter({ id: workoutId });
      return results[0] || null;
    },
    enabled: !!workoutId,
  });

  const [completedDrills, setCompletedDrills] = useState([]);

  useEffect(() => {
    if (workout?.completed_drill_ids) {
      setCompletedDrills(workout.completed_drill_ids);
    }
  }, [workout?.id, workout?.completed_drill_ids?.length]);

  const toggleDrillMutation = useMutation({
    mutationFn: async (drillId) => {
      const isCompleted = completedDrills.includes(drillId);
      const newCompleted = isCompleted
        ? completedDrills.filter(id => id !== drillId)
        : [...completedDrills, drillId];
      await base44.entities.CustomDrillWorkout.update(workoutId, { 
        completed_drill_ids: newCompleted,
        status: newCompleted.length === workout?.drills?.length ? 'completed' : 'in_progress'
      });
      return newCompleted;
    },
    onMutate: async (drillId) => {
      const isCompleted = completedDrills.includes(drillId);
      const newCompleted = isCompleted
        ? completedDrills.filter(id => id !== drillId)
        : [...completedDrills, drillId];
      setCompletedDrills(newCompleted);
    },
    onError: () => {
      toast.error('Failed to update. Please try again.');
      queryClient.invalidateQueries({ queryKey: ['savedDrillWorkout', workoutId] });
    },
  });

  const completeWorkoutMutation = useMutation({
    mutationFn: async () => {
      if (!workout) return;
      const guestEmail = user?.email || localStorage.getItem('smartcrick_guest_id') || 'guest@smartcrick.app';
      const xpEarned = workout.num_drills * 50;

      const progress = await base44.entities.UserProgress.filter({ user_email: guestEmail });
      if (progress.length > 0) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
        const lastPractice = progress[0].last_practice_date;
        let newStreak = progress[0].current_streak || 0;
        if (lastPractice !== today) {
          newStreak = lastPractice === yesterday.toISOString().split('T')[0] ? newStreak + 1 : 1;
        }
        await base44.entities.UserProgress.update(progress[0].id, {
          total_xp: (progress[0].total_xp || 0) + xpEarned,
          last_practice_date: today,
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, progress[0].longest_streak || 0),
        });
      } else {
        await base44.entities.UserProgress.create({
          user_email: guestEmail,
          total_xp: xpEarned,
          last_practice_date: new Date().toISOString().split('T')[0],
          current_streak: 1,
          longest_streak: 1,
        });
      }

      const leaderboards = await base44.entities.Leaderboard.filter({ user_email: guestEmail });
      if (leaderboards.length > 0) {
        await base44.entities.Leaderboard.update(leaderboards[0].id, {
          total_xp: (leaderboards[0].total_xp || 0) + xpEarned
        });
      }

      await base44.entities.CustomDrillWorkout.update(workoutId, { status: 'completed' });

      try {
        await base44.entities.Notification.create({
          user_email: guestEmail,
          type: 'workout',
          title: `Workout Completed! 💪 +${xpEarned} XP`,
          message: `"${workout.workout_name}" completed! Amazing work!`,
          related_id: workout.id
        });
      } catch (e) { /* ignore notification errors */ }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['savedDrillWorkouts'] });
      toast.success('Workout completed! 🎉 XP earned!');
      navigate(createPageUrl('Drills') + '?tab=saved');
    },
    onError: () => {
      toast.error('Failed to complete workout. Please try again.');
    }
  });

  if (!workoutId) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <p className="text-slate-600 mb-4">No workout selected.</p>
        <Button onClick={() => navigate(createPageUrl('Drills') + '?tab=saved')}>Back to Saved Workouts</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 border-2 border-blue-500 animate-spin" />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <p className="text-slate-600 mb-4">Workout not found.</p>
        <Button onClick={() => navigate(createPageUrl('Drills') + '?tab=saved')}>Back to Saved Workouts</Button>
      </div>
    );
  }

  const allDrillsCompleted = workout.drills?.length > 0 && completedDrills.length >= workout.drills.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
      <Header title={workout.workout_name} showBack={true} onBack={() => navigate(-1)} showSettings={false} />

      <div className="px-6 py-6 max-w-lg mx-auto space-y-6">
        {/* Workout Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-6 text-white"
        >
          <h2 className="text-xl font-bold mb-2">{workout.workout_name}</h2>
          <div className="flex items-center gap-4 text-blue-100 text-sm">
            <span className="capitalize">{workout.skill_level}</span>
            <span>•</span>
            <span>{workout.drills?.length || 0} drills</span>
          </div>
          {workout.drills?.length > 0 && (
            <div className="mt-4">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${(completedDrills.length / workout.drills.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-blue-100 mt-2">
                {completedDrills.length} / {workout.drills.length} completed
              </p>
            </div>
          )}
        </motion.div>

        {/* Drills List */}
        <div className="space-y-3">
          {(workout.drills || []).map((drill, index) => {
            const isCompleted = completedDrills.includes(drill.drill_id);
            return (
              <motion.div
                key={drill.drill_id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl p-5 shadow-lg border-2 transition-all ${isCompleted ? 'border-emerald-200' : 'border-slate-100'}`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleDrillMutation.mutate(drill.drill_id)}
                    className="shrink-0 mt-1"
                    disabled={toggleDrillMutation.isPending}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                    ) : (
                      <Circle className="w-7 h-7 text-slate-300" />
                    )}
                  </button>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-2 ${isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {drill.drill_title}
                    </h3>
                    {drill.is_existing && drill.drill_id && (
                      <Button
                        onClick={() => navigate(createPageUrl(`DrillDetail?id=${drill.drill_id}`))}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        View Drill Details
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {allDrillsCompleted && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Button
              onClick={() => completeWorkoutMutation.mutate()}
              disabled={completeWorkoutMutation.isPending}
              className="w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-lg font-bold"
            >
              {completeWorkoutMutation.isPending ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Completing...</>
              ) : (
                <><Trophy className="w-5 h-5 mr-2" /> Complete Workout 🎉</>
              )}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}