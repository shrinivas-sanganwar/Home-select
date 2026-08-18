import React, { useState, useEffect } from 'react';
import { PaintProduct } from '../types';
import { PAINT_PRODUCTS } from '../data/defaultContent';
import { 
  Calculator, 
  Layers, 
  Sparkles, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Package, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WallItem {
  id: string;
  name: string;
  width: number;
  height: number;
}

interface PaintCalculatorProps {
  initialSelectedProduct?: PaintProduct | null;
  products?: PaintProduct[];
}

export const PaintCalculatorSection: React.FC<PaintCalculatorProps> = ({
  initialSelectedProduct,
  products = PAINT_PRODUCTS,
}) => {
  // Selected Paint Product
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialSelectedProduct?.id || products[0]?.id || 'prod-1'
  );

  useEffect(() => {
    if (initialSelectedProduct) {
      setSelectedProductId(initialSelectedProduct.id);
    }
  }, [initialSelectedProduct]);

  const activeProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Wall-by-Wall Measurements (Height × Width for each wall)
  const [walls, setWalls] = useState<WallItem[]>([
    { id: 'w1', name: 'Wall 1 (Front)', width: 14, height: 10 },
    { id: 'w2', name: 'Wall 2 (Back)', width: 14, height: 10 },
    { id: 'w3', name: 'Wall 3 (Left)', width: 12, height: 10 },
    { id: 'w4', name: 'Wall 4 (Right)', width: 12, height: 10 },
  ]);

  // Ceiling Option (Width × Length)
  const [includeCeiling, setIncludeCeiling] = useState<boolean>(false);
  const [ceilingWidth, setCeilingWidth] = useState<number>(14);
  const [ceilingLength, setCeilingLength] = useState<number>(12);

  // Openings / Deductions
  const [numDoors, setNumDoors] = useState<number>(2); // 21 sq.ft each
  const [numWindows, setNumWindows] = useState<number>(2); // 15 sq.ft each

  // Number of Coats
  const [numCoats, setNumCoats] = useState<number>(2);

  // Surface Preparation / Primer
  const [includePrimer, setIncludePrimer] = useState<boolean>(true);

  // Copy Feedback State
  const [copiedEstimate, setCopiedEstimate] = useState<boolean>(false);

  // Calculations
  const totalWallsArea = walls.reduce((sum, w) => sum + (Number(w.width) || 0) * (Number(w.height) || 0), 0);
  const ceilingArea = includeCeiling ? (Number(ceilingWidth) || 0) * (Number(ceilingLength) || 0) : 0;
  const grossArea = totalWallsArea + ceilingArea;
  const deductionArea = (numDoors * 21) + (numWindows * 15);
  const netAreaSqFt = Math.max(0, grossArea - deductionArea);

  // Coverage & Litres
  const coveragePerLiter = activeProduct.coverageSqFtPerLiter || 130;
  const totalLitersRaw = (netAreaSqFt * numCoats) / coveragePerLiter;
  const totalLitersRequired = Math.max(1, Math.ceil(totalLitersRaw * 10) / 10);

  // Can Pack Optimization (20L, 10L, 4L, 1L)
  const calculatePackOptimizer = (liters: number) => {
    let remaining = Math.ceil(liters);
    const packs20L = Math.floor(remaining / 20);
    remaining %= 20;
    const packs10L = Math.floor(remaining / 10);
    remaining %= 10;
    const packs4L = Math.floor(remaining / 4);
    remaining %= 4;
    const packs1L = remaining;

    return { packs20L, packs10L, packs4L, packs1L };
  };

  const packs = calculatePackOptimizer(totalLitersRequired);

  // Cost Estimates
  const pricePerLiter = activeProduct.estimatedPricePerLiter || 640;
  const estimatedPaintCost = Math.round(totalLitersRequired * pricePerLiter);
  const estimatedPrimerCost = includePrimer ? Math.round(Math.ceil(netAreaSqFt / 140) * 220) : 0;
  const estimatedSuppliesCost = 450; // Roller, tape, tray, brush
  const totalEstimatedCost = estimatedPaintCost + estimatedPrimerCost + estimatedSuppliesCost;

  // Add a new wall
  const handleAddWall = () => {
    const nextNum = walls.length + 1;
    setWalls([
      ...walls,
      { id: `w-${Date.now()}`, name: `Wall ${nextNum}`, width: 12, height: 10 },
    ]);
  };

  // Remove a wall
  const handleRemoveWall = (id: string) => {
    if (walls.length <= 1) return;
    setWalls(walls.filter((w) => w.id !== id));
  };

  // Update wall dimension
  const handleUpdateWall = (id: string, field: 'name' | 'width' | 'height', val: any) => {
    setWalls(
      walls.map((w) => {
        if (w.id === id) {
          return { ...w, [field]: field === 'name' ? val : Math.max(1, Number(val) || 0) };
        }
        return w;
      })
    );
  };

  // Quick Preset Handlers
  const applyQuickPreset = (type: '1-room' | 'single-wall' | 'accent' | 'hall') => {
    if (type === 'single-wall') {
      setWalls([{ id: 'w1', name: 'Feature Accent Wall', width: 16, height: 10 }]);
      setIncludeCeiling(false);
      setNumDoors(0);
      setNumWindows(0);
    } else if (type === '1-room') {
      setWalls([
        { id: 'w1', name: 'Wall 1 (Front)', width: 14, height: 10 },
        { id: 'w2', name: 'Wall 2 (Back)', width: 14, height: 10 },
        { id: 'w3', name: 'Wall 3 (Left)', width: 12, height: 10 },
        { id: 'w4', name: 'Wall 4 (Right)', width: 12, height: 10 },
      ]);
      setIncludeCeiling(false);
      setNumDoors(2);
      setNumWindows(2);
    } else if (type === 'hall') {
      setWalls([
        { id: 'w1', name: 'Living Wall 1', width: 20, height: 10 },
        { id: 'w2', name: 'Living Wall 2', width: 20, height: 10 },
        { id: 'w3', name: 'Living Wall 3', width: 16, height: 10 },
        { id: 'w4', name: 'Living Wall 4', width: 16, height: 10 },
      ]);
      setIncludeCeiling(true);
      setCeilingWidth(20);
      setCeilingLength(16);
      setNumDoors(3);
      setNumWindows(3);
    }
  };

  const handleCopyEstimate = () => {
    const text = `HomeSelect Paint Estimate:
Product: ${activeProduct.name} (${activeProduct.finish})
Total Paintable Area: ${netAreaSqFt} sq. ft.
Coats: ${numCoats} coats
Liters Needed: ${totalLitersRequired} Litres
Recommended Packs: ${packs.packs20L ? `${packs.packs20L}x20L ` : ''}${packs.packs10L ? `${packs.packs10L}x10L ` : ''}${packs.packs4L ? `${packs.packs4L}x4L ` : ''}${packs.packs1L ? `${packs.packs1L}x1L` : ''}
Estimated Paint Cost: ₹${estimatedPaintCost.toLocaleString('en-IN')}
Total Project Estimate: ₹${totalEstimatedCost.toLocaleString('en-IN')}`;

    navigator.clipboard.writeText(text);
    setCopiedEstimate(true);
    setTimeout(() => setCopiedEstimate(false), 2500);
  };

  return (
    <section 
      id="product-guides" 
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8E2D5] dark:border-white/10 scroll-mt-16"
    >
      {/* Anchor alias for calculator */}
      <div id="calculator" className="relative -top-20" />

      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#162032]/80 backdrop-blur-md border border-[#E8E2D5] dark:border-white/10 text-xs font-bold text-[#243B7A] dark:text-[#93C5FD] shadow-2xs">
          <Calculator className="w-4 h-4 text-[#E68A00] dark:text-[#F59E0B]" />
          <span>Wall-by-Wall Paint Calculator</span>
        </div>

        <h2 className="font-heading font-black text-3xl sm:text-5xl tracking-tight text-[#1A1A1A] dark:text-[#F1F4F9]">
          Accurate Paint &amp; Can Pack Estimator
        </h2>

        <p className="text-base sm:text-lg text-[#1A1A1A]/70 dark:text-[#94A3B8] leading-relaxed">
          Measure walls by their actual height and width, deduct doors &amp; windows, and get the exact can pack combo (1L, 4L, 10L, 20L) with zero paint wastage.
        </p>
      </div>

      {/* Calculator Grid: Left Inputs + Right Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Wall Dimensions & Settings (7 Cols) */}
        <div className="lg:col-span-7 bg-white/85 dark:bg-[#131B2E]/90 backdrop-blur-xl rounded-3xl border border-[#E8E2D5] dark:border-white/10 p-6 sm:p-8 shadow-xl space-y-8">
          
          {/* Step 1: Select Paint Finish */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1A1A1A] dark:text-[#F1F4F9] uppercase tracking-wider">
                1. Select Paint Finish
              </label>
              <span className="text-xs font-semibold text-[#243B7A] dark:text-[#60A5FA]">
                Coverage: {activeProduct.coverageSqFtPerLiter} sq.ft / Litre
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {products.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProductId(p.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    selectedProductId === p.id
                      ? 'border-[#243B7A] dark:border-[#3B82F6] bg-[#FAF8F5] dark:bg-[#1E293B] shadow-xs ring-2 ring-[#243B7A]/15 dark:ring-[#3B82F6]/30'
                      : 'border-[#E8E2D5] dark:border-white/10 bg-white/60 dark:bg-[#0E131F]/60 hover:border-[#243B7A]/40 dark:hover:border-[#60A5FA]/40'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-xl border border-black/10 dark:border-white/10 shrink-0" 
                    style={{ backgroundColor: p.hexCode }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-[#1A1A1A] dark:text-[#F1F4F9] truncate">{p.name}</div>
                    <div className="text-[10px] text-[#1A1A1A]/60 dark:text-[#94A3B8] flex items-center justify-between">
                      <span>{p.finish}</span>
                      <span className="font-semibold text-[#243B7A] dark:text-[#93C5FD]">₹{p.estimatedPricePerLiter}/L</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#1A1A1A]/70 dark:text-[#94A3B8] uppercase tracking-wider">
              Quick Setup Presets
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => applyQuickPreset('single-wall')}
                className="px-3.5 py-1.5 rounded-xl border border-[#E8E2D5] dark:border-white/10 bg-[#FAF8F5] dark:bg-[#0E131F] text-xs font-bold text-[#1A1A1A]/80 dark:text-[#CBD5E1] hover:bg-white dark:hover:bg-[#162032] hover:border-[#243B7A] dark:hover:border-[#60A5FA] transition-all cursor-pointer"
              >
                1 Single Accent Wall
              </button>
              <button
                onClick={() => applyQuickPreset('1-room')}
                className="px-3.5 py-1.5 rounded-xl border border-[#E8E2D5] dark:border-white/10 bg-[#FAF8F5] dark:bg-[#0E131F] text-xs font-bold text-[#1A1A1A]/80 dark:text-[#CBD5E1] hover:bg-white dark:hover:bg-[#162032] hover:border-[#243B7A] dark:hover:border-[#60A5FA] transition-all cursor-pointer"
              >
                Standard 4-Wall Bedroom
              </button>
              <button
                onClick={() => applyQuickPreset('hall')}
                className="px-3.5 py-1.5 rounded-xl border border-[#E8E2D5] dark:border-white/10 bg-[#FAF8F5] dark:bg-[#0E131F] text-xs font-bold text-[#1A1A1A]/80 dark:text-[#CBD5E1] hover:bg-white dark:hover:bg-[#162032] hover:border-[#243B7A] dark:hover:border-[#60A5FA] transition-all cursor-pointer"
              >
                Large Living Hall + Ceiling
              </button>
            </div>
          </div>

          {/* Step 2: Wall-by-Wall Measurements */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1A1A1A] dark:text-[#F1F4F9] uppercase tracking-wider">
                2. Wall Measurements (Width × Height)
              </label>
              <button
                onClick={handleAddWall}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#243B7A] dark:text-[#60A5FA] hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Wall</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {walls.map((wall, index) => {
                const wallArea = (Number(wall.width) || 0) * (Number(wall.height) || 0);
                return (
                  <div 
                    key={wall.id}
                    className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#0E131F] border border-[#E8E2D5] dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-[130px]">
                      <span className="w-5 h-5 rounded-full bg-white dark:bg-[#162032] border border-[#E8E2D5] dark:border-white/10 flex items-center justify-center font-bold text-[10px] text-[#243B7A] dark:text-[#60A5FA]">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={wall.name}
                        onChange={(e) => handleUpdateWall(wall.id, 'name', e.target.value)}
                        className="bg-transparent font-bold text-[#1A1A1A] dark:text-[#F1F4F9] focus:outline-none w-28 text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-[#1A1A1A]/60 dark:text-[#94A3B8]">W:</span>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={wall.width}
                          onChange={(e) => handleUpdateWall(wall.id, 'width', e.target.value)}
                          className="w-14 p-1.5 rounded-lg border border-[#E8E2D5] dark:border-white/10 bg-white dark:bg-[#162032] text-center font-bold text-xs text-[#1A1A1A] dark:text-[#F1F4F9]"
                        />
                        <span className="text-[10px] text-[#1A1A1A]/60 dark:text-[#94A3B8]">ft</span>
                      </div>

                      <span className="text-[#1A1A1A]/40 dark:text-white/30 font-bold">×</span>

                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-[#1A1A1A]/60 dark:text-[#94A3B8]">H:</span>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={wall.height}
                          onChange={(e) => handleUpdateWall(wall.id, 'height', e.target.value)}
                          className="w-14 p-1.5 rounded-lg border border-[#E8E2D5] dark:border-white/10 bg-white dark:bg-[#162032] text-center font-bold text-xs text-[#1A1A1A] dark:text-[#F1F4F9]"
                        />
                        <span className="text-[10px] text-[#1A1A1A]/60 dark:text-[#94A3B8]">ft</span>
                      </div>

                      <div className="text-right min-w-[65px] font-bold text-[#243B7A] dark:text-[#60A5FA]">
                        {wallArea} sq.ft
                      </div>

                      {walls.length > 1 && (
                        <button
                          onClick={() => handleRemoveWall(wall.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ceiling Checkbox & Dimensions */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#0E131F] border border-[#E8E2D5] dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 text-xs font-bold text-[#1A1A1A] dark:text-[#F1F4F9] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCeiling}
                  onChange={(e) => setIncludeCeiling(e.target.checked)}
                  className="w-4 h-4 rounded text-[#243B7A] focus:ring-[#243B7A] cursor-pointer"
                />
                <span>Include Ceiling Paint (Ceiling Width × Length)</span>
              </label>
              {includeCeiling && (
                <span className="text-xs font-bold text-[#243B7A] dark:text-[#60A5FA]">
                  +{ceilingArea} sq.ft
                </span>
              )}
            </div>

            {includeCeiling && (
              <div className="flex items-center gap-4 pt-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#1A1A1A]/70 dark:text-[#94A3B8]">Ceiling Width:</span>
                  <input
                    type="number"
                    min="1"
                    value={ceilingWidth}
                    onChange={(e) => setCeilingWidth(Math.max(1, Number(e.target.value) || 0))}
                    className="w-16 p-1.5 rounded-lg border border-[#E8E2D5] dark:border-white/10 bg-white dark:bg-[#162032] text-center font-bold text-[#1A1A1A] dark:text-[#F1F4F9]"
                  />
                  <span className="text-[10px] text-[#1A1A1A]/60 dark:text-[#94A3B8]">ft</span>
                </div>

                <span className="text-[#1A1A1A]/40 dark:text-white/30 font-bold">×</span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[#1A1A1A]/70 dark:text-[#94A3B8]">Ceiling Length:</span>
                  <input
                    type="number"
                    min="1"
                    value={ceilingLength}
                    onChange={(e) => setCeilingLength(Math.max(1, Number(e.target.value) || 0))}
                    className="w-16 p-1.5 rounded-lg border border-[#E8E2D5] dark:border-white/10 bg-white dark:bg-[#162032] text-center font-bold text-[#1A1A1A] dark:text-[#F1F4F9]"
                  />
                  <span className="text-[10px] text-[#1A1A1A]/60 dark:text-[#94A3B8]">ft</span>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Deductions (Doors & Windows) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1A1A1A] dark:text-[#F1F4F9] uppercase tracking-wider">
                3. Openings &amp; Deductions
              </label>
              <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                -{deductionArea} sq.ft deducted
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#0E131F] border border-[#E8E2D5] dark:border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1A1A1A] dark:text-[#F1F4F9]">Doors (21 sq.ft)</div>
                  <div className="text-[10px] text-[#1A1A1A]/60 dark:text-[#94A3B8]">Standard 7ft × 3ft</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setNumDoors(Math.max(0, numDoors - 1))}
                    className="w-7 h-7 rounded-lg bg-white dark:bg-[#162032] border border-[#E8E2D5] dark:border-white/10 font-bold text-xs text-[#1A1A1A] dark:text-[#F1F4F9] cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-bold text-xs w-4 text-center text-[#1A1A1A] dark:text-[#F1F4F9]">{numDoors}</span>
                  <button
                    onClick={() => setNumDoors(numDoors + 1)}
                    className="w-7 h-7 rounded-lg bg-white dark:bg-[#162032] border border-[#E8E2D5] dark:border-white/10 font-bold text-xs text-[#1A1A1A] dark:text-[#F1F4F9] cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#0E131F] border border-[#E8E2D5] dark:border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1A1A1A] dark:text-[#F1F4F9]">Windows (15 sq.ft)</div>
                  <div className="text-[10px] text-[#1A1A1A]/60 dark:text-[#94A3B8]">Standard 5ft × 3ft</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setNumWindows(Math.max(0, numWindows - 1))}
                    className="w-7 h-7 rounded-lg bg-white dark:bg-[#162032] border border-[#E8E2D5] dark:border-white/10 font-bold text-xs text-[#1A1A1A] dark:text-[#F1F4F9] cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-bold text-xs w-4 text-center text-[#1A1A1A] dark:text-[#F1F4F9]">{numWindows}</span>
                  <button
                    onClick={() => setNumWindows(numWindows + 1)}
                    className="w-7 h-7 rounded-lg bg-white dark:bg-[#162032] border border-[#E8E2D5] dark:border-white/10 font-bold text-xs text-[#1A1A1A] dark:text-[#F1F4F9] cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Number of Coats */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1A1A1A] dark:text-[#F1F4F9] uppercase tracking-wider">
              4. Number of Coats
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { count: 1, label: '1 Coat', desc: 'Same shade refresh' },
                { count: 2, label: '2 Coats', desc: 'Standard recommended' },
                { count: 3, label: '3 Coats', desc: 'Dark to light transformation' },
              ].map((item) => (
                <button
                  key={item.count}
                  onClick={() => setNumCoats(item.count)}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    numCoats === item.count
                      ? 'border-[#243B7A] dark:border-[#3B82F6] bg-[#243B7A] dark:bg-[#3B82F6] text-white shadow-xs'
                      : 'border-[#E8E2D5] dark:border-white/10 bg-[#FAF8F5] dark:bg-[#0E131F] text-[#1A1A1A]/80 dark:text-[#CBD5E1] hover:bg-white dark:hover:bg-[#162032]'
                  }`}
                >
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className={`text-[10px] ${numCoats === item.count ? 'text-white/80' : 'text-[#1A1A1A]/60 dark:text-[#94A3B8]'}`}>
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Output Summary & Can Pack Optimizer (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF8F5]/90 dark:bg-[#131B2E]/90 backdrop-blur-xl rounded-3xl border border-[#E8E2D5] dark:border-white/10 p-6 sm:p-8 space-y-6 shadow-xl sticky top-24">
            
            {/* Summary Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D5] dark:border-white/10">
              <div>
                <span className="text-xs font-bold text-[#243B7A] dark:text-[#60A5FA] uppercase tracking-wider">
                  Paint Calculation Result
                </span>
                <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-[#F1F4F9]">
                  {activeProduct.name}
                </h3>
              </div>
              <button
                onClick={handleCopyEstimate}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white dark:bg-[#162032] border border-[#E8E2D5] dark:border-white/10 text-xs font-bold text-[#1A1A1A]/75 dark:text-[#CBD5E1] hover:text-[#243B7A] dark:hover:text-[#60A5FA] transition-colors cursor-pointer"
              >
                {copiedEstimate ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Summary</span>
                  </>
                )}
              </button>
            </div>

            {/* Litres Hero Display */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0E131F] border border-[#E8E2D5] dark:border-white/10 shadow-xs text-center space-y-1">
              <div className="text-xs font-semibold text-[#1A1A1A]/60 dark:text-[#94A3B8] uppercase">Total Paint Required</div>
              <div className="text-4xl font-black text-[#243B7A] dark:text-[#60A5FA] tracking-tight">
                {totalLitersRequired} <span className="text-xl font-bold text-[#1A1A1A]/70 dark:text-[#94A3B8]">Litres</span>
              </div>
              <div className="text-xs text-[#1A1A1A]/70 dark:text-[#94A3B8]">
                Covers <strong className="text-[#1A1A1A] dark:text-[#F1F4F9]">{netAreaSqFt} sq.ft</strong> with {numCoats} coats
              </div>
            </div>

            {/* Can Pack Optimizer */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#1A1A1A]/70 dark:text-[#94A3B8] uppercase tracking-wider flex items-center justify-between">
                <span>Recommended Can Pack Combo</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Zero Wastage</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className={`p-2.5 rounded-xl border ${packs.packs20L > 0 ? 'bg-white dark:bg-[#162032] border-[#243B7A] dark:border-[#3B82F6] shadow-xs' : 'bg-white/50 dark:bg-[#162032]/40 border-[#E8E2D5] dark:border-white/5 opacity-50'}`}>
                  <div className="text-[10px] text-[#1A1A1A]/60 dark:text-[#94A3B8]">20L Drum</div>
                  <div className="text-base font-black text-[#1A1A1A] dark:text-[#F1F4F9]">{packs.packs20L}</div>
                </div>
                <div className={`p-2.5 rounded-xl border ${packs.packs10L > 0 ? 'bg-white dark:bg-[#162032] border-[#243B7A] dark:border-[#3B82F6] shadow-xs' : 'bg-white/50 dark:bg-[#162032]/40 border-[#E8E2D5] dark:border-white/5 opacity-50'}`}>
                  <div className="text-[10px] text-[#1A1A1A]/60 dark:text-[#94A3B8]">10L Bucket</div>
                  <div className="text-base font-black text-[#1A1A1A] dark:text-[#F1F4F9]">{packs.packs10L}</div>
                </div>
                <div className={`p-2.5 rounded-xl border ${packs.packs4L > 0 ? 'bg-white dark:bg-[#162032] border-[#243B7A] dark:border-[#3B82F6] shadow-xs' : 'bg-white/50 dark:bg-[#162032]/40 border-[#E8E2D5] dark:border-white/5 opacity-50'}`}>
                  <div className="text-[10px] text-[#1A1A1A]/60 dark:text-[#94A3B8]">4L Can</div>
                  <div className="text-base font-black text-[#1A1A1A] dark:text-[#F1F4F9]">{packs.packs4L}</div>
                </div>
                <div className={`p-2.5 rounded-xl border ${packs.packs1L > 0 ? 'bg-white dark:bg-[#162032] border-[#243B7A] dark:border-[#3B82F6] shadow-xs' : 'bg-white/50 dark:bg-[#162032]/40 border-[#E8E2D5] dark:border-white/5 opacity-50'}`}>
                  <div className="text-[10px] text-[#1A1A1A]/60 dark:text-[#94A3B8]">1L Tin</div>
                  <div className="text-base font-black text-[#1A1A1A] dark:text-[#F1F4F9]">{packs.packs1L}</div>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0E131F] border border-[#E8E2D5] dark:border-white/10 space-y-2.5 text-xs">
              <div className="flex justify-between text-[#1A1A1A]/70 dark:text-[#94A3B8]">
                <span>Paint Material ({totalLitersRequired}L @ ₹{pricePerLiter}/L)</span>
                <span className="font-semibold text-[#1A1A1A] dark:text-[#F1F4F9]">₹{estimatedPaintCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#1A1A1A]/70 dark:text-[#94A3B8]">
                <span>DampGuard Undercoat Primer (Optional)</span>
                <span className="font-semibold text-[#1A1A1A] dark:text-[#F1F4F9]">₹{estimatedPrimerCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#1A1A1A]/70 dark:text-[#94A3B8]">
                <span>Basic Tools (Rollers, Tray, Tape)</span>
                <span className="font-semibold text-[#1A1A1A] dark:text-[#F1F4F9]">₹{estimatedSuppliesCost}</span>
              </div>
              <div className="pt-2 border-t border-[#E8E2D5] dark:border-white/10 flex justify-between items-center text-sm font-bold">
                <span className="text-[#1A1A1A] dark:text-[#F1F4F9]">Total Estimated Material:</span>
                <span className="text-lg text-[#243B7A] dark:text-[#60A5FA]">₹{totalEstimatedCost.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checklist Quality Assurance */}
            <div className="space-y-1.5 text-[11px] text-[#1A1A1A]/75 dark:text-[#94A3B8]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Includes 10% safety buffer for roller absorption</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Compatible with Asian Paints standard mixing ratios</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
