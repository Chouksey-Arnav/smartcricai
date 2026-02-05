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
import { useQueryClient } from '@tanstack/react-query';

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

const prewrittenResponses = {
  not_great: {
    empathy_statement: "I understand that you're feeling down about your confidence, and that's completely okay. It's normal for every player to go through tough times, especially in a sport as demanding as cricket.",
    situation_analysis: "It sounds like you're struggling with consistency in your batting, which can impact your overall confidence. Since you've been playing for 7 years, you have the skills, but perhaps the strategy side is where you're feeling a bit lost right now.",
    action_steps: [
      "Reflect on your last few games and identify one positive moment where you felt good about your batting.",
      "Set a small goal for your next practice, like focusing solely on your footwork or shot selection during a specific drill.",
      "Remember to celebrate small victories, like hitting the ball with power or executing a good strategy in practice."
    ],
    encouragement: "Every great batsman has faced challenges, and this is just a part of your journey. Keep pushing forward, and believe in your abilities—you've got this!",
    recommended_drill: "Power Hitting Drill: Practice hitting with focus on technique using a batting tee or soft toss to build confidence in your power shots."
  },
  okay: {
    empathy_statement: "It's completely normal to feel uncertain about your confidence, especially as you work to improve your game. I'm here to help you find the right steps to boost your self-assurance.",
    situation_analysis: "You might be feeling a bit frustrated with your consistency and how it affects your overall performance. As a batsman, it can be tough when you want to hit the ball with power, but your strategy isn't quite there yet.",
    action_steps: [
      "Focus on one key area in your strategy each practice. For example, select a specific shot to master and assess when to use it in a game situation.",
      "After each practice session, reflect on what went well and what could improve - this helps build a clearer strategy over time.",
      "Try to set small, achievable goals for each game, like aiming to hit a certain number of boundaries or staying at the crease for a specific time."
    ],
    encouragement: "Remember that even professional players face challenges and have ups and downs in their confidence. Keep pushing forward, and you'll see improvement in no time!",
    recommended_drill: "A 'Shot Selection' drill where you practice hitting different types of balls in a controlled environment to develop your strategy and consistency."
  },
  feeling_good: {
    empathy_statement: "It's great to hear that you're feeling good! It's important to recognize how your confidence can fluctuate, and that you're willing to work on it.",
    situation_analysis: "As a batsman, you might be feeling excited about your game but also aware of the challenges with consistency and strategy. This is common for players at your level, especially as they develop their skills further.",
    action_steps: [
      "Set specific daily practice goals that focus on hitting drills to enhance your power.",
      "Analyze match scenarios, possibly through watching game footage, to improve your strategic thinking while batting.",
      "Practice mindfulness or visualization techniques before matches to help boost your focus and calmness during play."
    ],
    encouragement: "Remember, every player has ups and downs. Keep believing in yourself, and with practice, you'll see the progress you aspire to make!",
    recommended_drill: "Power Hitting Drill - Focus on hitting the ball for distance while maintaining proper technique."
  }
};

export default function ConfidenceCheckIn() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedConfidence, setSelectedConfidence] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const saveConfidenceMutation = useMutation({
    mutationFn: async (confidenceData) => {
      // Save confidence check-in to Schedule entity as an activity
      const today = new Date().toISOString().split('T')[0];
      const activity = await base44.entities.ScheduledActivity.create({
        user_email: user.email,
        title: confidenceData.title || 'Confidence Check-in',
        notes: `Feeling: ${confidenceData.level}`,
        date: today,
        activity_type: 'confidence_checkin'
      });

      // Create notification
      await base44.entities.Notification.create({
        user_email: user.email,
        type: 'schedule',
        title: 'Confidence Check-in Logged! 💙',
        message: `Added "${confidenceData.title}" to your schedule for today`,
        related_id: activity.id
      });

      return activity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['scheduledActivities']);
      queryClient.invalidateQueries(['notifications']);
      toast.success('Logged to your schedule! 💙');
    }
  });

  const handleConfidenceSelect = (level) => {
    setSelectedConfidence(level);
    // Immediately log to calendar with proper title
    saveConfidenceMutation.mutate({ 
      level: level.value,
      title: `Confidence Check-in: ${level.label}`
    });
  };

  const handleDone = () => {
    navigate(createPageUrl('Schedule'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24">
      <Header title="Confidence Check-In" showBack={true} onBack={() => navigate(-1)} />

      <div className="px-6 py-6 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Confidence */}
          {!selectedConfidence && (
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

          {/* Response Display */}
          {selectedConfidence && (() => {
            const response = prewrittenResponses[selectedConfidence.value];
            return (
              <motion.div
                key="response"
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
                    <p className="text-slate-800 leading-relaxed">{response.empathy_statement}</p>
                  </div>

                  {/* Analysis */}
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">📊 What's Happening:</h4>
                    <p className="text-slate-700 leading-relaxed">{response.situation_analysis}</p>
                  </div>

                  {/* Action Steps */}
                  <div>
                    <h4 className="font-bold text-slate-800 mb-3">💪 Here's What You Can Do:</h4>
                    <div className="space-y-3">
                      {response.action_steps.map((step, i) => (
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
                    <p className="leading-relaxed">{response.encouragement}</p>
                  </div>

                  {/* Recommended Drill */}
                  <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200">
                    <h4 className="font-bold text-amber-800 mb-2">🎯 Recommended Activity:</h4>
                    <p className="text-slate-700">{response.recommended_drill}</p>
                  </div>
                </div>

                <Button
                  onClick={handleDone}
                  className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg font-bold"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  View in Schedule
                </Button>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </div>
  );
}