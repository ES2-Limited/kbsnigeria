# Product Requirements Document
## KBS Nigeria Website Revamp
**Version:** 1.2 | **Date:** 2026-05-20 | **Status:** Approved

---

## 1. Problem Statement

kbsnigeria.com is a 2017 WordPress build that is visually dated, slow on mobile, and entirely passive. It does not represent the quality of Knowledgebased Basic Science Schools to its primary audience — parents researching schools for their children. The replacement must be a lively, illustrated, interactive experience that parents and children genuinely enjoy using, while giving the school complete control over its own content through a built-in admin system.

---

## 2. Goals

| Goal | Measure | Target |
|------|---------|--------|
| Modern, engaging first impression | Avg. session duration | ≥ 2 min within 90 days of launch |
| Fast on mobile | Lighthouse mobile score | ≥ 85 |
| Drive admissions enquiries | Contact form / WhatsApp leads | ≥ 20/month post-launch |
| School runs content independently | Developer involvement for updates | Zero |
| Build newsletter audience | Active subscribers | ≥ 50 within 6 months |

### Non-Goals (v1)
- Online fee payment or billing portal
- Student / parent dashboard or LMS
- Multi-language support (English only)
- Per-class homework or assignment portal
- Event ticketing or booking system

---

## 3. Users

### 3.1 Prospective Parent (Primary)
Researching schools for a child aged 3–15 (Nursery through JSS3). Likely browsing on a smartphone. Key questions on first visit: Is this school credible? What do they teach? How do I enrol? Will bounce quickly if the site feels outdated or slow.

### 3.2 Current Parent (Secondary)
Already enrolled. Returning for contact info, term dates, circulars, or news. Lower frequency but higher intent. Needs the resources section and news to be reliably up to date.

### 3.3 School Admin (Internal)
Non-technical staff member responsible for keeping the site current. Needs a simple, self-explanatory admin panel to upload gallery photos, publish news, post resources, and send newsletters — without developer involvement.

### 3.4 Newsletter Subscriber
Any parent or interested party who signed up via the site. Expects relevant, well-formatted updates from the school. Must be able to unsubscribe easily.

---

## 4. Site Map

```
Public Site
├── /                     Home
│     Hero · School highlights · Animated stats · Latest news · CTA
├── /about                About the School
│     History · Mission & Vision · Principal's message · Staff
├── /academics            Academics & Curriculum
│     Nursery · Primary · JSS — subjects, activities, structure
├── /admissions           Admissions
│     Process · Requirements · Enquiry form · WhatsApp CTA
├── /news                 News & Announcements (index)
│   └── /news/[slug]      Individual news post
├── /gallery              Photo Gallery
│     Masonry grid · Lightbox · Lazy-loaded
├── /resources            Downloads
│     Term dates · Circulars · Forms/Documents
└── /contact              Contact & Location
      Map · Phone · Email · Address

Admin Panel (authenticated — /admin/*)
├── /admin                Dashboard overview
├── /admin/gallery        Upload & manage gallery photos
├── /admin/news           Create, edit, publish, delete news posts
├── /admin/resources      Upload & manage downloadable files
└── /admin/newsletter     Compose, send newsletter; manage subscriber list
```

---

## 5. User Stories & Acceptance Criteria

### 5.1 Public Site

---

**US-01 — Playful, engaging homepage**
As a prospective parent landing on the homepage, I want to immediately feel the school's warmth and quality so I stay and explore.

- [ ] Hero section renders above the fold on all screen sizes with school name, tagline, and "Enquire Now" CTA
- [ ] Page reaches interactive state in < 3s on mobile 3G
- [ ] At least 3 homepage sections feature scroll-triggered entrance animations
- [ ] Illustrated graphic or mascot is visible in the hero
- [ ] Animated counters (e.g. years of operation, number of students) on the stats section

---

**US-02 — School credibility**
As a prospective parent, I want to learn about the school's history, values, and leadership so I can assess fit for my family.

- [ ] About page includes: founding story, mission/vision statement, principal's message with photo
- [ ] Staff section with name, title, and photo for key staff
- [ ] Any accreditation or affiliation logos shown

---

**US-03 — Academics overview**
As a prospective parent, I want to understand what curriculum and programmes are offered at each level.

- [ ] Three clearly labelled tiers: Nursery, Primary, JSS
- [ ] Each tier shows: age range, key subjects, extracurricular activities
- [ ] NERDC/WAEC curriculum alignment mentioned where applicable

---

**US-04 — Admissions enquiry**
As a prospective parent ready to act, I want to reach the school easily to ask about admissions.

- [ ] Enquiry form fields: parent name, child name, child's age / class level, phone number, email, message
- [ ] On submit: email sent to school admin AND confirmation email to parent
- [ ] WhatsApp click-to-chat button visible prominently on mobile
- [ ] Google Maps embed showing FHA Lugbe, Abuja location
- [ ] Phone number and email address displayed as tappable links

---

**US-05 — News & announcements**
As a current or prospective parent, I want to read school news and stay informed about events.

- [ ] News index page with cards: cover image, title, date, excerpt
- [ ] Individual news post with rich text, inline images, and published date
- [ ] Homepage shows 3 most recent posts with a "View all" link
- [ ] News is managed entirely through the admin panel

