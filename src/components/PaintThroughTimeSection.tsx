import React from 'react';
import { HISTORICAL_TIMELINE } from '../data/defaultContent';
import { Sparkles, Compass, Lightbulb, ArrowRight } from 'lucide-react';

export const PaintThroughTimeSection: React.FC = () => {
  return (
    <section 
      id="paint-through-time" 
      className="py-20 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-[#E8E2D5]"
    >
      {/* Friendly Suggestion Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E2D5] text-xs font-bold text-[#E68A00] shadow-xs">
          <Lightbulb className="w-3.5 h-3.5 text-[#E68A00]" />
          <span>Heritage Ideas for Modern Homes</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
          Timeless Indian Color Traditions
        </h2>
        <p className="text-sm sm:text-base text-[#1A1A1A]/70 font-normal leading-relaxed">
          Get inspired by classical Indian wall shades — from Rajasthan palace ochres to Chettinad earthen tones, reimagined for modern apartments and villas.
        </p>
      </div>

      {/* Suggestion Cards with Smooth Transitions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {HISTORICAL_TIMELINE.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 border border-[#E8E2D5] space-y-4 flex flex-col justify-between hover:border-[#E68A00] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-2xs group"
          >
            <div>
              {/* Swatch & Era */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-[#243B7A] bg-[#243B7A]/10 px-2.5 py-1 rounded-full">
                  {item.era}
                </span>

                <div 
                  className="w-7 h-7 rounded-full border border-black/10 shadow-xs group-hover:scale-110 transition-transform duration-300" 
                  style={{ backgroundColor: item.hex }}
                />
              </div>

              <h3 className="text-base font-bold text-[#1A1A1A] mb-1 group-hover:text-[#E68A00] transition-colors">
                {item.title}
              </h3>
              <span className="text-xs font-medium text-[#E68A00] block mb-2">
                {item.architecturalStyle}
              </span>

              <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                {item.historicalContext}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E8E2D5] text-xs">
              <span className="text-[#1A1A1A]/50 font-medium block text-[10px] uppercase tracking-wider mb-0.5">Where to use today:</span>
              <span className="text-[#243B7A] font-semibold">{item.modernApplication}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
