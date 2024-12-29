import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../../../database.types';

export const createClient = () =>
  createBrowserClient<Database>(
    // biome-ignore lint/style/noNonNullAssertion: supabase url and key are always added
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // biome-ignore lint/style/noNonNullAssertion: supabase url and key are always added
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
