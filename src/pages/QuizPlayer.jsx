import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  Trophy,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function QuizPlayer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get('id');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [answers, setAnswers] = useState([]);

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

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const quizzes = await base44.entities.Quiz.filter({ id: quizId });
      return quizzes[0];
    },
    enabled: !!quizId,
  });

  const { data: progress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.UserProgress.filter({ user_email: user.email });
      return results[0] || null;
    },
    enabled: !!user?.email,
  });

  const saveProgressMutation = useMutation({
    mutationFn: async (finalScore) => {
      if (!quiz) return;
      const guestEmail = user?.email || 'guest@smartcrick.app';

      const percentage = Math.round((finalScore / questions.length) * 100);
      const xpEarned = percentage >= 80 ? 100 : percentage >= 50 ? 50 : 25;

      // Create notification
      await base44.entities.Notification.create({
        user_email: guestEmail,
        type: 'quiz',
        title: `Quiz Completed! 📚 +${xpEarned} XP`,
        message: `You scored ${percentage}% on "${quiz.title}"!`,
        related_id: quiz.id
      });

      const completedQuizzes = progress?.completed_quizzes || [];
      const quizScores = progress?.quiz_scores || [];
      const newBadges = [...(progress?.badges || [])];

      // Check for badges
      if (finalScore === questions.length && !newBadges.includes('quiz-ace')) {
        newBadges.push('quiz-ace');
      }
      if (completedQuizzes.length + 1 >= 5 && !newBadges.includes('quick-learner')) {
        newBadges.push('quick-learner');
      }

      const updateData = {
        completed_quizzes: [...new Set([...completedQuizzes, quiz.id])],
        quiz_scores: [
          ...quizScores,
          {
            quiz_id: quiz.id,
            score: finalScore,
            date: new Date().toISOString(),
          }
        ],
        badges: newBadges,
        total_xp: (progress?.total_xp || 0) + xpEarned,
      };

      if (progress?.id) {
        await base44.entities.UserProgress.update(progress.id, updateData);
      } else {
        await base44.entities.UserProgress.create({
          user_email: guestEmail,
          ...updateData,
        });
      }

      // Update Leaderboard
      const leaderboards = await base44.entities.Leaderboard.filter({ user_email: guestEmail });
      if (leaderboards.length > 0) {
        await base44.entities.Leaderboard.update(leaderboards[0].id, {
          total_xp: (leaderboards[0].total_xp || 0) + xpEarned,
          quizzes_passed: (leaderboards[0].quizzes_passed || 0) + (percentage >= 80 ? 1 : 0)
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProgress']);
      queryClient.invalidateQueries(['notifications']);
    },
  });

  const questions = quiz?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (answerIndex) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const isCorrect = answerIndex === currentQuestion.correct_answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setAnswers(prev => [...prev, { questionIndex: currentQuestionIndex, selected: answerIndex, isCorrect }]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const finalScore = score + (selectedAnswer === currentQuestion.correct_answer ? 0 : 0);
      saveProgressMutation.mutate(score);
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setIsFinished(false);
    setAnswers([]);
  };

  if (isLoading || !quiz) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-700 mb-3"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <h1 className="text-xl font-bold text-slate-800">{quiz.title}</h1>
        
        {!isFinished && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>Score: {score}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-amber-500 rounded-full"
                animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 py-6 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {isFinished ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className={cn(
                "w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center",
                percentage >= 80 ? "bg-emerald-100" : percentage >= 50 ? "bg-amber-100" : "bg-red-100"
              )}>
                <Trophy className={cn(
                  "w-12 h-12",
                  percentage >= 80 ? "text-emerald-600" : percentage >= 50 ? "text-amber-600" : "text-red-600"
                )} />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {percentage >= 80 ? 'Excellent!' : percentage >= 50 ? 'Good Job!' : 'Keep Practicing!'}
              </h2>
              
              <p className="text-slate-500 mb-2">
                You scored {score} out of {questions.length}
              </p>
              
              <div className="text-5xl font-bold text-amber-500 mb-6">
                {percentage}%
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleRestart}
                  variant="outline"
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button
                  onClick={() => navigate(-1)}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  Back to Quizzes
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Question */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
                <p className="text-lg font-medium text-slate-800 leading-relaxed">
                  {currentQuestion?.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion?.options?.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQuestion.correct_answer;
                  
                  let optionStyle = "bg-white border-slate-200 hover:border-amber-300";
                  if (showResult) {
                    if (isCorrect) {
                      optionStyle = "bg-emerald-50 border-emerald-400";
                    } else if (isSelected && !isCorrect) {
                      optionStyle = "bg-red-50 border-red-400";
                    }
                  } else if (isSelected) {
                    optionStyle = "bg-amber-50 border-amber-400";
                  }

                  return (
                    <motion.button
                      key={index}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(index)}
                      disabled={showResult}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3",
                        optionStyle
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                        showResult && isCorrect ? "bg-emerald-500 text-white" :
                        showResult && isSelected ? "bg-red-500 text-white" :
                        "bg-slate-100 text-slate-600"
                      )}>
                        {showResult && isCorrect ? <CheckCircle2 className="w-5 h-5" /> :
                         showResult && isSelected ? <XCircle className="w-5 h-5" /> :
                         String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-slate-700">{option}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showResult && currentQuestion?.explanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4"
                  >
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">💡 Explanation: </span>
                      {currentQuestion.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Next Button */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <Button
                    onClick={handleNext}
                    className="w-full bg-amber-500 hover:bg-amber-600 gap-2"
                  >
                    {currentQuestionIndex < questions.length - 1 ? (
                      <>Next Question <ArrowRight className="w-4 h-4" /></>
                    ) : (
                      'See Results'
                    )}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}