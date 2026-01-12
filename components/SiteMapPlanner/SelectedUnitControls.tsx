import React from 'react';
import { motion } from 'framer-motion';
import { PlacedUnit, UnitType } from './types';

interface SelectedUnitControlsProps {
  selectedUnit: PlacedUnit;
  unitType: UnitType;
  onRotate: (direction: 'left' | 'right') => void;
  onDelete: () => void;
  onDeselect: () => void;
}

const SelectedUnitControls: React.FC<SelectedUnitControlsProps> = ({
  selectedUnit,
  unitType,
  onRotate,
  onDelete,
  onDeselect,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="mt-6 p-4 bg-zinc-900 rounded-3xl border border-zinc-800 flex flex-wrap items-center justify-between gap-6 shadow-2xl"
    >
      <div className="flex items-center gap-4 pl-2">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: unitType.color + '30' }}
        >
          {selectedUnit.icon}
        </div>
        <div>
          <p className="font-black text-white">{unitType.name}</p>
          <p className="text-xs font-bold text-zinc-500">
            COORD: {Math.round(selectedUnit.x)}, {Math.round(selectedUnit.y)} • ROT:{' '}
            {selectedUnit.rotation}°
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex bg-zinc-800 p-1 rounded-2xl border border-zinc-700">
          <button
            onClick={() => onRotate('left')}
            className="p-3 text-white hover:bg-zinc-700 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold"
            title="Rotate Left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <button
            onClick={() => onRotate('right')}
            className="p-3 text-white hover:bg-zinc-700 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold"
            title="Rotate Right"
          >
            <svg
              className="w-5 h-5 transform scale-x-[-1]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
        <button
          onClick={onDelete}
          className="px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl font-black text-sm transition-all border border-red-500/20"
        >
          REMOVE UNIT
        </button>
        <button
          onClick={onDeselect}
          className="p-3 text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default SelectedUnitControls;
