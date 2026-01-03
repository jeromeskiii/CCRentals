import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for the site map planner
interface PlacedUnit {
    id: string;
    type: string;
    icon: string;
    x: number;
    y: number;
    rotation: number;
    label?: string;
}

interface UnitType {
    id: string;
    name: string;
    icon: string;
    category: 'toilet' | 'trailer' | 'handwash' | 'fencing' | 'other';
    width: number;
    height: number;
    color: string;
}

interface Recommendation {
    type: string;
    quantity: number;
    description: string;
    icon: string;
}

// Available unit types for the palette
const unitTypes: UnitType[] = [
    {
        id: 'standard-toilet',
        name: 'Standard Toilet',
        icon: '🚻',
        category: 'toilet',
        width: 60,
        height: 80,
        color: '#3B82F6'
    },
    {
        id: 'deluxe-toilet',
        name: 'Deluxe Unit',
        icon: '🚿',
        category: 'toilet',
        width: 70,
        height: 90,
        color: '#8B5CF6'
    },
    {
        id: 'ada-unit',
        name: 'ADA Unit',
        icon: '♿',
        category: 'toilet',
        width: 90,
        height: 100,
        color: '#10B981'
    },
    {
        id: 'handwash',
        name: 'Handwash Station',
        icon: '🧼',
        category: 'handwash',
        width: 50,
        height: 40,
        color: '#F59E0B'
    },
    {
        id: '2-stall-trailer',
        name: '2-Stall Trailer',
        icon: '🚐',
        category: 'trailer',
        width: 120,
        height: 80,
        color: '#EC4899'
    },
    {
        id: '4-stall-trailer',
        name: '4-Stall Trailer',
        icon: '🚌',
        category: 'trailer',
        width: 180,
        height: 80,
        color: '#EC4899'
    },
    {
        id: 'fencing',
        name: 'Fencing Panel',
        icon: '🔗',
        category: 'fencing',
        width: 100,
        height: 20,
        color: '#6B7280'
    },
    {
        id: 'attendant',
        name: 'Attendant Station',
        icon: '👤',
        category: 'other',
        width: 50,
        height: 50,
        color: '#14B8A6'
    }
];

