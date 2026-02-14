import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function SmartStart({ isDarkMode }) {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);

  const { data: drills = [] } = useQuery({
    queryKey: ['drills'],
    queryFn: () => base44.entities.Drill.list(),
  });

  const { data: mentalRoutines = [] } = useQuery({
    queryKey: ['mentalRoutines'],
    queryFn: () => base44.entities.MentalRoutine.list(),
  });

  useEffect(() => {
    if (drills.length > 0 && mentalRoutines.length > 0) {
      const randomDrills = [...drills].sort(() => 0.5 - Math.random()).slice(0, 2);
      const randomMental = [...mentalRoutines].sort(() => 0.5 - Math.random()).slice(0, 1);
      
      setRecommendations([
        ...randomDrills.map(d => ({ 
          type: 'drill', 
          id: d.id, 
          title: d.title, 
          category: d.category 
        })),
        ...randomMental.map(m => ({ 
          type: 'mental', 
          id: m.id, 
          title: m.title, 
          category: 'Mental Training' 
        }))
      ]);
    }
  }, [drills, mentalRoutines]);

  const handleClick = (item) => {
    if (item.type === 'drill') {
      navigate(createPageUrl(`DrillDetail?id=${item.id}`));
    } else {
      navigate(createPageUrl(`MentalRoutinePlayer?id=${item.id}`));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className={`rounded-3xl shadow-2xl p-6 border mt-6 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-orange-600 to-red-600 border-orange-500' 
          : 'bg-gradient-to-br from-orange-500 to-red-500 border-orange-400'
      }`}
    >
      <h2 className="font-bold mb-3 text-lg flex items-center gap-2 text-white">
        <Zap className="w-6 h-6 text-yellow-300" />
        <span>Smart Start</span>
      </h2>
      <p className="text-sm mb-4 text-orange-100">
        Your personalized training picks
      </p>
      <div className="space-y-2">
        {recommendations.map((rec, index) => (
          <motion.button
            key={rec.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            onClick={() => handleClick(rec)}
            className="w-full text-left p-4 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all border border-white/30"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="font-semibold text-sm text-white">
                  {rec.title}
                </p>
                <p className="text-xs text-orange-100 capitalize">
                  {rec.category}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}