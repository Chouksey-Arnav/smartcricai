// Comprehensive Exercise Pools for Fitness Builder

export const BODYWEIGHT_EXERCISES = {
  lowerBody: {
    strength: [
      'Air Squat', 'Pause Squat', 'Tempo Squat', 'Split Squat', 'Bulgarian Split Squat',
      'Reverse Lunge', 'Forward Lunge', 'Walking Lunge', 'Lateral Lunge', 'Cossack Squat',
      'Single-Leg Squat to Box', 'Wall Sit', 'Isometric Split Squat Hold'
    ],
    power: [
      'Jump Squat', 'Countermovement Jump', 'Broad Jump', 'Lateral Bounds',
      'Tuck Jumps', 'Split Squat Jumps', 'Single-Leg Hops', 'Ankle Pogos'
    ]
  },
  upperBody: {
    push: [
      'Push-Up', 'Incline Push-Up', 'Decline Push-Up', 'Close-Grip Push-Up',
      'Wide Push-Up', 'Tempo Push-Up', 'Pause Push-Up', 'Pike Push-Up',
      'Handstand Hold', 'Scapular Push-Ups'
    ],
    pull: [
      'Inverted Row', 'Australian Pull-Up', 'Isometric Row Hold',
      'Dead Hang', 'Scap Pull-Ups'
    ]
  },
  core: [
    'Front Plank', 'Side Plank', 'Side Plank with Reach', 'Plank Shoulder Taps',
    'Plank March', 'Dead Bug', 'Hollow Hold', 'Bird Dog', 'Bear Crawl',
    'Bear Crawl Shoulder Taps', 'Russian Twist', 'Seated Rotation Hold',
    'Standing Torso Rotations', 'Lying Windshield Wipers'
  ],
  mobility: [
    'Hip Flexor Stretch', '90/90 Hip Rotation', 'World\'s Greatest Stretch',
    'Thoracic Openers', 'Cat-Cow', 'Downward Dog', 'Ankle Mobility Rockers',
    'Single-Leg Balance Hold', 'Single-Leg Reach', 'Y-Balance Drill'
  ],
  conditioning: [
    'High Knees', 'Butt Kicks', 'Skipping', 'Shuttle Runs',
    'Acceleration Starts', 'Backpedal to Sprint', 'Lateral Shuffle', 'Carioca Steps'
  ]
};

export const WEIGHTED_EXERCISES = {
  lowerBody: {
    strength: [
      'Goblet Squat', 'Dumbbell Squat', 'Barbell Back Squat', 'Front Squat',
      'Box Squat', 'Romanian Deadlift', 'Trap Bar Deadlift', 'Dumbbell Deadlift',
      'Single-Leg RDL', 'Step-Ups', 'Rear-Foot Elevated Split Squat',
      'Dumbbell Lunges', 'Barbell Lunges', 'Hip Thrust', 'Glute Bridge',
      'Hamstring Curl'
    ],
    power: [
      'Kettlebell Swings', 'Dumbbell Jump Squats', 'Trap Bar Jump',
      'Medicine Ball Squat Throw', 'Medicine Ball Scoop Toss',
      'Calf Raises', 'Seated Calf Raises', 'Single-Leg Calf Raises'
    ]
  },
  upperBody: {
    push: [
      'Dumbbell Bench Press', 'Barbell Bench Press', 'Incline DB Press',
      'Overhead Dumbbell Press', 'Landmine Press', 'Push Press', 'Half-Kneeling Press'
    ],
    pull: [
      'Dumbbell Rows', 'Barbell Bent-Over Row', 'Chest-Supported Row',
      'Lat Pulldown', 'Pull-Ups', 'Face Pulls', 'Cable Rows', 'Single-Arm Cable Pulls'
    ]
  },
  rotational: [
    'Medicine Ball Rotational Throw', 'Medicine Ball Side Toss',
    'Medicine Ball Slam', 'Cable Woodchops', 'Cable Lifts',
    'Landmine Rotation', 'Landmine Press + Rotation'
  ],
  coreWeighted: [
    'Weighted Plank', 'Cable Anti-Rotation Press',
    'Weighted Dead Bug', 'Farmer\'s Carry', 'Suitcase Carry', 'Overhead Carry'
  ],
  shoulderHealth: [
    'External Rotation', 'Internal Rotation', 'YTWL Raises',
    'Scapular Retractions', 'Serratus Wall Slides'
  ]
};

