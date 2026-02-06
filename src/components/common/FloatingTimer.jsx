import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FloatingTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('stopwatch'); // 'stopwatch' or 'timer'
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timerDuration, setTimerDuration] = useState(300); // 5 minutes default
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        if (mode === 'stopwatch') {
          setTime(t => t + 1);
        } else {
          setTime(t => {
            if (t <= 0) {
              setIsRunning(false);
              return 0;
            }
            return t - 1;
          });
        }
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    if (mode === 'timer') {
      setTime(timerDuration);
    } else {
      setTime(0);
    }
    setIsRunning(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === 'timer') {
      setTime(timerDuration);
    } else {
      setTime(0);
    }
  };

  const setCustomTimer = (minutes) => {
    const seconds = minutes * 60;
    setTimerDuration(seconds);
    setTime(seconds);
    setIsRunning(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 right-6 z-40 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Clock className="w-6 h-6" />
      </motion.button>

      {/* Timer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-36 right-6 z-40 bg-white rounded-2xl shadow-2xl p-4 w-64"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-2">
                <button
                  onClick={() => switchMode('stopwatch')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    mode === 'stopwatch' ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Stopwatch
                </button>
                <button
                  onClick={() => switchMode('timer')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    mode === 'timer' ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Timer
                </button>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {mode === 'timer' && !isRunning && (
              <div className="mb-3 flex gap-2 flex-wrap">
                {[1, 3, 5, 10, 15, 20, 30].map(min => (
                  <button
                    key={min}
                    onClick={() => setCustomTimer(min)}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs font-medium text-slate-700"
                  >
                    {min}m
                  </button>
                ))}
              </div>
            )}
            
            <div className="text-center mb-4">
              <div className={`text-4xl font-bold mb-2 ${mode === 'timer' && time <= 10 && time > 0 ? 'text-red-500' : 'text-slate-800'}`}>
                {formatTime(time)}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setIsRunning(!isRunning)}
                variant={isRunning ? "destructive" : "default"}
                className="flex-1"
                size="sm"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button onClick={reset} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}