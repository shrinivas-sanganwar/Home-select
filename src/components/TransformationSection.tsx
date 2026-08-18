import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  MoveHorizontal, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Droplets, 
  Sun, 
  RotateCw,
  Eye,
  ArrowRight
} from 'lucide-react';

interface TransformationRoom {
  id: string;
  title: string;
  roomType: string;
  shadeName: string;
  shadeHex: string;
  finish: string;
  beforeImg: string;
  afterImg: string;
  beforeIssues: string[];
  afterBenefits: string[];
}

const TRANSFORMATION_ROOMS: TransformationRoom[] = [
  {
    id: 't-1',
    title: 'Modern Living Room Refresh',
    roomType: 'Living Room',
    shadeName: 'Silk Linen Ivory',
    shadeHex: '#F5EFE6',
    finish: 'Silk Velvet Eggshell',
    beforeImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    beforeIssues: ['Dull patchy plaster', 'Visible scuffs & hand stains', 'Uneven light reflection'],
    afterBenefits: ['100% washable smooth eggshell', 'Deep, gentle daylight glow', 'Stain-resistant protective film'],
  },
  {
    id: 't-2',
    title: 'Warm Terracotta Accent Lounge',
    roomType: 'Dining & Lounge',
    shadeName: 'Jaipur Ochre Clay',
    shadeHex: '#D96C4A',
    finish: 'Velvet Matte',
    beforeImg: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    beforeIssues: ['Cold uninspired white walls', 'Lack of character & depth', 'Micro-cracks along baseboard'],
    afterBenefits: ['Rich heritage warmth & depth', 'Seamless micro-crack filling', 'Warm, welcoming evening mood'],
  },
  {
    id: 't-3',
    title: 'Botanical Sage Bedroom Retreat',
    roomType: 'Master Bedroom',
    shadeName: 'Himalayan Mist Sage',
    shadeHex: '#3F8F6B',
    finish: 'Washable Eggshell',
    beforeImg: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
    beforeIssues: ['Faded paint with chemical odor', 'Moisture marks near window', 'Chalking powder on touch'],
    afterBenefits: ['Zero-odor breathable paint', 'Anti-fungal moisture barrier', 'Restful botanical retreat'],
  },
];

