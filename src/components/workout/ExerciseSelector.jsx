import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Dumbbell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ALL_CORE_POOL_EXERCISES } from '@/components/workout/CorePoolExercises';

export default function ExerciseSelector({ onSelect, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises = useMemo(() => {
    if (!searchQuery) return ALL_CORE_POOL_EXERCISES;
    return ALL_CORE_POOL_EXERCISES.filter(ex => 
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.base?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.variation?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {filteredExercises.length} exercises found
        </p>
      </div>

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-visible">
        {filteredExercises.length === 0 ? (
            <div className="text-center py-12">
              <Dumbbell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">No exercises found</p>
              <p className="text-sm text-slate-400">Try a different search</p>
            </div>
          ) : (
            filteredExercises.map((exercise, i) => (
              <motion.button
                key={exercise.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
                onClick={() => onSelect(exercise)}
                className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 group-hover:text-purple-600 transition-colors">
                      {exercise.name}
                    </h4>
                  </div>
                  <Badge 
                    className={
                      exercise.category === 'bodyweight' 
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-orange-100 text-orange-700'
                    }
                  >
                    {exercise.category === 'bodyweight' ? 'Bodyweight' : 'Weighted'}
                  </Badge>
                </div>
              </motion.button>
            ))
          )}
      </div>
    </div>
  );
}