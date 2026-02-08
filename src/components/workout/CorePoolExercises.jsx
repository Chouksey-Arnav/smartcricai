// Full core pool of exercises for Workout Builder

export const BODYWEIGHT_EXERCISES = [
  // Lower Body (Strength + Power)
  { id: 'bw_1', name: 'Air Squat', category: 'bodyweight', base: 'squat', variation: 'air' },
  { id: 'bw_2', name: 'Pause Squat', category: 'bodyweight', base: 'squat', variation: 'pause' },
  { id: 'bw_3', name: 'Tempo Squat', category: 'bodyweight', base: 'squat', variation: 'tempo' },
  { id: 'bw_4', name: 'Split Squat', category: 'bodyweight', base: 'squat', variation: 'split' },
  { id: 'bw_5', name: 'Bulgarian Split Squat', category: 'bodyweight', base: 'squat', variation: 'bulgarian_split' },
  { id: 'bw_6', name: 'Reverse Lunge', category: 'bodyweight', base: 'lunge', variation: 'reverse' },
  { id: 'bw_7', name: 'Forward Lunge', category: 'bodyweight', base: 'lunge', variation: 'forward' },
  { id: 'bw_8', name: 'Walking Lunge', category: 'bodyweight', base: 'lunge', variation: 'walking' },
  { id: 'bw_9', name: 'Lateral Lunge', category: 'bodyweight', base: 'lunge', variation: 'lateral' },
  { id: 'bw_10', name: 'Cossack Squat', category: 'bodyweight', base: 'squat', variation: 'cossack' },
  { id: 'bw_11', name: 'Single-Leg Squat to Box', category: 'bodyweight', base: 'squat', variation: 'single_leg_box' },
  { id: 'bw_12', name: 'Wall Sit', category: 'bodyweight', base: 'squat', variation: 'wall_sit' },
  { id: 'bw_13', name: 'Isometric Split Squat Hold', category: 'bodyweight', base: 'squat', variation: 'isometric_split' },
  { id: 'bw_14', name: 'Jump Squat', category: 'bodyweight', base: 'squat', variation: 'jump' },
  { id: 'bw_15', name: 'Countermovement Jump', category: 'bodyweight', base: 'jump', variation: 'countermovement' },
  { id: 'bw_16', name: 'Broad Jump', category: 'bodyweight', base: 'jump', variation: 'broad' },
  { id: 'bw_17', name: 'Lateral Bounds (Skater Jumps)', category: 'bodyweight', base: 'jump', variation: 'lateral_bounds' },
  { id: 'bw_18', name: 'Tuck Jumps', category: 'bodyweight', base: 'jump', variation: 'tuck' },
  { id: 'bw_19', name: 'Split Squat Jumps', category: 'bodyweight', base: 'jump', variation: 'split_squat' },
  { id: 'bw_20', name: 'Single-Leg Hops', category: 'bodyweight', base: 'jump', variation: 'single_leg' },
  { id: 'bw_21', name: 'Ankle Pogos', category: 'bodyweight', base: 'jump', variation: 'ankle_pogos' },
  { id: 'bw_22', name: 'Depth Drop', category: 'bodyweight', base: 'jump', variation: 'depth_drop' },
  
  // Upper Body (Push / Pull)
  { id: 'bw_23', name: 'Push-Up', category: 'bodyweight', base: 'push', variation: 'standard' },
  { id: 'bw_24', name: 'Incline Push-Up', category: 'bodyweight', base: 'push', variation: 'incline' },
  { id: 'bw_25', name: 'Decline Push-Up', category: 'bodyweight', base: 'push', variation: 'decline' },
  { id: 'bw_26', name: 'Close-Grip Push-Up', category: 'bodyweight', base: 'push', variation: 'close_grip' },
  { id: 'bw_27', name: 'Wide Push-Up', category: 'bodyweight', base: 'push', variation: 'wide' },
  { id: 'bw_28', name: 'Tempo Push-Up', category: 'bodyweight', base: 'push', variation: 'tempo' },
  { id: 'bw_29', name: 'Pause Push-Up', category: 'bodyweight', base: 'push', variation: 'pause' },
  { id: 'bw_30', name: 'Pike Push-Up', category: 'bodyweight', base: 'push', variation: 'pike' },
  { id: 'bw_31', name: 'Handstand Hold (Wall-Assisted)', category: 'bodyweight', base: 'handstand', variation: 'wall_assisted' },
  { id: 'bw_32', name: 'Scapular Push-Ups', category: 'bodyweight', base: 'push', variation: 'scapular' },
  { id: 'bw_33', name: 'Inverted Row', category: 'bodyweight', base: 'pull', variation: 'inverted' },
  { id: 'bw_34', name: 'Australian Pull-Up', category: 'bodyweight', base: 'pull', variation: 'australian' },
  { id: 'bw_35', name: 'Isometric Row Hold', category: 'bodyweight', base: 'pull', variation: 'isometric_hold' },
  { id: 'bw_36', name: 'Dead Hang', category: 'bodyweight', base: 'pull', variation: 'dead_hang' },
  { id: 'bw_37', name: 'Scap Pull-Ups', category: 'bodyweight', base: 'pull', variation: 'scap' },
  
  // Core & Rotation
  { id: 'bw_38', name: 'Front Plank', category: 'bodyweight', base: 'plank', variation: 'front' },
  { id: 'bw_39', name: 'Side Plank', category: 'bodyweight', base: 'plank', variation: 'side' },
  { id: 'bw_40', name: 'Side Plank with Reach', category: 'bodyweight', base: 'plank', variation: 'side_reach' },
  { id: 'bw_41', name: 'Plank Shoulder Taps', category: 'bodyweight', base: 'plank', variation: 'shoulder_taps' },
  { id: 'bw_42', name: 'Plank March', category: 'bodyweight', base: 'plank', variation: 'march' },
  { id: 'bw_43', name: 'Dead Bug', category: 'bodyweight', base: 'core', variation: 'dead_bug' },
  { id: 'bw_44', name: 'Hollow Hold', category: 'bodyweight', base: 'core', variation: 'hollow_hold' },
  { id: 'bw_45', name: 'Bird Dog', category: 'bodyweight', base: 'core', variation: 'bird_dog' },
  { id: 'bw_46', name: 'Bear Crawl', category: 'bodyweight', base: 'crawl', variation: 'bear' },
  { id: 'bw_47', name: 'Bear Crawl Shoulder Taps', category: 'bodyweight', base: 'crawl', variation: 'bear_shoulder_taps' },
  { id: 'bw_48', name: 'Russian Twist (Bodyweight)', category: 'bodyweight', base: 'rotation', variation: 'russian_twist' },
  { id: 'bw_49', name: 'Seated Rotation Hold', category: 'bodyweight', base: 'rotation', variation: 'seated_hold' },
  { id: 'bw_50', name: 'Standing Torso Rotations', category: 'bodyweight', base: 'rotation', variation: 'standing' },
  { id: 'bw_51', name: 'Lying Windshield Wipers (bent-knee)', category: 'bodyweight', base: 'rotation', variation: 'windshield_wipers' },
  
  // Mobility & Stability
  { id: 'bw_52', name: 'Hip Flexor Stretch', category: 'bodyweight', base: 'mobility', variation: 'hip_flexor' },
  { id: 'bw_53', name: '90/90 Hip Rotation', category: 'bodyweight', base: 'mobility', variation: '90_90_hip' },
  { id: 'bw_54', name: "World's Greatest Stretch", category: 'bodyweight', base: 'mobility', variation: 'worlds_greatest' },
  { id: 'bw_55', name: 'Thoracic Openers', category: 'bodyweight', base: 'mobility', variation: 'thoracic' },
  { id: 'bw_56', name: 'Cat-Cow', category: 'bodyweight', base: 'mobility', variation: 'cat_cow' },
  { id: 'bw_57', name: 'Downward Dog', category: 'bodyweight', base: 'mobility', variation: 'downward_dog' },
  { id: 'bw_58', name: 'Ankle Mobility Rockers', category: 'bodyweight', base: 'mobility', variation: 'ankle_rockers' },
  { id: 'bw_59', name: 'Single-Leg Balance Hold', category: 'bodyweight', base: 'stability', variation: 'single_leg_balance' },
  { id: 'bw_60', name: 'Single-Leg Reach', category: 'bodyweight', base: 'stability', variation: 'single_leg_reach' },
  { id: 'bw_61', name: 'Y-Balance Drill', category: 'bodyweight', base: 'stability', variation: 'y_balance' },
  
  // Conditioning (Cricket-Specific)
  { id: 'bw_62', name: 'High Knees', category: 'bodyweight', base: 'conditioning', variation: 'high_knees' },
  { id: 'bw_63', name: 'Butt Kicks', category: 'bodyweight', base: 'conditioning', variation: 'butt_kicks' },
  { id: 'bw_64', name: 'Skipping (No Rope)', category: 'bodyweight', base: 'conditioning', variation: 'skipping' },
  { id: 'bw_65', name: 'Shuttle Runs', category: 'bodyweight', base: 'conditioning', variation: 'shuttle' },
  { id: 'bw_66', name: 'Acceleration Starts', category: 'bodyweight', base: 'conditioning', variation: 'acceleration' },
  { id: 'bw_67', name: 'Backpedal to Sprint', category: 'bodyweight', base: 'conditioning', variation: 'backpedal_sprint' },
  { id: 'bw_68', name: 'Lateral Shuffle', category: 'bodyweight', base: 'conditioning', variation: 'lateral_shuffle' },
  { id: 'bw_69', name: 'Carioca Steps', category: 'bodyweight', base: 'conditioning', variation: 'carioca' },
];

