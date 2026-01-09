import React, { useState } from 'react';
import { motion } from 'framer-motion';
import QuoteCalculator, { QuoteDetails } from './QuoteCalculator';
import EnhancedQuoteModal from './EnhancedQuoteModal';
import ServiceComparison from './ServiceComparison';
import BookingCalendar from './BookingCalendar';

const InteractiveFeaturesPage: React.FC = () => {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [prefilledQuote, setPrefilledQuote] = useState<QuoteDetails | null>(null);
  const [activeTab, setActiveTab] = useState<'calculator' | 'comparison' | 'calendar'>('calculator');

  const handleRequestQuote = (details: QuoteDetails) => {
    setPrefilledQuote(details);
    setQuoteModalOpen(true);
  };

  const handleSelectService = (serviceName: string) => {
    setPrefilledQuote({
      serviceType: serviceName,
      units: 1,
      duration: 7,
      startDate: '',
      estimatedTotal: 0,
      breakdown: {
        basePrice: 0,
        durationCharge: 0,
        unitCharge: 0,
        deliveryFee: 0,
        total: 0
      }
    });
    setQuoteModalOpen(true);
  };

  const handleDateSelect = (startDate: Date, endDate: Date) => {
    console.log('Selected dates:', startDate, endDate);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Interactive Tools
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Plan Your Perfect
              <br />
              <span className="text-primary">Sanitation Solution</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Use our interactive tools to calculate quotes, compare services, and book your rental dates—all in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setActiveTab('calculator')}
                className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Get Instant Quote
              </button>
              <a
                href="tel:424-262-2906"
                className="px-8 py-4 bg-secondary text-secondary-foreground font-bold rounded-xl border border-border hover:bg-secondary/80 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call (424) 262-2906
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-8 border-b border-border bg-card/50 sticky top-0 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === 'calculator'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              💰 Quote Calculator
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === 'comparison'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              ⚖️ Compare Services
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === 'calendar'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              📅 Book Dates
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Tools Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-6xl mx-auto"
          >
            {activeTab === 'calculator' && (
              <motion.div variants={itemVariants}>
                <QuoteCalculator onRequestQuote={handleRequestQuote} />
              </motion.div>
            )}

            {activeTab === 'comparison' && (
              <motion.div variants={itemVariants}>
                <ServiceComparison onSelectService={handleSelectService} />
              </motion.div>
            )}

            {activeTab === 'calendar' && (
              <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
                <BookingCalendar onDateSelect={handleDateSelect} />
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Use Our Tools?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get accurate quotes and make informed decisions in minutes, not hours
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: '⚡',
                title: 'Instant Estimates',
                description: 'Get real-time pricing based on your exact needs'
              },
              {
                icon: '🎯',
                title: 'Perfect Match',
                description: 'Compare services to find the ideal solution'
              },
              {
                icon: '📊',
                title: 'Transparent Pricing',
                description: 'See detailed breakdowns with no hidden fees'
              },
              {
                icon: '🗓️',
                title: 'Easy Booking',
                description: 'Select dates and check availability instantly'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Request a detailed quote or speak with our team today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="px-8 py-4 bg-background text-foreground font-bold rounded-xl hover:bg-background/90 hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Request Full Quote
            </button>
            <a
              href="tel:424-262-2906"
              className="px-8 py-4 bg-primary-foreground/10 text-primary-foreground font-bold rounded-xl border border-primary-foreground/20 hover:bg-primary-foreground/20 hover:scale-105 active:scale-95 transition-all"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* Enhanced Quote Modal */}
      <EnhancedQuoteModal
        open={quoteModalOpen}
        onClose={() => {
          setQuoteModalOpen(false);
          setPrefilledQuote(null);
        }}
        prefilledQuote={prefilledQuote}
      />
    </div>
  );
};

export default InteractiveFeaturesPage;
