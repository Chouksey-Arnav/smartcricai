import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tantml:react-query';
import { motion } from 'framer-motion';
import { ChevronLeft, UserPlus, UserMinus, MessageCircle, Trophy, Target, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function PlayerProfile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const profileEmail = urlParams.get('email');
  
  const [showLabelSelect, setShowLabelSelect] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: myProfile } = useQuery({
    queryKey: ['myProfile', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const profiles = await base44.entities.Profile.filter({ user_email: user.email });
      return profiles[0] || null;
    },
    enabled: !!user?.email,
  });

  const { data: viewedProfile } = useQuery({
    queryKey: ['viewedProfile', profileEmail],
    queryFn: async () => {
      const profiles = await base44.entities.Profile.filter({ user_email: profileEmail });
      return profiles[0] || null;
    },
    enabled: !!profileEmail,
  });

  const { data: existingLabel } = useQuery({
    queryKey: ['contactLabel', user?.email, profileEmail],
    queryFn: async () => {
      if (!user?.email || !profileEmail) return null;
      const labels = await base44.entities.ContactLabel.filter({
        user_email: user.email,
        contact_email: profileEmail
      });
      return labels[0] || null;
    },
    enabled: !!user?.email && !!profileEmail,
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      const newFollowing = [...(myProfile.following || []), profileEmail];
      const newFollowers = [...(viewedProfile.followers || []), user.email];
      
      await base44.entities.Profile.update(myProfile.id, { following: newFollowing });
      await base44.entities.Profile.update(viewedProfile.id, { followers: newFollowers });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myProfile']);
      queryClient.invalidateQueries(['viewedProfile']);
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      const newFollowing = myProfile.following.filter(email => email !== profileEmail);
      const newFollowers = viewedProfile.followers.filter(email => email !== user.email);
      
      await base44.entities.Profile.update(myProfile.id, { following: newFollowing });
      await base44.entities.Profile.update(viewedProfile.id, { followers: newFollowers });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myProfile']);
      queryClient.invalidateQueries(['viewedProfile']);
    },
  });

  const addLabelMutation = useMutation({
    mutationFn: async (label) => {
      if (existingLabel) {
        await base44.entities.ContactLabel.update(existingLabel.id, { label });
      } else {
        await base44.entities.ContactLabel.create({
          user_email: user.email,
          contact_email: profileEmail,
          label
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contactLabel']);
      setShowLabelSelect(false);
    },
  });

  const isFollowing = myProfile?.following?.includes(profileEmail);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-24">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 pt-8 pb-20">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-white/80 hover:text-white mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-white/30">
            {viewedProfile?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{viewedProfile?.username}</h1>
            <p className="text-indigo-100 text-sm">{viewedProfile?.archetype || 'Cricket Player'}</p>
            <p className="text-indigo-100 text-xs mt-1">
              {viewedProfile?.followers?.length || 0} followers • {viewedProfile?.following?.length || 0} following
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-12 max-w-lg mx-auto space-y-6">
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-4"
        >
          <div className="grid grid-cols-2 gap-3">
            {isFollowing ? (
              <Button
                onClick={() => unfollowMutation.mutate()}
                variant="outline"
                className="h-12"
              >
                <UserMinus className="w-5 h-5 mr-2" />
                Unfollow
              </Button>
            ) : (
              <Button
                onClick={() => followMutation.mutate()}
                className="h-12 bg-gradient-to-r from-indigo-500 to-purple-500"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Follow
              </Button>
            )}
            <Link to={createPageUrl('Chat', `with=${profileEmail}`)}>
              <Button className="h-12 w-full bg-blue-500 hover:bg-blue-600">
                <MessageCircle className="w-5 h-5 mr-2" />
                Message
              </Button>
            </Link>
          </div>

          {/* Label Section */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            {existingLabel ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-slate-600">Labeled as:</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium capitalize">
                    {existingLabel.label.replace('_', ' ')}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowLabelSelect(!showLabelSelect)}
                >
                  Change
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowLabelSelect(!showLabelSelect)}
              >
                <Tag className="w-5 h-5 mr-2" />
                Add Label
              </Button>
            )}

            {showLabelSelect && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3"
              >
                <Select value={selectedLabel} onValueChange={(value) => {
                  setSelectedLabel(value);
                  addLabelMutation.mutate(value);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friend">🧑‍🤝‍🧑 Friend</SelectItem>
                    <SelectItem value="best_friend">⭐ Best Friend</SelectItem>
                    <SelectItem value="teammate">🏏 Teammate</SelectItem>
                    <SelectItem value="coach">🧑‍🏫 Coach</SelectItem>
                    <SelectItem value="mom">👩 Mom</SelectItem>
                    <SelectItem value="dad">👨 Dad</SelectItem>
                    <SelectItem value="parent">👨‍👩‍👧 Parent</SelectItem>
                    <SelectItem value="practice_buddy">🎯 Practice Buddy</SelectItem>
                    <SelectItem value="inspiration">💫 Inspiration</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Bio */}
        {viewedProfile?.bio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <h3 className="font-bold text-slate-800 mb-2">About</h3>
            <p className="text-slate-600">{viewedProfile.bio}</p>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <h3 className="font-bold text-slate-800 mb-4">Cricket Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 text-center">
              <Trophy className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-800">{viewedProfile?.social_badges?.length || 0}</p>
              <p className="text-sm text-slate-600">Badges</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 text-center">
              <Target className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-800">{viewedProfile?.cricket_iq_score || 0}</p>
              <p className="text-sm text-slate-600">Cricket IQ</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}