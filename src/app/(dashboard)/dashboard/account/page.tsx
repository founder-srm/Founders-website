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

export default function AccountPage() {
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
      }
    }

    fetchRegistrations();
  }, [user?.id, supabase]);

  useEffect(() => {
    async function fetchIdentities() {
      if (!user?.id) return;
      const { data, error } = await getUserIdentities();
      if (!error && data) {
        setIdentities(data);
      }
    }

    fetchIdentities();
  }, [user?.id]);

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
        if (data) setIdentities(data);
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

    // Get first two letters of each word in name
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

  return (
    <div className="min-h-screen bg-background">
      {/* Gradient Banner */}
      <div className="h-48 relative bg-[url('/user-banner.svg')] bg-cover bg-bottom bg-no-repeat" />
      {/* Profile Image and Name */}
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="relative -mt-24 mb-6 flex items-end">
          <Avatar className="h-[150px] w-[150px] border-4 border-background">
            <AvatarImage
              src={
                user?.user_metadata?.picture || user?.user_metadata?.avatar_url
              }
              alt={getDisplayName()}
            />
            <AvatarFallback className="text-4xl">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 mb-2">
            <h1 className="text-2xl font-bold text-foreground">
              {getDisplayName()}
            </h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
          <div className="ml-auto mb-2">
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

        {/* Main Content */}
        <Tabs
          defaultValue={currentTab}
          onValueChange={handleTabChange}
          className="mb-8"
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

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
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
                    <p className="font-medium">{user?.email}</p>
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <Calendar className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                      <p className="font-bold text-2xl">
                        {registrations.length}
                      </p>
                      <p className="text-sm text-muted-foreground">Events</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <Shield className="h-8 w-8 mx-auto text-green-500 mb-2" />
                      <p className="font-bold text-2xl">{identities.length}</p>
                      <p className="text-sm text-muted-foreground">
                        Connections
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="grid gap-4">
              <Card>
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

              <Card>
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
          </TabsContent>

          {/* Connections Tab */}
          <TabsContent value="connections">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  Connected Accounts
                </CardTitle>
                <CardDescription>
                  Manage your connected accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent transition-colors">
                  <div className="flex items-center space-x-4">
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
                  >
                    {hasProvider('github') ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent transition-colors">
                  <div className="flex items-center space-x-4">
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
                  >
                    {hasProvider('google') ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges">
            <Card>
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
                  <div className="p-4 border rounded-lg bg-card flex flex-col items-center w-32">
                    <div className="bg-primary/10 p-3 rounded-full mb-3">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium text-center">Account Created</p>
                    <p className="text-xs text-muted-foreground text-center mt-1">
                      Joined the platform
                    </p>
                  </div>

                  {registrations.length > 0 && (
                    <div className="p-4 border rounded-lg bg-card flex flex-col items-center w-32">
                      <div className="bg-blue-500/10 p-3 rounded-full mb-3">
                        <Calendar className="h-6 w-6 text-blue-500" />
                      </div>
                      <p className="font-medium text-center">
                        Event Participant
                      </p>
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        Joined an event
                      </p>
                    </div>
                  )}

                  {hasProvider('github') && (
                    <div className="p-4 border rounded-lg bg-card flex flex-col items-center w-32">
                      <div className="bg-gray-800/10 p-3 rounded-full mb-3">
                        <Github className="h-6 w-6 text-gray-800" />
                      </div>
                      <p className="font-medium text-center">
                        GitHub Connected
                      </p>
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        Linked GitHub
                      </p>
                    </div>
                  )}

                  {hasProvider('google') && (
                    <div className="p-4 border rounded-lg bg-card flex flex-col items-center w-32">
                      <div className="bg-red-500/10 p-3 rounded-full mb-3">
                        <GoogleIcon className="h-6 w-6 text-red-500" />
                      </div>
                      <p className="font-medium text-center">
                        Google Connected
                      </p>
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        Linked Google
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <Card>
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
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                          aria-hidden="true"
                        >
                          <Radio
                            className="opacity-60"
                            size={16}
                            strokeWidth={2}
                          />
                        </div>
                        <div className="flex grow items-center gap-12">
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
                        <div className="w-full flex flex-row justify-between items-center space-x-4">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
