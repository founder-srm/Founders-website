import { createClient } from '@/utils/supabase/client';
import type { AuthError, Provider, User, UserIdentity } from '@supabase/supabase-js';

type ActionResponse = {
  error: null | AuthError;
  data: {
    user: User;
} | {
    user: null;
} | null;
};

type OAuthResponse = {
    error: null | AuthError;
    data: {
        provider: Provider;
        url: string;
    } | {
        provider: Provider;
        url: null;
    }
}

export async function updateUserEmail(newEmail: string): Promise<ActionResponse> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.updateUser({ 
    email: newEmail 
  });
  
  if (error) {
    return {
      error: error,
      data: null
    };
  }
  
  return {
    error: null,
    data
  };
}

export async function updateUserPassword(newPassword: string): Promise<ActionResponse> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.updateUser({ 
    password: newPassword 
  });
  
  if (error) {
    return {
      error: error,
      data: null
    };
  }

  return {
    error: null,
    data
  };
}

export async function signOutUser(): Promise<ActionResponse> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    return {
      error: error,
      data: null
    };
  }

  return {
    error: null,
    data: null
  };
}

export async function getUserIdentities(): Promise<{
  error: null | AuthError;
  data: UserIdentity[] | null;
}> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUserIdentities();
  
  return {
    error: error || null,
    data: data?.identities || null
  };
}

export async function linkIdentity(provider: 'github' | 'google'): Promise<OAuthResponse> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.linkIdentity({
    provider,
    options: { redirectTo: '/dashboard/account' }
  });
  
  return {
    error: error || null,
    data: data || null
  };
}

export async function unlinkIdentity(provider: string): Promise<ActionResponse> {
  const supabase = createClient();
  const { data: identities, error: fetchError } = await supabase.auth.getUserIdentities();
  
  if (fetchError) {
    return {
      error: fetchError,
      data: null
    };
  }

  const identity = identities?.identities?.find(id => id.provider === provider);
  
  if (!identity) {
    return {
      error: { message: 'Identity not found', name: 'NotFound' } as AuthError,
      data: null
    };
  }

  const { error } = await supabase.auth.unlinkIdentity(identity);
  
  return {
    error: error || null,
    data: null
  };
}

export async function signInWithOAuth(provider: 'github' | 'google'): Promise<OAuthResponse> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: 'http://localhost:3000/auth/confirm',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  return {
    error: error || null,
    data: data || null
  };
}
