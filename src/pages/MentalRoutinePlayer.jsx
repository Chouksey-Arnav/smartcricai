import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ALL_MENTAL_ROUTINES } from '@/components/mental/MentalRoutinesData';
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

// Box Breathing Visualizer - large, immersive square with glow effects
function BoxBreathingVisualizer({ stepTimeRemaining, stepDuration }) {
  const totalCycleDuration = 16;
  const phases = ['Inhale', 'Hold', 'Exhale', 'Hold'];
  const phaseColors = ['#34d399', '#60a5fa', '#f472b6', '#a78bfa'];
  const phaseLabels = ['Breathe In', 'Hold', 'Breathe Out', 'Hold'];
  const elapsed = stepDuration - stepTimeRemaining;
  const cyclePos = elapsed % totalCycleDuration;
  const phaseIndex = Math.floor(cyclePos / 4);
  const phaseTime = cyclePos % 4;

  const size = 360;
  const pad = 44;
  const r = 36;

  const distAlongPerimeter = (cyclePos / totalCycleDuration) * (size * 4);
  const segLen = size;

  let dotX, dotY;
  if (distAlongPerimeter <= segLen) {
    dotX = pad + distAlongPerimeter; dotY = pad;
  } else if (distAlongPerimeter <= segLen * 2) {
    dotX = pad + size; dotY = pad + (distAlongPerimeter - segLen);
  } else if (distAlongPerimeter <= segLen * 3) {
    dotX = pad + size - (distAlongPerimeter - segLen * 2); dotY = pad + size;
  } else {
    dotX = pad; dotY = pad + size - (distAlongPerimeter - segLen * 3);
  }

  const color = phaseColors[phaseIndex];
  const secondsLeft = Math.max(1, 4 - Math.floor(phaseTime));
  const svgW = size + pad * 2;

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={phases[phaseIndex]}
          initial={{ opacity: 0, y: -12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-2"
        >
          <p className="text-4xl font-black tracking-wide" style={{ color }}>{phaseLabels[phaseIndex]}</p>
          <p className="text-white/50 text-sm mt-1 font-medium">4 counts each side</p>
        </motion.div>
      </AnimatePresence>
      <svg width={svgW} height={svgW} style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="boxFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0.04" />
          </radialGradient>
          <filter id="boxGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="dotGlowBox">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Outer glow rect */}
        <rect x={pad - 6} y={pad - 6} width={size + 12} height={size + 12} rx={r + 8}
          fill="none" stroke={color} strokeWidth={2} strokeOpacity={0.18} />
        {/* Main square */}
        <rect x={pad} y={pad} width={size} height={size} rx={r}
          fill="url(#boxFill)" stroke={color} strokeWidth={5} strokeOpacity={0.9}
          filter="url(#boxGlow)" />
        {/* Corner circles */}
        {[[pad,pad],[pad+size,pad],[pad+size,pad+size],[pad,pad+size]].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r={10} fill={phaseColors[i]} opacity={0.85} />
        ))}
        {/* Glow halo */}
        <motion.circle cx={dotX} cy={dotY} r={34}
          fill={color} opacity={0.18}
          animate={{ cx: dotX, cy: dotY }}
          transition={{ duration: 1.0, ease: 'linear' }}
        />
        {/* Main dot */}
        <motion.circle cx={dotX} cy={dotY} r={20}
          fill={color} stroke="white" strokeWidth={3}
          filter="url(#dotGlowBox)"
          animate={{ cx: dotX, cy: dotY }}
          transition={{ duration: 1.0, ease: 'linear' }}
        />
      </svg>
      <motion.p
        key={secondsLeft}
        initial={{ scale: 1.3, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-white/70 text-xl font-bold mt-2"
      >{secondsLeft}s</motion.p>
    </div>
  );
}

// 4-7-8 Breathing Triangle Visualizer — blue=inhale, red=hold, green=exhale
function BreathingTriangleVisualizer({ stepTimeRemaining, stepDuration }) {
  const phases = [
    { label: 'Inhale', duration: 4, color: '#60a5fa' },   // blue
    { label: 'Hold',   duration: 7, color: '#f87171' },   // red
    { label: 'Exhale', duration: 8, color: '#34d399' },   // green
  ];
  const totalCycle = 19;
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

  const svgW = 340, svgH = 320;
  const cx = svgW / 2, cy = svgH / 2 + 10, r = 130;
  const pts = [
    { x: cx - r * Math.sin(Math.PI * 2 / 3), y: cy + r * Math.cos(Math.PI * 2 / 3) },
    { x: cx + r * Math.sin(Math.PI * 2 / 3), y: cy + r * Math.cos(Math.PI * 2 / 3) },
    { x: cx, y: cy - r },
  ];

  // edges: 0→2 (inhale), 2→1 (hold), 1→0 (exhale)
  const edgePairs = [[0, 2], [2, 1], [1, 0]];
  const [sIdx, eIdx] = edgePairs[phaseIndex];
  const dotX = pts[sIdx].x + (pts[eIdx].x - pts[sIdx].x) * phaseProgress;
  const dotY = pts[sIdx].y + (pts[eIdx].y - pts[sIdx].y) * phaseProgress;
  const secondsLeft = Math.max(1, phases[phaseIndex].duration - Math.floor(cyclePos - acc));
  const triPoints = pts.map(p => `${p.x},${p.y}`).join(' ');
  const color = phases[phaseIndex].color;
  const nextColor = phases[(phaseIndex + 1) % 3].color;

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={phases[phaseIndex].label}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.35 }}
          className="text-3xl font-bold mb-2"
          style={{ color }}
        >
          {phases[phaseIndex].label}
        </motion.p>
      </AnimatePresence>
      <svg width={svgW} height={svgH}>
        <defs>
          <linearGradient id="triGrad478" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={nextColor} stopOpacity="0.08" />
          </linearGradient>
          <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.7" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        <polygon points={triPoints} fill="url(#triGrad478)" stroke={color} strokeWidth={5} strokeLinejoin="round" opacity={0.95} />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={8} fill={phases[i].color} opacity={0.85} />
        ))}
        {/* Glow halo around dot */}
        <motion.circle
          cx={dotX} cy={dotY} r={28}
          fill="url(#dotGlow)"
          animate={{ cx: dotX, cy: dotY }}
          transition={{ duration: 0.5, ease: 'linear' }}
        />
        {/* Main dot */}
        <motion.circle
          cx={dotX} cy={dotY} r={16}
          fill={color}
          stroke="white"
          strokeWidth={2.5}
          animate={{ cx: dotX, cy: dotY }}
          transition={{ duration: 0.5, ease: 'linear' }}
        />
      </svg>
      <p className="text-white/60 text-sm mt-1">{secondsLeft}s</p>
    </div>
  );
}

