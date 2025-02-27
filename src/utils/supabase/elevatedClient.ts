import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database.types';

// Use createClient from supabase-js directly instead of ssr for admin operations
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Using the hardcoded service role key to ensure it's being used
  const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlZHBsdm9wa2h3dWhocXVhZ2Z3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNzI0MzU4NSwiZXhwIjoyMDIyODE5NTg1fQ.LsBV4sC3_adeSSUr3-PWhQXIUnpitMNPO-Hf5SxA96U";
  
  if (!supabaseUrl) {
    console.error('Missing Supabase URL');
    throw new Error('Supabase URL is required');
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
  const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlZHBsdm9wa2h3dWhocXVhZ2Z3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNzI0MzU4NSwiZXhwIjoyMDIyODE5NTg1fQ.LsBV4sC3_adeSSUr3-PWhQXIUnpitMNPO-Hf5SxA96U";
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
