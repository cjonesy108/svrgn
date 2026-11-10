import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

import { supabaseConfigState } from './mode';
import type { AppUser } from './types';
import { normalizeEmail } from './validate';

/**
 * LOCAL SESSION STUB
 *
 * This module is not Supabase Auth. It exists so Sovereign Path can boot
 * and the main flows can be used when EXPO_PUBLIC_SUPABASE_URL and
 * EXPO_PUBLIC_SUPABASE_ANON_KEY are both empty.
 *
 * Accounts stay in AsyncStorage on this device. The passphrase is hashed
 * with a fixed prefix and never leaves the device. That hash is only a
 * convenience lock for the form. It is not a security boundary.
 *
 * Do not import this file from src/lib/supabase. The auth provider in
 * src/lib/auth/provider.tsx chooses exactly one path.
 */

const STORAGE_KEY = 'sovereign-path.local-session.v1';
const HASH_PREFIX = 'sovereign-path.local-session.v1:';

interface LocalAccount {
  id: string;
  email: string;
  name: string;
  passphraseHash: string;
  createdAt: string;
}

interface LocalSessionFile {
  accounts: LocalAccount[];
  activeUserId: string | null;
}

const EMPTY: LocalSessionFile = { accounts: [], activeUserId: null };

function assertLocalPath(): void {
  if (supabaseConfigState() !== 'off') {
    throw new Error('The local session is disabled because Supabase environment variables are set.');
  }
}

async function hashPassphrase(passphrase: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${HASH_PREFIX}${passphrase}`);
}

async function readFile(): Promise<LocalSessionFile> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw) as LocalSessionFile;
    if (!parsed || !Array.isArray(parsed.accounts)) return EMPTY;
    return {
      accounts: parsed.accounts,
      activeUserId: parsed.activeUserId ?? null,
    };
  } catch {
    return EMPTY;
  }
}

async function writeFile(file: LocalSessionFile): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(file));
}

function toUser(account: LocalAccount): AppUser {
  return {
    id: account.id,
    email: account.email,
    name: account.name,
    mode: 'local',
  };
}

export async function loadLocalUser(): Promise<AppUser | null> {
  const file = await readFile();
  const account = file.accounts.find((item) => item.id === file.activeUserId);
  return account ? toUser(account) : null;
}

export async function signUpLocal(name: string, email: string, passphrase: string): Promise<AppUser> {
  assertLocalPath();
  const file = await readFile();
  const normalized = normalizeEmail(email);
  if (file.accounts.some((account) => account.email === normalized)) {
    throw new Error('That email is already on this device. Sign in instead.');
  }
  const account: LocalAccount = {
    id: `local_${Crypto.randomUUID()}`,
    email: normalized,
    name: name.trim(),
    passphraseHash: await hashPassphrase(passphrase),
    createdAt: new Date().toISOString(),
  };
  await writeFile({ accounts: [...file.accounts, account], activeUserId: account.id });
  return toUser(account);
}

export async function signInLocal(email: string, passphrase: string): Promise<AppUser> {
  assertLocalPath();
  const file = await readFile();
  const account = file.accounts.find((item) => item.email === normalizeEmail(email));
  if (!account) throw new Error('No local account on this device uses that email.');
  const hash = await hashPassphrase(passphrase);
  if (hash !== account.passphraseHash) throw new Error('That passphrase does not match.');
  await writeFile({ ...file, activeUserId: account.id });
  return toUser(account);
}

export async function signOutLocal(): Promise<void> {
  const file = await readFile();
  await writeFile({ ...file, activeUserId: null });
}
