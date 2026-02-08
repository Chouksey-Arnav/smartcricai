import React, { useEffect } from 'react';
import BottomNav from '@/components/common/BottomNav';
import Sidebar from '@/components/common/Sidebar';
import NotificationBar from '@/components/common/NotificationBar';
import FloatingTimer from '@/components/common/FloatingTimer';


const pagesWithoutNav = ['Onboarding', 'DrillDetail', 'MentalRoutinePlayer', 'QuizPlayer'];

export default function Layout({ children, currentPageName }) {
  const showNav = !pagesWithoutNav.includes(currentPageName);
  const isHomePage = currentPageName === 'Home';

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <NotificationBar />
      <FloatingTimer />

      <style>{`
        :root {
          --primary: 16 185 129;
          --primary-foreground: 255 255 255;
          --background: 255 255 255;
          --foreground: 15 23 42;
        }

        .dark {
          --background: 15 23 42;
          --foreground: 248 250 252;
        }

        .dark body {
          background: linear-gradient(to bottom, #1e293b, #0f172a);
        }

        .dark .bg-white {
          background-color: rgb(30 41 59);
        }

        .dark .text-slate-800,
        .dark .text-slate-700 {
          color: rgb(241 245 249);
        }

        .dark .text-slate-600 {
          color: rgb(203 213 225);
        }

        .dark .text-slate-500 {
          color: rgb(148 163 184);
        }

        .dark .border-slate-200,
        .dark .border-slate-300 {
          border-color: rgb(51 65 85);
        }

        .dark .bg-slate-50 {
          background-color: rgb(51 65 85);
        }

        .dark .bg-slate-100 {
          background-color: rgb(71 85 105);
        }

        .dark .shadow-lg,
        .dark .shadow-xl {
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.5);
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

        /* Page content padding for notification bar and timer */
        .page-content-wrapper {
          padding-top: ${isHomePage ? '0' : '100px'};
        }

        /* Dark mode support */
        .dark {
          --background: 222 47% 11%;
          --foreground: 210 40% 98%;
        }

        .dark body {
          background: linear-gradient(to bottom, #1e293b, #0f172a);
        }
        `}</style>

        <div className={isHomePage ? '' : 'page-content-wrapper'}>
        {children}
        </div>
      


      {showNav && <BottomNav />}
    </div>
  );
}