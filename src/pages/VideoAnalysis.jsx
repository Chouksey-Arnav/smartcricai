import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Video, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/common/Header';

export default function VideoAnalysis() {
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setAnalysis(null);

    try {
      // Upload video file
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      setUploading(false);
      setAnalyzing(true);

      // Analyze with AI
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this cricket practice video and provide detailed feedback for a young player (11-15 years old).

Focus on:
1. **Technique Analysis**: What's good and what needs improvement
2. **Body Position**: Stance, balance, head position, footwork
3. **Specific Tips**: 3-4 actionable improvements they can make
4. **What They're Doing Well**: Positive reinforcement (2-3 points)
5. **Practice Drills**: Suggest 2 specific drills to improve their weaknesses
6. **Safety Reminders**: Any safety concerns to address

Be encouraging, specific, and age-appropriate. Format as clear sections.`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            overall_assessment: { type: "string" },
            technique_rating: { type: "number" },
            strengths: { type: "array", items: { type: "string" } },
            areas_to_improve: { type: "array", items: { type: "string" } },
            specific_tips: { type: "array", items: { type: "string" } },
            recommended_drills: { 
              type: "array", 
              items: { 
                type: "object",
                properties: {
                  drill_name: { type: "string" },
                  why_it_helps: { type: "string" }
                }
              }
            },
            safety_notes: { type: "string" },
            encouragement: { type: "string" }
          }
        }
      });

      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze video. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pb-24">
      <Header title="Video Analysis" showSettings={false} />

      <div className="px-6 py-4 max-w-2xl mx-auto">
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
              <h2 className="font-bold text-lg">AI Video Coach</h2>
              <p className="text-rose-100 text-sm">Get personalized feedback</p>
            </div>
          </div>
          <p className="text-rose-100 text-sm">
            Upload your practice videos and get instant AI-powered analysis with tips to improve!
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-6"
        >
          <label className="cursor-pointer">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading || analyzing}
            />
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:border-rose-400 hover:bg-rose-50/50 transition-all">
              {uploading || analyzing ? (
                <div>
                  <Loader2 className="w-12 h-12 text-rose-500 mx-auto mb-4 animate-spin" />
                  <p className="font-semibold text-slate-700">
                    {uploading ? 'Uploading video...' : 'Analyzing your technique...'}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">This may take a minute</p>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="font-semibold text-slate-700 mb-2">Upload Practice Video</p>
                  <p className="text-sm text-slate-500">
                    Click to select or drag and drop
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Supports MP4, MOV, AVI (Max 100MB)
                  </p>
                </div>
              )}
            </div>
          </label>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">Analysis Failed</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Analysis Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Overall Assessment */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-6 text-white">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Overall Assessment
                </h3>
                <p className="text-emerald-50 leading-relaxed">{analysis.overall_assessment}</p>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-sm text-emerald-100 mb-2">Technique Rating</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white"
                        style={{ width: `${analysis.technique_rating * 10}%` }}
                      />
                    </div>
                    <span className="font-bold text-xl">{analysis.technique_rating}/10</span>
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="font-bold text-lg text-emerald-600 mb-4">💪 Your Strengths</h3>
                <ul className="space-y-3">
                  {analysis.strengths?.map((strength, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span className="text-slate-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas to Improve */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="font-bold text-lg text-orange-600 mb-4">🎯 Focus Areas</h3>
                <ul className="space-y-3">
                  {analysis.areas_to_improve?.map((area, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-orange-500 font-bold">→</span>
                      <span className="text-slate-700">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specific Tips */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-xl p-6 border-2 border-blue-200">
                <h3 className="font-bold text-lg text-blue-700 mb-4">💡 Actionable Tips</h3>
                <div className="space-y-3">
                  {analysis.specific_tips?.map((tip, i) => (
                    <div key={i} className="bg-white rounded-xl p-4">
                      <p className="text-slate-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Drills */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="font-bold text-lg text-purple-600 mb-4">🏋️ Practice These Drills</h3>
                <div className="space-y-3">
                  {analysis.recommended_drills?.map((drill, i) => (
                    <div key={i} className="p-4 bg-purple-50 rounded-xl">
                      <h4 className="font-semibold text-purple-900 mb-1">{drill.drill_name}</h4>
                      <p className="text-sm text-purple-700">{drill.why_it_helps}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety & Encouragement */}
              {analysis.safety_notes && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
                  <h4 className="font-semibold text-amber-900 mb-2">⚠️ Safety Note</h4>
                  <p className="text-sm text-amber-700">{analysis.safety_notes}</p>
                </div>
              )}

              <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-6 text-white text-center">
                <p className="text-lg font-medium italic">"{analysis.encouragement}"</p>
                <p className="text-rose-100 text-sm mt-2">- Your AI Coach</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}