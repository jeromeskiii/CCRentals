
import React from 'react';

const areas = [
  "Los Angeles County", "Orange County", "Ventura County",
  "Inland Empire", "Santa Barbara", "San Diego",
  "Riverside", "Long Beach", "San Bernardino",
  "Malibu", "Anaheim", "Huntington Beach"
];

const ServiceAreas: React.FC = () => {
  return (
    <section id="areas" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute top-0 left-0 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
              className="rounded-[40px] shadow-2xl h-[500px] w-full object-cover grayscale opacity-80"
              alt="Fleet readiness"
            />
            <div className="absolute -bottom-8 -right-8 bg-zinc-900 p-8 rounded-3xl text-white shadow-2xl max-w-[280px]">
              <div className="text-4xl font-black mb-2 text-sky-500 tracking-tighter">100+</div>
              <p className="text-sm font-bold text-zinc-400">Trucks on the road every single morning.</p>
            </div>
          </div>

          <div>
            <h2 className="text-sky-600 font-bold uppercase tracking-widest text-sm mb-4">Operational Range</h2>
            <h3 className="text-4xl md:text-5xl font-black text-zinc-900 mb-8 tracking-tight">State-wide logistics.</h3>
            <p className="text-lg text-zinc-600 mb-10 leading-relaxed">
              Coastal Clean operates one of the largest sanitation fleets in the region. We offer same-day delivery for emergency site needs and consistent weekly service routes.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {areas.map((area, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]"></div>
                  <span className="text-sm font-bold text-zinc-800">{area}</span>
                </div>
              ))}
            </div>

            <button className="mt-12 flex items-center gap-3 font-black text-zinc-900 hover:text-sky-600 transition-colors group">
              View Detailed Coverage Map
              <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAreas;
