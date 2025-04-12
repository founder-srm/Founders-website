'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useUser, useIsLoading } from '@/stores/session';
import { createClient } from '@/utils/supabase/client';
import { LeaveIcon } from '@sanity/icons';
import { redirect, useRouter } from 'next/navigation';
import type { typeformInsertType } from '../../../../../schema.zod';
import {
  Ticket,
  Mail,
  Key,
  Github,
  Radio,
  Award,
  User,
  Calendar,
  Shield,
  BadgeCheck,
  Users,
  PenLine,
  TicketCheck,
  MessageSquare,
  Flame,
} from 'lucide-react';
import {
  updateUserEmail,
  updateUserPassword,
  signOutUser,
  getUserIdentities,
  linkIdentity,
  unlinkIdentity,
} from '@/actions/supabase';
import { useToast } from '@/hooks/use-toast';
import { GoogleIcon } from '@/components/custom-icons/custom-icons';
import { Badge } from '@/components/ui/badge';
import type { UserIdentity } from '@supabase/supabase-js';
import { useSearchParams } from 'next/navigation';
import { formatInTimeZone } from 'date-fns-tz';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useEarnedAchievements } from '@/stores/achievements';
import { useTrackAchievement } from '@/hooks/useTrackAchievement';
// import AchievementTester from '@/components/ui/achievement-test';

