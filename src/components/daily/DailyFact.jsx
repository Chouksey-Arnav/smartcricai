import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';

const cricketFacts = [
  "Did you know the longest cricket match lasted 12 days? It was between England and South Africa in 1939!",
  "Some batters close their eyes for half a second to relax before every ball. Try it in practice!",
  "Fast bowlers take around 15-18 steps in a run-up on average.",
  "The cricket ball can reach speeds over 160 km/h (100 mph) from fast bowlers!",
  "A cricket bat can't be more than 38 inches long or 4.25 inches wide.",
  "The stumps are exactly 28 inches tall - about as tall as a 2-year-old child!",
  "In Test cricket, bowlers have bowled over 800 balls in a single innings!",
  "The fastest recorded delivery in cricket was 161.3 km/h by Shoaib Akhtar!",
  "Cricket balls are made with a cork center wrapped in layers of yarn and leather.",
  "The Ashes urn is only about 4 inches tall - tiny but legendary!",
  "A six must clear the boundary rope without touching the ground first.",
  "Wicketkeepers squat and stand up hundreds of times in a match - great leg workout!",
  "The word 'cricket' might come from an old word meaning 'stick' or 'staff'.",
  "Professional cricket balls are stitched by hand with over 60-80 stitches!",
  "Some players wear zinc cream on their face to protect from the sun.",
  "In cricket, 'duck' means getting out without scoring any runs - named after a duck's egg (0)!",
  "The middle stump is exactly in the center, with equal gaps on both sides.",
  "A cricket pitch is 22 yards long - about the same as 20 normal steps!",
  "Spin bowlers can make the ball turn up to 45 degrees from the pitch!",
  "The world's oldest cricket ground still in use is in London, opened in 1814!",
  "Sachin Tendulkar played international cricket for 24 years - longer than many careers!",
  "The boundary rope must be at least 65 yards from the center of the pitch.",
  "Cricket whites became tradition in the 1890s to reflect heat and look professional.",
  "The fastest century in T20 cricket was scored in just 35 balls!",
  "A cricket ball loses about 15% of its weight during a match from wear and tear.",
  "The Duckworth-Lewis method uses 50,000 possible match scenarios to calculate fair targets!",
  "Professional cricket bats are made from willow trees that are 15-20 years old.",
  "The 'leg before wicket' (LBW) rule has been part of cricket since 1774!",
  "In Test cricket, a new ball is available every 80 overs - that's about 480 deliveries!",
  "Cricket stumps must weigh between 3-4 pounds each."
];

export default function DailyFact() {
  const [fact, setFact] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadDailyFact();
  }, []);

  const loadDailyFact = () => {
    // Get fact based on current day
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('cricketFactDate');
    const savedFact = localStorage.getItem('cricketFact');

    if (savedDate === today && savedFact) {
      setFact(savedFact);
    } else {
      const randomFact = cricketFacts[Math.floor(Math.random() * cricketFacts.length)];
      setFact(randomFact);
      localStorage.setItem('cricketFactDate', today);
      localStorage.setItem('cricketFact', randomFact);
    }
  };

  const refreshFact = () => {
    setIsRefreshing(true);
    const randomFact = cricketFacts[Math.floor(Math.random() * cricketFacts.length)];
    setFact(randomFact);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-amber-800">Daily Cricket Fact</h3>
        </div>
        <button
          onClick={refreshFact}
          className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-5 h-5 text-amber-600 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <motion.p
        key={fact}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-amber-900 leading-relaxed"
      >
        {fact}
      </motion.p>
    </motion.div>
  );
}