import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { loadLocalUser, signInLocal, signOutLocal, signUpLocal } from './local-session';
import { initialAuthMode, type AuthMode } from './mode';
import type { AppUser } from './types';
import { validateSignIn, validateSignUp } from './validate';
import { getSupabase } from '../supabase/client';
import { loadSupabaseUser, signInWithSupabase, signOutSupabase, signUpWithSupabase, userFromSession } from '../supabase/auth';

/**
 * Chooses exactly one auth path:
 * - local: src/lib/auth/local-session.ts when Supabase env vars are empty
 * - supabase: src/lib/supabase/auth.ts when both env vars are set
 * - misconfigured: one var is set, or the URL is not http(s). Sign-in stays blocked.
 */

interface AuthContextValue {
  ready: boolean;
  mode: AuthMode;
  user: AppUser | null;
  bootError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [mode] = useState<AuthMode>(initialAuthMode);
  const [user, setUser] = useState<AppUser | null>(null);
  const [ready, setReady] = useState(false);
  const [bootError, setBootError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (mode === 'misconfigured') {
      setReady(true);
      return;
    }

    if (mode === 'local') {
      loadLocalUser()
        .then((next) => {
          if (!cancelled) setUser(next);
        })
        .catch((error: unknown) => {
          if (!cancelled) setBootError(error instanceof Error ? error.message : 'Could not read the local session.');
        })
        .finally(() => {
          if (!cancelled) setReady(true);
        });
      return () => {
        cancelled = true;
      };
    }

    const client = getSupabase();
    if (!client) {
      setBootError('Supabase looked configured, but the client could not be created.');
      setReady(true);
      return;
    }

    loadSupabaseUser()
      .then((next) => {
        if (!cancelled) setUser(next);
      })
      .catch((error: unknown) => {
        if (!cancelled) setBootError(error instanceof Error ? error.message : 'Could not reach Supabase.');
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    const { data } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session ? userFromSession(session) : null);
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, [mode]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      mode,
      user,
      bootError,
      async signIn(email, password) {
        const problem = validateSignIn({ email, password });
        if (problem) throw new Error(problem);
        if (mode === 'misconfigured') {
          throw new Error('Set both Supabase variables, or clear both to use a local session.');
        }
        const next = mode === 'supabase' ? await signInWithSupabase(email, password) : await signInLocal(email, password);
        setUser(next);
      },
      async signUp(name, email, password) {
        const problem = validateSignUp({ name, email, password });
        if (problem) throw new Error(problem);
        if (mode === 'misconfigured') {
          throw new Error('Set both Supabase variables, or clear both to use a local session.');
        }
        const next =
          mode === 'supabase' ? await signUpWithSupabase(name, email, password) : await signUpLocal(name, email, password);
        setUser(next);
      },
      async signOut() {
        if (mode === 'supabase') await signOutSupabase();
        else await signOutLocal();
        setUser(null);
      },
    }),
    [ready, mode, user, bootError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider.');
  return value;
}
