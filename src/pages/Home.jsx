import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Target, 
  Brain, 
  Trophy, 
  Flame,
  BookOpen,
  ChevronRight,
  Sparkles,
  Star,
  TrendingDown,
  Search,
  Moon,
  Sun
} from 'lucide-react';
import StreakDisplay from '@/components/common/StreakDisplay';
import DailyFact from '@/components/daily/DailyFact';
import SmartStart from '@/components/home/SmartStart';
import PlayerCheckIn from '@/components/home/PlayerCheckIn';
import QuickPageSearch from '@/components/home/QuickPageSearch';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const quickActions = [
  { 
    name: 'Ask Coach', 
    icon: MessageCircle, 
    color: 'bg-emerald-500',
    page: 'Coach',
    description: 'Get instant cricket tips'
  },
  { 
    name: 'Practice', 
    icon: Target, 
    color: 'bg-blue-500',
    page: 'Drills',
    description: 'Start a drill session'
  },
  { 
    name: 'Mental Training', 
    icon: Brain, 
    color: 'bg-purple-500',
    page: 'MentalCoaching',
    description: 'Build mental strength'
  },
  { 
    name: 'Quiz', 
    icon: BookOpen, 
    color: 'bg-amber-500',
    page: 'Quizzes',
    description: 'Test your knowledge'
  },
];

const cricketJokes = [
  "Why did the cricket team go to the bank? To get their bowler!",
  "What do you call a cricket match in winter? A snow bowl!",
  "Why don't cricketers ever get lost? They always follow the pitch!",
  "What's a cricketer's favorite type of music? Swing!",
  "Why did the batsman bring string to the match? To tie the score!",
  "What do you call a cricket player who's always cold? A chilly fielder!",
  "Why was the cricket pitch so wet? The bowlers kept throwing wides!",
  "What's a cricketer's favorite drink? Root beer - for the perfect stance!",
  "Why did the ball go to school? To get better at its spin!",
  "What do you call a dinosaur playing cricket? A Tyrannosaurus Rex-tra cover drive!",
  "Why don't cricketers tell secrets? Because too many people are in the field!",
  "What's a ghost's favorite cricket shot? The boo-ncer!",
  "Why was the cricketer always calm? They knew how to handle the pressure!",
  "What do you call a cricket ball that won't stop talking? A chatterbox!",
  "Why did the wicket keeper go to art class? To work on their catches!",
  "How does a cricket team stay cool? They stand near the fans!",
  "What's a bowler's favorite subject? Spin class!",
  "Why did the cricket bat go to the doctor? It had a bad case of the runs!",
  "What do you call a cricket player with no arms? Armless - but still a great fielder in spirit!",
  "Why was the cricket stadium so hot? All the fans left!",
  "What did the cricket ball say to the bat? Catch you later!",
  "Why don't cricket players ever get hungry? They're always at the crease!",
  "What's a cricketer's least favorite vegetable? A bowl of beans!",
  "Why did the umpire bring a ladder? To give a high decision!",
  "What do you call a cricket match between cats? A meow-t!",
  "Why did the bowler bring a map? To find the right line and length!",
  "What's a batsman's favorite dessert? A sweet spot!",
  "Why did the fielder bring a calendar? To catch the date!",
  "What do you call a cricket player who loves to garden? A groundskeeper!",
  "Why was the cricket ball unhappy? It was always getting hit!",
];

