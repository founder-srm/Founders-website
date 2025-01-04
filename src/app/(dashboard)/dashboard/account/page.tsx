'use client';

import { Button } from '@/components/ui/button';
import { useUser, useSession, useIsLoading } from '@/stores/session';
import { createClient } from '@/utils/supabase/client';
import { LeaveIcon } from '@sanity/icons';
import { redirect } from 'next/navigation';

export default function AccountPage() {
  const user = useUser();
  const session = useSession();
  const isLoading = useIsLoading();

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
              Last sign in: {new Date(user?.last_sign_in_at || '').toLocaleString()}
            </p>
          </div>
        </div>

        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4">Session Information</h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              Session expires: {new Date(session?.expires_at || 0 * 1000).toLocaleString()}
            </p>
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
