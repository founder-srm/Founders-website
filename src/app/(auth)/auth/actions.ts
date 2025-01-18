'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import {
  loginSchema,
  signupSchema,
  type LoginFormData,
  type SignupFormData,
} from '@/lib/schemas/auth';

export async function login(data: LoginFormData) {
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    const errorMessage = result.error.errors
      .map(error => error.message)
      .join(', ');
    redirect(`/auth/login?message=${errorMessage}`);
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    redirect(
      `/auth/login?message=${error.message}&cause=${error.cause}&code=${error.code}`
    );
  }

  revalidatePath('/auth/login', 'layout');
  redirect('/dashboard/account');
}

export async function signup(data: SignupFormData) {
  const result = signupSchema.safeParse(data);

  if (!result.success) {
    const errorMessage = result.error.errors
      .map(error => error.message)
      .join(', ');
    redirect(`/auth/signup?message=${errorMessage}`);
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    redirect(
      `/auth/signup?message=${error.message}&cause=${error.cause}&code=${error.code}`
    );
  }

  revalidatePath('/auth/signup', 'layout');
  redirect('/dashboard/account');
}
