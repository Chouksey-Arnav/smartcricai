import React from 'react';
import BottomNav from '@/components/common/BottomNav';
import Sidebar from '@/components/common/Sidebar';
import NotificationBar from '@/components/common/NotificationBar';

const pagesWithoutNav = ['Onboarding', 'DrillDetail', 'MentalRoutinePlayer', 'QuizPlayer'];

export default function Layout({ children, currentPageName }) {
  const showNav = !pagesWithoutNav.includes(currentPageName);

  // Mock daily challenges - would come from backend
  const dailyChallenges = [
    {
      id: 1,
      type: 'drill',
      title: 'Complete 3 Drills',
      description: 'Finish any 3 practice drills today',
      current: 1,
      target: 3,
      progress: 33,
      completed: false,
      reward: 50
    },
    {
      id: 2,
      type: 'quiz',
      title: 'Quiz Master',
      description: 'Take and pass 1 quiz with 80%+',
      current: 0,
      target: 1,
      progress: 0,
      completed: false,
      reward: 30
    },
    {
      id: 3,
      type: 'streak',
      title: 'Daily Streak',
      description: 'Practice every day this week',
      current: 3,
      target: 7,
      progress: 43,
      completed: false,
      reward: 100
    },
    {
      id: 4,
      type: 'mental',
      title: 'Mental Focus',
      description: 'Complete 2 mental routines',
      current: 0,
      target: 2,
      progress: 0,
      completed: false,
      reward: 40
    },
    {
      id: 5,
      type: 'batting',
      title: 'Batting Practice',
      description: 'Complete 1 advanced batting drill',
      current: 0,
      target: 1,
      progress: 0,
      completed: false,
      reward: 60
    },
    {
      id: 6,
      type: 'video',
      title: 'Video Analysis',
      description: 'Analyze your technique video',
      current: 0,
      target: 1,
      progress: 0,
      completed: false,
      reward: 70
    },
    {
      id: 7,
      type: 'dismissal',
      title: 'Learn from Mistakes',
      description: 'Analyze 1 dismissal',
      current: 0,
      target: 1,
      progress: 0,
      completed: false,
      reward: 45
    },
    {
      id: 8,
      type: 'scenario',
      title: 'Scenario Practice',
      description: 'Complete 3 match scenarios',
      current: 0,
      target: 3,
      progress: 0,
      completed: false,
      reward: 55
    },
    {
      id: 9,
      type: 'coach',
      title: 'Chat with Coach',
      description: 'Ask AI Coach 3 questions',
      current: 1,
      target: 3,
      progress: 33,
      completed: false,
      reward: 35
    },
    {
      id: 10,
      type: 'fitness',
      title: 'Fitness Focus',
      description: 'Complete 2 fitness drills',
      current: 0,
      target: 2,
      progress: 0,
      completed: false,
      reward: 50
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <NotificationBar challenges={dailyChallenges} />
      <style>{`
        :root {
          --primary: 16 185 129;
          --primary-foreground: 255 255 255;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {children}
      
      {showNav && <BottomNav />}
    </div>
  );
}