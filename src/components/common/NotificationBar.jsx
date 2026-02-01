import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Trophy, Target, Flame, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function NotificationBar({ onChallengeComplete }) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
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

  // Dynamic challenges based on progress
  const challenges = [
    {
      id: 1,
      type: 'drill',
      title: 'Complete 3 Drills Today',
      description: 'Finish any 3 practice drills',
      current: 0,
      target: 3,
      progress: 0,
      completed: false,
      reward: 50
    },
    {
      id: 2,
      type: 'quiz',
      title: 'Quiz Master',
      description: 'Pass 1 quiz with 80%+',
      current: 0,
      target: 1,
      progress: 0,
      completed: false,
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
      type: 'mental',
      title: 'Mental Training',
      description: 'Complete 2 mental routines',
      current: 0,
      target: 2,
      progress: 0,
      completed: false,
      reward: 40
    },
    {
      id: 5,
      type: 'scenario',
      title: 'Mini-Match IQ',
      description: 'Complete 5 match scenarios',
      current: 0,
      target: 5,
      progress: 0,
      completed: false,
      reward: 55
    },
    {
      id: 6,
      type: 'fitness',
      title: 'Fitness Focus',
      description: 'Complete 1 workout session',
      current: 0,
      target: 1,
      progress: 0,
      completed: false,
      reward: 45
    },
    {
      id: 7,
      type: 'coach',
      title: 'Ask the Coach',
      description: 'Chat with AI Coach 3 times',
      current: 0,
      target: 3,
      progress: 0,
      completed: false,
      reward: 35
    },
    {
      id: 8,
      type: 'video',
      title: 'Video Analysis',
      description: 'Analyze 1 technique video',
      current: 0,
      target: 1,
      progress: 0,
      completed: false,
      reward: 60
    }
  ];

  const { data: preferences } = useQuery({
    queryKey: ['userPreferences', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const prefs = await base44.entities.UserPreferences.filter({ user_email: user.email });
      return prefs[0] || null;
    },
    enabled: !!user?.email,
  });

  // Fetch match notifications
  const { data: matchNotifications } = useQuery({
    queryKey: ['matchNotifications', preferences?.favorite_teams],
    queryFn: async () => {
      if (!preferences?.favorite_teams?.length) return [];
      
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Get upcoming matches in the next 24 hours for these teams: ${preferences.favorite_teams.join(', ')}.
        
Return match reminders with timing.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            notifications: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  team: { type: "string" },
                  match_info: { type: "string" },
                  time: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      return response?.notifications || [];
    },
    enabled: !!preferences?.favorite_teams?.length,
    refetchInterval: 600000, // Refresh every 10 minutes
  });

  const matchNots = (matchNotifications || []).map(m => ({
    id: `match-${m.team}`,
    type: 'match',
    title: `🏏 ${m.team} Match Alert`,
    description: `${m.match_info} - ${m.time}`,
    isMatch: true,
  }));

  const allNotifications = [...matchNots, ...challenges];
  const unreadCount = allNotifications.filter(n => !n.completed).length;

  return (
    <>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-40 p-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all"
      >
        <div className="relative">
          <Bell className="w-6 h-6 text-slate-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
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
                allNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {notification.isMatch ? (
                      <Link to={createPageUrl('CricketHub')} onClick={() => setIsOpen(false)}>
                        <div className="p-4 rounded-2xl border-2 bg-gradient-to-r from-red-50 to-orange-50 border-red-200 hover:border-red-300 transition-all cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-500">
                              <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-slate-800 mb-1">{notification.title}</h3>
                              <p className="text-sm text-slate-600">{notification.description}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : (
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
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}