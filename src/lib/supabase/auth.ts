import type { Session } from '@supabase/supabase-js';

import type { AppUser } from '../auth/types';
import { getSupabase } from './client';

/**
 * Supabase Auth path. Do not import the local session stub from this file.
 */

function requireClient() {
  const client = getSupabase();
  if (!client) throw new Error('Supabase is not configured.');
  return client;
}

export function userFromSession(session: Session): AppUser {
  const email = session.user.email ?? '';
  const metadata = session.user.user_metadata as { name?: string } | undefined;
  const name = metadata?.name?.trim() || email.split('@')[0] || 'Member';
  return {
    id: session.user.id,
    email,
    name,
    mode: 'supabase',
  };
}

export async function loadSupabaseUser(): Promise<AppUser | null> {
  const client = requireClient();
  const { data, error } = await client.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session ? userFromSession(data.session) : null;
}

export async function signInWithSupabase(email: string, password: string): Promise<AppUser> {
  const client = requireClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  if (!data.session) throw new Error('Supabase did not return a session.');
  return userFromSession(data.session);
}

export async function signUpWithSupabase(name: string, email: string, password: string): Promise<AppUser> {
  const client = requireClient();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { data: { name: name.trim() } },
  });
  if (error) throw new Error(error.message);
  if (!data.session) {
    throw new Error('Check your email to confirm the account, then sign in.');
  }
  return userFromSession(data.session);
}

export async function signOutSupabase(): Promise<void> {
  const client = requireClient();
  const { error } = await client.auth.signOut();
  if (error) throw new Error(error.message);
}
