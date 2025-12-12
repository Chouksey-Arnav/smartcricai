import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const skillLevels = [
  { id: 'beginner', label: 'Beginner', emoji: '🌱', description: 'Just starting to learn cricket' },
  { id: 'intermediate', label: 'Intermediate', emoji: '🏏', description: 'Know the basics, want to improve' },
  { id: 'advanced', label: 'Advanced', emoji: '🌟', description: 'Experienced player seeking mastery' },
];

const ageRanges = [
  { id: '11-12', label: '11-12 years' },
  { id: '13-14', label: '13-14 years' },
  { id: '15+', label: '15+ years' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [ageRange, setAgeRange] = useState('');

  const saveMutation = useMutation({
    mutationFn: async () => {
      const user = await base44.auth.me();
      await base44.entities.UserProgress.create({
        user_email: user.email,
        display_name: displayName,
        skill_level: skillLevel,
        age_range: ageRange,
        onboarding_complete: true,
        current_streak: 0,
        longest_streak: 0,
        total_practice_minutes: 0,
        completed_drills: [],
        completed_quizzes: [],
        badges: [],
        quiz_scores: [],
      });
    },
    onSuccess: () => {
      navigate(createPageUrl('Home'));
    },
  });

  const steps = [
    {
      title: "Welcome to SmartCrick Coach! 🏏",
      content: (
        <div className="space-y-6">
          <p className="text-slate-600 text-center">
            Your personal AI cricket coach is here to help you become a better player!
          </p>
          <div className="space-y-4">
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="What should we call you?"
              className="text-center text-lg py-6"
            />
          </div>
        </div>
      ),
      canProceed: displayName.length >= 2,
    },
    {
      title: "What's your skill level?",
      content: (
        <div className="space-y-3">
          {skillLevels.map((level) => (
            <motion.button
              key={level.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSkillLevel(level.id)}
              className={cn(
                "w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4",
                skillLevel === level.id
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <span className="text-3xl">{level.emoji}</span>
              <div>
                <p className="font-semibold text-slate-800">{level.label}</p>
                <p className="text-sm text-slate-500">{level.description}</p>
              </div>
              {skillLevel === level.id && (
                <Check className="w-5 h-5 text-emerald-500 ml-auto" />
              )}
            </motion.button>
          ))}
        </div>
      ),
      canProceed: !!skillLevel,
    },
    {
      title: "How old are you?",
      content: (
        <div className="space-y-3">
          {ageRanges.map((age) => (
            <motion.button
              key={age.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAgeRange(age.id)}
              className={cn(
                "w-full p-4 rounded-2xl border-2 text-center transition-all",
                ageRange === age.id
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <p className="font-semibold text-slate-800">{age.label}</p>
            </motion.button>
          ))}
          
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                We use this to personalize your experience. Your information is kept private and safe.
              </p>
            </div>
          </div>
        </div>
      ),
      canProceed: !!ageRange,
    },
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      saveMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
      {/* Progress */}
      <div className="px-6 pt-8">
        <div className="flex gap-2 max-w-md mx-auto">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all",
                index <= step ? "bg-emerald-500" : "bg-slate-200"
              )}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-md mx-auto w-full"
          >
            <h1 className="text-2xl font-bold text-slate-800 text-center mb-8">
              {currentStep.title}
            </h1>
            {currentStep.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4">
        <div className="max-w-md mx-auto flex gap-3">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          
          <Button
            onClick={handleNext}
            disabled={!currentStep.canProceed || saveMutation.isPending}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 gap-2"
          >
            {saveMutation.isPending ? 'Setting up...' : 
             step === steps.length - 1 ? "Let's Go!" : 'Continue'}
            {!saveMutation.isPending && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}