import React from 'react';

interface Pillar {
  id: string;
  numberStr: string;
  title: string;
  desc: string;
}

interface PillarsSectionProps {
  headline: string;
  subtitle: string;
  pillars: Pillar[];
  isEditMode: boolean;
  onUpdatePillar: (index: number, title: string, desc: string) => void;
}

export const PillarsSection: React.FC<PillarsSectionProps> = ({
  headline,
  subtitle,
  pillars,
  isEditMode,
  onUpdatePillar,
}) => {
  return (
    <section className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-[#E8E2D5]/50">
      
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
        <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[#1A1C1E] leading-tight">
          {headline}
        </h2>
        <p className="text-base sm:text-lg text-[#5C6066] font-normal leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Sequential Pillars Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
        {pillars.map((item, idx) => (
          <div key={item.id} className="space-y-4 flex flex-col justify-between">
            <div>
              {/* Minimal Number Indicator */}
              <span className="font-mono text-sm font-semibold text-[#E68A00] tracking-wider block mb-2">
                {item.numberStr}
              </span>

              {/* Title */}
              {isEditMode ? (
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => onUpdatePillar(idx, e.target.value, item.desc)}
                  className="text-2xl font-light text-[#1A1C1E] bg-white border border-dashed border-[#E68A00] rounded p-1 mb-2 w-full"
                />
              ) : (
                <h3 className="text-2xl font-light text-[#1A1C1E] tracking-tight mb-3">
                  {item.title}
                </h3>
              )}

              {/* Description */}
              {isEditMode ? (
                <textarea
                  value={item.desc}
                  onChange={(e) => onUpdatePillar(idx, item.title, e.target.value)}
                  rows={3}
                  className="text-sm text-[#5C6066] bg-white border border-dashed border-[#E68A00] rounded p-1 w-full"
                />
              ) : (
                <p className="text-sm sm:text-base text-[#5C6066] leading-relaxed font-normal">
                  {item.desc}
                </p>
              )}
            </div>

            <div className="pt-4 border-b border-[#E8E2D5]/60 w-12" />
          </div>
        ))}
      </div>

    </section>
  );
};
