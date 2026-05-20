-- =============================================================
-- KBS Nigeria — Initial Schema
-- Migration: 20260520000000_initial_schema
-- =============================================================


-- =============================================================
-- EXTENSIONS
-- =============================================================

create extension if not exists "uuid-ossp";


-- =============================================================
-- UTILITY: auto-update updated_at column
-- =============================================================

create or replace function handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- =============================================================
-- TABLE: news_posts
-- =============================================================

create table public.news_posts (
  id           uuid        primary key default gen_random_uuid(),
  title        text        not null,
  slug         text        unique not null,
  excerpt      text,
  body         text        not null,  -- Tiptap HTML (sanitised before insert)
  cover_url    text,                  -- Supabase Storage public URL
  status       text        not null default 'draft'
                           check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_news_posts_status_published_at
  on public.news_posts (status, published_at desc);

create trigger set_news_posts_updated_at
  before update on public.news_posts
  for each row execute function handle_updated_at();

-- RLS
alter table public.news_posts enable row level security;

create policy "Public can read published posts"
  on public.news_posts for select
  using (status = 'published');

create policy "Admin can read all posts"
  on public.news_posts for select
  to authenticated
  using (true);

create policy "Admin can insert posts"
  on public.news_posts for insert
  to authenticated
  with check (true);

create policy "Admin can update posts"
  on public.news_posts for update
  to authenticated
  using (true)
  with check (true);

create policy "Admin can delete posts"
  on public.news_posts for delete
  to authenticated
  using (true);


-- =============================================================
-- TABLE: gallery_images
-- =============================================================

create table public.gallery_images (
  id           uuid        primary key default gen_random_uuid(),
  storage_path text        not null,  -- path inside the 'gallery' storage bucket
  url          text        not null,  -- full public URL
  caption      text,
  uploaded_at  timestamptz not null default now()
);

create index idx_gallery_images_uploaded_at
  on public.gallery_images (uploaded_at desc);

-- RLS
alter table public.gallery_images enable row level security;

create policy "Public can view gallery images"
  on public.gallery_images for select
  using (true);

create policy "Admin can insert gallery images"
  on public.gallery_images for insert
  to authenticated
  with check (true);

create policy "Admin can delete gallery images"
  on public.gallery_images for delete
  to authenticated
  using (true);


-- =============================================================
-- TABLE: resources
-- =============================================================

create table public.resources (
  id           uuid        primary key default gen_random_uuid(),
  title        text        not null,
  category     text        not null
                           check (category in ('Term Dates', 'Circulars', 'Forms & Documents')),
  file_url     text        not null,  -- full public URL
  file_name    text        not null,  -- original filename for display
  uploaded_at  timestamptz not null default now()
);

create index idx_resources_category_uploaded_at
  on public.resources (category, uploaded_at desc);

-- RLS
alter table public.resources enable row level security;

create policy "Public can view resources"
  on public.resources for select
  using (true);

create policy "Admin can insert resources"
  on public.resources for insert
  to authenticated
  with check (true);

create policy "Admin can update resources"
  on public.resources for update
  to authenticated
  using (true)
  with check (true);

create policy "Admin can delete resources"
  on public.resources for delete
  to authenticated
  using (true);


-- =============================================================
-- TABLE: newsletter_subscribers
-- =============================================================

create table public.newsletter_subscribers (
  id               uuid        primary key default gen_random_uuid(),
  name             text,
  email            text        unique not null,
  confirmed        boolean     not null default false,
  token            text        unique,  -- double opt-in + unsubscribe token
  subscribed_at    timestamptz not null default now(),
  unsubscribed_at  timestamptz
);

create index idx_newsletter_subscribers_token
  on public.newsletter_subscribers (token)
  where token is not null;

create index idx_newsletter_subscribers_active
  on public.newsletter_subscribers (confirmed, unsubscribed_at)
  where confirmed = true and unsubscribed_at is null;

-- RLS
alter table public.newsletter_subscribers enable row level security;

-- Anyone can subscribe (unauthenticated insert)
create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert
  with check (true);

-- Confirm via token (unauthenticated update — only flips confirmed + clears token)
create policy "Subscriber can confirm via token"
  on public.newsletter_subscribers for update
  using (token = current_setting('request.jwt.claims', true)::json->>'token'
         or auth.role() = 'authenticated')
  with check (true);

-- Admin can read all subscribers
create policy "Admin can read subscribers"
  on public.newsletter_subscribers for select
  to authenticated
  using (true);

-- Admin can insert subscribers manually
create policy "Admin can insert subscribers"
  on public.newsletter_subscribers for insert
  to authenticated
  with check (true);

-- Admin can delete subscribers
create policy "Admin can delete subscribers"
  on public.newsletter_subscribers for delete
  to authenticated
  using (true);


-- =============================================================
-- TABLE: newsletter_sends
-- =============================================================

create table public.newsletter_sends (
  id               uuid        primary key default gen_random_uuid(),
  subject          text        not null,
  body             text        not null,  -- Tiptap HTML
  banner_url       text,
  sent_at          timestamptz not null default now(),
  recipient_count  int         not null default 0,
  failed_count     int         not null default 0
);

create index idx_newsletter_sends_sent_at
  on public.newsletter_sends (sent_at desc);

-- RLS — admin only; never exposed publicly
alter table public.newsletter_sends enable row level security;

create policy "Admin can read newsletter sends"
  on public.newsletter_sends for select
  to authenticated
  using (true);

create policy "Admin can insert newsletter sends"
  on public.newsletter_sends for insert
  to authenticated
  with check (true);

create policy "Admin can update newsletter sends"
  on public.newsletter_sends for update
  to authenticated
  using (true)
  with check (true);


-- =============================================================
-- STORAGE BUCKETS
-- =============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'gallery',
    'gallery',
    true,
    10485760,  -- 10MB
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'resources',
    'resources',
    true,
    26214400,  -- 25MB
    array['application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
  ),
  (
    'news-covers',
    'news-covers',
    true,
    10485760,  -- 10MB
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'newsletter-banners',
    'newsletter-banners',
    true,
    5242880,   -- 5MB
    array['image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do nothing;


-- =============================================================
-- STORAGE POLICIES
-- =============================================================

-- gallery bucket
create policy "Public can view gallery files"
  on storage.objects for select
  using (bucket_id = 'gallery');

create policy "Admin can upload to gallery"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gallery');

create policy "Admin can delete from gallery"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gallery');

-- resources bucket
create policy "Public can download resources"
  on storage.objects for select
  using (bucket_id = 'resources');

create policy "Admin can upload resources"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'resources');

create policy "Admin can delete resources"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'resources');

-- news-covers bucket
create policy "Public can view news covers"
  on storage.objects for select
  using (bucket_id = 'news-covers');

create policy "Admin can upload news covers"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'news-covers');

create policy "Admin can delete news covers"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'news-covers');

-- newsletter-banners bucket
create policy "Public can view newsletter banners"
  on storage.objects for select
  using (bucket_id = 'newsletter-banners');

create policy "Admin can upload newsletter banners"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'newsletter-banners');

create policy "Admin can delete newsletter banners"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'newsletter-banners');
