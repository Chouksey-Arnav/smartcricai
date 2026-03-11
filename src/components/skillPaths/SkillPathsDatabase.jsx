// Complete Skill Paths Database - Batting, Bowling, Wicket Keeping
// Each category has 4 levels × 5 weeks × 8 items (2 workouts + 3 mental + 3 drills)

// XP values match actual activity defaults: Drill=50, Mental=75, Workout=100
const XP = {
  beginner:     { workout: 100, mental: 75, drill: 50 },
  intermediate: { workout: 100, mental: 75, drill: 50 },
  advanced:     { workout: 100, mental: 75, drill: 50 },
  pro:          { workout: 100, mental: 75, drill: 50 },
};

const TOTAL_XP = {
  beginner:     5 * (2*100 + 3*75 + 3*50), // 2875
  intermediate: 5 * (2*100 + 3*75 + 3*50), // 2875
  advanced:     5 * (2*100 + 3*75 + 3*50), // 2875
  pro:          5 * (2*100 + 3*75 + 3*50), // 2875
};

function buildLevelWeeks(catKey, levelKey, weeksData) {
  const xp = XP[levelKey];
  return weeksData.map((w, wIdx) => ({
    week: wIdx + 1,
    title: w.title,
    items: [
      ...w.workouts.map((name, i) => ({
        id: `${catKey}_${levelKey}_w${wIdx+1}_wo${i}`,
        name, type: 'workout', xp: xp.workout,
        description: `Complete the ${name} workout session`
      })),
      ...w.mentals.map((name, i) => ({
        id: `${catKey}_${levelKey}_w${wIdx+1}_me${i}`,
        name, type: 'mental', xp: xp.mental,
        description: `"${name}" — mental training session`
      })),
      ...w.drills.map((name, i) => ({
        id: `${catKey}_${levelKey}_w${wIdx+1}_dr${i}`,
        name, type: 'drill', xp: xp.drill,
        description: `Practice drill: ${name}`
      }))
    ]
  }));
}

// ─── RAW WEEK DATA ────────────────────────────────────────────────────────────

