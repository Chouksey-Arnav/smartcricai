import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Brain, Sparkles, ChevronLeft, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export default function CoachVoiceMode() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const initialMode = urlParams.get('mode') === 'mental' ? 'mental' : 'voice';
  
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversation, setConversation] = useState([]);
  const [mode, setMode] = useState(initialMode);
  const [aiFailed, setAiFailed] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    staleTime: 300000,
    retry: 3,
  });

  const { data: progress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.UserProgress.filter({ user_email: user.email });
      return results[0] || null;
    },
    enabled: !!user?.email,
    staleTime: 60000,
    retry: 3,
  });

  const { data: chatHistory } = useQuery({
    queryKey: ['chatMessages', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const messages = await base44.entities.ChatMessage.filter({ user_email: user.email });
      return messages.slice(-10).sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    },
    enabled: !!user?.email,
    initialData: [],
  });

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          if (!aiFailed) {
            handleUserSpeech(finalTranscript.trim());
          } else {
            setTranscript('');
            setIsListening(false);
            recognitionRef.current?.stop();
          }
        } else {
          setTranscript(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    if (aiFailed) {
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      setTranscript('');
      
      if (conversation.length === 0 || (conversation.length === 1 && conversation[0].role === 'coach' && (conversation[0].text.includes('connection issue') || conversation[0].text.includes('timeout')))) {
        const greeting = mode === 'mental' 
          ? `Hi ${progress?.display_name || 'champion'}. Let's work on your mental game. Take a deep breath. What would you like to focus on today?`
          : `Hey ${progress?.display_name || 'champ'}! I'm your personal cricket coach. Tell me what you want to work on today.`;
        
        setConversation([{ role: 'coach', text: greeting }]);
        speakText(greeting);
      }
    }
  };

  const handleUserSpeech = async (text) => {
    if (!text.trim()) return;

    setConversation(prev => [...prev, { role: 'user', text }]);
    setTranscript('');

    try {
      const contextInfo = `
User: ${progress?.display_name || user?.email}
Skill Level: ${progress?.skill_level || 'beginner'}
Completed Drills: ${progress?.completed_drills?.length || 0}
Current Streak: ${progress?.current_streak || 0} days
Total Practice: ${progress?.total_practice_minutes || 0} minutes`;

      const prompt = mode === 'mental'
        ? `You are a professional sports psychologist coaching young cricketers (11-17).

${contextInfo}

Player says: "${text}"

Respond in 2-3 SHORT, calming sentences:
- Gentle, reassuring tone
- Focus on: confidence, handling pressure, staying focused, mental recovery
- ONE simple mental technique (breathing, visualization, positive self-talk)
- Be supportive like a mentor

Keep it brief and warm.`
        : `You are an expert cricket coach talking to a young player (11-17).

${contextInfo}

Player says: "${text}"

Respond in 2-3 SHORT, motivating sentences:
- Enthusiastic, clear language
- Focus on: batting/bowling/fielding technique, match tactics, drills
- ONE specific actionable tip
- Be encouraging like a real coach

Keep it brief and energetic.`;

      console.log(`[Voice Mode - ${mode}] Sending AI request...`);
      const response = await base44.integrations.Core.InvokeLLM({ prompt });
      console.log(`[Voice Mode - ${mode}] Response received`);

      if (!response || typeof response !== 'string' || response.trim().length === 0) {
        throw new Error('Empty or invalid AI response');
      }

      setConversation(prev => [...prev, { role: 'coach', text: response.trim() }]);
      speakText(response.trim());

      // Save to chat history (non-blocking)
      if (user?.email) {
        base44.entities.ChatMessage.create({
          user_email: user.email,
          role: 'user',
          content: text,
        }).catch(err => console.warn('Failed to save user message:', err));
        
        base44.entities.ChatMessage.create({
          user_email: user.email,
          role: 'coach',
          content: response.trim(),
        }).catch(err => console.warn('Failed to save coach message:', err));
      }
    } catch (error) {
      console.error(`[Voice Mode - ${mode}] Error:`, error);
      
      const errorMsg = mode === 'mental' 
        ? "Take a deep breath... I'm having a connection issue. Please try again later."
        : "Hang tight! Technical timeout. Please try speaking again later!";
      setConversation(prev => [...prev, { role: 'coach', text: errorMsg }]);
      speakText(errorMsg);
      setAiFailed(true);
      setIsSpeaking(false);
      setIsListening(false);
      recognitionRef.current?.stop();
    }
  };

  const handleRetryVoice = () => {
    setAiFailed(false);
    setConversation([]);
    setTranscript('');
    setIsListening(false);
    setIsSpeaking(false);
    recognitionRef.current?.stop();
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = mode === 'mental' ? 0.85 : 0.9; // Slower for mental mode
      utterance.pitch = 1;
      utterance.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en') && v.name.includes('Female')) 
        || voices.find(v => v.lang.includes('en'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 shadow-lg">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-3"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Coach</span>
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              {mode === 'mental' ? <Brain className="w-6 h-6 text-white" /> : <Sparkles className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {mode === 'mental' ? 'Mental Coaching Mode' : 'Voice Coaching Mode'}
              </h1>
              <p className="text-indigo-100 text-sm">Speak naturally with your coach</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setMode(mode === 'voice' ? 'mental' : 'voice')}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            Switch to {mode === 'mental' ? 'Voice' : 'Mental'}
          </Button>
        </div>
      </div>

      <div className="px-6 py-6 max-w-2xl mx-auto">
        {/* Conversation */}
        <div className="space-y-4 mb-32">
          {conversation.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-3xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-indigo-500 text-white' 
                  : mode === 'mental'
                  ? 'bg-gradient-to-br from-purple-100 to-pink-100 text-slate-800 border-2 border-purple-200'
                  : 'bg-white text-slate-800 shadow-lg'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </motion.div>
          ))}
          {transcript && (
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-3xl p-4 bg-indigo-300 text-white opacity-50">
                <p className="text-sm italic">{transcript}...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Voice Controls - Fixed at Bottom */}
        <div className="fixed bottom-8 left-0 right-0 px-6">
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-center gap-6">
              {aiFailed ? (
                <Button
                  onClick={handleRetryVoice}
                  size="lg"
                  className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600"
                >
                  <RefreshCcw className="w-8 h-8" />
                </Button>
              ) : (
                <Button
                  onClick={toggleListening}
                  size="lg"
                  disabled={isSpeaking}
                  className={`w-20 h-20 rounded-full ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : mode === 'mental'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                  }`}
                >
                  {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </Button>
              )}

              {isSpeaking && !aiFailed && (
                <Button
                  onClick={stopSpeaking}
                  size="lg"
                  variant="outline"
                  className="w-20 h-20 rounded-full"
                >
                  <VolumeX className="w-8 h-8" />
                </Button>
              )}
            </div>

            {aiFailed && (
              <div className="text-center mt-4">
                <p className="text-sm font-medium text-red-600">
                  Coach is unavailable. Click 'Retry Coach' above.
                </p>
              </div>
            )}
            
            {!aiFailed && (
              <div className="text-center mt-4">
                <p className="text-sm font-medium text-slate-700">
                  {isListening ? 'Listening...' : isSpeaking ? 'Coach is speaking...' : 'Tap to speak'}
                </p>
                {transcript && (
                  <p className="text-xs text-slate-500 mt-1 italic">"{transcript}"</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}