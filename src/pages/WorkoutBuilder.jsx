import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { X, Save, GripVertical, Dumbbell, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Header from '@/components/common/Header';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import ExerciseSelector from '@/components/workout/ExerciseSelector';

export default function WorkoutBuilder() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const { data: premiumStatus } = useQuery({
    queryKey: ['premiumStatus', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const subs = await base44.entities.PremiumSubscription.filter({ user_email: guestEmail });
      return subs[0] || null;
    },
  });

  const isPremium = premiumStatus?.is_premium || false;

  const { data: savedWorkouts = [] } = useQuery({
    queryKey: ['savedWorkouts', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const results = await base44.entities.SavedWorkout.filter({ user_email: guestEmail });
      return results.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
  });

  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([]); // array of {id, name, sets, reps, category, expanded}
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Build flat drag list from exercises: each exercise expands into set sub-items + rest slots between them
  // We store exercises directly; rest blocks are stored within exercise.rests = {afterSet1: true, ...}

  const addRestToExercise = (exerciseIdx, afterSetNum) => {
    const updated = [...exercises];
    if (!updated[exerciseIdx].rests) updated[exerciseIdx].rests = {};
    updated[exerciseIdx].rests[afterSetNum] = updated[exerciseIdx].rests[afterSetNum]
      ? null
      : { duration: 60 };
    setExercises(updated);
  };

  const addExercise = (exercise) => {
    setExercises([
      ...exercises,
      {
        id: `ex_${Math.random().toString(36).substr(2, 9)}`,
        name: exercise.name,
        sets: 3,
        reps: 10,
        category: exercise.category,
        expanded: true,
        rests: {}
      }
    ]);
    setExerciseDialogOpen(false);
  };

  const removeExercise = (idx) => {
    setExercises(exercises.filter((_, i) => i !== idx));
  };

  const updateExercise = (idx, field, value) => {
    const updated = [...exercises];
    updated[idx][field] = field === 'name' ? value : (parseInt(value) || 1);
    // If sets changes, prune rests that are beyond new set count
    if (field === 'sets') {
      const newSets = parseInt(value) || 1;
      const rests = { ...updated[idx].rests };
      Object.keys(rests).forEach(k => {
        if (parseInt(k) >= newSets) delete rests[k];
      });
      updated[idx].rests = rests;
    }
    setExercises(updated);
  };

  const toggleExpanded = (idx) => {
    const updated = [...exercises];
    updated[idx].expanded = !updated[idx].expanded;
    setExercises(updated);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(exercises);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setExercises(items);
  };

  // Flatten exercises to drills array for saving
  const buildDrillsArray = () => {
    const drills = [];
    exercises.forEach(ex => {
      for (let s = 1; s <= ex.sets; s++) {
        drills.push({
          drill_id: `${ex.id}_set${s}`,
          drill_title: `${ex.name} — Set ${s}`,
          sets: 1,
          reps: ex.reps,
          completed_sets: 0,
          type: 'exercise',
          category: ex.category
        });
        const rest = ex.rests?.[s];
        if (rest && s < ex.sets) {
          drills.push({
            drill_id: `rest_${ex.id}_${s}`,
            drill_title: 'Rest Period',
            sets: 1,
            reps: rest.duration || 60,
            completed_sets: 0,
            type: 'rest',
            rest_seconds: rest.duration || 60
          });
        }
      }
    });
    return drills;
  };

  const saveWorkoutMutation = useMutation({
    mutationFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const drillsArray = buildDrillsArray();
      
      const savedWorkout = await base44.entities.SavedWorkout.create({
        user_email: guestEmail,
        name: workoutName,
        exercises: drillsArray,
        total_exercises: exercises.length,
        estimated_duration: exercises.reduce((acc, ex) => acc + ex.sets * 2, 0)
      });
      
      const workout = await base44.entities.Workout.create({
        user_email: guestEmail,
        name: workoutName,
        drills: drillsArray,
        status: 'not_started',
        xp_value: 120
      });
      
      return { savedWorkout, workout };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['savedWorkouts'] });
      queryClient.invalidateQueries({ queryKey: ['userGeneratedWorkouts'] });
      toast.success('Workout saved! 💪');
      setWorkoutName('');
      setExercises([]);
      setShowSaved(true);
    },
  });

  const loadSavedWorkoutMutation = useMutation({
    mutationFn: async (savedWorkout) => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      // Check if there's already an active workout with this name
      const existing = await base44.entities.Workout.filter({ user_email: guestEmail, name: savedWorkout.name });
      if (existing.length > 0) return existing[0];
      return await base44.entities.Workout.create({
        user_email: guestEmail,
        name: savedWorkout.name,
        drills: savedWorkout.exercises,
        status: 'not_started',
        xp_value: 120
      });
    },
    onMutate: () => {
      toast.success('Starting workout now!');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      queryClient.invalidateQueries({ queryKey: ['userGeneratedWorkouts'] });
      navigate(createPageUrl('AIWorkout'));
    },
  });

  const deleteSavedWorkoutMutation = useMutation({
    mutationFn: async (id) => {
      await base44.entities.SavedWorkout.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedWorkouts'] });
      toast.success('Workout deleted');
    },
  });

  const deleteAllWorkoutsMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(savedWorkouts.map(w => base44.entities.SavedWorkout.delete(w.id)));
      // Also delete from Workout entity
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const activeWorkouts = await base44.entities.Workout.filter({ user_email: guestEmail });
      await Promise.all(activeWorkouts.map(w => base44.entities.Workout.delete(w.id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedWorkouts'] });
      queryClient.invalidateQueries({ queryKey: ['userGeneratedWorkouts'] });
      toast.success('All workouts deleted');
    },
  });

  const handleSave = () => {
    if (!workoutName.trim()) {
      toast.error('Please enter a workout name');
      return;
    }
    if (exercises.length === 0) {
      toast.error('Please add at least one exercise');
      return;
    }
    saveWorkoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-slate-900 dark:to-slate-800 pb-24">
      <Header title="Workout Builder" showSettings={false} />

      <div className="px-6 py-4 max-w-lg mx-auto space-y-6">
        {/* Toggle Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowSaved(false)}
            className={`py-3 rounded-xl font-semibold transition-all ${
              !showSaved 
                ? 'bg-purple-500 text-white shadow-lg' 
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
            }`}
          >
            Create New
          </button>
          <button
            onClick={() => setShowSaved(true)}
            className={`py-3 rounded-xl font-semibold transition-all ${
              showSaved 
                ? 'bg-purple-500 text-white shadow-lg' 
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
            }`}
          >
            Saved ({savedWorkouts.length})
          </button>
        </div>

        {!showSaved ? (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl p-6 text-white"
            >
              <h2 className="font-bold text-xl mb-2">Create Your Workout</h2>
              <p className="text-purple-100 text-sm">Add exercises, set sets & reps, add rest blocks between sets</p>
            </motion.div>

            {/* Workout Name */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Workout Name</label>
              <Input
                placeholder="e.g., Morning Power Session"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="h-12"
              />
            </div>

            {/* Add Exercise Button */}
            <div className="flex gap-3">
              <Dialog open={exerciseDialogOpen} onOpenChange={setExerciseDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex-1 h-12 bg-purple-500 hover:bg-purple-600">
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

            {/* Exercise List with Sets Sub-blocks */}
            {exercises.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Your Exercises ({exercises.length})</h3>
            
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="exercises">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {exercises.map((ex, index) => (
                      <Draggable key={ex.id} draggableId={ex.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="bg-slate-50 dark:bg-slate-700 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-600"
                          >
                            {/* Exercise Header */}
                            <div className="flex items-center gap-3 p-4">
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="w-5 h-5 text-slate-400" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-slate-800 dark:text-slate-100">{ex.name}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{ex.sets} sets × {ex.reps} reps</p>
                              </div>
                              <button onClick={() => toggleExpanded(index)} className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">
                                {ex.expanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                              </button>
                              <button onClick={() => removeExercise(index)} className="p-1 hover:bg-red-100 rounded-lg transition-colors">
                                <X className="w-4 h-4 text-red-500" />
                              </button>
                            </div>

                            {/* Expanded: Sets/Reps config + set sub-blocks with rest slots */}
                            {ex.expanded && (
                              <div className="px-4 pb-4 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">Sets</label>
                                    <Input type="number" min="1" max="20" value={ex.sets}
                                      onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                                      className="h-9" />
                                  </div>
                                  <div>
                                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">Reps</label>
                                    <Input type="number" min="1" value={ex.reps}
                                      onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                                      className="h-9" />
                                  </div>
                                </div>

                                {ex.sets > 1 && (
                                  <div className="space-y-1 mt-2">
                                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Sets (tap between sets to add/remove rest):</p>
                                    {Array.from({ length: ex.sets }, (_, si) => {
                                      const setNum = si + 1;
                                      const hasRest = ex.rests?.[setNum];
                                      return (
                                        <div key={setNum}>
                                          <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg px-3 py-2">
                                            <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{setNum}</div>
                                            <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{ex.name} — Set {setNum} × {ex.reps} reps</span>
                                          </div>
                                          {setNum < ex.sets && (
                                            <div className="flex items-center gap-2 my-1 px-2">
                                              <div className="flex-1 border-t border-dashed border-slate-300 dark:border-slate-600" />
                                              <button
                                                onClick={() => addRestToExercise(index, setNum)}
                                                className={`text-xs px-3 py-1 rounded-full border transition-all flex items-center gap-1 ${
                                                  hasRest
                                                    ? 'bg-blue-100 border-blue-400 text-blue-700'
                                                    : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-500 text-slate-500 dark:text-slate-400 hover:bg-blue-50 hover:border-blue-300'
                                                }`}
                                              >
                                                <Clock className="w-3 h-3" />
                                                {hasRest ? `Rest ${hasRest.duration}s ✓ (remove)` : 'Add Rest'}
                                              </button>
                                              {hasRest && (
                                                <Input
                                                  type="number" min="10" max="300"
                                                  value={hasRest.duration}
                                                  onClick={(e) => e.stopPropagation()}
                                                  onChange={(e) => {
                                                    const updated = [...exercises];
                                                    updated[index].rests[setNum] = { duration: parseInt(e.target.value) || 60 };
                                                    setExercises(updated);
                                                  }}
                                                  className="h-7 w-20 text-xs"
                                                />
                                              )}
                                              <div className="flex-1 border-t border-dashed border-slate-300 dark:border-slate-600" />
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
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
            {exercises.length > 0 && (
              <Button
                onClick={handleSave}
                disabled={saveWorkoutMutation.isPending}
                className="w-full h-14 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-lg font-bold"
              >
                <Save className="w-5 h-5 mr-2" />
                {saveWorkoutMutation.isPending ? 'Saving...' : 'Save Workout'}
              </Button>
            )}
          </>
        ) : (
          <>
            {/* Saved Workouts List */}
            <div className="space-y-4">
              {savedWorkouts.length > 0 && (
                <Button
                  onClick={() => { if (confirm('Delete ALL saved workouts permanently?')) deleteAllWorkoutsMutation.mutate(); }}
                  disabled={deleteAllWorkoutsMutation.isPending}
                  variant="destructive"
                  className="w-full bg-red-500 hover:bg-red-600"
                >
                  {deleteAllWorkoutsMutation.isPending ? 'Deleting...' : 'Delete All Workouts'}
                </Button>
              )}
              {savedWorkouts.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-12 text-center">
                  <Dumbbell className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">No Saved Workouts</h3>
                  <p className="text-slate-600 dark:text-slate-400">Create and save your first workout to see it here</p>
                </div>
              ) : (
                savedWorkouts.map((workout) => (
                  <motion.div
                    key={workout.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{workout.name}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {workout.total_exercises} exercises • ~{workout.estimated_duration} min
                        </p>
                      </div>
                      <button
                        onClick={() => deleteSavedWorkoutMutation.mutate(workout.id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => loadSavedWorkoutMutation.mutate(workout)}
                        disabled={loadSavedWorkoutMutation.isPending}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                      >
                        Start Workout
                      </Button>
                      <Button
                        onClick={() => {
                          setWorkoutName(workout.name);
                          // Reconstruct exercises from saved workout exercises array
                          const reconstructed = [];
                          const exerciseMap = {};
                          (workout.exercises || []).forEach(drill => {
                            if (drill.type === 'rest') return;
                            // Group by base exercise name (strip " — Set N" suffix)
                            const baseName = drill.drill_title?.replace(/ — Set \d+$/, '') || drill.drill_title || 'Exercise';
                            if (!exerciseMap[baseName]) {
                              exerciseMap[baseName] = {
                                id: `ex_${Math.random().toString(36).substr(2, 9)}`,
                                name: baseName,
                                sets: 0,
                                reps: drill.reps || 10,
                                category: drill.category || 'fitness',
                                expanded: false,
                                rests: {}
                              };
                              reconstructed.push(exerciseMap[baseName]);
                            }
                            exerciseMap[baseName].sets += 1;
                          });
                          setExercises(reconstructed);
                          setShowSaved(false);
                          toast.success('Workout loaded for editing');
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Edit
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}