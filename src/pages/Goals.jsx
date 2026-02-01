import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Header from '@/components/common/Header';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const goalQuestions = [
  {
    question: "What's your ultimate cricket dream?",
    field: 'ultimate_dream',
    options: [
      { value: 'play_professionally', label: 'Play Professional Cricket', emoji: '🏆' },
      { value: 'represent_country', label: 'Represent My Country', emoji: '🌍' },
      { value: 'master_technique', label: 'Master My Technique', emoji: '🎯' },
      { value: 'become_all_rounder', label: 'Become an All-Rounder', emoji: '💪' },
      { value: 'be_best_in_team', label: 'Be Best in My Team', emoji: '⭐' }
    ]
  },
  {
    question: "Where do you see yourself in 1 year?",
    field: 'one_year_vision',
    multiple: true,
    options: [
      { value: 'higher_level', label: 'Playing at Higher Level', emoji: '📈' },
      { value: 'captain', label: 'Captain of My Team', emoji: '👑' },
      { value: 'consistent_performer', label: 'Consistent Performer', emoji: '💯' },
      { value: 'all_round_skills', label: 'All-Round Skills', emoji: '🌟' },
      { value: 'mentally_strong', label: 'Mentally Stronger', emoji: '🧠' }
    ]
  },
  {
    question: "What's your biggest batting goal?",
    field: 'batting_goal',
    options: [
      { value: 'score_century', label: 'Score a Century', emoji: '💯' },
      { value: 'improve_strike_rate', label: 'Improve Strike Rate', emoji: '⚡' },
      { value: 'perfect_technique', label: 'Perfect My Technique', emoji: '🎯' },
      { value: 'play_all_shots', label: 'Play All Shots', emoji: '🏏' },
      { value: 'consistency', label: 'Score Runs Consistently', emoji: '📊' }
    ]
  },
  {
    question: "What's your main bowling goal?",
    field: 'bowling_goal',
    options: [
      { value: 'take_5_wickets', label: 'Take 5 Wickets in Match', emoji: '🎯' },
      { value: 'perfect_yorker', label: 'Perfect My Yorker', emoji: '⚡' },
      { value: 'bowl_faster', label: 'Bowl Faster', emoji: '🔥' },
      { value: 'more_spin', label: 'Generate More Spin', emoji: '🌀' },
      { value: 'dont_bowl', label: "I Don't Bowl", emoji: '🚫' }
    ]
  },
  {
    question: "Fielding goals?",
    field: 'fielding_goal',
    multiple: true,
    options: [
      { value: 'safe_hands', label: 'Never Drop Catches', emoji: '🧤' },
      { value: 'direct_hits', label: 'Direct Hit Run-Outs', emoji: '🎯' },
      { value: 'dive_stops', label: 'Diving Stops', emoji: '🤿' },
      { value: 'fast_throws', label: 'Faster Throws', emoji: '⚡' },
      { value: 'positioning', label: 'Better Positioning', emoji: '📍' }
    ]
  },
  {
    question: "Mental game goals?",
    field: 'mental_goals',
    multiple: true,
    options: [
      { value: 'stay_calm', label: 'Stay Calm Under Pressure', emoji: '😌' },
      { value: 'confidence', label: 'Build Confidence', emoji: '💪' },
      { value: 'focus', label: 'Improve Focus', emoji: '👁️' },
      { value: 'positive_mindset', label: 'Stay Positive', emoji: '✨' },
      { value: 'no_fear', label: 'Play Without Fear', emoji: '🦁' }
    ]
  },
  {
    question: "Fitness goals?",
    field: 'fitness_goals',
    multiple: true,
    options: [
      { value: 'speed', label: 'Increase Speed', emoji: '⚡' },
      { value: 'strength', label: 'Build Strength', emoji: '💪' },
      { value: 'stamina', label: 'Improve Stamina', emoji: '🏃' },
      { value: 'flexibility', label: 'Better Flexibility', emoji: '🧘' },
      { value: 'injury_prevention', label: 'Prevent Injuries', emoji: '🛡️' }
    ]
  },
  {
    question: "This season's target?",
    field: 'season_target',
    options: [
      { value: 'runs', label: '500+ Runs', emoji: '🏏' },
      { value: 'wickets', label: '20+ Wickets', emoji: '⚡' },
      { value: 'average', label: 'Batting Average 50+', emoji: '📈' },
      { value: 'mom', label: 'Win Man of the Match', emoji: '🏆' },
      { value: 'team_success', label: 'Help Team Win Trophy', emoji: '🥇' }
    ]
  },
  {
    question: "Match performance goals?",
    field: 'match_goals',
    multiple: true,
    options: [
      { value: 'big_innings', label: 'Play Big Innings', emoji: '💯' },
      { value: 'finish_games', label: 'Finish Close Games', emoji: '🎯' },
      { value: 'partnerships', label: 'Build Big Partnerships', emoji: '🤝' },
      { value: 'clutch_moments', label: 'Perform in Clutch Moments', emoji: '⚡' },
      { value: 'consistency', label: 'Consistent Performance', emoji: '📊' }
    ]
  },
  {
    question: "Daily training commitment?",
    field: 'training_commitment',
    options: [
      { value: 'everyday', label: 'Train Every Day', emoji: '🔥' },
      { value: '5_days', label: '5 Days a Week', emoji: '💪' },
      { value: '3_days', label: '3 Days a Week', emoji: '✨' },
      { value: 'weekends', label: 'Weekends Only', emoji: '📅' },
      { value: 'flexible', label: 'As Much As Possible', emoji: '🎯' }
    ]
  }
];

