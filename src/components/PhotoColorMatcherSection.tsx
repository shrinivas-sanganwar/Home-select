import React from 'react';
import { Camera, Sparkles, Pipette, CheckCircle2, ArrowRight } from 'lucide-react';
import { SimilarColorFinder } from './SimilarColorFinder';
import { PaintProduct } from '../types';

interface PhotoColorMatcherSectionProps {
  onSelectProductForCalculator?: (product: PaintProduct) => void;
  onApplyToVisualizer?: (hex: string, name: string) => void;
  onNavClick?: (href: string) => void;
}

export const PhotoColorMatcherSection: React.FC<PhotoColorMatcherSectionProps> = ({
  onSelectProductForCalculator,
  onApplyToVisualizer,
  onNavClick
}) => {
  return (
    <section id="photo-matcher" className="py-16 sm:py-24 bg-[#F8F4EC] border-b border-[#E8E2D5] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-900 border border-amber-500/20 text-xs font-bold tracking-wide">
            <Camera className="w-3.5 h-3.5 text-amber-600" />
            <span>Photo Color Matcher</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A1A1A] tracking-tight">
            Turn Any Photo into Real Wall Paint
          </h2>

          <p className="text-base sm:text-lg text-[#1A1A1A]/70 leading-relaxed">
            Saw a wall on Instagram or Pinterest? Take a photo or upload an image, and our color matcher will instantly identify the exact Asian Paints formulation, price, and matching trim whites.
          </p>

          {/* Quick 3-Step Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-semibold text-[#1A1A1A]/70">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E2D5] shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              1. Snap or Upload Photo
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E2D5] shadow-2xs">
              <Pipette className="w-3.5 h-3.5 text-amber-600" />
              2. Tap Eyedropper on Any Wall
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E2D5] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#243B7A]" />
              3. Get Exact Asian Paints Shade
            </span>
          </div>
        </div>

        {/* INTERACTIVE COLOR MATCHER ENGINE CONTAINER */}
        <div className="bg-white rounded-3xl shadow-xl border border-[#E8E2D5] overflow-hidden p-2 sm:p-4">
          <SimilarColorFinder 
            onSelectProductForCalculator={(product) => {
              if (onSelectProductForCalculator) {
                onSelectProductForCalculator(product);
              }
              const calcEl = document.getElementById('product-guides');
              if (calcEl) {
                calcEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            onApplyToVisualizer={(hex, name) => {
              if (onApplyToVisualizer) {
                onApplyToVisualizer(hex, name);
              }
              const visEl = document.getElementById('vision-story');
              if (visEl) {
                visEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
        </div>

      </div>
    </section>
  );
};
