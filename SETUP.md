# Monarque Limo — Local Setup Guide

This is a single Next.js app (frontend + backend + admin panel all in one
codebase) using MySQL via Prisma. There is only **one** `npm install` to run —
not separate frontend/backend installs — because the API lives inside Next.js
itself (see the note at the bottom if you were expecting two folders).

## 1. Start MySQL in XAMPP

1. Open the **XAMPP Control Panel**.
2. Click **Start** next to **MySQL** (you don't need Apache running for this
   project — Next.js runs its own server).
3. Open **phpMyAdmin** (XAMPP Control Panel → MySQL → Admin, or visit
   `http://localhost/phpmyadmin`).
4. Create a new database called `monarque_limo` (Databases tab → type the name
   → Create). Leave it empty — Prisma will create the tables for you.

By default, XAMPP's MySQL runs on port `3306` with user `root` and **no
password**. That's already reflected in `.env.example`.

## 2. Configure environment variables

In the project root:

```bash
cp .env.example .env
```

Open `.env` and check:

```
DATABASE_URL="mysql://root:@localhost:3306/monarque_limo"
```

If your XAMPP MySQL has a root password set, update it to:
```
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/monarque_limo"
```

Also set a real random string for `JWT_SECRET`, and set `ADMIN_EMAIL` /
`ADMIN_PASSWORD` to whatever you want your admin login to be — these are used
by the seed script to create your first admin user.

The `SMTP_*` values can be left as placeholders for now. If they're not
configured, the app will just log a warning and skip sending emails instead of
crashing — so bookings still work, they just won't send confirmation emails
until you plug in real SMTP credentials (Gmail app password, SendGrid,
Mailgun, etc).

## 3. Install dependencies

```bash
npm install
```

This installs Next.js, React, Prisma, and everything else in `package.json`,
and automatically runs `prisma generate` afterward (via the `postinstall`
script).

## 4. Create the database tables

```bash
npm run prisma:migrate
```

This reads `prisma/schema.prisma` and creates all the tables (bookings,
vehicles, services, testimonials, blog_posts, site_settings, users) inside the
`monarque_limo` database you created in phpMyAdmin. You'll see the tables
appear there once it's done.

## 5. Seed launch content

```bash
npm run seed
```

This creates:
- Your admin login (from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`)
- The 3 starter vehicles (Escalade ESV, Sprinter Extended, S-Class)
- The 6 starter services
- 3 starter testimonials
- The trust-stat counters (journeys completed, years of excellence, etc — no
  more hardcoded zeros)
- One sample published blog post

You can re-run `npm run seed` safely — it won't duplicate existing rows.

## 6. Run the app

```bash
npm run dev
```

Visit:
- **Public site:** http://localhost:3000
- **Blog:** http://localhost:3000/blog
- **Admin login:** http://localhost:3000/admin/login (use the email/password
  from your `.env`)

For a production-like run instead of dev mode:

```bash
npm run build
npm run start
```

## Troubleshooting

- **"Can't reach database server"** — MySQL isn't running in XAMPP, or the
  port/credentials in `DATABASE_URL` don't match your XAMPP setup.
- **"Unknown database 'monarque_limo'"** — you skipped creating the database
  in phpMyAdmin (step 1.4). Prisma creates tables, not the database itself.
- **Admin login fails** — double check `ADMIN_EMAIL`/`ADMIN_PASSWORD` in
  `.env` match what you're typing, and that you ran `npm run seed` after
  setting them (changing `.env` later doesn't retroactively update an already
  -created admin user — either re-seed against a fresh DB or update the user
  directly in phpMyAdmin's `User` table).
- **Uploaded images don't show** — they're saved to `/public/uploads`, make
  sure that folder exists and is writable (it's included in this zip with a
  `.gitkeep` placeholder).

## About "frontend" and "backend" folders

Earlier in planning this project we discussed Vite (frontend) + Express
(backend) as two separate things. We moved to **Next.js** instead specifically
so the public marketing pages and blog can be server-rendered for SEO (a pure
Vite/React SPA renders in the browser, which is worse for Google indexing a
local-service business like this one). Next.js merges frontend and backend
into one app: pages live in `src/app`, and the "backend" is the API routes in
`src/app/api`. There's one `npm install`, one `.env`, and one `npm run dev` —
not two separate projects to wire together.
