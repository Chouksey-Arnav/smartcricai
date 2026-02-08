import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Plus, X, Save, GripVertical, Dumbbell, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Header from '@/components/common/Header';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import toast from 'react-hot-toast';
import ExerciseSelector from '@/components/workout/ExerciseSelector';

export default function WorkoutBuilder() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: drills } = useQuery({
    queryKey: ['drills'],
    queryFn: () => base44.entities.Drill.list(),
    initialData: [],
  });

  const [workoutName, setWorkoutName] = useState('');
  const [selectedDrills, setSelectedDrills] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const [filteredDrills, setFilteredDrills] = useState(null);

  const addDrill = (drill) => {
    setSelectedDrills([
      ...selectedDrills,
      {
        drill_id: drill.id,
        drill_title: drill.title,
        sets: 3,
        reps: 10,
        completed_sets: 0,
        type: 'drill'
      }
    ]);
    setDialogOpen(false);
  };

  const addExercise = (exercise) => {
    setSelectedDrills([
      ...selectedDrills,
      {
        drill_id: exercise.id,
        drill_title: exercise.name,
        sets: 3,
        reps: 10,
        completed_sets: 0,
        type: 'exercise',
        category: exercise.category
      }
    ]);
    setExerciseDialogOpen(false);
  };

  const removeDrill = (index) => {
    setSelectedDrills(selectedDrills.filter((_, i) => i !== index));
  };

  const updateDrill = (index, field, value) => {
    const updated = [...selectedDrills];
    updated[index][field] = parseInt(value) || 0;
    setSelectedDrills(updated);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(selectedDrills);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setSelectedDrills(items);
  };

  const saveWorkoutMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.Workout.create({
        user_email: user.email,
        name: workoutName,
        drills: selectedDrills,
        status: 'not_started'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      toast.success('Workout created! 💪');
      navigate(createPageUrl('Schedule'));
    },
  });

  const handleSave = () => {
    if (!workoutName.trim()) {
      toast.error('Please enter a workout name');
      return;
    }
    if (selectedDrills.length === 0) {
      toast.error('Please add at least one drill');
      return;
    }
    saveWorkoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-24">
      <Header title="Workout Builder" showSettings={false} />

      <div className="px-6 py-4 max-w-lg mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl p-6 text-white"
        >
          <h2 className="font-bold text-xl mb-2">Create Your Workout</h2>
          <p className="text-purple-100 text-sm">Add drills or exercises, set reps, and build your training plan</p>
        </motion.div>

        {/* Workout Name */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Workout Name</label>
          <Input
            placeholder="e.g., Morning Power Session"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="h-12"
          />
        </div>

        {/* Add Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 bg-emerald-500 hover:bg-emerald-600">
                <Target className="w-5 h-5 mr-2" />
                Add Drill
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] flex flex-col p-0">
              <DialogHeader className="p-4 pb-0">
                <DialogTitle>Select a Drill</DialogTitle>
              </DialogHeader>
              <div className="px-4 pt-2 pb-3">
                <Input
                  placeholder="Search drills..."
                  onChange={(e) => {
                    const query = e.target.value.toLowerCase();
                    const filtered = drills.filter(d => 
                      d.title.toLowerCase().includes(query) || 
                      d.category.toLowerCase().includes(query)
                    );
                    setFilteredDrills(filtered);
                  }}
                  className="h-10"
                />
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 scrollbar-visible">
                {(filteredDrills || drills).map(drill => (
                  <button
                    key={drill.id}
                    onClick={() => addDrill(drill)}
                    className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <h4 className="font-semibold text-slate-800">{drill.title}</h4>
                    <p className="text-sm text-slate-600">{drill.category} • {drill.skill_level}</p>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={exerciseDialogOpen} onOpenChange={setExerciseDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 bg-purple-500 hover:bg-purple-600">
                <Dumbbell className="w-5 h-5 mr-2" />
                Add Exercise
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] p-0">
              <DialogHeader className="p-4 pb-0">
                <DialogTitle>Select an Exercise</DialogTitle>
              </DialogHeader>
              <ExerciseSelector 
                onSelect={addExercise} 
                onClose={() => setExerciseDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Drill List */}
        {selectedDrills.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h3 className="font-bold text-slate-800 mb-4">Your Drills ({selectedDrills.length})</h3>
            
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="drills">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {selectedDrills.map((drill, index) => (
                      <Draggable key={index} draggableId={`drill-${index}`} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="bg-slate-50 rounded-xl p-4"
                          >
                            <div className="flex items-start gap-3">
                              <div {...provided.dragHandleProps} className="mt-2">
                                <GripVertical className="w-5 h-5 text-slate-400" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                  <h4 className="font-semibold text-slate-800">{drill.drill_title}</h4>
                                  {drill.type === 'exercise' && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                      drill.category === 'bodyweight' 
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-orange-100 text-orange-700'
                                    }`}>
                                      {drill.category === 'bodyweight' ? 'Bodyweight' : 'Weighted'}
                                    </span>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-xs text-slate-600 block mb-1">Sets</label>
                                    <Input
                                      type="number"
                                      min="1"
                                      value={drill.sets}
                                      onChange={(e) => updateDrill(index, 'sets', e.target.value)}
                                      className="h-9"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-slate-600 block mb-1">Reps</label>
                                    <Input
                                      type="number"
                                      min="1"
                                      value={drill.reps}
                                      onChange={(e) => updateDrill(index, 'reps', e.target.value)}
                                      className="h-9"
                                    />
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => removeDrill(index)}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                              >
                                <X className="w-5 h-5 text-red-500" />
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}

        {/* Save Button */}
        {selectedDrills.length > 0 && (
          <Button
            onClick={handleSave}
            disabled={saveWorkoutMutation.isPending}
            className="w-full h-14 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-lg font-bold"
          >
            <Save className="w-5 h-5 mr-2" />
            {saveWorkoutMutation.isPending ? 'Saving...' : 'Save Workout'}
          </Button>
        )}
      </div>
    </div>
  );
}