# Design System & UI Specification
## KBS Nigeria Website Revamp
**Version:** 1.0 | **Date:** 2026-05-20 | **Status:** Draft

---

## 1. Design Principles

**Playful but trustworthy.** Parents need to trust the school with their children. The design must feel warm, energetic, and modern — not childish or amateurish.

**Illustrations over stock photos.** Real school photography is layered alongside custom SVG illustrations to give the site a distinctive, ownable identity that no competitor can copy.

**Mobile-first, always.** Every layout decision starts at 320px and scales up. Touch targets, spacing, and typography are sized for thumbs first.

**Delight in the details.** Micro-animations and hover states reward exploration. Nothing should feel static or corporate.

---

## 2. Brand Colours

Extracted from the KBS logo (KBSLOGO-1.jpeg).

### Primary Palette

| Name | Hex | Usage |
|------|-----|-------|
| **KBS Cyan** | `#29ABE2` | Primary CTA buttons, borders, highlights, links |
| **KBS Navy** | `#1F2E7A` | Primary headings, footer background, nav |
| **KBS Purple** | `#6B5FA5` | Accents, tags, secondary illustrations, hover states |
| **KBS Lavender** | `#B0A8D0` | Illustration fills, decorative backgrounds, dividers |

### Extended Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Soft White** | `#F8F9FF` | Page background, card backgrounds |
| **Light Grey** | `#EEF0F8` | Section alternating backgrounds |
| **Dark Text** | `#1A1A2E` | Body copy, labels |
| **Medium Text** | `#4A4A6A` | Secondary text, captions |
| **Success Green** | `#22C55E` | Form success states |
| **Error Red** | `#EF4444` | Form error states |

### Gradient
```css
/* Hero and feature backgrounds */
background: linear-gradient(135deg, #1F2E7A 0%, #6B5FA5 100%);

/* CTA section */
background: linear-gradient(135deg, #29ABE2 0%, #1F2E7A 100%);
```

### Tailwind Config Extension
```js
// tailwind.config.js
colors: {
  kbs: {
    cyan:     '#29ABE2',
    navy:     '#1F2E7A',
    purple:   '#6B5FA5',
    lavender: '#B0A8D0',
  },
  surface: {
    white: '#F8F9FF',
    grey:  '#EEF0F8',
  },
  text: {
    dark:   '#1A1A2E',
    medium: '#4A4A6A',
  }
}
```

---

## 3. Typography

### Font Stack

| Role | Font | Weight | Source | Character |
|------|------|--------|--------|-----------|
| **Display / Hero headings** | Reem Kufi | 400, 500, 700 | Google Fonts | Kufic-inspired geometric letterforms — dignified, structured, distinctive |
| **Calligraphy / Taglines & pull quotes** | Amiri | 400, 400i, 700 | Google Fonts | Arabic calligraphic tradition, high-contrast elegant serif |
| **Body / UI / Admin** | Inter | 400, 500, 600 | Google Fonts | Neutral, highly legible — never competes with display fonts |

### Where Each Font Appears

**Reem Kufi** (Kufic display):
- Hero heading (school name, page titles)
- Section headings (H1, H2)
- Stat counter numbers
- Navigation logo wordmark if ever needed

**Amiri** (calligraphy):
- School tagline: *"...nurturing great minds"*
- Pull quotes and testimonials
- Decorative section intro lines (e.g. *"Welcome to KBS"* above a heading)
- Section overlines (small calligraphic text above a bold Reem Kufi heading)
- News post drop caps (optional)

**Inter** (body):
- All paragraph text
- Form labels, inputs, buttons
- Navigation links
- Admin panel throughout (calligraphic fonts are unsuitable for dense UI)
- Captions, tags, badges

### Pairing in Practice

```
[Amiri italic, small, #6B5FA5]   "Nurturing great minds since 1999"
[Reem Kufi bold, large, #1F2E7A] Where Every Child Discovers Their Potential
[Inter regular, #4A4A6A]         At KBS, we believe every child has...
```

The contrast between Reem Kufi's geometric Kufic structure and Amiri's flowing calligraphic curves creates a layered, culturally resonant typographic voice that is unique in the Nigerian school space.

### Type Scale