const cricketFacts = [
  "The fastest recorded cricket ball was bowled at 161.3 km/h (100.2 mph) by Shoaib Akhtar!",
  "The longest cricket match lasted 14 days between England and South Africa in 1939!",
  "Sachin Tendulkar holds the record for most runs in international cricket with 34,357 runs!",
  "The first-ever Test match was played in 1877 between Australia and England!",
  "A cricket ball can swing due to the Magnus effect and seam position!",
  "The highest team score in ODI cricket is 498/4 by England against Netherlands!",
  "Muttiah Muralitharan has the most Test wickets with 800!",
  "Cricket was originally called 'creag' which means 'stick' in old English!",
  "The Cricket World Cup trophy weighs 11 kilograms!",
  "A red cricket ball is used in Test matches and white/pink in limited overs!",
  "The term 'duck' comes from 'duck's egg' because 0 looks like an egg!",
  "India has won the Cricket World Cup twice (1983 and 2011)!",
  "The fastest Test century was scored in just 35 balls by AB de Villiers!",
  "Cricket stumps are exactly 28 inches (71.1 cm) high!",
  "The boundary rope must be at least 64 meters from the pitch center!",
  "A Test match can have a maximum of 450 overs bowled!",
  "The heaviest cricket bat ever used weighed 5 pounds!",
  "Shane Warne's 'Ball of the Century' spun 18 inches!",
  "Cricket balls are made from cork and leather with 5-6 layers!",
  "The Ashes urn is only 11cm tall and is never awarded to the winner!",
  "Brian Lara holds the record for highest Test innings: 400 not out!",
  "A cricket ball loses about 25% of its hardness after 30 overs!",
  "The DRS (Decision Review System) was first used in 2008!",
  "Willow wood is specifically chosen for cricket bats for its strength!",
  "The fastest ODI century was scored in 31 balls by AB de Villiers!",
  "Cricket whites became standard in the 1890s for better visibility!",
  "The bail groove in stumps is exactly 1/2 inch deep!",
  "Women's cricket was first played in 1745 in England!",
  "A perfect yorker lands at the batsman's toes, targeting base of stumps!",
  "The googly was invented by Bernard Bosanquet in 1900!",
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

function getCricketFact() {
  const today = new Date().toDateString();
  const stored = localStorage.getItem('cricket_fact_date');
  const storedFact = localStorage.getItem('cricket_fact');
  
  if (stored === today && storedFact) {
    return storedFact;
  }
  
  const randomFact = cricketFacts[Math.floor(Math.random() * cricketFacts.length)];
  localStorage.setItem('cricket_fact_date', today);
  localStorage.setItem('cricket_fact', randomFact);
  return randomFact;
}

export default function Home() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    // Default to dark mode
    localStorage.setItem('theme', 'dark');
    return true;
  });
  
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    staleTime: 300000,
    retry: 3,
  });

  const { data: progress, isLoading: progressLoading } = useQuery({
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

  // Auto-increment streak daily
  useEffect(() => {
    if (!user?.email || !progress) return;
    
    const checkAndUpdateStreak = async () => {
      const today = new Date().toISOString().split('T')[0];
      const lastPractice = progress.last_practice_date;
      
      if (lastPractice !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        const newStreak = lastPractice === yesterdayStr ? (progress.current_streak || 0) + 1 : 1;
        const longestStreak = Math.max(newStreak, progress.longest_streak || 0);
        
        await base44.entities.UserProgress.update(progress.id, {
          current_streak: newStreak,
          longest_streak: longestStreak,
          last_practice_date: today
        });
        
        queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      }
    };
    
    checkAndUpdateStreak();
  }, [user, progress]);

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const profiles = await base44.entities.UserProfile.filter({ user_email: user.email });
      return profiles[0] || null;
    },
    enabled: !!user?.email,
    staleTime: 60000,
    retry: 3,
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const displayName = progress?.display_name || user?.full_name?.split(' ')[0] || 'Champ';

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  const { data: challengeActivity } = useQuery({
    queryKey: ['challengeActivity', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const activities = await base44.entities.ScheduledActivity.filter({ 
        user_email: user.email,
        title: '🔥 30-Day Challenge Started!'
      });
      return activities[0] || null;
    },
    enabled: !!user?.email,
  });

  const startThirtyDayChallenge = async () => {
    if (!user?.email) return;

    try {
      await base44.entities.ScheduledActivity.create({
        user_email: user.email,
        type: 'challenge',
        title: '🔥 30-Day Challenge Started!',
        description: 'You've committed to 30 days of consistent training!',
        date: new Date().toISOString().split('T')[0],
      });
      queryClient.invalidateQueries({ queryKey: ['challengeActivity'] });
      toast.success('30-Day Challenge Started! Go get it! 🔥');
    } catch (error) {
      toast.error('Failed to start challenge. Please try again.');
      console.error('Failed to start 30-Day Challenge:', error);
    }
  };

  // Redirect to Get to Know You if not completed - only once per session
  useEffect(() => {
    const hasRedirected = sessionStorage.getItem('onboarding_redirect_done');
    if (user && userProfile !== undefined && !userProfile?.quiz_completed && !hasRedirected) {
      sessionStorage.setItem('onboarding_redirect_done', 'true');
      navigate(createPageUrl('GetToKnowYou'));
    }
  }, [user, userProfile]);

  if (userLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50'}`}>
      {/* Header */}
      <div className={`relative overflow-hidden px-6 pt-8 pb-24 transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800' : 'bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500'}`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-24 -translate-x-24" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        
        <div className="relative max-w-lg mx-auto">
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

          {/* Cricket Fact of the Day */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 mb-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🏏</span>
              <h3 className="font-bold text-white text-sm">Cricket Fact of the Day</h3>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">{getCricketFact()}</p>
          </motion.div>

          {/* Dark Mode Toggle */}
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={toggleDarkMode}
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 mb-4 flex items-center justify-between hover:bg-white/20 transition-colors"
          >
            <div className="flex items-center gap-2">
              {isDarkMode ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
              <span className="font-bold text-white text-sm">
                {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-white" />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <p className="text-emerald-100 text-sm mb-1">{greeting}!</p>
            <h1 className="text-2xl font-bold text-white mb-4">Hey, {displayName} 👋</h1>
            
            {(progress?.current_streak || 0) >= 0 && (
                <div className="flex justify-start">
                  <StreakDisplay streak={progress?.current_streak || 0} />
                </div>
              )}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-3 gap-3"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/25 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 shadow-lg"
            >
              <div className="text-3xl mb-1">🎯</div>
              <p className="text-2xl font-bold text-white">
                {progress?.completed_drills?.length || 0}
              </p>
              <p className="text-xs text-emerald-50 font-medium">Drills</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/25 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 shadow-lg"
            >
              <div className="text-3xl mb-1">⏱️</div>
              <p className="text-2xl font-bold text-white">
                {progress?.total_practice_minutes || 0}
              </p>
              <p className="text-xs text-emerald-50 font-medium">Minutes</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/25 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 shadow-lg"
            >
              <div className="text-3xl mb-1">🏆</div>
              <p className="text-2xl font-bold text-white">
                {progress?.total_xp || 0}
              </p>
              <p className="text-xs text-emerald-50 font-medium">XP</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-12 max-w-lg mx-auto space-y-6">
        {/* Player Check-In */}
        <PlayerCheckIn user={user} isDarkMode={isDarkMode} />

        {/* Smart Start */}
        <SmartStart isDarkMode={isDarkMode} />

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl shadow-2xl shadow-slate-300/50 p-6 border border-white/50"
        >
          <h2 className={`font-bold mb-5 flex items-center gap-2 text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            <Sparkles className="w-6 h-6 text-amber-500" />
            Let's Train!
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={action.name}
                to={createPageUrl(action.page)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`rounded-2xl p-5 transition-all shadow-lg hover:shadow-xl border ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 border-slate-600' 
                      : 'bg-gradient-to-br from-white to-slate-50 hover:from-slate-50 hover:to-slate-100 border-slate-100'
                  }`}
                >
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3 shadow-md`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{action.name}</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{action.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Daily Cricket Fact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DailyFact />
        </motion.div>

        {/* New Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`rounded-3xl shadow-2xl p-6 border ${
            isDarkMode 
              ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700' 
              : 'bg-gradient-to-br from-white to-purple-50/30 border-white/50'
          }`}
        >
          <h2 className={`font-bold mb-5 text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            <Star className="w-6 h-6 text-purple-500" />
            Explore More
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to={createPageUrl('FitnessBuilder')}>
              <motion.div 
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-2xl p-5 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="text-4xl mb-2">💪</div>
                <h3 className="font-bold text-white text-sm mb-1">Fitness Builder</h3>
                <p className="text-xs text-orange-50">AI workout plans</p>
              </motion.div>
            </Link>
            <Link to={createPageUrl('MiniMatch')}>
              <motion.div 
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl p-5 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="font-bold text-white text-sm mb-1">Mini-Match</h3>
                <p className="text-xs text-purple-50">Test your IQ</p>
              </motion.div>
            </Link>
            <Link to={createPageUrl('SkillPaths')}>
              <motion.div 
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-2xl p-5 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="text-4xl mb-2">🎯</div>
                <h3 className="font-bold text-white text-sm mb-1">Skill Paths</h3>
                <p className="text-xs text-emerald-50">Level up now</p>
              </motion.div>
            </Link>
            <Link to={createPageUrl('Leaderboard')}>
              <motion.div 
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-2xl p-5 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="text-4xl mb-2">🏆</div>
                <h3 className="font-bold text-white text-sm mb-1">Leaderboard</h3>
                <p className="text-xs text-amber-50">Compete globally</p>
              </motion.div>
            </Link>
            <Link to={createPageUrl('DrillWorkoutCreator')}>
              <motion.div 
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-2xl p-5 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="text-4xl mb-2">💪</div>
                <h3 className="font-bold text-white text-sm mb-1">Drill Workout</h3>
                <p className="text-xs text-indigo-50">Build your workout</p>
              </motion.div>
            </Link>
            <Link to={createPageUrl('WhyDidIGetOut')}>
              <motion.div 
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-2xl p-5 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="text-4xl mb-2">🔍</div>
                <h3 className="font-bold text-white text-sm mb-1">Why Got Out?</h3>
                <p className="text-xs text-red-50">Analyze dismissals</p>
              </motion.div>
            </Link>
            <Link to={createPageUrl('VideoAnalysis')}>
              <motion.div 
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-2xl p-5 transition-all shadow-lg hover:shadow-xl"
              >
                <div className="text-4xl mb-2">🎥</div>
                <h3 className="font-bold text-white text-sm mb-1">Video Analysis</h3>
                <p className="text-xs text-rose-50">Upload & analyze</p>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link to={createPageUrl('Progress')}>
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl shadow-2xl p-6 flex items-center justify-between hover:shadow-2xl transition-all border border-emerald-400"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
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
        </motion.div>

        {/* Quick Page Search - Bottom */}
        <QuickPageSearch isDarkMode={isDarkMode} />

        {/* 30-Day Challenge */}
        {user && !challengeActivity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`rounded-3xl shadow-2xl p-6 text-white text-center ${
              isDarkMode 
                ? 'bg-gradient-to-r from-pink-600 to-rose-600' 
                : 'bg-gradient-to-r from-pink-500 to-rose-500'
            }`}
          >
            <h3 className="font-bold text-xl mb-3">Ready for a Challenge?</h3>
            <p className="text-pink-100 mb-4">Join our 30-Day Training Challenge and level up your game!</p>
            <Button
              onClick={startThirtyDayChallenge}
              className="bg-white text-pink-600 hover:bg-pink-50"
            >
              <Flame className="w-5 h-5 mr-2" />
              Start 30-Day Challenge
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}