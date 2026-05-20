# Supabase Backend

This directory contains the KBS Nigeria Supabase database migration and Edge Functions.

## Contents
- `migrations/001_init.sql`: initial schema, RLS, storage buckets, and seed data
- `functions/send-enquiry`: admissions/contact email function with IP rate limiting
- `functions/send-confirmation`: newsletter opt-in starter
- `functions/confirm-subscription`: newsletter confirmation endpoint
- `functions/send-newsletter`: authenticated newsletter send endpoint

## Prerequisites
- Supabase CLI installed
- Docker running

## Local Development
```bash
supabase start
supabase db reset
supabase functions serve --env-file ./supabase/.env.local
```

## Recommended Local Environment Variables
Create `supabase/.env.local` with:

```bash
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=your_local_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_local_service_role_key
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=KBS Nigeria <no-reply@kbsnigeria.com>
ADMIN_EMAIL=info@kbsnigeria.com
ALLOWED_ORIGIN=http://localhost:5173,https://kbsnigeria.com,https://www.kbsnigeria.com
SITE_URL=https://kbsnigeria.com
```

## Serving Individual Functions
```bash
supabase functions serve send-enquiry --env-file ./supabase/.env.local
supabase functions serve send-confirmation --env-file ./supabase/.env.local
supabase functions serve confirm-subscription --env-file ./supabase/.env.local
supabase functions serve send-newsletter --env-file ./supabase/.env.local
```

## Deploying
```bash
supabase db push
supabase functions deploy send-enquiry
supabase functions deploy send-confirmation
supabase functions deploy confirm-subscription
supabase functions deploy send-newsletter
```

## Notes
- Resend credentials are read from `Deno.env` inside Edge Functions and are never hardcoded.
- `send-enquiry` uses the `public.take_rate_limit()` database function for a 1 request per IP per 60 seconds limit.
- The migration seeds 2 published news posts and 3 gallery records for local testing.
