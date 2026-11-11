# Sovereign Path

Sovereign Path is a mobile app for ranks and merit badges across personal capability and civic self-governance. This repo is an Expo app (SDK 57, TypeScript) with Expo Router and NativeWind.

The intake, ranks, and badges work without a Supabase project. Progress stays on the device. Supabase is wired for auth only, and only when you set both environment variables.

## Install

```bash
npm install
cp .env.example .env
```

Leave the values in `.env` empty unless you are connecting Supabase Auth.

## Run

```bash
npx expo start
```

- Press `w` for web.
- Scan the QR code with Expo Go on a phone. This project uses Expo SDK 57, so use an Expo Go build that supports SDK 57.
- Press `a` for an Android emulator, or `i` for the iOS simulator on macOS.

```bash
npm run web
npm test
npm run typecheck
```

## Supabase

Copy `.env.example` to `.env` in the project root. Expo reads `EXPO_PUBLIC_*` variables from that file. Restart Expo after you change them.

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_SUPABASE_URL` | Project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |

Both empty: the app uses the on-device session in `src/lib/auth/local-session.ts`. Create an account on the sign-up screen. It never calls Supabase.

Both set: sign-in and sign-up use Supabase Auth in `src/lib/supabase/auth.ts`. The app does not fall back to the local session. If email confirmation is required, confirm the message, then sign in.

One set, or a URL that is not `http`/`https`: the sign-in screen explains the problem and does not create an account.

Badge progress, reflections, and intake answers are stored on the device (`sovereign-path.progress.v1` in AsyncStorage). They are not written to Supabase in this version. Supabase auth tokens, when configured, use a separate storage key: `sovereign-path.supabase-auth`.

## What you can do

Sign up, take the 12-domain intake, see the radar and starting rank, browse the badge catalog, open a badge, attest and reflect to complete it, and see earned badges on your profile. A completed badge and the current rank can each be saved as a PNG card from the badge screen, the profile, and the rank card. On a phone the save action opens the share sheet when the browser or device allows it. Ranks use the example thresholds: Initiate, Apprentice (8 badges, one in each personal domain), Journeyman (20, including 3 civic), Adept (35, with domain minimums), Sovereign (50, with civic depth).

Lessons are text plus an optional public link. Domain protocol cards are the “when you fall short” notes.

Legal and rights material is literacy only. The app does not give legal advice, templates, or any method for avoiding taxes, creditors, or jurisdiction.
