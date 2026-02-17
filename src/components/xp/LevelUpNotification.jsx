import { useEffect, useState } from 'react';
import { calculateLevelInfo } from './LevelSystemData';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export default function LevelUpNotification({ totalXP }) {
  const [lastLevel, setLastLevel] = useState(null);

  useEffect(() => {
    if (!totalXP) return;

    const currentLevelInfo = calculateLevelInfo(totalXP);
    const storedLevel = localStorage.getItem('smartcrick_last_level');
    
    if (storedLevel) {
      const previousLevel = parseInt(storedLevel);
      
      if (currentLevelInfo.currentLevel > previousLevel) {
        // Level up!
        setLastLevel(currentLevelInfo.currentLevel);
        localStorage.setItem('smartcrick_last_level', currentLevelInfo.currentLevel.toString());
        
        // Show notification
        toast.success(currentLevelInfo.notification, {
          duration: 6000,
          icon: '🎉',
          style: {
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            color: 'white',
            fontWeight: 'bold',
            padding: '16px',
            borderRadius: '12px'
          }
        });

        // Confetti!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b']
        });
      }
    } else {
      // First time - set initial level
      localStorage.setItem('smartcrick_last_level', currentLevelInfo.currentLevel.toString());
      setLastLevel(currentLevelInfo.currentLevel);
    }
  }, [totalXP]);

  return null; // This component doesn't render anything, just handles notifications
}