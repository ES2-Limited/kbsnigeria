# Storage Provider Guide: Cloudinary & Cloudflare R2

This application includes a unified storage abstraction layer located in [`src/lib/storage.js`](file:///c:/Users/ASUS%20ZENBOOK/Desktop/HeyTechDigital/kbsnigeria/src/lib/storage.js). You can easily switch between storage backends anytime without changing frontend component code.

---

## 1. Switching Storage Providers

In your `.env.local` (or deployment environment variables), simply toggle `VITE_STORAGE_PROVIDER`:

```env
# Options: 'cloudinary' | 'r2' | 'supabase'
VITE_STORAGE_PROVIDER=cloudinary
```

If `VITE_STORAGE_PROVIDER` is omitted:
* If `VITE_CLOUDINARY_CLOUD_NAME` is configured, it defaults to **Cloudinary**.
* If `VITE_R2_UPLOAD_ENDPOINT` is configured, it defaults to **Cloudflare R2**.
* Otherwise, it safely falls back to **Supabase Storage**.

---

## 2. Setting Up Cloudinary (Active)

Cloudinary allows secure, direct frontend uploads using an **Unsigned Upload Preset**.

### Steps:
1. Log in to your [Cloudinary Console](https://console.cloudinary.com/).
2. Copy your **Cloud Name** (found on the Dashboard / Settings).
3. Go to **Settings (gear icon)** → **Upload** tab.
4. Scroll down to **Upload presets** and click **Add upload preset**.
5. Change **Signing Mode** from *Signed* to **Unsigned**.
6. Set the Preset Name (e.g. `kbsnigeria_uploads` or `kbsnigeria`).
7. (Optional) Set the folder to `kbsnigeria` and enable format optimization (auto / WebP).
8. Click **Save**.

### Configure in `.env.local`:
```env
VITE_STORAGE_PROVIDER=cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=kbsnigeria_uploads
VITE_CLOUDINARY_FOLDER=kbsnigeria
```

When an admin uploads a gallery photo, news cover, newsletter banner, or resource document, it uploads directly to Cloudinary and saves the resulting CDN URL (`https://res.cloudinary.com/...`) into the Postgres database.

---

## 3. Moving to Cloudflare R2 (Upcoming)

Cloudflare R2 is an S3-compatible object storage service with **zero egress fees**.

Because client-side browsers cannot safely hold Cloudflare secret keys (`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`), frontend uploads interact with R2 via either:
1. **A lightweight Cloudflare Worker or API endpoint** that accepts the upload and puts it into R2.
2. **A presigned PUT URL endpoint** (e.g. a Supabase Edge Function or Cloudflare Worker).

### Configure in `.env.local`:
```env
VITE_STORAGE_PROVIDER=r2
VITE_R2_UPLOAD_ENDPOINT=https://upload.kbsnigeria.com/upload
VITE_R2_PUBLIC_URL=https://media.kbsnigeria.com
```

### Supported R2 Upload Formats:
[`src/lib/storage.js`](file:///c:/Users/ASUS%20ZENBOOK/Desktop/HeyTechDigital/kbsnigeria/src/lib/storage.js) automatically supports:
* **Direct Multipart POST**: The endpoint receives `FormData` (`file`, `key`, `bucket`), uploads to R2, and returns `{ url: "...", key: "..." }`.
* **Presigned PUT URL**: The endpoint returns `{ uploadUrl: "...", publicUrl: "..." }`, and the frontend automatically PUTs the file directly to the presigned URL!

---

## 4. Supabase Storage (Fallback / Legacy)

If you ever need to fall back to Supabase Storage:
```env
VITE_STORAGE_PROVIDER=supabase
```
This uses the existing Supabase storage buckets (`gallery`, `news-covers`, `newsletter-banners`, `resources`).

---

## 5. Backward Compatibility

All database tables (`gallery_images`, `news_posts`, `newsletter_sends`, `resources`) store standard URL strings. Existing assets (legacy WordPress photos, Supabase storage URLs, and new Cloudinary/R2 URLs) coexist smoothly with zero database schema migrations needed!
