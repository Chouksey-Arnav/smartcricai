// Complete XP Level System with 250+ levels
// Includes tier-based XP curves and level-up notifications

export const levelSystemData = [
  // Tier 1: Foundation Tier (Levels 1-10) - 0-1,000 XP
  { level: 1, xp: 0, name: "Rookie", notification: "You've reached Level 1 — Rookie. Welcome to the grind; show up and move." },
  { level: 2, xp: 100, name: "Trainee", notification: "Level 2 — Trainee unlocked. Small habits, big results — keep stacking." },
  { level: 3, xp: 200, name: "Apprentice", notification: "Level 3 — Apprentice reached. Practice deliberately; focus on form." },
  { level: 4, xp: 300, name: "Cadet", notification: "Level 4 — Cadet unlocked. You're building the base — steady work wins." },
  { level: 5, xp: 400, name: "Grinder", notification: "Level 5 — Grinder achieved. Consistency is becoming your identity." },
  { level: 6, xp: 500, name: "Contender", notification: "Level 6 — Contender unlocked. Your effort is turning into capability." },
  { level: 7, xp: 600, name: "Competitor", notification: "Level 7 — Competitor achieved. Training intensity is earning results." },
  { level: 8, xp: 700, name: "Performer", notification: "Level 8 — Performer unlocked. You move like an athlete now." },
  { level: 9, xp: 800, name: "Rising Player", notification: "Level 9 — Rising Player reached. Momentum is on your side." },
  { level: 10, xp: 1000, name: "Foundation Complete", notification: "Level 10 — Foundation Complete. You've built the base — well done." },

  // Tier 2: Development Tier (Levels 11-25) - 1,000-5,000 XP
  { level: 11, xp: 1250, name: "Technical Builder", notification: "Level 11 — Technical Builder unlocked. Technique is sharpening — quality reps." },
  { level: 12, xp: 1500, name: "Skill Architect", notification: "Level 12 — Skill Architect achieved. You're building repeatable skills." },
  { level: 13, xp: 1750, name: "Power Trainee", notification: "Level 13 — Power Trainee unlocked. Add intent to your power work." },
  { level: 14, xp: 2000, name: "Precision Player", notification: "Level 14 — Precision Player achieved. Hit your targets with control." },
  { level: 15, xp: 2300, name: "Match Ready", notification: "Level 15 — Match Ready unlocked. Your game-readiness is improving." },
  { level: 16, xp: 2600, name: "Tactical Learner", notification: "Level 16 — Tactical Learner reached. Think smart, train smarter." },
  { level: 17, xp: 2900, name: "Rotational Specialist", notification: "Level 17 — Rotational Specialist unlocked. Your rotation is getting stronger." },
  { level: 18, xp: 3200, name: "Speed Builder", notification: "Level 18 — Speed Builder achieved. Quickness is becoming reliable." },
  { level: 19, xp: 3500, name: "Competitive Engine", notification: "Level 19 — Competitive Engine unlocked. You're producing consistent output." },
  { level: 20, xp: 4000, name: "Development Certified", notification: "Level 20 — Development Certified. You passed the development milestone — keep going." },
  { level: 21, xp: 4250, name: "High Performance Candidate I", notification: "Level 21 — High Performance Candidate I. You've entered the candidate zone — sharpen focus." },
  { level: 22, xp: 4400, name: "High Performance Candidate II", notification: "Level 22 — High Performance Candidate II. Progress is accelerating — maintain routine." },
  { level: 23, xp: 4550, name: "High Performance Candidate III", notification: "Level 23 — High Performance Candidate III. Performance habits are forming." },
  { level: 24, xp: 4700, name: "High Performance Candidate IV", notification: "Level 24 — High Performance Candidate IV. Your training identity is building." },
  { level: 25, xp: 5000, name: "High Performance Candidate V", notification: "Level 25 — High Performance Candidate V. You're closing the development gap — excellent work." },

  // Tier 3: Performance Tier (Levels 26-50) - 5,000-20,000 XP
  { level: 26, xp: 5500, name: "Performance Operator", notification: "Level 26 — Performance Operator unlocked. You run high-quality sessions now." },
  { level: 27, xp: 6000, name: "Performance Operator II", notification: "Level 27 — Performance Operator II. Keep the workload consistent and smart." },
  { level: 28, xp: 6500, name: "Pressure Player", notification: "Level 28 — Pressure Player reached. You handle intensity better today." },
  { level: 29, xp: 7000, name: "Pressure Player II", notification: "Level 29 — Pressure Player II. Pressure practice is paying off." },
  { level: 30, xp: 7600, name: "Power Generator", notification: "Level 30 — Power Generator unlocked. Power capacity is increasing — smart explosiveness." },
  { level: 31, xp: 8200, name: "Power Generator II", notification: "Level 31 — Power Generator II. Continue to refine force into skill." },
  { level: 32, xp: 8800, name: "Tactical Executor", notification: "Level 32 — Tactical Executor achieved. You make better match decisions under stress." },
  { level: 33, xp: 9400, name: "Tactical Executor II", notification: "Level 33 — Tactical Executor II. Tactical habits are strengthening." },
  { level: 34, xp: 10000, name: "Tactical Executor III", notification: "Level 34 — Tactical Executor III. Your strategy execution is leveling up." },
  { level: 35, xp: 10700, name: "Competitive Specialist", notification: "Level 35 — Competitive Specialist unlocked. You perform better when it counts." },
  { level: 36, xp: 11400, name: "Competitive Specialist II", notification: "Level 36 — Competitive Specialist II. Keep proving it in practice." },
  { level: 37, xp: 12100, name: "Competitive Specialist III", notification: "Level 37 — Competitive Specialist III. Consistent, focused, hungry." },
  { level: 38, xp: 12800, name: "Competitive Specialist IV", notification: "Level 38 — Competitive Specialist IV. Your competitive toolkit is deeper." },
  { level: 39, xp: 13500, name: "Competitive Specialist V", notification: "Level 39 — Competitive Specialist V. You're becoming a threat in training." },
  { level: 40, xp: 14500, name: "Elite Developer", notification: "Level 40 — Elite Developer achieved. Major milestone — your craft is evolving." },
  { level: 41, xp: 15200, name: "Elite Developer II", notification: "Level 41 — Elite Developer II. Keep refining the details." },
  { level: 42, xp: 15900, name: "Elite Developer III", notification: "Level 42 — Elite Developer III. Depth over noise — that's how you progress." },
  { level: 43, xp: 16600, name: "Elite Developer IV", notification: "Level 43 — Elite Developer IV. Your training quality is elite-grade." },
  { level: 44, xp: 17300, name: "Elite Developer V", notification: "Level 44 — Elite Developer V. You're building elite habits." },
  { level: 45, xp: 18100, name: "Advanced Performer", notification: "Level 45 — Advanced Performer unlocked. You maintain form under stress." },
  { level: 46, xp: 18600, name: "Advanced Performer II", notification: "Level 46 — Advanced Performer II. Strength and skill are connected here." },
  { level: 47, xp: 19100, name: "Advanced Performer III", notification: "Level 47 — Advanced Performer III. Good training choices pay off now." },
  { level: 48, xp: 19600, name: "Advanced Performer IV", notification: "Level 48 — Advanced Performer IV. You're durable and sharp." },
  { level: 49, xp: 19800, name: "Advanced Performer V", notification: "Level 49 — Advanced Performer V. Approaching top-tier readiness." },
  { level: 50, xp: 20000, name: "High Performance Athlete", notification: "Level 50 — High Performance Athlete reached. You're in the upper echelon — proud moment." },

  // Tier 4: ELITE TIER (Levels 51-100) - 20,000-100,000 XP
  { level: 51, xp: 21000, name: "Elite Trainee I", notification: "Level 51 — Elite Trainee I. You've entered elite territory — consistency is key." },
  { level: 52, xp: 22000, name: "Elite Trainee II", notification: "Level 52 — Elite Trainee II. Elite habits forming — stay disciplined." },
  { level: 53, xp: 23000, name: "Elite Trainee III", notification: "Level 53 — Elite Trainee III. Keep the quality high." },
  { level: 54, xp: 24000, name: "Elite Trainee IV", notification: "Level 54 — Elite Trainee IV. Your foundation for elite work is solid." },
  { level: 55, xp: 25500, name: "Elite Certified", notification: "Level 55 — Elite Certified. Certification moment — you've earned elite recognition." },
  { level: 56, xp: 27000, name: "Elite Contender I", notification: "Level 56 — Elite Contender I. You're competing at a higher level." },
  { level: 57, xp: 28500, name: "Elite Contender II", notification: "Level 57 — Elite Contender II. Continue sharpening tactical skills." },
  { level: 58, xp: 30000, name: "Elite Contender III", notification: "Level 58 — Elite Contender III. Performance under pressure is improving." },
  { level: 59, xp: 31500, name: "Elite Contender IV", notification: "Level 59 — Elite Contender IV. You're solidifying elite consistency." },
  { level: 60, xp: 33500, name: "Elite Competitor", notification: "Level 60 — Elite Competitor achieved. A major step: you compete with intent." },
  { level: 61, xp: 35500, name: "Advanced Elite I", notification: "Level 61 — Advanced Elite I. Advanced skills are becoming routine." },
  { level: 62, xp: 37500, name: "Advanced Elite II", notification: "Level 62 — Advanced Elite II. Keep integrating power and precision." },
  { level: 63, xp: 39500, name: "Advanced Elite III", notification: "Level 63 — Advanced Elite III. Training volume is working — recover well." },
  { level: 64, xp: 41500, name: "Advanced Elite IV", notification: "Level 64 — Advanced Elite IV. You're a reliable high-performer." },
  { level: 65, xp: 44000, name: "Tactical Elite", notification: "Level 65 — Tactical Elite. Your match IQ stands out more every session." },
  { level: 66, xp: 46500, name: "High-Intensity Elite I", notification: "Level 66 — High-Intensity Elite I. Intensity tolerance is improving." },
  { level: 67, xp: 49000, name: "High-Intensity Elite II", notification: "Level 67 — High-Intensity Elite II. You sustain power longer." },
  { level: 68, xp: 51500, name: "High-Intensity Elite III", notification: "Level 68 — High-Intensity Elite III. Your conditioning separates you now." },
  { level: 69, xp: 54000, name: "High-Intensity Elite IV", notification: "Level 69 — High-Intensity Elite IV. Pressure endurance is high." },
  { level: 70, xp: 57000, name: "Match Commander", notification: "Level 70 — Match Commander unlocked. You lead tempo and execution in practice." },
  { level: 71, xp: 60000, name: "Performance Authority I", notification: "Level 71 — Performance Authority I. Authority in performance — you own it." },
  { level: 72, xp: 62500, name: "Performance Authority II", notification: "Level 72 — Performance Authority II. Leadership in training energy." },
  { level: 73, xp: 65000, name: "Performance Authority III", notification: "Level 73 — Performance Authority III. You set the standard." },
  { level: 74, xp: 67500, name: "Performance Authority IV", notification: "Level 74 — Performance Authority IV. Others look to your example." },
  { level: 75, xp: 70000, name: "Performance Authority V", notification: "Level 75 — Performance Authority V. Your presence raises the bar." },
  { level: 76, xp: 72500, name: "Performance Authority VI", notification: "Level 76 — Performance Authority VI. Keep the standard high and consistent." },
  { level: 77, xp: 75000, name: "Performance Authority VII", notification: "Level 77 — Performance Authority VII. Deep mastery of routine." },
  { level: 78, xp: 77500, name: "Performance Authority VIII", notification: "Level 78 — Performance Authority VIII. Great athletes maintain routine." },
  { level: 79, xp: 80000, name: "Performance Authority IX", notification: "Level 79 — Performance Authority IX. Performance culture is yours to keep." },
  { level: 80, xp: 83000, name: "Dominant Athlete", notification: "Level 80 — Dominant Athlete achieved. You're a dominant force in training metrics." },
  { level: 81, xp: 85500, name: "Strategic Specialist I", notification: "Level 81 — Strategic Specialist I. Strategy execution is crisp." },
  { level: 82, xp: 87500, name: "Strategic Specialist II", notification: "Level 82 — Strategic Specialist II. You think and act with precision." },
  { level: 83, xp: 89500, name: "Strategic Specialist III", notification: "Level 83 — Strategic Specialist III. Tactical refinement pays off." },
  { level: 84, xp: 91500, name: "Strategic Specialist IV", notification: "Level 84 — Strategic Specialist IV. You adapt quickly to game scenarios." },
  { level: 85, xp: 93500, name: "Strategic Specialist V", notification: "Level 85 — Strategic Specialist V. Strategy and execution are unified." },
  { level: 86, xp: 94500, name: "Strategic Specialist VI", notification: "Level 86 — Strategic Specialist VI. Your decisions create advantages." },
  { level: 87, xp: 95500, name: "Strategic Specialist VII", notification: "Level 87 — Strategic Specialist VII. You've elevated match thinking." },
  { level: 88, xp: 96500, name: "Strategic Specialist VIII", notification: "Level 88 — Strategic Specialist VIII. Tactical depth is visible in practice." },
  { level: 89, xp: 97500, name: "Strategic Specialist IX", notification: "Level 89 — Strategic Specialist IX. Mastery of situational play is near." },
  { level: 90, xp: 99000, name: "Game Controller", notification: "Level 90 — Game Controller unlocked. You control scenarios; others react." },
  { level: 91, xp: 100000, name: "Apex Contender I", notification: "Level 91 — Apex Contender I. Apex-level focus — elite territory." },
  { level: 92, xp: 101500, name: "Apex Contender II", notification: "Level 92 — Apex Contender II. Your performance window is wide." },
  { level: 93, xp: 103000, name: "Apex Contender III", notification: "Level 93 — Apex Contender III. You're a top-tier competitor." },
  { level: 94, xp: 104500, name: "Apex Contender IV", notification: "Level 94 — Apex Contender IV. Maintain edge through smart recovery." },
  { level: 95, xp: 106000, name: "Apex Contender V", notification: "Level 95 — Apex Contender V. You're in the upper ranks of performance." },
  { level: 96, xp: 107500, name: "Apex Contender VI", notification: "Level 96 — Apex Contender VI. Consistency at peak intensity." },
  { level: 97, xp: 109000, name: "Apex Contender VII", notification: "Level 97 — Apex Contender VII. Training mastery is visible." },
  { level: 98, xp: 110500, name: "Apex Contender VIII", notification: "Level 98 — Apex Contender VIII. You're elite by practice standards." },
  { level: 99, xp: 112000, name: "Apex Contender IX", notification: "Level 99 — Apex Contender IX. One more step to the summit." },
  { level: 100, xp: 115000, name: "SmartCric Elite", notification: "Level 100 — SmartCric Elite. You've built something meaningful — top-tier recognition." },

  // Tier 5: LEGACY TIER - Master Rank (101-125) - 115,000-200,000 XP
  ...Array.from({ length: 25 }, (_, i) => {
    const level = 101 + i;
    const xp = 115000 + (i + 1) * 3500;
    return {
      level,
      xp,
      name: `Master Rank ${toRoman(i + 1)}`,
      notification: getMasterNotification(level, i + 1)
    };
  }),

  // Grandmaster Rank (126-150)
  ...Array.from({ length: 25 }, (_, i) => {
    const level = 126 + i;
    const xp = 202500 + (i + 1) * 4000;
    return {
      level,
      xp,
      name: `Grandmaster Rank ${toRoman(i + 1)}`,
      notification: getGrandmasterNotification(level, i + 1)
    };
  }),

  // Supreme Rank (151-175)
  ...Array.from({ length: 25 }, (_, i) => {
    const level = 151 + i;
    const xp = 302500 + (i + 1) * 4500;
    return {
      level,
      xp,
      name: `Supreme Rank ${toRoman(i + 1)}`,
      notification: getSupremeNotification(level, i + 1)
    };
  }),

  // Champion Rank (176-200)
  ...Array.from({ length: 25 }, (_, i) => {
    const level = 176 + i;
    const xp = 415000 + (i + 1) * 5000;
    return {
      level,
      xp,
      name: `Champion Rank ${toRoman(i + 1)}`,
      notification: getChampionNotification(level, i + 1)
    };
  }),

  // Legendary Rank (201-225)
  ...Array.from({ length: 25 }, (_, i) => {
    const level = 201 + i;
    const xp = 540000 + (i + 1) * 5500;
    return {
      level,
      xp,
      name: `Legendary Rank ${toRoman(i + 1)}`,
      notification: getLegendaryNotification(level, i + 1)
    };
  }),

  // Icon Rank (226-249)
  ...Array.from({ length: 24 }, (_, i) => {
    const level = 226 + i;
    const xp = 677500 + (i + 1) * 6000;
    return {
      level,
      xp,
      name: `Icon Rank ${toRoman(i + 1)}`,
      notification: getIconNotification(level, i + 1)
    };
  }),

  // Immortal Status
  { level: 250, xp: 821500, name: "Immortal Status", notification: "Level 250 — Immortal Status unlocked. You've reached a legendary legacy — elite recognition." },
];

