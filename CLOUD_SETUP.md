# CCC Cloud MVP Setup

This turns the local CCC MVP into a cloud-backed PWA:

- Vercel serves the app and `/api/*` serverless functions.
- Supabase stores login users, entry JSON, and original photos.
- Claude/OpenAI are called only from the Vercel backend, not directly from the iPhone browser.

## 1. Supabase

1. Create a Supabase project.
2. Open **SQL Editor**.
3. Run `supabase-schema.sql`.
4. Go to **Project Settings > API** and copy:
   - Project URL
   - anon public key
5. Go to **Authentication > URL Configuration**.
6. Set **Site URL** to your final Vercel URL.
7. Add redirect URLs:
   - `https://YOUR-VERCEL-APP.vercel.app`
   - `https://YOUR-VERCEL-APP.vercel.app/`
   - `http://127.0.0.1:8080`
   - `http://127.0.0.1:8080/`

## 2. Vercel

Deploy this folder:

```text
outputs/photo-diary-local-app
```

Set these Vercel Environment Variables:

```text
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-6
OPENAI_API_KEY=sk-...              # optional fallback
OPENAI_MODEL=gpt-5.5               # optional fallback
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR-SUPABASE-ANON-KEY
```

`SUPABASE_ANON_KEY` is allowed to be visible in the browser when Row Level Security is enabled. `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` must stay server-side only.

## 3. iPhone Use

1. Open the Vercel URL in Safari.
2. Tap Share.
3. Tap **Add to Home Screen**.
4. Open CCC from the Home Screen.
5. Send a login link from the Cloud panel.
6. Open the email link on the same iPhone/browser.
7. Use **Cloud Upload** after creating records.
8. Use **Cloud Pull** when you need to restore records to another browser/device.

## 4. Current MVP Sync Rules

- After cloud sign-in, saving an entry also uploads that entry to Supabase automatically.
- Cloud Upload still exists as a manual full sync/backfill button.
- Cloud Upload overwrites the same entry ID in Supabase.
- Cloud Pull overwrites the same entry ID in the local IndexedDB.
- Photos are uploaded to the private `ccc-photos` bucket.
- Photo paths are scoped by Supabase user ID.
- Moving an entry to trash or restoring it is also reflected in Supabase when signed in.
- Permanent delete removes the local entry and also tries to remove the matching Supabase row and stored photos.
- The Cloud status button checks the Supabase session, `ccc_entries` table, and `ccc-photos` bucket.
- JSON backup is still useful and should remain a safety backup.

## Human Decisions Left

- Pick the final Vercel project name and URL.
- Pick the Supabase project region.
- Decide whether email magic-link login is enough, or whether Google/Apple login should be added later.
- Decide whether sync should remain manual or become automatic after each save.
- Decide the Claude/OpenAI model and monthly budget limit.
