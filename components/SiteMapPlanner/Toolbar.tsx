import React from 'react';

interface ToolbarProps {
  mapName: string;
  onMapNameChange: (name: string) => void;
  canvasMode: 'grid' | 'image';
  onCanvasModeChange: (mode: 'grid' | 'image') => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  onToggleHelp: () => void;
  onClear: () => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
  onUploadImage: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  mapName,
  onMapNameChange,
  canvasMode,
  onCanvasModeChange,
  showGrid,
  onToggleGrid,
  onToggleHelp,
  onClear,
  onExportPNG,
  onExportPDF,
  onUploadImage,
}) => {
  return (
    <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={mapName}
            onChange={(e) => onMapNameChange(e.target.value)}
            className="px-4 py-2 bg-white border border-zinc-200 rounded-xl font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Site Map Name"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onCanvasModeChange('grid')}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              canvasMode === 'grid'
                ? 'bg-sky-600 text-white'
                : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            📐 Grid
          </button>
          <button
            onClick={onUploadImage}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              canvasMode === 'image'
                ? 'bg-sky-600 text-white'
                : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            🖼️ Upload Image
          </button>
          <button
            onClick={onToggleGrid}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              showGrid
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            {showGrid ? '📏 Grid On' : '📏 Grid Off'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleHelp}
            className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors"
          >
            ❓ Help
          </button>
          <button
            onClick={onClear}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-bold text-sm hover:bg-red-200 transition-colors"
            aria-label="Clear all units from map"
          >
            🗑️ Clear
          </button>
          <button
            onClick={onExportPNG}
            className="px-4 py-2 bg-sky-600 text-white rounded-xl font-bold text-sm hover:bg-sky-700 transition-colors"
          >
            📥 Export PNG
          </button>
          <button
            onClick={onExportPDF}
            className="px-4 py-2 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors"
          >
            📄 Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
