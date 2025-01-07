'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { loginSchema, type LoginFormData } from '@/lib/schemas/auth';

export async function login(data: LoginFormData) {
  const result = loginSchema.safeParse(data);
  
  if (!result.success) {
    const errorMessage = result.error.errors.map(error => error.message).join(', ');
    redirect(`/auth/login?message=${errorMessage}`);
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    redirect(`/auth/login?message=${error.message}&cause=${error.cause}&code=${error.code}`);
  }

  revalidatePath('/auth/login', 'layout');
  redirect('/dashboard/upcoming');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error('Error signing up:', error);
    redirect('/error');
  }

  revalidatePath('/login', 'layout');
  redirect('/dashboard/upcoming');
}
