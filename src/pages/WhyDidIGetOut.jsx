import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, Target, Lightbulb, Dumbbell, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/common/Header';

export default function WhyDidIGetOut() {
  const [shotPlayed, setShotPlayed] = useState('');
  const [ballType, setBallType] = useState('');
  const [fieldSetup, setFieldSetup] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  // Match the exact values from the CSV database
  const shots = [
    'drive', 'cut', 'pull', 'hook', 'sweep', 'reverse sweep',
    'cover drive', 'straight drive', 'square cut', 'late cut',
    'flick', 'glance', 'defensive push', 'block', 'leave'
  ];

  const balls = [
    'fast full', 'fast short', 'yorker', 'bouncer',
    'off spin', 'leg spin', 'googly', 'doosra',
    'inswinger', 'outswinger', 'slower ball', 'knuckleball'
  ];

  const fields = [
    'attacking three slips', 'defensive all around', 'leg side heavy',
    'offside packed', 'deep field', 'up close catchers', 'standard ODI'
  ];

  const analyzeWicket = async () => {
    if (!shotPlayed || !ballType || !fieldSetup) return;

    setAnalyzing(true);
    setAnalysis(null);

    try {
      // Fetch from pre-generated library
      // The CSV has columns: Shot, Ball Type, Field Setup
    const all = await base44.entities.DismissalAnalysis.list();
    const analyses = all.filter(a => 
      a.Shot?.toLowerCase() === shotPlayed.toLowerCase() &&
      a['Ball Type']?.toLowerCase() === ballType.toLowerCase() &&
      a['Field Setup']?.toLowerCase() === fieldSetup.toLowerCase()
    );

      let result;
      if (analyses.length > 0) {
        // Use existing analysis from CSV database
        const dismissal = analyses[0];
        const tipsRaw = dismissal['What to Do Better Next Time'] || '';
        const tipsList = tipsRaw.split(';').map(t => t.trim()).filter(Boolean);
        const drillsRaw = dismissal['Recommended Drills'] || '';
        const drillsList = drillsRaw.split(',').map(d => d.trim()).filter(Boolean);
        const riskScore = parseInt(dismissal['Shot Selection Risk (out of 10)']) || 7;

        result = {
          what_went_wrong: dismissal['What Went Wrong'] || dismissal.analysis || '',
          why_it_happened: dismissal['Root Cause'] || dismissal.key_mistake || '',
          what_to_do_next_time: tipsList.length > 0 ? tipsList : (dismissal.improvement_tips || []),
          recommended_drill: {
            drill_name: drillsList[0] || 'Practice this shot',
            how_it_helps: drillsList.length > 1 ? `Also try: ${drillsList.slice(1).join(', ')}` : 'Improves your technique and decision making',
            quick_steps: 'Focus on recognising the length and line early. Use shadow practice to ingrain the correct movement pattern.'
          },
          match_awareness_tip: 'Always assess the field setup before playing an attacking shot. Match conditions and field placement should guide your shot selection.',
          positive_note: 'Every dismissal is a learning opportunity. The best players in the world study their mistakes to become unstoppable!',
          danger_rating: riskScore
        };
      } else {
        // Fallback generic analysis
        result = {
          what_went_wrong: `Playing a ${shotPlayed} to a ${ballType} with ${fieldSetup} field can be risky. Shot selection and timing are crucial.`,
          why_it_happened: 'This combination requires perfect execution and match awareness.',
          what_to_do_next_time: [
            'Watch the ball more closely from the bowler\'s hand',
            'Consider the field setup before choosing your shot',
            'Practice this shot in training to build confidence'
          ],
          recommended_drill: {
            drill_name: 'Shot Selection Drill',
            how_it_helps: 'Helps you make better decisions based on ball type and field',
            quick_steps: 'Practice recognizing different ball types and choosing appropriate shots'
          },
          match_awareness_tip: 'Always assess the field before playing your shot',
          positive_note: 'Learning from dismissals makes you a smarter player!',
          danger_rating: (() => {
            const shot = shotPlayed.toLowerCase();
            const ball = ballType.toLowerCase();
            const field = fieldSetup.toLowerCase();

            if (shot.includes('drive') && ball.includes('yorker')) return 9;
            if (shot.includes('sweep') && ball.includes('bouncer')) return 10;
            if (shot.includes('cut') && field.includes('off side packed')) return 8;
            if (shot.includes('pull') && field.includes('leg side heavy')) return 8;
            if (shot.includes('block') || shot.includes('leave')) return 3;
            if (ball.includes('slower ball') && shot.includes('drive')) return 6;
            if (ball.includes('bouncer') && shot.includes('hook')) return 5;

            return 7;
          })()
        };
      }

      setAnalysis(result);
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setAnalyzing(false);
    }
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
              <p className="text-red-100 text-sm">Learn from every wicket</p>
            </div>
          </div>
          <p className="text-red-100 text-sm">
            Understanding why you got out is the key to never making that mistake again!
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
                    <SelectItem key={shot} value={shot}>{shot}</SelectItem>
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
                    <SelectItem key={ball} value={ball}>{ball}</SelectItem>
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
                    <SelectItem key={field} value={field}>{field}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
              {/* Danger Rating */}
              <div className="bg-white rounded-2xl shadow-lg p-5 border-l-4 border-red-500">
                <h3 className="font-bold text-slate-800 mb-2">Shot Selection Risk</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-red-500"
                      style={{ width: `${analysis.danger_rating * 10}%` }}
                    />
                  </div>
                  <span className="font-bold text-red-600">{analysis.danger_rating}/10</span>
                </div>
              </div>

              {/* What Went Wrong */}
              <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl p-6 text-white">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  What Went Wrong
                </h3>
                <p className="text-red-50 leading-relaxed">{analysis.what_went_wrong}</p>
              </div>

              {/* Why It Happened */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="font-bold text-lg text-orange-600 mb-3">🔍 Root Cause</h3>
                <p className="text-slate-700 leading-relaxed">{analysis.why_it_happened}</p>
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
                      <p className="text-slate-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Drill */}
              <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl p-6 text-white">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Dumbbell className="w-5 h-5" />
                  Drill to Fix This
                </h3>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
                  <h4 className="font-bold text-xl mb-3">{analysis.recommended_drill?.drill_name}</h4>
                  <p className="text-purple-100 mb-4">{analysis.recommended_drill?.how_it_helps}</p>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-sm text-purple-100">{analysis.recommended_drill?.quick_steps}</p>
                  </div>
                </div>
              </div>

              {/* Match Awareness */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
                <h4 className="font-bold text-blue-800 mb-2">🧠 Match Awareness Tip</h4>
                <p className="text-blue-700">{analysis.match_awareness_tip}</p>
              </div>

              {/* Positive Note */}
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-6 text-center text-white">
                <p className="text-lg font-medium mb-2">💪 Remember This</p>
                <p className="text-pink-100 italic">"{analysis.positive_note}"</p>
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
              Fill in the details above to understand what went wrong and how to improve!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}