export default function MentalRoutinePlayer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const routineId = urlParams.get('id');
  const skillPathId = urlParams.get('skillPathId');
  const skillPathItemId = urlParams.get('skillPathItemId');

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

  const isLocalRoutine = routineId?.startsWith('local_');

  const { data: routine, isLoading } = useQuery({
    queryKey: ['mentalRoutine', routineId],
    queryFn: async () => {
      if (isLocalRoutine) {
        const index = parseInt(routineId.replace('local_', ''), 10);
        return ALL_MENTAL_ROUTINES[index] ? { ...ALL_MENTAL_ROUTINES[index], id: routineId } : null;
      }
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
      if (!routine) return;
      // For local routines still track XP/progress using a synthetic ID
      const effectiveId = isLocalRoutine ? `mental_${routine.title.replace(/\s+/g, '_')}` : routine.id;
      const guestId = user?.email || localStorage.getItem('smartcrick_guest_id') || 'guest@smartcrick.app';
      const xpEarned = routine.xp_value || 75;
      const today = new Date().toISOString().split('T')[0];

      // Update UserProgress - XP, streak, completed_mental_routines
      const progressList = await base44.entities.UserProgress.filter({ user_email: guestId });
      const currentProgress = progressList[0] || null;
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      let newStreak = currentProgress?.current_streak || 0;
      if (currentProgress?.last_practice_date !== today) {
        newStreak = currentProgress?.last_practice_date === yesterdayStr ? newStreak + 1 : 1;
      }
      const longestStreak = Math.max(newStreak, currentProgress?.longest_streak || 0);
      const completedRoutines = [...new Set([...(currentProgress?.completed_mental_routines || []), effectiveId])];

      if (currentProgress?.id) {
        await base44.entities.UserProgress.update(currentProgress.id, {
          total_xp: (currentProgress.total_xp || 0) + xpEarned,
          current_streak: newStreak,
          longest_streak: longestStreak,
          last_practice_date: today,
          completed_mental_routines: completedRoutines,
          total_practice_minutes: (currentProgress.total_practice_minutes || 0) + Math.ceil((routine.duration_seconds || 300) / 60),
        });
      } else {
        await base44.entities.UserProgress.create({
          user_email: guestId,
          total_xp: xpEarned,
          current_streak: 1,
          longest_streak: 1,
          last_practice_date: today,
          completed_mental_routines: [routine.id],
        });
      }

      // Update Leaderboard - XP, streak, mental_sessions
      const leaderboards = await base44.entities.Leaderboard.filter({ user_email: guestId });
      if (leaderboards.length > 0) {
        await base44.entities.Leaderboard.update(leaderboards[0].id, {
          total_xp: (leaderboards[0].total_xp || 0) + xpEarned,
          current_streak: newStreak,
          highest_streak: Math.max(newStreak, leaderboards[0].highest_streak || 0),
          mental_sessions_completed: (leaderboards[0].mental_sessions_completed || 0) + 1,
          weekly_minutes: (leaderboards[0].weekly_minutes || 0) + Math.ceil((routine.duration_seconds || 300) / 60),
        });
      }

      // Notification
      await base44.entities.Notification.create({
        user_email: guestId,
        type: 'mental',
        title: `Mental Training Done! +${xpEarned} XP`,
        message: `"${routine.title}" completed! Your mind is getting stronger!`,
        related_id: routine.id
      });
    },
    onSuccess: async () => {
      // Auto-check off mental in skill path if navigated from one
      if (skillPathId && skillPathItemId) {
        try {
          const paths = await base44.entities.SkillPath.filter({ id: skillPathId });
          const path = paths[0];
          if (path && !path.completed_items.includes(skillPathItemId)) {
            await base44.entities.SkillPath.update(skillPathId, {
              completed_items: [...path.completed_items, skillPathItemId],
              xp: (path.xp || 0) + (routine?.xp_value || 75),
            });
          }
        } catch (e) { console.error('SkillPath update failed:', e); }
      }
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['completedWorkouts'] });
      queryClient.invalidateQueries({ queryKey: ['homeStats'] });
      queryClient.invalidateQueries({ queryKey: ['skillPath'] });
      queryClient.refetchQueries({ queryKey: ['userProgress'] });
      // Notify SmartStart to check off this mental session for today
      window.dispatchEvent(new CustomEvent('smartstart_item_completed', { detail: { type: 'mental', id: routineId, title: routine?.title } }));
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
        <p className="text-white text-sm">{routine.description}</p>
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
              {/* Visualizer / Timer */}
              {routine?.title?.toLowerCase().includes('box breath') ? (
                <div className="mb-6">
                  <BoxBreathingVisualizer stepTimeRemaining={stepTimeRemaining} stepDuration={currentStep?.duration_seconds || 16} />
                </div>
              ) : (routine?.title?.toLowerCase().includes('4-7-8') || routine?.title?.toLowerCase().includes('478')) ? (
                <div className="mb-6">
                  <BreathingTriangleVisualizer stepTimeRemaining={stepTimeRemaining} stepDuration={currentStep?.duration_seconds || 19} />
                </div>
              ) : (
                <div className="relative w-48 h-48 mx-auto mb-8">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                    <motion.circle
                      cx="96" cy="96" r="88" stroke="white" strokeWidth="8" fill="none"
                      strokeLinecap="round" strokeDasharray={553}
                      strokeDashoffset={553 - (553 * stepTimeRemaining / (currentStep?.duration_seconds || 10))}
                      initial={false}
                      animate={{ strokeDashoffset: 553 - (553 * stepTimeRemaining / (currentStep?.duration_seconds || 10)) }}
                      transition={{ duration: 0.3 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold text-white">{stepTimeRemaining}</span>
                  </div>
                </div>
              )}

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