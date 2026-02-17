import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Lock, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/common/Header';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function NinetyDayChallenge() {
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

  // Check if user has lifetime plan
  const premiumData = typeof window !== 'undefined' ? localStorage.getItem('smartcrick_premium') : null;
  let hasLifetimePlan = false;
  
  if (premiumData) {
    try {
      const data = JSON.parse(premiumData);
      hasLifetimePlan = data.plan === 'lifetime';
    } catch (e) {}
  }

  if (!hasLifetimePlan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-24">
        <Header title="90-Day Challenge Architect" showSettings={false} />
        
        <div className="px-6 py-4 max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-8 text-white text-center"
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Lifetime Members Only</h2>
            <p className="text-purple-100 mb-6 leading-relaxed">
              The SmartCrick AI 90-Day Challenge Architect is an exclusive feature for Lifetime plan members. 
              Get personalized 90-day training plans designed by AI!
            </p>
            <Link to={createPageUrl('Premium')}>
              <Button className="bg-white text-purple-600 hover:bg-purple-50 font-bold h-12 px-8">
                <Sparkles className="w-5 h-5 mr-2" />
                Upgrade to Lifetime
              </Button>
            </Link>
          </motion.div>

          {/* Why Lifetime */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 mt-6"
          >
            <h3 className="font-bold text-slate-800 mb-4">Why Upgrade to Lifetime?</h3>
            <div className="space-y-3">
              {[
                'AI-powered 90-day training blueprints',
                'Unlimited advanced workouts',
                'Pro-level mental coaching',
                'Priority support',
                'All future premium features included'
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-24">
      <Header title="90-Day Challenge Architect" showSettings={false} />
      
      <div className="px-6 py-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl p-6 text-white mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8" />
            <h2 className="font-bold text-xl">AI 90-Day Challenge Architect</h2>
          </div>
          <p className="text-purple-100 text-sm">
            Your personalized 90-day training blueprint powered by advanced AI
          </p>
        </motion.div>

        {/* AI Agent Embed */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
          <iframe 
            src="https://app.relevanceai.com/agents/bcbe5a/e5e3eeef-250d-4d16-8d49-ebcf5906ce75/366636d2-101a-46ed-ac68-c6ec3b4b1daa/embed-chat?hide_tool_steps=true&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Type+your+message...&hide_logo=false&hide_description=false" 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            allow="microphone"
            title="90-Day Challenge Architect"
          />
        </div>
      </div>
    </div>
  );
}