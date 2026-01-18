'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  type LoginFormData,
  loginSchema,
  type SignupFormData,
  signupSchema,
} from '@/lib/schemas/auth';
import { createClient } from '@/utils/supabase/server';

// Type for club signup data
export type ClubSignupFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  clubName: string;
  clubEmail: string;
  clubWebsite?: string;
  terms: boolean;
};

export async function updatePassword(newPassword: string) {
  if (!newPassword || newPassword.trim().length < 6) {
    return {
      success: false,
      error: 'Password must be at least 6 characters long.',
    };
  }
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error('Error updating password:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export const sendResetPasswordLink = async (email: string): Promise<string> => {
  const supabase = await createClient();
  const { error, data } = await supabase.auth.resetPasswordForEmail(email, {
    // redirectTo: `http://localhost:3000/auth/new-password`, // Redirect URL
    redirectTo: `http://${process.env.NEXT_PUBLIC_BASE_URL}/auth/new-password`, // needs to be tested in prod
  });

  console.log('Supabase response:', { error, data });

  // Check for errors and handle accordingly
  if (error) {
    return `Error: ${error.message}`;
  }
  return 'Password reset link sent! Please check your email!';
};

export async function login(data: LoginFormData) {
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    const errorMessage = result.error.issues
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
    const errorMessage = result.error.issues
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

export async function clubsignup(data: ClubSignupFormData) {
  // Validate required fields
  if (!data.email || !data.password || !data.firstName || !data.lastName || !data.phone || !data.clubName || !data.clubEmail) {
    return {
      success: false,
      error: 'Missing required fields',
    };
  }

  // Validate passwords match
  if (data.password !== data.confirmPassword) {
    return {
      success: false,
      error: 'Passwords do not match',
    };
  }

  // Validate password strength
  if (data.password.length < 8) {
    return {
      success: false,
      error: 'Password must be at least 8 characters long',
    };
  }

  const supabase = await createClient();

  // Step 1: Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (authError) {
    return {
      success: false,
      error: `Authentication failed: ${authError.message}`,
    };
  }

  if (!authData.user?.id) {
    return {
      success: false,
      error: 'Failed to create user account',
    };
  }

  // Step 2: Store club representative data in separate table
  const { error: dbError } = await supabase
    .from('club_representatives')
    .insert({
      user_id: authData.user.id,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      club_name: data.clubName,
      club_email: data.clubEmail,
      club_website: data.clubWebsite || null,
      status: 'pending',
    });

  if (dbError) {
    // Auth user was created but profile creation failed - this is a problem
    console.error('Failed to create club representative profile:', dbError);
    return {
      success: false,
      error: `Account created but profile setup failed: ${dbError.message}. Please contact support.`,
    };
  }

  revalidatePath('/auth/club-signup', 'layout');
  redirect('/club-dashboard');
}

export async function getuserbyid(uuid: string) {
  "use server";
  
  // Use the elevated client for admin operations
  const { createClient: createElevatedClient } = await import('@/utils/supabase/elevatedClient');
  const supabase = createElevatedClient();

  const { data, error } = await supabase.auth.admin.getUserById(uuid);
  return { data, error };
}