import { Check, AlertTriangle, Info } from 'lucide-react';

interface Props {
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  slug: string;
}

interface Rule {
  label: string;
  ok: boolean;
  required: boolean;
  hint: string;
}

/** Strip the lightweight-markdown markers to count real words. */
function wordCount(md: string): number {
  const text = md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*`-]/g, ' ')
    .replace(/!\[.*?\]\(.*?\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text ? text.split(' ').length : 0;
}

/**
 * Live guidance panel that nudges authors toward AdSense-friendly,
 * readable articles: enough original content, clear structure, and
 * the metadata that ranks and shares well.
 */
const AdSenseChecklist = ({ title, content, excerpt, imageUrl, slug }: Props) => {
  const words = wordCount(content);
  const headings = (content.match(/^##\s/gm) || []).length + (content.match(/^###\s/gm) || []).length;

  const rules: Rule[] = [
    {
      label: `Title set (${title.trim().length} chars)`,
      ok: title.trim().length >= 20 && title.trim().length <= 70,
      required: true,
      hint: 'Aim for 20–70 characters — descriptive but not clickbait.',
    },
    {
      label: `Original content (${words} words)`,
      ok: words >= 300,
      required: true,
      hint: 'AdSense wants substantial, original writing. 300+ words minimum; 600+ is better.',
    },
    {
      label: `Section headings (${headings})`,
      ok: headings >= 2,
      required: false,
      hint: 'Use at least 2 H2/H3 headings so readers can scan. Good structure aids approval.',
    },
    {
      label: `Meta description / excerpt (${excerpt.trim().length} chars)`,
      ok: excerpt.trim().length >= 50 && excerpt.trim().length <= 160,
      required: true,
      hint: 'Write a 50–160 character excerpt — it becomes the SEO meta description.',
    },
    {
      label: 'Featured image',
      ok: !!imageUrl.trim(),
      required: false,
      hint: 'A featured image improves the card and social share preview.',
    },
    {
      label: 'URL slug set',
      ok: !!slug.trim(),
      required: true,
      hint: 'A clean, readable slug helps SEO.',
    },
  ];

  const requiredFailing = rules.filter((r) => r.required && !r.ok).length;
  const ready = requiredFailing === 0;

  return (
    <div className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] rounded-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">AdSense Readiness</p>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
            ready
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {ready ? 'Ready to publish' : `${requiredFailing} required item${requiredFailing > 1 ? 's' : ''} left`}
        </span>
      </div>

      <ul className="space-y-2.5">
        {rules.map((r) => (
          <li key={r.label} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex-shrink-0">
              {r.ok ? (
                <Check size={14} className="text-green-600" />
              ) : r.required ? (
                <AlertTriangle size={14} className="text-amber-600" />
              ) : (
                <Info size={14} className="text-[var(--text-muted)]" />
              )}
            </span>
            <div>
              <p className={`text-sm ${r.ok ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
                {r.label}
                {!r.required && <span className="text-[var(--text-muted)]"> · optional</span>}
              </p>
              {!r.ok && <p className="text-xs text-[var(--text-muted)] mt-0.5">{r.hint}</p>}
            </div>
          </li>
        ))}
      </ul>

      <p className="text-xs text-[var(--text-muted)] mt-4 pt-4 border-t border-[var(--border-primary)] leading-relaxed">
        Also ensure content is original and policy-compliant — no copyrighted text, adult, or
        prohibited topics. See the Privacy Policy &amp; Terms pages already linked in the footer.
      </p>
    </div>
  );
};

export default AdSenseChecklist;
