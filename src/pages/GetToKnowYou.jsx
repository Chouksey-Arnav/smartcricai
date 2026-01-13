import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const quizSteps = [
  {
    question: "What's your primary cricket role?",
    field: 'cricket_role',
    options: [
      { value: 'batsman', label: 'Batsman', emoji: '🏏' },
      { value: 'bowler', label: 'Bowler', emoji: '⚡' },
      { value: 'all_rounder', label: 'All-Rounder', emoji: '💪' },
      { value: 'wicket_keeper', label: 'Wicket Keeper', emoji: '🧤' }
    ]
  },
  {
    question: "How do you bat?",
    field: 'batting_style',
    options: [
      { value: 'right_handed', label: 'Right-Handed', emoji: '👉' },
      { value: 'left_handed', label: 'Left-Handed', emoji: '👈' }
    ]
  },
  {
    question: "What's your bowling style?",
    field: 'bowling_style',
    options: [
      { value: 'fast', label: 'Fast Bowling', emoji: '🔥' },
      { value: 'medium', label: 'Medium Pace', emoji: '⚡' },
      { value: 'spin', label: 'Spin Bowling', emoji: '🌀' },
      { value: 'none', label: "I Don't Bowl", emoji: '🚫' }
    ]
  },
  {
    question: "How long have you been playing cricket?",
    field: 'experience_years',
    options: [
      { value: 1, label: 'Less than 1 year', emoji: '🌱' },
      { value: 2, label: '1-2 years', emoji: '🌿' },
      { value: 4, label: '3-5 years', emoji: '🌳' },
      { value: 7, label: '5+ years', emoji: '🏆' }
    ]
  },
  {
    question: "How often do you train?",
    field: 'training_frequency',
    options: [
      { value: 'daily', label: 'Every Day', emoji: '🔥' },
      { value: '3-4_times_week', label: '3-4 Times/Week', emoji: '💪' },
      { value: '1-2_times_week', label: '1-2 Times/Week', emoji: '✨' },
      { value: 'occasional', label: 'Occasionally', emoji: '🎯' }
    ]
  },
  {
    question: "What are your main training goals? (Select all)",
    field: 'main_goals',
    multiple: true,
    options: [
      { value: 'improve_technique', label: 'Improve Technique', emoji: '🎯' },
      { value: 'increase_power', label: 'Increase Power', emoji: '💥' },
      { value: 'build_consistency', label: 'Build Consistency', emoji: '📈' },
      { value: 'mental_strength', label: 'Mental Strength', emoji: '🧠' },
      { value: 'match_awareness', label: 'Match Awareness', emoji: '👁️' },
      { value: 'fitness', label: 'Fitness & Stamina', emoji: '🏃' }
    ]
  },
  {
    question: "Which formats do you play? (Select all)",
    field: 'preferred_formats',
    multiple: true,
    options: [
      { value: 'test', label: 'Test Cricket', emoji: '🏛️' },
      { value: 'odi', label: 'ODI', emoji: '🌍' },
      { value: 't20', label: 'T20', emoji: '⚡' },
      { value: 'club', label: 'Club/Local', emoji: '🏘️' }
    ]
  }
];

export default function GetToKnowYou() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: existingProfile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const profiles = await base44.entities.UserProfile.filter({ user_email: user.email });
      return profiles[0] || null;
    },
    enabled: !!user?.email,
  });

  const saveProfileMutation = useMutation({
    mutationFn: async () => {
      const profileData = {
        user_email: user.email,
        ...answers,
        quiz_completed: true,
        match_iq_rating: 50 // Starting IQ
      };

      if (existingProfile?.id) {
        return await base44.entities.UserProfile.update(existingProfile.id, profileData);
      } else {
        return await base44.entities.UserProfile.create(profileData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Profile saved! Your training is now personalized! 🎉');
      navigate('/');
    },
  });

  const currentQuestion = quizSteps[currentStep];
  const isLastStep = currentStep === quizSteps.length - 1;

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
      saveProfileMutation.mutate();
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white mb-8 text-center"
        >
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Let's Get to Know You!</h1>
          <p className="text-purple-100">Help us personalize your cricket training experience</p>
        </motion.div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Question {currentStep + 1} of {quizSteps.length}</span>
            <span>{Math.round(((currentStep + 1) / quizSteps.length) * 100)}%</span>
          </div>
          <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / quizSteps.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
        </div>

        {/* Question */}
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
              currentQuestion.options.length === 2 ? "grid-cols-2" : 
              currentQuestion.options.length <= 4 ? "grid-cols-2" : "grid-cols-1"
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
                disabled={saveProfileMutation.isPending}
                className="flex-1 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg"
              >
                {saveProfileMutation.isPending ? (
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