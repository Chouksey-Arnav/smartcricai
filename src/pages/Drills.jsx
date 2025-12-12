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
  });

  const { data: drills = [], isLoading } = useQuery({
    queryKey: ['drills'],
    queryFn: () => base44.entities.Drill.list(),
  });

  const { data: progress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.UserProgress.filter({ user_email: user.email });
      return results[0] || null;
    },
    enabled: !!user?.email,
  });

  const filteredDrills = drills.filter(drill => {
    const matchesCategory = category === 'all' || drill.category === category;
    const matchesSearch = drill.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const completedDrillIds = progress?.completed_drills || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
      <Header title="Practice Drills" showSettings={false} />
      
      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
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

        {/* Drills List */}
        <div className="space-y-3">
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
            filteredDrills.map((drill, index) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}