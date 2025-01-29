'use client';

import { useState } from 'react';
import { sendResetPasswordLink } from '../actions'; // Import the function
import { Button } from '@/components/ui/button'; // Tailwind UI components
import { Input } from '@/components/ui/input'; // Tailwind UI components
import { Alert, AlertDescription } from '@/components/ui/alert'; // Tailwind UI components
import Image from 'next/image';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Call the action to send the reset password link
    const response = await sendResetPasswordLink(email);

    // Check the response and set the message accordingly
    if (response.startsWith('Error:')) {
      setMessage(response); // If there's an error, display the error message
    } else {
      setMessage(response); // If successful, display the success message
    }

    setLoading(false); // Reset loading state
  };

  return (
    <main className="w-full min-h-screen flex flex-col items-center">
      <section className="pb-32 container mx-auto">
        <div className="relative flex flex-col items-center overflow-hidden pb-6 pt-32">
          <Image
            src="/FC-logo-short.png"
            alt="logo"
            width={640}
            height={640}
            className="mb-7 h-12 w-auto"
          />
          <h1 className="mb-2 text-2xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground">
            Enter your email to reset your password.
          </p>
        </div>
        <div className="z-10 mx-auto w-full max-w-sm rounded-md bg-background p-6 shadow">
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
          {message && (
            <Alert
              variant={message.includes('default') ? 'default' : 'destructive'}
              className="mt-4"
            >
              <AlertDescription className="text-center text-sm text-muted-foreground">
                {message}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </section>
    </main>
  );
};

export default ResetPassword;
