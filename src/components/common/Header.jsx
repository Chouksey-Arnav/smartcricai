import React from 'react';
import { ChevronLeft, Settings } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

const PRIMARY_SCREENS = ['Home', 'Coach', 'Drills', 'Premium', 'Timer'];

export default function Header({ title, showBack, onBack, showSettings = true, showHomeLink = true }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-detect back button: show unless explicitly disabled or on a primary tab screen
  const currentPage = location.pathname.replace('/', '');
  const isPrimaryScreen = PRIMARY_SCREENS.includes(currentPage);
  const shouldShowBack = showBack !== undefined ? showBack : !isPrimaryScreen;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 bg-white/80 dark:bg-slate-800/90 backdrop-blur-lg border-b border-emerald-50 dark:border-slate-700 px-4 py-4 z-40">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {shouldShowBack && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </motion.button>
          )}
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {showHomeLink && !isPrimaryScreen && (
            <Link 
              to={createPageUrl('Home')}
              className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
            >
              Home
            </Link>
          )}
          {showSettings && (
            <motion.div whileTap={{ scale: 0.95 }}>
              <Link 
                to={createPageUrl('Settings')}
                className="p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors block"
              >
                <Settings className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}