
// Comprehensive Exercise Database
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
    'Explosive Push-Up'
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
    'L-Sit Pull-Up'
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
    'Wall Sit'
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
    'Toes to Bar'
  ],
  mobility: [
    'Cat-Cow',
    "World's Greatest Stretch", // Corrected typo from "World Greatest Stretch"
    'Spiderman Lunge',
    'Shoulder Dislocate',
    'Wrist Circles',
    'Ankle Circles',
    'Hip Circles',
    'Scorpion Stretch',
    'Seal Stretch',
    'Child Pose',
    'Cobra Stretch'
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
    'Bear Crawl'
  ]
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
    'Dumbbell Chest Fly'
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
    'Trap Bar Deadlift'
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
    'Bradford Press'
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
    'Cable Overhead Extension'
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
    'Leg Press Calf Raise'
  ],
  fullBody: [
    'Power Clean',
    'Clean and Press',
    'Snatch',
    'Thruster',
    'Kettlebell Swing',
    'Turkish Get-Up',
    'Man Maker',
    'Dumbbell Complex'
  ]
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
    'Romanian Deadlift': 'Soft knees, hinge at hips', // Updated name to match new Weighted Exercises
    'Inverted Row': 'Pull shoulder blades together',
    'Medicine Ball Slam': 'Full extension, slam hard',
    'Kettlebell Swing': 'Hip hinge power, not arms', // Updated name to match new Weighted Exercises
  };
  return notes[exerciseName] || 'Focus on form and control';
}

// Workout generation logic
export function generateWorkout(bodyPart, goal, level, targetDurationMinutes) {
  const mapping = {
    arm: 'arms', // Updated to match new structure
    chest: 'chest', // Updated to match new structure
    shoulder: 'shoulders', // Updated to match new structure
    back: 'back', // Updated to match new structure
    leg: 'legs', // Updated to match new structure
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
    // Full body: mix everything - Example selection strategy for full body
    // This section needs to be adapted significantly given the new structure
    // For now, I'll pick a diverse set to avoid breaking existing logic,
    // but a more robust strategy for 'full' might be needed.
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
    exercises = [
      ...BODYWEIGHT_EXERCISES.legs,
      ...WEIGHTED_EXERCISES.legs
    ];
  } else if (category === 'chest') {
    exercises = [
      ...BODYWEIGHT_EXERCISES.push, // Push exercises for chest
      ...WEIGHTED_EXERCISES.chest
    ];
  } else if (category === 'back') {
    exercises = [
      ...BODYWEIGHT_EXERCISES.pull, // Pull exercises for back
      ...WEIGHTED_EXERCISES.back
    ];
  } else if (category === 'shoulders') {
    // No specific bodyweight category for shoulders, rely on weighted
    exercises = [
      ...BODYWEIGHT_EXERCISES.push.filter(ex => ex.includes('Pike') || ex.includes('Handstand')), // Pike Push-Up, Handstand Push-Up can target shoulders
      ...WEIGHTED_EXERCISES.shoulders
    ];
  } else if (category === 'arms') {
    // No specific bodyweight category for arms, rely on weighted and some pull/push
    exercises = [
      ...BODYWEIGHT_EXERCISES.pull.filter(ex => ex.includes('Chin-Up') || ex.includes('Close Grip Pull-Up')), // Chin-ups for biceps
      ...BODYWEIGHT_EXERCISES.push.filter(ex => ex.includes('Diamond Push-Up')), // Diamond Push-up for triceps
      ...WEIGHTED_EXERCISES.arms
    ];
  } else if (category === 'core') {
    exercises = [
      ...BODYWEIGHT_EXERCISES.core,
      // Consider adding some weighted core if desired, e.g., from WEIGHTED_EXERCISES.fullBody or a new 'weightedCore' category if added
      // For now, stick to just bodyweight core if no explicit weighted core category exists.
    ];
  }

  // Shuffle and select appropriate number based on duration
  const shuffled = exercises.sort(() => Math.random() - 0.5);
  const exerciseCount = Math.min(
    Math.max(Math.floor(targetDurationMinutes / 2), 8),
    shuffled.length
  );

  return shuffled
    .slice(0, exerciseCount)
    .map(ex => getExerciseDetails(ex, level, internalGoal));
}
