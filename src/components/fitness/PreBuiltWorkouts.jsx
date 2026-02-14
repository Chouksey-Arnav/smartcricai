import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Clock, Target, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const preBuiltWorkouts = [
  {
    id: 'arms_beginner_strength',
    title: 'Beginner Arms Builder',
    target: 'arms',
    level: 'beginner',
    goal: 'build muscle',
    duration: '15-20',
    exercises: '4 exercises',
    description: 'Build foundational arm strength',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'chest_intermediate_power',
    title: 'Explosive Chest Training',
    target: 'chest',
    level: 'intermediate',
    goal: 'build muscle',
    duration: '20-25',
    exercises: '5 exercises',
    description: 'Develop powerful chest muscles',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'legs_advanced_strength',
    title: 'Advanced Leg Power',
    target: 'legs',
    level: 'advanced',
    goal: 'build muscle',
    duration: '25+',
    exercises: '6 exercises',
    description: 'Elite lower body development',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'fullbody_beginner_cardio',
    title: 'Full Body Fat Burn',
    target: 'full body',
    level: 'beginner',
    goal: 'lose weight',
    duration: '15-20',
    exercises: '4 exercises',
    description: 'High-intensity calorie burner',
    color: 'from-orange-500 to-yellow-500'
  },
  {
    id: 'core_intermediate_strength',
    title: 'Core Strength Builder',
    target: 'core',
    level: 'intermediate',
    goal: 'build muscle',
    duration: '15-20',
    exercises: '4 exercises',
    description: 'Build a rock-solid core',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'shoulders_advanced_power',
    title: 'Shoulder Power Elite',
    target: 'shoulders',
    level: 'advanced',
    goal: 'build muscle',
    duration: '20-25',
    exercises: '5 exercises',
    description: 'Build powerful shoulders',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'back_beginner_strength',
    title: 'Back Basics Strength',
    target: 'back',
    level: 'beginner',
    goal: 'build muscle',
    duration: '15-20',
    exercises: '4 exercises',
    description: 'Foundation for strong back',
    color: 'from-slate-600 to-slate-700'
  },
  {
    id: 'arms_intermediate_cut',
    title: 'Arms Fat Shredder',
    target: 'arms',
    level: 'intermediate',
    goal: 'lose weight',
    duration: '15-20',
    exercises: '4 exercises',
    description: 'Tone and define your arms',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'legs_beginner_endurance',
    title: 'Leg Endurance Foundation',
    target: 'legs',
    level: 'beginner',
    goal: 'keep fit',
    duration: '15-20',
    exercises: '4 exercises',
    description: 'Build leg stamina and strength',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'fullbody_advanced_athlete',
    title: 'Elite Athlete Full Body',
    target: 'full body',
    level: 'advanced',
    goal: 'build muscle',
    duration: '25+',
    exercises: '6 exercises',
    description: 'Complete athletic development',
    color: 'from-amber-600 to-red-600'
  },
  {
    id: 'chest_beginner_pushup',
    title: 'Push-Up Progression',
    target: 'chest',
    level: 'beginner',
    goal: 'build muscle',
    duration: '10-15',
    exercises: '3 exercises',
    description: 'Master the push-up',
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'core_advanced_stability',
    title: 'Advanced Core Stability',
    target: 'core',
    level: 'advanced',
    goal: 'build muscle',
    duration: '20-25',
    exercises: '5 exercises',
    description: 'Unbreakable core strength',
    color: 'from-teal-600 to-cyan-600'
  },
  {
    id: 'shoulders_beginner_stability',
    title: 'Shoulder Stability',
    target: 'shoulders',
    level: 'beginner',
    goal: 'keep fit',
    duration: '10-15',
    exercises: '3 exercises',
    description: 'Build stable shoulders',
    color: 'from-violet-500 to-purple-500'
  },
  {
    id: 'back_intermediate_power',
    title: 'Back Power Builder',
    target: 'back',
    level: 'intermediate',
    goal: 'build muscle',
    duration: '20-25',
    exercises: '5 exercises',
    description: 'Strong, powerful back',
    color: 'from-gray-700 to-slate-800'
  },
  {
    id: 'fullbody_beginner_maintenance',
    title: 'Stay Fit Full Body',
    target: 'full body',
    level: 'beginner',
    goal: 'keep fit',
    duration: '15-20',
    exercises: '4 exercises',
    description: 'Maintain overall fitness',
    color: 'from-lime-500 to-green-500'
  },
  {
    id: 'arms_advanced_definition',
    title: 'Arm Definition Elite',
    target: 'arms',
    level: 'advanced',
    goal: 'build muscle',
    duration: '20-25',
    exercises: '5 exercises',
    description: 'Sculpted, defined arms',
    color: 'from-cyan-600 to-blue-600'
  },
  {
    id: 'legs_pro_explosive',
    title: 'Explosive Leg Power Pro',
    target: 'legs',
    level: 'pro',
    goal: 'build muscle',
    duration: '25+',
    exercises: '6 exercises',
    description: 'Maximum leg explosiveness',
    color: 'from-red-600 to-rose-700'
  },
  {
    id: 'core_beginner_foundation',
    title: 'Core Foundation',
    target: 'core',
    level: 'beginner',
    goal: 'build muscle',
    duration: '10-15',
    exercises: '3 exercises',
    description: 'Start your core journey',
    color: 'from-emerald-600 to-green-600'
  },
  {
    id: 'chest_pro_beast',
    title: 'Pro Chest Beast Mode',
    target: 'chest',
    level: 'pro',
    goal: 'build muscle',
    duration: '25+',
    exercises: '6 exercises',
    description: 'Elite chest development',
    color: 'from-orange-600 to-red-700'
  },
  {
    id: 'shoulders_intermediate_balance',
    title: 'Balanced Shoulder Growth',
    target: 'shoulders',
    level: 'intermediate',
    goal: 'build muscle',
    duration: '15-20',
    exercises: '4 exercises',
    description: 'Even shoulder development',
    color: 'from-indigo-600 to-blue-600'
  },
];

export default function PreBuiltWorkouts({ onSelect }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Dumbbell className="w-5 h-5 text-purple-600" />
        <h3 className="font-bold text-slate-800 dark:text-white">Curated Training Programs</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto scrollbar-visible pr-2">
        {preBuiltWorkouts.map((workout, index) => (
          <motion.button
            key={workout.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(workout.target, workout.level, workout.goal, workout.duration)}
            className={cn(
              "bg-gradient-to-r p-4 rounded-xl text-left shadow-md hover:shadow-lg transition-all",
              workout.color,
              "text-white"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-bold text-base mb-1">{workout.title}</h4>
                <p className="text-xs text-white/80">{workout.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 shrink-0 ml-2" />
            </div>
            <div className="flex items-center gap-3 text-xs text-white/90 mt-3">
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {workout.exercises}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {workout.duration} min
              </span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full capitalize text-xs">
                {workout.level}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}