---

**US-06 — Resources downloads**
As a current parent, I want to download term calendars, school circulars, and official forms.

- [ ] Resources page lists files by category: Term Dates, Circulars, Forms & Documents
- [ ] Each item shows: title, category, upload date, and download button
- [ ] Files (PDF, DOCX, XLSX) download or open in a new tab on click
- [ ] Resources are managed entirely through the admin panel

---

**US-07 — Photo gallery**
As a prospective parent, I want to see real photos of school life and facilities.

- [ ] Masonry or uniform grid layout with lazy-loaded, compressed images
- [ ] Clicking a photo opens a fullscreen lightbox with next/prev navigation
- [ ] Gallery content managed entirely through the admin panel

---

**US-08 — Newsletter subscription**
As an interested parent, I want to subscribe to school updates so I stay informed.

- [ ] Subscribe form (name + email) in site footer and on the contact page
- [ ] Double opt-in: confirmation email sent on subscribe; subscription activates on link click
- [ ] Every newsletter includes a functional one-click unsubscribe link
- [ ] Subscriber count visible to admin

---

**US-09 — Fully responsive**
As any user, I want the site to work perfectly on my device regardless of screen size.

- [ ] All pages fully responsive at 320px to 1440px viewport width
- [ ] Navigation collapses to a hamburger/drawer menu at mobile breakpoint
- [ ] All tap targets are ≥ 44×44px
- [ ] Zero horizontal scroll on any page at any breakpoint

---

### 5.2 Admin Panel

---

**US-10 — Admin login**
As the school admin, I want to log in securely so only authorised staff can manage content.

- [ ] Email + password login form at /admin
- [ ] Unauthenticated access to any /admin/* route redirects to login
- [ ] Session expires after 24 hours of inactivity
- [ ] No public registration — admin account provisioned by developer at setup

---

**US-11 — Gallery management**
As the school admin, I want to upload and remove gallery photos without a developer.

- [ ] Upload single or multiple images (JPG, PNG, WEBP) up to 10MB each
- [ ] Images auto-compressed and resized on upload (max 1600px wide)
- [ ] Each image shows a thumbnail and delete button
- [ ] Changes reflect on the public gallery immediately on save

---

**US-12 — News management**
As the school admin, I want to write and publish news posts with images and formatting.

- [ ] Rich text editor with: bold, italic, headings (H2/H3), bullet lists, numbered lists, image embed
- [ ] Cover image upload per post
- [ ] Draft / Published toggle — drafts not visible on public site
- [ ] Edit and delete existing posts
- [ ] Posts sorted newest-first in the admin list

---

**US-13 — Resources management**
As the school admin, I want to upload downloadable files for parents.

- [ ] Upload file (PDF, DOCX, XLSX) with: title, category, and date
- [ ] Categories: Term Dates, Circulars, Forms & Documents
- [ ] Delete resources
- [ ] Resources sorted newest-first in the admin list

---

**US-14 — Newsletter**
As the school admin, I want to send newsletters to all subscribers without external tools.

- [ ] Compose page: subject line + rich text body + optional banner image
- [ ] Preview rendered email before sending
- [ ] Send to all active subscribers in one click
- [ ] Manually add or remove subscriber email addresses
- [ ] View full subscriber list with name, email, and join date
- [ ] Post-send: delivery count shown; failed sends flagged

---

## 6. Success Metrics

| Metric | Target (90 days post-launch) |
|--------|------------------------------|
| Lighthouse mobile performance | ≥ 85 |
| Mobile page load (LCP) | < 3s |
| Bounce rate | < 55% |
| Avg. session duration | ≥ 2 min |
| Monthly enquiry leads | ≥ 20 |
| Newsletter subscribers (6 months) | ≥ 50 |
| Admin content updates without dev help | 100% |

---

## 7. Scope & Timeline

| Phase | Deliverable | Duration |
|-------|-------------|----------|
| 1 — Design | Colour system, typography, illustration set, Figma wireframes + hi-fi mockups (mobile-first, all pages + admin) | 2 weeks |
| 2 — Foundation | Vite + React setup, routing, Supabase project, DB schema, auth, Tailwind config, design tokens | 1 week |
| 3 — Public site | All 7 public pages coded, Framer Motion animations, illustrations integrated, responsive | 2.5 weeks |
| 4 — Admin panel | Gallery, news, resources, newsletter modules; Supabase Edge Functions for email | 1.5 weeks |
| 5 — Content & QA | Real copy + photos from school, cross-device testing, .htaccess config, FTP deploy, DNS cutover | 1 week |
| **Total** | | **~8 weeks** |

---

## 8. Open Questions

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | What email address should admin notifications and newsletters send from? | School | Open |
| 2 | Is there an existing parent email list for the newsletter seed? | School | Open |
| 3 | What is the WhatsApp number for click-to-chat? | School | Open |
| 4 | Can the school provide photography, or does it need to be arranged? | School | Open |
| 5 | Who is the designated admin user (name + email) for account setup? | School | Open |
| 6 | What are the current school stats for animated counters? (Years operating, no. of students, staff count, etc.) | School | Open |

---

*Next action: Begin Phase 1 — extract design tokens from logo, create Figma file, produce wireframes.*
