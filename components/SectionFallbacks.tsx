import React from 'react';

// Minimal fallback for navigation - shows a simple header
export const NavbarFallback: React.FC = () => (
  <header className="bg-white shadow-sm">
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-primary">CC Rentals</span>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          Reload Page
        </button>
      </div>
    </div>
  </header>
);

// Fallback for hero section - maintains layout without breaking the page
export const HeroFallback: React.FC = () => (
  <section className="bg-gradient-to-br from-sky-50 to-zinc-50 py-20">
    <div className="container mx-auto px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <p className="text-zinc-600 mb-4">
          We're experiencing technical difficulties loading this section.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  </section>
);

// Generic section fallback - works for most content sections
export const SectionFallback: React.FC<{ sectionName?: string }> = ({
  sectionName = 'this section',
}) => (
  <section className="py-12 bg-white">
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-zinc-600 text-sm">
          Unable to load {sectionName}. Please continue browsing or refresh to try again.
        </p>
      </div>
    </div>
  </section>
);

// Specific fallbacks for key sections
export const ServicesInventoryFallback: React.FC = () => (
  <SectionFallback sectionName="services inventory" />
);

export const TrustSignalsFallback: React.FC = () => (
  <SectionFallback sectionName="trust indicators" />
);

export const ReviewsFallback: React.FC = () => <SectionFallback sectionName="customer reviews" />;

export const ServiceAreasFallback: React.FC = () => <SectionFallback sectionName="service areas" />;

export const CTAFallback: React.FC = () => <SectionFallback sectionName="call to action" />;

// Modal fallback - allows closing without losing page state
export const ModalFallback: React.FC<{ onClose?: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-zinc-900 mb-2">Unable to Load Form</h3>
      <p className="text-zinc-600 text-sm mb-6">
        We're having trouble loading this form. Please try again in a moment.
      </p>
      <button
        onClick={onClose || (() => window.location.reload())}
        className="w-full px-6 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors"
      >
        Close
      </button>
    </div>
  </div>
);