const BATTING = {
  beginner: [
    { title: 'Week 1: Foundation Building', workouts: ['Chest & Core Beginner', 'Legs & Core Beginner'], mentals: ['5-4-3-2-1 Grounding', 'Pre-Game Activation', 'Confidence Countdown'], drills: ['Shadow Batting', 'Forward Defensive Block', 'Straight Drive Basics'] },
    { title: 'Week 2: Technique Foundations', workouts: ['Upper Body Beginner Foundation', 'Core Beginner Basics'], mentals: ['Focus Lock-In', 'Positive Morning Anchor', 'Win the Morning'], drills: ['Shadow Batting Practice', 'Basic Front Foot Defense', 'Running & Calling Communication'] },
    { title: 'Week 3: Footwork & Focus', workouts: ['Legs Beginner Strength', 'Back & Posture Fix'], mentals: ['Focus on the Next Ball', '10-Second Rule', 'Countdown to Clarity'], drills: ['Defensive Footwork Against Spin', 'Shadow Batting - No Ball', 'Quick Singles Practice'] },
    { title: 'Week 4: Building Confidence', workouts: ['Arms Beginner Blast', 'Total Body Toning'], mentals: ['Celebrate the Small Wins', 'Self-Compassion Break', 'The Micro-Win Review'], drills: ['Shadow Batting Mastery', 'Wall Bounce Batting', 'Cone Placement Batting'] },
    { title: 'Week 5: Match Readiness', workouts: ['Full Body Quick Tone', 'Morning Energy Boost'], mentals: ['Gratitude for the Journey', 'Mental Recovery Sprint', 'Reset After a Duck'], drills: ['Straight Drive Practice', 'Forward Defensive Block', 'Basic Front Foot Defense'] },
  ],
  intermediate: [
    { title: 'Week 1: Stroke Expansion', workouts: ['Back Strength Builder', 'Arms & Core Power'], mentals: ['Self-Talk Rewrite', 'Dealing with Nerves Before Batting', 'Pre-Performance Calm'], drills: ['Back Foot Defense Mastery', 'Cover Drive Timing', 'Cut Shot Precision'] },
    { title: 'Week 2: Power & Timing', workouts: ['Core Intermediate Shred', 'Full Body Intermediate Power'], mentals: ['Anchoring Your Peak State', 'The Mental Highlight Reel', 'Focus on What You Can Control'], drills: ['Power Hitting - Straight Bat', 'Shadow Batting Tempo Control', 'Power Hitting Drills'] },
    { title: 'Week 3: Decision Making Under Pressure', workouts: ['Legs Intermediate Circuit', 'Abs Intermediate Carve'], mentals: ['Decision Clarity Under Pressure', 'Sensory Narrowing', 'Breathing Through a Batting Collapse'], drills: ['Pace vs Spin Decision', 'Running Between Wickets - Decision Making', 'Ball Tracking Excellence'] },
    { title: 'Week 4: Aggressive Batting', workouts: ['Upper Body Pump Builder', 'Core Shred Express'], mentals: ['Craving the Challenge', 'Competition as Fuel', 'Embrace the Discomfort'], drills: ['Power Hitting Session', 'Pull Shot Mastery', 'Shadow Cricket Footwork Flow'] },
    { title: 'Week 5: Match Simulation', workouts: ['Full Body Fat Burn Intermediate', 'Endurance Builder Intermediate'], mentals: ['High Stakes Rehearsal', 'Handling the Unplayable Ball', 'Reset After a Duck'], drills: ['Net Session Batting', 'Back Foot Punch', 'Power Hitting Progression'] },
  ],
  advanced: [
    { title: 'Week 1: Elite Technique', workouts: ['Core Advanced Destroyer', 'Legs Advanced Strength'], mentals: ['Calm Under Pressure Visualisation', 'The Perfect Performance', 'High Stakes Rehearsal'], drills: ['Yorker Survival Training', 'Match Pressure Batting', 'Yorker Defense Master'] },
    { title: 'Week 2: Power Mechanics', workouts: ['Power Strength Advanced', 'Full Body Athlete Builder'], mentals: ['Future-Pacing Success', 'Anchoring Your Peak State', 'Master Skill Replay'], drills: ['Power Hitting Biomechanics', 'Power Hitting Drills', 'Slog Sweep Power'] },
    { title: 'Week 3: Yorker Specialist', workouts: ['Back Advanced Domination', 'Chest Advanced Power'], mentals: ['Decision Clarity Under Pressure', 'Pressure Is Privilege', 'Cold Pressure Simulation'], drills: ['Advanced Yorker Defense', 'Yorker Defense Challenge', 'Yorker Defense Mastery'] },
    { title: 'Week 4: Sweep & Reverse', workouts: ['Mobility & Flexibility Advanced', 'Arms Advanced Strength'], mentals: ['Trusting Instinct', 'Responding to Unfairness', 'The Bounce-Back Blueprint'], drills: ['Sweep Shot Specialist', 'Reverse Sweep Under Pressure', 'Advanced Switch Hit Training'] },
    { title: 'Week 5: Match Intelligence', workouts: ['Total Body Cardio Advanced', 'Full Body Advanced Athlete'], mentals: ['Choke-Proof Preparation', "The Competitor's Code", 'Performing for the Love of It'], drills: ['Reaction Ball Batting', 'Gap Finding Drill', 'Single Stump Target Practice'] },
  ],
  pro: [
    { title: 'Week 1: Pro Foundation', workouts: ['Explosive Power Pro', 'Full Body Power Pro'], mentals: ['Mental Toughness Builder', 'Elite Endurance Mindset', 'New Identity Visualisation'], drills: ['Pro-Level Reverse Sweep', 'Core Rotation Power', 'Elite Pressure Batting'] },
    { title: 'Week 2: Power Mastery', workouts: ['Pro Athlete Conditioning', 'Back Domination Pro'], mentals: ['Champion Mindset Simulation', 'High Stakes Rehearsal', 'Deliberate Practice Mindset'], drills: ['Elite Power Hitting Mastery', 'Switch Hit & Ramp Shot Techniques', 'Bouncer Evasion & Hook Shot'] },
    { title: 'Week 3: Sweep Mastery', workouts: ['Chest Pro Explosion', 'Core Elite Pro'], mentals: ['Sensory Performance Blueprint', 'Pressure Rehearsal: The Crucial Over', 'Choke-Proof Preparation'], drills: ['Reverse Sweep Mastery', 'Reverse Sweep Practice', 'Spin Reading Practice'] },
    { title: 'Week 4: Match Simulation', workouts: ['Legs Pro Power', 'Shoulders Pro Power'], mentals: ['Elite Competitor Analysis', "The Champion's Setback", 'Winning the Inner Battle'], drills: ['Premium Match Scenarios', 'Elite Match Simulation Protocol', 'Pull Shot Mastery'] },
    { title: 'Week 5: Elite Performance', workouts: ['Full Body Pro Endurance', 'Arms Pro Elite'], mentals: ['Flow State Architecture', 'Zone of Genius Activation', 'Inner Dialogue Mastery'], drills: ['Death Overs Mastery - Yorker Execution', 'Reverse Sweep Mastery', 'Pro-Level Reverse Sweep'] },
  ],
};

