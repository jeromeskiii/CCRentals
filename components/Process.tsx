
import React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const steps = [
  {
    num: "01",
    title: "Sync Calendar",
    description: "Connect your booking calendar. We automatically schedule cleans based on your check-out dates."
  },
  {
    num: "02",
    title: "Standardized Clean",
    description: "Our certified professionals follow a 75-point checklist specific to your property’s unique needs."
  },
  {
    num: "03",
    title: "Photo Inspection",
    description: "Receive high-res photos of the finished clean and inventory status directly to your phone."
  },
  {
    num: "04",
    title: "Relax & Earn",
    description: "Welcome your guests to a pristine home. High turnover scores lead to higher ranking and more revenue."
  }
];

const Process: React.FC = () => {
  React.useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from('.process-step', {
        scrollTrigger: {
          trigger: '#process',
          start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });

      gsap.from('.process-image', {
        scrollTrigger: {
          trigger: '#process',
          start: 'top 70%',
        },
        x: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.3
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="process" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-sky-600 uppercase mb-4">The Workflow</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-8 leading-tight">Automation meets manual perfection.</h3>

            <div className="space-y-10">
              {steps.map((step, idx) => (
                <div key={idx} className="process-step flex gap-6">
                  <div className="text-4xl font-bold text-zinc-100 tabular-nums leading-none pt-1">
                    {step.num}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-zinc-900 mb-2">{step.title}</h4>
                    <p className="text-zinc-600 leading-relaxed max-w-md">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=1974&auto=format&fit=crop"
                className="process-image rounded-2xl h-80 object-cover w-full shadow-lg"
                alt="Cleaning detail"
              />
              <img
                src="https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=2070&auto=format&fit=crop"
                className="process-image rounded-2xl h-64 object-cover w-full mt-16 shadow-lg"
                alt="Clean bedroom"
              />
              <div className="col-span-2 mt-4 bg-sky-600 p-8 rounded-2xl text-white">
                <blockquote className="text-xl font-medium leading-relaxed italic mb-4">
                  "Switching to Coastal Clean cut our management time in half. No more last-minute scheduling stress."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-500 overflow-hidden">
                    <img src="https://picsum.photos/seed/sarah/100/100" alt="Sarah" />
                  </div>
                  <div>
                    <p className="font-bold">Sarah Jenkins</p>
                    <p className="text-sky-200 text-sm">Owner, The Seaside Loft</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
