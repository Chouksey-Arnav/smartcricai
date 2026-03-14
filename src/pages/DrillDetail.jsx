import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Dumbbell, 
  Target, 
  CheckCircle2, 
  Play,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Video,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  try {
    let videoId = null;
    if (url.includes('youtube.com/watch')) {
      const p = new URL(url).searchParams;
      videoId = p.get('v');
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1]?.split('?')[0]?.split('&')[0];
    } else if (url.includes('youtube.com/v/')) {
      videoId = url.split('youtube.com/v/')[1]?.split('?')[0]?.split('&')[0];
    }
    if (videoId) {
      videoId = videoId.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 11);
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch {}
  return '';
};

const categoryColors = {
  batting: 'from-blue-500 to-blue-600',
  bowling: 'from-red-500 to-red-600',
  fielding: 'from-emerald-500 to-emerald-600',
  fitness: 'from-purple-500 to-purple-600'
};

const levelColors = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-700'
};

export default function DrillDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const drillId = urlParams.get('id');
  const workoutId = urlParams.get('workoutId');
  const drillIndexInWorkout = urlParams.get('drillIndex');
  const skillPathId = urlParams.get('skillPathId');
  const skillPathItemId = urlParams.get('skillPathItemId');

  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [youtubeError, setYoutubeError] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => { try { return await base44.auth.me(); } catch { return null; } },
    staleTime: 300000,
    retry: 1,
  });

  const { data: drill, isLoading } = useQuery({
    queryKey: ['drill', drillId],
    queryFn: async () => {
      const drills = await base44.entities.Drill.filter({ id: drillId });
      return drills[0];
    },
    enabled: !!drillId,
    retry: 2,
  });

  // Load ALL drills for prev/next navigation
  const { data: allDrills = [] } = useQuery({
    queryKey: ['drillsForNav'],
    queryFn: () => base44.entities.Drill.list('-created_date', 500),
    staleTime: 300000,
  });

  const currentIndex = allDrills.findIndex(d => d.id === drillId);
  const prevDrill = currentIndex > 0 ? allDrills[currentIndex - 1] : null;
  const nextDrill = currentIndex >= 0 && currentIndex < allDrills.length - 1 ? allDrills[currentIndex + 1] : null;

  const goToDrill = (targetDrill) => {
    if (!targetDrill) return;
    setCurrentStep(0);
    setIsStarted(false);
    setIsCompleted(false);
    setYoutubeError(false);
    navigate(createPageUrl(`DrillDetail?id=${targetDrill.id}`));
  };

  const completeDrillMutation = useMutation({
    mutationFn: async () => {
      if (!drill) return;

      if (workoutId && drillIndexInWorkout !== null) {
        const workouts = await base44.entities.Workout.filter({ id: workoutId });
        const workout = workouts[0];
        if (workout) {
          const updatedDrills = [...workout.drills];
          const idx = parseInt(drillIndexInWorkout);
          if (updatedDrills[idx]) {
            updatedDrills[idx].completed_sets = updatedDrills[idx].sets || 3;
          }
          await base44.entities.Workout.update(workoutId, { drills: updatedDrills });
        }
      }
      
      const getGuestId = () => {
        if (user?.email) return user.email;
        let guestId = localStorage.getItem('smartcrick_guest_id');
        if (!guestId) {
          guestId = `guest_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
          localStorage.setItem('smartcrick_guest_id', guestId);
        }
        return guestId;
      };

      const guestId = getGuestId();
      const today = new Date().toISOString().split('T')[0];
      const guestProgress = await base44.entities.UserProgress.filter({ user_email: guestId });
      const currentProgress = guestProgress[0] || null;
      const completedDrills = currentProgress?.completed_drills || [];
      const lastPracticeDate = currentProgress?.last_practice_date;
      
      let newStreak = currentProgress?.current_streak || 0;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastPracticeDate === yesterdayStr) {
        newStreak += 1;
      } else if (lastPracticeDate !== today) {
        newStreak = 1;
      }

      const newBadges = [...(currentProgress?.badges || [])];
      if (!completedDrills.includes(drill.id) && completedDrills.length === 0) newBadges.push('first-drill');
      if (newStreak >= 3 && !newBadges.includes('streak-3')) newBadges.push('streak-3');
      if (newStreak >= 7 && !newBadges.includes('streak-7')) newBadges.push('streak-7');
      if (completedDrills.length + 1 >= 10 && !newBadges.includes('drill-master')) newBadges.push('drill-master');

      // Dynamic XP: 5 XP per minute * level multiplier
      const levelMult = { beginner: 1, intermediate: 1.5, advanced: 2, pro: 3 };
      const mult = levelMult[drill.skill_level?.toLowerCase()] || 1;
      const xpEarned = Math.round(Math.max(25, Math.min(500, (drill.duration_minutes || 5) * 5 * mult)));

      const updateData = {
        completed_drills: [...new Set([...completedDrills, drill.id])],
        total_practice_minutes: (currentProgress?.total_practice_minutes || 0) + (drill.duration_minutes || 0),
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, currentProgress?.longest_streak || 0),
        last_practice_date: today,
        badges: newBadges,
        total_xp: (currentProgress?.total_xp || 0) + xpEarned,
      };

      if (currentProgress?.id) {
        await base44.entities.UserProgress.update(currentProgress.id, updateData);
      } else {
        await base44.entities.UserProgress.create({ user_email: guestId, ...updateData });
      }

      try {
        const allWorkouts = await base44.entities.CustomDrillWorkout.filter({ user_email: guestId });
        for (const workout of allWorkouts) {
          const drillsInWorkout = workout.drills || [];
          const drillIds = drillsInWorkout.map(d => d.drill_id);
          if (drillIds.includes(drill.id)) {
            const completedIds = [...new Set([...(workout.completed_drill_ids || []), drill.id])];
            const allDone = drillIds.length > 0 && drillIds.every(id => completedIds.includes(id));
            await base44.entities.CustomDrillWorkout.update(workout.id, {
              completed_drill_ids: completedIds,
              status: allDone ? 'completed' : 'in_progress',
            });
          }
        }
      } catch (e) { console.error('Failed to update drill workouts:', e); }

      const leaderboards = await base44.entities.Leaderboard.filter({ user_email: guestId });
      if (leaderboards.length > 0) {
        await base44.entities.Leaderboard.update(leaderboards[0].id, {
          total_xp: (leaderboards[0].total_xp || 0) + xpEarned,
          drills_completed: (leaderboards[0].drills_completed || 0) + 1,
          current_streak: newStreak,
          highest_streak: Math.max(newStreak, leaderboards[0].highest_streak || 0),
          weekly_minutes: (leaderboards[0].weekly_minutes || 0) + (drill.duration_minutes || 0)
        });
      } else {
        await base44.entities.Leaderboard.create({
          user_email: guestId,
          username: currentProgress?.display_name || 'Player',
          total_xp: xpEarned,
          drills_completed: 1,
          current_streak: newStreak,
          highest_streak: newStreak,
          weekly_minutes: drill.duration_minutes || 0
        });
      }

      await base44.entities.Notification.create({
        user_email: guestId,
        type: 'drill',
        title: `Drill Completed! 🎯 +${xpEarned} XP`,
        message: `"${drill.title}" completed! Keep up the great work!`,
        related_id: drill.id
      });
    },
    onSuccess: async () => {
      if (skillPathId && skillPathItemId) {
        try {
          const paths = await base44.entities.SkillPath.filter({ id: skillPathId });
          const path = paths[0];
          if (path && !path.completed_items.includes(skillPathItemId)) {
            await base44.entities.SkillPath.update(skillPathId, {
              completed_items: [...path.completed_items, skillPathItemId],
              xp: (path.xp || 0) + (drill?.xp_value || 50),
            });
          }
        } catch (e) { console.error('SkillPath update failed:', e); }
      }
      queryClient.invalidateQueries(['userProgress']);
      queryClient.invalidateQueries(['leaderboard']);
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['workout', workoutId]);
      queryClient.invalidateQueries(['userGeneratedWorkouts']);
      queryClient.invalidateQueries(['skillPath']);
      window.dispatchEvent(new CustomEvent('smartstart_item_completed', { detail: { type: 'drill', id: drillId, title: drill?.title } }));
      setIsCompleted(true);
      toast.success('Drill completed! Great work!');
    },
    onError: (error) => {
      console.error('Error completing drill:', error);
      toast.error('Failed to save completion. Please try again.');
    },
  });

  useEffect(() => {
    if (isStarted && !isCompleted && drill?.soundtrack_url && !audioElement) {
      const audio = new Audio(drill.soundtrack_url);
      audio.loop = true;
      audio.volume = 0.3;
      audio.play().catch(() => {});
      setAudioElement(audio);
    }
    return () => {
      if (audioElement) { audioElement.pause(); audioElement.src = ''; }
    };
  }, [isStarted, isCompleted, drill]);

  useEffect(() => {
    if (isCompleted && audioElement) audioElement.pause();
  }, [isCompleted, audioElement]);

  if (isLoading || !drill) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const steps = drill.steps || [];
  const equipment = drill.equipment || [];

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className={cn("bg-gradient-to-r px-6 pt-8 pb-20", categoryColors[drill.category])}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-white/80 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          {/* Prev / Next drill navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToDrill(prevDrill)}
              disabled={!prevDrill}
              className="flex items-center gap-1 text-white/80 hover:text-white disabled:opacity-30 text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>
            <button
              onClick={() => goToDrill(nextDrill)}
              disabled={!nextDrill}
              className="flex items-center gap-1 text-white/80 hover:text-white disabled:opacity-30 text-sm"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">{drill.title}</h1>
        
        <div className="flex items-center gap-4 text-white/80 flex-wrap">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {drill.duration_minutes} min
          </span>
          <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", levelColors[drill.skill_level])}>
            {drill.skill_level}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-400 text-amber-900">
            +{Math.round(Math.max(25, Math.min(500, (drill.duration_minutes || 5) * 5 * ({ beginner: 1, intermediate: 1.5, advanced: 2, pro: 3 }[drill.skill_level?.toLowerCase()] || 1))))} XP
          </span>
        </div>
        {drill.soundtrack_url && (
          <div className="flex items-center gap-2 text-white/80 mt-2">
            <Volume2 className="w-4 h-4" />
            <span className="text-xs">Focus soundtrack included</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 -mt-12 max-w-lg mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl p-6">
          {!isStarted ? (
            <>
              {drill.video_url && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Video className="w-5 h-5 text-red-500" />
                    Video Tutorial
                  </h3>
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 relative">
                    <iframe
                      width="100%" height="100%"
                      src={getYouTubeEmbedUrl(drill.video_url)}
                      title="Drill Tutorial"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onError={() => setYoutubeError(true)}
                      className="w-full h-full"
                    />
                    {youtubeError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white p-4 text-center">
                        <p>Video unavailable. Try another drill or check the URL.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {equipment.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-slate-400" />
                    Equipment Needed
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {equipment.map((item, index) => (
                      <span key={index} className="px-3 py-1.5 bg-slate-100 rounded-full text-sm text-slate-600">{item}</span>
                    ))}
                  </div>
                </div>
              )}

              {drill.target_metric && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <Target className="w-5 h-5 text-slate-400" />
                    Target
                  </h3>
                  <p className="text-slate-600">{drill.target_metric}</p>
                </div>
              )}

              <Button onClick={() => setIsStarted(true)} className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-xl h-12 text-lg">
                <Play className="w-5 h-5 mr-2" />
                Start Drill
              </Button>
            </>
          ) : isCompleted ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
              <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Awesome Job! 🎉</h2>
              <p className="text-slate-500 mb-6">You've completed this drill. Keep up the great work!</p>
              <div className="flex gap-3">
                <Button onClick={() => navigate(-1)} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                  Back to Drills
                </Button>
                {nextDrill && (
                  <Button onClick={() => goToDrill(nextDrill)} variant="outline" className="flex-1">
                    Next Drill →
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-500">Step {currentStep + 1} of {steps.length}</span>
                  <span className="text-sm font-medium text-emerald-600">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-slate-50 rounded-xl p-4 mb-6"
                >
                  <p className="text-lg text-slate-800">{steps[currentStep]}</p>
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button variant="outline" onClick={() => setCurrentStep(prev => prev - 1)} className="flex-1">
                    Previous
                  </Button>
                )}
                {currentStep < steps.length - 1 ? (
                  <Button onClick={() => setCurrentStep(prev => prev + 1)} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                    Next Step
                  </Button>
                ) : (
                  <Button
                    onClick={() => completeDrillMutation.mutate()}
                    disabled={completeDrillMutation.isPending}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  >
                    {completeDrillMutation.isPending ? 'Saving...' : 'Complete Drill ✓'}
                  </Button>
                )}
              </div>
            </>
          )}
        </motion.div>

        {drill.tips && !isStarted && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-1">Pro Tip</h3>
                <p className="text-sm text-amber-700">{drill.tips}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}