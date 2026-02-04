import React, { useEffect } from 'react';
import BottomNav from '@/components/common/BottomNav';
import Sidebar from '@/components/common/Sidebar';
import NotificationBar from '@/components/common/NotificationBar';
import FloatingTimer from '@/components/common/FloatingTimer';

const pagesWithoutNav = ['Onboarding', 'DrillDetail', 'MentalRoutinePlayer', 'QuizPlayer'];

export default function Layout({ children, currentPageName }) {
  const showNav = !pagesWithoutNav.includes(currentPageName);



  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <NotificationBar />
      <FloatingTimer />
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

        .scrollbar-visible::-webkit-scrollbar {
          width: 8px;
        }
        
        .scrollbar-visible::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        
        .scrollbar-visible::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 4px;
        }
        
        .scrollbar-visible::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }

        /* SmartTrick Coach Indicator */
        .smarttrick-indicator {
          position: fixed;
          bottom: 90px;
          right: 20px;
          z-index: 40;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
      
      {children}
      
      {/* Smart Trick Coach Indicator - Points to FloatingTimer */}
      <div className="fixed bottom-[105px] right-[75px] z-[45] pointer-events-none">
        <div className="flex flex-col items-end gap-1">
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg animate-pulse"
          >
            <path
              d="M10 10 C 25 8, 38 12, 45 30"
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M45 30 L 38 26 M45 30 L 41 32"
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <div className="bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
            Smart Trick Coach
          </div>
        </div>
      </div>

      {showNav && <BottomNav />}
    </div>
  );
}