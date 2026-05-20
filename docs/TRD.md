# Technical Requirements Document
## KBS Nigeria Website Revamp
**Version:** 1.0 | **Date:** 2026-05-20 | **Status:** Approved

---

## 1. Technology Stack

| Layer | Choice | Version | Rationale |
|-------|--------|---------|-----------|
| UI Library | React | 18.x | Component-based, large ecosystem, team preference |
| Build Tool | Vite | 5.x | Fast HMR, optimised production builds, static output |
| Routing | React Router | v6 | Client-side routing, nested routes for admin |
| Styling | Tailwind CSS | v3 | Utility-first, rapid responsive development |
| Animation | Framer Motion | 11.x | Declarative scroll + micro-animations in React |
| Rich Text Editor | Tiptap | 2.x | Headless, React-native editor for admin news/newsletter |
| Backend / DB | Supabase | — | PostgreSQL DB, Storage, Auth, Edge Functions — all free tier |
| Email Delivery | Resend | — | Transactional + newsletter email via Supabase Edge Function |
| Icons | Lucide React | — | Consistent, lightweight icon set |
| Image handling | Browser-native + Supabase Storage | — | Upload, store, serve; auto-compression via transform params |
| Analytics | Google Analytics 4 | — | Free, standard |
| Hosting | Shared hosting (FTP upload of `/dist`) | — | Uses existing plan; no extra cost |

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                  Browser                         │
│   React SPA (Vite build → /dist on shared host) │
│                                                  │
│   Public pages     Admin panel (/admin/*)        │
│   (unauthenticated) (Supabase Auth guard)        │
└──────────────┬───────────────┬──────────────────┘
               │               │
               ▼               ▼
        ┌─────────────────────────┐
        │        Supabase         │
        │  ┌─────────────────┐   │
        │  │   PostgreSQL DB  │   │  news, gallery metadata,
        │  │                 │   │  resources, subscribers
        │  └─────────────────┘   │
        │  ┌─────────────────┐   │
        │  │    Storage      │   │  gallery images,
        │  │                 │   │  resource file uploads
        │  └─────────────────┘   │
        │  ┌─────────────────┐   │
        │  │      Auth       │   │  admin login / session
        │  │                 │   │
        │  └─────────────────┘   │
        │  ┌─────────────────┐   │
        │  │ Edge Functions  │   │  send emails via Resend
        │  │                 │   │  (API key never in browser)
        │  └─────────────────┘   │
        └─────────────────────────┘
```

**Why this shape:**
- React SPA built to static files → deployable on any shared host via FTP
- All sensitive API keys (Resend) live in Supabase Edge Functions only — never in the browser bundle
- Supabase free tier covers DB (500MB), Storage (1GB), Auth (50k MAU), and Edge Functions (500k calls/month) — sufficient for school scale indefinitely

---

## 3. Project Structure

```
kbsnigeria/
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── assets/
│   │   ├── illustrations/       # SVG illustration components
│   │   └── logo.svg
│   ├── components/
│   │   ├── ui/                  # Reusable primitives (Button, Card, Badge, Modal)
│   │   ├── layout/              # Header, Footer, MobileNav, AdminLayout
│   │   └── sections/            # Homepage section components
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Academics.jsx
│   │   ├── Admissions.jsx
│   │   ├── News.jsx
│   │   ├── NewsPost.jsx
│   │   ├── Gallery.jsx
│   │   ├── Resources.jsx
│   │   ├── Contact.jsx
│   │   └── admin/
│   │       ├── Login.jsx
│   │       ├── Dashboard.jsx
│   │       ├── AdminGallery.jsx
│   │       ├── AdminNews.jsx
│   │       ├── AdminResources.jsx
│   │       └── AdminNewsletter.jsx
│   ├── hooks/
│   │   ├── useAuth.js           # Supabase auth state
│   │   ├── useNews.js
│   │   ├── useGallery.js
│   │   └── useResources.js
│   ├── lib/
│   │   └── supabase.js          # Supabase client init
│   ├── router/
│   │   ├── index.jsx            # Route definitions
│   │   └── AdminRoute.jsx       # Auth guard wrapper
│   ├── styles/
│   │   └── index.css            # Tailwind base + custom CSS vars
│   ├── App.jsx
│   └── main.jsx
├── supabase/
│   └── functions/
│       ├── send-enquiry/        # Contact form → admin email
│       ├── send-newsletter/     # Newsletter blast via Resend
│       └── send-confirmation/   # Subscribe opt-in confirmation
├── .env.local                   # Never committed
├── .htaccess                    # SPA routing for shared host
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 4. Database Schema (Supabase / PostgreSQL)

### 4.1 `news_posts`
```sql
create table news_posts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text unique not null,
  excerpt     text,
  body        text not null,           -- Tiptap HTML output
  cover_url   text,                    -- Supabase Storage URL
  status      text default 'draft'     -- 'draft' | 'published'
              check (status in ('draft','published')),
  published_at timestamptz,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
```

### 4.2 `gallery_images`
```sql
create table gallery_images (
  id          uuid primary key default gen_random_uuid(),
  storage_path text not null,          -- path in Supabase Storage bucket
  url         text not null,           -- public URL
  caption     text,
  uploaded_at timestamptz default now()
);
```

### 4.3 `resources`
```sql
create table resources (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    text not null
              check (category in ('Term Dates','Circulars','Forms & Documents')),
  file_url    text not null,           -- Supabase Storage URL
  file_name   text not null,
  uploaded_at timestamptz default now()
);
```

### 4.4 `newsletter_subscribers`
```sql
create table newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  email       text unique not null,
  confirmed   boolean default false,
  token       text unique,             -- double opt-in confirmation token
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz
);
```

### 4.5 `newsletter_sends`
```sql
create table newsletter_sends (
  id            uuid primary key default gen_random_uuid(),
  subject       text not null,
  body          text not null,         -- Tiptap HTML output
  banner_url    text,
  sent_at       timestamptz default now(),
  recipient_count int,
  failed_count  int default 0
);
```

### Row-Level Security
- All tables: `select` is public for published content (`status = 'published'`), `insert/update/delete` requires authenticated admin session.
- `newsletter_subscribers`: no public read; insert allowed for subscribe action (unauthenticated); delete allowed for unsubscribe via token.

---

## 5. Supabase Storage Buckets

| Bucket | Contents | Public | Max file size |
|--------|----------|--------|---------------|
| `gallery` | Gallery images (JPG/PNG/WEBP) | Yes | 10MB |
| `resources` | Downloadable files (PDF/DOCX/XLSX) | Yes | 25MB |
| `news-covers` | News post cover images | Yes | 10MB |
| `newsletter-banners` | Newsletter banner images | Yes | 5MB |

Images served with Supabase Storage transform params for resizing: `?width=1200&quality=80` for gallery display, `?width=400&quality=70` for thumbnails.

---

## 6. Supabase Edge Functions

### `send-enquiry`
**Trigger:** POST from contact/admissions form  
**Action:** Sends formatted email to school admin + confirmation to parent  
**Payload:**
```json
{
  "parentName": "string",
  "childName": "string",
  "classLevel": "string",
  "phone": "string",
  "email": "string",
  "message": "string"
}
```

### `send-confirmation`
**Trigger:** POST on newsletter subscribe  
**Action:** Inserts subscriber row with `confirmed: false` + unique token; sends opt-in email with confirmation link  
**Payload:** `{ "name": "string", "email": "string" }`

### `confirm-subscription`
**Trigger:** GET with `?token=...` (linked from confirmation email)  
**Action:** Sets `confirmed: true`, clears token

### `send-newsletter`
**Trigger:** POST from admin newsletter compose page (authenticated)  
**Action:** Fetches all confirmed, non-unsubscribed subscribers; sends newsletter via Resend batch API; writes record to `newsletter_sends`  
**Payload:**
```json
{
  "subject": "string",
  "body": "string (HTML)",
  "bannerUrl": "string | null"
}
```
Each email includes a personalised unsubscribe link: `https://kbsnigeria.com/unsubscribe?token=...`

---

## 7. Authentication

- Provider: Supabase Auth (email + password)
- Single admin account — provisioned manually via Supabase dashboard at project setup
- No public registration route
- Session stored in `localStorage` via Supabase client
- `AdminRoute.jsx` component wraps all `/admin/*` routes — redirects unauthenticated visitors to `/admin` (login)
- Session refresh handled automatically by Supabase client

---

## 8. Routing

```jsx
// Public
/                         → Home
/about                    → About
/academics                → Academics
/admissions               → Admissions
/news                     → News (index)
/news/:slug               → NewsPost
/gallery                  → Gallery
/resources                → Resources
/contact                  → Contact
/unsubscribe              → Unsubscribe (token param)

// Admin (behind AdminRoute auth guard)
/admin                    → Login (if unauth) / Dashboard (if auth)
/admin/gallery            → AdminGallery
/admin/news               → AdminNews
/admin/news/new           → AdminNews (create mode)
/admin/news/:id/edit      → AdminNews (edit mode)
/admin/resources          → AdminResources
/admin/newsletter         → AdminNewsletter
```

---

## 9. Deployment

### Build
```bash
npm run build
# outputs: /dist
```

### Shared Hosting Deploy
1. Upload contents of `/dist` to `public_html/` (or domain root) via FTP / cPanel File Manager
2. Upload `.htaccess` to same root (handles SPA client-side routing)

### `.htaccess` (SPA routing)
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### Environment Variables (`.env.local`)
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```
`RESEND_API_KEY` is stored only in Supabase Edge Function environment variables — never in the frontend `.env`.

### DNS Configuration
| Record | Type | Value |
|--------|------|-------|
| `kbsnigeria.com` | A | Shared host IP (unchanged) |
| `www` | CNAME | `kbsnigeria.com` |
| `MX` records | — | Unchanged (school email unaffected) |

---

## 10. Performance Requirements

| Metric | Target |
|--------|--------|
| Lighthouse Performance (mobile) | ≥ 85 |
| Largest Contentful Paint (mobile) | < 3s |
| Cumulative Layout Shift | < 0.1 |
| First Input Delay | < 100ms |
| Bundle size (initial JS) | < 300KB gzipped |

**Strategies:**
- Route-based code splitting via `React.lazy` + `Suspense`
- All images served with `loading="lazy"` and explicit `width`/`height`
- Illustration SVGs inlined as React components (no extra HTTP requests)
- Tailwind CSS purged in production (< 10KB)
- Fonts loaded via `font-display: swap`

---

## 11. SEO

Since this is a React SPA (no SSR), SEO is addressed via:
- `react-helmet-async` for per-page `<title>`, `<meta description>`, Open Graph tags
- `sitemap.xml` pre-generated and placed in `/public`
- `robots.txt` in `/public`
- Semantic HTML throughout (correct heading hierarchy, `<article>`, `<nav>`, `<main>`, `<footer>`)
- Google Search Console registration post-launch
- News post URLs use human-readable slugs (`/news/term-1-2026-starts-january-13`)

---

## 12. Security

| Concern | Mitigation |
|---------|-----------|
| Admin credentials exposed | Supabase Auth — passwords hashed, no plaintext storage |
| Resend API key in browser | Key stored only in Supabase Edge Function env vars |
| Supabase anon key exposed | Acceptable — RLS policies restrict write operations to authenticated users |
| File upload abuse | Supabase Storage policies: only authenticated admin can write to buckets |
| Contact form spam | Honeypot field + rate-limit on Edge Function (1 call per IP per 60s) |
| XSS in rich text | Tiptap output sanitised with DOMPurify before storage and before render |

---

## 13. Browser Support

| Browser | Minimum version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Mobile Safari (iOS) | 14+ |
| Chrome Android | 90+ |

---

## 14. Development Setup

```bash
# Prerequisites: Node 20+, npm 10+

git clone <repo>
cd kbsnigeria
npm install

# Create .env.local with Supabase keys (see Section 9)

npm run dev        # http://localhost:5173
npm run build      # production build → /dist
npm run preview    # preview production build locally
```

**Supabase local dev:**
```bash
npm install -g supabase
supabase start     # local Supabase stack via Docker
supabase functions serve  # serve Edge Functions locally
```

---

*This TRD is the authoritative technical reference. All implementation decisions should be traceable to this document.*
