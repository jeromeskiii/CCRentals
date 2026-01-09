import React, { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/template/Navbar';
import Hero from './components/template/Hero';
import ServicesInventory from './components/template/ServicesInventory';
import TrustSignals from './components/template/TrustSignals';
import Reviews from './components/template/Reviews';
import ServiceAreas from './components/template/ServiceAreas';
import CTASection from './components/template/CTASection';
import Footer from './components/template/Footer';
import ServiceRequestModal from './components/ServiceRequestModal';
import {
  NavbarFallback,
  HeroFallback,
  ServicesInventoryFallback,
  TrustSignalsFallback,
  ReviewsFallback,
  ServiceAreasFallback,
  CTAFallback,
  ModalFallback,
} from './components/SectionFallbacks';

const App: React.FC = () => {
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadSource, setLeadSource] = useState<string | null>(null);

  const openLeadModal = (source: string) => {
    setLeadSource(source);
    setLeadModalOpen(true);
  };

  const closeLeadModal = () => {
    setLeadModalOpen(false);
    setLeadSource(null);
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/20 selection:text-primary">
      <ErrorBoundary fallback={<NavbarFallback />}>
        <Navbar openLeadModal={openLeadModal} />
      </ErrorBoundary>

      <main className="flex-grow">
        <ErrorBoundary fallback={<HeroFallback />}>
          <Hero openLeadModal={openLeadModal} />
        </ErrorBoundary>

        <ErrorBoundary fallback={<ServicesInventoryFallback />}>
          <ServicesInventory />
        </ErrorBoundary>

        <ErrorBoundary fallback={<TrustSignalsFallback />}>
          <TrustSignals />
        </ErrorBoundary>

        <ErrorBoundary fallback={<ReviewsFallback />}>
          <Reviews />
        </ErrorBoundary>

        <ErrorBoundary fallback={<ServiceAreasFallback />}>
          <ServiceAreas />
        </ErrorBoundary>

        <ErrorBoundary fallback={<CTAFallback />}>
          <CTASection openLeadModal={openLeadModal} />
        </ErrorBoundary>
      </main>

      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>

      <ErrorBoundary fallback={<ModalFallback onClose={closeLeadModal} />}>
        <ServiceRequestModal
          open={leadModalOpen}
          onClose={closeLeadModal}
          source={leadSource}
        />
      </ErrorBoundary>
    </div>
  );
};

export default App;
