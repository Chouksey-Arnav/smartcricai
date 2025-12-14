import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle, XCircle, Brain, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const scenarios = [
  {
    id: 'batting_pressure_1',
    category: 'Batting',
    situation: "You need 10 runs from 4 balls. A medium pacer is bowling outside off-stump. What's the smartest shot?",
    options: [
      { id: 'a', text: 'Drive through covers', correct: true, explanation: "Great choice! A controlled drive keeps the ball along the ground and gives you a boundary chance while being smart." },
      { id: 'b', text: 'Go for a big slog', correct: false, explanation: "Too risky! With 4 balls left, you have time. A wild slog increases the chance of getting out." },
      { id: 'c', text: 'Take a calm single', correct: false, explanation: "Singles are good, but you need 10 from 4 - you need boundaries too!" },
      { id: 'd', text: 'Step across for a paddle', correct: false, explanation: "Creative, but outside off-stump isn't ideal for a paddle. Play to the ball's line." }
    ]
  },
  {
    id: 'bowling_strategy_1',
    category: 'Bowling',
    situation: "You're bowling the last over. The batter needs 12 runs. They love hitting straight. Where should you bowl?",
    options: [
      { id: 'a', text: 'Yorker outside off', correct: true, explanation: "Perfect! If they love straight shots, bowl wide and full to take away their strength." },
      { id: 'b', text: 'Bouncer at the body', correct: false, explanation: "Risky - a bouncer can go for 6 runs if they're expecting it in the last over." },
      { id: 'c', text: 'Full on middle stump', correct: false, explanation: "That's exactly where they want it for straight hitting!" },
      { id: 'd', text: 'Slow loopy ball', correct: false, explanation: "In the last over, batters are waiting for this. They'll launch it!" }
    ]
  },
  {
    id: 'fielding_placement_1',
    category: 'Fielding',
    situation: "The batter keeps hitting through the covers. You're the captain. What do you do?",
    options: [
      { id: 'a', text: 'Move a fielder to cover the gap', correct: true, explanation: "Smart captaincy! If they keep hitting one area, protect it." },
      { id: 'b', text: 'Keep the field the same', correct: false, explanation: "That's letting them score easy runs. Adapt to their shots!" },
      { id: 'c', text: 'Bring everyone close', correct: false, explanation: "Too aggressive - they'll just hit over the fielders." },
      { id: 'd', text: 'Set a deep field everywhere', correct: false, explanation: "That gives them easy singles. Be smarter about which area to protect." }
    ]
  },
  {
    id: 'batting_situation_2',
    category: 'Batting',
    situation: "First ball of your innings. Fast bowler steaming in. What's your mindset?",
    options: [
      { id: 'a', text: 'Watch the ball carefully, play safe', correct: true, explanation: "Perfect! The first ball is about getting your eye in. Stay calm and focused." },
      { id: 'b', text: 'Try to smash it for 6', correct: false, explanation: "Too aggressive! You haven't seen the pace or bounce yet. Settle in first." },
      { id: 'c', text: 'Close your eyes and swing', correct: false, explanation: "Never close your eyes! Watch the ball all the way." },
      { id: 'd', text: 'Step way back and defend', correct: false, explanation: "Going too far back gives you less time to react. Stay balanced in your stance." }
    ]
  },
  {
    id: 'running_awareness_1',
    category: 'Running',
    situation: "You hit the ball towards mid-on. Your partner shouts 'Wait!' but you see the fielder is slow. What do you do?",
    options: [
      { id: 'a', text: 'Listen to your partner and wait', correct: true, explanation: "Great teamwork! Your partner has a better view. Trust your teammate." },
      { id: 'b', text: 'Run anyway - you saw the gap', correct: false, explanation: "This causes mix-ups and run-outs! Always communicate and decide together." },
      { id: 'c', text: 'Run halfway then stop', correct: false, explanation: "Terrible idea! This is how run-outs happen. Make clear decisions." },
      { id: 'd', text: 'Argue with your partner', correct: false, explanation: "Never argue on the field! Clear communication wins matches." }
    ]
  },
  {
    id: 'pressure_mental_1',
    category: 'Mental Game',
    situation: "You just dropped an easy catch. Your team looks disappointed. What's the best thing to do?",
    options: [
      { id: 'a', text: 'Take a deep breath, refocus, move on', correct: true, explanation: "Perfect mindset! Everyone makes mistakes. Champions refocus quickly." },
      { id: 'b', text: 'Keep thinking about the drop', correct: false, explanation: "Dwelling on mistakes hurts your next chance. Let it go!" },
      { id: 'c', text: 'Hide away from the ball', correct: false, explanation: "Never hide! Show courage. The next chance is yours to take." },
      { id: 'd', text: 'Make excuses to teammates', correct: false, explanation: "Just say sorry if needed and move forward. Excuses don't help." }
    ]
  }
];

