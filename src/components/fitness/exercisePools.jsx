// BODYWEIGHT EXERCISE CORE POOL
export const BODYWEIGHT_EXERCISES = {
  lowerBody: {
    strength: [
      'Air Squat', 'Pause Squat', 'Tempo Squat', 'Split Squat', 'Bulgarian Split Squat',
      'Reverse Lunge', 'Forward Lunge', 'Walking Lunge', 'Lateral Lunge', 'Cossack Squat',
      'Single-Leg Squat to Box', 'Wall Sit', 'Isometric Split Squat Hold'
    ],
    power: [
      'Jump Squat', 'Countermovement Jump', 'Broad Jump', 'Lateral Bounds (Skater Jumps)',
      'Tuck Jumps', 'Split Squat Jumps', 'Single-Leg Hops', 'Ankle Pogos', 'Depth Drop'
    ]
  },
  upperBody: {
    push: [
      'Push-Up', 'Incline Push-Up', 'Decline Push-Up', 'Close-Grip Push-Up', 'Wide Push-Up',
      'Tempo Push-Up', 'Pause Push-Up', 'Pike Push-Up', 'Handstand Hold (Wall-Assisted)', 'Scapular Push-Ups'
    ],
    pull: [
      'Inverted Row', 'Australian Pull-Up', 'Isometric Row Hold', 'Dead Hang', 'Scap Pull-Ups'
    ]
  },
  core: [
    'Front Plank', 'Side Plank', 'Side Plank with Reach', 'Plank Shoulder Taps', 'Plank March',
    'Dead Bug', 'Hollow Hold', 'Bird Dog', 'Bear Crawl', 'Bear Crawl Shoulder Taps',
    'Russian Twist (Bodyweight)', 'Seated Rotation Hold', 'Standing Torso Rotations',
    'Lying Windshield Wipers (bent-knee)'
  ],
  mobility: [
    'Hip Flexor Stretch', '90/90 Hip Rotation', "World's Greatest Stretch", 'Thoracic Openers',
    'Cat-Cow', 'Downward Dog', 'Ankle Mobility Rockers', 'Single-Leg Balance Hold',
    'Single-Leg Reach', 'Y-Balance Drill'
  ],
  conditioning: [
    'High Knees', 'Butt Kicks', 'Skipping (No Rope)', 'Shuttle Runs', 'Acceleration Starts',
    'Backpedal to Sprint', 'Lateral Shuffle', 'Carioca Steps'
  ]
};

// WEIGHTED EXERCISE CORE POOL
export const WEIGHTED_EXERCISES = {
  lowerBody: {
    strength: [
      'Goblet Squat', 'Dumbbell Squat', 'Barbell Back Squat', 'Front Squat', 'Box Squat',
      'Romanian Deadlift (RDL)', 'Trap Bar Deadlift', 'Dumbbell Deadlift', 'Single-Leg RDL',
      'Step-Ups (DB/BB)', 'Rear-Foot Elevated Split Squat', 'Dumbbell Lunges', 'Barbell Lunges',
      'Hip Thrust', 'Glute Bridge (Weighted)', 'Hamstring Curl (Machine or Ball)'
    ],
    power: [
      'Kettlebell Swings', 'Dumbbell Jump Squats', 'Trap Bar Jump', 'Medicine Ball Squat Throw',
      'Medicine Ball Scoop Toss', 'Calf Raises (DB/BB)', 'Seated Calf Raises', 'Single-Leg Calf Raises'
    ]
  },
  upperBody: {
    push: [
      'Dumbbell Bench Press', 'Barbell Bench Press', 'Incline DB Press', 'Overhead Dumbbell Press',
      'Landmine Press', 'Push Press (Advanced)', 'Half-Kneeling Press'
    ],
    pull: [
      'Dumbbell Rows', 'Barbell Bent-Over Row', 'Chest-Supported Row', 'Lat Pulldown',
      'Pull-Ups (Weighted Optional)', 'Face Pulls', 'Cable Rows', 'Single-Arm Cable Pulls'
    ]
  },
  rotational: [
    'Medicine Ball Rotational Throw', 'Medicine Ball Side Toss', 'Medicine Ball Slam',
    'Cable Woodchops (High → Low)', 'Cable Lifts (Low → High)', 'Landmine Rotation', 'Landmine Press + Rotation'
  ],
  core: [
    'Weighted Plank', 'Cable Anti-Rotation Press (Pallof)', 'Weighted Dead Bug',
    "Farmer's Carry", 'Suitcase Carry', 'Overhead Carry'
  ],
  shoulderHealth: [
    'External Rotation (Band/Cable)', 'Internal Rotation (Band/Cable)', 'YTWL Raises',
    'Scapular Retractions', 'Serratus Wall Slides'
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
    'Romanian Deadlift (RDL)': 'Soft knees, hinge at hips',
    'Inverted Row': 'Pull shoulder blades together',
    'Medicine Ball Slam': 'Full extension, slam hard',
    'Kettlebell Swings': 'Hip hinge power, not arms',
  };
  return notes[exerciseName] || 'Focus on form and control';
}

// Workout generation logic
export function generateWorkout(bodyPart, goal, level, targetDurationMinutes) {
  const mapping = {
    arm: 'upperBody',
    chest: 'upperBody',
    shoulder: 'upperBody',
    back: 'upperBody',
    leg: 'lowerBody',
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
    // Full body: mix everything
    exercises = [
      ...BODYWEIGHT_EXERCISES.lowerBody.strength.slice(0, 3),
      ...BODYWEIGHT_EXERCISES.upperBody.push.slice(0, 3),
      ...BODYWEIGHT_EXERCISES.upperBody.pull.slice(0, 2),
      ...BODYWEIGHT_EXERCISES.core.slice(0, 3),
      ...WEIGHTED_EXERCISES.lowerBody.strength.slice(0, 2),
      ...WEIGHTED_EXERCISES.upperBody.push.slice(0, 2),
      ...WEIGHTED_EXERCISES.rotational.slice(0, 2)
    ];
  } else if (category === 'lowerBody') {
    exercises = [
      ...BODYWEIGHT_EXERCISES.lowerBody.strength,
      ...BODYWEIGHT_EXERCISES.lowerBody.power,
      ...WEIGHTED_EXERCISES.lowerBody.strength,
      ...WEIGHTED_EXERCISES.lowerBody.power
    ];
  } else if (category === 'upperBody') {
    exercises = [
      ...BODYWEIGHT_EXERCISES.upperBody.push,
      ...BODYWEIGHT_EXERCISES.upperBody.pull,
      ...WEIGHTED_EXERCISES.upperBody.push,
      ...WEIGHTED_EXERCISES.upperBody.pull
    ];
  } else if (category === 'core') {
    exercises = [
      ...BODYWEIGHT_EXERCISES.core,
      ...WEIGHTED_EXERCISES.core,
      ...WEIGHTED_EXERCISES.rotational
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