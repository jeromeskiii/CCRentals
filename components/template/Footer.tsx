import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: 'Standard Turnover', href: '#' },
      { label: 'Emergency Response', href: '#' },
      { label: 'Rental Inventory', href: '#' },
      { label: 'Luxury Trailers', href: '#' },
    ],
    company: [
      { label: 'About Us', href: '#' },
      { label: 'Service Areas', href: '#' },
      { label: 'Reviews', href: '#' },
      { label: 'Careers', href: '#' },
    ],
    support: [
      { label: 'Contact', href: '#' },
      { label: 'Request Service', href: '#' },
      { label: 'FAQ', href: '#' },
      { label: 'Privacy Policy', href: '#' },
    ],
  };

  const serviceAreas = [
    'Los Angeles',
    'Orange County',
    'Ventura',
    'San Diego',
    'San Bernardino',
    'Riverside',
  ];

  return (
    <footer className="bg-foreground text-background pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Main Footer Content */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <span className="font-bold text-lg sm:text-xl">Coastal Clean</span>
            </div>
            <p className="text-background/70 mb-4 sm:mb-6 leading-relaxed max-w-sm text-sm sm:text-base">
              Professional sanitation services and site equipment rentals across Southern California. 
              From luxury wedding trailers to construction site facilities.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <span className="px-3 py-1 bg-background/10 rounded-full text-xs font-medium">
                ISO 9001 Certified
              </span>
              <span className="px-3 py-1 bg-background/10 rounded-full text-xs font-medium">
                OSHA Compliant
              </span>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-bold mb-4 sm:mb-6 text-primary-foreground text-sm sm:text-base">Services</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.services.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors text-xs sm:text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-bold mb-4 sm:mb-6 text-primary-foreground text-sm sm:text-base">Company</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.company.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors text-xs sm:text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas Column */}
          <div>
            <h4 className="font-bold mb-4 sm:mb-6 text-primary-foreground text-sm sm:text-base">Service Areas</h4>
            <ul className="space-y-2 sm:space-y-3">
              {serviceAreas.map((area, idx) => (
                <li key={idx}>
                  <a
                    href="#"
                    className="text-background/70 hover:text-primary transition-colors text-xs sm:text-sm"
                  >
                    {area}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            {/* Copyright */}
            <p className="text-background/60 text-xs sm:text-sm text-center md:text-left">
              © {currentYear} Coastal Clean Rentals. All rights reserved.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
              <a
                href="tel:424-262-2906"
                className="flex items-center gap-2 text-background/80 hover:text-primary transition-colors text-xs sm:text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (424) 262-2906
              </a>
              <a
                href="mailto:info@coastalclean.com"
                className="flex items-center gap-2 text-background/80 hover:text-primary transition-colors text-xs sm:text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@coastalclean.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
