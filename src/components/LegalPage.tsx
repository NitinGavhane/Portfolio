import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Seo from './Seo';

interface LegalPageProps {
  title: string;
  description: string;
  path: string;
  updated: string;
  children: ReactNode;
}

/**
 * Shared layout for content-light legal/informational pages.
 * Provides consistent prose typography and readable measure.
 */
const LegalPage = ({ title, description, path, updated, children }: LegalPageProps) => (
  <>
    <Seo title={title} description={description} path={path} />
    <section className="bg-[var(--bg-primary)] min-h-screen">
      <div className="max-w-[720px] mx-auto px-6 sm:px-8 pt-24 sm:pt-32 pb-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Home
        </Link>

        <h1 className="font-serif text-4xl sm:text-5xl text-[var(--text-primary)] leading-tight mb-3">
          {title}
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-12">Last updated: {updated}</p>

        <div
          className="
            text-[var(--text-secondary)] text-[17px] leading-[1.75] space-y-5
            [&_h2]:font-serif [&_h2]:text-[26px] [&_h2]:text-[var(--text-primary)] [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:leading-tight
            [&_h3]:font-sans [&_h3]:font-semibold [&_h3]:text-[18px] [&_h3]:text-[var(--text-primary)] [&_h3]:mt-8 [&_h3]:mb-2
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:my-4
            [&_a]:text-[var(--text-primary)] [&_a]:underline [&_a]:underline-offset-2
          "
        >
          {children}
        </div>
      </div>
    </section>
  </>
);

export default LegalPage;
