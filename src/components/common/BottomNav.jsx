import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, MessageCircle, Target, Crown, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', icon: Home, page: 'Home' },
  { name: 'Coach', icon: MessageCircle, page: 'Coach' },
  { name: 'Drills', icon: Target, page: 'Drills' },
  { name: 'Premium', icon: Crown, page: 'Premium' },
  { name: 'Timer', icon: Clock, page: 'Timer' },
];

export default function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-emerald-100 dark:border-slate-700 z-50 transition-transform duration-300",
      isCollapsed && "translate-y-full"
    )}>
      {/* Collapse/Expand Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "absolute left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 rounded-t-xl px-4 py-2 shadow-lg border border-b-0 border-emerald-100 dark:border-slate-700 transition-all",
          isCollapsed ? "-top-10" : "-top-10"
        )}
      >
        {isCollapsed ? (
          <ChevronUp className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        )}
      </button>

      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = currentPath.includes(item.page);
          return (
            <Link
              key={item.name}
              to={createPageUrl(item.page)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" 
                  : "text-slate-400 dark:text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-300",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-xs font-medium",
                isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}