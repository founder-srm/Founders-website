import Link from 'next/link'
import { Frown, Home, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-400 to-pink-500 text-white p-4">
      <h1 className="text-6xl font-bold mb-4 animate-bounce">404</h1>
      <Frown className="w-24 h-24 mb-4 animate-spin-slow" />
      <h2 className="text-3xl font-semibold mb-4 text-center">Oops! Page not found</h2>
      <p className="text-xl mb-8 text-center max-w-md">
        Looks like this page took a vacation without telling us. It&apos;s probably sipping coconuts on a beach somewhere!
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="secondary" className="flex items-center gap-2">
          <Link href="/">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </Button>
        <Button asChild variant="outline" className="group flex items-center gap-2 text-black">
          <Link href="javascript:history.back()">
            <RotateCcw className="w-4 h-4 group-hover:animate-spin" />
            Go Back
          </Link>
        </Button>
      </div>
    </div>
  )
}