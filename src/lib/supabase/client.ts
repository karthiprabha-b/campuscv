import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zldmcrysbcwfzfhoggtx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsZG1jcnlzYmN3ZnpmaG9nZ3R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MjM5NTIsImV4cCI6MjEwMjE5OTk1Mn0.gmoo5ME8UITh6VdbGzQob9TgdTBIjK3Ageb_x3IgAPQ';

let browserClient: SupabaseClient<Database> | null = null;

/**
 * Centralized Supabase client for browser usage.
 * Follows the singleton pattern to prevent multiple competing instances.
 */
export function getSupabaseBrowserClient(): SupabaseClient<Database> {
  if (typeof window === 'undefined') {
    return createClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  if (!browserClient) {
    browserClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
      },
    });
  }

  return browserClient;
}

export const supabase = getSupabaseBrowserClient();
