import { supabase, isSupabaseConfigured } from './supabase';
import { projects as staticProjects } from './projectsData';
import type { Project } from './supabaseSchema';

function toProject(p: (typeof staticProjects)[number], i: number): Project {
  return {
    id: String(p.id),
    title: p.title,
    year: p.year,
    category: p.category,
    description: p.description,
    technologies: p.technologies,
    github_url: p.github,
    live_url: p.live,
    image_url: p.image,
    featured: true,
    sort_order: i,
    created_at: '',
    updated_at: '',
  };
}

const staticAsProjects = (): Project[] => staticProjects.map(toProject);

/**
 * Public portfolio projects. Reads featured projects from Supabase, ordered by
 * sort_order; falls back to the bundled list when the DB is unreachable or empty
 * so the portfolio is never blank.
 */
export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) return staticAsProjects();

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return staticAsProjects();
    return data;
  } catch {
    return staticAsProjects();
  }
}
