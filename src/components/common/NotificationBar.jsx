import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Trophy, Target, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotificationBar({ challenges = [], onChallengeComplete }) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = challenges.filter(c => !c.completed).length;

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
                  <h2 className="text-xl font-bold text-white">Daily Challenges</h2>
                  <p className="text-purple-100 text-sm">{unreadCount} active</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Challenges List */}
            <div className="p-4 space-y-3">
              {challenges.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500">No challenges today!</p>
                </div>
              ) : (
                challenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all",
                      challenge.completed
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-white border-purple-200"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        challenge.completed ? "bg-emerald-500" : "bg-purple-500"
                      )}>
                        {challenge.type === 'drill' && <Target className="w-5 h-5 text-white" />}
                        {challenge.type === 'quiz' && <Trophy className="w-5 h-5 text-white" />}
                        {challenge.type === 'streak' && <Flame className="w-5 h-5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 mb-1">{challenge.title}</h3>
                        <p className="text-sm text-slate-600">{challenge.description}</p>
                        {!challenge.completed && (
                          <div className="mt-3">
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                style={{ width: `${challenge.progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              {challenge.current} / {challenge.target}
                            </p>
                          </div>
                        )}
                        {challenge.completed && (
                          <div className="mt-2 px-3 py-1 bg-emerald-100 rounded-full text-xs font-bold text-emerald-700 inline-block">
                            ✓ Completed! +{challenge.reward} XP
                          </div>
                        )}
                      </div>
                    </div>
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