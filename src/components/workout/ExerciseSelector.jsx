import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { BODYWEIGHT_EXERCISES, WEIGHTED_EXERCISES } from '@/components/fitness/exercisePools';
import { CSV_EXERCISES } from '@/components/fitness/csvExercisePool';

export default function ExerciseSelector({ onSelect, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Flatten all exercises into a master list
  const allExercises = useMemo(() => {
    const exercises = [];
    
    // Add Push-ups and Squats first
    exercises.push({ name: 'Push-ups', category: 'bodyweight', subCategory: 'upper-body', id: 'bw-pushups' });
    exercises.push({ name: 'Squats', category: 'bodyweight', subCategory: 'lower-body', id: 'bw-squats' });
    
    // Bodyweight exercises
    Object.entries(BODYWEIGHT_EXERCISES).forEach(([category, items]) => {
      if (Array.isArray(items)) {
        items.forEach(name => exercises.push({ name, category: 'bodyweight', subCategory: category, id: `bw-${name}` }));
      } else if (typeof items === 'object') {
        Object.entries(items).forEach(([subCat, subItems]) => {
          subItems.forEach(name => exercises.push({ name, category: 'bodyweight', subCategory: `${category}-${subCat}`, id: `bw-${name}` }));
        });
      }
    });

    // Weighted exercises
    Object.entries(WEIGHTED_EXERCISES).forEach(([category, items]) => {
      if (Array.isArray(items)) {
        items.forEach(name => exercises.push({ name, category: 'weighted', subCategory: category, id: `w-${name}` }));
      } else if (typeof items === 'object') {
        Object.entries(items).forEach(([subCat, subItems]) => {
          subItems.forEach(name => exercises.push({ name, category: 'weighted', subCategory: `${category}-${subCat}`, id: `w-${name}` }));
        });
      }
    });

    // Add CSV exercises
    CSV_EXERCISES.forEach(ex => exercises.push({
      name: ex.name,
      category: ex.category,
      subCategory: ex.subCategory,
      difficulty: ex.difficulty,
      id: `csv-${ex.name}`,
    }));

    // Remove duplicates and sort
    const unique = Array.from(new Map(exercises.map(e => [e.name, e])).values());
    return unique.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Filter exercises based on search
  const filteredExercises = useMemo(() => {
    if (!searchQuery.trim()) return allExercises;
    const query = searchQuery.toLowerCase();
    return allExercises.filter(ex => 
      ex.name.toLowerCase().includes(query) ||
      ex.category.toLowerCase().includes(query) ||
      ex.subCategory.toLowerCase().includes(query) ||
      (ex.difficulty || '').toLowerCase().includes(query)
    );
  }, [searchQuery, allExercises]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
            autoFocus
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {filteredExercises.length} exercises available
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 scrollbar-visible" style={{ maxHeight: '500px' }}>
        {filteredExercises.map(exercise => (
          <button
            key={exercise.id}
            onClick={() => {
              onSelect(exercise);
              onClose();
            }}
            className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
          >
            <h4 className="font-semibold text-slate-800 text-sm mb-1">{exercise.name}</h4>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                exercise.category === 'bodyweight' 
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {exercise.category === 'bodyweight' ? 'Bodyweight' : 'Weighted'}
              </span>
              <span className="text-xs text-slate-500">{exercise.subCategory}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}