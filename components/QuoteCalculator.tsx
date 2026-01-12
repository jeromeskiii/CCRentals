import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BUSINESS_RULES } from '../config/businessRules';

interface PricingTier {
  name: string;
  basePrice: number;
  perDayRate: number;
  perUnitRate: number;
  description: string;
  features: string[];
}

const pricingTiers: Record<string, PricingTier> = {
  'Standard Portable Toilet': {
    name: 'Standard Portable Toilet',
    basePrice: 125,
    perDayRate: 15,
    perUnitRate: 125,
    description: 'Basic portable toilet for construction sites and events',
    features: ['Daily service', 'Hand sanitizer', 'Standard supplies'],
  },
  'Deluxe Unit with Sink': {
    name: 'Deluxe Unit with Sink',
    basePrice: 175,
    perDayRate: 20,
    perUnitRate: 175,
    description: 'Enhanced unit with built-in handwashing station',
    features: ['Built-in sink', 'Running water', 'Premium supplies'],
  },
  'ADA Compliant Units': {
    name: 'ADA Compliant Units',
    basePrice: 195,
    perDayRate: 22,
    perUnitRate: 195,
    description: 'Wheelchair accessible with spacious interior',
    features: ['ADA compliant', 'Wheelchair ramps', 'Grab bars'],
  },
  '2-Stall Luxury Trailer': {
    name: '2-Stall Luxury Trailer',
    basePrice: 850,
    perDayRate: 125,
    perUnitRate: 850,
    description: 'Climate-controlled luxury restroom for VIP events',
    features: ['Climate control', 'Premium finishes', 'Music system', 'Lighting'],
  },
  '4-Stall Luxury Trailer': {
    name: '4-Stall Luxury Trailer',
    basePrice: 1450,
    perDayRate: 195,
    perUnitRate: 1450,
    description: 'Full-service luxury with multiple stalls',
    features: ['4 private stalls', 'Climate control', 'Premium amenities', 'Attendant available'],
  },
  'Handwash Stations': {
    name: 'Handwash Stations',
    basePrice: 95,
    perDayRate: 12,
    perUnitRate: 95,
    description: 'Standalone handwashing units',
    features: ['Soap dispenser', 'Paper towels', 'Running water'],
  },
};

interface QuoteCalculatorProps {
  onRequestQuote?: (details: QuoteDetails) => void;
}

export interface QuoteDetails {
  serviceType: string;
  units: number;
  duration: number;
  startDate: string;
  estimatedTotal: number;
  breakdown: {
    basePrice: number;
    durationCharge: number;
    unitCharge: number;
    deliveryFee: number;
    total: number;
  };
}

