# Changelog

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
