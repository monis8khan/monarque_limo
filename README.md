# Monarque Limo — Booking, Blog & CMS Platform

A full-stack Next.js application for Monarque Limo: public marketing site
(SSR/SSG for SEO), a real booking system, a blog with a lightweight CMS, and
an admin dashboard to manage bookings, fleet, services, testimonials, blog
posts, and homepage trust-stat counters — all backed by MySQL via Prisma.

**Start here → [SETUP.md](./SETUP.md)** for step-by-step instructions
(XAMPP MySQL setup, `npm install`, migrate, seed, run).

## Stack
- Next.js (App Router) — single codebase for frontend + API routes
- MySQL + Prisma ORM
- JWT auth (httpOnly cookie) for the admin panel
- Nodemailer for booking confirmation emails
- Tailwind CSS

## Project structure
```
src/app/                → public pages (home, /blog, /blog/[slug])
src/app/admin/          → admin login + dashboard (bookings, blog, fleet,
                          services, testimonials, settings)
src/app/api/            → public API routes (bookings, vehicles, services,
                          testimonials, blog, settings)
src/app/api/admin/      → protected admin API routes (full CRUD + auth)
src/components/         → shared React components (BookingForm, AdminNav)
src/lib/                → Prisma client, auth helpers, mailer
prisma/schema.prisma    → database schema
prisma/seed.js          → launch content seed script
```

## Not yet implemented (by design — see the original audit/strategy notes)
- Payment processing (Stripe, deposits) — schema has room for it
  (`paymentStatus`, `stripePaymentIntentId` on Booking) but it's not wired up
- SMS notifications (Twilio) — currently email-only via Nodemailer
- Multi-city/per-service SEO landing pages beyond the blog
- Google Reviews widget / verified testimonial photos
