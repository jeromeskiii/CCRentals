import React from 'react';
import { motion } from 'framer-motion';
import { useOptionalModalManager } from '../../hooks/useModalManager';

interface CTASectionProps {
  openLeadModal?: (source: string) => void;
}

const CTASection: React.FC<CTASectionProps> = ({ openLeadModal: openLeadModalProp }) => {
  const modalManager = useOptionalModalManager();
  const openLeadModal =
    openLeadModalProp || ((source: string) => modalManager?.openModal('service-request', { source }));
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-base sm:text-lg md:text-xl opacity-90 mb-8 sm:mb-10 max-w-2xl mx-auto">
              Whether you need a single unit or a full-service event setup, 
              our team is ready to help. Same-day delivery available.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => openLeadModal('cta_primary')}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-background text-foreground font-bold rounded-xl hover:bg-background/90 hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Request Service
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <a
                href="tel:424-262-2906"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-primary-foreground/10 text-primary-foreground font-bold rounded-xl border border-primary-foreground/20 hover:bg-primary-foreground/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              >
                Call (424) 262-2906
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 sm:mt-12 pt-10 sm:pt-12 border-t border-primary-foreground/20">
              <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-16">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold">ISO 9001</p>
                  <p className="text-xs sm:text-sm opacity-70">Certified</p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold">4.9/5</p>
                  <p className="text-xs sm:text-sm opacity-70">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold">24/7</p>
                  <p className="text-xs sm:text-sm opacity-70">Available</p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold">100+</p>
                  <p className="text-xs sm:text-sm opacity-70">Trucks</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
