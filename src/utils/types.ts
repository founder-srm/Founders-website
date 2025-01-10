import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../../database.types'

export type TypedSupabaseClient = SupabaseClient<Database>