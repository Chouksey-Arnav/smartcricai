// Comprehensive Dismissal Analysis Database
// Covers all 847 combinations: 11 shots × 11 ball types × 7 field setups

const SHOT_DATA = {
  drive: {
    name: 'Drive',
    description: 'a front-foot drive',
    base_risk: 6,
    primary_risk: 'outside edge carrying to the slip cordon or LBW from late movement',
    main_flaw: 'Failing to fully commit the front foot to the pitch of the ball while using hard hands through impact — any late swing, seam, or deviation at the point of contact finds the outside edge or zips through the gate.',
    drills: [
      { name: 'Front Foot Drive Drill', description: 'Develops the correct weight transfer and front foot press, teaching you to smother any late movement by getting over the ball. Focus on driving with a straight bat and keeping the head still.' },
      { name: 'Soft Hands Boundary Drill', description: 'Trains you to play the drive with relaxed hands near the edge of the bat, reducing the chance of a carrying edge. Place a cone where your front foot should land and train to hit it every time.' },
      { name: 'Drive Line and Length Recognition', description: 'Builds instincts for identifying which deliveries are genuinely driveable vs. which should be left. Helps you resist the urge to drive at moving deliveries outside off stump.' }
    ],
    mental: { category: 'visualization', title: 'Master Skill Replay', description: 'Mentally rehearse the perfect drive execution 10 times in vivid detail — front foot fully forward, head still, soft hands through impact. This neural rehearsal strengthens the correct movement pattern.' },
    improvement_tips_base: [
      'Commit your front foot fully to the pitch of the ball — half-measures create caught-behind moments',
      'Use soft hands through impact, especially when playing away from the body',
      'Leave the ball outside off stump if it is not in the "V" — the drive is a high-reward, high-risk shot'
    ]
  },
  cut: {
    name: 'Cut',
    description: 'a cut shot',
    base_risk: 5,
    primary_risk: 'top edge or miscued shot to off-side fielders',
    main_flaw: 'Playing the cut to a ball that is not genuinely short or not wide enough outside off stump, or failing to watch the ball all the way onto the bat face — the cut requires precise placement and timing that breaks down against balls with pace or extra bounce.',
    drills: [
      { name: 'Cut Shot Timing Drill', description: 'Develops the crucial back-foot weight transfer and timing for the cut shot. Use a bowling machine set to varying widths to train your selection process — only cut when it is genuinely short and wide.' },
      { name: 'Back Foot Transfer Drill', description: 'Builds the instinctive rock-back movement needed before playing the cut. Ensures you are in a balanced position with weight on the back foot before committing to the horizontal bat.' },
      { name: 'Short Ball Judgment Drill', description: 'Trains your eye to distinguish between balls to cut, balls to leave, and balls to duck. Critical for reducing impulsive cut shots to deliveries that are not in the cut zone.' }
    ],
    mental: { category: 'focus', title: 'Single-Point Focus Drill', description: 'Train your ability to watch the ball intensely from the bowler\'s wrist position to the point of contact. This extreme focus helps you read length earlier and select cut shots with better judgment.' },
    improvement_tips_base: [
      'Only cut balls that are genuinely short and at least six inches outside off stump',
      'Rock onto the back foot firmly before playing — never cut from the front foot',
      'Stay balanced and watch the ball all the way onto the bat face'
    ]
  },
  pull: {
    name: 'Pull',
    description: 'a pull shot',
    base_risk: 5,
    primary_risk: 'mistimed top edge to fine leg or caught at deep midwicket',
    main_flaw: 'Playing the pull shot to a ball that is not sitting up in the right hitting zone (between waist and shoulder on middle/leg line), or committing to the shot against a ball that is rising sharply — the pull demands a precise judgment of trajectory that breaks down under pace or in poor light.',
    drills: [
      { name: 'Pull Shot Power Drill', description: 'Develops the rotational power and correct setup position for the pull shot. Work on identifying the correct ball to pull vs. leave or duck, and rehearse the full hip rotation through the shot.' },
      { name: 'Short Ball Judgment Drill', description: 'Trains your eye for the short ball. Set up a session where you must label every short ball as "pull," "leave," or "duck" before committing. Build the habit of only pulling the right delivery.' },
      { name: 'Back and Across to Short Ball', description: 'Develops the footwork pattern of moving back and across before playing the pull. This ensures you are in the correct position with your weight behind the ball rather than lunging at it.' }
    ],
    mental: { category: 'focus', title: 'Single-Point Focus Drill', description: 'Develop laser focus on reading the ball trajectory from the bowler\'s hand. The pull shot requires you to pick up the short-pitched length earlier than any other shot — this mental drill trains that rapid recognition.' },
    improvement_tips_base: [
      'Only pull balls sitting between your waist and shoulder on the middle/leg line',
      'Stay committed to the shot — half-pulls create top edges',
      'Be ready to duck or sway for balls rising to head height — not every short ball should be pulled'
    ]
  },
  hook: {
    name: 'Hook',
    description: 'a hook shot',
    base_risk: 7,
    primary_risk: 'top edge to fine leg or deep square leg fielder',
    main_flaw: 'Attempting to hook balls that are too close to the body or rising unpredictably to head height, creating a cramped swing that produces top edges — the hook is the highest-risk attacking shot in cricket and demands perfect positioning, exceptional timing, and significant experience with short-pitched bowling.',
    drills: [
      { name: 'Hook Shot Evasion Drill', description: 'Builds the dual skill of executing the hook AND the ability to sway/duck instead. You must recognise which bouncers to hook vs. which to leave — this drill trains that critical split-second decision-making.' },
      { name: 'Bouncer Decision Drill', description: 'Creates a training environment where you face a mix of bouncers and full deliveries. The drill trains your eyes to pick up the short-pitched trajectory early so you have maximum time to respond correctly.' },
      { name: 'Short Ball Response Drill', description: 'Conditions your physical and mental response to fast, short-pitched deliveries. Builds the confidence and technique to be assertive against the short ball rather than reactive and cramped.' }
    ],
    mental: { category: 'pressure', title: 'Pressure Is Privilege', description: 'Reframe the bouncer as an opportunity, not a threat. Elite players see short-pitched bowling as a chance to take control. This mental session reprograms your response to pace from anxiety to confidence.' },
    improvement_tips_base: [
      'The hook is only for balls that are genuinely short and sitting up at head/shoulder height with room to swing',
      'Watch the ball all the way from release — identify the bouncer as early as possible',
      'Consider ducking or swaying rather than hooking against extreme pace or in poor conditions'
    ]
  },
  sweep: {
    name: 'Sweep',
    description: 'a sweep shot',
    base_risk: 5,
    primary_risk: 'top edge to square leg or LBW from ball missing the bat',
    main_flaw: 'Sweeping without accurately reading the spin direction and line first — a sweep against a ball turning into the stumps or a straight one produces LBW dismissals, while sweeping too hard or early against extra bounce creates top edges that balloon to fielders at square leg or fine leg.',
    drills: [
      { name: 'Sweep Shot Foundation', description: 'Builds the technically correct sweep shot from the ground up — knee down, head over the ball, bat angling toward the ground to prevent top edges. Trains you to hit the ball from a controlled, balanced position.' },
      { name: 'Playing Spin Off Front Foot', description: 'Develops your ability to use your front foot to judge whether a delivery is sweepable or should be played with a straight bat. Getting well forward reduces the risk of the dreaded LBW from a spinner.' },
      { name: 'Reading Spin from the Hand Drill', description: 'Trains your ability to read the spin direction before the ball lands. This is essential for the sweep shot — knowing whether the ball will turn in or away helps you decide to play the stroke or not.' }
    ],
    mental: { category: 'visualization', title: 'Calm Under Pressure Visualisation', description: 'Visualise yourself reading the spinner\'s delivery early, picking the right sweep ball, and executing with control. Practise staying calm against accurate spin that is testing your patience.' },
    improvement_tips_base: [
      'Only sweep to balls outside your off stump or on the stumps if you are certain about the line',
      'Keep your head down and watch the ball carefully — do not look up to see where the shot is going',
      'Use a straight bat against balls on the stumps to reduce LBW risk'
    ]
  },
  reverse_sweep: {
    name: 'Reverse Sweep',
    description: 'a reverse sweep',
    base_risk: 8,
    primary_risk: 'top edge to point/gully area or bowled through the gate',
    main_flaw: 'Playing the reverse sweep without first accurately reading the spin direction and line — any misread creates a catastrophic mismatch between the intended shot and the ball\'s trajectory, leaving you exposed to being bowled, hit on the pads, or top-edging to close-in fielders.',
    drills: [
      { name: 'Reverse Sweep Mastery', description: 'Breaks the reverse sweep into its component parts — the shuffle, the grip change, the bat angle, and the timing. Builds the technique from a safe position before applying it in live training situations.' },
      { name: 'Reading Spin from the Hand Drill', description: 'The reverse sweep is only safe if you have read the spin correctly first. This drill sharpens your ability to pick the spin from the bowler\'s wrist position, giving you the confidence to play the shot in the right situation.' },
      { name: 'Sweep Shot Foundation', description: 'Mastering the conventional sweep first creates the technical platform for the reverse sweep. The skills overlap — balance, head position, and bat angle — and the reverse sweep becomes a natural extension.' }
    ],
    mental: { category: 'visualization', title: 'The Perfect Performance', description: 'Visualise the scenario where the reverse sweep is the right shot — the ball is wide, the fielding gap is there, and you execute perfectly. Mental rehearsal of the shot in the correct situation builds the confidence to play it selectively.' },
    improvement_tips_base: [
      'Only attempt the reverse sweep to balls outside off stump with a clear gap on the off side',
      'Practise extensively in the nets before using in match conditions',
      'Have a pre-decided plan — do not improvise the reverse sweep under pressure'
    ]
  },
  cover_drive: {
    name: 'Cover Drive',
    description: 'a cover drive',
    base_risk: 7,
    primary_risk: 'outside edge carrying to slip or gully',
    main_flaw: 'Driving at balls outside off stump without fully reaching the pitch of the ball — any late swing or seam movement on a ball that appears driveable but moves away at the last moment creates the classic outside edge that carries to the slip cordon or gully.',
    drills: [
      { name: 'Cover Drive Mastery', description: 'Develops the correct front foot placement for the cover drive — getting fully forward so you smother any movement at the point of contact. Trains you to reach the ball rather than chasing it with a long reach.' },
      { name: 'Front Foot Drive Drill', description: 'Builds the essential weight transfer forward that is the foundation of all front foot drives. Without proper front foot press, the cover drive becomes a reaching shot that creates edges.' },
      { name: 'Playing Outswing Technique', description: 'Teaches you how to play (or leave) the outswinger. Identifies which outswinging deliveries are genuinely driveable and which should be left, dramatically reducing the number of outside edges.' }
    ],
    mental: { category: 'visualization', title: 'Master Skill Replay', description: 'Rehearse the perfect cover drive in your mind 10 times — front foot fully forward, head still, bat coming through the ball, driving along the ground. This technique-focused visualization strengthens muscle memory.' },
    improvement_tips_base: [
      'Only drive at balls you can fully reach with your front foot to the pitch',
      'Leave outswinging deliveries outside off stump — the cover drive is for full balls on off stump, not wide ones',
      'Play with a straight bat and soft hands rather than forcing the ball'
    ]
  },
  straight_drive: {
    name: 'Straight Drive',
    description: 'a straight drive',
    base_risk: 5,
    primary_risk: 'inside edge onto stumps or LBW from late inswing',
    main_flaw: 'Driving straight at balls that have late swing or seam movement toward the stumps — a ball that appears straight but cuts back through the gate produces the classic bowled or LBW dismissal, as the batter has committed to a straight bat path that cannot adjust.',
    drills: [
      { name: 'Straight Drive Precision', description: 'Focuses on driving down the ground with a perfectly vertical bat, developing the head-still, eyes-level technique that keeps the ball on the ground and eliminates inside edges.' },
      { name: 'Drive Line and Length Recognition', description: 'Trains you to identify which deliveries are genuinely in the straight drive hitting zone vs. those that should be blocked or left. Builds your instinct for selecting the right ball to hit.' },
      { name: 'Batting in the V Zone', description: 'Develops the habit of playing straight — driving between the stumps and mid-off/mid-on. The V is the safest hitting zone and the straight drive is its cornerstone shot.' }
    ],
    mental: { category: 'focus', title: 'Countdown to Clarity', description: 'Before facing each delivery, use a quick mental reset to clear your mind and focus on the ball alone. The straight drive requires a clear, committed mind — no hesitation, no second-guessing.' },
    improvement_tips_base: [
      'Watch the seam position to anticipate whether the ball will swing or cut back',
      'Drive only deliveries that are full and on the stumps — do not drive at full balls moving away',
      'Keep the bat vertical and drive through the line to prevent inside edges'
    ]
  },
  square_cut: {
    name: 'Square Cut',
    description: 'a square cut',
    base_risk: 5,
    primary_risk: 'top edge or miscued catch to point or gully',
    main_flaw: 'Playing the square cut to a ball that is not short enough or not wide enough — any cut to a ball on or near off stump with a horizontal bat creates inside edges, top edges, or miscued catches to fielders in the point/gully region.',
    drills: [
      { name: 'Square Cut Precision', description: 'Develops the discrimination needed for the square cut — building the habit of only playing the shot to genuinely short, wide deliveries. Trains the back foot weight transfer and horizontal bat swing from a balanced position.' },
      { name: 'Cut Shot Timing Drill', description: 'Works specifically on the timing of the cut shot, teaching you to play it late and use the pace of the ball rather than generating your own power. Late cuts reduce the margin for error.' },
      { name: 'Back Foot Transfer Drill', description: 'Reinforces the critical back foot press before the cut, ensuring you are in the correct position with weight on the back foot before committing to the horizontal bat.' }
    ],
    mental: { category: 'focus', title: 'The Decision Maker', description: 'Build mental clarity around shot selection decisions. The square cut requires a clear, fast decision — is this ball in the cut zone or not? This session trains decisive, confident shot selection.' },
    improvement_tips_base: [
      'The cut is for balls at least four inches outside off stump and genuinely short',
      'Stay tall and watch the ball onto the bat — do not get cramped by reaching across',
      'Be aware of extra bounce on flat pitches — what looks like a cut ball can rise sharply'
    ]
  },
  late_cut: {
    name: 'Late Cut',
    description: 'a late cut',
    base_risk: 4,
    primary_risk: 'thin edge to the keeper or miscued catch behind the wicket',
    main_flaw: 'Playing the late cut too hard or too early — the late cut is a precision placement shot that requires soft hands and maximum patience. Any attempt to hit the ball with power or to play it too early results in an edge to the wicketkeeper or point fielder.',
    drills: [
      { name: 'Late Cut Finesse Drill', description: 'Teaches the patience and soft hands required for the late cut. This drill focuses on waiting as late as possible before guiding the ball past point/gully with a gentle glide of the bat.' },
      { name: 'Soft Hands Touch Batting', description: 'Develops the relaxed hands and wrist control that underpins the late cut and other placement shots. Soft hands reduce the chance of edges carrying to fielders and help place the ball precisely.' },
      { name: 'Wrist Position Through Impact', description: 'Focuses on the wrist roll and bat angle through the late cut, ensuring the ball goes in the intended direction. The wrist position determines whether the ball goes fine or to the keeper.' }
    ],
    mental: { category: 'focus', title: 'Flow State Trigger', description: 'The late cut is a timing shot that flows naturally when you are relaxed and in rhythm. This session helps you access the calm, instinctive state where touch shots feel effortless.' },
    improvement_tips_base: [
      'Wait as long as possible before playing the late cut — it is a reaction shot, not a planned stroke',
      'Guide the ball rather than hitting it — soft hands are essential',
      'Be selective about which balls to late cut — not every delivery outside off deserves this treatment'
    ]
  },
  flick: {
    name: 'Flick',
    description: 'a flick shot',
    base_risk: 5,
    primary_risk: 'top edge to fine leg or LBW from inswinging deliveries',
    main_flaw: 'Playing the flick to deliveries that are too straight or on the stumps — the flick is designed for balls on or outside the hip, and any attempt to flick from the stumps creates an LBW risk or top edges that balloon to fine leg from an overly upright bat angle.',
    drills: [
      { name: 'Flick Shot Power Drill', description: 'Develops the correct hip-and-wrist combination that generates power and control in the flick shot. Trains you to identify which balls are in the flick zone and execute the wrist roll through contact.' },
      { name: 'On-Side Placement Drill', description: 'Builds control and placement on the on side through various on-side shots including the flick. Trains you to place the ball in gaps rather than hitting straight to fielders.' },
      { name: 'Weight Transfer Drill', description: 'Reinforces the correct weight transfer onto the back foot before playing the flick, ensuring you are in position before the ball arrives rather than reaching across.' }
    ],
    mental: { category: 'confidence', title: 'Failure as Feedback', description: 'Extract the specific lesson from this dismissal — the flick was attempted to the wrong delivery. Reframe the dismissal as crucial data: now you know exactly which balls are in your flick zone and which are not.' },
    improvement_tips_base: [
      'Only flick balls that are on or outside the hip — leave or block straight deliveries',
      'Watch for inswing that turns a flick into a dangerous LBW chance',
      'Roll the wrists through the shot to keep the ball down and away from fine leg fielders'
    ]
  }
};

