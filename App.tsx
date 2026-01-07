import React, { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import InventoryExplorer from './components/InventoryExplorer';
import UnitCalculator from './components/UnitCalculator';
import SiteMapPlanner from './components/SiteMapPlanner';
import Industries from './components/Industries';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import ServiceAreas from './components/ServiceAreas';
import Footer from './components/Footer';
import CTASection from './components/CTASection';
import ServiceRequestModal from './components/ServiceRequestModal';

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
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen selection:bg-sky-100 selection:text-sky-900">
        <Navbar openLeadModal={openLeadModal} />
        <main className="flex-grow">
          <Hero openLeadModal={openLeadModal} />
          <Services />
          <InventoryExplorer />
          <UnitCalculator />
          <SiteMapPlanner />
          <Industries />
          <Process />
          <Testimonials />
          <ServiceAreas />
          <CTASection openLeadModal={openLeadModal} />
        </main>
        <Footer />
        <ServiceRequestModal
          open={leadModalOpen}
          onClose={closeLeadModal}
          source={leadSource}
        />
      </div>
    </ErrorBoundary>
  );
};

export default App;