export default function AccountPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const user = useUser();
  const isLoading = useIsLoading();
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<typeformInsertType[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [identities, setIdentities] = useState<UserIdentity[]>([]);
  const Router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'profile'; // Default to 'profile' if no query parameter

  // Achievement tracking
  // const { unlockAchievement } = useAchievementsStore();
  const earnedAchievements = useEarnedAchievements();
  const {
    trackEventRegistration,
    trackGithubConnection,
    trackGoogleConnection,
  } = useTrackAchievement();

  // Handle tab change
  const handleTabChange = (tab: string) => {
    Router.push(`?tab=${tab}`); // Update the URL with the selected tab
  };

  useEffect(() => {
    async function fetchRegistrations() {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('eventsregistrations')
        .select('*')
        .eq('application_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRegistrations(data);

        // Unlock event participant achievement if they have registrations
        if (data.length > 0) {
          trackEventRegistration();
        }
      }
    }

    fetchRegistrations();
  }, [user?.id, supabase, trackEventRegistration]);

  useEffect(() => {
    async function fetchIdentities() {
      if (!user?.id) return;
      const { data, error } = await getUserIdentities();
      if (!error && data) {
        setIdentities(data);

        // Check for GitHub and Google connections and unlock achievements
        if (data.some(identity => identity.provider === 'github')) {
          trackGithubConnection();
        }

        if (data.some(identity => identity.provider === 'google')) {
          trackGoogleConnection();
        }
      }
    }

    fetchIdentities();
  }, [user?.id, trackGithubConnection, trackGoogleConnection]);

  async function handleUpdateEmail() {
    const result = await updateUserEmail(newEmail);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: `Error ${result.error.code || ''}`,
        description: result.error.message,
      });
    } else {
      toast({
        title: 'Success',
        description: 'Email update confirmation sent to your new email.',
      });
      setNewEmail('');
    }
  }

  async function handleUpdatePassword() {
    const result = await updateUserPassword(newPassword);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: `Error ${result.error.code || ''}`,
        description: result.error.message,
      });
    } else {
      toast({
        title: 'Success',
        description: 'Password updated successfully.',
      });
      setNewPassword('');
    }
  }

  async function handleSignOut() {
    const result = await signOutUser();

    if (result.error) {
      toast({
        variant: 'destructive',
        title: `Error ${result.error.code || ''}`,
        description: result.error.message,
      });
    } else {
      redirect('/auth/login');
    }
  }

  const hasProvider = (provider: string) => {
    return identities.some(identity => identity.provider === provider);
  };

  async function handleIdentityConnection(provider: 'github' | 'google') {
    if (hasProvider(provider)) {
      // Unlink
      const result = await unlinkIdentity(provider);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error.message,
        });
      } else {
        toast({
          title: 'Success',
          description: `Disconnected from ${provider}`,
        });
        // Refresh identities
        const { data } = await getUserIdentities();
        if (data) setIdentities(data);
      }
    } else {
      // Link
      const result = await linkIdentity(provider);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error.message,
        });
      } else {
        toast({
          title: 'Success',
          description: `Connected to ${provider}`,
        });
        // Refresh identities
        const { data } = await getUserIdentities();
        if (data) {
          setIdentities(data);

          // Track achievements when connecting accounts
          if (provider === 'github') {
            trackGithubConnection();
          } else if (provider === 'google') {
            trackGoogleConnection();
          }
        }
      }
    }
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    const name =
      user?.user_metadata?.name ||
      user?.user_metadata?.full_name ||
      user?.email?.split('@')[0] ||
      'User';

    // Get first letters of each word in name
    return name
      .split(' ')
      .map((part: string): string => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get display name
  const getDisplayName = () => {
    return (
      user?.user_metadata?.name ||
      user?.user_metadata?.full_name ||
      user?.email?.split('@')[0] ||
      'User'
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  // Helper to get icon based on name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Award':
        return <Award className="h-6 w-6" />;
      case 'Calendar':
        return <Calendar className="h-6 w-6" />;
      case 'Github':
        return <Github className="h-6 w-6" />;
      case 'GoogleIcon':
        return <GoogleIcon className="h-6 w-6" />;
      case 'Users':
        return <Users className="h-6 w-6" />;
      case 'PenLine':
        return <PenLine className="h-6 w-6" />;
      case 'TicketCheck':
        return <TicketCheck className="h-6 w-6" />;
      case 'MessageSquare':
        return <MessageSquare className="h-6 w-6" />;
      case 'Flame':
        return <Flame className="h-6 w-6" />;
      default:
        return <Award className="h-6 w-6" />;
    }
  };

  // Shared tab content for both desktop and mobile
  const renderTabContent = (value: string) => {
    switch (value) {
      case 'profile':
        return (
          <Card className="border-0 shadow-none md:border md:shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} />
                Profile Information
              </CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-4 border rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="font-medium break-words">{user?.email}</p>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">
                    User ID
                  </p>
                  <p className="font-medium text-xs truncate">{user?.id}</p>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">
                    Email Verification
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        user?.email_confirmed_at ? 'default' : 'destructive'
                      }
                    >
                      {user?.email_confirmed_at ? 'Verified' : 'Not Verified'}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">
                    Last Sign In
                  </p>
                  <p className="font-medium">
                    {new Date(user?.last_sign_in_at || '').toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Account Stats */}
              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-4">Account Stats</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <Calendar className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                    <p className="font-bold text-2xl">{registrations.length}</p>
                    <p className="text-sm text-muted-foreground">Events</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Shield className="h-8 w-8 mx-auto text-green-500 mb-2" />
                    <p className="font-bold text-2xl">{identities.length}</p>
                    <p className="text-sm text-muted-foreground">Connections</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <Award className="h-8 w-8 mx-auto text-amber-500 mb-2" />
                    <p className="font-bold text-2xl">
                      {earnedAchievements.length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Achievements
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            {/* Test Achievement Panel (only for development) */}
            {/* <CardContent className="mt-6 pt-6 border-t">
              <AchievementTester />
            </CardContent> */}
          </Card>
        );
      case 'security':
        return (
          <div className="grid gap-4">
            <Card className="border-0 shadow-none md:border md:shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Change Email
                </CardTitle>
                <CardDescription>Update your email address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">New Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleUpdateEmail}>
                  <Mail className="mr-2 h-4 w-4" />
                  Update Email
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-0 shadow-none md:border md:shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleUpdatePassword}>
                  <Key className="mr-2 h-4 w-4" />
                  Update Password
                </Button>
              </CardFooter>
            </Card>
          </div>
        );
      case 'connections':
        return (
          <Card className="border-0 shadow-none md:border md:shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                Connected Accounts
              </CardTitle>
              <CardDescription>Manage your connected accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent transition-colors">
                <div className="flex flex-col md:flex-row max-md:justify-center items-center space-x-4">
                  <div className="bg-muted p-2 rounded-full">
                    <Github className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">GitHub</p>
                    <p className="text-sm text-muted-foreground">
                      {hasProvider('github') ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                <Button
                  variant={hasProvider('github') ? 'destructive' : 'outline'}
                  onClick={() => handleIdentityConnection('github')}
                  size={isMobile ? 'sm' : 'default'}
                >
                  {hasProvider('github') ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent transition-colors">
                <div className="flex flex-col md:flex-row max-md:justify-center items-center space-x-4">
                  <div className="bg-muted p-2 rounded-full">
                    <GoogleIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">Google</p>
                    <p className="text-sm text-muted-foreground">
                      {hasProvider('google') ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                <Button
                  variant={hasProvider('google') ? 'destructive' : 'outline'}
                  onClick={() => handleIdentityConnection('google')}
                  size={isMobile ? 'sm' : 'default'}
                >
                  {hasProvider('google') ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 'badges':
        return (
          <Card className="border-0 shadow-none md:border md:shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Badges Earned
              </CardTitle>
              <CardDescription>
                Your achievements and recognition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {earnedAchievements.length === 0 ? (
                  <div className="p-4 border rounded-lg bg-card w-full text-center">
                    <p className="text-muted-foreground">
                      No badges earned yet. Start exploring the platform to
                      unlock achievements!
                    </p>
                  </div>
                ) : (
                  earnedAchievements.map(achievement => (
                    <HoverCard key={achievement.id}>
                      <HoverCardTrigger asChild>
                        <div className="p-4 border rounded-lg bg-card flex flex-col items-center w-32 cursor-pointer hover:border-primary transition-colors">
                          <div
                            className={`bg-${achievement.iconBg}-500/10 p-3 rounded-full mb-3`}
                          >
                            {getIconComponent(achievement.icon)}
                          </div>
                          <p className="font-medium text-center text-sm md:text-base">
                            {achievement.title}
                          </p>
                          <p className="text-xs text-muted-foreground text-center mt-1">
                            {achievement.description}
                          </p>
                          {achievement.earnedAt && (
                            <p className="text-xs text-muted-foreground text-center mt-3">
                              {new Date(
                                achievement.earnedAt
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-64">
                        <div className="flex justify-between space-x-4">
                          <div
                            className={`bg-${achievement.iconBg}-500/10 p-3 rounded-full`}
                          >
                            {getIconComponent(achievement.icon)}
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">
                              {achievement.title}
                            </h4>
                            <p className="text-sm">{achievement.description}</p>
                            {achievement.earnedAt && (
                              <p className="text-xs text-muted-foreground">
                                Earned on{' '}
                                {new Date(
                                  achievement.earnedAt
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        );
      case 'events':
        return (
          <Card className="border-0 shadow-none md:border md:shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Event Registrations
              </CardTitle>
              <CardDescription>Your registered events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {registrations.length === 0 ? (
                  <div className="rounded-lg border border-border bg-background p-4 shadow-lg shadow-black/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border mb-2 md:mb-0"
                        aria-hidden="true"
                      >
                        <Radio
                          className="opacity-60"
                          size={16}
                          strokeWidth={2}
                        />
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 w-full">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            No Events Registered yet
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Lets change that!
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => Router.push('/dashboard/upcoming')}
                          className="w-full md:w-auto"
                        >
                          Lets Participate
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  registrations?.map(reg => (
                    <div
                      key={reg.id}
                      className="border rounded-lg p-4 hover:bg-accent transition-colors relative"
                    >
                      <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0 md:space-x-4">
                        <div>
                          <h3 className="font-medium text-lg">
                            {reg.event_title}
                          </h3>
                          <div className="text-sm text-gray-500 space-y-1 mt-1">
                            <p>Ticket ID: {reg.ticket_id}</p>
                            <p>
                              Registered:{' '}
                              {reg.created_at
                                ? formatInTimeZone(
                                    new Date(reg.created_at),
                                    'Asia/Kolkata',
                                    'dd MMMM yyyy, hh:mm a zzz'
                                  )
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <HoverCard>
                          <HoverCardTrigger>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                Router.push(
                                  `/dashboard/upcoming/register/success?ticketid=${reg.ticket_id}`
                                )
                              }
                              className="w-full md:w-auto"
                            >
                              <Ticket className="mr-2 h-4 w-4" />
                              View Ticket
                            </Button>
                          </HoverCardTrigger>
                          <HoverCardContent>
                            Get Your Ticket here, Incase you have lost it.
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Gradient Banner */}
      <div className="h-36 md:h-48 relative bg-[url('/user-banner.svg')] bg-cover bg-bottom bg-no-repeat" />

      {/* Profile Image and Name */}
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="relative -mt-16 md:-mt-24 mb-6">
          <div className="flex flex-col md:flex-row md:items-end">
            <Avatar className="w-[100px] h-auto md:h-[150px] md:w-[150px]">
              <AvatarImage
                src={
                  user?.user_metadata?.picture ||
                  user?.user_metadata?.avatar_url
                }
                alt={getDisplayName()}
              />
              <AvatarFallback className="text-2xl md:text-4xl">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>

            <div className="mt-3 md:mt-0 md:ml-4 md:mb-2 flex flex-row md:items-center md:justify-between w-full">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground break-words">
                  {getDisplayName()}
                </h1>
                <p className="text-sm md:text-base text-muted-foreground break-words">
                  {user?.email}
                </p>
              </div>

              <div className="mt-3 ml-6 md:mt-0 md:ml-auto">
                <Button
                  onClick={handleSignOut}
                  variant="destructive"
                  size="icon"
                  className="rounded-full"
                >
                  <LeaveIcon />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View: Vertical Tabs */}
        {isMobile ? (
          <Tabs
            defaultValue={currentTab}
            orientation="vertical"
            className="w-full flex-col mt-24 md:hidden"
            onValueChange={handleTabChange}
          >
            <div className="flex">
              <TabsList className="text-foreground flex-col gap-1 rounded-none bg-transparent px-1 py-0 w-1/3">
                <TabsTrigger
                  value="profile"
                  className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <User
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <Key
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Security
                </TabsTrigger>
                <TabsTrigger
                  value="connections"
                  className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <Github
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Links
                </TabsTrigger>
                <TabsTrigger
                  value="badges"
                  className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <BadgeCheck
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Badges
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <Ticket
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Events
                  {registrations.length > 0 && (
                    <Badge
                      className="bg-primary/15 ms-1.5 min-w-5"
                      variant="secondary"
                    >
                      {registrations.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <div className="grow w-2/3">
                <TabsContent value="profile">
                  {renderTabContent('profile')}
                </TabsContent>
                <TabsContent value="security">
                  {renderTabContent('security')}
                </TabsContent>
                <TabsContent value="connections">
                  {renderTabContent('connections')}
                </TabsContent>
                <TabsContent value="badges">
                  {renderTabContent('badges')}
                </TabsContent>
                <TabsContent value="events">
                  {renderTabContent('events')}
                </TabsContent>
              </div>
            </div>
          </Tabs>
        ) : (
          /* Desktop View: Horizontal Tabs */
          <Tabs
            defaultValue={currentTab}
            onValueChange={handleTabChange}
            className="mb-8 hidden md:block"
          >
            <ScrollArea>
              <TabsList className="text-foreground mb-6 h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1">
                <TabsTrigger
                  value="profile"
                  className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <User
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <Key
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Security
                </TabsTrigger>
                <TabsTrigger
                  value="connections"
                  className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <Github
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Connections
                </TabsTrigger>
                <TabsTrigger
                  value="badges"
                  className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <BadgeCheck
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Badges
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <Ticket
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Events
                  {registrations.length > 0 && (
                    <Badge
                      className="bg-primary/15 ms-1.5 min-w-5"
                      variant="secondary"
                    >
                      {registrations.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <TabsContent value="profile">
              {renderTabContent('profile')}
            </TabsContent>
            <TabsContent value="security">
              {renderTabContent('security')}
            </TabsContent>
            <TabsContent value="connections">
              {renderTabContent('connections')}
            </TabsContent>
            <TabsContent value="badges">
              {renderTabContent('badges')}
            </TabsContent>
            <TabsContent value="events">
              {renderTabContent('events')}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
