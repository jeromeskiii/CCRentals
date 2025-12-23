import React from 'react';
import { motion } from 'framer-motion';

const services = [
  {
    title: "Standard Turnover",
    description: "Our signature clean between check-out and check-in. Detailed, fast, and guest-ready.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ),
    features: ["Kitchen & Bath Deep Clean", "Vacuum & Mop All Floors", "Dusting & Sanitization"]
  },
  {
    title: "Emergency Response",
    description: "Last minute booking? Guest spill? Our rapid response team is on call 24/7.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    features: ["< 2 Hour Response", "Stain Specialist", "Guest Incident Reports"]
  }
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const Services: React.FC = () => {
  return (
    <section id="services" className="py-12 bg-zinc-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-widest text-sky-600 uppercase mb-4">What We Do</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6">Built for the demands of high-volume hosting.</h3>
          <p className="text-lg text-zinc-600">
            We've refined our processes to match the rigorous standards of Airbnb Superhosts and VRBO Premiere Hosts.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto"
        >
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              variants={card}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="service-card group bg-white p-8 rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="w-12 h-12 bg-zinc-50 text-zinc-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300">
                {service.icon}
              </div>
              <h4 className="text-xl font-bold mb-3 text-zinc-900">{service.title}</h4>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-grow">
                {service.description}
              </p>
              <ul className="space-y-3">
                {service.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2 text-xs font-medium text-zinc-700">
                    <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
