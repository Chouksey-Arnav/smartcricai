import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, Smile, Meh, Frown, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

const moods = [
  { value: 'great', label: 'Great!', icon: Smile, color: 'from-emerald-500 to-teal-500', emoji: '😊' },
  { value: 'good', label: 'Good', icon: Smile, color: 'from-blue-500 to-cyan-500', emoji: '🙂' },
  { value: 'okay', label: 'Okay', icon: Meh, color: 'from-amber-500 to-orange-500', emoji: '😐' },
  { value: 'not_great', label: 'Not Great', icon: Frown, color: 'from-orange-500 to-red-500', emoji: '😞' },
];

export default function PlayerCheckIn({ user, isDarkMode }) {
  const queryClient = useQueryClient();
  const [selectedMood, setSelectedMood] = useState(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('checkin_date');
    return stored === today;
  });

  const checkInMutation = useMutation({
    mutationFn: async (mood) => {
      const today = new Date().toISOString().split('T')[0];
      await base44.entities.ScheduledActivity.create({
        user_email: user.email,
        title: `Mood Check-In: ${mood.label}`,
        notes: `Feeling ${mood.label.toLowerCase()} today ${mood.emoji}`,
        date: today,
        activity_type: 'custom'
      });
    },
    onSuccess: (_, mood) => {
      const today = new Date().toDateString();
      localStorage.setItem('checkin_date', today);
      setHasCheckedIn(true);
      toast.success(`Check-in saved! Hope you have a great training session! ${mood.emoji}`);
      queryClient.invalidateQueries({ queryKey: ['scheduledActivities'] });
    },
  });

  if (hasCheckedIn) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`rounded-3xl shadow-2xl p-6 border ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700' 
          : 'bg-gradient-to-br from-white to-pink-50/30 border-white/50'
      }`}
    >
      <h2 className={`font-bold mb-4 text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
        <Heart className="w-6 h-6 text-pink-500" />
        Player Check-In
      </h2>
      <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
        How are you feeling today?
      </p>
      <div className="grid grid-cols-2 gap-3">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => {
              setSelectedMood(mood);
              checkInMutation.mutate(mood);
            }}
            disabled={checkInMutation.isPending}
            className={`p-4 rounded-2xl transition-all ${
              isDarkMode
                ? 'bg-slate-700 hover:bg-slate-600 border border-slate-600'
                : 'bg-white hover:bg-slate-50 border border-slate-200'
            } ${checkInMutation.isPending && 'opacity-50'}`}
          >
            <div className="text-3xl mb-2">{mood.emoji}</div>
            <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {mood.label}
            </p>
          </button>
        ))}
      </div>
    </motion.div>
  );
}