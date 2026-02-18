import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Calendar, TrendingUp, Target, Trash2, TrendingDown } from 'lucide-react';
import Header from '@/components/common/Header';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function MatchHistory() {
  const queryClient = useQueryClient();
  
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ['matches', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const results = await base44.entities.Match.filter({ user_email: user.email });
      return results.sort((a, b) => new Date(b.match_date) - new Date(a.match_date));
    },
    enabled: !!user?.email,
  });

  const deleteMatchMutation = useMutation({
    mutationFn: async (matchId) => {
      await base44.entities.Match.delete(matchId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      toast.success('Match deleted');
    },
  });

  const deleteAllMatchesMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(matches.map(m => base44.entities.Match.delete(m.id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      toast.success('All matches deleted');
    },
  });

  const stats = {
    total: matches.length,
    won: matches.filter(m => m.result === 'won').length,
    lost: matches.filter(m => m.result === 'lost').length,
    tied: matches.filter(m => m.result === 'tied').length,
  };

  const winRate = stats.total > 0 ? Math.round((stats.won / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-24">
      <Header title="Match History" />

      <div className="px-6 py-4 max-w-lg mx-auto space-y-6">
        {/* Delete All Button */}
        {matches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={() => {
                if (confirm('Delete ALL match history? This cannot be undone.')) {
                  deleteAllMatchesMutation.mutate();
                }
              }}
              disabled={deleteAllMatchesMutation.isPending}
              variant="destructive"
              className="w-full bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              {deleteAllMatchesMutation.isPending ? 'Deleting...' : 'Delete All Matches'}
            </Button>
          </motion.div>
        )}

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-6 text-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8" />
            <div>
              <h2 className="font-bold text-xl">Your Record</h2>
              <p className="text-green-100 text-sm">{stats.total} matches logged</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{stats.won}</p>
              <p className="text-xs text-green-100">Won</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{stats.lost}</p>
              <p className="text-xs text-green-100">Lost</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{winRate}%</p>
              <p className="text-xs text-green-100">Win Rate</p>
            </div>
          </div>
        </motion.div>

        {/* Match List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500">No matches logged yet</p>
            </div>
          ) : (
            matches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-5 shadow-lg border-2 border-slate-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {match.result === 'won' ? (
                        <Trophy className="w-6 h-6 text-green-500" />
                      ) : match.result === 'lost' ? (
                        <TrendingDown className="w-6 h-6 text-red-500" />
                      ) : (
                        <Target className="w-6 h-6 text-slate-500" />
                      )}
                      <h3 className="font-bold text-slate-800 capitalize">{match.match_type} Match</h3>
                    </div>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(match.match_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      match.result === 'won' ? 'bg-green-100 text-green-700' :
                      match.result === 'lost' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {match.result}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this match? This cannot be undone.')) {
                          deleteMatchMutation.mutate(match.id);
                        }
                      }}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {match.batting_stats?.runs !== undefined && (
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-xs text-blue-600 font-medium">Batting</p>
                      <p className="text-lg font-bold text-blue-700">
                        {match.batting_stats.runs}/{match.batting_stats.balls || 0}
                      </p>
                    </div>
                  )}
                  {match.bowling_stats?.wickets !== undefined && (
                    <div className="bg-red-50 rounded-lg p-2">
                      <p className="text-xs text-red-600 font-medium">Bowling</p>
                      <p className="text-lg font-bold text-red-700">
                        {match.bowling_stats.wickets}W / {match.bowling_stats.runs_conceded}R
                      </p>
                    </div>
                  )}
                </div>

                {match.notes && (
                  <p className="text-sm text-slate-600 italic border-l-2 border-slate-200 pl-3">
                    {match.notes}
                  </p>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}