const BALL_DATA = {
  fast_full: {
    name: 'Fast Full Delivery',
    description: 'a fast, full-pitched delivery',
    risk_add: 1,
    mechanism: 'The combination of pace and full length creates an invitation to drive, but at speed, any late swing, seam or nip-back finds the edge or pads before the batter can adjust.',
    reading_tip: 'watch for the seam orientation and shiny side of the ball from the bowler\'s hand — these reveal swing direction before the ball leaves the crease'
  },
  fast_short: {
    name: 'Fast Short-Pitched Delivery',
    description: 'a fast, short-pitched delivery',
    risk_add: 2,
    mechanism: 'The short length at pace reduces the batter\'s time to react, creating a split-second decision between attacking and evading — any mistimed attacking shot produces a steepling top edge or miscued catch.',
    reading_tip: 'pick up the length early from the bowler\'s release point — if the ball leaves the hand low, it will be short'
  },
  yorker: {
    name: 'Yorker',
    description: 'a well-directed yorker',
    risk_add: 3,
    mechanism: 'Directed at the toes and stumps, the yorker eliminates room and removes attacking options — the bat must come down exactly along the line of the ball or the batter is bowled through the gate or struck on the pad in front of stumps.',
    reading_tip: 'watch for the full trajectory from the bowler\'s hand — the ball will appear to dip late, confirming the yorker length before it arrives'
  },
  bouncer: {
    name: 'Bouncer',
    description: 'a bouncer rising sharply',
    risk_add: 2,
    mechanism: 'The short-pitched delivery aimed at the upper body rises from a good length into the chest, shoulder or head area — any shot played to a ball at this height with a horizontal bat creates a top edge or gloved catch.',
    reading_tip: 'identify the early short-pitched release from the bowler\'s hand and make your decision (duck, sway or play) before the ball reaches halfway'
  },
  off_spin: {
    name: 'Off Spin',
    description: 'an off-spin delivery',
    risk_add: 1,
    mechanism: 'Turning into the right-hander from off to leg, off spin creates bat-pad catching opportunities when the ball turns more than expected and finds a gap between bat and pad.',
    reading_tip: 'read the off-spinner\'s finger position on the ball — a ball gripped more towards the index finger will spin more than one held deeper in the hand'
  },
  leg_spin: {
    name: 'Leg Spin',
    description: 'a leg-spin delivery',
    risk_add: 2,
    mechanism: 'Turning away from the right-hander, leg spin creates outside edge opportunities to slips and gully when the batter plays against the turn or drives at the turning delivery.',
    reading_tip: 'watch the wrist position of the leg spinner — the leg break is delivered with the wrist rolling from 12 o\'clock to 6 o\'clock, creating the distinctive leg-spin shape'
  },
  googly: {
    name: 'Googly',
    description: 'a googly',
    risk_add: 3,
    mechanism: 'The googly spins the opposite direction to leg spin — into the right-hander instead of away — and the misread creates an LBW risk or inside edge from a batter who has played for the leg-spin direction.',
    reading_tip: 'watch for the wrist turning the wrong way from a leg spinner — the googly comes from the back of the hand and has a different wrist rotation to the standard leg break'
  },
  doosra: {
    name: 'Doosra',
    description: 'a doosra',
    risk_add: 3,
    mechanism: 'The doosra mimics off-spin action but spins away from the right-hander — the misread creates outside edges to slips or gully from a batter expecting the off-spin turn in.',
    reading_tip: 'watch for the subtle change in the off-spinner\'s wrist action — the doosra is harder to bowl legally so look for any variation in the delivery action as a clue'
  },
  in_swinger: {
    name: 'Inswinger',
    description: 'an inswinging delivery',
    risk_add: 2,
    mechanism: 'Swinging into the right-hander, the inswinger appears to be a driveable delivery but cuts back late through the gate, creating LBW decisions or bowled dismissals from batters who have committed to playing away from the body.',
    reading_tip: 'watch for the shiny side of the ball positioned toward fine leg in the bowler\'s grip — this classic inswing position means the ball will move into you'
  },
  out_swinger: {
    name: 'Outswinger',
    description: 'an outswinging delivery',
    risk_add: 2,
    mechanism: 'Swinging away from the right-hander, the outswinger creates irresistible outside edge opportunities from batters who drive at a ball that appears to be full on off stump but then curves away into the slip cordon.',
    reading_tip: 'watch for the seam angled toward slip and the shiny side positioned on the outside — the ball will move away from you through the air'
  },
  slower_ball: {
    name: 'Slower Ball',
    description: 'a well-disguised slower ball',
    risk_add: 1,
    mechanism: 'The slower ball creates a timing mismatch between the batter\'s committed swing and the ball\'s arrival — the result is a mistimed drive, pull or cut that goes high into the air or straight to a fielder.',
    reading_tip: 'watch for a slight stiffening or change in the bowler\'s arm speed — some bowlers telegraph the slower ball through a subtle change in wrist position or the sound of the delivery'
  }
};

