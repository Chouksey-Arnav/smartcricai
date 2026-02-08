import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tantml:react-query';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ChevronLeft, Trophy } from 'lucide-react';
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
    queryFn: () => base44.auth.me(),
  });

  const { data: workout, isLoading } = useQuery({
    queryKey: ['savedDrillWorkout', workoutId],
    queryFn: async () => {
      const workouts = await base44.entities.CustomDrillWorkout.filter({ id: workoutId });
      return workouts[0];
    },
    enabled: !!workoutId,
  });

  const [completedDrills, setCompletedDrills] = useState([]);

  const toggleDrillMutation = useMutation({
    mutationFn: async (drillId) => {
      const isCompleted = completedDrills.includes(drillId);
      const newCompleted = isCompleted
        ? completedDrills.filter(id => id !== drillId)
        : [...completedDrills, drillId];
      
      setCompletedDrills(newCompleted);
      return newCompleted;
    },
    onSuccess: () => {
      toast.success('Progress saved!');
    },
  });

  const completeWorkoutMutation = useMutation({
    mutationFn: async () => {
      if (!user?.email || !workout) return;

      const xpEarned = workout.num_drills * 50;

      // Update user progress
      const progress = await base44.entities.UserProgress.filter({ user_email: user.email });
      if (progress.length > 0) {
        await base44.entities.UserProgress.update(progress[0].id, {
          total_xp: (progress[0].total_xp || 0) + xpEarned
        });
      }

      // Update Leaderboard
      const leaderboards = await base44.entities.Leaderboard.filter({ user_email: user.email });
      if (leaderboards.length > 0) {
        await base44.entities.Leaderboard.update(leaderboards[0].id, {
          total_xp: (leaderboards[0].total_xp || 0) + xpEarned
        });
      }

      // Create notification
      await base44.entities.Notification.create({
        user_email: user.email,
        type: 'workout',
        title: `Workout Completed! 💪 +${xpEarned} XP`,
        message: `"${workout.workout_name}" completed! Amazing work!`,
        related_id: workout.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Workout completed! 🎉');
      navigate(createPageUrl('Drills'));
    },
  });

  if (isLoading || !workout) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const allDrillsCompleted = workout.drills?.length > 0 && 
    completedDrills.length === workout.drills.length;

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
            <span>{workout.num_drills} drills</span>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                animate={{ width: `${(completedDrills.length / workout.drills.length) * 100}%` }}
              />
            </div>
            <p className="text-sm text-blue-100 mt-2">
              {completedDrills.length} / {workout.drills.length} completed
            </p>
          </div>
        </motion.div>

        {/* Drills List */}
        <div className="space-y-3">
          {workout.drills?.map((drill, index) => {
            const isCompleted = completedDrills.includes(drill.drill_id);
            return (
              <motion.div
                key={drill.drill_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-5 shadow-lg border-2 border-slate-100"
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleDrillMutation.mutate(drill.drill_id)}
                    className="shrink-0 mt-1"
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
                    {drill.is_existing && (
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

        {/* Complete Workout Button */}
        {allDrillsCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Button
              onClick={() => completeWorkoutMutation.mutate()}
              disabled={completeWorkoutMutation.isPending}
              className="w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-lg font-bold"
            >
              <Trophy className="w-5 h-5 mr-2" />
              {completeWorkoutMutation.isPending ? 'Saving...' : 'Complete Workout 🎉'}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}