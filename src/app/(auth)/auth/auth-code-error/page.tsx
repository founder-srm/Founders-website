import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function AuthCodeErrorPage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12">
      <Alert variant="destructive" className="max-w-lg">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>
          There was a problem authenticating your account. This could be
          because:
          <ul className="list-disc pl-4 mt-2 space-y-1">
            <li>The authentication code has expired</li>
            <li>The code has already been used</li>
            <li>There was a technical problem</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="mt-6 space-x-4">
        <Button asChild>
          <Link href="/auth/login">Try Again</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
