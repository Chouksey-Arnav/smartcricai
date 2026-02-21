import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Users, Star, Settings, UserPlus, MessageCircle, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/common/Header';
import BadgeDisplay from '@/components/common/BadgeDisplay';
import StreakDisplay from '@/components/common/StreakDisplay';
import { toast } from 'sonner';

export default function Profile() {
  const queryClient = useQueryClient();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: progress } = useQuery({
    queryKey: ['userProgress', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const results = await base44.entities.UserProgress.filter({ user_email: guestEmail });
      return results[0] || null;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const results = await base44.entities.Profile.filter({ user_email: guestEmail });
      return results[0] || null;
    },
  });

  const updateNameMutation = useMutation({
    mutationFn: async (username) => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      if (profile?.id) {
        return await base44.entities.Profile.update(profile.id, { username });
      } else {
        return await base44.entities.Profile.create({
          user_email: guestEmail,
          username
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      toast.success('Name updated successfully!');
      setIsEditingName(false);
      setNewUsername('');
    },
  });

  const handleSaveName = () => {
    if (!newUsername.trim()) {
      toast.error('Please enter a valid name');
      return;
    }
    updateNameMutation.mutate(newUsername.trim());
  };

  const handleEditName = () => {
    setNewUsername(profile?.username || progress?.display_name || user?.full_name || '');
    setIsEditingName(true);
  };

  const stats = [
    { label: 'Drills', value: progress?.completed_drills?.length || 0, icon: '🎯' },
    { label: 'Quizzes', value: progress?.completed_quizzes?.length || 0, icon: '📚' },
    { label: 'Badges', value: progress?.badges?.length || 0, icon: '🏆' },
    { label: 'Minutes', value: progress?.total_practice_minutes || 0, icon: '⏱️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-24">
      <Header title="My Profile" showSettings={true} />

      <div className="px-6 py-4 max-w-lg mx-auto space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl p-6 text-white"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
              {(progress?.display_name || user?.full_name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              {isEditingName ? (
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="h-10 bg-white/20 border-white/30 text-white placeholder:text-white/50"
                    placeholder="Enter your name"
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Check className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold">{profile?.username || progress?.display_name || user?.full_name}</h2>
                  <button
                    onClick={handleEditName}
                    className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
              <p className="text-purple-100 capitalize">{progress?.primary_role || 'Player'}</p>
              {profile?.archetype && (
                <p className="text-sm text-purple-200 mt-1">🎯 {profile.archetype}</p>
              )}
            </div>
          </div>

          {/* Streak */}
          {(progress?.current_streak || 0) > 0 && (
            <div className="flex justify-center">
              <StreakDisplay streak={progress.current_streak} />
            </div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-4 gap-3"
        >
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-4 text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Cricket IQ */}
        {profile?.cricket_iq_score > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Cricket IQ Score
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                    style={{ width: `${Math.min(profile.cricket_iq_score, 100)}%` }}
                  />
                </div>
              </div>
              <span className="text-2xl font-bold text-amber-600">{profile.cricket_iq_score}</span>
            </div>
          </motion.div>
        )}

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Achievement Badges
          </h3>
          <BadgeDisplay badges={progress?.badges || []} size="md" />
        </motion.div>

        {/* Social Badges */}
        {profile?.social_badges?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl shadow-xl p-6 border-2 border-pink-200"
          >
            <h3 className="font-bold text-purple-800 mb-4">🌟 Social Badges</h3>
            <div className="flex flex-wrap gap-2">
              {profile.social_badges.map((badge, i) => (
                <div key={i} className="px-4 py-2 bg-white rounded-full border-2 border-purple-300 text-sm font-medium text-purple-700">
                  {badge}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Social Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Community
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-3xl font-bold text-blue-600">{profile?.followers?.length || 0}</p>
              <p className="text-sm text-slate-600">Followers</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <p className="text-3xl font-bold text-emerald-600">{profile?.following?.length || 0}</p>
              <p className="text-sm text-slate-600">Following</p>
            </div>
          </div>
        </motion.div>


      </div>
    </div>
  );
}