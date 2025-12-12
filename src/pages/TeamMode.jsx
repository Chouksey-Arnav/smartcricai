import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Trophy, Target, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

function generateJoinCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function TeamMode() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: coachTeams } = useQuery({
    queryKey: ['coachTeams', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.Team.filter({ coach_email: user.email });
    },
    enabled: !!user?.email,
  });

  const { data: memberTeams } = useQuery({
    queryKey: ['memberTeams', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const allTeams = await base44.entities.Team.list();
      return allTeams.filter(team => team.member_emails?.includes(user.email));
    },
    enabled: !!user?.email,
  });

  const createTeam = useMutation({
    mutationFn: async () => {
      return await base44.entities.Team.create({
        name: teamName,
        coach_email: user.email,
        join_code: generateJoinCode(),
        member_emails: [],
        assigned_drills: [],
        announcements: []
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coachTeams'] });
      setShowCreateForm(false);
      setTeamName('');
    },
  });

  const joinTeam = useMutation({
    mutationFn: async () => {
      const teams = await base44.entities.Team.filter({ join_code: joinCode.toUpperCase() });
      if (teams.length === 0) {
        throw new Error('Invalid code');
      }
      const team = teams[0];
      const newMembers = [...(team.member_emails || []), user.email];
      return await base44.entities.Team.update(team.id, {
        member_emails: newMembers
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberTeams'] });
      setShowJoinForm(false);
      setJoinCode('');
    },
  });

  const postAnnouncement = useMutation({
    mutationFn: async (teamId) => {
      const team = coachTeams.find(t => t.id === teamId);
      const newAnnouncements = [
        ...(team.announcements || []),
        {
          message: announcement,
          date: new Date().toISOString()
        }
      ];
      return await base44.entities.Team.update(teamId, {
        announcements: newAnnouncements
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coachTeams'] });
      setAnnouncement('');
    },
  });

  const isCoach = coachTeams && coachTeams.length > 0;
  const isMember = memberTeams && memberTeams.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 pb-24 pt-6">
      <div className="max-w-lg mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            👥 Team Mode
          </h1>
          <p className="text-slate-600">
            Connect with your cricket team and track progress together!
          </p>
        </motion.div>

        {/* Action Buttons */}
        {!isCoach && !isMember && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <Button
              onClick={() => setShowCreateForm(true)}
              className="h-24 bg-emerald-600 hover:bg-emerald-700 flex-col gap-2"
            >
              <Plus className="w-6 h-6" />
              Create Team
            </Button>
            <Button
              onClick={() => setShowJoinForm(true)}
              variant="outline"
              className="h-24 flex-col gap-2 border-2"
            >
              <Users className="w-6 h-6" />
              Join Team
            </Button>
          </motion.div>
        )}

        {/* Create Team Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl p-6 mb-6"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-4">Create Your Team</h2>
              <Input
                placeholder="Team name (e.g., Hawks U12)"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="mb-4"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => createTeam.mutate()}
                  disabled={!teamName.trim() || createTeam.isPending}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  Create Team
                </Button>
                <Button
                  onClick={() => setShowCreateForm(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Join Team Form */}
        <AnimatePresence>
          {showJoinForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl p-6 mb-6"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-4">Join a Team</h2>
              <p className="text-sm text-slate-600 mb-4">
                Enter the code your coach gave you
              </p>
              <Input
                placeholder="Enter 6-letter code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="mb-4 uppercase text-center text-2xl tracking-wider"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => joinTeam.mutate()}
                  disabled={joinCode.length !== 6 || joinTeam.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Join Team
                </Button>
                <Button
                  onClick={() => setShowJoinForm(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Coach View - My Teams */}
        {isCoach && (
          <div className="space-y-6">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Your Teams (Coach)
            </h2>

            {coachTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-800">{team.name}</h3>
                  <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg font-mono text-sm">
                    {team.join_code}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-xs text-blue-600 font-semibold mb-1">MEMBERS</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {team.member_emails?.length || 0}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3">
                    <p className="text-xs text-purple-600 font-semibold mb-1">DRILLS</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {team.assigned_drills?.length || 0}
                    </p>
                  </div>
                </div>

                {/* Post Announcement */}
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Post Announcement</p>
                  <Textarea
                    placeholder="e.g., Practice at 4pm tomorrow!"
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                    className="mb-2"
                    rows={2}
                  />
                  <Button
                    onClick={() => postAnnouncement.mutate(team.id)}
                    disabled={!announcement.trim()}
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Post to Team
                  </Button>
                </div>

                {/* Recent Announcements */}
                {team.announcements && team.announcements.length > 0 && (
                  <div className="border-t border-slate-100 pt-4 mt-4">
                    <p className="text-sm font-semibold text-slate-700 mb-2">Recent Announcements</p>
                    <div className="space-y-2">
                      {team.announcements.slice(-3).reverse().map((ann, i) => (
                        <div key={i} className="bg-slate-50 rounded-lg p-3">
                          <p className="text-sm text-slate-700">{ann.message}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(ann.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Member View - My Teams */}
        {isMember && (
          <div className="space-y-6">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Your Teams
            </h2>

            {memberTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-800">{team.name}</h3>
                  <Award className="w-6 h-6 text-emerald-500" />
                </div>

                <div className="mb-4">
                  <p className="text-sm text-slate-600">
                    {team.member_emails?.length || 0} team members
                  </p>
                </div>

                {/* Announcements */}
                {team.announcements && team.announcements.length > 0 && (
                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Team Announcements
                    </p>
                    <div className="space-y-2">
                      {team.announcements.slice(-3).reverse().map((ann, i) => (
                        <div key={i} className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm text-slate-700">{ann.message}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(ann.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assigned Drills */}
                {team.assigned_drills && team.assigned_drills.length > 0 && (
                  <div className="border-t border-slate-100 pt-4 mt-4">
                    <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Assigned Drills
                    </p>
                    <div className="space-y-2">
                      {team.assigned_drills.slice(-3).reverse().map((drill, i) => (
                        <div key={i} className="bg-emerald-50 rounded-lg p-3">
                          <p className="text-sm font-semibold text-slate-800">{drill.drill_name}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Assigned: {new Date(drill.assigned_date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isCoach && !isMember && !showCreateForm && !showJoinForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Join the Team Spirit!
            </h3>
            <p className="text-slate-500">
              Create a team as a coach or join one with a code
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}