import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Flame, Trophy, Calendar, CheckCircle, ChevronLeft, Loader2, Target, Brain, TrendingUp, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ThirtyDayChallenge() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
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

  const [showConfirm, setShowConfirm] = useState(false);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  // Check if challenge was started before
  const { data: savedChallenge } = useQuery({
    queryKey: ['savedChallenge', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const activities = await base44.entities.ScheduledActivity.filter({ 
        user_email: user.email,
        title: 'SmartCrick 30-Day Challenge Started!'
      });
      return activities.length > 0 ? activities[0] : null;
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (savedChallenge) {
      setChallengeStarted(true);
    }
  }, [savedChallenge]);

  const startChallengeMutation = useMutation({
    mutationFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const guestEmail = user?.email || 'guest@smartcrick.app';
      
      // Create 30 scheduled activities for each day
      const promises = [];
      for (let day = 0; day < 30; day++) {
        const date = new Date();
        date.setDate(date.getDate() + day);
        const dateStr = date.toISOString().split('T')[0];
        
        promises.push(
          base44.entities.ScheduledActivity.create({
            user_email: guestEmail,
            title: `30-Day Challenge - Day ${day + 1}`,
            notes: `Complete your training for Day ${day + 1}`,
            date: dateStr,
            activity_type: '30_day_challenge'
          })
        );
      }
      
      await Promise.all(promises);

      await base44.entities.Notification.create({
        user_email: guestEmail,
        type: 'achievement',
        title: '30-Day Challenge Started - Day 1!',
        message: 'Congratulations! You\'ve started Day 1 of your 30-day challenge! Keep going!',
        related_id: 'challenge_day_1'
      });

      localStorage.setItem('challenge_start_date', today);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['scheduledActivities'] });
      queryClient.invalidateQueries({ queryKey: ['savedChallenge'] });
      toast.success('Challenge started!');
      setChallengeStarted(true);
    },
  });

  const stopChallengeMutation = useMutation({
    mutationFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      
      // Delete all 30-day challenge activities
      const activities = await base44.entities.ScheduledActivity.filter({
        user_email: guestEmail,
        activity_type: '30_day_challenge'
      });
      
      await Promise.all(activities.map(act => base44.entities.ScheduledActivity.delete(act.id)));
      
      // Delete challenge start notification
      const startActivity = await base44.entities.ScheduledActivity.filter({
        user_email: guestEmail,
        title: 'SmartCrick 30-Day Challenge Started!'
      });
      
      if (startActivity.length > 0) {
        await base44.entities.ScheduledActivity.delete(startActivity[0].id);
      }
      
      localStorage.removeItem('challenge_start_date');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['scheduledActivities'] });
      queryClient.invalidateQueries({ queryKey: ['savedChallenge'] });
      toast.success('Challenge stopped');
      setChallengeStarted(false);
    },
  });

  const handleStartChallenge = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }
    startChallengeMutation.mutate();
  };

  if (challengeStarted) {
    return (
      <div className="min-h-screen bg-white p-4 overflow-y-auto">
        <div className="w-full max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                <Flame className="w-8 h-8" />
                Challenge Activated!
              </h2>
              <p className="text-orange-50">
                Chat with your coach to build your personalized 30-day plan!
              </p>
            </div>

            <div className="p-4 relative">
              {iframeLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">Loading your AI coach...</p>
                  </div>
                </div>
              )}
              <iframe 
                src="https://app.relevanceai.com/agents/bcbe5a/e5e3eeef-250d-4d16-8d49-ebcf5906ce75/96280cd8-d70c-48d3-a1fd-0736eb4ab744/embed-chat?hide_tool_steps=false&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Type+your+message...&hide_logo=false&hide_description=false"
                width="100%" 
                height="800px" 
                frameBorder="0" 
                allow="microphone"
                className="rounded-2xl"
                onLoad={() => setIframeLoading(false)}
              />
            </div>

            <div className="p-6 border-t space-y-3">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="w-full h-12"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
              <Button
                onClick={() => {
                  if (confirm('Are you sure you want to stop the 30-Day Challenge? All progress will be reset.')) {
                    stopChallengeMutation.mutate();
                  }
                }}
                disabled={stopChallengeMutation.isPending}
                variant="destructive"
                className="w-full h-12"
              >
                {stopChallengeMutation.isPending ? 'Stopping...' : 'Stop 30-Day Challenge'}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full max-h-screen overflow-y-auto"
      >
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-8 text-white shadow-2xl mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Flame className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">30-Day Challenge Architect</h1>
              <p className="text-white/90 text-sm">Step into the future of high-performance cricket</p>
            </div>
          </div>
          <p className="text-white/90 leading-relaxed">
            Join an elite program designed by world-class coaches. Build unshakeable mental toughness, master technical skills, and become the player you've always dreamed of being with the Smart Cricket 30-Day Architect.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 mb-6 space-y-4 max-h-96 overflow-y-auto">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-4 sticky top-0 bg-white dark:bg-slate-800 z-10">What You'll Get:</h3>
          
          {[
            { Icon: Target, title: 'Personalized Training Plan', desc: 'Custom workouts tailored to your level' },
            { Icon: Brain, title: 'Mental Coaching', desc: 'Build unbreakable confidence' },
            { Icon: TrendingUp, title: 'Daily Progress Tracking', desc: 'See your improvements every day' },
            { Icon: Trophy, title: 'Exclusive Badges', desc: 'Unlock special achievements' },
            { Icon: MessageCircle, title: '24/7 AI Coach Support', desc: 'Get guidance anytime you need it' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                <item.Icon className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-white text-sm">{item.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {!showConfirm ? (
          <Button
            onClick={handleStartChallenge}
            className="w-full h-16 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-lg font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2"
          >
            <Flame className="w-6 h-6" />
            Start My 30-Day Challenge
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-6 space-y-4 max-h-64 overflow-y-auto"
          >
            <p className="text-amber-800 font-semibold text-center">
              Are you ready to commit to 30 days of focused training?
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowConfirm(false)}
                variant="outline"
                className="flex-1"
              >
                Not Yet
              </Button>
              <Button
                onClick={handleStartChallenge}
                disabled={startChallengeMutation.isPending}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 flex items-center justify-center gap-2"
              >
                {startChallengeMutation.isPending ? (
                  'Starting...'
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Yes, I'm Ready!
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}