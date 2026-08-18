import React from 'react';
import { FeatureItem } from '../types';
import { Sun, Layers, ShieldCheck, Sparkles, Droplets, Wind } from 'lucide-react';

interface FeaturesSectionProps {
  headline: string;
  subtitle?: string;
  features: FeatureItem[];
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  headline,
  features,
}) => {
  const renderOutlineIcon = (iconName: string, color: string) => {
    const props = { className: 'w-5 h-5', style: { color } };
    switch (iconName.toLowerCase()) {
      case 'sun':
        return <Sun {...props} />;
      case 'layers':
        return <Layers {...props} />;
      case 'sparkles':
        return <Sparkles {...props} />;
      case 'droplets':
        return <Droplets {...props} />;
      case 'wind':
        return <Wind {...props} />;
      case 'shieldcheck':
      default:
        return <ShieldCheck {...props} />;
    }
  };

  return (
    <section 
      id="features" 
      className="py-10 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto"
    >
      {/* Clean, Direct Section Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E8E2D5] dark:border-white/10">
        <div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#1A1A1A] dark:text-[#F1F4F9]">
            {headline}
          </h2>
        </div>

        {/* Feature Pills / Badges - Clean, Glassmorphic & Immediate */}
        <div className="flex flex-wrap items-center gap-3">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/80 dark:bg-[#162032]/80 backdrop-blur-md border border-[#E8E2D5] dark:border-white/10 shadow-2xs hover:border-[#243B7A]/40 dark:hover:border-[#60A5FA]/40 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-[#F8F4EC] dark:bg-[#0E131F] flex items-center justify-center shrink-0">
                {renderOutlineIcon(feature.iconName, feature.accentColor)}
              </div>
              <span className="font-bold text-xs sm:text-sm text-[#1A1A1A] dark:text-[#F1F4F9]">
                {feature.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

