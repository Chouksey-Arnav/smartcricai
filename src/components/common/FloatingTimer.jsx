import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FloatingTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

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
    setTime(0);
    setIsRunning(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Clock className="w-6 h-6" />
      </motion.button>

      {/* Timer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-40 right-6 z-40 bg-white rounded-2xl shadow-2xl p-4 w-64"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800">Stopwatch</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-slate-800 mb-2">{formatTime(time)}</div>
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