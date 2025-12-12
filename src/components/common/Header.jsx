import React from 'react';
import { ChevronLeft, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Header({ title, showBack = false, onBack, showSettings = true }) {
  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-emerald-50 px-4 py-4 z-40">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button 
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-emerald-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
          )}
          <h1 className="text-lg font-bold text-slate-800">{title}</h1>
        </div>
        {showSettings && (
          <Link 
            to={createPageUrl('Settings')}
            className="p-2 rounded-full hover:bg-emerald-50 transition-colors"
          >
            <Settings className="w-5 h-5 text-slate-500" />
          </Link>
        )}
      </div>
    </header>
  );
}