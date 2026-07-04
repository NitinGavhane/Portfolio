import { Link } from 'react-router-dom';
import { useConsent } from '../contexts/ConsentContext';

/**
 * GDPR/AdSense cookie consent banner. Renders only until the visitor
 * has made a choice, which is persisted in localStorage.
 */
const CookieConsent = () => {
  const { consent, accept, reject } = useConsent();

  if (consent !== 'unknown') return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6"
    >
      <div className="max-w-3xl mx-auto bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-lg shadow-[0_12px_40px_-8px_rgba(0,0,0,0.25)] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
          This site uses cookies for analytics and to serve personalised ads via Google AdSense.
          See our{' '}
          <Link to="/privacy-policy" className="editorial-link">
            Privacy Policy
          </Link>{' '}
          for details.
        </p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={reject} className="btn-outline text-sm whitespace-nowrap">
            Decline
          </button>
          <button onClick={accept} className="btn-primary text-sm whitespace-nowrap">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
