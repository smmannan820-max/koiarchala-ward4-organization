# কৈয়ারচালা ৪নং ওয়ার্ড উন্নয়ন সংগঠন — ওয়েবসাইট

> মানবতার সেবায়, মানুষের পাশে।

The official Bengali website for Koiarchala Ward 4 Development Organization: a green-and-white, mobile-friendly community site with an online membership application and a secure admin dashboard.

## Features

- **প্রচ্ছদ (Home)** — hero, impact stats, introduction, activities preview, leadership, call to action
- **আমাদের পরিচিতি (About)** — history, objectives, values
- **কার্যক্রম (Activities)** — social welfare projects (relief, health, education, environment, blood donors, infrastructure, youth, social safety)
- **নেতৃত্ব ও উপদেষ্টা (Leadership)** — President and General Secretary profiles plus a 20-seat advisory council (empty seats show placeholders)
- **কমিটি (Committee)** — searchable member cards with photo, designation, phone and address
- **সদস্যপদের আবেদন (Membership)** — online application form with optional photo
- **অ্যাডমিন (Admin)** — `/admin/login` (Netlify Identity) and `/admin` dashboard to approve / reject / delete applications and to add, edit or remove leaders, advisors and committee members

## Tech stack

- TanStack Start (React 19, TanStack Router, server functions) on Netlify
- Tailwind CSS 4 + shadcn/ui components, Hind Siliguri / Noto Serif Bengali fonts
- **Netlify Database** (managed Postgres) with Drizzle ORM — applications and members
- **Netlify Blobs** — member and applicant photos
- **Netlify Identity** — admin authentication (role `admin` required)
- **Netlify Image CDN** — optimized site imagery

## Running locally

```bash
pnpm install
netlify dev
```

`netlify dev` provides local Database and Blobs emulation. Identity login only works on the deployed site.

## Setting up the first admin

1. In the Netlify dashboard open **Identity → Invite users** and invite the admin's email.
2. The admin accepts the invite from their email (the link opens the site's admin login page to set a password).
3. Open the user in the Identity list and add the role **`admin`**.
4. Recommended: set Identity registration to **Invite only**.

## Editing content

Static text (organization contact details, activities, stats) lives in `src/lib/site.ts`. People (leaders, advisors, committee) are managed from the admin dashboard.
