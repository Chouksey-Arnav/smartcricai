import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Target, Calendar, MessageCircle } from 'lucide-react';
import Header from '@/components/common/Header';

export default function MatchDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const matchId = urlParams.get('id');

  const { data: match, isLoading } = useQuery({
    queryKey: ['match', matchId],
    queryFn: async () => {
      const matches = await base44.entities.Match.filter({ id: matchId });
      return matches[0];
    },
    enabled: !!matchId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading match details...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <Header title="Match Not Found" />
        <div className="text-center py-12">
          <p className="text-slate-500">This match could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-24">
      <Header title="Match Details" showSettings={false} />

      <div className="px-6 py-4 max-w-lg mx-auto space-y-4">
        {/* Match Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-6 text-white ${
            match.result === 'won' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
              : match.result === 'lost'
              ? 'bg-gradient-to-r from-red-500 to-orange-500'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg capitalize">{match.match_type} Match</h2>
              <p className="text-white/80 text-sm capitalize">Result: {match.result?.replace(/_/g, ' ') || 'Unknown'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            {new Date(match.match_date).toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </div>
        </motion.div>

        {/* Batting Stats */}
        {match.batting_stats && Object.keys(match.batting_stats).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              🏏 Batting Performance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-xl p-3">
                <p className="text-3xl font-bold text-emerald-600">{match.batting_stats.runs || 0}</p>
                <p className="text-xs text-slate-600">Runs</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-3xl font-bold text-blue-600">{match.batting_stats.balls || 0}</p>
                <p className="text-xs text-slate-600">Balls</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3">
                <p className="text-3xl font-bold text-amber-600">{match.batting_stats.fours || 0}</p>
                <p className="text-xs text-slate-600">Fours</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3">
                <p className="text-3xl font-bold text-purple-600">{match.batting_stats.sixes || 0}</p>
                <p className="text-xs text-slate-600">Sixes</p>
              </div>
            </div>
            {match.batting_stats.how_out && (
              <div className="mt-4 p-3 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-600">Dismissal: <span className="font-semibold text-slate-800">{match.batting_stats.how_out}</span></p>
              </div>
            )}
          </motion.div>
        )}

        {/* Bowling Stats */}
        {match.bowling_stats && Object.keys(match.bowling_stats).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              🎳 Bowling Performance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-xl p-3">
                <p className="text-3xl font-bold text-red-600">{match.bowling_stats.wickets || 0}</p>
                <p className="text-xs text-slate-600">Wickets</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-3">
                <p className="text-3xl font-bold text-orange-600">{match.bowling_stats.overs || 0}</p>
                <p className="text-xs text-slate-600">Overs</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-3">
                <p className="text-3xl font-bold text-yellow-600">{match.bowling_stats.runs_conceded || 0}</p>
                <p className="text-xs text-slate-600">Runs Given</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3">
                <p className="text-3xl font-bold text-green-600">{match.bowling_stats.maidens || 0}</p>
                <p className="text-xs text-slate-600">Maidens</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Fielding Stats */}
        {match.fielding_stats && Object.keys(match.fielding_stats).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              🧤 Fielding Performance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-teal-50 rounded-xl p-3">
                <p className="text-3xl font-bold text-teal-600">{match.fielding_stats.catches || 0}</p>
                <p className="text-xs text-slate-600">Catches</p>
              </div>
              <div className="bg-cyan-50 rounded-xl p-3">
                <p className="text-3xl font-bold text-cyan-600">{match.fielding_stats.run_outs || 0}</p>
                <p className="text-xs text-slate-600">Run Outs</p>
              </div>
              {match.fielding_stats.stumpings !== undefined && (
                <div className="bg-indigo-50 rounded-xl p-3">
                  <p className="text-3xl font-bold text-indigo-600">{match.fielding_stats.stumpings || 0}</p>
                  <p className="text-xs text-slate-600">Stumpings</p>
                </div>
              )}
              <div className="bg-pink-50 rounded-xl p-3">
                <p className="text-3xl font-bold text-pink-600">{match.fielding_stats.dropped_catches || 0}</p>
                <p className="text-xs text-slate-600">Dropped</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Confidence & Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-500" />
            Confidence & Notes
          </h3>
          {match.confidence_rating && (
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-2">Confidence Rating</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                    style={{ width: `${match.confidence_rating * 10}%` }}
                  />
                </div>
                <span className="text-2xl font-bold text-emerald-600">{match.confidence_rating}/10</span>
              </div>
            </div>
          )}
          {match.notes && (
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-start gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-slate-500 mt-0.5" />
                <p className="text-sm font-semibold text-slate-700">Match Notes</p>
              </div>
              <p className="text-sm text-slate-600">{match.notes}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}