export const WEIGHTED_EXERCISES = [
  // Lower Body – Strength
  { id: 'w_1', name: 'Goblet Squat', category: 'weighted', base: 'squat', variation: 'goblet', equipment: 'Dumbbell/Kettlebell' },
  { id: 'w_2', name: 'Dumbbell Squat', category: 'weighted', base: 'squat', variation: 'dumbbell', equipment: 'Dumbbells' },
  { id: 'w_3', name: 'Barbell Back Squat', category: 'weighted', base: 'squat', variation: 'back_squat', equipment: 'Barbell' },
  { id: 'w_4', name: 'Front Squat', category: 'weighted', base: 'squat', variation: 'front', equipment: 'Barbell' },
  { id: 'w_5', name: 'Box Squat', category: 'weighted', base: 'squat', variation: 'box', equipment: 'Barbell/Box' },
  { id: 'w_6', name: 'Romanian Deadlift (RDL)', category: 'weighted', base: 'deadlift', variation: 'rdl', equipment: 'Barbell/Dumbbells' },
  { id: 'w_7', name: 'Trap Bar Deadlift', category: 'weighted', base: 'deadlift', variation: 'trap_bar', equipment: 'Trap Bar' },
  { id: 'w_8', name: 'Dumbbell Deadlift', category: 'weighted', base: 'deadlift', variation: 'dumbbell', equipment: 'Dumbbells' },
  { id: 'w_9', name: 'Single-Leg RDL', category: 'weighted', base: 'deadlift', variation: 'single_leg_rdl', equipment: 'Dumbbell' },
  { id: 'w_10', name: 'Step-Ups (DB/BB)', category: 'weighted', base: 'step_up', variation: 'standard', equipment: 'Dumbbells/Barbell' },
  { id: 'w_11', name: 'Rear-Foot Elevated Split Squat', category: 'weighted', base: 'squat', variation: 'rear_foot_elevated', equipment: 'Dumbbells/Barbell' },
  { id: 'w_12', name: 'Dumbbell Lunges', category: 'weighted', base: 'lunge', variation: 'dumbbell', equipment: 'Dumbbells' },
  { id: 'w_13', name: 'Barbell Lunges', category: 'weighted', base: 'lunge', variation: 'barbell', equipment: 'Barbell' },
  { id: 'w_14', name: 'Hip Thrust', category: 'weighted', base: 'hip_thrust', variation: 'standard', equipment: 'Barbell' },
  { id: 'w_15', name: 'Glute Bridge (Weighted)', category: 'weighted', base: 'glute_bridge', variation: 'weighted', equipment: 'Barbell/Dumbbell' },
  { id: 'w_16', name: 'Hamstring Curl (Machine or Ball)', category: 'weighted', base: 'hamstring_curl', variation: 'machine', equipment: 'Machine/Ball' },
  
  // Lower Body – Power
  { id: 'w_17', name: 'Kettlebell Swings', category: 'weighted', base: 'swing', variation: 'kettlebell', equipment: 'Kettlebell' },
  { id: 'w_18', name: 'Dumbbell Jump Squats', category: 'weighted', base: 'jump', variation: 'dumbbell_squat', equipment: 'Dumbbells' },
  { id: 'w_19', name: 'Trap Bar Jump', category: 'weighted', base: 'jump', variation: 'trap_bar', equipment: 'Trap Bar' },
  { id: 'w_20', name: 'Medicine Ball Squat Throw', category: 'weighted', base: 'throw', variation: 'squat', equipment: 'Medicine Ball' },
  { id: 'w_21', name: 'Medicine Ball Scoop Toss', category: 'weighted', base: 'throw', variation: 'scoop', equipment: 'Medicine Ball' },
  { id: 'w_22', name: 'Calf Raises (DB/BB)', category: 'weighted', base: 'calf_raise', variation: 'standing', equipment: 'Dumbbells/Barbell' },
  { id: 'w_23', name: 'Seated Calf Raises', category: 'weighted', base: 'calf_raise', variation: 'seated', equipment: 'Machine/Dumbbell' },
  { id: 'w_24', name: 'Single-Leg Calf Raises', category: 'weighted', base: 'calf_raise', variation: 'single_leg', equipment: 'Dumbbell' },
  
  // Upper Body – Push
  { id: 'w_25', name: 'Dumbbell Bench Press', category: 'weighted', base: 'press', variation: 'dumbbell_bench', equipment: 'Dumbbells' },
  { id: 'w_26', name: 'Barbell Bench Press', category: 'weighted', base: 'press', variation: 'barbell_bench', equipment: 'Barbell' },
  { id: 'w_27', name: 'Incline DB Press', category: 'weighted', base: 'press', variation: 'incline_db', equipment: 'Dumbbells' },
  { id: 'w_28', name: 'Overhead Dumbbell Press', category: 'weighted', base: 'press', variation: 'overhead_db', equipment: 'Dumbbells' },
  { id: 'w_29', name: 'Landmine Press', category: 'weighted', base: 'press', variation: 'landmine', equipment: 'Barbell/Landmine' },
  { id: 'w_30', name: 'Push Press (Advanced)', category: 'weighted', base: 'press', variation: 'push_press', equipment: 'Barbell' },
  { id: 'w_31', name: 'Half-Kneeling Press', category: 'weighted', base: 'press', variation: 'half_kneeling', equipment: 'Dumbbell/Kettlebell' },
  
  // Upper Body – Pull
  { id: 'w_32', name: 'Dumbbell Rows', category: 'weighted', base: 'row', variation: 'dumbbell', equipment: 'Dumbbells' },
  { id: 'w_33', name: 'Barbell Bent-Over Row', category: 'weighted', base: 'row', variation: 'barbell_bent', equipment: 'Barbell' },
  { id: 'w_34', name: 'Chest-Supported Row', category: 'weighted', base: 'row', variation: 'chest_supported', equipment: 'Dumbbells/Machine' },
  { id: 'w_35', name: 'Lat Pulldown', category: 'weighted', base: 'pull', variation: 'lat_pulldown', equipment: 'Cable Machine' },
  { id: 'w_36', name: 'Pull-Ups (Weighted Optional)', category: 'weighted', base: 'pull', variation: 'pull_up', equipment: 'Pull-up Bar/Weight Belt' },
  { id: 'w_37', name: 'Face Pulls', category: 'weighted', base: 'pull', variation: 'face_pull', equipment: 'Cable/Band' },
  { id: 'w_38', name: 'Cable Rows', category: 'weighted', base: 'row', variation: 'cable', equipment: 'Cable Machine' },
  { id: 'w_39', name: 'Single-Arm Cable Pulls', category: 'weighted', base: 'pull', variation: 'single_arm_cable', equipment: 'Cable Machine' },
  
  // Rotational & Cricket-Specific Power
  { id: 'w_40', name: 'Medicine Ball Rotational Throw', category: 'weighted', base: 'rotation', variation: 'med_ball_throw', equipment: 'Medicine Ball' },
  { id: 'w_41', name: 'Medicine Ball Side Toss', category: 'weighted', base: 'rotation', variation: 'side_toss', equipment: 'Medicine Ball' },
  { id: 'w_42', name: 'Medicine Ball Slam', category: 'weighted', base: 'slam', variation: 'medicine_ball', equipment: 'Medicine Ball' },
  { id: 'w_43', name: 'Cable Woodchops (High → Low)', category: 'weighted', base: 'rotation', variation: 'woodchop_high_low', equipment: 'Cable Machine' },
  { id: 'w_44', name: 'Cable Lifts (Low → High)', category: 'weighted', base: 'rotation', variation: 'lift_low_high', equipment: 'Cable Machine' },
  { id: 'w_45', name: 'Landmine Rotation', category: 'weighted', base: 'rotation', variation: 'landmine', equipment: 'Barbell/Landmine' },
  { id: 'w_46', name: 'Landmine Press + Rotation', category: 'weighted', base: 'rotation', variation: 'landmine_press', equipment: 'Barbell/Landmine' },
  
  // Core (Weighted)
  { id: 'w_47', name: 'Weighted Plank', category: 'weighted', base: 'plank', variation: 'weighted', equipment: 'Plate/Weight Vest' },
  { id: 'w_48', name: 'Cable Anti-Rotation Press (Pallof)', category: 'weighted', base: 'core', variation: 'pallof', equipment: 'Cable Machine' },
  { id: 'w_49', name: 'Weighted Dead Bug', category: 'weighted', base: 'core', variation: 'weighted_dead_bug', equipment: 'Dumbbell' },
  { id: 'w_50', name: "Farmer's Carry", category: 'weighted', base: 'carry', variation: 'farmers', equipment: 'Dumbbells/Kettlebells' },
  { id: 'w_51', name: 'Suitcase Carry', category: 'weighted', base: 'carry', variation: 'suitcase', equipment: 'Dumbbell/Kettlebell' },
  { id: 'w_52', name: 'Overhead Carry', category: 'weighted', base: 'carry', variation: 'overhead', equipment: 'Dumbbell/Kettlebell' },
  
  // Shoulder Health / Injury Prevention
  { id: 'w_53', name: 'External Rotation (Band/Cable)', category: 'weighted', base: 'shoulder', variation: 'external_rotation', equipment: 'Band/Cable' },
  { id: 'w_54', name: 'Internal Rotation (Band/Cable)', category: 'weighted', base: 'shoulder', variation: 'internal_rotation', equipment: 'Band/Cable' },
  { id: 'w_55', name: 'YTWL Raises', category: 'weighted', base: 'shoulder', variation: 'ytwl', equipment: 'Dumbbells/Band' },
  { id: 'w_56', name: 'Scapular Retractions', category: 'weighted', base: 'shoulder', variation: 'scap_retraction', equipment: 'Band/Cable' },
  { id: 'w_57', name: 'Serratus Wall Slides', category: 'weighted', base: 'shoulder', variation: 'serratus_slides', equipment: 'Wall' },
];

// Combine all exercises
export const ALL_CORE_POOL_EXERCISES = [
  ...BODYWEIGHT_EXERCISES,
  ...WEIGHTED_EXERCISES
].sort((a, b) => a.name.localeCompare(b.name));