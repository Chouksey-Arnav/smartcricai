import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Dumbbell, 
  Target, 
  CheckCircle2, 
  Play,
  ChevronLeft,
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
    // Extract video ID from various YouTube URL formats
    let videoId = null;
    
    // Format: https://www.youtube.com/watch?v=VIDEO_ID
    // Format: https://youtube.com/watch?v=VIDEO_ID
    // Format: http://www.youtube.com/watch?v=VIDEO_ID
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URL(url).searchParams;
      videoId = urlParams.get('v');
    }
    // Format: https://youtu.be/VIDEO_ID
    else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0];
    }
    // Format: https://www.youtube.com/embed/VIDEO_ID
    else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1]?.split('?')[0]?.split('&')[0];
    }
    // Format: https://www.youtube.com/v/VIDEO_ID
    else if (url.includes('youtube.com/v/')) {
      videoId = url.split('youtube.com/v/')[1]?.split('?')[0]?.split('&')[0];
    }
    
    // Clean the video ID (remove any trailing slashes or parameters)
    if (videoId) {
      videoId = videoId.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 11);
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (error) {
    console.error('Error parsing YouTube URL:', url, error);
  }
  
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

  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [youtubeError, setYoutubeError] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    staleTime: 300000,
    retry: 3,
  });

  const { data: drill, isLoading } = useQuery({
    queryKey: ['drill', drillId],
    queryFn: async () => {
      const drills = await base44.entities.Drill.filter({ id: drillId });
      return drills[0];
    },
    enabled: !!drillId,
    retry: 3,
  });

  const { data: progress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.UserProgress.filter({ user_email: user.email });
      return results[0] || null;
    },
    enabled: !!user?.email,
    staleTime: 60000,
    retry: 3,
  });

  const completeDrillMutation = useMutation({
    mutationFn: async () => {
      if (!user?.email || !drill) return;

      const today = new Date().toISOString().split('T')[0];
      const completedDrills = progress?.completed_drills || [];
      const lastPracticeDate = progress?.last_practice_date;
      
      let newStreak = progress?.current_streak || 0;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastPracticeDate === yesterdayStr) {
        newStreak += 1;
      } else if (lastPracticeDate !== today) {
        newStreak = 1;
      }

      const newBadges = [...(progress?.badges || [])];
      
      // Check for badges
      if (!completedDrills.includes(drill.id) && completedDrills.length === 0) {
        newBadges.push('first-drill');
      }
      if (newStreak >= 3 && !newBadges.includes('streak-3')) {
        newBadges.push('streak-3');
      }
      if (newStreak >= 7 && !newBadges.includes('streak-7')) {
        newBadges.push('streak-7');
      }
      if (completedDrills.length + 1 >= 10 && !newBadges.includes('drill-master')) {
        newBadges.push('drill-master');
      }

      const xpEarned = drill.xp_value || 50;
      const updateData = {
        completed_drills: [...new Set([...completedDrills, drill.id])],
        total_practice_minutes: (progress?.total_practice_minutes || 0) + (drill.duration_minutes || 0),
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, progress?.longest_streak || 0),
        last_practice_date: today,
        badges: newBadges,
        total_xp: (progress?.total_xp || 0) + xpEarned,
      };

      if (progress?.id) {
        await base44.entities.UserProgress.update(progress.id, updateData);
      } else {
        await base44.entities.UserProgress.create({
          user_email: user.email,
          ...updateData,
        });
      }

      // Create notification
      await base44.entities.Notification.create({
        user_email: user.email,
        type: 'drill',
        title: `Drill Completed! 🎯 +${xpEarned} XP`,
        message: `"${drill.title}" completed! Keep up the great work!`,
        related_id: drill.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProgress']);
      setIsCompleted(true);
      toast.success('Drill completed! Great work! 🎉');
    },
  });

  // Play soundtrack when drill starts
  useEffect(() => {
    if (isStarted && !isCompleted && drill?.soundtrack_url && !audioElement) {
      const audio = new Audio(drill.soundtrack_url);
      audio.loop = true;
      audio.volume = 0.3;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Silently handle autoplay restrictions
        });
      }
      setAudioElement(audio);
    }
    
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [isStarted, isCompleted, drill]);

  // Stop audio when completed
  useEffect(() => {
    if (isCompleted && audioElement) {
      audioElement.pause();
    }
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
      <div className={cn(
        "bg-gradient-to-r px-6 pt-8 pb-20",
        categoryColors[drill.category]
      )}>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-white/80 hover:text-white mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <h1 className="text-2xl font-bold text-white mb-2">{drill.title}</h1>
        
        <div className="flex items-center gap-4 text-white/80">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {drill.duration_minutes} min
          </span>
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
            levelColors[drill.skill_level]
          )}>
            {drill.skill_level}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-400 text-amber-900">
            +{drill.xp_value || 50} XP
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
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          {!isStarted ? (
            <>
              {/* Video Tutorial */}
              {drill.video_url && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Video className="w-5 h-5 text-red-500" />
                    Video Tutorial
                  </h3>
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 relative">
                    <iframe
                      width="100%"
                      height="100%"
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
                        <p>Video failed to load. Please check the URL or try again later.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Equipment */}
              {equipment.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-slate-400" />
                    Equipment Needed
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {equipment.map((item, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1.5 bg-slate-100 rounded-full text-sm text-slate-600"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Target */}
              {drill.target_metric && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    <Target className="w-5 h-5 text-slate-400" />
                    Target
                  </h3>
                  <p className="text-slate-600">{drill.target_metric}</p>
                </div>
              )}

              <Button
                onClick={() => setIsStarted(true)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-xl h-12 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Drill
              </Button>
            </>
          ) : isCompleted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                Awesome Job! 🎉
              </h2>
              <p className="text-slate-500 mb-6">
                You've completed this drill. Keep up the great work!
              </p>
              <Button
                onClick={() => navigate(-1)}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                Back to Drills
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Steps Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-500">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                  <span className="text-sm font-medium text-emerald-600">
                    {Math.round(((currentStep + 1) / steps.length) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
              </div>

              {/* Current Step */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-50 rounded-xl p-4 mb-6"
              >
                <p className="text-lg text-slate-800">{steps[currentStep]}</p>
              </motion.div>

              {/* Navigation */}
              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="flex-1"
                  >
                    Previous
                  </Button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  >
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

        {/* Tips */}
        {drill.tips && !isStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-amber-50 border border-amber-100 rounded-2xl p-4"
          >
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