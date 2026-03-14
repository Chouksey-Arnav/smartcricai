import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dumbbell, Clock, Target, TrendingUp, Plus, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PreGeneratedWorkoutBrowser() {
  const queryClient = useQueryClient();
  const [selectedTarget, setSelectedTarget] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedGoal, setSelectedGoal] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch {
        return null;
      }
    },
  });

  const { data: workouts = [], isLoading } = useQuery({
    queryKey: ['preGeneratedWorkouts', selectedTarget, selectedLevel, selectedGoal, selectedDuration],
    queryFn: async () => {
      let query = {};
      if (selectedTarget !== 'all') query.target = selectedTarget;
      if (selectedLevel !== 'all') query.level = selectedLevel;
      if (selectedGoal !== 'all') query.goal = selectedGoal;
      if (selectedDuration !== 'all') query.duration = selectedDuration;
      
      return await base44.entities.PreGeneratedWorkout.filter(query, '-created_date', 20);
    },
  });

  const [savedIds, setSavedIds] = React.useState(new Set());

  const saveWorkoutMutation = useMutation({
    mutationFn: async (workout) => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const exercisesArray = workout.exercises.split(' || ').map(ex => {
        const [name, setsReps] = ex.split(' — ');
        return { name, sets_reps: setsReps || '3x10' };
      });
      return await base44.entities.SavedWorkout.create({
        user_email: guestEmail,
        name: workout.workout_name,
        exercises: exercisesArray,
        notes: workout.notes || '',
        source: 'pre_generated'
      });
    },
    onMutate: (workout) => {
      // Optimistic: immediately show saved state
      setSavedIds(prev => new Set([...prev, workout.id]));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedWorkouts'] });
      toast.success('Workout saved! 💪');
    },
    onError: (_, workout) => {
      // Rollback
      setSavedIds(prev => { const next = new Set(prev); next.delete(workout.id); return next; });
      toast.error('Failed to save. Please try again.');
    },
  });

  const parseExercises = (exerciseString) => {
    return exerciseString.split(' || ').map(ex => {
      const [name, setsReps] = ex.split(' — ');
      return { name, sets_reps: setsReps };
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-500" />
          Find Your Perfect Workout
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 block">Target</label>
            <Select value={selectedTarget} onValueChange={setSelectedTarget}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Targets</SelectItem>
                <SelectItem value="arms">Arms</SelectItem>
                <SelectItem value="legs">Legs</SelectItem>
                <SelectItem value="core">Core</SelectItem>
                <SelectItem value="full_body">Full Body</SelectItem>
                <SelectItem value="back">Back</SelectItem>
                <SelectItem value="chest">Chest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 block">Level</label>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 block">Goal</label>
            <Select value={selectedGoal} onValueChange={setSelectedGoal}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Goals</SelectItem>
                <SelectItem value="lose weight">Lose Weight</SelectItem>
                <SelectItem value="build muscle">Build Muscle</SelectItem>
                <SelectItem value="endurance">Endurance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 block">Duration</label>
            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Durations</SelectItem>
                <SelectItem value="<10">&lt;10 min</SelectItem>
                <SelectItem value="10-15">10-15 min</SelectItem>
                <SelectItem value="15-20">15-20 min</SelectItem>
                <SelectItem value="20-25">20-25 min</SelectItem>
                <SelectItem value="25+">25+ min</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Workouts Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : workouts.length === 0 ? (
        <div className="text-center py-20">
          <Dumbbell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">No workouts found with these filters</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {workouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                    {workout.workout_name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold capitalize">
                      {workout.target}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold capitalize">
                      {workout.level}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold capitalize">
                      {workout.goal}
                    </span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {workout.duration} min
                    </span>
                  </div>
                </div>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => saveWorkoutMutation.mutate(workout)}
                    disabled={savedIds.has(workout.id)}
                    size="sm"
                    className={`shrink-0 ${savedIds.has(workout.id) ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                  >
                    {savedIds.has(workout.id) ? (
                      <>✓ Saved</>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-1" />
                        Save
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3">Exercises:</p>
                <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-visible">
                  {parseExercises(workout.exercises).map((exercise, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 dark:text-slate-300">{exercise.name}</span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">
                        {exercise.sets_reps}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {workout.notes && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-600 dark:text-slate-400">{workout.notes}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}