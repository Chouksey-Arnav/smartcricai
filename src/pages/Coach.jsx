import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Target, Brain, TrendingUp, Volume2, Mic, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ChatBubble from '@/components/coach/ChatBubble';
import QuickQuestions from '@/components/coach/QuickQuestions';
import Header from '@/components/common/Header';

export default function Coach() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showInfoTooltip, setShowInfoTooltip] = useState(true);
  const [aiFailed, setAiFailed] = useState(false);
  const messagesEndRef = useRef(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    staleTime: 300000,
  });

  const { data: drills } = useQuery({
    queryKey: ['drills'],
    queryFn: () => base44.entities.Drill.list(),
    initialData: [],
    staleTime: 300000,
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
      const messages = await base44.entities.ChatMessage.filter({ user_email: user.email });
      return messages.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    },
    enabled: !!user?.email,
    initialData: [],
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

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

    const currentInput = input.trim();
    const lowerInput = currentInput.toLowerCase();
    
    // Check for memory save triggers
    if (lowerInput.includes('save to memory') || lowerInput.includes('remember this') || lowerInput.includes('save to your memory')) {
      if (user?.email) {
        // Extract the info and save to UserProfile
        const profiles = await base44.entities.UserProfile.filter({ user_email: user.email });
        const profile = profiles[0];
        
        // Simple keyword extraction for common patterns
        const memoryNote = currentInput.replace(/(save to memory|remember this|save to your memory)/gi, '').trim();
        
        if (profile) {
          const notes = profile.coach_memory_notes || [];
          await base44.entities.UserProfile.update(profile.id, {
            coach_memory_notes: [...notes, { text: memoryNote, date: new Date().toISOString() }]
          });
        }
        
        setMessages(prev => [...prev, 
          { role: 'user', content: currentInput, timestamp: new Date() },
          { role: 'coach', content: `Got it! I've saved that to my memory: "${memoryNote}". I'll use this to personalize your training! 🧠`, timestamp: new Date() }
        ]);
        setInput('');
        return;
      }
    }
    
    // Check for mode triggers
    if (lowerInput.includes('open voice mode') || lowerInput.includes('voice mode')) {
      navigate(createPageUrl('CoachVoiceMode'));
      return;
    }
    if (lowerInput.includes('open mental mode') || lowerInput.includes('mental mode')) {
      navigate(createPageUrl('CoachVoiceMode') + '?mode=mental');
      return;
    }

    setInput('');

    const userMessage = {
      role: 'user',
      content: currentInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Save user message (non-blocking)
      if (user?.email) {
        base44.entities.ChatMessage.create({
          user_email: user.email,
          role: 'user',
          content: currentInput,
        }).catch(err => console.warn('Failed to save user message:', err));
      }

      // Get context about user
      const userContext = progress ? `
User's skill level: ${progress.skill_level || 'beginner'}
Completed drills: ${progress.completed_drills?.length || 0}
Current streak: ${progress.current_streak || 0} days
Total practice time: ${progress.total_practice_minutes || 0} minutes` : 'New player - be extra encouraging!';

      // Get AI response
      console.log('[AI Coach] Sending request to AI...');
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an enthusiastic, supportive cricket coach for young players aged 11-17.

${userContext}

Player's question: "${currentInput}"

Respond in 2-3 SHORT sentences with:
- Simple, clear language
- Positive encouragement
- ONE specific actionable tip they can try right now
- Conversational, friendly tone like a real coach

Focus on: batting technique, bowling tips, fielding skills, mental strength, match strategies.

Occasionally mention: "Want to chat live? Type 'Open Voice Mode' or 'Open Mental Mode'!"`,
      });

      console.log('[AI Coach] Response received:', response?.substring(0, 100));

      if (!response || typeof response !== 'string' || response.trim().length === 0) {
        throw new Error('Empty or invalid response from AI');
      }

      const coachMessage = {
        role: 'coach',
        content: response.trim(),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, coachMessage]);

      // Do NOT speak in text mode - only in voice/mental mode

      // Check if we should recommend a drill
      const suggestedDrill = recommendDrill(currentInput);
      if (suggestedDrill) {
        const drillMessage = {
          role: 'coach',
          content: `💡 I recommend trying the **${suggestedDrill.title}** drill. It's perfect for what you're working on!`,
          timestamp: new Date(),
          drill: suggestedDrill,
        };
        setMessages(prev => [...prev, drillMessage]);
      }

      // Save coach message (non-blocking)
      if (user?.email) {
        base44.entities.ChatMessage.create({
          user_email: user.email,
          role: 'coach',
          content: response.trim(),
        }).catch(err => console.warn('Failed to save coach message:', err));
      }

    } catch (error) {
      console.error('[AI Coach] Critical Error:', error);
      
      const errorMessage = {
        role: 'coach',
        content: "Sorry champ, I'm having trouble connecting right now. Please try again in a moment! 🏏",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      stopSpeaking();
      setAiFailed(true);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetry = () => {
    setAiFailed(false);
    setMessages([]);
    setInput('');
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      setIsSpeaking(true);
      
      // Wait for voices to load
      const speak = () => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Try to use a better voice
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(v => v.lang.includes('en'));
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
        
        utterance.onend = () => {
          setIsSpeaking(false);
        };
        
        utterance.onerror = () => {
          setIsSpeaking(false);
        };
        
        window.speechSynthesis.speak(utterance);
      };
      
      // Load voices if not loaded
      if (window.speechSynthesis.getVoices().length > 0) {
        speak();
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          speak();
        };
      }
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
        {/* Info Tooltip */}
        <AnimatePresence>
          {showInfoTooltip && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-4 text-white mb-4 relative"
            >
              <button
                onClick={() => setShowInfoTooltip(false)}
                className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-start gap-3 pr-8">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">🎙️ New Interactive Modes!</p>
                  <p className="text-sm text-blue-100">
                    Type <span className="font-bold">'Open Voice Mode'</span> to speak with me like a real coach, or <span className="font-bold">'Open Mental Mode'</span> to work on the mental side of your game with voice guidance!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate(createPageUrl('CoachVoiceMode'))}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="flex items-center gap-2 text-sm justify-center">
                <Mic className="w-4 h-4" />
                <span className="font-medium">Voice Mode</span>
              </div>
            </button>
            <button
              onClick={() => navigate(createPageUrl('CoachVoiceMode') + '?mode=mental')}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="flex items-center gap-2 text-sm justify-center">
                <Brain className="w-4 h-4" />
                <span className="font-medium">Mental Mode</span>
              </div>
            </button>
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
          <div ref={messagesEndRef} />
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
                  if (!aiFailed) {
                    handleSend();
                  }
                }
              }}
              placeholder={aiFailed ? "Coach is unavailable. Click 'Retry' to try again." : "Ask me anything about cricket..."}
              className="flex-1 min-h-[48px] max-h-32 resize-none"
              disabled={isTyping || aiFailed}
            />
            {aiFailed ? (
              <Button
                onClick={handleRetry}
                className="bg-red-500 hover:bg-red-600 h-12 px-4"
              >
                Retry Coach
              </Button>
            ) : (
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-emerald-500 hover:bg-emerald-600 h-12 w-12 p-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}