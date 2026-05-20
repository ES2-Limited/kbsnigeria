create extension if not exists pgcrypto;

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.request_header(header_name text)
returns text
language sql
stable
as $$
  select coalesce(
    (current_setting('request.headers', true)::json ->> lower(header_name)),
    (current_setting('request.headers', true)::json ->> header_name)
  );
$$;

create table public.news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  body text not null,
  cover_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index news_posts_status_published_at_idx on public.news_posts (status, published_at desc);

create trigger news_posts_set_updated_at
before update on public.news_posts
for each row execute function public.handle_updated_at();

create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  url text not null,
  caption text,
  uploaded_at timestamptz not null default now()
);

create index gallery_images_uploaded_at_idx on public.gallery_images (uploaded_at desc);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('Term Dates', 'Circulars', 'Forms & Documents')),
  file_url text not null,
  file_name text not null,
  uploaded_at timestamptz not null default now()
);

create index resources_uploaded_at_idx on public.resources (uploaded_at desc);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique not null,
  confirmed boolean not null default false,
  token text unique,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create index newsletter_subscribers_token_idx on public.newsletter_subscribers (token) where token is not null;
create index newsletter_subscribers_active_idx on public.newsletter_subscribers (confirmed, unsubscribed_at)
where confirmed = true and unsubscribed_at is null;

create table public.newsletter_sends (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  body text not null,
  banner_url text,
  sent_at timestamptz not null default now(),
  recipient_count int,
  failed_count int not null default 0
);

create index newsletter_sends_sent_at_idx on public.newsletter_sends (sent_at desc);

create table public.function_rate_limits (
  rate_key text primary key,
  last_called_at timestamptz not null default now()
);

