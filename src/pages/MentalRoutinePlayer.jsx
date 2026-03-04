import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Box Breathing Visualizer - animated square
function BoxBreathingVisualizer({ stepTimeRemaining, stepDuration }) {
  const totalCycleDuration = 16; // 4+4+4+4
  const phases = ['Inhale (Right)', 'Hold (Down)', 'Exhale (Left)', 'Hold (Up)'];
  const elapsed = stepDuration - stepTimeRemaining;
  const cyclePos = elapsed % totalCycleDuration;
  const phaseIndex = Math.floor(cyclePos / 4);
  const phaseProgress = (cyclePos % 4) / 4;
  
  // Dot position along square: 0=top-left corner, going clockwise
  // Top side (right): x: 0->1, y: 0
  // Right side (down): x: 1, y: 0->1
  // Bottom side (left): x: 1->0, y: 1
  // Left side (up): x: 0, y: 1->0
  const size = 160;
  const padding = 20;
  const dotPositions = [
    { x: padding + (size * phaseProgress), y: padding }, // top (right)
    { x: padding + size, y: padding + (size * phaseProgress) }, // right (down)
    { x: padding + size - (size * phaseProgress), y: padding + size }, // bottom (left)
    { x: padding, y: padding + size - (size * phaseProgress) }, // left (up)
  ];
  const dot = dotPositions[phaseIndex] || dotPositions[0];
  
  const phaseColors = ['#34d399', '#60a5fa', '#f472b6', '#a78bfa'];

  return (
    <div className="flex flex-col items-center">
      <svg width={size + padding * 2} height={size + padding * 2}>
        {/* Square path */}
        <rect x={padding} y={padding} width={size} height={size} rx={12}
          fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={4} />
        {/* Animated dot */}
        <circle cx={dot.x} cy={dot.y} r={10} fill={phaseColors[phaseIndex]} />
        {/* Corner labels */}
        <text x={padding} y={padding - 6} fill="rgba(255,255,255,0.5)" fontSize={10} textAnchor="middle">▶</text>
      </svg>
      <div className="mt-2 text-center">
        <p className="text-white text-lg font-bold">{phases[phaseIndex]}</p>
        <p className="text-white/60 text-sm">{4 - Math.floor(cyclePos % 4)}s</p>
      </div>
    </div>
  );
}

// 4-7-8 Breathing Triangle Visualizer
function BreathingTriangleVisualizer({ stepTimeRemaining, stepDuration }) {
  const phases = [
    { label: 'Inhale', duration: 4, color: '#34d399' },
    { label: 'Hold', duration: 7, color: '#60a5fa' },
    { label: 'Exhale', duration: 8, color: '#f472b6' },
  ];
  const totalCycle = 19; // 4+7+8
  const elapsed = stepDuration - stepTimeRemaining;
  const cyclePos = elapsed % totalCycle;
  
  let phaseIndex = 0;
  let phaseProgress = 0;
  let acc = 0;
  for (let i = 0; i < phases.length; i++) {
    if (cyclePos < acc + phases[i].duration) {
      phaseIndex = i;
      phaseProgress = (cyclePos - acc) / phases[i].duration;
      break;
    }
    acc += phases[i].duration;
  }

  // Triangle points (equilateral): bottom-left, bottom-right, top-center
  const cx = 100, cy = 100, r = 75;
  const pts = [
    { x: cx - r * Math.sin(Math.PI * 2 / 3), y: cy + r * Math.cos(Math.PI * 2 / 3) }, // bottom-left
    { x: cx + r * Math.sin(Math.PI * 2 / 3), y: cy + r * Math.cos(Math.PI * 2 / 3) }, // bottom-right
    { x: cx, y: cy - r }, // top
  ];

  // Dot travels: phase0 = bottom-left to top, phase1 = top to bottom-right, phase2 = bottom-right to bottom-left
  const edgePairs = [[0, 2], [2, 1], [1, 0]];
  const [startIdx, endIdx] = edgePairs[phaseIndex];
  const startPt = pts[startIdx];
  const endPt = pts[endIdx];
  const dotX = startPt.x + (endPt.x - startPt.x) * phaseProgress;
  const dotY = startPt.y + (endPt.y - startPt.y) * phaseProgress;
  const remaining = phases[phaseIndex].duration - Math.floor(cyclePos % phases[phaseIndex].duration) - (phaseProgress > 0 ? 0 : 0);
  const secondsLeft = phases[phaseIndex].duration - Math.floor((cyclePos - acc));

  const triPoints = pts.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex flex-col items-center">
      <svg width={200} height={200}>
        <polygon points={triPoints} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={4} strokeLinejoin="round" />
        {/* Phase labels on sides */}
        <text x={(pts[0].x + pts[2].x) / 2 - 18} y={(pts[0].y + pts[2].y) / 2} fill="rgba(255,255,255,0.5)" fontSize={10}>Inhale</text>
        <text x={(pts[2].x + pts[1].x) / 2 + 4} y={(pts[2].y + pts[1].y) / 2} fill="rgba(255,255,255,0.5)" fontSize={10}>Hold</text>
        <text x={(pts[1].x + pts[0].x) / 2 - 18} y={(pts[1].y + pts[0].y) / 2 + 14} fill="rgba(255,255,255,0.5)" fontSize={10}>Exhale</text>
        {/* Animated dot */}
        <circle cx={dotX} cy={dotY} r={10} fill={phases[phaseIndex].color} />
      </svg>
      <div className="mt-2 text-center">
        <p className="text-white text-lg font-bold">{phases[phaseIndex].label}</p>
        <p className="text-white/60 text-sm">{Math.max(1, secondsLeft)}s</p>
      </div>
    </div>
  );
}

