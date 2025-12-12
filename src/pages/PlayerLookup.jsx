import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, MapPin, Trophy, TrendingUp, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PlayerLookup() {
  const [searchQuery, setSearchQuery] = useState('');
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchPlayer = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    
    const prompt = `Search for cricket player: ${searchQuery}
    
Search sources to include:
1. International cricket databases (ICC, ESPN Cricinfo)
2. CricClubs player database for local/club players
3. Domestic cricket records
4. Youth cricket achievements

Give me a kid-friendly player profile including:
- Full name
- Country/team (include if playing for a club found on CricClubs)
- Playing role (batter/bowler/all-rounder/keeper)
- Batting style & bowling style
- Career format (ODI/Test/T20/domestic/club)
- 3-4 key stats (simplified, kid-friendly)
- 2-3 recent performance highlights (simple)
- 2 fun facts or signature strengths
- 1 tip for young players watching this player
- If found on CricClubs: club name and level

Make it simple, positive, and inspiring for kids aged 8-14. Search broadly - include professional, semi-professional, and club players.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: prompt,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          full_name: { type: "string" },
          country: { type: "string" },
          role: { type: "string" },
          batting_style: { type: "string" },
          bowling_style: { type: "string" },
          career_format: { type: "string" },
          club_info: { type: "string" },
          key_stats: {
            type: "array",
            items: { 
              type: "object",
              properties: {
                label: { type: "string" },
                value: { type: "string" }
              }
            }
          },
          recent_highlights: {
            type: "array",
            items: { type: "string" }
          },
          fun_facts: {
            type: "array",
            items: { type: "string" }
          },
          tip_for_kids: { type: "string" }
        }
      }
    });
    
    setPlayerData(result);
    setLoading(false);
  };

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
            🏏 Player Lookup
          </h1>
          <p className="text-slate-600">
            Search for your favorite cricket players and learn from the best!
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-4 mb-6"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search player name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchPlayer()}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button 
              onClick={searchPlayer}
              disabled={loading || !searchQuery.trim()}
              className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? '...' : 'Search'}
            </Button>
          </div>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Finding player info...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player Card */}
        <AnimatePresence>
          {playerData && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Main Info Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    {playerData.full_name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-800">
                      {playerData.full_name}
                    </h2>
                    <div className="flex items-center gap-2 text-slate-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{playerData.country}</span>
                    </div>
                  </div>
                </div>

                {/* Role & Style */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-xs text-blue-600 font-semibold mb-1">ROLE</p>
                    <p className="text-slate-800 font-medium">{playerData.role}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <p className="text-xs text-emerald-600 font-semibold mb-1">FORMAT</p>
                    <p className="text-slate-800 font-medium">{playerData.career_format}</p>
                  </div>
                  {playerData.batting_style && (
                    <div className="bg-purple-50 rounded-xl p-3">
                      <p className="text-xs text-purple-600 font-semibold mb-1">BATTING</p>
                      <p className="text-slate-800 font-medium">{playerData.batting_style}</p>
                    </div>
                  )}
                  {playerData.bowling_style && (
                    <div className="bg-amber-50 rounded-xl p-3">
                      <p className="text-xs text-amber-600 font-semibold mb-1">BOWLING</p>
                      <p className="text-slate-800 font-medium">{playerData.bowling_style}</p>
                    </div>
                  )}
                </div>

                {/* Club Info */}
                {playerData.club_info && (
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-4 mb-6">
                    <p className="text-xs text-indigo-600 font-semibold mb-1">🏏 CLUB INFO</p>
                    <p className="text-slate-800 font-medium">{playerData.club_info}</p>
                  </div>
                )}

                {/* Key Stats */}
                {playerData.key_stats && playerData.key_stats.length > 0 && (
                  <div className="border-t border-slate-100 pt-4">
                    <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      Key Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {playerData.key_stats.map((stat, index) => (
                        <div key={index} className="bg-slate-50 rounded-lg p-3">
                          <p className="text-xs text-slate-500">{stat.label}</p>
                          <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Highlights */}
              {playerData.recent_highlights && playerData.recent_highlights.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Recent Highlights
                  </h3>
                  <ul className="space-y-2">
                    {playerData.recent_highlights.map((highlight, index) => (
                      <li key={index} className="flex gap-2 text-slate-700">
                        <span className="text-emerald-500">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Fun Facts */}
              {playerData.fun_facts && playerData.fun_facts.length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-6">
                  <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    Fun Facts
                  </h3>
                  <ul className="space-y-2">
                    {playerData.fun_facts.map((fact, index) => (
                      <li key={index} className="flex gap-2 text-amber-700">
                        <span>⭐</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tip for Kids */}
              {playerData.tip_for_kids && (
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-6 text-white">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Learn from {playerData.full_name?.split(' ')[0]}
                  </h3>
                  <p className="text-emerald-50">
                    {playerData.tip_for_kids}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!playerData && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Search for a Player
            </h3>
            <p className="text-slate-500">
              Type a player's name to see their profile
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}