const FIELD_DATA = {
  attacking: {
    name: 'Attacking Field (Multiple Slips)',
    description: 'an attacking field with multiple slip fielders',
    risk_add: 2,
    consequence: 'Any outside edge carries directly to a waiting fielder in the slip cordon — the captain has set this field specifically to capitalise on edges from the bowling.',
    tactical_tip: 'minimise horizontal bat shots outside off stump — the slip fielders are there waiting for exactly that mistake',
    high_risk_shots: ['drive', 'cover_drive', 'cut', 'late_cut', 'square_cut']
  },
  defensive: {
    name: 'Defensive Field',
    description: 'a defensive field with fielders protecting all areas',
    risk_add: 0,
    consequence: 'Fielders are positioned to cut off attacking strokes — miscued shots find fielders in the ring rather than boundaries.',
    tactical_tip: 'look for placement gaps in the ring rather than trying to hit through fielders — this field restricts power but leaves running opportunities',
    high_risk_shots: []
  },
  leg_side_heavy: {
    name: 'Leg-Side Heavy Field',
    description: 'a leg-side packed field',
    risk_add: 1,
    consequence: 'Leg-side shots go directly to packed fielders — the captain is inviting you to play on the leg side where there is no room.',
    tactical_tip: 'play straighter than usual and look for runs on the off side — do not fall into the trap of playing leg-side shots into the packed field',
    high_risk_shots: ['flick', 'sweep', 'pull', 'hook']
  },
  off_side_packed: {
    name: 'Off-Side Packed Field',
    description: 'a packed off-side field',
    risk_add: 1,
    consequence: 'Off-side shots are smothered by extra fielders — any drives or cuts through the covers run straight into fielding positions.',
    tactical_tip: 'manipulate the field by playing on the leg side where gaps have been created — the captain is daring you to play off side into fielders',
    high_risk_shots: ['drive', 'cover_drive', 'cut', 'square_cut', 'late_cut']
  },
  deep_field: {
    name: 'Deep Field',
    description: 'a deep boundary field',
    risk_add: -1,
    consequence: 'Boundaries are protected but the infield has gaps — miscued shots that would go for four will be cut off.',
    tactical_tip: 'rotate strike through the infield gaps and build partnerships — the captain is containing you and waiting for a mistake',
    high_risk_shots: []
  },
  up_close_catchers: {
    name: 'Up-Close Catchers',
    description: 'a field with multiple close-in catching positions',
    risk_add: 3,
    consequence: 'Any edge, top edge, or mistimed shot carries immediately to a fielder within catching range — there is zero margin for error with this field.',
    tactical_tip: 'play with extreme soft hands and minimal bat speed on any ball you are not certain about — a single mistake and there is an eager catcher waiting',
    high_risk_shots: ['hook', 'pull', 'sweep', 'reverse_sweep', 'cut', 'late_cut', 'flick']
  },
  standard_odi: {
    name: 'Standard ODI Field',
    description: 'a standard one-day field',
    risk_add: 0,
    consequence: 'A balanced field with both catching and boundary protection — mishit shots can find fielders or go for runs depending on placement.',
    tactical_tip: 'play according to the match situation and score — identify the fielding gaps early and target them',
    high_risk_shots: []
  }
};

