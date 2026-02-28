import React, { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import BottomNav from '@/components/common/BottomNav';
import Sidebar from '@/components/common/Sidebar';
import NotificationBar from '@/components/common/NotificationBar';
import FloatingTimer from '@/components/common/FloatingTimer';
import ThirtyDayNotifications from '@/components/common/ThirtyDayNotifications';

const pagesWithoutNav = ['Onboarding', 'DrillDetail', 'MentalRoutinePlayer', 'QuizPlayer'];
const pagesWithLightBg = ['HeadCoach', 'NinetyDayChallenge', 'ThirtyDayChallenge', 'Coach', 'DrillYouTubeFinder', 'AIDrillRecommendation'];

export default function Layout({ children, currentPageName }) {
  const showNav = !pagesWithoutNav.includes(currentPageName);
  const isHomePage = currentPageName === 'Home';
  const forceLightBg = pagesWithLightBg.includes(currentPageName);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch {
        return null;
      }
    },
  });

  // Auto-detect system dark mode preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (!storedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  return (
    <div className={forceLightBg ? "min-h-screen bg-white dark:bg-white" : "min-h-screen bg-slate-50"}>
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
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: none;
        }
        
        button, a, nav, .bottom-nav, .nav-item {
          user-select: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
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



        /* Page content padding for notification bar and timer + safe areas */
        .page-content-wrapper {
          padding-top: max(${isHomePage ? '0' : '100px'}, env(safe-area-inset-top));
          padding-bottom: env(safe-area-inset-bottom);
        }

        /* Safe area for header */
        header {
          padding-top: env(safe-area-inset-top);
        }

        /* Safe area for bottom navigation */
        nav.bottom-nav, .bottom-nav-container {
          padding-bottom: env(safe-area-inset-bottom);
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

        html.dark .text-slate-200 {
          color: #f1f5f9 !important;
        }

        html.dark .text-slate-100 {
          color: #f8fafc !important;
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

        html.dark label {
          color: #cbd5e1 !important;
        }

        html.dark .text-slate-400 {
          color: #cbd5e1 !important;
        }

        html.dark .text-slate-300 {
          color: #94a3b8 !important;
        }

        /* Force light mode for specific pages */
        .force-light-mode,
        .force-light-mode * {
          background-color: white !important;
          color: #000 !important;
        }
        `}</style>

        <div className={isHomePage ? '' : 'page-content-wrapper'} style={{ overscrollBehavior: 'contain' }}>
        {children}
        </div>
      


      {showNav && <BottomNav />}
      
      {/* Relevance AI Chatbot - Global */}
      <div dangerouslySetInnerHTML={{ __html: `<script defer data-relevanceai-share-id="bcbe5a/e5e3eeef-250d-4d16-8d49-ebcf5906ce75/796ea726-3ea3-4505-87cc-0efc3338f064" src="https://app.relevanceai.com/embed/chat-bubble.js" data-share-styles="hide_tool_steps=true&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Enter+whatever+drill+you+want+here...&hide_logo=false&hide_description=false"></script>` }} />


      <script>
        {`(function() {
            const premiumData = localStorage.getItem('smartcrick_premium');
            if (premiumData) {
                try {
                    const data = JSON.parse(premiumData);
                    if (!data.plan) return;

                    // Add premium classes
                    document.body.classList.add('premium-user');
                    document.body.classList.add('plan-' + data.plan);

                    // Check expiration for monthly/yearly
                    const purchaseDate = new Date(data.purchaseDate);
                    const now = new Date();
                    const daysSince = (now - purchaseDate) / (1000 * 60 * 60 * 24);

                    let isExpired = false;
                    if (data.plan === 'monthly' && daysSince > 30) isExpired = true;
                    if (data.plan === 'yearly' && daysSince > 365) isExpired = true;

                    if (isExpired) {
                        localStorage.removeItem('smartcrick_premium');
                        return;
                    }

                    // Show premium badge
                    const style = document.createElement('style');
                    style.innerHTML = '.premium-badge{position:fixed;top:20px;right:20px;background:linear-gradient(135deg,#fbbf24,#f59e0b);color:white;padding:10px 20px;border-radius:25px;font-weight:bold;z-index:99999;box-shadow:0 4px 12px rgba(0,0,0,0.15)}';
                    document.head.appendChild(style);

                    const badge = document.createElement('div');
                    badge.className = 'premium-badge';
                    badge.innerHTML = '⭐ PREMIUM';
                    document.body.appendChild(badge);

                    // Show welcome message once
                    const hasShownWelcome = sessionStorage.getItem('premium_welcome_shown');
                    if (!hasShownWelcome) {
                        setTimeout(() => {
                            const welcomeMessages = {
                                monthly: 'Welcome to Premium Monthly! You now have access to Elite Builder, advanced drills, advanced mental training, and pro scenarios!',
                                yearly: 'Welcome to Premium Yearly! You have everything in Monthly PLUS SmartCrick Head Coach!',
                                lifetime: 'Welcome to Lifetime Premium! You have everything PLUS the 90-Day Challenge Architect. You\\'re set for life!'
                            };
                            alert(welcomeMessages[data.plan] || 'Welcome to Premium!');
                            sessionStorage.setItem('premium_welcome_shown', 'true');
                        }, 1000);
                    }
                } catch(e) {}
            }
        })();`}
      </script>
      </div>
      );
      }