/**
 * useAnalytics Hook - React hook for tracking events in components
 */

import React, { useCallback, useEffect } from 'react';
import { analytics, analyticsEvents, type AnalyticsEvent } from '../lib/analytics';

/**
 * Track an event with optional properties
 */
export function useAnalytics() {
  const track = useCallback((event: string, props?: Record<string, unknown>) => {
    analytics.track(event, props);
  }, []);

  const trackEvent = useCallback((event: AnalyticsEvent, props?: Record<string, unknown>) => {
    analytics.track(event, props);
  }, []);

  const flush = useCallback(() => {
    analytics.flush();
  }, []);

  return { track, trackEvent, flush };
}

/**
 * Track page views on mount
 */
export function usePageView(pageName: string): void {
  useEffect(() => {
    analytics.track(analyticsEvents.pageViewed, { page: pageName });
  }, [pageName]);
}

/**
 * Track component visibility (for scroll depth, etc.)
 */
export function useVisibleTracking(
  eventName: AnalyticsEvent,
  once: boolean = true
): (node: Element | null) => void {
  const observerRef = React.useRef<IntersectionObserver | null>(null);
  const currentNodeRef = React.useRef<Element | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup: disconnect observer and clear refs when component unmounts
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      currentNodeRef.current = null;
    };
  }, []);

  return useCallback(
    (node: Element | null) => {
      // If node becomes null, disconnect observer
      if (!node) {
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
        currentNodeRef.current = null;
        return;
      }

      // If we already have a different node, disconnect the old observer
      if (currentNodeRef.current && currentNodeRef.current !== node) {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      }

      currentNodeRef.current = node;

      // Create new observer if none exists
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                analytics.track(eventName);
                if (once && observerRef.current) {
                  observerRef.current.unobserve(node);
                }
              }
            });
          },
          { threshold: 0.5 }
        );
      }

      observerRef.current.observe(node);
    },
    [eventName, once]
  );
}

/**
 * Track click events on a ref
 */
export function useClickTracking<T extends HTMLElement>(
  eventName: AnalyticsEvent,
  props?: Record<string, unknown>
): (node: T | null) => void {
  const currentNodeRef = React.useRef<T | null>(null);
  const handlerRef = React.useRef<((e: Event) => void) | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup: remove event listener and clear refs when component unmounts
      if (currentNodeRef.current && handlerRef.current) {
        currentNodeRef.current.removeEventListener('click', handlerRef.current);
      }
      currentNodeRef.current = null;
      handlerRef.current = null;
    };
  }, []);

  return useCallback(
    (node: T | null) => {
      // If node becomes null, remove listener
      if (!node) {
        if (currentNodeRef.current && handlerRef.current) {
          currentNodeRef.current.removeEventListener('click', handlerRef.current);
        }
        currentNodeRef.current = null;
        handlerRef.current = null;
        return;
      }

      // If we already have a different node, remove the old listener
      if (currentNodeRef.current && currentNodeRef.current !== node) {
        if (handlerRef.current) {
          currentNodeRef.current.removeEventListener('click', handlerRef.current);
        }
      }

      currentNodeRef.current = node;

      // Create handler if none exists
      if (!handlerRef.current) {
        handlerRef.current = () => {
          analytics.track(eventName, props);
        };
      }

      node.addEventListener('click', handlerRef.current);
    },
    [eventName, props]
  );
}

/**
 * Combine multiple tracking utilities for convenience
 */
export function useTracking() {
  const { track, trackEvent, flush } = useAnalytics();

  return {
    // Generic tracking
    track,

    // Predefined events
    trackQuoteClick: (source?: string) => trackEvent(analyticsEvents.quoteClicked, { source }),
    trackGetQuoteClick: (location?: string) =>
      trackEvent(analyticsEvents.getQuoteClick, { location }),
    trackPhoneClick: (phoneNumber?: string) =>
      trackEvent(analyticsEvents.phoneClicked, { phone: phoneNumber }),
    trackEmailClick: (email?: string) => trackEvent(analyticsEvents.emailClicked, { email }),
    trackFormStarted: (formName: string) =>
      trackEvent(analyticsEvents.formStarted, { form: formName }),
    trackFormStep: (formName: string, step: string) =>
      trackEvent(analyticsEvents.formStepCompleted, { form: formName, step }),
    trackFormSubmitted: (formName: string) =>
      trackEvent(analyticsEvents.formSubmitted, { form: formName }),
    trackFormSuccess: (formName: string) =>
      trackEvent(analyticsEvents.formSuccess, { form: formName }),
    trackServiceViewed: (serviceId: string, serviceName: string) =>
      trackEvent(analyticsEvents.serviceViewed, {
        service_id: serviceId,
        service_name: serviceName,
      }),
    trackServiceClicked: (serviceId: string, serviceName: string) =>
      trackEvent(analyticsEvents.serviceClicked, {
        service_id: serviceId,
        service_name: serviceName,
      }),
    trackZipCodeCheck: (zipCode: string, served: boolean) =>
      trackEvent(served ? analyticsEvents.zipCodeServed : analyticsEvents.zipCodeNotServed, {
        zip_code: zipCode,
      }),

    // Utility
    flush,
  };
}
