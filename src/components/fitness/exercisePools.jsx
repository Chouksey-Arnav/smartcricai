// Comprehensive Exercise Database — Extended with Cricket-Specific Exercises
// All exercises categorized by type and muscle group

export const BODYWEIGHT_EXERCISES = {
  push: [
    'Push-Up',
    'Wide Push-Up',
    'Diamond Push-Up',
    'Decline Push-Up',
    'Incline Push-Up',
    'Pike Push-Up',
    'Archer Push-Up',
    'Hindu Push-Up',
    'Dive Bomber Push-Up',
    'Pseudo Planche Push-Up',
    'Handstand Push-Up (Wall)',
    'Clapping Push-Up',
    'Explosive Push-Up',
    'Hand Release Push-Up',
    'Medicine Ball Push-Up',
  ],
  pull: [
    'Pull-Up',
    'Chin-Up',
    'Wide Grip Pull-Up',
    'Close Grip Pull-Up',
    'Neutral Grip Pull-Up',
    'Archer Pull-Up',
    'Typewriter Pull-Up',
    'Muscle-Up',
    'Australian Pull-Up',
    'Inverted Row',
    'Scap Pull-Ups',
    'Dead Hang',
    'L-Sit Pull-Up',
  ],
  legs: [
    'Squat',
    'Air Squat',
    'Jump Squat',
    'Pistol Squat',
    'Shrimp Squat',
    'Pause Squat',
    'Split Squat',
    'Bulgarian Split Squat',
    'Walking Lunge',
    'Reverse Lunge',
    'Lateral Lunge',
    'Cossack Squat',
    'Step-Up',
    'Box Jump',
    'Broad Jump',
    'Single Leg Deadlift',
    'Nordic Curl',
    'Sissy Squat',
    'Wall Sit',
    // NEW
    'Ankle Pogos',
    'Calf Raise Single-Leg',
    'Drop Jump',
    'Elevated Single-Leg Glute Bridge',
    'Fifer Scissor Hops',
    'Fire Hydrant',
    'Glute Bridge',
    'Glute Bridge March',
    'Glute-Ham Raise',
    'High Knees',
    'Hip Airplane',
    'Isometric Wall Sit',
    'Lateral Bound (Skater)',
    'Lunge to Knee Drive',
    'Nordic Hamstring Curl',
  ],
  core: [
    'Plank',
    'Side Plank',
    'Hollow Hold',
    'Arch Hold',
    'L-Sit',
    'V-Sit',
    'Dead Bug',
    'Bird Dog',
    'Bicycle Crunch',
    'Russian Twist',
    'Mountain Climber',
    'Plank to Pike',
    'Windshield Wiper',
    'Dragon Flag',
    'Ab Wheel Rollout',
    'Hanging Leg Raise',
    'Toes to Bar',
    // NEW
    'Dish Drill',
    'GHD Sit-Up',
    'Hanging Knee Raises',
    'Hanging Straight Leg Raise',
    'Hollow Rock',
  ],
  mobility: [
    'Cat-Cow',
    "World's Greatest Stretch",
    'Spiderman Lunge',
    'Shoulder Dislocate',
    'Wrist Circles',
    'Ankle Circles',
    'Hip Circles',
    'Scorpion Stretch',
    'Seal Stretch',
    'Child Pose',
    'Cobra Stretch',
    'Hip Flexor Stretch',
    'Ankle Dorsiflexion',
  ],
  cardio: [
    'Burpee',
    'Mountain Climber',
    'High Knees',
    'Butt Kicks',
    'Jumping Jacks',
    'Star Jumps',
    'Tuck Jumps',
    'Skater Hops',
    'Bear Crawl',
    // NEW
    'Agility Ladder Drills',
    'Jump Rope',
    'Hill Sprint',
    'Box Drill',
    'Cycling Sprint Intervals',
  ],
  arms: [
    'Dips Bench',
    'Push-Up (Diamond)',
  ],
};

