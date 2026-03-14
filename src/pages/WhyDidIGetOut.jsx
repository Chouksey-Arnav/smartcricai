import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, Target, Lightbulb, Dumbbell, Loader2, Brain, AlertTriangle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/common/Header';
import { getDismissalAnalysis } from '@/components/dismissal/DismissalDatabase';

const tapScale = { whileTap: { scale: 0.95 } };

export default function WhyDidIGetOut() {
  const [shotPlayed, setShotPlayed] = useState('');
  const [ballType, setBallType] = useState('');
  const [fieldSetup, setFieldSetup] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const shots = [
    'drive', 'cut', 'pull', 'hook', 'sweep', 'reverse_sweep',
    'cover_drive', 'straight_drive', 'square_cut', 'late_cut', 'flick'
  ];
  const shotLabels = {
    'drive': 'Drive', 'cut': 'Cut', 'pull': 'Pull', 'hook': 'Hook',
    'sweep': 'Sweep', 'reverse_sweep': 'Reverse Sweep',
    'cover_drive': 'Cover Drive', 'straight_drive': 'Straight Drive',
    'square_cut': 'Square Cut', 'late_cut': 'Late Cut', 'flick': 'Flick'
  };

  const balls = [
    'fast_full', 'fast_short', 'yorker', 'bouncer',
    'off_spin', 'leg_spin', 'googly', 'doosra',
    'in_swinger', 'out_swinger', 'slower_ball'
  ];
  const ballLabels = {
    'fast_full': 'Fast Full', 'fast_short': 'Fast Short', 'yorker': 'Yorker',
    'bouncer': 'Bouncer', 'off_spin': 'Off Spin', 'leg_spin': 'Leg Spin',
    'googly': 'Googly', 'doosra': 'Doosra', 'in_swinger': 'Inswinger',
    'out_swinger': 'Outswinger', 'slower_ball': 'Slower Ball'
  };

  const fields = [
    'attacking', 'defensive', 'leg_side_heavy',
    'off_side_packed', 'deep_field', 'up_close_catchers', 'standard_odi'
  ];
  const fieldLabels = {
    'attacking': 'Attacking (Multiple Slips)', 'defensive': 'Defensive',
    'leg_side_heavy': 'Leg Side Heavy', 'off_side_packed': 'Off Side Packed',
    'deep_field': 'Deep Field', 'up_close_catchers': 'Up Close Catchers', 'standard_odi': 'Standard ODI'
  };

  const analyzeWicket = () => {
    if (!shotPlayed || !ballType || !fieldSetup) return;
    setAnalyzing(true);
    setAnalysis(null);
    setTimeout(() => {
      const result = getDismissalAnalysis(shotPlayed, ballType, fieldSetup);
      setAnalysis(result);
      setAnalyzing(false);
    }, 600);
  };

  const getRiskColor = (rating) => {
    if (rating >= 8) return 'from-red-600 to-red-700';
    if (rating >= 6) return 'from-orange-500 to-red-500';
    if (rating >= 4) return 'from-yellow-500 to-orange-500';
    return 'from-emerald-500 to-teal-500';
  };

  const getRiskLabel = (rating) => {
    if (rating >= 8) return 'VERY HIGH RISK';
    if (rating >= 6) return 'HIGH RISK';
    if (rating >= 4) return 'MODERATE RISK';
    return 'LOW RISK';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white pb-24">
      <Header title="Why Did I Get Out?" showSettings={false} />

      <div className="px-6 py-4 max-w-lg mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-6 text-white mb-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Dismissal Analyzer</h2>
              <p className="text-red-100 text-sm">847 unique scenarios analyzed</p>
            </div>
          </div>
          <p className="text-red-100 text-sm">
            Deep-research powered analysis of every shot × ball × field combination. Never make the same mistake twice.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-6"
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                What shot did you play?
              </label>
              <Select value={shotPlayed} onValueChange={setShotPlayed}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select shot" />
                </SelectTrigger>
                <SelectContent>
                  {shots.map(shot => (
                    <SelectItem key={shot} value={shot}>{shotLabels[shot] || shot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                What type of ball was it?
              </label>
              <Select value={ballType} onValueChange={setBallType}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select ball type" />
                </SelectTrigger>
                <SelectContent>
                  {balls.map(ball => (
                    <SelectItem key={ball} value={ball}>{ballLabels[ball] || ball}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                What was the field setup?
              </label>
              <Select value={fieldSetup} onValueChange={setFieldSetup}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map(field => (
                    <SelectItem key={field} value={field}>{fieldLabels[field] || field}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <motion.div {...tapScale}>
              <Button
                onClick={analyzeWicket}
                disabled={!shotPlayed || !ballType || !fieldSetup || analyzing}
                className="w-full h-12 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-base font-semibold"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5 mr-2" />
                    Analyze My Dismissal
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Shot Selection Risk */}
              <div className="bg-white rounded-2xl shadow-lg p-5">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Shot Selection Risk
                </h3>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.danger_rating * 10}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full bg-gradient-to-r ${getRiskColor(analysis.danger_rating)}`}
                    />
                  </div>
                  <span className="font-bold text-red-600 text-lg">{analysis.danger_rating}/10</span>
                </div>
                <p className={`text-xs font-bold ${analysis.danger_rating >= 8 ? 'text-red-600' : analysis.danger_rating >= 6 ? 'text-orange-500' : 'text-amber-500'}`}>
                  {getRiskLabel(analysis.danger_rating)}
                </p>
              </div>

              {/* What Went Wrong */}
              <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl p-6 text-white">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  What Went Wrong
                </h3>
                <p className="text-red-50 leading-relaxed text-sm">{analysis.what_went_wrong}</p>
              </div>

              {/* Root Cause */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="font-bold text-lg text-orange-600 mb-3">🔍 Root Cause</h3>
                <p className="text-slate-700 leading-relaxed text-sm">{analysis.root_cause}</p>
              </div>

              {/* What To Do Next Time */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl shadow-xl p-6 border-2 border-emerald-200">
                <h3 className="font-bold text-lg text-emerald-700 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  What To Do Next Time
                </h3>
                <div className="space-y-3">
                  {analysis.what_to_do_next_time?.map((tip, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 flex gap-3">
                      <span className="font-bold text-emerald-600 shrink-0">{i + 1}.</span>
                      <p className="text-slate-700 text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drills to Fix This */}
              <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl p-6 text-white">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Dumbbell className="w-5 h-5" />
                  3 Drills to Fix This
                </h3>
                <div className="space-y-4">
                  {analysis.recommended_drills?.map((drill, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center shrink-0 text-sm font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-bold mb-1">{drill.name}</h4>
                          <p className="text-purple-100 text-sm leading-relaxed">{drill.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mental Session */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Mental Session to Fix This
                </h3>
                <div className="bg-white/10 rounded-2xl p-4">
                  <h4 className="font-bold mb-2">{analysis.mental_session?.title}</h4>
                  <p className="text-indigo-100 text-sm leading-relaxed">{analysis.mental_session?.description}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold capitalize">
                    {analysis.mental_session?.category?.replace('-', ' ')}
                  </span>
                </div>
              </div>

              {/* Match Awareness */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Match Awareness Tip
                </h4>
                <p className="text-blue-700 text-sm leading-relaxed">{analysis.match_awareness_tip}</p>
              </div>

              {/* Positive Note */}
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-6 text-center text-white">
                <p className="text-lg font-bold mb-3">💪 Remember This</p>
                <p className="text-pink-100 text-sm italic leading-relaxed">"{analysis.positive_note}"</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!analysis && !analyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Analyze Your Dismissal
            </h3>
            <p className="text-slate-500 text-sm">
              Select all three options above to get a deep, research-backed breakdown of what went wrong and exactly how to fix it.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}