const BOWLING = {
  beginner: [
    { title: 'Week 1: Action Foundations', workouts: ['Back Beginner Strengthen', 'Shoulder Mobility Warm-Up'], mentals: ['Bowling Mindset Lock-In', 'Pre-Game Activation', 'Focus Lock-In'], drills: ['Basic Bowling Action', 'Run-up Rhythm Drill', 'High Catch Practice'] },
    { title: 'Week 2: Line & Length', workouts: ['Shoulders Beginner Tone', 'Core Beginner Basics'], mentals: ['Countdown to Clarity', 'Confidence Countdown', '10-Second Rule'], drills: ['Line and Length Drill', 'Target Bowling', 'Throwing Accuracy - Long Barrier'] },
    { title: 'Week 3: Accuracy Building', workouts: ['Back & Posture Fix', 'Chest & Core Beginner'], mentals: ['Nervous Energy Converter', 'Positive Morning Anchor', 'Team Player Mindset'], drills: ['Target Bowling', 'Line and Length Drill', 'Figure 8 Agility Drill'] },
    { title: 'Week 4: Rhythm & Consistency', workouts: ['Legs Beginner Strength', 'Total Body Toning'], mentals: ['Celebrate the Small Wins', 'The Micro-Win Review', 'Self-Compassion Break'], drills: ['Run-up Rhythm Drill', 'Basic Bowling Action', 'Boundary Fielding Drills'] },
    { title: 'Week 5: Match Readiness', workouts: ['Morning Energy Boost', 'Quick Fat Burn'], mentals: ['Gratitude for the Journey', 'Win the Morning', 'Mental Recovery Sprint'], drills: ['Target Bowling', 'Line and Length Drill', 'Reaction Ball Training'] },
  ],
  intermediate: [
    { title: 'Week 1: Swing & Seam', workouts: ['Back Strength Builder', 'Shoulders Intermediate Sculpt'], mentals: ['Pre-Performance Calm', 'Bowling Mindset Lock-In', 'Laser Focus Activation'], drills: ['Swing Bowling Control', 'Seam Bowling Cross-Seam', 'Yorker Bowling Mastery'] },
    { title: 'Week 2: Pace & Variations', workouts: ['Core Intermediate Shred', 'Upper Body Pump Builder'], mentals: ['Self-Talk Rewrite', 'Cold Pressure Simulation', 'Decision Clarity Under Pressure'], drills: ['Fast Bowling Inswinger', 'Spin Bowling Variations', 'Speed Gun Challenge'] },
    { title: 'Week 3: Yorker Mastery', workouts: ['Shoulder Definition Blast', 'Legs Intermediate Circuit'], mentals: ['Pressure Is Information', 'Craving the Challenge', 'Bounce-Back Faster'], drills: ['Yorker Mastery', 'Yorker Training', 'Yorker Bowling Mastery'] },
    { title: 'Week 4: Swing Control', workouts: ['Back & Shoulders Intermediate', 'Full Body Intermediate Power'], mentals: ['The Process Over the Result', 'Discipline Over Motivation', 'Motivation Without Mood'], drills: ['Swing Bowling Variation', 'Swing Bowling Control', 'Catching Star Drill'] },
    { title: 'Week 5: Match Preparation', workouts: ['Endurance Builder Intermediate', 'Full Body Fat Burn Intermediate'], mentals: ['Choke-Proof Preparation', 'The Pressure Ladder', 'Game Day Activation'], drills: ['Fast Bowling Inswinger', 'Seam Bowling Cross-Seam', 'Ground Fielding & Quick Release'] },
  ],
  advanced: [
    { title: 'Week 1: Advanced Pace', workouts: ['Power Strength Advanced', 'Shoulder Strength Supreme'], mentals: ['Calm Under Pressure Visualisation', 'The Unbreakable Mindset', 'Pressure Is Privilege'], drills: ['Advanced Spin Variations', 'Change of Pace Drill', 'Yorker Practice (Target Mat)'] },
    { title: 'Week 2: Death Bowling', workouts: ['Back Advanced Domination', 'Core Advanced Destroyer'], mentals: ['Decision Clarity Under Pressure', 'High Stakes Rehearsal', 'Bowling Under Pressure Mindset'], drills: ['Death Bowling Execution', 'Yorker Mastery Under Pressure', 'Slower Ball Execution'] },
    { title: 'Week 3: Reverse Swing', workouts: ['Full Body Athlete Builder', 'Chest Advanced Power'], mentals: ['The Unbreakable Mindset', 'Trusting Instinct', 'Future-Pacing Success'], drills: ['Reverse Swing Control', 'Old Ball Seam Techniques', 'Cross-Seam Delivery Practice'] },
    { title: 'Week 4: Spin Mastery', workouts: ['Mobility & Flexibility Advanced', 'Arms Advanced Strength'], mentals: ['Responding to Unfairness', 'Cold Pressure Simulation', 'The Bounce-Back Blueprint'], drills: ['Advanced Spin Variations', 'Doosra & Carrom Ball Practice', 'Flipper & Googly Control'] },
    { title: 'Week 5: Match Intelligence', workouts: ['Total Body Cardio Advanced', 'Full Body Advanced Athlete'], mentals: ['Choke-Proof Preparation', "The Competitor's Code", 'Performing for the Love of It'], drills: ['Match Bowling Simulation', 'Pressure Over Execution', 'Line & Length Championship'] },
  ],
  pro: [
    { title: 'Week 1: Elite Pace', workouts: ['Explosive Power Pro', 'Full Body Power Pro'], mentals: ['Mental Toughness Builder', 'Elite Endurance Mindset', 'New Identity Visualisation'], drills: ['Elite Pace Bowling', 'Pro Run-up Mastery', 'Extreme Yorker Training'] },
    { title: 'Week 2: Advanced Death Bowling', workouts: ['Pro Athlete Conditioning', 'Back Domination Pro'], mentals: ['Champion Mindset Simulation', 'High Stakes Rehearsal', 'Deliberate Practice Mindset'], drills: ['Death Over Mastery', 'Super Over Bowling Execution', 'Final Over Specialist'] },
    { title: 'Week 3: Match-Winning Spells', workouts: ['Chest Pro Explosion', 'Core Elite Pro'], mentals: ['Sensory Performance Blueprint', 'Pressure Rehearsal: The Crucial Over', 'Flow State Architecture'], drills: ['Match-Winning Spell Simulation', 'Elite Variation Series', 'Pro Bouncer Strategy'] },
    { title: 'Week 4: Championship Bowling', workouts: ['Legs Pro Power', 'Shoulders Pro Power'], mentals: ['Elite Competitor Analysis', "The Champion's Setback", 'Winning the Inner Battle'], drills: ['Championship Bowling Protocol', 'Pro Field Setting Drill', 'Elite Pressure Over'] },
    { title: 'Week 5: Elite Performance', workouts: ['Full Body Pro Endurance', 'Arms Pro Elite'], mentals: ['Zone of Genius Activation', 'Inner Dialogue Mastery', 'Choke-Proof Preparation'], drills: ['Elite Bowling Performance', 'Pro Match Simulation', 'Championship Standard Spell'] },
  ],
};

