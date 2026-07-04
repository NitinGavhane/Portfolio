import { supabase, isSupabaseConfigured } from './supabase';

export type BlogEventType = 'view' | 'read' | 'click';

/** Anonymous per-tab id used only to de-duplicate events within a session. */
function sessionId(): string {
  try {
    let id = sessionStorage.getItem('ba_sid');
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem('ba_sid', id);
    }
    return id;
  } catch {
    return 'nostore';
  }
}

/** Returns true if this (type, slug) was already counted this session. */
function firstTimeThisSession(key: string): boolean {
  try {
    if (sessionStorage.getItem(key)) return false;
    sessionStorage.setItem(key, '1');
    return true;
  } catch {
    return true; // storage blocked — allow, StrictMode dedup below still guards dev
  }
}

// Guards against React StrictMode double-invocation in the same tick.
const inFlight = new Set<string>();

/**
 * Record a blog engagement event (view / read / click) in Supabase.
 * De-duplicated once per browser session per post, fire-and-forget, and a
 * no-op when Supabase isn't configured or the analytics table doesn't exist.
 * No personal data is stored — only the post slug, event type, and a random
 * per-tab id.
 */
export function trackBlogEvent(slug: string, type: BlogEventType): void {
  if (!isSupabaseConfigured || !slug) return;
  const key = `ba:${type}:${slug}`;
  if (inFlight.has(key)) return;
  if (!firstTimeThisSession(key)) return;
  inFlight.add(key);

  supabase
    .from('blog_analytics')
    .insert({ slug, event_type: type, session_id: sessionId() })
    .then(
      () => {},
      () => {
        // Table missing or offline — allow a retry next session.
        try {
          sessionStorage.removeItem(key);
        } catch {
          /* ignore */
        }
        inFlight.delete(key);
      }
    );
}
