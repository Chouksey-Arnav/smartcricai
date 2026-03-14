import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, Smile, Meh, Frown, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const moods = [
  { value: 'great', label: 'Great!', icon: Smile, color: 'from-emerald-500 to-teal-500' },
  { value: 'good', label: 'Good', icon: Smile, color: 'from-blue-500 to-cyan-500' },
  { value: 'okay', label: 'Okay', icon: Meh, color: 'from-amber-500 to-orange-500' },
  { value: 'not_great', label: 'Not Great', icon: Frown, color: 'from-orange-500 to-red-500' },
];

export default function PlayerCheckIn({ user, isDarkMode }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('checkin_date');
    return stored === today;
  });

  const checkInMutation = useMutation({
    mutationFn: async (mood) => {
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
      const guestId = user?.email || localStorage.getItem('smartcrick_guest_id') || `guest_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
      if (!user?.email) {
        localStorage.setItem('smartcrick_guest_id', guestId);
      }
      await base44.entities.ScheduledActivity.create({
        user_email: guestId,
        title: `Mood Check-In: ${mood.label}`,
        notes: `Feeling ${mood.label.toLowerCase()} today`,
        date: today,
        activity_type: 'custom'
      });
    },
    onMutate: (mood) => {
      // Optimistic: immediately show checked-in state
      setHasCheckedIn(true);
      setSelectedMood(mood);
    },
    onSuccess: (_, mood) => {
      const today = new Date().toDateString();
      localStorage.setItem('checkin_date', today);
      toast.success(`Check-in logged to schedule! 📅`);
      queryClient.invalidateQueries({ queryKey: ['scheduledActivities'] });
      setTimeout(() => {
        navigate(createPageUrl('ScheduleExtendedView'));
      }, 1000);
    },
    onError: () => {
      // Rollback optimistic update on error
      setHasCheckedIn(false);
      setSelectedMood(null);
      toast.error('Check-in failed. Please try again.');
    },
  });

  if (hasCheckedIn) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
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
            className={`p-4 rounded-2xl transition-all flex flex-col items-center ${
              isDarkMode
                ? 'bg-slate-700 hover:bg-slate-600 border border-slate-600'
                : 'bg-white hover:bg-slate-50 border border-slate-200'
            } ${checkInMutation.isPending && 'opacity-50'}`}
          >
            <mood.icon className={`w-10 h-10 mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`} />
            <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {mood.label}
            </p>
          </button>
        ))}
      </div>
    </motion.div>
  );
}