import React from 'react';
import { INNOVATION_ITEMS } from '../data/defaultContent';
import { Wind, Sun, ShieldCheck, Sparkles, Zap } from 'lucide-react';

export const InnovationsSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wind':
        return <Wind className="w-5 h-5 text-[#3F8F6B]" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-[#E68A00]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-[#243B7A]" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-5 h-5 text-[#7C3AED]" />;
    }
  };

  return (
    <section 
      id="innovations" 
      className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-[#E8E2D5]"
    >
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E2D5] text-xs font-semibold text-[#3F8F6B]">
          <Zap className="w-3.5 h-3.5 text-[#3F8F6B]" />
          <span>Formulation Breakthroughs</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
          Latest Innovations
        </h2>
        <p className="text-base sm:text-lg text-[#1A1A1A]/70 font-normal leading-relaxed">
          Pioneering paint technology engineered for health, eco-purity, thermal efficiency, and stain defense.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {INNOVATION_ITEMS.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 border border-[#E8E2D5] space-y-4 flex flex-col justify-between hover:shadow-xl transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#F8F4EC] border border-[#E8E2D5] flex items-center justify-center">
                  {getIcon(item.iconName)}
                </div>

                <span 
                  className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white"
                  style={{ backgroundColor: item.accentColor }}
                >
                  {item.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">
                {item.title}
              </h3>
              <span className="text-xs font-semibold text-[#E68A00] block mb-3">
                {item.tagline}
              </span>

              <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E8E2D5]">
              <a
                href="#explore-products"
                className="text-xs font-bold text-[#243B7A] hover:underline"
              >
                View Innovative Formulations →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
