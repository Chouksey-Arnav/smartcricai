import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Target, Brain, TrendingUp, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ChatBubble from '@/components/coach/ChatBubble';
import QuickQuestions from '@/components/coach/QuickQuestions';
import Header from '@/components/common/Header';

export default function Coach() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: drills } = useQuery({
    queryKey: ['drills'],
    queryFn: () => base44.entities.Drill.list(),
  });

  const { data: progress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.UserProgress.filter({ user_email: user.email });
      return results[0] || null;
    },
    enabled: !!user?.email,
  });

  const { data: chatHistory } = useQuery({
    queryKey: ['chatMessages', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.ChatMessage.filter({ user_email: user.email });
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      const formattedHistory = chatHistory.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_date),
      }));
      setMessages(formattedHistory);
    } else {
      setMessages([
        {
          role: 'coach',
          content: "Hey champ! 👋 I'm your AI cricket coach. Ask me anything about batting, bowling, fielding, or mental game. I'm here to help you improve!",
          timestamp: new Date(),
        },
      ]);
    }
  }, [chatHistory]);

  const recommendDrill = (userMessage) => {
    const lower = userMessage.toLowerCase();
    
    if (lower.includes('batting') || lower.includes('bat') || lower.includes('shot')) {
      return drills?.filter(d => d.category === 'batting')?.[0];
    }
    if (lower.includes('bowling') || lower.includes('bowl')) {
      return drills?.filter(d => d.category === 'bowling')?.[0];
    }
    if (lower.includes('fielding') || lower.includes('catch')) {
      return drills?.filter(d => d.category === 'fielding')?.[0];
    }
    if (lower.includes('fitness') || lower.includes('strength')) {
      return drills?.filter(d => d.category === 'fitness')?.[0];
    }
    
    // Default: recommend based on least practiced category
    if (progress && drills) {
      const categoryCount = drills.reduce((acc, drill) => {
        const completed = progress.completed_drills?.includes(drill.id);
        if (!acc[drill.category]) acc[drill.category] = 0;
        if (!completed) acc[drill.category]++;
        return acc;
      }, {});
      
      const leastPracticed = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])[0]?.[0];
      
      return drills.filter(d => d.category === leastPracticed)?.[0];
    }
    
    return null;
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Save user message
      if (user?.email) {
        await base44.entities.ChatMessage.create({
          user_email: user.email,
          role: 'user',
          content: input,
        });
      }

      // Get context about user
      const userContext = progress ? `
        User's skill level: ${progress.skill_level || 'beginner'}
        Completed drills: ${progress.completed_drills?.length || 0}
        Current streak: ${progress.current_streak || 0} days
        Practice time: ${progress.total_practice_minutes || 0} minutes
      ` : '';

      // Get AI response with drill recommendation
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a friendly, motivating cricket coach for young players (ages 11-17). 
        
${userContext}

User question: "${input}"

Provide a SHORT, CLEAR, and ACTIONABLE response (max 2-3 sentences). 
- Use simple language
- Be encouraging and positive
- Give specific tips they can practice RIGHT NOW
- If relevant, suggest they try a specific drill

Focus on:
- Technique tips for batting/bowling/fielding
- Mental game advice
- Motivation and confidence building
- Match situation strategies

Keep it conversational, friendly, and like a real coach talking to a player.`,
      });

      const coachMessage = {
        role: 'coach',
        content: response,
        timestamp: new Date(),
      };

      // Check if we should recommend a drill
      const suggestedDrill = recommendDrill(input);

      setMessages(prev => [...prev, coachMessage]);

      // Speak the response (voice mode always on)
      speakText(response);

      if (suggestedDrill) {
        const drillMessage = {
          role: 'coach',
          content: `💡 I recommend trying the **${suggestedDrill.title}** drill. It's perfect for what you're working on!`,
          timestamp: new Date(),
          drill: suggestedDrill,
        };
        setMessages(prev => [...prev, drillMessage]);
      }

      // Save coach message
      if (user?.email) {
        await base44.entities.ChatMessage.create({
          user_email: user.email,
          role: 'coach',
          content: response,
        });
      }
    } catch (error) {
      const errorMessage = {
        role: 'coach',
        content: "Sorry, I'm having trouble responding right now. Please try again!",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-24">
      <Header title="AI Coach" showSettings={false} />

      <div className="px-6 py-4 max-w-2xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-6 text-white mb-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Your Personal Coach</h2>
              <p className="text-emerald-100 text-sm">Ask anything about cricket</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Volume2 className="w-4 h-4" />
                <span>Voice Mode: Always On</span>
              </div>
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="px-3 py-1 bg-white/20 rounded-lg text-xs font-medium hover:bg-white/30"
                >
                  Stop
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Questions */}
        <QuickQuestions onSelect={handleQuickQuestion} />

        {/* Chat Messages */}
        <div className="space-y-4 mb-24">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ChatBubble message={message} />
                
                {/* Drill Recommendation Card */}
                {message.drill && (
                  <Link to={createPageUrl('DrillDetail', `id=${message.drill.id}`)}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-3 ml-12 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-800">{message.drill.title}</p>
                          <p className="text-xs text-slate-600 capitalize">{message.drill.category} • {message.drill.duration_minutes} min</p>
                        </div>
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                          Start →
                        </Button>
                      </div>
                    </motion.div>
                  </Link>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-slate-500 text-sm ml-12"
            >
              <Brain className="w-4 h-4 animate-pulse" />
              <span>Coach is typing...</span>
            </motion.div>
          )}
        </div>

        {/* Input Box */}
        <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-slate-200 p-4">
          <div className="max-w-2xl mx-auto flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask me anything about cricket..."
              className="flex-1 min-h-[48px] max-h-32 resize-none"
              disabled={isTyping}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-emerald-500 hover:bg-emerald-600 h-12 w-12 p-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}