// Specific danger bonuses for particularly risky combinations
const COMBO_BONUSES = {
  'drive_yorker': 2, 'cover_drive_yorker': 2, 'straight_drive_yorker': 2,
  'cover_drive_out_swinger': 2, 'drive_out_swinger': 1,
  'straight_drive_in_swinger': 2, 'flick_in_swinger': 2,
  'sweep_bouncer': 5, 'hook_bouncer': 0, 'pull_bouncer': 2,
  'reverse_sweep_googly': 3, 'reverse_sweep_doosra': 3,
  'cut_out_swinger': 1, 'late_cut_out_swinger': 2,
  'drive_attacking': 1, 'cover_drive_attacking': 1, 'cut_attacking': 1,
  'hook_up_close_catchers': 2, 'pull_up_close_catchers': 2,
  'sweep_up_close_catchers': 2, 'reverse_sweep_up_close_catchers': 3,
  'drive_googly': 1, 'sweep_googly': 2, 'drive_doosra': 1,
};

const POSITIVE_NOTES = {
  very_high: 'Every elite batter has been dismissed this exact way — it is one of cricket\'s hardest challenges. The players who master this specific scenario become genuinely dangerous to bowl at. Study this dismissal deeply, train the fix relentlessly, and you will never fall into this trap again.',
  high: 'The best batters in the world have been caught in this exact combination. The difference between good players and great ones is what they do with this information. Use this dismissal as your training motivation — the fix is in your hands.',
  medium: 'This combination challenges batters at every level. The key insight is recognising the pattern early and adjusting your shot selection accordingly. Every wicket you study and learn from adds another layer to your game.',
  low: 'Even a calculated, well-executed shot occasionally results in a dismissal. Your technique and decision-making can always be refined. Study this, improve your awareness, and trust your process — the runs will come.'
};