const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({ onRequestQuote }) => {
  const [serviceType, setServiceType] = useState<string>('Standard Portable Toilet');
  const [units, setUnits] = useState<number>(1);
  const [duration, setDuration] = useState<number>(7);
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [showBreakdown, setShowBreakdown] = useState(false);

  const calculateQuote = () => {
    const tier = pricingTiers[serviceType];
    if (!tier) return null;

    const basePrice = tier.basePrice;
    const durationCharge =
      tier.perDayRate * Math.max(0, duration - BUSINESS_RULES.pricing.includedDays);
    const unitCharge = tier.perUnitRate * Math.max(0, units - BUSINESS_RULES.pricing.includedUnits);
    const deliveryFee =
      units >= BUSINESS_RULES.pricing.freeDeliveryThreshold
        ? 0
        : BUSINESS_RULES.pricing.deliveryFee;
    const total = basePrice + durationCharge + unitCharge + deliveryFee;

    return {
      basePrice,
      durationCharge,
      unitCharge,
      deliveryFee,
      total,
    };
  };

  const quote = calculateQuote();
  const selectedTier = pricingTiers[serviceType];

  const handleRequestQuote = () => {
    if (quote && onRequestQuote) {
      onRequestQuote({
        serviceType,
        units,
        duration,
        startDate,
        estimatedTotal: quote.total,
        breakdown: quote,
      });
    }
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="mb-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Instant Quote Calculator
        </h3>
        <p className="text-muted-foreground text-sm sm:text-base">
          Get a quick estimate for your rental needs
        </p>
      </div>

      <div className="space-y-6">
        {/* Service Type Selection */}
        <div>
          <label className="block text-sm font-bold text-foreground mb-3" id="service-type-label">
            Service Type
          </label>
          <div
            className="grid sm:grid-cols-2 gap-3"
            role="radiogroup"
            aria-labelledby="service-type-label"
          >
            {Object.keys(pricingTiers).map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setServiceType(type)}
                aria-label={`Select ${pricingTiers[type].name}, starting at $${pricingTiers[type].basePrice}`}
                aria-pressed={serviceType === type}
                role="radio"
                aria-checked={serviceType === type}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  serviceType === type
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/30 hover:bg-secondary/30'
                }`}
              >
                <div className="font-bold text-sm text-foreground mb-1">
                  {pricingTiers[type].name}
                </div>
                <div className="text-xs text-muted-foreground">
                  From $${pricingTiers[type].basePrice}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Service Details */}
        {selectedTier && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-secondary/20 rounded-xl p-4 border border-border"
            role="region"
            aria-label="Selected service details"
          >
            <p className="text-sm text-muted-foreground mb-2">{selectedTier.description}</p>
            <div className="flex flex-wrap gap-2">
              {selectedTier.features.map((feature, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                >
                  ✓ {feature}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Number of Units */}
        <div>
          <label className="block text-sm font-bold text-foreground mb-2" htmlFor="units-value">
            Number of Units
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setUnits(Math.max(1, units - 1))}
              aria-label="Decrease number of units"
              className="w-12 h-12 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold transition-all hover:scale-105 active:scale-95"
            >
              -
            </button>
            <div className="flex-1 text-center">
              <div id="units-value" className="text-3xl font-bold text-primary">
                {units}
              </div>
              <div className="text-xs text-muted-foreground">{units === 1 ? 'unit' : 'units'}</div>
            </div>
            <button
              type="button"
              onClick={() => setUnits(units + 1)}
              aria-label="Increase number of units"
              className="w-12 h-12 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold transition-all hover:scale-105 active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* Rental Duration */}
        <div>
          <label className="block text-sm font-bold text-foreground mb-2" htmlFor="duration-slider">
            Rental Duration (Days)
          </label>
          <input
            id="duration-slider"
            type="range"
            min="1"
            max="90"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            aria-label={`Rental duration in days: ${duration}`}
            aria-valuemin={1}
            aria-valuemax={90}
            aria-valuenow={duration}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-muted-foreground">1 day</span>
            <span className="text-2xl font-bold text-primary" aria-live="polite">
              {duration}
            </span>
            <span className="text-sm text-muted-foreground">90 days</span>
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-bold text-foreground mb-2" htmlFor="start-date">
            Start Date
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Price Breakdown Toggle */}
        {quote && (
          <div className="border-t border-border pt-6">
            <button
              type="button"
              onClick={() => setShowBreakdown(!showBreakdown)}
              aria-expanded={showBreakdown}
              aria-controls="price-breakdown-details"
              className="w-full flex items-center justify-between mb-4"
            >
              <span className="text-sm font-bold text-muted-foreground">Price Breakdown</span>
              <svg
                className={`w-5 h-5 text-muted-foreground transition-transform ${
                  showBreakdown ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <AnimatePresence>
              {showBreakdown && (
                <motion.div
                  id="price-breakdown-details"
                  role="region"
                  aria-label="Price breakdown details"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 mb-4"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Price (1 unit, 1 day)</span>
                    <span className="font-medium">$${quote.basePrice.toFixed(2)}</span>
                  </div>
                  {quote.durationCharge > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Additional Days ({duration - 1} × $${selectedTier.perDayRate})
                      </span>
                      <span className="font-medium">$${quote.durationCharge.toFixed(2)}</span>
                    </div>
                  )}
                  {quote.unitCharge > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Additional Units ({units - 1} × $${selectedTier.perUnitRate})
                      </span>
                      <span className="font-medium">$${quote.unitCharge.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="font-medium">
                      {quote.deliveryFee === 0 ? (
                        <span className="text-primary">FREE (5+ units)</span>
                      ) : (
                        `$${quote.deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Total */}
            <div className="bg-primary/10 rounded-xl p-4 border-2 border-primary/20">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Estimated Total</div>
                  <div className="text-4xl font-bold text-primary">$${quote.total.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">{units} units</div>
                  <div className="text-xs text-muted-foreground">{duration} days</div>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-3">
              *Estimate only. Final pricing may vary based on location and specific requirements.
            </p>

            {/* CTA Button */}
            <button
              type="button"
              onClick={handleRequestQuote}
              className="w-full mt-4 px-6 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
            >
              Request This Quote
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteCalculator;
