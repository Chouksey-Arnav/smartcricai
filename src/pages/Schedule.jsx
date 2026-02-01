import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Trash2, Heart, Dumbbell, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/common/Header';
import toast from 'react-hot-toast';

export default function Schedule() {
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [workoutData, setWorkoutData] = useState({
    name: '',
    drills: [],
    scheduled_date: '',
    notes: ''
  });
  const [selectedDrill, setSelectedDrill] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: allDrills = [] } = useQuery({
    queryKey: ['drills'],
    queryFn: () => base44.entities.Drill.list(),
  });

  const { data: scheduledWorkouts = [] } = useQuery({
    queryKey: ['scheduledWorkouts', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      // This would be a ScheduledWorkout entity
      return [];
    },
    enabled: !!user?.email,
  });

  const addDrillToWorkout = () => {
    if (!selectedDrill) return;
    const drill = allDrills.find(d => d.id === selectedDrill);
    if (!drill) return;

    setWorkoutData(prev => ({
      ...prev,
      drills: [...prev.drills, { ...drill, sets, reps }]
    }));
    setSelectedDrill('');
    setSets(3);
    setReps(10);
  };

  const removeDrill = (index) => {
    setWorkoutData(prev => ({
      ...prev,
      drills: prev.drills.filter((_, i) => i !== index)
    }));
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

      <div className="px-6 py-4 max-w-4xl mx-auto">
        {/* Add Activity Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            onClick={() => setShowForm(!showForm)}
            className="w-full h-14 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Log Activity
          </Button>
        </motion.div>

        {/* Activity Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-3xl shadow-xl p-6 mb-6 overflow-hidden"
            >
              <h3 className="font-bold text-lg text-slate-800 mb-4">Log New Activity</h3>

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
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Date</label>
                  <Input
                    type="date"
                    value={activityData.date}
                    onChange={(e) => setActivityData({ ...activityData, date: e.target.value })}
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
                    onClick={() => setShowForm(false)}
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
          <h3 className="font-bold text-xl text-slate-800 mb-4">This Week</h3>
          
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, index) => {
              const dayActivities = getActivitiesForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div key={index} className="space-y-2">
                  <div className={`text-center p-2 rounded-xl ${isToday ? 'bg-violet-500 text-white' : 'bg-slate-50'}`}>
                    <div className="text-xs font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className={`text-lg font-bold ${isToday ? 'text-white' : 'text-slate-800'}`}>
                      {date.getDate()}
                    </div>
                  </div>
                  
                  <div className="space-y-1 min-h-[100px]">
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
                              <p className="text-xs font-medium text-slate-800 truncate">
                                {value.title || (type === 'confidence_checkin' ? 'Confidence Check-in' : 'Activity')}
                              </p>
                              {value.notes && (
                                <p className="text-xs text-slate-500 truncate">{value.notes}</p>
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