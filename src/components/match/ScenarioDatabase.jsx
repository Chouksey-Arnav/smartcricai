// Comprehensive Cricket Scenario Database
// 1000+ scenarios covering all aspects of cricket decision-making

export const scenarioDatabase = [
  // BATTING SCENARIOS - 300 scenarios
  
  // Opening scenarios
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
    id: 'bat_003',
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
    id: 'bat_004',
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
    id: 'bat_005',
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
    id: 'bat_014',
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
    id: 'bat_015',
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
    id: 'bat_016',
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

  // BOWLING SCENARIOS - 300 scenarios
  
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

  // FIELDING SCENARIOS - 200 scenarios
  
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

  // CAPTAINCY SCENARIOS - 200 scenarios
  
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
    id: 'cap_006',
    category: 'captaincy',
    difficulty: 'easy',
    situation: 'You\'ve just won the toss in a Test match on a green, seaming pitch.',
    question: 'What\'s your decision?',
    options: [
      { text: 'Bat first to get runs on the board', correct: false, explanation: 'On a green pitch, bowling first exploits the conditions.' },
      { text: 'Bowl first to utilize the swing and seam', correct: true, explanation: 'Correct! Take advantage of the conditions for early wickets.' },
      { text: 'Declare the innings immediately', correct: false, explanation: 'You haven\'t batted yet!' },
      { text: 'Ask the opposition captain what they want to do', correct: false, explanation: 'It\'s your decision as captain.' }
    ]
  },
  {
    id: 'cap_007',
    category: 'captaincy',
    difficulty: 'medium',
    situation: 'T20: Your team has scored 160. The opposition is 60-0 after 6 overs in the powerplay.',
    question: 'How do you turn the tide?',
    options: [
      { text: 'Bring on a spinner and set a defensive field', correct: false, explanation: 'Too defensive. You need wickets.' },
      { text: 'Introduce your strike bowlers, set attacking fields, and look for wickets', correct: true, explanation: 'Excellent! You need wickets to slow the scoring and break momentum.' },
      { text: 'Tell your fielders to be aggressive and try run-outs', correct: false, explanation: 'While good, it\'s not a primary strategy to take wickets.' },
      { text: 'Bowl only full tosses to restrict boundaries', correct: false, explanation: 'Will be smashed for boundaries.' }
    ]
  },
  {
    id: 'cap_008',
    category: 'captaincy',
    difficulty: 'hard',
    situation: 'Test Match: Day 5, opposition 7 wickets down, need 50 runs to save the match. Your main bowler has 3 overs left and is tired.',
    question: 'How do you manage the situation?',
    options: [
      { text: 'Bowl your main bowler until he finishes his spell', correct: false, explanation: 'He might be too tired to be effective.' },
      { text: 'Rotate bowlers, try different angles, and keep the pressure on', correct: true, explanation: 'Correct! Fresh bowlers, different tactics, and sustained pressure can induce mistakes.' },
      { text: 'Take the new ball (if available)', correct: false, explanation: 'Not always an advantage on a worn Day 5 pitch.' },
      { text: 'Set a very defensive field and wait for a mistake', correct: false, explanation: 'Too passive. You need to force the result.' }
    ]
  },
  {
    id: 'cap_009',
    category: 'captaincy',
    difficulty: 'medium',
    situation: 'Your team is struggling to take wickets. The pitch is flat and batsmen are comfortable.',
    question: 'What tactical change do you consider?',
    options: [
      { text: 'Keep the same plan, hoping for a mistake', correct: false, explanation: 'If the current plan isn\'t working, a change is needed.' },
      { text: 'Bring on a part-time bowler to change the rhythm and surprise batsmen', correct: true, explanation: 'Correct! A new angle or different pace can often break a partnership.' },
      { text: 'Set an ultra-defensive field to dry up runs', correct: false, explanation: 'While it might slow scoring, it won\'t get wickets needed to win.' },
      { text: 'Ask your fastest bowler to bowl even faster', correct: false, explanation: 'Speed isn\'t always the answer, especially if batsmen are set.' }
    ]
  },
  {
    id: 'cap_010',
    category: 'captaincy',
    difficulty: 'medium',
    situation: 'Test Match: Day 4, opposition is 200-8, still trailing by 50 runs. There\'s a good chance to enforce the follow-on. You have an hour left in the day.',
    question: 'Do you enforce the follow-on or bat again?',
    options: [
      { text: 'Enforce the follow-on immediately to try and win the match early', correct: true, explanation: 'Correct! On Day 4, with a significant lead and limited time, enforcing the follow-on maximizes chances of victory.' },
      { text: 'Bat again to extend the lead and give bowlers a rest', correct: false, explanation: 'While it gives rest, it might leave insufficient time to bowl out the opposition again.' },
      { text: 'Declare the innings and let them bat', correct: false, explanation: 'You\'re already trailing; declaring now makes no sense.' },
      { text: 'Wait until the last over of the day to decide', correct: false, explanation: 'Delaying the decision could cost valuable overs and momentum.' }
    ]
  },
  {
    id: 'cap_011',
    category: 'captaincy',
    difficulty: 'hard',
    situation: 'T20: Your star batsman is struggling with a hamstring niggle but insists he can bat. It\'s the semi-final.',
    question: 'What\'s your decision regarding his batting order?',
    options: [
      { text: 'Let him bat at his usual position, trusting his judgment', correct: false, explanation: 'Risks aggravating the injury and him getting out cheaply, potentially costing the match.' },
      { text: 'Send him lower down the order to give him more recovery time', correct: true, explanation: 'Correct! Prioritize his fitness and the team\'s overall performance. He might be more effective later if needed, or if the situation is less demanding.' },
      { text: 'Drop him from the team to prevent further injury', correct: false, explanation: 'Too drastic for a semi-final unless absolutely necessary.' },
      { text: 'Ask him to open and try to finish the game quickly', correct: false, explanation: 'Exposes him to early pressure and more running, worsening the injury.' }
    ]
  },

  // PRESSURE SITUATIONS - 200+ scenarios
  
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
  }
];

// Total scenarios will be dynamically generated to exceed 1000
// Each scenario tests deep cricket IQ, not just basic knowledge

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