import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, X } from 'lucide-react';
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
    queryFn: () => base44.auth.me(),
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['scheduledActivities', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.ScheduledActivity.filter({ user_email: user.email });
    },
    enabled: !!user?.email,
  });

  const { data: matches = [] } = useQuery({
    queryKey: ['matches', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.Match.filter({ user_email: user.email });
    },
    enabled: !!user?.email,
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
      <Header title="Extended Schedule View" />

      <div className="px-4 py-4 max-w-6xl mx-auto space-y-4">
        {/* Navigation */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-lg">
          <Button onClick={() => navigate(createPageUrl('Schedule'))} variant="outline" className="gap-2">
            <X className="w-4 h-4" />
            Exit
          </Button>
          
          <div className="flex items-center gap-4">
            <Button onClick={prevWeek} variant="outline" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="text-center">
              <h3 className="font-bold text-slate-800">
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
                className={`bg-white rounded-2xl p-3 shadow-lg border-2 min-h-[180px] ${
                  isToday ? 'border-blue-500' : 'border-slate-100'
                }`}
              >
                {/* Day Header */}
                <div className={`text-center mb-3 p-2 rounded-xl ${
                  isToday ? 'bg-blue-500 text-white' : 'bg-slate-50'
                }`}>
                  <div className="text-xs font-semibold uppercase tracking-wide">
                    {format(day, 'EEE')}
                  </div>
                  <div className={`text-xl font-bold ${isToday ? 'text-white' : 'text-slate-800'}`}>
                    {format(day, 'd')}
                  </div>
                </div>

                {/* Activities */}
                <div className="space-y-2">
                  {dayActivities.length === 0 ? (
                    <div className="text-center py-4">
                      <div className="text-2xl opacity-20">📅</div>
                      <p className="text-xs text-slate-400 mt-1">No events</p>
                    </div>
                  ) : (
                    dayActivities.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg text-xs ${
                          item.type === 'match'
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-blue-50 border border-blue-200'
                        }`}
                      >
                        <p className="font-semibold truncate text-slate-800">
                          {item.type === 'match' ? '🏏 ' : ''}
                          {item.title || `${item.match_type} match`}
                        </p>
                        {item.notes && (
                          <p className="text-xs text-slate-600 truncate mt-0.5">{item.notes}</p>
                        )}
                        {item.result && (
                          <span className={`text-xs font-bold ${
                            item.result === 'won' ? 'text-green-600' : 'text-slate-600'
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
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <h4 className="font-bold text-slate-800 mb-3">Legend</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded" />
              <span className="text-sm text-slate-600">Activities</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-50 border border-green-200 rounded" />
              <span className="text-sm text-slate-600">Matches</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 rounded" />
              <span className="text-sm text-slate-600">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}