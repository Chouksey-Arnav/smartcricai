import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Dumbbell, Clock, Play, CheckCircle, Loader2, X, Zap, Target, TrendingUp, Sparkles, Award, Trophy, Flame, Heart, RotateCcw, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/common/Header';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { findWorkout, parseWorkoutIntoExercises } from '@/components/fitness/FitnessBuilderDatabase';
import QuickStartWorkoutsList from '@/components/fitness/QuickStartWorkoutsList';

const bodyParts = [
  { id: 'arms', name: 'Arms', icon: Dumbbell },
  { id: 'chest', name: 'Chest', icon: Zap },
  { id: 'back', name: 'Back', icon: Target },
  { id: 'legs', name: 'Legs', icon: TrendingUp },
  { id: 'shoulders', name: 'Shoulders', icon: Sparkles },
  { id: 'core', name: 'Core', icon: Award },
  { id: 'full body', name: 'Full Body', icon: Trophy }
];

const fitnessGoals = [
  { id: 'lose weight', name: 'Lose Weight', icon: Flame },
  { id: 'build muscle', name: 'Build Muscle', icon: Dumbbell },
  { id: 'keep fit', name: 'Keep Fit', icon: Heart }
];

const durations = [
  { id: '<10', name: 'Under 10 min', icon: Zap },
  { id: '10-15', name: '10-15 min', icon: Clock },
  { id: '15-20', name: '15-20 min', icon: Clock },
  { id: '20-25', name: '20-25 min', icon: Clock },
  { id: '25+', name: '25+ min', icon: Clock }
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
  const [searchQuery, setSearchQuery] = useState('');

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

  const { data: premiumStatus } = useQuery({
    queryKey: ['premiumStatus', user?.email || 'guest'],
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
      const allWorkouts = await base44.entities.PreGeneratedWorkout.list();
      return allWorkouts;
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
    
    setStep(4);
    setIsGenerating(false);
    toast.success('Workout generated! 💪');
  };

  const saveWorkoutMutation = useMutation({
    mutationFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const baseXP = 100;
      const levelMultiplier = { beginner: 1, intermediate: 1.5, advanced: 2, pro: 3 };
      const xpValue = Math.round(baseXP * (levelMultiplier[selectedLevel] || 1));

      const preGenData = {
        user_email: guestEmail,
        body_part: selectedBodyPart,
        level: selectedLevel,
        goal: selectedGoal,
        duration: 30,
        exercises: generatedWorkout.exercises,
        xp_value: xpValue
      };
      
      await base44.entities.PreGeneratedWorkout.create(preGenData);

      const workoutData = {
        user_email: guestEmail,
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
    onError: (error) => {
      toast.error(error.message);
    }
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

        {/* Step 1: Featured Workouts */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl p-5 shadow-lg min-h-[60vh]">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Featured Workouts
              </h3>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search workouts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <QuickStartWorkoutsList user={user} isPremium={isPremium} searchQuery={searchQuery} />
            </div>
            <Button
              onClick={() => setStep(2)}
              variant="outline"
              className="w-full h-14 border-2 border-purple-400 text-purple-600 hover:bg-purple-50 text-base font-semibold"
            >
              + Create Custom Workout
            </Button>
          </motion.div>
        )}

        {/* Step 2: Select Target Area (Custom) */}
        {step === 2 && (
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
                    <part.icon className="w-10 h-10 text-orange-500 mx-auto mb-2" />
                    <div className="font-semibold text-slate-800 text-sm">{part.name}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1">Back</Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedBodyPart}
                className="flex-1 h-12 bg-orange-500 hover:bg-orange-600"
              >
                Next: Level & Goal
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Level, Goal, Duration */}
        {step === 3 && (
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
                    <g.icon className="w-8 h-8 text-orange-500 mx-auto mb-1" />
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
                    <dur.icon className="w-5 h-5 text-orange-500 shrink-0" />
                    <span className="font-semibold text-slate-800">{dur.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(2)}
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

        {/* Step 4: Generated Workout */}
        {step === 4 && generatedWorkout && (
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
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <p className="text-white text-sm italic">
                  {generatedWorkout.coachNote}
                </p>
              </div>
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
                <RotateCcw className="w-5 h-5 mr-2" />
                Generate Different Workout
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