const WICKET_KEEPING = {
  beginner: [
    { title: 'Week 1: Stance & Basics', workouts: ['Chest & Core Beginner', 'Legs & Core Beginner'], mentals: ['Pre-Game Activation', 'Focus Lock-In', 'Confidence Countdown'], drills: ['Basic Keeper Stance', 'Glove Work Basics', 'High Catch Practice'] },
    { title: 'Week 2: Glove Work', workouts: ['Back & Posture Fix', 'Shoulder Mobility Warm-Up'], mentals: ['5-4-3-2-1 Grounding', 'Countdown to Clarity', 'Win the Morning'], drills: ['Glove Work Drills', 'Wicketkeeper Stance Drill', 'Throwing Accuracy - Long Barrier'] },
    { title: 'Week 3: Footwork & Agility', workouts: ['Legs Beginner Strength', 'Total Body Toning'], mentals: ['10-Second Rule', 'Positive Morning Anchor', 'Self-Compassion Break'], drills: ['Keeping Footwork Basics', 'Lateral Movement Drill', 'Quick Hands Drill'] },
    { title: 'Week 4: Stumping Skills', workouts: ['Arms Beginner Blast', 'Core Beginner Basics'], mentals: ['Celebrate the Small Wins', 'The Micro-Win Review', 'Team Player Mindset'], drills: ['Stumping Practice', 'Diving Catch Left', 'Diving Catch Right'] },
    { title: 'Week 5: Match Readiness', workouts: ['Full Body Quick Tone', 'Morning Energy Boost'], mentals: ['Gratitude for the Journey', 'Reset After a Duck', 'Mental Recovery Sprint'], drills: ['Wide Ball Reaction Drill', 'Full Toss Catch Drill', 'Match Simulation Keeping'] },
  ],
  intermediate: [
    { title: 'Week 1: Advanced Positioning', workouts: ['Back Strength Builder', 'Shoulders Intermediate Sculpt'], mentals: ['Pre-Performance Calm', 'Laser Focus Activation', 'Self-Talk Rewrite'], drills: ['Advanced Keeper Positioning', 'Leg Side Stumping', 'One-Handed Catch Drill'] },
    { title: 'Week 2: Speed & Coordination', workouts: ['Core Intermediate Shred', 'Full Body Intermediate Power'], mentals: ['Anchoring Your Peak State', 'Decision Clarity Under Pressure', 'Sensory Narrowing'], drills: ['Quick Glove Exchange', 'Spin Keeper Drill', 'Diving Stumping Practice'] },
    { title: 'Week 3: Communication & Leadership', workouts: ['Legs Intermediate Circuit', 'Upper Body Pump Builder'], mentals: ['Craving the Challenge', 'Bounce-Back Faster', 'The Process Over the Result'], drills: ['Keeper-Captain Communication', 'Calling Run-Outs Drill', 'Cross-Pitch Throw Drill'] },
    { title: 'Week 4: Fast Bowling Keeping', workouts: ['Back & Shoulders Intermediate', 'Abs Intermediate Carve'], mentals: ['Competition as Fuel', 'Focus on What You Can Control', 'Embrace the Discomfort'], drills: ['Fast Bowling Keeper Drill', 'Outer Edge Catches', 'High Catch Under Pressure'] },
    { title: 'Week 5: Match Simulation', workouts: ['Endurance Builder Intermediate', 'Full Body Fat Burn Intermediate'], mentals: ['High Stakes Rehearsal', 'Handling the Unplayable Ball', 'Choke-Proof Preparation'], drills: ['Full Match Keeper Simulation', 'DRS Decision Drill', 'End of Day Focus Drill'] },
  ],
  advanced: [
    { title: 'Week 1: Elite Glove Work', workouts: ['Core Advanced Destroyer', 'Legs Advanced Strength'], mentals: ['Calm Under Pressure Visualisation', 'The Perfect Performance', 'Pressure Is Privilege'], drills: ['Elite Glove Work', 'Standing Up to Spin', 'One-Handed Stunner Drill'] },
    { title: 'Week 2: Standing Up to Pace', workouts: ['Power Strength Advanced', 'Full Body Athlete Builder'], mentals: ['Future-Pacing Success', 'Anchoring Your Peak State', 'High Stakes Rehearsal'], drills: ['Advanced Stumping Drill', 'Close Catching - Spin', 'Caught Behind Technique'] },
    { title: 'Week 3: Keeper Leadership', workouts: ['Back Advanced Domination', 'Shoulder Strength Supreme'], mentals: ['Decision Clarity Under Pressure', 'The Unbreakable Mindset', 'Trusting Instinct'], drills: ['Keeper Leadership Drill', 'DRS Review Protocol', 'Wicketkeeper Batting Technique'] },
    { title: 'Week 4: Advanced Diving', workouts: ['Mobility & Flexibility Advanced', 'Arms Advanced Strength'], mentals: ['Responding to Unfairness', 'The Bounce-Back Blueprint', 'Cold Pressure Simulation'], drills: ['Diving Catch Mastery', 'Reverse Stumping Drill', 'Pressure Catching Circuit'] },
    { title: 'Week 5: Championship Keeping', workouts: ['Total Body Cardio Advanced', 'Full Body Advanced Athlete'], mentals: ["The Competitor's Code", 'Performing for the Love of It', 'Choke-Proof Preparation'], drills: ['Championship Keeping Simulation', 'Reaction Diving Drill', 'Elite Catching Circuit'] },
  ],
  pro: [
    { title: 'Week 1: Pro Standards', workouts: ['Explosive Power Pro', 'Full Body Power Pro'], mentals: ['Mental Toughness Builder', 'Elite Endurance Mindset', 'New Identity Visualisation'], drills: ['Pro Keeper Positioning', 'Elite Stumping Protocol', 'Speed Catch Circuit'] },
    { title: 'Week 2: Elite Coordination', workouts: ['Pro Athlete Conditioning', 'Back Domination Pro'], mentals: ['Champion Mindset Simulation', 'High Stakes Rehearsal', 'Deliberate Practice Mindset'], drills: ['Elite Glove Speed', 'Extreme Angle Stumping', 'Pro Catch Series'] },
    { title: 'Week 3: Mental Game', workouts: ['Chest Pro Explosion', 'Core Elite Pro'], mentals: ['Sensory Performance Blueprint', 'Pressure Rehearsal: The Crucial Over', 'Flow State Architecture'], drills: ['Match Intelligence Keeping', 'DRS Mastery Drill', 'Pressure Stumping Circuit'] },
    { title: 'Week 4: Match Intelligence', workouts: ['Legs Pro Power', 'Shoulders Pro Power'], mentals: ['Elite Competitor Analysis', "The Champion's Setback", 'Winning the Inner Battle'], drills: ['Pro Match Simulation Keeping', "Captain's Keeper Protocol", 'Reaction Test Elite'] },
    { title: 'Week 5: Elite Performance', workouts: ['Full Body Pro Endurance', 'Arms Pro Elite'], mentals: ['Zone of Genius Activation', 'Inner Dialogue Mastery', 'Choke-Proof Preparation'], drills: ['Championship Performance Keeping', 'Elite Diving & Recovery', 'Pro-Level Stump Work'] },
  ],
};

