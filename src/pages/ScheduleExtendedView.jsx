import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/common/Header';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { createPageUrl } from '@/utils';

export default function ScheduleExtendedView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [newActivity, setNewActivity] = useState({ title: '', notes: '', activity_type: 'practice' });

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

  const getGuestId = () => {
    if (user?.email) return user.email;
    return localStorage.getItem('smartcrick_guest_id') || 'guest@smartcrick.app';
  };

  const { data: activities = [], refetch: refetchActivities } = useQuery({
    queryKey: ['scheduledActivities', user?.email || 'guest'],
    queryFn: async () => {
      const guestId = getGuestId();
      return await base44.entities.ScheduledActivity.filter({ user_email: guestId });
    },
  });

  const { data: matches = [] } = useQuery({
    queryKey: ['matches', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      return await base44.entities.Match.filter({ user_email: guestEmail });
    },
  });

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(currentWeekStart, i));
    }
    return days;
  };

  const getActivitiesForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayActivities = activities.filter(a => a.date === dateStr);
    const dayMatches = matches.filter(m => m.match_date === dateStr);
    
    return [
      ...dayActivities.map(a => ({ ...a, type: 'activity', title: a.title })),
      ...dayMatches.map(m => ({ ...m, type: 'match', title: `${m.match_type} match` }))
    ];
  };

  const addActivityMutation = useMutation({
    mutationFn: async () => {
      const guestId = getGuestId();
      return await base44.entities.ScheduledActivity.create({
        user_email: guestId,
        title: newActivity.title,
        notes: newActivity.notes,
        date: selectedDay,
        activity_type: newActivity.activity_type
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledActivities'] });
      setShowActivityForm(false);
      setNewActivity({ title: '', notes: '', activity_type: 'practice' });
      toast.success('Activity added!');
    },
  });

  const nextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  const prevWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  const goToToday = () => setCurrentWeekStart(startOfWeek(new Date()));

  const weekDays = getWeekDays();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-950 pb-24">
      <Header title="Extended Schedule" showSettings={false} />

      <div className="px-4 py-4 max-w-6xl mx-auto space-y-4">
        {/* Navigation */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg">
          <Button onClick={() => navigate(createPageUrl('Schedule'))} variant="outline" className="gap-2">
            <X className="w-4 h-4" />
            Exit
          </Button>
          
          <div className="flex items-center gap-4">
            <Button onClick={prevWeek} variant="outline" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="text-center">
              <h3 className="font-bold text-slate-800 dark:text-white">
                {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
              </h3>
              <button
                onClick={goToToday}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Today
              </button>
            </div>

            <Button onClick={nextWeek} variant="outline" size="icon">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="w-24" />
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const dayActivities = getActivitiesForDate(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-lg border-2 min-h-[180px] ${
                  isToday ? 'border-indigo-500' : 'border-slate-100 dark:border-slate-700'
                }`}
              >
                <div className={`text-center mb-3 p-2 rounded-xl ${
                  isToday ? 'bg-indigo-500 text-white' : 'bg-slate-50 dark:bg-slate-700'
                }`}>
                  <div className={`text-xs font-semibold uppercase tracking-wide ${isToday ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                    {format(day, 'EEE')}
                  </div>
                  <div className={`text-xl font-bold ${isToday ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                    {format(day, 'd')}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedDay(format(day, 'yyyy-MM-dd'));
                    setShowActivityForm(true);
                  }}
                  className="w-full mb-2 p-1 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400 text-xs font-medium transition-colors"
                >
                  <Plus className="w-3 h-3 mx-auto" />
                </button>

                <div className="space-y-2">
                  {dayActivities.length === 0 ? (
                    <div className="text-center py-4">
                      <div className="text-2xl opacity-20">📅</div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">No events</p>
                    </div>
                  ) : (
                    dayActivities.map((item, idx) => {
                      const isCustomCheckin = item.activity_type === 'custom' && item.title?.includes('Check-In');
                      const is30DayChallenge = item.activity_type === '30_day_challenge';
                      
                      return (
                        <div
                          key={idx}
                          className={`p-2 rounded-lg text-xs ${
                            item.type === 'match'
                              ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
                              : is30DayChallenge
                              ? 'bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800'
                              : isCustomCheckin
                              ? 'bg-pink-50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800'
                              : 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                          }`}
                        >
                          <p className="font-semibold truncate text-slate-800 dark:text-white">
                            {item.type === 'match' ? '🏏 ' : 
                             is30DayChallenge ? '🔥 ' :
                             isCustomCheckin ? '💬 ' : ''}
                            {item.title || `${item.match_type} match`}
                          </p>
                          {item.notes && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">{item.notes}</p>
                          )}
                          {item.result && (
                            <span className={`text-xs font-bold ${
                              item.result === 'won' ? 'text-green-600' : 'text-slate-600 dark:text-slate-400'
                            }`}>
                              {item.result}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg">
          <h4 className="font-bold text-slate-800 dark:text-white mb-3">Legend</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Activities</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-50 border border-green-200 rounded" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Matches</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-indigo-500 rounded" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}