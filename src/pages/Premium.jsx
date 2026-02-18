import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Target, Brain, TrendingUp, Check, Loader2, Zap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/common/Header';
import toast from 'react-hot-toast';

export default function Premium() {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

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

  // Check localStorage for premium status
  const premiumData = typeof window !== 'undefined' ? localStorage.getItem('smartcrick_premium') : null;
  let isPremium = false;
  let currentPlan = null;
  
  if (premiumData) {
    try {
      const data = JSON.parse(premiumData);
      currentPlan = data.plan;
      isPremium = !!data.plan;
    } catch (e) {}
  }

  const planFeatures = {
    free: [
      '30-Day Challenge',
      'Smart Start',
      'Unlimited AI Coach',
      'Foundation & Skill & Performance Paths',
      'YouTube Drill Finder',
      'Basic Drill Library',
      'Custom Drill Workout Creator',
      'Workout Builder',
      'AI Workout (saves workouts)',
      'Fitness Builder',
      'Mental Creator',
      'Basic Mental Training',
      'All Quizzes',
      'Match Tracking & Performance Logging',
      'Unlimited Basic Mini Match Scenarios',
      'Scheduling & Task Management',
      'Why Did I Get Out? Database',
      'Live Progress Tracking'
    ],
    monthly: [
      'Everything in Free',
      'Elite Builder Skill Path (4th path unlocked)',
      'Advanced Drill Library (all drills)',
      'Advanced Mental Training (all routines)',
      'Pro & Challenging Mini Match Scenarios'
    ],
    yearly: [
      'Everything in Monthly',
      'SmartCrick Head Coach (Exclusive)'
    ],
    lifetime: [
      'Everything in Yearly',
      '90-Day Challenge Architect',
      'All Future Updates',
      'Never Pay Again'
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-white pb-24">
      <Header title="Premium" />

      <div className="px-6 py-6 max-w-2xl mx-auto space-y-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 rounded-3xl p-8 text-white text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
          
          <Crown className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Go Premium</h1>
          <p className="text-amber-100">Unlock your full potential with AI-powered training</p>
        </motion.div>

        {isPremium ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl p-6 border-4 border-amber-400"
          >
            <div className="text-center mb-6">
              <Crown className="w-16 h-16 text-amber-500 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-slate-800 mb-2">You're Premium! 🎉</h3>
              <p className="text-slate-600 capitalize">
                {currentPlan} Plan Active
              </p>
            </div>
            
            <div className="bg-amber-50 rounded-2xl p-4 text-center">
              <p className="text-slate-700">Enjoying premium? Keep up the great work! 💪</p>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Pricing Plans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              {/* Free Plan */}
              <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-slate-800">Free Plan</h4>
                    <p className="text-slate-600 text-sm">Basic features</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-slate-800">$0.00</div>
                    <div className="text-sm text-slate-500">forever</div>
                  </div>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {planFeatures.free.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Plan */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-amber-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-slate-800">Monthly Plan</h4>
                    <p className="text-slate-600 text-sm">Cancel anytime</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-slate-800">$1.99</div>
                    <div className="text-sm text-slate-500">per month</div>
                  </div>
                </div>
                <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                  {planFeatures.monthly.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  disabled={isProcessing}
                  className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crown className="w-5 h-5 mr-2" />
                      Upgrade to Monthly
                    </>
                  )}
                </Button>
              </div>

              {/* Yearly Plan */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-xl p-6 border-4 border-amber-400 relative">
                <div className="absolute top-3 right-3 bg-white text-amber-600 px-3 py-1 rounded-full text-xs font-bold z-10">
                  BEST VALUE
                </div>
                <div className="flex items-center justify-between mb-4 text-white">
                  <div>
                    <h4 className="text-xl font-bold">Yearly Plan</h4>
                    <p className="text-amber-100 text-sm">Save over 60%</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">$7.99</div>
                    <div className="text-sm text-amber-100">per year</div>
                  </div>
                </div>
                <div className="space-y-2 mb-4 max-h-24 overflow-y-auto">
                  {planFeatures.yearly.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-white">
                      <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  disabled={isProcessing}
                  className="w-full h-12 bg-white text-amber-600 hover:bg-amber-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crown className="w-5 h-5 mr-2" />
                      Upgrade to Yearly
                    </>
                  )}
                </Button>
              </div>

              {/* Lifetime Plan */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-6 border-4 border-purple-400 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="absolute top-3 right-3 bg-white text-purple-600 px-3 py-1 rounded-full text-xs font-bold z-10">
                  MOST POPULAR
                </div>
                <div className="flex items-center justify-between mb-4 text-white relative z-10">
                  <div>
                    <h4 className="text-xl font-bold flex items-center gap-2">
                      Lifetime Plan
                      <Sparkles className="w-5 h-5" />
                    </h4>
                    <p className="text-purple-100 text-sm">One-time payment • Unlimited access</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">$20.99</div>
                    <div className="text-sm text-purple-100">forever</div>
                  </div>
                </div>
                <div className="space-y-2 mb-4 max-h-24 overflow-y-auto">
                  {planFeatures.lifetime.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-white">
                      <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  disabled={isProcessing}
                  className="w-full h-12 bg-white text-purple-600 hover:bg-purple-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Get Lifetime Access
                    </>
                  )}
                </Button>
                <div className="mt-3 text-center text-xs text-purple-100 relative z-10">
                  🔥 Pay once, train forever • No recurring fees
                </div>
              </div>
            </motion.div>

            {/* Money Back Guarantee */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-emerald-50 rounded-2xl p-4 text-center"
            >
              <p className="text-sm text-emerald-800 font-medium">
                ✨ 7-Day Money-Back Guarantee • Cancel Anytime • Secure Payment
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}