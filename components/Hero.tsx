
import React, { useEffect } from 'react';
import { gsap } from 'gsap';

const Hero: React.FC = () => {
  const headlineWords = [
    { text: 'Professional' },
    { text: 'Site', accent: true },
    { text: 'Services', accent: true },
    { text: '&' },
    { text: 'Sanitation.' },
  ];

  useEffect(() => {
    // Set defaults for animations to ensure hardware acceleration for smoother performance
    gsap.defaults({
      ease: 'expo.out',
      force3D: true,
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set('.hero-word', { y: 0, clipPath: 'inset(0% 0 0 0)' });
      gsap.set('.accent', { '--accent-color': '#1ea7fd' });
      gsap.set('.hero-sub, .hero-cta', { opacity: 1, y: 0 });
      return;
    }

    const wordDuration = 0.6;
    const wordStagger = 0.08;
    const accentDuration = 0.4;
    const subDuration = 0.6;
    const subStagger = 0.1;

    // Animation setup
    gsap.set('.hero-word', { y: 12, clipPath: 'inset(100% 0 0 0)' });
    gsap.set('.hero-sub, .hero-cta', { opacity: 0, y: 12 });

    const tl = gsap.timeline();

    tl.to('.hero-word', {
      clipPath: 'inset(0% 0 0 0)',
      y: 0,
      duration: wordDuration,
      stagger: wordStagger,
    })
      .to(
        '.accent',
        {
          '--accent-color': '#1ea7fd',
          duration: accentDuration,
        },
        '>'
      )
      .to(
        '.hero-sub, .hero-cta',
        {
          opacity: 1,
          y: 0,
          duration: subDuration,
          stagger: subStagger,
        },
        '>'
      );
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-zinc-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop"
          className="w-full h-full object-cover opacity-40"
          alt="Construction site"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900/80 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-widest mb-6 hero-sub">
            Sanitation Excellence Guaranteed
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight">
            {headlineWords.map((word, index) => (
              <span key={index} className="hero-word-container">
                <span className="hero-word">
                  {word.accent ? <span className="accent">{word.text}</span> : word.text}
                </span>
                {index < headlineWords.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>
          <p className="text-xl text-zinc-300 mb-10 leading-relaxed max-w-xl hero-sub">
            From luxury weddings to heavy-duty construction sites, we provide the cleanest portable toilets, restroom trailers, and temporary fencing on the coast.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16 hero-cta">
            <button className="px-8 py-4 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-500 transition-all shadow-xl shadow-sky-600/30 flex items-center justify-center gap-2">
              Explore Inventory
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
            <button className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm">
              Calculate Units
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-white/10 pt-12">
            <div>
              <p className="text-sky-500 font-bold text-2xl">24/7</p>
              <p className="text-zinc-400 text-sm font-medium">Emergency Support</p>
            </div>
            <div>
              <p className="text-sky-500 font-bold text-2xl">Daily</p>
              <p className="text-zinc-400 text-sm font-medium">Service Routes</p>
            </div>
            <div className="hidden md:block">
              <p className="text-sky-500 font-bold text-2xl">OSHA</p>
              <p className="text-zinc-400 text-sm font-medium">Compliant Solutions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
