import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const reactionIcons = {
  applause: '👏',
  fire: '🔥',
  accuracy: '🎯',
  grit: '💪',
  none: ''
};

export default function Chat() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const urlParams = new URLSearchParams(window.location.search);
  const chatWithEmail = urlParams.get('with');
  
  const [message, setMessage] = useState('');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: chatPartnerProfile } = useQuery({
    queryKey: ['chatPartnerProfile', chatWithEmail],
    queryFn: async () => {
      const profiles = await base44.entities.Profile.filter({ user_email: chatWithEmail });
      return profiles[0] || null;
    },
    enabled: !!chatWithEmail,
  });

  const { data: messages } = useQuery({
    queryKey: ['messages', user?.email, chatWithEmail],
    queryFn: async () => {
      if (!user?.email || !chatWithEmail) return [];
      
      const sent = await base44.entities.Message.filter({ 
        sender_email: user.email, 
        receiver_email: chatWithEmail 
      });
      const received = await base44.entities.Message.filter({ 
        sender_email: chatWithEmail, 
        receiver_email: user.email 
      });
      
      return [...sent, ...received].sort((a, b) => 
        new Date(a.created_date) - new Date(b.created_date)
      );
    },
    enabled: !!user?.email && !!chatWithEmail,
    refetchInterval: 3000, // Poll every 3 seconds
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content) => {
      return await base44.entities.Message.create({
        sender_email: user.email,
        receiver_email: chatWithEmail,
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages']);
      setMessage('');
    },
  });

  const addReactionMutation = useMutation({
    mutationFn: async ({ messageId, reaction }) => {
      await base44.entities.Message.update(messageId, { reaction });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages']);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="text-white/80 hover:text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold">
            {chatPartnerProfile?.username?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-white font-bold">{chatPartnerProfile?.username}</h1>
            <p className="text-blue-100 text-xs">{chatPartnerProfile?.archetype}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <AnimatePresence>
          {messages?.map((msg) => {
            const isMe = msg.sender_email === user?.email;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${isMe ? 'bg-blue-500 text-white' : 'bg-white text-slate-800'} rounded-2xl p-4 shadow-lg`}>
                  <p className="text-sm">{msg.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                      {new Date(msg.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {!isMe && msg.reaction === 'none' && (
                      <div className="flex gap-1">
                        {Object.entries(reactionIcons).filter(([k]) => k !== 'none').map(([key, icon]) => (
                          <button
                            key={key}
                            onClick={() => addReactionMutation.mutate({ messageId: msg.id, reaction: key })}
                            className="hover:scale-125 transition-transform"
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    )}
                    {msg.reaction !== 'none' && (
                      <span className="text-lg">{reactionIcons[msg.reaction]}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-200 px-6 py-4">
        <div className="flex gap-3">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 rounded-full"
            disabled={sendMessageMutation.isPending}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="rounded-full w-12 h-12 p-0 bg-blue-500 hover:bg-blue-600"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-slate-500 text-center mt-2">
          💬 Messages are safe • Text only • Be respectful
        </p>
      </div>
    </div>
  );
}