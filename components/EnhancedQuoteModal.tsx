import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, APIError } from '../lib/api';
import { QuoteDetails } from './QuoteCalculator';
import { useModalA11y } from '../hooks/useModalA11y';
import { safeParseInt, sanitizeInput, sanitizeEmail } from '../lib/validation';

interface EnhancedQuoteModalProps {
  open: boolean;
  onClose: () => void;
  prefilledQuote?: QuoteDetails | null;
}

type Step = 'service' | 'details' | 'contact' | 'success';

const EnhancedQuoteModal: React.FC<EnhancedQuoteModalProps> = ({
  open,
  onClose,
  prefilledQuote,
}) => {
  const { modalRef } = useModalA11y({
    isOpen: open,
    onClose,
  });

  const [currentStep, setCurrentStep] = useState<Step>('service');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Form state
  const [serviceType, setServiceType] = useState(
    prefilledQuote?.serviceType || 'Standard Portable Toilet'
  );
  const [units, setUnits] = useState(prefilledQuote?.units || 1);
  const [duration, setDuration] = useState(prefilledQuote?.duration || 7);
  const [startDate, setStartDate] = useState(prefilledQuote?.startDate || '');
  const [eventType, setEventType] = useState('');
  const [attendees, setAttendees] = useState<number>(50);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Sync form state when modal opens or prefilledQuote changes
  useEffect(() => {
    if (!open) return;

    if (prefilledQuote) {
      setServiceType(prefilledQuote.serviceType);
      setUnits(prefilledQuote.units);
      setDuration(prefilledQuote.duration);
      setStartDate(prefilledQuote.startDate);
    } else {
      resetForm();
    }
  }, [open, prefilledQuote]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const serviceTypes = [
    { value: 'Standard Portable Toilet', label: 'Standard Toilet', icon: '🚽' },
    { value: 'Deluxe Unit with Sink', label: 'Deluxe w/ Sink', icon: '🚿' },
    { value: 'ADA Compliant Units', label: 'ADA Unit', icon: '♿' },
    { value: '2-Stall Luxury Trailer', label: '2-Stall Luxury', icon: '✨' },
    { value: '4-Stall Luxury Trailer', label: '4-Stall Luxury', icon: '👑' },
    { value: 'Handwash Stations', label: 'Handwash', icon: '🧼' },
  ];

  const eventTypes = [
    'Construction Site',
    'Wedding',
    'Festival/Concert',
    'Corporate Event',
    'Sporting Event',
    'Community Gathering',
    'Emergency Response',
    'Other',
  ];

  const resetForm = () => {
    setCurrentStep('service');
    setServiceType('Standard Portable Toilet');
    setUnits(1);
    setDuration(7);
    setStartDate('');
    setEventType('');
    setAttendees(50);
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setAddress('');
    setNotes('');
    setError('');
  };

  // Validation helpers
  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) {
      setPhoneError('Phone number is required');
      return false;
    }
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setError('');
    setEmailError('');
    setPhoneError('');

    // Validate required fields
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!validatePhone(phone)) {
      return;
    }

    if (email && !validateEmail(email)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize inputs before submission
      const sanitizedName = sanitizeInput(name);
      const sanitizedEmail = email ? sanitizeEmail(email) : undefined;
      const sanitizedNotes = `Event: ${eventType}, Attendees: ${attendees}, Units: ${units}, Duration: ${duration} days, Start: ${startDate}, Address: ${sanitizeInput(address)}, Company: ${sanitizeInput(company)}, Notes: ${sanitizeInput(notes)}`;

      await api.leads.create({
        name: sanitizedName,
        email: sanitizedEmail,
        phone,
        service_type: serviceType,
        notes: sanitizedNotes,
        source: 'enhanced_quote_modal',
        status: 'new',
        is_emergency: false,
      });

      setCurrentStep('success');
      successTimeoutRef.current = setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      console.error('Quote submission error:', err);

      // Handle specific API errors
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again or call us directly at (555) 123-4567.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 'service', label: 'Service', number: 1 },
      { id: 'details', label: 'Details', number: 2 },
      { id: 'contact', label: 'Contact', number: 3 },
    ];

    const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  index <= currentStepIndex
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {index < currentStepIndex ? '✓' : step.number}
              </div>
              <span
                className={`ml-2 text-sm font-medium hidden sm:inline ${
                  index <= currentStepIndex ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 sm:mx-4 h-1 bg-secondary rounded-full">
                <div
                  className={`h-full bg-primary rounded-full transition-all duration-300 ${
                    index < currentStepIndex ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderServiceStep = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-foreground">Select Your Service</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {serviceTypes.map((service) => (
          <button
            key={service.value}
            onClick={() => setServiceType(service.value)}
            className={`p-4 rounded-xl border-2 transition-all ${
              serviceType === service.value
                ? 'border-primary bg-primary/10 scale-105'
                : 'border-border hover:border-primary/30 hover:bg-secondary/30'
            }`}
          >
            <div className="text-3xl mb-2">{service.icon}</div>
            <div className="text-xs font-bold text-foreground">{service.label}</div>
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-foreground mb-2">Number of Units</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setUnits(Math.max(1, units - 1))}
              className="w-10 h-10 rounded-lg bg-secondary hover:bg-secondary/80 font-bold"
            >
              -
            </button>
            <input
              type="number"
              value={units}
              onChange={(e) => setUnits(Math.max(1, safeParseInt(e.target.value, 1)))}
              className="flex-1 text-center px-3 py-2 bg-secondary/30 border border-border rounded-lg font-bold text-lg"
            />
            <button
              onClick={() => setUnits(units + 1)}
              className="w-10 h-10 rounded-lg bg-secondary hover:bg-secondary/80 font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-2">
            Rental Duration (Days)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Math.max(1, safeParseInt(e.target.value, 1)))}
            className="w-full px-4 py-2 bg-secondary/30 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>

      <button
        onClick={() => setCurrentStep('details')}
        className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all"
      >
        Continue
      </button>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-foreground mb-4">Event Details</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-foreground mb-2">Event Type</label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="">Select type...</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-2">Expected Attendees</label>
          <input
            type="number"
            value={attendees}
            onChange={(e) => setAttendees(Math.max(1, safeParseInt(e.target.value, 1)))}
            className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
            placeholder="50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-foreground mb-2">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-foreground mb-2">Delivery Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
          placeholder="Street address, city, ZIP"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-foreground mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none"
          placeholder="Any special requirements or questions..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={() => setCurrentStep('service')}
          className="flex-1 py-3 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-secondary/80 transition-all"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep('contact')}
          className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderContactStep = () => (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-foreground mb-4">Contact Information</h3>

      <div>
        <label className="block text-sm font-bold text-foreground mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
          placeholder="John Doe"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-foreground mb-2">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={(e) => validatePhone(e.target.value)}
            required
            className={`w-full px-4 py-3 bg-secondary/30 border rounded-xl focus:ring-2 focus:ring-primary outline-none ${
              phoneError ? 'border-red-500' : 'border-border'
            }`}
            placeholder="(555) 123-4567"
          />
          {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => validateEmail(e.target.value)}
            className={`w-full px-4 py-3 bg-secondary/30 border rounded-xl focus:ring-2 focus:ring-primary outline-none ${
              emailError ? 'border-red-500' : 'border-border'
            }`}
            placeholder="john@company.com (optional)"
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-foreground mb-2">Company (Optional)</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
          placeholder="Company name"
        />
      </div>

      {/* Summary */}
      <div className="bg-primary/10 rounded-xl p-4 border border-primary/20 mt-6">
        <h4 className="font-bold text-foreground mb-2">Quote Summary</h4>
        <div className="text-sm space-y-1 text-muted-foreground">
          <div className="flex justify-between">
            <span>Service:</span>
            <span className="font-medium text-foreground">{serviceType}</span>
          </div>
          <div className="flex justify-between">
            <span>Units:</span>
            <span className="font-medium text-foreground">{units}</span>
          </div>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span className="font-medium text-foreground">{duration} days</span>
          </div>
          {eventType && (
            <div className="flex justify-between">
              <span>Event:</span>
              <span className="font-medium text-foreground">{eventType}</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          onClick={() => setCurrentStep('details')}
          className="flex-1 py-3 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-secondary/80 transition-all"
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !name || !phone}
          className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Get Quote'
          )}
        </button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="py-12 text-center">
      <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-3xl font-bold text-foreground mb-3">Quote Submitted!</h3>
      <p className="text-muted-foreground mb-6">
        We'll contact you within 60 minutes with a detailed quote.
      </p>
      <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        Check your email for confirmation
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-modal-title"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-background rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 id="quote-modal-title" className="text-2xl font-bold text-foreground">
                  Request a Quote
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                  aria-label="Close quote request modal"
                >
                  <svg
                    className="w-6 h-6 text-muted-foreground"
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
              </div>

              {currentStep !== 'success' && renderStepIndicator()}

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStep === 'service' && renderServiceStep()}
                  {currentStep === 'details' && renderDetailsStep()}
                  {currentStep === 'contact' && renderContactStep()}
                  {currentStep === 'success' && renderSuccessStep()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedQuoteModal;
