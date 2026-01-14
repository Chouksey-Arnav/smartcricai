import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Video, Loader2, CheckCircle, AlertCircle, X, Play, MessageCircle, Sparkles, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/common/Header';
import toast from 'react-hot-toast';

export default function VideoAnalysis() {
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyses, setAnalyses] = useState([]);
  const [error, setError] = useState(null);
  const [annotations, setAnnotations] = useState({});
  const [specificRequest, setSpecificRequest] = useState('');
  const [compareMode, setCompareMode] = useState(false);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    setError(null);

    try {
      const uploadedVideos = [];
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        uploadedVideos.push({ url: file_url, name: file.name });
      }
      
      setVideos(prev => [...prev, ...uploadedVideos]);
      toast.success(`${uploadedVideos.length} video(s) uploaded!`);
    } catch (err) {
      setError('Failed to upload videos. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const analyzeVideos = async () => {
    if (videos.length === 0) return;

    setAnalyzing(true);
    setError(null);

    try {
      const analysisPromises = videos.map(async (video, index) => {
        const specificAnalysis = specificRequest.trim() 
          ? `\n\n🎯 USER'S SPECIFIC REQUEST: "${specificRequest}"\nGive EXTRA detailed focus on this aspect in your analysis.`
          : '';

        const comparisonContext = compareMode && videos.length > 1
          ? `\n\n📊 COMPARISON MODE: This is video ${index + 1} of ${videos.length}. Analyze this video but keep comparison points in mind for later synthesis.`
          : '';

        const prompt = `You are an elite cricket coach analyzing technique with 30+ years of international experience.

${comparisonContext}${specificAnalysis}

**COMPREHENSIVE VIDEO ANALYSIS:**

Identify the cricket action type first (batting/bowling/fielding/wicketkeeping).

Then provide MASTER-LEVEL analysis:

═══════════════════════════════════════
📹 FRAME-BY-FRAME BREAKDOWN
═══════════════════════════════════════

**SETUP PHASE:**
- Stance width, balance, weight distribution
- Grip details and positioning
- Head position and eye line
- Initial body positioning

**LOADING/TRIGGER PHASE:**
- Movement quality and timing
- Weight transfer mechanics
- Body coil and loading
- Head stability

**EXECUTION PHASE:**
- Bat/arm path geometry
- Contact point positioning
- Head position at impact (CRITICAL)
- Hip and shoulder rotation
- Foot movement patterns
- Balance maintenance

**FOLLOW-THROUGH:**
- Finish position quality
- Body balance and control
- Overall technique shape

═══════════════════════════════════════
🔴 CRITICAL ERRORS (Must Fix NOW)
═══════════════════════════════════════

List 3-5 errors with severity rating (1-10):
- Error name + Severity rating
- Root cause (biomechanical)
- Consequences in matches
- Specific fix with drill suggestion

═══════════════════════════════════════
✅ TECHNICAL STRENGTHS
═══════════════════════════════════════

3-4 things done RIGHT:
- What they're doing well
- Why it's beneficial
- How to maintain/enhance

═══════════════════════════════════════
📊 FORM CONSISTENCY SCORE: X/100
═══════════════════════════════════════

Rate consistency across:
- Setup consistency: X/10
- Timing consistency: X/10
- Balance consistency: X/10
- Technique repeatability: X/10

Overall Form Consistency: X/100 (sum ÷ 4 × 2.5)

Explanation: [Why this score? What causes inconsistency?]

═══════════════════════════════════════
🎯 IMMEDIATE ACTION PLAN
═══════════════════════════════════════

Priority 1: [Specific fix]
- Drill: [Name + 3 steps]
- Practice duration: [X minutes/day]

Priority 2: [Specific fix]
- Drill: [Name + 3 steps]
- Practice duration: [X minutes/day]

Priority 3: [Specific fix]
- Drill: [Name + 3 steps]
- Practice duration: [X minutes/day]

═══════════════════════════════════════
⚠️ INJURY RISK ASSESSMENT
═══════════════════════════════════════

- Movement patterns causing injury risk?
- Joint stress concerns?
- Overuse patterns?
- Recommendations?

═══════════════════════════════════════
💪 MOTIVATIONAL MESSAGE
═══════════════════════════════════════

[Personal, specific, encouraging message referencing their exact strengths and potential]

**Be brutally honest but supportive. This player wants serious improvement.**`;

        const response = await base44.integrations.Core.InvokeLLM({
          prompt,
          file_urls: [video.url],
          response_json_schema: {
            type: "object",
            properties: {
              action_type: { type: "string" },
              overall_assessment: { type: "string" },
              setup_phase: { type: "string" },
              execution_phase: { type: "string" },
              follow_through: { type: "string" },
              critical_errors: { 
                type: "array", 
                items: { 
                  type: "object",
                  properties: {
                    error: { type: "string" },
                    severity: { type: "number" },
                    cause: { type: "string" },
                    consequence: { type: "string" },
                    fix: { type: "string" }
                  }
                }
              },
              strengths: { type: "array", items: { type: "string" } },
              form_consistency_score: { type: "number" },
              consistency_breakdown: {
                type: "object",
                properties: {
                  setup: { type: "number" },
                  timing: { type: "number" },
                  balance: { type: "number" },
                  repeatability: { type: "number" }
                }
              },
              consistency_explanation: { type: "string" },
              action_plan: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    priority: { type: "number" },
                    fix: { type: "string" },
                    drill: { type: "string" },
                    duration: { type: "string" }
                  }
                }
              },
              injury_risk: { type: "string" },
              encouragement: { type: "string" }
            }
          }
        });

        return { video, analysis: response };
      });

      const results = await Promise.all(analysisPromises);
      setAnalyses(results);

      // If comparison mode and multiple videos, generate comparison
      if (compareMode && videos.length > 1) {
        generateComparison(results);
      }
    } catch (err) {
      setError('Failed to analyze videos. Please try again.');
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const generateComparison = async (results) => {
    try {
      const comparisonPrompt = `Compare these ${results.length} cricket technique videos:

${results.map((r, i) => `
Video ${i + 1} (${r.video.name}):
- Action: ${r.analysis.action_type}
- Form Consistency: ${r.analysis.form_consistency_score}/100
- Key Issues: ${r.analysis.critical_errors.map(e => e.error).join(', ')}
- Strengths: ${r.analysis.strengths.join(', ')}
`).join('\n')}

Provide:
1. **Progress Analysis**: Which video shows better technique and why?
2. **Key Improvements**: What improved between videos?
3. **Remaining Issues**: What still needs work?
4. **Comparison Score**: Rate improvement from Video 1 to last video (0-100)
5. **Next Steps**: What should they focus on next?

Keep it concise and actionable.`;

      const comparison = await base44.integrations.Core.InvokeLLM({ prompt: comparisonPrompt });
      
      setAnalyses(prev => [...prev, { 
        isComparison: true, 
        comparison 
      }]);
    } catch (err) {
      console.error('Comparison failed:', err);
    }
  };

  const addAnnotation = (videoIndex, note) => {
    setAnnotations(prev => ({
      ...prev,
      [videoIndex]: [...(prev[videoIndex] || []), note]
    }));
    toast.success('Note added!');
  };

  const removeVideo = (index) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
    setAnalyses(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pb-24">
      <Header title="AI Video Analysis" showSettings={false} />

      <div className="px-6 py-4 max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl p-6 text-white mb-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Pro Video Analysis</h2>
              <p className="text-rose-100 text-sm">Upload, compare, annotate & get elite feedback</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <GitCompare className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs">Compare Videos</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <MessageCircle className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs">Add Notes</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <Sparkles className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs">Form Score</p>
            </div>
          </div>
        </motion.div>

        {/* Comparison Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex items-center justify-between"
        >
          <div>
            <h3 className="font-bold text-slate-800">Comparison Mode</h3>
            <p className="text-sm text-slate-600">Upload multiple videos to compare progress</p>
          </div>
          <Button
            onClick={() => setCompareMode(!compareMode)}
            variant={compareMode ? "default" : "outline"}
            className={compareMode ? "bg-rose-500" : ""}
          >
            {compareMode ? 'ON' : 'OFF'}
          </Button>
        </motion.div>

        {/* Specific Analysis Request */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-4 mb-6"
        >
          <h3 className="font-bold text-slate-800 mb-2">Request Specific Analysis</h3>
          <Input
            placeholder="e.g., 'Focus only on my front foot placement for drives'"
            value={specificRequest}
            onChange={(e) => setSpecificRequest(e.target.value)}
            className="mb-2"
          />
          <p className="text-xs text-slate-500">Leave blank for general analysis</p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-6"
        >
          <label className="cursor-pointer">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading || analyzing}
              multiple={compareMode}
            />
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-rose-400 hover:bg-rose-50/50 transition-all">
              {uploading ? (
                <div>
                  <Loader2 className="w-12 h-12 text-rose-500 mx-auto mb-4 animate-spin" />
                  <p className="font-semibold text-slate-700">Uploading...</p>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="font-semibold text-slate-700 mb-2">
                    Upload {compareMode ? 'Videos' : 'Video'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {compareMode ? 'Select multiple videos to compare' : 'Click to select video'}
                  </p>
                </div>
              )}
            </div>
          </label>
        </motion.div>

        {/* Uploaded Videos */}
        {videos.length > 0 && (
          <div className="space-y-4 mb-6">
            <h3 className="font-bold text-slate-800">Uploaded Videos ({videos.length})</h3>
            {videos.map((video, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-rose-500" />
                    <span className="font-medium text-slate-800">{video.name}</span>
                  </div>
                  <Button
                    onClick={() => removeVideo(index)}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Annotations for this video */}
                <div className="space-y-2">
                  {annotations[index]?.map((note, noteIndex) => (
                    <div key={noteIndex} className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-sm text-amber-800">
                      💭 {note}
                    </div>
                  ))}
                  <Input
                    placeholder="Add a note or question about this video..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        addAnnotation(index, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Analyze Button */}
        {videos.length > 0 && analyses.length === 0 && (
          <Button
            onClick={analyzeVideos}
            disabled={analyzing}
            className="w-full h-14 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-lg mb-6"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing {videos.length} video(s)...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze Video{videos.length > 1 ? 's' : ''}
              </>
            )}
          </Button>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">Analysis Failed</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        <AnimatePresence>
          {analyses.map((result, index) => (
            result.isComparison ? (
              <motion.div
                key="comparison"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white mb-6"
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <GitCompare className="w-6 h-6" />
                  Video Comparison Analysis
                </h2>
                <div className="bg-white/10 rounded-2xl p-4 whitespace-pre-wrap">
                  {result.comparison}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 mb-8"
              >
                <div className="bg-white rounded-2xl shadow-lg p-4">
                  <h3 className="font-bold text-slate-800 mb-2">
                    📹 {result.video.name}
                  </h3>
                  <p className="text-sm text-slate-600 capitalize">Action Type: {result.analysis.action_type}</p>
                </div>

                {/* Form Consistency Score */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl p-6 text-white">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Form Consistency Score
                  </h3>
                  <div className="text-center mb-4">
                    <p className="text-6xl font-bold">{result.analysis.form_consistency_score}</p>
                    <p className="text-indigo-100">out of 100</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-xs text-indigo-100">Setup</p>
                      <p className="text-xl font-bold">{result.analysis.consistency_breakdown?.setup}/10</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-xs text-indigo-100">Timing</p>
                      <p className="text-xl font-bold">{result.analysis.consistency_breakdown?.timing}/10</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-xs text-indigo-100">Balance</p>
                      <p className="text-xl font-bold">{result.analysis.consistency_breakdown?.balance}/10</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-xs text-indigo-100">Repeatability</p>
                      <p className="text-xl font-bold">{result.analysis.consistency_breakdown?.repeatability}/10</p>
                    </div>
                  </div>
                  <p className="text-sm text-indigo-100">{result.analysis.consistency_explanation}</p>
                </div>

                {/* Overall Assessment */}
                <div className="bg-white rounded-3xl shadow-xl p-6">
                  <h3 className="font-bold text-lg text-slate-800 mb-3">📋 Overall Assessment</h3>
                  <p className="text-slate-700 leading-relaxed">{result.analysis.overall_assessment}</p>
                </div>

                {/* Critical Errors */}
                <div className="bg-white rounded-3xl shadow-xl p-6">
                  <h3 className="font-bold text-lg text-red-600 mb-4">🔴 Critical Errors</h3>
                  <div className="space-y-4">
                    {result.analysis.critical_errors?.map((error, i) => (
                      <div key={i} className="border-l-4 border-red-500 pl-4 py-2">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-slate-800">{error.error}</h4>
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">
                            Severity: {error.severity}/10
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-1"><strong>Cause:</strong> {error.cause}</p>
                        <p className="text-sm text-slate-600 mb-1"><strong>Consequence:</strong> {error.consequence}</p>
                        <p className="text-sm text-emerald-700"><strong>Fix:</strong> {error.fix}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                <div className="bg-white rounded-3xl shadow-xl p-6">
                  <h3 className="font-bold text-lg text-emerald-600 mb-4">💪 Your Strengths</h3>
                  <ul className="space-y-2">
                    {result.analysis.strengths?.map((strength, i) => (
                      <li key={i} className="flex gap-3 text-slate-700">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Plan */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-xl p-6 border-2 border-blue-200">
                  <h3 className="font-bold text-lg text-blue-700 mb-4">🎯 Your Action Plan</h3>
                  <div className="space-y-4">
                    {result.analysis.action_plan?.map((plan, i) => (
                      <div key={i} className="bg-white rounded-xl p-4">
                        <h4 className="font-bold text-purple-900 mb-2">
                          Priority {plan.priority}: {plan.fix}
                        </h4>
                        <p className="text-sm text-slate-700 mb-1"><strong>Drill:</strong> {plan.drill}</p>
                        <p className="text-sm text-slate-600"><strong>Practice:</strong> {plan.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Injury Risk */}
                {result.analysis.injury_risk && (
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
                    <h4 className="font-semibold text-amber-900 mb-2">⚠️ Injury Risk Assessment</h4>
                    <p className="text-sm text-amber-700">{result.analysis.injury_risk}</p>
                  </div>
                )}

                {/* Encouragement */}
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-6 text-white text-center">
                  <p className="text-lg font-medium italic">"{result.analysis.encouragement}"</p>
                  <p className="text-rose-100 text-sm mt-2">- Your AI Coach</p>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Re-analyze Button */}
        {analyses.length > 0 && (
          <Button
            onClick={() => {
              setAnalyses([]);
              setAnnotations({});
            }}
            variant="outline"
            className="w-full h-12"
          >
            Analyze Different Videos
          </Button>
        )}
      </div>
    </div>
  );
}