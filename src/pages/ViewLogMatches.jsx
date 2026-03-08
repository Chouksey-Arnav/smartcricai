import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, ChevronRight, Calendar } from 'lucide-react';
import Header from '@/components/common/Header';

export default function ViewLogMatches() {
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ['matches', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const all = await base44.entities.Match.filter({ user_email: user.email });
      return all.sort((a, b) => new Date(b.match_date) - new Date(a.match_date));
    },
    enabled: !!user?.email,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-24">
      <Header title="Match History" showSettings={false} />

      <div className="px-6 py-4 max-w-lg mx-auto space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-6 text-white"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Your Match Log</h2>
              <p className="text-green-100 text-sm">{matches.length} matches recorded</p>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Matches Logged Yet</h3>
            <p className="text-slate-500 mb-6">Start logging your matches to track your progress!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(createPageUrl(`MatchDetail?id=${match.id}`))}
                className="bg-white rounded-2xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-2xl ${
                        match.result === 'won' ? '🏆' : 
                        match.result === 'lost' ? '😔' : 
                        match.result === 'tied' ? '🤝' : '🔄'
                      }`}>
                        {match.result === 'won' ? '🏆' : 
                         match.result === 'lost' ? '😔' : 
                         match.result === 'tied' ? '🤝' : '🔄'}
                      </span>
                      <div>
                        <h3 className="font-bold text-slate-800 capitalize">
                          {match.match_type} Match
                        </h3>
                        <p className="text-sm text-slate-600 capitalize">{match.result?.replace(/_/g, ' ') || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(match.match_date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}