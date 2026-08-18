import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Layers, 
  Sun, 
  Droplets, 
  Home, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Calculator, 
  Camera, 
  RefreshCw,
  SlidersHorizontal,
  MoveHorizontal,
  Clock,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PaintProduct } from '../types';
import { PAINT_PRODUCTS } from '../data/defaultContent';

interface VisionToolProps {
  onSelectProductForCalculator?: (product: PaintProduct) => void;
  onOpenAR?: (product: PaintProduct) => void;
  onNavClick?: (href: string) => void;
}

export const VisionStorytellingSection: React.FC<VisionToolProps> = ({
  onSelectProductForCalculator,
  onOpenAR,
  onNavClick,
}) => {
  // Active Tab Mode: 'before-after', 'wall-look', 'color-finder', 'options-map'
  const [activeTab, setActiveTab] = useState<'before-after' | 'wall-look' | 'color-finder' | 'options-map'>('before-after');

  // 1. Before / After Split Slider State
  const [sliderPosition, setSliderPosition] = useState<number>(52);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 2. Wall Look & Lighting Interactive Simulator State
  const [wallColor, setWallColor] = useState<{ name: string; hex: string; finish: string; lrv: number; price: number; tag: string }>({
    name: 'Jaipur Terracotta',
    hex: '#D96C4A',
    finish: 'Eggshell',
    lrv: 38,
    price: 640,
    tag: 'Living Accent Wall',
  });

  const [lightingMode, setLightingMode] = useState<'morning' | 'noon' | 'evening' | 'night'>('noon');
  const [wallFinishSheen, setWallFinishSheen] = useState<'Matte' | 'Eggshell' | 'Semi-Gloss' | 'Venetian Plaster'>('Eggshell');

  // 3. Color & Paint Match Finder Wizard State
  const [selectedRoomType, setSelectedRoomType] = useState<string>('living');
  const [selectedLightCondition, setSelectedLightCondition] = useState<string>('bright');
  const [selectedDurabilityReq, setSelectedDurabilityReq] = useState<string>('high-scrub');

  // Color Swatch Presets for the Wall Simulator
  const wallSwatches = [
    { name: 'Jaipur Terracotta', hex: '#D96C4A', finish: 'Eggshell', lrv: 38, price: 640, tag: 'Heritage Accent' },
    { name: 'Ashberry Slate Blue', hex: '#385E7B', finish: 'Soft Glow', lrv: 22, price: 580, tag: 'Calm Sanctuary' },
    { name: 'Warm Ivory Linen', hex: '#F5EFE6', finish: 'Eggshell', lrv: 82, price: 640, tag: 'Top Living Neutral' },
    { name: 'Enlighten Pure White', hex: '#EBE8DF', finish: 'Matte', lrv: 86, price: 490, tag: 'High-Reflectance' },
    { name: 'Chettinad Raw Umber', hex: '#8B5A2B', finish: 'Eggshell', lrv: 24, price: 580, tag: 'Heritage Warm' },
    { name: 'Himalayan Moss Green', hex: '#3F8F6B', finish: 'Matte', lrv: 41, price: 580, tag: 'Organic Earth' },
  ];

  // Matched Product based on Quiz
  const getMatchedProduct = (): PaintProduct => {
    if (selectedRoomType === 'exterior') {
      return PAINT_PRODUCTS.find((p) => p.category === 'exterior') || PAINT_PRODUCTS[1];
    }
    if (selectedDurabilityReq === 'high-scrub') {
      return PAINT_PRODUCTS.find((p) => p.id === 'prod-1') || PAINT_PRODUCTS[0];
    }
    if (selectedDurabilityReq === 'zero-voc') {
      return PAINT_PRODUCTS.find((p) => p.id === 'prod-3') || PAINT_PRODUCTS[2];
    }
    if (selectedRoomType === 'kitchen-bath' || selectedDurabilityReq === 'wood-metal') {
      return PAINT_PRODUCTS.find((p) => p.category === 'enamel') || PAINT_PRODUCTS[3];
    }
    return PAINT_PRODUCTS[0];
  };

  const matchedProduct = getMatchedProduct();

  // Slider Drag Handlers
  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.min(Math.max((x / rect.width) * 100, 5), 95);
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleSliderMove(e.clientX);
    }
  };

  // Helper for lighting ambiance style
  const getLightingOverlayStyle = () => {
    switch (lightingMode) {
      case 'morning':
        return {
          filter: 'brightness(1.08) saturate(1.05) hue-rotate(-5deg)',
          label: 'Crisp Morning Sunlight (6500K)',
          desc: 'Reveals true undertones and crisp contrast across wall moldings.',
          colorTemp: '6500K Cool Daylight',
        };
      case 'noon':
        return {
          filter: 'brightness(1.0) saturate(1.0)',
          label: 'Direct Balanced Daylight (5000K)',
          desc: 'True-to-can accurate reflectance and authentic surface texture.',
          colorTemp: '5000K Pure Sun',
        };
      case 'evening':
        return {
          filter: 'brightness(0.96) saturate(1.2) sepia(0.2)',
          label: 'Golden Hour Warm Sun (3000K)',
          desc: 'Enhances warm earthy pigments, ochres, and cosy neutrals.',
          colorTemp: '3000K Amber Sunset',
        };
      case 'night':
        return {
          filter: 'brightness(0.82) contrast(1.1) saturate(0.95)',
          label: 'Warm Ambient Interior Lamps (2700K)',
          desc: 'Creates atmospheric depth and softens intense daytime accents.',
          colorTemp: '2700K Cosy Tungsten',
        };
    }
  };

  const currentLighting = getLightingOverlayStyle();

  return (
    <section 
      id="vision-experience" 
      className="py-16 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-[#E8E2D5]"
    >
      {/* 1. Header: The Core Vision */}
      <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
        <motion.div 
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E2D5] text-xs font-semibold text-[#243B7A]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E68A00]" />
          <span>Interactive Vision &amp; Transition Suite</span>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading font-bold text-3xl sm:text-4xl tracking-tight text-[#1A1A1A]"
        >
          What You Experience &amp; How It Works
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base text-[#1A1A1A]/70 font-normal"
        >
          Interact with real-time before/after wall transformations, dynamic daylight shifts, pigment blooming, and instant smart paint matching.
        </motion.p>
      </div>

      {/* 2. Interactive Navigation Options Bar with Motion Pill */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {[
          { id: 'before-after', label: '1. Before & After Wall Slider', icon: MoveHorizontal },
          { id: 'wall-look', label: '2. Daylight & Pigment Bloom', icon: Sun },
          { id: 'color-finder', label: '3. Smart Paint Matcher', icon: Sparkles },
          { id: 'options-map', label: '4. Decision Toolkit Map', icon: SlidersHorizontal },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'text-white shadow-md'
                  : 'bg-white text-[#1A1A1A]/70 hover:text-[#1A1A1A] border border-[#E8E2D5] hover:bg-[#F8F4EC]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeVisionTabBadge"
                  className="absolute inset-0 bg-[#243B7A] rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E68A00]' : 'text-[#243B7A]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* CONTENT TABS WITH ANIMATE PRESENCE */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: INTERACTIVE BEFORE & AFTER SLIDER */}
        {activeTab === 'before-after' && (
          <motion.div
            key="before-after"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D5] shadow-xs"
          >
            {/* Left Column: The Interactive Split Slider Stage (8 cols) */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#E68A00] uppercase tracking-wider block">
                    Interactive Transformation Stage
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A]">
                    Drag to Reveal: Raw Plaster vs. Finished Silk Sheen
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#243B7A] font-bold bg-[#F8F4EC] px-3 py-1 rounded-full border border-[#E8E2D5]">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Interactive Split Slider</span>
                </div>
              </div>

              {/* Slider Interactive Container */}
              <div
                ref={containerRef}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onMouseMove={handleMouseMove}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                onTouchMove={handleTouchMove}
                className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-black/10 shadow-inner group"
              >
                {/* AFTER LAYER: Beautiful Painted Living Room (Full Width Behind) */}
                <div 
                  className="absolute inset-0 transition-colors duration-500 flex flex-col justify-between p-6"
                  style={{
                    backgroundColor: wallColor.hex,
                    filter: currentLighting.filter,
                  }}
                >
                  {/* Subtle Wall Texture / Architectural Depth */}
                  <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/35 via-black/15 to-transparent pointer-events-none" />
                  
                  {/* Ambient Specular Sheen */}
                  <div className="absolute inset-0 bg-radial from-white/20 via-transparent to-black/15 pointer-events-none" />

                  {/* "After" Badge Tag */}
                  <div className="relative z-10 flex justify-end">
                    <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-md flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#3F8F6B]" />
                      <span>AFTER: {wallColor.name} ({wallFinishSheen})</span>
                    </span>
                  </div>

                  {/* After Specification Badge */}
                  <div className="relative z-10 self-end max-w-xs bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-white text-right">
                    <p className="text-xs font-bold">2 Topcoats + Alkali Primer</p>
                    <p className="text-[11px] text-white/80 mt-0.5">Smooth, wipe-clean scrub resistance with light reflectance of {wallColor.lrv}%</p>
                  </div>
                </div>

                {/* BEFORE LAYER: Raw Drab / Dusty Wall Plaster (Clipped by slider percentage) */}
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white pointer-events-none shadow-2xl"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <div 
                    className="absolute inset-y-0 left-0 w-full h-full bg-[#A89F91] flex flex-col justify-between p-6 select-none"
                    style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
                  >
                    {/* Raw Texture Overlay */}
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#4a433b_1px,transparent_1px)] [background-size:12px_12px]" />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40" />

                    {/* "Before" Badge Tag */}
                    <div className="relative z-10 flex justify-start">
                      <span className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-md">
                        BEFORE: Raw Dusty Masonry
                      </span>
                    </div>

                    {/* Before Note */}
                    <div className="relative z-10 max-w-xs bg-black/70 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-white">
                      <p className="text-xs font-bold text-[#E68A00]">Unsealed Surface</p>
                      <p className="text-[11px] text-white/80 mt-0.5">Absorbs moisture, prone to chalking &amp; efflorescence stains.</p>
                    </div>
                  </div>
                </div>

                {/* THE FLOATING DRAGGABLE DIVIDER HANDLE */}
                <div
                  className="absolute inset-y-0 -ml-5 w-10 flex items-center justify-center pointer-events-none z-30"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <motion.div
                    animate={{ scale: isDragging ? 1.15 : 1 }}
                    className="w-10 h-10 rounded-full bg-white text-[#243B7A] shadow-2xl border-2 border-[#243B7A] flex items-center justify-center cursor-ew-resize"
                  >
                    <MoveHorizontal className="w-5 h-5 text-[#243B7A]" />
                  </motion.div>
                </div>
              </div>

              {/* Slider Instruction Note */}
              <div className="flex items-center justify-between text-xs text-[#1A1A1A]/70 pt-1">
                <span>&larr; Drag slider left &amp; right to compare before &amp; after</span>
                <span className="font-mono text-[#243B7A] font-bold">Split at {Math.round(sliderPosition)}%</span>
              </div>
            </div>

            {/* Right Column: Dynamic Shade Swatches & Finish Controls (4 cols) */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#1A1A1A] block">
                  Select Shade to Preview in Transformation:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                  {wallSwatches.map((swatch) => {
                    const isSelected = wallColor.name === swatch.name;
                    return (
                      <button
                        key={swatch.name}
                        onClick={() => setWallColor(swatch)}
                        className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 relative overflow-hidden ${
                          isSelected
                            ? 'border-[#243B7A] bg-[#243B7A]/10 shadow-xs'
                            : 'border-[#E8E2D5] bg-[#F8F4EC]/60 hover:bg-[#F8F4EC]'
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="swatchSelectedBorder"
                            className="absolute inset-0 border-2 border-[#243B7A] rounded-2xl pointer-events-none"
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                          />
                        )}
                        <div 
                          className="w-8 h-8 rounded-xl border border-black/10 shrink-0 shadow-xs"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <div className="truncate">
                          <p className={`text-xs font-bold truncate ${isSelected ? 'text-[#243B7A]' : 'text-[#1A1A1A]'}`}>
                            {swatch.name}
                          </p>
                          <p className="text-[10px] text-[#1A1A1A]/60">
                            ₹{swatch.price}/L &bull; Popular Choice
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E8E2D5] space-y-2">
                <a
                  href="#product-guides"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavClick) onNavClick('#product-guides');
                  }}
                  className="w-full py-2.5 px-4 rounded-full bg-[#E68A00] hover:bg-[#c27400] text-white text-xs font-bold transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Calculate Paint for this Room</span>
                </a>

                <button
                  onClick={() => setActiveTab('wall-look')}
                  className="w-full py-2 px-4 rounded-full bg-white hover:bg-[#F8F4EC] text-[#243B7A] border border-[#243B7A]/30 text-xs font-bold transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Test Daylight Modes &rarr;</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: WALL SIMULATOR (PIGMENT BLOOM & CIRCADIAN DAYLIGHT MORPH) */}
        {activeTab === 'wall-look' && (
          <motion.div
            key="wall-look"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D5] shadow-xs"
          >
            {/* Left Column: Interactive Wall Visualizer (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#E68A00] uppercase tracking-wider block">
                    Pigment &amp; Daylight Lab
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A]">
                    {wallColor.name} &bull; {wallFinishSheen} Sheen
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F8F4EC] text-[#243B7A] border border-[#E8E2D5]">
                  {wallFinishSheen}
                </span>
              </div>

              {/* The Dynamic Wall Canvas with Animated Pigment Bloom */}
              <motion.div 
                key={wallColor.name + lightingMode + wallFinishSheen}
                initial={{ opacity: 0.85, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-black/10 shadow-inner flex flex-col justify-between p-6 select-none"
                style={{
                  backgroundColor: wallColor.hex,
                  filter: currentLighting.filter,
                }}
              >
                {/* Room Perspective Overlay */}
                <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/30 via-black/10 to-transparent pointer-events-none" />
                
                {/* Sheen Specular Highlight Reflection */}
                {wallFinishSheen === 'Eggshell' && (
                  <div className="absolute inset-0 bg-radial from-white/15 via-transparent to-black/10 pointer-events-none" />
                )}
                {wallFinishSheen === 'Semi-Gloss' && (
                  <div className="absolute inset-0 bg-radial from-white/30 via-white/5 to-black/20 pointer-events-none" />
                )}
                {wallFinishSheen === 'Venetian Plaster' && (
                  <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                )}

                {/* Top Room Tag */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                    {wallColor.tag}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/85 backdrop-blur-md text-[#1A1A1A] text-[11px] font-bold shadow-xs flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#E68A00]" />
                    <span>{currentLighting.colorTemp}</span>
                  </span>
                </div>

                {/* Bottom Callout */}
                <div className="relative z-10 bg-black/50 backdrop-blur-md p-3.5 rounded-xl border border-white/20 text-white max-w-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-3.5 h-3.5 rounded-full border border-white shrink-0" 
                      style={{ backgroundColor: wallColor.hex }}
                    />
                    <p className="text-xs font-bold truncate">{wallColor.name}</p>
                  </div>
                  <p className="text-[11px] text-white/80 leading-snug">
                    {currentLighting.desc}
                  </p>
                </div>
              </motion.div>

              {/* Lighting Mode Selector Buttons */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-[#1A1A1A] flex items-center justify-between">
                  <span>Shift Daylight &amp; Time of Day:</span>
                  <span className="text-[11px] text-[#243B7A] font-semibold">Simulates 24-hour sun movement</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'morning', label: 'Morning Sun', sub: '6500K Cool' },
                    { id: 'noon', label: 'Direct Noon', sub: '5000K Neutral' },
                    { id: 'evening', label: 'Golden Hour', sub: '3000K Warm' },
                    { id: 'night', label: 'Night Lamps', sub: '2700K Cosy' },
                  ].map((lt) => {
                    const isLtActive = lightingMode === lt.id;
                    return (
                      <button
                        key={lt.id}
                        onClick={() => setLightingMode(lt.id as any)}
                        className={`relative p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isLtActive
                            ? 'border-[#243B7A] text-[#243B7A] font-bold bg-[#243B7A]/10 shadow-xs'
                            : 'border-[#E8E2D5] bg-[#F8F4EC]/60 hover:bg-[#F8F4EC] text-[#1A1A1A]/70'
                        }`}
                      >
                        <p className="text-xs">{lt.label}</p>
                        <p className="text-[10px] text-[#1A1A1A]/50 font-normal">{lt.sub}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Color & Sheen Controls (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              
              {/* Color Swatch Palette Picker */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[#1A1A1A] block">
                  Choose Wall Shade from Palette:
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {wallSwatches.map((swatch) => {
                    const isSelected = wallColor.name === swatch.name;
                    return (
                      <button
                        key={swatch.name}
                        onClick={() => setWallColor(swatch)}
                        className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 relative ${
                          isSelected
                            ? 'border-[#243B7A] bg-[#243B7A]/10 shadow-xs'
                            : 'border-[#E8E2D5] bg-[#F8F4EC]/60 hover:bg-[#F8F4EC]'
                        }`}
                      >
                        <div 
                          className="w-6 h-6 rounded-lg border border-black/10 shrink-0 shadow-2xs"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <div className="truncate">
                          <p className={`text-xs font-bold truncate ${isSelected ? 'text-[#243B7A]' : 'text-[#1A1A1A]'}`}>
                            {swatch.name}
                          </p>
                          <p className="text-[10px] text-[#1A1A1A]/60">
                            ₹{swatch.price}/L &bull; Popular Choice
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Finish & Sheen Picker */}
              <div className="space-y-2 pt-3 border-t border-[#E8E2D5]/80">
                <label className="text-xs font-bold text-[#1A1A1A] block">
                  Select Sheen &amp; Texture Finish:
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Matte', desc: 'Dead flat, zero glare, hides wall flaws' },
                    { name: 'Eggshell', desc: 'Soft silky sheen, easy wipe-clean' },
                    { name: 'Semi-Gloss', desc: 'Crisp highlight for trims & doors' },
                    { name: 'Venetian Plaster', desc: 'Artisanal polished marble texture' },
                  ].map((fn) => (
                    <button
                      key={fn.name}
                      onClick={() => setWallFinishSheen(fn.name as any)}
                      className={`p-2.5 rounded-2xl border text-left transition-colors cursor-pointer ${
                        wallFinishSheen === fn.name
                          ? 'border-[#3F8F6B] bg-[#3F8F6B]/10 font-bold text-[#1A1A1A]'
                          : 'border-[#E8E2D5] bg-[#F8F4EC]/60 hover:bg-[#F8F4EC] text-[#1A1A1A]/80'
                      }`}
                    >
                      <p className="text-xs font-bold text-[#1A1A1A]">{fn.name}</p>
                      <p className="text-[10px] text-[#1A1A1A]/60 leading-tight">{fn.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#E8E2D5] space-y-2">
                <div className="flex gap-2">
                  <a
                    href="#product-guides"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavClick) onNavClick('#product-guides');
                    }}
                    className="flex-1 py-2.5 px-4 rounded-full bg-[#E68A00] hover:bg-[#c27400] text-white text-xs font-bold transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Estimate Liters &amp; Cans</span>
                  </a>

                  <a
                    href="#explore-products"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavClick) onNavClick('#explore-products');
                    }}
                    className="py-2.5 px-4 rounded-full bg-[#243B7A] hover:bg-[#1C2E60] text-white text-xs font-bold transition-colors text-center cursor-pointer"
                  >
                    Explore Catalog
                  </a>
                </div>
              </div>

            </div>

          </motion.div>
        )}

        {/* TAB 3: SMART PAINT & COLOR FINDER WIZARD */}
        {activeTab === 'color-finder' && (
          <motion.div
            key="color-finder"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D5] shadow-xs"
          >
            <div className="max-w-3xl mx-auto space-y-6">
              
              <div className="text-center space-y-1">
                <span className="text-[11px] font-bold text-[#243B7A] uppercase tracking-wider">
                  3-Step Paint Matcher
                </span>
                <h3 className="font-heading font-bold text-2xl text-[#1A1A1A]">
                  Find the Exact Formulation for Your Room
                </h3>
                <p className="text-xs text-[#1A1A1A]/70">
                  Answer 3 quick questions about your room layout and daily wear to get the ideal paint product and surface advice.
                </p>
              </div>

              {/* Step 1: Room Space */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1A1A1A] block">
                  Step 1: Which space are you painting?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'living', label: 'Living & Dining Room', icon: Home },
                    { id: 'bedroom', label: 'Master / Kid Bedroom', icon: Sparkles },
                    { id: 'kitchen-bath', label: 'Doors, Trim & Cabinets', icon: Layers },
                    { id: 'exterior', label: 'Exterior Walls & Balcony', icon: Sun },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedRoomType(item.id)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        selectedRoomType === item.id
                          ? 'border-[#243B7A] bg-[#243B7A]/10 font-bold text-[#243B7A]'
                          : 'border-[#E8E2D5] bg-[#F8F4EC]/60 hover:bg-[#F8F4EC] text-[#1A1A1A]/70'
                      }`}
                    >
                      <p className="text-xs font-bold text-[#1A1A1A]">{item.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Natural Daylight */}
              <div className="space-y-2 pt-2 border-t border-[#E8E2D5]/80">
                <label className="text-xs font-bold text-[#1A1A1A] block">
                  Step 2: How much natural sunlight does this room receive?
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'bright', label: 'Direct Bright Sunlight', sub: 'Prefers Eggshell / Velvet Matte finish' },
                    { id: 'moderate', label: 'Moderate Window Light', sub: 'Balanced natural warmth & soft glow' },
                    { id: 'low-light', label: 'Low / North-Facing Light', sub: 'Airy warm off-whites & pastels' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedLightCondition(item.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedLightCondition === item.id
                          ? 'border-[#E68A00] bg-[#E68A00]/10 text-[#1A1A1A]'
                          : 'border-[#E8E2D5] bg-[#F8F4EC]/60 hover:bg-[#F8F4EC] text-[#1A1A1A]/70'
                      }`}
                    >
                      <p className="text-xs font-bold">{item.label}</p>
                      <p className="text-[10px] text-[#1A1A1A]/60 mt-0.5">{item.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Priority Requirement */}
              <div className="space-y-2 pt-2 border-t border-[#E8E2D5]/80">
                <label className="text-xs font-bold text-[#1A1A1A] block">
                  Step 3: What is your primary practical requirement?
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'high-scrub', label: 'Washable & Scrub-Proof', sub: 'Resists toddler crayons & stains' },
                    { id: 'zero-voc', label: 'Zero VOC & Breathable', sub: 'Non-toxic, kid & pet friendly' },
                    { id: 'statement', label: 'Luxury Depth & Texture', sub: 'Marble sheen & accent depth' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedDurabilityReq(item.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedDurabilityReq === item.id
                          ? 'border-[#3F8F6B] bg-[#3F8F6B]/10 text-[#1A1A1A]'
                          : 'border-[#E8E2D5] bg-[#F8F4EC]/60 hover:bg-[#F8F4EC] text-[#1A1A1A]/70'
                      }`}
                    >
                      <p className="text-xs font-bold">{item.label}</p>
                      <p className="text-[10px] text-[#1A1A1A]/60 mt-0.5">{item.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommendation Result Card */}
              <motion.div 
                layout
                className="p-5 rounded-3xl bg-[#243B7A] text-white space-y-4 shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#E68A00] font-bold tracking-wider block">
                      Recommended Match for Your Space
                    </span>
                    <h4 className="text-xl font-bold text-white">
                      {matchedProduct.name}
                    </h4>
                    <p className="text-xs text-white/70 mt-0.5">
                      {matchedProduct.finish} Finish &bull; Coverage {matchedProduct.coverageSqFtPerLiter} sq.ft/L &bull; ₹{matchedProduct.estimatedPricePerLiter}/L
                    </p>
                  </div>

                  <div 
                    className="w-12 h-12 rounded-2xl border border-white/20 shadow-md shrink-0 flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: matchedProduct.hexCode }}
                  >
                    <span className="text-[10px] text-black/60 font-mono">{matchedProduct.lrv}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-white/10 p-2.5 rounded-xl">
                    <span className="font-bold block text-[#E68A00]">Washability:</span>
                    <span>{matchedProduct.washabilityScore}/10 Scrub Rating</span>
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl">
                    <span className="font-bold block text-[#3F8F6B]">Health Safety:</span>
                    <span>{matchedProduct.vocLevel}</span>
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl">
                    <span className="font-bold block text-white">Application:</span>
                    <span>2 Topcoats + 1 Primer</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <a
                    href="#explore-products"
                    className="text-xs font-bold text-white hover:underline flex items-center gap-1"
                  >
                    View Product Spec Sheet in Catalog &rarr;
                  </a>

                  {onSelectProductForCalculator && (
                    <button
                      onClick={() => onSelectProductForCalculator(matchedProduct)}
                      className="px-5 py-2.5 rounded-full bg-[#E68A00] hover:bg-[#c27400] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Calculate Liters for this Paint</span>
                    </button>
                  )}
                </div>
              </motion.div>

            </div>
          </motion.div>
        )}

        {/* TAB 4: COMPLETE TOOLKIT & DECISION MAP */}
        {activeTab === 'options-map' && (
          <motion.div
            key="options-map"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white p-6 rounded-3xl border border-[#E8E2D5] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-[#243B7A]/10 text-[#243B7A] flex items-center justify-center">
                  <MoveHorizontal className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#1A1A1A]">1. Before/After Split Slider</h4>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                  Interactive divider comparing unfinished raw drywall with smooth, finished coats.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('before-after')}
                className="text-xs font-bold text-[#243B7A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Launch Slider</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white p-6 rounded-3xl border border-[#E8E2D5] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-[#E68A00]/10 text-[#E68A00] flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#1A1A1A]">2. Paint &amp; Can Calculator</h4>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                  Calculate exact liters, water dilution ratios, putty in kg, and optimal 20L/10L/4L can packs.
                </p>
              </div>
              <a
                href="#product-guides"
                className="text-xs font-bold text-[#E68A00] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Go to Calculator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white p-6 rounded-3xl border border-[#E8E2D5] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-[#3F8F6B]/10 text-[#3F8F6B] flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#1A1A1A]">3. Single-Book Product Catalog</h4>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                  View all main criteria on the cards, with full surface preparation protocols and application guides.
                </p>
              </div>
              <a
                href="#explore-products"
                className="text-xs font-bold text-[#3F8F6B] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white p-6 rounded-3xl border border-[#E8E2D5] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#1A1A1A]">4. Architect &amp; MSDS Portal</h4>
                <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                  Specialized access for architects &amp; contractors: dry film thickness (DFT), solids by volume, and safety sheets.
                </p>
              </div>
              <a
                href="#explore-products"
                className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Arch Specs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

    </section>
  );
};
