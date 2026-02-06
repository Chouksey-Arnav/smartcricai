import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Dumbbell, Zap, Clock, AlertCircle, Play, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/common/Header';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { generateWorkout } from '@/utils/exercisePools';

const bodyParts = [
  { id: 'arm', label: 'Arms', emoji: '💪' },
  { id: 'chest', label: 'Chest', emoji: '🦸' },
  { id: 'core', label: 'Core', emoji: '🔥' },
  { id: 'leg', label: 'Legs', emoji: '🦵' },
  { id: 'shoulder', label: 'Shoulders', emoji: '💥' },
  { id: 'back', label: 'Back', emoji: '🏋️' },
  { id: 'full_body', label: 'Full Body', emoji: '⚡' }
];

const fitnessGoals = [
  { id: 'lose_weight', label: 'Lose Weight', icon: '🔥' },
  { id: 'build_muscle', label: 'Build Muscle', icon: '💪' },
  { id: 'keep_fit', label: 'Keep Fit', icon: '✨' }
];

const durations = [
  { id: 'short', label: '< 10 min', minutes: 8 },
  { id: 'medium', label: '10-15 min', minutes: 12 },
  { id: 'long', label: '15-20 min', minutes: 18 },
  { id: 'very_long', label: '20-25 min', minutes: 23 },
  { id: 'ultra', label: '25+ min', minutes: 30 }
];

