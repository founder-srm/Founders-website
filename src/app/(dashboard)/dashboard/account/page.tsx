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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser, useIsLoading } from '@/stores/session';
import { createClient } from '@/utils/supabase/client';
import { LeaveIcon } from '@sanity/icons';
import { redirect, useRouter } from 'next/navigation';
import type { typeformInsertType } from '../../../../../schema.zod';
import { Ticket, Mail, Key, Github, Radio, X } from 'lucide-react';
import { updateUserEmail, updateUserPassword, signOutUser, getUserIdentities, linkIdentity, unlinkIdentity } from '@/actions/supabase';
import { useToast } from '@/hooks/use-toast';
import GoogleIcon from '@/components/custom-icons/custom-icons';
import { Badge } from "@/components/ui/badge";
import type { UserIdentity } from '@supabase/supabase-js';

export default function AccountPage() {
  
  const user = useUser();
  const isLoading = useIsLoading();
  const { toast } = useToast()
  const [registrations, setRegistrations] = useState<typeformInsertType[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [identities, setIdentities] = useState<UserIdentity[]>([]);
  const Router = useRouter();
  const supabase = createClient();

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
        variant: "destructive",
        title: `Error ${result.error.code || ''}`,
        description: result.error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Email update confirmation sent to your new email.",
      });
      setNewEmail('');
    }
  }

  async function handleUpdatePassword() {
    const result = await updateUserPassword(newPassword);
    
    if (result.error) {
      toast({
        variant: "destructive",
        title: `Error ${result.error.code || ''}`,
        description: result.error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Password updated successfully.",
      });
      setNewPassword('');
    }
  }

  async function handleSignOut() {
    const result = await signOutUser();
    
    if (result.error) {
      toast({
        variant: "destructive",
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
          variant: "destructive",
          title: "Error",
          description: result.error.message,
        });
      } else {
        toast({
          title: "Success",
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
          variant: "destructive",
          title: "Error",
          description: result.error.message,
        });
      } else {
        toast({
          title: "Success",
          description: `Connected to ${provider}`,
        });
        // Refresh identities
        const { data } = await getUserIdentities();
        if (data) setIdentities(data);
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            Events
            {registrations.length > 0 && (
              <Badge 
                variant="secondary" 
                className="h-5 w-5 rounded-full p-0 flex items-center justify-center"
              >
                {registrations.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-gray-600">Email: {user?.email}</p>
                <p className="text-gray-600">User ID: {user?.id}</p>
                <p className="text-gray-600">
                  Email verified: {user?.email_confirmed_at ? 'Yes' : 'No'}
                </p>
                <p className="text-gray-600">
                  Last sign in: {new Date(user?.last_sign_in_at || '').toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Change Email</CardTitle>
                <CardDescription>Update your email address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">New Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
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
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

        <TabsContent value="connections">
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Manage your connected accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Github className="h-6 w-6" />
                  <div>
                    <p className="font-medium">GitHub</p>
                    <p className="text-sm text-gray-500">
                      {hasProvider('github') ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant={hasProvider('github') ? "destructive" : "outline"}
                  onClick={() => handleIdentityConnection('github')}
                >
                  {hasProvider('github') ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <GoogleIcon className="h-6 w-6" />
                  <div>
                    <p className="font-medium">Google</p>
                    <p className="text-sm text-gray-500">
                      {hasProvider('google') ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant={hasProvider('google') ? "destructive" : "outline"}
                  onClick={() => handleIdentityConnection('google')}
                >
                  {hasProvider('google') ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Event Registrations</CardTitle>
              <CardDescription>Your registered events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {registrations.length === 0 ? (
                  <div className="z-[100] max-w-[700px] rounded-lg border border-border bg-background p-4 shadow-lg shadow-black/5">
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                        aria-hidden="true"
                      >
                        <Radio className="opacity-60" size={16} strokeWidth={2} />
                      </div>
                      <div className="flex grow items-center gap-12">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">No Events Registered yet</p>
                          <p className="text-xs text-muted-foreground">Lets change that!</p>
                        </div>
                        <Button size="sm">Lets Participate</Button>
                      </div>
                      <Button
                        variant="ghost"
                        className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
                        aria-label="Close notification"
                      >
                        <X
                          size={16}
                          strokeWidth={2}
                          className="opacity-60 transition-opacity group-hover:opacity-100"
                          aria-hidden="true"
                        />
                      </Button>
                    </div>
                  </div>
                ) : (
                  registrations?.map(reg => (
                    <div
                      key={reg.id}
                      className="border rounded-lg p-4 hover:bg-accent transition-colors relative"
                    >
                      <div className=" w-full flex flex-row justify-between items-center space-x-4">
                        <h3 className="font-medium text-lg">{reg.event_title}</h3>
                        <HoverCard>
                          <HoverCardTrigger>
                            <Ticket
                              className="cursor-pointer"
                              onClick={() =>
                                Router.push(
                                  `/dashboard/upcoming/register/success?ticketid=${reg.ticket_id}`
                                )
                              }
                            />
                          </HoverCardTrigger>
                          <HoverCardContent>
                            Get Your Ticket here, Incase you have lost it.
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>Ticket ID: {reg.ticket_id}</p>
                        <p>
                          Registered:{' '}
                          {reg.created_at
                            ? new Date(reg.created_at).toLocaleString('en-IN', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSignOut}
          variant="destructive"
          size="icon"
        >
          <LeaveIcon />
        </Button>
      </div>
    </div>
  );
}
