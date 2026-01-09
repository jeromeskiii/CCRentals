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
                {/* California state map SVG */}
                <svg
                  viewBox="0 0 400 250"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="California state map showing service coverage areas"
                >
                  <defs>
                    {/* Gradient fill for the state shape */}
                    <linearGradient id="california-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="oklch(var(--muted) / 0.6)" />
                      <stop offset="50%" stopColor="oklch(var(--muted) / 0.4)" />
                      <stop offset="100%" stopColor="oklch(var(--muted) / 0.6)" />
                    </linearGradient>
                    {/* Drop shadow filter */}
                    <filter id="state-shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="oklch(var(--primary) / 0.15)" />
                    </filter>
                  </defs>

                  {/* California state outline - simplified but recognizable */}
                  <path
                    d="M60 60
                       L75 45 L85 48 L95 42 L110 48 L120 45 L130 55
                       L140 50 L150 55 L160 52 L175 58 L185 55 L195 60
                       L200 65 L205 75 L200 85 L210 90 L215 85
                       L225 88 L235 85 L245 90 L250 88 L255 95
                       L260 100 L265 110 L275 115 L280 125 L290 130
                       L300 140 L310 150 L320 160 L325 175 L330 185
                       L325 195 L315 205 L305 210 L295 215 L285 220
                       L275 225 L265 228 L255 230 L245 228 L235 232
                       L225 235 L215 238 L205 240 L195 238 L185 235
                       L175 232 L165 228 L155 225 L145 222 L135 218
                       L125 215 L115 212 L105 210 L95 208 L85 210
                       L75 215 L65 220 L55 225 L50 230 L45 225
                       L40 218 L35 210 L30 200 L25 190 L20 180
                       L18 170 L15 160 L18 150 L15 140 L20 130
                       L25 120 L30 110 L35 100 L40 90 L45 80
                       L50 70 Z"
                    fill="url(#california-gradient)"
                    stroke="oklch(var(--primary) / 0.3)"
                    strokeWidth="1.5"
                    filter="url(#state-shadow)"
                  />

                  {/* Service coverage region indicator (Southern California focus) */}
                  <path
                    d="M140 130 Q200 110 280 125 Q320 135 310 165 Q290 185 240 180 Q200 175 160 165 Q130 155 140 130Z"
                    fill="oklch(var(--primary) / 0.08)"
                    stroke="oklch(var(--primary) / 0.4)"
                    strokeWidth="1"
                    strokeDasharray="4 2"
                  />

                  {/* County markers - positioned to approximate geographic locations */}
                  {/* Los Angeles County area */}
                  <circle cx="210" cy="145" r="6" fill="oklch(var(--primary))" className="animate-pulse" />
                  {/* Orange County area */}
                  <circle cx="235" cy="138" r="5" fill="oklch(var(--primary))" className="animate-pulse" />
                  {/* Ventura County area */}
                  <circle cx="185" cy="130" r="5" fill="oklch(var(--primary))" className="animate-pulse" />
                  {/* San Bernardino County area */}
                  <circle cx="195" cy="165" r="5" fill="oklch(var(--primary))" className="animate-pulse" />
                  {/* Riverside County area */}
                  <circle cx="220" cy="165" r="5" fill="oklch(var(--primary))" className="animate-pulse" />
                  {/* San Diego County area */}
                  <circle cx="260" cy="145" r="5" fill="oklch(var(--primary))" className="animate-pulse" />
                  {/* Santa Barbara County area */}
                  <circle cx="155" cy="118" r="5" fill="oklch(var(--primary))" className="animate-pulse" />

                  {/* City markers - smaller, secondary emphasis */}
                  {/* Long Beach */}
                  <circle cx="222" cy="140" r="4" fill="oklch(var(--chart-2))" />
                  {/* Malibu */}
                  <circle cx="185" cy="125" r="3.5" fill="oklch(var(--chart-2))" />
                  {/* Anaheim */}
                  <circle cx="230" cy="138" r="3.5" fill="oklch(var(--chart-2))" />
                  {/* Huntington Beach */}
                  <circle cx="238" cy="133" r="3.5" fill="oklch(var(--chart-2))" />
                  {/* Inland Empire (San Bernardino/Riverside area) */}
                  <circle cx="205" cy="162" r="3.5" fill="oklch(var(--chart-2))" />
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
