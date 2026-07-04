-- Portfolio projects: run this once in Supabase → SQL Editor.
-- Creates the projects table, its access policies, and seeds your current
-- projects so the admin panel starts pre-populated.

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
