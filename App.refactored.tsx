import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { ModalManagerProvider } from './hooks/useModalManager';
import Navbar from './components/template/Navbar';
import Hero from './components/template/Hero';
import ServicesInventory from './components/template/ServicesInventory';
import TrustSignals from './components/template/TrustSignals';
import Reviews from './components/template/Reviews';
import ServiceAreas from './components/template/ServiceAreas';
import CTASection from './components/template/CTASection';
import Footer from './components/template/Footer';
import ModalRegistry from './components/ModalRegistry';

/**
 * Refactored App with proper modal state ownership
 *
 * Architecture improvements:
 * - Modal state extracted to useModalManager hook
 * - App doesn't know modal implementation details
 * - Adding new modals doesn't require editing App.tsx
 * - Modals are registered in ModalRegistry, not imported here
 * - Child components receive openModal function, not modal-specific callbacks
 *
 * Boundary enforcement:
 * - App owns the ModalManagerProvider context
 * - ModalRegistry owns modal rendering logic
 * - Child components own trigger UI
 * - Each modal owns its internal state
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ModalManagerProvider>
        <div className="flex flex-col min-h-screen selection:bg-primary/20 selection:text-primary">
          <Navbar />
          <main className="flex-grow">
            <Hero />
            <ServicesInventory />
            <TrustSignals />
            <Reviews />
            <ServiceAreas />
            <CTASection />
          </main>
          <Footer />
          <ModalRegistry />
        </div>
      </ModalManagerProvider>
    </ErrorBoundary>
  );
};

export default App;
