import { siteConfig } from './siteConfig';

let loading = false;

/**
 * Inject the Google AdSense loader script exactly once.
 * No-op when no publisher id is configured (VITE_ADSENSE_CLIENT unset)
 * or when it has already been requested.
 */
export function loadAdSense(): boolean {
  if (!siteConfig.adsenseClient) return false;
  if (typeof document === 'undefined') return false;
  if (loading || document.querySelector('script[data-adsense-loader]') || document.querySelector('script[src*="pagead2.googlesyndication.com"]')) return true;

  loading = true;

  // Site-verification meta tag used by AdSense's "Connect your site" flow.
  if (!document.querySelector('meta[name="google-adsense-account"]')) {
    const meta = document.createElement('meta');
    meta.name = 'google-adsense-account';
    meta.content = siteConfig.adsenseClient;
    document.head.appendChild(meta);
  }

  const s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsenseClient}`;
  s.setAttribute('data-adsense-loader', '');
  document.head.appendChild(s);
  return true;
}
