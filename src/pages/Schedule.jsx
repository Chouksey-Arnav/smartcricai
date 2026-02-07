import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Heart, Dumbbell, BookOpen, CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/common/Header';
import toast from 'react-hot-toast';
import { Checkbox } from '@/components/ui/checkbox';

export default function Schedule() {
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityData, setActivityData] = useState({
    title: '',
    notes: ''
  });
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['scheduledActivities', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const activities = await base44.entities.ScheduledActivity.filter({ 
        user_email: user.email
      });
      return activities;
    },
    enabled: !!user?.email,
  });

  const { data: checklistItems = [] } = useQuery({
    queryKey: ['checklistItems', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.ChecklistItem.filter({ user_email: user.email });
    },
    enabled: !!user?.email,
  });

  const addActivityMutation = useMutation({
    mutationFn: async (data) => {
      if (!user?.email || !data.title?.trim() || !data.date) {
        throw new Error('Missing required fields');
      }
      
      await base44.entities.ScheduledActivity.create({
        user_email: user.email,
        title: data.title.trim(),
        notes: data.notes?.trim() || '',
        date: data.date,
        activity_type: data.activity_type || 'custom'
      });

      // Create notification
      const dateObj = new Date(data.date);
      const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      await base44.entities.Notification.create({
        user_email: user.email,
        type: 'schedule',
        title: 'Activity Scheduled! 📅',
        message: `"${data.title}" added to ${formattedDate}`,
        related_id: data.date
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['scheduledActivities']);
      queryClient.invalidateQueries(['notifications']);
      toast.success('Activity logged!');
      setActivityData({ title: '', notes: '' });
      setShowForm(false);
      setSelectedDate(null);
    },
    onError: (error) => {
      console.error('Failed to save activity:', error);
      toast.error('Failed to save activity. Please try again.');
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: async (activityId) => {
      await base44.entities.ScheduledActivity.delete(activityId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['scheduledActivities']);
      toast.success('Activity removed');
    },
  });

  const addChecklistItemMutation = useMutation({
    mutationFn: async (title) => {
      if (!user?.email || !title?.trim()) {
        throw new Error('Missing required fields');
      }
      await base44.entities.ChecklistItem.create({
        user_email: user.email,
        title: title.trim(),
        is_completed: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['checklistItems']);
      setNewChecklistItem('');
      toast.success('Task added!');
    },
  });

  const toggleChecklistItemMutation = useMutation({
    mutationFn: async ({ id, is_completed }) => {
      await base44.entities.ChecklistItem.update(id, { is_completed: !is_completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['checklistItems']);
    },
  });

  const deleteChecklistItemMutation = useMutation({
    mutationFn: async (id) => {
      await base44.entities.ChecklistItem.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['checklistItems']);
      toast.success('Task deleted');
    },
  });

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!activityData.title || !activityData.title.trim()) {
      toast.error('Please enter activity title');
      return;
    }
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    
    addActivityMutation.mutate({
      title: activityData.title,
      notes: activityData.notes,
      date: selectedDate,
      activity_type: 'custom'
    });
  };

  const handleAddChecklistItem = (e) => {
    e.preventDefault();
    if (!newChecklistItem.trim()) {
      toast.error('Please enter a task');
      return;
    }
    addChecklistItemMutation.mutate(newChecklistItem);
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
    return activities.filter(activity => activity.date === dateStr);
  };

  const getActivityIcon = (activityType) => {
    switch (activityType) {
      case 'confidence_checkin': return <Heart className="w-4 h-4" />;
      case 'training': return <Dumbbell className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white pb-24">
      <Header title="Schedule" showSettings={false} />

      <div className="px-6 py-4 max-w-6xl mx-auto">
        {/* Extended View Button */}
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate(createPageUrl('ScheduleExtendedView'))}
          className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-2xl p-4 mb-6 flex items-center justify-center gap-2 shadow-lg"
        >
          <Calendar className="w-5 h-5" />
          <span className="font-semibold">Open Extended View</span>
        </motion.button>
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

              <form onSubmit={handleAddActivity} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Activity Title</label>
                  <Input
                    value={activityData.title}
                    onChange={(e) => setActivityData({ ...activityData, title: e.target.value })}
                    placeholder="e.g., Morning Practice, Team Meeting"
                    className="h-12"
                    autoFocus
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
                    type="button"
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
                    type="submit"
                    disabled={addActivityMutation.isPending}
                    className="flex-1 bg-violet-500 hover:bg-violet-600"
                  >
                    {addActivityMutation.isPending ? 'Saving...' : 'Save Activity'}
                  </Button>
                </div>
              </form>
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
                      return (
                        <div
                          key={activity.id}
                          onClick={() => setSelectedActivity(activity)}
                          className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-2 relative group cursor-pointer hover:from-violet-100 hover:to-purple-100 transition-colors"
                        >
                          <div className="flex items-start gap-1">
                            <div className="text-violet-600 mt-0.5">
                              {getActivityIcon(activity.activity_type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-800 truncate">
                                {activity.title}
                              </p>
                              {activity.notes && (
                                <p className="text-xs text-slate-500 truncate mt-0.5">{activity.notes}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteActivityMutation.mutate(activity.id);
                            }}
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

        {/* Activity Detail Modal */}
        <AnimatePresence>
          {selectedActivity && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedActivity(null)}
                className="fixed inset-0 bg-black/50 z-40"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl p-6 w-[90%] max-w-md z-50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-800">Activity Details</h3>
                  <button
                    onClick={() => setSelectedActivity(null)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Title</p>
                    <p className="font-semibold text-slate-800">{selectedActivity.title}</p>
                  </div>
                  {selectedActivity.notes && (
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Notes</p>
                      <p className="text-slate-700">{selectedActivity.notes}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Date</p>
                    <p className="text-slate-700">
                      {new Date(selectedActivity.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <Button
                    onClick={() => setSelectedActivity(null)}
                    className="w-full bg-violet-500 hover:bg-violet-600"
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            </>
            )}
            </AnimatePresence>

            {/* Checklist Section */}
            <div className="bg-white rounded-3xl shadow-xl p-6 mt-8">
            <h3 className="font-bold text-2xl text-slate-800 mb-6">My Tasks</h3>

            {/* Add New Task */}
            <form onSubmit={handleAddChecklistItem} className="flex gap-3 mb-6">
            <Input
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              placeholder="Add a new task..."
              className="h-12"
            />
            <Button 
              type="submit"
              disabled={addChecklistItemMutation.isPending}
              className="bg-violet-500 hover:bg-violet-600 shrink-0"
            >
              <Plus className="w-5 h-5" />
            </Button>
            </form>

            {/* Checklist Items */}
            <div className="space-y-3">
            {checklistItems.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No tasks yet. Add one above!</p>
              </div>
            ) : (
              checklistItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
                >
                  <button
                    onClick={() => toggleChecklistItemMutation.mutate({ id: item.id, is_completed: item.is_completed })}
                    className="shrink-0"
                  >
                    {item.is_completed ? (
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300" />
                    )}
                  </button>
                  <span className={`flex-1 ${item.is_completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {item.title}
                  </span>
                  <button
                    onClick={() => deleteChecklistItemMutation.mutate(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </motion.div>
              ))
            )}
            </div>
            </div>
            </div>
            </div>
            );
            }