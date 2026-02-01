import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Heart, Dumbbell, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/common/Header';
import toast from 'react-hot-toast';

export default function Schedule() {
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activityData, setActivityData] = useState({
    title: '',
    notes: ''
  });

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['userActivities', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const prefs = await base44.entities.UserPreferences.filter({ 
        user_email: user.email,
        preference_type: { $in: ['schedule_activity', 'confidence_checkin'] }
      });
      return prefs;
    },
    enabled: !!user?.email,
  });

  const addActivityMutation = useMutation({
    mutationFn: async () => {
      if (!user?.email || !activityData.title || !selectedDate) return;
      
      await base44.entities.UserPreferences.create({
        user_email: user.email,
        preference_type: 'schedule_activity',
        preference_value: JSON.stringify({
          title: activityData.title,
          notes: activityData.notes,
          date: selectedDate
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userActivities']);
      toast.success('Activity logged!');
      setActivityData({ title: '', notes: '' });
      setShowForm(false);
      setSelectedDate(null);
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: async (activityId) => {
      await base44.entities.UserPreferences.delete(activityId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userActivities']);
      toast.success('Activity removed');
    },
  });

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const handleAddActivity = () => {
    if (!activityData.title) {
      toast.error('Please enter activity title');
      return;
    }
    addActivityMutation.mutate();
  };

  const getCurrentWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek;
    const sunday = new Date(today.setDate(diff));
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const getActivitiesForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return activities.filter(activity => {
      try {
        const value = JSON.parse(activity.preference_value);
        return value.date === dateStr;
      } catch {
        return false;
      }
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'confidence_checkin': return <Heart className="w-4 h-4" />;
      case 'training': return <Dumbbell className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white pb-24">
      <Header title="Schedule" showSettings={false} />

      <div className="px-6 py-4 max-w-6xl mx-auto">
        {/* Activity Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-3xl shadow-xl p-6 mb-6 overflow-hidden"
            >
              <h3 className="font-bold text-lg text-slate-800 mb-4">
                Log Activity for {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Activity Title</label>
                  <Input
                    value={activityData.title}
                    onChange={(e) => setActivityData({ ...activityData, title: e.target.value })}
                    placeholder="e.g., Morning Practice, Team Meeting"
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Notes (Optional)</label>
                  <Textarea
                    value={activityData.notes}
                    onChange={(e) => setActivityData({ ...activityData, notes: e.target.value })}
                    placeholder="Add any details..."
                    className="h-24"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedDate(null);
                      setActivityData({ title: '', notes: '' });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddActivity}
                    disabled={addActivityMutation.isPending}
                    className="flex-1 bg-violet-500 hover:bg-violet-600"
                  >
                    {addActivityMutation.isPending ? 'Saving...' : 'Save Activity'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weekly Calendar Grid */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h3 className="font-bold text-2xl text-slate-800 mb-6">This Week</h3>
          
          <div className="grid grid-cols-7 gap-3">
            {getCurrentWeekDates().map((date, index) => {
              const dayActivities = getActivitiesForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              const dateStr = date.toISOString().split('T')[0];
              
              return (
                <div 
                  key={index} 
                  className="space-y-2 min-h-[200px] border-2 border-slate-100 rounded-xl p-3 hover:border-violet-200 transition-all"
                >
                  <div className={`text-center p-3 rounded-xl ${isToday ? 'bg-violet-500 text-white' : 'bg-slate-50'}`}>
                    <div className="text-xs font-semibold uppercase tracking-wide">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className={`text-2xl font-bold ${isToday ? 'text-white' : 'text-slate-800'}`}>
                      {date.getDate()}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDateClick(dateStr)}
                    className="w-full py-2 px-3 bg-violet-50 hover:bg-violet-100 rounded-lg text-violet-600 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                  
                  <div className="space-y-2">
                    {dayActivities.map((activity) => {
                      const value = JSON.parse(activity.preference_value);
                      const type = activity.preference_type;
                      
                      return (
                        <div
                          key={activity.id}
                          className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-2 relative group"
                        >
                          <div className="flex items-start gap-1">
                            <div className="text-violet-600 mt-0.5">
                              {getActivityIcon(type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-800 truncate">
                                {value.title || (type === 'confidence_checkin' ? 'Confidence Check-in' : 'Activity')}
                              </p>
                              {value.notes && (
                                <p className="text-xs text-slate-500 truncate mt-0.5">{value.notes}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteActivityMutation.mutate(activity.id)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}