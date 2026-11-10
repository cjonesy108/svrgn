import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { supabaseAnonKey, supabaseConfigState, supabaseUrl } from '../auth/mode';

/**
 * Supabase client. Created only when both public env vars are set.
 * The local session stub does not use this module.
 */

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseConfigState() !== 'ready') return null;
  if (!client) {
    client = createClient(supabaseUrl(), supabaseAnonKey(), {
      auth: {
        storage: AsyncStorage,
        storageKey: 'sovereign-path.supabase-auth',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }
  return client;
}
