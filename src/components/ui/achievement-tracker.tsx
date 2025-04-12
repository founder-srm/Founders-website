import type React from 'react';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAchievementsStore } from '@/stores/achievements';
import { useUser } from '@/stores/session';

export function AchievementTracker({
  children,
}: { children: React.ReactNode }) {
  const { toast } = useToast();
  const pathname = usePathname();
  const unlockAchievement = useAchievementsStore(
    state => state.unlockAchievement
  );
  const hasAchievement = useAchievementsStore(state => state.hasAchievement);
  const user = useUser();

  // Track daily visits
  useEffect(() => {
    if (!user) return;

    // Check if user has account created achievement
    if (!hasAchievement('accountCreated')) {
      unlockAchievement('accountCreated');
      toast({
        title: '🎉 Achievement Unlocked!',
        description: 'Account Created - Welcome to the community!',
        duration: 5000,
      });
    }

    // Check for page-specific achievements
    const checkPageAchievements = () => {
      // Team Explorer achievement
      if (pathname === '/about/team' && !hasAchievement('teamExplorer')) {
        unlockAchievement('teamExplorer');
        toast({
          title: '🎉 Achievement Unlocked!',
          description: 'Team Explorer - You visited our team page',
          duration: 5000,
        });
      }

      // Track other page visits here
      // Add more pathname checks for different achievements
    };

    checkPageAchievements();

    // Track visit streaks
    const checkVisitStreak = () => {
      const visitKey = 'founders-visit-dates';
      const streakKey = 'founders-visit-streak';

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];

      // Get stored visit dates
      const storedDates = localStorage.getItem(visitKey);
      let visitDates: string[] = storedDates ? JSON.parse(storedDates) : [];

      // Get current streak
      const currentStreak = Number.parseInt(
        localStorage.getItem(streakKey) || '0',
        10
      );

      // If we haven't recorded today's visit
      if (!visitDates.includes(today)) {
        // Add today to visit dates
        visitDates.push(today);

        // Keep only last 30 days
        if (visitDates.length > 30) {
          visitDates = visitDates.slice(visitDates.length - 30);
        }

        // Save updated visit dates
        localStorage.setItem(visitKey, JSON.stringify(visitDates));

        // Sort dates to check for continuous streak
        visitDates.sort();

        // Check if today visit continues the streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = currentStreak;

        if (visitDates.includes(yesterdayStr)) {
          // Continue streak
          newStreak = currentStreak + 1;
        } else {
          // Reset streak
          newStreak = 1;
        }

        // Save updated streak
        localStorage.setItem(streakKey, newStreak.toString());

        // Check for frequent visitor achievement
        if (newStreak >= 5 && !hasAchievement('frequent5')) {
          unlockAchievement('frequent5');
          toast({
            title: '🔥 Achievement Unlocked!',
            description: 'Frequent Visitor - Visited 5 days in a row',
            duration: 5000,
          });
        }
      }
    };

    checkVisitStreak();
  }, [pathname, unlockAchievement, hasAchievement, toast, user]);

  return <>{children}</>;
}
