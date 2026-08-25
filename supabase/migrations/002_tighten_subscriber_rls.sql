-- 002: Tighten newsletter subscriber policies.
--
-- The "Public subscribe" insert policy allowed anonymous users to insert rows
-- with confirmed = true, bypassing the double opt-in flow entirely. Subscriber
-- records are created exclusively by the `send-confirmation` Edge Function via
-- the service role key (which bypasses RLS), so the anon insert policy is dead
-- surface and is removed here. The token-guarded update policy used by
-- `confirm-subscription` remains unchanged.

drop policy if exists "Public subscribe" on public.newsletter_subscribers;