export const WEIGHTED_EXERCISES = {
  chest: [
    'Barbell Bench Press',
    'Dumbbell Bench Press',
    'Incline Barbell Press',
    'Incline Dumbbell Press',
    'Decline Bench Press',
    'Dumbbell Floor Press',
    'Landmine Press',
    'Cable Chest Fly',
    'Dumbbell Chest Fly',
    // NEW
    'Bench Press Close Grip',
    'Cable Chest Press',
    'Machine Chest Press',
    'Incline Bench Press',
  ],
  back: [
    'Barbell Row',
    'Dumbbell Row',
    'T-Bar Row',
    'Chest-Supported Row',
    'Seal Row',
    'Lat Pulldown',
    'Cable Row',
    'Single Arm Cable Row',
    'Face Pull',
    'Reverse Fly',
    'Deadlift',
    'Romanian Deadlift',
    'Trap Bar Deadlift',
    // NEW
    'Back Extension',
    'Clincher Row',
    'Fishing Pull',
    'Good Morning',
    'Iso-Lateral Row Machine',
    'Jefferson Curl',
    'Lat Pushdown',
    'Machine Seated Row',
    'Single-Arm Dumbbell Row',
  ],
  shoulders: [
    'Overhead Press',
    'Dumbbell Shoulder Press',
    'Arnold Press',
    'Lateral Raise',
    'Front Raise',
    'Rear Delt Fly',
    'Cable Lateral Raise',
    'Upright Row',
    'Push Press',
    'Bradford Press',
    // NEW
    'Cable Rope Face Pull',
    'Dumbbell Lateral Raise',
    'Dumbbell Rear Delt Fly',
    'KB Overhead Carry',
    'Overhead Press (Barbell)',
    'YTWL Band Sequence',
  ],
  arms: [
    'Barbell Curl',
    'Dumbbell Curl',
    'Hammer Curl',
    'Preacher Curl',
    'Cable Curl',
    'Tricep Pushdown',
    'Overhead Tricep Extension',
    'Skull Crusher',
    'Close-Grip Bench Press',
    'Dumbbell Kickback',
    'Cable Overhead Extension',
    // NEW
    'Concentration Curl',
    'Curl to Press',
    'EZ-Bar Skullcrusher',
  ],
  legs: [
    'Barbell Back Squat',
    'Front Squat',
    'Goblet Squat',
    'Leg Press',
    'Hack Squat',
    'Bulgarian Split Squat (Weighted)',
    'Walking Lunge (Weighted)',
    'Leg Extension',
    'Leg Curl',
    'Calf Raise',
    'Barbell Hip Thrust',
    'Romanian Deadlift',
    'Good Morning',
    'Leg Press Calf Raise',
    // NEW
    'Back Squat',
    'Calf Raise (Standing)',
    'Cluster Set Lower Body',
    'Deadlift Conventional',
    'Deadlift Trap Bar',
    'Goblet Reverse Lunge',
    'Hamstring Curl Machine',
    'Hip Thrust (Weighted)',
    'KB Goblet Squat',
    'KB Lunge Walk',
  ],
  fullBody: [
    'Power Clean',
    'Clean and Press',
    'Snatch',
    'Thruster',
    'Kettlebell Swing',
    'Turkish Get-Up',
    'Man Maker',
    'Dumbbell Complex',
    // NEW
    'Battle Rope Alternating Waves',
    'Battle Ropes',
    'Clean and Jerk',
    'Clean Pull',
    'Double KB Swing',
    'Farmer Carry Heavy',
    "Farmer's Carry",
    'Front Rack Carry',
    'KB Clean to Press',
    "KB Farmer's Carry Bottoms-Up",
    'KB Sumo Deadlift High Pull',
    'KB Turkish Get-Up',
    'Kettlebell Snatch',
    'Medicine Ball Overhead Catch',
    'Sandbag Carry',
    'Sled Push',
  ],
  weightedCore: [
    'Ab Wheel Rollout',
    'Cable Anti-Rotation Hold',
    'Cable Woodchop High to Low',
    'Cross-Body Cable Lift',
    'Half-Kneeling Cable Lift',
    'Landmine Rotation',
    'Medicine Ball Rotational Throw',
    'Medicine Ball Scoop Toss',
    'Medicine Ball Side Toss',
    'Medicine Ball Slam',
    'Pallof Press',
  ],
};

