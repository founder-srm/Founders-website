import { Button } from '@/components/ui/button';
import { useTrackAchievement } from '@/hooks/useTrackAchievement';
import { useToast } from '@/hooks/use-toast';

export default function AchievementTester() {
  const { 
    trackEventRegistration,
    trackEventAttendance,
    trackContentCreation,
    trackFeedbackSubmission,
    trackGithubConnection,
    trackGoogleConnection
  } = useTrackAchievement();
  
  const { toast } = useToast();
  
  const showToast = (message: string) => {
    toast({
      title: 'Testing Achievement System',
      description: message,
      duration: 3000,
    });
  };
  
  return (
    <div className="p-4 my-8 border rounded-lg max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Achievement Test Panel</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Use these buttons to test different achievements in the system.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          onClick={() => {
            trackEventRegistration();
            showToast('Triggered Event Registration achievement');
          }}
        >
          Test Event Registration
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => {
            trackEventAttendance();
            showToast('Triggered Event Attendance achievement');
          }}
        >
          Test Event Attendance
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => {
            trackContentCreation();
            showToast('Triggered Content Creation achievement');
          }}
        >
          Test Content Creation
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => {
            trackFeedbackSubmission();
            showToast('Triggered Feedback Submission achievement');
          }}
        >
          Test Feedback
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => {
            trackGithubConnection();
            showToast('Triggered GitHub Connection achievement');
          }}
        >
          Test GitHub Connect
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => {
            trackGoogleConnection();
            showToast('Triggered Google Connection achievement');
          }}
        >
          Test Google Connect
        </Button>
      </div>
    </div>
  );
}