-- Phase 2 marketing tables: testimonials, achievements, events, site_media

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  quote text not null,
  video_url text,
  photo_url text,
  tier text,
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index testimonials_featured_sort_idx on public.testimonials (featured, sort_order asc, created_at desc);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  year int,
  description text,
  image_url text,
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index achievements_featured_sort_idx on public.achievements (featured, sort_order asc, created_at desc);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  type text,
  event_date timestamptz,
  description text,
  cta_label text,
  cta_url text,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

create index events_status_date_idx on public.events (status, event_date desc nulls last);
create index events_featured_idx on public.events (featured, event_date desc nulls last) where status = 'published';

create table public.site_media (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  type text,
  embed_url text,
  poster_url text,
  caption text,
  updated_at timestamptz not null default now()
);

create trigger site_media_set_updated_at
before update on public.site_media
for each row execute function public.handle_updated_at();

-- Row level security
alter table public.testimonials enable row level security;
alter table public.achievements enable row level security;
alter table public.events enable row level security;
alter table public.site_media enable row level security;

create policy "Public read featured testimonials"
on public.testimonials for select
using (featured = true);

create policy "Authenticated read all testimonials"
on public.testimonials for select
to authenticated
using (true);

create policy "Authenticated manage testimonials"
on public.testimonials for all
to authenticated
using (true)
with check (true);

create policy "Public read featured achievements"
on public.achievements for select
using (featured = true);

create policy "Authenticated read all achievements"
on public.achievements for select
to authenticated
using (true);

create policy "Authenticated manage achievements"
on public.achievements for all
to authenticated
using (true)
with check (true);

create policy "Public read published events"
on public.events for select
using (status = 'published');

create policy "Authenticated read all events"
on public.events for select
to authenticated
using (true);

create policy "Authenticated manage events"
on public.events for all
to authenticated
using (true)
with check (true);

create policy "Public read site media"
on public.site_media for select
using (true);

create policy "Authenticated manage site media"
on public.site_media for all
to authenticated
using (true)
with check (true);

-- Seed placeholder site media
insert into public.site_media (key, type, embed_url, poster_url, caption)
values (
  'hero_tour_video',
  'video',
  null,
  null,
  'Take a virtual tour of Knowledgebased Basic Science Schools.'
)
on conflict (key) do nothing;
