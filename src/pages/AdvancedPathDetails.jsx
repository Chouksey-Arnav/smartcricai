import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, ChevronLeft, Trophy, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const advancedPathItems = [
  { id: 'shot-selection', title: 'Master Shot Selection', xp: 100, category: 'batting' },
  { id: 'advanced-footwork', title: 'Advanced Footwork Drills', xp: 100, category: 'batting' },
  { id: 'bowling-variations', title: 'Bowling Variations Mastery', xp: 125, category: 'bowling' },
  { id: 'field-placement', title: 'Strategic Field Placement', xp: 75, category: 'fielding' },
  { id: 'running-between-wickets', title: 'Running Between Wickets', xp: 75, category: 'running' },
  { id: 'match-tactics', title: 'Match Tactics & Strategy', xp: 150, category: 'mental' },
  { id: 'pressure-situations', title: 'Handling Pressure Situations', xp: 200, category: 'mental' },
  { id: 'captaincy-basics', title: 'Captaincy & Leadership Basics', xp: 100, category: 'leadership' },
  { id: 'fitness-advanced', title: 'Advanced Fitness Training', xp: 200, category: 'fitness' },
  { id: 'match-awareness-pro', title: 'Pro-Level Match Awareness', xp: 150, category: 'mental' },
  { id: 'team-coordination', title: 'Team Coordination & Communication', xp: 100, category: 'team' },
  { id: 'advanced-drills-combo', title: 'Advanced Combo Drill Sessions', xp: 200, category: 'drills' },
];

export default function AdvancedPathDetails() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: skillPath } = useQuery({
    queryKey: ['skillPath', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.SkillPath.filter({ user_email: user.email });
      return results[0] || null;
    },
    enabled: !!user?.email,
  });

  const completeItemMutation = useMutation({
    mutationFn: async (itemId) => {
      const item = advancedPathItems.find(i => i.id === itemId);
      const newCompleted = [...(skillPath.completed_items || []), itemId];
      const newXP = (skillPath.xp || 0) + item.xp;
      
      return await base44.entities.SkillPath.update(skillPath.id, {
        completed_items: newCompleted,
        xp: newXP
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skillPath'] });
      toast.success('Item completed! 🎉');
    },
  });

  const completedItems = skillPath?.completed_items || [];
  const totalCompleted = advancedPathItems.filter(item => completedItems.includes(item.id)).length;
  const progress = (totalCompleted / advancedPathItems.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 pb-24">
      <div className="max-w-lg mx-auto px-6 py-6">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Skill Paths
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-6 text-white mb-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="text-4xl">⚡</div>
            <div>
              <h1 className="text-2xl font-bold">Advanced Path</h1>
              <p className="text-red-100 text-sm">Master advanced cricket skills</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-100 text-sm">Progress</span>
              <span className="font-bold">{totalCompleted} / {advancedPathItems.length}</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Items */}
        <div className="space-y-3">
          {advancedPathItems.map((item, index) => {
            const isCompleted = completedItems.includes(item.id);
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-5 rounded-2xl border-2 transition-all ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-6 h-6 border-2 border-slate-300 rounded-full shrink-0" />
                    )}
                    <div>
                      <h3 className={`font-bold ${isCompleted ? 'text-emerald-800' : 'text-slate-800'}`}>
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full capitalize">
                          {item.category}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-bold">
                          +{item.xp} XP
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {!isCompleted && (
                    <Button
                      onClick={() => completeItemMutation.mutate(item.id)}
                      size="sm"
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Completion Badge */}
        {totalCompleted === advancedPathItems.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl p-6 text-white text-center"
          >
            <Trophy className="w-16 h-16 mx-auto mb-3" />
            <h2 className="text-2xl font-bold mb-2">🎉 Advanced Path Complete!</h2>
            <p className="text-amber-100">You've earned the Advanced Elite badge!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}