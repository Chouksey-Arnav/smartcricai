// Complete Skill Paths System Database
// Structured development tracks for cricket training

export const skillPathsData = {
  beginner: {
    id: 'beginner',
    name: 'Foundation Builder',
    subtitle: 'Build fundamental skills and confidence',
    icon: '🌱',
    color: 'emerald',
    unlockXP: 0,
    isPremium: false,
    
    weeks: [
      {
        week: 1,
        title: 'Week 1: Core Fundamentals',
        items: [
          { id: 'grip_stance', name: 'Perfect Grip & Stance', type: 'batting', xp: 50, description: 'Master the foundational batting position' },
          { id: 'balance_drill', name: 'Balance & Coordination Drill', type: 'physical', xp: 50, description: 'Hold single-leg balance 30 sec each side' },
          { id: 'breathing_basics', name: 'Breathing Control Basics', type: 'mental', xp: 50, description: '2-minute breathing reset routine' }
        ]
      },
      {
        week: 2,
        title: 'Week 2: Movement Quality',
        items: [
          { id: 'front_defense', name: 'Front Foot Defense Drill', type: 'batting', xp: 75, description: 'Learn proper defensive technique' },
          { id: 'catching_basics', name: 'Catching Fundamentals', type: 'fielding', xp: 50, description: 'Soft hands catching drill' },
          { id: 'bodyweight_strength', name: 'Bodyweight Strength Basics', type: 'physical', xp: 75, description: '10 clean push-ups & air squats' }
        ]
      },
      {
        week: 3,
        title: 'Week 3: Technique Building',
        items: [
          { id: 'straight_drive', name: 'Straight Drive Basics', type: 'batting', xp: 75, description: 'Master the straight drive shot' },
          { id: 'bowling_basics', name: 'Basic Bowling Mechanics', type: 'bowling', xp: 75, description: 'Walk-up bowling form drill' },
          { id: 'confidence_routine', name: 'Confidence Building Routine', type: 'mental', xp: 100, description: 'Daily affirmation and visualization' }
        ]
      },
      {
        week: 4,
        title: 'Week 4: Foundation Complete',
        items: [
          { id: 'shadow_batting', name: 'Shadow Batting Routine', type: 'batting', xp: 75, description: 'Controlled shadow swings' },
          { id: 'throwing_basics', name: 'Throwing Accuracy Drill', type: 'fielding', xp: 50, description: 'Underarm accuracy throws' },
          { id: 'beginner_assessment', name: 'Foundation Assessment', type: 'assessment', xp: 150, description: 'Complete all beginner benchmarks' }
        ]
      }
    ],
    
    totalXP: 975,
    badge: { name: 'Foundation Champion', emoji: '🏅', rarity: 'common' }
  },

  intermediate: {
    id: 'intermediate',
    name: 'Skill Builder',
    subtitle: 'Develop explosive skills and match awareness',
    icon: '🎯',
    color: 'blue',
    unlockXP: 1000,
    isPremium: false,
    
    weeks: [
      {
        week: 1,
        title: 'Week 1: Power Development',
        items: [
          { id: 'power_drive', name: 'Power Drive Repetition', type: 'batting', xp: 100, description: 'Build explosive bat speed' },
          { id: 'rotational_power', name: 'Rotational Power Training', type: 'physical', xp: 100, description: 'Medicine ball rotational throws' },
          { id: 'visualization_basics', name: 'Pre-Performance Visualization', type: 'mental', xp: 75, description: 'Visualize success before practice' }
        ]
      },
      {
        week: 2,
        title: 'Week 2: Shot Precision',
        items: [
          { id: 'shot_placement', name: 'Shot Placement Grid Drill', type: 'batting', xp: 100, description: 'Target specific field zones' },
          { id: 'reaction_drill', name: 'Reaction Ball Training', type: 'batting', xp: 75, description: 'Improve hand-eye coordination' },
          { id: 'agility_basics', name: 'Agility & Speed Work', type: 'physical', xp: 100, description: 'Lateral shuffle and sprint drills' }
        ]
      },
      {
        week: 3,
        title: 'Week 3: Bowling & Fielding',
        items: [
          { id: 'bowling_rhythm', name: 'Bowling Rhythm Development', type: 'bowling', xp: 125, description: 'Smooth run-up rhythm drill' },
          { id: 'fielding_agility', name: 'Advanced Fielding Drills', type: 'fielding', xp: 75, description: 'Lateral movement and quick throws' },
          { id: 'pressure_training', name: 'Pressure Situation Training', type: 'mental', xp: 100, description: 'Practice under simulated pressure' }
        ]
      },
      {
        week: 4,
        title: 'Week 4: Match Awareness',
        items: [
          { id: 'field_awareness', name: 'Field Awareness Training', type: 'tactics', xp: 75, description: 'Understand field placements' },
          { id: 'running_smart', name: 'Smart Running Between Wickets', type: 'tactics', xp: 75, description: 'Quick singles and twos practice' },
          { id: 'intermediate_assessment', name: 'Skill Builder Assessment', type: 'assessment', xp: 150, description: 'Complete intermediate benchmarks' }
        ]
      }
    ],
    
    totalXP: 1225,
    badge: { name: 'Skill Master', emoji: '🥈', rarity: 'rare' }
  },

  advanced: {
    id: 'advanced',
    name: 'Performance Developer',
    subtitle: 'Elite training for competitive excellence',
    icon: '⚡',
    color: 'purple',
    unlockXP: 2500,
    isPremium: false,
    
    weeks: [
      {
        week: 1,
        title: 'Week 1: Advanced Power',
        items: [
          { id: 'explosive_batting', name: 'High-Intensity Reaction Drills', type: 'batting', xp: 150, description: 'Fast-paced random ball feeds' },
          { id: 'weighted_training', name: 'Weighted Strength Training', type: 'physical', xp: 150, description: 'Barbell squats and deadlifts' },
          { id: 'competitive_viz', name: 'Competitive Visualization', type: 'mental', xp: 100, description: 'Match scenario mental rehearsal' }
        ]
      },
      {
        week: 2,
        title: 'Week 2: Technical Refinement',
        items: [
          { id: 'late_decision', name: 'Late-Decision Shot Drill', type: 'batting', xp: 200, description: 'React and play shots late' },
          { id: 'bowling_speed', name: 'Speed Development Training', type: 'bowling', xp: 125, description: 'High-intensity spell simulation' },
          { id: 'rotational_power', name: 'Rotational Power Development', type: 'physical', xp: 150, description: 'Medicine ball explosive throws' }
        ]
      },
      {
        week: 3,
        title: 'Week 3: Match Simulation',
        items: [
          { id: 'match_batting', name: 'Match Situation Batting', type: 'batting', xp: 200, description: 'Bat under match conditions' },
          { id: 'fielding_circuits', name: 'Rapid-Fire Fielding Circuits', type: 'fielding', xp: 125, description: 'High-speed catch and throw' },
          { id: 'fatigue_training', name: 'Training Under Fatigue', type: 'physical', xp: 150, description: 'Maintain technique when tired' }
        ]
      },
      {
        week: 4,
        title: 'Week 4: Elite Readiness',
        items: [
          { id: 'decision_making', name: 'Quick Decision Making Under Pressure', type: 'tactics', xp: 200, description: 'Split-second tactical calls' },
          { id: 'emotional_control', name: 'Emotional Control Training', type: 'mental', xp: 150, description: 'Stay composed in chaos' },
          { id: 'advanced_assessment', name: 'Performance Developer Assessment', type: 'assessment', xp: 200, description: 'Elite-level benchmarks' }
        ]
      }
    ],
    
    totalXP: 2100,
    badge: { name: 'Advanced Elite', emoji: '🥇', rarity: 'epic' }
  },

  pro: {
    id: 'pro',
    name: 'Elite Builder',
    subtitle: 'Professional-level training system',
    icon: '👑',
    color: 'amber',
    unlockXP: 5000,
    isPremium: true,
    
    weeks: [
      {
        week: 1,
        title: 'Week 1: Force Production',
        items: [
          { id: 'biomechanics', name: 'Elite Biomechanics Training', type: 'batting', xp: 250, description: 'Optimize movement patterns' },
          { id: 'max_power', name: 'Maximum Power Development', type: 'physical', xp: 250, description: 'Contrast training protocols' },
          { id: 'identity_anchoring', name: 'Identity Anchoring', type: 'mental', xp: 200, description: 'Build elite athlete identity' }
        ]
      },
      {
        week: 2,
        title: 'Week 2: Tactical Mastery',
        items: [
          { id: 'match_simulation', name: 'Full Match Simulation', type: 'batting', xp: 300, description: 'Complete match scenarios' },
          { id: 'tactical_decision', name: 'Advanced Tactical Decision Making', type: 'tactics', xp: 300, description: 'Captain-level thinking' },
          { id: 'explosive_training', name: 'Explosive Power Training', type: 'physical', xp: 250, description: 'Trap bar jumps and loaded movements' }
        ]
      },
      {
        week: 3,
        title: 'Week 3: Mental Dominance',
        items: [
          { id: 'chaos_control', name: 'Technical Precision Under Chaos', type: 'batting', xp: 250, description: 'Maintain form under pressure' },
          { id: 'leadership_training', name: 'Leadership Psychology Training', type: 'mental', xp: 300, description: 'Lead and inspire teammates' },
          { id: 'recovery_protocols', name: 'Elite Recovery Protocols', type: 'physical', xp: 200, description: 'Professional recovery techniques' }
        ]
      },
      {
        week: 4,
        title: 'Week 4: Championship Standard',
        items: [
          { id: 'game_intelligence', name: 'Game Intelligence & Reading', type: 'tactics', xp: 300, description: 'Read the game like a pro' },
          { id: 'captaincy_mastery', name: 'Captaincy & Strategy Mastery', type: 'tactics', xp: 300, description: 'Lead your team to victory' },
          { id: 'pro_assessment', name: 'Elite Builder Assessment', type: 'assessment', xp: 400, description: 'Professional-level evaluation' }
        ]
      }
    ],
    
    totalXP: 3550,
    badge: { name: 'Pro Champion', emoji: '👑', rarity: 'legendary' }
  }
};

// Helper functions
export function getPathByLevel(level) {
  return skillPathsData[level];
}

export function getAllPaths() {
  return Object.values(skillPathsData);
}

export function getPathTotalItems(level) {
  const path = skillPathsData[level];
  if (!path) return 0;
  return path.weeks.reduce((total, week) => total + week.items.length, 0);
}

export function getPathProgress(completedItems, level) {
  const totalItems = getPathTotalItems(level);
  if (totalItems === 0) return 0;
  return Math.round((completedItems.length / totalItems) * 100);
}