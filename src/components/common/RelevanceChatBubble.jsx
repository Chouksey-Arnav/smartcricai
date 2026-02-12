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

  return null; // This component doesn't render anything visible
}