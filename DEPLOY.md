# Deployment Guide

This project builds to static files and deploys to shared hosting by uploading the `dist/` contents.

## 1. Prepare Environment Variables
Create `.env.local` in the project root with the production Supabase and GA values:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 2. Build The Site
Run:

```bash
npm install
npm run build
```

This outputs the production site to `dist/`.

## 3. Verify Build Output
Before uploading, confirm `dist/` contains:
- `index.html`
- `.htaccess`
- bundled assets under `dist/assets/`
- `robots.txt`
- `sitemap.xml`

## 4. Upload Via FTP Or cPanel
1. Open your hosting FTP client or cPanel File Manager.
2. Navigate to `public_html/` or your domain root.
3. Remove or archive the previous site files if needed.
4. Upload the full contents of `dist/` into the domain root.
5. Confirm `.htaccess` is uploaded alongside `index.html`.

Do not upload the `dist/` folder itself as a nested directory. Upload its contents.

## 5. Post-Upload Checks
After upload:
1. Visit `https://kbsnigeria.com/`
2. Refresh a nested route directly, for example `https://kbsnigeria.com/about`
3. Confirm SPA routing works without a server 404
4. Check `https://kbsnigeria.com/sitemap.xml`
5. Check contact/admissions forms and admin login

## 6. Optional Search Setup
After launch:
1. Submit `https://kbsnigeria.com/sitemap.xml` to Google Search Console
2. Verify GA4 is receiving traffic

## Notes
- The frontend never stores the Resend API key.
- Email sending is handled by Supabase Edge Functions.
- Shared hosting deployment is static-only; Supabase remains the backend service.
