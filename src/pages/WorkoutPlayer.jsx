import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, ChevronLeft, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export default function WorkoutPlayer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const workoutId = urlParams.get('id');

  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: workout, isLoading } = useQuery({
    queryKey: ['workout', workoutId],
    queryFn: async () => {
      const workouts = await base44.entities.Workout.filter({ id: workoutId });
      return workouts[0] || null;
    },
    enabled: !!workoutId,
  });

  const drills = workout?.drills || [];
  const currentDrill = drills[currentDrillIndex];
  const totalDrills = drills.length;
  const progress = ((currentDrillIndex + (currentSet / (currentDrill?.sets || 1))) / totalDrills) * 100;

  // Rest timer
  useEffect(() => {
    if (isResting && restTime > 0) {
      const timer = setTimeout(() => setRestTime(restTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isResting && restTime === 0) {
      setIsResting(false);
      toast.success('Rest complete! Ready for next set!');
    }
  }, [isResting, restTime]);

  const completeWorkoutMutation = useMutation({
    mutationFn: async () => {
      const xpEarned = workout?.xp_value || 120;

      // Update UserProgress
      const userProgressData = await base44.entities.UserProgress.filter({ user_email: user.email });
      if (userProgressData[0]) {
        await base44.entities.UserProgress.update(userProgressData[0].id, {
          total_xp: (userProgressData[0].total_xp || 0) + xpEarned
        });
      }

      // Update Leaderboard
      const leaderboards = await base44.entities.Leaderboard.filter({ user_email: user.email });
      if (leaderboards[0]) {
        await base44.entities.Leaderboard.update(leaderboards[0].id, {
          total_xp: (leaderboards[0].total_xp || 0) + xpEarned
        });
      }

      // Create notification
      await base44.entities.Notification.create({
        user_email: user.email,
        type: 'workout',
        title: 'Workout Completed!',
        message: `Finished ${workout.name}! +${xpEarned} XP`,
        related_id: workout.id
      });

      // Delete workout
      return await base44.entities.Workout.delete(workout.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['userGeneratedWorkouts'] });
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast.success('Workout completed! Amazing job!');
      setTimeout(() => navigate(createPageUrl('AIWorkout')), 1800);
    },
  });

  const handleCompleteSet = () => {
    if (currentSet < currentDrill.sets) {
      // Start rest period
      setCurrentSet(currentSet + 1);
      setRestTime(60);
      setIsResting(true);
      toast.success(`Set ${currentSet}/${currentDrill.sets} complete! Take a break!`);
    } else {
      // Move to next drill
      if (currentDrillIndex < totalDrills - 1) {
        toast.success(`${currentDrill.drill_title} complete!`);
        setCurrentDrillIndex(currentDrillIndex + 1);
        setCurrentSet(1);
      } else {
        // Workout complete
        completeWorkoutMutation.mutate();
      }
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTime(0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading workout...</p>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-6">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Workout Not Found</h2>
          <Button onClick={() => navigate(createPageUrl('WorkoutBuilder'))} className="bg-purple-500 hover:bg-purple-600">
            Back to Workout Builder
          </Button>
        </div>
      </div>
    );
  }

  if (completeWorkoutMutation.isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-24">
        <div className="px-6 py-12 max-w-lg mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl shadow-2xl p-8 text-white"
          >
            <CheckCircle className="w-20 h-20 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-3">Workout Complete!</h2>
            <p className="text-emerald-100 mb-6">Amazing job! You're getting stronger every day!</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pb-24">
      <div className="px-6 py-6 max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(createPageUrl('WorkoutBuilder'))}
            className="p-2 rounded-full hover:bg-white/50 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800">{workout.name}</h1>
        </div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg p-4"
        >
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Drill {currentDrillIndex + 1} of {totalDrills}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
        </motion.div>

        {/* Rest Timer */}
        {isResting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
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

        {/* Current Drill */}
        {!isResting && currentDrill && (
          <motion.div
            key={currentDrillIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">
                {currentDrill.drill_title}
              </h2>
              <p className="text-slate-600">
                Set {currentSet} of {currentDrill.sets}
              </p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Target</p>
                  <p className="text-3xl font-bold text-purple-600">{currentDrill.reps}</p>
                  <p className="text-xs text-slate-500">reps</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Sets</p>
                  <p className="text-3xl font-bold text-blue-600">{currentDrill.sets}</p>
                  <p className="text-xs text-slate-500">total</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCompleteSet}
              className="w-full h-16 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-xl font-bold"
            >
              <CheckCircle className="w-6 h-6 mr-2" />
              Complete Set {currentSet}/{currentDrill.sets}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}