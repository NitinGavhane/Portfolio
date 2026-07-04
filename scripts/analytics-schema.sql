-- Blog analytics: run this once in Supabase → SQL Editor.
-- Tracks per-post views, reads, and clicks. No personal data is stored.

-- 1. Event table
CREATE TABLE IF NOT EXISTS blog_analytics (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL,
  event_type  TEXT NOT NULL CHECK (event_type IN ('view', 'read', 'click')),
  session_id  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS blog_analytics_slug_idx ON blog_analytics (slug);
CREATE INDEX IF NOT EXISTS blog_analytics_created_idx ON blog_analytics (created_at);

-- 2. Row Level Security
ALTER TABLE blog_analytics ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous visitors) may log an event...
DROP POLICY IF EXISTS "Anyone can log analytics" ON blog_analytics;
CREATE POLICY "Anyone can log analytics"
  ON blog_analytics FOR INSERT
  TO anon, authenticated
  WITH CHECK (event_type IN ('view', 'read', 'click'));

-- ...but only the authenticated admin may read raw events.
DROP POLICY IF EXISTS "Admin can read analytics" ON blog_analytics;
CREATE POLICY "Admin can read analytics"
  ON blog_analytics FOR SELECT
  USING (auth.role() = 'authenticated');

-- 3. Aggregation function for the dashboard.
-- SECURITY INVOKER so the admin's RLS applies (anonymous callers get nothing).
CREATE OR REPLACE FUNCTION get_blog_stats()
RETURNS TABLE (
  slug       TEXT,
  views      BIGINT,
  reads      BIGINT,
  clicks     BIGINT,
  last_event TIMESTAMPTZ
)
LANGUAGE sql
SECURITY INVOKER
STABLE
AS $$
  SELECT
    slug,
    COUNT(*) FILTER (WHERE event_type = 'view')  AS views,
    COUNT(*) FILTER (WHERE event_type = 'read')  AS reads,
    COUNT(*) FILTER (WHERE event_type = 'click') AS clicks,
    MAX(created_at) AS last_event
  FROM blog_analytics
  GROUP BY slug;
$$;
