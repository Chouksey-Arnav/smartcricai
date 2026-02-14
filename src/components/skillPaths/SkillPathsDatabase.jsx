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
          { id: 'grip_stance', name: 'Perfect Grip & Stance', type: 'drill', drillId: '6987bd85856186de3e39dc0e', xp: 50, description: 'Master the foundational batting position' },
          { id: 'balance_drill', name: 'Balance & Coordination Drill', type: 'drill', drillId: '6987bd85856186de3e39dc11', xp: 50, description: 'Hold single-leg balance 30 sec each side' },
          { id: 'breathing_basics', name: 'Breathing Control Basics', type: 'mental', mentalId: '6987c30b856186de3e39dc27', xp: 50, description: '2-minute breathing reset routine' },
          { id: 'straight_drive_watch', name: 'Watch: Straight Drive Technique', type: 'youtube', url: 'https://www.youtube.com/watch?v=E64PY-Ckl30', xp: 25, description: 'Study proper straight drive form' }
        ]
      },
      {
        week: 2,
        title: 'Week 2: Movement Quality',
        items: [
          { id: 'front_defense', name: 'Front Foot Defense Drill', type: 'drill', drillId: '6987bd85856186de3e39dc0f', xp: 75, description: 'Learn proper defensive technique' },
          { id: 'catching_basics', name: 'Catching Fundamentals', type: 'drill', drillId: '6987bd85856186de3e39dc11', xp: 50, description: 'Soft hands catching drill' },
          { id: 'bodyweight_strength', name: 'Bodyweight Strength Basics', type: 'fitness', xp: 75, description: '10 clean push-ups & air squats' },
          { id: 'bowling_basics_watch', name: 'Watch: Basic Bowling Mechanics', type: 'youtube', url: 'https://www.youtube.com/watch?v=J4yjJJwH8zY', xp: 25, description: 'Learn bowling fundamentals' }
        ]
      },
      {
        week: 3,
        title: 'Week 3: Technique Building',
        items: [
          { id: 'straight_drive', name: 'Straight Drive Basics', type: 'drill', drillId: '6987bd85856186de3e39dc0f', xp: 75, description: 'Master the straight drive shot' },
          { id: 'bowling_basics', name: 'Basic Bowling Mechanics', type: 'drill', drillId: '6987bd85856186de3e39dc10', xp: 75, description: 'Walk-up bowling form drill' },
          { id: 'confidence_routine', name: 'Confidence Building Routine', type: 'mental', mentalId: '6987c30b856186de3e39dc29', xp: 100, description: 'Daily affirmation and visualization' },
          { id: 'fielding_watch', name: 'Watch: Fielding Basics', type: 'youtube', url: 'https://www.youtube.com/watch?v=Kvhqnax9ueE', xp: 25, description: 'Learn proper fielding techniques' }
        ]
      },
      {
        week: 4,
        title: 'Week 4: Foundation Complete',
        items: [
          { id: 'shadow_batting', name: 'Shadow Batting Routine', type: 'drill', drillId: '6987bd85856186de3e39dc0e', xp: 75, description: 'Controlled shadow swings' },
          { id: 'throwing_basics', name: 'Throwing Accuracy Drill', type: 'drill', drillId: '6987bd85856186de3e39dc10', xp: 50, description: 'Underarm accuracy throws' },
          { id: 'focus_exercise', name: 'Focus & Concentration', type: 'mental', mentalId: '6987c30b856186de3e39dc27', xp: 75, description: 'Build mental focus' },
          { id: 'beginner_assessment', name: 'Foundation Assessment', type: 'youtube', url: 'https://www.youtube.com/watch?v=IwLqjYTZ9Qw', xp: 150, description: 'Review your progress' }
        ]
      }
    ],
    
    totalXP: 1200,
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
          { id: 'power_drive', name: 'Power Drive Repetition', type: 'drill', drillId: '6987bd85856186de3e39dc12', xp: 100, description: 'Build explosive bat speed' },
          { id: 'rotational_power', name: 'Rotational Power Training', type: 'fitness', xp: 100, description: 'Medicine ball rotational throws' },
          { id: 'visualization_basics', name: 'Pre-Performance Visualization', type: 'mental', mentalId: '6987c30b856186de3e39dc2a', xp: 75, description: 'Visualize success before practice' },
          { id: 'power_hitting_watch', name: 'Watch: Power Hitting Techniques', type: 'youtube', url: 'https://www.youtube.com/watch?v=FIvEKIHzI1Q', xp: 25, description: 'Learn power generation' }
        ]
      },
      {
        week: 2,
        title: 'Week 2: Shot Precision',
        items: [
          { id: 'shot_placement', name: 'Shot Placement Grid Drill', type: 'drill', drillId: '6987bd85856186de3e39dc12', xp: 100, description: 'Target specific field zones' },
          { id: 'reaction_drill', name: 'Reaction Ball Training', type: 'drill', drillId: '6987bd85856186de3e39dc11', xp: 75, description: 'Improve hand-eye coordination' },
          { id: 'agility_basics', name: 'Agility & Speed Work', type: 'fitness', xp: 100, description: 'Lateral shuffle and sprint drills' },
          { id: 'placement_watch', name: 'Watch: Shot Placement', type: 'youtube', url: 'https://www.youtube.com/watch?v=uM_JKyh3-Co', xp: 25, description: 'Master shot selection' }
        ]
      },
      {
        week: 3,
        title: 'Week 3: Bowling & Fielding',
        items: [
          { id: 'bowling_rhythm', name: 'Bowling Rhythm Development', type: 'drill', drillId: '6987bd85856186de3e39dc13', xp: 125, description: 'Smooth run-up rhythm drill' },
          { id: 'fielding_agility', name: 'Advanced Fielding Drills', type: 'drill', drillId: '6987bd85856186de3e39dc11', xp: 75, description: 'Lateral movement and quick throws' },
          { id: 'pressure_training', name: 'Pressure Situation Training', type: 'mental', mentalId: '6987c30b856186de3e39dc2b', xp: 100, description: 'Practice under simulated pressure' },
          { id: 'yorker_watch', name: 'Watch: Yorker Bowling', type: 'youtube', url: 'https://www.youtube.com/watch?v=rO24_K5b8hA', xp: 25, description: 'Perfect yorker technique' }
        ]
      },
      {
        week: 4,
        title: 'Week 4: Match Awareness',
        items: [
          { id: 'field_awareness', name: 'Field Awareness Training', type: 'drill', drillId: '6987bd85856186de3e39dc12', xp: 75, description: 'Understand field placements' },
          { id: 'running_smart', name: 'Smart Running Between Wickets', type: 'drill', drillId: '6987bd85856186de3e39dc0e', xp: 75, description: 'Quick singles and twos practice' },
          { id: 'match_mindset', name: 'Match Day Mindset', type: 'mental', mentalId: '6987c30b856186de3e39dc28', xp: 100, description: 'Pre-match mental prep' },
          { id: 'intermediate_assessment', name: 'Skill Builder Assessment', type: 'youtube', url: 'https://www.youtube.com/watch?v=92I1HKqg2jU', xp: 150, description: 'Test your skills' }
        ]
      }
    ],
    
    totalXP: 1400,
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
          { id: 'explosive_batting', name: 'High-Intensity Reaction Drills', type: 'drill', drillId: '6987bd85856186de3e39dc14', xp: 150, description: 'Fast-paced random ball feeds' },
          { id: 'weighted_training', name: 'Weighted Strength Training', type: 'fitness', xp: 150, description: 'Barbell squats and deadlifts' },
          { id: 'competitive_viz', name: 'Competitive Visualization', type: 'mental', mentalId: '6987c30b856186de3e39dc2c', xp: 100, description: 'Match scenario mental rehearsal' },
          { id: 'advanced_power_watch', name: 'Watch: Elite Power Training', type: 'youtube', url: 'https://www.youtube.com/watch?v=vMnw9AEwEW4', xp: 50, description: 'Professional power methods' }
        ]
      },
      {
        week: 2,
        title: 'Week 2: Technical Refinement',
        items: [
          { id: 'late_decision', name: 'Late-Decision Shot Drill', type: 'drill', drillId: '6987bd85856186de3e39dc15', xp: 200, description: 'React and play shots late' },
          { id: 'bowling_speed', name: 'Speed Development Training', type: 'drill', drillId: '6987bd85856186de3e39dc13', xp: 125, description: 'High-intensity spell simulation' },
          { id: 'rotational_power', name: 'Rotational Power Development', type: 'fitness', xp: 150, description: 'Medicine ball explosive throws' },
          { id: 'technique_watch', name: 'Watch: Shot Refinement', type: 'youtube', url: 'https://www.youtube.com/watch?v=b6QPm2qYzGE', xp: 50, description: 'Advanced technical details' }
        ]
      },
      {
        week: 3,
        title: 'Week 3: Match Simulation',
        items: [
          { id: 'match_batting', name: 'Match Situation Batting', type: 'drill', drillId: '6987bd85856186de3e39dc14', xp: 200, description: 'Bat under match conditions' },
          { id: 'fielding_circuits', name: 'Rapid-Fire Fielding Circuits', type: 'drill', drillId: '6987bd85856186de3e39dc16', xp: 125, description: 'High-speed catch and throw' },
          { id: 'fatigue_training', name: 'Training Under Fatigue', type: 'fitness', xp: 150, description: 'Maintain technique when tired' },
          { id: 'match_simulation_watch', name: 'Watch: Match Scenarios', type: 'youtube', url: 'https://www.youtube.com/watch?v=0QkbFjvJp4c', xp: 50, description: 'Study match situations' }
        ]
      },
      {
        week: 4,
        title: 'Week 4: Elite Readiness',
        items: [
          { id: 'decision_making', name: 'Quick Decision Making Under Pressure', type: 'drill', drillId: '6987bd85856186de3e39dc14', xp: 200, description: 'Split-second tactical calls' },
          { id: 'emotional_control', name: 'Emotional Control Training', type: 'mental', mentalId: '6987c30b856186de3e39dc2b', xp: 150, description: 'Stay composed in chaos' },
          { id: 'recovery_protocols', name: 'Elite Recovery Protocols', type: 'fitness', xp: 125, description: 'Professional recovery techniques' },
          { id: 'advanced_assessment', name: 'Performance Developer Assessment', type: 'youtube', url: 'https://www.youtube.com/watch?v=CqoaDHEpQrQ', xp: 200, description: 'Elite-level benchmarks' }
        ]
      }
    ],
    
    totalXP: 2400,
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
          { id: 'biomechanics', name: 'Elite Biomechanics Training', type: 'drill', drillId: '6987bd85856186de3e39dc17', xp: 250, description: 'Optimize movement patterns' },
          { id: 'max_power', name: 'Maximum Power Development', type: 'fitness', xp: 250, description: 'Contrast training protocols' },
          { id: 'identity_anchoring', name: 'Identity Anchoring', type: 'mental', mentalId: '6987c30b856186de3e39dc2d', xp: 200, description: 'Build elite athlete identity' },
          { id: 'biomechanics_watch', name: 'Watch: Elite Biomechanics', type: 'youtube', url: 'https://www.youtube.com/watch?v=zF3TY_uQSLI', xp: 100, description: 'Pro-level movement analysis' }
        ]
      },
      {
        week: 2,
        title: 'Week 2: Tactical Mastery',
        items: [
          { id: 'match_simulation', name: 'Full Match Simulation', type: 'drill', drillId: '6987bd85856186de3e39dc1a', xp: 300, description: 'Complete match scenarios' },
          { id: 'tactical_decision', name: 'Advanced Tactical Decision Making', type: 'drill', drillId: '6987bd85856186de3e39dc14', xp: 300, description: 'Captain-level thinking' },
          { id: 'explosive_training', name: 'Explosive Power Training', type: 'fitness', xp: 250, description: 'Trap bar jumps and loaded movements' },
          { id: 'tactics_watch', name: 'Watch: Game Strategy', type: 'youtube', url: 'https://www.youtube.com/watch?v=1MNPwOXM1J8', xp: 100, description: 'Captain-level tactics' }
        ]
      },
      {
        week: 3,
        title: 'Week 3: Mental Dominance',
        items: [
          { id: 'chaos_control', name: 'Technical Precision Under Chaos', type: 'drill', drillId: '6987bd85856186de3e39dc17', xp: 250, description: 'Maintain form under pressure' },
          { id: 'leadership_training', name: 'Leadership Psychology Training', type: 'mental', mentalId: '6987c30b856186de3e39dc2e', xp: 300, description: 'Lead and inspire teammates' },
          { id: 'recovery_protocols', name: 'Elite Recovery Protocols', type: 'fitness', xp: 200, description: 'Professional recovery techniques' },
          { id: 'mental_mastery_watch', name: 'Watch: Mental Mastery', type: 'youtube', url: 'https://www.youtube.com/watch?v=tpqVhC-ZVSU', xp: 100, description: 'Elite mental training' }
        ]
      },
      {
        week: 4,
        title: 'Week 4: Championship Standard',
        items: [
          { id: 'game_intelligence', name: 'Game Intelligence & Reading', type: 'drill', drillId: '6987bd85856186de3e39dc1a', xp: 300, description: 'Read the game like a pro' },
          { id: 'captaincy_mastery', name: 'Captaincy & Strategy Mastery', type: 'drill', drillId: '6987bd85856186de3e39dc14', xp: 300, description: 'Lead your team to victory' },
          { id: 'championship_prep', name: 'Championship Preparation', type: 'mental', mentalId: '6987c30b856186de3e39dc2d', xp: 250, description: 'Peak performance state' },
          { id: 'pro_assessment', name: 'Elite Builder Assessment', type: 'youtube', url: 'https://www.youtube.com/watch?v=O0QhscJ0FXg', xp: 400, description: 'Professional-level evaluation' }
        ]
      }
    ],
    
    totalXP: 4100,
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