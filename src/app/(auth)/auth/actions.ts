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
  if (
    !data.email ||
    !data.password ||
    !data.firstName ||
    !data.lastName ||
    !data.phone ||
    !data.clubName ||
    !data.clubEmail
  ) {
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

  // Step 1: Create auth user with metadata
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: `${data.firstName} ${data.lastName}`,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
      },
    },
  });

  if (authError) {
    // Handle specific error codes
    if (authError.code === 'user_already_exists' || authError.status === 422) {
      return {
        success: false,
        error: 'A user with this email already exists. Please log in instead.',
        code: 'USER_EXISTS',
      };
    }
    return {
      success: false,
      error: `Authentication failed: ${authError.message}`,
      code: authError.code,
    };
  }

  if (!authData.user?.id) {
    return {
      success: false,
      error: 'Failed to create user account',
    };
  }

  // Step 2: Create the club in the clubs table
  const { data: clubData, error: clubError } = await supabase
    .from('clubs')
    .insert({
      name: data.clubName,
      email: data.clubEmail,
      website: data.clubWebsite || '',
      profile_picture: null,
    })
    .select('id')
    .single();

  if (clubError) {
    // Auth user was created but club creation failed
    console.error('Failed to create club:', clubError);
    return {
      success: false,
      error: `Account created but club setup failed: ${clubError.message}. Please contact support.`,
    };
  }

  // Step 3: Create the club user account entry with role 'club_rep'
  const { error: clubUserError } = await supabase
    .from('clubuseraccount')
    .insert({
      user_id: authData.user.id,
      club_id: clubData.id,
      email: data.email,
      user_role: 'club_rep',
      is_verified: false,
    });

  if (clubUserError) {
    // Club was created but user account creation failed
    console.error('Failed to create club user account:', clubUserError);
    return {
      success: false,
      error: `Account and club created but user role setup failed: ${clubUserError.message}. Please contact support.`,
    };
  }

  revalidatePath('/auth/club-signup', 'layout');

  // Return success - let the client handle the redirect
  return {
    success: true,
    message: 'Club account created successfully!',
  };
}

export async function getuserbyid(uuid: string) {
  'use server';

  // Use the elevated client for admin operations
  const { createClient: createElevatedClient } = await import(
    '@/utils/supabase/elevatedClient'
  );
  const supabase = createElevatedClient();

  const { data, error } = await supabase.auth.admin.getUserById(uuid);
  return { data, error };
}
