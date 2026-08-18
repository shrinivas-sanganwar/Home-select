import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Pause, 
  Play, 
  Check, 
  Copy, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon, 
  Lamp, 
  Layers, 
  SlidersHorizontal,
  Droplets,
  Calculator
} from 'lucide-react';

export interface PureColorSwatch {
  id: string;
  name: string;
  code: string;
  hex: string;
  family: 'Blues' | 'Earth & Terracotta' | 'Greens' | 'Warm Neutrals' | 'Whites & Creams' | 'Royals';
  lrv: number;
  undertone: string;
  recommendedFinish: string;
  toneType: 'Cool' | 'Warm' | 'Balanced Neutral';
  shadeStrip: { code: string; name: string; hex: string; lrv: number }[];
  coordinatingTrim: { code: string; name: string; hex: string };
  contrastingAccent: { code: string; name: string; hex: string };
}

export const SWATCH_DATABASE: PureColorSwatch[] = [
  {
    id: 'sw-7366',
    name: 'Ashberry',
    code: '7366',
    hex: '#385E7B',
    family: 'Blues',
    lrv: 26,
    undertone: 'Deep Ocean Slate',
    recommendedFinish: 'Royale Luxury Matte',
    toneType: 'Cool',
    shadeStrip: [
      { code: '7372', name: 'White Lagoon', hex: '#D6E2E8', lrv: 74 },
      { code: '7370', name: 'Sea Ridge', hex: '#9BBCC8', lrv: 52 },
      { code: '7368', name: 'Thunder Bay', hex: '#6D8E9F', lrv: 39 },
      { code: '7367', name: 'Storm Blue', hex: '#52768B', lrv: 31 },
      { code: '7366', name: 'Ashberry', hex: '#385E7B', lrv: 26 },
    ],
    coordinatingTrim: { code: '4148', name: 'Enlighten White', hex: '#EBE8DF' },
    contrastingAccent: { code: '8461', name: 'Jaipur Clay', hex: '#D96C4A' },
  },
  {
    id: 'sw-8461',
    name: 'Jaipur Clay',
    code: '8461',
    hex: '#D96C4A',
    family: 'Earth & Terracotta',
    lrv: 38,
    undertone: 'Warm Saffron Terracotta',
    recommendedFinish: 'Velvet Eggshell',
    toneType: 'Warm',
    shadeStrip: [
      { code: '8465', name: 'Sunlit Apricot', hex: '#F6D9C8', lrv: 72 },
      { code: '8464', name: 'Desert Coral', hex: '#EDAF96', lrv: 55 },
      { code: '8463', name: 'Spiced Ochre', hex: '#E58E6E', lrv: 46 },
      { code: '8461', name: 'Jaipur Clay', hex: '#D96C4A', lrv: 38 },
      { code: '8460', name: 'Rustic Earth', hex: '#A84C30', lrv: 22 },
    ],
    coordinatingTrim: { code: '0420', name: 'Silk Ivory', hex: '#F8F4EC' },
    contrastingAccent: { code: '7366', name: 'Ashberry Blue', hex: '#385E7B' },
  },
  {
    id: 'sw-243B',
    name: 'Royal Cobalt',
    code: '9412',
    hex: '#243B7A',
    family: 'Royals',
    lrv: 14,
    undertone: 'Deep Imperial Indigo',
    recommendedFinish: 'Silk Sheen Enamel',
    toneType: 'Cool',
    shadeStrip: [
      { code: '9416', name: 'Mist Indigo', hex: '#BAC5E0', lrv: 62 },
      { code: '9415', name: 'Twilight Sky', hex: '#7D93C7', lrv: 44 },
      { code: '9414', name: 'Mewar Blue', hex: '#4B67A8', lrv: 27 },
      { code: '9412', name: 'Royal Cobalt', hex: '#243B7A', lrv: 14 },
      { code: '9410', name: 'Midnight Deep', hex: '#16234D', lrv: 8 },
    ],
    coordinatingTrim: { code: '0012', name: 'Pearl Silver', hex: '#EAE6DF' },
    contrastingAccent: { code: '7920', name: 'Marigold Gold', hex: '#E68A00' },
  },
  {
    id: 'sw-3F8F',
    name: 'Kerala Laurel',
    code: '7821',
    hex: '#3F8F6B',
    family: 'Greens',
    lrv: 32,
    undertone: 'Rainforest Foliage Sage',
    recommendedFinish: 'Breathable Matte',
    toneType: 'Cool',
    shadeStrip: [
      { code: '7825', name: 'Palm Sprout', hex: '#C2DECFA', lrv: 69 },
      { code: '7824', name: 'Monsoon Mist', hex: '#95C5AA', lrv: 54 },
      { code: '7823', name: 'Cardamom Green', hex: '#63AA85', lrv: 41 },
      { code: '7821', name: 'Kerala Laurel', hex: '#3F8F6B', lrv: 32 },
      { code: '7820', name: 'Deep Teak Forest', hex: '#255841', lrv: 18 },
    ],
    coordinatingTrim: { code: '0101', name: 'Coir & Cream', hex: '#F5EFE6' },
    contrastingAccent: { code: '8461', name: 'Jaipur Clay', hex: '#D96C4A' },
  },
  {
    id: 'sw-E68A',
    name: 'Amber Sandstone',
    code: '7920',
    hex: '#E68A00',
    family: 'Earth & Terracotta',
    lrv: 46,
    undertone: 'Golden Ochre Sand',
    recommendedFinish: 'Velvet Low-Sheen',
    toneType: 'Warm',
    shadeStrip: [
      { code: '7924', name: 'Morning Glow', hex: '#FBE2B5', lrv: 77 },
      { code: '7923', name: 'Desert Dune', hex: '#F5C677', lrv: 63 },
      { code: '7922', name: 'Ochre Radiance', hex: '#EDA836', lrv: 52 },
      { code: '7920', name: 'Amber Sandstone', hex: '#E68A00', lrv: 46 },
      { code: '7919', name: 'Burnt Copper', hex: '#AC6300', lrv: 29 },
    ],
    coordinatingTrim: { code: '0005', name: 'Raw Linen White', hex: '#F9F6F0' },
    contrastingAccent: { code: '9412', name: 'Royal Cobalt', hex: '#243B7A' },
  },
  {
    id: 'sw-F5EF',
    name: 'Silk Linen Ivory',
    code: '0420',
    hex: '#F5EFE6',
    family: 'Whites & Creams',
    lrv: 86,
    undertone: 'Soft Balanced Linen Cream',
    recommendedFinish: 'Silk Smooth Eggshell',
    toneType: 'Balanced Neutral',
    shadeStrip: [
      { code: '0422', name: 'Pure Chalk', hex: '#FCFAF7', lrv: 93 },
      { code: '0421', name: 'Morning Milk', hex: '#FAF6F0', lrv: 90 },
      { code: '0420', name: 'Silk Linen Ivory', hex: '#F5EFE6', lrv: 86 },
      { code: '0419', name: 'Warm Parchment', hex: '#EFE5D5', lrv: 79 },
      { code: '0418', name: 'Toasted Almond', hex: '#E2D4C0', lrv: 70 },
    ],
    coordinatingTrim: { code: '0422', name: 'Pure Chalk', hex: '#FCFAF7' },
    contrastingAccent: { code: '7366', name: 'Ashberry Blue', hex: '#385E7B' },
  },
  {
    id: 'sw-EAE6',
    name: 'Udaipur Mineral',
    code: '0012',
    hex: '#EAE6DF',
    family: 'Warm Neutrals',
    lrv: 82,
    undertone: 'Cool Reflective Marble',
    recommendedFinish: 'Italian Venetian Sheen',
    toneType: 'Balanced Neutral',
    shadeStrip: [
      { code: '0015', name: 'Pichola White', hex: '#F7F5F2', lrv: 91 },
      { code: '0014', name: 'Silver Mist', hex: '#F0ECE5', lrv: 86 },
      { code: '0012', name: 'Udaipur Mineral', hex: '#EAE6DF', lrv: 82 },
      { code: '0011', name: 'Ash Granite', hex: '#DCD6CC', lrv: 73 },
      { code: '0010', name: 'Stone Arch', hex: '#C7BFB3', lrv: 61 },
    ],
    coordinatingTrim: { code: '0015', name: 'Pichola White', hex: '#F7F5F2' },
    contrastingAccent: { code: '9412', name: 'Royal Cobalt', hex: '#243B7A' },
  },
  {
    id: 'sw-7C8A',
    name: 'Cedar Mist',
    code: '8210',
    hex: '#7C8A99',
    family: 'Blues',
    lrv: 62,
    undertone: 'Cool Mountain Fog',
    recommendedFinish: 'Low-Glare Eggshell',
    toneType: 'Cool',
    shadeStrip: [
      { code: '8214', name: 'Snow Peak', hex: '#DCE2E8', lrv: 79 },
      { code: '8213', name: 'Pine Shadow', hex: '#BAC5CE', lrv: 71 },
      { code: '8212', name: 'Valley Smoke', hex: '#9BA9B5', lrv: 66 },
      { code: '8210', name: 'Cedar Mist', hex: '#7C8A99', lrv: 62 },
      { code: '8209', name: 'Slate Ridge', hex: '#586877', lrv: 35 },
    ],
    coordinatingTrim: { code: '0420', name: 'Silk Ivory', hex: '#F5EFE6' },
    contrastingAccent: { code: '7920', name: 'Amber Ochre', hex: '#E68A00' },
  },
];