create or replace function public.take_rate_limit(p_rate_key text, p_window_seconds int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  affected_rows int;
begin
  insert into public.function_rate_limits (rate_key, last_called_at)
  values (p_rate_key, now())
  on conflict (rate_key) do update
  set last_called_at = excluded.last_called_at
  where public.function_rate_limits.last_called_at <= now() - make_interval(secs => p_window_seconds);

  get diagnostics affected_rows = row_count;
  return affected_rows > 0;
end;
$$;

alter table public.news_posts enable row level security;
alter table public.gallery_images enable row level security;
alter table public.resources enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.newsletter_sends enable row level security;
alter table public.function_rate_limits enable row level security;

create policy "Public read published news"
on public.news_posts for select
using (status = 'published');

create policy "Authenticated read all news"
on public.news_posts for select
to authenticated
using (true);

create policy "Authenticated manage news"
on public.news_posts for all
to authenticated
using (true)
with check (true);

create policy "Public read gallery"
on public.gallery_images for select
using (true);

create policy "Authenticated manage gallery"
on public.gallery_images for all
to authenticated
using (true)
with check (true);

create policy "Public read resources"
on public.resources for select
using (true);

create policy "Authenticated manage resources"
on public.resources for all
to authenticated
using (true)
with check (true);

create policy "Authenticated read subscribers"
on public.newsletter_subscribers for select
to authenticated
using (true);

create policy "Public subscribe"
on public.newsletter_subscribers for insert
with check (true);

create policy "Authenticated manage subscribers"
on public.newsletter_subscribers for all
to authenticated
using (true)
with check (true);

create policy "Token update subscribers"
on public.newsletter_subscribers for update
using (token = public.request_header('x-confirmation-token'))
with check (
  token is null
  or token = public.request_header('x-confirmation-token')
);

create policy "Authenticated manage newsletter sends"
on public.newsletter_sends for all
to authenticated
using (true)
with check (true);

create policy "Service role rate limit access"
on public.function_rate_limits for all
to service_role
using (true)
with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('gallery', 'gallery', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('resources', 'resources', true, 26214400, array['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']),
  ('news-covers', 'news-covers', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('newsletter-banners', 'newsletter-banners', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "Public read gallery bucket"
on storage.objects for select
using (bucket_id = 'gallery');

create policy "Authenticated write gallery bucket"
on storage.objects for insert
to authenticated
with check (bucket_id = 'gallery');

create policy "Authenticated update gallery bucket"
on storage.objects for update
to authenticated
using (bucket_id = 'gallery')
with check (bucket_id = 'gallery');

create policy "Authenticated delete gallery bucket"
on storage.objects for delete
to authenticated
using (bucket_id = 'gallery');

create policy "Public read resources bucket"
on storage.objects for select
using (bucket_id = 'resources');

create policy "Authenticated write resources bucket"
on storage.objects for insert
to authenticated
with check (bucket_id = 'resources');

create policy "Authenticated update resources bucket"
on storage.objects for update
to authenticated
using (bucket_id = 'resources')
with check (bucket_id = 'resources');

create policy "Authenticated delete resources bucket"
on storage.objects for delete
to authenticated
using (bucket_id = 'resources');

create policy "Public read news covers bucket"
on storage.objects for select
using (bucket_id = 'news-covers');

create policy "Authenticated write news covers bucket"
on storage.objects for insert
to authenticated
with check (bucket_id = 'news-covers');

create policy "Authenticated update news covers bucket"
on storage.objects for update
to authenticated
using (bucket_id = 'news-covers')
with check (bucket_id = 'news-covers');

create policy "Authenticated delete news covers bucket"
on storage.objects for delete
to authenticated
using (bucket_id = 'news-covers');

create policy "Public read newsletter banners bucket"
on storage.objects for select
using (bucket_id = 'newsletter-banners');

create policy "Authenticated write newsletter banners bucket"
on storage.objects for insert
to authenticated
with check (bucket_id = 'newsletter-banners');

create policy "Authenticated update newsletter banners bucket"
on storage.objects for update
to authenticated
using (bucket_id = 'newsletter-banners')
with check (bucket_id = 'newsletter-banners');

create policy "Authenticated delete newsletter banners bucket"
on storage.objects for delete
to authenticated
using (bucket_id = 'newsletter-banners');

insert into public.news_posts (title, slug, excerpt, body, cover_url, status, published_at)
values
  (
    'Welcome Back for the New Term',
    'welcome-back-for-the-new-term',
    'We are excited to welcome pupils and parents back for a new term of learning and growth at KBS Nigeria.',
    '<p>We are delighted to begin a new term with renewed focus, joyful learning, and a strong partnership with families across the KBS community.</p><p>Parents will receive additional term reminders and academic updates through the school newsletter and notice channels.</p>',
    'https://example.supabase.co/storage/v1/object/public/news-covers/sample-welcome-back.jpg',
    'published',
    now() - interval '14 days'
  ),
  (
    'End of Term Exhibition Announced',
    'end-of-term-exhibition-announced',
    'Families are invited to an end-of-term exhibition celebrating student work across classes and subjects.',
    '<p>Our end-of-term exhibition will showcase projects, reading work, science activities, and class highlights from across the school.</p><p>We look forward to welcoming families for a joyful afternoon of celebration and reflection.</p>',
    'https://example.supabase.co/storage/v1/object/public/news-covers/sample-exhibition.jpg',
    'published',
    now() - interval '5 days'
  )
on conflict (slug) do nothing;

insert into public.gallery_images (storage_path, url, caption)
values
  (
    'placeholder/classroom-01.jpg',
    'https://example.supabase.co/storage/v1/object/public/gallery/placeholder/classroom-01.jpg',
    'Pupils engaged in a classroom activity.'
  ),
  (
    'placeholder/event-01.jpg',
    'https://example.supabase.co/storage/v1/object/public/gallery/placeholder/event-01.jpg',
    'Highlights from a recent school event.'
  ),
  (
    'placeholder/facility-01.jpg',
    'https://example.supabase.co/storage/v1/object/public/gallery/placeholder/facility-01.jpg',
    'A view of one of the learning spaces on campus.'
  )
on conflict do nothing;
