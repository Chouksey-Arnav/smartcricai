import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Frown, Meh, Smile, Sparkles, Send, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/common/Header';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import toast from 'react-hot-toast';

const confidenceLevels = [
  { 
    value: 'not_great', 
    label: 'Not Great', 
    emoji: '😔',
    icon: Frown,
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500'
  },
  { 
    value: 'okay', 
    label: 'Okay', 
    emoji: '😐',
    icon: Meh,
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-500'
  },
  { 
    value: 'feeling_good', 
    label: 'Feeling Good', 
    emoji: '😊',
    icon: Smile,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-500'
  },
];

export default function ConfidenceCheckIn() {
  const navigate = useNavigate();
  const [selectedConfidence, setSelectedConfidence] = useState(null);
  const [reason, setReason] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const profiles = await base44.entities.UserProfile.filter({ user_email: user.email });
      return profiles[0] || null;
    },
    enabled: !!user?.email,
  });

  const handleConfidenceSelect = (level) => {
    setSelectedConfidence(level);
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error('Please share why you\'re feeling this way');
      return;
    }

    setIsLoading(true);

    try {
      const contextInfo = userProfile ? `
User background:
- Cricket role: ${userProfile.cricket_role}
- Experience: ${userProfile.experience_years} years
- Main goals: ${userProfile.main_goals?.join(', ')}
- Weak areas: ${userProfile.weak_areas?.join(', ')}
- Biggest challenge: ${userProfile.biggest_challenge}
` : '';

      const prompt = `You are an empathetic cricket coach and mental performance expert. A young cricket player (11-17 years old) has just checked in about their confidence level.

${contextInfo}

Current mood: ${selectedConfidence.label}
Their response: "${reason}"

Provide supportive, actionable advice in the following JSON format:
{
  "empathy_statement": "Short empathetic acknowledgment (1-2 sentences)",
  "situation_analysis": "Brief analysis of what they might be experiencing (2-3 sentences)",
  "action_steps": ["Step 1", "Step 2", "Step 3"],
  "encouragement": "Motivational closing statement (1-2 sentences)",
  "recommended_drill": "Specific drill/activity name that could help right now"
}

Requirements:
- Be warm, understanding, and age-appropriate
- Give concrete, actionable steps
- Reference cricket-specific scenarios when relevant
- Keep language simple and encouraging
- Focus on building confidence and mental strength

Return ONLY valid JSON.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            empathy_statement: { type: 'string' },
            situation_analysis: { type: 'string' },
            action_steps: { type: 'array', items: { type: 'string' } },
            encouragement: { type: 'string' },
            recommended_drill: { type: 'string' }
          }
        }
      });

      setAiResponse(response);
      setStep(3);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDone = () => {
    toast.success('Thanks for checking in! 💙');
    navigate(createPageUrl('Home'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24">
      <Header title="Confidence Check-In" showBack={true} onBack={() => navigate(-1)} />

      <div className="px-6 py-6 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Confidence */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white text-center"
              >
                <Heart className="w-16 h-16 mx-auto mb-3" />
                <h2 className="text-2xl font-bold mb-2">How are you feeling today?</h2>
                <p className="text-purple-100">Let's check in on your confidence</p>
              </motion.div>

              <div className="space-y-3">
                {confidenceLevels.map((level, index) => (
                  <motion.button
                    key={level.value}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleConfidenceSelect(level)}
                    className={`w-full bg-white rounded-2xl shadow-lg p-6 hover:scale-105 transition-all border-2 border-transparent hover:${level.borderColor}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${level.color} rounded-2xl flex items-center justify-center text-3xl`}>
                        {level.emoji}
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-bold text-slate-800 text-xl">{level.label}</h3>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Ask Why */}
          {step === 2 && selectedConfidence && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className={`bg-gradient-to-r ${selectedConfidence.color} rounded-3xl p-6 text-white text-center`}>
                <div className="text-5xl mb-3">{selectedConfidence.emoji}</div>
                <h2 className="text-xl font-bold mb-2">You're feeling {selectedConfidence.label.toLowerCase()}</h2>
                <p className="text-white/80">Tell us what's on your mind</p>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  What's making you feel this way?
                </label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Share what's going on... (e.g., nervous about upcoming match, struggling with a specific skill, feeling unmotivated...)"
                  className="h-32 text-base mb-4"
                  autoFocus
                />

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !reason.trim()}
                    className={`flex-1 bg-gradient-to-r ${selectedConfidence.color} hover:opacity-90`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Getting Help...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Get Advice
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: AI Response */}
          {step === 3 && aiResponse && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl p-6 text-white text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-3" />
                <h2 className="text-xl font-bold">Here's What I Think</h2>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-6 space-y-5">
                {/* Empathy */}
                <div className="bg-blue-50 rounded-2xl p-4">
                  <p className="text-slate-800 leading-relaxed">{aiResponse.empathy_statement}</p>
                </div>

                {/* Analysis */}
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">📊 What's Happening:</h4>
                  <p className="text-slate-700 leading-relaxed">{aiResponse.situation_analysis}</p>
                </div>

                {/* Action Steps */}
                <div>
                  <h4 className="font-bold text-slate-800 mb-3">💪 Here's What You Can Do:</h4>
                  <div className="space-y-3">
                    {aiResponse.action_steps.map((step, i) => (
                      <div key={i} className="flex gap-3 bg-purple-50 rounded-xl p-4">
                        <div className="w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold shrink-0 text-sm">
                          {i + 1}
                        </div>
                        <p className="text-slate-800 leading-relaxed flex-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Encouragement */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 text-white">
                  <p className="leading-relaxed">{aiResponse.encouragement}</p>
                </div>

                {/* Recommended Drill */}
                {aiResponse.recommended_drill && (
                  <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200">
                    <h4 className="font-bold text-amber-800 mb-2">🎯 Recommended Activity:</h4>
                    <p className="text-slate-700">{aiResponse.recommended_drill}</p>
                  </div>
                )}
              </div>

              <Button
                onClick={handleDone}
                className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg font-bold"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}