import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Zap, Dumbbell, ChevronRight } from 'lucide-react';
import Header from '@/components/common/Header';
import { cn } from '@/lib/utils';

export default function WorkoutHistory() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['workoutHistory', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const results = await base44.entities.WorkoutHistory.filter({ user_email: user.email });
      return results.sort((a, b) => new Date(b.completed_date) - new Date(a.completed_date));
    },
    enabled: !!user?.email,
  });

  const totalXP = history.reduce((sum, h) => sum + (h.xp_earned || 0), 0);
  const totalWorkouts = history.length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-24">
      <Header title="Workout History" />

      <div className="px-6 py-4 max-w-lg mx-auto space-y-6">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-5 text-white">
            <Dumbbell className="w-8 h-8 mb-2" />
            <p className="text-purple-100 text-sm">Total Workouts</p>
            <p className="text-3xl font-bold">{totalWorkouts}</p>
          </div>
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-5 text-white">
            <Zap className="w-8 h-8 mb-2" />
            <p className="text-amber-100 text-sm">Total XP</p>
            <p className="text-3xl font-bold">{totalXP}</p>
          </div>
        </motion.div>

        {/* History List */}
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500">No workout history yet</p>
              <p className="text-sm text-slate-400">Complete your first workout to see it here!</p>
            </div>
          ) : (
            history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-5 shadow-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-800">{item.workout_name}</h3>
                    <p className="text-sm text-slate-500 capitalize">{item.workout_type?.replace('_', ' ')}</p>
                  </div>
                  <div className="px-3 py-1 bg-amber-100 rounded-full">
                    <span className="text-amber-700 font-bold text-sm">+{item.xp_earned} XP</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(item.completed_date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Dumbbell className="w-4 h-4" />
                    {item.exercises?.length || 0} exercises
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}