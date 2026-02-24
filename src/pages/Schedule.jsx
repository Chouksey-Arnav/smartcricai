import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, Plus, Trash2, CheckCircle, Circle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Header from '@/components/common/Header';
import { format, startOfWeek, addDays } from 'date-fns';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const activityIcons = {
  practice: '🏏',
  match: '🏆',
  training: '💪',
  mental: '🧠',
  rest: '😌',
  other: '📌'
};

export default function Schedule() {
  const queryClient = useQueryClient();
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [newActivity, setNewActivity] = useState({ title: '', notes: '', activity_type: 'practice' });
  const [newTask, setNewTask] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);

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
    let guestId = localStorage.getItem('smartcrick_guest_id');
    if (!guestId) {
      guestId = `guest_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
      localStorage.setItem('smartcrick_guest_id', guestId);
    }
    return guestId;
  };

  const { data: activities = [] } = useQuery({
    queryKey: ['scheduledActivities', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      return await base44.entities.ScheduledActivity.filter({ user_email: guestEmail });
    },
  });

  const { data: checklistItems = [] } = useQuery({
    queryKey: ['checklistItems', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      return await base44.entities.ChecklistItem.filter({ user_email: guestEmail });
    },
  });

  const addActivityMutation = useMutation({
    mutationFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      return await base44.entities.ScheduledActivity.create({
        user_email: guestEmail,
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

  const deleteActivityMutation = useMutation({
    mutationFn: (id) => base44.entities.ScheduledActivity.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledActivities'] });
      toast.success('Activity deleted');
    },
  });

  const addTaskMutation = useMutation({
    mutationFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      return await base44.entities.ChecklistItem.create({
        user_email: guestEmail,
        task: newTask,
        completed: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklistItems'] });
      setNewTask('');
      toast.success('Task added!');
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: ({ id, completed }) => base44.entities.ChecklistItem.update(id, { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklistItems'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id) => base44.entities.ChecklistItem.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklistItems'] });
      toast.success('Task deleted');
    },
  });

  const weekStart = startOfWeek(new Date());
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getActivitiesForDay = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return activities.filter(a => a.date === dateStr);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white dark:from-slate-900 dark:to-slate-950 pb-52">
      <Header title="My Schedule" showSettings={false} />
      
      <div className="px-6 py-4 max-w-4xl mx-auto space-y-6">
        <Link to={createPageUrl('ScheduleExtendedView')}>
          <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
            Open Extended View
          </Button>
        </Link>

        <h3 className="font-bold text-2xl text-slate-800 dark:text-white mb-6">This Week</h3>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const dayActivities = getActivitiesForDay(day);
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white dark:bg-slate-800 rounded-2xl p-3 min-h-[140px] border-2 ${
                  isToday ? 'border-violet-500' : 'border-slate-100 dark:border-slate-700'
                }`}
              >
                <div className={`text-center mb-2 p-2 rounded-lg ${
                  isToday ? 'bg-violet-500 text-white' : 'bg-slate-50 dark:bg-slate-700'
                }`}>
                  <div className="text-xs font-semibold uppercase">{format(day, 'EEE')}</div>
                  <div className={`text-lg font-bold ${isToday ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                    {format(day, 'd')}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedDay(format(day, 'yyyy-MM-dd'));
                    setShowActivityForm(true);
                  }}
                  className="w-full mb-2 p-1 bg-violet-100 dark:bg-violet-900/30 hover:bg-violet-200 dark:hover:bg-violet-900/50 rounded-lg text-violet-600 dark:text-violet-400 text-xs font-medium transition-colors"
                >
                  <Plus className="w-3 h-3 mx-auto" />
                </button>

                <div className="space-y-1">
                  {dayActivities.slice(0, 2).map(act => (
                    <div
                      key={act.id}
                      onClick={() => setSelectedActivity(act)}
                      className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <p className="text-xs text-slate-800 dark:text-white font-medium truncate">
                        {activityIcons[act.activity_type] || '📌'} {act.title}
                      </p>
                    </div>
                  ))}
                  {dayActivities.length > 2 && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">+{dayActivities.length - 2}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Checklist */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6">
          <h3 className="font-bold text-2xl text-slate-800 dark:text-white mb-6">My Tasks</h3>
          
          <div className="flex gap-2 mb-4">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              onKeyPress={(e) => e.key === 'Enter' && newTask && addTaskMutation.mutate()}
              className="flex-1 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
            />
            <Button
              onClick={() => addTaskMutation.mutate()}
              disabled={!newTask || addTaskMutation.isPending}
              className="bg-violet-500 hover:bg-violet-600"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-2">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
              >
                <button
                  onClick={() => toggleTaskMutation.mutate({ id: item.id, completed: !item.completed })}
                  className="shrink-0"
                >
                  {item.completed ? (
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                  )}
                </button>
                <span className={`flex-1 ${item.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                  {item.task}
                </span>
                <button
                  onClick={() => deleteTaskMutation.mutate(item.id)}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Activity Dialog */}
      <Dialog open={showActivityForm} onOpenChange={setShowActivityForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Activity for {selectedDay && format(new Date(selectedDay), 'MMM d')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              value={newActivity.title}
              onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
              placeholder="Activity title"
              className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
            />
            <select
              value={newActivity.activity_type}
              onChange={(e) => setNewActivity({...newActivity, activity_type: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
            >
              <option value="practice">Practice 🏏</option>
              <option value="match">Match 🏆</option>
              <option value="training">Training 💪</option>
              <option value="mental">Mental 🧠</option>
              <option value="rest">Rest 😌</option>
              <option value="other">Other 📌</option>
            </select>
            <Input
              value={newActivity.notes}
              onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
              placeholder="Notes (optional)"
              className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
            />
            <Button
              onClick={() => addActivityMutation.mutate()}
              disabled={!newActivity.title || addActivityMutation.isPending}
              className="w-full bg-violet-500 hover:bg-violet-600"
            >
              {addActivityMutation.isPending ? 'Adding...' : 'Add Activity'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Activity Details Dialog */}
      <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-slate-800 dark:text-white">Activity Details</DialogTitle>
          </DialogHeader>
          {selectedActivity && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Title</p>
                <p className="font-semibold text-slate-800 dark:text-white">{selectedActivity.title}</p>
              </div>
              {selectedActivity.notes && (
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Notes</p>
                  <p className="text-slate-800 dark:text-white">{selectedActivity.notes}</p>
                </div>
              )}
              <Button
                onClick={() => {
                  deleteActivityMutation.mutate(selectedActivity.id);
                  setSelectedActivity(null);
                }}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Activity
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}