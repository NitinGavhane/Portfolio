-- Run this SQL in your Supabase project's SQL Editor
-- It creates all the tables needed for the admin dashboard

-- 1. Admin Profiles
CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Blog Posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT DEFAULT '',
  excerpt TEXT DEFAULT '',
  category TEXT DEFAULT 'Dev',
  image_url TEXT DEFAULT '',
  read_time TEXT DEFAULT '5 min read',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Digital Products (eBooks)
CREATE TABLE digital_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  cover_image_url TEXT DEFAULT '',
  rating NUMERIC DEFAULT 0,
  pages INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  price TEXT DEFAULT 'Free',
  purchase_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bookings (synced from scheduling)
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  duration INTEGER DEFAULT 30,
  purpose TEXT DEFAULT '',
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: only authenticated admin can modify
CREATE POLICY "Admin can view own profile"
  ON admin_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admin can update own profile"
  ON admin_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Blog posts: anyone can read published, only admin can write
CREATE POLICY "Anyone can read published posts"
  ON blog_posts FOR SELECT
  USING (published = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin can insert posts"
  ON blog_posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update posts"
  ON blog_posts FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete posts"
  ON blog_posts FOR DELETE
  USING (auth.role() = 'authenticated');

-- Digital products: anyone can read, only admin can write
CREATE POLICY "Anyone can read products"
  ON digital_products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin can insert products"
  ON digital_products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update products"
  ON digital_products FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete products"
  ON digital_products FOR DELETE
  USING (auth.role() = 'authenticated');

-- Bookings: only admin can read/update
CREATE POLICY "Admin can read bookings"
  ON bookings FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update bookings"
  ON bookings FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create trigger to auto-create admin profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_profiles (id, email, name)
  VALUES (NEW.id, NEW.email, '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- Blog analytics (views / reads / clicks). See scripts/analytics-schema.sql
-- ============================================================

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


-- ============================================================
-- Portfolio projects. See scripts/projects-schema.sql
-- ============================================================

-- 1. Table
CREATE TABLE IF NOT EXISTS projects (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  year         TEXT DEFAULT '',
  category     TEXT DEFAULT '',
  description  TEXT DEFAULT '',
  technologies TEXT[] DEFAULT '{}',
  github_url   TEXT DEFAULT '',
  live_url     TEXT DEFAULT '',
  image_url    TEXT DEFAULT '',
  featured     BOOLEAN DEFAULT true,
  sort_order   INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Row Level Security: anyone can read, only the admin can write.
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read projects" ON projects;
CREATE POLICY "Anyone can read projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin can insert projects" ON projects;
CREATE POLICY "Admin can insert projects"
  ON projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can update projects" ON projects;
CREATE POLICY "Admin can update projects"
  ON projects FOR UPDATE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can delete projects" ON projects;
CREATE POLICY "Admin can delete projects"
  ON projects FOR DELETE
  USING (auth.role() = 'authenticated');

-- 3. Seed current projects (only if the table is empty, so re-running is safe).
INSERT INTO projects (title, year, category, description, technologies, github_url, live_url, image_url, featured, sort_order)
SELECT * FROM (VALUES
  ('DailyStory', '2025', 'Full-Stack',
    'Capture and preserve your daily experiences in beautiful stories — private or shared with the world.',
    ARRAY['React','Node.js','MongoDB','TypeScript'],
    'https://github.com/NitinGavhane/DailyStory.git', 'https://daily-story.vercel.app/', 'projects_images/1.png', true, 0),
  ('MyPortfolio', '2025', 'Full-Stack',
    'A modern, interactive portfolio built with React, TypeScript, and Tailwind CSS.',
    ARRAY['React','TypeScript','Vite','Tailwind CSS'],
    'https://github.com/NitinGavhane/Portfolio.git', 'https://nitin-gavhane-dev.vercel.app/', 'projects_images/2.png', true, 1),
  ('Termisume', '2021', 'Creative Web',
    'A terminal-inspired personal site with a typewriter effect — minimal, fast, and memorable.',
    ARRAY['HTML5','CSS3','Vanilla JS'],
    'https://github.com/NitinGavhane/nitin.git', 'https://nitin.vercel.app/', 'projects_images/3.png', true, 2),
  ('Vulnerability Research Lab', '2024', 'Security',
    'A curated environment for testing and demonstrating common web vulnerabilities with remediation guides.',
    ARRAY['Docker','Python','OWASP','Burp Suite'],
    'https://github.com/NitinGavhane', '#', 'projects_images/4.png', true, 3),
  ('API Security Scanner', '2024', 'Security',
    'Automated security scanning tool for REST APIs that identifies common misconfigurations and vulnerabilities.',
    ARRAY['Python','FastAPI','Docker','PostgreSQL'],
    'https://github.com/NitinGavhane', '#', 'projects_images/5.png', true, 4),
  ('Tech Blog Platform', '2023', 'Full-Stack',
    'A full-featured blogging platform with markdown support, SEO optimization, and analytics dashboard.',
    ARRAY['Next.js','MDX','Tailwind CSS','Vercel'],
    'https://github.com/NitinGavhane', '#', 'projects_images/6.png', true, 5)
) AS seed(title, year, category, description, technologies, github_url, live_url, image_url, featured, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM projects);