const SiteMapPlanner: React.FC<{ recommendations?: Recommendation[] }> = ({ recommendations: propRecommendations = [] }) => {
    // Load recommendations from localStorage if not provided as prop
    const [recommendations, setRecommendations] = useState<Recommendation[]>(propRecommendations);
    
    // Canvas state
    const [placedUnits, setPlacedUnits] = useState<PlacedUnit[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
    const [draggingUnit, setDraggingUnit] = useState<PlacedUnit | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    
    // Canvas settings
    const [canvasMode, setCanvasMode] = useState<'grid' | 'image'>('grid');
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
    const [canvasScale, setCanvasScale] = useState(1);
    const [gridSize, setGridSize] = useState(20);
    const [showGrid, setShowGrid] = useState(true);
    
    // UI state
    const [showPalette, setShowPalette] = useState(true);
    const [showHelp, setShowHelp] = useState(false);
    const [mapName, setMapName] = useState('Untitled Site Map');
    
    // Refs
    const canvasRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load saved map on mount
    useEffect(() => {
        const saved = localStorage.getItem('siteMapPlanner');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setPlacedUnits(data.placedUnits || []);
                setBackgroundImage(data.backgroundImage || null);
                setMapName(data.mapName || 'Untitled Site Map');
                setCanvasMode(data.canvasMode || 'grid');
            } catch (e) {
                console.error('Failed to load saved map:', e);
            }
        }
        
        // Load recommendations from UnitCalculator
        const savedRecommendations = localStorage.getItem('calculatorRecommendations');
        if (savedRecommendations) {
            try {
                setRecommendations(JSON.parse(savedRecommendations));
            } catch (e) {
                console.error('Failed to load recommendations:', e);
            }
        }
    }, []);

    // Save map to localStorage
    const saveMap = useCallback(() => {
        const data = {
            placedUnits,
            backgroundImage,
            mapName,
            canvasMode,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem('siteMapPlanner', JSON.stringify(data));
    }, [placedUnits, backgroundImage, mapName, canvasMode]);

    // Auto-save on changes
    useEffect(() => {
        const timeout = setTimeout(saveMap, 500);
        return () => clearTimeout(timeout);
    }, [placedUnits, backgroundImage, mapName, canvasMode, saveMap]);

    // Handle image upload
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

    // Add unit from palette
    const addUnit = (unitType: UnitType) => {
        const newUnit: PlacedUnit = {
            id: `${unitType.id}-${Date.now()}`,
            type: unitType.id,
            icon: unitType.icon,
            x: 100,
            y: 100,
            rotation: 0,
            label: unitType.name
        };
        setPlacedUnits(prev => [...prev, newUnit]);
    };

    // Add recommended units
    const addRecommendedUnits = () => {
        const newUnits: PlacedUnit[] = [];
        let xOffset = 100;
        let yOffset = 100;

        recommendations.forEach(rec => {
            const unitType = unitTypes.find(ut => 
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
                        label: unitType.name
                    });
                    xOffset += unitType.width + 20;
                    if (xOffset > 600) {
                        xOffset = 100;
                        yOffset += unitType.height + 20;
                    }
                }
            }
        });

        setPlacedUnits(prev => [...prev, ...newUnits]);
    };

    // Handle drag start
    const handleDragStart = (e: React.MouseEvent, unit: PlacedUnit) => {
        e.preventDefault();
        setDraggingUnit(unit);
        setSelectedUnit(unit.id);
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            setDragOffset({
                x: e.clientX - rect.left - unit.x,
                y: e.clientY - rect.top - unit.y
            });
        }
    };

    // Handle drag move
    const handleDragMove = useCallback((e: MouseEvent) => {
        if (!draggingUnit || !canvasRef.current) return;
        
        const rect = canvasRef.current.getBoundingClientRect();
        const newX = e.clientX - rect.left - dragOffset.x;
        const newY = e.clientY - rect.top - dragOffset.y;
        
        setPlacedUnits(prev => prev.map(unit =>
            unit.id === draggingUnit.id
                ? { ...unit, x: Math.max(0, newX), y: Math.max(0, newY) }
                : unit
        ));
        
        setDraggingUnit(prev => prev ? { ...prev, x: Math.max(0, newX), y: Math.max(0, newY) } : null);
    }, [draggingUnit, dragOffset]);

    // Handle drag end
    const handleDragEnd = useCallback(() => {
        setDraggingUnit(null);
    }, []);

    // Set up drag listeners
    useEffect(() => {
        if (draggingUnit) {
            window.addEventListener('mousemove', handleDragMove);
            window.addEventListener('mouseup', handleDragEnd);
            return () => {
                window.removeEventListener('mousemove', handleDragMove);
                window.removeEventListener('mouseup', handleDragEnd);
            };
        }
    }, [draggingUnit, handleDragMove, handleDragEnd]);

    // Rotate selected unit
    const rotateUnit = (unitId: string, direction: 'left' | 'right') => {
        setPlacedUnits(prev => prev.map(unit =>
            unit.id === unitId
                ? { ...unit, rotation: unit.rotation + (direction === 'right' ? 15 : -15) }
                : unit
        ));
    };

    // Delete selected unit
    const deleteUnit = (unitId: string) => {
        setPlacedUnits(prev => prev.filter(unit => unit.id !== unitId));
        if (selectedUnit === unitId) setSelectedUnit(null);
    };

    // Clear all units
    const clearAll = () => {
        if (confirm('Are you sure you want to clear all units from the map?')) {
            setPlacedUnits([]);
            setSelectedUnit(null);
        }
    };

    // Export as image
    const exportAsImage = async () => {
        if (!canvasRef.current) return;
        
        try {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Set canvas size
            canvas.width = canvasRef.current.offsetWidth;
            canvas.height = canvasRef.current.offsetHeight;

            // Fill background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw background image if exists
            if (backgroundImage) {
                const img = new Image();
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    drawUnits(ctx);
                    downloadCanvas(canvas);
                };
                img.src = backgroundImage;
            } else {
                // Draw grid
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

    const drawUnits = (ctx: CanvasRenderingContext2D) => {
        placedUnits.forEach(unit => {
            const unitType = unitTypes.find(ut => ut.id === unit.type);
            if (!unitType) return;

            ctx.save();
            ctx.translate(unit.x + unitType.width / 2, unit.y + unitType.height / 2);
            ctx.rotate((unit.rotation * Math.PI) / 180);
            
            // Draw unit box
            ctx.fillStyle = unitType.color + '20';
            ctx.strokeStyle = unitType.color;
            ctx.lineWidth = 2;
            ctx.fillRect(-unitType.width / 2, -unitType.height / 2, unitType.width, unitType.height);
            ctx.strokeRect(-unitType.width / 2, -unitType.height / 2, unitType.width, unitType.height);
            
            // Draw icon
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(unit.icon, 0, 0);
            
            // Draw label
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

    // Export as PDF (simple text-based approach)
    const exportAsPDF = () => {
        const content = `
SITE MAP: ${mapName}
Generated: ${new Date().toLocaleDateString()}

PLACED UNITS (${placedUnits.length}):
${placedUnits.map((unit, idx) => {
    const unitType = unitTypes.find(ut => ut.id === unit.type);
    return `${idx + 1}. ${unitType?.name || unit.type}
   Position: X=${Math.round(unit.x)}, Y=${Math.round(unit.y)}
   Rotation: ${unit.rotation}°`;
}).join('\n\n')}

RECOMMENDATIONS:
${recommendations.map(rec => `- ${rec.quantity} × ${rec.type}: ${rec.description}`).join('\n')}

---
Generated by Coastal Clean Rentals Site Map Planner
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const link = document.createElement('a');
        link.download = `${mapName.replace(/\s+/g, '-')}.txt`;
        link.href = URL.createObjectURL(blob);
        link.click();
    };

    // Get selected unit details
    const selectedUnitData = selectedUnit ? placedUnits.find(u => u.id === selectedUnit) : null;
    const selectedUnitType = selectedUnitData ? unitTypes.find(ut => ut.id === selectedUnitData.type) : null;

    return (
        <section id="site-map-planner" className="py-24 bg-gradient-to-br from-sky-50 to-white">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center max-w-4xl mx-auto mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="text-sky-600 font-bold uppercase tracking-widest text-sm mb-4 block">
                            Interactive Planning Tool
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4">
                            Site Map Planner
                        </h2>
                        <p className="text-lg text-zinc-600">
                            Upload your site blueprint or use our grid to visualize equipment placement. 
                            Drag and drop units to create the perfect layout for your event.
                        </p>
                    </motion.div>
                </div>

                {/* Main Planner Interface */}
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-[40px] border border-zinc-200 shadow-2xl overflow-hidden">
                        {/* Toolbar */}
                        <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-4">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                {/* Map Name */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={mapName}
                                        onChange={(e) => setMapName(e.target.value)}
                                        className="px-4 py-2 bg-white border border-zinc-200 rounded-xl font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        placeholder="Site Map Name"
                                    />
                                </div>

                                {/* View Controls */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCanvasMode('grid')}
                                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${canvasMode === 'grid'
                                                ? 'bg-sky-600 text-white'
                                                : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                                            }`}
                                    >
                                        📐 Grid
                                    </button>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${canvasMode === 'image'
                                                ? 'bg-sky-600 text-white'
                                                : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                                            }`}
                                    >
                                        🖼️ Upload Image
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => setShowGrid(!showGrid)}
                                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${showGrid
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                                            }`}
                                    >
                                        {showGrid ? '📏 Grid On' : '📏 Grid Off'}
                                    </button>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setShowHelp(!showHelp)}
                                        className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors"
                                    >
                                        ❓ Help
                                    </button>
                                    <button
                                        onClick={clearAll}
                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-bold text-sm hover:bg-red-200 transition-colors"
                                    >
                                        🗑️ Clear
                                    </button>
                                    <button
                                        onClick={exportAsImage}
                                        className="px-4 py-2 bg-sky-600 text-white rounded-xl font-bold text-sm hover:bg-sky-700 transition-colors"
                                    >
                                        📥 Export PNG
                                    </button>
                                    <button
                                        onClick={exportAsPDF}
                                        className="px-4 py-2 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors"
                                    >
                                        📄 Export PDF
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Help Panel */}
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

                        {/* Recommendations Banner */}
                        {recommendations.length > 0 && (
                            <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">📋</span>
                                        <div>
                                            <p className="text-white font-bold">Calculator Recommendations Available</p>
                                            <p className="text-sky-200 text-sm">
                                                {recommendations.reduce((sum, r) => sum + r.quantity, 0)} units recommended for your event
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

                        {/* Main Content Area */}
                        <div className="flex flex-col lg:flex-row h-[700px]">
                            {/* Unit Palette */}
                            <AnimatePresence initial={false}>
                                {showPalette && (
                                    <motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 320, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="border-r border-zinc-200 bg-zinc-50 overflow-hidden flex-shrink-0"
                                    >
                                        <div className="w-80 p-6 h-full overflow-y-auto">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="font-bold text-zinc-900 uppercase tracking-wider text-xs">Unit Palette</h3>
                                                <button
                                                    onClick={() => setShowPalette(false)}
                                                    className="text-zinc-400 hover:text-zinc-600 transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 gap-3">
                                                {unitTypes.map((unitType) => (
                                                    <button
                                                        key={unitType.id}
                                                        onClick={() => addUnit(unitType)}
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
                                                            <p className="text-[10px] text-zinc-500 font-medium">{unitType.width} × {unitType.height} ft</p>
                                                        </div>
                                                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Stats */}
                                            <div className="mt-8 p-5 bg-zinc-100/50 rounded-2xl border border-zinc-200/50">
                                                <h4 className="font-bold text-zinc-900 mb-4 text-xs uppercase tracking-wider">Map Statistics</h4>
                                                <div className="space-y-3 text-sm">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-zinc-500">Total Units:</span>
                                                        <span className="font-black text-sky-600 text-base">{placedUnits.length}</span>
                                                    </div>
                                                    <div className="h-px bg-zinc-200 my-2" />
                                                    <div className="flex justify-between">
                                                        <span className="text-zinc-500">Toilets:</span>
                                                        <span className="font-bold text-zinc-900">
                                                            {placedUnits.filter(u => unitTypes.find(ut => ut.id === u.type)?.category === 'toilet').length}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-zinc-500">Trailers:</span>
                                                        <span className="font-bold text-zinc-900">
                                                            {placedUnits.filter(u => unitTypes.find(ut => ut.id === u.type)?.category === 'trailer').length}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-zinc-500">Handwash:</span>
                                                        <span className="font-bold text-zinc-900">
                                                            {placedUnits.filter(u => unitTypes.find(ut => ut.id === u.type)?.category === 'handwash').length}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Canvas Area */}
                            <div className="flex-1 flex flex-col min-w-0 bg-zinc-50/30">
                                <div className="px-8 py-4 bg-white border-b border-zinc-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {!showPalette && (
                                            <button
                                                onClick={() => setShowPalette(true)}
                                                className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors flex items-center gap-2 font-bold text-sm"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                                                </svg>
                                                Open Palette
                                            </button>
                                        )}
                                        <div className="h-4 w-px bg-zinc-200 hidden md:block" />
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-2">
                                                {placedUnits.slice(0, 5).map((u, i) => (
                                                    <div key={u.id} className="w-8 h-8 rounded-full bg-white border-2 border-zinc-100 flex items-center justify-center text-sm shadow-sm ring-2 ring-zinc-50">
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
                                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mr-2">Selected:</span>
                                            <div className="flex items-center gap-2 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100">
                                                <span className="text-sm">{selectedUnitData?.icon}</span>
                                                <span className="text-sm font-bold text-sky-700">{selectedUnitType?.name}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Canvas Container */}
                                <div className="flex-1 p-8 overflow-hidden flex flex-col">
                                    <div
                                        ref={canvasRef}
                                        className="relative flex-1 bg-white border-2 border-zinc-200 rounded-[32px] overflow-hidden shadow-inner cursor-crosshair group/canvas"
                                        style={{
                                            backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    >
                                        {/* Grid overlay */}
                                        {canvasMode === 'grid' && showGrid && (
                                            <div
                                                className="absolute inset-0 pointer-events-none opacity-40"
                                                style={{
                                                    backgroundImage: `
                                                        linear-gradient(to right, #cbd5e1 1px, transparent 1px),
                                                        linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
                                                    `,
                                                    backgroundSize: `${gridSize}px ${gridSize}px`
                                                }}
                                            />
                                        )}

                                        {/* Canvas Controls Overlay */}
                                        <div className="absolute bottom-6 right-6 flex items-center gap-2 z-[60] opacity-0 group-hover/canvas:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => setCanvasScale(prev => Math.min(prev + 0.1, 2))}
                                                className="w-10 h-10 bg-white rounded-xl shadow-lg border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-sky-600 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => setCanvasScale(prev => Math.max(prev - 0.1, 0.5))}
                                                className="w-10 h-10 bg-white rounded-xl shadow-lg border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-sky-600 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Placed Units */}
                                        {placedUnits.map((unit) => {
                                            const unitType = unitTypes.find(ut => ut.id === unit.type);
                                            if (!unitType) return null;

                                            return (
                                                <div
                                                    key={unit.id}
                                                    className={`absolute cursor-move transition-shadow ${
                                                        selectedUnit === unit.id ? 'shadow-2xl ring-4 ring-sky-500 z-50 scale-105' : 'shadow-md hover:shadow-lg z-10'
                                                    }`}
                                                    style={{
                                                        left: unit.x,
                                                        top: unit.y,
                                                        width: unitType.width,
                                                        height: unitType.height,
                                                        transform: `rotate(${unit.rotation}deg)`,
                                                        backgroundColor: unitType.color + '25',
                                                        border: `3px solid ${unitType.color}`,
                                                        borderRadius: '12px'
                                                    }}
                                                    onMouseDown={(e) => handleDragStart(e, unit)}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedUnit(unit.id);
                                                    }}
                                                >
                                                    {/* Icon */}
                                                    <div className="absolute inset-0 flex items-center justify-center text-3xl">
                                                        {unit.icon}
                                                    </div>

                                                    {/* Selection Indicator */}
                                                    {selectedUnit === unit.id && (
                                                        <div className="absolute -top-3 -right-3 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                            </svg>
                                                        </div>
                                                    )}

                                                    {/* Label */}
                                                    <div
                                                        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black uppercase tracking-wider text-zinc-500 bg-white px-2 py-1 rounded-md shadow-sm border border-zinc-100"
                                                        style={{ transform: `rotate(${-unit.rotation}deg)` }}
                                                    >
                                                        {unitType.name}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Empty State */}
                                        {placedUnits.length === 0 && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-center max-w-sm px-6">
                                                    <div className="w-24 h-24 bg-sky-50 rounded-[32px] flex items-center justify-center text-5xl mx-auto mb-6 shadow-sm border border-sky-100">
                                                        🗺️
                                                    </div>
                                                    <p className="text-2xl font-black text-zinc-900 mb-3 tracking-tight">Your Canvas is Ready</p>
                                                    <p className="text-zinc-500 leading-relaxed">
                                                        {canvasMode === 'image' 
                                                            ? 'Drag equipment from the palette onto your site image to begin planning.'
                                                            : 'Upload a site blueprint or start placing units on the interactive grid.'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Selected Unit Controls */}
                                    <AnimatePresence>
                                        {selectedUnit && selectedUnitType && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 20 }}
                                                className="mt-6 p-4 bg-zinc-900 rounded-3xl border border-zinc-800 flex flex-wrap items-center justify-between gap-6 shadow-2xl"
                                            >
                                                <div className="flex items-center gap-4 pl-2">
                                                    <div
                                                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                                                        style={{ backgroundColor: selectedUnitType.color + '30' }}
                                                    >
                                                        {selectedUnitData?.icon}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-white">{selectedUnitType.name}</p>
                                                        <p className="text-xs font-bold text-zinc-500">
                                                            COORD: {Math.round(selectedUnitData?.x || 0)}, {Math.round(selectedUnitData?.y || 0)} • 
                                                            ROT: {selectedUnitData?.rotation || 0}°
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex bg-zinc-800 p-1 rounded-2xl border border-zinc-700">
                                                        <button
                                                            onClick={() => rotateUnit(selectedUnit, 'left')}
                                                            className="p-3 text-white hover:bg-zinc-700 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold"
                                                            title="Rotate Left"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => rotateUnit(selectedUnit, 'right')}
                                                            className="p-3 text-white hover:bg-zinc-700 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold"
                                                            title="Rotate Right"
                                                        >
                                                            <svg className="w-5 h-5 transform scale-x-[-1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => deleteUnit(selectedUnit)}
                                                        className="px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl font-black text-sm transition-all border border-red-500/20"
                                                    >
                                                        REMOVE UNIT
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedUnit(null)}
                                                        className="p-3 text-zinc-400 hover:text-white transition-colors"
                                                    >
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default SiteMapPlanner;
