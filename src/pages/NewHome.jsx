import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Target, 
  Brain, 
  Trophy, 
  BookOpen,
  ChevronRight,
  Sparkles,
  Star,
  Zap,
  TrendingUp,
  Smile,
  Meh,
  Frown,
  Clock,
  Activity
} from 'lucide-react';
import StreakDisplay from '@/components/common/StreakDisplay';
import DailyFact from '@/components/daily/DailyFact';
import QuickSearch from '@/components/home/QuickSearch';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const cricketJokes = [
  "Why did the cricket team go to the bank? To get their bowler!",
  "What do you call a cricket match in winter? A snow bowl!",
  "Why don't cricketers ever get lost? They always follow the pitch!",
  "What's a cricketer's favorite type of music? Swing!",
  "Why did the batsman bring string to the match? To tie the score!",
];

const confidenceLevels = [
  { value: 'not_great', label: 'Not Great', icon: Frown, color: 'bg-red-100 text-red-600 border-red-300' },
  { value: 'okay', label: 'Okay', icon: Meh, color: 'bg-amber-100 text-amber-600 border-amber-300' },
  { value: 'feeling_good', label: 'Feeling Good', icon: Smile, color: 'bg-emerald-100 text-emerald-600 border-emerald-300' },
];

function getCricketJoke() {
  const today = new Date().toDateString();
  const stored = localStorage.getItem('cricket_joke_date');
  const storedJoke = localStorage.getItem('cricket_joke');
  
  if (stored === today && storedJoke) {
    return storedJoke;
  }
  
  const randomJoke = cricketJokes[Math.floor(Math.random() * cricketJokes.length)];
  localStorage.setItem('cricket_joke_date', today);
  localStorage.setItem('cricket_joke', randomJoke);
  return randomJoke;
}

