import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Flame, Trophy, Calendar, CheckCircle, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ThirtyDayChallenge() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
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
        title: '🔥 30-Day Challenge Started!'
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
      
      await base44.entities.ScheduledActivity.create({
        user_email: user.email,
        title: '🔥 30-Day Challenge Started!',
        notes: 'Your transformative journey begins today',
        date: today,
        activity_type: 'custom'
      });

      await base44.entities.Notification.create({
        user_email: user.email,
        type: 'achievement',
        title: '🎉 30-Day Challenge Started - Day 1!',
        message: 'Congratulations! You\'ve started Day 1 of your 30-day challenge! Keep going!',
        related_id: 'challenge_day_1'
      });

      // Store challenge start date for daily notifications
      localStorage.setItem('challenge_start_date', today);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['scheduledActivities'] });
      queryClient.invalidateQueries({ queryKey: ['savedChallenge'] });
      toast.success('Challenge started! 🔥');
      setChallengeStarted(true);
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
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-pink-50 p-4 overflow-y-auto">
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
              <h2 className="text-3xl font-bold text-white mb-2">
                Challenge Activated! 🔥
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

            <div className="p-6 border-t">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="w-full h-12"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-pink-50 flex items-center justify-center p-6 overflow-y-auto">
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
              <h1 className="text-3xl font-bold">30-Day Challenge</h1>
              <p className="text-orange-100 text-sm">Transform Your Game</p>
            </div>
          </div>
          <p className="text-orange-100 leading-relaxed">
            Join an elite program designed by world-class coaches. Build unshakeable mental toughness, master technical skills, and become the player you've always dreamed of being.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 space-y-4 max-h-96 overflow-y-auto">
          <h3 className="font-bold text-slate-800 text-lg mb-4 sticky top-0 bg-white z-10">What You'll Get:</h3>
          
          {[
            { icon: '🎯', title: 'Personalized Training Plan', desc: 'Custom workouts tailored to your level' },
            { icon: '🧠', title: 'Mental Coaching', desc: 'Build unbreakable confidence' },
            { icon: '📊', title: 'Daily Progress Tracking', desc: 'See your improvements every day' },
            { icon: '🏆', title: 'Exclusive Badges', desc: 'Unlock special achievements' },
            { icon: '💬', title: '24/7 AI Coach Support', desc: 'Get guidance anytime you need it' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">{item.title}</h4>
                <p className="text-xs text-slate-600">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {!showConfirm ? (
          <Button
            onClick={handleStartChallenge}
            className="w-full h-16 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-lg font-bold rounded-2xl shadow-lg"
          >
            🚀 Start My 30-Day Challenge
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
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                {startChallengeMutation.isPending ? 'Starting...' : "Yes, I'm Ready! 🔥"}
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}