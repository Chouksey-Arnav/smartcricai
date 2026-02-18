import React from 'react';
import Header from '@/components/common/Header';

export default function Coach() {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <div className="min-h-screen bg-white dark:bg-white pb-0">
      <Header title="SmartCric Coach" showSettings={false} />

      <div className="w-full h-[calc(100vh-64px)] relative bg-white dark:bg-white">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 z-10">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-700 font-semibold text-lg mb-2">Loading SmartCric Coach...</p>
              <p className="text-slate-500 text-sm">Preparing your personalized assistant</p>
            </div>
          </div>
        )}
        <iframe 
          src="https://app.relevanceai.com/agents/bcbe5a/e5e3eeef-250d-4d16-8d49-ebcf5906ce75/c1b8c3fd-1141-42ff-a6fa-f16c03c2a111/embed-chat?hide_tool_steps=false&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=What+can+Smartcric+Coach+do+for+you+today%3F&hide_logo=false&hide_description=false" 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          allow="microphone"
          style={{ border: 'none' }}
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
}