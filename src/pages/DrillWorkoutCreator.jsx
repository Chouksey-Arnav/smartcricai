import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Target, Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export default function DrillWorkoutCreator() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [duration, setDuration] = useState('');
  const [matchingDrills, setMatchingDrills] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [workoutGenerated, setWorkoutGenerated] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: allDrills } = useQuery({
    queryKey: ['drills'],
    queryFn: () => base44.entities.Drill.list(),
    initialData: [],
  });

  const saveWorkoutMutation = useMutation({
    mutationFn: async (workout) => {
      return await base44.entities.CustomDrillWorkout.create({
        ...workout,
        saved: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customDrillWorkouts'] });
      toast.success('Workout saved forever! 🎯');
      navigate(createPageUrl('Drills'));
    },
  });

  const generateWorkout = async () => {
    if (!category || !skillLevel || !duration) {
      toast.error('Please select all options');
      return;
    }

    setIsSearching(true);

    // Simulate brief loading for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Filter drills based on selections
    const filtered = allDrills.filter(drill => {
      const matchesCategory = drill.category === category;
      const matchesSkillLevel = drill.skill_level === skillLevel;
      const matchesDuration = drill.duration_minutes <= parseInt(duration);
      
      return matchesCategory && matchesSkillLevel && matchesDuration;
    });

    setMatchingDrills(filtered);
    setWorkoutGenerated(true);
    setIsSearching(false);

    if (filtered.length === 0) {
      toast.error('No drills found for these criteria');
    }
  };

  const handleSave = () => {
    if (matchingDrills.length === 0) return;

    const workout = {
      user_email: user.email,
      workout_name: `${category.charAt(0).toUpperCase() + category.slice(1)} - ${skillLevel}`,
      num_drills: matchingDrills.length,
      skill_level: skillLevel,
      drills: matchingDrills.map(d => ({
        drill_id: d.id,
        drill_title: d.title,
        is_existing: true
      })),
    };

    saveWorkoutMutation.mutate(workout);
  };

  const resetForm = () => {
    setCategory('');
    setSkillLevel('');
    setDuration('');
    setMatchingDrills([]);
    setWorkoutGenerated(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 pb-24">
      <Header title="Drill Workout Creator" />

      <div className="px-6 py-6 max-w-2xl mx-auto space-y-6">
        {!workoutGenerated ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-6 text-white text-center"
            >
              <Target className="w-16 h-16 mx-auto mb-3" />
              <h2 className="text-2xl font-bold mb-2">Build Your Workout</h2>
              <p className="text-blue-100">Select drills from our pre-made library</p>
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
                  Skill Level
                </label>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger className="h-14 text-base">
                    <SelectValue placeholder="Select skill level" />
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
                  Workout Duration
                </label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="h-14 text-base">
                    <SelectValue placeholder="Select duration" />
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

              <Button
                onClick={generateWorkout}
                disabled={isSearching || !category || !skillLevel || !duration}
                className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg font-bold"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Finding Drills...
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
            className="bg-white rounded-3xl shadow-2xl p-6"
          >
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Workout Ready!</h3>
              <p className="text-slate-600 capitalize">
                {matchingDrills.length} {category} drills • {skillLevel} level • Up to {duration} min
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {matchingDrills.map((drill, index) => (
                <motion.div
                  key={drill.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800">{drill.title}</h4>
                      <p className="text-xs text-slate-600">
                        {drill.duration_minutes} min • {drill.target_skill}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {matchingDrills.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-600">No drills found for these criteria. Try different options!</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={resetForm}
                variant="outline"
                className="flex-1"
              >
                Create Another
              </Button>
              {matchingDrills.length > 0 && (
                <Button
                  onClick={handleSave}
                  disabled={saveWorkoutMutation.isPending}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                >
                  {saveWorkoutMutation.isPending ? 'Saving...' : 'Save Workout'}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}