export default function MiniMatch() {
  const [currentScenario, setCurrentScenario] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: completions } = useQuery({
    queryKey: ['scenarioCompletions', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.ScenarioCompletion.filter({ user_email: user.email });
    },
    enabled: !!user?.email,
  });

  const saveCompletion = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.ScenarioCompletion.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarioCompletions'] });
    },
  });

  useEffect(() => {
    pickRandomScenario();
  }, []);

  // Timer logic
  useEffect(() => {
    if (!timerEnabled || !gameStarted || showResult || !currentScenario) return;
    
    if (timeLeft === 0) {
      // Auto-submit when time runs out
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timerEnabled, showResult, currentScenario, gameStarted]);

  const pickRandomScenario = () => {
    const random = getRandomScenarios(1)[0];
    setCurrentScenario(random);
    setSelectedOption(null);
    setShowResult(false);
    setTimeLeft(5); // Reset timer
  };

  const startGame = () => {
    setGameStarted(true);
    pickRandomScenario();
  };

  const handleOptionSelect = (option) => {
    if (showResult) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    setShowResult(true);

    if (user?.email) {
      saveCompletion.mutate({
        user_email: user.email,
        scenario_id: currentScenario.id,
        choice_made: selectedOption.text,
        was_correct: selectedOption.correct,
        completed_date: new Date().toISOString()
      });
    }
  };

  const completedCount = completions?.length || 0;
  const correctCount = completions?.filter(c => c.was_correct).length || 0;
  const accuracy = completedCount > 0 ? Math.round((correctCount / completedCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-24 pt-6">
      <div className="max-w-lg mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            ⚡ Mini-Match Situations
          </h1>
          <p className="text-slate-600">
            Face realistic cricket moments and make smart decisions!
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-4 mb-6"
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{completedCount}</p>
              <p className="text-xs text-slate-500">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{correctCount}</p>
              <p className="text-xs text-slate-500">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{accuracy}%</p>
              <p className="text-xs text-slate-500">Accuracy</p>
            </div>
          </div>
        </motion.div>

        {/* Scenario Card */}
        <AnimatePresence mode="wait">
          {currentScenario && (
            <motion.div
              key={currentScenario.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Category Badge */}
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {currentScenario.category}
                </span>
              </div>

              {/* Situation */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">
                  {currentScenario.situation}
                </h2>

                {/* Options */}
                <div className="space-y-3">
                  {currentScenario.options.map((option) => (
                    <motion.button
                      key={option.id}
                      onClick={() => handleOptionSelect(option)}
                      disabled={showResult}
                      whileHover={{ scale: showResult ? 1 : 1.02 }}
                      whileTap={{ scale: showResult ? 1 : 0.98 }}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedOption?.id === option.id
                          ? showResult
                            ? option.correct
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-red-500 bg-red-50'
                            : 'border-purple-500 bg-purple-50'
                          : showResult && option.correct
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-slate-800 font-medium">{option.text}</span>
                        {showResult && (
                          <>
                            {option.correct && (
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                            )}
                            {selectedOption?.id === option.id && !option.correct && (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                          </>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Submit Button */}
                {!showResult && (
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedOption}
                    className="w-full mt-6 h-12 bg-purple-600 hover:bg-purple-700"
                  >
                    Submit Answer
                  </Button>
                )}
              </div>

              {/* Result */}
              <AnimatePresence>
                {showResult && selectedOption && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl p-6 ${
                      selectedOption.correct
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        : 'bg-gradient-to-r from-orange-500 to-red-500'
                    } text-white`}
                  >
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                      {selectedOption.correct ? (
                        <>
                          <Trophy className="w-6 h-6" />
                          Great Choice! 🎉
                        </>
                      ) : (
                        <>
                          <Brain className="w-6 h-6" />
                          Learning Moment!
                        </>
                      )}
                    </h3>
                    <p className="text-white/90 mb-4">
                      {selectedOption.explanation}
                    </p>
                    <Button
                      onClick={pickRandomScenario}
                      variant="secondary"
                      className="w-full h-12 bg-white text-slate-800 hover:bg-white/90"
                    >
                      Next Situation
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}