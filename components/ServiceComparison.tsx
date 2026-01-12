import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ServiceOption {
  name: string;
  price: string;
  description: string;
  features: string[];
  bestFor: string;
  icon: string;
}

const services: ServiceOption[] = [
  {
    name: 'Standard Portable Toilet',
    price: '$125',
    description: 'Reliable, clean, and ready for any job site',
    icon: '🚽',
    bestFor: 'Construction sites, outdoor events',
    features: [
      'Daily service available',
      'Hand sanitizer included',
      'Standard supplies',
      'Door lock',
      'Ventilation',
      'Waste tank: 60 gallons',
    ],
  },
  {
    name: 'Deluxe Unit with Sink',
    price: '$175',
    description: 'Built-in handwashing station for improved hygiene',
    icon: '🚿',
    bestFor: 'Food service events, upscale gatherings',
    features: [
      'Built-in sink',
      'Running water (freshwater tank)',
      'Soap dispenser',
      'Paper towel dispenser',
      'Mirror',
      'Enhanced ventilation',
      'Waste tank: 60 gallons',
    ],
  },
  {
    name: 'ADA Compliant Units',
    price: '$195',
    description: 'Wheelchair accessible with additional space',
    icon: '♿',
    bestFor: 'Public events, compliance requirements',
    features: [
      'Wheelchair accessible',
      "Spacious interior (5' × 5')",
      'Grab bars',
      'Low-entry ramp',
      'Hand sanitizer',
      'Waste tank: 70 gallons',
      'ADA compliant signage',
    ],
  },
  {
    name: '2-Stall Luxury Trailer',
    price: '$850',
    description: 'Climate-controlled, elegant comfort for VIP events',
    icon: '✨',
    bestFor: 'Weddings, corporate events, VIP areas',
    features: [
      'Climate control (A/C & heat)',
      'Premium finishes',
      'LED lighting',
      'Music system',
      'Hot/cold running water',
      'Flushing toilets',
      'Full-length mirrors',
      'Hardwood floors',
    ],
  },
  {
    name: '4-Stall Luxury Trailer',
    price: '$1,450',
    description: 'Full-service luxury with multiple stalls and premium finishes',
    icon: '👑',
    bestFor: 'Large weddings, premium festivals',
    features: [
      '4 private stalls',
      'Climate control',
      'Premium fixtures',
      'Mood lighting',
      'Premium sound system',
      'Attendant area',
      'Marble countertops',
      'Designer fixtures',
      'On-site attendant available',
    ],
  },
  {
    name: 'Handwash Stations',
    price: '$95',
    description: 'Standalone units with soap and running water',
    icon: '🧼',
    bestFor: 'Supplement to toilets, food service',
    features: [
      'Soap dispenser',
      'Paper towels',
      'Running water',
      'Foot-pump operation',
      'Waste tank: 30 gallons',
      'No power required',
    ],
  },
];

interface ServiceComparisonProps {
  onSelectService?: (serviceName: string) => void;
}

const ServiceComparison: React.FC<ServiceComparisonProps> = ({ onSelectService }) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Standard Portable Toilet',
    'Deluxe Unit with Sink',
  ]);

  const toggleService = (serviceName: string) => {
    if (selectedServices.includes(serviceName)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== serviceName));
      }
    } else {
      if (selectedServices.length < 3) {
        setSelectedServices([...selectedServices, serviceName]);
      }
    }
  };

  const compareFeatures = () => {
    const allFeatures = new Set<string>();
    selectedServices.forEach((serviceName) => {
      const service = services.find((s) => s.name === serviceName);
      service?.features.forEach((f) => allFeatures.add(f));
    });
    return Array.from(allFeatures);
  };

  const hasFeature = (serviceName: string, feature: string) => {
    const service = services.find((s) => s.name === serviceName);
    return service?.features.includes(feature) || false;
  };

  const allFeatures = compareFeatures();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Compare Services</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select up to 3 services to compare features side-by-side
        </p>
      </div>

      {/* Service Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {services.map((service) => (
          <button
            key={service.name}
            onClick={() => toggleService(service.name)}
            disabled={!selectedServices.includes(service.name) && selectedServices.length >= 3}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedServices.includes(service.name)
                ? 'border-primary bg-primary/10 scale-105'
                : 'border-border hover:border-primary/30 hover:bg-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            <div className="text-3xl mb-2">{service.icon}</div>
            <div className="text-xs font-bold text-foreground line-clamp-2">{service.name}</div>
            {selectedServices.includes(service.name) && (
              <div className="mt-2 text-primary text-xs font-bold">✓ Selected</div>
            )}
          </button>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: `200px repeat(${selectedServices.length}, 1fr)` }}
          >
            {/* Header Row */}
            <div className="font-bold text-foreground text-sm sticky left-0 bg-background z-10">
              Service Details
            </div>
            {selectedServices.map((serviceName) => {
              const service = services.find((s) => s.name === serviceName)!;
              return (
                <motion.div
                  key={serviceName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-2xl p-6 relative"
                >
                  <button
                    onClick={() => toggleService(serviceName)}
                    className="absolute top-3 right-3 p-1 hover:bg-secondary rounded-full transition-colors"
                  >
                    <svg
                      className="w-4 h-4 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <h3 className="font-bold text-foreground mb-2 text-sm">{service.name}</h3>
                  <div className="text-2xl font-bold text-primary mb-3">{service.price}</div>
                  <p className="text-xs text-muted-foreground mb-4">{service.description}</p>
                  <div className="bg-secondary/30 rounded-lg p-3 mb-4">
                    <div className="text-xs font-bold text-foreground mb-1">Best For:</div>
                    <div className="text-xs text-muted-foreground">{service.bestFor}</div>
                  </div>
                  {onSelectService && (
                    <button
                      onClick={() => onSelectService(serviceName)}
                      className="w-full py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90 transition-all"
                    >
                      Select
                    </button>
                  )}
                </motion.div>
              );
            })}

            {/* Features Comparison */}
            <div className="col-span-full mt-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Feature Comparison</h3>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {allFeatures.map((feature, idx) => (
                  <div
                    key={feature}
                    className={`grid gap-6 p-4 ${
                      idx % 2 === 0 ? 'bg-secondary/10' : 'bg-transparent'
                    }`}
                    style={{ gridTemplateColumns: `200px repeat(${selectedServices.length}, 1fr)` }}
                  >
                    <div className="text-sm text-foreground font-medium">{feature}</div>
                    {selectedServices.map((serviceName) => (
                      <div key={serviceName} className="flex justify-center">
                        {hasFeature(serviceName, feature) ? (
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-primary"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-muted/10 flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-muted-foreground/30"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-6">
        <p className="text-sm text-muted-foreground mb-4">
          Need help choosing? Our team can recommend the best options for your event.
        </p>
        <a
          href="tel:424-262-2906"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 hover:scale-105 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          Call (424) 262-2906
        </a>
      </div>
    </div>
  );
};

export default ServiceComparison;
