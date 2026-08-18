import React from 'react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  logoName: string;
  tagline: string;
  onOpenLogin: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ logoName, tagline, onOpenLogin, onOpenAdmin }) => {
  const [clickCount, setClickCount] = React.useState(0);

  const handleBrandClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    if (nextCount >= 3) {
      if (onOpenAdmin) onOpenAdmin();
      setClickCount(0);
    }
  };
  return (
    <footer className="border-t border-[#E8E2D5] dark:border-white/10 bg-[#F8F4EC]/80 dark:bg-[#0A0E17]/90 backdrop-blur-xl py-16 px-6 sm:px-8 lg:px-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Brand identity */}
        <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
          <BrandLogo logoName={logoName} size="sm" fontStyle="italic-serif" />
          <p className="text-xs text-[#1A1A1A]/60 dark:text-[#94A3B8] font-normal">{tagline}</p>
        </div>

        {/* Minimal Navigation & Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#1A1A1A]/70 dark:text-[#CBD5E1] font-semibold">
          <a href="#hero" className="hover:text-[#243B7A] dark:hover:text-[#60A5FA] transition-colors">Home</a>
          <a href="#explore-products" className="hover:text-[#243B7A] dark:hover:text-[#60A5FA] transition-colors">Explore Products</a>
          <a href="#compare" className="hover:text-[#243B7A] dark:hover:text-[#60A5FA] transition-colors">Compare</a>
          <a href="#colours-of-india" className="hover:text-[#243B7A] dark:hover:text-[#60A5FA] transition-colors">Colours of India</a>
          <a href="#inspiration" className="hover:text-[#243B7A] dark:hover:text-[#60A5FA] transition-colors">Inspiration</a>
          <a href="#innovations" className="hover:text-[#243B7A] dark:hover:text-[#60A5FA] transition-colors">Innovations</a>
          <a href="#ai-assistant" className="hover:text-[#243B7A] dark:hover:text-[#60A5FA] transition-colors">AI Assistant</a>
          <button 
            onClick={onOpenLogin}
            className="hover:text-[#243B7A] dark:hover:text-[#60A5FA] transition-colors font-bold cursor-pointer"
          >
            Studio Login
          </button>
          {onOpenAdmin && (
            <button 
              onClick={onOpenAdmin}
              className="text-[#243B7A] dark:text-[#60A5FA] hover:underline font-bold cursor-pointer flex items-center gap-1"
            >
              <span>Owner Studio</span>
            </button>
          )}
        </div>

        {/* Copyright */}
        <div 
          onClick={handleBrandClick}
          className="text-xs text-[#1A1A1A]/50 dark:text-[#64748B] font-medium cursor-default select-none"
        >
          © {new Date().getFullYear()} {logoName}. Helping you choose the right paint.
        </div>

      </div>
    </footer>
  );
};
