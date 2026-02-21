import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, CheckCircle, Clock, Zap, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/common/Header';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AIWorkout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [completedSets, setCompletedSets] = useState({});

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

  const { data: workouts } = useQuery({
    queryKey: ['userGeneratedWorkouts', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const userWorkouts = await base44.entities.Workout.filter({ user_email: guestEmail });
      return userWorkouts.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
  });

  const activeWorkout = selectedWorkoutId 
    ? workouts?.find(w => w.id === selectedWorkoutId) 
    : null;
  const exercises = activeWorkout?.drills || [];
  const currentExercise = exercises[currentExerciseIndex];

  React.useEffect(() => {
    if (workoutStarted && activeWorkout) {
      const progress = {
        workoutId: activeWorkout.id,
        currentExerciseIndex,
        completedSets,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('workoutProgress', JSON.stringify(progress));
    }
  }, [workoutStarted, currentExerciseIndex, completedSets, activeWorkout]);

  React.useEffect(() => {
    const savedProgress = localStorage.getItem('workoutProgress');
    if (savedProgress && workouts) {
      const progress = JSON.parse(savedProgress);
      const workout = workouts.find(w => w.id === progress.workoutId);
      if (workout) {
        setSelectedWorkoutId(progress.workoutId);
        setCurrentExerciseIndex(progress.currentExerciseIndex);
        setCompletedSets(progress.completedSets);
        setWorkoutStarted(true);
      }
    }
  }, [workouts]);

  React.useEffect(() => {
    if (isResting && restTime > 0) {
      const timer = setTimeout(() => {
        setRestTime(restTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isResting && restTime === 0) {
      setIsResting(false);
      toast.success('Rest complete! Ready for next set! 💪');
    }
  }, [isResting, restTime]);

  const completeWorkoutMutation = useMutation({
    mutationFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const xpEarned = activeWorkout?.xp_value || 90;

      const userProgressData = await base44.entities.UserProgress.filter({ user_email: guestEmail });
      if (userProgressData[0]) {
        await base44.entities.UserProgress.update(userProgressData[0].id, {
          total_xp: (userProgressData[0].total_xp || 0) + xpEarned
        });
      } else {
        await base44.entities.UserProgress.create({
          user_email: guestEmail,
          total_xp: xpEarned,
        });
      }

      const leaderboards = await base44.entities.Leaderboard.filter({ user_email: guestEmail });
      if (leaderboards.length > 0) {
        await base44.entities.Leaderboard.update(leaderboards[0].id, {
          total_xp: (leaderboards[0].total_xp || 0) + xpEarned
        });
      }

      if (activeWorkout) {
        await base44.entities.Notification.create({
          user_email: guestEmail,
          type: 'workout',
          title: 'Workout Completed! 💪',
          message: `Crushed the ${activeWorkout.name} workout! +${xpEarned} XP`,
          related_id: activeWorkout.id
        });
      }
      localStorage.removeItem('workoutProgress');
      return await base44.entities.Workout.delete(activeWorkout.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userGeneratedWorkouts'] });
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success('Workout completed! Amazing job! 🎉');
    },
  });

  const handleCompleteSet = () => {
    const exerciseId = currentExercise.drill_id || currentExerciseIndex;
    const currentSets = completedSets[exerciseId] || 0;
    const newSets = currentSets + 1;
    
    setCompletedSets({ ...completedSets, [exerciseId]: newSets });

    if (newSets >= (currentExercise.sets || 3)) {
      if (currentExerciseIndex < exercises.length - 1) {
        toast.success(`${currentExercise.drill_title} complete! 🎯`);
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCompletedSets({ ...completedSets, [exerciseId]: 0 });
      } else {
        setWorkoutCompleted(true);
        completeWorkoutMutation.mutate();
      }
    } else {
      const restSeconds = currentExercise.rest_seconds || 60;
      setRestTime(restSeconds);
      setIsResting(true);
      toast.success(`Set ${newSets}/${currentExercise.sets || 3} complete! Take a break! 😌`);
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTime(0);
  };

  const deleteAllWorkoutsMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(
        workouts.map(w => base44.entities.Workout.delete(w.id))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userGeneratedWorkouts'] });
      toast.success('All workouts deleted');
      setSelectedWorkoutId(null);
    },
  });

  if (!selectedWorkoutId && workouts && workouts.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-slate-900 dark:to-slate-950 pb-24">
        <Header title="AI Workout" showSettings={false} />
        <div className="px-6 py-6 max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white mb-6"
          >
            <h2 className="font-bold text-2xl mb-2">Your Saved Workouts</h2>
            <p className="text-purple-100">Choose a workout to begin</p>
          </motion.div>

          <div className="space-y-4 mb-4">
            <Button
              onClick={() => navigate(createPageUrl('FitnessBuilder'))}
              variant="outline"
              className="w-full border-2 border-purple-500 text-purple-600 hover:bg-purple-50"
            >
              Back to Fitness Builder
            </Button>
            {workouts.length > 0 && (
              <Button
                onClick={() => {
                  if (confirm('Delete ALL saved workouts? This cannot be undone.')) {
                    deleteAllWorkoutsMutation.mutate();
                  }
                }}
                disabled={deleteAllWorkoutsMutation.isPending}
                variant="destructive"
                className="w-full bg-red-500 hover:bg-red-600"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                {deleteAllWorkoutsMutation.isPending ? 'Deleting...' : 'Delete All Saved Workouts'}
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {workouts.map((workout, index) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg capitalize">{workout.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{workout.drills?.length || 0} exercises</p>
                  </div>
                  <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-xs font-bold text-purple-700 dark:text-purple-300">
                    +{workout.xp_value || 100} XP
                  </div>
                </div>
                <Button
                  onClick={() => setSelectedWorkoutId(workout.id)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Select Workout
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!workouts || workouts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-slate-900 dark:to-slate-950 pb-24">
        <Header title="AI Workout" showSettings={false} />
        <div className="px-6 py-12 max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8"
          >
            <Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">No Saved Workouts</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Create a workout from the Fitness Builder to get started!</p>
            <Button onClick={() => navigate(createPageUrl('FitnessBuilder'))} className="bg-purple-500 hover:bg-purple-600">
              Go to Fitness Builder
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (workoutCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-slate-900 dark:to-slate-950 pb-24">
        <Header title="AI Workout" showSettings={false} />
        <div className="px-6 py-12 max-w-lg mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl shadow-2xl p-8 text-white"
          >
            <CheckCircle className="w-20 h-20 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-3">Workout Complete!</h2>
            <p className="text-emerald-100 mb-6">Amazing job crushing that workout! You're getting stronger every day!</p>
            <Button 
              onClick={() => navigate(createPageUrl('Home'))} 
              variant="secondary"
              className="bg-white text-emerald-600 hover:bg-emerald-50"
            >
              Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!workoutStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-slate-900 dark:to-slate-950 pb-24">
        <Header title="AI Workout" showSettings={false} />
        <div className="px-6 py-6 max-w-lg mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white"
          >
            <h2 className="font-bold text-2xl mb-2">{activeWorkout.name}</h2>
            <p className="text-purple-100">{exercises.length} exercises</p>
          </motion.div>

          <div className="space-y-3">
            {exercises.map((exercise, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center shrink-0">
                    <span className="font-bold text-purple-600 dark:text-purple-400">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 dark:text-white">{exercise.drill_title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {exercise.sets || 3} sets × {exercise.reps || 10} reps
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setSelectedWorkoutId(null)}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={() => setWorkoutStarted(true)}
              className="flex-1 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-bold"
            >
              <Play className="w-6 h-6 mr-2" />
              Start Workout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentSets = completedSets[currentExercise?.drill_id] || 0;
  const progress = ((currentExerciseIndex + (currentSets / (currentExercise?.sets || 3))) / exercises.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-slate-900 dark:via-slate-950 dark:to-black pb-24">
      <Header title="AI Workout" showSettings={false} />
      
      <div className="px-6 py-6 max-w-lg mx-auto space-y-6">
        {/* Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4"
        >
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
            <span>Exercise {currentExerciseIndex + 1} of {exercises.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
        </motion.div>

        {/* Rest Timer */}
        <AnimatePresence>
          {isResting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl p-8 text-center text-white shadow-2xl"
            >
              <Clock className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Rest Time</h3>
              <div className="text-6xl font-bold mb-4">{restTime}s</div>
              <Button onClick={skipRest} variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                Skip Rest
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Exercise */}
        {!isResting && currentExercise && (
          <motion.div
            key={currentExerciseIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                {currentExercise.drill_title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Set {currentSets + 1} of {currentExercise.sets || 3}
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Target</p>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{currentExercise.reps || 10}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">reps</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Rest After</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{currentExercise.rest_seconds || 60}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">seconds</p>
                </div>
              </div>
            </div>

            {currentExercise.instructions && (
              <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-4 mb-6">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Instructions:</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">{currentExercise.instructions}</p>
              </div>
            )}

            <Button
              onClick={handleCompleteSet}
              className="w-full h-16 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-xl font-bold"
            >
              <CheckCircle className="w-6 h-6 mr-2" />
              Complete Set {currentSets + 1}/{currentExercise.sets || 3}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}