export default function Goals() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: existingGoals } = useQuery({
    queryKey: ['userGoals', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const goals = await base44.entities.UserProfile.filter({ user_email: user.email });
      return goals[0] || null;
    },
    enabled: !!user?.email,
  });

  const saveGoalsMutation = useMutation({
    mutationFn: async () => {
      const goalsData = {
        user_email: user.email,
        ...answers,
        goals_completed: true,
      };

      let updatedProfile;
      if (existingGoals?.id) {
        updatedProfile = await base44.entities.UserProfile.update(existingGoals.id, goalsData);
      } else {
        updatedProfile = await base44.entities.UserProfile.create(goalsData);
      }

      // === RULE-BASED AUTO-CONFIGURATION BASED ON GOALS - NO LLM CREDITS ===
      
      // 1. Create recommended workout based on fitness goals
      const fitnessGoals = answers.fitness_goals || [];
      const mentalGoals = answers.mental_goals || [];
      
      // Get user's current skill level
      const progress = await base44.entities.UserProgress.filter({ user_email: user.email });
      const skillLevel = progress[0]?.skill_level || 'beginner';

      // Determine workout type based on fitness goals
      let workoutGoal = 'strength';
      let bodyPart = 'full_body';
      
      if (fitnessGoals.includes('speed') || fitnessGoals.includes('stamina')) {
        workoutGoal = 'endurance';
      }
      if (fitnessGoals.includes('flexibility')) {
        workoutGoal = 'flexibility';
      }
      if (fitnessGoals.includes('strength')) {
        workoutGoal = 'strength';
      }

      // Find and create goal-specific workout
      const goalWorkouts = await base44.entities.PreGeneratedWorkout.filter({
        body_part: bodyPart,
        goal: workoutGoal,
        level: skillLevel,
        duration: 30
      });

      if (goalWorkouts.length > 0) {
        const selectedWorkout = goalWorkouts[0];
        const drills = selectedWorkout.exercises.map(ex => ({
          drill_id: 'goal_' + Math.random().toString(36).substr(2, 9),
          drill_title: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          completed_sets: 0,
          type: 'exercise',
          category: 'fitness',
          instructions: ex.notes,
          rest_seconds: ex.rest_seconds
        }));

        await base44.entities.Workout.create({
          user_email: user.email,
          name: `Goal-Based ${workoutGoal.toUpperCase()} Training`,
          drills: drills,
          status: 'not_started'
        });
      }

      // 2. Create mental routine if mental goals selected
      if (mentalGoals.length > 0) {
        const mentalCategories = {
          'stay_calm': 'pressure',
          'confidence': 'confidence',
          'focus': 'focus',
          'positive_mindset': 'match-day-calm',
          'no_fear': 'confidence'
        };

        const primaryMentalGoal = mentalGoals[0];
        const mentalCategory = mentalCategories[primaryMentalGoal] || 'focus';

        const existingRoutines = await base44.entities.MentalRoutine.filter({
          category: mentalCategory,
          difficulty: skillLevel
        });

        // If no routine exists for this category, create one
        if (existingRoutines.length === 0) {
          const routineData = {
            title: `${mentalCategory.charAt(0).toUpperCase() + mentalCategory.slice(1)} Training`,
            category: mentalCategory,
            duration_seconds: 600,
            description: `Build your ${mentalCategory} skills`,
            difficulty: skillLevel,
            calming_sound: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8e1c1ab.mp3',
            steps: [
              { instruction: 'Close your eyes and take 3 deep breaths', duration_seconds: 60 },
              { instruction: 'Focus on your breathing rhythm', duration_seconds: 120 },
              { instruction: 'Visualize yourself succeeding in your goal', duration_seconds: 180 },
              { instruction: 'Feel the confidence building within you', duration_seconds: 120 },
              { instruction: 'Open your eyes feeling refreshed and ready', duration_seconds: 120 }
            ]
          };
          await base44.entities.MentalRoutine.create(routineData);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userGoals'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['mentalRoutines'] });
      toast.success('Goals saved! Your training is now ultra-personalized! 🎯');
      navigate('/NewHome');
    },
  });

  const currentQuestion = goalQuestions[currentStep];
  const isLastStep = currentStep === goalQuestions.length - 1;

  const handleAnswer = (value) => {
    if (currentQuestion.multiple) {
      const currentValues = answers[currentQuestion.field] || [];
      if (currentValues.includes(value)) {
        setAnswers({
          ...answers,
          [currentQuestion.field]: currentValues.filter(v => v !== value)
        });
      } else {
        setAnswers({
          ...answers,
          [currentQuestion.field]: [...currentValues, value]
        });
      }
    } else {
      setAnswers({
        ...answers,
        [currentQuestion.field]: value
      });
    }
  };

  const handleNext = () => {
    if (currentQuestion.multiple) {
      const selected = answers[currentQuestion.field] || [];
      if (selected.length === 0) {
        toast.error('Please select at least one option');
        return;
      }
    } else {
      if (!answers[currentQuestion.field]) {
        toast.error('Please select an option');
        return;
      }
    }

    if (isLastStep) {
      saveGoalsMutation.mutate();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pb-24 pt-8">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white mb-8 text-center"
        >
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Set Your Goals!</h1>
          <p className="text-purple-100">Let's map out your cricket journey together</p>
        </motion.div>

        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Question {currentStep + 1} of {goalQuestions.length}</span>
            <span>{Math.round(((currentStep + 1) / goalQuestions.length) * 100)}%</span>
          </div>
          <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / goalQuestions.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              {currentQuestion.question}
            </h2>

            <div className={cn(
              "grid gap-4 mb-8",
              currentQuestion.options.length <= 3 ? "grid-cols-1" : "grid-cols-2"
            )}>
              {currentQuestion.options.map((option) => {
                const isSelected = currentQuestion.multiple
                  ? (answers[currentQuestion.field] || []).includes(option.value)
                  : answers[currentQuestion.field] === option.value;

                return (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option.value)}
                    className={cn(
                      "p-6 rounded-2xl border-2 transition-all text-left",
                      isSelected
                        ? "border-purple-500 bg-purple-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{option.emoji}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800">{option.label}</div>
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-6 h-6 text-purple-500" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex gap-4">
              {currentStep > 0 && (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 h-14"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={saveGoalsMutation.isPending}
                className="flex-1 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg"
              >
                {saveGoalsMutation.isPending ? (
                  'Saving...'
                ) : isLastStep ? (
                  <>
                    Finish <CheckCircle className="ml-2 w-5 h-5" />
                  </>
                ) : (
                  <>
                    Next <ChevronRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}