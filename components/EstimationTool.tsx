
import React, { useState } from 'react';
import QuoteModal from './QuoteModal';

const EstimationTool: React.FC = () => {
  const [people, setPeople] = useState(50);
  const [hours, setHours] = useState(8);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simple industry standard formula: roughly 1 unit per 10 workers for 8 hours
  // For events: roughly 1 unit per 50 people for 8 hours (adjusted for alcohol)
  const calcUnits = () => {
    const base = Math.ceil(people / 50);
    const timeMultiplier = hours > 4 ? 1.5 : 1;
    return Math.max(1, Math.ceil(base * timeMultiplier));
  };

  const calculatedUnits = calcUnits();

  return (
    <section id="estimate" className="py-24 bg-zinc-50">
      <div className="container mx-auto px-6">
        <div className="bg-white rounded-[48px] border border-zinc-200 shadow-2xl overflow-hidden grid lg:grid-cols-2">
          <div className="p-12 md:p-20">
            <h2 className="text-sky-600 font-bold uppercase tracking-widest text-sm mb-4">Planning Tool</h2>
            <h3 className="text-4xl font-black text-zinc-900 mb-6 tracking-tight">Unit Estimator</h3>
            <p className="text-zinc-600 mb-12">
              Ensure you have the right capacity for your site or event. Adjust the sliders below to get a recommended unit count.
            </p>

            <div className="space-y-12">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="font-bold text-zinc-900">Total People</label>
                  <span className="px-4 py-1 bg-zinc-100 rounded-full font-black text-sky-600">{people}</span>
                </div>
                <input
                  type="range" min="0" max="500" step="10" value={people}
                  onChange={(e) => setPeople(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="font-bold text-zinc-900">Duration (Hours)</label>
                  <span className="px-4 py-1 bg-zinc-100 rounded-full font-black text-sky-600">{hours} hrs</span>
                </div>
                <input
                  type="range" min="1" max="24" value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
              </div>
            </div>
          </div>

          <div className="bg-sky-600 p-12 md:p-20 flex flex-col justify-center text-white text-center">
            <p className="text-sky-100 font-bold uppercase tracking-widest mb-4">Recommended Capacity</p>
            <div className="text-[120px] font-black leading-none mb-4 tabular-nums">
              {calculatedUnits}
            </div>
            <p className="text-2xl font-bold mb-8">Portable Units</p>
            <div className="p-6 bg-white/10 rounded-2xl text-left border border-white/20">
              <p className="text-sm italic text-sky-50 leading-relaxed">
                *This is a general estimate based on standard industry sanitation charts. For construction sites with multiple shifts or events with alcohol service, we recommend increasing unit count by 20%.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-12 w-full py-5 bg-white text-sky-600 font-black rounded-2xl hover:bg-sky-50 transition-all shadow-xl shadow-sky-900/20"
            >
              Get Custom Quote
            </button>
          </div>
        </div>
      </div>

      <QuoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultPeople={people}
        defaultHours={hours}
        calculatedUnits={calculatedUnits}
      />
    </section>
  );
};

export default EstimationTool;
