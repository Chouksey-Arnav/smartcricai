import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Target, RefreshCw, Heart, Trash2 } from 'lucide-react';
import Header from '@/components/common/Header';
import MentalRoutineCard from '@/components/mental/MentalRoutineCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { ALL_MENTAL_ROUTINES } from '@/components/mental/MentalRoutinesData';

const mindfulnessQuotes = [
  "The mind is everything. What you think, you become.",
  "Stay present. The ball is in your hands right now.",
  "Breathe in confidence, breathe out doubt.",
  "Every moment is a fresh start. Reset and refocus.",
  "Your thoughts create your reality on the field.",
  "Calmness is a superpower in cricket.",
  "Focus on the process, not the outcome.",
  "Champions train their minds as hard as their bodies.",
  "In stillness, you find your greatest strength.",
  "Let go of the last ball, focus on this one.",
  "Your breath is your anchor in pressure moments.",
  "Confidence comes from preparation and presence.",
  "The space between your ears is your biggest asset.",
  "Visualize success, then make it happen.",
  "Patience and persistence break through any defense.",
  "Trust your training when doubt creeps in.",
  "Mental toughness is choosing to stay positive.",
  "Your attitude determines your altitude in cricket.",
  "Embrace the pressure - it's your chance to shine.",
  "The greatest battles are won in the mind first.",
];

function getMindfulnessQuote() {
  const today = new Date().toDateString();
  const stored = localStorage.getItem('mindfulness_quote_date');
  const storedQuote = localStorage.getItem('mindfulness_quote');
  
  if (stored === today && storedQuote) {
    return storedQuote;
  }
  
  const randomQuote = mindfulnessQuotes[Math.floor(Math.random() * mindfulnessQuotes.length)];
  localStorage.setItem('mindfulness_quote_date', today);
  localStorage.setItem('mindfulness_quote', randomQuote);
  return randomQuote;
}

