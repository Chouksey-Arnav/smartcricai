import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Target, Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/common/Header';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const drillCategories = [
  { value: 'batting', label: 'Batting', emoji: '🏏' },
  { value: 'bowling', label: 'Bowling', emoji: '⚡' },
  { value: 'fielding', label: 'Fielding', emoji: '🧤' },
  { value: 'fitness', label: 'Fitness', emoji: '💪' },
];

const skillLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'pro', label: 'Pro' },
];

const durations = [
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 20, label: '20 minutes' },
  { value: 25, label: '25 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
];

export default function DrillsCreator() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState('');
  const [skillLevel, setSkillLevel] = useState('intermediate');
  const [duration, setDuration] = useState(15);
  const [targetSkill, setTargetSkill] = useState('');
  const [description, setDescription] = useState('');
  const [generatedDrill, setGeneratedDrill] = useState(null);
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

  const saveDrillMutation = useMutation({
    mutationFn: async (drill) => {
      return await base44.entities.Drill.create(drill);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drills'] });
      toast.success('Drill saved! 🎯');
      navigate('/Drills');
    },
  });

  const generateDrill = async () => {
    if (!category || !targetSkill.trim()) {
      toast.error('Please fill in category and target skill');
      return;
    }

    setIsGenerating(true);

    try {
      const contextInfo = userProfile ? `
User background:
- Cricket role: ${userProfile.cricket_role}
- Experience: ${userProfile.experience_years} years
- Skill level: ${skillLevel}
- Weak areas: ${userProfile.weak_areas?.join(', ')}
` : '';

      const prompt = `Create a personalized cricket training drill.

${contextInfo}

Drill requirements:
- Category: ${category}
- Target skill: ${targetSkill}
- Duration: ${duration} minutes
- Skill level: ${skillLevel}
- Additional context: ${description || 'None'}

Generate a drill plan in the following JSON format:
{
  "title": "Engaging drill name (max 60 chars)",
  "equipment": ["item1", "item2"],
  "steps": ["step1", "step2", "step3", "step4", "step5"],
  "target_metric": "What to aim for (e.g., '20 perfect shots')",
  "tips": "Pro tips for success (max 200 chars)"
}

Requirements:
- Make it age-appropriate (11-17 years)
- 4-6 clear, actionable steps
- Specific equipment list
- Measurable target metric
- Practical pro tips
- Focus on skill development

Return ONLY valid JSON, no other text.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            equipment: { type: 'array', items: { type: 'string' } },
            steps: { type: 'array', items: { type: 'string' } },
            target_metric: { type: 'string' },
            tips: { type: 'string' }
          }
        }
      });

      setGeneratedDrill(response);
    } catch (error) {
      console.error('Error generating drill:', error);
      toast.error('Failed to generate drill. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!generatedDrill) return;

    const drill = {
      title: generatedDrill.title,
      category,
      skill_level: skillLevel,
      target_skill: targetSkill,
      duration_minutes: duration,
      equipment: generatedDrill.equipment,
      steps: generatedDrill.steps,
      target_metric: generatedDrill.target_metric,
      tips: generatedDrill.tips,
      icon: category,
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      soundtrack_url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8e1c1ab.mp3',
    };

    saveDrillMutation.mutate(drill);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 pb-24">
      <Header title="Drills Creator" />

      <div className="px-6 py-6 max-w-2xl mx-auto space-y-6">
        {!generatedDrill ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-6 text-white text-center"
            >
              <Target className="w-16 h-16 mx-auto mb-3" />
              <h2 className="text-2xl font-bold mb-2">Create Custom Drill</h2>
              <p className="text-blue-100">AI-powered personalized training drills</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="grid grid-cols-2 gap-3"
            >
              <Button
                onClick={() => navigate(createPageUrl('CustomDrillWorkoutCreator'))}
                className="h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Create Drill Workout
              </Button>
              <div className="h-16 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm font-medium">
                Single Drill →
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl p-6 space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Drill Category
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-14 text-base">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {drillCategories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <span className="flex items-center gap-2">
                          <span>{cat.emoji}</span>
                          <span>{cat.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  What skill do you want to improve?
                </label>
                <Input
                  value={targetSkill}
                  onChange={(e) => setTargetSkill(e.target.value)}
                  placeholder="e.g., cover drive timing, yorker accuracy, catching..."
                  className="h-14 text-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Skill Level
                  </label>
                  <Select value={skillLevel} onValueChange={setSkillLevel}>
                    <SelectTrigger className="h-14 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {skillLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Duration
                  </label>
                  <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
                    <SelectTrigger className="h-14 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map(dur => (
                        <SelectItem key={dur.value} value={dur.value.toString()}>
                          {dur.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Additional Details (Optional)
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., I struggle with short balls, need to work on footwork..."
                  className="h-24 text-base"
                />
              </div>

              <Button
                onClick={generateDrill}
                disabled={isGenerating || !category || !targetSkill.trim()}
                className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg font-bold"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Your Drill...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Drill
                  </>
                )}
              </Button>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-6"
          >
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{generatedDrill.title}</h3>
              <p className="text-slate-600 capitalize">{category} • {duration} min • {skillLevel}</p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-slate-700 mb-3">Equipment Needed:</h4>
                <div className="flex flex-wrap gap-2">
                  {generatedDrill.equipment.map((item, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-700 mb-3">Steps:</h4>
                <div className="space-y-3">
                  {generatedDrill.steps.map((step, index) => (
                    <div key={index} className="bg-purple-50 rounded-2xl p-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-slate-800 leading-relaxed flex-1">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-4">
                <h4 className="font-bold text-emerald-700 mb-2">🎯 Target: {generatedDrill.target_metric}</h4>
                <p className="text-sm text-slate-700"><strong>Pro Tips:</strong> {generatedDrill.tips}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setGeneratedDrill(null)}
                variant="outline"
                className="flex-1"
              >
                Create Another
              </Button>
              <Button
                onClick={handleSave}
                disabled={saveDrillMutation.isPending}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              >
                {saveDrillMutation.isPending ? 'Saving...' : 'Save & Use'}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}