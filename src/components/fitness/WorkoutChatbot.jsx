import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Sparkles } from 'lucide-react';

export default function WorkoutChatbot() {
  useEffect(() => {
    // Load the chatbot script
    const script = document.createElement('script');
    script.defer = true;
    script.setAttribute('data-relevanceai-share-id', 'bcbe5a/e5e3eeef-250d-4d16-8d49-ebcf5906ce75/796ea726-3ea3-4505-87cc-0efc3338f064');
    script.src = 'https://app.relevanceai.com/embed/chat-bubble.js';
    script.setAttribute('data-share-styles', 'hide_tool_steps=true&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Enter+whatever+drill+you+want+here...&hide_logo=false&hide_description=false');
    
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(`script[data-relevanceai-share-id="bcbe5a/e5e3eeef-250d-4d16-8d49-ebcf5906ce75/796ea726-3ea3-4505-87cc-0efc3338f064"]`);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-32 right-6 z-30 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 shadow-2xl max-w-xs"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <Youtube className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white text-sm mb-1">Need YouTube Videos?</h3>
          <p className="text-purple-100 text-xs">
            Ask the chatbot for any exercise videos! 👉
          </p>
        </div>
        <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
      </div>
    </motion.div>
  );
}