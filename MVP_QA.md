# CCC MVP QA

This checklist separates automated checks from iPhone-only checks.

## Automated checks run by Codex

- Production URL responds.
- `/api/health` reports Vercel runtime.
- OpenAI server key is configured.
- Supabase URL and anon key are configured.
- White Cube is the only active design.
- Design switcher UI and theme persistence code are removed.
- Service worker cache is bumped.
- Manifest uses the warm white and blue CCC identity.
- Camera capture input exists.
- Photo library input supports multiple photos.
- Four fixed albums exist: food, wine, culture, math.
- Cloud settings are in a collapsible recovery/settings panel.
- IndexedDB local-first storage functions exist.
- Supabase session initialization exists.
- Supabase RLS and private photo bucket schema exist.
- Cloud pull uses safe merge instead of unconditional overwrite.
- Backup import uses safe merge instead of unconditional overwrite.
- JSON backup includes entry and photo counts.
- PDF export uses the White Cube print style.
- Original photo export attempts all photos when Web Share is unavailable.
- Frontend files do not contain a hard-coded OpenAI secret.
- `/api/analyze` requires a Supabase session before using the server OpenAI key.
- `/api/analyze` still allows a user-provided OpenAI key for direct personal testing.

## Current known blocker

- A live AI call reached the server, but OpenAI returned `insufficient_quota`.
- Fix this in OpenAI Platform Billing/Usage before expecting AI drafts to succeed with the server key.

## iPhone manual checks

1. Open `https://ccc-photo-diary.vercel.app/` in Safari.
2. Add CCC to the Home Screen.
3. Open CCC from the Home Screen and confirm it launches standalone.
4. Confirm the app icon and splash color match the warm White Cube direction.
5. Tap camera capture, take a photo, and save a record.
6. Tap photo library, select multiple photos, and save a record.
7. Close CCC completely, reopen it, and confirm local records remain.
8. Create one record in each album.
9. Open each album and confirm old records are visible.
10. Search by title, comment, or tag.
11. Move a record to trash.
12. Restore the trashed record.
13. Permanently delete a test record.
14. Export a JSON backup.
15. Import the same backup and confirm records are not destructively overwritten.
16. Sign in with Supabase magic link on the same iPhone.
17. Save a new record while signed in and confirm the cloud note reports Supabase storage.
18. Use Cloud Upload manually.
19. Use Cloud Pull on another browser or device.
20. Confirm a same-ID conflict is skipped, updated, or imported as a copy instead of silently overwriting local work.
21. Export PDF from a detail page.
22. Use original photo save/share and confirm all selected photos are offered or downloaded.
23. After OpenAI billing is fixed, run one AI draft on food or wine.
24. After OpenAI billing is fixed, run one AI draft on a math problem.
25. Confirm AI drafts are editable before saving.

## Product decisions still open

- Whether iPhone Photos automatic saving is required. PWA cannot reliably do this; Capacitor or native Swift is needed.
- Whether AI should always require login, or whether the personal API key field should remain visible long term.
- Whether Cloud Pull should skip local-newer records, keep both copies, or ask case by case.
- Whether backups should stay as JSON or move to ZIP when photo volume grows.
- Whether PDF export should become a generated file instead of browser print-to-PDF.
