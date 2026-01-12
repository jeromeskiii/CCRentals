import React from 'react';
import { motion } from 'framer-motion';
import { PlacedUnit, UnitType, unitTypes } from './types';

interface UnitPaletteProps {
  placedUnits: PlacedUnit[];
  onAddUnit: (unitType: UnitType) => void;
  onClose: () => void;
}

const UnitPalette: React.FC<UnitPaletteProps> = ({ placedUnits, onAddUnit, onClose }) => {
  const getUnitCountByCategory = (category: UnitType['category']) =>
    placedUnits.filter((u) => unitTypes.find((ut) => ut.id === u.type)?.category === category)
      .length;

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 320, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="border-r border-zinc-200 bg-zinc-50 overflow-hidden flex-shrink-0"
    >
      <div className="w-80 p-6 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-zinc-900 uppercase tracking-wider text-xs">Unit Palette</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {unitTypes.map((unitType) => (
            <button
              key={unitType.id}
              onClick={() => onAddUnit(unitType)}
              className="w-full p-3 bg-white border border-zinc-200 rounded-2xl hover:border-sky-500 hover:shadow-md transition-all text-left group flex items-center gap-3"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: unitType.color + '15' }}
              >
                {unitType.icon}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-zinc-900 text-sm truncate">{unitType.name}</p>
                <p className="text-[10px] text-zinc-500 font-medium">
                  {unitType.width} × {unitType.height} ft
                </p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  className="w-4 h-4 text-sky-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 p-5 bg-zinc-100/50 rounded-2xl border border-zinc-200/50">
          <h4 className="font-bold text-zinc-900 mb-4 text-xs uppercase tracking-wider">
            Map Statistics
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Total Units:</span>
              <span className="font-black text-sky-600 text-base">{placedUnits.length}</span>
            </div>
            <div className="h-px bg-zinc-200 my-2" />
            <div className="flex justify-between">
              <span className="text-zinc-500">Toilets:</span>
              <span className="font-bold text-zinc-900">{getUnitCountByCategory('toilet')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Trailers:</span>
              <span className="font-bold text-zinc-900">{getUnitCountByCategory('trailer')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Handwash:</span>
              <span className="font-bold text-zinc-900">{getUnitCountByCategory('handwash')}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UnitPalette;
