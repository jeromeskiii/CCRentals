import React, { lazy, Suspense } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/template/Navbar';
import Footer from './components/template/Footer';
import { ModalManagerProvider, useModalManager } from './hooks/useModalManager';
import ModalRegistry from './components/ModalRegistry';
import {
  NavbarFallback,
  HeroFallback,
  ServicesInventoryFallback,
  TrustSignalsFallback,
  ReviewsFallback,
  ServiceAreasFallback,
  CTAFallback,
} from './components/SectionFallbacks';

const Hero = lazy(() => import('./components/template/Hero'));
const ServicesInventory = lazy(() => import('./components/template/ServicesInventory'));
const TrustSignals = lazy(() => import('./components/template/TrustSignals'));
const Reviews = lazy(() => import('./components/template/Reviews'));
const ServiceAreas = lazy(() => import('./components/template/ServiceAreas'));
const CTASection = lazy(() => import('./components/template/CTASection'));

const AppContent: React.FC = () => {
  // Bridge existing prop API to the modal manager
  const { openModal } = useModalManager();
  const openLeadModal = (source: string) => openModal('service-request', { source });

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/20 selection:text-primary">
      <ErrorBoundary fallback={<NavbarFallback />}>
        <Navbar openLeadModal={openLeadModal} />
      </ErrorBoundary>

      <main className="flex-grow">
        <ErrorBoundary fallback={<HeroFallback />}>
          <Suspense fallback={<HeroFallback />}>
            <Hero openLeadModal={openLeadModal} />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<ServicesInventoryFallback />}>
          <Suspense fallback={<ServicesInventoryFallback />}>
            <ServicesInventory />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<TrustSignalsFallback />}>
          <Suspense fallback={<TrustSignalsFallback />}>
            <TrustSignals />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<ReviewsFallback />}>
          <Suspense fallback={<ReviewsFallback />}>
            <Reviews openLeadModal={openLeadModal} />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<ServiceAreasFallback />}>
          <Suspense fallback={<ServiceAreasFallback />}>
            <ServiceAreas />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<CTAFallback />}>
          <Suspense fallback={<CTAFallback />}>
            <CTASection openLeadModal={openLeadModal} />
          </Suspense>
        </ErrorBoundary>
      </main>

      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ModalManagerProvider>
      <AppContent />
      {/* Centralized modal outlet */}
      <ModalRegistry />
      <SpeedInsights />
    </ModalManagerProvider>
  );
};

export default App;
