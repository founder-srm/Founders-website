'use client';
import type { z } from 'zod';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LucideLoaderPinwheel, TriangleAlert, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newpasswordSchema } from '@/lib/schemas/auth';
import { updatePassword } from '../actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export default function NewPasswordPage(props: {
  searchParams: Promise<{ message?: string; cause?: string; code?: string }>;
}) {
  const [searchParams, setSearchParams] = useState<{
    message?: string;
    cause?: string;
    code?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchSearchParams() {
      const params = await props.searchParams;
      setSearchParams(params);
    }
    fetchSearchParams();
  }, [props.searchParams]);

  const form = useForm<z.infer<typeof newpasswordSchema>>({
    resolver: zodResolver(newpasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: z.infer<typeof newpasswordSchema>) {
    setLoading(true);
    const result = await updatePassword(data.password);
    setLoading(false);

    if (result.success) {
      alert('Password updated successfully!');
      router.push('/auth/login');
    } else {
      form.setError('root', {
        type: 'manual',
        message: result.error || 'An error occurred. Please try again.',
      });
    }
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
              <Image
                src="/FC-logo-short.png"
                alt="logo"
                width={640}
                height={640}
                className="mb-7 h-12 w-auto"
              />
              <h1 className="mb-2 text-2xl font-bold">Set New Password</h1>
              <p className="text-muted-foreground">
                Create a new password to secure your account.
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Create a password"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(prev => !prev)}
                              className="absolute inset-y-0 right-3 flex items-center"
                            >
                              {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Confirm your password"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(prev => !prev)}
                              className="absolute inset-y-0 right-3 flex items-center"
                            >
                              {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.formState.errors.root?.message && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.root.message}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center gap-2"
                  >
                    {loading && (
                      <LucideLoaderPinwheel className="animate-spin" />
                    )}{' '}
                    Update Password
                  </Button>
                </form>
              </Form>
            </div>
            <div className="mx-auto mt-3 flex justify-center gap-1 text-sm text-muted-foreground">
              <p>Remember your password?</p>
              <Link href="/auth/login" className="font-medium text-primary">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
