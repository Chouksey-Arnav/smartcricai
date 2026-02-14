import React, { useEffect } from 'react';

export default function RelevanceChatBubble() {
  useEffect(() => {
    // Check if script already exists
    if (document.querySelector('[data-relevanceai-share-id]')) {
      return;
    }

    // Create and inject the Relevance AI chat bubble script
    const script = document.createElement('script');
    script.defer = true;
    script.setAttribute('data-relevanceai-share-id', 'bcbe5a/e5e3eeef-250d-4d16-8d49-ebcf5906ce75/796ea726-3ea3-4505-87cc-0efc3338f064');
    script.src = 'https://app.relevanceai.com/embed/chat-bubble.js';
    script.setAttribute('data-share-styles', 'hide_tool_steps=true&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Enter+whatever+drill+you+want+here...&hide_logo=false&hide_description=false');
    
    document.body.appendChild(script);

    return () => {
      // Cleanup if component unmounts
      const existingScript = document.querySelector('[data-relevanceai-share-id]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <>
      <div className="fixed bottom-[110px] right-24 z-[9998] bg-purple-600 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg pointer-events-none">
        <div className="relative">
          YouTube URL Giver →
          <div className="absolute top-1/2 -right-2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-purple-600 -translate-y-1/2" />
        </div>
      </div>
      <style>{`
        [data-relevanceai-share-id] {
          position: fixed !important;
          bottom: 100px !important;
          right: 20px !important;
          z-index: 9999 !important;
        }
      `}</style>
    </>
  );
  }