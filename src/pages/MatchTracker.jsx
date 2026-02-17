import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Save, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/common/Header';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import toast from 'react-hot-toast';

export default function MatchTracker() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch {
        return null;
      }
    },
  });

  const { data: progress } = useQuery({
    queryKey: ['userProgress', user?.email || 'guest'],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.UserProgress.filter({ user_email: user.email });
      return results[0] || null;
    },
    enabled: !!user?.email,
  });

  const userRole = progress?.primary_role || 'all-rounder';

  const [matchData, setMatchData] = useState({
    match_date: new Date().toISOString().split('T')[0],
    match_type: 'practice',
    result: 'won',
    batting_stats: { runs: 0, balls: 0, fours: 0, sixes: 0, how_out: '' },
    bowling_stats: { overs: 0, wickets: 0, runs_conceded: 0, maidens: 0, economy: 0 },
    fielding_stats: { catches: 0, stumpings: 0, run_outs: 0, dropped_catches: 0 },
    notes: '',
    confidence_rating: 5
  });

  const saveMatchMutation = useMutation({
    mutationFn: async (data) => {
      const match = await base44.entities.Match.create({
        ...data,
        user_email: user.email
      });

      // Create notification
      const resultEmoji = data.result === 'won' ? '🏆' : data.result === 'lost' ? '😔' : '🤝';
      await base44.entities.Notification.create({
        user_email: user.email,
        type: 'achievement',
        title: `Match Logged! ${resultEmoji}`,
        message: `${data.match_type} match on ${new Date(data.match_date).toLocaleDateString()} - Result: ${data.result}`,
        related_id: match.id
      });

      // Add to schedule
      await base44.entities.ScheduledActivity.create({
        user_email: user.email,
        title: `🏏 ${data.match_type.charAt(0).toUpperCase() + data.match_type.slice(1)} Match (${data.result})`,
        notes: data.notes || `Result: ${data.result}`,
        date: data.match_date,
        activity_type: 'match'
      });

      return match;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Match saved! 🏏');
      navigate(createPageUrl('ViewLogMatches'));
    },
  });

  const handleSave = () => {
    saveMatchMutation.mutate(matchData);
  };

  const showBattingStats = ['batter', 'all-rounder', 'wicketkeeper'].includes(userRole);
  const showBowlingStats = ['bowler', 'all-rounder'].includes(userRole);
  const showFieldingStats = true; // Everyone fields

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-24">
      <Header title="Match Tracker" showSettings={false} />

      <div className="px-6 py-4 max-w-lg mx-auto space-y-6">
        {/* View Match History Button */}
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate(createPageUrl('MatchHistory'))}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl p-4 flex items-center justify-center gap-2 shadow-lg"
        >
          <Trophy className="w-5 h-5" />
          <span className="font-semibold">View All Logged Matches</span>
        </motion.button>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-6 text-white"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Log Your Match</h2>
              <p className="text-green-100 text-sm">Role: {userRole}</p>
            </div>
          </div>
        </motion.div>

        {/* Basic Info */}
        <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">
          <h3 className="font-bold text-slate-800 mb-4">Match Details</h3>
          
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Date</label>
            <Input
              type="date"
              value={matchData.match_date}
              onChange={(e) => setMatchData({ ...matchData, match_date: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Match Type</label>
            <Select value={matchData.match_type} onValueChange={(val) => setMatchData({ ...matchData, match_type: val })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="practice">Practice</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="tournament">Tournament</SelectItem>
                <SelectItem value="school">School</SelectItem>
                <SelectItem value="club">Club</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Result</label>
            <Select value={matchData.result} onValueChange={(val) => setMatchData({ ...matchData, result: val })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="won">Won 🏆</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="tied">Tied</SelectItem>
                <SelectItem value="no_result">No Result</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Batting Stats */}
        {showBattingStats && (
          <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">
            <h3 className="font-bold text-slate-800 mb-4">🏏 Batting Stats</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Runs</label>
                <Input
                  type="number"
                  value={matchData.batting_stats.runs}
                  onChange={(e) => setMatchData({
                    ...matchData,
                    batting_stats: { ...matchData.batting_stats, runs: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Balls</label>
                <Input
                  type="number"
                  value={matchData.batting_stats.balls}
                  onChange={(e) => setMatchData({
                    ...matchData,
                    batting_stats: { ...matchData.batting_stats, balls: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Fours</label>
                <Input
                  type="number"
                  value={matchData.batting_stats.fours}
                  onChange={(e) => setMatchData({
                    ...matchData,
                    batting_stats: { ...matchData.batting_stats, fours: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Sixes</label>
                <Input
                  type="number"
                  value={matchData.batting_stats.sixes}
                  onChange={(e) => setMatchData({
                    ...matchData,
                    batting_stats: { ...matchData.batting_stats, sixes: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-600 mb-1 block">How Out?</label>
              <Input
                placeholder="e.g., Caught, Bowled, Not Out"
                value={matchData.batting_stats.how_out}
                onChange={(e) => setMatchData({
                  ...matchData,
                  batting_stats: { ...matchData.batting_stats, how_out: e.target.value }
                })}
              />
            </div>
          </div>
        )}

        {/* Bowling Stats */}
        {showBowlingStats && (
          <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">
            <h3 className="font-bold text-slate-800 mb-4">🎳 Bowling Stats</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Overs</label>
                <Input
                  type="number"
                  step="0.1"
                  value={matchData.bowling_stats.overs}
                  onChange={(e) => setMatchData({
                    ...matchData,
                    bowling_stats: { ...matchData.bowling_stats, overs: parseFloat(e.target.value) || 0 }
                  })}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Wickets</label>
                <Input
                  type="number"
                  value={matchData.bowling_stats.wickets}
                  onChange={(e) => setMatchData({
                    ...matchData,
                    bowling_stats: { ...matchData.bowling_stats, wickets: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Runs Given</label>
                <Input
                  type="number"
                  value={matchData.bowling_stats.runs_conceded}
                  onChange={(e) => setMatchData({
                    ...matchData,
                    bowling_stats: { ...matchData.bowling_stats, runs_conceded: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Maidens</label>
                <Input
                  type="number"
                  value={matchData.bowling_stats.maidens}
                  onChange={(e) => setMatchData({
                    ...matchData,
                    bowling_stats: { ...matchData.bowling_stats, maidens: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Fielding Stats */}
        {showFieldingStats && (
          <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">
            <h3 className="font-bold text-slate-800 mb-4">🧤 Fielding Stats</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Catches</label>
                <Input
                  type="number"
                  value={matchData.fielding_stats.catches}
                  onChange={(e) => setMatchData({
                    ...matchData,
                    fielding_stats: { ...matchData.fielding_stats, catches: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Run Outs</label>
                <Input
                  type="number"
                  value={matchData.fielding_stats.run_outs}
                  onChange={(e) => setMatchData({
                    ...matchData,
                    fielding_stats: { ...matchData.fielding_stats, run_outs: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              {userRole === 'wicketkeeper' && (
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">Stumpings</label>
                  <Input
                    type="number"
                    value={matchData.fielding_stats.stumpings}
                    onChange={(e) => setMatchData({
                      ...matchData,
                      fielding_stats: { ...matchData.fielding_stats, stumpings: parseInt(e.target.value) || 0 }
                    })}
                  />
                </div>
              )}
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Dropped</label>
                <Input
                  type="number"
                  value={matchData.fielding_stats.dropped_catches}
                  onChange={(e) => setMatchData({
                    ...matchData,
                    fielding_stats: { ...matchData.fielding_stats, dropped_catches: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Confidence & Notes */}
        <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Confidence Rating</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="10"
                value={matchData.confidence_rating}
                onChange={(e) => setMatchData({ ...matchData, confidence_rating: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="font-bold text-emerald-600 text-lg">{matchData.confidence_rating}/10</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Match Notes</label>
            <Textarea
              placeholder="How did you feel? What went well? What to improve?"
              value={matchData.notes}
              onChange={(e) => setMatchData({ ...matchData, notes: e.target.value })}
              rows={4}
            />
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={saveMatchMutation.isPending}
          className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-lg font-bold"
        >
          <Save className="w-5 h-5 mr-2" />
          {saveMatchMutation.isPending ? 'Saving...' : 'Save Match'}
        </Button>
      </div>
    </div>
  );
}