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
export async function updatePassword(newPassword: string) {


  if (!newPassword || newPassword.trim().length < 6) {
    return {
      success: false,
      error: "Password must be at least 6 characters long.",
    };
  }
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    console.error("Error updating password:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
export const sendResetPasswordLink = async (email: string): Promise<string> => {
  const supabase = await createClient();
  const { error, data } = await supabase.auth.resetPasswordForEmail(email, {
    // redirectTo: `http://localhost:3000/auth/new-password`, // Redirect URL
    redirectTo: `http://${process.env.NEXT_PUBLIC_BASE_URL}/auth/new-password` // needs to be tested in prod
  });

  console.log("Supabase response:", { error, data });

  // Check for errors and handle accordingly
  if (error) {
    return `Error: ${error.message}`;
  } else {
    return `Password reset link sent! Please check your email: ${email}`;
  }
};


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
