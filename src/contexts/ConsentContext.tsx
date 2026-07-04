import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { loadAdSense } from '../lib/adsense';

type ConsentState = 'unknown' | 'accepted' | 'rejected';

interface ConsentContextValue {
  consent: ConsentState;
  accept: () => void;
  reject: () => void;
}

const STORAGE_KEY = 'cookie-consent';

const ConsentContext = createContext<ConsentContextValue>({
  consent: 'unknown',
  accept: () => {},
  reject: () => {},
});

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>('unknown');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'accepted' || saved === 'rejected') setConsent(saved);
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  useEffect(() => {
    if (consent === 'accepted') loadAdSense();
  }, [consent]);

  const persist = (value: ConsentState) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setConsent(value);
  };

  return (
    <ConsentContext.Provider
      value={{ consent, accept: () => persist('accepted'), reject: () => persist('rejected') }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  return useContext(ConsentContext);
}
