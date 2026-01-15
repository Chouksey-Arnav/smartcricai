import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Sparkles, Loader2, CheckCircle, ThumbsUp, ThumbsDown, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/common/Header';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const skillLevels = [
  { value: 'beginner', label: 'Beginner', emoji: '🌱' },
  { value: 'intermediate', label: 'Intermediate', emoji: '⚡' },
  { value: 'advanced', label: 'Advanced', emoji: '🔥' },
  { value: 'pro', label: 'Pro', emoji: '🏆' },
];

const targetSkillOptions = [
  'Footwork', 'Timing', 'Power', 'Accuracy', 'Speed', 'Endurance',
  'Balance', 'Agility', 'Coordination', 'Mental Focus', 'Consistency'
];

export default function CustomDrillWorkoutCreator() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [numDrills, setNumDrills] = useState(5);
  const [skillLevel, setSkillLevel] = useState('intermediate');
  const [targetSkills, setTargetSkills] = useState([]);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [generatedWorkout, setGeneratedWorkout] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: existingDrills } = useQuery({
    queryKey: ['drills'],
    queryFn: () => base44.entities.Drill.list(),
    initialData: [],
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

  const saveWorkoutMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.CustomDrillWorkout.create({
        user_email: user.email,
        workout_name: generatedWorkout.workout_name,
        num_drills: numDrills,
        skill_level: skillLevel,
        target_skills: targetSkills,
        drills: generatedWorkout.drills,
        liked: true,
        saved: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customDrillWorkouts'] });
      toast.success('Workout saved! 🎉');
      navigate(createPageUrl('Schedule'));
    },
  });

  const toggleSkill = (skill) => {
    if (targetSkills.includes(skill)) {
      setTargetSkills(targetSkills.filter(s => s !== skill));
    } else {
      setTargetSkills([...targetSkills, skill]);
    }
  };

  const generateWorkout = async () => {
    if (targetSkills.length === 0) {
      toast.error('Please select at least one target skill');
      return;
    }

    setIsGenerating(true);

    try {
      const contextInfo = userProfile ? `
User background:
- Cricket role: ${userProfile.cricket_role}
- Experience: ${userProfile.experience_years} years
- Weak areas: ${userProfile.weak_areas?.join(', ')}
- Main goals: ${userProfile.main_goals?.join(', ')}
` : '';

      // Get relevant existing drills
      const relevantDrills = existingDrills.filter(d => 
        d.skill_level === skillLevel || 
        targetSkills.some(skill => d.target_skill?.toLowerCase().includes(skill.toLowerCase()))
      ).slice(0, Math.min(3, numDrills));

      const existingDrillsContext = relevantDrills.length > 0 ? `
Existing drills to potentially include:
${relevantDrills.map(d => `- ${d.title} (${d.category}, ${d.target_skill})`).join('\n')}
` : '';

      const prompt = `Create a personalized cricket drill workout plan.

${contextInfo}

Workout requirements:
- Number of drills: ${numDrills}
- Skill level: ${skillLevel}
- Target skills: ${targetSkills.join(', ')}
- Additional details: ${additionalDetails || 'None'}

${existingDrillsContext}

Generate a comprehensive drill workout plan in the following JSON format:
{
  "workout_name": "Engaging workout name (e.g., 'Power Batting Masterclass')",
  "drills": [
    {
      "drill_title": "Drill name",
      "category": "batting/bowling/fielding/fitness",
      "target_skill": "specific skill being improved",
      "duration_minutes": number,
      "steps": ["step1", "step2", "step3"],
      "equipment": ["item1", "item2"],
      "target_metric": "measurable goal",
      "tips": "pro tips",
      "is_existing": true/false (true if using one of the existing drills above)
    }
  ]
}

Requirements:
- Mix of existing drills (if relevant) and new custom drills
- Age-appropriate for 11-17 years
- Progressive difficulty within the workout
- Varied drill types for engagement
- Clear, actionable steps (3-5 per drill)
- Specific targets and metrics

Return ONLY valid JSON.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            workout_name: { type: 'string' },
            drills: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  drill_title: { type: 'string' },
                  category: { type: 'string' },
                  target_skill: { type: 'string' },
                  duration_minutes: { type: 'number' },
                  steps: { type: 'array', items: { type: 'string' } },
                  equipment: { type: 'array', items: { type: 'string' } },
                  target_metric: { type: 'string' },
                  tips: { type: 'string' },
                  is_existing: { type: 'boolean' }
                }
              }
            }
          }
        }
      });

      setGeneratedWorkout(response);
      toast.success('Workout generated! 🎯');
    } catch (error) {
      console.error('Error generating workout:', error);
      toast.error('Failed to generate workout. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    setGeneratedWorkout(null);
    generateWorkout();
  };

  const handleDislike = () => {
    toast.error('Let\'s create a better one! 💪');
    handleRegenerate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 pb-24">
      <Header title="Custom Drill Workout" />

      <div className="px-6 py-6 max-w-2xl mx-auto space-y-6">
        {!generatedWorkout ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-6 text-white text-center"
            >
              <Target className="w-16 h-16 mx-auto mb-3" />
              <h2 className="text-2xl font-bold mb-2">Create Custom Drill Workout</h2>
              <p className="text-blue-100">AI-powered personalized training sessions</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl p-6 space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Number of Drills
                </label>
                <div className="flex gap-2">
                  {[3, 4, 5, 6, 7, 8].map(num => (
                    <button
                      key={num}
                      onClick={() => setNumDrills(num)}
                      className={`flex-1 h-12 rounded-xl border-2 font-semibold transition-all ${
                        numDrills === num
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Skill Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {skillLevels.map(level => (
                    <button
                      key={level.value}
                      onClick={() => setSkillLevel(level.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        skillLevel === level.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-3xl mb-1">{level.emoji}</div>
                      <div className="font-semibold text-slate-800 text-sm">{level.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Target Skills (Select multiple)
                </label>
                <div className="flex flex-wrap gap-2">
                  {targetSkillOptions.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                        targetSkills.includes(skill)
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Additional Details (Optional)
                </label>
                <Textarea
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder="e.g., I struggle with spin bowling, need to work on back foot shots..."
                  className="h-24 text-base"
                />
              </div>

              <Button
                onClick={generateWorkout}
                disabled={isGenerating || targetSkills.length === 0}
                className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg font-bold"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Your Workout...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Workout
                  </>
                )}
              </Button>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-8 h-8" />
                <h3 className="font-bold text-2xl">{generatedWorkout.workout_name}</h3>
              </div>
              <p className="text-emerald-100">
                {generatedWorkout.drills.length} drills • {skillLevel} level
              </p>
            </div>

            {/* Drills List */}
            <div className="space-y-4">
              {generatedWorkout.drills.map((drill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-xl p-6"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <span className="font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-800 text-lg">{drill.drill_title}</h4>
                        {drill.is_existing && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                            From Library
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 capitalize">
                        {drill.category} • {drill.target_skill} • {drill.duration_minutes} min
                      </p>
                    </div>
                  </div>

                  {drill.equipment && (
                    <div className="mb-4">
                      <h5 className="text-xs font-semibold text-slate-600 mb-2">Equipment:</h5>
                      <div className="flex flex-wrap gap-2">
                        {drill.equipment.map((item, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h5 className="text-xs font-semibold text-slate-600 mb-2">Steps:</h5>
                    <div className="space-y-2">
                      {drill.steps.map((step, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="text-purple-500 font-bold text-sm">{i + 1}.</span>
                          <p className="text-sm text-slate-700">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-xl p-3">
                    <p className="text-xs text-slate-700">
                      <strong className="text-amber-700">🎯 Target:</strong> {drill.target_metric}
                    </p>
                    <p className="text-xs text-slate-700 mt-1">
                      <strong className="text-amber-700">💡 Tips:</strong> {drill.tips}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleDislike}
                variant="outline"
                className="flex-1 h-14 border-2"
              >
                <ThumbsDown className="w-5 h-5 mr-2" />
                Regenerate
              </Button>
              <Button
                onClick={() => saveWorkoutMutation.mutate()}
                disabled={saveWorkoutMutation.isPending}
                className="flex-1 h-14 bg-emerald-500 hover:bg-emerald-600"
              >
                <Save className="w-5 h-5 mr-2" />
                {saveWorkoutMutation.isPending ? 'Saving...' : 'Save Workout'}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}