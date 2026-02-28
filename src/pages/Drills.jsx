import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Target, Heart, Trash2, Video, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Header from '@/components/common/Header';
import DrillCard from '@/components/drills/DrillCard';
import CategoryFilter from '@/components/drills/CategoryFilter';
import PullToRefresh from '@/components/common/PullToRefresh';
import toast from 'react-hot-toast';

export default function Drills() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [activeTab, setActiveTab] = useState('drills');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab) setActiveTab(tab);
  }, []);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch {
        return null;
      }
    },
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
    queryKey: ['premiumStatus', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const subs = await base44.entities.PremiumSubscription.filter({ user_email: guestEmail });
      return subs[0] || null;
    },
  });

  const isPremium = premiumStatus?.is_premium || false;

  const { data: progress } = useQuery({
    queryKey: ['userProgress', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const results = await base44.entities.UserProgress.filter({ user_email: guestEmail });
      return results[0] || null;
    },
    staleTime: 60000,
    refetchOnWindowFocus: true,
    retry: 3,
  });

  const getGuestEmail = () => {
    if (user?.email) return user.email;
    return localStorage.getItem('smartcrick_guest_id') || 'guest@smartcrick.app';
  };

  const { data: savedWorkouts = [], refetch: refetchSaved } = useQuery({
    queryKey: ['savedDrillWorkouts', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = getGuestEmail();
      const results = await base44.entities.CustomDrillWorkout.filter({ user_email: guestEmail });
      return results.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    staleTime: 30000,
  });

  const handleRefresh = async () => {
    await queryClient.refetchQueries({ queryKey: ['drills'] });
    toast.success('Drills refreshed!');
  };

  const filteredDrills = drills.filter(drill => {
    const matchesCategory = category === 'all' || drill.category === category;
    const matchesSearch = drill.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const beginnerDrills = filteredDrills.filter(d => d.skill_level === 'beginner');
  const intermediateDrills = filteredDrills.filter(d => d.skill_level === 'intermediate');
  const advancedDrills = filteredDrills.filter(d => d.skill_level === 'advanced');
  const proDrills = filteredDrills.filter(d => d.skill_level === 'pro');

  const completedDrillIds = progress?.completed_drills || [];

  const deleteWorkoutMutation = useMutation({
    mutationFn: async (workoutId) => {
      await base44.entities.CustomDrillWorkout.delete(workoutId);
    },
    onMutate: async (workoutId) => {
      await queryClient.cancelQueries({ queryKey: ['savedDrillWorkouts'] });
      const previousWorkouts = queryClient.getQueryData(['savedDrillWorkouts', user?.email || 'guest']);
      queryClient.setQueryData(['savedDrillWorkouts', user?.email || 'guest'], old => 
        old?.filter(w => w.id !== workoutId) || []
      );
      toast.success('Workout deleted');
      return { previousWorkouts };
    },
    onError: (err, workoutId, context) => {
      queryClient.setQueryData(['savedDrillWorkouts', user?.email || 'guest'], context.previousWorkouts);
      toast.error('Failed to delete workout');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['savedDrillWorkouts'] });
    },
  });

  const renderDrillGroup = (title, drills, color) => {
    if (drills.length === 0) return null;
    
    return (
      <div className="space-y-3">
        <div className={`flex items-center gap-2 px-2`}>
          <div className={`h-1 w-8 rounded-full ${color}`} />
          <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wide">{title}</h3>
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 pb-24">
      <Header title="Practice Drills" showSettings={false} />

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="px-4 py-4 max-w-lg mx-auto space-y-6">
          {/* YouTube Drill Finder Redirect */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(createPageUrl('DrillYouTubeFinder'))}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-4 text-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-3">
              <Video className="w-5 h-5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1">🎯 Need drill videos?</p>
                <p className="text-xs text-purple-100">Tap here to find YouTube videos for any cricket drill!</p>
              </div>
            </div>
          </motion.div>

          {/* Tab Switcher */}
          <div className="flex gap-2 bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-lg">
            <button
              onClick={() => setActiveTab('drills')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'drills'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
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
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
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
                  className="pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                />
              </div>

              {/* Categories - Horizontal Scroll */}
              <div className="relative">
                <div className="overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#10b981 #f1f5f9' }}>
                  <div className="flex gap-2 min-w-max dark:bg-slate-900 rounded-2xl p-2">
                    <CategoryFilter selected={category} onChange={setCategory} />
                  </div>
                </div>
              </div>

              {/* Drills List - Organized by Difficulty */}
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : filteredDrills.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-slate-500 dark:text-slate-400">No drills found. Try a different category!</p>
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
              <Link to={createPageUrl('DrillWorkoutCreator')}>
                <Button className="w-full h-14 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold text-base">
                  <Plus className="w-5 h-5 mr-2" />
                  Access Your Drill Workouts
                </Button>
              </Link>
              {savedWorkouts.length > 0 && (
                <Button
                  onClick={() => {
                    if (confirm('Delete ALL your saved drill workouts? This cannot be undone.')) {
                      const guestEmail = user?.email || 'guest@smartcrick.app';
                      base44.entities.CustomDrillWorkout.filter({ user_email: guestEmail }).then(workouts => {
                        Promise.all(workouts.map(w => base44.entities.CustomDrillWorkout.delete(w.id))).then(() => {
                          queryClient.invalidateQueries({ queryKey: ['savedDrillWorkouts'] });
                          toast.success('All saved drill workouts deleted');
                        });
                      });
                    }
                  }}
                  variant="destructive"
                  className="w-full bg-red-500 hover:bg-red-600"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Delete All Saved Drill Workouts
                </Button>
              )}
              {savedWorkouts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-8 text-center shadow-lg"
                >
                  <Heart className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">No Saved Workouts Yet</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
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
                    className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border-2 border-blue-100 dark:border-blue-900"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{workout.workout_name}</h3>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <span className="capitalize">{workout.skill_level}</span>
                          <span>•</span>
                          <span>{workout.num_drills} drills</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Delete this workout? This cannot be undone.')) {
                              deleteWorkoutMutation.mutate(workout.id);
                            }
                          }}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    </div>
                    
                    {workout.drills && workout.drills.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {workout.drills.slice(0, 3).map((drill, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{idx + 1}</span>
                            </div>
                            <span className="truncate">{drill.drill_title}</span>
                          </div>
                        ))}
                        {workout.drills.length > 3 && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 pl-8">+{workout.drills.length - 3} more drills</p>
                        )}
                      </div>
                    )}
                    
                    <Button
                      onClick={() => {
                        navigate(createPageUrl(`SavedDrillWorkout?id=${workout.id}`));
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
      </PullToRefresh>
    </div>
  );
}