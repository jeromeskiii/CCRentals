/**
 * CCRentals Website Template
 *
 * This is the complete website template using the new design system.
 * Drop this into your project and integrate with your existing services.
 *
 * Theme: Clean, trustworthy app-style design
 * Colors: Teal/aqua primary, light backgrounds, subtle shadows
 * Typography: DM Sans, Lora, IBM Plex Mono
 */

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

const AppTemplate: React.FC = () => {
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
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen selection:bg-primary/20 selection:text-primary">
        <Navbar openLeadModal={openLeadModal} />
        <main className="flex-grow">
          <Hero openLeadModal={openLeadModal} />
          <ServicesInventory />
          <TrustSignals />
          <Reviews openLeadModal={openLeadModal} />
          <ServiceAreas />
          <CTASection openLeadModal={openLeadModal} />
        </main>
        <Footer />
        <ServiceRequestModal open={leadModalOpen} onClose={closeLeadModal} source={leadSource} />
      </div>
    </ErrorBoundary>
  );
};

export default AppTemplate;
