'use client';

import React, { use, useState } from 'react';
import { login } from '../actions';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import GoogleIcon from '@/components/custom-icons/custom-icons';
import { Github, LucideLoaderPinwheel, TriangleAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/schemas/auth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { signInWithOAuth } from '@/actions/supabase';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage(props: {
  searchParams: Promise<{ message: string; cause: string; code: string }>;
}) {
  const searchParams = use(props.searchParams);

  const { toast } = useToast();

  const [Loading, setLoading] = useState(false);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  async function handleOAuthSignIn(provider: 'github' | 'google') {
    setLoading(true);
    const { error, data } = await signInWithOAuth(provider);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: error.message,
      });
    } else if (data?.url) {
      // Redirect to provider's OAuth page
      window.location.href = data.url;
    }
    setLoading(false);
  }

  async function onSubmit(data: LoginFormData) {
    setLoading(true);
    await login(data);
    setLoading(false);
  }

  return (
    <main className="w-full min-h-screen flex flex-col items-center">
      <section className="pb-32 container mx-auto">
        <div className="container">
          <div className="flex flex-col gap-4">
            {searchParams?.message && (
              <Alert
                variant="destructive"
                className="mx-auto w-full max-w-sm mt-8"
              >
                <TriangleAlert className="h-4 w-4" />
                <AlertDescription>
                  {searchParams.message}
                  {searchParams.cause && (
                    <div className="mt-2">
                      <strong>Cause:</strong> {searchParams.cause}
                    </div>
                  )}
                  {searchParams.code && (
                    <div>
                      <strong>Code:</strong> {searchParams.code}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
            <div className="relative flex flex-col items-center overflow-hidden pb-6 pt-32">
              <svg
                // xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 200"
                className="absolute top-10 -z-10 h-full w-[1250px] [mask-image:radial-gradient(circle,red,transparent,transparent,transparent)]"
                aria-label="Background grid pattern"
                role="img"
              >
                <defs>
                  <pattern
                    id="innerGrid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      className="stroke-muted-foreground/70"
                      strokeWidth="0.5"
                    />
                  </pattern>
                  <pattern
                    id="grid"
                    width="160"
                    height="160"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="160" height="160" fill="url(#innerGrid)" />
                  </pattern>
                </defs>
                <rect width="200" height="200" fill="url(#grid)" />
              </svg>
              <Image
                src="/FC-logo-short.png"
                alt="logo"
                width={640}
                height={640}
                className="mb-7 h-12 w-auto"
              />
              <h1 className="mb-2 text-2xl font-bold">
                Log in to your account
              </h1>
              <p className="text-muted-foreground">
                Welcome back! Please enter your details.
              </p>
            </div>
            <div className="z-10 mx-auto w-full max-w-sm rounded-md bg-background p-6 shadow">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid gap-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="remember"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">Remember me</FormLabel>
                        </div>
                        <Link
                          href="#"
                          className="text-sm font-medium text-primary"
                        >
                          Forgot password
                        </Link>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={Loading}
                    className="w-full flex gap-2 items-center"
                  >
                    {Loading && (
                      <LucideLoaderPinwheel className="animate-spin" />
                    )}{' '}
                    Sign in
                  </Button>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <Button
                      variant="outline"
                      onClick={() => handleOAuthSignIn('github')}
                      disabled={Loading}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleOAuthSignIn('google')}
                      disabled={Loading}
                    >
                      <GoogleIcon className="mr-2" />
                      Google
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
            <div className="mx-auto mt-3 flex justify-center gap-1 text-sm text-muted-foreground">
              <p>Don&apos;t have an account?</p>
              <Link href="/auth/signup" className="font-medium text-primary">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