// Exercise details generator
export function getExerciseDetails(exerciseName, level, goal) {
  const baseDetails = {
    beginner: { sets: 2, rest: 90 },
    intermediate: { sets: 3, rest: 60 },
    advanced: { sets: 4, rest: 45 },
    pro: { sets: 5, rest: 30 }
  };

  const repRanges = {
    lose_weight: '15-20',
    build_muscle: '8-12',
    keep_fit: '12-15',
    endurance: '15-20',
    strength: '8-12',
    flexibility: '10-15'
  };

  const { sets, rest } = baseDetails[level] || baseDetails.beginner;
  const reps = repRanges[goal] || '12-15';

  return {
    name: exerciseName,
    sets,
    rest_seconds: rest,
    reps,
    notes: generateExerciseNotes(exerciseName)
  };
}

function generateExerciseNotes(exerciseName) {
  const notes = {
    'Push-Up': 'Keep core tight, elbows at 45°',
    'Air Squat': 'Chest up, knees track over toes',
    'Front Plank': 'Straight line from head to heels',
    'Goblet Squat': 'Hold weight at chest, drive through heels',
    'Romanian Deadlift': 'Soft knees, hinge at hips',
    'Inverted Row': 'Pull shoulder blades together',
    'Medicine Ball Slam': 'Full extension, slam hard',
    'Kettlebell Swing': 'Hip hinge power, not arms',
  };
  return notes[exerciseName] || 'Focus on form and control';
}

// Workout generation logic
export function generateWorkout(bodyPart, goal, level, targetDurationMinutes) {
  const mapping = {
    arm: 'arms',
    chest: 'chest',
    shoulder: 'shoulders',
    back: 'back',
    leg: 'legs',
    core: 'core',
    full_body: 'full'
  };

  const goalMapping = {
    lose_weight: 'endurance',
    build_muscle: 'strength',
    keep_fit: 'flexibility'
  };

  const category = mapping[bodyPart] || 'full';
  const internalGoal = goalMapping[goal] || goal;

  let exercises = [];

  if (category === 'full') {
    exercises = [
      ...BODYWEIGHT_EXERCISES.legs.slice(0, 3),
      ...BODYWEIGHT_EXERCISES.push.slice(0, 2),
      ...BODYWEIGHT_EXERCISES.pull.slice(0, 2),
      ...BODYWEIGHT_EXERCISES.core.slice(0, 2),
      ...WEIGHTED_EXERCISES.legs.slice(0, 2),
      ...WEIGHTED_EXERCISES.chest.slice(0, 2),
      ...WEIGHTED_EXERCISES.back.slice(0, 1),
      ...WEIGHTED_EXERCISES.fullBody.slice(0, 1)
    ];
  } else if (category === 'legs') {
    exercises = [...BODYWEIGHT_EXERCISES.legs, ...WEIGHTED_EXERCISES.legs];
  } else if (category === 'chest') {
    exercises = [...BODYWEIGHT_EXERCISES.push, ...WEIGHTED_EXERCISES.chest];
  } else if (category === 'back') {
    exercises = [...BODYWEIGHT_EXERCISES.pull, ...WEIGHTED_EXERCISES.back];
  } else if (category === 'shoulders') {
    exercises = [
      ...BODYWEIGHT_EXERCISES.push.filter(ex => ex.includes('Pike') || ex.includes('Handstand')),
      ...WEIGHTED_EXERCISES.shoulders
    ];
  } else if (category === 'arms') {
    exercises = [
      ...BODYWEIGHT_EXERCISES.pull.filter(ex => ex.includes('Chin-Up') || ex.includes('Close Grip Pull-Up')),
      ...BODYWEIGHT_EXERCISES.push.filter(ex => ex.includes('Diamond')),
      ...WEIGHTED_EXERCISES.arms
    ];
  } else if (category === 'core') {
    exercises = [...BODYWEIGHT_EXERCISES.core, ...WEIGHTED_EXERCISES.weightedCore];
  }

  const shuffled = exercises.sort(() => Math.random() - 0.5);
  const exerciseCount = Math.min(
    Math.max(Math.floor(targetDurationMinutes / 2), 8),
    shuffled.length
  );

  return shuffled
    .slice(0, exerciseCount)
    .map(ex => getExerciseDetails(ex, level, internalGoal));
}