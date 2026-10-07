# KBS Website — School Content Checklist (Phase 2)

Use this checklist before production launch. The site is built to display admin-managed content; empty sections show placeholders until the school supplies real assets.

## Imported assets (June 2026)

The repo now includes starter media so pages look alive before admin uploads:

- **16 real photos** from the legacy WordPress gallery → `public/assets/legacy-gallery/` (auto-shown when Supabase gallery is empty)
- **Brand illustrations** → `public/assets/illustrations/` (hero SVG, tier art, admissions, OG social image)
- **Re-download script** → `node scripts/download-legacy-assets.mjs`

Still needed from the school:

- [ ] **Tour video URL** — paste a YouTube/Vimeo/MP4 link in `/admin/media` → `hero_tour_video` (Instagram reels can be re-uploaded to YouTube unlisted)
- [ ] **Fresh 2025–2026 photos** from [@kbs_abuja](https://www.instagram.com/kbs_abuja/) — export or upload via `/admin/gallery`
- [ ] **Verified staff names and headshots** — current About page uses legacy placeholder names with real KBS photos

## Positioning & copy

- [ ] Leadership approves positioning statement: *"KBS is Abuja's leading Islamic technology-driven school, nurturing academically excellent, morally upright and future-ready leaders."*
- [ ] Confirm three pillars messaging: Academic Excellence, Islamic Character, Technology & Leadership

## Homepage stats (confirm in admin or `messaging.js`)

- [ ] Years operating (currently 25)
- [ ] Learners enrolled (currently 400)
- [ ] Staff count (currently 40)
- [ ] Learning pathways count (3 — Nursery, Primary, JSS)

## School tour video (`/admin/media` → `hero_tour_video`)

- [ ] 2-minute school tour video (YouTube, Vimeo, or MP4 URL)
- [ ] Optional poster image URL
- [ ] Caption text

## Testimonials (`/admin/testimonials`)

Minimum: **5–10 real parent quotes**; ideal: **2–3 short video testimonials**

- [ ] Parent name and role (e.g. "Parent of JSS 2 pupil")
- [ ] Quote (authentic, specific outcomes)
- [ ] Optional photo URL
- [ ] Optional video URL (YouTube/Vimeo)
- [ ] Mark 3–6 as **Featured** for homepage

## Achievements (`/admin/achievements`)

Minimum: **6–12 verifiable items**

Categories to cover:

- [ ] WAEC / BECE results (where shareable)
- [ ] Competition awards (STEM, Qur'an, sports, debate)
- [ ] Coding / robotics projects
- [ ] Qur'an memorisation milestones
- [ ] Leadership or community awards

Mark top items as **Featured** for homepage strip and About page.

## Events (`/admin/events`)

High-converting offers from marketing strategy:

- [ ] Free Child Assessment Week
- [ ] Open Classroom Day
- [ ] STEM Discovery Day
- [ ] Qur'an Excellence Day
- [ ] Future Leaders Bootcamp
- [ ] Open day dates with CTA (contact link or external registration)

Set status to **Published** and mark upcoming events as **Featured**.

## Gallery (`/admin/gallery`)

Minimum: **20+ photos**

- [ ] Classrooms
- [ ] Laboratories and ICT facilities
- [ ] Robotics / STEM activities
- [ ] Qur'an classes
- [ ] Sports and co-curricular
- [ ] Teachers with pupils

## News (`/admin/news`)

- [ ] Replace any 2022-era content with 2025–2026 posts
- [ ] Student achievements, open day announcements, term updates

## About page

- [ ] Principal's message and photo
- [ ] Key staff names, titles, and photos
- [ ] Founding story details (verify dates and facts)
- [ ] Affiliation / accreditation logos if available

## Resources (`/admin/resources`)

- [ ] Term dates PDF
- [ ] Admissions forms (entrance / registration)
- [ ] School circulars

## Referral programme (Admissions or future `/referrals` page)

- [ ] Approved referral terms (bring 1 family → discount / books / uniform / tuition credit)
- [ ] Contact process for referrals

## Contact & social

- [ ] Verify phone numbers, email, address in `site.js` or env
- [ ] WhatsApp channel link for weekly parent value content (footer / social)
- [ ] Facebook and Instagram URLs current

## Analytics

- [ ] Set `VITE_GA_MEASUREMENT_ID` in production `.env` with real GA4 property ID

## Email (when enabled)

- [ ] Deploy `send-enquiry` edge function with Resend + `ADMIN_EMAIL`
- [ ] Test enquiry form with each intent type (tour, open day, assessment, apply)

---

**Launch rule:** Do not go live with placeholder testimonials or unverified achievement claims. Empty states are preferable to misleading content.
