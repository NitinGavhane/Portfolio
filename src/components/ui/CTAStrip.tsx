import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import SchedulingModal from '../scheduling/SchedulingModal';

interface CTAStripProps {
  headline?: string;
  subtext?: string;
}

const CTAStrip = ({
  headline = 'Ready to scale? Let\'s talk.',
  subtext = 'Book a free 30-minute strategy session — no commitment required.',
}: CTAStripProps) => {
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);

  return (
    <>
      <section className="border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-20 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] mb-3">
            {headline}
          </h2>
          <p className="text-sm text-[var(--text-tertiary)] mb-8 max-w-md mx-auto">
            {subtext}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setIsSchedulingOpen(true)}
              className="btn-primary"
            >
              Book a Strategy Session
              <ArrowRight size={15} className="ml-2" />
            </button>
          </div>
        </div>
      </section>
      <SchedulingModal isOpen={isSchedulingOpen} onClose={() => setIsSchedulingOpen(false)} />
    </>
  );
};

export default CTAStrip;
