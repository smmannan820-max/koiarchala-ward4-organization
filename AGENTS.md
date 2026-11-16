# AGENTS.md

Bengali community-organization website for "কৈয়ারচালা ৪নং ওয়ার্ড উন্নয়ন সংগঠন". All user-facing text is Bengali; keep it that way.

## Architecture

- **Framework:** TanStack Start on Netlify (`@netlify/vite-plugin-tanstack-start`). Server logic lives in TanStack server functions (`createServerFn`) in `src/lib/*.functions.ts`, plus one API route for photos.
- **Data:** Netlify Database (Postgres) via Drizzle (`drizzle-orm@beta`). Schema in `db/schema.ts`, client in `db/index.ts`, migrations in `netlify/database/migrations/` (generate with `npx drizzle-kit generate --name <name>`; never apply them manually).
  - `applications` — membership applications; `status` is `pending | approved | rejected`.
  - `members` — public people; `category` is `leader | advisor | committee`, ordered by `sort_order`.
- **Photos:** Netlify Blobs store `photos`. Images are resized in the browser (`src/lib/image-resize.ts`) to ≤600px JPEG and sent as data URLs; `src/lib/photos.server.ts` stores them. Served by `src/routes/api/photo.$key.ts`. Keys prefixed `app-` (applicant photos) are admin-only; `member-` keys are public.
- **Auth:** Netlify Identity (`@netlify/identity`). `src/lib/auth.functions.ts` exposes `getAdminUser` and the `requireAdmin` middleware — every admin server function must use `requireAdmin`. Admin = Identity user whose `app_metadata.roles` contains `admin`. Identity email links land on `/`; `AuthCallbackRedirect` forwards their hash to `/admin/login`, which handles invite / recovery / confirmation.

## Key directories

- `src/routes/` — pages: `index`, `about`, `activities`, `leadership`, `committee`, `membership`, `admin/login`, `admin/index`, `api/photo.$key`
- `src/components/site/` — header, footer, emblem, page hero, member cards, photo picker
- `src/components/admin/` — dashboard panels (applications review, members CRUD)
- `src/lib/site.ts` — org constants, nav, static activity content, Bengali digit/date helpers, Image CDN helper
- `public/img/` — generated photography; always reference via `cdnImage()` (Netlify Image CDN)

## Conventions

- Theme colors in `src/styles.css` (`--primary` green, `--deep` dark green, `--gold` accent). Headings use Noto Serif Bengali, body Hind Siliguri.
- Display numbers with `toBn()` and dates with `formatBnDate()`.
- Server-thrown error messages meant for users are in Bengali; `errorMessage()` falls back to a generic Bengali message for anything else.
- Public loaders call `listMembers().catch(() => [])` so public pages render even if the DB is unreachable.

## Non-obvious decisions

- The original request mentioned Firebase Firestore; the site uses Netlify Database + Blobs instead so all data stays on the hosting platform with no external keys.
- Stats, phone, and email in `src/lib/site.ts` are placeholders the organization should replace.
