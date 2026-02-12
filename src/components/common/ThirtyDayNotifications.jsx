import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 30-Day Challenge Daily Messages - Pre-Saved Database
const thirtyDayMessages = {
  1: "Let's set the tone. Show up and move with purpose.",
  2: "Consistency > intensity. Stay steady.",
  3: "Control your reps. Clean movement wins.",
  4: "Even average days count. Train anyway.",
  5: "Five days strong. That's momentum building.",
  6: "Stay sharp. Small improvements add up.",
  7: "One week complete. Keep stacking wins.",
  8: "Reset. Refocus. Go again.",
  9: "Move fast, but stay controlled.",
  10: "Double digits. That's discipline.",
  11: "Stay patient. Progress isn't loud.",
  12: "Lean into the challenge.",
  13: "Precision over power today.",
  14: "Two weeks. This is becoming a habit.",
  15: "Halfway is coming. Stay locked in.",
  16: "You're building something real now.",
  17: "Keep the standard high.",
  18: "Clean reps. Strong mindset.",
  19: "Push just a little harder today.",
  20: "Twenty days. That's commitment.",
  21: "Discipline is becoming identity.",
  22: "Train smart. Recover well.",
  23: "Stay explosive. Move like an athlete.",
  24: "Details matter. Focus.",
  25: "Five days left. Finish strong.",
  26: "Fatigue fades. Strength stays.",
  27: "Confidence comes from consistency.",
  28: "Finish every rep clean.",
  29: "Almost there. Stay focused.",
  30: "Challenge complete. You leveled up."
};

export default function ThirtyDayNotifications({ user }) {
  const queryClient = useQueryClient();

  const { data: challengeActivity } = useQuery({
    queryKey: ['challengeActivity', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const activities = await base44.entities.ScheduledActivity.filter({ 
        user_email: user.email,
        title: '🔥 30-Day Challenge Started!'
      });
      return activities[0] || null;
    },
    enabled: !!user?.email,
  });

  const { data: existingNotifications = [] } = useQuery({
    queryKey: ['challengeNotifications', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.Notification.filter({ 
        user_email: user.email,
        type: 'achievement'
      });
    },
    enabled: !!user?.email,
  });

  const createNotificationMutation = useMutation({
    mutationFn: async ({ day, title, message }) => {
      await base44.entities.Notification.create({
        user_email: user.email,
        type: 'achievement',
        title,
        message,
        related_id: `challenge_day_${day}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['challengeNotifications'] });
    },
  });

  useEffect(() => {
    if (!challengeActivity || !user?.email) return;

    const startDate = new Date(challengeActivity.date);
    const today = new Date();
    const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const currentDay = daysDiff + 1;

    if (currentDay < 1 || currentDay > 30) return;

    // Check if notification for this day already exists
    const dayNotificationExists = existingNotifications.some(
      n => n.related_id === `challenge_day_${currentDay}`
    );

    if (!dayNotificationExists) {
      const dayMessage = thirtyDayMessages[currentDay];
      const title = `🔥 Day ${currentDay} of 30 - Keep Going!`;
      const message = dayMessage;

      createNotificationMutation.mutate({ day: currentDay, title, message });
    }
  }, [challengeActivity, user, existingNotifications]);

  return null;
}