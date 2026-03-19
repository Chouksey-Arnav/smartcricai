import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/common/Header';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { getPreGeneratedMentalRoutine } from '@/components/mental/PreGeneratedMentalRoutines';

const focusAreas = [
  { value: 'match_anxiety', label: 'Match Day Anxiety' },
  { value: 'confidence', label: 'Building Confidence' },
  { value: 'pressure', label: 'Handling Pressure' },
  { value: 'focus', label: 'Improving Focus' },
  { value: 'recovery', label: 'Mental Recovery' },
  { value: 'visualization', label: 'Visualization Practice' },
  { value: 'concentration', label: 'Deep Concentration' },
  { value: 'motivation', label: 'Boosting Motivation' },
  { value: 'dealing_with_failure', label: 'Dealing with Failure' },
  { value: 'staying_calm', label: 'Staying Calm' },
  { value: 'positive_mindset', label: 'Positive Mindset' },
];

const sessionLengths = [
  { value: 300, label: '5 minutes' },
  { value: 600, label: '10 minutes' },
  { value: 900, label: '15 minutes' },
  { value: 1200, label: '20 minutes' },
  { value: 1800, label: '30 minutes' },
  { value: 2700, label: '45 minutes' },
  { value: 3600, label: '60 minutes' },
];

export default function MentalTrainingCreator() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [focusArea, setFocusArea] = useState('');
  const [sessionLength, setSessionLength] = useState(600);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try { return await base44.auth.me(); } catch { return null; }
    },
  });

  const getGuestId = () => {
    if (user?.email) return user.email;
    let guestId = localStorage.getItem('smartcrick_guest_id');
    if (!guestId) {
      guestId = `guest_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
      localStorage.setItem('smartcrick_guest_id', guestId);
    }
    return guestId;
  };

  const saveMentalRoutineMutation = useMutation({
    mutationFn: async (routine) => {
      const guestId = getGuestId();
      // Ensure user_email matches what MentalCoaching queries (by user_email)
      const result = await base44.entities.MentalRoutine.create({
        ...routine,
        user_email: guestId,
      });
      return result;
    },
    onSuccess: () => {
      const guestId = getGuestId();
      queryClient.invalidateQueries({ queryKey: ['savedMentalRoutines'] });
      queryClient.invalidateQueries({ queryKey: ['savedMentalRoutines', guestId] });
      queryClient.invalidateQueries({ queryKey: ['savedMentalRoutines', 'guest'] });
      queryClient.refetchQueries({ queryKey: ['savedMentalRoutines'] });
      toast.success('Saved to My Routines! ✨');
      navigate(createPageUrl('MentalCoaching') + '?tab=saved');
    },
    onError: (err) => {
      toast.error('Failed to save. Please try again.');
      console.error(err);
    }
  });

  const generatePlan = () => {
    if (!focusArea) {
      toast.error('Please select a focus area');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const routine = getPreGeneratedMentalRoutine(focusArea, sessionLength);
      setGeneratedPlan(routine);
      setIsGenerating(false);
      toast.success('Mental routine generated!');
    }, 800);
  };

  // Map focus area values to valid MentalRoutine category enum values
  const categoryMap = {
    match_anxiety: 'match-day-calm',
    confidence: 'confidence',
    pressure: 'pressure',
    focus: 'focus',
    recovery: 'recovery',
    visualization: 'visualization',
    concentration: 'focus',
    motivation: 'confidence',
    dealing_with_failure: 'recovery',
    staying_calm: 'match-day-calm',
    positive_mindset: 'confidence',
  };

  const handleSave = () => {
    if (!generatedPlan) return;

    const routine = {
      title: generatedPlan.title,
      category: categoryMap[focusArea] || 'focus',
      description: generatedPlan.description,
      duration_seconds: sessionLength,
      steps: generatedPlan.steps,
      difficulty: 'beginner',
      calming_sound: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8e1c1ab.mp3',
      xp_value: 75,
    };

    saveMentalRoutineMutation.mutate(routine);
  };

  const handleDiscard = () => {
    setGeneratedPlan(null);
    toast('Routine discarded');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50 dark:from-slate-900 dark:via-slate-950 dark:to-black pb-24">
      <Header title="Mental Training Creator" />

      <div className="px-6 py-6 max-w-2xl mx-auto space-y-6">
        {!generatedPlan ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white text-center"
            >
              <Brain className="w-16 h-16 mx-auto mb-3" />
              <h2 className="text-2xl font-bold mb-2">Create Your Mental Routine</h2>
              <p className="text-purple-100">Personalized mental training from our pre-made library</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  What do you want to work on?
                </label>
                <Select value={focusArea} onValueChange={setFocusArea}>
                  <SelectTrigger className="h-14 text-base">
                    <SelectValue placeholder="Select focus area" />
                  </SelectTrigger>
                  <SelectContent>
                    {focusAreas.map(area => (
                      <SelectItem key={area.value} value={area.value}>
                        {area.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Session Length
                </label>
                <Select value={sessionLength.toString()} onValueChange={(v) => setSessionLength(parseInt(v))}>
                  <SelectTrigger className="h-14 text-base">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessionLengths.map(len => (
                      <SelectItem key={len.value} value={len.value.toString()}>
                        {len.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={generatePlan}
                disabled={isGenerating || !focusArea}
                className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg font-bold"
              >
                {isGenerating ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creating Your Plan...</>
                ) : (
                  <><Sparkles className="w-5 h-5 mr-2" /> Generate Mental Plan</>
                )}
              </Button>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6"
          >
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{generatedPlan.title}</h3>
              <p className="text-slate-600 dark:text-slate-300">{generatedPlan.description}</p>
            </div>

            <div className="space-y-4 mb-6">
              <h4 className="font-bold text-slate-800 dark:text-white">Steps:</h4>
              {generatedPlan.steps.map((step, index) => (
                <div key={index} className="bg-purple-50 dark:bg-purple-900/30 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-800 dark:text-slate-100 leading-relaxed">{step.instruction}</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-1">
                        {step.duration_seconds} seconds
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleDiscard} variant="outline" className="flex-1">
                Discard
              </Button>
              <Button
                onClick={handleSave}
                disabled={saveMentalRoutineMutation.isPending}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              >
                {saveMentalRoutineMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                ) : 'Save & Use'}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}