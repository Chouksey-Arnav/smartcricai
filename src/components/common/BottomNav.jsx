import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, MessageCircle, Target, Brain, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', icon: Home, page: 'Home' },
  { name: 'Coach', icon: MessageCircle, page: 'Coach' },
  { name: 'Drills', icon: Target, page: 'Drills' },
  { name: 'Mind', icon: Brain, page: 'MentalCoaching' },
  { name: 'Progress', icon: Trophy, page: 'Progress' },
];

export default function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-emerald-100 px-2 py-2 z-50">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentPath.includes(item.page);
          return (
            <Link
              key={item.name}
              to={createPageUrl(item.page)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-emerald-50 text-emerald-600" 
                  : "text-slate-400 hover:text-emerald-500"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-300",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-xs font-medium",
                isActive ? "text-emerald-600" : "text-slate-500"
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