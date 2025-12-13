import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Trash2, Edit, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/common/Header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white pb-24">
      <Header title="Training Schedule" showSettings={false} />

      <div className="px-6 py-4 max-w-lg mx-auto">
        {/* Add Workout Button */}
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
            Create Training Plan
          </Button>
        </motion.div>

        {/* Workout Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-3xl shadow-xl p-6 mb-6 overflow-hidden"
            >
              <h3 className="font-bold text-lg text-slate-800 mb-4">New Training Plan</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Plan Name</label>
                  <Input
                    value={workoutData.name}
                    onChange={(e) => setWorkoutData({ ...workoutData, name: e.target.value })}
                    placeholder="e.g., Morning Batting Session"
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Scheduled Date</label>
                  <Input
                    type="date"
                    value={workoutData.scheduled_date}
                    onChange={(e) => setWorkoutData({ ...workoutData, scheduled_date: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Add Drills</label>
                  <div className="flex gap-2 mb-4">
                    <Select value={selectedDrill} onValueChange={setSelectedDrill}>
                      <SelectTrigger className="flex-1 h-12">
                        <SelectValue placeholder="Select drill" />
                      </SelectTrigger>
                      <SelectContent>
                        {allDrills.map(drill => (
                          <SelectItem key={drill.id} value={drill.id}>
                            {drill.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-xs text-slate-600 mb-1 block">Sets</label>
                      <Input
                        type="number"
                        value={sets}
                        onChange={(e) => setSets(parseInt(e.target.value))}
                        min="1"
                        className="h-10"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 mb-1 block">Reps</label>
                      <Input
                        type="number"
                        value={reps}
                        onChange={(e) => setReps(parseInt(e.target.value))}
                        min="1"
                        className="h-10"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={addDrillToWorkout}
                    disabled={!selectedDrill}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Drill
                  </Button>
                </div>

                {/* Selected Drills */}
                {workoutData.drills.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Selected Drills</label>
                    {workoutData.drills.map((drill, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{drill.title}</p>
                          <p className="text-xs text-slate-500">{drill.sets} sets × {drill.reps} reps</p>
                        </div>
                        <button
                          onClick={() => removeDrill(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Notes (Optional)</label>
                  <Input
                    value={workoutData.notes}
                    onChange={(e) => setWorkoutData({ ...workoutData, notes: e.target.value })}
                    placeholder="Add any notes..."
                    className="h-12"
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
                    onClick={() => {
                      // Save workout logic here
                      setShowForm(false);
                    }}
                    disabled={!workoutData.name || workoutData.drills.length === 0}
                    className="flex-1 bg-violet-500 hover:bg-violet-600"
                  >
                    Save Plan
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scheduled Workouts */}
        <div className="space-y-3">
          {scheduledWorkouts.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500">No training plans yet</p>
              <p className="text-sm text-slate-400">Create your first plan above!</p>
            </div>
          ) : (
            scheduledWorkouts.map((workout, index) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-800">{workout.name}</h3>
                    <p className="text-sm text-slate-500">{workout.scheduled_date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg">
                      <Edit className="w-4 h-4 text-slate-500" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {workout.drills?.map((drill, i) => (
                    <div key={i} className="text-sm text-slate-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      {drill.title} - {drill.sets}x{drill.reps}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}