| Token | Font | Size | Line Height | Weight | Usage |
|-------|------|------|-------------|--------|-------|
| `text-display` | Reem Kufi | 3.5rem (56px) | 1.15 | 700 | Hero heading |
| `text-h1` | Reem Kufi | 2.5rem (40px) | 1.2 | 700 | Page titles |
| `text-h2` | Reem Kufi | 1.875rem (30px) | 1.3 | 500 | Section headings |
| `text-h3` | Inter | 1.375rem (22px) | 1.4 | 600 | Card headings, sub-sections |
| `text-h4` | Inter | 1.125rem (18px) | 1.4 | 600 | Labels, overlines |
| `text-calligraphy` | Amiri | 1.25rem (20px) | 1.6 | 400i | Taglines, pull quotes, overlines |
| `text-body-lg` | Inter | 1.125rem (18px) | 1.7 | 400 | Lead paragraphs |
| `text-body` | Inter | 1rem (16px) | 1.7 | 400 | General body copy |
| `text-small` | Inter | 0.875rem (14px) | 1.6 | 400 | Captions, metadata |
| `text-xs` | Inter | 0.75rem (12px) | 1.5 | 500 | Tags, badges |

**Mobile scale:** Display and H1 reduce by ~25% on screens < 640px. Amiri calligraphy text reduces by ~15%.

### Tailwind Font Family Config
```js
// tailwind.config.js
fontFamily: {
  display:      ['"Reem Kufi"', 'sans-serif'],
  calligraphy:  ['Amiri', 'serif'],
  body:         ['Inter', 'sans-serif'],
}
```

Usage: `font-display`, `font-calligraphy`, `font-body`

