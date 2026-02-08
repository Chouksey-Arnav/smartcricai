import React, { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import BottomNav from '@/components/common/BottomNav';
import Sidebar from '@/components/common/Sidebar';
import NotificationBar from '@/components/common/NotificationBar';
import FloatingTimer from '@/components/common/FloatingTimer';
import ThirtyDayNotifications from '@/components/common/ThirtyDayNotifications';
const pagesWithoutNav = ['Onboarding', 'DrillDetail', 'MentalRoutinePlayer', 'QuizPlayer'];

export default function Layout({ children, currentPageName }) {
  const showNav = !pagesWithoutNav.includes(currentPageName);
  const isHomePage = currentPageName === 'Home';

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="fixed top-4 right-4 z-50 flex items-start gap-2">
        <NotificationBar />
        <FloatingTimer />
      </div>
      <ThirtyDayNotifications user={user} />
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



        /* Page content padding for notification bar and timer */
        .page-content-wrapper {
          padding-top: ${isHomePage ? '0' : '100px'};
        }

        /* Dark mode support */
        html.dark {
          --background: 222 47% 11%;
          --foreground: 210 40% 98%;
        }

        html.dark body {
          background: linear-gradient(to bottom, #0f172a, #020617) !important;
        }

        html.dark .bg-white {
          background-color: #1e293b !important;
          color: #e2e8f0 !important;
        }

        html.dark .bg-gradient-to-b {
          background: linear-gradient(to bottom, #1e293b, #0f172a) !important;
        }

        html.dark .text-slate-800 {
          color: #f1f5f9 !important;
        }

        html.dark .text-slate-700 {
          color: #e2e8f0 !important;
        }

        html.dark .text-slate-600 {
          color: #cbd5e1 !important;
        }

        html.dark .text-slate-500 {
          color: #94a3b8 !important;
        }

        html.dark .border-slate-200 {
          border-color: #475569 !important;
        }

        html.dark .border-slate-100 {
          border-color: #334155 !important;
        }

        html.dark .bg-slate-50 {
          background-color: #1e293b !important;
        }

        html.dark .bg-slate-100 {
          background-color: #334155 !important;
        }

        html.dark .shadow-lg {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3) !important;
        }

        html.dark .shadow-xl {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3) !important;
        }

        html.dark input, html.dark textarea, html.dark select {
          background-color: #334155 !important;
          color: #f1f5f9 !important;
          border-color: #475569 !important;
        }

        html.dark button {
          color-scheme: dark;
        }
        `}</style>

        <div className={isHomePage ? '' : 'page-content-wrapper'}>
        {children}
        </div>
      


      {showNav && <BottomNav />}
    </div>
  );
}