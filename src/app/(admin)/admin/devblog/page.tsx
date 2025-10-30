'use client';

import { ArrowRight, BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function DevBlogPage() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="max-w-2xl w-full border-2 shadow-lg">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="relative bg-primary/10 p-4 rounded-full">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold">
              Blog Management Has Moved! 🎉
            </CardTitle>
            <CardDescription className="text-base">
              We&apos;ve upgraded to Sanity Studio for a better content management
              experience
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Rich Content Editor</h3>
                <p className="text-sm text-muted-foreground">
                  Create beautiful blog posts with an intuitive editor, image
                  management, and real-time preview
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <ExternalLink className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Centralized Management</h3>
                <p className="text-sm text-muted-foreground">
                  Manage all your content (blog posts, events, team members) in
                  one powerful platform
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Better Performance</h3>
                <p className="text-sm text-muted-foreground">
                  Optimized content delivery, automatic image optimization, and
                  live preview features
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <Button asChild className="w-full h-12 text-base" size="lg">
              <Link href="/studio" target="_blank">
                Open Sanity Studio
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full" size="lg">
              <Link href="/blog">View Published Posts</Link>
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground pt-2">
            Access the Studio to create, edit, and manage your blog content
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
