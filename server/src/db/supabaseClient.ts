import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!url || !key) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key);
      console.log('✅ Connected to live Supabase project:', url);
    } catch (err) {
      console.warn('⚠️ Supabase connection failed, falling back to local store:', err);
      return null;
    }
  }

  return supabaseInstance;
}

