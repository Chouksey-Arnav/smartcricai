import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function DrillSelector({ drills, onSelect, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDrills = useMemo(() => {
    if (!searchQuery) return drills;
    return drills.filter(drill => 
      drill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drill.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drill.target_skill?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [drills, searchQuery]);

  return (
    <div className="flex flex-col h-full max-h-[60vh]">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search drills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-visible">
        {filteredDrills.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No drills found matching "{searchQuery}"
          </div>
        ) : (
          filteredDrills.map(drill => (
            <button
              key={drill.id}
              onClick={() => onSelect(drill)}
              className="w-full text-left p-4 bg-slate-50 hover:bg-emerald-100 rounded-xl transition-colors"
            >
              <h4 className="font-semibold text-slate-800">{drill.title}</h4>
              <p className="text-sm text-slate-600">{drill.category} • {drill.skill_level}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}