// Roman numeral converter
function toRoman(num) {
  const lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
  let roman = '';
  for (let i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

// Notification generators
function getMasterNotification(level, rank) {
  const messages = {
    1: "Level 101 — Master Rank I. Welcome to Master Rank — sustained excellence.",
    5: "Level 105 — Master Rank V. Your profile reflects serious commitment.",
    10: "Level 110 — Master Rank X. A significant legacy milestone — respect it.",
    15: "Level 115 — Master Rank XV. Long-term development is paying off.",
    20: "Level 120 — Master Rank XX. A major reputation milestone.",
    25: "Level 125 — Master Rank XXV. Mastery milestone — legacy status initiated.",
  };
  return messages[rank] || `Level ${level} — Master Rank ${toRoman(rank)}. Legacy growth in motion.`;
}

function getGrandmasterNotification(level, rank) {
  const messages = {
    1: "Level 126 — Grandmaster Rank I. Grandmaster ascent begins — elite commitment.",
    10: "Level 135 — Grandmaster Rank X. Another legacy checkpoint earned.",
    15: "Level 140 — Grandmaster Rank XV. A major longevity milestone.",
    20: "Level 145 — Grandmaster Rank XX. Rare longevity achieved.",
    25: "Level 150 — Grandmaster Rank XXV. Big legacy milestone — celebrated achievement.",
  };
  return messages[rank] || `Level ${level} — Grandmaster Rank ${toRoman(rank)}. Keep building your legacy.`;
}

function getSupremeNotification(level, rank) {
  const messages = {
    1: "Level 151 — Supreme Rank I. Supreme tier entry — the grind is real.",
    10: "Level 160 — Supreme Rank X. A major legacy plateau passed.",
    15: "Level 165 — Supreme Rank XV. Another major milestone.",
    20: "Level 170 — Supreme Rank XX. Elite legacy continues.",
    25: "Level 175 — Supreme Rank XXV. Supreme legacy milestone unlocked.",
  };
  return messages[rank] || `Level ${level} — Supreme Rank ${toRoman(rank)}. Legacy deepens.`;
}

function getChampionNotification(level, rank) {
  const messages = {
    1: "Level 176 — Champion Rank I. Champion ascent begins — elite commitment.",
    10: "Level 185 — Champion Rank X. A major champion milestone.",
    15: "Level 190 — Champion Rank XV. Consistent elite performance.",
    20: "Level 195 — Champion Rank XX. Top champion tier reached.",
    25: "Level 200 — Champion Rank XXV. Champion legacy milestone achieved.",
  };
  return messages[rank] || `Level ${level} — Champion Rank ${toRoman(rank)}. Your training legacy grows.`;
}

function getLegendaryNotification(level, rank) {
  const messages = {
    1: "Level 201 — Legendary Rank I. Legendary ascent begins — rare commitment.",
    10: "Level 210 — Legendary Rank X. A major legacy milestone.",
    15: "Level 215 — Legendary Rank XV. Major long-term milestone.",
    20: "Level 220 — Legendary Rank XX. Legendary achievement badge unlocked.",
    25: "Level 225 — Legendary Rank XXV. Legendary status recognized.",
  };
  return messages[rank] || `Level ${level} — Legendary Rank ${toRoman(rank)}. Long-term excellence amplified.`;
}

function getIconNotification(level, rank) {
  const messages = {
    1: "Level 226 — Icon Rank I. Icon ascent begins — near-mythic commitment.",
    10: "Level 235 — Icon Rank X. Major icon milestone achieved.",
    15: "Level 240 — Icon Rank XV. Keep the long-term momentum.",
    20: "Level 245 — Icon Rank XX. Massive longevity milestone.",
    24: "Level 249 — Icon Rank XXIV. One more step to ultimate icon status.",
  };
  return messages[rank] || `Level ${level} — Icon Rank ${toRoman(rank)}. Iconic progress deepens.`;
}

// Helper function to calculate level from XP
export function calculateLevelInfo(totalXP) {
  if (!totalXP || totalXP < 0) {
    return {
      currentLevel: 1,
      levelName: "Rookie",
      currentLevelXP: 0,
      nextLevelXP: 100,
      progressPercent: 0,
      xpToNextLevel: 100,
      notification: levelSystemData[0].notification
    };
  }

  // Find current level
  let currentLevelData = levelSystemData[0];
  for (let i = levelSystemData.length - 1; i >= 0; i--) {
    if (totalXP >= levelSystemData[i].xp) {
      currentLevelData = levelSystemData[i];
      break;
    }
  }

  // Get next level data
  const currentIndex = levelSystemData.findIndex(l => l.level === currentLevelData.level);
  const nextLevelData = levelSystemData[currentIndex + 1] || {
    ...currentLevelData,
    xp: currentLevelData.xp + 10000,
    level: currentLevelData.level + 1,
    name: "Beyond Immortal"
  };

  const xpInCurrentLevel = totalXP - currentLevelData.xp;
  const xpNeededForNextLevel = nextLevelData.xp - currentLevelData.xp;
  const progressPercent = Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100);

  return {
    currentLevel: currentLevelData.level,
    levelName: currentLevelData.name,
    currentLevelXP: currentLevelData.xp,
    nextLevelXP: nextLevelData.xp,
    progressPercent: progressPercent,
    xpToNextLevel: nextLevelData.xp - totalXP,
    notification: currentLevelData.notification,
    totalXP: totalXP
  };
}

// Get tier info
export function getTierInfo(level) {
  if (level <= 10) return { tier: 1, tierName: "Foundation", color: "emerald" };
  if (level <= 25) return { tier: 2, tierName: "Development", color: "blue" };
  if (level <= 50) return { tier: 3, tierName: "Performance", color: "purple" };
  if (level <= 100) return { tier: 4, tierName: "Elite", color: "amber" };
  if (level <= 125) return { tier: 5, tierName: "Master", color: "rose" };
  if (level <= 150) return { tier: 5, tierName: "Grandmaster", color: "red" };
  if (level <= 175) return { tier: 5, tierName: "Supreme", color: "indigo" };
  if (level <= 200) return { tier: 5, tierName: "Champion", color: "pink" };
  if (level <= 225) return { tier: 5, tierName: "Legendary", color: "violet" };
  if (level <= 249) return { tier: 5, tierName: "Icon", color: "fuchsia" };
  return { tier: 6, tierName: "Immortal", color: "yellow" };
}