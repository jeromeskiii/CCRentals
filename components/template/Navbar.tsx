import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  openLeadModal: (source: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ openLeadModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#services-inventory', label: 'Services' },
    { href: '#trust-signals', label: 'Why Us' },
    { href: '#reviews', label: 'Reviews' },
    { href: '#service-areas', label: 'Areas' },
  ];

  return (
    <nav
      className={'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ' +
        (isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-border py-3 shadow-sm'
          : 'bg-transparent py-5'
        )}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-3" aria-label="Coastal Clean Rentals home">
            <div className={'w-10 h-10 rounded-xl flex items-center justify-center ' +
              (isScrolled ? 'bg-primary text-primary-foreground' : 'bg-white/20 text-white')
            } aria-hidden="true">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <span className={'font-bold text-xl tracking-tight ' +
              (isScrolled ? 'text-foreground' : 'text-white')
            }>
              Coastal Clean
            </span>
          </a>

          <div className={'hidden lg:flex items-center gap-8 text-sm font-semibold ' +
            (isScrolled ? 'text-muted-foreground' : 'text-white/90')
          } role="list">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:424-262-2906"
              className={'hidden sm:flex items-center gap-2 text-sm font-bold ' +
                (isScrolled ? 'text-foreground' : 'text-white')
              }
            >
              <svg className={'w-4 h-4 ' + (isScrolled ? 'text-primary' : 'text-white/80')} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              (424) 262-2906
            </a>

            <button
              type="button"
              onClick={() => openLeadModal('navbar')}
              className={'px-6 py-2.5 text-sm font-bold rounded-full transition-all shadow-lg ' +
                (isScrolled
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25'
                  : 'bg-white text-foreground hover:bg-white/90'
                )}
            >
              Request Service
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={'lg:hidden p-2 rounded-lg ' +
                (isScrolled ? 'text-foreground' : 'text-white')
              }
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              role="navigation"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="lg:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-4 pt-4 pb-4 border-t border-border">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-foreground font-medium hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-secondary/30"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="tel:424-262-2906"
                  className="text-foreground font-medium hover:text-primary transition-colors px-2 py-1 flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (424) 262-2906
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
