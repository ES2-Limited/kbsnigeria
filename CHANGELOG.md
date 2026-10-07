# Changelog

## 2026-08-24

### Premium Polish Pass

#### Foundation
- Added missing `boxShadow.card`, `shadow-card-hover`, and `shadow-glow` Tailwind tokens (fixes the silently broken `shadow-card` class in `Card.jsx`).
- Added Tailwind keyframes and animations: `shimmer`, `float-slow`, `marquee`.
- Added brand-tinted `::selection`, styled slim scrollbar (WebKit + Firefox), native smooth-scroll, and a global `prefers-reduced-motion` media query that kills CSS animations/transitions for reduced-motion users.
- Fixed `WaveDivider` `colour`/`color` prop inconsistency.
- Removed dead code: `PageTransition.jsx`, `fadeUpItemVariants` function signature simplified to a static variant object; adopted `staggerContainerMotion` + `fadeUpItemVariants` for stagger cascade grids on Home, News, and Academics.

#### Lenis Smooth Scrolling
- Installed `lenis` (~4 kB) and added `SmoothScrollProvider` in `MainLayout` with automatic reduced-motion disable; exposed `scrollToElement` helper used by hero scroll-cue and News pagination.

#### Three.js Hero Scene
- Installed `three` (lazy-loaded into its own 190 kB gzipped vendor chunk via `manualChunks`) and added `HeroScene3D` — a self-contained floating-shapes scene in brand colours (cyan, navy, purple, lavender, gray) with pointer parallax, DPR cap, visibility-gated rendering, and graceful fallback to the static illustration when WebGL is unavailable or reduced motion is active.

#### Skeleton Shimmer
- Upgraded all loading skeletons from `animate-pulse` to a brand-gradient shimmer sweep (`bg-[length:200%_100%] animate-shimmer`) across public pages and all admin loading states.

#### Card & Micro-interactions
- Aligned `Card.jsx` hover to DESIGN.md (`y:-4`), added `shadow-card-hover` CSS class.
- Upgraded `ScrollProgress` bar to a three-tone brand gradient (`brand-primary → brand-accent → brand-purple`).
- Shrank Header padding + strengthened backdrop blur on scroll (shrink-on-scroll effect).
- Footer: added slide-in underline hover effect on Useful Links; social icons get hover lift + translucent background.

#### Gallery Lightbox
- Added directional `AnimatePresence` crossfade between lightbox images (left/right slide based on navigation direction); styled counter as a branded pill badge; arrow buttons now have `whileHover`/`whileTap` spring micro-interactions.
- Gallery grid thumbnails get zoom-on-hover (`scale-105`) + caption overlay slide-up.

#### Testimonial Carousel
- Converted `TestimonialsSection` to an auto-advancing crossfade carousel (6 s interval, pauses on hover/touch, arrow + dot navigation, keyboard accessible); falls back to the original 3-column static grid for reduced-motion users.

#### Marquee Values Strip
- Added `MarqueeStrip` (pure CSS infinite marquee) between stats bar and About teaser; lists NERDC Aligned, Safe School Practices, WAEC Prep, etc.; pauses on hover; stops under reduced motion.

#### Page Passes
- Added entrance animations to NotFound (404), ErrorPage, and Unsubscribe (previously zero-motion).
- Replaced per-item `ScrollReveal` delays on News card grid and Academics cards with `staggerContainerMotion` + `fadeUpItemVariants` for a smoother cascade reveal.

### Verification
- Lint clean (0 problems), build ✓, `npm test` 5 files / 16 passing.
- Three.js vendor chunk isolated at 734 kB raw / 190 kB gzip, lazy-loaded only on homepage after first paint.

## 2026-05-20

