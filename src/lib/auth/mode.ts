export type AuthMode = 'local' | 'supabase' | 'misconfigured';
export type SupabaseConfigState = 'off' | 'ready' | 'incomplete';

function readEnv(name: string): string {
  const env = process.env as Record<string, string | undefined>;
  const value = env[name];
  return typeof value === 'string' ? value.trim() : '';
}

export function supabaseUrl(): string {
  return readEnv('EXPO_PUBLIC_SUPABASE_URL');
}

export function supabaseAnonKey(): string {
  return readEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export function supabaseConfigState(): SupabaseConfigState {
  const url = supabaseUrl();
  const key = supabaseAnonKey();
  if (!url && !key) return 'off';
  if (url && key && isHttpUrl(url)) return 'ready';
  return 'incomplete';
}

export function initialAuthMode(): AuthMode {
  const state = supabaseConfigState();
  if (state === 'ready') return 'supabase';
  if (state === 'incomplete') return 'misconfigured';
  return 'local';
}