// Exercise details with sets, reps, rest
export function getExerciseDetails(exerciseName, level, goal, duration) {
  const baseDetails = {
    beginner: { sets: 3, rest_seconds: 60 },
    intermediate: { sets: 4, rest_seconds: 45 },
    advanced: { sets: 4, rest_seconds: 30 },
    pro: { sets: 5, rest_seconds: 30 }
  }[level] || { sets: 3, rest_seconds: 60 };

  const repsMap = {
    strength: '8-12',
    endurance: '15-20',
    flexibility: '30-60 sec'
  };

  return {
    name: exerciseName,
    ...baseDetails,
    reps: repsMap[goal] || '12',
    notes: generateExerciseNotes(exerciseName)
  };
}

function generateExerciseNotes(exerciseName) {
  const notes = {
    'Push-Up': 'Keep core tight, chest to ground',
    'Air Squat': 'Full depth, knees tracking toes',
    'Front Plank': 'Straight body, no sagging',
    'Jump Squat': 'Land softly, full extension',
    'Goblet Squat': 'Hold weight at chest',
    'Romanian Deadlift': 'Hinge at hips, neutral spine',
    'Inverted Row': 'Pull chest to bar',
    'Dead Bug': 'Press lower back down',
    'Lateral Lunge': 'Push through heel'
  };
  return notes[exerciseName] || 'Maintain proper form';
}

export function generateWorkout(bodyPart, goal, level, duration) {
  const numExercises = Math.min(Math.floor(duration / 2) + 5, 15); // 10-15 exercises
  
  const exercises = [];
  const usedExercises = new Set();

  // Enhanced body part mapping covering ALL possible selections
  const bodyPartMapping = {
    full_body: ['lowerBody.strength', 'upperBody.push', 'upperBody.pull', 'core', 'mobility'],
    chest: ['upperBody.push', 'core', 'shoulderHealth'],
    back: ['upperBody.pull', 'core', 'lowerBody.strength'],
    legs: ['lowerBody.strength', 'lowerBody.power', 'mobility'],
    arms: ['upperBody.push', 'upperBody.pull'],
    shoulders: ['upperBody.push', 'shoulderHealth', 'core'],
    core: ['core', 'coreWeighted', 'mobility'],
    // Alternative spellings
    arm: ['upperBody.push', 'upperBody.pull'],
    leg: ['lowerBody.strength', 'lowerBody.power'],
    shoulder: ['upperBody.push', 'shoulderHealth']
  };

  const goalMapping = {
    strength: 'strength',
    endurance: 'endurance',
    flexibility: 'flexibility',
    lose_weight: 'endurance',
    build_muscle: 'strength',
    keep_fit: 'strength'
  };

  const mappedGoal = goalMapping[goal] || 'strength';
  const categories = bodyPartMapping[bodyPart] || bodyPartMapping.full_body;

  // Helper to get exercises from a category path
  const getExercisesFromPath = (path) => {
    const [main, sub] = path.split('.');
    if (sub) {
      return (level === 'beginner' || level === 'intermediate') 
        ? BODYWEIGHT_EXERCISES[main]?.[sub] || []
        : [...(BODYWEIGHT_EXERCISES[main]?.[sub] || []), ...(WEIGHTED_EXERCISES[main]?.[sub] || [])];
    }
    return (level === 'beginner' || level === 'intermediate')
      ? BODYWEIGHT_EXERCISES[main] || []
      : [...(BODYWEIGHT_EXERCISES[main] || []), ...(WEIGHTED_EXERCISES[main] || [])];
  };

  // Collect all available exercises
  let availableExercises = [];
  categories.forEach(cat => {
    availableExercises.push(...getExercisesFromPath(cat));
  });

  // Add conditioning if endurance goal
  if (mappedGoal === 'endurance') {
    availableExercises.push(...(BODYWEIGHT_EXERCISES.conditioning || []));
  }

  // Add mobility if flexibility goal
  if (mappedGoal === 'flexibility') {
    availableExercises.push(...(BODYWEIGHT_EXERCISES.mobility || []));
  }

  // Remove duplicates
  availableExercises = [...new Set(availableExercises)];

  // Select random unique exercises
  while (exercises.length < numExercises && availableExercises.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableExercises.length);
    const exercise = availableExercises[randomIndex];
    
    if (!usedExercises.has(exercise)) {
      exercises.push(getExerciseDetails(exercise, level, mappedGoal, duration));
      usedExercises.add(exercise);
    }
    
    availableExercises.splice(randomIndex, 1);
  }

  return exercises;
}