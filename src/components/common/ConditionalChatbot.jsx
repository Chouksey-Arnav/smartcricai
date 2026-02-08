import React, { useEffect } from 'react';

const CHATBOT_PAGES = [
  'Drills',
  'DrillWorkoutCreator', 
  'WorkoutBuilder',
  'AIWorkout',
  'FitnessBuilder',
  'MentalCoaching',
  'MentalTrainingCreator'
];

export default function ConditionalChatbot({ currentPageName }) {
  useEffect(() => {
    // Only load chatbot script if on allowed pages
    if (CHATBOT_PAGES.includes(currentPageName)) {
      const script = document.createElement('script');
      script.defer = true;
      script.setAttribute('data-relevanceai-share-id', 'bcbe5a/e5e3eeef-250d-4d16-8d49-ebcf5906ce75/796ea726-3ea3-4505-87cc-0efc3338f064');
      script.src = 'https://app.relevanceai.com/embed/chat-bubble.js';
      script.setAttribute('data-share-styles', 'hide_tool_steps=true&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Enter+whatever+drill+you+want+here...&hide_logo=false&hide_description=false&bottom_offset=120px');
      
      document.body.appendChild(script);

      return () => {
        const existingScript = document.querySelector(`script[data-relevanceai-share-id="bcbe5a/e5e3eeef-250d-4d16-8d49-ebcf5906ce75/796ea726-3ea3-4505-87cc-0efc3338f064"]`);
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
  }, [currentPageName]);

  return null;
}