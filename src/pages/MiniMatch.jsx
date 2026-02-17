import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle, XCircle, Brain, Trophy, ArrowRight, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { scenarioDatabase, getRandomScenarios } from '@/components/match/ScenarioDatabase';

export default function MiniMatch() {
  const [gameStarted, setGameStarted] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerMode, setTimerMode] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
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

  const { data: completions } = useQuery({
    queryKey: ['scenarioCompletions', user?.email || 'guest'],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.ScenarioCompletion.filter({ user_email: user.email });
    },
    enabled: !!user?.email,
  });

  const saveCompletion = useMutation({
    mutationFn: async (data) => {
      if (!user?.email) return;
      return await base44.entities.ScenarioCompletion.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarioCompletions'] });
    },
  });

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
    setTimeLeft(timerMode); // Reset timer to selected mode
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
    if (!selectedOption && timerEnabled) {
      // Time ran out, mark as incorrect
      setSelectedOption(currentScenario.options[0]);
    }
    if (!selectedOption && !timerEnabled) return;
    
    setShowResult(true);

    if (user?.email) {
      saveCompletion.mutate({
        user_email: user.email,
        scenario_id: currentScenario.id,
        choice_made: selectedOption?.text || 'Time ran out',
        was_correct: selectedOption?.correct || false,
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
        {!gameStarted ? (
          /* Game Setup Screen */
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-6 text-white"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Cricket IQ Challenge</h2>
                  <p className="text-orange-100 text-sm">1000+ scenarios to test your mind</p>
                </div>
              </div>
              <p className="text-orange-100 text-sm mb-4">
                Make smart decisions under pressure. Every choice counts!
              </p>
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <p className="text-sm font-semibold mb-2">📊 Database: {scenarioDatabase.length}+ scenarios</p>
                <p className="text-xs text-orange-50">Batting • Bowling • Fielding • Captaincy • Pressure</p>
              </div>
            </motion.div>

            {/* Timer Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl p-6 border-2 border-orange-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Timer className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-800">⚡ Real-Time Decision Mode</h3>
                    <Switch
                      checked={timerEnabled}
                      onCheckedChange={setTimerEnabled}
                    />
                  </div>
                  <p className="text-sm text-slate-600 mb-3">
                    Choose your challenge level. No pausing, no undo. Simulates real match pressure.
                  </p>
                  {timerEnabled && (
                    <>
                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={() => setTimerMode(5)}
                          className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all ${
                            timerMode === 5 ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          5s
                        </button>
                        <button
                          onClick={() => setTimerMode(4)}
                          className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all ${
                            timerMode === 4 ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          4s
                        </button>
                        <button
                          onClick={() => setTimerMode(3)}
                          className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all ${
                            timerMode === 3 ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          3s
                        </button>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-xs text-red-700 font-medium">
                          ⚠️ Warning: Timer starts immediately. If time runs out, answer is marked wrong!
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Start Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={startGame}
                className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-lg font-bold"
              >
                <Brain className="w-6 h-6 mr-2" />
                Start Challenge
              </Button>
            </motion.div>
          </div>
        ) : (
          /* Game Screen */
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                ⚡ Mini-Match Situations
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Face realistic cricket moments and make smart decisions!
              </p>
            </motion.div>

            {/* Stats & Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-4 mb-6"
            >
              <div className={`grid ${timerEnabled && !showResult ? 'grid-cols-4' : 'grid-cols-3'} gap-4`}>
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
                {timerEnabled && !showResult && (
                  <div className={`text-center p-2 rounded-xl ${timeLeft <= 2 ? 'bg-red-100 animate-pulse' : 'bg-blue-100'}`}>
                    <p className={`text-2xl font-bold ${timeLeft <= 2 ? 'text-red-600' : 'text-blue-600'}`}>{timeLeft}s</p>
                    <p className="text-xs text-slate-500">Time</p>
                  </div>
                )}
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
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium capitalize">
                      {currentScenario.category}
                    </span>
                    {currentScenario.difficulty && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        currentScenario.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        currentScenario.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {currentScenario.difficulty}
                      </span>
                    )}
                  </div>

                  {/* Situation */}
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                      {currentScenario.situation}
                    </h2>
                    {currentScenario.question && (
                      <p className="text-slate-600 dark:text-slate-300 mb-4 font-medium">
                        {currentScenario.question}
                      </p>
                    )}

                    {/* Options */}
                    <div className="space-y-3">
                      {currentScenario.options.map((option, idx) => (
                        <motion.button
                          key={idx}
                          onClick={() => handleOptionSelect(option)}
                          disabled={showResult}
                          whileHover={{ scale: showResult ? 1 : 1.02 }}
                          whileTap={{ scale: showResult ? 1 : 0.98 }}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            selectedOption?.text === option.text
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
                            <span className="text-slate-800 dark:text-white font-medium">{option.text}</span>
                            {showResult && (
                              <>
                                {option.correct && (
                                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                                )}
                                {selectedOption?.text === option.text && !option.correct && (
                                  <XCircle className="w-5 h-5 text-red-600" />
                                )}
                              </>
                            )}
                          </div>
                          {showResult && (selectedOption?.text === option.text || option.correct) && (
                            <p className="text-sm text-slate-600 mt-2">
                              {option.explanation}
                            </p>
                          )}
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
                        <Button
                          onClick={pickRandomScenario}
                          variant="secondary"
                          className="w-full h-12 bg-white text-slate-800 hover:bg-white/90 mt-4"
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