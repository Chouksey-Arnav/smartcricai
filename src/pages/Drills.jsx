import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Header from '@/components/common/Header';
import DrillCard from '@/components/drills/DrillCard';
import CategoryFilter from '@/components/drills/CategoryFilter';

export default function Drills() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    staleTime: 300000,
    retry: 3,
  });

  const { data: drills = [], isLoading } = useQuery({
    queryKey: ['drills'],
    queryFn: () => base44.entities.Drill.list(),
    staleTime: 300000,
    retry: 3,
  });

  const { data: progress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.UserProgress.filter({ user_email: user.email });
      return results[0] || null;
    },
    enabled: !!user?.email,
    staleTime: 60000,
    refetchOnWindowFocus: true,
    retry: 3,
  });

  const filteredDrills = drills.filter(drill => {
    const matchesCategory = category === 'all' || drill.category === category;
    const matchesSearch = drill.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group by difficulty
  const beginnerDrills = filteredDrills.filter(d => d.skill_level === 'beginner');
  const intermediateDrills = filteredDrills.filter(d => d.skill_level === 'intermediate');
  const advancedDrills = filteredDrills.filter(d => d.skill_level === 'advanced');
  const proDrills = filteredDrills.filter(d => d.skill_level === 'pro');

  const completedDrillIds = progress?.completed_drills || [];

  const renderDrillGroup = (title, drills, color) => {
    if (drills.length === 0) return null;
    
    return (
      <div className="space-y-3">
        <div className={`flex items-center gap-2 px-2`}>
          <div className={`h-1 w-8 rounded-full ${color}`} />
          <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">{title}</h3>
        </div>
        {drills.map((drill, index) => (
          <motion.div
            key={drill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <DrillCard
              drill={drill}
              onClick={() => navigate(createPageUrl(`DrillDetail?id=${drill.id}`))}
              isCompleted={completedDrillIds.includes(drill.id)}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
      <Header title="Practice Drills" showSettings={false} />
      
      <div className="px-4 py-4 max-w-lg mx-auto space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drills..."
            className="pl-10 rounded-xl border-slate-200"
          />
        </div>

        {/* Categories */}
        <CategoryFilter selected={category} onChange={setCategory} />

        {/* Drills List - Organized by Difficulty */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredDrills.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-slate-500">No drills found. Try a different category!</p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {renderDrillGroup('Beginner', beginnerDrills, 'bg-green-500')}
            {renderDrillGroup('Intermediate', intermediateDrills, 'bg-amber-500')}
            {renderDrillGroup('Advanced', advancedDrills, 'bg-red-500')}
            {renderDrillGroup('Pro', proDrills, 'bg-purple-600')}
          </div>
        )}
      </div>
    </div>
  );
}