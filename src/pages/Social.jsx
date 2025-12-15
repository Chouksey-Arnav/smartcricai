import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Users, MessageCircle, Trophy, Target, Flame, ThumbsUp, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Header from '@/components/common/Header';

const reactionIcons = {
  applause: '👏',
  fire: '🔥',
  accuracy: '🎯',
  grit: '💪'
};

export default function Social() {
  const [searchQuery, setSearchQuery] = useState('');

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

  const { data: activityFeed } = useQuery({
    queryKey: ['activityFeed'],
    queryFn: async () => {
      if (!myProfile?.following?.length) return [];
      
      // Get activities from people I follow
      const activities = await base44.entities.ActivityFeed.list('-created_date', 50);
      return activities.filter(a => 
        myProfile.following.includes(a.user_email) || a.user_email === user.email
      );
    },
    enabled: !!myProfile,
  });

  const { data: profiles } = useQuery({
    queryKey: ['allProfiles'],
    queryFn: () => base44.entities.Profile.list(),
  });

  const { data: myLabels } = useQuery({
    queryKey: ['myLabels', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.ContactLabel.filter({ user_email: user.email });
    },
    enabled: !!user?.email,
  });

  const filteredProfiles = profiles?.filter(p => 
    searchQuery.length > 0 &&
    p.user_email !== user?.email &&
    (p.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     p.bio?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const groupedContacts = {
    family: myLabels?.filter(l => ['mom', 'dad', 'parent'].includes(l.label)) || [],
    coaches: myLabels?.filter(l => l.label === 'coach') || [],
    teammates: myLabels?.filter(l => l.label === 'teammate') || [],
    friends: myLabels?.filter(l => ['friend', 'best_friend', 'practice_buddy'].includes(l.label)) || [],
    inspiration: myLabels?.filter(l => l.label === 'inspiration') || [],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24">
      <Header title="Cricket Community" showSettings={false} />

      <div className="px-6 py-4 max-w-2xl mx-auto space-y-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-6 text-white"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Welcome, {myProfile?.username || user?.full_name}</h2>
              <p className="text-blue-100 text-sm">
                {myProfile?.followers?.length || 0} followers • {myProfile?.following?.length || 0} following
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search players by username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-2xl bg-white shadow-lg"
          />
        </motion.div>

        {/* Search Results */}
        {searchQuery && filteredProfiles && filteredProfiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-4 space-y-3"
          >
            <h3 className="font-bold text-slate-800 mb-3">Search Results</h3>
            {filteredProfiles.map(profile => (
              <Link key={profile.id} to={createPageUrl('PlayerProfile', `email=${profile.user_email}`)}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {profile.username?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{profile.username}</p>
                    {profile.archetype && (
                      <p className="text-sm text-slate-500">{profile.archetype}</p>
                    )}
                  </div>
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                    View
                  </Button>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}

        {/* My Contacts */}
        {!searchQuery && (
          <>
            {Object.entries(groupedContacts).map(([category, contacts]) => (
              contacts.length > 0 && (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl shadow-xl p-4"
                >
                  <h3 className="font-bold text-slate-800 mb-3 capitalize flex items-center gap-2">
                    {category === 'family' && '👨‍👩‍👧'}
                    {category === 'coaches' && '🧑‍🏫'}
                    {category === 'teammates' && '🏏'}
                    {category === 'friends' && '🧑‍🤝‍🧑'}
                    {category === 'inspiration' && '⭐'}
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {contacts.map(contact => {
                      const contactProfile = profiles?.find(p => p.user_email === contact.contact_email);
                      return (
                        <Link key={contact.id} to={createPageUrl('Chat', `with=${contact.contact_email}`)}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {contactProfile?.username?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-800">{contactProfile?.username || 'Unknown'}</p>
                              <p className="text-xs text-slate-500 capitalize">{contact.label.replace('_', ' ')}</p>
                            </div>
                            <MessageCircle className="w-5 h-5 text-blue-500" />
                          </motion.div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )
            ))}

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl p-4"
            >
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Community Feed
              </h3>
              {activityFeed && activityFeed.length > 0 ? (
                <div className="space-y-4">
                  {activityFeed.map(activity => {
                    const activityProfile = profiles?.find(p => p.user_email === activity.user_email);
                    return (
                      <div key={activity.id} className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {activityProfile?.username?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{activityProfile?.username}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(activity.created_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium text-slate-700 mb-1">{activity.title}</p>
                        {activity.description && (
                          <p className="text-sm text-slate-600 mb-3">{activity.description}</p>
                        )}
                        <div className="flex items-center gap-3">
                          {Object.entries(reactionIcons).map(([key, icon]) => (
                            <button
                              key={key}
                              className="text-2xl hover:scale-125 transition-transform"
                            >
                              {icon}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-8">
                  Follow players to see their activities here!
                </p>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}