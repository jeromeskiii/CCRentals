import React from 'react';
import { motion } from 'framer-motion';

const trustMetrics = {
  certifications: [
    { name: 'ISO 9001 Certified', description: 'Quality management standard', icon: '✓' },
    { name: 'OSHA Compliant', description: 'Safety standards met', icon: '✓' },
  ],
  speed: [
    { value: 'Same-Day', label: 'Delivery Available' },
    { value: '< 2 Hours', label: 'Emergency Response' },
  ],
  quality: [
    { value: '4.9/5', label: 'Average Cleaning Score', sublabel: 'Verified ratings' },
    { value: '100%', label: 'Sanitation Excellence', sublabel: 'Guaranteed' },
  ],
  volume: [
    { value: '12k+', label: 'Turnovers Completed' },
    { value: '100+', label: 'Trucks on the Road' },
  ],
};

const TrustSignals: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="trust-signals" className="py-16 sm:py-20 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <h2 className="text-xs sm:text-sm font-bold tracking-widest text-primary uppercase mb-3 sm:mb-4">
            Why Choose Us
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Built on Trust, Backed by Numbers
          </h3>
          <p className="text-base sm:text-lg text-muted-foreground">
            We hold ourselves to the highest standards because your project's success depends on
            reliable sanitation solutions.
          </p>
        </motion.div>

        {/* Certifications Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12 sm:mb-16"
        >
          {trustMetrics.certifications.map((cert, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-card border border-border rounded-full shadow-sm"
            >
              <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                {cert.icon}
              </span>
              <div>
                <p className="font-bold text-foreground text-xs sm:text-sm">{cert.name}</p>
                <p className="text-xs text-muted-foreground hidden sm:block">{cert.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto"
        >
          {/* Speed Metrics */}
          <motion.div
            variants={itemVariants}
            className="bg-card border border-border rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Speed</span>
            </div>
            <div className="space-y-4 sm:space-y-6">
              {trustMetrics.speed.map((metric, idx) => (
                <div key={idx}>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{metric.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quality Metrics */}
          <motion.div
            variants={itemVariants}
            className="bg-card border border-border rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Quality
              </span>
            </div>
            <div className="space-y-4 sm:space-y-6">
              {trustMetrics.quality.map((metric, idx) => (
                <div key={idx}>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{metric.label}</p>
                  {metric.sublabel && (
                    <p className="text-xs text-muted-foreground/70">{metric.sublabel}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Volume Metrics */}
          <motion.div
            variants={itemVariants}
            className="bg-card border border-border rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Volume
              </span>
            </div>
            <div className="space-y-4 sm:space-y-6">
              {trustMetrics.volume.map((metric, idx) => (
                <div key={idx}>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{metric.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Trust Badge Card */}
          <motion.div
            variants={itemVariants}
            className="bg-primary text-primary-foreground rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                  Verified
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2">4.9/5</p>
              <p className="text-xs sm:text-sm opacity-80">Average Cleaning Score</p>
            </div>
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-primary-foreground/20">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSignals;
