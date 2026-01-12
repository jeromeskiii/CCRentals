import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from '../ConfirmationModal';
import { safeLocalStorage } from '../../lib/validation';
import { PlacedUnit, UnitType, Recommendation, unitTypes } from './types';
import UnitPalette from './UnitPalette';
import Toolbar from './Toolbar';
import SelectedUnitControls from './SelectedUnitControls';

interface SiteMapPlannerProps {
  recommendations?: Recommendation[];
}

const SiteMapPlanner: React.FC<SiteMapPlannerProps> = ({
  recommendations: propRecommendations = [],
}) => {
  const [recommendations, _setRecommendations] = useState<Recommendation[]>(() => {
    const savedRecommendations = safeLocalStorage.getItem('calculatorRecommendations', []);
    if (savedRecommendations && savedRecommendations.length > 0) {
      return savedRecommendations;
    }
    return propRecommendations;
  });
  const [placedUnits, setPlacedUnits] = useState<PlacedUnit[]>(() => {
    const saved = safeLocalStorage.getItem('siteMapPlanner', null) as any;
    return saved?.placedUnits || [];
  });
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [draggingUnit, setDraggingUnit] = useState<PlacedUnit | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [canvasMode, setCanvasMode] = useState<'grid' | 'image'>(() => {
    const saved = safeLocalStorage.getItem('siteMapPlanner', null) as any;
    return saved?.canvasMode || 'grid';
  });
  const [backgroundImage, setBackgroundImage] = useState<string | null>(() => {
    const saved = safeLocalStorage.getItem('siteMapPlanner', null) as any;
    return saved?.backgroundImage || null;
  });
  const [canvasScale, setCanvasScale] = useState(1);
  const [gridSize] = useState(20);
  const [showGrid, setShowGrid] = useState(true);

  const [showPalette, setShowPalette] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [mapName, setMapName] = useState(() => {
    const saved = safeLocalStorage.getItem('siteMapPlanner', null) as any;
    return saved?.mapName || 'Untitled Site Map';
  });
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveMap = useCallback(() => {
    const data = {
      placedUnits,
      backgroundImage,
      mapName,
      canvasMode,
      savedAt: new Date().toISOString(),
    };
    safeLocalStorage.setItem('siteMapPlanner', data);
  }, [placedUnits, backgroundImage, mapName, canvasMode]);

  useEffect(() => {
    const timeout = setTimeout(saveMap, 500);
    return () => clearTimeout(timeout);
  }, [placedUnits, backgroundImage, mapName, canvasMode, saveMap]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string);
        setCanvasMode('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const addUnit = (unitType: UnitType) => {
    const newUnit: PlacedUnit = {
      id: `${unitType.id}-${Date.now()}`,
      type: unitType.id,
      icon: unitType.icon,
      x: 100,
      y: 100,
      rotation: 0,
      label: unitType.name,
    };
    setPlacedUnits((prev) => [...prev, newUnit]);
  };

  const addRecommendedUnits = () => {
    const newUnits: PlacedUnit[] = [];
    let xOffset = 100;
    let yOffset = 100;

    recommendations.forEach((rec) => {
      const unitType = unitTypes.find(
        (ut) =>
          ut.name.toLowerCase().includes(rec.type.toLowerCase()) ||
          rec.type.toLowerCase().includes(ut.name.toLowerCase())
      );

      if (unitType) {
        for (let i = 0; i < rec.quantity; i++) {
          newUnits.push({
            id: `${unitType.id}-${Date.now()}-${i}`,
            type: unitType.id,
            icon: unitType.icon,
            x: xOffset,
            y: yOffset,
            rotation: 0,
            label: unitType.name,
          });
          xOffset += unitType.width + 20;
          if (xOffset > 600) {
            xOffset = 100;
            yOffset += unitType.height + 20;
          }
        }
      }
    });

    setPlacedUnits((prev) => [...prev, ...newUnits]);
  };

  const handleDragStart = (e: React.MouseEvent, unit: PlacedUnit) => {
    e.preventDefault();
    setDraggingUnit(unit);
    setSelectedUnit(unit.id);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - unit.x,
        y: e.clientY - rect.top - unit.y,
      });
    }
  };

  useEffect(() => {
    if (!draggingUnit) return;

    const handleMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;

      setPlacedUnits((prev) =>
        prev.map((unit) =>
          unit.id === draggingUnit.id
            ? { ...unit, x: Math.max(0, newX), y: Math.max(0, newY) }
            : unit
        )
      );

      setDraggingUnit((prev) =>
        prev ? { ...prev, x: Math.max(0, newX), y: Math.max(0, newY) } : null
      );
    };

    const handleEnd = () => setDraggingUnit(null);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
    };
  }, [draggingUnit?.id, dragOffset.x, dragOffset.y]);

  const rotateUnit = (unitId: string, direction: 'left' | 'right') => {
    setPlacedUnits((prev) =>
      prev.map((unit) =>
        unit.id === unitId
          ? { ...unit, rotation: unit.rotation + (direction === 'right' ? 15 : -15) }
          : unit
      )
    );
  };

  const deleteUnit = (unitId: string) => {
    setPlacedUnits((prev) => prev.filter((unit) => unit.id !== unitId));
    if (selectedUnit === unitId) setSelectedUnit(null);
  };

  const handleClearConfirm = () => {
    setPlacedUnits([]);
    setSelectedUnit(null);
    setShowClearConfirm(false);
  };

  const drawUnits = (ctx: CanvasRenderingContext2D) => {
    placedUnits.forEach((unit) => {
      const unitType = unitTypes.find((ut) => ut.id === unit.type);
      if (!unitType) return;

      ctx.save();
      ctx.translate(unit.x + unitType.width / 2, unit.y + unitType.height / 2);
      ctx.rotate((unit.rotation * Math.PI) / 180);

      ctx.fillStyle = unitType.color + '20';
      ctx.strokeStyle = unitType.color;
      ctx.lineWidth = 2;
      ctx.fillRect(-unitType.width / 2, -unitType.height / 2, unitType.width, unitType.height);
      ctx.strokeRect(-unitType.width / 2, -unitType.height / 2, unitType.width, unitType.height);

      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(unit.icon, 0, 0);

      ctx.font = '12px Arial';
      ctx.fillStyle = '#374151';
      ctx.fillText(unitType.name, 0, unitType.height / 2 + 15);

      ctx.restore();
    });
  };

  const downloadCanvas = (canvas: HTMLCanvasElement) => {
    const link = document.createElement('a');
    link.download = `${mapName.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const exportAsImage = async () => {
    if (!canvasRef.current) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = canvasRef.current.offsetWidth;
      canvas.height = canvasRef.current.offsetHeight;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (backgroundImage) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          drawUnits(ctx);
          downloadCanvas(canvas);
        };
        img.src = backgroundImage;
      } else {
        if (showGrid) {
          ctx.strokeStyle = '#e5e7eb';
          ctx.lineWidth = 1;
          for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
          }
          for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
          }
        }
        drawUnits(ctx);
        downloadCanvas(canvas);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export image. Please try again.');
    }
  };

  const exportAsPDF = () => {
    const content = `
SITE MAP: ${mapName}
Generated: ${new Date().toLocaleDateString()}

PLACED UNITS (${placedUnits.length}):
${placedUnits
  .map((unit, idx) => {
    const unitType = unitTypes.find((ut) => ut.id === unit.type);
    return `${idx + 1}. ${unitType?.name || unit.type}
   Position: X=${Math.round(unit.x)}, Y=${Math.round(unit.y)}
   Rotation: ${unit.rotation}°`;
  })
  .join('\n\n')}

RECOMMENDATIONS:
${recommendations.map((rec) => `- ${rec.quantity} × ${rec.type}: ${rec.description}`).join('\n')}

---
Generated by Coastal Clean Rentals Site Map Planner
        `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `${mapName.replace(/\s+/g, '-')}.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const selectedUnitData = selectedUnit ? placedUnits.find((u) => u.id === selectedUnit) : null;
  const selectedUnitType = selectedUnitData
    ? unitTypes.find((ut) => ut.id === selectedUnitData.type)
    : null;

  return (
    <section id="site-map-planner" className="py-24 bg-gradient-to-br from-sky-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sky-600 font-bold uppercase tracking-widest text-sm mb-4 block">
              Interactive Planning Tool
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4">
              Site Map Planner
            </h2>
            <p className="text-lg text-zinc-600">
              Upload your site blueprint or use our grid to visualize equipment placement. Drag and
              drop units to create the perfect layout for your event.
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[40px] border border-zinc-200 shadow-2xl overflow-hidden">
            <Toolbar
              mapName={mapName}
              onMapNameChange={setMapName}
              canvasMode={canvasMode}
              onCanvasModeChange={setCanvasMode}
              showGrid={showGrid}
              onToggleGrid={() => setShowGrid(!showGrid)}
              onToggleHelp={() => setShowHelp(!showHelp)}
              onClear={() => setShowClearConfirm(true)}
              onExportPNG={exportAsImage}
              onExportPDF={exportAsPDF}
              onUploadImage={() => fileInputRef.current?.click()}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <AnimatePresence>
              {showHelp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-sky-50 border-b border-sky-200 px-6 py-4"
                >
                  <div className="grid md:grid-cols-3 gap-6 text-sm">
                    <div>
                      <h4 className="font-bold text-sky-900 mb-2">🎯 Getting Started</h4>
                      <ul className="text-sky-800 space-y-1">
                        <li>• Choose Grid mode or upload an image</li>
                        <li>• Drag units from the palette to the canvas</li>
                        <li>• Click units to select and move them</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-sky-900 mb-2">✏️ Editing</h4>
                      <ul className="text-sky-800 space-y-1">
                        <li>• Drag units to reposition</li>
                        <li>• Use rotation buttons to rotate</li>
                        <li>• Delete button removes selected unit</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-sky-900 mb-2">💾 Saving & Sharing</h4>
                      <ul className="text-sky-800 space-y-1">
                        <li>• Auto-saves to browser storage</li>
                        <li>• Export as PNG or PDF for sharing</li>
                        <li>• Include with your quote request</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {recommendations.length > 0 && (
              <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📋</span>
                    <div>
                      <p className="text-white font-bold">Calculator Recommendations Available</p>
                      <p className="text-sky-200 text-sm">
                        {recommendations.reduce((sum, r) => sum + r.quantity, 0)} units recommended
                        for your event
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={addRecommendedUnits}
                    className="px-6 py-3 bg-white text-sky-700 rounded-xl font-bold hover:bg-sky-50 transition-colors shadow-lg"
                  >
                    Add All to Map →
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col lg:flex-row h-[700px]">
              <AnimatePresence initial={false}>
                {showPalette && (
                  <UnitPalette
                    placedUnits={placedUnits}
                    onAddUnit={addUnit}
                    onClose={() => setShowPalette(false)}
                  />
                )}
              </AnimatePresence>

              <div className="flex-1 flex flex-col min-w-0 bg-zinc-50/30">
                <div className="px-8 py-4 bg-white border-b border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {!showPalette && (
                      <button
                        onClick={() => setShowPalette(true)}
                        className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors flex items-center gap-2 font-bold text-sm"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h7"
                          />
                        </svg>
                        Open Palette
                      </button>
                    )}
                    <div className="h-4 w-px bg-zinc-200 hidden md:block" />
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {placedUnits.slice(0, 5).map((u) => (
                          <div
                            key={u.id}
                            className="w-8 h-8 rounded-full bg-white border-2 border-zinc-100 flex items-center justify-center text-sm shadow-sm ring-2 ring-zinc-50"
                          >
                            {u.icon}
                          </div>
                        ))}
                        {placedUnits.length > 5 && (
                          <div className="w-8 h-8 rounded-full bg-sky-600 text-white border-2 border-white flex items-center justify-center text-[10px] font-bold">
                            +{placedUnits.length - 5}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-bold text-zinc-600 ml-2">
                        {placedUnits.length} {placedUnits.length === 1 ? 'Unit' : 'Units'} Placed
                      </span>
                    </div>
                  </div>

                  {selectedUnit && (
                    <div className="hidden md:flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mr-2">
                        Selected:
                      </span>
                      <div className="flex items-center gap-2 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100">
                        <span className="text-sm">{selectedUnitData?.icon}</span>
                        <span className="text-sm font-bold text-sky-700">
                          {selectedUnitType?.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 p-8 overflow-hidden flex flex-col">
                  <div
                    ref={canvasRef}
                    className="relative flex-1 bg-white border-2 border-zinc-200 rounded-[32px] overflow-hidden shadow-inner cursor-crosshair group/canvas"
                    style={{
                      backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {canvasMode === 'grid' && showGrid && (
                      <div
                        className="absolute inset-0 pointer-events-none opacity-40"
                        style={{
                          backgroundImage: `
                            linear-gradient(to right, #cbd5e1 1px, transparent 1px),
                            linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
                          `,
                          backgroundSize: `${gridSize}px ${gridSize}px`,
                        }}
                      />
                    )}

                    <div className="absolute bottom-6 right-6 flex items-center gap-2 z-[60] opacity-0 group-hover/canvas:opacity-100 transition-opacity">
                      <button
                        onClick={() => setCanvasScale((prev) => Math.min(prev + 0.1, 2))}
                        className="w-10 h-10 bg-white rounded-xl shadow-lg border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-sky-600 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </button>
                      <div className="px-3 py-2 bg-white rounded-xl shadow-lg border border-zinc-200 text-xs font-bold text-zinc-600 tabular-nums">
                        {Math.round(canvasScale * 100)}%
                      </div>
                      <button
                        onClick={() => setCanvasScale((prev) => Math.max(prev - 0.1, 0.5))}
                        className="w-10 h-10 bg-white rounded-xl shadow-lg border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-sky-600 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 12H4"
                          />
                        </svg>
                      </button>
                    </div>

                    {placedUnits.map((unit) => {
                      const unitType = unitTypes.find((ut) => ut.id === unit.type);
                      if (!unitType) return null;

                      return (
                        <div
                          key={unit.id}
                          className={`absolute cursor-move transition-shadow ${
                            selectedUnit === unit.id
                              ? 'shadow-2xl ring-4 ring-sky-500 z-50 scale-105'
                              : 'shadow-md hover:shadow-lg z-10'
                          }`}
                          style={{
                            left: unit.x,
                            top: unit.y,
                            width: unitType.width,
                            height: unitType.height,
                            transform: `rotate(${unit.rotation}deg)`,
                            backgroundColor: unitType.color + '25',
                            border: `3px solid ${unitType.color}`,
                            borderRadius: '12px',
                          }}
                          onMouseDown={(e) => handleDragStart(e, unit)}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUnit(unit.id);
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center text-3xl">
                            {unit.icon}
                          </div>

                          {selectedUnit === unit.id && (
                            <div className="absolute -top-3 -right-3 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </div>
                          )}

                          <div
                            className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black uppercase tracking-wider text-zinc-500 bg-white px-2 py-1 rounded-md shadow-sm border border-zinc-100"
                            style={{ transform: `rotate(${-unit.rotation}deg)` }}
                          >
                            {unitType.name}
                          </div>
                        </div>
                      );
                    })}

                    {placedUnits.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center max-w-sm px-6">
                          <div className="w-24 h-24 bg-sky-50 rounded-[32px] flex items-center justify-center text-5xl mx-auto mb-6 shadow-sm border border-sky-100">
                            🗺️
                          </div>
                          <p className="text-2xl font-black text-zinc-900 mb-3 tracking-tight">
                            Your Canvas is Ready
                          </p>
                          <p className="text-zinc-500 leading-relaxed">
                            {canvasMode === 'image'
                              ? 'Drag equipment from the palette onto your site image to begin planning.'
                              : 'Upload a site blueprint or start placing units on the interactive grid.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {selectedUnit && selectedUnitType && selectedUnitData && (
                      <SelectedUnitControls
                        selectedUnit={selectedUnitData}
                        unitType={selectedUnitType}
                        onRotate={(dir) => rotateUnit(selectedUnit, dir)}
                        onDelete={() => deleteUnit(selectedUnit)}
                        onDeselect={() => setSelectedUnit(null)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ConfirmationModal
          isOpen={showClearConfirm}
          title="Clear All Units?"
          message="This will permanently remove all units from your site map. This action cannot be undone."
          confirmText="Clear All"
          cancelText="Keep Units"
          variant="danger"
          onConfirm={handleClearConfirm}
          onCancel={() => setShowClearConfirm(false)}
        />
      </div>
    </section>
  );
};

export default SiteMapPlanner;