### Google Fonts Import
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&family=Reem+Kufi:wght@400;500;700&display=swap" rel="stylesheet">
```

---

## 4. Spacing & Layout

### Spacing Scale (Tailwind default, key values)
```
4px   → gap-1   (tight internal padding)
8px   → gap-2   (icon + text gaps)
12px  → gap-3
16px  → gap-4   (base component padding)
24px  → gap-6   (card padding)
32px  → gap-8   (section internal spacing)
48px  → gap-12  (between major elements)
64px  → gap-16  (section vertical padding mobile)
96px  → gap-24  (section vertical padding desktop)
```

### Container
```css
max-width: 1200px;
padding-inline: 1.5rem;   /* mobile */
padding-inline: 2rem;     /* tablet+ */
margin-inline: auto;
```

### Grid
- **Desktop:** 12-column grid, 24px gutters
- **Tablet:** 8-column grid, 20px gutters
- **Mobile:** 4-column grid, 16px gutters

### Breakpoints
| Name | Min width | Tailwind prefix |
|------|-----------|-----------------|
| Mobile | 0 | (default) |
| Tablet | 640px | `sm:` |
| Laptop | 1024px | `lg:` |
| Desktop | 1280px | `xl:` |

---

## 5. Illustration System

### Style Direction
Custom SVG illustrations in a **flat, geometric style** with soft drop shadows. Inspired by modern edtech and school brands (Duolingo-adjacent but calmer). Characters are diverse and represent Nigerian children and teachers.

### Palette Constraint
Illustrations use only the KBS brand palette:
- Fills: Cyan, Navy, Purple, Lavender, Soft White, and skin tones
- No gradients inside characters — flat fills only
- Outlines: 2px stroke in a slightly darker shade of the fill

### Illustration Set (Required for v1)

| Asset | Used on | Description |
|-------|---------|-------------|
| `hero-scene.svg` | Homepage hero | Children studying + teacher, school building in background |
| `about-mascot.svg` | About page | Friendly owl or book character (school mascot) |
| `nursery-illo.svg` | Academics — Nursery | Young child with building blocks and ABC |
| `primary-illo.svg` | Academics — Primary | Child with globe, science flask, ruler |
| `jss-illo.svg` | Academics — JSS | Teenager with laptop, books, sports equipment |
| `admissions-illo.svg` | Admissions page | Parent + child walking towards school gate |
| `contact-illo.svg` | Contact page | Person with phone/map pin |
| `empty-gallery.svg` | Gallery (empty state) | Camera and photo frames |
| `404.svg` | 404 page | Lost character with a confused look |
| `wave-divider.svg` | Section transitions | Organic SVG wave, used between sections |

### SVG as React Components
All illustrations are exported as React components via SVGR:
```jsx
import HeroScene from '@/assets/illustrations/HeroScene'
// <HeroScene className="w-full max-w-lg" />
```

---

## 6. Component Specifications

### 6.1 Buttons

```
Primary:   bg-kbs-cyan  text-white   hover:bg-opacity-90  shadow-md
Secondary: border-2 border-kbs-cyan text-kbs-cyan hover:bg-kbs-cyan hover:text-white
Ghost:     text-kbs-navy underline hover:text-kbs-purple
Danger:    bg-red-500 text-white (admin only)
```

- Border radius: `rounded-full` (pill shape) for CTAs, `rounded-lg` for form actions
- Padding: `px-6 py-3` (default), `px-4 py-2` (small), `px-8 py-4` (large)
- All buttons have `transition-all duration-200`
- Minimum tap target: 44×44px

### 6.2 Cards

```
Background:  white
Border:      1px solid #EEF0F8
Border radius: rounded-2xl
Shadow:      shadow-sm hover:shadow-md
Transition:  hover:-translate-y-1 duration-300
Padding:     p-6
```

### 6.3 Navigation

**Desktop:**
- Sticky top, white background with subtle bottom border on scroll
- Logo left, nav links centre, "Enquire Now" CTA button right
- Nav links: `text-text-dark hover:text-kbs-cyan transition-colors`
- Active link: `text-kbs-cyan font-semibold`

**Mobile:**
- Hamburger icon (3 lines → X animation via Framer Motion)
- Full-screen overlay drawer from right
- Links stacked vertically, 56px height each
- CTA button at bottom of drawer

### 6.4 Section Dividers
SVG wave shapes between sections, alternating page background from `white` ↔ `surface-grey`. Wave colour matches the next section's background.

### 6.5 Form Inputs
```
Border:        1px solid #B0A8D0
Border radius: rounded-xl
Padding:       px-4 py-3
Focus:         border-kbs-cyan ring-2 ring-kbs-cyan/20 outline-none
Error:         border-red-400 ring-2 ring-red-400/20
```
Labels always visible above input (no placeholder-only labels).

### 6.6 Tags / Badges
```
Padding:       px-3 py-1
Border radius: rounded-full
Font size:     text-xs font-semibold uppercase tracking-wide
```
Category colours: Term Dates → cyan, Circulars → purple, Forms → navy.

---

## 7. Animation Specifications

All animations use Framer Motion. Follow these rules:
- **Duration:** 300–500ms for UI interactions, 600–800ms for entrance animations
- **Easing:** `easeOut` for entrances, `easeInOut` for transitions
- **No animation on reduced motion:** All animations wrapped in `useReducedMotion()` check

### Entrance Animations (scroll-triggered)
```js
// Fade up — used for most section content
initial: { opacity: 0, y: 30 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.6, ease: 'easeOut' }

// Stagger children (e.g. card grids, staff list)
staggerChildren: 0.1
```

### Homepage Hero
- Illustration slides in from right on page load: `x: 60 → 0`, `opacity: 0 → 1`, `duration: 0.8`
- Heading words animate in with stagger: `duration: 0.5`, `staggerChildren: 0.08`

### Animated Stats Counters
Numbers count up from 0 when scrolled into view using `useInView` + `animate(0, target, { duration: 2 })`.

### Navigation
- Mobile drawer: `x: '100%' → 0`, `duration: 0.3`, `ease: 'easeOut'`
- Hamburger → X: SVG path morph, `duration: 0.3`

### Hover States
- Cards: `whileHover: { y: -4 }`, `transition: { duration: 0.2 }`
- Buttons: CSS transition only (no Framer Motion — keeps bundle lean)
- Gallery thumbnails: scale + overlay fade, CSS only

### Page Transitions
Fade only: `opacity: 0 → 1`, `duration: 0.3` on route change.

---

## 8. Page-by-Page Layout Specs

### 8.1 Home

```
[NavBar — sticky]
[Hero]
  Left: Heading + tagline + 2 CTAs (Enquire Now / Learn More)
  Right: hero-scene.svg illustration
  Background: navy-to-purple gradient
  Wave divider bottom

[Stats Bar]
  3–4 animated counters: Years Operating · Students Enrolled · Staff Members · Classes
  Background: kbs-cyan

