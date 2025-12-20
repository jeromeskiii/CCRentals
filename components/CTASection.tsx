
import React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const CTASection: React.FC = () => {
  React.useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from('.cta-content', {
        scrollTrigger: {
          trigger: 'section.py-12',
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <div className="cta-content relative bg-sky-600 rounded-[48px] p-12 md:p-24 text-center overflow-hidden">
          {/* Decorative SVG pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" /></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter">
              Get the cleanest site in the county.
            </h2>
            <p className="text-xl text-sky-50 mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
              Don't settle for substandard sanitation. Join the thousands of project managers and event planners who trust Coastal Clean.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-12 py-6 bg-zinc-950 text-white font-black rounded-3xl hover:bg-zinc-900 transition-all text-xl shadow-2xl">
                Request a Quick Quote
              </button>
              <button className="w-full sm:w-auto px-12 py-6 bg-white text-sky-600 font-black rounded-3xl hover:bg-sky-50 transition-all text-xl">
                Call (424) 262-2906
              </button>
            </div>
            <p className="mt-8 text-sm text-sky-200 font-bold uppercase tracking-widest">
              Available 24/7 for Emergency Deployments
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