const levels = [
  { id: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-700', locked: false },
  { id: 'intermediate', label: 'Intermediate', color: 'bg-amber-100 text-amber-700', locked: false },
  { id: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-700', locked: false },
  { id: 'pro', label: 'Pro', color: 'bg-purple-100 text-purple-700', locked: true }
];

export default function FitnessBuilder() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [selectedParts, setSelectedParts] = useState([]);
  const [level, setLevel] = useState('beginner');
  const [injuredArea, setInjuredArea] = useState(null);
  const [goal, setGoal] = useState('keep_fit');
  const [duration, setDuration] = useState('medium');
  const [generatedWorkout, setGeneratedWorkout] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: progress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.UserProgress.filter({ user_email: user.email });
      return results[0] || null;
    },
    enabled: !!user?.email,
  });

  // Check if pro is unlocked (e.g., completed 20+ drills)
  const isProUnlocked = (progress?.completed_drills?.length || 0) >= 20;

  const toggleBodyPart = (part) => {
    setSelectedParts([part]);
  };

  const handleGenerateWorkout = async () => {
    if (selectedParts.length === 0) {
      toast.error('Please select at least one body part');
      return;
    }

    setIsGenerating(true);

    // Simulate brief loading for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const bodyPart = selectedParts[0];
      const targetDurationMinutes = durations.find(d => d.id === duration).minutes;
      
      // Generate unique workout from curated exercise pools
      const workout = generateWorkout(bodyPart, goal, level, targetDurationMinutes);
      
      if (workout && workout.length >= 10) {
        setGeneratedWorkout(workout);
        setStep(3);
        toast.success(`Workout generated! ${workout.length} exercises 💪`);
      } else {
        toast.error('Unable to generate workout. Please try different options.');
      }
    } catch (error) {
      console.error('Failed to generate workout:', error);
      toast.error('Failed to generate workout. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveWorkoutMutation = useMutation({
    mutationFn: async () => {
      const bodyPart = selectedParts[0] || 'full_body';
      const goalMapping = {
        'lose_weight': 'endurance',
        'build_muscle': 'strength',
        'keep_fit': 'flexibility'
      };
      const targetDurationMinutes = durations.find(d => d.id === duration).minutes;
      
      const workoutData = {
        body_part: bodyPart,
        goal: goalMapping[goal] || 'strength',
        duration: targetDurationMinutes,
        level: level,
        exercises: generatedWorkout.map(ex => ({
          name: ex.name,
          sets: ex.sets || 3,
          reps: ex.reps || '12',
          rest_seconds: ex.rest_seconds || 60,
          notes: ex.instructions || ''
        }))
      };
      return await base44.entities.PreGeneratedWorkout.create(workoutData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preGeneratedWorkouts'] });
      toast.success('Workout saved to AI Workout! 💪');
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
          <p className="text-orange-100 text-sm">Personalized workouts for cricket fitness</p>
        </motion.div>

        {/* Step 1: Body Parts */}
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
                    onClick={() => toggleBodyPart(part.id)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all",
                      selectedParts.includes(part.id)
                        ? "border-orange-500 bg-orange-50"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div className="text-3xl mb-2">{part.emoji}</div>
                    <div className="font-semibold text-slate-800 text-sm">{part.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={selectedParts.length === 0}
              className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-lg"
            >
              Next: Choose Level & Goal
            </Button>
          </motion.div>
        )}

        {/* Step 2: Level, Goal, Duration, Injury */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Fitness Level */}
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-slate-800 mb-3">Fitness Level</h3>
              <div className="grid grid-cols-2 gap-3">
                {levels.map(lv => (
                  <button
                    key={lv.id}
                    onClick={() => !lv.locked || isProUnlocked ? setLevel(lv.id) : toast.error('Complete 20+ drills to unlock Pro')}
                    disabled={lv.locked && !isProUnlocked}
                    className={cn(
                      "p-3 rounded-xl border-2 transition-all relative",
                      level === lv.id
                        ? "border-orange-500 bg-orange-50"
                        : lv.locked && !isProUnlocked
                        ? "border-slate-200 opacity-50 cursor-not-allowed"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div className={cn("text-sm font-semibold", lv.color, "inline-block px-2 py-1 rounded-full")}>
                      {lv.label}
                    </div>
                    {lv.locked && !isProUnlocked && (
                      <div className="absolute top-2 right-2 text-slate-400">🔒</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Fitness Goal */}
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-slate-800 mb-3">Fitness Goal</h3>
              <div className="grid grid-cols-3 gap-3">
                {fitnessGoals.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={cn(
                      "p-3 rounded-xl border-2 transition-all",
                      goal === g.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div className="text-2xl mb-1">{g.icon}</div>
                    <div className="text-xs font-medium text-slate-700">{g.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Duration
              </h3>
              <div className="space-y-2">
                {durations.map(dur => (
                  <button
                    key={dur.id}
                    onClick={() => setDuration(dur.id)}
                    className={cn(
                      "w-full p-3 rounded-xl border-2 transition-all text-left",
                      duration === dur.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div className="font-semibold text-slate-800">{dur.label}</div>
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
                disabled={isGenerating}
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
              <p className="text-emerald-100 text-sm">
                {generatedWorkout.length} exercises • {level} level
              </p>
            </div>

            <div className="space-y-3">
              {generatedWorkout.map((exercise, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
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
                  
                  <div className="flex gap-4 mb-3">
                    <div className="bg-slate-50 px-3 py-2 rounded-lg">
                      <p className="text-xs text-slate-500">Sets</p>
                      <p className="font-bold text-slate-800">{exercise.sets}</p>
                    </div>
                    <div className="bg-slate-50 px-3 py-2 rounded-lg">
                      <p className="text-xs text-slate-500">Reps</p>
                      <p className="font-bold text-slate-800">{exercise.reps}</p>
                    </div>
                    <div className="bg-slate-50 px-3 py-2 rounded-lg">
                      <p className="text-xs text-slate-500">Rest</p>
                      <p className="font-bold text-slate-800">{exercise.rest_seconds}s</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600">{exercise.notes}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => { setStep(2); setGeneratedWorkout(null); }}
                variant="outline"
                className="flex-1"
              >
                Regenerate
              </Button>
              <Button
                onClick={() => saveWorkoutMutation.mutate()}
                disabled={saveWorkoutMutation.isPending}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              >
                <Play className="w-5 h-5 mr-2" />
                {saveWorkoutMutation.isPending ? 'Saving...' : 'Save & Start'}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}