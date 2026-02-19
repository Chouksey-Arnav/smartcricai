import React from 'react';
import Header from '@/components/common/Header';

export default function DrillYouTubeFinder() {
  return (
    <div className="min-h-screen bg-white dark:bg-white flex flex-col">
      <Header title="YouTube Drill Finder" />
      
      <div className="flex-1 px-4 py-4 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl p-6 text-white text-center mb-4">
          <h2 className="text-xl font-bold mb-2">🎬 Find Any Cricket Drill</h2>
          <p className="text-purple-100 text-sm">
            Ask our AI agent to find YouTube videos for any cricket drill!
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ height: 'calc(100vh - 280px)' }}>
          <iframe 
            src="https://app.relevanceai.com/agents/bcbe5a/e5e3eeef-250d-4d16-8d49-ebcf5906ce75/796ea726-3ea3-4505-87cc-0efc3338f064/embed-chat?hide_tool_steps=true&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Enter+whatever+drill+you+want+here...&hide_logo=false&hide_description=false" 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            allow="microphone"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}