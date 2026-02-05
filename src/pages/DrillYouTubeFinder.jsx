import React, { useEffect } from 'react';
import Header from '@/components/common/Header';

export default function DrillYouTubeFinder() {
  useEffect(() => {
    const script = document.createElement('script');
    script.defer = true;
    script.setAttribute('data-relevanceai-share-id', 'bcbe5a/e5e3eeef-250d-4d16-8d49-ebcf5906ce75/796ea726-3ea3-4505-87cc-0efc3338f064');
    script.src = 'https://app.relevanceai.com/embed/chat-bubble.js';
    script.setAttribute('data-share-styles', 'hide_tool_steps=false&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Enter+whatever+drill+you+want+here...&hide_logo=false&hide_description=false');
    
    if (!document.querySelector(`script[src="${script.src}"]`)) {
      document.body.appendChild(script);
    }

    return () => {
      const existingScript = document.querySelector(`script[src="${script.src}"]`);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-24">
      <Header title="YouTube Drill Finder" />
      
      <div className="px-6 py-6 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl p-8 text-white text-center mb-8">
          <h2 className="text-2xl font-bold mb-3">🎬 Find Any Cricket Drill</h2>
          <p className="text-purple-100">
            Ask our AI agent to find YouTube videos for any cricket drill or technique you want to learn!
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <p className="text-slate-600 mb-4">
            👇 Click the chat bubble at the bottom right to start searching
          </p>
          <div className="bg-purple-50 rounded-2xl p-6">
            <h3 className="font-bold text-slate-800 mb-3">Example Searches:</h3>
            <ul className="text-sm text-slate-600 space-y-2 text-left max-w-md mx-auto">
              <li>• "Show me yorker bowling drills"</li>
              <li>• "Find batting footwork exercises"</li>
              <li>• "I need spin bowling techniques"</li>
              <li>• "Power hitting training videos"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}