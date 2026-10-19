# Gradebook
Next.js 14 + Tailwind. `npm install && npm run dev`. Deploy: private GitHub repo, import into Vercel.
## Data modes
- `DATA_MODE=mock` (default): sample data in `lib/data.ts`, demo login. State (hidden classes, to-do checks, settings) lives in localStorage.
- `DATA_MODE=live`: Schoology OAuth 1.0 (three-legged). See `.env.example`.
## Live flow
`/login` -> `/api/auth/start` (request token, redirect to the school's Schoology to approve; Schoology handles the school Google sign-in) -> `/api/auth/callback` (access token + `users/me`) -> encrypted httpOnly cookie `sb_session` -> `/api/data` (calls Schoology, maps to app types in `lib/schoology/load.ts`).
Tokens expire after 90 days; a 401 clears the cookie and the login page shows a reconnect message.
## School search
Schoology has no public "find a school" endpoint, so `/api/schools` searches `data/schools.json`. Add live schools as `{"name":"...","city":"...","state":"..","domain":"yourschool.schoology.com"}` (entries with `"demo":true` only show in mock mode). Users can also type their Schoology address.
## Theming
Themes and accent colors are CSS variables (`app/globals.css`, `lib/theme.ts`); users change them in Settings > Appearance.
## Known gaps
- Needs Schoology App Center approval to read other schools' users (unapproved apps get 401).
- `lib/schoology/load.ts` response mapping is untested against a real account.
- The school directory starts empty in live mode (add schools to `data/schools.json`). Tokens are kept in an encrypted cookie, not a database.
- Assigned/completed dates are approximations (Schoology data not mapped yet).
