import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Target, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Header from '@/components/common/Header';
import DrillCard from '@/components/drills/DrillCard';
import CategoryFilter from '@/components/drills/CategoryFilter';
import toast from 'react-hot-toast';

export default function Drills() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('drills'); // 'drills' or 'saved'

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    staleTime: 300000,
    retry: 3,
  });

  const { data: drills = [], isLoading } = useQuery({
    queryKey: ['drills'],
    queryFn: () => base44.entities.Drill.list(),
    staleTime: 300000,
    retry: 3,
  });

  const { data: premiumStatus } = useQuery({
    queryKey: ['premiumStatus', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const subs = await base44.entities.PremiumSubscription.filter({ user_email: user.email });
      return subs[0] || null;
    },
    enabled: !!user?.email,
  });

  const isPremium = premiumStatus?.is_premium || false;

  const { data: progress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.UserProgress.filter({ user_email: user.email });
      return results[0] || null;
    },
    enabled: !!user?.email,
    staleTime: 60000,
    refetchOnWindowFocus: true,
    retry: 3,
  });

  const { data: savedWorkouts = [] } = useQuery({
    queryKey: ['savedDrillWorkouts', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const results = await base44.entities.CustomDrillWorkout.filter({ 
        user_email: user.email,
        saved: true 
      });
      return results.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    enabled: !!user?.email,
    staleTime: 60000,
  });

  const filteredDrills = drills.filter(drill => {
    const matchesCategory = category === 'all' || drill.category === category;
    const matchesSearch = drill.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group by difficulty
  const beginnerDrills = filteredDrills.filter(d => d.skill_level === 'beginner');
  const intermediateDrills = filteredDrills.filter(d => d.skill_level === 'intermediate');
  const advancedDrills = filteredDrills.filter(d => d.skill_level === 'advanced');
  const proDrills = filteredDrills.filter(d => d.skill_level === 'pro');

  const completedDrillIds = progress?.completed_drills || [];

  const renderDrillGroup = (title, drills, color) => {
    if (drills.length === 0) return null;
    
    return (
      <div className="space-y-3">
        <div className={`flex items-center gap-2 px-2`}>
          <div className={`h-1 w-8 rounded-full ${color}`} />
          <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">{title}</h3>
        </div>
        {drills.map((drill, index) => {
          const isLocked = drill.is_premium && !isPremium;
          return (
            <motion.div
              key={drill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <DrillCard
                drill={drill}
                onClick={() => {
                  if (isLocked) {
                    toast('Unlock with Premium! 🔓', {
                      icon: '💎',
                      duration: 3000,
                    });
                  } else {
                    navigate(createPageUrl(`DrillDetail?id=${drill.id}`));
                  }
                }}
                isCompleted={completedDrillIds.includes(drill.id)}
                isLocked={isLocked}
              />
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
      <Header title="Practice Drills" showSettings={false} />
      
      <div className="px-4 py-4 max-w-lg mx-auto space-y-6">
        {/* Tab Switcher */}
        <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-lg">
          <button
            onClick={() => setActiveTab('drills')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'drills'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Target className="w-5 h-5" />
            All Drills
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'saved'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Heart className="w-5 h-5" />
            Saved Workouts
          </button>
        </div>

        {activeTab === 'drills' ? (
          <>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search drills..."
                className="pl-10 rounded-xl border-slate-200"
              />
            </div>

            {/* Categories */}
            <CategoryFilter selected={category} onChange={setCategory} />

            {/* Drills List - Organized by Difficulty */}
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredDrills.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-slate-500">No drills found. Try a different category!</p>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {renderDrillGroup('Beginner', beginnerDrills, 'bg-green-500')}
                {renderDrillGroup('Intermediate', intermediateDrills, 'bg-amber-500')}
                {renderDrillGroup('Advanced', advancedDrills, 'bg-red-500')}
                {renderDrillGroup('Pro', proDrills, 'bg-purple-600')}
              </div>
            )}
          </>
        ) : (
          // Saved Workouts Tab
          <div className="space-y-4">
            {savedWorkouts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 text-center shadow-lg"
              >
                <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="font-bold text-slate-800 text-lg mb-2">No Saved Workouts Yet</h3>
                <p className="text-slate-600 text-sm mb-6">
                  Create and save custom drill workouts to access them anytime
                </p>
                <Button
                  onClick={() => navigate(createPageUrl('DrillWorkoutCreator'))}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Create Workout
                </Button>
              </motion.div>
            ) : (
              savedWorkouts.map((workout, index) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-5 shadow-lg border-2 border-blue-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 text-lg mb-1">{workout.workout_name}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <span className="capitalize">{workout.skill_level}</span>
                        <span>•</span>
                        <span>{workout.num_drills} drills</span>
                      </div>
                    </div>
                    <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                  </div>
                  
                  {workout.drills && workout.drills.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {workout.drills.slice(0, 3).map((drill, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-blue-600">{idx + 1}</span>
                          </div>
                          <span className="truncate">{drill.drill_title}</span>
                        </div>
                      ))}
                      {workout.drills.length > 3 && (
                        <p className="text-xs text-slate-500 pl-8">+{workout.drills.length - 3} more drills</p>
                      )}
                    </div>
                  )}
                  
                  <Button
                    onClick={() => {
                      // Navigate to first drill in workout
                      if (workout.drills?.[0]?.drill_id) {
                        navigate(createPageUrl(`DrillDetail?id=${workout.drills[0].drill_id}`));
                      }
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    Start Workout
                  </Button>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}