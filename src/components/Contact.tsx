import { useState, useRef, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    emailjs.send(
      'service_9100ozj',
      'template_hnmon7c',
      { from_name: formData.name, from_email: formData.email, subject: formData.subject, message: formData.message },
      'VsZ8BsNajLupj5uWM'
    ).then(() => {
      setStatus('sent');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    }, () => {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    });
  };

  return (
    <section id="contact" ref={ref} className="bg-[var(--bg-primary)] border-t border-[var(--border-primary)]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-20 sm:py-28">

        {/* Header */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-20 items-start mb-16">
          <div>
            <p className="editorial-label mb-4">Get In Touch</p>
            <h2 className="editorial-heading text-4xl sm:text-5xl text-[var(--text-primary)]">
              Book a Strategy Session
            </h2>
          </div>
          <p className="editorial-body self-end max-w-xl">
            Ready to scale your product, secure your application, or get expert strategic guidance? Let's talk business.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-24">

          {/* Left — contact info */}
          <div className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="space-y-6 mb-12">
              {[
                { Icon: Mail,    label: 'Email',    value: 'nitin.gavhane.dev@gmail.com', href: 'mailto:nitin.gavhane.dev@gmail.com' },
                { Icon: Phone,   label: 'Phone',    value: '+91 7972068932',              href: 'tel:+917972068932' },
                { Icon: MapPin,  label: 'Location', value: 'Maharashtra, India',          href: '#' },
              ].map(({ Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-start gap-5 group"
                >
                  <div className="w-10 h-10 border border-[var(--border-primary)] flex items-center justify-center flex-shrink-0 group-hover:border-[var(--border-secondary)] transition-colors">
                    <Icon size={16} className="text-[var(--text-muted)]" />
                  </div>
                  <div>
                    <p className="editorial-label mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{value}</p>
                  </div>
                </a>
              ))}
            </div>

            <div>
              <p className="editorial-label mb-4">Follow</p>
              <div className="flex gap-3">
                {[
                  { Icon: Github,   href: 'https://github.com/NitinGavhane',           label: 'GitHub' },
                  { Icon: Linkedin, href: 'https://www.linkedin.com/in/nitinsgavhane/', label: 'LinkedIn' },
                  { Icon: Twitter,  href: 'https://x.com/NitinGavhane_',               label: 'Twitter' },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)] transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.15s' }}>
            <form onSubmit={sendEmail} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="editorial-label block mb-2">Full Name</label>
                  <input
                    type="text" id="name" name="name"
                    value={formData.name} onChange={handleChange} required
                    className="input-minimal"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="editorial-label block mb-2">Email</label>
                  <input
                    type="email" id="email" name="email"
                    value={formData.email} onChange={handleChange} required
                    className="input-minimal"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="editorial-label block mb-2">Subject</label>
                <input
                  type="text" id="subject" name="subject"
                  value={formData.subject} onChange={handleChange} required
                  className="input-minimal"
                  placeholder="Project discussion"
                />
              </div>
              <div>
                <label htmlFor="message" className="editorial-label block mb-2">Message</label>
                <textarea
                  id="message" name="message"
                  value={formData.message} onChange={handleChange} required
                  rows={6} className="input-minimal resize-none"
                  placeholder="Tell me about your project, goals, and how I can help…"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-primary w-full"
              >
                {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Message Sent ✓' : status === 'error' ? 'Failed — Try Again' : (
                  <>
                    <Send size={15} className="mr-2" />
                    Get a Free Quote
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;