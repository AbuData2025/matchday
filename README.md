# MatchDay

A personal football performance tracker — log matches, track your season stats,
and keep a history of every game you play. Built for two accounts on one shared
team, each with their own club-colour theme.

## Why this exists

Built after realising there was no easy way to track 5-a-side performances over
a season — goals, assists, clean sheets, match ratings — without a spreadsheet.

## Stack

- React + Vite + TypeScript
- React Router
- Tailwind CSS (custom design tokens in `tailwind.config.js`)
- Recharts (season stats charts)
- lucide-react (icons)
- Supabase (Postgres + Auth) for real accounts and cross-device sync

## Getting started

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com), create a free project.
2. In the SQL Editor, run everything in [`supabase/schema.sql`](supabase/schema.sql)
   to create the `profiles` and `matches` tables with row-level security.
3. In **Authentication → Providers → Email**, for a private two-person app you
   can turn **off** "Confirm email" so sign-up logs you straight in without
   needing to click an email link. Leave it on if you'd rather confirm by email.
4. In **Project Settings → API**, copy the **Project URL** and **anon public key**.
5. (Optional) To enable the "Continue with Google" button: go to **Authentication → Providers → Google**, turn it on, and follow Supabase's linked instructions to create OAuth credentials in Google Cloud Console. Add `https://<your-project-ref>.supabase.co/auth/v1/callback` as an authorized redirect URI there, and paste the resulting Client ID/Secret into the Supabase Google provider settings.

### 2. Configure the app

```bash
cp .env.example .env
```

Paste your Project URL and anon key into `.env`.

### 3. Run it

```bash
npm install
npm run dev
```

Open the printed localhost URL, create an account for yourself, then create a
second account for your brother (different email). Each account only sees its
own matches — data is stored in Supabase, so it syncs across any device you
sign in from.

## Project structure

```
src/
  pages/         Dashboard, Matches, LogMatch, Stats, Profile, Auth
  components/     Layout (sidebar/nav), MatchCard, shared UI primitives (ui.tsx)
  hooks/          useAuthStore (Supabase auth + data), useCountdown
  utils/          club colour themes, static demo content (badges, next match)
  types/          shared TypeScript interfaces
  lib/            Supabase client
supabase/
  schema.sql      Run once in the Supabase SQL editor to set up tables + RLS
```

## Design notes

- Dark, pitch-at-night palette (not pure black) with a floodlit-crowd texture
  built entirely from CSS gradients — no photography, so there's nothing to
  license or attribute.
- Each account picks its own accent colour on sign-up (a few club presets, or
  a full custom colour picker) via `src/utils/themes.ts`.
- Scores, ratings, and the match countdown use a scoreboard-style digit
  component (`ScoreDigits` in `src/components/ui.tsx`) — the one deliberately
  "loud" visual element, everything else stays quiet.

## Deploying

Any static host that runs a Vite build works (Vercel, Netlify, Cloudflare
Pages). Steps are the same everywhere:

1. Push this repo to GitHub.
2. Import it in your host of choice.
3. Set the build command to `npm run build`, output directory `dist`.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment
   variables in the host's dashboard (same values as your local `.env`).

The anon key is safe to expose publicly — it only allows what the row-level
security policies in `supabase/schema.sql` permit (each account can only read
and write its own data).

## Future features

- [ ] Export stats as PDF
- [ ] Team-level record shared across both accounts (not just personal stats)
- [ ] Tournament tracking
- [ ] Light mode
- [ ] PWA support (`vite-plugin-pwa`)
- [ ] Share match cards as images