export const TransformationSection: React.FC = () => {
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number>(0);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const room = TRANSFORMATION_ROOMS[selectedRoomIndex];

  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.min(Math.max((x / rect.width) * 100, 2), 98);
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleAutoGlide = () => {
    // Smooth glide animation
    setSliderPosition(15);
    setTimeout(() => setSliderPosition(85), 400);
    setTimeout(() => setSliderPosition(50), 900);
  };

  return (
    <section 
      id="transformation" 
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8E2D5] dark:border-white/10 scroll-mt-16"
    >
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#162032]/80 backdrop-blur-md border border-[#E8E2D5] dark:border-white/10 text-xs font-bold text-[#243B7A] dark:text-[#93C5FD] shadow-2xs">
          <MoveHorizontal className="w-3.5 h-3.5 text-[#E68A00] dark:text-[#F59E0B]" />
          <span>Real Wall Transformation</span>
        </div>

        <h2 className="font-heading font-black text-3xl sm:text-5xl tracking-tight text-[#1A1A1A] dark:text-[#F1F4F9]">
          See the Difference Real Paint Makes
        </h2>

        <p className="text-base sm:text-lg text-[#1A1A1A]/70 dark:text-[#94A3B8] leading-relaxed">
          Slide across to see how high-grade paint turns dull, stained walls into clean, smooth, and washable living spaces.
        </p>
      </div>

      {/* Main Showcase Container with Glassmorphism */}
      <div className="bg-white/85 dark:bg-[#131B2E]/90 backdrop-blur-xl rounded-3xl border border-[#E8E2D5] dark:border-white/10 shadow-xl overflow-hidden p-4 sm:p-8 space-y-8">
        
        {/* Room Presets Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E8E2D5] dark:border-white/10">
          <div className="flex flex-wrap gap-2">
            {TRANSFORMATION_ROOMS.map((item, idx) => {
              const isSelected = selectedRoomIndex === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedRoomIndex(idx);
                    setSliderPosition(50);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#243B7A] dark:bg-[#3B82F6] text-white shadow-sm'
                      : 'bg-[#F8F4EC] dark:bg-[#0E131F] text-[#1A1A1A]/75 dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F1F4F9] hover:bg-[#FAF8F5] dark:hover:bg-[#1E293B]'
                  }`}
                >
                  <div 
                    className="w-3 h-3 rounded-full border border-white/40 shrink-0" 
                    style={{ backgroundColor: item.shadeHex }}
                  />
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleAutoGlide}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#162032] border border-[#E8E2D5] dark:border-white/10 text-xs font-bold text-[#243B7A] dark:text-[#93C5FD] hover:bg-[#F8F4EC] dark:hover:bg-[#1E293B] transition-all shadow-2xs cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#E68A00] dark:text-[#F59E0B]" />
            <span>Glide Reveal</span>
          </button>
        </div>

        {/* INTERACTIVE BEFORE / AFTER SLIDER */}
        <div 
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={(e) => isDragging && handleSliderMove(e.clientX)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onTouchMove={handleTouchMove}
          onClick={(e) => handleSliderMove(e.clientX)}
          className="relative h-[360px] sm:h-[480px] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-stone-200 dark:border-white/10 shadow-inner bg-stone-900"
        >
          {/* AFTER IMAGE (Background Layer) */}
          <img
            src={room.afterImg}
            alt="Transformed fresh painted room"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            referrerPolicy="no-referrer"
          />

          {/* BEFORE IMAGE (Clipped Overlay Layer) */}
          <div
            style={{ width: `${sliderPosition}%` }}
            className="absolute top-0 bottom-0 left-0 overflow-hidden border-r-2 border-white shadow-2xl z-10 transition-[width] duration-75 ease-out"
          >
            <img
              src={room.beforeImg}
              alt="Before painting original state"
              className="absolute top-0 left-0 max-w-none w-full h-full object-cover pointer-events-none"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                height: '100%',
              }}
              referrerPolicy="no-referrer"
            />

            {/* Before Badge */}
            <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 shadow-md">
              Before Painting
            </div>
          </div>

          {/* After Badge */}
          <div className="absolute top-4 right-4 bg-[#243B7A]/90 dark:bg-[#1E3A8A]/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 shadow-md z-0">
            After Fresh Paint ({room.shadeName})
          </div>

          {/* Drag Handle Bar */}
          <div
            style={{ left: `${sliderPosition}%` }}
            className="absolute top-0 bottom-0 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none"
          >
            <div className="w-10 h-10 rounded-full bg-white dark:bg-[#0E131F] text-[#243B7A] dark:text-[#60A5FA] shadow-2xl flex items-center justify-center border-2 border-[#243B7A] dark:border-[#60A5FA] transition-transform duration-200">
              <MoveHorizontal className="w-4 h-4" />
            </div>
          </div>

          {/* Bottom Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/10 pointer-events-none">
            Drag slider left or right to compare
          </div>
        </div>

        {/* Side-by-Side Factor Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Before Card */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#162032] border border-red-200/60 dark:border-red-500/20 space-y-3">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-sm">
              <XCircle className="w-4 h-4" />
              <span>Common Issues on Old Walls</span>
            </div>
            <ul className="space-y-2">
              {room.beforeIssues.map((issue, i) => (
                <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-[#1A1A1A]/75 dark:text-[#CBD5E1]">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* After Card */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#162032] border border-emerald-200/60 dark:border-emerald-500/20 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Transformed with HomeSelect Finishes</span>
            </div>
            <ul className="space-y-2">
              {room.afterBenefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-[#1A1A1A]/85 dark:text-[#CBD5E1]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};
