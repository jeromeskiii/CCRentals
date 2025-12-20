
import React from 'react';

const products = [
  {
    id: 1,
    name: "Standard Portable Toilet",
    tagline: "The Construction Workhorse",
    description: "Ventilated, slip-resistant floors, and ample interior space. Ideal for job sites.",
    image: "/images/standard-portable-toilet.png",
    features: ["Weekly Service", "Anti-slip Floor", "Hand Sanitizer"]
  },
  {
    id: 2,
    name: "Deluxe Unit with Sink",
    tagline: "Hybrid Comfort",
    description: "Features an interior foot-pump sink, soap dispenser, and paper towel holder.",
    image: "/images/deluxe-unit-sink.png",
    features: ["Fresh Water Sink", "Flushable Tank", "Full Mirror"]
  },


  {
    id: 5,
    name: "Handwash Station",
    tagline: "Multi-User Hygiene",
    description: "Dual-sided portable sinks with foot pumps to promote health on your site.",
    image: "/images/handwash-station.png",
    features: ["Dual Sinks", "Soap/Towels Incl.", "Non-Potable Water"]
  },
  {
    id: 6,
    name: "Temporary Fencing",
    tagline: "Site Security",
    description: "Chainlink fencing and privacy screens to secure your perimeter and assets.",
    image: "/images/temp-chainlink-fence-1.jpg",
    features: ["Panel Fencing", "Privacy Scrim", "Rapid Setup"]
  }
];

const ProductCatalog: React.FC = () => {
  return (
    <section id="products" className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sky-600 font-bold uppercase tracking-widest text-sm mb-4">Rental Inventory</h2>
            <h3 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight">Built for every environment.</h3>
          </div>
          <button className="text-zinc-900 font-bold border-b-2 border-sky-500 pb-1 hover:text-sky-600 hover:border-sky-600 transition-all">
            Download Full Rental Catalog
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group bg-zinc-50 rounded-3xl overflow-hidden border border-zinc-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
              <div className="aspect-[16/10] overflow-hidden bg-zinc-200 relative">
                <img
                  src={product.image}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  alt={product.name}
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-zinc-900 text-[10px] font-black uppercase tracking-widest rounded-full">
                    {product.tagline}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h4 className="text-2xl font-bold text-zinc-900 mb-3">{product.name}</h4>
                <p className="text-zinc-600 text-sm leading-relaxed mb-6">
                  {product.description}
                </p>
                <div className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                      <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                      {feature}
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-sky-600 transition-colors">
                  Add to Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
