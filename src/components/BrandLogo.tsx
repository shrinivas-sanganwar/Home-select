import React from 'react';

export interface LogoColorPalette {
  id: string;
  name: string;
  boxColor: string;
  tickColor: string;
  textColor?: string;
}

export const LOGO_COLOR_PALETTES: LogoColorPalette[] = [
  {
    id: 'indigo-saffron',
    name: 'Indigo Blue & Saffron Orange',
    boxColor: '#1E3A8A',
    tickColor: '#FF6B00',
  },
  {
    id: 'navy-amber',
    name: 'Royal Navy & Golden Amber',
    boxColor: '#1D2B6C',
    tickColor: '#F59E0B',
  },
  {
    id: 'slate-terracotta',
    name: 'Architectural Slate & Terracotta',
    boxColor: '#1E293B',
    tickColor: '#E05A47',
  },
  {
    id: 'obsidian-emerald',
    name: 'Midnight Obsidian & Emerald',
    boxColor: '#0F172A',
    tickColor: '#10B981',
  },
  {
    id: 'zinc-crimson',
    name: 'Charcoal Ink & Crimson Red',
    boxColor: '#18181B',
    tickColor: '#DC2626',
  },
];

interface BrandLogoProps {
  logoName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColorClass?: string;
  boxColor?: string;
  tickColor?: string;
  className?: string;
  fontStyle?: 'italic-serif' | 'bodoni' | 'sans';
}

export const BrandLogoIcon: React.FC<{ 
  className?: string;
  boxColor?: string;
  tickColor?: string;
}> = ({ 
  className = "w-8 h-8",
  boxColor = "#1E3A8A",
  tickColor = "#FF6B00"
}) => (
  <div className={`relative flex items-center justify-center shrink-0 group ${className}`}>
    <svg 
      className="w-full h-full drop-shadow-2xs transition-transform duration-300 group-hover:scale-105 overflow-visible" 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
    >
      {/* 
        HomeSelect Balanced Architecture:
        - Solid 15px Indigo Blue Box with sharp 90° corners and 45° diagonal cutouts.
        - Substantially Thicker, Bold Saffron Orange Checkmark (~18px stroke body):
          * Perfectly proportioned to match the heavy box walls
          * Centered in the box interior room
          * Sharp apex at (47, 76), sharp inner elbow at (47, 52)
          * Razor needle tip at (96, 6) extending dynamically through the cutout center
      */}
      
      {/* Geometrically Pure 14px Indigo Blue Box Frame with 100% Equal Proportion 45° Cutout */}
      <path 
        d="M 10 10 L 68 10 L 54 24 L 24 24 L 24 76 L 76 76 L 76 46 L 90 32 L 90 90 L 10 90 Z" 
        fill={boxColor} 
        className="transition-colors duration-300"
      />

      {/* Iconic Saffron Orange Checkmark: Centrally Aligned Apex (X=50), Equal Cutout Clearance & Thicker Stem Exit */}
      <path 
        d="M 106 -2 L 50 68 L 26 44 L 35 35 L 48 48 Z" 
        fill={tickColor} 
        className="transition-colors duration-300"
      />
    </svg>
  </div>
);

export const BrandLogo: React.FC<BrandLogoProps> = ({
  logoName,
  size = 'md',
  showText = true,
  textColorClass = 'text-[#1A1C1E] dark:text-[#F1F4F9] group-hover:text-[#1E3A8A] dark:group-hover:text-[#60A5FA]',
  boxColor = '#1E3A8A',
  tickColor = '#FF6B00',
  fontStyle = 'italic-serif',
  className = '',
}) => {
  const iconSizeClass = 
    size === 'sm' ? 'w-7 h-7' : 
    size === 'lg' ? 'w-10 h-10' : 
    size === 'xl' ? 'w-12 h-12' : 
    'w-8 h-8 sm:w-9 sm:h-9';

  const textSizeClass = 
    size === 'sm' ? 'text-lg sm:text-xl' : 
    size === 'lg' ? 'text-2xl sm:text-3xl' : 
    size === 'xl' ? 'text-3xl sm:text-4xl' : 
    'text-xl sm:text-2xl';

  const fontClass = fontStyle === 'bodoni' 
    ? 'font-bodoni-italic tracking-normal' 
    : fontStyle === 'sans'
    ? 'font-logo tracking-tight'
    : 'font-logo-italic tracking-normal';

  const renderTextContent = (text: string) => {
    if (text === 'HomeSelect') {
      return (
        <span className="inline-flex items-center tracking-tight select-none">
          <span className="font-bold">Home</span>
          <span className="font-light italic ml-[1px] opacity-95">Select</span>
        </span>
      );
    }
    return text;
  };

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <BrandLogoIcon className={iconSizeClass} boxColor={boxColor} tickColor={tickColor} />
      {showText && (
        <span className={`${fontClass} ${textSizeClass} ${textColorClass} transition-colors duration-300 select-none`}>
          {renderTextContent(logoName)}
        </span>
      )}
    </div>
  );
};
