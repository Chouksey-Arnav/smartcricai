import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Header from '@/components/common/Header';
import ChatBubble from '@/components/coach/ChatBubble';
import QuickQuestions from '@/components/coach/QuickQuestions';

const COACH_SYSTEM_PROMPT = `You are Coach Cricket, a friendly and encouraging AI cricket coach for students aged 11-15. 
Your role is to:
- Give clear, age-appropriate cricket tips and advice
- Explain techniques in simple terms
- Be encouraging and positive
- Keep responses concise (2-3 paragraphs max)
- Use cricket examples and analogies
- Never provide unsafe or inappropriate content
- Focus on skill development, practice tips, and mental preparation

Always be supportive and remember you're talking to young learners who are passionate about cricket!`;

export default function Coach() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: chatHistory } = useQuery({
    queryKey: ['chatHistory', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const results = await base44.entities.ChatMessage.filter(
        { user_email: user.email },
        '-created_date',
        50
      );
      return results.reverse();
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (chatHistory) {
      setMessages(chatHistory);
    }
  }, [chatHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content) => {
    if (!content.trim() || isLoading) return;

    const userMessage = { role: 'user', content, user_email: user?.email };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Save user message
      if (user?.email) {
        await base44.entities.ChatMessage.create(userMessage);
      }

      // Build conversation history for context
      const conversationHistory = messages.slice(-6).map(m => 
        `${m.role === 'user' ? 'Student' : 'Coach'}: ${m.content}`
      ).join('\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${COACH_SYSTEM_PROMPT}

Previous conversation:
${conversationHistory}

Student: ${content}

Respond as Coach Cricket:`,
      });

      const coachMessage = { 
        role: 'coach', 
        content: response,
        user_email: user?.email 
      };
      
      setMessages(prev => [...prev, coachMessage]);

      // Save coach response
      if (user?.email) {
        await base44.entities.ChatMessage.create(coachMessage);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages(prev => [...prev, {
        role: 'coach',
        content: "Oops! I had a little trouble there. Could you try asking again?",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col pb-20">
      <Header title="Cricket Coach" showSettings={false} />
      
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Hey there, Champ! 🏏
            </h2>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              I'm your cricket coach! Ask me anything about batting, bowling, fielding, or how to become a better player.
            </p>
            <QuickQuestions onSelect={sendMessage} />
          </motion.div>
        ) : (
          <>
            <AnimatePresence>
              {messages.map((msg, index) => (
                <ChatBubble 
                  key={index} 
                  message={msg} 
                  isUser={msg.role === 'user'} 
                />
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-slate-400"
              >
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                </div>
                <span className="text-sm">Coach is typing...</span>
              </motion.div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-slate-100 px-4 py-3">
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your cricket question..."
            className="flex-1 rounded-full border-slate-200 focus:border-emerald-400 focus:ring-emerald-400"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="rounded-full w-12 h-12 bg-emerald-500 hover:bg-emerald-600"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}