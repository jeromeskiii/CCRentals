import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useOptionalModalManager } from '../../hooks/useModalManager';

interface HeroProps {
  openLeadModal?: (source: string) => void;
}

const Hero: React.FC<HeroProps> = ({ openLeadModal: openLeadModalProp }) => {
  const modalManager = useOptionalModalManager();
  const openLeadModal =
    openLeadModalProp ||
    ((source: string) => modalManager?.openModal('service-request', { source }));
  const heroRef = useRef<HTMLElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [imageError, setImageError] = useState(false);

  const headlineWords = [
    { text: 'Professional' },
    { text: 'Sanitation' },
    { text: '& Site Services' },
  ];

  useEffect(() => {
    gsap.defaults({
      ease: 'expo.out',
      force3D: true,
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set('.hero-word', { y: 0, x: 0, clipPath: 'inset(0% 0 0 0)' });
      gsap.set('.hero-sub, .hero-cta', { opacity: 1, y: 0, x: 0 });
      gsap.set('.hero-stat', { opacity: 1, y: 0 });
      return;
    }

    // Ken Burns panning effect on background
    if (bgImageRef.current) {
      gsap.set(bgImageRef.current, { scale: 1.15, x: '5%', y: '-5%' });

      animationRef.current = gsap.to(bgImageRef.current, {
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
    const subDuration = 0.7;

    gsap.set('.hero-word', {
      y: 20,
      x: -60,
      clipPath: 'inset(0% 100% 0% 0%)',
      opacity: 0,
    });
    gsap.set('.hero-sub', { opacity: 0, x: -40, y: 0 });
    gsap.set('.hero-cta', { opacity: 0, y: 30 });
    gsap.set('.hero-stat', { opacity: 0, y: 40 });

    const tl = gsap.timeline({ delay: 0.3 });

    tl.to('.hero-word', {
      clipPath: 'inset(0% 0% 0% 0%)',
      x: 0,
      y: 0,
      opacity: 1,
      duration: wordDuration,
      stagger: wordStagger,
      ease: 'power4.out',
    })
      .to(
        '.hero-sub',
        {
          opacity: 1,
          x: 0,
          duration: subDuration,
          ease: 'power3.out',
        },
        '-=0.3'
      )
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

    // Optimized parallax effect using GSAP quickTo for high-frequency updates
    // quickTo creates reusable animation functions, avoiding tween creation overhead
    const contentMoveX = gsap.quickTo(contentRef.current, 'x', {
      duration: 0.8,
      ease: 'power2.out',
    });
    const contentMoveY = gsap.quickTo(contentRef.current, 'y', {
      duration: 0.8,
      ease: 'power2.out',
    });
    const bgMoveX = bgImageRef.current
      ? gsap.quickTo(bgImageRef.current, 'xPercent', {
          duration: 1,
          ease: 'power2.out',
        })
      : null;
    const bgMoveY = bgImageRef.current
      ? gsap.quickTo(bgImageRef.current, 'yPercent', {
          duration: 1,
          ease: 'power2.out',
        })
      : null;

    // Throttle to ~30fps to reduce CPU/GPU usage on low-end devices
    let lastMoveTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMoveTime < 33) return; // ~30fps throttle
      lastMoveTime = now;

      if (!heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Use quickTo for instant, optimized updates
      contentMoveX(x * 15);
      contentMoveY(y * 10);

      if (bgMoveX && bgMoveY) {
        bgMoveX(-3 + x * -8);
        bgMoveY(3 + y * -8);
      }
    };

    heroRef.current?.addEventListener('mousemove', handleMouseMove);

    return () => {
      heroRef.current?.removeEventListener('mousemove', handleMouseMove);
      animationRef.current?.kill();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden bg-card"
    >
      {/* Background Image with Ken Burns Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {imageError ? (
          <div className="w-full h-full bg-gradient-to-br from-primary/5 via-background to-background"></div>
        ) : (
          <img
            ref={bgImageRef}
            src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-30 will-change-transform"
            alt="Industrial site services"
            style={{ transformOrigin: 'center center' }}
            onError={() => setImageError(true)}
            loading="eager"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-transparent"></div>
        <div className="absolute inset-0 hero-gradient-overlay"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-20 md:pt-24">
        <div ref={contentRef} className="max-w-3xl will-change-transform">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6 hero-sub">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="hidden sm:inline">Sanitation Excellence Guaranteed</span>
            <span className="sm:hidden">Excellence Guaranteed</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 leading-[1.1] tracking-tight">
            {headlineWords.map((word, index) => (
              <span key={index} className="hero-word-container inline-block">
                <span className="hero-word inline-block">{word.text}</span>
                {index < headlineWords.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-3 sm:mb-4 leading-tight max-w-xl hero-sub">
            Professional vacation rental cleaning for coastal properties.
          </p>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 leading-relaxed max-w-xl hero-sub">
            From luxury weddings to heavy-duty construction sites, we provide cleanest portable
            toilets, restroom trailers, and temporary fencing across Southern California.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 sm:mb-16 hero-cta">
            <button
              onClick={() => openLeadModal('hero_primary')}
              className="px-8 sm:px-10 py-4 sm:py-5 bg-primary text-primary-foreground font-bold text-lg sm:text-xl rounded-xl hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              Get a Quote
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
            <a
              href="tel:424-262-2906"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground font-bold rounded-xl border border-border hover:bg-secondary/80 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
            >
              Call Now
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 border-t border-border pt-8 sm:pt-10">
            <div className="hero-stat">
              <p className="text-primary font-bold text-2xl sm:text-3xl">ISO 9001</p>
              <p className="text-muted-foreground text-xs sm:text-sm font-medium">Certified</p>
            </div>
            <div className="hero-stat">
              <p className="text-primary font-bold text-2xl sm:text-3xl">4.9/5</p>
              <p className="text-muted-foreground text-xs sm:text-sm font-medium">Cleaning Score</p>
            </div>
            <div className="hero-stat">
              <p className="text-primary font-bold text-2xl sm:text-3xl">12k+</p>
              <p className="text-muted-foreground text-xs sm:text-sm font-medium">Turnovers</p>
            </div>
            <div className="hero-stat">
              <p className="text-primary font-bold text-2xl sm:text-3xl">100+</p>
              <p className="text-muted-foreground text-xs sm:text-sm font-medium">Trucks</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
