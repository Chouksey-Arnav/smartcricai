import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock, Timer as TimerIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/common/Header';
import { cn } from '@/lib/utils';

export default function Timer() {
  const [mode, setMode] = useState('timer');
  
  // Timer state
  const [timerMinutes, setTimerMinutes] = useState('');
  const [timerSeconds, setTimerSeconds] = useState('');
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  
  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Create audio element for timer completion
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (timerRunning && timerRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimerRemaining(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            audioRef.current?.play();
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning, timerRemaining]);

  // Stopwatch logic
  useEffect(() => {
    if (stopwatchRunning) {
      intervalRef.current = setInterval(() => {
        setStopwatchTime(prev => prev + 10);
      }, 10);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [stopwatchRunning]);

  const startTimer = () => {
    const minutes = parseInt(timerMinutes) || 0;
    const seconds = parseInt(timerSeconds) || 0;
    const totalSeconds = minutes * 60 + seconds;
    
    if (totalSeconds > 0) {
      setTimerRemaining(totalSeconds);
      setTimerRunning(true);
    }
  };

  const pauseTimer = () => {
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerRemaining(0);
    setTimerMinutes('');
    setTimerSeconds('');
  };

  const startStopwatch = () => {
    setStopwatchRunning(true);
  };

  const pauseStopwatch = () => {
    setStopwatchRunning(false);
  };

  const resetStopwatch = () => {
    setStopwatchRunning(false);
    setStopwatchTime(0);
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const formatStopwatch = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pb-24">
      <Header title="Timer & Stopwatch" showSettings={false} />
      
      <div className="px-6 py-4 max-w-lg mx-auto space-y-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl p-6 text-white"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Training Timer</h2>
              <p className="text-indigo-100 text-sm">Track your drills & rest periods</p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="timer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <TimerIcon className="w-4 h-4" />
              Timer
            </TabsTrigger>
            <TabsTrigger value="stopwatch" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Stopwatch
            </TabsTrigger>
          </TabsList>

          {/* Timer Tab */}
          <TabsContent value="timer" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-3xl shadow-xl p-8"
            >
              {timerRemaining === 0 ? (
                <div className="space-y-6">
                  <h3 className="text-center font-bold text-slate-800 text-lg">Set Timer</h3>
                  <div className="flex gap-4 justify-center">
                    <div className="flex-1">
                      <label className="text-sm text-slate-600 block mb-2">Minutes</label>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        placeholder="00"
                        value={timerMinutes}
                        onChange={(e) => setTimerMinutes(e.target.value)}
                        className="h-16 text-center text-2xl font-bold"
                      />
                    </div>
                    <div className="flex items-end pb-4">
                      <span className="text-3xl font-bold text-slate-400">:</span>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-slate-600 block mb-2">Seconds</label>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        placeholder="00"
                        value={timerSeconds}
                        onChange={(e) => setTimerSeconds(e.target.value)}
                        className="h-16 text-center text-2xl font-bold"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={startTimer}
                    className="w-full h-14 bg-indigo-500 hover:bg-indigo-600 text-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Timer
                  </Button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className={cn(
                    "text-center text-6xl font-bold transition-colors",
                    timerRemaining <= 10 ? "text-red-500 animate-pulse" : "text-indigo-600"
                  )}>
                    {formatTime(timerRemaining)}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={timerRunning ? pauseTimer : () => setTimerRunning(true)}
                      className="flex-1 h-14 bg-indigo-500 hover:bg-indigo-600"
                    >
                      {timerRunning ? (
                        <><Pause className="w-5 h-5 mr-2" />Pause</>
                      ) : (
                        <><Play className="w-5 h-5 mr-2" />Resume</>
                      )}
                    </Button>
                    <Button
                      onClick={resetTimer}
                      variant="outline"
                      className="h-14 px-6"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all",
                        timerRemaining <= 10 ? "bg-red-500" : "bg-indigo-500"
                      )}
                      style={{
                        width: `${((parseInt(timerMinutes || 0) * 60 + parseInt(timerSeconds || 0) - timerRemaining) / (parseInt(timerMinutes || 0) * 60 + parseInt(timerSeconds || 0))) * 100}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Quick Presets */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <h4 className="font-semibold text-slate-800 mb-3">Quick Presets</h4>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '30s', min: 0, sec: 30 },
                  { label: '1m', min: 1, sec: 0 },
                  { label: '2m', min: 2, sec: 0 },
                  { label: '5m', min: 5, sec: 0 },
                  { label: '10m', min: 10, sec: 0 },
                  { label: '15m', min: 15, sec: 0 },
                ].map(preset => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setTimerMinutes(preset.min.toString());
                      setTimerSeconds(preset.sec.toString());
                    }}
                    className="p-3 bg-indigo-50 hover:bg-indigo-100 rounded-xl text-indigo-700 font-semibold transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Stopwatch Tab */}
          <TabsContent value="stopwatch" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-3xl shadow-xl p-8 space-y-8"
            >
              <div className="text-center text-6xl font-bold text-purple-600">
                {formatStopwatch(stopwatchTime)}
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={stopwatchRunning ? pauseStopwatch : startStopwatch}
                  className="flex-1 h-14 bg-purple-500 hover:bg-purple-600"
                >
                  {stopwatchRunning ? (
                    <><Pause className="w-5 h-5 mr-2" />Pause</>
                  ) : (
                    <><Play className="w-5 h-5 mr-2" />Start</>
                  )}
                </Button>
                <Button
                  onClick={resetStopwatch}
                  variant="outline"
                  className="h-14 px-6"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}