### Project Scaffold
- Initialized the project with Vite 5 and React 18.
- Installed the required dependencies from `docs/TRD.md` Section 1: `react-router-dom`, `@supabase/supabase-js`, `framer-motion`, `@tiptap/react`, `@tiptap/starter-kit`, `lucide-react`, and `react-helmet-async`.
- Added Tailwind CSS v3, PostCSS, Autoprefixer, and `@tailwindcss/typography`.
- Created the TRD folder structure across `public/`, `src/`, and `supabase/functions/`.
- Added `.env.local` placeholders for Supabase and GA.
- Added shared-hosting SPA routing rules in `.htaccess`.

### Design Tokens And Base Styling
- Configured `tailwind.config.js` with the KBS colour tokens from `docs/DESIGN.md` Section 2.
- Configured `tailwind.config.js` with the KBS font families from `docs/DESIGN.md` Section 3.
- Added the Google Fonts import for Reem Kufi, Amiri, and Inter in `index.html`.
- Created `src/styles/index.css` with Tailwind directives and CSS custom properties for colours, gradients, fonts, and type scale tokens.

### Routing And App Foundation
- Replaced the default Vite starter app with the project router setup.
- Added `src/router/index.jsx` with all public and admin routes from `docs/TRD.md` Section 8.
- Added `src/router/AdminRoute.jsx` to protect `/admin/*` routes using Supabase auth state.
- Added `src/lib/supabase.js` to initialize the Supabase client.
- Added `src/hooks/useAuth.js` and stubbed `useNews.js`, `useGallery.js`, and `useResources.js`.
- Added stub pages for all public routes, admin routes, and the unsubscribe route required by the TRD routing section.

### UI Component Library
- Added shared utility `src/lib/cn.js` for class name composition.
- Built the design system components in `src/components/ui/`:
  - `Button.jsx`
  - `Card.jsx`
  - `Badge.jsx`
  - `Input.jsx`
  - `Textarea.jsx`
  - `Modal.jsx`
  - `NewsCard.jsx`
  - `ResourceItem.jsx`
  - `SectionHeader.jsx`
  - `WaveDivider.jsx`
  - `LoadingSpinner.jsx`
  - `EmptyState.jsx`
- Implemented Framer Motion interactions with `useReducedMotion()` guards where animation is used.
- Added the development-only showcase page at `/dev/components` in `src/pages/dev/ComponentShowcase.jsx`.

### Layout Shells
- Added `src/components/layout/Header.jsx` with:
  - sticky desktop navigation
  - active route styling
  - scroll state via `IntersectionObserver`
  - mobile drawer navigation
  - hamburger-to-X Framer Motion morph animation
- Added `src/components/layout/Footer.jsx` with:
  - responsive multi-column layout
  - quick links
  - tappable contact details
  - social links
  - inline newsletter subscribe form
- Added `src/components/layout/MainLayout.jsx` to wrap public routes with header and footer.
- Added `src/components/layout/AdminLayout.jsx` for the admin shell with desktop sidebar and mobile top navigation.
- Wired `MainLayout` and `AdminLayout` into `src/router/index.jsx`.

### Placeholder Policy Update
- Removed the generated SVG placeholder file at `src/assets/logo.svg`.
- Replaced the showcase empty-state illustration stub with a styled `div` placeholder to keep illustration work deferred to Phase 7.

### Verification
- Verified the scaffold and later changes with `npm run dev`.
- Verified production builds with `npm run build` after the scaffold, component library, layout shell, and placeholder updates.

### Homepage Build
- Replaced the `src/pages/Home.jsx` stub with the full homepage structure from `docs/DESIGN.md` Section 8.1.
- Added the hero section with gradient background, animated heading, CTA buttons, illustration placeholder, and bottom wave divider.
- Added the animated stats bar with `useInView` and `animate` count-up behaviour.
- Added the about teaser, academics teaser, latest news, gallery teaser, admissions CTA banner, and newsletter subscribe sections.
- Added loading skeletons and empty states for the latest news and gallery teaser sections.
- Kept illustration areas as styled placeholders pending the later illustration phase.

