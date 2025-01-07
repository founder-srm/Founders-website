'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useUser, useSession, useIsLoading } from '@/stores/session';
import { createClient } from '@/utils/supabase/client';
import { LeaveIcon } from '@sanity/icons';
import { redirect, useRouter } from 'next/navigation';
import type { typeformInsertType } from '../../../../../schema.zod';
import { Ticket } from 'lucide-react';

export default function AccountPage() {
  const user = useUser();
  const session = useSession();
  const isLoading = useIsLoading();
  const [registrations, setRegistrations] = useState<typeformInsertType[]>([]);

  const Router = useRouter();

  useEffect(() => {
    async function fetchRegistrations() {
      if (!user?.id) return;

      const supabase = createClient();
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
  }, [user?.id]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect('/login');
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <div className="bg-background/50 shadow rounded-lg p-6 space-y-6">
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-2">
            <p className="text-gray-600">Email: {user?.email}</p>
            <p className="text-gray-600">User ID: {user?.id}</p>
            <p className="text-gray-600">
              Email verified: {user?.email_confirmed_at ? 'Yes' : 'No'}
            </p>
            <p className="text-gray-600">
              Last sign in:{' '}
              {new Date(user?.last_sign_in_at || '').toLocaleString()}
            </p>
          </div>
        </div>

        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4">Session Information</h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              Session expires:{' '}
              {new Date(session?.expires_at || 0 * 1000).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">
            Your Event Registrations
          </h2>
          <div className="space-y-4">
            {registrations.length === 0 ? (
              <p className="text-gray-500">No event registrations found.</p>
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
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            onClick={handleSignOut}
            className="px-4 py-2"
            variant="destructive"
            size="icon"
          >
            <LeaveIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
