
import React, { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-white/90 backdrop-blur-md border-zinc-200 py-3' : 'bg-transparent border-transparent py-5 text-white'
      }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/images/logo.png" alt="Coastal Clean Rentals Logo" className="h-10 w-auto mr-3" />
          <span className={`font-bold text-xl tracking-tight ${isScrolled ? 'text-zinc-900' : 'text-white'}`}>Coastal Clean</span>
        </div>

        <div className={`hidden lg:flex items-center gap-8 text-sm font-semibold ${isScrolled ? 'text-zinc-600' : 'text-white/90'}`}>
          <a href="#inventory" className="hover:text-sky-500 transition-colors">Inventory</a>
          <a href="#calculator" className="hover:text-sky-500 transition-colors">Calculator</a>
          <a href="#industries" className="hover:text-sky-500 transition-colors">Industries</a>
          <a href="#areas" className="hover:text-sky-500 transition-colors">Service Areas</a>
        </div>

        <div className="flex items-center gap-4">
          <a href="tel:424-262-2906" className="hidden sm:block text-sm font-bold">(424) 262-2906</a>
          <button className="px-6 py-2.5 bg-sky-600 text-white text-sm font-bold rounded-full hover:bg-sky-500 transition-all shadow-lg shadow-sky-600/20">
            Request Quote
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
