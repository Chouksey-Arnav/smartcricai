import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Trophy, Target, Flame, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function NotificationBar({ onChallengeComplete }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const results = await base44.entities.Notification.filter({ 
        user_email: user.email 
      });
      return results.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 10);
    },
    enabled: !!user?.email,
  });

  // Generate dynamic challenges based on user progress
  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.UserProgress.filter({ user_email: user.email });
      return results[0] || null;
    },
    enabled: !!user?.email,
  });

  // Get today's completed drills count
  const today = new Date().toISOString().split('T')[0];
  const { data: todayDrills } = useQuery({
    queryKey: ['todayDrills', user?.email, today],
    queryFn: async () => {
      if (!user?.email) return [];
      const allWorkouts = await base44.entities.Workout.filter({ user_email: user.email });
      const todayWorkouts = allWorkouts.filter(w => 
        w.completed_date && w.completed_date.startsWith(today)
      );
      return todayWorkouts;
    },
    enabled: !!user?.email,
  });

  // Get today's quiz attempts
  const { data: todayQuizzes } = useQuery({
    queryKey: ['todayQuizzes', user?.email, today],
    queryFn: async () => {
      if (!user?.email || !userProgress?.quiz_scores) return 0;
      const todayQuizzes = userProgress.quiz_scores.filter(q => 
        q.date && q.date.startsWith(today) && q.score >= 80
      );
      return todayQuizzes.length;
    },
    enabled: !!user?.email && !!userProgress,
  });

  // Dynamic challenges based on actual progress
  const drillsCompletedToday = todayDrills?.length || 0;
  const quizzesPassedToday = todayQuizzes || 0;
  
  const challenges = [
    {
      id: 1,
      type: 'drill',
      title: 'Complete 3 Drills Today',
      description: 'Finish any 3 practice drills',
      current: drillsCompletedToday,
      target: 3,
      progress: Math.min((drillsCompletedToday / 3) * 100, 100),
      completed: drillsCompletedToday >= 3,
      reward: 50
    },
    {
      id: 2,
      type: 'quiz',
      title: 'Quiz Master',
      description: 'Pass 1 quiz with 80%+',
      current: quizzesPassedToday,
      target: 1,
      progress: Math.min((quizzesPassedToday / 1) * 100, 100),
      completed: quizzesPassedToday >= 1,
      reward: 30
    },
    {
      id: 3,
      type: 'streak',
      title: 'Weekly Streak',
      description: 'Practice every day this week',
      current: userProgress?.current_streak || 0,
      target: 7,
      progress: Math.min(((userProgress?.current_streak || 0) / 7) * 100, 100),
      completed: (userProgress?.current_streak || 0) >= 7,
      reward: 100
    },
    {
      id: 4,
      type: 'total',
      title: 'Practice Master',
      description: 'Complete 20 total drills',
      current: userProgress?.completed_drills?.length || 0,
      target: 20,
      progress: Math.min(((userProgress?.completed_drills?.length || 0) / 20) * 100, 100),
      completed: (userProgress?.completed_drills?.length || 0) >= 20,
      reward: 150
    }
  ];

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const unreadNotifications = notifications.filter(n => !n.is_read);
      await Promise.all(
        unreadNotifications.map(n => 
          base44.entities.Notification.update(n.id, { is_read: true })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const allNotifications = [...notifications, ...challenges];
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleOpen = () => {
    setIsOpen(true);
    // Mark all as read immediately when opening
    markAllReadMutation.mutate();
  };

  return (
    <>
      {/* Bell Button */}
      <button
        onClick={handleOpen}
        className="p-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all"
      >
        <div className="relative">
          <Bell className="w-7 h-7 text-slate-700 dark:text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </div>
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/30 z-50"
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-white" />
                <div>
                  <h2 className="text-xl font-bold text-white">Notifications</h2>
                  <p className="text-purple-100 text-sm">{unreadCount} unread</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="p-4 space-y-3">
              {allNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500">No notifications!</p>
                </div>
              ) : (
                allNotifications.map((notification, index) => {
                  const isChallenge = notification.target !== undefined;
                  return (
                  <motion.div
                    key={notification.id || `challenge-${notification.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {isChallenge ? (
                      <div
                        className={cn(
                          "p-4 rounded-2xl border-2 transition-all",
                          notification.completed
                            ? "bg-emerald-50 border-emerald-200"
                            : "bg-white border-purple-200"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                            notification.completed ? "bg-emerald-500" : "bg-purple-500"
                          )}>
                            {notification.type === 'drill' && <Target className="w-5 h-5 text-white" />}
                            {notification.type === 'quiz' && <Trophy className="w-5 h-5 text-white" />}
                            {notification.type === 'streak' && <Flame className="w-5 h-5 text-white" />}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-800 mb-1">{notification.title}</h3>
                            <p className="text-sm text-slate-600">{notification.description}</p>
                            {!notification.completed && (
                              <div className="mt-3">
                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                    style={{ width: `${notification.progress}%` }}
                                  />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                  {notification.current} / {notification.target}
                                </p>
                              </div>
                            )}
                            {notification.completed && (
                              <div className="mt-2 px-3 py-1 bg-emerald-100 rounded-full text-xs font-bold text-emerald-700 inline-block">
                                ✓ Completed! +{notification.reward} XP
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl border-2 bg-white border-blue-200">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-blue-500">
                            {notification.type === 'drill' && <Target className="w-5 h-5 text-white" />}
                            {notification.type === 'workout' && <Trophy className="w-5 h-5 text-white" />}
                            {notification.type === 'mental' && <Trophy className="w-5 h-5 text-white" />}
                            {notification.type === 'quiz' && <Trophy className="w-5 h-5 text-white" />}
                            {notification.type === 'schedule' && <Calendar className="w-5 h-5 text-white" />}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-800 mb-1">{notification.title}</h3>
                            <p className="text-sm text-slate-600">{notification.message}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              {new Date(notification.created_date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}