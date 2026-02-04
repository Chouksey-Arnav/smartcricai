import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Target, Sparkles, Loader2, CheckCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/common/Header';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { getPreGeneratedWorkout } from '@/components/workout/PreGeneratedWorkouts';

const skillLevels = [
  { value: 'beginner', label: 'Beginner', emoji: '🌱' },
  { value: 'intermediate', label: 'Intermediate', emoji: '⚡' },
  { value: 'advanced', label: 'Advanced', emoji: '🔥' },
  { value: 'pro', label: 'Pro', emoji: '👑' },
];

const targetSkillOptions = [
  { value: 'batting', label: 'Batting', emoji: '🏏' },
  { value: 'bowling', label: 'Bowling', emoji: '⚾' },
  { value: 'fielding', label: 'Fielding', emoji: '🤾' },
  { value: 'fitness', label: 'Fitness', emoji: '💪' },
  { value: 'mental', label: 'Mental', emoji: '🧠' },
];

export default function CustomDrillWorkoutCreator() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [numDrills, setNumDrills] = useState(5);
  const [skillLevel, setSkillLevel] = useState('intermediate');
  const [targetSkill, setTargetSkill] = useState('batting');
  const [generatedWorkout, setGeneratedWorkout] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const saveWorkoutMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.CustomDrillWorkout.create({
        user_email: user.email,
        workout_name: generatedWorkout.workout_name,
        num_drills: numDrills,
        skill_level: skillLevel,
        target_skills: [targetSkill],
        drills: generatedWorkout.drills.map(drill => ({
          drill_title: drill.drill_title,
          is_existing: false
        })),
        liked: true,
        saved: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customDrillWorkouts'] });
      toast.success('Workout saved! 🎉');
      navigate(createPageUrl('Drills'));
    },
  });

  const generateWorkout = async () => {
    if (!targetSkill) {
      toast.error('Please select a target skill');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Get pre-generated workout from library - NO INTEGRATION CREDITS USED!
      const workout = getPreGeneratedWorkout(numDrills, skillLevel, targetSkill);
      
      // Format the workout data
      const formattedWorkout = {
        workout_name: workout.name,
        drills: workout.drills.map((drillTitle, index) => ({
          drill_title: drillTitle,
          drill_description: `Practice drill focused on ${targetSkill} skills at ${skillLevel} level`,
          sets: skillLevel === 'beginner' ? 2 : skillLevel === 'intermediate' ? 3 : skillLevel === 'advanced' ? 4 : 5,
          reps: 10,
          duration_minutes: skillLevel === 'beginner' ? 5 : skillLevel === 'intermediate' ? 7 : skillLevel === 'advanced' ? 10 : 12,
          focus_area: targetSkill
        }))
      };

      // Simulate brief loading for better UX
      setTimeout(() => {
        setGeneratedWorkout(formattedWorkout);
        setIsGenerating(false);
        toast.success('Workout generated! 🎯');
      }, 800);
      
    } catch (error) {
      console.error('Error generating workout:', error);
      toast.error('Failed to generate workout. Please try again.');
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    setGeneratedWorkout(null);
    setTimeout(() => generateWorkout(), 100);
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
                  {[3, 4, 5, 6, 7].map(num => (
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
                  Target Skill
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {targetSkillOptions.map(skill => (
                    <button
                      key={skill.value}
                      onClick={() => setTargetSkill(skill.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        targetSkill === skill.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-3xl mb-1">{skill.emoji}</div>
                      <div className="font-semibold text-slate-800 text-sm">{skill.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={generateWorkout}
                disabled={isGenerating}
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
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-8 h-8" />
                <h3 className="font-bold text-2xl">{generatedWorkout.workout_name}</h3>
              </div>
              <p className="text-emerald-100">
                {generatedWorkout.drills.length} drills • {skillLevel} level
              </p>
            </div>

            <div className="space-y-4">
              {generatedWorkout.drills.map((drill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-xl p-6"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <span className="font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-lg mb-1">{drill.drill_title}</h4>
                      <p className="text-sm text-slate-600">
                        {drill.duration_minutes} min • {drill.sets} sets × {drill.reps} reps
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 mb-3">{drill.drill_description}</p>

                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-xs text-slate-700">
                      <strong className="text-blue-700">🎯 Focus:</strong> {drill.focus_area}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleRegenerate}
                variant="outline"
                className="flex-1 h-14 border-2"
              >
                <Sparkles className="w-5 h-5 mr-2" />
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