import React, { useState, useEffect, useRef } from 'react';
import { NavItem } from '../types';
import { Search, X, Palette, Paintbrush, BookOpen, ArrowRight, Sparkles, UserCheck, Sun, Moon } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useTheme } from '../context/ThemeContext';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'product' | 'color' | 'guide';
  targetHref: string;
  badge?: string;
  hexCode?: string;
}

const SEARCH_DATABASE: SearchResultItem[] = [
  // Products
  {
    id: 'p-1',
    title: 'Silk Velvet Ultra Emulsion',
    subtitle: 'Eggshell Finish • Zero VOC • High Scrub Resistance',
    category: 'product',
    targetHref: '#explore-products',
    badge: 'Interior',
    hexCode: '#F5EFE6',
  },
  {
    id: 'p-2',
    title: 'Royal Shield Weather Proof',
    subtitle: 'Soft Glow • Thermal Cool Shield • Monsoon Defense',
    category: 'product',
    targetHref: '#explore-products',
    badge: 'Exterior',
    hexCode: '#E2DACB',
  },
  {
    id: 'p-3',
    title: 'Pure Breathable Mineral Paint',
    subtitle: 'Chalky Matte • Zero VOC • Natural Lime Silicate',
    category: 'product',
    targetHref: '#explore-products',
    badge: 'Eco Pure',
    hexCode: '#F8F4EC',
  },
  {
    id: 'p-4',
    title: 'Satin Touch Trim & Door Enamel',
    subtitle: 'Semi-Gloss • Non-Yellowing • Polyurethane Enamel',
    category: 'product',
    targetHref: '#explore-products',
    badge: 'Enamel',
    hexCode: '#243B7A',
  },
  {
    id: 'p-5',
    title: 'DampGuard Alkali Sealer Primer',
    subtitle: 'Matte • Efflorescence & Saltpeter Barrier',
    category: 'product',
    targetHref: '#explore-products',
    badge: 'Primer',
    hexCode: '#EAE6DF',
  },
  {
    id: 'p-6',
    title: 'Stucco Venetian Plaster Texture',
    subtitle: 'High Gloss Marble Polish • Artisanal Italian Style',
    category: 'product',
    targetHref: '#explore-products',
    badge: 'Texture',
    hexCode: '#D96C4A',
  },
  // Verified Color Swatches & Bands
  {
    id: 'c-7366',
    title: 'Ashberry (7366)',
    subtitle: 'Coastal Slate Blue • Rich Ocean Tone',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Coastal Blue',
    hexCode: '#385E7B',
  },
  {
    id: 'c-7367',
    title: 'Storm Blue (7367)',
    subtitle: 'Tempest Ocean Blue • Deep Maritime Hue',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Coastal Blue',
    hexCode: '#52768B',
  },
  {
    id: 'c-7368',
    title: 'Thunder Bay (7368)',
    subtitle: 'Misty Slate Cyan • Balanced Cool Tone',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Coastal Blue',
    hexCode: '#6D8E9F',
  },
  {
    id: 'c-7369',
    title: 'Harbor Fog (7369)',
    subtitle: 'Airy Maritime Blue • Soft Calm Shade',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Coastal Blue',
    hexCode: '#81A2B2',
  },
  {
    id: 'c-7370',
    title: 'Sea Ridge (7370)',
    subtitle: 'Breezy Sky Cyan • Fresh Living Room Hue',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Coastal Blue',
    hexCode: '#9BBCC8',
  },
  {
    id: 'c-7371',
    title: 'Water Rapids (7371)',
    subtitle: 'Fresh Pastel Aquamarine • Bright Gentle Tone',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Coastal Blue',
    hexCode: '#A6C2C7',
  },
  {
    id: 'c-7372',
    title: 'Phantom Lake (7372)',
    subtitle: 'Ethereal Cyan Off-White • Light & Airy',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Off-White',
    hexCode: '#D8E5E2',
  },
  {
    id: 'c-8461',
    title: 'Stone Creek (8461)',
    subtitle: 'Deep Olive-Brown Stone • Earthy Neutral',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Earth Taupe',
    hexCode: '#4F4B3F',
  },
  {
    id: 'c-8462',
    title: 'Riverbed Sand (8462)',
    subtitle: 'Dark Brownish-Grey • Earthy Accent',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Earth Taupe',
    hexCode: '#6B675A',
  },
  {
    id: 'c-8463',
    title: 'Rock Canyon (8463)',
    subtitle: 'Muted Olive-Grey Stone • Warm Neutral',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Earth Taupe',
    hexCode: '#8E897B',
  },
  {
    id: 'c-8464',
    title: 'Antarctica (8464)',
    subtitle: 'Medium Taupe-Grey • Balanced Warm Neutral',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Earth Taupe',
    hexCode: '#A8A093',
  },
  {
    id: 'c-8465',
    title: 'Desert Beige (8465)',
    subtitle: 'Medium Light Beige-Grey • Timeless Warmth',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Earth Taupe',
    hexCode: '#C3BBB0',
  },
  {
    id: 'c-8466',
    title: 'Twinkling Star (8466)',
    subtitle: 'Soft Greige Linen • Peaceful Neutral',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Earth Taupe',
    hexCode: '#D3C9BC',
  },
  {
    id: 'c-8467',
    title: 'Desert Palm (8467)',
    subtitle: 'Sun-Washed Light Beige • Organic Warmth',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Earth Taupe',
    hexCode: '#E0D9CD',
  },
  {
    id: 'c-4148',
    title: 'Enlighten-N (4148)',
    subtitle: 'Architectural Off-White • Bright Ceiling White',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Off-White',
    hexCode: '#EBE8DF',
  },
  {
    id: 'c-0509',
    title: 'Geranium (0509)',
    subtitle: 'Vibrant Warm Crimson • Rich Bold Statement',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Crimson',
    hexCode: '#C33B2E',
  },
  {
    id: 'c-8078',
    title: 'May Fair (8078)',
    subtitle: 'Deep Heritage Rose-Red • Warm Accent',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Rose Bloom',
    hexCode: '#C55355',
  },
  {
    id: 'c-8079',
    title: 'Pink Accent (8079)',
    subtitle: 'Berry-Rose Pink Accent • Modern Blush',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Rose Bloom',
    hexCode: '#D26C78',
  },
  {
    id: 'c-8080',
    title: 'Pink Carnation (8080)',
    subtitle: 'Classic Carnation Pink • Soft Bedroom Hue',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Rose Bloom',
    hexCode: '#D88992',
  },
  {
    id: 'c-8081',
    title: 'Desert Bloom (8081)',
    subtitle: 'Earthy Terracotta Blush • Warm Atmosphere',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Rose Bloom',
    hexCode: '#D49C9C',
  },
  {
    id: 'c-8082',
    title: 'Rose Debut (8082)',
    subtitle: 'Subtle Dusty Rose Blush • Gentle Comfort',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Rose Bloom',
    hexCode: '#D8A5AD',
  },
  {
    id: 'c-8083',
    title: 'Summer Pink (8083)',
    subtitle: 'Gentle Pastel Summer Pink • Light & Fresh',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Rose Bloom',
    hexCode: '#DCBEC1',
  },
  {
    id: 'c-8084',
    title: 'Tinge Of Rose (8084)',
    subtitle: 'Airy Rose Off-White Quartz • Soft Highlight',
    category: 'color',
    targetHref: '#color-gallery',
    badge: 'Off-White',
    hexCode: '#E5E1E2',
  },
  // Product Guides & Tools
  {
    id: 'g-1',
    title: 'Sheen & Finish Selection Guide',
    subtitle: 'Matte, Eggshell, Silk & Semi-Gloss Comparison',
    category: 'guide',
    targetHref: '#explore-products',
    badge: 'Guide',
  },
  {
    id: 'g-2',
    title: 'Room Transformation Before & After',
    subtitle: 'Real room transformation comparison slider',
    category: 'guide',
    targetHref: '#transformation',
    badge: 'Showcase',
  },
  {
    id: 'g-3',
    title: 'Wall-by-Wall Paint & Can Pack Calculator',
    subtitle: 'Calculate exact litres & zero-waste can combo for your walls',
    category: 'guide',
    targetHref: '#product-guides',
    badge: 'Calculator',
  },
  {
    id: 'g-4',
    title: 'Shade Matcher from Photo',
    subtitle: 'Extract exact wall shade, hex, and trim whites from photos',
    category: 'guide',
    targetHref: '#color-gallery',
    badge: 'Shade Matcher',
  },
  {
    id: 'g-5',
    title: '3D Color Shade Dome Gallery',
    subtitle: 'Interactive 3D spherical dome swatch explorer',
    category: 'guide',
    targetHref: '#color-gallery',
    badge: '3D Dome',
  },
  {
    id: 'g-6',
    title: 'Photo Color Matcher',
    subtitle: 'Upload or snap any photo to find exact Asian Paints shade & trim whites',
    category: 'guide',
    targetHref: '#photo-matcher',
    badge: 'New Tool',
  },
];

