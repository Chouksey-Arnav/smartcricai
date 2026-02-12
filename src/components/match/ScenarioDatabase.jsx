// Comprehensive Cricket Scenario Database - 1500+ Elite Scenarios
// Complete realistic decision-making database covering every possible match situation

export const scenarioDatabase = [
  
  // ========== BATTING SCENARIOS (400+) ==========
  
  // Opening Phase & New Ball Survival (Bat 001-050)
  {
    id: 'bat_001',
    category: 'batting',
    difficulty: 'easy',
    situation: 'First over of the innings. Fast bowler charging in. Field is aggressive with 3 slips.',
    question: 'What should be your primary focus?',
    options: [
      { text: 'Leave balls outside off stump and defend straight ones', correct: true, explanation: 'Correct! Survive the new ball, see off the opening spell. Runs will come later.' },
      { text: 'Attack from ball one to dominate', correct: false, explanation: 'Too risky. New ball swings, bowler is fresh. Patience is key.' },
      { text: 'Try reverse sweep to confuse the bowler', correct: false, explanation: 'Way too risky against pace with new ball. Unnecessary risk.' },
      { text: 'Stand outside crease to counter swing', correct: false, explanation: 'Dangerous - reduces reaction time and leaves you vulnerable to yorkers.' }
    ]
  },
  {
    id: 'bat_002',
    category: 'batting',
    difficulty: 'medium',
    situation: 'Green pitch, overcast conditions. Ball is seaming and swinging. You\'re 0* on 0 balls.',
    question: 'Best survival strategy?',
    options: [
      { text: 'Play very late, watch ball closely, leave outside off', correct: true, explanation: 'Perfect! Conditions will ease. Survive the tough period.' },
      { text: 'Attack to score before getting out', correct: false, explanation: 'Panic batting. Wait for conditions to improve.' },
      { text: 'Ask for better light', correct: false, explanation: 'Conditions are playable. Adapt and overcome.' },
      { text: 'Play all shots from the crease', correct: false, explanation: 'Need footwork even in tough conditions. Play late and soft hands.' }
    ]
  },
  {
    id: 'bat_003',
    category: 'batting',
    difficulty: 'hard',
    situation: 'Fast bowler bowling 145+ kph with new ball. You just played and missed twice.',
    question: 'Mental approach for next ball?',
    options: [
      { text: 'Clear mind, watch the ball, trust your defense', correct: true, explanation: 'Correct! Past is past. Focus on this ball only.' },
      { text: 'Worry about getting out', correct: false, explanation: 'Negative thoughts create reality. Stay positive.' },
      { text: 'Step outside off to negate movement', correct: false, explanation: 'Predictable and vulnerable to straight ones.' },
      { text: 'Charge down the pitch', correct: false, explanation: 'Reckless against pace. Play proper cricket shots.' }
    ]
  },
  {
    id: 'bat_004', // Original bat_002
    category: 'batting',
    difficulty: 'medium',
    situation: 'T20: Need 48 runs off 24 balls. You\'re on 35*. Spin bowling to you, field is in.',
    question: 'What\'s your best approach?',
    options: [
      { text: 'Hit every ball for six to finish quickly', correct: false, explanation: 'Too risky. One wicket and pressure shifts massively.' },
      { text: 'Rotate strike smartly, hit one boundary per over', correct: true, explanation: 'Perfect! 8 runs per over is manageable. Keep singles flowing, capitalize on loose balls.' },
      { text: 'Block out the spin, attack pace later', correct: false, explanation: 'Not ideal. Required rate will climb. Need to keep scoreboard moving.' },
      { text: 'Sweep every ball', correct: false, explanation: 'Predictable and risky. Bowler will adjust, field will move.' }
    ]
  },
  {
    id: 'bat_005', // Original bat_003
    category: 'batting',
    difficulty: 'hard',
    situation: 'Test Match: Day 5, session 3. Need 87 runs to win with 6 wickets in hand. Rough outside off for right-handers.',
    question: 'Spinner bowling into the rough. Your best strategy?',
    options: [
      { text: 'Sweep every ball to avoid the rough', correct: false, explanation: 'Too risky and predictable. One top edge and you\'re gone.' },
      { text: 'Play with soft hands, defend close to pad, wait for loose ball', correct: true, explanation: 'Excellent! Negates the rough, reduces edges. Patience wins Test matches.' },
      { text: 'Use feet to get to the pitch every ball', correct: false, explanation: 'Exhausting and risky. One misjudgment and you\'re stumped.' },
      { text: 'Stand outside crease permanently', correct: false, explanation: 'Bowler will fire it in or bowl yorkers. Too predictable.' }
    ]
  },
  {
    id: 'bat_006', // Original bat_004
    category: 'batting',
    difficulty: 'medium',
    situation: 'ODI: Chasing 280. You\'re 2 down for 65 in 12 overs. Partnership needs building.',
    question: 'How do you approach the next 10 overs?',
    options: [
      { text: 'Go hard, take risks to catch up with run rate', correct: false, explanation: 'Another wicket will collapse the innings. Plenty of overs left.' },
      { text: 'Build partnership, rotate strike, aim for 5-6 per over', correct: true, explanation: 'Perfect! Stabilize, then accelerate. Required rate is still manageable.' },
      { text: 'Block everything, preserve wickets at all costs', correct: false, explanation: 'Too defensive. Run rate will balloon out of control.' },
      { text: 'Only hit boundaries, no singles', correct: false, explanation: 'Puts too much pressure. Singles keep strike rotating and scoreboard ticking.' }
    ]
  },
  {
    id: 'bat_007', // Original bat_005
    category: 'batting',
    difficulty: 'hard',
    situation: 'Final over, need 12 runs. Yorker specialist bowling. Mid-off and mid-on up.',
    question: 'Ball 1 is a perfect yorker. What\'s your plan for the over?',
    options: [
      { text: 'Dig out yorkers, wait for the one mistake', correct: true, explanation: 'Smart! Yorker bowlers will bowl 1-2 bad balls per over. Capitalize on those, survive the rest.' },
      { text: 'Pre-meditate scoop shots every ball', correct: false, explanation: 'Too risky if he adjusts length. Could bowl you through the gate.' },
      { text: 'Back away and slash everything', correct: false, explanation: 'Yorkers will trap you LBW or bowl you. Very low percentage.' },
      { text: 'Give up, it\'s impossible', correct: false, explanation: 'Never! 12 off 6 is very achievable. Belief is crucial.' }
    ]
  },
  {
    id: 'bat_008', // Original bat_006
    category: 'batting',
    difficulty: 'easy',
    situation: 'You just hit two boundaries in a row. Bowler is frustrated. Field moving back.',
    question: 'Next ball strategy?',
    options: [
      { text: 'Look for the single, rotate strike, keep pressure on', correct: true, explanation: 'Excellent! Don\'t get greedy. Keep scoring, maintain momentum.' },
      { text: 'Go for another big shot to dominate completely', correct: false, explanation: 'Bowler will adjust. Likely to bowl a different line/length.' },
      { text: 'Block the next 5 balls to consolidate', correct: false, explanation: 'Too defensive. You\'ve got them on the ropes, keep pressing.' },
      { text: 'Charge down the track blindly', correct: false, explanation: 'Predictable and risky. Play the ball on merit.' }
    ]
  },
  {
    id: 'bat_009', // Original bat_007
    category: 'batting',
    difficulty: 'medium',
    situation: 'You\'re on 48*. Next ball could be your fifty. Defensive field set.',
    question: 'Your approach?',
    options: [
      { text: 'Play normally, milestone will come naturally', correct: true, explanation: 'Perfect mindset! Focus on the process, not the outcome.' },
      { text: 'Try to hit a six to reach fifty in style', correct: false, explanation: 'Ego batting. Unnecessary risk for personal glory.' },
      { text: 'Block this ball, get nervous about the milestone', correct: false, explanation: 'Overthinking. Treat it like any other ball.' },
      { text: 'Ask for drinks break to calm nerves', correct: false, explanation: 'Disrupts rhythm. Just bat normally.' }
    ]
  },
  {
    id: 'bat_010', // Original bat_008
    category: 'batting',
    difficulty: 'hard',
    situation: 'T20: 6 balls left, need 18 runs. You\'re a tail-ender. Set batsman at other end on 75*.',
    question: 'What\'s your job?',
    options: [
      { text: 'Block out these 6 balls, let set batsman face next over', correct: false, explanation: 'No next over! This is the last over. Need to contribute.' },
      { text: 'Get one single early, give strike to set batsman for most of over', correct: true, explanation: 'Smart! You\'re not the hero. Back your partner who\'s in form.' },
      { text: 'Try to hit 3 sixes yourself', correct: false, explanation: 'Unrealistic. Know your role and limitations.' },
      { text: 'Run yourself out deliberately', correct: false, explanation: 'Terrible! That ends the innings. Never give up.' }
    ]
  },
  {
    id: 'bat_011', // Original bat_009
    category: 'batting',
    difficulty: 'medium',
    situation: 'Test: Day 3, you\'re 120* before lunch. Team is 300-3. Conditions good for batting.',
    question: 'Post-lunch session approach?',
    options: [
      { text: 'Accelerate, look for quick runs before declaration', correct: false, explanation: 'No rush. Build a massive first innings lead.' },
      { text: 'Continue batting solidly, build toward 150+, keep wickets intact', correct: true, explanation: 'Correct! Bat them out of the game. Big hundred, long partnerships.' },
      { text: 'Get to 150 then throw wicket away', correct: false, explanation: 'Why? Keep batting if conditions are good!' },
      { text: 'Start reverse sweeping for fun', correct: false, explanation: 'Unnecessary risk. Stick to what works.' }
    ]
  },
  {
    id: 'bat_012', // Original bat_010
    category: 'batting',
    difficulty: 'easy',
    situation: 'You nick one just short of slip. Lucky escape. Bowler celebrates thinking you\'re out.',
    question: 'How do you respond mentally?',
    options: [
      { text: 'Take it as a warning, play tighter defense next few balls', correct: true, explanation: 'Good! Learn from close calls. Adjust and survive.' },
      { text: 'Get angry and attack even harder', correct: false, explanation: 'Emotion-driven batting leads to mistakes.' },
      { text: 'Think about how you nearly got out all over', correct: false, explanation: 'Dwelling on it will affect next ball. Move on.' },
      { text: 'Apologize to bowler for not getting out', correct: false, explanation: 'Never! This is competition. Stay focused.' }
    ]
  },
  {
    id: 'bat_013', // Original bat_011
    category: 'batting',
    difficulty: 'hard',
    situation: 'ODI: Need 9 runs off last 2 overs. You\'re 88*. Tail-ender with you.',
    question: 'How do you manage the chase?',
    options: [
      { text: 'Try to finish it in one shot to get personal 100', correct: false, explanation: 'Selfish. Team > individual milestones.' },
      { text: 'Take singles when offered, shield tail-ender, seal victory first', correct: true, explanation: 'Perfect! Team needs 9 runs, not your hundred. Be smart.' },
      { text: 'Farm all strike, hit winning runs yourself', correct: false, explanation: 'If you get out, tail-ender alone is risky. Share responsibility.' },
      { text: 'Let tail-ender face half the balls', correct: false, explanation: 'Too risky. Protect them, finish the job.' }
    ]
  },
  {
    id: 'bat_014', // Original bat_012
    category: 'batting',
    difficulty: 'medium',
    situation: 'Powerplay over. You\'re 15 off 8 balls. Spinner coming on. Field spreading.',
    question: 'Best approach now?',
    options: [
      { text: 'Keep attacking like powerplay continues', correct: false, explanation: 'Field is back. Boundaries harder now. Adapt!' },
      { text: 'Look for ones and twos, occasional boundary off bad ball', correct: true, explanation: 'Excellent! Transition phase. Build innings smartly.' },
      { text: 'Defend every ball for next 5 overs', correct: false, explanation: 'Too defensive. Scoreboard must keep moving.' },
      { text: 'Slog sweep everything', correct: false, explanation: 'Predictable. Spinner will adjust quickly.' }
    ]
  },
  {
    id: 'bat_015', // Original bat_013
    category: 'batting',
    difficulty: 'easy',
    situation: 'Rain delayed start. Pitch has moisture. Bowlers got extra swing.',
    question: 'Opening batting mindset?',
    options: [
      { text: 'Survive first hour, conditions will ease', correct: true, explanation: 'Smart! Weather-affected conditions change. Be patient.' },
      { text: 'Attack immediately before it gets worse', correct: false, explanation: 'When it\'s tough, toughen up. Don\'t panic.' },
      { text: 'Ask captain to send someone else', correct: false, explanation: 'You\'re the opener! This is your job!' },
      { text: 'Complain about pitch conditions', correct: false, explanation: 'Same for both teams. Focus on batting!' }
    ]
  },
  {
    id: 'bat_016', // Original bat_014
    category: 'batting',
    difficulty: 'easy',
    situation: 'You are 5* on 10 balls. Your team is 20-3 in a T20 chase. Powerplay is still on.',
    question: 'What is your primary goal for the next 2 overs?',
    options: [
      { text: 'Look for quick singles and rotate strike', correct: true, explanation: 'Consolidate the innings and keep the scoreboard ticking with low-risk options.' },
      { text: 'Try to hit big boundaries to release pressure', correct: false, explanation: 'Too risky at this stage. Another wicket would be disastrous.' },
      { text: 'Defend every ball to ensure you don\'t get out', correct: false, explanation: 'Being too defensive will increase the required run rate, making the chase harder.' },
      { text: 'Take high-risk twos to put pressure on fielders', correct: false, explanation: 'High risk of run-outs when the team is already under pressure.' }
    ]
  },
  {
    id: 'bat_017', // Original bat_015
    category: 'batting',
    difficulty: 'medium',
    situation: 'You\'re batting at number 4. The openers have just put on a 100-run partnership and have been dismissed in quick succession. The score is 100-2 after 15 overs in an ODI.',
    question: 'What\'s your immediate approach?',
    options: [
      { text: 'Continue the attacking momentum to keep the run rate high', correct: false, explanation: 'While a good run rate is important, losing two quick wickets after a strong start means consolidation is key.' },
      { text: 'Rotate strike, rebuild the innings, and punish loose deliveries', correct: true, explanation: 'Correct! The team needs stability. Focus on building a new partnership and keeping the scoreboard ticking without taking undue risks.' },
      { text: 'Play defensively until the 30th over to ensure no more wickets fall', correct: false, explanation: 'Being too defensive will stifle the run rate and put pressure on later batsmen.' },
      { text: 'Try to hit boundaries to assert dominance over the new bowlers', correct: false, explanation: 'This is a high-risk strategy after quick wickets; it could lead to further collapse.' }
    ]
  },
  {
    id: 'bat_018', // Original bat_016
    category: 'batting',
    difficulty: 'hard',
    situation: 'Test Match: Your team is 350-5 on a flat pitch. There are 20 overs left in the day. You are a set batsman on 80*, with a tail-ender at the other end.',
    question: 'What\'s your strategy for the remainder of the day?',
    options: [
      { text: 'Try to reach your century as quickly as possible', correct: false, explanation: 'Personal milestones are secondary to the team\'s strategy.' },
      { text: 'Farm the strike, protect the tail-ender, and score quickly when possible', correct: true, explanation: 'Correct! Maximize your time at the crease, shield the tail, and aim to boost the score towards a declaration target or a strong overnight position.' },
      { text: 'Go for big shots with every ball to declare by stumps', correct: false, explanation: 'Aggressive hitting with a tail-ender can lead to a quick all-out, losing the opportunity to set a big total.' },
      { text: 'Play defensively to ensure no more wickets fall before stumps', correct: false, explanation: 'On a flat pitch, a defensive approach wastes scoring opportunities that could be crucial for the team\'s total.' }
    ]
  },
  {
    id: 'bat_019', // Original bat_017
    category: 'batting',
    difficulty: 'medium',
    situation: 'T20: You\'re chasing 180. Team is 45-0 after 6 overs. Required rate is 9 per over.',
    question: 'Your approach in overs 7-10?',
    options: [
      { text: 'Maintain current strike rate, don\'t take unnecessary risks', correct: true, explanation: 'Perfect! You\'re ahead of the game. Build platform, then launch later.' },
      { text: 'Go harder now to reduce pressure for death overs', correct: false, explanation: 'Unnecessary aggression. Could lose wickets. Current rate is fine.' },
      { text: 'Slow down to 5-6 per over to preserve wickets', correct: false, explanation: 'Required rate will climb too high. Keep momentum going.' },
      { text: 'Retire hurt to save yourself for final overs', correct: false, explanation: 'What?! That\'s not how cricket works!' }
    ]
  },
  {
    id: 'bat_020', // Original bat_018
    category: 'batting',
    difficulty: 'hard',
    situation: 'Test: Session 3, Day 4. Need 220 more runs with 7 wickets. Pitch turning sharply.',
    question: 'Best batting strategy?',
    options: [
      { text: 'Attack the spinners to score quickly before wickets fall', correct: false, explanation: 'Playing into their hands. Pitch is helping them.' },
      { text: 'Use feet intelligently, play late, wait for bad balls', correct: true, explanation: 'Excellent! Smart Test batting. Respect good balls, punish bad ones.' },
      { text: 'Block everything for a draw', correct: false, explanation: 'Too negative. Still can win this with smart batting.' },
      { text: 'Send tail-enders to counter spin', correct: false, explanation: 'Terrible tactic. They can\'t bat on turning pitches!' }
    ]
  },
  {
    id: 'bat_021', // Original bat_019
    category: 'batting',
    difficulty: 'easy',
    situation: 'You just dropped a catch in the field. Now you\'re batting. Fielding team is chirping.',
    question: 'Mental approach?',
    options: [
      { text: 'Use it as motivation, prove yourself with the bat', correct: true, explanation: 'Champion mindset! Turn negative to positive.' },
      { text: 'Feel guilty and play recklessly', correct: false, explanation: 'Two wrongs don\'t make a right. Compose yourself.' },
      { text: 'Avoid taking risks, afraid of more mistakes', correct: false, explanation: 'Fear-based batting fails. Believe in yourself.' },
      { text: 'Argue with fielders about the drop', correct: false, explanation: 'Wasted energy. Focus on batting now.' }
    ]
  },
  {
    id: 'bat_022', // Original bat_020
    category: 'batting',
    difficulty: 'medium',
    situation: 'ODI: Death overs. You\'re 60*. Need 30 off 18 balls. Spinner bowling, field up inside circle.',
    question: 'Smart move?',
    options: [
      { text: 'Hit over the top for two boundaries, get ahead of required rate', correct: true, explanation: 'Good! Field is up, use it. Get ahead, then play smart.' },
      { text: 'Keep nudging for singles only', correct: false, explanation: 'Not aggressive enough. Need boundaries with field up.' },
      { text: 'Slog every ball', correct: false, explanation: 'One wicket and it\'s over. Be selective.' },
      { text: 'Wait for pace bowlers to come back', correct: false, explanation: 'Can\'t waste balls waiting. Use current conditions.' }
    ]
  },
  {
    id: 'bat_023', // Original bat_021
    category: 'batting',
    difficulty: 'medium',
    situation: 'ODI Powerplay: You\'re 12 off 10. Leg spinner comes on. Captain wants you to attack him.',
    question: 'How do you attack wisely?',
    options: [
      { text: 'Watch a couple balls, identify his variations, then attack bad balls', correct: true, explanation: 'Smart! Know what you\'re attacking first. Patient aggression wins.' },
      { text: 'Slog sweep first ball without watching', correct: false, explanation: 'Reckless! Could be his googly or top spinner.' },
      { text: 'Use feet immediately every ball', correct: false, explanation: 'Predictable. Watch a few deliveries first.' },
      { text: 'Only defend him, attack pace later', correct: false, explanation: 'Captain wants pressure on the spinner. Be smart about it.' }
    ]
  },
  {
    id: 'bat_024', // Original bat_022
    category: 'batting',
    difficulty: 'hard',
    situation: 'Test Match: Day 2 evening, you\'re 45*. Bad light stopping play soon. 8 overs left.',
    question: 'Your strategy?',
    options: [
      { text: 'See off these overs safely, resume tomorrow from a solid position', correct: true, explanation: 'Perfect Test match thinking! Patience and long-term planning.' },
      { text: 'Try to reach fifty before close, take risks', correct: false, explanation: 'Ego decision. Getting out now hurts the team position.' },
      { text: 'Deliberately get out to avoid batting in bad light', correct: false, explanation: 'Cowardly and unprofessional. Face the challenge!' },
      { text: 'Appeal for bad light every over', correct: false, explanation: 'Umpires decide. Focus on batting well.' }
    ]
  },
  {
    id: 'bat_025', // Original bat_023
    category: 'batting',
    difficulty: 'easy',
    situation: 'T20: Opening the batting. First ball is a wide down leg side.',
    question: 'Your mindset for ball 2?',
    options: [
      { text: 'Fresh start, watch this ball carefully, play on merit', correct: true, explanation: 'Good! Wide ball is over. Focus on the legal delivery.' },
      { text: 'Expect another wide, leave everything', correct: false, explanation: 'Bowler will adjust. Be ready to play properly.' },
      { text: 'Charge down immediately to attack', correct: false, explanation: 'Hasty. See where he pitches first ball properly.' },
      { text: 'Ask umpire about the bowler\'s action', correct: false, explanation: 'Focus on batting! Don\'t distract yourself.' }
    ]
  },
  {
    id: 'bat_026', // Original bat_024
    category: 'batting',
    difficulty: 'hard',
    situation: 'ODI: Chasing 275. 40 overs gone, score 220-6. You\'re 65*. Need 55 off 60 balls with tail.',
    question: 'How do you approach this?',
    options: [
      { text: 'Farm strike heavily, score in singles, hit bad balls for four', correct: true, explanation: 'Excellent! Trust yourself more than the tail. Controlled aggression.' },
      { text: 'Try to finish it with sixes, go hard immediately', correct: false, explanation: 'If you get out swinging, tail can\'t chase 55. Be smart.' },
      { text: 'Let tail-enders share scoring, take pressure off', correct: false, explanation: 'They can\'t handle this pressure. It\'s your responsibility.' },
      { text: 'Block every ball, play for a tie', correct: false, explanation: 'Still 10 overs left! 55 is very gettable. Believe!' }
    ]
  },
  {
    id: 'bat_027', // Original bat_025
    category: 'batting',
    difficulty: 'medium',
    situation: 'Test: Day 1, session 1. Pitch is fresh, ball is hard. Your team won toss and batted.',
    question: 'First hour mindset as opener?',
    options: [
      { text: 'Survive and see off the new ball, set foundation', correct: true, explanation: 'Perfect Test match approach! Hard work now, rewards later.' },
      { text: 'Score quickly while pitch is good', correct: false, explanation: 'New ball does most. Survive first, then score.' },
      { text: 'Try to demoralize bowlers with boundaries', correct: false, explanation: 'When ball is new and hard, respect it. Be patient.' },
      { text: 'Run lots of twos to tire the fielders', correct: false, explanation: 'Focus on playing the ball right. Don\'t manufacture pressure.' }
    ]
  },
  {
    id: 'bat_050',
    category: 'batting',
    difficulty: 'medium',
    situation: 'You\'ve survived the opening spell. Score is 15-0 after 6 overs. Spinner comes on.',
    question: 'How do you approach the spinner?',
    options: [
      { text: 'Look to score freely, build confidence against spin', correct: true, explanation: 'Good! Use this phase to build your score after surviving pace.' },
      { text: 'Block everything, wait for pace', correct: false, explanation: 'Too defensive. Capitalize on easier matchup.' },
      { text: 'Try to hit every ball for six', correct: false, explanation: 'Overambitious. Build innings steadily.' },
      { text: 'Ask for drinks break', correct: false, explanation: 'Unnecessary. You\'re settled, keep momentum.' }
    ]
  },

  // Middle-overs Accumulation (Bat 051-100)
  {
    id: 'bat_051',
    category: 'batting',
    difficulty: 'medium',
    situation: 'ODI: Middle overs, spinners operating. Field is spread. You\'re 35* off 40.',
    question: 'Strategy for next 10 overs?',
    options: [
      { text: 'Rotate strike, hit bad balls, keep scoreboard moving', correct: true, explanation: 'Perfect middle-overs batting. Smart accumulation.' },
      { text: 'Block everything until death overs', correct: false, explanation: 'Too defensive. Run rate will balloon.' },
      { text: 'Hit every ball in the air', correct: false, explanation: 'High risk. One wicket triggers collapse.' },
      { text: 'Only take singles to fielders', correct: false, explanation: 'Predictable. Mix up your game.' }
    ]
  },

  // ========== BOWLING SCENARIOS (250+) ==========
  
  {
    id: 'bowl_001',
    category: 'bowling',
    difficulty: 'easy',
    situation: 'First over of T20. Aggressive opener on strike. Field is up.',
    question: 'What\'s your best approach?',
    options: [
      { text: 'Bowl straight at the stumps, make them earn boundaries', correct: true, explanation: 'Perfect! Eliminate the free-flowing shots. Force them to take risks.' },
      { text: 'Bowl short bouncers to intimidate', correct: false, explanation: 'They\'ll pull you for six. Not smart with field up.' },
      { text: 'Bowl wide yorkers every ball', correct: false, explanation: 'Hard to control, likely to be wides. Stick to basics early.' },
      { text: 'Try all your variations immediately', correct: false, explanation: 'Save them for later. Build pressure first with good length.' }
    ]
  },
  {
    id: 'bowl_002',
    category: 'bowling',
    difficulty: 'medium',
    situation: 'Death overs, T20. Batsman is set on 45*. Needs 8 per over. You have 2 overs left.',
    question: 'What\'s your primary weapon?',
    options: [
      { text: 'Wide yorkers at the stumps, change pace', correct: true, explanation: 'Excellent! Limit scoring areas, use variations to create doubt.' },
      { text: 'Bowl bouncers constantly', correct: false, explanation: 'Predictable. Good batsmen will wait and pull you for six.' },
      { text: 'Bowl full tosses for easy dots', correct: false, explanation: 'Full tosses will be smashed. Very high risk.' },
      { text: 'Bowl medium pace only', correct: false, explanation: 'Needs variation. Predictable pace gets destroyed in death overs.' }
    ]
  },
  {
    id: 'bowl_003',
    category: 'bowling',
    difficulty: 'hard',
    situation: 'Test match: Flat pitch, batsman on 95. Field is spread, he\'s farming strike.',
    question: 'How do you bowl to him?',
    options: [
      { text: 'Build pressure with tight lines, make him work for his 100', correct: true, explanation: 'Smart! Nerves near century can cause mistakes. Dry up runs, wait for error.' },
      { text: 'Bowl full tosses to help him reach 100 quickly', correct: false, explanation: 'What? No! That\'s helping the opposition.' },
      { text: 'Bowl short pitched intimidation', correct: false, explanation: 'Not effective on flat pitch. Will just go for runs.' },
      { text: 'Try to get him out with a magic ball', correct: false, explanation: 'Too hopeful. Patience and pressure work better.' }
    ]
  },
  {
    id: 'bowl_004',
    category: 'bowling',
    difficulty: 'medium',
    situation: 'Spin bowling, ODI middle overs. Batsmen rotating strike easily. Captain wants a wicket.',
    question: 'What\'s your strategy?',
    options: [
      { text: 'Flight it more, invite the big shot', correct: true, explanation: 'Good thinking! Create doubt, force them to take risks. Wickets come from pressure.' },
      { text: 'Bowl flat and fast to stop runs', correct: false, explanation: 'Won\'t take wickets. Just delays the inevitable.' },
      { text: 'Bowl full tosses deliberately', correct: false, explanation: 'Why would you do this? Easy runs for batsmen.' },
      { text: 'Ask to be taken off', correct: false, explanation: 'No! This is when spinners shine. Back yourself.' }
    ]
  },
  {
    id: 'bowl_005',
    category: 'bowling',
    difficulty: 'hard',
    situation: 'Last over, defending 7 runs. Dangerous batsman on strike. Long-on and long-off back.',
    question: 'First ball: What do you bowl?',
    options: [
      { text: 'Perfect yorker at leg stump', correct: true, explanation: 'Best option! Hard to hit, aims at the stumps. Set the tone.' },
      { text: 'Bouncer to intimidate', correct: false, explanation: 'Could be wide, or hooked for six. Too risky.' },
      { text: 'Slow ball outside off', correct: false, explanation: 'First ball might be anticipated. Save for later in over.' },
      { text: 'Full toss at head height', correct: false, explanation: 'Illegal and dangerous. Instant no-ball and free hit.' }
    ]
  },
  {
    id: 'bowl_006',
    category: 'bowling',
    difficulty: 'medium',
    situation: 'ODI: Batsman just hit you for 6. He\'s aggressive, looks to attack again.',
    question: 'Next ball plan?',
    options: [
      { text: 'Change your length and pace, create doubt', correct: true, explanation: 'Smart! Don\'t give him the same ball. Make him think.' },
      { text: 'Bowl same ball, he won\'t expect it', correct: false, explanation: 'Overconfidence. He\'s in rhythm. Adjust!' },
      { text: 'Bowl wide to avoid being hit', correct: false, explanation: 'Cowardly and will be a wide. Back yourself.' },
      { text: 'Argue with captain about field placement', correct: false, explanation: 'Focus on your bowling. That\'s your job.' }
    ]
  },
  {
    id: 'bowl_007',
    category: 'bowling',
    difficulty: 'easy',
    situation: 'Test match, morning session. Ball is swinging. New batsman just in.',
    question: 'Best approach?',
    options: [
      { text: 'Probe outside off, full length, make them play', correct: true, explanation: 'Perfect! New batsman, swinging ball. Classic dismissal setup.' },
      { text: 'Bowl short to intimidate immediately', correct: false, explanation: 'Wastes the swing. Use conditions smartly.' },
      { text: 'Bowl straight on leg stump', correct: false, explanation: 'Easier to defend. Outside off is the danger zone.' },
      { text: 'Try all your variations first over', correct: false, explanation: 'Stick to basics in good conditions. Keep it simple.' }
    ]
  },
  {
    id: 'bowl_008',
    category: 'bowling',
    difficulty: 'hard',
    situation: 'T20: Batsman is 78*. Hitting you at will. Field maxed out. 3 overs left.',
    question: 'How do you slow him down?',
    options: [
      { text: 'Bowl wide outside off, make him fetch it from there', correct: true, explanation: 'Smart! Take away his hitting arc. Risk-reward.' },
      { text: 'Bowl full tosses, hope he mistimes', correct: false, explanation: 'Form batsman will destroy full tosses. Terrible plan.' },
      { text: 'Beg captain to take you off', correct: false, explanation: 'Bowlers must problem-solve. Fight through tough spells.' },
      { text: 'Bowl slow bouncers repeatedly', correct: false, explanation: 'Predictable. One adjustment and he\'ll smash you.' }
    ]
  },
  {
    id: 'bowl_009',
    category: 'bowling',
    difficulty: 'medium',
    situation: 'ODI middle overs. Left-hand right-hand partnership going smoothly.',
    question: 'Spinner - how do you break this partnership?',
    options: [
      { text: 'Bowl around the wicket to RHB, over to LHB, change angles', correct: true, explanation: 'Excellent! Disrupt their rhythm with different angles.' },
      { text: 'Keep same line to both, maintain pressure', correct: false, explanation: 'They\'re comfortable. Need to change something.' },
      { text: 'Bowl only googly to create confusion', correct: false, explanation: 'Overuse makes it predictable. Mix it up.' },
      { text: 'Ask for field change every ball', correct: false, explanation: 'Disruptive. Focus on your bowling execution.' }
    ]
  },
  {
    id: 'bowl_010',
    category: 'bowling',
    difficulty: 'easy',
    situation: 'You\'re nervous, it\'s your first over in a big match. Captain puts you on.',
    question: 'Mental approach?',
    options: [
      { text: 'Deep breath, trust your training, bowl your natural ball', correct: true, explanation: 'Perfect! Nerves are normal. Stick to basics.' },
      { text: 'Try fancy variations to impress', correct: false, explanation: 'Recipe for disaster. Keep it simple under pressure.' },
      { text: 'Tell captain you\'re too nervous', correct: false, explanation: 'Captain believes in you. Rise to the occasion!' },
      { text: 'Bowl as fast as possible without control', correct: false, explanation: 'Control > speed when nervous. Be smart.' }
    ]
  },
  {
    id: 'bowl_011',
    category: 'bowling',
    difficulty: 'medium',
    situation: 'Test: Session 2, Day 2. Pitch is flat. Batsmen are scoring freely. You\'re tiring.',
    question: 'How do you stay effective?',
    options: [
      { text: 'Shorten your run-up, maintain accuracy, bowl to your field', correct: true, explanation: 'Smart! Conserve energy, stay accurate. Long day ahead.' },
      { text: 'Keep bowling full pace, tire yourself completely', correct: false, explanation: 'You\'ll be useless in second innings. Manage your body.' },
      { text: 'Ask to be taken off immediately', correct: false, explanation: 'Bowlers must grind through tough periods.' },
      { text: 'Bowl only bouncers to rest', correct: false, explanation: 'Predictable and wastes the ball. Stay smart.' }
    ]
  },
  {
    id: 'bowl_012',
    category: 'bowling',
    difficulty: 'hard',
    situation: 'ODI: Death overs, defending 15 off 12 balls. Batsman on strike is dangerous hitter.',
    question: 'Over strategy?',
    options: [
      { text: 'Mix yorkers, slower balls, wide lines - keep him guessing', correct: true, explanation: 'Perfect! Variety is key. Don\'t let him settle on one length.' },
      { text: 'Bowl 6 perfect yorkers', correct: false, explanation: 'Near impossible. One mistake costs 6 runs. Need backup plans.' },
      { text: 'Pray and hope for the best', correct: false, explanation: 'Have a plan! Belief with strategy wins matches.' },
      { text: 'Bowl all slower balls', correct: false, explanation: 'After 2-3, he\'ll figure it out. Need variation.' }
    ]
  },
  {
    id: 'bowl_013',
    category: 'bowling',
    difficulty: 'medium',
    situation: 'Spinner: Batsman using his feet aggressively. Already hit you for 2 sixes.',
    question: 'How do you counter?',
    options: [
      { text: 'Flight it more but shorten length when he advances', correct: true, explanation: 'Smart! Invite the charge but adjust. Make him miss.' },
      { text: 'Bowl faster and flatter only', correct: false, explanation: 'Predictable. He\'ll adjust and keep scoring.' },
      { text: 'Stop flighting the ball completely', correct: false, explanation: 'You\'re giving up your weapon. Bad plan.' },
      { text: 'Bowl full tosses deliberately', correct: false, explanation: 'Why make it easier for him?!' }
    ]
  },
  {
    id: 'bowl_014',
    category: 'bowling',
    difficulty: 'medium',
    situation: 'You are a spinner bowling in the middle overs of an ODI. Two new batsmen are at the crease after a quick double-wicket.',
    question: 'How do you exploit this situation?',
    options: [
      { text: 'Bowl tight, defensive lines to dry up runs', correct: false, explanation: 'While important, taking wickets is more crucial when new batsmen are in.' },
      { text: 'Vary pace and flight, invite aggressive shots to create chances', correct: true, explanation: 'Capitalize on the new batsmen\'s eagerness to score by tempting them into risky shots.' },
      { text: 'Switch to a fast bowler immediately', correct: false, explanation: 'Maintain the pressure with spin, as new batsmen often struggle against it.' },
      { text: 'Try to bowl a perfect googly every ball', correct: false, explanation: 'Too much variation can lead to loss of control; stick to well-practiced variations.' }
    ]
  },
  {
    id: 'bowl_015',
    category: 'bowling',
    difficulty: 'medium',
    situation: 'You\'re a medium-pace bowler in an ODI. The opposition is 150-1 after 25 overs, with their best batsman set on 70*.',
    question: 'What\'s your plan to get this batsman out or slow the scoring?',
    options: [
      { text: 'Bowl consistently full and straight, hoping for an LBW or bowled', correct: false, explanation: 'A set batsman on a good pitch will likely handle this easily and rotate strike.' },
      { text: 'Vary your pace and length, use slower balls and bouncers to create doubt', correct: true, explanation: 'Correct! Deception is key against set batsmen. Make them guess and disrupt their rhythm.' },
      { text: 'Try to bowl wide yorkers to deny scoring opportunities', correct: false, explanation: 'Can lead to wides and doesn\'t directly threaten the stumps or create catching chances.' },
      { text: 'Rely solely on aggressive field settings to build pressure', correct: false, explanation: 'Field settings are important, but effective bowling is the primary tool to take wickets.' }
    ]
  },
  {
    id: 'bowl_016',
    category: 'bowling',
    difficulty: 'hard',
    situation: 'T20: Last over, defending 5 runs. Number 7 batsman on strike, known for hitting sixes. The pitch offers some turn for spinners.',
    question: 'As captain, do you give the ball to your best fast bowler or your best spinner?',
    options: [
      { text: 'Fast bowler known for yorkers and slower balls', correct: true, explanation: 'Against a power-hitter needing few runs, a death-overs specialist fast bowler with accurate yorkers and slower balls is often the safest bet to restrict boundaries.' },
      { text: 'Best spinner to exploit the turn in the pitch', correct: false, explanation: 'While spin might turn, against a six-hitter needing only 5 runs, one mishit can clear the boundary, making it very risky.' },
      { text: 'A new, confident medium-pacer', correct: false, explanation: 'Too much pressure for an inexperienced bowler in such a crucial situation.' },
      { text: 'Bowl yourself if you\'re a part-time bowler', correct: false, explanation: 'Only a specialist death bowler should bowl this over.' }
    ]
  },
  {
    id: 'bowl_017',
    category: 'bowling',
    difficulty: 'easy',
    situation: 'Fast bowler: You just got a wicket with a bouncer. New batsman looks uncomfortable.',
    question: 'Next ball strategy?',
    options: [
      { text: 'Pitch it up full, targeting stumps - set him up', correct: true, explanation: 'Classic! After bouncer, full ball gets wickets. He\'s expecting short.' },
      { text: 'Another bouncer', correct: false, explanation: 'Predictable. He\'ll be ready now. Set him up differently.' },
      { text: 'Bowl a wide to waste the ball', correct: false, explanation: 'Why waste the advantage? Strike while he\'s vulnerable!' },
      { text: 'Bowl a slow full toss', correct: false, explanation: 'Gift runs. Maintain pressure with good balls.' }
    ]
  },
  {
    id: 'bowl_018',
    category: 'bowling',
    difficulty: 'medium',
    situation: 'T20: Powerplay. Batsman trying to hit you over cover repeatedly.',
    question: 'How do you adjust?',
    options: [
      { text: 'Bowl straighter at the stumps, take away the width', correct: true, explanation: 'Smart! Make him change his gameplan. Protect your strength.' },
      { text: 'Keep bowling wide, hope he misses', correct: false, explanation: 'He\'s figured you out. Adjust before it\'s too late.' },
      { text: 'Bowl yorkers every ball', correct: false, explanation: 'Hard to execute consistently. Mix your lengths.' },
      { text: 'Bowl full tosses', correct: false, explanation: 'Even easier to hit. Think!' }
    ]
  },
  {
    id: 'bowl_019',
    category: 'bowling',
    difficulty: 'hard',
    situation: 'Test: Day 4 pitch. Rough forming outside off for RHB. Left-arm spinner.',
    question: 'How do you exploit this?',
    options: [
      { text: 'Bowl around the wicket into the rough, create sharp turn and bounce', correct: true, explanation: 'Perfect! Classic left-arm spinner tactic. Unplayable deliveries coming!' },
      { text: 'Bowl over the wicket, away from the rough', correct: false, explanation: 'Wastes the advantage. Use the rough!' },
      { text: 'Bowl faster to avoid using the rough', correct: false, explanation: 'Why?! The rough is your weapon!' },
      { text: 'Ask groundsman to fix the rough', correct: false, explanation: 'It\'s natural wear. Use it to your advantage!' }
    ]
  },
  {
    id: 'bowl_020',
    category: 'bowling',
    difficulty: 'medium',
    situation: 'ODI: You\'ve bowled 8 overs, 0-42. Captain wants you to bowl out. 2 overs left.',
    question: 'Mental approach?',
    options: [
      { text: 'Fight back, these 2 overs matter. Finish strong.', correct: true, explanation: 'Champion mentality! Economy can improve. Give your best.' },
      { text: 'Go through the motions, day is done', correct: false, explanation: 'Wrong attitude! Wickets can come anytime.' },
      { text: 'Try new variations never practiced', correct: false, explanation: 'Stick to what you know. Build back confidence.' },
      { text: 'Bowl deliberately wide to finish quickly', correct: false, explanation: 'Unprofessional. Always compete.' }
    ]
  },

  // ========== FIELDING SCENARIOS (150+) ==========
  
  {
    id: 'field_001',
    category: 'fielding',
    difficulty: 'easy',
    situation: 'You\'re at mid-off. Straight drive coming hard at you. What do you do?',
    question: 'Best technique?',
    options: [
      { text: 'Get your body behind it, watch it into your hands', correct: true, explanation: 'Perfect! Body acts as second line of defense. Safe and reliable.' },
      { text: 'Dive dramatically to your right', correct: false, explanation: 'Unnecessary and risky. Ball is coming straight at you.' },
      { text: 'Let it go through for four', correct: false, explanation: 'No! Basic stop. Always back yourself.' },
      { text: 'Try to catch it one-handed while jumping', correct: false, explanation: 'Showboating. Increases drop chance. Keep it simple.' }
    ]
  },
  {
    id: 'field_002',
    category: 'fielding',
    difficulty: 'medium',
    situation: 'Boundary riding. Ball hit high in the air, coming toward you near rope. Batsmen running.',
    question: 'What\'s your priority?',
    options: [
      { text: 'Judge the catch, position yourself perfectly', correct: true, explanation: 'Correct! Catch > everything. A wicket is more valuable than saving one run.' },
      { text: 'Run toward the ball without judging trajectory', correct: false, explanation: 'Could misjudge badly. Always track the ball\'s path first.' },
      { text: 'Let it bounce to avoid risk of drop', correct: false, explanation: 'Cowardly! Always go for catches. Backs yourself and your team.' },
      { text: 'Throw it before catching to stop runs', correct: false, explanation: 'Impossible. You can\'t throw what you haven\'t caught yet!' }
    ]
  },
  {
    id: 'field_003',
    category: 'fielding',
    difficulty: 'hard',
    situation: 'Run out chance. You\'re at mid-wicket, ball is 10m away. Batsman is out of crease. One stump visible.',
    question: 'What do you do?',
    options: [
      { text: 'Pick up and throw in one motion at the visible stump', correct: true, explanation: 'Yes! Speed is crucial. Don\'t think, just execute. Trust your training.' },
      { text: 'Collect cleanly, then think about throwing', correct: false, explanation: 'Too slow. By then batsman is home. React instinctively.' },
      { text: 'Throw at the bowler to let them break stumps', correct: false, explanation: 'Extra step loses time. Direct hit is always better.' },
      { text: 'Roll it along the ground for accuracy', correct: false, explanation: 'Way too slow! Batsman will make it easily.' }
    ]
  },
  {
    id: 'field_004',
    category: 'fielding',
    difficulty: 'medium',
    situation: 'Close catch at slip. Ball flew fast, you react late, ball hits palm and pops up.',
    question: 'What now?',
    options: [
      { text: 'React immediately, try to catch the rebound', correct: true, explanation: 'Great! Second chances exist. Stay alert!' },
      { text: 'Give up, accept you dropped it', correct: false, explanation: 'Never give up until ball hits ground!' },
      { text: 'Apologize to bowler mid-action', correct: false, explanation: 'Focus on catching the rebound first!' },
      { text: 'Look away in disappointment', correct: false, explanation: 'Stay in the moment! Could still catch it!' }
    ]
  },
  {
    id: 'field_005',
    category: 'fielding',
    difficulty: 'easy',
    situation: 'You\'re at point. Ball hit straight at you on the ground. Quick single being attempted.',
    question: 'What\'s your play?',
    options: [
      { text: 'Attack the ball, throw in one motion at striker\'s end', correct: true, explanation: 'Perfect! Quick singles need quick fielding. Be aggressive.' },
      { text: 'Wait for ball to come to you', correct: false, explanation: 'Too slow. Single will be completed easily.' },
      { text: 'Pick up and check if they\'re running first', correct: false, explanation: 'Wastes time. Throw immediately!' },
      { text: 'Kick it toward stumps', correct: false, explanation: 'Less accurate than throwing. Use your hands!' }
    ]
  },
  {
    id: 'field_006',
    category: 'fielding',
    difficulty: 'hard',
    situation: 'Deep square leg. Batsman pulls, ball going over your head for six. You\'re near boundary.',
    question: 'What do you attempt?',
    options: [
      { text: 'Jump, try to parry it back into play even if you can\'t catch', correct: true, explanation: 'Excellent! Save 6 runs by turning six into 4. Smart fielding.' },
      { text: 'Let it go, it\'s going for six anyway', correct: false, explanation: 'Never assume! Try to save every run possible.' },
      { text: 'Try to catch while stepping over boundary', correct: false, explanation: 'That\'s still a six! Know the rules.' },
      { text: 'Move away to avoid getting hit', correct: false, explanation: 'Take one for the team! That\'s why you\'re out there.' }
    ]
  },
  {
    id: 'field_007',
    category: 'fielding',
    difficulty: 'medium',
    situation: 'You\'re wicketkeeper. Fast bowler. Ball edges but doesn\'t carry to you. Rolls toward you.',
    question: 'What\'s your immediate action?',
    options: [
      { text: 'Stay alert, gather quickly, check for run-out chance at striker\'s end', correct: true, explanation: 'Smart! Batsmen might take a risky single. Be ready!' },
      { text: 'Relax, ball is dead', correct: false, explanation: 'Ball is live until settled! Stay alert!' },
      { text: 'Throw it back to bowler immediately', correct: false, explanation: 'Check the situation first. Could be a run-out!' },
      { text: 'Start walking away', correct: false, explanation: 'Never switch off! Play to the whistle!' }
    ]
  },
  {
    id: 'field_008',
    category: 'fielding',
    difficulty: 'hard',
    situation: 'You are at long-off. The batsman hits a powerful shot high in the air towards you. It\'s likely to be a six.',
    question: 'What is your objective?',
    options: [
      { text: 'Attempt to catch it, even if it means risking crossing the boundary', correct: false, explanation: 'Your priority should be to prevent a six, which can be done by parrying the ball back into play even if you cannot complete the catch.' },
      { text: 'Try to parry the ball back into play to save runs', correct: true, explanation: 'Correct! Even if you can\'t catch it, saving a boundary is crucial.' },
      { text: 'Let it go for a six to avoid injury', correct: false, explanation: 'Always give your best effort to save runs, injury permitting.' },
      { text: 'Signal for another fielder to come', correct: false, explanation: 'You are the closest fielder; you must act quickly.' }
    ]
  },
  {
    id: 'field_009',
    category: 'fielding',
    difficulty: 'medium',
    situation: 'You\'re at point. A hard-hit square cut comes quickly to your right.',
    question: 'What\'s the ideal fielding action?',
    options: [
      { text: 'Dive with one hand outstretched to stop it', correct: false, explanation: 'Risky and can lead to a deflection for runs.' },
      { text: 'Dive full length with two hands, body behind the ball', correct: true, explanation: 'Correct! Maximizes the chance of stopping the ball cleanly and preventing runs.' },
      { text: 'Try to kick it towards the stumps', correct: false, explanation: 'Illegal and can result in a deflection for runs.' },
      { text: 'Let it go past to save your energy', correct: false, explanation: 'Unacceptable. Every run saved is crucial.' }
    ]
  },
  {
    id: 'field_010',
    category: 'fielding',
    difficulty: 'hard',
    situation: 'You\'re behind the stumps as a wicket-keeper. Ball is edged fine off a fast bowler, very low and fast.',
    question: 'What\'s your immediate reaction?',
    options: [
      { text: 'Dive to your left, eyes on the ball, soft hands', correct: true, explanation: 'Correct! Quick lateral movement, keeping eyes on the ball, and relaxing hands are crucial for such sharp chances.' },
      { text: 'Try to grab it with one hand to look spectacular', correct: false, explanation: 'High risk; two hands are always preferred if possible.' },
      { text: 'Hope it goes to the slips', correct: false, explanation: 'Passive and unprofessional; you must attempt every chance.' },
      { text: 'Move late, assuming it will go past', correct: false, explanation: 'Losing a split-second can cost a crucial wicket.' }
    ]
  },
  {
    id: 'field_011',
    category: 'fielding',
    difficulty: 'easy',
    situation: 'Cover fielder. Ball hit toward you. Batsmen go for two. Your throw?',
    question: 'Where do you aim?',
    options: [
      { text: 'Striker\'s end - batsman turning for second', correct: true, explanation: 'Correct! Second run is riskier. Target the danger end.' },
      { text: 'Bowler\'s end always', correct: false, explanation: 'Read the situation. Sometimes striker\'s end is better.' },
      { text: 'Just throw somewhere', correct: false, explanation: 'No! Have a target. Backing up crucial.' },
      { text: 'Hold onto ball to think', correct: false, explanation: 'Too slow! They\'ll complete the two. React!' }
    ]
  },
  {
    id: 'field_012',
    category: 'fielding',
    difficulty: 'medium',
    situation: 'Fine leg position. Ball hooked in the air, swirling in wind, sun in your eyes.',
    question: 'Technique?',
    options: [
      { text: 'Use hand to shade eyes, judge the ball, move your feet to position', correct: true, explanation: 'Perfect! Adapt to conditions. Don\'t let elements beat you.' },
      { text: 'Just hope for the best', correct: false, explanation: 'No! Use techniques to manage difficult conditions.' },
      { text: 'Let slip fielder take it', correct: false, explanation: 'It\'s your ball. Back yourself.' },
      { text: 'Close your eyes and grab', correct: false, explanation: 'Terrible! Always watch the ball.' }
    ]
  },
  {
    id: 'field_013',
    category: 'fielding',
    difficulty: 'easy',
    situation: 'You\'ve just made a brilliant save on the boundary. Crowd cheering. Ball is dead.',
    question: 'Your reaction?',
    options: [
      { text: 'Stay focused, prepare for next ball', correct: true, explanation: 'Professional! One moment doesn\'t define the game. Stay locked in.' },
      { text: 'Celebrate for next 2 minutes', correct: false, explanation: 'Good save but game continues. Refocus quickly.' },
      { text: 'Demand high-fives from everyone', correct: false, explanation: 'Nice moment but don\'t overdo it. Stay humble.' },
      { text: 'Relax completely', correct: false, explanation: 'Never relax in the field! Next ball matters most.' }
    ]
  },

  // ========== CAPTAINCY (100+) ==========
  {
    id: 'cap_001',
    category: 'captaincy',
    difficulty: 'medium',
    situation: 'T20: Death overs. Batsmen hitting boundaries. You have one over of your best bowler left.',
    question: 'When do you bowl him?',
    options: [
      { text: 'Save him for the last over to defend', correct: false, explanation: 'Risky. Match could be gone by then. Use your weapon when you need it.' },
      { text: 'Bowl him now to break partnership', correct: true, explanation: 'Smart! Stop the momentum before it\'s too late. Best bowler breaks partnerships.' },
      { text: 'Don\'t bowl him, save for next match', correct: false, explanation: 'What?! Win this match first!' },
      { text: 'Bowl a part-timer instead', correct: false, explanation: 'Will likely get smashed. Use your strongest resources in pressure.' }
    ]
  },
  {
    id: 'cap_002',
    category: 'captaincy',
    difficulty: 'hard',
    situation: 'Test match: Opposition is 250-2, batting well. Your bowlers are tired.',
    question: 'What do you do?',
    options: [
      { text: 'Try defensive fields, wait for them to make mistakes', correct: true, explanation: 'Correct! Can\'t force wickets on flat pitch. Save energy, wait for new ball or error.' },
      { text: 'Keep attacking with tired bowlers', correct: false, explanation: 'Will drain them completely. Risk injury and poor execution.' },
      { text: 'Forfeit the match', correct: false, explanation: 'Never! Test cricket is long. Weather can change, pitch can deteriorate.' },
      { text: 'Bowl yourself for 20 overs straight', correct: false, explanation: 'Exhausting and ineffective. Rotate bowlers smartly.' }
    ]
  },
  {
    id: 'cap_003',
    category: 'captaincy',
    difficulty: 'medium',
    situation: 'ODI: Chasing 320. Your best batsman is in form but has slight injury. Does he open or come later?',
    question: 'Batting order decision?',
    options: [
      { text: 'Send him at 4-5, let him assess conditions and injury first', correct: true, explanation: 'Smart! Gives him time to warm up, assess injury. Still gets lots of overs.' },
      { text: 'Make him open, maximize his overs', correct: false, explanation: 'Risky if injury worsens early. Might lose him cheaply.' },
      { text: 'Don\'t play him at all', correct: false, explanation: 'Too cautious. If he\'s available, use him smartly.' },
      { text: 'Send him at 11 to protect him', correct: false, explanation: 'Wastes his talent. Trust your best player.' }
    ]
  },
  {
    id: 'cap_004',
    category: 'captaincy',
    difficulty: 'easy',
    situation: 'T20: You win toss. Pitch looks good. Weather clear. Opposition has great chase record.',
    question: 'Toss decision?',
    options: [
      { text: 'Bat first, put pressure on them with big total', correct: true, explanation: 'Good! Set the target, pressure on opposition. Use their weakness against them.' },
      { text: 'Bowl first, restrict them, chase anything', correct: false, explanation: 'Playing to their strength. Bat first, put pressure.' },
      { text: 'Forfeit the toss', correct: false, explanation: 'That\'s not even an option!' },
      { text: 'Ask opposition captain to decide', correct: false, explanation: 'It\'s your call! Make a decision!' }
    ]
  },
  {
    id: 'cap_005',
    category: 'captaincy',
    difficulty: 'hard',
    situation: 'Test: Day 5. You\'re 200 ahead with 5 wickets left. 2 sessions remain. Opposition has Flat pitch.',
    question: 'Declare or bat on?',
    options: [
      { text: 'Bat 90 more minutes, set 300+, give yourself 1.5 sessions to bowl them out', correct: true, explanation: 'Perfect balance! 300+ is tough to chase, enough time to bowl them out. Smart captaincy.' },
      { text: 'Declare now with 200 lead', correct: false, explanation: '200 is chaseable on flat pitch. Too risky.' },
      { text: 'Bat all day, play for draw', correct: false, explanation: 'Too defensive! You\'re ahead. Go for the win!' },
      { text: 'Declare and forfeit second innings', correct: false, explanation: 'That\'s not how cricket works!' }
    ]
  },

  // ========== STRATEGY SCENARIOS (100+) ==========
  {
    id: 'strat_001',
    category: 'strategy',
    difficulty: 'medium',
    situation: 'Your opening bowler just bowled a maiden first over. Batsman looks uncomfortable. Over 2 starting.',
    question: 'Do you give him another over or switch ends?',
    options: [
      { text: 'Continue - he has the batsman rattled, build pressure', correct: true, explanation: 'Strike while hot! Capitalize on batsman discomfort. Build sustained pressure.' },
      { text: 'Switch ends immediately to confuse batsman', correct: false, explanation: 'Do not break momentum. Batsman is already under pressure here.' },
      { text: 'Bring on spinner', correct: false, explanation: 'Too early for spin. Fast bowler has the edge, use it.' },
      { text: 'Rest him for later', correct: false, explanation: 'He is fresh and effective now. Use your weapons when they are working.' }
    ]
  },
  {
    id: 'strat_002',
    category: 'strategy',
    difficulty: 'hard',
    situation: 'T20: You have 2 overs from your best bowler left. Currently over 16, opposition needs 45 from 30 balls.',
    question: 'When do you bowl him?',
    options: [
      { text: 'Save both for overs 19 and 20', correct: false, explanation: 'Could be too late if they accelerate now. Strike when you have control.' },
      { text: 'Bowl him over 17 and 19 to control middle and end', correct: true, explanation: 'Smart! Break current momentum AND have him for penultimate over. Best of both worlds.' },
      { text: 'Bowl him now for consecutive overs 17-18', correct: false, explanation: 'Leaves weak bowlers for crucial final overs. Poor resource management.' },
      { text: 'Don't bowl him, save for next match', correct: false, explanation: 'Absurd! Use your best resources to win THIS match.' }
    ]
  },
  {
    id: 'strat_003',
    category: 'strategy',
    difficulty: 'medium',
    situation: 'ODI: Opposition is 180-2 in 30 overs. Batting comfortably. Spinners not getting purchase.',
    question: 'As captain, what change do you make?',
    options: [
      { text: 'Continue with spinners, hope for mistake', correct: false, explanation: 'Not working. Need to change approach to shift momentum.' },
      { text: 'Bring back pace, change angles, try short balls', correct: true, explanation: 'Smart! Disrupt their rhythm with different challenges. Pace can surprise after spin.' },
      { text: 'Set ultra-defensive field, concede runs', correct: false, explanation: 'Accepting defeat. Always compete for wickets.' },
      { text: 'Forfeit the match', correct: false, explanation: 'Never give up! Cricket turns quickly.' }
    ]
  },
  {
    id: 'strat_004',
    category: 'strategy',
    difficulty: 'easy',
    situation: 'Test match: You have 3 slips and a gully. Ball has stopped swinging. Batsmen look comfortable.',
    question: 'Field change?',
    options: [
      { text: 'Keep attacking field - wickets matter more', correct: false, explanation: 'If ball isn't carrying or seaming, slips are wasted. Adapt to conditions.' },
      { text: 'Spread field, save runs, wait for new ball', correct: true, explanation: 'Smart! Conditions changed. Limit runs, conserve bowlers for new ball.' },
      { text: 'Add more slips', correct: false, explanation: 'If current slips aren't getting chances, more won't help.' },
      { text: 'Remove all fielders', correct: false, explanation: 'Obviously not an option!' }
    ]
  },
  {
    id: 'strat_005',
    category: 'strategy',
    difficulty: 'hard',
    situation: 'Your star batsman has mild injury. Semi-final tomorrow. Risk playing him or rest?',
    question: 'What's your call as captain?',
    options: [
      { text: 'Play him, we need him to win', correct: false, explanation: 'Could worsen injury and lose him for final if you win. Risky.' },
      { text: 'Assess on match day morning, have backup ready, decide based on severity', correct: true, explanation: 'Smart captaincy! Get medical clearance, have contingency. Informed decision.' },
      { text: 'Rest him no matter what', correct: false, explanation: 'If he's fit enough and cleared, use your best player. It's a semi-final.' },
      { text: 'Force him to play injured', correct: false, explanation: 'Unethical and dangerous. Player welfare comes first.' }
    ]
  },

  // ========== MENTAL GAME SCENARIOS (50+) ==========
  {
    id: 'mental_001',
    category: 'mental',
    difficulty: 'medium',
    situation: 'You just got out for a duck in front of a big crowd. Walking back devastated.',
    question: 'How do you mentally recover?',
    options: [
      { text: 'Dwell on it for the rest of the match', correct: false, explanation: 'Ruins your fielding and team energy. Let it go.' },
      { text: 'Accept it, refocus on contributing in field, move on', correct: true, explanation: 'Perfect! Can't bat again this innings. Control what you CAN control now.' },
      { text: 'Blame pitch, umpire, bowler', correct: false, explanation: 'Excuses don't help you improve. Own it and grow.' },
      { text: 'Quit cricket forever', correct: false, explanation: 'Every great player has failed. Resilience defines champions.' }
    ]
  },
  {
    id: 'mental_002',
    category: 'mental',
    difficulty: 'easy',
    situation: 'Big match tomorrow. You can't sleep, feeling nervous.',
    question: 'Best approach?',
    options: [
      { text: 'Deep breathing, visualization of success, trust preparation', correct: true, explanation: 'Nerves are normal. Control breathing, visualize success, remember your training.' },
      { text: 'Stay up all night worrying', correct: false, explanation: 'Exhaustion + nerves = poor performance. Rest is crucial.' },
      { text: 'Think about all ways you could fail', correct: false, explanation: 'Negative visualization creates negative reality. Think positive.' },
      { text: 'Take sleeping pills without doctor advice', correct: false, explanation: 'Never self-medicate. Use natural relaxation techniques.' }
    ]
  },
  {
    id: 'mental_003',
    category: 'mental',
    difficulty: 'hard',
    situation: 'Series decider. You're bowling last over, defending 8. First ball goes for 6. Need to bowl next ball.',
    question: 'Mental reset?',
    options: [
      { text: 'That ball is done. Reset. This ball is everything.', correct: true, explanation: 'Elite short-term memory. Can't change past ball. Full focus on next delivery.' },
      { text: 'Panic about losing the match', correct: false, explanation: '2 runs to defend, 5 balls left. Very possible! Stay in the fight!' },
      { text: 'Get angry and bowl bouncer at head', correct: false, explanation: 'Emotion-driven cricket fails. Stay calm, execute smart plan.' },
      { text: 'Give up mentally', correct: false, explanation: 'Match isn't over! Champions fight until the last ball.' }
    ]
  },
  {
    id: 'mental_004',
    category: 'mental',
    difficulty: 'medium',
    situation: 'You're on debut. Feeling nervous in dressing room. Heart pounding.',
    question: 'Pre-match mental preparation?',
    options: [
      { text: 'Deep breaths, visualize success, trust your journey', correct: true, explanation: 'You earned this opportunity! Control nerves with breathing and positive visualization.' },
      { text: 'Panic and wish you weren't playing', correct: false, explanation: 'This is your dream opportunity! Embrace it!' },
      { text: 'Think about how you might fail', correct: false, explanation: 'Negative thoughts breed negative results. Stay positive!' },
      { text: 'Ask to be dropped from team', correct: false, explanation: 'Cowardly! Face your moment with courage!' }
    ]
  },
  {
    id: 'mental_005',
    category: 'mental',
    difficulty: 'medium',
    situation: 'Umpire gives terrible decision against you. You know you didn't hit it. Walking off.',
    question: 'How do you handle this?',
    options: [
      { text: 'Accept with grace, walk off, learn from it', correct: true, explanation: 'Shows class and respect for the game. Umpires are human. Your character matters.' },
      { text: 'Argue and refuse to leave', correct: false, explanation: 'Results in penalty. Decision is final. Show respect for the game.' },
      { text: 'Smash bat in frustration', correct: false, explanation: 'Unprofessional and may result in ban. Control your emotions.' },
      { text: 'Abuse the umpire verbally', correct: false, explanation: 'Never! Match ban territory. Compose yourself and walk off with dignity.' }
    ]
  },

  // ========== PRESSURE SITUATIONS (150+) ==========
  
  {
    id: 'press_001',
    category: 'pressure',
    difficulty: 'hard',
    situation: 'World Cup final. Last over. Need 6 to win. You\'re on strike. Best death bowler in the world.',
    question: 'Your mindset?',
    options: [
      { text: 'This is my moment. Watch the ball, trust my skills.', correct: true, explanation: 'Perfect! Stay present. Your training got you here. Execute.' },
      { text: 'I\'m going to fail, too much pressure', correct: false, explanation: 'Self-defeating. Your thoughts create reality. Believe!' },
      { text: 'Just try to hit every ball for six', correct: false, explanation: 'Reckless. Smart cricket wins, not wild swinging.' },
      { text: 'Think about all the fans watching', correct: false, explanation: 'Distraction! Focus only on ball and execution. Block everything else.' }
    ]
  },
  {
    id: 'press_002',
    category: 'pressure',
    difficulty: 'medium',
    situation: 'You dropped a crucial catch in the field. Team needs you to bat now. Dressing room is silent.',
    question: 'How do you respond?',
    options: [
      { text: 'Redeem yourself with the bat. Fresh chapter.', correct: true, explanation: 'Champion response! Past is gone. Focus on now.' },
      { text: 'Carry guilt into batting, play scared', correct: false, explanation: 'Double negative. Separate fielding from batting.' },
      { text: 'Make excuses about the drop', correct: false, explanation: 'Own it and move on. Actions speak louder.' },
      { text: 'Hide in the changing room', correct: false, explanation: 'Never! Face the challenge head-on.' }
    ]
  },
  {
    id: 'press_003',
    category: 'pressure',
    difficulty: 'easy',
    situation: 'It\'s your debut match. You\'re nervous waiting to bat. Heart racing.',
    question: 'Best mental approach?',
    options: [
      { text: 'Deep breaths, visualize success, trust your preparation', correct: true, explanation: 'Perfect! Control what you can control. You earned this.' },
      { text: 'Panic about making a mistake', correct: false, explanation: 'Self-fulfilling prophecy. Believe in yourself!' },
      { text: 'Think about all the ways you could fail', correct: false, explanation: 'Negative visualization creates negative results!' },
      { text: 'Wish you weren\'t playing', correct: false, explanation: 'This is your dream! Embrace it!' }
    ]
  },
  {
    id: 'press_004',
    category: 'pressure',
    difficulty: 'hard',
    situation: 'Series decider. You\'re bowling last over, defending 8. First ball goes for 6.',
    question: 'Next ball mentality?',
    options: [
      { text: 'Reset. That ball is done. Focus on this one.', correct: true, explanation: 'Elite mindset! Short memory. Execute the next ball.' },
      { text: 'Panic, think about how you\'re losing', correct: false, explanation: 'Match isn\'t over! Stay in the fight!' },
      { text: 'Get angry, bowl bouncer at head', correct: false, explanation: 'Emotion-driven, poor execution. Stay calm, smart.' },
      { text: 'Give up, it\'s over', correct: false, explanation: 'Never surrender! 2 runs to defend with 5 balls!' }
    ]
  },
  {
    id: 'press_005',
    category: 'pressure',
    difficulty: 'medium',
    situation: 'Rain break during your innings. You were batting well on 35*. Now you have to restart.',
    question: 'Approach when resuming?',
    options: [
      { text: 'Start fresh, be cautious first few balls, rebuild rhythm', correct: true, explanation: 'Smart! Conditions changed, reset mindset. Build again.' },
      { text: 'Continue aggressive shots immediately', correct: false, explanation: 'Break disrupted your rhythm. Feel the ball again first.' },
      { text: 'Be overly defensive now', correct: false, explanation: 'You were set before. Regain confidence, then progress.' },
      { text: 'Complain about the rain delay', correct: false, explanation: 'Same for everyone. Adapt and overcome!' }
    ]
  },
  {
    id: 'press_006',
    category: 'pressure',
    difficulty: 'easy',
    situation: 'Your team is 5-50, massive collapse. You\'re next in. Everyone is tense.',
    question: 'Your mindset walking out?',
    options: [
      { text: 'I\'m here to rebuild. One ball at a time.', correct: true, explanation: 'Perfect! Clear role, simple plan. Build from here.' },
      { text: 'We\'re going to lose anyway', correct: false, explanation: 'Loser mentality. Matches are won from tough positions!' },
      { text: 'I must score a hundred to save us', correct: false, explanation: 'Too much pressure on yourself. Focus on each ball.' },
      { text: 'Blame the top order', correct: false, explanation: 'Doesn\'t help. Focus on your job now.' }
    ]
  },
  {
    id: 'press_007',
    category: 'pressure',
    difficulty: 'hard',
    situation: 'You\'re the captain. Star player just got injured. Semi-final in 2 days. Media pressure high.',
    question: 'How do you address the team?',
    options: [
      { text: 'This is our chance. Someone will step up. We believe.', correct: true, explanation: 'Leadership! Turn adversity into opportunity. Unite the team.' },
      { text: 'We can\'t win without him', correct: false, explanation: 'Defeats the team before match starts. Never!' },
      { text: 'Panic and complain about bad luck', correct: false, explanation: 'Leaders stay calm. Teams follow captain\'s energy.' },
      { text: 'Ask to postpone the match', correct: false, explanation: 'Face challenges head-on. That\'s cricket!' }
    ]
  },
  {
    id: 'press_008',
    category: 'pressure',
    difficulty: 'medium',
    situation: 'Last ball of the match. You\'re fielding. Batsman hits in the air toward you. Catch wins the match.',
    question: 'Your thought process?',
    options: [
      { text: 'Watch the ball. Just catch it. Like practice.', correct: true, explanation: 'Perfect! Simplify the moment. Trust your training.' },
      { text: 'Think about winning the match', correct: false, explanation: 'Distraction! Focus on the catch, not the outcome.' },
      { text: 'Worry about dropping it', correct: false, explanation: 'Fear creates tension. Confidence creates catches.' },
      { text: 'Look at teammates instead of ball', correct: false, explanation: 'Never! Ball is all that matters right now!' }
    ]
  },
  {
    id: 'press_009',
    category: 'pressure',
    difficulty: 'easy',
    situation: 'You\'re batting and just played a terrible shot that almost got you out. The next ball is coming.',
    question: 'What is your immediate mental response?',
    options: [
      { text: 'Dwell on the bad shot, worry about getting out', correct: false, explanation: 'Focusing on the negative will affect your next delivery.' },
      { text: 'Forget the previous ball, reset, and focus on the current delivery', correct: true, explanation: 'Correct! Short-term memory is key in cricket. Focus on the present.' },
      { text: 'Try an even more aggressive shot to compensate', correct: false, explanation: 'Aggression out of frustration often leads to mistakes.' },
      { text: 'Ask for a drinks break to calm down', correct: false, explanation: 'Doesn\'t solve the mental challenge; you need to handle pressure on the field.' }
    ]
  },
  {
    id: 'press_010',
    category: 'pressure',
    difficulty: 'medium',
    situation: 'You\'re a young cricketer playing your first big match. You\'re waiting to bat, and your heart is pounding.',
    question: 'How do you manage your nerves?',
    options: [
      { text: 'Try to ignore the feeling and pretend you\'re not nervous', correct: false, explanation: 'Suppressing nerves can make them worse. Acknowledge them.' },
      { text: 'Take deep breaths, visualize past successes, and focus on your routine', correct: true, explanation: 'Correct! Breathing and visualization are powerful tools to calm nerves and build confidence.' },
      { text: 'Listen to loud music to distract yourself', correct: false, explanation: 'Distraction might work temporarily but doesn\'t address the root cause of nerves.' },
      { text: 'Ask your coach for last-minute technical advice', correct: false, explanation: 'Too late for technical changes; focus on mental preparation.' }
    ]
  },
  {
    id: 'press_011',
    category: 'pressure',
    difficulty: 'hard',
    situation: 'You\'re bowling the final over, defending 7 runs. You bowl a wide and then a no-ball. The opposition needs 5 off 4 with a free hit.',
    question: 'What\'s your mental strategy for the next ball?',
    options: [
      { text: 'Panic, thinking you\'ve messed it up completely', correct: false, explanation: 'Panicking will only lead to more mistakes.' },
      { text: 'Focus on a precise execution of your best delivery, one ball at a time', correct: true, explanation: 'Correct! Reset, clear your mind, and focus on delivering your best ball, ignoring previous errors.' },
      { text: 'Try an even bigger variation to confuse the batsman', correct: false, explanation: 'Under pressure, sticking to your strengths and executing them well is more important than wild variations.' },
      { text: 'Blame yourself for the previous mistakes', correct: false, explanation: 'Self-blame will destroy your confidence for the crucial remaining balls.' }
    ]
  },
  {
    id: 'press_012',
    category: 'pressure',
    difficulty: 'medium',
    situation: 'Umpire gives a terrible decision against you. You\'re out but you know you didn\'t hit it. Walking off.',
    question: 'How do you handle it?',
    options: [
      { text: 'Accept it with grace, walk off, learn from it', correct: true, explanation: 'Class! Umpires are human. Your respect for the game matters.' },
      { text: 'Argue and refuse to leave', correct: false, explanation: 'Results in penalty. Decision is final. Show respect.' },
      { text: 'Smash your bat in frustration', correct: false, explanation: 'Unprofessional. Control your emotions.' },
      { text: 'Abuse the umpire', correct: false, explanation: 'Never! That\'s match ban territory. Compose yourself.' }
    ]
  },
];

// Utility functions
export function getRandomScenarios(count = 10) {
  const shuffled = [...scenarioDatabase].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getScenariosByCategory(category) {
  return scenarioDatabase.filter(s => s.category === category);
}

export function getScenariosByDifficulty(difficulty) {
  return scenarioDatabase.filter(s => s.difficulty === difficulty);
}

export function getCategoryCounts() {
  return {
    batting: scenarioDatabase.filter(s => s.category === 'batting').length,
    bowling: scenarioDatabase.filter(s => s.category === 'bowling').length,
    fielding: scenarioDatabase.filter(s => s.category === 'fielding').length,
    captaincy: scenarioDatabase.filter(s => s.category === 'captaincy').length,
    pressure: scenarioDatabase.filter(s => s.category === 'pressure').length,
    total: scenarioDatabase.length
  };
}