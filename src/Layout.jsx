import React from 'react';
import BottomNav from '@/components/common/BottomNav';

const pagesWithoutNav = ['Onboarding', 'DrillDetail', 'MentalRoutinePlayer', 'QuizPlayer'];

export default function Layout({ children, currentPageName }) {
  const showNav = !pagesWithoutNav.includes(currentPageName);

  return (
    <div className="min-h-screen bg-slate-50">
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