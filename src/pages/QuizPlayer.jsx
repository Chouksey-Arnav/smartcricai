import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, Trophy, RotateCcw } from 'lucide-react';
import Header from '@/components/common/Header';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

export default function QuizPlayer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get('id');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

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
    queryKey: ['userProgress', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const results = await base44.entities.UserProgress.filter({ user_email: guestEmail });
      return results[0] || null;
    },
  });

  const saveProgressMutation = useMutation({
    mutationFn: async (score) => {
      try {
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
        const xpEarned = score >= 80 ? 100 : score >= 50 ? 50 : 25;
        const today = new Date().toISOString().split('T')[0];

        const quizScores = progress?.quiz_scores || [];
        const completedQuizzes = progress?.completed_quizzes || [];

        // Update streak logic
        const lastPractice = progress?.last_practice_date;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        let newStreak = progress?.current_streak || 0;
        if (lastPractice !== today) {
          newStreak = lastPractice === yesterdayStr ? newStreak + 1 : 1;
        }
        const longestStreak = Math.max(newStreak, progress?.longest_streak || 0);

        const updateData = {
          quiz_scores: [...quizScores, { quiz_id: quiz.id, score, date: today }],
          completed_quizzes: [...new Set([...completedQuizzes, quiz.id])],
          total_xp: (progress?.total_xp || 0) + xpEarned,
          last_practice_date: today,
          current_streak: newStreak,
          longest_streak: longestStreak
        };

        if (progress?.id) {
          await base44.entities.UserProgress.update(progress.id, updateData);
        } else {
          await base44.entities.UserProgress.create({
            user_email: guestId,
            ...updateData,
          });
        }

        const leaderboards = await base44.entities.Leaderboard.filter({ user_email: guestId });
        if (leaderboards.length > 0) {
          await base44.entities.Leaderboard.update(leaderboards[0].id, {
            total_xp: (leaderboards[0].total_xp || 0) + xpEarned,
            quizzes_completed: (leaderboards[0].quizzes_completed || 0) + 1,
            current_streak: newStreak,
            highest_streak: longestStreak
          });
        } else {
          await base44.entities.Leaderboard.create({
            user_email: guestId,
            username: user?.full_name || 'Guest Player',
            total_xp: xpEarned,
            quizzes_completed: 1,
            current_streak: 1,
            highest_streak: 1
          });
        }

        await base44.entities.Notification.create({
          user_email: guestId,
          type: 'quiz',
          title: `Quiz Complete! 🎯 +${xpEarned} XP`,
          message: `You scored ${score}% on "${quiz.title}"!`,
          related_id: quiz.id
        });
      } catch (error) {
        console.error('Error saving quiz progress:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProgress']);
      queryClient.invalidateQueries(['leaderboard']);
      queryClient.invalidateQueries(['notifications']);
      toast.success('Quiz results saved!');
    },
    onError: (error) => {
      console.error('Failed to save quiz results:', error);
      toast.error('Failed to save results. Your score is recorded locally.');
    },
  });

  if (isLoading || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = answers[currentQuestionIndex];

  const handleAnswer = (answerIndex) => {
    setAnswers({...answers, [currentQuestionIndex]: answerIndex});
  };

  const handleSubmit = () => {
    try {
      let correct = 0;
      questions.forEach((q, idx) => {
        if (answers[idx] === q.correct_answer) correct++;
      });
      
      const score = Math.round((correct / questions.length) * 100);
      setShowResults(true);
      saveProgressMutation.mutate(score);
      
      if (score >= 80) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz. Please try again.');
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct_answer) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  if (showResults) {
    const score = calculateScore();
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-slate-900 dark:to-slate-950 pb-24">
        <Header title="Quiz Results" showBack onBack={() => navigate(createPageUrl('Quizzes'))} showSettings={false} />
        
        <div className="px-6 py-6 max-w-lg mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-3xl p-8 text-center mb-6 ${
              score >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
              score >= 50 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
              'bg-gradient-to-r from-red-500 to-pink-500'
            } text-white`}
          >
            <Trophy className="w-20 h-20 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              {score >= 80 ? 'Excellent!' : score >= 50 ? 'Good Job!' : 'Keep Practicing!'}
            </h2>
            <p className="text-3xl font-bold text-white mb-2">{score}%</p>
            <p className="text-white/90">
              {questions.filter((q, idx) => answers[idx] === q.correct_answer).length} / {questions.length} correct
            </p>
          </motion.div>

          <div className="space-y-4 mb-6">
            {questions.map((q, idx) => {
              const userAns = answers[idx];
              const isCorrect = userAns === q.correct_answer;
              
              return (
                <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-4">
                  <div className="flex items-start gap-3 mb-3">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                    )}
                    <p className="font-semibold text-slate-800 dark:text-white">{q.question}</p>
                  </div>
                  
                  {q.explanation && (
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 mt-3">
                      <p className="text-sm text-slate-700 dark:text-slate-300"><strong>Explanation:</strong> {q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => navigate(createPageUrl('Quizzes'))}
              variant="outline"
              className="flex-1"
            >
              Back to Quizzes
            </Button>
            <Button
              onClick={handleRestart}
              className="flex-1 bg-amber-500 hover:bg-amber-600"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retake Quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-slate-900 dark:to-slate-950 pb-24">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-6 text-white">
        <button onClick={() => navigate(createPageUrl('Quizzes'))} className="mb-4">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-white">{quiz.title}</h1>
        <p className="text-amber-100 text-sm mt-1">Question {currentQuestionIndex + 1} of {questions.length}</p>
      </div>

      <div className="px-6 py-6 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6">
              <p className="text-lg font-medium text-slate-800 dark:text-white leading-relaxed">
                {currentQuestion.question}
              </p>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={cn(
                    "w-full p-4 rounded-2xl border-2 transition-all text-left",
                    userAnswer === index
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0",
                      userAnswer === index ? "bg-amber-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                    )}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-slate-700 dark:text-slate-200">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              {currentQuestionIndex > 0 && (
                <Button
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  variant="outline"
                  className="flex-1"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous
                </Button>
              )}
              
              {currentQuestionIndex < questions.length - 1 ? (
                <Button
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  disabled={userAnswer === undefined}
                  className="flex-1 bg-amber-500 hover:bg-amber-600"
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={userAnswer === undefined || saveProgressMutation.isPending}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                >
                  {saveProgressMutation.isPending ? 'Submitting...' : 'Submit Quiz'}
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}