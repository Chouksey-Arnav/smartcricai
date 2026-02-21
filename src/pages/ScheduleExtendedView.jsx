import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/common/Header';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ScheduleExtendedView() {
  const navigate = useNavigate();
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));

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

  const { data: activities = [] } = useQuery({
    queryKey: ['scheduledActivities', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      return await base44.entities.ScheduledActivity.filter({ user_email: guestEmail });
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
      ...dayActivities.map(a => ({ ...a, type: 'activity' })),
      ...dayMatches.map(m => ({ ...m, type: 'match' }))
    ];
  };

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

                <div className="space-y-2">
                  {dayActivities.length === 0 ? (
                    <div className="text-center py-4">
                      <div className="text-2xl opacity-20">📅</div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">No events</p>
                    </div>
                  ) : (
                    dayActivities.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg text-xs ${
                          item.type === 'match'
                            ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
                            : 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        <p className="font-semibold truncate text-slate-800 dark:text-white">
                          {item.type === 'match' ? '🏏 ' : ''}
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
                    ))
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