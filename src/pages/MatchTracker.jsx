import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/common/Header';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function MatchTracker() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [match, setMatch] = useState({
    match_date: new Date().toISOString().split('T')[0],
    match_type: '',
    result: '',
    batting_stats: { runs: 0, balls: 0, fours: 0, sixes: 0, how_out: '' },
    bowling_stats: { overs: 0, wickets: 0, runs_conceded: 0, maidens: 0, economy: 0 },
    fielding_stats: { catches: 0, stumpings: 0, run_outs: 0, dropped_catches: 0 },
    notes: '',
    confidence_rating: 5
  });

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
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const results = await base44.entities.UserProgress.filter({ user_email: guestEmail });
      return results[0] || null;
    },
  });

  const saveMatchMutation = useMutation({
    mutationFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      await base44.entities.Match.create({
        ...match,
        user_email: guestEmail
      });

      await base44.entities.Notification.create({
        user_email: guestEmail,
        type: 'match',
        title: 'Match Logged! 🏏',
        message: `${match.match_type} match on ${match.match_date} - Result: ${match.result}`,
        related_id: 'match_' + Date.now()
      });

      await base44.entities.ScheduledActivity.create({
        user_email: guestEmail,
        title: `${match.match_type} Match`,
        date: match.match_date,
        notes: `Result: ${match.result}`,
        activity_type: 'match'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['scheduledActivities'] });
      toast.success('Match saved! 🏏');
      navigate(createPageUrl('MatchHistory'));
    },
  });

  const showBatting = true;
  const showBowling = true;
  const showFielding = true;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-slate-900 dark:to-slate-950 pb-24">
      <Header title="Log Match" showSettings={false} />
      
      <div className="px-6 py-6 max-w-lg mx-auto space-y-6">
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
              <h2 className="font-bold text-xl">Track Your Performance</h2>
              <p className="text-green-100 text-sm">Log match stats and analyze</p>
            </div>
          </div>
        </motion.div>

        <Button
          onClick={() => navigate(createPageUrl('MatchHistory'))}
          variant="outline"
          className="w-full"
        >
          View Match History
        </Button>

        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Match Details</h3>
            
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Match Date
              </label>
              <Input
                type="date"
                value={match.match_date}
                onChange={(e) => setMatch({...match, match_date: e.target.value})}
                className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white h-12 text-base"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Match Type
              </label>
              <Select value={match.match_type} onValueChange={(val) => setMatch({...match, match_type: val})}>
                <SelectTrigger className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white h-12 text-base">
                  <SelectValue placeholder="Select match type" />
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
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Match Result
              </label>
              <Select value={match.result} onValueChange={(val) => setMatch({...match, result: val})}>
                <SelectTrigger className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white h-12 text-base">
                  <SelectValue placeholder="Select result" />
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

          {showBatting && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 space-y-4">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🏏</span>
                </div>
                Batting Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Runs</label>
                  <Input
                    type="number"
                    value={match.batting_stats.runs}
                    onChange={(e) => setMatch({...match, batting_stats: {...match.batting_stats, runs: parseInt(e.target.value) || 0}})}
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white h-12"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Balls</label>
                  <Input
                    type="number"
                    value={match.batting_stats.balls}
                    onChange={(e) => setMatch({...match, batting_stats: {...match.batting_stats, balls: parseInt(e.target.value) || 0}})}
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white h-12"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Fours</label>
                  <Input
                    type="number"
                    value={match.batting_stats.fours}
                    onChange={(e) => setMatch({...match, batting_stats: {...match.batting_stats, fours: parseInt(e.target.value) || 0}})}
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white h-12"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Sixes</label>
                  <Input
                    type="number"
                    value={match.batting_stats.sixes}
                    onChange={(e) => setMatch({...match, batting_stats: {...match.batting_stats, sixes: parseInt(e.target.value) || 0}})}
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white h-12"
                  />
                </div>
              </div>
            </div>
          )}

          {showBowling && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 space-y-4">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🎳</span>
                </div>
                Bowling Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Wickets</label>
                  <Input
                    type="number"
                    value={match.bowling_stats.wickets}
                    onChange={(e) => setMatch({...match, bowling_stats: {...match.bowling_stats, wickets: parseInt(e.target.value) || 0}})}
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white h-12"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Runs Given</label>
                  <Input
                    type="number"
                    value={match.bowling_stats.runs_conceded}
                    onChange={(e) => setMatch({...match, bowling_stats: {...match.bowling_stats, runs_conceded: parseInt(e.target.value) || 0}})}
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white h-12"
                  />
                </div>
              </div>
            </div>
          )}

          {showFielding && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 space-y-4">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🧤</span>
                </div>
                Fielding Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Catches</label>
                  <Input
                    type="number"
                    value={match.fielding_stats.catches}
                    onChange={(e) => setMatch({...match, fielding_stats: {...match.fielding_stats, catches: parseInt(e.target.value) || 0}})}
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white h-12"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Run Outs</label>
                  <Input
                    type="number"
                    value={match.fielding_stats.run_outs}
                    onChange={(e) => setMatch({...match, fielding_stats: {...match.fielding_stats, run_outs: parseInt(e.target.value) || 0}})}
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white h-12"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-2">
                <span className="text-lg">⭐</span>
                Confidence Rating
              </label>
              <Input
                type="range"
                min="1"
                max="10"
                value={match.confidence_rating}
                onChange={(e) => setMatch({...match, confidence_rating: parseInt(e.target.value)})}
                className="w-full"
              />
              <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-2">{match.confidence_rating}/10</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-2">
                <span className="text-lg">📝</span>
                Match Notes
              </label>
              <Textarea
                value={match.notes}
                onChange={(e) => setMatch({...match, notes: e.target.value})}
                placeholder="How did it go? What did you learn?"
                className="min-h-24 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <Button
            onClick={() => saveMatchMutation.mutate()}
            disabled={saveMatchMutation.isPending || !match.match_type || !match.result}
            className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-lg font-bold"
          >
            {saveMatchMutation.isPending ? 'Saving...' : 'Save Match'}
          </Button>
        </div>
      </div>
    </div>
  );
}