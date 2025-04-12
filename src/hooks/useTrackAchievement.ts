import { useAchievementsStore } from '@/stores/achievements';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/stores/session';

export function useTrackAchievement() {
  const unlockAchievement = useAchievementsStore(state => state.unlockAchievement);
  const hasAchievement = useAchievementsStore(state => state.hasAchievement);
  const user = useUser();
  const { toast } = useToast();

  // Function to track event registration
  const trackEventRegistration = () => {
    if (!user) return;
    
    if (!hasAchievement('eventParticipant')) {
      unlockAchievement('eventParticipant');
      toast({
        title: '🎉 Achievement Unlocked!',
        description: 'Event Participant - Registered for your first event!',
        duration: 5000,
      });
    }
  };

  // Function to track event attendance
  const trackEventAttendance = () => {
    if (!user) return;
    
    if (!hasAchievement('eventAttendee')) {
      unlockAchievement('eventAttendee');
      toast({
        title: '🎉 Achievement Unlocked!',
        description: 'Event Attendee - Attended your first event!',
        duration: 5000,
      });
    }
  };

  // Function to track content creation
  const trackContentCreation = () => {
    if (!user) return;
    
    if (!hasAchievement('contentCreator')) {
      unlockAchievement('contentCreator');
      toast({
        title: '🎉 Achievement Unlocked!',
        description: 'Content Creator - Published your first content!',
        duration: 5000,
      });
    }
  };

  // Function to track feedback submission
  const trackFeedbackSubmission = () => {
    if (!user) return;
    
    if (!hasAchievement('feedbackProvider')) {
      unlockAchievement('feedbackProvider');
      toast({
        title: '🎉 Achievement Unlocked!',
        description: 'Feedback Provider - Thank you for your valuable feedback!',
        duration: 5000,
      });
    }
  };

  // Function to track GitHub connection
  const trackGithubConnection = () => {
    if (!user) return;
    
    if (!hasAchievement('githubConnected')) {
      unlockAchievement('githubConnected');
      toast({
        title: '🎉 Achievement Unlocked!',
        description: 'GitHub Connected - Linked your GitHub account!',
        duration: 5000,
      });
    }
  };

  // Function to track Google connection
  const trackGoogleConnection = () => {
    if (!user) return;
    
    if (!hasAchievement('googleConnected')) {
      unlockAchievement('googleConnected');
      toast({
        title: '🎉 Achievement Unlocked!',
        description: 'Google Connected - Linked your Google account!',
        duration: 5000,
      });
    }
  };

  // Return tracking functions
  return {
    trackEventRegistration,
    trackEventAttendance,
    trackContentCreation,
    trackFeedbackSubmission,
    trackGithubConnection,
    trackGoogleConnection
  };
}