import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Rental Inventory Data
const rentalInventory = {
  standard: [
    { name: 'Standard Portable Toilet', description: 'Reliable, clean, and ready for any job site' },
    { name: 'Deluxe Unit with Sink', description: 'Built-in handwashing station for improved hygiene' },
    { name: 'ADA Compliant Units', description: 'Wheelchair accessible with additional space' },
  ],
  luxury: [
    { name: '2-Stall Luxury Restroom Trailer', description: 'Climate-controlled, elegant comfort for VIP events' },
    { name: '4-Stall Luxury Restroom Trailer', description: 'Full-service luxury with multiple stalls and premium finishes' },
  ],
  equipment: [
    { name: 'Handwash Stations', description: 'Standalone units with soap and running water' },
    { name: 'Temporary Chainlink Fencing', description: 'Secure site perimeter for construction and events' },
    { name: 'Premium Privacy Fence', description: 'Attractive screening for events and sensitive areas' },
  ],
};

// Service Lines Data
const serviceLines = [
  {
    id: 'turnover',
    title: 'Standard Turnover',
    description: 'Our signature clean between check-out and check-in. Detailed, fast, and guest-ready.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ),
    features: ['Kitchen/bath deep cleans', 'Vacuum & mop', 'Dusting & sanitization', '75-point checklist'],
  },
  {
    id: 'emergency',
    title: 'Emergency Response',
    description: '24/7 availability for spills, incidents, and urgent site needs.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    features: ['< 2 Hour Response', '24/7 availability', 'Spill cleanup specialists', 'Incident documentation'],
  },
  {
    id: 'industries',
    title: 'Industry Specific Solutions',
    description: 'Tailored services for unique industry requirements and compliance standards.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    features: ['Construction (long-term rentals)', 'Weddings (luxury trailers)', 'Agriculture (GAP-compliant)', 'Disaster Relief'],
  },
];

type InventoryTab = 'standard' | 'luxury' | 'equipment';

const ServicesInventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InventoryTab>('standard');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="services-inventory" className="py-16 sm:py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-xs sm:text-sm font-bold tracking-widest text-primary uppercase mb-3 sm:mb-4">Our Offerings</h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Rental Inventory & Service Lines
          </h3>
          <p className="text-base sm:text-lg text-muted-foreground">
            From premium portable toilets to full-service luxury trailers, backed by industry-leading turnaround times.
          </p>
        </div>

        {/* Service Lines Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto mb-16 sm:mb-20"
        >
          {serviceLines.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="group bg-card border border-border rounded-2xl p-6 sm:p-8 hover:shadow-xl hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                {service.icon}
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">{service.title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 sm:mb-6">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Rental Inventory Tabs */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Rental Inventory</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Explore our complete lineup of sanitation solutions</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center gap-2 mb-8 sm:mb-10 flex-wrap">
            {(['standard', 'luxury', 'equipment'] as InventoryTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Inventory Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
            >
              {rentalInventory[activeTab].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative bg-card border border-border rounded-2xl p-6 sm:p-8"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-foreground mb-2">{item.name}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ServicesInventory;
