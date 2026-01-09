import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useOptionalModalManager } from '../../hooks/useModalManager';

const reviews = [
  {
    id: 1,
    text: "The level of detail is unmatched. They even fold the toilet paper into points! My cleaning scores have never been higher.",
    author: "Marcello D.",
    role: "Superhost",
    avatar: "MD",
    rating: 5,
    accent: true,
  },
  {
    id: 2,
    text: "Reliability was my biggest pain point until Coastal Clean. They've never missed a turnover in two years. Life savers.",
    author: "Elena R.",
    role: "Property Manager, 12 Units",
    avatar: "ER",
    rating: 5,
    accent: false,
  },
  {
    id: 3,
    text: "Professional, communicative, and thorough. The automated scheduling means I don't even have to think about cleaning anymore.",
    author: "James T.",
    role: "VRBO Premier Host",
    avatar: "JT",
    rating: 5,
    accent: false,
  },
];

const stats = [
  { value: '4.9/5', label: 'Average Cleaning Score' },
  { value: '12k+', label: 'Turnovers Completed' },
  { value: '98%', label: 'On-Time Delivery' },
  { value: '500+', label: 'Active Clients' },
];

interface ReviewsProps {
  openLeadModal?: (source: string) => void;
}

const Reviews: React.FC<ReviewsProps> = ({ openLeadModal: openLeadModalProp }) => {
  const modalManager = useOptionalModalManager();
  const openLeadModal =
    openLeadModalProp || ((source: string) => modalManager?.openModal('service-request', { source }));
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="py-20 sm:py-24 md:py-28 bg-background relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-primary/3 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <h2 className="text-xs sm:text-sm font-bold tracking-widest text-primary uppercase mb-3 sm:mb-4">Client Reviews</h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            What Our Clients Say
          </h3>
          <p className="text-base sm:text-lg text-muted-foreground">
            Don't just take our word for it. Hear from the property managers and hosts who trust us with their turnovers.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-16 mb-12 sm:mb-16"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={statVariants}
              className="text-center"
            >
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8"
        >
	          {reviews.map((review) => (
	            <motion.div
	              key={review.id}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' as const } }}
              className={`relative bg-card border rounded-2xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 ${
                review.accent
                  ? 'border-primary/30 shadow-lg shadow-primary/5'
                  : 'border-border'
              }`}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4 sm:mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-primary fill-current" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-base sm:text-lg text-foreground leading-relaxed mb-6 sm:mb-8 font-serif italic">
                "{review.text}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base sm:text-lg flex-shrink-0">
                  {review.avatar}
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm sm:text-base">{review.author}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{review.role}</p>
                </div>
              </div>

              {/* Accent badge for featured review */}
              {review.accent && (
                <div className="absolute -top-3 -right-3">
                  <span className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-lg">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    Top Rated
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12 sm:mt-16"
        >
          <p className="text-sm sm:text-base text-muted-foreground mb-4">Ready to join our satisfied clients?</p>
          <button 
            onClick={() => openLeadModal('reviews')}
            className="px-6 sm:px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/25"
          >
            Request a Quote
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;