// ─── LEVEL CONFIGS ────────────────────────────────────────────────────────────

function buildLevel(catKey, levelKey, data, config) {
  return {
    id: `${catKey}_${levelKey}`,
    name: config.name,
    subtitle: config.subtitle,
    color: config.color,
    unlockXP: config.unlockXP,
    isPremium: !!config.isPremium,
    totalXP: TOTAL_XP[levelKey],
    badge: config.badge,
    weeks: buildLevelWeeks(catKey, levelKey, data[levelKey]),
  };
}

// ─── FULL DATABASE ────────────────────────────────────────────────────────────

export const skillPathsData = {
  batting: {
    name: 'Batting Path',
    icon: '🏏',
    color: 'blue',
    levels: {
      beginner:     buildLevel('bat', 'beginner',     BATTING, { name: 'Batting Beginner',     subtitle: 'Build your core batting foundation',      color: 'emerald', unlockXP: 0,    isPremium: false, badge: { name: 'Batting Starter',  emoji: '🎯', rarity: 'common'    } }),
      intermediate: buildLevel('bat', 'intermediate', BATTING, { name: 'Batting Intermediate', subtitle: 'Develop power, timing and stroke play',     color: 'blue',    unlockXP: 2000, isPremium: false, badge: { name: 'Stroke Maker',     emoji: '⚡', rarity: 'rare'      } }),
      advanced:     buildLevel('bat', 'advanced',     BATTING, { name: 'Batting Advanced',     subtitle: 'Elite technique and match intelligence',   color: 'purple',  unlockXP: 5000, isPremium: false, badge: { name: 'Elite Batter',     emoji: '🏆', rarity: 'epic'      } }),
      pro:          buildLevel('bat', 'pro',           BATTING, { name: 'Batting Pro',           subtitle: 'Championship-level batting mastery',       color: 'amber',   unlockXP: 7500, isPremium: true,  badge: { name: 'Pro Batter',       emoji: '👑', rarity: 'legendary' } }),
    },
  },
  bowling: {
    name: 'Bowling Path',
    icon: '🎳',
    color: 'green',
    levels: {
      beginner:     buildLevel('bow', 'beginner',     BOWLING, { name: 'Bowling Beginner',     subtitle: 'Master action, line and length basics',    color: 'emerald', unlockXP: 0,    isPremium: false, badge: { name: 'Bowler Starter',   emoji: '🎯', rarity: 'common'    } }),
      intermediate: buildLevel('bow', 'intermediate', BOWLING, { name: 'Bowling Intermediate', subtitle: 'Develop swing, seam and yorkers',          color: 'blue',    unlockXP: 2000, isPremium: false, badge: { name: 'Swing Master',     emoji: '⚡', rarity: 'rare'      } }),
      advanced:     buildLevel('bow', 'advanced',     BOWLING, { name: 'Bowling Advanced',     subtitle: 'Elite pace, reverse swing and variations', color: 'purple',  unlockXP: 5000, isPremium: false, badge: { name: 'Elite Bowler',     emoji: '🏆', rarity: 'epic'      } }),
      pro:          buildLevel('bow', 'pro',           BOWLING, { name: 'Bowling Pro',           subtitle: 'Championship-level bowling mastery',      color: 'amber',   unlockXP: 7500, isPremium: true,  badge: { name: 'Pro Bowler',       emoji: '👑', rarity: 'legendary' } }),
    },
  },
  wicket_keeping: {
    name: 'Wicket Keeping Path',
    icon: '🧤',
    color: 'purple',
    levels: {
      beginner:     buildLevel('wk', 'beginner',     WICKET_KEEPING, { name: 'Keeping Beginner',     subtitle: 'Learn stance, glove work and catching',   color: 'emerald', unlockXP: 0,    isPremium: false, badge: { name: 'Keeper Starter',   emoji: '🎯', rarity: 'common'    } }),
      intermediate: buildLevel('wk', 'intermediate', WICKET_KEEPING, { name: 'Keeping Intermediate', subtitle: 'Develop stumping, coordination & speed',  color: 'blue',    unlockXP: 2000, isPremium: false, badge: { name: 'Smart Keeper',     emoji: '⚡', rarity: 'rare'      } }),
      advanced:     buildLevel('wk', 'advanced',     WICKET_KEEPING, { name: 'Keeping Advanced',     subtitle: 'Elite glove work and match leadership',   color: 'purple',  unlockXP: 5000, isPremium: false, badge: { name: 'Elite Keeper',     emoji: '🏆', rarity: 'epic'      } }),
      pro:          buildLevel('wk', 'pro',           WICKET_KEEPING, { name: 'Keeping Pro',           subtitle: 'Championship-level keeping mastery',     color: 'amber',   unlockXP: 7500, isPremium: true,  badge: { name: 'Pro Keeper',       emoji: '👑', rarity: 'legendary' } }),
    },
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function getPathData(category, level) {
  return skillPathsData[category]?.levels[level] || null;
}

export function getPathProgress(completedItems, category, level) {
  const path = getPathData(category, level);
  if (!path) return 0;
  const total = path.weeks.reduce((s, w) => s + w.items.length, 0);
  if (total === 0) return 0;
  return Math.round((completedItems.length / total) * 100);
}

export function getNextLevel(currentLevel) {
  const order = ['beginner', 'intermediate', 'advanced', 'pro'];
  const idx = order.indexOf(currentLevel);
  return idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null;
}