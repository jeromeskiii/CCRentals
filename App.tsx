
import React from 'react';
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

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen selection:bg-sky-100 selection:text-sky-900">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Services />
        <InventoryExplorer />
        <UnitCalculator />
        <SiteMapPlanner />
        <Industries />
        <Process />
        <Testimonials />
        <ServiceAreas />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
