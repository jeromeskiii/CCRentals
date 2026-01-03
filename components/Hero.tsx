
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
      gsap.set('.hero-word', { y: 0, x: 0, clipPath: 'inset(0% 0 0 0)' });
      gsap.set('.accent', { '--accent-color': '#1ea7fd' });
      gsap.set('.hero-sub, .hero-cta', { opacity: 1, y: 0, x: 0 });
      gsap.set('.hero-stat', { opacity: 1, y: 0 });
      return;
    }

    // Ken Burns panning effect on background
    if (bgImageRef.current) {
      gsap.set(bgImageRef.current, { scale: 1.15, x: '5%', y: '-5%' });

      gsap.to(bgImageRef.current, {
        scale: 1.05,
        x: '-3%',
        y: '3%',
        duration: 20,
        ease: 'none',
        repeat: -1,
        yoyo: true,
      });
    }

    const wordDuration = 0.8;
    const wordStagger = 0.12;
    const accentDuration = 0.5;
    const subDuration = 0.7;
    const subStagger = 0.15;

    // Animation setup - horizontal pan in from left
    gsap.set('.hero-word', {
      y: 20,
      x: -60,
      clipPath: 'inset(0% 100% 0% 0%)',
      opacity: 0
    });
    gsap.set('.hero-sub', { opacity: 0, x: -40, y: 0 });
    gsap.set('.hero-cta', { opacity: 0, y: 30 });
    gsap.set('.hero-stat', { opacity: 0, y: 40 });

    const tl = gsap.timeline({ delay: 0.3 });

    // Horizontal pan-in for headline words
    tl.to('.hero-word', {
      clipPath: 'inset(0% 0% 0% 0%)',
      x: 0,
      y: 0,
      opacity: 1,
      duration: wordDuration,
      stagger: wordStagger,
      ease: 'power4.out',
    })
      // Accent color reveal with shimmer
      .to(
        '.accent',
        {
          '--accent-color': '#1ea7fd',
          duration: accentDuration,
          ease: 'power2.inOut',
        },
        '-=0.4'
      )
      // Subtitle slides in from left
      .to(
        '.hero-sub',
        {
          opacity: 1,
          x: 0,
          duration: subDuration,
          stagger: subStagger,
          ease: 'power3.out',
        },
        '-=0.3'
      )
      // CTAs pop up
      .to(
        '.hero-cta',
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.4)',
        },
        '-=0.2'
      )
      // Stats slide up with stagger
      .to(
        '.hero-stat',
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
        },
        '-=0.3'
      );

    // Parallax effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!contentRef.current || !heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(contentRef.current, {
        x: x * 15,
        y: y * 10,
        duration: 0.8,
        ease: 'power2.out',
      });

      if (bgImageRef.current) {
        gsap.to(bgImageRef.current, {
          x: `${-3 + x * -8}%`,
          y: `${3 + y * -8}%`,
          duration: 1,
          ease: 'power2.out',
        });
      }
    };

    heroRef.current?.addEventListener('mousemove', handleMouseMove);

    return () => {
      heroRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden bg-zinc-900">
      {/* Background Image with Ken Burns Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={bgImageRef}
          src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop"
          className="w-full h-full object-cover opacity-40 will-change-transform"
          alt="Construction site"
          style={{ transformOrigin: 'center center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900/80 to-transparent"></div>
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 hero-gradient-overlay"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div ref={contentRef} className="max-w-3xl will-change-transform">
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
            <div className="hero-stat">
              <p className="text-sky-500 font-bold text-2xl">24/7</p>
              <p className="text-zinc-400 text-sm font-medium">Emergency Support</p>
            </div>
            <div className="hero-stat">
              <p className="text-sky-500 font-bold text-2xl">Daily</p>
              <p className="text-zinc-400 text-sm font-medium">Service Routes</p>
            </div>
            <div className="hero-stat hidden md:block">
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
