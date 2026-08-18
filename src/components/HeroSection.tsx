import React from 'react';
import { motion } from 'motion/react';
import { AuroraBackground } from './AuroraBackground';

interface HeroSectionProps {
  headline?: string;
  subtitle?: string;
  heroImageUrl?: string;
  onNavClick?: (href: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  headline = 'Helping you choose the right paint',
  subtitle = 'Discover lasting wall paints, explore curated colours, and calculate exact paint needs for your home.',
  heroImageUrl = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
}) => {
  return (
    <section 
      id="hero" 
      className="relative flex flex-col justify-start pt-2 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <AuroraBackground />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Clean, Premium Asian Paints-Style Hero Banner Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E8E2D5] dark:border-white/10 aspect-[16/9] sm:aspect-[21/9] min-h-[320px] sm:min-h-[460px] bg-stone-900 group">
          <motion.img
            src={heroImageUrl}
            alt="Beautifully Painted Home Interior"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />

          {/* Elegant Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 pointer-events-none" />

          {/* Simple, Clean Bottom Banner Text */}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 text-white max-w-3xl space-y-2 z-10">
            <h1 className="font-heading font-bold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight drop-shadow-md">
              {headline}
            </h1>
            <p className="text-xs sm:text-base text-white/90 font-medium max-w-2xl drop-shadow-sm leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