export default function MentalRoutinePlayer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const routineId = urlParams.get('id');

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepTimeRemaining, setStepTimeRemaining] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const intervalRef = useRef(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: routine, isLoading } = useQuery({
    queryKey: ['mentalRoutine', routineId],
    queryFn: async () => {
      const routines = await base44.entities.MentalRoutine.filter({ id: routineId });
      return routines[0];
    },
    enabled: !!routineId,
  });

  const { data: userProgress } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const results = await base44.entities.UserProgress.filter({ user_email: user.email });
      return results[0] || null;
    },
    enabled: !!user?.email,
  });

  const completeMutation = useMutation({
    mutationFn: async () => {
      if (user?.email && routine) {
        const xpEarned = routine.xp_value || 75;
        
        // Update user progress with XP
        if (userProgress?.id) {
          await base44.entities.UserProgress.update(userProgress.id, {
            total_xp: (userProgress.total_xp || 0) + xpEarned
          });
        }

        // Update Leaderboard
        const leaderboards = await base44.entities.Leaderboard.filter({ user_email: user.email });
        if (leaderboards.length > 0) {
          await base44.entities.Leaderboard.update(leaderboards[0].id, {
            total_xp: (leaderboards[0].total_xp || 0) + xpEarned
          });
        }
        
        // Create notification
        await base44.entities.Notification.create({
          user_email: user.email,
          type: 'mental',
          title: `Mental Training Completed! 🧠 +${xpEarned} XP`,
          message: `"${routine.title}" completed! Your mind is getting stronger!`,
          related_id: routine.id
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    },
  });

  const steps = routine?.steps || [];
  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (routine && steps.length > 0 && stepTimeRemaining === 0) {
      setStepTimeRemaining(steps[0]?.duration_seconds || 10);
    }
  }, [routine]);

  useEffect(() => {
    if (isPlaying && stepTimeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setStepTimeRemaining(prev => {
          if (prev <= 1) {
            // Move to next step
            if (currentStepIndex < steps.length - 1) {
              setCurrentStepIndex(i => i + 1);
              return steps[currentStepIndex + 1]?.duration_seconds || 10;
            } else {
              setIsPlaying(false);
              setIsCompleted(true);
              completeMutation.mutate();
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps]);

  const handlePlayPause = () => {
    if (isCompleted) {
      // Restart
      setCurrentStepIndex(0);
      setStepTimeRemaining(steps[0]?.duration_seconds || 10);
      setIsCompleted(false);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkip = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setStepTimeRemaining(steps[currentStepIndex + 1]?.duration_seconds || 10);
    } else {
      setIsPlaying(false);
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setStepTimeRemaining(steps[0]?.duration_seconds || 10);
    setIsCompleted(false);
    setIsPlaying(false);
  };

  if (isLoading || !routine) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const progress = steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 flex flex-col">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-white/60 hover:text-white mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <h1 className="text-2xl font-bold text-white mb-2">{routine.title}</h1>
        <p className="text-white/60 text-sm">{routine.description}</p>
        <div className="mt-2 inline-block px-3 py-1 rounded-full bg-amber-400 text-amber-900 text-xs font-bold">
          +{routine.xp_value || 75} XP
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        <AnimatePresence mode="wait">
          {isCompleted ? (
            <motion.div
              key="completed"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Great Job! 🧠</h2>
              <p className="text-white/60 mb-2">You've completed this mental routine.</p>
              <div className="mb-6 px-4 py-2 bg-amber-400 rounded-full inline-block">
                <span className="text-amber-900 font-bold">+{routine.xp_value || 75} XP Earned!</span>
              </div>
              <Button
                onClick={() => navigate(-1)}
                className="bg-white text-purple-900 hover:bg-white/90"
              >
                Back to Routines
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center w-full max-w-sm"
            >
              {/* Timer Circle */}
              <div className="relative w-48 h-48 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={553}
                    strokeDashoffset={553 - (553 * stepTimeRemaining / (currentStep?.duration_seconds || 10))}
                    initial={false}
                    animate={{
                      strokeDashoffset: 553 - (553 * stepTimeRemaining / (currentStep?.duration_seconds || 10))
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">
                    {stepTimeRemaining}
                  </span>
                </div>
              </div>

              {/* Current Instruction */}
              <p className="text-xl text-white font-medium leading-relaxed px-4">
                {currentStep?.instruction}
              </p>

              {/* Step Progress */}
              <p className="text-white/40 text-sm mt-4">
                Step {currentStepIndex + 1} of {steps.length}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      {!isCompleted && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900 to-transparent px-6 py-8">
          {/* Progress Bar */}
          <div className="max-w-sm mx-auto mb-6">
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={handleRestart}
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            
            <button
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-purple-900 hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7" />
              ) : (
                <Play className="w-7 h-7 ml-1" />
              )}
            </button>
            
            <button
              onClick={handleSkip}
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}