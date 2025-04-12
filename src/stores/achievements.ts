import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  earned: boolean;
  earnedAt?: Date;
};

interface AchievementsState {
  achievements: Record<string, Achievement>;
  unlockAchievement: (id: string) => void;
  hasAchievement: (id: string) => boolean;
  resetAchievements: () => void;
}

// Define all possible achievements
const defaultAchievements: Record<
  string,
  Omit<Achievement, 'earned' | 'earnedAt'>
> = {
  accountCreated: {
    id: 'accountCreated',
    title: 'Account Created',
    description: 'Joined the platform',
    icon: 'Award',
    iconBg: 'primary',
  },
  eventParticipant: {
    id: 'eventParticipant',
    title: 'Event Participant',
    description: 'Registered for an event',
    icon: 'Calendar',
    iconBg: 'blue',
  },
  githubConnected: {
    id: 'githubConnected',
    title: 'GitHub Connected',
    description: 'Linked GitHub account',
    icon: 'Github',
    iconBg: 'gray',
  },
  googleConnected: {
    id: 'googleConnected',
    title: 'Google Connected',
    description: 'Linked Google account',
    icon: 'GoogleIcon',
    iconBg: 'red',
  },
  // New achievements
  teamExplorer: {
    id: 'teamExplorer',
    title: 'Team Explorer',
    description: 'Visited the team page',
    icon: 'Users',
    iconBg: 'indigo',
  },
  contentCreator: {
    id: 'contentCreator',
    title: 'Content Creator',
    description: 'Created a blog post or article',
    icon: 'PenLine',
    iconBg: 'yellow',
  },
  eventAttendee: {
    id: 'eventAttendee',
    title: 'Event Attendee',
    description: 'Attended an event',
    icon: 'TicketCheck',
    iconBg: 'emerald',
  },
  feedbackProvider: {
    id: 'feedbackProvider',
    title: 'Feedback Provider',
    description: 'Provided feedback on the platform',
    icon: 'MessageSquare',
    iconBg: 'purple',
  },
  frequent5: {
    id: 'frequent5',
    title: 'Frequent Visitor',
    description: 'Visited the platform 5 days in a row',
    icon: 'Flame',
    iconBg: 'orange',
  },
};

// Initialize achievements with earned=false
const initializeAchievements = () => {
  const initialAchievements: Record<string, Achievement> = {};

  // biome-ignore lint/complexity/noForEach: its fine
  Object.entries(defaultAchievements).forEach(([key, achievement]) => {
    initialAchievements[key] = {
      ...achievement,
      earned: false,
    };
  });

  return initialAchievements;
};

export const useAchievementsStore = create<AchievementsState>()(
  persist(
    (set, get) => ({
      achievements: initializeAchievements(),

      unlockAchievement: (id: string) => {
        const { achievements } = get();

        // If achievement exists and is not already earned
        if (achievements[id] && !achievements[id].earned) {
          set({
            achievements: {
              ...achievements,
              [id]: {
                ...achievements[id],
                earned: true,
                earnedAt: new Date(),
              },
            },
          });

          // You could trigger notifications here or other side effects
          console.log(`Achievement unlocked: ${achievements[id].title}`);

          return true;
        }

        return false;
      },

      hasAchievement: (id: string) => {
        const { achievements } = get();
        return achievements[id]?.earned || false;
      },

      resetAchievements: () => {
        set({ achievements: initializeAchievements() });
      },
    }),
    {
      name: 'founders-achievements',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Helper hook to get all earned achievements
export const useEarnedAchievements = () => {
  const { achievements } = useAchievementsStore();

  return Object.values(achievements).filter(achievement => achievement.earned);
};

// Hook to check if specific achievement is earned
export const useHasAchievement = (id: string) => {
  return useAchievementsStore(state => state.hasAchievement(id));
};
