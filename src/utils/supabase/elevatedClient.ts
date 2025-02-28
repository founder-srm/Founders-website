import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database.types';

// Use createClient from supabase-js directly instead of ssr for admin operations
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Using the hardcoded service role key to ensure it's being used
  const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE;
  
  if (!supabaseUrl) {
    console.error('Missing Supabase URL');
    throw new Error('Supabase URL is required');
  }

  if (!serviceRoleKey) {
    console.error('Missing service role key');
    throw new Error('Service role key is required');
  }
  
  // Create a client with the service role for admin operations
  const client = createSupabaseClient<Database>(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
  
  return client;
};

// Add a debug function to check which key is being used
export const debugSupabaseKey = () => {
  // Extract just enough info to verify which key is being used without exposing it
  // biome-ignore lint/style/noNonNullAssertion: its safe to assume the key is always present
    const key = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!;
  try {
    const [ payload] = key.split('.').slice(0, 2);
    const decodedPayload = JSON.parse(atob(payload));
    return {
      role: decodedPayload.role,
      exp: new Date(decodedPayload.exp * 1000).toISOString()
    };
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    return { error: `Invalid token format: ${error}` };
  }
};
