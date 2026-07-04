import { useEffect, useRef } from 'react';
import { siteConfig } from '../lib/siteConfig';
import { useConsent } from '../contexts/ConsentContext';

interface AdSenseProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

/**
 * Renders a Google AdSense unit — only when a publisher id is configured
 * and the visitor has accepted cookies. Ads are labelled per AdSense policy.
 */
const AdSense = ({ slot, format = 'auto', style }: AdSenseProps) => {
  const insRef = useRef<HTMLModElement>(null);
  const { consent } = useConsent();
  const enabled = !!siteConfig.adsenseClient && consent === 'accepted';

  useEffect(() => {
    if (!enabled || !insRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* AdBlock or loader not ready */
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="adsense-container my-2 text-center">
      <span className="editorial-label block mb-1 text-[10px]">Advertisement</span>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center', minHeight: '90px', ...style }}
        data-ad-client={siteConfig.adsenseClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSense;
