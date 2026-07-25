# Deploying Monarque Limo on Vercel

This project is a Next.js application with Prisma and MySQL. Vercel hosts the application; the MySQL database must be hosted separately because a local XAMPP database cannot be reached from Vercel.

> Important: Vercel functions have an ephemeral filesystem. The current fleet image upload route writes files into `public/images/fleet/uploads`, which is suitable for local development but will not persist on Vercel. Before enabling production uploads, store uploaded images in object storage (for example Vercel Blob, Cloudinary, or Amazon S3) and save the returned public URL in `Vehicle.imageUrl`.

## 1. Prepare a production MySQL database

Create a hosted MySQL database with a provider that allows connections from Vercel, such as PlanetScale, Aiven, Railway, DigitalOcean, or an existing publicly reachable MySQL server.

Create a database and a least-privileged application user. Copy the provider's connection string. It should resemble:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/monarque_limo"
```

If the provider requires TLS, use the connection string it provides, including its required SSL parameters. Do not use the local XAMPP connection string in Vercel.

## 2. Commit and push the application

Push the project to GitHub, GitLab, or Bitbucket. Do not commit `.env` or any real credentials.

Before deploying, verify locally:

```bash
npm ci
npx prisma generate
npm run build
```

## 3. Create the Vercel project

1. Sign in at [Vercel](https://vercel.com/).
2. Select **Add New** → **Project** and import the repository.
3. Keep the framework preset as **Next.js** and the root directory as the repository root.
4. Leave the install command as `npm install` (or set it to `npm ci`).
5. Use `npm run build` as the build command.

## 4. Add Vercel environment variables

In **Project Settings** → **Environment Variables**, add these values for the Production environment (and Preview too if preview deployments need the app):

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/monarque_limo"
JWT_SECRET="a-long-random-secret"
ADMIN_EMAIL="admin@your-domain.com"
ADMIN_PASSWORD="a-strong-one-time-admin-password"
SMTP_HOST="smtp.your-provider.com"
SMTP_PORT="587"
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-password"
SMTP_FROM="Monarque Limo <no-reply@your-domain.com>"
NOTIFY_EMAIL="owner@your-domain.com"
NEXT_PUBLIC_SITE_NAME="Monarque Limo"
```

`JWT_SECRET` should be a long random value. Generate one, for example:

```bash
openssl rand -base64 48
```

Only configure SMTP variables when booking emails should be sent. The site can run without them, but email notifications will be skipped.

## 5. Apply Prisma migrations and seed the database

Run migrations once against the production database from a trusted machine or your CI workflow. Load the production `DATABASE_URL` into that environment, then run:

```bash
npx prisma migrate deploy
```

For a brand-new database, add the starter admin account and sample content:

```bash
npm run seed
```

Run the seed command only after setting `ADMIN_EMAIL` and `ADMIN_PASSWORD`. It is safe to re-run, but it does not change an existing admin user's password.

Do not put `prisma migrate dev` in the Vercel build command; it is intended for local development. Apply future committed migrations with `prisma migrate deploy` before or as part of your controlled CI release process.

## 6. Deploy and connect the domain

Click **Deploy** in Vercel. Vercel installs dependencies, generates the Prisma client through the project's `postinstall` script, and builds the Next.js app.

After a successful deployment:

1. Open the generated `*.vercel.app` URL and check the home page, fleet page, blog, booking form, and `/admin/login`.
2. In **Project Settings** → **Domains**, add the production domain.
3. Add the DNS records Vercel displays at your domain provider.
4. Make the domain the production domain and update any public site URL setting used by your email provider, if applicable.

## 7. Post-deployment checks

- Confirm Vercel logs show successful database access.
- Log in to `/admin/login` using the seeded admin account.
- Submit a test booking and confirm the record appears in the admin dashboard.
- Verify SMTP delivery if email notifications are enabled.
- Verify fleet images: static placeholder images work immediately; production admin uploads require external object storage as described above.

## Ongoing releases

Every push to the production branch configured in Vercel creates a deployment. For a database schema update, commit the generated Prisma migration, run `npx prisma migrate deploy` against production, and then deploy the application code that depends on it.
