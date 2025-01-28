'use client';

import { use, useState } from 'react';
import { signup } from '../actions';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LucideLoaderPinwheel, TriangleAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '@/lib/schemas/auth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export default function SignupPage(props: {
  searchParams: Promise<{ message: string; cause: string; code: string }>;
}) {
  const searchParams = use(props.searchParams);
  const [Loading, setLoading] = useState(false);
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  async function onSubmit(data: SignupFormData) {
    setLoading(true);
    try {
      await signup(data); // Attempt the login
    } catch (error) {
      // Handle the error (e.g., show a message to the user)
      console.error('You messed up,Login failed:', error);
      // Optionally display an error toast or message to the user here
    } finally {
      setLoading(false); // Reset the button to allow retry
    }
  }

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center">
      <section className=" container mx-auto">
        <div className="container">
          {searchParams?.message && (
            <Alert
              variant="destructive"
              className="mx-auto w-full max-w-sm mb-8"
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
          <div className="grid lg:grid-cols-2">
            <div className="relative overflow-hidden py-10">
              <div className="mx-auto my-auto flex h-full w-full max-w-md flex-col justify-center gap-4 p-6">
                <div className="mb-6 flex flex-col items-center text-center">
                  <Image
                    src="/FC-logo-short.png"
                    alt="logo"
                    width={640}
                    height={640}
                    className="mb-7 h-12 w-auto"
                  />
                  <p className="mb-2 text-2xl font-bold">Create an account</p>
                  <p className="text-muted-foreground">
                    Enter your details to get started
                  </p>
                </div>
                <div className="w-full rounded-md bg-background">
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
                              <Input
                                type="email"
                                placeholder="Enter your email"
                                {...field}
                              />
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
                                placeholder="Create a password"
                                {...field}
                              />
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
                              <Input
                                type="password"
                                placeholder="Confirm your password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I agree to the{' '}
                                <Link href="/terms" className="text-primary">
                                  terms and conditions
                                </Link>
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={Loading}
                        className="w-full flex items-center gap-2"
                      >
                        {Loading && (
                          <LucideLoaderPinwheel className="animate-spin" />
                        )}{' '}
                        Create account
                      </Button>
                    </form>
                  </Form>
                </div>
                <div className="mx-auto mt-3 flex justify-center gap-1 text-sm text-muted-foreground">
                  <p>Already have an account?</p>
                  <Link href="/auth/login" className="font-medium text-primary">
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
            <Image
              src="https://shadcnblocks.com/images/block/placeholder-1.svg"
              alt="placeholder"
              width={800}
              height={600}
              className="hidden h-full max-h-screen object-cover lg:block"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
