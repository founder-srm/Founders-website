import Link from 'next/link';
import { Frown, Home, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-400 to-pink-500 p-4 text-white">
      <h1 className="mb-4 animate-bounce text-6xl font-bold">404</h1>
      <Frown className="mb-4 h-24 w-24 animate-spin-slow" />
      <h2 className="mb-4 text-center text-3xl font-semibold">Oops! Page not found</h2>
      <p className="mb-8 max-w-md text-center text-xl">
        Looks like this page took a vacation without telling us. It&apos;s probably sipping coconuts
        on a beach somewhere!
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild variant="secondary" className="flex items-center gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </Button>
        <Button asChild variant="outline" className="group flex items-center gap-2 text-black">
          <Link href="javascript:history.back()">
            <RotateCcw className="h-4 w-4 group-hover:animate-spin" />
            Go Back
          </Link>
        </Button>
      </div>
    </div>
  );
}