### Homepage Data Hooks
- Implemented `src/hooks/useNews.js` to fetch the latest published news posts from Supabase.
- Implemented `src/hooks/useGallery.js` to fetch recent gallery images from Supabase.
- Added `src/hooks/useNewsletterSubscription.js` to submit newsletter subscriptions through the `send-confirmation` Supabase Edge Function.

### Homepage Support Updates
- Updated `src/components/ui/WaveDivider.jsx` to support the `surface-grey` token alias used by section transitions.

### Homepage Verification
- Verified the homepage changes with `npm run build`.
- Verified the homepage changes with `npm run dev -- --host 127.0.0.1 --port 4173`.

### Core Content Pages
- Replaced the `About.jsx`, `Academics.jsx`, and `Admissions.jsx` stubs with full page implementations aligned to `docs/DESIGN.md` and the PRD acceptance criteria.
- Built the About page with a hero banner, founding story, mission and vision cards, principal message section, staff grid, and affiliations strip.
- Built the Academics page with a hero banner and animated tier switcher for Nursery, Primary, and JSS including age ranges, key subjects, extracurriculars, and NERDC alignment notes.
- Built the Admissions page with a hero banner, animated admissions process steps, requirements list, enquiry form, tappable contact links, Google Maps embed, and floating WhatsApp contact button.

### New Hooks And UI Support
- Added `src/hooks/useEnquirySubmission.js` to submit admissions enquiries through the `send-enquiry` Supabase Edge Function.
- Added `src/components/ui/IllustrationPlaceholder.jsx` to standardise Phase 7 illustration placeholders across new content pages.

### Content Page Verification
- Verified the About, Academics, and Admissions page changes with `npm run build`.
- Verified the About, Academics, and Admissions page changes with `npm run dev -- --host 127.0.0.1 --port 4173`.

### Remaining Public Pages
- Replaced the `News.jsx`, `NewsPost.jsx`, `Gallery.jsx`, `Resources.jsx`, and `Contact.jsx` stubs with full public page implementations.
- Built the News index page with a hero banner, published post feed from Supabase, responsive news card grid, loading skeletons, and empty state.
- Built the News post page with a full-width cover image, centred article column, sanitized Tiptap HTML rendering, Tailwind typography styling, share actions, and redirect behavior when a slug is not found.
- Built the Gallery page with a masonry image grid, lazy-loaded images, fullscreen lightbox controls, keyboard navigation, and empty state.
- Built the Resources page with category filter tabs, newest-first list rendering, and category-aware empty states.
- Built the Contact page with tappable contact details, Google Maps embed, enquiry form, newsletter signup widget, and Phase 7 illustration placeholder.

### Public Page Data And Utilities
- Installed `dompurify` for safe sanitization of stored rich-text HTML in news posts.
- Added `src/lib/motion.js` for shared fade-up and staggered motion helpers.
- Extended `src/hooks/useNews.js` with full-list and single-post-by-slug fetching support.
- Updated `src/hooks/useGallery.js` to support fetching the full gallery as well as limited teaser sets.
- Implemented `src/hooks/useResources.js` to fetch downloadable resources from Supabase.
- Updated `src/components/ui/Modal.jsx` to support lightbox-specific title and close-button styling.

### Remaining Public Page Verification
- Verified the remaining public page changes with `npm run build`.
- Verified the remaining public page changes with `npm run dev -- --host 127.0.0.1 --port 4173`.

### Supabase Backend
- Replaced the previous Supabase migration with `supabase/migrations/001_init.sql` to match the requested backend setup.
- Added the TRD database schema for `news_posts`, `gallery_images`, `resources`, `newsletter_subscribers`, and `newsletter_sends`.
- Added supporting database objects for backend operation, including `function_rate_limits`, `handle_updated_at()`, request header access, and rate-limit helper functions.
- Added row-level security policies for public reads, authenticated admin writes, public newsletter subscription inserts, and token-based subscriber updates.
- Added the four public storage buckets from the TRD with public-read and authenticated-write policies.
- Seeded the database with 2 published news posts and 3 gallery image records for local testing.

