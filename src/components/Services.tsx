import { useRef, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const services = [
  {
    id: 'web-development',
    number: '01',
    title: 'Web Application Development',
    description:
      'We design and build high-performance, secure web applications tailored to your business — from SaaS platforms and workflow automation to customer-facing products at scale.',
    deliverables: ['React, Next.js & Node.js', 'Custom business logic', 'Mobile-first & responsive', 'Ongoing support'],
    cta: 'Get a Quote',
  },
  {
    id: 'qa-testing',
    number: '02',
    title: 'Quality Assurance & Security Auditing',
    description:
      'Backed by 1000+ vulnerabilities disclosed to Dell, Mastercard, and more, our QA and security auditing ensures your application is robust and audit-ready before it reaches users.',
    deliverables: ['Penetration testing', 'Vulnerability assessment', 'Functional & regression testing', 'Bugcrowd recognised'],
    cta: 'Request an Audit',
  },
  {
    id: 'content-writing',
    number: '03',
    title: 'Technical Writing & Content',
    description:
      'We translate complex technical concepts into clear documentation, developer guides, and thought-leadership articles — proven with a published Angular Developer\'s Handbook.',
    deliverables: ['API & SDK documentation', 'Developer tutorials', 'E-books & long-form content', 'SEO-optimised tech blogs'],
    cta: 'See Writing Samples',
  },
  {
    id: 'consulting',
    number: '04',
    title: 'Strategic Tech Advisory',
    description:
      'Architecture reviews, vendor selection, engineering roadmaps, and delivery risk management — strategic guidance that helps growing businesses make the right technology decisions faster.',
    deliverables: ['Tech stack selection', 'Engineering roadmap', 'Team scaling advice', 'Free Discovery Call'],
    cta: 'Book a Call',
  },
];

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const goToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="services"
      ref={sectionRef}
      className="bg-[var(--bg-primary)] border-t border-[var(--border-primary)]"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-20 sm:py-28">

        {/* Section header */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-20 items-start mb-16 sm:mb-20">
          <div>
            <p className="editorial-label mb-4">What We Do</p>
            <h2 className="editorial-heading text-4xl sm:text-5xl text-[var(--text-primary)]">
              Services
            </h2>
          </div>
          <p className="editorial-body self-end max-w-xl">
            From first line of code to post-launch growth — we cover the full spectrum of digital product delivery, security, and strategy.
          </p>
        </div>

        {/* Services — numbered list style */}
        <div className="divide-y divide-[var(--border-primary)]">
          {services.map((s, i) => (
            <div
              key={s.id}
              id={s.id}
              className={`group py-10 sm:py-14 grid md:grid-cols-[80px_1fr_1fr_auto] gap-6 lg:gap-12 items-start transition-colors duration-200 hover:bg-[var(--bg-secondary)] -mx-6 sm:-mx-8 px-6 sm:px-8 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Number */}
              <span className="font-serif text-3xl sm:text-5xl leading-none text-[var(--text-muted)] group-hover:text-[var(--text-tertiary)] transition-colors pt-1">
                {s.number}
              </span>

              {/* Title + Description */}
              <div>
                <h3 className="editorial-heading text-2xl sm:text-3xl text-[var(--text-primary)] mb-4">
                  {s.title}
                </h3>
                <p className="editorial-body text-[var(--text-secondary)] max-w-md">
                  {s.description}
                </p>
              </div>

              {/* Deliverables */}
              <ul className="space-y-2">
                {s.deliverables.map((d, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-[var(--text-tertiary)]">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--text-muted)] flex-shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>

              {/* CTA arrow */}
              <button
                onClick={goToContact}
                className="flex-shrink-0 self-center group/btn flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] hover:gap-3 transition-all duration-200 pt-1"
              >
                {s.cta}
                <ArrowRight size={15} className="group-hover/btn:translate-x-0.5 transition-transform duration-200" />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-[var(--border-primary)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] mb-1">
              Not sure where to start?
            </p>
            <p className="text-[var(--text-tertiary)] text-sm">
              Book a free 30-minute Discovery Call — no commitment required.
            </p>
          </div>
          <button onClick={goToContact} className="btn-primary flex-shrink-0">
            Get a Free Quote
            <ArrowRight size={15} className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
