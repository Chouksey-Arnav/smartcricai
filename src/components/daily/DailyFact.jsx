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
  "Cricket stumps must weigh between 3-4 pounds each.",
  "MS Dhoni's lightning-fast stumping can happen in under 0.1 seconds!",
  "The Pink Ball used in Day-Night Tests was first introduced in 2015.",
  "Don Bradman's average of 99.94 is considered the greatest statistical achievement in sport.",
  "Chris Gayle is the only player to hit a six off the very first ball of a Test match!",
  "India's 2011 World Cup win was watched by over 1 billion people live!",
  "The term 'sticky wicket' means a pitch that is very difficult to bat on due to moisture.",
  "The first Cricket World Cup was held in England in 1975 and won by the West Indies.",
  "T20 cricket was introduced in England in 2003 to attract younger audiences.",
  "Cricket is the second most popular sport in the world after football!",
  "The original Laws of Cricket were codified in 1744 at the Artillery Ground in London.",
  "Jasprit Bumrah's unusual action makes him one of the hardest fast bowlers to face.",
  "Sachin Tendulkar scored 100 international centuries — a record that may never be broken.",
  "Leg spin is generally considered harder to bowl AND harder to bat against than off spin.",
  "Ricky Ponting captained Australia to two consecutive World Cup victories in 2003 and 2007.",
  "A cricket ground can legally have differently shaped boundaries on different sides!",
  "Sir Garfield Sobers hit six sixes off one over — the first man ever to do so in 1968!",
  "The highest ever Test score is 952/6 declared, by Sri Lanka against India in 1997.",
  "A maiden over means no runs were scored off the bat in that over.",
  "Virat Kohli has scored the most centuries (50+) in T20 International cricket.",
  "The heaviest ever recorded six was hit at 119m by Eoin Morgan in an IPL match!",
  "During a Test match, the ball must be replaced after 80 overs or if it goes out of shape.",
  "Cricketers can retire 'not out' voluntarily — they can come back to bat later if needed.",
  "England and Australia have played Ashes cricket since 1882 — over 140 years of rivalry!",
  "The cricket bat's sweet spot is about 2/3 down from the handle, not at the center.",
  "AB de Villiers once scored a century in just 31 balls — the fastest ODI century ever.",
  "Spin bowlers use their fingers to impart revolutions on the ball — up to 1500 RPM!",
  "Fielders must not touch the ball with a helmet placed on the ground — it gives away 5 runs.",
  "The highest partnership ever in T20 international cricket is 236 runs!",
  "Rain delays have their own science: the D/L method uses mathematical formulas to reset targets.",
  "A Test match day has a minimum of 90 overs — that's 540 balls bowled daily!"
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