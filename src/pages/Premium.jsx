import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Target, Brain, TrendingUp, Check, Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/common/Header';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';

export default function Premium() {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: subscription } = useQuery({
    queryKey: ['subscription', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const subs = await base44.entities.PremiumSubscription.filter({ user_email: user.email });
      return subs[0] || null;
    },
    enabled: !!user?.email,
  });

  const isPremium = subscription?.is_premium && new Date(subscription.subscription_end) > new Date();

  const premiumFeatures = [
    { icon: Brain, title: 'AI Drill Recommendations', description: 'Get personalized drill suggestions based on your performance and goals' },
    { icon: Target, title: 'Advanced Analytics', description: 'Deep insights into your training patterns, progress, and areas for improvement' },
    { icon: Sparkles, title: 'Unlimited AI Coaching', description: 'No limits on AI coach interactions - chat as much as you need' },
    { icon: TrendingUp, title: 'Custom Training Plans', description: 'AI-generated personalized weekly training schedules' },
    { icon: Zap, title: 'Priority Support', description: 'Get help faster with premium support and exclusive features' },
    { icon: Brain, title: 'Exclusive Mental Training', description: 'Access to advanced mental routines and visualization techniques' },
    { icon: Target, title: 'Performance Tracking', description: 'Track your stats, compare with past performances, and see your growth' },
  ];

  const handleUpgrade = async (planType) => {
    setIsProcessing(true);
    try {
      // In a real implementation, you would:
      // 1. Create a Stripe checkout session via backend
      // 2. Redirect to Stripe checkout
      // 3. Handle webhook for successful payment
      
      // For now, we'll simulate the upgrade
      toast.success('Redirecting to payment...');
      
      // Simulate payment processing
      setTimeout(() => {
        toast.success('Premium activated! Welcome aboard! 🎉');
        queryClient.invalidateQueries({ queryKey: ['subscription'] });
        setIsProcessing(false);
      }, 2000);
      
    } catch (error) {
      console.error('Upgrade error:', error);
      toast.error('Failed to process upgrade');
      setIsProcessing(false);
    }
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
              <p className="text-slate-600">
                Subscription active until {new Date(subscription.subscription_end).toLocaleDateString()}
              </p>
            </div>
            
            <div className="bg-amber-50 rounded-2xl p-4 text-center">
              <p className="text-slate-700">Enjoying premium? Keep up the great work! 💪</p>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-4">Premium Features:</h3>
              {premiumFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="bg-white rounded-2xl p-4 shadow-md flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">{feature.title}</h4>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </div>
                  <Check className="w-6 h-6 text-emerald-500 shrink-0 ml-auto" />
                </motion.div>
              ))}
            </motion.div>

            {/* Pricing Plans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-4">Choose Your Plan:</h3>
              
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
                <div className="text-center py-2 text-sm text-slate-600">
                  Limited AI coaching • Basic drills • Community features
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
                <Button
                  onClick={() => handleUpgrade('monthly')}
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
                <div className="absolute top-3 right-3 bg-white text-amber-600 px-3 py-1 rounded-full text-xs font-bold">
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
                <Button
                  onClick={() => handleUpgrade('yearly')}
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
                <Button
                  onClick={() => handleUpgrade('lifetime')}
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
                <div className="mt-3 text-center text-xs text-purple-100">
                  🔥 Pay once, train forever • No recurring fees
                </div>
              </div>
            </motion.div>

            {/* Money Back Guarantee */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
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