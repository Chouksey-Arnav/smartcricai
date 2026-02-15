import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Dumbbell, Clock, Play, CheckCircle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/common/Header';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { findWorkout, parseWorkoutIntoExercises } from '@/components/fitness/FitnessBuilderDatabase';

const bodyParts = [
  { id: 'arms', name: 'Arms', emoji: '💪' },
  { id: 'chest', name: 'Chest', emoji: '🦸' },
  { id: 'back', name: 'Back', emoji: '🏋️' },
  { id: 'legs', name: 'Legs', emoji: '🦵' },
  { id: 'shoulders', name: 'Shoulders', emoji: '💥' },
  { id: 'core', name: 'Core', emoji: '🔥' },
  { id: 'full body', name: 'Full Body', emoji: '⚡' }
];

const fitnessGoals = [
  { id: 'lose weight', name: 'Lose Weight', icon: '🔥' },
  { id: 'build muscle', name: 'Build Muscle', icon: '💪' },
  { id: 'keep fit', name: 'Keep Fit', icon: '✨' }
];

const durations = [
  { id: '<10', name: 'Under 10 min', emoji: '⚡' },
  { id: '10-15', name: '10-15 min', emoji: '⏱️' },
  { id: '15-20', name: '15-20 min', emoji: '⏰' },
  { id: '20-25', name: '20-25 min', emoji: '⌚' },
  { id: '25+', name: '25+ min', emoji: '🕐' }
];

const levels = [
  { id: 'beginner', name: 'Beginner', color: 'bg-green-100 text-green-700' },
  { id: 'intermediate', name: 'Intermediate', color: 'bg-amber-100 text-amber-700' },
  { id: 'advanced', name: 'Advanced', color: 'bg-red-100 text-red-700' },
  { id: 'pro', name: 'Pro', color: 'bg-purple-100 text-purple-700' }
];

