/// <reference types="astro/client" />

interface Window {
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
  /** Sends a GA4 event, but only after the visitor accepted analytics. */
  tfTrack: (name: string, params?: Record<string, unknown>) => void;
  tfLoadAnalytics?: () => void;
  tfAnalyticsOn?: boolean;
}