export function getDismissalAnalysis(shotPlayed, ballType, fieldSetup) {
  const shot = SHOT_DATA[shotPlayed];
  const ball = BALL_DATA[ballType];
  const field = FIELD_DATA[fieldSetup];

  if (!shot || !ball || !field) return null;

  // Calculate danger rating
  let dangerRating = shot.base_risk + ball.risk_add + field.risk_add;
  const comboKey1 = `${shotPlayed}_${ballType}`;
  const comboKey2 = `${shotPlayed}_${fieldSetup}`;
  if (COMBO_BONUSES[comboKey1]) dangerRating += COMBO_BONUSES[comboKey1];
  if (COMBO_BONUSES[comboKey2]) dangerRating += COMBO_BONUSES[comboKey2];
  if (field.high_risk_shots?.includes(shotPlayed)) dangerRating += 1;
  dangerRating = Math.min(10, Math.max(1, Math.round(dangerRating)));

  // Build what went wrong
  const whatWentWrong = `Playing ${shot.description} against ${ball.description} in this match situation exposed a critical vulnerability. ${ball.mechanism} With ${field.description}, ${field.consequence.toLowerCase()} The combination of ${shot.primary_risk} and the ${ball.name.toLowerCase()} created a high-risk scenario that required near-perfect execution — and on this occasion, that execution was not quite there.`;

  // Build root cause
  const rootCause = `${shot.main_flaw} Against ${ball.description}, this flaw is especially costly because ${ball.mechanism.split('.')[0].toLowerCase()}.`;

  // Build what to do next time
  const tips = [
    ...shot.improvement_tips_base,
    `${ball.reading_tip.charAt(0).toUpperCase() + ball.reading_tip.slice(1)} — early ball recognition changes everything`,
    field.tactical_tip
  ].slice(0, 3);

  // Mental session selection
  let mentalSession = shot.mental;
  // Override for specific high-danger scenarios
  if (dangerRating >= 8) {
    mentalSession = { category: 'pressure', title: 'High Stakes Rehearsal', description: 'Mentally rehearse this exact high-pressure scenario — facing this combination of shot, ball and field — and see yourself responding with composure, correct technique and smart decision-making.' };
  } else if (ballType === 'googly' || ballType === 'doosra') {
    mentalSession = { category: 'focus', title: 'Single-Point Focus Drill', description: 'Train absolute focus on the bowler\'s wrist and hand position to read the googly/doosra before it lands. This mental drill builds the intense, sustained concentration that spin reading demands.' };
  } else if (fieldSetup === 'up_close_catchers') {
    mentalSession = { category: 'match-day-calm', title: 'Composed Under Fire', description: 'Practise staying mentally composed when surrounded by close-in catchers — softening your hands, slowing your thinking, and eliminating impulsive shots. Composure under this field is a learnable skill.' };
  } else if (fieldSetup === 'attacking') {
    mentalSession = { category: 'pressure', title: 'Pressure Is Privilege', description: 'Reframe the attacking field as a signal that you are a threat. The captain is trying to stop you specifically because you are dangerous. Use this session to turn that pressure into calm, focused confidence.' };
  } else if (shotPlayed === 'hook' || shotPlayed === 'reverse_sweep') {
    mentalSession = { category: 'visualization', title: 'Obstacle Visualisation', description: 'See yourself facing this exact delivery type, recognising it early, making the correct decision and executing perfectly. This session builds mental blueprints for navigating high-risk shots.' };
  }

  // Match awareness tip
  const matchTip = `${field.tactical_tip}. Additionally, ${ball.reading_tip} — this single adjustment can prevent this type of dismissal entirely.`;

  // Positive note
  const noteKey = dangerRating >= 8 ? 'very_high' : dangerRating >= 6 ? 'high' : dangerRating >= 4 ? 'medium' : 'low';
  const positiveNote = POSITIVE_NOTES[noteKey];

  return {
    danger_rating: dangerRating,
    what_went_wrong: whatWentWrong,
    root_cause: rootCause,
    what_to_do_next_time: tips,
    recommended_drills: shot.drills,
    mental_session: mentalSession,
    match_awareness_tip: matchTip,
    positive_note: positiveNote,
  };
}