export default function NewHome() {
  const [greeting, setGreeting] = useState('');
  const [todayConfidence, setTodayConfidence] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    staleTime: 300000,
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
    refetchOnWindowFocus: true,
    retry: 3,
  });

  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const profiles = await base44.entities.UserProfile.filter({ user_email: user.email });
      return profiles[0] || null;
    },
    enabled: !!user?.email,
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const profiles = await base44.entities.Profile.filter({ user_email: user.email });
      return profiles[0] || null;
    },
    enabled: !!user?.email,
  });

  const { data: scenarioCompletions } = useQuery({
    queryKey: ['scenarioCompletions', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.ScenarioCompletion.filter({ user_email: user.email });
    },
    enabled: !!user?.email,
  });

  const { data: smartDrills, isLoading: loadingSmartDrills } = useQuery({
    queryKey: ['smartDrills', userProfile?.weak_areas, userProfile?.cricket_role, userProfile?.main_goals],
    queryFn: async () => {
      const allDrills = await base44.entities.Drill.list();
      
      if (!userProfile?.weak_areas && !userProfile?.main_goals && !userProfile?.cricket_role) {
        return allDrills.slice(0, 3);
      }
      
      // Match drills to user profile
      const scoredDrills = allDrills.map(drill => {
        let score = 0;
        
        // Match weak areas to target skills
        if (userProfile?.weak_areas) {
          userProfile.weak_areas.forEach(weakness => {
            if (drill.target_skill?.toLowerCase().includes(weakness.toLowerCase())) {
              score += 10;
            }
          });
        }
        
        // Match goals to drill categories
        if (userProfile?.main_goals) {
          userProfile.main_goals.forEach(goal => {
            if (goal.includes('technique') && drill.category === 'batting') score += 5;
            if (goal.includes('power') && drill.target_skill?.includes('power')) score += 8;
            if (goal.includes('fitness') && drill.category === 'fitness') score += 7;
            if (goal.includes('mental') && drill.category === 'mental') score += 7;
          });
        }
        
        // Match cricket role to drill category
        if (userProfile?.cricket_role) {
          if (userProfile.cricket_role === 'batsman' && drill.category === 'batting') score += 5;
          if (userProfile.cricket_role === 'bowler' && drill.category === 'bowling') score += 5;
          if (userProfile.cricket_role === 'all_rounder') score += 3;
        }
        
        return { ...drill, matchScore: score };
      });
      
      // Sort by score and return top 3
      return scoredDrills.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
    },
    enabled: !!userProfile,
  });

  // Calculate weekly minutes - only drills completed in the last 7 days
  const getWeeklyMinutes = () => {
    if (!progress?.completed_drills || progress.completed_drills.length === 0) return 0;
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    // In a real implementation, each drill completion would have a timestamp
    // For now, we'll use a simplified approach based on last practice date
    const lastPractice = progress.last_practice_date ? new Date(progress.last_practice_date) : null;
    
    if (!lastPractice || lastPractice < weekAgo) return 0;
    
    // Estimate: assume even distribution of practice over time
    const totalMinutes = progress.total_practice_minutes || 0;
    const totalDrills = progress.completed_drills.length;
    
    if (totalDrills === 0) return 0;
    
    // Simple heuristic: if last practice was this week, show proportional minutes
    const avgMinutesPerDrill = totalMinutes / totalDrills;
    const daysActive = Math.min(7, progress.current_streak || 1);
    
    return Math.round(avgMinutesPerDrill * daysActive);
  };

  // Calculate mini-match accuracy
  const getMiniMatchAccuracy = () => {
    if (!scenarioCompletions || scenarioCompletions.length === 0) return 0;
    const correct = scenarioCompletions.filter(c => c.was_correct).length;
    return Math.round((correct / scenarioCompletions.length) * 100);
  };

  // Calculate Match IQ
  const getMatchIQ = () => {
    const baseIQ = userProfile?.match_iq_rating || 50;
    const drillBonus = Math.min((progress?.completed_drills?.length || 0) * 2, 30);
    const accuracyBonus = Math.min(getMiniMatchAccuracy() / 2, 20);
    return Math.min(baseIQ + drillBonus + accuracyBonus, 100);
  };

  const saveConfidenceMutation = useMutation({
    mutationFn: async (confidence) => {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`confidence_${today}`, confidence);
      toast.success(`Thanks for sharing! Let's make it a great day! 💪`);
    },
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Check today's confidence
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`confidence_${today}`);
    if (saved) setTodayConfidence(saved);
  }, []);



  const displayName = profile?.username || progress?.display_name || user?.full_name?.split(' ')[0] || 'Champ';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 pb-24">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 px-6 pt-8 pb-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32" />
        
        <div className="relative max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <p className="text-emerald-100 text-sm">{greeting}!</p>
              <h1 className="text-2xl font-bold text-white">Hey, {displayName} 👋</h1>
            </div>
            {(progress?.current_streak || 0) > 0 && (
              <StreakDisplay streak={progress.current_streak} />
            )}
          </motion.div>

          {/* Joke of the Day */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 mb-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">😄</span>
              <h3 className="font-bold text-white text-sm">Cricket Joke of the Day</h3>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">{getCricketJoke()}</p>
          </motion.div>
        </div>
      </div>

      <div className="px-6 -mt-16 max-w-lg mx-auto space-y-6">
        {/* Coach Check-In */}
        {!todayConfidence && (
          <Link to={createPageUrl('ConfidenceCheckIn')}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-2xl cursor-pointer"
            >
              <h3 className="font-bold text-lg mb-2">🏏 Coach Check-In</h3>
              <p className="text-purple-100 text-sm mb-3">How confident are you feeling today?</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-200">Tap to share your mood →</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </motion.div>
          </Link>
        )}

        {/* Stats Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-6"
        >
          <h2 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-500" />
            Your Stats This Week
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-xl p-4">
              <Clock className="w-6 h-6 text-emerald-600 mb-2" />
              <p className="text-2xl font-bold text-emerald-600">{getWeeklyMinutes()}</p>
              <p className="text-xs text-slate-600">Minutes Trained</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <Target className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-600">{getMiniMatchAccuracy()}%</p>
              <p className="text-xs text-slate-600">Mini-Match Accuracy</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 col-span-2">
              <Brain className="w-6 h-6 text-purple-600 mb-2" />
              <p className="text-3xl font-bold text-purple-600">{getMatchIQ()}</p>
              <p className="text-xs text-slate-600">Match IQ Rating</p>
              <div className="mt-2 h-2 bg-purple-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600" style={{ width: `${getMatchIQ()}%` }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Smart Start */}
        {smartDrills && smartDrills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl shadow-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-white" />
              <h2 className="font-bold text-white text-lg">Smart Start</h2>
            </div>
            <p className="text-amber-100 text-sm mb-4">
              Based on your profile, here are recommended drills
            </p>
            <div className="space-y-3">
              {smartDrills.map(drill => (
                <Link key={drill.id} to={createPageUrl(`DrillDetail?id=${drill.id}`)}>
                  <div className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-xl p-4 transition-all">
                    <h4 className="font-bold text-white mb-1">{drill.title}</h4>
                    <p className="text-xs text-amber-100 capitalize">{drill.category} • {drill.duration_minutes} min</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-6"
        >
          <h2 className="font-bold text-slate-800 mb-5 flex items-center gap-2 text-lg">
            <Sparkles className="w-6 h-6 text-amber-500" />
            Let's Train!
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Ask Coach', icon: MessageCircle, color: 'bg-emerald-500', page: 'Coach' },
              { name: 'Practice', icon: Target, color: 'bg-blue-500', page: 'Drills' },
              { name: 'Mental', icon: Brain, color: 'bg-purple-500', page: 'MentalCoaching' },
              { name: 'Quiz', icon: BookOpen, color: 'bg-amber-500', page: 'Quizzes' },
            ].map((action) => (
              <Link key={action.name} to={createPageUrl(action.page)}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 transition-all shadow-lg hover:shadow-xl"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3 shadow-md`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">{action.name}</h3>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Cricket Fact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <DailyFact />
        </motion.div>

        {/* Progress Link */}
        <Link to={createPageUrl('Progress')}>
          <motion.div 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl shadow-2xl p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Your Progress</h3>
                <p className="text-sm text-emerald-50 font-medium">
                  {progress?.badges?.length || 0} badges • {progress?.completed_drills?.length || 0} drills
                </p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-white" />
          </motion.div>
        </Link>

        {/* Quick Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <QuickSearch />
        </motion.div>
      </div>
    </div>
  );
}