[About Teaser]
  Left: about-mascot.svg
  Right: Short paragraph + "Read More" link
  Background: white

[Academics Teaser]
  3 cards: Nursery · Primary · JSS
  Each: illustration + level name + brief line + arrow link
  Background: surface-grey
  Wave dividers top + bottom

[Latest News]
  3 news cards in a row (stacked on mobile)
  "View all news →" link
  Background: white

[Gallery Teaser]
  6-image mosaic grid, lazy-loaded
  "View full gallery →" CTA
  Background: surface-grey

[Admissions CTA Banner]
  Full-width, navy-to-cyan gradient
  Heading + subtext + "Enquire Now" button
  admissions-illo.svg right side

[Newsletter Subscribe]
  Centred, light background
  Name + email fields + subscribe button
  "Join X families already subscribed"

[Footer]
  Logo · Tagline
  Navigation links
  Contact details (address, phone, email)
  Social icons
  Copyright
  Background: kbs-navy, text white
```

### 8.2 News Index
- Hero banner: title "News & Announcements", wave bottom
- Grid of news cards: 3 columns desktop, 2 tablet, 1 mobile
- Each card: cover image, category tag, title, date, excerpt, "Read more →"

### 8.3 News Post
- Full-width cover image (max-height: 480px, object-cover)
- Max-width 720px article column, centred
- Rich text rendered from Tiptap HTML, with `prose` Tailwind typography plugin styling
- Share buttons (WhatsApp, copy link) below article

### 8.4 Gallery
- Filter bar: All | Events | Classes | Facilities (if categories added later)
- Masonry grid (CSS columns: 3 desktop, 2 tablet, 1 mobile)
- Lightbox: full-screen overlay, prev/next arrows, close button, image counter

### 8.5 Resources
- Category filter tabs: All | Term Dates | Circulars | Forms & Documents
- List layout (not grid) — each item: file icon, title, date, category badge, download button
- Empty state: empty-gallery.svg + "No resources uploaded yet"

### 8.6 Admin Panel
- Minimal, functional design — not playful (admins are working)
- Sidebar navigation on desktop, top nav on mobile
- White background, surface-grey sidebar
- Uses the same Tailwind config but no illustrations, no animations (beyond subtle transitions)

---

## 9. Iconography

Use **Lucide React** throughout. Key icons:

| Context | Icon |
|---------|------|
| Navigation menu | `Menu`, `X` |
| Download | `Download` |
| News | `Newspaper` |
| Gallery | `Image` |
| Resources | `FolderOpen` |
| Contact / Phone | `Phone` |
| Email | `Mail` |
| Location | `MapPin` |
| WhatsApp CTA | Custom WhatsApp SVG (brand colour `#25D366`) |
| Admin: upload | `Upload` |
| Admin: edit | `Pencil` |
| Admin: delete | `Trash2` |
| Admin: publish | `Eye` |
| Admin: draft | `EyeOff` |
| Admin: send | `Send` |
| Chevrons | `ChevronRight`, `ChevronDown` |

---

## 10. Responsive Behaviour Summary

| Element | Mobile (< 640px) | Tablet (640–1024px) | Desktop (> 1024px) |
|---------|-----------------|--------------------|--------------------|
| Navigation | Hamburger drawer | Hamburger drawer | Full horizontal nav |
| Hero layout | Stacked (text above illo) | Side-by-side | Side-by-side |
| Stats bar | 2×2 grid | 4 in a row | 4 in a row |
| Cards grid | 1 column | 2 columns | 3 columns |
| Gallery | 1 column | 2 columns | 3 columns masonry |
| Footer | Stacked sections | 2 columns | 4 columns |
| Admin sidebar | Top tab bar | Sidebar collapsed | Sidebar expanded |

---

## 11. Accessibility

- All images have descriptive `alt` text
- Colour contrast ratio ≥ 4.5:1 for all body text (WCAG AA)
- Focus indicators visible on all interactive elements (`focus-visible:ring-2`)
- Form fields have associated `<label>` elements
- Modal/lightbox traps focus and is dismissible via Escape key
- Animations respect `prefers-reduced-motion`
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<header>` used correctly

---

*Design decisions not covered here should default to Tailwind defaults and the KBS colour system. When in doubt: simple, spacious, and on-brand.*
