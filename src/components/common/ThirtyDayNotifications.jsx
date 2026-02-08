import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
      let title, message;

      if (currentDay === 1) {
        title = '🎉 30-Day Challenge Started - Day 1!';
        message = 'Congratulations! Your journey begins today. Stay consistent!';
      } else if (currentDay === 30) {
        title = '🏆 Final Day of Your Challenge!';
        message = 'You\'re nearing the end of your 30-day challenge! Check it out to see how much you\'ve improved!';
      } else if (currentDay === 15) {
        title = '🔥 Halfway There - Day 15!';
        message = 'You\'re halfway through! Keep pushing forward!';
      } else if (currentDay % 7 === 0) {
        title = `✨ Week ${currentDay / 7} Complete - Day ${currentDay}!`;
        message = `Amazing! You've completed ${currentDay / 7} weeks of your challenge!`;
      } else {
        title = `💪 Day ${currentDay} of 30-Day Challenge!`;
        message = `Keep going strong! Day ${currentDay} - you're building incredible habits!`;
      }

      createNotificationMutation.mutate({ day: currentDay, title, message });
    }
  }, [challengeActivity, user, existingNotifications]);

  return null;
}