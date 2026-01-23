/**
 * Analytics Service - Lightweight, privacy-focused event tracking
 *
 * Features:
 * - Simple track(event, props) API
 * - Privacy-friendly (no PII, optional anonymization)
 * - Pluggable providers (Vercel, PostHog, Plausible, custom)
 * - Event batching for performance
 */

import { safeLocalStorage } from './validation';

// Provider type definition
type AnalyticsProvider = 'vercel' | 'posthog' | 'plausible' | 'custom' | 'none';

// Configuration interface
interface AnalyticsConfig {
  provider: AnalyticsProvider;
  enabled: boolean;
  anonymizeIp: boolean;
  debug: boolean;
  customEndpoint?: string;
}

// Event tracking interface
interface TrackedEvent {
  name: string;
  props?: Record<string, unknown>;
  timestamp: number;
}

// Default configuration
const defaultConfig: AnalyticsConfig = {
  provider: 'none',
  enabled: true,
  anonymizeIp: true,
  debug: false,
};

// Event queue for batching
let eventQueue: TrackedEvent[] = [];
let flushTimeout: ReturnType<typeof setTimeout> | null = null;
let currentConfig: AnalyticsConfig = { ...defaultConfig };

// Initialize from environment
function initFromEnv(): void {
  const stored = safeLocalStorage.getItem<Partial<AnalyticsConfig>>('analytics_config', {});
  currentConfig = { ...defaultConfig, ...stored };

  // Check for Vercel Analytics
  if (typeof window !== 'undefined' && (window as { _vercel?: unknown })._vercel) {
    currentConfig.provider = 'vercel';
  }
}

// Track an event
export function track(event: string, props?: Record<string, unknown>): void {
  if (!currentConfig.enabled) {
    logDebug('Analytics disabled, skipping event:', event);
    return;
  }

  const trackedEvent: TrackedEvent = {
    name: event,
    props: currentConfig.anonymizeIp ? anonymizeProps(props) : props,
    timestamp: Date.now(),
  };

  eventQueue.push(trackedEvent);

  // Schedule batch flush
  if (!flushTimeout) {
    flushTimeout = setTimeout(flushEvents, 1000); // Flush after 1 second of inactivity
  }

  logDebug('Event queued:', event, props);
}

// Flush event queue to provider
async function flushEvents(): Promise<void> {
  if (eventQueue.length === 0) return;

  const events = [...eventQueue];
  eventQueue = [];
  flushTimeout = null;

  try {
    switch (currentConfig.provider) {
      case 'vercel':
        await trackVercel(events);
        break;
      case 'plausible':
        await trackPlausible(events);
        break;
      case 'custom':
        await trackCustom(events);
        break;
      case 'none':
      default:
        logDebug('No analytics provider configured, events discarded');
    }
  } catch (error) {
    console.error('Analytics flush error:', error);
  }
}

// Vercel Analytics tracking
async function trackVercel(events: TrackedEvent[]): Promise<void> {
  // Vercel Analytics automatically tracks page views
  // For custom events, we can use the beacon API
  const endpoint = currentConfig.customEndpoint || '/api/analytics';

  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    events.forEach((event) => {
      const payload = JSON.stringify(event);
      navigator.sendBeacon(endpoint, payload);
    });
  } else {
    // Fallback to fetch
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
      keepalive: true,
    });
  }
}

// Plausible Analytics tracking
async function trackPlausible(events: TrackedEvent[]): Promise<void> {
  // Plausible uses a script-based approach, but we can also use their API
  const domain = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

  events.forEach((event) => {
    // Use Plausible's event API
    const payload = {
      name: event.name,
      props: event.props,
      url: typeof window !== 'undefined' ? window.location.href : '',
      domain,
    };

    // Send to Plausible API
    fetch('https://plausible.io/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Silently fail - analytics shouldn't break the app
    });
  });
}

// Custom endpoint tracking
async function trackCustom(events: TrackedEvent[]): Promise<void> {
  if (!currentConfig.customEndpoint) return;

  await fetch(currentConfig.customEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events }),
  });
}

// Remove PII from event props
function anonymizeProps(props?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!props) return undefined;

  const piiFields = ['email', 'phone', 'name', 'address', 'ip'];
  const sanitized: Record<string, unknown> = {};

  Object.entries(props).forEach(([key, value]) => {
    const lowerKey = key.toLowerCase();
    if (piiFields.some((pii) => lowerKey.includes(pii))) {
      // Hash or redact PII
      sanitized[key] = typeof value === 'string' ? '[REDACTED]' : value;
    } else {
      sanitized[key] = value;
    }
  });

  return sanitized;
}

// Debug logging helper
function logDebug(...args: unknown[]): void {
  if (currentConfig.debug) {
    console.log('[Analytics]', ...args);
  }
}

// Configuration helpers
export const analytics = {
  // Initialize analytics
  init: initFromEnv,

  // Track events
  track,

  // Flush pending events (call this before page unload)
  flush: flushEvents,

  // Configure analytics
  configure: (config: Partial<AnalyticsConfig>): void => {
    currentConfig = { ...currentConfig, ...config };
    safeLocalStorage.setItem('analytics_config', currentConfig);
    logDebug('Analytics configured:', currentConfig);
  },

  // Enable/disable tracking
  enable: (): void => {
    currentConfig.enabled = true;
  },

  disable: (): void => {
    currentConfig.enabled = false;
  },

  // Check if analytics is enabled
  isEnabled: (): boolean => currentConfig.enabled,
};

// Pre-defined event names for consistency
export const analyticsEvents = {
  // CTA interactions
  quoteClicked: 'quote_clicked',
  getQuoteClick: 'get_quote_click',
  phoneClicked: 'phone_clicked',
  emailClicked: 'email_clicked',
  directionClicked: 'directions_clicked',

  // Form interactions
  formStarted: 'form_started',
  formStepCompleted: 'form_step_completed',
  formSubmitted: 'form_submitted',
  formSuccess: 'form_success',

  // Service interactions
  serviceViewed: 'service_viewed',
  serviceClicked: 'service_clicked',
  serviceExpanded: 'service_expanded',

  // Map interactions
  mapLoaded: 'map_loaded',
  zipCodeChecked: 'zip_code_checked',
  zipCodeServed: 'zip_code_served',
  zipCodeNotServed: 'zip_code_not_served',

  // Navigation
  pageViewed: 'page_viewed',
  sectionViewed: 'section_viewed',

  // Error tracking
  errorOccurred: 'error_occurred',
} as const;

export type AnalyticsEvent = (typeof analyticsEvents)[keyof typeof analyticsEvents];

// Auto-initialize on import
if (typeof window !== 'undefined') {
  initFromEnv();
}
