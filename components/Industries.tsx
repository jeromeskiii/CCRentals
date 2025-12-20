import React from 'react';
import { motion } from 'framer-motion';

const industries = [
  {
    title: "Construction",
    icon: "🏗️",
    desc: "Long-term rentals for commercial and residential developments. Weekly service included."
  },
  {
    title: "Weddings & Events",
    icon: "🥂",
    desc: "Luxury trailers that match the elegance of your venue. High-end comfort for guests."
  },
  {
    title: "Agriculture",
    icon: "🚜",
    desc: "GAP-compliant units for field workers, designed for rugged transport and sanitation."
  },
  {
    title: "Disaster Relief",
    icon: "🆘",
    desc: "Rapid deployment for emergency response, fires, or infrastructure failures."
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

const Industries: React.FC = () => {
  return (
    <section id="industries" className="py-12 bg-zinc-950 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-sky-400 font-bold uppercase tracking-widest text-sm mb-4">Who We Serve</h2>
          <h3 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Tailored to your industry.</h3>
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="industry-desc text-zinc-400 text-xl font-medium leading-relaxed"
          >
            We don’t just deliver portable toilets — we offer comprehensive sanitation logistics management. From planning and deployment to maintenance and compliance, we support a wide range of industries with tailored solutions that ensure hygiene, efficiency, and reliability at every stage.
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {industries.map((item, i) => (
            <motion.div
              key={i}
              variants={card}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="industry-card p-10 bg-zinc-900 border border-zinc-800 rounded-[32px] hover:bg-zinc-800 transition-all group text-center flex flex-col items-center"
            >
              <div className="text-5xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-300">
                {item.icon}
              </div>
              <h4 className="text-2xl font-bold mb-4">{item.title}</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Industries;
