import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Lock, Crown, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/common/Header';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function HeadCoach() {
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

  // Check if user has yearly or lifetime plan
  const premiumData = typeof window !== 'undefined' ? localStorage.getItem('smartcrick_premium') : null;
  let hasAccess = false;
  
  if (premiumData) {
    try {
      const data = JSON.parse(premiumData);
      hasAccess = data.plan === 'yearly' || data.plan === 'lifetime';
    } catch (e) {}
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-white dark:bg-white pb-24">
        <Header title="SmartCrick Head Coach" showSettings={false} />
        
        <div className="px-6 py-4 max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 text-white text-center"
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Premium Members Only</h2>
            <p className="text-amber-100 mb-2 font-semibold">Yearly & Lifetime Plans</p>
            <p className="text-amber-100 mb-6 leading-relaxed text-sm">
              The SmartCrick AI Head Coach is your elite training companion - available to Yearly and Lifetime members. 
              Get advanced workout plans, match prep strategies, and recovery guidance!
            </p>
            <Link to={createPageUrl('Premium')}>
              <Button className="bg-white text-amber-600 hover:bg-amber-50 font-bold h-12 px-8">
                <Crown className="w-5 h-5 mr-2" />
                Unlock Head Coach
              </Button>
            </Link>
          </motion.div>

          {/* Why Head Coach */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 mt-6"
          >
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              What Head Coach Offers
            </h3>
            <div className="space-y-3">
              {[
                'Position-specific training programs',
                'Match-day preparation protocols',
                'Advanced recovery and injury prevention',
                'Tactical session design',
                'Weekly training plan architecture',
                'Real-time workout adjustments'
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                    <Target className="w-4 h-4 text-amber-600" />
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
    <div className="min-h-screen bg-white dark:bg-white pb-24">
      <Header title="SmartCrick Head Coach" showSettings={false} />
      
      <div className="px-6 py-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 text-white mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-8 h-8" />
            <h2 className="font-bold text-xl">Your Elite Training Companion</h2>
          </div>
          <p className="text-amber-100 text-sm">
            Advanced AI coaching for workouts, match prep, recovery, and tactical training
          </p>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
          <iframe 
            src="https://app.relevanceai.com/agents/bcbe5a/e5e3eeef-250d-4d16-8d49-ebcf5906ce75/c19336b8-997f-4471-a7ab-2bde4da12001/embed-chat?starting_message_prompts=Build+me+a+workout+for+explosive+batting+power&starting_message_prompts=Give+me+a+fast+bowler+strength+session+for+today&starting_message_prompts=Create+a+30-minute+bodyweight+workout+for+cricket&starting_message_prompts=I+want+to+improve+my+stamina+for+long+innings&starting_message_prompts=Make+me+a+leg+workout+that+helps+my+bowling+speed&starting_message_prompts=Design+a+full+weekly+training+plan+for+a+cricketer&starting_message_prompts=I%E2%80%99m+a+spin+bowler+%E2%80%94+what+should+I+train&starting_message_prompts=I%E2%80%99m+a+wicketkeeper+%E2%80%94+build+my+agility+workout&starting_message_prompts=I%E2%80%99m+an+opener+%E2%80%94+help+me+train+endurance+and+focus&starting_message_prompts=I%E2%80%99m+an+all-rounder+%E2%80%94+give+me+a+balanced+session&starting_message_prompts=I+feel+sore+after+a+match.+Give+me+recovery+training&starting_message_prompts=Help+me+prevent+injuries+as+a+fast+bowler&starting_message_prompts=Give+me+a+mobility+routine+for+shoulders+and+hips&starting_message_prompts=I+need+a+light+session+for+an+off-day&starting_message_prompts=Give+me+a+match-day+warm-up+routine&starting_message_prompts=What+should+I+do+the+day+before+a+game&starting_message_prompts=Build+a+quick+pre-batting+power+activation&starting_message_prompts=Help+me+recover+mentally+after+getting+out&starting_message_prompts=That+workout+felt+too+easy-adjust+it&starting_message_prompts=That+session+was+too+hard-scale+it+down&starting_message_prompts=No+equipment+today.+Give+me+a+home+sessi&starting_message_prompts=Build+me+an+academy-level+training+program&hide_tool_steps=true&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Ask+HeadCoach+for+a+workout%2C+match+prep%2C+or+recovery+plan%E2%80%A6&hide_logo=false&hide_description=false" 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            allow="microphone"
            title="SmartCrick AI Head Coach"
          />
        </div>
      </div>
    </div>
  );
}