interface NavbarProps {
  logoName: string;
  navItems: NavItem[];
  loginButtonLabel: string;
  onOpenLogin: () => void;
  isLoggedIn?: boolean;
  activeSectionId?: string;
  onNavClick?: (href: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  logoName,
  navItems,
  loginButtonLabel,
  onOpenLogin,
  isLoggedIn = false,
  activeSectionId,
  onNavClick,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const lastScrollY = useRef(0);

  // Smart directional scroll detection:
  // - When scrolling DOWN: Header slides up/hides so the full hero and screen are unblocked.
  // - When scrolling UP: Header slides back down smoothly into view.
  // - When at the top (scrollY <= 10): Header stays naturally connected to the page canvas.
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      // At the top, always show
      if (currentScrollY <= 20) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + 6) {
        // Scrolling DOWN -> hide header
        if (!isSearchFocused && !isMobileSearchOpen) {
          setIsVisible(false);
        }
      } else if (currentScrollY < lastScrollY.current - 6) {
        // Scrolling UP -> reveal header
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSearchFocused, isMobileSearchOpen]);

  // Filter search database based on query
  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : SEARCH_DATABASE.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.badge?.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setIsSearchFocused(false);
        setIsMobileSearchOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close search suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (targetHref: string) => {
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
    setSearchQuery('');
    if (onNavClick) {
      onNavClick(targetHref);
    } else {
      const elem = document.querySelector(targetHref);
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ease-in-out ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-full opacity-0 pointer-events-none sm:translate-y-0 sm:opacity-100 sm:pointer-events-auto'
      } ${
        isScrolled
          ? 'bg-[#F8F4EC]/85 dark:bg-[#0E131F]/85 backdrop-blur-xl border-b border-[#E8E2D5]/80 dark:border-white/10 shadow-xs'
          : 'bg-[#F8F4EC]/70 dark:bg-[#0E131F]/70 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Top Left: Logo - Protected with shrink-0 and min-w-max */}
        <div className="flex items-center shrink-0 min-w-max z-10">
          <a 
            href="#hero" 
            onClick={(e) => {
              e.preventDefault();
              if (onNavClick) onNavClick('#hero');
            }}
            className="group focus:outline-none cursor-pointer block"
            id="nav-logo-link"
            title="HomeSelect - Home"
          >
            <BrandLogo logoName={logoName} fontStyle="italic-serif" />
          </a>
        </div>

        {/* Centre: Nav Links with generous breathing room and zero overlap */}
        <nav className="hidden lg:flex items-center justify-center flex-1 max-w-xl xl:max-w-2xl px-4 space-x-4 xl:space-x-7" aria-label="Main navigation">
          {navItems.map((item) => {
            const isItemActive = activeSectionId 
              ? item.href === `#${activeSectionId}` 
              : item.isActive;

            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavClick) {
                    onNavClick(item.href);
                  } else {
                    const elem = document.querySelector(item.href);
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`group relative text-xs xl:text-sm tracking-wide transition-colors duration-300 py-1.5 font-bold cursor-pointer whitespace-nowrap ${
                  isItemActive 
                    ? 'text-[#243B7A] dark:text-[#60A5FA]' 
                    : 'text-[#5C6066] dark:text-[#94A3B8] hover:text-[#243B7A] dark:hover:text-[#60A5FA]'
                }`}
              >
                <span>{item.label}</span>
                {/* Active Indicator Line */}
                <span 
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#243B7A] dark:bg-[#60A5FA] rounded-full transition-all duration-300 transform origin-left ${
                    isItemActive 
                      ? 'scale-x-100 opacity-100' 
                      : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-40'
                  }`} 
                />
              </a>
            );
          })}
        </nav>

        {/* Top Right: Search Bar, Dark Mode Toggle & Login Button */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          
          {/* Single Unified Search Input (Desktop & Tablet) */}
          <div ref={searchContainerRef} className="relative hidden sm:block">
            <div className={`relative flex items-center bg-white/85 dark:bg-[#162032]/85 hover:bg-white dark:hover:bg-[#1A263D] focus-within:bg-white dark:focus-within:bg-[#1A263D] border rounded-full px-3.5 py-1.5 transition-all duration-300 backdrop-blur-md ${
              isSearchFocused 
                ? 'border-[#243B7A] dark:border-[#60A5FA] ring-2 ring-[#243B7A]/15 dark:ring-[#60A5FA]/20 w-60 lg:w-72 shadow-md' 
                : 'border-[#E8E2D5] dark:border-white/10 hover:border-[#243B7A]/40 dark:hover:border-white/25 w-44 lg:w-56 shadow-2xs'
            }`}>
              <Search className="w-3.5 h-3.5 text-[#5C6066] dark:text-[#94A3B8] shrink-0 mr-2" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search paint, color (e.g. 7366), or finish..."
                className="bg-transparent text-[#1A1A1A] dark:text-[#F1F4F9] placeholder-[#8C9098] dark:placeholder-[#64748B] outline-none text-xs w-full font-medium"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-0.5 text-[#8C9098] dark:text-[#64748B] hover:text-[#1A1A1A] dark:hover:text-[#F1F4F9] transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden lg:inline-block text-[9px] text-[#8C9098] dark:text-[#94A3B8] bg-[#F8F4EC] dark:bg-[#0E131F] px-1.5 py-0.5 rounded border border-[#E8E2D5] dark:border-white/10 font-mono shrink-0 ml-1">
                  Ctrl+K
                </kbd>
              )}
            </div>

            {/* Quick Suggestions / Search Results Dropdown Popover */}
            {isSearchFocused && (
              <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white/95 dark:bg-[#162032]/95 backdrop-blur-2xl rounded-2xl border border-[#E8E2D5] dark:border-white/10 shadow-2xl p-3 z-50 animate-fade-in max-h-96 overflow-y-auto">
                
                {searchQuery.trim() === '' ? (
                  <div className="p-3 text-xs space-y-3">
                    <p className="font-bold text-[#243B7A] dark:text-[#60A5FA] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#E68A00] dark:text-[#F59E0B]" />
                      <span>Search on HomeSelect</span>
                    </p>
                    
                    <div className="space-y-2">
                      <div className="text-[10px] font-semibold text-[#5C6066] dark:text-[#94A3B8] uppercase">1. By Paint Product:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { label: 'Silk Velvet (Interior)', href: '#explore-products' },
                          { label: 'Royal Shield (Exterior)', href: '#explore-products' },
                          { label: 'Pure Mineral (Zero-VOC)', href: '#explore-products' },
                          { label: 'Satin Enamel (Doors)', href: '#explore-products' },
                        ].map((chip) => (
                          <button
                            key={chip.label}
                            onClick={() => handleSelectResult(chip.href)}
                            className="px-2.5 py-1 rounded-full bg-[#F8F4EC] dark:bg-[#0E131F] text-[#243B7A] dark:text-[#93C5FD] text-xs font-medium hover:bg-[#243B7A] dark:hover:bg-[#3B82F6] hover:text-white dark:hover:text-white transition-colors cursor-pointer border border-[#E8E2D5] dark:border-white/10"
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] font-semibold text-[#5C6066] dark:text-[#94A3B8] uppercase">2. By Color Shade / Code:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { label: 'Ashberry (7366)', href: '#color-gallery' },
                          { label: 'Storm Blue (7367)', href: '#color-gallery' },
                          { label: 'Jaipur Clay', href: '#color-gallery' },
                          { label: 'Stone Creek (8461)', href: '#color-gallery' },
                        ].map((chip) => (
                          <button
                            key={chip.label}
                            onClick={() => handleSelectResult(chip.href)}
                            className="px-2.5 py-1 rounded-full bg-[#F8F4EC] dark:bg-[#0E131F] text-[#243B7A] dark:text-[#93C5FD] text-xs font-medium hover:bg-[#243B7A] dark:hover:bg-[#3B82F6] hover:text-white dark:hover:text-white transition-colors cursor-pointer border border-[#E8E2D5] dark:border-white/10"
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] font-semibold text-[#5C6066] dark:text-[#94A3B8] uppercase">3. By Tool & Guide:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { label: 'Wall Paint Calculator', href: '#product-guides' },
                          { label: 'Shade Matcher', href: '#color-gallery' },
                          { label: 'Room Transformation', href: '#transformation' },
                        ].map((chip) => (
                          <button
                            key={chip.label}
                            onClick={() => handleSelectResult(chip.href)}
                            className="px-2.5 py-1 rounded-full bg-[#F8F4EC] dark:bg-[#0E131F] text-[#243B7A] dark:text-[#93C5FD] text-xs font-medium hover:bg-[#243B7A] dark:hover:bg-[#3B82F6] hover:text-white dark:hover:text-white transition-colors cursor-pointer border border-[#E8E2D5] dark:border-white/10"
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-[10px] font-bold text-[#5C6066] dark:text-[#94A3B8] uppercase tracking-wider border-b border-[#E8E2D5]/60 dark:border-white/10 mb-1 flex items-center justify-between">
                      <span>{searchResults.length} Results Found</span>
                      <span>Press Esc to close</span>
                    </div>

                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectResult(item.targetHref)}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#F8F4EC] dark:hover:bg-[#1E293B] transition-colors flex items-center justify-between group cursor-pointer border border-transparent hover:border-[#E8E2D5] dark:hover:border-white/10"
                      >
                        <div className="flex items-start gap-2.5 min-w-0 pr-2">
                          {item.hexCode ? (
                            <div 
                              className="w-7 h-7 rounded-lg border border-black/10 dark:border-white/10 shrink-0 mt-0.5 shadow-2xs"
                              style={{ backgroundColor: item.hexCode }}
                            />
                          ) : item.category === 'product' ? (
                            <div className="w-7 h-7 rounded-lg bg-[#243B7A]/10 dark:bg-[#3B82F6]/20 text-[#243B7A] dark:text-[#60A5FA] flex items-center justify-center shrink-0 mt-0.5">
                              <Paintbrush className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-[#E68A00]/10 dark:bg-[#F59E0B]/20 text-[#E68A00] dark:text-[#F59E0B] flex items-center justify-center shrink-0 mt-0.5">
                              <BookOpen className="w-3.5 h-3.5" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1A1A1A] dark:text-[#F1F4F9] group-hover:text-[#243B7A] dark:group-hover:text-[#60A5FA] transition-colors truncate">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-[#5C6066] dark:text-[#94A3B8] truncate">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1">
                          {item.badge && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-[#0E131F] border border-[#E8E2D5] dark:border-white/10 text-[#243B7A] dark:text-[#93C5FD] uppercase tracking-wider">
                              {item.badge}
                            </span>
                          )}
                          <ArrowRight className="w-3.5 h-3.5 text-[#8C9098] dark:text-[#64748B] group-hover:text-[#243B7A] dark:group-hover:text-[#60A5FA] group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-[#5C6066] dark:text-[#94A3B8]">
                    <p className="font-semibold text-[#1A1A1A] dark:text-[#F1F4F9] mb-1">No exact paint matches found</p>
                    <p>Try searching for "Silk", "Terracotta", "Exterior", or "Sheen".</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Search Icon Toggle */}
          <button
            onClick={() => {
              setIsMobileSearchOpen(!isMobileSearchOpen);
              setTimeout(() => mobileInputRef.current?.focus(), 100);
            }}
            className="sm:hidden p-2 rounded-full border border-[#E8E2D5] dark:border-white/10 bg-white/90 dark:bg-[#162032]/90 text-[#5C6066] dark:text-[#94A3B8] hover:text-[#243B7A] dark:hover:text-[#60A5FA] hover:border-[#243B7A] transition-colors cursor-pointer"
            title="Search"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Dark / Light Theme Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 sm:p-2.5 rounded-full bg-white/85 dark:bg-[#162032]/85 border border-[#E8E2D5] dark:border-white/10 text-[#5C6066] dark:text-[#F1F4F9] hover:text-[#243B7A] dark:hover:text-[#F59E0B] hover:border-[#243B7A]/40 dark:hover:border-amber-400/40 transition-all duration-300 backdrop-blur-md cursor-pointer shadow-2xs hover:shadow-xs shrink-0"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-[#F59E0B] transition-transform duration-300 rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-[#243B7A] transition-transform duration-300 rotate-0 hover:-rotate-12" />
            )}
          </button>

          {/* Login / Account Trigger Button */}
          <button
            onClick={onOpenLogin}
            id="login-panel-trigger"
            className="group relative inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold rounded-full bg-white/90 dark:bg-[#162032]/90 text-[#243B7A] dark:text-[#93C5FD] border border-[#243B7A] dark:border-[#3B82F6]/60 backdrop-blur-md overflow-hidden transition-all duration-300 hover:text-white dark:hover:text-white hover:shadow-md active:scale-95 cursor-pointer shrink-0"
          >
            {/* Smooth color fill effect */}
            <span className="absolute inset-0 bg-[#243B7A] dark:bg-[#3B82F6] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            
            <span className="relative z-10 flex items-center gap-1.5 uppercase tracking-wider">
              {isLoggedIn ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-[#3F8F6B] group-hover:text-white" />
                  <span>My Account</span>
                </>
              ) : (
                loginButtonLabel
              )}
            </span>
          </button>
        </div>

      </div>

      {/* Expandable Single Mobile Search Bar (Only shown on click) */}
      {isMobileSearchOpen && (
        <div className="sm:hidden border-t border-[#E8E2D5]/70 dark:border-white/10 bg-white/95 dark:bg-[#162032]/95 backdrop-blur-xl p-3 animate-fade-in shadow-md">
          <div className="relative flex items-center bg-[#F8F4EC] dark:bg-[#0E131F] border border-[#E8E2D5] dark:border-white/10 rounded-full px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-[#5C6066] dark:text-[#94A3B8] shrink-0 mr-2" />
            <input
              ref={mobileInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search paints, colors..."
              className="bg-transparent text-[#1A1A1A] dark:text-[#F1F4F9] placeholder-[#8C9098] dark:placeholder-[#64748B] outline-none text-xs w-full font-medium"
            />
            <button 
              onClick={() => {
                setSearchQuery('');
                setIsMobileSearchOpen(false);
              }} 
              className="p-0.5 text-[#8C9098] dark:text-[#94A3B8]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {searchQuery.trim() !== '' && (
            <div className="mt-2 space-y-1 max-h-60 overflow-y-auto">
              {searchResults.map((item) => (
                <button
                  key={`mobile-res-${item.id}`}
                  onClick={() => handleSelectResult(item.targetHref)}
                  className="w-full text-left p-2 rounded-lg hover:bg-[#F8F4EC] dark:hover:bg-[#1E293B] transition-colors flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-[#1A1A1A] dark:text-[#F1F4F9] truncate">{item.title}</span>
                  <span className="text-[10px] text-[#8C9098] dark:text-[#94A3B8] shrink-0 ml-2">{item.badge}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile nav bar row */}
      <div className="lg:hidden flex items-center justify-around border-t border-[#E8E2D5]/40 dark:border-white/10 bg-[#F8F4EC]/95 dark:bg-[#0E131F]/95 backdrop-blur-md px-3 py-1.5 overflow-x-auto">
        {navItems.map((item) => {
          const isItemActive = activeSectionId 
            ? item.href === `#${activeSectionId}` 
            : item.isActive;

          return (
            <a
              key={`mobile-${item.id}`}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                if (onNavClick) {
                  onNavClick(item.href);
                } else {
                  const elem = document.querySelector(item.href);
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`text-[11px] sm:text-xs tracking-wide whitespace-nowrap transition-all duration-300 px-2.5 py-1 border-b-2 ${
                isItemActive 
                  ? 'text-[#243B7A] dark:text-[#60A5FA] font-bold border-[#243B7A] dark:border-[#60A5FA]' 
                  : 'text-[#5C6066] dark:text-[#94A3B8] font-medium border-transparent'
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </header>
  );
};

