// Daily Challenge Database - Pre-made challenges (no LLM invocations)
// Each challenge is a small, achievable task with clear instructions

export const dailyChallengesDatabase = [
  // BATTING CHALLENGES
  { id: 'bat_c01', title: 'Shadow Batting', description: 'Practice 20 perfect forward defense shots in front of mirror', category: 'batting', difficulty: 'easy', xp_value: 25 },
  { id: 'bat_c02', title: 'Straight Drive Focus', description: 'Hit 15 straight drives off a bowling machine or throwdowns', category: 'batting', difficulty: 'easy', xp_value: 30 },
  { id: 'bat_c03', title: 'Footwork Drill', description: 'Practice front and back foot movement for 10 minutes', category: 'batting', difficulty: 'easy', xp_value: 25 },
  { id: 'bat_c04', title: 'Cover Drive Mastery', description: 'Perfect 20 cover drives with proper footwork', category: 'batting', difficulty: 'medium', xp_value: 35 },
  { id: 'bat_c05', title: 'Pull Shot Practice', description: 'Practice pull shots against short-pitched deliveries (20 reps)', category: 'batting', difficulty: 'medium', xp_value: 35 },
  { id: 'bat_c06', title: 'Sweep Shot Training', description: 'Practice sweep and reverse sweep (15 each)', category: 'batting', difficulty: 'medium', xp_value: 40 },
  { id: 'bat_c07', title: 'Single Taking', description: 'Focus on rotating strike - practice quick singles for 15 minutes', category: 'batting', difficulty: 'easy', xp_value: 30 },
  { id: 'bat_c08', title: 'Late Cut Precision', description: 'Master the late cut with 20 perfect executions', category: 'batting', difficulty: 'medium', xp_value: 35 },
  { id: 'bat_c09', title: 'Stance Check', description: 'Video your batting stance and analyze grip, balance, head position', category: 'batting', difficulty: 'easy', xp_value: 20 },
  { id: 'bat_c10', title: 'Spin Counter', description: 'Face 30 spin deliveries, focus on reading the ball', category: 'batting', difficulty: 'hard', xp_value: 45 },
  { id: 'bat_c11', title: 'Leaving Practice', description: 'Practice leaving balls outside off stump (30 balls)', category: 'batting', difficulty: 'easy', xp_value: 25 },
  { id: 'bat_c12', title: 'Power Hitting', description: 'Practice 10 powerful six-hitting shots with proper technique', category: 'batting', difficulty: 'hard', xp_value: 50 },

  // BOWLING CHALLENGES
  { id: 'bowl_c01', title: 'Yorker Accuracy', description: 'Bowl 15 yorkers at a target (coin or marker)', category: 'bowling', difficulty: 'medium', xp_value: 35 },
  { id: 'bowl_c02', title: 'Line & Length', description: 'Bowl 30 balls aiming for consistent good length outside off', category: 'bowling', difficulty: 'easy', xp_value: 30 },
  { id: 'bowl_c03', title: 'Slower Ball Mastery', description: 'Practice 20 slower ball variations', category: 'bowling', difficulty: 'medium', xp_value: 40 },
  { id: 'bowl_c04', title: 'Bouncer Control', description: 'Bowl 15 well-directed bouncers at chest/head height', category: 'bowling', difficulty: 'hard', xp_value: 45 },
  { id: 'bowl_c05', title: 'Spin Variation', description: 'Practice 10 off-spinners and 10 leg-spinners with consistent turn', category: 'bowling', difficulty: 'medium', xp_value: 40 },
  { id: 'bowl_c06', title: 'Wide Yorkers', description: 'Bowl 10 wide yorkers targeting the tramline', category: 'bowling', difficulty: 'hard', xp_value: 50 },
  { id: 'bowl_c07', title: 'Wrist Position', description: 'Check and practice correct wrist position for 15 minutes', category: 'bowling', difficulty: 'easy', xp_value: 25 },
  { id: 'bowl_c08', title: 'Death Overs Sim', description: 'Practice bowling under pressure - 6 balls defending 10 runs', category: 'bowling', difficulty: 'hard', xp_value: 50 },
  { id: 'bowl_c09', title: 'Run-Up Consistency', description: 'Mark your run-up and practice 20 deliveries hitting the crease perfectly', category: 'bowling', difficulty: 'easy', xp_value: 20 },
  { id: 'bowl_c10', title: 'Googly Practice', description: 'Bowl 20 googlies focusing on disguise and turn', category: 'bowling', difficulty: 'hard', xp_value: 50 },

  // FIELDING CHALLENGES
  { id: 'field_c01', title: 'Catching Drill', description: 'Catch 30 high catches without dropping', category: 'fielding', difficulty: 'easy', xp_value: 25 },
  { id: 'field_c02', title: 'Ground Fielding', description: 'Field 25 ground balls cleanly, focus on technique', category: 'fielding', difficulty: 'easy', xp_value: 25 },
  { id: 'field_c03', title: 'Throw Accuracy', description: 'Hit the stumps 10 times from 20m distance', category: 'fielding', difficulty: 'medium', xp_value: 35 },
  { id: 'field_c04', title: 'Diving Catches', description: 'Practice 15 diving catches (left and right)', category: 'fielding', difficulty: 'hard', xp_value: 45 },
  { id: 'field_c05', title: 'Quick Pickup', description: 'Practice picking up and throwing in one motion (20 reps)', category: 'fielding', difficulty: 'medium', xp_value: 30 },
  { id: 'field_c06', title: 'Boundary Save', description: 'Practice 10 sliding stops at the boundary rope', category: 'fielding', difficulty: 'medium', xp_value: 35 },
  { id: 'field_c07', title: 'Slip Catching', description: 'Stand in slips position, take 20 reaction catches', category: 'fielding', difficulty: 'hard', xp_value: 40 },
  { id: 'field_c08', title: 'Keeper Basics', description: 'Practice 30 clean takes behind the stumps', category: 'fielding', difficulty: 'medium', xp_value: 35 },

  // FITNESS CHALLENGES
  { id: 'fit_c01', title: '50 Push-Ups', description: 'Complete 50 push-ups with perfect form (can break into sets)', category: 'fitness', difficulty: 'easy', xp_value: 25 },
  { id: 'fit_c02', title: '100 Squats', description: 'Complete 100 bodyweight squats', category: 'fitness', difficulty: 'medium', xp_value: 35 },
  { id: 'fit_c03', title: 'Plank Hold', description: 'Hold a plank for 3 minutes total (breaks allowed)', category: 'fitness', difficulty: 'medium', xp_value: 30 },
  { id: 'fit_c04', title: 'Sprint Session', description: 'Run 10 x 50m sprints with 30s rest between', category: 'fitness', difficulty: 'hard', xp_value: 45 },
  { id: 'fit_c05', title: 'Burpee Blast', description: 'Complete 30 burpees as fast as possible', category: 'fitness', difficulty: 'hard', xp_value: 40 },
  { id: 'fit_c06', title: 'Core Circuit', description: 'Plank 60s, Side Plank 30s each, Hollow Hold 45s - 3 rounds', category: 'fitness', difficulty: 'medium', xp_value: 35 },
  { id: 'fit_c07', title: 'Agility Ladder', description: 'Complete 15 minutes of agility ladder drills', category: 'fitness', difficulty: 'medium', xp_value: 35 },
  { id: 'fit_c08', title: 'Jump Training', description: 'Practice box jumps or broad jumps - 4 sets of 8', category: 'fitness', difficulty: 'medium', xp_value: 30 },

  // MENTAL CHALLENGES
  { id: 'mental_c01', title: 'Visualization', description: 'Spend 10 minutes visualizing perfect batting innings', category: 'mental', difficulty: 'easy', xp_value: 20 },
  { id: 'mental_c02', title: 'Breathing Practice', description: 'Practice 4-7-8 breathing technique for 10 minutes', category: 'mental', difficulty: 'easy', xp_value: 20 },
  { id: 'mental_c03', title: 'Match Simulation', description: 'Mentally replay a tough match situation and how you would handle it', category: 'mental', difficulty: 'medium', xp_value: 30 },
  { id: 'mental_c04', title: 'Pressure Simulation', description: 'Practice batting/bowling imagining high-pressure scenario for 15 min', category: 'mental', difficulty: 'hard', xp_value: 40 },
  { id: 'mental_c05', title: 'Positive Affirmations', description: 'Write down 10 positive cricket affirmations and repeat them', category: 'mental', difficulty: 'easy', xp_value: 15 },
  { id: 'mental_c06', title: 'Focus Exercise', description: 'Practice focusing on the ball for 15 minutes using a tennis ball drop drill', category: 'mental', difficulty: 'medium', xp_value: 30 },

  // SKILL DEVELOPMENT
  { id: 'skill_c01', title: 'Video Analysis', description: 'Record and analyze your batting/bowling technique for 20 minutes', category: 'skill', difficulty: 'medium', xp_value: 35 },
  { id: 'skill_c02', title: 'Rules Study', description: 'Learn 5 new cricket rules or clarifications', category: 'skill', difficulty: 'easy', xp_value: 20 },
  { id: 'skill_c03', title: 'Watch & Learn', description: 'Watch 30 minutes of professional cricket, focus on technique', category: 'skill', difficulty: 'easy', xp_value: 20 },
  { id: 'skill_c04', title: 'Grip Practice', description: 'Practice different grips (bowling/batting) for 15 minutes', category: 'skill', difficulty: 'easy', xp_value: 20 },
  { id: 'skill_c05', title: 'Match Strategy', description: 'Study and note down 5 different match strategies', category: 'skill', difficulty: 'medium', xp_value: 30 },
  { id: 'skill_c06', title: 'Weakness Focus', description: 'Identify your biggest weakness and practice it for 20 minutes', category: 'skill', difficulty: 'hard', xp_value: 45 }
];

// Get random daily challenge
export function getRandomDailyChallenge() {
  const randomIndex = Math.floor(Math.random() * dailyChallengesDatabase.length);
  return dailyChallengesDatabase[randomIndex];
}

// Get challenge by difficulty
export function getChallengesByDifficulty(difficulty) {
  return dailyChallengesDatabase.filter(c => c.difficulty === difficulty);
}

// Get challenge by category
export function getChallengesByCategory(category) {
  return dailyChallengesDatabase.filter(c => c.category === category);
}