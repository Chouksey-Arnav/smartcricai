import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, CheckCircle, Clock, Zap, RotateCcw, Trash2, ChevronLeft, Heart } from 'lucide-react';
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
  const [finishLocked, setFinishLocked] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [completedSets, setCompletedSets] = useState({});
  const [restBlockTime, setRestBlockTime] = useState(null);

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

  const { data: aiProgress } = useQuery({
    queryKey: ['userProgress', user?.email || 'guest'],
    queryFn: async () => {
      const guestId = user?.email || 'guest@smartcrick.app';
      const results = await base44.entities.UserProgress.filter({ user_email: guestId });
      return results[0] || null;
    },
    staleTime: 10000,
    refetchOnWindowFocus: true,
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
    if (!workouts) return;
    // Check if coming from SkillPaths with a pending workout
    const pendingRaw = localStorage.getItem('skillpath_pending_workout');
    if (pendingRaw) {
      try {
        const pending = JSON.parse(pendingRaw);
        localStorage.removeItem('skillpath_pending_workout');
        const guestId = user?.email || 'guest@smartcrick.app';
        base44.entities.Workout.create({
          user_email: guestId,
          name: pending.name,
          drills: (pending.exercises || []).map(ex => ({
            drill_id: `fitness_${Math.random().toString(36).substr(2, 9)}`,
            drill_title: ex.name,
            sets: ex.sets || 3,
            reps: ex.reps || '12 reps',
            completed_sets: 0,
            type: 'exercise',
            category: 'fitness',
            instructions: '',
            rest_seconds: ex.rest_seconds || 60,
          })),
          status: 'not_started',
          xp_value: pending.xp_value || 100,
          skill_path_id: pending.skillPathId || null,
          skill_path_item_id: pending.skillPathItemId || null,
        }).then(newWorkout => {
          queryClient.invalidateQueries({ queryKey: ['userGeneratedWorkouts'] });
          setSelectedWorkoutId(newWorkout.id);
          setWorkoutStarted(false);
        }).catch(console.error);
      } catch (e) { console.error(e); }
      return;
    }
    const savedProgress = localStorage.getItem('workoutProgress');
    if (savedProgress) {
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

  // Auto-start countdown when landing on a rest-block exercise item
  React.useEffect(() => {
    if (!workoutStarted) return;
    const ex = exercises[currentExerciseIndex];
    if (!ex) return;
    if (ex.type === 'rest' && !isResting) {
      const duration = ex.rest_seconds || ex.reps || 60;
      setRestTime(duration);
      setIsResting(true);
    }
  }, [currentExerciseIndex, workoutStarted]);

  React.useEffect(() => {
    if (!isResting) return;
    if (restTime <= 0) {
      setIsResting(false);
      const ex = exercises[currentExerciseIndex];
      // Only auto-advance if this was a dedicated rest-block exercise
      if (ex?.type === 'rest') {
        if (currentExerciseIndex < exercises.length - 1) {
          setCurrentExerciseIndex(prev => prev + 1);
          setCompletedSets({});
        }
        toast.success('Rest complete — keep going!');
      } else {
        toast.success('Rest done! Complete your next set!');
      }
      return;
    }
    const timer = setTimeout(() => {
      setRestTime(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isResting, restTime]);

  const completeWorkoutMutation = useMutation({
    mutationFn: async () => {
      const guestId = user?.email || localStorage.getItem('smartcrick_guest_id') || 'guest@smartcrick.app';
      const xpEarned = activeWorkout?.xp_value || 90;
      const today = new Date().toISOString().split('T')[0];

      const userProgressData = await base44.entities.UserProgress.filter({ user_email: guestId });
      if (userProgressData[0]) {
        const lastPractice = userProgressData[0].last_practice_date;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        let newStreak = userProgressData[0].current_streak || 0;
        if (lastPractice !== today) {
          newStreak = lastPractice === yesterdayStr ? newStreak + 1 : 1;
        }
        const longestStreak = Math.max(newStreak, userProgressData[0].longest_streak || 0);
        
        await base44.entities.UserProgress.update(userProgressData[0].id, {
          total_xp: (userProgressData[0].total_xp || 0) + xpEarned,
          last_practice_date: today,
          current_streak: newStreak,
          longest_streak: longestStreak,
          total_practice_minutes: (userProgressData[0].total_practice_minutes || 0) + 25
        });
      } else {
        await base44.entities.UserProgress.create({
          user_email: guestId,
          total_xp: xpEarned,
          last_practice_date: today,
          current_streak: 1,
          longest_streak: 1,
          total_practice_minutes: 25
        });
      }

      const leaderboards = await base44.entities.Leaderboard.filter({ user_email: guestId });
      if (leaderboards.length > 0) {
        await base44.entities.Leaderboard.update(leaderboards[0].id, {
          total_xp: (leaderboards[0].total_xp || 0) + xpEarned,
          current_streak: userProgressData[0] ? (userProgressData[0].current_streak || 1) : 1,
          highest_streak: userProgressData[0] ? (userProgressData[0].longest_streak || 1) : 1,
          weekly_minutes: (leaderboards[0].weekly_minutes || 0) + 25
        });
      }

      if (activeWorkout) {
        await base44.entities.Notification.create({
          user_email: guestId,
          type: 'workout',
          title: 'Workout Completed! 💪',
          message: `Crushed the ${activeWorkout.name} workout! +${xpEarned} XP`,
          related_id: activeWorkout.id
        });
      }
      localStorage.removeItem('workoutProgress');
      return await base44.entities.Workout.update(activeWorkout.id, { status: 'completed' });
    },
    onSuccess: () => {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast.success('Workout completed! Amazing job!');
      queryClient.invalidateQueries({ queryKey: ['userGeneratedWorkouts'] });
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      localStorage.removeItem('workoutProgress');
      setWorkoutCompleted(true);
      setSelectedWorkoutId(null);
    },
  });

  const isLastExercise = currentExerciseIndex === exercises.length - 1;

  const handleGoBack = () => {
    if (isResting) {
      setIsResting(false);
      setRestTime(0);
      return;
    }
    if (currentExerciseIndex > 0) {
      const prevIdx = currentExerciseIndex - 1;
      setCurrentExerciseIndex(prevIdx);
      const prevEx = exercises[prevIdx];
      setCompletedSets(prev => ({ ...prev, [prevEx?.drill_id]: 0 }));
    } else {
      setWorkoutStarted(false);
    }
  };

  const handleCompleteSet = () => {
    const exerciseId = currentExercise.drill_id || currentExerciseIndex;
    const currentSets = completedSets[exerciseId] || 0;
    const newSets = currentSets + 1;
    const totalSets = currentExercise.sets || 3;

    if (newSets >= totalSets) {
      if (isLastExercise) {
        // Last set of last exercise — auto-finish
        handleFinishWorkout();
      } else {
        toast.success(`${currentExercise.drill_title} complete! Next exercise!`);
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCompletedSets({ ...completedSets, [exerciseId]: 0 });
      }
    } else {
      setCompletedSets({ ...completedSets, [exerciseId]: newSets });
      const restSeconds = currentExercise.rest_seconds || 60;
      setRestTime(restSeconds);
      setIsResting(true);
      toast.success(`Set ${newSets}/${totalSets} complete! Rest up!`);
    }
  };

  const handleFinishWorkout = () => {
    if (finishLocked || activeWorkout?.status === 'completed') return;
    setFinishLocked(true);
    completeWorkoutMutation.mutate();
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

  const deleteWorkoutMutation = useMutation({
    mutationFn: async (workoutId) => {
      await base44.entities.Workout.delete(workoutId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userGeneratedWorkouts'] });
      toast.success('Workout deleted');
    },
  });

  const likeWorkoutMutation = useMutation({
    mutationFn: async ({ workoutId, liked }) => {
      return await base44.entities.Workout.update(workoutId, { liked });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userGeneratedWorkouts'] });
      if (variables.liked) {
        toast.success(`❤️ You liked "${variables.workoutName}"!`);
      } else {
        toast(`Removed like from "${variables.workoutName}"`, { icon: '🤍' });
      }
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
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white mb-4"
          >
            <h2 className="font-bold text-2xl mb-2">Your Saved Workouts</h2>
            <p className="text-purple-100">Choose a workout to begin</p>
          </motion.div>

          {/* XP Tracker */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 text-white flex items-center justify-between mb-4"
          >
            <div>
              <p className="text-xs text-emerald-100">AI Workout XP Earned</p>
              <p className="text-3xl font-bold">{(aiProgress?.total_xp || 0).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-emerald-100">Completed Workouts</p>
              <p className="text-2xl font-bold">{workouts?.filter(w => w.status === 'completed').length || 0}</p>
            </div>
          </motion.div>

          <div className="space-y-4 mb-4">
            <Button
              onClick={() => navigate(createPageUrl('WorkoutBuilder'))}
              variant="outline"
              className="w-full border-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30"
            >
              + Create New Workout
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
                {deleteAllWorkoutsMutation.isPending ? 'Deleting...' : 'Delete All Workouts'}
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
                className={`rounded-2xl shadow-lg p-5 ${
                  workout.status === 'completed'
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-300 dark:border-emerald-700'
                    : 'bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg capitalize flex items-center gap-2">
                      {workout.name}
                      {workout.status === 'completed' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {workout.drills?.length || 0} exercises
                      {workout.status === 'completed' && ' • Completed'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      workout.status === 'completed'
                        ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                        : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    }`}>
                      +{workout.xp_value || 100} XP
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        likeWorkoutMutation.mutate({ workoutId: workout.id, liked: !workout.liked, workoutName: workout.name });
                      }}
                      className="p-2 hover:bg-pink-50 dark:hover:bg-pink-900/30 rounded-lg transition-colors"
                    >
                      <Heart className={`w-5 h-5 transition-colors ${workout.liked ? 'text-pink-500 fill-pink-500' : 'text-slate-400'}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this workout?')) {
                          deleteWorkoutMutation.mutate(workout.id);
                        }
                      }}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setSelectedWorkoutId(workout.id);
                    setWorkoutStarted(false);
                    setWorkoutCompleted(false);
                    setCurrentExerciseIndex(0);
                    setCompletedSets({});
                  }}
                  className={`w-full ${
                    workout.status === 'completed'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                  }`}
                >
                  <Play className="w-5 h-5 mr-2" />
                  {workout.status === 'completed' ? 'Start Again' : 'Select Workout'}
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
        <div className="px-6 py-6 max-w-lg mx-auto">
          {/* XP Tracker always visible */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 text-white flex items-center justify-between mb-6"
          >
            <div>
              <p className="text-xs text-emerald-100">AI Workout XP Earned</p>
              <p className="text-3xl font-bold">{(aiProgress?.total_xp || 0).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-emerald-100">Completed Workouts</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </motion.div>
          <div className="text-center">
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
      </div>
    );
  }

  if (workoutCompleted) {
    const xpEarned = activeWorkout?.xp_value || 90;
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-teal-900 pb-24 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="w-full max-w-lg text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center"
          >
            <CheckCircle className="w-20 h-20 text-white" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-4xl font-bold text-white mb-2">🏆 Crushed It!</h2>
            <p className="text-emerald-200 text-lg mb-4">You're an absolute beast. Keep it up!</p>
            <div className="bg-amber-400 rounded-2xl px-8 py-4 inline-block mb-6 shadow-xl">
              <p className="text-amber-900 font-black text-2xl">+{xpEarned} XP Earned! ⚡</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 mb-8 text-left">
              <p className="text-white font-semibold mb-1">🔥 Workout Complete</p>
              <p className="text-emerald-200 text-sm">Streak updated • Leaderboard synced • Keep going tomorrow!</p>
            </div>
            <Button 
              onClick={() => { setWorkoutCompleted(false); setSelectedWorkoutId(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="w-full h-14 bg-white text-emerald-700 hover:bg-emerald-50 text-lg font-bold"
            >
              Back to My Workouts
            </Button>
          </motion.div>
        </motion.div>
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
                      {exercise.type === 'rest' ? `Rest for ${exercise.reps}s` : `${exercise.sets || 3} sets × ${exercise.reps || 10} reps`}
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
        {/* Back / Next navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{currentExerciseIndex === 0 && !isResting ? 'Back to Overview' : 'Previous'}</span>
          </button>
          {currentExerciseIndex < exercises.length - 1 && (
            <button
              onClick={() => {
                setIsResting(false);
                setRestTime(0);
                setCurrentExerciseIndex(prev => prev + 1);
                setCompletedSets({});
              }}
              className="flex items-center gap-1 text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors text-sm font-medium"
            >
              <span>Next Exercise</span>
              <ChevronLeft className="w-5 h-5" style={{ transform: 'rotate(180deg)' }} />
            </button>
          )}
        </div>

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
            {currentExercise.type === 'rest' ? (
              // Rest blocks are handled by the isResting state / countdown above — show nothing here
              null
            ) : (
              <>
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
                  Complete Set {(completedSets[currentExercise.drill_id || currentExerciseIndex] || 0) + 1}/{currentExercise.sets || 3}
                </Button>
                <Button
                  onClick={handleFinishWorkout}
                  disabled={finishLocked || completeWorkoutMutation.isPending}
                  variant="outline"
                  className="w-full h-12 border-2 border-red-400 text-red-600 hover:bg-red-50 font-semibold"
                >
                  {completeWorkoutMutation.isPending ? 'Finishing...' : '🏁 End Workout'}
                </Button>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}