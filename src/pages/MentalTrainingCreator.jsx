import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/common/Header';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const focusAreas = [
  { value: 'match_anxiety', label: 'Match Day Anxiety', emoji: '😰' },
  { value: 'confidence', label: 'Building Confidence', emoji: '💪' },
  { value: 'pressure', label: 'Handling Pressure', emoji: '🎯' },
  { value: 'focus', label: 'Improving Focus', emoji: '🧘' },
  { value: 'recovery', label: 'Mental Recovery', emoji: '🌿' },
  { value: 'visualization', label: 'Visualization Practice', emoji: '👁️' },
];

const sessionLengths = [
  { value: 300, label: '5 minutes' },
  { value: 600, label: '10 minutes' },
  { value: 900, label: '15 minutes' },
  { value: 1200, label: '20 minutes' },
];

export default function MentalTrainingCreator() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [focusArea, setFocusArea] = useState('');
  const [sessionLength, setSessionLength] = useState(600);
  const [description, setDescription] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const profiles = await base44.entities.UserProfile.filter({ user_email: user.email });
      return profiles[0] || null;
    },
    enabled: !!user?.email,
  });

  const saveMentalRoutineMutation = useMutation({
    mutationFn: async (routine) => {
      return await base44.entities.MentalRoutine.create(routine);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentalRoutines'] });
      toast.success('Mental routine saved! 🧠');
      navigate('/MentalCoaching');
    },
  });

  const generatePlan = async () => {
    if (!focusArea) {
      toast.error('Please select a focus area');
      return;
    }

    setIsGenerating(true);

    try {
      const contextInfo = userProfile ? `
User background:
- Cricket role: ${userProfile.cricket_role}
- Experience: ${userProfile.experience_years} years
- Main goals: ${userProfile.main_goals?.join(', ')}
- Weak areas: ${userProfile.weak_areas?.join(', ')}
` : '';

      const prompt = `Create a personalized mental training routine for a young cricket player.

${contextInfo}

Focus area: ${focusAreas.find(f => f.value === focusArea)?.label}
Session length: ${sessionLength} seconds
Additional context: ${description || 'None'}

Generate a mental training plan in the following JSON format:
{
  "title": "Short, motivating title (max 50 chars)",
  "description": "Brief description of what this routine helps with (max 150 chars)",
  "steps": [
    {
      "instruction": "Clear, simple instruction for this step",
      "duration_seconds": duration_for_this_step
    }
  ]
}

Requirements:
- Create 4-6 steps that add up to exactly ${sessionLength} seconds
- Make instructions warm, encouraging, age-appropriate (11-17)
- Include breathing exercises, visualization, positive affirmations
- Each step should be 60-180 seconds
- Instructions should be specific and actionable
- Focus on cricket-specific mental skills

Return ONLY valid JSON, no other text.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            steps: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  instruction: { type: 'string' },
                  duration_seconds: { type: 'number' }
                }
              }
            }
          }
        }
      });

      setGeneratedPlan(response);
    } catch (error) {
      console.error('Error generating plan:', error);
      toast.error('Failed to generate plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!generatedPlan) return;

    const routine = {
      title: generatedPlan.title,
      category: focusArea,
      description: generatedPlan.description,
      duration_seconds: sessionLength,
      steps: generatedPlan.steps,
      difficulty: 'beginner',
      calming_sound: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8e1c1ab.mp3',
    };

    saveMentalRoutineMutation.mutate(routine);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50 pb-24">
      <Header title="Mental Training Creator" />

      <div className="px-6 py-6 max-w-2xl mx-auto space-y-6">
        {!generatedPlan ? (
          <>
            {/* Intro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white text-center"
            >
              <Brain className="w-16 h-16 mx-auto mb-3" />
              <h2 className="text-2xl font-bold mb-2">Create Your Mental Routine</h2>
              <p className="text-purple-100">AI-powered personalized mental training plans</p>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl p-6 space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  What do you want to work on?
                </label>
                <Select value={focusArea} onValueChange={setFocusArea}>
                  <SelectTrigger className="h-14 text-base">
                    <SelectValue placeholder="Select focus area" />
                  </SelectTrigger>
                  <SelectContent>
                    {focusAreas.map(area => (
                      <SelectItem key={area.value} value={area.value}>
                        <span className="flex items-center gap-2">
                          <span>{area.emoji}</span>
                          <span>{area.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
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

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tell us more (Optional)
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., I get nervous before big matches and need help calming down..."
                  className="h-24 text-base"
                />
              </div>

              <Button
                onClick={generatePlan}
                disabled={isGenerating || !focusArea}
                className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg font-bold"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Your Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Mental Plan
                  </>
                )}
              </Button>
            </motion.div>
          </>
        ) : (
          <>
            {/* Generated Plan */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-2xl p-6"
            >
              <div className="text-center mb-6">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{generatedPlan.title}</h3>
                <p className="text-slate-600">{generatedPlan.description}</p>
              </div>

              <div className="space-y-4 mb-6">
                <h4 className="font-bold text-slate-700">Steps:</h4>
                {generatedPlan.steps.map((step, index) => (
                  <div key={index} className="bg-purple-50 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-800 leading-relaxed">{step.instruction}</p>
                        <p className="text-xs text-purple-600 font-medium mt-1">
                          {step.duration_seconds} seconds
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setGeneratedPlan(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Create Another
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saveMentalRoutineMutation.isPending}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                >
                  {saveMentalRoutineMutation.isPending ? 'Saving...' : 'Save & Use'}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}