export default function MentalCoaching() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') || 'all';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch {
        return null;
      }
    },
  });

  // Use local JS data for All Routines — no database seeding needed
  const allRoutines = useMemo(() =>
    ALL_MENTAL_ROUTINES.map((r, i) => ({ ...r, id: `local_${i}` })),
    []
  );
  const isLoading = false;

  const { data: premiumStatus } = useQuery({
    queryKey: ['premiumStatus', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const subs = await base44.entities.PremiumSubscription.filter({ user_email: guestEmail });
      return subs[0] || null;
    },
  });

  const isPremium = premiumStatus?.is_premium || false;

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const results = await base44.entities.UserProgress.filter({ user_email: guestEmail });
      return results[0] || null;
    },
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });

  const mentalSessionsCount = userProgress?.completed_mental_routines?.length || 0;
  const mentalXP = mentalSessionsCount * 75;

  const { data: savedRoutines = [] } = useQuery({
    queryKey: ['savedMentalRoutines', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const guestId = localStorage.getItem('smartcrick_guest_id') || guestEmail;
      // Fetch routines saved by either identity
      const byEmail = await base44.entities.MentalRoutine.filter({ user_email: guestEmail });
      const byGuestId = guestId !== guestEmail
        ? await base44.entities.MentalRoutine.filter({ user_email: guestId })
        : [];
      // Merge and deduplicate
      const all = [...byEmail, ...byGuestId];
      const seen = new Set();
      return all.filter(r => { if (seen.has(r.id)) return false; seen.add(r.id); return true; })
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const likeRoutineMutation = useMutation({
    mutationFn: async ({ routineId, liked }) => {
      return await base44.entities.MentalRoutine.update(routineId, { liked });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedMentalRoutines'] });
    },
  });

  const deleteRoutineMutation = useMutation({
    mutationFn: async (routineId) => {
      await base44.entities.MentalRoutine.delete(routineId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedMentalRoutines'] });
      toast.success('Routine deleted');
    },
  });

  const deleteAllRoutinesMutation = useMutation({
    mutationFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const guestId = localStorage.getItem('smartcrick_guest_id') || guestEmail;
      const byEmail = await base44.entities.MentalRoutine.filter({ user_email: guestEmail });
      const byGuestId = guestId !== guestEmail ? await base44.entities.MentalRoutine.filter({ user_email: guestId }) : [];
      const all = [...byEmail, ...byGuestId];
      await Promise.all(all.map(routine => base44.entities.MentalRoutine.delete(routine.id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedMentalRoutines'] });
      toast.success('All routines deleted');
    },
  });

  const sortedRoutines = [...allRoutines]
    .filter(r => !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (a.duration_seconds || 0) - (b.duration_seconds || 0));

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-slate-900 dark:to-slate-950 pb-24">
      <Header title="Mental Training" showSettings={false} />
      
      <div className="px-6 py-6 max-w-lg mx-auto">
        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mental routines..."
            className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
          />
          <Brain className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>

        {/* XP Tracker */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-4 text-white flex items-center justify-between mb-4"
        >
          <div>
            <p className="text-xs text-purple-100">Mental Training XP Earned</p>
            <p className="text-3xl font-bold">{mentalXP.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-purple-100">Sessions Completed</p>
            <p className="text-2xl font-bold">{mentalSessionsCount}</p>
          </div>
        </motion.div>

        {/* Mindfulness Quote of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-5 text-white mb-4 border-2 border-amber-300"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-white text-sm">Mindfulness Quote of the Day</h3>
          </div>
          <p className="text-white italic text-sm font-medium leading-relaxed">
            "{getMindfulnessQuote()}"
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-6 text-white mb-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Train Your Mind</h2>
              <p className="text-purple-100 text-sm">Cricket is 90% mental!</p>
            </div>
          </div>
          <p className="text-purple-100 text-sm">
            Build confidence, stay focused, and recover quickly from setbacks with these guided exercises.
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex gap-2 bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-lg mb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Brain className="w-5 h-5" />
            All Routines
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'saved'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Heart className="w-5 h-5" />
            My Routines
          </button>
        </div>

        {activeTab === 'all' ? (
          <div className="space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-28 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : sortedRoutines.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Brain className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No routines found.</p>
              </motion.div>
            ) : (
              sortedRoutines.map((routine, index) => {
                const isLocked = routine.is_premium && !isPremium;
                return (
                  <motion.div
                    key={routine.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <MentalRoutineCard
                      routine={routine}
                      onClick={() => {
                        if (isLocked) {
                          toast('Premium content — upgrade to unlock', {
                            duration: 3000,
                          });
                        } else {
                          navigate(createPageUrl(`MentalRoutinePlayer?id=${routine.id}`));
                        }
                      }}
                      isLocked={isLocked}
                    />
                  </motion.div>
                );
              })
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {savedRoutines.length > 0 && (
              <Button
                onClick={() => {
                  if (confirm('Delete ALL your saved routines? This cannot be undone.')) {
                    deleteAllRoutinesMutation.mutate();
                  }
                }}
                disabled={deleteAllRoutinesMutation.isPending}
                variant="destructive"
                className="w-full bg-red-500 hover:bg-red-600"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                {deleteAllRoutinesMutation.isPending ? 'Deleting...' : 'Delete All My Routines'}
              </Button>
            )}
            {savedRoutines.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 rounded-3xl p-8 text-center shadow-lg"
              >
                <Heart className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">No Saved Routines Yet</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                  Create and save custom mental routines to access them anytime
                </p>
                <Button
                  onClick={() => navigate(createPageUrl('MentalTrainingCreator'))}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                >
                  Create Routine
                </Button>
              </motion.div>
            ) : (
              savedRoutines.map((routine, index) => (
                <motion.div
                  key={routine.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border-2 border-purple-100 dark:border-purple-900"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{routine.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{routine.description}</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                        {Math.floor(routine.duration_seconds / 60)} minutes
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          likeRoutineMutation.mutate({ routineId: routine.id, liked: !routine.liked });
                        }}
                        className="p-1 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                      >
                        <Heart className={`w-6 h-6 transition-colors ${routine.liked ? 'text-purple-500 fill-purple-500' : 'text-slate-300'}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this routine? This cannot be undone.')) {
                            deleteRoutineMutation.mutate(routine.id);
                          }
                        }}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => {
                      navigate(createPageUrl(`MentalRoutinePlayer?id=${routine.id}`));
                    }}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                  >
                    Start Routine
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