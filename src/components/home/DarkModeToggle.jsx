import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDark]);

  return (
    <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-5 border-2 border-slate-300 dark:border-slate-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white dark:bg-slate-700">
            {isDark ? (
              <Moon className="w-5 h-5 text-slate-700 dark:text-yellow-400" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {isDark ? 'Switch to light' : 'Switch to dark'}
            </p>
          </div>
        </div>
        <Switch
          checked={isDark}
          onCheckedChange={setIsDark}
          className="data-[state=checked]:bg-slate-700"
        />
      </div>
    </div>
  );
}