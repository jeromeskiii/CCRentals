import React from 'react';
import { motion } from 'framer-motion';

const serviceAreas = {
  counties: [
    'Los Angeles County',
    'Orange County',
    'Ventura County',
    'San Bernardino County',
    'San Diego County',
    'Riverside County',
    'Santa Barbara County',
  ],
  cities: [
    'Long Beach',
    'Malibu',
    'Anaheim',
    'Huntington Beach',
    'Inland Empire',
  ],
};

const ServiceAreas: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <section id="service-areas" className="py-16 sm:py-20 md:py-24 bg-card">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
          {/* Left: Map/Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative order-2 lg:order-1"
          >
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

            {/* Map placeholder - California state outline */}
            <div className="relative bg-secondary/20 rounded-3xl p-6 sm:p-8 border border-border">
              <div className="aspect-[4/3] bg-background rounded-2xl border border-border overflow-hidden relative">
                {/* California/SoCal Map SVG - Clean Theme Implementation */}
                <svg
                  viewBox="0 0 400 250"
                  className="w-full h-full drop-shadow-xl"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Southern California Service Area"
                >
                  {/* Clean Style: Background Fill + Primary Stroke (No Gradients) */}
                  <path
                    d="M40,60 L120,60 L240,110 L300,160 L290,190 L260,200 L230,190 L200,185 L160,180 L130,160 L100,140 L70,100 L40,80 Z" 
                    fill="oklch(var(--background))"
                    stroke="oklch(var(--primary))"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* City Markers - Using Theme Colors */}
                  {/* Los Angeles (Center) */}
                  <circle cx="160" cy="140" r="6" fill="oklch(var(--primary))" className="animate-pulse" />
                  
                  {/* San Diego (Bottom Right) */}
                  <circle cx="250" cy="180" r="5" fill="oklch(var(--primary))" className="animate-pulse" />
                  
                  {/* Santa Barbara (Top Left) */}
                  <circle cx="80" cy="90" r="5" fill="oklch(var(--primary))" className="animate-pulse" />
                  
                  {/* Inland Empire */}
                  <circle cx="210" cy="140" r="5" fill="oklch(var(--primary))" className="animate-pulse" />

                  {/* Secondary Cities - Using Muted/Secondary Token */}
                  <circle cx="170" cy="150" r="3" fill="oklch(var(--muted-foreground))" />
                  <circle cx="150" cy="130" r="3" fill="oklch(var(--muted-foreground))" />
                </svg>

                {/* Coverage badge */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-primary text-primary-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                  State-wide Logistics
                </div>
              </div>

              {/* Fleet badge */}
              <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-foreground text-background p-4 sm:p-6 rounded-2xl shadow-xl">
                <p className="text-2xl sm:text-3xl font-bold">100+</p>
                <p className="text-xs sm:text-sm opacity-80">Trucks on the road</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="order-1 lg:order-2"
          >
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-widest">Operational Range</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Serving Southern California
            </h2>
            
            <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 leading-relaxed">
              Coastal Clean operates one of the largest sanitation fleets in the region. 
              We offer same-day delivery for emergency site needs and consistent weekly service routes 
              across all our coverage areas.
            </p>

            {/* Counties */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider mb-3 sm:mb-4">Counties</h3>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex flex-wrap gap-2 sm:gap-3"
              >
                {serviceAreas.counties.map((county, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-secondary/50 rounded-lg border border-border hover:bg-secondary/70 transition-colors cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span className="text-xs sm:text-sm font-medium text-foreground">{county}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Cities */}
            <div className="mb-8 sm:mb-10">
              <h3 className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider mb-3 sm:mb-4">Key Cities</h3>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex flex-wrap gap-2 sm:gap-3"
              >
                {serviceAreas.cities.map((city, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-secondary/30 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-medium text-foreground">{city}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* CTA */}
            <button className="group flex items-center gap-3 font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors">
              <span>View Detailed Coverage Map</span>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreas;
