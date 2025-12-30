import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, TrendingUp, Calendar, User, Newspaper, 
  Star, Bell, Filter, Clock, Target, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/common/Header';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function CricketHub() {
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState('live');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    staleTime: 300000,
    retry: 3,
  });

  const { data: preferences } = useQuery({
    queryKey: ['userPreferences', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const prefs = await base44.entities.UserPreferences.filter({ user_email: user.email });
      return prefs[0] || null;
    },
    enabled: !!user?.email,
    staleTime: 60000,
    retry: 3,
  });

  // Fetch live cricket data
  const { data: cricketData, isLoading } = useQuery({
    queryKey: ['cricketData', selectedTab],
    queryFn: async () => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Get current cricket match data for ${selectedTab === 'live' ? 'live matches' : selectedTab === 'upcoming' ? 'matches in next 5 days' : 'matches from past 5 days'}.

Return comprehensive match data including:
- Live matches with current scores
- Match status, teams, venue
- Key player performances
- Recent highlights and milestones

Format: Return realistic, current cricket match data.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            matches: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  match_id: { type: "string" },
                  title: { type: "string" },
                  teams: { type: "array", items: { type: "string" } },
                  status: { type: "string" },
                  venue: { type: "string" },
                  format: { type: "string" },
                  score_summary: { type: "string" },
                  is_live: { type: "boolean" },
                  date: { type: "string" },
                  highlights: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      });
      return response;
    },
    refetchInterval: selectedTab === 'live' ? 60000 : false, // Refresh live scores every minute
  });

  // Fetch cricket news
  const { data: newsData } = useQuery({
    queryKey: ['cricketNews'],
    queryFn: async () => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Get the latest 10 cricket news headlines and articles from today. Include major updates, player news, match results, and breaking stories.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            articles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  category: { type: "string" },
                  timestamp: { type: "string" }
                }
              }
            }
          }
        }
      });
      return response;
    },
    refetchInterval: 300000, // Refresh news every 5 minutes
  });

  const addFavoriteTeamMutation = useMutation({
    mutationFn: async (team) => {
      if (!preferences) {
        await base44.entities.UserPreferences.create({
          user_email: user.email,
          favorite_teams: [team]
        });
      } else {
        const newFavorites = [...(preferences.favorite_teams || []), team];
        await base44.entities.UserPreferences.update(preferences.id, {
          favorite_teams: newFavorites
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userPreferences']);
      toast.success('Team added to favorites!');
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-orange-50 to-yellow-50 pb-24">
      <Header title="Cricket Hub" />

      <div className="px-6 py-4 max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-6 text-white mb-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-bold text-xl">Live Cricket Action</h2>
              <p className="text-red-100 text-sm">Real-time scores, news & updates</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap mt-4">
            <Badge className="bg-white/20 hover:bg-white/30">
              <Activity className="w-3 h-3 mr-1" />
              Live Scores
            </Badge>
            <Badge className="bg-white/20 hover:bg-white/30">
              <Calendar className="w-3 h-3 mr-1" />
              Schedules
            </Badge>
            <Badge className="bg-white/20 hover:bg-white/30">
              <Newspaper className="w-3 h-3 mr-1" />
              News
            </Badge>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 bg-white rounded-2xl p-1">
            <TabsTrigger value="live" className="rounded-xl">
              <Activity className="w-4 h-4 mr-2" />
              Live
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="rounded-xl">
              <Calendar className="w-4 h-4 mr-2" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="recent" className="rounded-xl">
              <Clock className="w-4 h-4 mr-2" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="news" className="rounded-xl">
              <Newspaper className="w-4 h-4 mr-2" />
              News
            </TabsTrigger>
          </TabsList>

          {/* Matches Content */}
          <TabsContent value="live" className="mt-6">
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto" />
                  <p className="text-slate-600 mt-4">Loading live matches...</p>
                </div>
              ) : (
                cricketData?.matches?.map((match, i) => (
                  <motion.div
                    key={match.match_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-3xl shadow-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{match.title}</h3>
                        <p className="text-sm text-slate-500">{match.venue} • {match.format}</p>
                      </div>
                      {match.is_live && (
                        <Badge className="bg-red-500 animate-pulse">
                          <Activity className="w-3 h-3 mr-1" />
                          LIVE
                        </Badge>
                      )}
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                      <p className="font-semibold text-slate-800 text-lg">{match.score_summary}</p>
                      <p className="text-sm text-slate-600 mt-1">{match.status}</p>
                    </div>

                    {match.highlights && match.highlights.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-2">HIGHLIGHTS</p>
                        <div className="space-y-1">
                          {match.highlights.map((highlight, idx) => (
                            <p key={idx} className="text-sm text-slate-700">• {highlight}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      {match.teams.map((team, idx) => (
                        <Button
                          key={idx}
                          size="sm"
                          variant="outline"
                          onClick={() => addFavoriteTeamMutation.mutate(team)}
                          disabled={preferences?.favorite_teams?.includes(team)}
                        >
                          <Star className="w-3 h-3 mr-1" />
                          {preferences?.favorite_teams?.includes(team) ? 'Following' : `Follow ${team}`}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto" />
                  <p className="text-slate-600 mt-4">Loading upcoming matches...</p>
                </div>
              ) : (
                cricketData?.matches?.map((match, i) => (
                  <motion.div
                    key={match.match_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-3xl shadow-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{match.title}</h3>
                        <p className="text-sm text-slate-500">{match.venue} • {match.format}</p>
                      </div>
                      <Badge variant="outline">
                        <Calendar className="w-3 h-3 mr-1" />
                        {match.date}
                      </Badge>
                    </div>
                    <p className="text-slate-600 mb-3">{match.status}</p>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      <Bell className="w-3 h-3 mr-2" />
                      Set Reminder
                    </Button>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="mt-6">
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
                  <p className="text-slate-600 mt-4">Loading recent matches...</p>
                </div>
              ) : (
                cricketData?.matches?.map((match, i) => (
                  <motion.div
                    key={match.match_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-3xl shadow-lg p-6"
                  >
                    <h3 className="font-bold text-lg text-slate-800 mb-2">{match.title}</h3>
                    <p className="text-sm text-slate-500 mb-3">{match.venue} • {match.format}</p>
                    <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
                      <p className="font-semibold text-green-800">{match.score_summary}</p>
                      <p className="text-sm text-green-700 mt-1">{match.status}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="news" className="mt-6">
            <div className="space-y-4">
              {newsData?.articles?.map((article, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-3xl shadow-lg p-6"
                >
                  <Badge className="mb-3">{article.category}</Badge>
                  <h3 className="font-bold text-lg text-slate-800 mb-2">{article.title}</h3>
                  <p className="text-slate-600 mb-3">{article.summary}</p>
                  <p className="text-xs text-slate-400">{article.timestamp}</p>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}