export const GeminiStarLatticeGallery: React.FC = () => {
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedSwatch, setSelectedSwatch] = useState<PureColorSwatch>(SWATCH_DATABASE[0]);
  const [lightingMode, setLightingMode] = useState<'daylight' | 'evening' | 'cool'>('daylight');
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'3d-carousel' | 'fandeck-matrix'>('3d-carousel');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto rotation
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.35) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Lighting overlay filter adjustment
  const getLightingFilter = () => {
    switch (lightingMode) {
      case 'evening':
        return 'sepia(0.2) saturate(1.15) brightness(0.96)';
      case 'cool':
        return 'hue-rotate(6deg) saturate(0.95) brightness(1.02)';
      case 'daylight':
      default:
        return 'none';
    }
  };

  const totalItems = SWATCH_DATABASE.length;
  const radius = 320;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full rounded-3xl overflow-hidden bg-[#0A0D14] border border-white/10 shadow-2xl p-6 sm:p-10 text-white select-none"
    >
      {/* Electromagnetic Field Ambient Glow & Magnetic Flux Grid */}
      <div 
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(56, 189, 248, 0.14), rgba(147, 51, 234, 0.08), transparent 70%)`
        }}
      />

      {/* Decorative Magnetic Flux Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="emGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <ellipse cx="50%" cy="50%" rx="35%" ry="22%" fill="none" stroke="url(#emGrad)" strokeWidth="1" strokeDasharray="6 8" />
        <ellipse cx="50%" cy="50%" rx="48%" ry="32%" fill="none" stroke="url(#emGrad)" strokeWidth="1" strokeDasharray="4 12" />
      </svg>

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#60A5FA] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <span>Architectural Shade Swatch Gallery</span>
          </div>
          <h3 className="font-heading font-bold text-2xl sm:text-3xl text-white">
            Pure Color Shade Swatches
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mt-1">
            True pigment swatches with light reflection value (LRV), undertone specs, and coordinating monochromatic strips.
          </p>
        </div>

        {/* View Toggles & Lighting Simulator */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Lighting Mode Pill */}
          <div className="bg-white/10 backdrop-blur-md p-1 rounded-full flex items-center border border-white/15 text-xs font-semibold">
            <button
              onClick={() => setLightingMode('daylight')}
              className={`px-2.5 py-1.5 rounded-full flex items-center gap-1 transition-all cursor-pointer ${
                lightingMode === 'daylight' ? 'bg-[#3B82F6] text-white shadow-xs' : 'text-gray-400 hover:text-white'
              }`}
              title="Natural Daylight (5500K)"
            >
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              <span>Daylight</span>
            </button>
            <button
              onClick={() => setLightingMode('evening')}
              className={`px-2.5 py-1.5 rounded-full flex items-center gap-1 transition-all cursor-pointer ${
                lightingMode === 'evening' ? 'bg-[#3B82F6] text-white shadow-xs' : 'text-gray-400 hover:text-white'
              }`}
              title="Warm Evening Lamp (2700K)"
            >
              <Lamp className="w-3.5 h-3.5 text-amber-400" />
              <span>Warm Lamp</span>
            </button>
            <button
              onClick={() => setLightingMode('cool')}
              className={`px-2.5 py-1.5 rounded-full flex items-center gap-1 transition-all cursor-pointer ${
                lightingMode === 'cool' ? 'bg-[#3B82F6] text-white shadow-xs' : 'text-gray-400 hover:text-white'
              }`}
              title="Cool White Ambient (4000K)"
            >
              <Moon className="w-3.5 h-3.5 text-cyan-300" />
              <span>Cool Light</span>
            </button>
          </div>

          {/* Mode switch & play/pause */}
          <div className="bg-white/10 backdrop-blur-md p-1 rounded-full flex items-center border border-white/15 text-xs font-semibold">
            <button
              onClick={() => setViewMode('3d-carousel')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                viewMode === '3d-carousel' ? 'bg-[#3B82F6] text-white shadow-xs' : 'text-gray-400 hover:text-white'
              }`}
            >
              3D Rotating Swatches
            </button>
            <button
              onClick={() => setViewMode('fandeck-matrix')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                viewMode === 'fandeck-matrix' ? 'bg-[#3B82F6] text-white shadow-xs' : 'text-gray-400 hover:text-white'
              }`}
            >
              Shade Grid
            </button>
          </div>

          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors cursor-pointer"
            title={isAutoRotating ? 'Pause Rotation' : 'Auto Rotate'}
          >
            {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* VIEW 1: 3D CYLINDRICAL ROTATING PURE COLOR SWATCH CAROUSEL */}
      {viewMode === '3d-carousel' && (
        <div className="relative h-[360px] sm:h-[400px] flex items-center justify-center overflow-hidden my-4">
          <div 
            className="w-full h-full relative flex items-center justify-center"
            style={{ perspective: 1100 }}
          >
            <div
              className="relative w-[180px] sm:w-[210px] h-[250px] sm:h-[280px]"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateY(${rotationAngle}deg)`,
                transition: isAutoRotating ? 'none' : 'transform 0.5s ease-out',
              }}
            >
              {SWATCH_DATABASE.map((item, index) => {
                const angle = (360 / totalItems) * index;
                const isSelected = selectedSwatch.id === item.id;
                const isHovered = hoveredIndex === index;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedSwatch(item)}
                    onMouseEnter={() => {
                      setHoveredIndex(index);
                      setIsAutoRotating(false);
                    }}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                      transformStyle: 'preserve-3d',
                    }}
                    className="absolute inset-0 cursor-pointer group"
                  >
                    {/* The Astroid / Squircle Curved-Edge Frame with Electromagnetic Aura */}
                    <div 
                      className={`relative w-full h-full p-2 transition-all duration-300 ${
                        isHovered || isSelected
                          ? 'scale-108 shadow-[0_0_35px_rgba(56,189,248,0.7)]'
                          : 'opacity-90 hover:opacity-100'
                      }`}
                      style={{
                        // Squircle / Cushion shape with curved edges (convex hollow space between 4 Gemini stars)
                        borderRadius: '32% 32% 32% 32% / 32% 32% 32% 32%',
                        background: isHovered 
                          ? `linear-gradient(135deg, ${item.hex}, #38BDF8, #818CF8)` 
                          : `linear-gradient(135deg, ${item.hex}, #0F172A)`,
                        boxShadow: isHovered 
                          ? `0 0 30px ${item.hex}, 0 0 50px rgba(56,189,248,0.4)` 
                          : `0 8px 20px rgba(0,0,0,0.8)`,
                      }}
                    >
                      {/* Inner Pure Color Swatch Fill */}
                      <div 
                        className="w-full h-full p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-300"
                        style={{
                          borderRadius: '28% 28% 28% 28% / 28% 28% 28% 28%',
                          backgroundColor: item.hex,
                          filter: getLightingFilter(),
                        }}
                      >
                        {/* Pigment Luster / Satin Reflection Overlay */}
                        <div 
                          className="absolute inset-0 pointer-events-none opacity-30 bg-gradient-to-tr from-black/40 via-transparent to-white/40"
                        />

                        {/* Top: Color Code Stamp */}
                        <div className="relative z-10 flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-white border border-white/20">
                            {item.code}
                          </span>
                          <span className="text-[10px] font-bold bg-white/70 backdrop-blur-md px-2 py-0.5 rounded-full text-black">
                            LRV {item.lrv}%
                          </span>
                        </div>

                        {/* Middle: Subtle Monochromatic Mini-Gradient Strip */}
                        <div className="relative z-10 my-auto flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          {item.shadeStrip.slice(0, 4).map((sub, sIdx) => (
                            <div
                              key={sIdx}
                              className="h-7 w-3.5 rounded-sm border border-black/20 shadow-xs"
                              style={{ backgroundColor: sub.hex }}
                              title={`${sub.name} (${sub.code})`}
                            />
                          ))}
                        </div>

                        {/* Bottom: Shade Name & Tone */}
                        <div className="relative z-10 bg-black/70 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 text-left">
                          <span className="text-[9px] font-bold text-[#38BDF8] uppercase tracking-wider block">
                            {item.family}
                          </span>
                          <h4 className="font-bold text-xs text-white truncate">
                            {item.name}
                          </h4>
                          <span className="text-[9px] text-gray-300 font-mono block mt-0.5">
                            {item.hex} &bull; {item.toneType}
                          </span>
                        </div>

                        {/* Hover electromagnetic ring */}
                        {isHovered && (
                          <div className="absolute inset-0 border-2 border-[#38BDF8] rounded-[28%] animate-pulse pointer-events-none shadow-[inset_0_0_20px_rgba(56,189,248,0.5)]" />
                        )}
                      </div>
                    </div>

                    {/* Surrounding 4-Pointed Black Gemini Star Tips */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 pointer-events-none opacity-80">
                      <svg viewBox="0 0 100 100" className="w-full h-full fill-black stroke-[#38BDF8]/40 stroke-2">
                        <path d="M 50 0 Q 50 50 100 50 Q 50 50 50 100 Q 50 50 0 50 Q 50 50 50 0 Z" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Rotation Buttons */}
          <button
            onClick={() => setRotationAngle((prev) => prev - 45)}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md transition-colors cursor-pointer z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setRotationAngle((prev) => prev + 45)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md transition-colors cursor-pointer z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* VIEW 2: SHADE GRID MATRIX */}
      {viewMode === 'fandeck-matrix' && (
        <div className="my-6 p-4 sm:p-6 rounded-2xl bg-black/80 border border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {SWATCH_DATABASE.map((item, index) => {
              const isSelected = selectedSwatch.id === item.id;
              const isHovered = hoveredIndex === index;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedSwatch(item)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`group relative rounded-2xl p-3 border transition-all duration-300 cursor-pointer ${
                    isSelected || isHovered
                      ? 'border-[#38BDF8] shadow-[0_0_25px_rgba(56,189,248,0.5)] scale-102 bg-white/10'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  {/* Pure Color Swatch Block */}
                  <div
                    className="w-full aspect-[4/3] rounded-xl relative shadow-md overflow-hidden flex items-end p-2.5"
                    style={{ 
                      backgroundColor: item.hex,
                      filter: getLightingFilter(),
                    }}
                  >
                    <div className="absolute top-2 left-2 text-[10px] font-mono font-bold bg-black/60 px-2 py-0.5 rounded-full text-white">
                      {item.code}
                    </div>
                    <div className="absolute top-2 right-2 text-[9px] font-bold bg-white/80 px-1.5 py-0.5 rounded text-black">
                      LRV {item.lrv}%
                    </div>
                  </div>

                  {/* Swatch Info */}
                  <div className="mt-3 text-left">
                    <h5 className="font-bold text-xs text-white group-hover:text-[#38BDF8] transition-colors">
                      {item.name}
                    </h5>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono mt-0.5">
                      <span>{item.hex}</span>
                      <span>{item.undertone}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SELECTED SWATCH INSPECTOR & HARMONY STRIP */}
      <div className="relative z-10 mt-8 p-5 sm:p-7 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
        
        {/* Main Swatch Spec Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Pure Color Chip */}
            <div 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-white/30 shadow-xl flex items-center justify-center shrink-0 relative overflow-hidden"
              style={{ 
                backgroundColor: selectedSwatch.hex,
                boxShadow: `0 0 25px ${selectedSwatch.hex}88`,
                filter: getLightingFilter(),
              }}
            >
              <span className="text-[10px] font-mono font-bold bg-black/70 text-white px-2 py-0.5 rounded-full">
                {selectedSwatch.code}
              </span>
            </div>

            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider">
                  {selectedSwatch.family} &bull; {selectedSwatch.toneType}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 font-mono text-gray-300">
                  LRV: {selectedSwatch.lrv}%
                </span>
              </div>
              <h4 className="font-bold text-xl sm:text-2xl text-white">
                {selectedSwatch.name} ({selectedSwatch.code})
              </h4>
              <p className="text-xs text-gray-300 max-w-lg leading-relaxed">
                Undertone: <span className="text-white font-medium">{selectedSwatch.undertone}</span> &bull; Finish: <span className="text-white font-medium">{selectedSwatch.recommendedFinish}</span>
              </p>
            </div>
          </div>

          {/* Quick Copy & Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
            <button
              onClick={() => handleCopyCode(selectedSwatch.hex)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedHex === selectedSwatch.hex ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied {selectedSwatch.hex}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-300" />
                  <span>Copy {selectedSwatch.hex}</span>
                </>
              )}
            </button>
            <button
              onClick={() => handleCopyCode(`${selectedSwatch.name} (${selectedSwatch.code})`)}
              className="px-4 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Copy Shade Name
            </button>
          </div>
        </div>

        {/* Monochromatic Shade Strip (Gradation from light to dark) */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Monochromatic Shade Strip (Tints &amp; Shades)</span>
            </span>
            <span className="text-[11px] font-mono">From 74% LRV to 22% LRV</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {selectedSwatch.shadeStrip.map((shade) => {
              const isCurrent = shade.hex === selectedSwatch.hex;
              return (
                <div
                  key={shade.code}
                  onClick={() => handleCopyCode(shade.hex)}
                  className={`group rounded-xl p-2.5 border transition-all cursor-pointer text-left ${
                    isCurrent 
                      ? 'border-[#38BDF8] bg-white/15 shadow-sm' 
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <div
                    className="w-full h-10 rounded-lg shadow-inner mb-2 flex items-end justify-end p-1"
                    style={{ backgroundColor: shade.hex, filter: getLightingFilter() }}
                  >
                    <span className="text-[9px] font-mono font-bold bg-black/60 text-white px-1 rounded">
                      {shade.lrv}%
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#38BDF8] block">{shade.code}</span>
                  <span className="text-xs font-bold text-white truncate block">{shade.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coordinated Trim & Contrast Combinations (Pure Swatches) */}
        <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Trim */}
          <div className="p-3 bg-black/50 rounded-xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg border border-white/30"
                style={{ backgroundColor: selectedSwatch.coordinatingTrim.hex }}
              />
              <div className="text-left">
                <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold">
                  Harmonizing Trim &amp; Ceiling
                </span>
                <h6 className="font-bold text-xs text-white">
                  {selectedSwatch.coordinatingTrim.name} ({selectedSwatch.coordinatingTrim.code})
                </h6>
                <span className="text-[10px] font-mono text-gray-300">
                  {selectedSwatch.coordinatingTrim.hex}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleCopyCode(selectedSwatch.coordinatingTrim.hex)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
              title="Copy trim hex"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Accent */}
          <div className="p-3 bg-black/50 rounded-xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg border border-white/30"
                style={{ backgroundColor: selectedSwatch.contrastingAccent.hex }}
              />
              <div className="text-left">
                <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold">
                  Contrasting Feature Accent
                </span>
                <h6 className="font-bold text-xs text-white">
                  {selectedSwatch.contrastingAccent.name} ({selectedSwatch.contrastingAccent.code})
                </h6>
                <span className="text-[10px] font-mono text-gray-300">
                  {selectedSwatch.contrastingAccent.hex}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleCopyCode(selectedSwatch.contrastingAccent.hex)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
              title="Copy accent hex"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
