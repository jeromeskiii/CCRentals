/**
 * Service Areas Map Component
 *
 * Features:
 * - Google Maps embed for coverage visualization
 * - ZIP code checker with instant results
 * - Service region display
 * - Contact CTA when ZIP is not served
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isZipCodeServed, SERVICE_REGIONS, type ServiceRegion } from '../lib/serviceAreas';
import { useTracking } from '../hooks/useAnalytics';

interface ServiceAreaMapProps {
  compact?: boolean;
}

export const ServiceAreaMap: React.FC<ServiceAreaMapProps> = ({ compact = false }) => {
  const { trackZipCodeCheck } = useTracking();
  const [zipInput, setZipInput] = useState('');
  const [zipResult, setZipResult] = useState<{
    zip: string;
    served: boolean;
    region?: ServiceRegion;
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleZipCheck = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!zipInput.trim()) return;

      setIsChecking(true);

      // Simulate checking delay for UX
      setTimeout(() => {
        const normalizedZip = zipInput.replace(/\D/g, '').slice(0, 5);
        const result = isZipCodeServed(normalizedZip);

        setZipResult({
          zip: normalizedZip,
          served: result.served,
          region: result.region,
        });

        trackZipCodeCheck(normalizedZip, result.served);
        setIsChecking(false);
      }, 500);
    },
    [zipInput, trackZipCodeCheck]
  );

  // Google Maps embed URL - replace with your actual embed URL
  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d26573640.22774338!2d-119.4179316!3d35.3732921!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1736800000000!5m2!1sen!2sus`;

  if (compact) {
    return (
      <div className="bg-background rounded-2xl p-6 shadow-lg border border-border">
        <h3 className="text-xl font-bold text-foreground mb-4">📍 Check Service Area</h3>

        <form onSubmit={handleZipCheck} className="flex gap-2 mb-4">
          <input
            type="text"
            value={zipInput}
            onChange={(e) => setZipInput(e.target.value)}
            placeholder="Enter ZIP Code"
            maxLength={5}
            className="flex-1 px-4 py-3 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
          />
          <button
            type="submit"
            disabled={isChecking || zipInput.length < 5}
            className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {isChecking ? '...' : 'Check'}
          </button>
        </form>

        <AnimatePresence mode="wait">
          {zipResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl ${
                zipResult.served
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-amber-50 border border-amber-200'
              }`}
            >
              {zipResult.served ? (
                <div>
                  <p className="font-bold text-green-800">✅ We serve {zipResult.zip}!</p>
                  <p className="text-sm text-green-700">{zipResult.region?.name}</p>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-amber-800">❌ Outside our current coverage</p>
                  <p className="text-sm text-amber-700">We may still be able to help. Call us!</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">🗺️ Service Areas</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide portable toilet rentals and site services throughout Southern California.
            Enter your ZIP code to confirm we serve your location.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="bg-background rounded-2xl overflow-hidden shadow-lg border border-border">
            <div className="aspect-[4/3] lg:aspect-auto lg:h-full min-h-[300px]">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Service Area Map - Southern California"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* ZIP Checker & Regions */}
          <div className="space-y-6">
            {/* ZIP Code Checker */}
            <div className="bg-background rounded-2xl p-6 shadow-lg border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">📮 Check Your ZIP Code</h3>

              <form onSubmit={handleZipCheck} className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={zipInput}
                    onChange={(e) => setZipInput(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    placeholder="Enter 5-digit ZIP"
                    maxLength={5}
                    className="flex-1 px-4 py-3 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-lg"
                  />
                  <button
                    type="submit"
                    disabled={isChecking || zipInput.length < 5}
                    className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    {isChecking ? (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    ) : (
                      'Check'
                    )}
                  </button>
                </div>
              </form>

              <AnimatePresence mode="wait">
                {zipResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`mt-4 p-4 rounded-xl ${
                      zipResult.served
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-amber-50 border border-amber-200'
                    }`}
                  >
                    {zipResult.served ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">✅</span>
                          <span className="font-bold text-green-800 text-lg">
                            We serve ZIP {zipResult.zip}!
                          </span>
                        </div>
                        <p className="text-green-700">
                          Coverage: <strong>{zipResult.region?.name}</strong>
                        </p>
                        <p className="text-green-600 text-sm">{zipResult.region?.description}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">❌</span>
                          <span className="font-bold text-amber-800 text-lg">
                            Outside current coverage
                          </span>
                        </div>
                        <p className="text-amber-700 text-sm">
                          We may still be able to help. Call us for a custom quote!
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Service Regions */}
            <div className="bg-background rounded-2xl p-6 shadow-lg border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">🏢 Counties We Serve</h3>
              <div className="space-y-3">
                {SERVICE_REGIONS.slice(0, 4).map((region) => (
                  <div
                    key={region.name}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 hover:bg-secondary/30 transition-colors"
                  >
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: region.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{region.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{region.description}</p>
                    </div>
                    <span className="text-sm text-muted-foreground flex-shrink-0">
                      {region.zips.length} ZIPs
                    </span>
                  </div>
                ))}
                {SERVICE_REGIONS.length > 4 && (
                  <p className="text-sm text-muted-foreground text-center">
                    + {SERVICE_REGIONS.length - 4} more regions
                  </p>
                )}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
              <h3 className="text-lg font-bold text-foreground mb-2">
                📞 Questions About Coverage?
              </h3>
              <p className="text-muted-foreground mb-4">
                Not sure if we serve your area? Give us a call!
              </p>
              <a
                href="tel:+15551234567"
                className="inline-flex items-center justify-center w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Call Us Today
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreaMap;
