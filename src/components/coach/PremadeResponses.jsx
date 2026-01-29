// Pre-made responses to reduce AI integration credits
export const PREMADE_RESPONSES = {
  greetings: {
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'what\'s up', 'whats up', 'sup'],
    responses: [
      "Hey champ! 👋 Ready to level up your cricket game? What would you like to work on today?",
      "Hello! Great to see you! 🏏 What's on your mind today?",
      "Hey there, superstar! 🌟 Let's make today count. What can I help you with?",
      "Hi! 💪 Ready to smash some goals? Tell me what you want to improve!",
      "Welcome back, champion! 🏆 How can I help you get better today?"
    ]
  },
  
  thanks: {
    patterns: ['thank you', 'thanks', 'thx', 'thank u', 'appreciate', 'cheers'],
    responses: [
      "You're very welcome! Keep up the hard work! 💪",
      "Anytime, champ! That's what I'm here for! 🏏",
      "Glad I could help! Now go out there and show them what you've got! 🔥",
      "My pleasure! Keep that cricket spirit alive! 🌟",
      "No problem at all! Remember, practice makes perfect! ⚡"
    ]
  },
  
  goodbye: {
    patterns: ['bye', 'goodbye', 'see you', 'see ya', 'later', 'gotta go', 'catch you later'],
    responses: [
      "See you later, champ! Keep practicing! 🏏",
      "Catch you later! Remember to stay consistent! 💪",
      "Bye! Can't wait to see your progress next time! 🌟",
      "Later, superstar! Keep that practice streak going! 🔥",
      "See you soon! Keep working hard! ⚡"
    ]
  },
  
  batting_basics: {
    patterns: ['how to bat', 'batting tips', 'improve batting', 'batting technique', 'better batsman', 'batting practice'],
    responses: [
      "Great question! 🏏 For batting: 1) Keep your head still and eyes level, 2) Transfer weight smoothly, 3) Watch the ball onto the bat. Try shadow batting for 10 minutes daily!",
      "Batting tip! 💪 Focus on your grip first - not too tight! Then work on your stance and footwork. Practice against a wall with a tennis ball to sharpen your reflexes!",
      "To improve batting: Start with the basics - proper stance, head position, and balance. Practice defensive shots before attacking ones. Want me to recommend a specific drill?",
      "Key batting fundamentals: 1) Balanced stance, 2) High elbow, 3) Straight bat for defense. Practice your forward and backward defense 20 times daily!"
    ]
  },
  
  bowling_basics: {
    patterns: ['how to bowl', 'bowling tips', 'improve bowling', 'bowl faster', 'bowling technique', 'better bowler'],
    responses: [
      "Bowling tip! ⚡ Focus on your run-up rhythm, a strong front arm, and releasing the ball at the right moment. Practice your action in slow motion first!",
      "To bowl better: 1) Work on your run-up consistency, 2) Keep your bowling arm straight, 3) Follow through completely. Try the target practice drill!",
      "Want to bowl faster? 💨 Build core strength, work on your technique, and practice explosive movements. Consistency beats speed though!",
      "Key bowling tips: Perfect your grip, maintain a smooth run-up, and aim for consistency. Practice bowling at a single stump to improve accuracy!"
    ]
  },
  
  fielding_basics: {
    patterns: ['how to field', 'fielding tips', 'improve fielding', 'catching', 'better fielder', 'fielding practice'],
    responses: [
      "Fielding essentials! 🧤 1) Stay alert and on your toes, 2) Watch the ball into your hands, 3) Use soft hands for catching. Practice reaction ball drills!",
      "Great fielders are made through practice! Focus on quick footwork, hand-eye coordination, and anticipation. Try catching a tennis ball against a wall!",
      "Fielding tip! 💪 Keep your eyes on the ball always, move your feet quickly, and get your body behind the ball. Practice ground fielding daily!",
      "To improve fielding: Work on your agility, practice diving and sliding, and always back up your teammates. Reaction time is key!"
    ]
  },
  
  mental_game: {
    patterns: ['pressure', 'nervous', 'anxiety', 'focus', 'confidence', 'mental', 'stressed', 'worried'],
    responses: [
      "Mental strength is crucial! 🧠 Try this: Take 5 deep breaths before you play. Visualize success. Remember, everyone gets nervous - it means you care!",
      "Handling pressure? 💪 Focus on what you can control - your preparation and effort. Break the game into small moments. One ball at a time!",
      "Confidence tip! 🌟 Remember your best performances. Stand tall, breathe deeply, and trust your training. You've got this!",
      "Mental game advice: 1) Stay present (focus on NOW), 2) Positive self-talk, 3) Deep breathing when stressed. Want to try our Mental Mode?"
    ]
  },
  
  motivation: {
    patterns: ['give up', 'quit', 'can\'t do', 'too hard', 'impossible', 'demotivated', 'unmotivated'],
    responses: [
      "Hey, every champion has felt this way! 💪 Take a break, but don't give up. Small improvements add up. You're stronger than you think!",
      "Tough times build champions! 🌟 Remember why you started. Every great player faced setbacks. This is just part of your journey to greatness!",
      "I believe in you! 🔥 Progress isn't always linear. Some days are hard, but that's when real growth happens. Keep going, champ!",
      "Don't quit! 🏏 Take it one day at a time. Celebrate small wins. Your future self will thank you for not giving up today!"
    ]
  },
  
  practice_tips: {
    patterns: ['how to practice', 'practice routine', 'training plan', 'how often', 'practice schedule'],
    responses: [
      "Good practice routine: 🏏 Warm-up (10 min), Skill work (30 min), Drills (20 min), Cool down (5 min). Consistency beats intensity!",
      "Practice tip! 💪 Quality over quantity. 30 minutes focused practice beats 2 hours of unfocused work. Set specific goals for each session!",
      "Training plan: Practice 4-5 times per week. Mix batting, bowling, fielding, and fitness. Rest days are important too!",
      "Best practice advice: Have a plan, track your progress, focus on weak areas, and always finish on a positive note!"
    ]
  },
  
  rules_basic: {
    patterns: ['lbw rule', 'what is lbw', 'rules of cricket', 'cricket rules', 'how does cricket work'],
    responses: [
      "LBW (Leg Before Wicket): If the ball hits your leg and would've hit the stumps (and you're not playing a shot outside off), you're out!",
      "Cricket basics: 🏏 Two teams of 11. Batting team scores runs, bowling team takes wickets. Most runs wins! There's way more detail, but that's the core!",
      "Basic cricket rule: The ball must bounce once before the batsman. Six runs if it goes over the boundary without bouncing, four if it bounces first!",
      "Want to learn cricket rules? Start with the basics: runs, wickets, overs. The detailed rules come with time and experience!"
    ]
  },
  
  encouragement: {
    patterns: ['failed', 'made mistake', 'messed up', 'bad performance', 'disappointed', 'lost'],
    responses: [
      "Every champion fails sometimes! 💪 Learn from it and come back stronger. This setback is setting you up for a comeback!",
      "Mistakes are proof you're trying! 🌟 Analyze what went wrong, adjust, and go again. Growth happens outside your comfort zone!",
      "It's okay to have bad days! 🏏 Even the pros struggle. What matters is how you respond. Dust yourself off and keep going!",
      "One bad performance doesn't define you! 🔥 Use this as fuel. Champions aren't made on good days, they're made on days like this!"
    ]
  },
  
  features: {
    patterns: ['what can you do', 'help me', 'features', 'how to use', 'what do you offer'],
    responses: [
      "I can help with: 🏏 Batting, bowling, fielding tips | 💪 Training advice | 🧠 Mental game | 📊 Drill recommendations | 🎯 Performance tracking. What interests you?",
      "Here's what I offer: Cricket coaching tips, personalized drill suggestions, mental game advice, and motivation! Try asking about batting, bowling, or fielding!",
      "I'm here to help you improve! 🌟 Ask me about techniques, drills, mental preparation, or practice plans. I can also track your progress!",
      "Features: AI coaching, custom drills, mental training, performance analytics, and 24/7 support! What would you like to explore?"
    ]
  }
};

export function findPremadeResponse(userInput) {
  const input = userInput.toLowerCase().trim();
  
  // Check each category
  for (const [category, data] of Object.entries(PREMADE_RESPONSES)) {
    // Check if any pattern matches
    const matchesPattern = data.patterns.some(pattern => 
      input.includes(pattern) || pattern.includes(input)
    );
    
    if (matchesPattern) {
      // Return random response from this category
      const responses = data.responses;
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  return null; // No premade response found
}