# Deploy Monarque Limo (SSR / Next.js) on a XAMPP-based server

This project is a single Next.js application with server-side rendering, API routes, and Prisma. On a server with XAMPP, you typically keep MySQL from XAMPP and run the Next.js app separately with Node.js.

## 1. Server prerequisites

Install on the server:

- Node.js 20.x or newer
- npm
- XAMPP with MySQL running
- Optional but recommended: PM2 for process management

### Install Node.js
On Windows, install Node.js from the official site and restart the terminal.

Verify:

```powershell
node -v
npm -v
```

### Install PM2 (recommended)

```powershell
npm install -g pm2
```

## 2. Prepare the database in XAMPP

1. Start MySQL from XAMPP Control Panel.
2. Open phpMyAdmin.
3. Create a database named:

```sql
monarque_limo
```

## 3. Upload the project files

Copy the project folder to the server, for example:

```powershell
C:\projects\monarque-limo
```

Open PowerShell in that folder.

## 4. Configure environment variables

Create or update the `.env` file in the project root:

```powershell
copy .env.example .env
```

Example values:

```env
DATABASE_URL="mysql://root:@localhost:3306/monarque_limo"
JWT_SECRET="replace-with-a-long-random-string"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="StrongPassword123"
PORT=3000
NEXT_PUBLIC_SITE_URL="http://your-domain-or-ip"
```

If your XAMPP MySQL uses a password, update the `DATABASE_URL` accordingly.

## 5. Install dependencies

```powershell
npm install
npx prisma generate
```

## 6. Run database migrations

```powershell
npx prisma migrate deploy
```

If this is a fresh server and you want the starter content, run:

```powershell
node prisma/seed.js
```

## 7. Build the app for production

```powershell
npm run build
```

## 8. Start the SSR app

### Option A: Start directly with Node

```powershell
$env:PORT="3000"
npm run start
```

### Option B: Start with PM2 (recommended)

```powershell
$env:PORT="3000"
pm2 start npm --name "monarque-limo" -- run start
```

If the command above fails, use:

```powershell
$env:PORT="3000"
pm2 start "npm run start" --name "monarque-limo"
```

Save PM2 process list:

```powershell
pm2 save
```

Start PM2 on boot:

```powershell
pm2 startup
```

## 9. Optional: expose it through XAMPP Apache

If you want your domain or server IP to point to the Next.js app through Apache, use a reverse proxy.

### Enable proxy modules in Apache

Edit the Apache config file, usually:

```text
C:\xampp\apache\conf\httpd.conf
```

Uncomment these lines if they are disabled:

```apache
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
```

### Add a virtual host

Edit:

```text
C:\xampp\apache\conf\extra\httpd-vhosts.conf
```

Add:

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/
</VirtualHost>
```

Then restart Apache from XAMPP Control Panel.

## 10. Verify the deployment

Check the app:

- Public site: http://your-domain-or-ip/
- Admin login: http://your-domain-or-ip/admin/login

Check logs if something fails:

```powershell
pm2 logs monarque-limo
```

## Common issues

- MySQL connection errors: confirm XAMPP MySQL is running and the `DATABASE_URL` is correct.
- App does not load: verify the app is running on port `3000` and PM2 is healthy.
- Admin login fails: check `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` and rerun the seed script if necessary.