### Supabase Edge Functions
- Added shared Supabase Edge Function helpers under `supabase/functions/_shared/` for CORS, JSON responses, Supabase clients, Resend integration, and input validation.
- Implemented `supabase/functions/send-enquiry/index.ts` with payload validation, IP rate limiting, and dual email delivery via Resend.
- Implemented `supabase/functions/send-confirmation/index.ts` for newsletter opt-in creation and confirmation email delivery.
- Implemented `supabase/functions/confirm-subscription/index.ts` for token-based subscription confirmation.
- Implemented `supabase/functions/send-newsletter/index.ts` for authenticated newsletter delivery, unsubscribe token preparation, batch sending, and send logging.

### Supabase Tooling Docs
- Added `supabase/README.md` with local Supabase startup, function serving, environment variable, and deployment instructions.

### Backend Notes
- Installed `dompurify` earlier for frontend news post sanitization; no additional runtime package was required for the Edge Functions.
- Supabase migrations and Edge Functions were created, but local `supabase start` was not executed in this session.

### Admin Panel
- Built the complete authenticated admin panel across `src/pages/admin/` for login, dashboard, gallery, news, resources, and newsletter management.
- Updated admin routing so authenticated users are redirected from `/admin` to `/admin/dashboard` and added the protected dashboard route.
- Updated `AdminLayout` navigation to use the new dashboard route and added sign-out controls for desktop and mobile admin navigation.

### Admin Editing And Utilities
- Added `src/components/ui/RichTextEditor.jsx` using Tiptap with toolbar actions for bold, italic, H2/H3, bullet lists, numbered lists, and image embeds by URL.
- Installed `@tiptap/extension-image` to support news and newsletter image embeds in the admin editor.
- Added `src/lib/slugify.js` for auto-generating news slugs from titles.
- Added `src/pages/admin/_helpers.js` for admin-side date formatting and storage path parsing.

### Admin Module Features
- Implemented admin login with `signInWithPassword`, inline error handling, and redirect to `/admin/dashboard`.
- Implemented dashboard summary counts for news posts, gallery images, resources, and newsletter subscribers, plus quick-action links.
- Implemented gallery management with multi-file image uploads, Supabase Storage uploads to the `gallery` bucket, row inserts to `gallery_images`, thumbnail listing, and delete actions.
- Implemented news management with list view, create/edit flows, cover image upload to the `news-covers` bucket, slug generation, draft/published state handling, rich text editing, and delete actions.
- Implemented resources management with file upload to the `resources` bucket, title/category fields, newest-first listing, and delete actions.
- Implemented newsletter management with compose and subscribers tabs, optional banner upload to `newsletter-banners`, preview modal, send action through the `send-newsletter` Edge Function, subscriber table, manual add, and remove actions.

### Admin Verification
- Verified the admin panel changes with `npm run build`.
- Verified the admin panel changes with `npm run dev -- --host 127.0.0.1 --port 4173`.

### Quality Pass
- Added a shared `PageSeo` component and applied SEO metadata across all public routes, including Open Graph tags and canonical URLs for news posts.
- Added route-level `React.lazy` + `Suspense` code splitting for public, admin, and development routes.
- Updated `vite.config.js` to copy `.htaccess` into `dist/` during builds and to split major dependency groups into separate chunks.
- Added `DEPLOY.md` with FTP/shared-host deployment steps aligned to the TRD deployment section.
- Replaced the placeholder sitemap with a static-route `public/sitemap.xml`.
- Added public-page fetch error states where they were missing and wired the footer newsletter form to the real newsletter subscription flow.
- Improved tap-target sizing and focus visibility in navigation, footer links, news links, and global interactive styles.
- Added explicit `width` and `height` attributes to public content images and confirmed lazy loading on fetched gallery/news images.

### Quality Pass Verification
- Verified production build output after the quality pass with `npm run build`.
- Confirmed `dist/.htaccess` is present after build.
