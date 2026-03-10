import React from 'react';
import { motion } from 'framer-motion';
import { Play, Lock, Dumbbell, Clock, Flame, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { quickStartWorkouts } from './QuickStartWorkouts';

export default function QuickStartWorkoutsList({ user, isPremium, searchQuery = '' }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createWorkoutMutation = useMutation({
    mutationFn: async (workout) => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const workoutData = {
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
      };
      return await base44.entities.Workout.create(workoutData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['userGeneratedWorkouts'] });
      toast.success('Saved to AI Workout! Tap it whenever you\'re ready 💪');
      navigate(createPageUrl('AIWorkout'));
    },
  });

  const levelColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-amber-100 text-amber-700',
    advanced: 'bg-red-100 text-red-700',
    pro: 'bg-purple-100 text-purple-700'
  };

  const targetIcons = {
    'full body': Dumbbell,
    'arms': Dumbbell,
    'chest': Dumbbell,
    'back': Dumbbell,
    'legs': Dumbbell,
    'shoulders': Dumbbell,
    'core': Dumbbell
  };

  // Daily-stable shuffle
  const dailyShuffled = React.useMemo(() => {
    const today = new Date().toDateString();
    const seed = today.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const arr = [...quickStartWorkouts];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (seed * (i + 7)) % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const filteredWorkouts = dailyShuffled.filter(workout =>
    workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.goal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-h-[500px] overflow-y-auto scrollbar-visible space-y-3 pr-2">
      {filteredWorkouts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">No workouts found matching "{searchQuery}"</p>
        </div>
      ) : (
        filteredWorkouts.map((workout, index) => {
        const isLocked = workout.is_premium && !isPremium;
        const TargetIcon = targetIcons[workout.target] || Dumbbell;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className={cn(
              "bg-white rounded-2xl p-4 shadow-md border-2 transition-all",
              isLocked ? "border-amber-200 opacity-70" : "border-slate-100 hover:border-orange-300"
            )}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                <TargetIcon className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-sm mb-1 leading-tight">{workout.name}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", levelColors[workout.level])}>
                    {workout.level}
                  </span>
                  <span className="text-xs text-slate-500">{workout.exercises.length} exercises</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {workout.duration_category}
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">+{workout.xp_value} XP</span>
                </div>
              </div>
              {isLocked && (
                <div className="shrink-0">
                  <Lock className="w-5 h-5 text-amber-500" />
                </div>
              )}
            </div>
            
            <Button
              onClick={() => {
                if (isLocked) {
                  toast('This is a Pro workout! Requires Premium subscription. 🔓', {
                    icon: '💎',
                    duration: 3000,
                  });
                } else {
                  createWorkoutMutation.mutate(workout);
                }
              }}
              disabled={createWorkoutMutation.isPending}
              className={cn(
                "w-full h-10",
                isLocked 
                  ? "bg-slate-300 cursor-not-allowed" 
                  : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              )}
            >
              <Play className="w-4 h-4 mr-2" />
              {isLocked ? 'Premium Only' : 'Save to My Workouts'}
            </Button>
          </motion.div>
        );
      }))}
    </div>
  );
}