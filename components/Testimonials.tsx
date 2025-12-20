
import React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const reviews = [
  {
    text: "The level of detail is unmatched. They even fold the toilet paper into points! My cleaning scores have never been higher.",
    author: "Marcello D.",
    role: "Superhost in Santa Monica",
    avatar: "https://picsum.photos/seed/marcello/100/100"
  },
  {
    text: "Reliability was my biggest pain point until Coastal Clean. They've never missed a turnover in two years. Life savers.",
    author: "Elena R.",
    role: "Property Manager, 12 Units",
    avatar: "https://picsum.photos/seed/elena/100/100"
  },
  {
    text: "Professional, communicative, and thorough. The automated scheduling means I don't even have to think about cleaning anymore.",
    author: "James T.",
    role: "VRBO Premier Host",
    avatar: "https://picsum.photos/seed/james/100/100"
  }
];

const Testimonials: React.FC = () => {
  React.useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from('.testimonial-card', {
        scrollTrigger: {
          trigger: '#testimonials',
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="testimonials" className="py-24 bg-zinc-950 text-white overflow-hidden">
      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold tracking-widest text-sky-400 uppercase mb-4">Host Success</h2>
            <h3 className="text-4xl md:text-5xl font-bold leading-tight">Hear it from the <br />people on the ground.</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold">4.9/5</p>
              <p className="text-zinc-400 text-sm">Average Cleaning Score</p>
            </div>
            <div className="w-px h-12 bg-zinc-800"></div>
            <div className="text-right">
              <p className="text-2xl font-bold">12k+</p>
              <p className="text-zinc-400 text-sm">Turnovers Completed</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div key={idx} className="testimonial-card bg-zinc-900 border border-zinc-800 p-8 rounded-3xl hover:border-zinc-700 transition-colors">
              <div className="flex text-sky-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-lg text-zinc-300 leading-relaxed mb-8">
                "{rev.text}"
              </p>
              <div className="flex items-center gap-4">
                <img src={rev.avatar} className="w-12 h-12 rounded-full object-cover border border-zinc-800" alt={rev.author} />
                <div>
                  <p className="font-bold">{rev.author}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
