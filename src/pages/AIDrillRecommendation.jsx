import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Brain, Target, TrendingUp, Loader2, Lock, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/common/Header';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import toast from 'react-hot-toast';

export default function AIDrillRecommendation() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const { data: subscription } = useQuery({
    queryKey: ['subscription', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const subs = await base44.entities.PremiumSubscription.filter({ user_email: guestEmail });
      return subs[0] || null;
    },
  });

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const progress = await base44.entities.UserProgress.filter({ user_email: guestEmail });
      return progress[0] || null;
    },
  });

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      const profiles = await base44.entities.UserProfile.filter({ user_email: guestEmail });
      return profiles[0] || null;
    },
  });

  const { data: matches } = useQuery({
    queryKey: ['matches', user?.email || 'guest'],
    queryFn: async () => {
      const guestEmail = user?.email || 'guest@smartcrick.app';
      return await base44.entities.Match.filter({ user_email: guestEmail });
    },
    initialData: [],
  });

  const isPremium = subscription?.is_premium && new Date(subscription.subscription_end) > new Date();

  const generateRecommendations = async () => {
    if (!isPremium) {
      toast.error('Premium feature! Upgrade to unlock AI recommendations');
      return;
    }

    setIsGenerating(true);

    try {
      const recentMatches = matches.slice(-5);
      const matchContext = recentMatches.length > 0 ? 
        `Recent match performance:\n${recentMatches.map(m => 
          `- ${m.match_type}: ${m.result}, Batting: ${m.batting_stats?.runs || 0} runs, Bowling: ${m.bowling_stats?.wickets || 0} wickets`
        ).join('\n')}` : 'No recent match data';

      const prompt = `Analyze this cricket player and recommend 3 personalized training drills.

Player Profile:
- Skill Level: ${userProgress?.skill_level || 'beginner'}
- Cricket Role: ${userProfile?.cricket_role || 'all_rounder'}
- Experience: ${userProfile?.experience_years || 0} years
- Weak Areas: ${userProfile?.weak_areas?.join(', ') || 'Not specified'}
- Training Frequency: ${userProfile?.training_frequency || 'unknown'}
- Main Goals: ${userProfile?.main_goals?.join(', ') || 'general improvement'}
- Completed Drills: ${userProgress?.completed_drills?.length || 0}
- Total Practice Time: ${userProgress?.total_practice_minutes || 0} minutes
- Current Streak: ${userProgress?.current_streak || 0} days

${matchContext}

Based on this analysis, recommend 3 specific drills that will have the BIGGEST IMPACT on their game right now. 

For each drill, provide:
1. drill_name: Specific drill name
2. category: batting, bowling, fielding, or fitness
3. reason: Why THIS drill for THIS player (be specific to their weak areas and goals)
4. expected_improvement: What they'll gain
5. duration: Recommended duration in minutes
6. difficulty_adjustment: How to adjust based on their fitness/skill level

Return JSON format:
{
  "recommendations": [
    {
      "drill_name": "string",
      "category": "string",
      "reason": "string",
      "expected_improvement": "string",
      "duration": number,
      "difficulty_adjustment": "string"
    }
  ],
  "overall_focus": "One sentence on what they should prioritize this week"
}`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            recommendations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  drill_name: { type: 'string' },
                  category: { type: 'string' },
                  reason: { type: 'string' },
                  expected_improvement: { type: 'string' },
                  duration: { type: 'number' },
                  difficulty_adjustment: { type: 'string' }
                }
              }
            },
            overall_focus: { type: 'string' }
          }
        }
      });

      setRecommendations(response);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Failed to generate recommendations');
    } finally {
      setIsGenerating(false);
    }
  };

  const categoryColors = {
    batting: 'from-blue-500 to-purple-500',
    bowling: 'from-emerald-500 to-teal-500',
    fielding: 'from-orange-500 to-red-500',
    fitness: 'from-pink-500 to-rose-500',
  };

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
        <Header title="AI Drill Recommendations" />
        
        <div className="px-6 py-6 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 text-white text-center relative overflow-hidden"
          >
            <Lock className="w-20 h-20 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl font-bold mb-3">Premium Feature</h2>
            <p className="text-amber-100 mb-6">
              Unlock AI-powered drill recommendations personalized to your performance, weak areas, and fitness level!
            </p>
            <Link to={createPageUrl('Premium')}>
              <Button className="bg-white text-amber-600 hover:bg-amber-50 font-bold">
                <Crown className="w-5 h-5 mr-2" />
                Upgrade to Premium
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 bg-white rounded-3xl shadow-xl p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4">What You'll Get:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-slate-700">Personalized drills based on your actual performance data</p>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-slate-700">Focus on your specific weak areas for maximum improvement</p>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-slate-700">Dynamic difficulty adjustment based on your fitness level</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-blue-50 to-white pb-24">
      <Header title="AI Drill Recommendations" />

      <div className="px-6 py-6 max-w-2xl mx-auto space-y-6">
        {!recommendations ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl p-6 text-white"
            >
              <Brain className="w-16 h-16 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-center mb-2">AI-Powered Recommendations</h2>
              <p className="text-purple-100 text-center">
                Get personalized drill suggestions based on your performance, weak areas, and fitness level
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl p-6"
            >
              <h3 className="text-lg font-bold text-slate-800 mb-4">Analysis Includes:</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-700">Your completed drills and progress</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span className="text-slate-700">Profile goals and weak areas</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700">Recent match performance</span>
                </div>
              </div>

              <Button
                onClick={generateRecommendations}
                disabled={isGenerating}
                className="w-full h-14 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-lg font-bold"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Your Performance...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate My Recommendations
                  </>
                )}
              </Button>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-xl p-6"
            >
              <div className="text-center mb-6">
                <Brain className="w-16 h-16 text-purple-500 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Your Personalized Plan</h3>
                <p className="text-slate-600">{recommendations.overall_focus}</p>
              </div>

              <div className="space-y-4">
                {recommendations.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-r ${categoryColors[rec.category] || 'from-slate-500 to-slate-600'} rounded-2xl p-6 text-white`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{rec.drill_name}</h4>
                        <p className="text-sm opacity-90 capitalize">{rec.category} • {rec.duration} min</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-xl p-3">
                        <p className="text-sm font-semibold mb-1">Why This Drill:</p>
                        <p className="text-sm opacity-90">{rec.reason}</p>
                      </div>

                      <div className="bg-white/10 rounded-xl p-3">
                        <p className="text-sm font-semibold mb-1">Expected Improvement:</p>
                        <p className="text-sm opacity-90">{rec.expected_improvement}</p>
                      </div>

                      <div className="bg-white/10 rounded-xl p-3">
                        <p className="text-sm font-semibold mb-1">Difficulty Adjustment:</p>
                        <p className="text-sm opacity-90">{rec.difficulty_adjustment}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={() => setRecommendations(null)}
                variant="outline"
                className="w-full mt-6"
              >
                Generate New Recommendations
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}