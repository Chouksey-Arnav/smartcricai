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
  Sun,
  Clock,
  Dumbbell,
  Zap,
  Award,
  TrendingUp,
  Video,
  Calendar
} from 'lucide-react';
import StreakDisplay from '@/components/common/StreakDisplay';
import DailyFact from '@/components/daily/DailyFact';
import SmartStart from '@/components/home/SmartStart';
import PlayerCheckIn from '@/components/home/PlayerCheckIn';
import QuickPageSearch from '@/components/home/QuickPageSearch';
import HomeStats from '@/components/home/HomeStats';
import { Button } from '@/components/ui/button';

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
  // 30 more jokes
  "Why did the cricketer sit on the pitch? He wanted to be on the level!",
  "What do you call a cricketer who works at a bakery? A dough-nutter bowler!",
  "Why did the batsman bring sunscreen to the crease? He didn't want to get caught out in the sun!",
  "What's the difference between a bad cricket team and a triangle? A triangle has three points!",
  "Why don't cricketers ever play cards in the jungle? Too many cheetahs!",
  "What do you call a bowler who tells jokes? A spin comedian!",
  "Why did the cricket umpire go to art school? To learn how to draw a line!",
  "What do you call a cricketer who can't stop singing? Virat Ko-loli!",
  "Why did the cricket pitch go to therapy? It had too many crease issues!",
  "What do you call a nervous cricketer? A jitter-batsman!",
  "Why do cricket commentators never play poker? They always give away the score!",
  "What's a vampire's favorite cricket shot? The neck cut!",
  "Why did the cricketer bring a pencil to the match? In case he had to draw the game!",
  "What do you call it when two cricketers swap positions? A field day!",
  "Why was the cricket ball so good at school? It always had great spin!",
  "What did one cricket stump say to the other? You're bailing on me!",
  "Why can't cricketers ever win at chess? They always think it's a draw!",
  "What do you call a cricket player who becomes a chef? A batter!",
  "Why did the cricket team go to the library? To improve their over-reading!",
  "What do you call a cricketer who loses their bat? Wickedly lost!",
  "Why was the cricket coach good at fishing? He knew how to hook them!",
  "What's the most religious cricket shot? The prayer shot \u2014 and hoping it doesn't get caught!",
  "Why do cricketers make terrible thieves? They always get caught in the field!",
  "What did the cricket ball say when it hit the stumps? I've been on a roll!",
  "Why did the cricketer take an umbrella to the match? In case of a rain delay... or a light drizzle of runs!",
  "What do you call a cricketer with perfect hair? Well-groomed for the crease!",
  "Why did the fielder go to the gym? To improve his catch of the day!",
  "What do you call a cricket match with no boundaries? Very limited overs!",
  "Why did the batsman bring a spoon to the game? He heard there would be a googly!",
  "What do you call a fast bowler who can cook? A microwave \u2014 always heating things up!",
  "Why did the cricket team hire an electrician? They needed someone to handle the power play!",
  "What do you call a cricketer who loses every toss? A coin flipper with no luck!",
  "Why don't cricketers ever trust stairs? Because they're always up to something!",
  "What do you call a cricket ball that sings? A pitch-perfect delivery!",
  "Why was the cricket coach always relaxed? He knew how to pace himself!",
  "What do you call a cricket match between chefs? A batter bowl-off!",
  "Why did the cricket team visit the museum? To see the ancient Test match records!",
  "What's a cricketer's least favorite magic trick? When the ball disappears over the boundary!",
  "Why did the fielder study mathematics? To calculate the best catching angles!",
  "What do you call a bowler who always tells the truth? Someone with a very straight delivery!",
  "Why did the cricket coach become a dentist? He was always looking for a good extraction!",
  "What do you call a cricket player who's also a plumber? A drain bowler!",
  "Why did the cricket team buy a piano? To improve their scales — for the stumps!",
  "What's a spider's favorite fielding position? Silly mid-on, right in the web!",
  "Why did the fielder bring a torch to the match? To catch the night-watchman!",
  "What do you call a cricketer who's always early? A pre-match overachiever!",
  "Why was the cricket commentator so good at cooking? He knew exactly when to stir things up!",
  "What do you call a cricket match between accountants? A long-run affair!",
  "Why did the cricket ball go on a diet? It was getting too round for the crease!",
  "What do you call a cricket bat with no willow? A real stick in the mud!",
  "Why don't cricket players ever get lonely? They're always surrounded by the field!",
  "What did the umpire say to the impatient batsman? You've been given out — of patience!",
  "Why did the cricket ball refuse to bowl? It just wanted to roll with it!",
  "What do you call a cricket player who loves puzzles? A spin solver!",
  "Why did the cricket team open a bakery? They really knew how to roll the dough!",
  "What's a cricketer's favourite superhero? Captain No-Ball Man!",
  "Why did the batsman become a teacher? He had a great bat for knowledge!",
  "What do you call a cricket match that goes on forever? A real Test of patience!",
  "Why was the umpire always exhausted? Too many close calls!",
  "What do you call a cricketer who never stops running? The Energiser bunny — still going!",
  // 5 new jokes
  "Why did the cricket coach bring scissors to training? To cut short the bad overs!",
  "What do you call a cricketer who works in IT? A bug fixer — always dealing with glitches at the crease!",
  "Why do cricket bowlers make great musicians? They always find the perfect pitch!",
  "What did the cricket bat say at the end of the season? 'I'm absolutely stumped!'",
  "Why did the fielder bring a compass to the match? He kept losing his position at square leg!",
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
  // 30 more facts
  "MS Dhoni's lightning-fast stumping can happen in under 0.1 seconds!",
  "The Pink Ball used in Day-Night Tests was first used in 2015 between Australia and New Zealand.",
  "Virat Kohli holds the record for most ODI centuries as a run-chaser with 26 tons.",
  "The longest six in cricket history was hit by Shahid Afridi — estimated at 158 meters!",
  "Don Bradman's average of 99.94 is considered the greatest statistical achievement in all of sport.",
  "Chris Gayle is the only player to have hit a six off the first ball of a Test match!",
  "The outfield of a cricket ground can be as large as 4.6 acres — bigger than a football pitch!",
  "A cricket ball weighs between 155.9 and 163 grams — precisely regulated.",
  "India's 2011 World Cup win was watched by over 1 billion people live!",
  "The term 'sticky wicket' means a pitch that is difficult to bat on due to moisture.",
  "AB de Villiers retired at age 33 but his 360-degree batting style is still studied worldwide.",
  "The first Cricket World Cup was held in England in 1975 and won by the West Indies.",
  "The highest partnership in Test cricket is 624 runs by Jayawardene and Sangakkara.",
  "T20 cricket was introduced in England in 2003 to attract younger audiences.",
  "Fielders can legally use any part of their body to stop the ball except their feet if illegal.",
  "Glenn McGrath took 563 Test wickets despite famously not batting well.",
  "Waqar Younis popularized reverse swing bowling in the early 1990s.",
  "Cricket is the second most popular sport in the world after football!",
  "The original Laws of Cricket were codified in 1744 at the Artillery Ground in London.",
  "Jasprit Bumrah's unusual action makes him one of the hardest fast bowlers to face.",
  "A cricket ball swings more when one side is polished and the other is rough.",
  "Sachin Tendulkar scored 100 international centuries — a record that may never be broken.",
  "The highest run total in a single T20 over is 39 runs!",
  "In Test cricket, a match can officially be declared a draw even if both sides play to win.",
  "Leg spin is generally considered harder to bowl and harder to bat against than off spin.",
  "The crease lines in cricket are not just cosmetic — crossing them can result in dismissal!",
  "Ricky Ponting captained Australia to two World Cup victories in 2003 and 2007.",
  "A cricket ground can legally have different shaped boundaries on different sides.",
  "The Duckworth-Lewis-Stern method adjusts targets in rain-affected matches mathematically.",
  "Sir Garfield Sobers hit six sixes off one over — the first man ever to do so!",
  "The ICC (International Cricket Council) was founded in 1909 as the Imperial Cricket Conference!",
  "A cricket pitch is exactly 22 yards (20.12 m) long — a unit called a 'chain'!",
  "Sachin Tendulkar scored his 100th international century against Bangladesh in 2012!",
  "MS Dhoni invented the 'helicopter shot' — a unique scoop-sweep innovation!",
  "A red cricket ball swings more than a white one due to lacquer and construction differences!",
  "Jonty Rhodes revolutionized fielding standards in the 1990s with his athletic diving stops!",
  "The first day-night Test match was played in Adelaide, Australia in November 2015!",
  "Kevin Pietersen's 158 at The Oval in 2005 is considered one of cricket's greatest Ashes innings!",
  "Glenn McGrath was famous for accurately predicting match scorecard results before Tests!",
  "The highest T20 team total is 278/3 scored by Afghanistan against Ireland in 2019!",
  "The maximum team score in Test cricket is 952/6 declared by Sri Lanka in 1997!",
  "Lasith Malinga is the only bowler to take four wickets in four consecutive balls twice in ODIs!",
  "Steve Waugh played 168 Test matches — the most by any Australian at the time!",
  "Cricket is the only sport where the fielding team outnumbers the batting team on the field!",
  "Ian Botham's 149* at Headingley in 1981 is considered one of the greatest Test innings ever!",
  "The average Test match uses approximately 6 cricket balls throughout the game!",
  "Imran Khan led Pakistan to their first and only Cricket World Cup win in 1992!",
  "Kumar Sangakkara is the only player to score four consecutive ODI centuries!",
  "The first Test century was scored by Charles Bannerman for Australia in 1877!",
  "Anil Kumble is the only non-English bowler to take all 10 wickets in a Test innings!",
  "Clive Lloyd captained West Indies to back-to-back World Cups in 1975 and 1979!",
  "A 'Chinaman' is a left-arm unorthodox spinner's delivery that turns the opposite way!",
  "The highest individual ODI score is 264 by Rohit Sharma against Sri Lanka in 2014!",
  "Only two players have taken 800+ Test wickets: Murali (800) and Shane Warne (708)!",
  "Graeme Pollock of South Africa averaged 60.97 in Tests — the 3rd highest average ever!",
  "A bowler's run-up can legally be as long as they wish — there's no restriction!",
  "The first recorded women's cricket match took place in 1745 in Surrey, England!",
  "Ricky Ponting is one of only two players to captain a World Cup winning side twice!",
  "The highest partnership in all international cricket is 624 runs by Jayawardene and Sangakkara!",
  "Shoaib Akhtar's 161.3 km/h delivery against England in 2003 remains the fastest ever recorded!",
  // 5 new facts
  "The term 'hat-trick' in cricket means three wickets in three consecutive balls — first coined in 1858!",
  "Ben Stokes's 135* at Headingley in 2019 against Australia is considered one of the greatest ever Test innings!",
  "The cricket World Cup trophy has 'The Spirit of Cricket' engraved on its base.",
  "A cricket pitch's grass is cut to exactly 8mm before a Test match for consistent play.",
  "MS Dhoni is the only captain to have won all three ICC trophies: T20 WC, ODI WC, and Champions Trophy!",
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
    document.documentElement.classList.add('dark');
    return true;
  });
  
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading } = useQuery({
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

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ['userProgress', user?.email || 'guest'],
    queryFn: async () => {
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
      const results = await base44.entities.UserProgress.filter({ user_email: guestId });
      const currentProgress = results[0] || null;

      // Check and reset streak if needed
      if (currentProgress?.last_practice_date) {
        const today = new Date().toISOString().split('T')[0];
        const lastDate = currentProgress.last_practice_date;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // Reset streak if last practice was before yesterday
        if (lastDate !== today && lastDate !== yesterdayStr) {
          await base44.entities.UserProgress.update(currentProgress.id, {
            current_streak: 0
          });
          const leaderboards = await base44.entities.Leaderboard.filter({ user_email: guestId });
          if (leaderboards.length > 0) {
            await base44.entities.Leaderboard.update(leaderboards[0].id, {
              current_streak: 0
            });
          }
          return { ...currentProgress, current_streak: 0 };
        }
      }

      return currentProgress;
    },
    staleTime: 30000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 3,
  });

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
    queryKey: ['userProfile', user?.email || 'guest'],
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

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const profiles = await base44.entities.Profile.filter({ user_email: guestEmail });
      return profiles[0] || null;
    },
    staleTime: 60000,
  });

  const displayName = profile?.username || progress?.display_name || user?.full_name?.split(' ')[0] || 'Champ';

  useEffect(() => {
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

  useEffect(() => {
    const hasRedirected = sessionStorage.getItem('onboarding_redirect_done');
    if (user?.email && userProfile !== undefined && !userProfile?.quiz_completed && !hasRedirected) {
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
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-slate-950 to-black' : 'bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50'}`}>
      {/* Header */}
      <div className={`relative overflow-hidden px-6 pt-8 pb-24 transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-800 via-slate-800 to-gray-900' : 'bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500'}`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32" style={{ filter: 'blur(100px)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-24 -translate-x-24" style={{ filter: 'blur(100px)' }} />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl" style={{ filter: 'blur(50px)' }} />
        
        <div className="relative max-w-lg mx-auto pt-8">
          {/* Joke of the Day */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 mb-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
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
              <Target className="w-5 h-5 text-emerald-300" />
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
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-white">
                Hey, {displayName}
              </h1>
              <Link to={createPageUrl('ScheduleExtendedView')}>
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule
                </Button>
              </Link>
            </div>
            
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
            className="grid grid-cols-2 gap-3"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/25 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 shadow-lg"
            >
              <Target className="w-8 h-8 text-white mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">
                {progress?.completed_drills?.length || 0}
              </p>
              <p className="text-xs text-emerald-50 font-medium">Drills</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/25 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 shadow-lg"
            >
              <Brain className="w-8 h-8 text-white mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">
                {progress?.completed_mental_routines?.length || 0}
              </p>
              <p className="text-xs text-emerald-50 font-medium">Mental</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/25 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 shadow-lg"
            >
              <Clock className="w-8 h-8 text-white mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">
                {progress?.total_practice_minutes || 0}
              </p>
              <p className="text-xs text-emerald-50 font-medium">Minutes</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/25 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 shadow-lg"
            >
              <Trophy className="w-8 h-8 text-white mx-auto mb-1" />
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
        {/* Smart Start */}
        <div className="pt-2 mt-2">
          <SmartStart isDarkMode={isDarkMode} />
        </div>

        {/* Player Check-In */}
        <Link to={createPageUrl('ScheduleExtendedView')}>
          <PlayerCheckIn user={user} isDarkMode={isDarkMode} />
        </Link>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-3xl shadow-2xl p-6 border ${
            isDarkMode 
              ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700' 
              : 'bg-gradient-to-br from-white to-blue-50/30 border-white/50'
          }`}
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
          transition={{ delay: 0.35 }}
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
                <Dumbbell className="w-10 h-10 text-white mb-2" />
                <h3 className="font-bold text-white text-sm mb-1">Fitness Builder</h3>
                <p className="text-xs text-orange-50">AI workout plans</p>
              </motion.div>
            </Link>
            <Link to={createPageUrl('AIWorkout')}>
              <motion.div 
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-2xl p-5 transition-all shadow-lg hover:shadow-xl"
              >
                <Dumbbell className="w-10 h-10 text-white mb-2" />
                <h3 className="font-bold text-white text-sm mb-1">AI Workout</h3>
                <p className="text-xs text-cyan-50">Your custom workouts</p>
              </motion.div>
            </Link>
            <Link to={createPageUrl('MiniMatch')}>
              <motion.div 
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl p-5 transition-all shadow-lg hover:shadow-xl"
              >
                <Zap className="w-10 h-10 text-white mb-2" />
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
                <TrendingUp className="w-10 h-10 text-white mb-2" />
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
                <Award className="w-10 h-10 text-white mb-2" />
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
                <Target className="w-10 h-10 text-white mb-2" />
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
                <Search className="w-10 h-10 text-white mb-2" />
                <h3 className="font-bold text-white text-sm mb-1">Why Got Out?</h3>
                <p className="text-xs text-red-50">Analyze dismissals</p>
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
        <div className="h-16" />
      </div>
    </div>
  );
}