export default function FitnessBuilder() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('beginner');
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [generatedWorkout, setGeneratedWorkout] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: premiumStatus } = useQuery({
    queryKey: ['premiumStatus', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const subs = await base44.entities.PremiumSubscription.filter({ user_email: user.email });
      return subs[0] || null;
    },
    enabled: !!user?.email,
  });

  const { data: preGeneratedWorkouts = [] } = useQuery({
    queryKey: ['preGeneratedWorkouts'],
    queryFn: async () => {
      const workouts = await base44.entities.PreGeneratedWorkout.list();
      // Filter out user-created ones (those with created_by)
      return workouts.filter(w => !w.created_by);
    },
  });

  const isPremium = premiumStatus?.is_premium || false;

  const handleGenerateWorkout = async () => {
    if (!selectedBodyPart || !selectedLevel || !selectedGoal || !selectedDuration) {
      toast.error('Please complete all selections');
      return;
    }

    if (selectedLevel === 'pro' && !isPremium) {
      toast.error('Pro level requires Premium subscription! 💎');
      return;
    }

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    const workoutData = findWorkout(selectedBodyPart, selectedLevel, selectedGoal, selectedDuration);
    
    if (!workoutData) {
      toast.error('Workout combination not found!');
      setIsGenerating(false);
      return;
    }

    const exercises = parseWorkoutIntoExercises(workoutData.workout);
    
    setGeneratedWorkout({
      exercises: exercises,
      coachNote: workoutData.coachNote
    });
    
    setStep(3);
    setIsGenerating(false);
    toast.success('Workout generated! 💪');
  };

  const saveWorkoutMutation = useMutation({
    mutationFn: async () => {
      // Calculate XP based on workout difficulty and duration
      const baseXP = 100;
      const levelMultiplier = { beginner: 1, intermediate: 1.5, advanced: 2, pro: 3 };
      const xpValue = Math.round(baseXP * (levelMultiplier[selectedLevel] || 1));

      // Save to PreGeneratedWorkout with created_by to identify user-generated ones
      const preGenData = {
        user_email: user.email,
        body_part: selectedBodyPart,
        level: selectedLevel,
        goal: selectedGoal,
        duration: 30,
        exercises: generatedWorkout.exercises,
        xp_value: xpValue
      };
      
      await base44.entities.PreGeneratedWorkout.create(preGenData);

      const workoutData = {
        user_email: user.email,
        name: `${selectedGoal?.replace(' ', ' ').toUpperCase()} - ${selectedBodyPart?.toUpperCase()} Workout`,
        drills: generatedWorkout.exercises.map(ex => ({
          drill_id: ex.id || `fitness_${Math.random().toString(36).substr(2, 9)}`,
          drill_title: ex.name,
          sets: typeof ex.sets === 'number' ? ex.sets : 3,
          reps: ex.reps || 10,
          completed_sets: 0,
          type: 'exercise',
          category: 'fitness',
          instructions: ex.instructions || '',
          rest_seconds: ex.rest_seconds || 60
        })),
        status: 'not_started',
        xp_value: preGenData.xp_value
      };

      return await base44.entities.Workout.create(workoutData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['userGeneratedWorkouts'] });
      toast.success('Workout saved! 💪');
      navigate(createPageUrl('AIWorkout'));
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-24">
      <Header title="Fitness Builder" showSettings={false} />
      
      <div className="px-6 py-4 max-w-lg mx-auto space-y-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-6 text-white"
        >
          <h2 className="font-bold text-xl mb-2">Build Your Fitness Plan</h2>
          <p className="text-orange-100 text-sm">Curated training programs for you</p>
        </motion.div>

        {/* Pre-Generated Quick Start Workouts */}
        {preGeneratedWorkouts.length > 0 && step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 shadow-lg"
          >
            <h3 className="font-bold text-slate-800 mb-3">Quick Start Workouts</h3>
            <div className="space-y-2">
              {preGeneratedWorkouts.slice(0, 3).map((workout, index) => (
                <button
                  key={workout.id}
                  onClick={async () => {
                    const workoutData = {
                      user_email: user.email,
                      name: `${workout.body_part.toUpperCase()} - ${workout.level}`,
                      drills: workout.exercises.map(ex => ({
                        drill_id: `fitness_${Math.random().toString(36).substr(2, 9)}`,
                        drill_title: ex.name,
                        sets: ex.sets,
                        reps: ex.reps,
                        completed_sets: 0,
                        type: 'exercise',
                        category: 'fitness',
                        instructions: ex.notes || '',
                        rest_seconds: ex.rest_seconds || 60
                      })),
                      status: 'not_started',
                      xp_value: workout.xp_value || 100
                    };
                    const newWorkout = await base44.entities.Workout.create(workoutData);
                    queryClient.invalidateQueries({ queryKey: ['workouts'] });
                    toast.success('Workout ready! Starting now!');
                    navigate(createPageUrl(`WorkoutPlayer?id=${newWorkout.id}`));
                  }}
                  className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border border-orange-200 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 capitalize">{workout.body_part} Workout</p>
                      <p className="text-sm text-slate-600">{workout.exercises.length} exercises • {workout.level}</p>
                    </div>
                    <div className="px-3 py-1 bg-orange-500 rounded-full text-xs font-bold text-white">
                      {workout.duration} min
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 1: Body Part */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-slate-800 mb-3">Select Target Area</h3>
              <div className="grid grid-cols-2 gap-3">
                {bodyParts.map(part => (
                  <button
                    key={part.id}
                    onClick={() => setSelectedBodyPart(part.id)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all",
                      selectedBodyPart === part.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div className="text-3xl mb-2">{part.emoji}</div>
                    <div className="font-semibold text-slate-800 text-sm">{part.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!selectedBodyPart}
              className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-lg"
            >
              Next: Choose Level & Goal
            </Button>
          </motion.div>
        )}

        {/* Step 2: Level, Goal, Duration */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-slate-800 mb-3">Fitness Level</h3>
              <div className="grid grid-cols-2 gap-3">
                {levels.map(lv => {
                  const isLocked = lv.id === 'pro' && !isPremium;
                  return (
                    <button
                      key={lv.id}
                      onClick={() => {
                        if (isLocked) {
                          toast('Pro level requires Premium! 🔓', { icon: '💎', duration: 3000 });
                        } else {
                          setSelectedLevel(lv.id);
                        }
                      }}
                      className={cn(
                        "p-3 rounded-xl border-2 transition-all relative",
                        selectedLevel === lv.id
                          ? "border-orange-500 bg-orange-50"
                          : "border-slate-200 hover:border-slate-300",
                        isLocked && "opacity-60"
                      )}
                    >
                      {isLocked && (
                        <div className="absolute top-1 right-1">
                          <span className="text-xs">🔒</span>
                        </div>
                      )}
                      <div className={cn("text-sm font-semibold", lv.color, "inline-block px-2 py-1 rounded-full")}>
                        {lv.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-slate-800 mb-3">Fitness Goal</h3>
              <div className="grid grid-cols-3 gap-3">
                {fitnessGoals.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGoal(g.id)}
                    className={cn(
                      "p-3 rounded-xl border-2 transition-all",
                      selectedGoal === g.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div className="text-2xl mb-1">{g.icon}</div>
                    <div className="text-xs font-medium text-slate-700">{g.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Duration
              </h3>
              <div className="space-y-2">
                {durations.map(dur => (
                  <button
                    key={dur.id}
                    onClick={() => setSelectedDuration(dur.id)}
                    className={cn(
                      "w-full p-3 rounded-xl border-2 transition-all text-left flex items-center gap-2",
                      selectedDuration === dur.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <span className="text-xl">{dur.emoji}</span>
                    <span className="font-semibold text-slate-800">{dur.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleGenerateWorkout}
                disabled={isGenerating || !selectedGoal || !selectedDuration}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Workout'
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Generated Workout */}
        {step === 3 && generatedWorkout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-8 h-8" />
                <h3 className="font-bold text-xl">Your Workout is Ready!</h3>
              </div>
              <p className="text-emerald-100 text-sm mb-3">
                {generatedWorkout.exercises.length} exercises • {selectedLevel} level
              </p>
              <p className="text-white text-sm italic">
                💡 {generatedWorkout.coachNote}
              </p>
            </div>

            <div className="space-y-3">
              {generatedWorkout.exercises.map((exercise, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-5 shadow-lg"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                      <span className="font-bold text-orange-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800">{exercise.name}</h4>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mb-2">
                    <div className="bg-slate-50 px-3 py-2 rounded-lg">
                      <p className="text-xs text-slate-500">Sets</p>
                      <p className="font-bold text-slate-800">{exercise.sets}</p>
                    </div>
                    <div className="bg-slate-50 px-3 py-2 rounded-lg">
                      <p className="text-xs text-slate-500">Reps</p>
                      <p className="font-bold text-slate-800">{exercise.reps}</p>
                    </div>
                    {exercise.rest_seconds > 0 && (
                      <div className="bg-slate-50 px-3 py-2 rounded-lg">
                        <p className="text-xs text-slate-500">Rest</p>
                        <p className="font-bold text-slate-800">{exercise.rest_seconds}s</p>
                      </div>
                    )}
                  </div>

                  {exercise.instructions && (
                    <p className="text-sm text-slate-600">{exercise.instructions}</p>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => saveWorkoutMutation.mutate()}
                disabled={saveWorkoutMutation.isPending}
                className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                {saveWorkoutMutation.isPending ? 'Saving...' : 'Save to My Workouts'}
              </Button>
              <Button
                onClick={() => { setStep(2); setGeneratedWorkout(null); }}
                variant="outline"
                className="w-full h-12"
              >
                🔄 Generate Different Workout
              </Button>
              <Button
                onClick={() => { setStep(1); setGeneratedWorkout(null); setSelectedBodyPart(null); setSelectedGoal(null); setSelectedDuration(null); }}
                variant="outline"
                className="w-full h-12 border-red-200 text-red-600 hover:bg-red-50"
              >
                <X className="w-5 h-5 mr-2" />
                Discard & Back to Fitness Builder
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}