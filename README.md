# Sovereign Path

Sovereign Path is a mobile app for ranks and merit badges across personal capability and civic self-governance. This repo is an Expo app (SDK 57, TypeScript) with Expo Router and NativeWind.

The intake, ranks, and badges work without a Supabase project. With both Supabase variables empty, progress stays on the device. With both set, auth and progress are stored in that project.

## Install

```bash
npm install
cp .env.example .env
```

Leave the values in `.env` empty unless you are connecting a Supabase project.

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

The app reads only these two public variables. Do not put the service role key in `.env` or in the app. Row level security is what keeps each account on its own rows.

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_SUPABASE_URL` | Project URL, from Project Settings → API |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | anon public key, from the same page |

Both empty: the app uses the on-device session in `src/lib/auth/local-session.ts`. Create an account on the sign-up screen. It never calls Supabase. Intake answers, scores, badges, reflections, and rank stay in AsyncStorage (`sovereign-path.progress.v1`).

Both set: sign-in uses Supabase Auth (`src/lib/supabase/auth.ts`). Intake responses, domain scores, badge progress, reflections, and the current rank are written to Postgres (`src/lib/supabase/remote.ts`). The app does not fall back to the local session. Auth tokens use a separate storage key, `sovereign-path.supabase-auth`.

One set, or a URL that is not `http`/`https`: the sign-in screen explains the problem and does not create an account.

### Create the project and run the migration

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Open **SQL Editor → New query**.
3. Paste the contents of `supabase/migrations/20261110164000_progress.sql` and run it. That creates `profiles`, `assessments`, `domain_scores`, `badge_progress`, and `intake_drafts`, enables row level security, and adds a trigger so a new auth user gets a profile row.
4. Open **Project Settings → API**. Copy the Project URL into `EXPO_PUBLIC_SUPABASE_URL` and the anon public key into `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `.env`.
5. Restart Expo (`npx expo start`). The packager only reads `EXPO_PUBLIC_*` at startup.
6. In **Authentication → Providers → Email**, leave email auth enabled. If **Confirm email** is on, open the confirmation message, then sign in. The app does not create a session until Supabase returns one.

To apply the same file with the Supabase CLI instead of the SQL editor:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

`YOUR_PROJECT_REF` is the reference id in Project Settings → General. It is not a secret. The CLI still uses your own Supabase access token, which you should not commit.

Tables are readable and writable only where `auth.uid()` matches the row's user. The anon role has no grants on them.

## What you can do

Sign up, take the 12-domain intake, see the radar and starting rank, browse the badge catalog, open a badge, attest and reflect to complete it, and see earned badges on your profile. A completed badge and the current rank can each be saved as a PNG card from the badge screen, the profile, and the rank card. On a phone the save action opens the share sheet when the browser or device allows it. Ranks use the example thresholds: Initiate, Apprentice (8 badges, one in each personal domain), Journeyman (20, including 3 civic), Adept (35, with domain minimums), Sovereign (50, with civic depth).

Lessons are text plus an optional public link. Domain protocol cards are the “when you fall short” notes.

Legal and rights material is literacy only. The app does not give legal advice, templates, or any method for avoiding taxes, creditors, or jurisdiction.
