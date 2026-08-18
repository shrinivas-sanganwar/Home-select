import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sun, 
  Check, 
  Copy, 
  Palette,
  Maximize2,
  Minimize2,
  Search,
  Sparkles,
  Home,
  Moon,
  Lamp,
  X,
  Grid,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Layers,
  ArrowRight,
  BookmarkCheck,
  Compass,
  Rotate3d
} from 'lucide-react';

export interface ColorShade {
  id: string;
  code: string;
  name: string;
  hex: string;
  family: 'blues' | 'neutrals' | 'roses';
  familyLabel: string;
  toneDescription: string;
  toneType: 'Warm' | 'Cool' | 'Balanced Neutral';
  bestRoomPlacement: string;
  recommendedLighting: string;
  finishOptions: string[];
  simpleDescription: string;
  matchingTrimHex: string;
  matchingTrimName: string;
}

export const ALL_COLOR_SHADES: ColorShade[] = [
  // ==========================================
  // GROUP 1: COASTAL BLUES & COOL SHADES (7366 - 7372)
  // ==========================================
  {
    id: 'sh-7366',
    code: '7366',
    name: 'Ashberry',
    hex: '#385E7B',
    family: 'blues',
    familyLabel: 'Coastal Blues & Cool Tones',
    toneDescription: 'Deep Royal Blue',
    toneType: 'Cool',
    bestRoomPlacement: 'Living Room Feature Wall, Study Room, Entrance Arch',
    recommendedLighting: 'Looks majestic under warm yellow lights & evening lamps',
    finishOptions: ['Smooth Matte', 'Soft Sheen', 'Royale Luxury'],
    simpleDescription: 'A rich, deep architectural blue that gives your living room or study a grand royal look.',
    matchingTrimHex: '#EBE8DF',
    matchingTrimName: 'Enlighten White (4148)',
  },
  {
    id: 'sh-7367',
    code: '7367',
    name: 'Storm Blue',
    hex: '#52768B',
    family: 'blues',
    familyLabel: 'Coastal Blues & Cool Tones',
    toneDescription: 'Calm Ocean Blue',
    toneType: 'Cool',
    bestRoomPlacement: 'Master Bedroom, Home Office, TV Feature Wall',
    recommendedLighting: 'Balanced natural daylight and soft ceiling lights',
    finishOptions: ['Soft Sheen', 'Smooth Matte'],
    simpleDescription: 'A peaceful, calming ocean blue shade that makes bedrooms feel relaxed and restful.',
    matchingTrimHex: '#E0D9CD',
    matchingTrimName: 'Desert Palm (8467)',
  },
  {
    id: 'sh-7368',
    code: '7368',
    name: 'Thunder Bay',
    hex: '#6D8E9F',
    family: 'blues',
    familyLabel: 'Coastal Blues & Cool Tones',
    toneDescription: 'Misty Sky Blue',
    toneType: 'Cool',
    bestRoomPlacement: 'Living Room, Balcony Foyer, Dining Area',
    recommendedLighting: 'Bright morning sunlight & open balcony light',
    finishOptions: ['Soft Sheen', 'Washable Smooth'],
    simpleDescription: 'A fresh, crisp sky blue that brings an airy, open feel to living rooms and hallways.',
    matchingTrimHex: '#D3C9BC',
    matchingTrimName: 'Twinkling Star (8466)',
  },
  {
    id: 'sh-7369',
    code: '7369',
    name: 'Harbor Fog',
    hex: '#81A2B2',
    family: 'blues',
    familyLabel: 'Coastal Blues & Cool Tones',
    toneDescription: 'Airy Breeze Blue',
    toneType: 'Cool',
    bestRoomPlacement: 'Children Bedroom, Guest Room, Corridors',
    recommendedLighting: 'Daylight through windows & white ambient LED',
    finishOptions: ['Smooth Matte', 'Soft Sheen'],
    simpleDescription: 'Soft and refreshing pastel blue that reflects daylight nicely and keeps rooms looking spacious.',
    matchingTrimHex: '#C3BBB0',
    matchingTrimName: 'Desert Beige (8465)',
  },
  {
    id: 'sh-7370',
    code: '7370',
    name: 'Sea Ridge',
    hex: '#9BBCC8',
    family: 'blues',
    familyLabel: 'Coastal Blues & Cool Tones',
    toneDescription: 'Cool Pastel Cyan',
    toneType: 'Cool',
    bestRoomPlacement: 'Kitchen Walls, Kids Room, Bathroom Accent',
    recommendedLighting: 'Bright daylight & morning sunshine',
    finishOptions: ['Soft Sheen', 'Smooth Matte'],
    simpleDescription: 'A gentle sky tint with a peaceful mood that makes compact rooms feel open and brighter.',
    matchingTrimHex: '#A8A093',
    matchingTrimName: 'Antarctica (8464)',
  },
  {
    id: 'sh-7371',
    code: '7371',
    name: 'Water Rapids',
    hex: '#A6C2C7',
    family: 'blues',
    familyLabel: 'Coastal Blues & Cool Tones',
    toneDescription: 'Fresh Water Aqua',
    toneType: 'Cool',
    bestRoomPlacement: 'Pooja Room, Living Room, Sunroom',
    recommendedLighting: 'Soft daylight and gentle overhead lights',
    finishOptions: ['Soft Sheen', 'Royale Luxury'],
    simpleDescription: 'A clean, soothing water aqua shade that creates a pure, peaceful atmosphere.',
    matchingTrimHex: '#8E897B',
    matchingTrimName: 'Rock Canyon (8463)',
  },
  {
    id: 'sh-7372',
    code: '7372',
    name: 'Phantom Lake',
    hex: '#D8E5E2',
    family: 'blues',
    familyLabel: 'Coastal Blues & Cool Tones',
    toneDescription: 'Soft Pearl Off-White',
    toneType: 'Balanced Neutral',
    bestRoomPlacement: 'Full House Base Wall, Hallways, Ceilings',
    recommendedLighting: 'Universal light (makes any room look 2x brighter)',
    finishOptions: ['Smooth Matte', 'Soft Sheen', 'Royale Luxury'],
    simpleDescription: 'A bright, elegant pearl off-white with a subtle cool undertone, perfect as the main color for the whole home.',
    matchingTrimHex: '#385E7B',
    matchingTrimName: 'Ashberry Blue (7366)',
  },

  // ==========================================
  // GROUP 2: EARTHY TAUPES & WARM GREIGES (8461 - 8467, 4148)
  // ==========================================
  {
    id: 'sh-8461',
    code: '8461',
    name: 'Stone Creek',
    hex: '#4F4B3F',
    family: 'neutrals',
    familyLabel: 'Warm Earthy Neutrals & Greiges',
    toneDescription: 'Deep Earthy Brown-Olive',
    toneType: 'Warm',
    bestRoomPlacement: 'Main Hallway Pillar, TV Unit Wall, Dining Alcove',
    recommendedLighting: 'Warm 2700K spot lights & hanging lamps',
    finishOptions: ['Smooth Matte', 'Royale Luxury'],
    simpleDescription: 'A rich natural stone brown that gives wooden furniture and warm lights a solid, grounding presence.',
    matchingTrimHex: '#EBE8DF',
    matchingTrimName: 'Enlighten White (4148)',
  },
  {
    id: 'sh-8462',
    code: '8462',
    name: 'Riverbed Sand',
    hex: '#6B675A',
    family: 'neutrals',
    familyLabel: 'Warm Earthy Neutrals & Greiges',
    toneDescription: 'Warm Mineral Grey',
    toneType: 'Warm',
    bestRoomPlacement: 'Living Room, Dining Room, Staircase Wall',
    recommendedLighting: 'Warm incandescent light & soft natural sunlight',
    finishOptions: ['Soft Sheen', 'Smooth Matte'],
    simpleDescription: 'A balanced river-stone shade that pairs naturally with wooden doors and brass decor.',
    matchingTrimHex: '#E0D9CD',
    matchingTrimName: 'Desert Palm (8467)',
  },
  {
    id: 'sh-8463',
    code: '8463',
    name: 'Rock Canyon',
    hex: '#8E897B',
    family: 'neutrals',
    familyLabel: 'Warm Earthy Neutrals & Greiges',
    toneDescription: 'Timeless Warm Greige',
    toneType: 'Warm',
    bestRoomPlacement: 'Master Bedroom, Living Room, Guest Room',
    recommendedLighting: 'Natural sunlight and soft warm lamps',
    finishOptions: ['Smooth Matte', 'Soft Sheen'],
    simpleDescription: 'An all-time favorite neutral greige that brings a cozy, welcoming warmth to family rooms.',
    matchingTrimHex: '#A6C2C7',
    matchingTrimName: 'Water Rapids (7371)',
  },
  {
    id: 'sh-8464',
    code: '8464',
    name: 'Antarctica',
    hex: '#A8A093',
    family: 'neutrals',
    familyLabel: 'Warm Earthy Neutrals & Greiges',
    toneDescription: 'Balanced Modern Grey',
    toneType: 'Balanced Neutral',
    bestRoomPlacement: 'Living Room, Modular Kitchen, Office Room',
    recommendedLighting: 'Balanced daylight and modern 3000K LED',
    finishOptions: ['Soft Sheen', 'Smooth Matte'],
    simpleDescription: 'A modern neutral grey that matches easily with any curtain, sofa, or tile combination.',
    matchingTrimHex: '#9BBCC8',
    matchingTrimName: 'Sea Ridge (7370)',
  },
  {
    id: 'sh-8465',
    code: '8465',
    name: 'Desert Beige',
    hex: '#C3BBB0',
    family: 'neutrals',
    familyLabel: 'Warm Earthy Neutrals & Greiges',
    toneDescription: 'Warm Sand Beige',
    toneType: 'Warm',
    bestRoomPlacement: 'Drawing Room, Dining Hall, Family Lounge',
    recommendedLighting: 'Warm sunlight and soft recessed ceiling lights',
    finishOptions: ['Soft Sheen', 'Smooth Matte'],
    simpleDescription: 'A comfortable sun-warmed beige that feels welcoming and never looks dull or yellow.',
    matchingTrimHex: '#81A2B2',
    matchingTrimName: 'Harbor Fog (7369)',
  },
  {
    id: 'sh-8466',
    code: '8466',
    name: 'Twinkling Star',
    hex: '#D3C9BC',
    family: 'neutrals',
    familyLabel: 'Warm Earthy Neutrals & Greiges',
    toneDescription: 'Soft Linen Cream',
    toneType: 'Warm',
    bestRoomPlacement: 'Whole House Main Base, Bedroom, Hallway',
    recommendedLighting: 'Natural light throughout the day',
    finishOptions: ['Smooth Matte', 'Soft Sheen', 'Royale Luxury'],
    simpleDescription: 'A soft, calming linen cream shade that makes your entire home feel bright, clean, and spacious.',
    matchingTrimHex: '#6D8E9F',
    matchingTrimName: 'Thunder Bay (7368)',
  },
  {
    id: 'sh-8467',
    code: '8467',
    name: 'Desert Palm',
    hex: '#E0D9CD',
    family: 'neutrals',
    familyLabel: 'Warm Earthy Neutrals & Greiges',
    toneDescription: 'Luminous Off-White',
    toneType: 'Warm',
    bestRoomPlacement: 'Ceilings, Main Walls, Open Plan Spaces',
    recommendedLighting: 'Universal daylight & warm ambient LED',
    finishOptions: ['Smooth Matte', 'Soft Sheen'],
    simpleDescription: 'An airy, bright off-white that bounces maximum daylight around the house.',
    matchingTrimHex: '#52768B',
    matchingTrimName: 'Storm Blue (7367)',
  },
  {
    id: 'sh-4148',
    code: '4148',
    name: 'Enlighten White',
    hex: '#EBE8DF',
    family: 'neutrals',
    familyLabel: 'Warm Earthy Neutrals & Greiges',
    toneDescription: 'Pure Bright White',
    toneType: 'Balanced Neutral',
    bestRoomPlacement: 'Ceilings, Doors, Window Frames, Full Home Base',
    recommendedLighting: 'Any lighting condition',
    finishOptions: ['Smooth Matte', 'Soft Sheen', 'High Gloss'],
    simpleDescription: 'A premium architectural warm white that gives clean lines to ceilings, doors, and trims.',
    matchingTrimHex: '#4F4B3F',
    matchingTrimName: 'Stone Creek (8461)',
  },

  // ==========================================
  // GROUP 3: WARM ROSES & FESTIVE BLOOMS (0509, 8078 - 8084)
  // ==========================================
  {
    id: 'sh-0509',
    code: '0509',
    name: 'Geranium Red',
    hex: '#C33B2E',
    family: 'roses',
    familyLabel: 'Warm Roses & Festive Blooms',
    toneDescription: 'Festive Crimson Accent',
    toneType: 'Warm',
    bestRoomPlacement: 'Pooja Room, Dining Feature Wall, Entry Foyer',
    recommendedLighting: 'Warm decorative lamps & yellow focus spots',
    finishOptions: ['Soft Sheen', 'Royale Luxury', 'High Gloss'],
    simpleDescription: 'A lively, festive crimson red full of warmth and celebration, ideal for dining and prayer rooms.',
    matchingTrimHex: '#D8E5E2',
    matchingTrimName: 'Phantom Lake (7372)',
  },
  {
    id: 'sh-8078',
    code: '8078',
    name: 'May Fair Rose',
    hex: '#C55355',
    family: 'roses',
    familyLabel: 'Warm Roses & Festive Blooms',
    toneDescription: 'Warm Terracotta Rose',
    toneType: 'Warm',
    bestRoomPlacement: 'Master Suite, Intimate Dining Nook, Bedroom Accent',
    recommendedLighting: 'Warm evening lamps & soft ambient LED',
    finishOptions: ['Soft Sheen', 'Smooth Matte'],
    simpleDescription: 'A warm heritage rose shade with earthy terracotta tones, perfect for cozy bedrooms.',
    matchingTrimHex: '#E0D9CD',
    matchingTrimName: 'Desert Palm (8467)',
  },
  {
    id: 'sh-8079',
    code: '8079',
    name: 'Pink Accent',
    hex: '#D26C78',
    family: 'roses',
    familyLabel: 'Warm Roses & Festive Blooms',
    toneDescription: 'Vibrant Berry Pink',
    toneType: 'Warm',
    bestRoomPlacement: 'Dressing Room, Kids Room, Feature Corner',
    recommendedLighting: 'Warm natural daylight & soft lights',
    finishOptions: ['Soft Sheen', 'Smooth Matte'],
    simpleDescription: 'A vibrant berry pink that adds energy and character to feature walls and dressing areas.',
    matchingTrimHex: '#D3C9BC',
    matchingTrimName: 'Twinkling Star (8466)',
  },
  {
    id: 'sh-8080',
    code: '8080',
    name: 'Pink Carnation',
    hex: '#D88992',
    family: 'roses',
    familyLabel: 'Warm Roses & Festive Blooms',
    toneDescription: 'Sweet Blossom Pink',
    toneType: 'Warm',
    bestRoomPlacement: 'Girls Bedroom, Reading Corner, Balcony Niche',
    recommendedLighting: 'Morning sunlight & soft lamps',
    finishOptions: ['Soft Sheen', 'Smooth Matte'],
    simpleDescription: 'A cheerful floral blossom pink that keeps rooms feeling cheerful, warm, and happy.',
    matchingTrimHex: '#C3BBB0',
    matchingTrimName: 'Desert Beige (8465)',
  },
  {
    id: 'sh-8081',
    code: '8081',
    name: 'Desert Bloom',
    hex: '#D49C9C',
    family: 'roses',
    familyLabel: 'Warm Roses & Festive Blooms',
    toneDescription: 'Soft Terracotta Blush',
    toneType: 'Warm',
    bestRoomPlacement: 'Living Room Accent, Bedroom, Verandah Wall',
    recommendedLighting: 'Natural sunlight and warm overhead lights',
    finishOptions: ['Smooth Matte', 'Soft Sheen'],
    simpleDescription: 'An earthen blush pink inspired by natural clay pottery that pairs beautifully with wooden furniture.',
    matchingTrimHex: '#A8A093',
    matchingTrimName: 'Antarctica (8464)',
  },
  {
    id: 'sh-8082',
    code: '8082',
    name: 'Rose Debut',
    hex: '#D8A5AD',
    family: 'roses',
    familyLabel: 'Warm Roses & Festive Blooms',
    toneDescription: 'Gentle Dusty Rose',
    toneType: 'Warm',
    bestRoomPlacement: 'Master Bedroom, Living Room, Dressing Area',
    recommendedLighting: 'Soft diffused natural light',
    finishOptions: ['Soft Sheen', 'Smooth Matte'],
    simpleDescription: 'A sophisticated dusty rose tint that gives a gentle, romantic, and peaceful mood to bedrooms.',
    matchingTrimHex: '#8E897B',
    matchingTrimName: 'Rock Canyon (8463)',
  },
  {
    id: 'sh-8083',
    code: '8083',
    name: 'Summer Pink',
    hex: '#DCBEC1',
    family: 'roses',
    familyLabel: 'Warm Roses & Festive Blooms',
    toneDescription: 'Light Petal Tint',
    toneType: 'Warm',
    bestRoomPlacement: 'Bedrooms, Living Rooms, Ceilings',
    recommendedLighting: 'Bright morning light and daylight LEDs',
    finishOptions: ['Smooth Matte', 'Soft Sheen'],
    simpleDescription: 'A light, delicate pink tint that brightens up bedrooms while adding a soft warm glow.',
    matchingTrimHex: '#6B675A',
    matchingTrimName: 'Riverbed Sand (8462)',
  },
  {
    id: 'sh-8084',
    code: '8084',
    name: 'Tinge Of Rose',
    hex: '#E5E1E2',
    family: 'roses',
    familyLabel: 'Warm Roses & Festive Blooms',
    toneDescription: 'Whisper Rose White',
    toneType: 'Balanced Neutral',
    bestRoomPlacement: 'Main Living Room, Hallways, Ceilings',
    recommendedLighting: 'Universal soft diffused lighting',
    finishOptions: ['Smooth Matte', 'Soft Sheen', 'Royale Luxury'],
    simpleDescription: 'A subtle, luminous off-white with just a hint of rose petal warmth, creating a calm and welcoming home.',
    matchingTrimHex: '#C33B2E',
    matchingTrimName: 'Geranium Red (0509)',
  },
];

export const ColorShadeDomeGallery: React.FC = () => {
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roomLighting, setRoomLighting] = useState<'daylight' | 'warm' | 'evening'>('daylight');
  
  // View Modes: Universe Flow vs Color Groups vs Grid
  const [viewMode, setViewMode] = useState<'universe-flow' | 'fandeck' | 'flat-grid'>('universe-flow');

  // Simple Indian Paint Finish selector: Matte, Soft Sheen, High Gloss, Royale Luxury
  const [activeFinish, setActiveFinish] = useState<'matte' | 'sheen' | 'gloss' | 'royale'>('sheen');

  // Saved Swatches for comparing (up to 3 shades)
  const [savedShades, setSavedShades] = useState<ColorShade[]>([ALL_COLOR_SHADES[0], ALL_COLOR_SHADES[1]]);

  // Fullscreen Mode
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Active Index on the Universe Swatch Stage
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Smooth Drag & Momentum State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragCurrentX, setDragCurrentX] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [velocity, setVelocity] = useState<number>(0);

  // Expanded Room View Modal
  const [selectedShade, setSelectedShade] = useState<ColorShade>(ALL_COLOR_SHADES[0]);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Filtered color shades
  const filteredShades = useMemo(() => {
    return ALL_COLOR_SHADES.filter((shade) => {
      const matchFam = selectedFamily === 'all' || shade.family === selectedFamily;
      const matchQuery = !searchQuery.trim() || 
        shade.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shade.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shade.hex.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shade.bestRoomPlacement.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shade.toneDescription.toLowerCase().includes(searchQuery.toLowerCase());

      return matchFam && matchQuery;
    });
  }, [selectedFamily, searchQuery]);

  // Keep index within bounds
  useEffect(() => {
    if (currentIndex >= filteredShades.length && filteredShades.length > 0) {
      setCurrentIndex(0);
      setScrollProgress(0);
    }
  }, [filteredShades.length, currentIndex]);

  // Update selected shade when index changes
  useEffect(() => {
    if (filteredShades[currentIndex]) {
      setSelectedShade(filteredShades[currentIndex]);
    }
  }, [currentIndex, filteredShades]);

  // Toggle save/unsave shade
  const handleToggleSave = (shade: ColorShade, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedShades((prev) => {
      const exists = prev.some((s) => s.id === shade.id);
      if (exists) return prev.filter((s) => s.id !== shade.id);
      if (prev.length >= 3) return [...prev.slice(1), shade];
      return [...prev, shade];
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'universe-flow' || isRoomModalOpen) return;
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => Math.min(filteredShades.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, isRoomModalOpen, filteredShades.length, isFullscreen]);

  // Spring animation towards current index
  useEffect(() => {
    if (isDragging) return;

    let id: number;
    const target = currentIndex;

    const animate = () => {
      setScrollProgress((prev) => {
        const diff = target - prev;
        if (Math.abs(diff) < 0.005) {
          return target;
        }
        return prev + diff * 0.18;
      });
      if (Math.abs(target - scrollProgress) >= 0.005) {
        id = requestAnimationFrame(animate);
      }
    };

    id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [currentIndex, isDragging, scrollProgress]);

  // Pointer drag controls
  const handlePointerDown = (clientX: number) => {
    setIsDragging(true);
    setDragStartX(clientX);
    setDragCurrentX(clientX);
    setVelocity(0);
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragCurrentX;
    setDragCurrentX(clientX);

    const progressDelta = -deltaX / 260;
    setScrollProgress((prev) => {
      const next = prev + progressDelta;
      return Math.max(-0.4, Math.min(filteredShades.length - 0.6, next));
    });
    setVelocity(progressDelta);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    let targetIndex = Math.round(scrollProgress + velocity * 3.5);
    targetIndex = Math.max(0, Math.min(filteredShades.length - 1, targetIndex));
    setCurrentIndex(targetIndex);
  };

  // Wheel horizontal scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container || viewMode !== 'universe-flow') return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 8) {
        if (delta > 0) {
          setCurrentIndex((prev) => Math.min(filteredShades.length - 1, prev + 1));
        } else {
          setCurrentIndex((prev) => Math.max(0, prev - 1));
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [viewMode, filteredShades.length]);

  const handleCopyCode = (shade: ColorShade) => {
    navigator.clipboard.writeText(`${shade.name} (${shade.code}) - ${shade.hex}`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div 
      id="dome-gallery-section"
      className={`bg-[#0C101A] text-white rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden my-6 font-sans select-none transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none m-0 p-4 sm:p-8 overflow-hidden bg-[#080B12]' : ''
      }`}
    >
      
      {/* COSMIC UNIVERSE OF COLORS BACKGROUND */}
      <div className="absolute inset-0 bg-[#0A0D16] pointer-events-none z-0" />
      
      {/* Subtle Starfield & Celestial Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none z-0" />

      {/* Atmospheric Luminous Nebula tinted by the active color */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[420px] rounded-full blur-[130px] opacity-25 pointer-events-none transition-colors duration-700 z-0"
        style={{ backgroundColor: selectedShade.hex }}
      />

      {/* Gallery Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 relative z-10 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 text-[#E68A00] text-xs font-bold backdrop-blur-md mb-2 border border-[#E68A00]/30">
            <Rotate3d className="w-3.5 h-3.5 text-[#E68A00]" />
            <span>Dome Gallery &middot; Indian Home Color Exploration</span>
          </div>
          <h3 className="font-heading font-bold text-2xl sm:text-4xl text-white tracking-tight flex items-center gap-3">
            <span>Asian Paints Dome Gallery</span>
            {isFullscreen && (
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#E68A00]/20 text-[#E68A00] border border-[#E68A00]/40 uppercase tracking-widest">
                Full Screen
              </span>
            )}
          </h3>
          <p className="text-xs sm:text-sm text-white/70 max-w-2xl mt-1 leading-relaxed">
            Glide across our 3D Dome Stage to preview authentic Indian wall shades. Each palette features harmonizing comparative shades written in their matching tone — click or double-click any palette to open full room previews.
          </p>
        </div>

        {/* Top Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* View Modes */}
          <div className="flex items-center bg-black/60 p-1 rounded-full border border-white/15 text-xs">
            <button
              onClick={() => setViewMode('universe-flow')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
                viewMode === 'universe-flow' 
                  ? 'bg-[#E68A00] text-white shadow-md shadow-[#E68A00]/30' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Rotate3d className="w-3.5 h-3.5" />
              <span>Dome Gallery</span>
            </button>
            <button
              onClick={() => setViewMode('fandeck')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
                viewMode === 'fandeck' 
                  ? 'bg-[#E68A00] text-white shadow-md shadow-[#E68A00]/30' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Color Bands</span>
            </button>
            <button
              onClick={() => setViewMode('flat-grid')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
                viewMode === 'flat-grid' 
                  ? 'bg-[#E68A00] text-white shadow-md shadow-[#E68A00]/30' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
          </div>

          {/* Simple Indian Paint Finishes: Matte, Sheen, High Gloss, Royale Luxury */}
          <div className="flex items-center bg-black/60 p-1 rounded-full border border-white/15 text-xs">
            <span className="text-[10px] text-white/50 uppercase px-2 font-mono hidden lg:inline">Finish:</span>
            <button
              onClick={() => setActiveFinish('matte')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                activeFinish === 'matte' ? 'bg-white/20 text-white font-bold' : 'text-white/60 hover:text-white'
              }`}
              title="Smooth finish with zero glare, best for living rooms & ceilings"
            >
              Matte
            </button>
            <button
              onClick={() => setActiveFinish('sheen')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                activeFinish === 'sheen' ? 'bg-[#E68A00] text-white font-bold shadow-xs' : 'text-white/60 hover:text-white'
              }`}
              title="Halki chamak, easily washable, ideal for bedrooms & halls"
            >
              Soft Sheen
            </button>
            <button
              onClick={() => setActiveFinish('gloss')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                activeFinish === 'gloss' ? 'bg-white text-black font-bold shadow-xs' : 'text-white/60 hover:text-white'
              }`}
              title="Shining finish, durable for doors, wood, and trims"
            >
              High Gloss
            </button>
            <button
              onClick={() => setActiveFinish('royale')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                activeFinish === 'royale' ? 'bg-amber-400 text-black font-extrabold shadow-xs' : 'text-white/60 hover:text-white'
              }`}
              title="Ultra-luxurious rich wall finish"
            >
              Royale
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              isFullscreen
                ? 'bg-[#E68A00] text-white border-[#E68A00] shadow-md'
                : 'bg-black/60 text-white/90 border-white/20 hover:border-[#E68A00] hover:text-[#E68A00]'
            }`}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
          </button>

          {/* Search Shade / Code */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shade or code..."
              className="bg-black/60 text-white placeholder-white/40 text-xs px-4 py-1.5 pl-9 rounded-full border border-white/20 focus:outline-none focus:border-[#E68A00] w-32 sm:w-44 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

        </div>
      </div>

      {/* Color Family Filters */}
      <div className="space-y-3 mb-6 relative z-10">
        <div className="flex items-center gap-1.5 text-xs font-bold overflow-x-auto pb-2 scrollbar-none">
          <span className="text-white/50 text-[11px] uppercase tracking-wider mr-1 flex items-center gap-1 shrink-0">
            <Palette className="w-3.5 h-3.5 text-[#E68A00]" />
            Color Family:
          </span>
          <button
            onClick={() => { setSelectedFamily('all'); setCurrentIndex(0); }}
            className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer shrink-0 ${
              selectedFamily === 'all'
                ? 'bg-white text-black font-bold border-white shadow-md'
                : 'bg-black/40 text-white/70 border-white/10 hover:border-[#E68A00] hover:text-[#E68A00]'
            }`}
          >
            All Shades ({ALL_COLOR_SHADES.length})
          </button>

          {[
            { id: 'blues', label: 'Coastal Blues & Cool Tones (7366–7372)' },
            { id: 'neutrals', label: 'Warm Earthy Neutrals & Greiges (8461–8467, 4148)' },
            { id: 'roses', label: 'Warm Roses & Festive Blooms (0509, 8078–8084)' },
          ].map((fam) => (
            <button
              key={fam.id}
              onClick={() => { setSelectedFamily(fam.id); setCurrentIndex(0); }}
              className={`px-3 py-1.5 rounded-full border text-xs transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedFamily === fam.id
                  ? 'bg-[#E68A00] text-white font-bold border-[#E68A00] shadow-md shadow-[#E68A00]/20'
                  : 'bg-black/40 text-white/70 border-white/10 hover:border-[#E68A00] hover:text-[#E68A00]'
              }`}
            >
              {fam.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: UNIVERSE OF COLORS FLOW (ZERO OVERLAPPING, CLEAN SWATCH POPPING)  */}
      {/* ========================================================================= */}
      {viewMode === 'universe-flow' ? (
        <div 
          ref={containerRef}
          onMouseDown={(e) => handlePointerDown(e.clientX)}
          onMouseMove={(e) => handlePointerMove(e.clientX)}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={(e) => { if (e.touches[0]) handlePointerDown(e.touches[0].clientX); }}
          onTouchMove={(e) => { if (e.touches[0]) handlePointerMove(e.touches[0].clientX); }}
          onTouchEnd={handlePointerUp}
          className={`w-full rounded-3xl border border-white/10 relative overflow-hidden select-none cursor-grab active:cursor-grabbing flex flex-col justify-between p-4 sm:p-8 bg-[#090C15] shadow-2xl transition-all duration-300 ${
            isFullscreen ? 'h-[calc(100vh-220px)] min-h-[560px]' : 'h-[580px] sm:h-[640px]'
          }`}
          style={{ perspective: '1400px' }}
        >
          {/* Subtle Starlight Depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff08_0%,transparent_70%)] pointer-events-none z-0" />

          {/* Left / Right Arrow Buttons */}
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white transition-all shadow-xl hover:scale-110 hover:border-[#E68A00] hover:text-[#E68A00] disabled:opacity-20 disabled:pointer-events-none"
            title="Previous Color"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setCurrentIndex((prev) => Math.min(filteredShades.length - 1, prev + 1))}
            disabled={currentIndex === filteredShades.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white transition-all shadow-xl hover:scale-110 hover:border-[#E68A00] hover:text-[#E68A00] disabled:opacity-20 disabled:pointer-events-none"
            title="Next Color"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* FLUID 3D STAGE CONTAINER (NO OVERLAPPING CARDS) */}
          <div className="relative w-full h-full flex items-center justify-center z-20">
            {filteredShades.map((shade, idx) => {
              const offset = idx - scrollProgress;
              const isPopped = Math.abs(offset) < 0.45;
              const isHovered = hoveredIndex === idx;
              const isSaved = savedShades.some((s) => s.id === shade.id);

              if (Math.abs(offset) > 4.5) return null;

              // Spacing 330px with card width 280px ensures 50px clear space between cards
              const spacing = 330;
              const translateX = offset * spacing;
              const translateZ = -Math.abs(offset) * 110;
              const rotateY = -Math.max(-40, Math.min(40, offset * 16));
              
              const scale = isPopped ? 1.2 : Math.max(0.8, 1 - Math.abs(offset) * 0.15);
              const opacity = Math.max(0.4, 1 - Math.abs(offset) * 0.2);
              const zIndex = Math.round(500 - Math.abs(offset) * 100);

              return (
                <div
                  key={shade.id}
                  onClick={() => {
                    if (isPopped) {
                      setSelectedShade(shade);
                      setIsRoomModalOpen(true);
                    } else {
                      setCurrentIndex(idx);
                    }
                  }}
                  onDoubleClick={() => {
                    setSelectedShade(shade);
                    setIsRoomModalOpen(true);
                  }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="absolute cursor-pointer transition-transform duration-75 ease-out"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    zIndex,
                    opacity,
                  }}
                >
                  {/* CLEAN ARCHITECTURAL COLOR SWATCH SLAB */}
                  <div 
                    className={`relative w-64 sm:w-72 h-88 sm:h-[400px] rounded-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between border ${
                      isPopped
                        ? 'border-[#E68A00] ring-4 ring-[#E68A00]/40 shadow-[0_0_40px_rgba(230,138,0,0.4)]'
                        : isHovered
                          ? 'border-white/50 ring-2 ring-white/30 shadow-xl'
                          : 'border-white/15 hover:border-white/30 shadow-xl'
                    }`}
                    style={{ backgroundColor: shade.hex }}
                  >
                    {/* Finish Sheen Simulation */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {activeFinish === 'gloss' && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/40" />
                      )}
                      {activeFinish === 'sheen' && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/20" />
                      )}
                      {activeFinish === 'royale' && (
                        <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/30" />
                      )}
                      {activeFinish === 'matte' && (
                        <div className="absolute inset-0 bg-black/10" />
                      )}
                    </div>

                    {/* TOP HEADER: Shade Code & Save Status */}
                    <div className="relative z-10 p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-black/80 text-white backdrop-blur-md border border-white/20 shadow-md">
                          Shade: {shade.code}
                        </span>
                        {isSaved && (
                          <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-[#E68A00] text-white shadow-md flex items-center gap-1">
                            <BookmarkCheck className="w-3 h-3" />
                            Saved
                          </span>
                        )}
                      </div>

                      {isPopped ? (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white text-black uppercase tracking-wider flex items-center gap-1 shadow-md animate-pulse">
                          Click to Expand
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/60 text-white/70 backdrop-blur-xs">
                          {shade.toneType}
                        </span>
                      )}
                    </div>

                    {/* CENTER: PURE, CLEAN PAINT SURFACE (Unobstructed Color) */}
                    <div className="flex-1" />

                    {/* SUGGESTED MATCHING / COMPARATIVE SHADE BAR (Written in the matching color) */}
                    <div className="relative z-10 mx-3 mb-2 p-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Swatch chip in matching color */}
                        <div 
                          className="w-4.5 h-4.5 rounded-full border border-white/40 shadow-xs shrink-0 ring-1 ring-black/40"
                          style={{ backgroundColor: shade.matchingTrimHex }}
                        />
                        <div className="min-w-0">
                          <span className="text-[9px] uppercase tracking-wider text-white/60 block font-medium leading-none mb-0.5">
                            Matching Pair:
                          </span>
                          {/* The shade name and code are written in that matching color! */}
                          <span 
                            className="font-bold text-xs truncate block drop-shadow-xs"
                            style={{ color: shade.matchingTrimHex }}
                          >
                            {shade.matchingTrimName}
                          </span>
                        </div>
                      </div>

                      {/* Matching Pill Tag */}
                      <span 
                        className="text-[9px] font-bold px-2 py-0.5 rounded-md border shrink-0 font-mono"
                        style={{ 
                          color: shade.matchingTrimHex,
                          borderColor: shade.matchingTrimHex,
                          backgroundColor: `${shade.matchingTrimHex}22`
                        }}
                      >
                        Harmonizes
                      </span>
                    </div>

                    {/* BOTTOM MONOLITHIC METADATA BAR (With Room Recommendation) */}
                    <div className="relative z-10 p-3.5 bg-black/90 backdrop-blur-md border-t border-white/15 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <div className={`text-base font-bold truncate leading-tight ${
                            isPopped ? 'text-[#E68A00]' : 'text-white'
                          }`}>
                            {shade.name}
                          </div>
                          <div className="text-xs text-white/60 mt-0.5 truncate">
                            {shade.toneDescription}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <button
                            onClick={(e) => handleToggleSave(shade, e)}
                            className={`p-2 rounded-full border transition-all text-xs cursor-pointer ${
                              isSaved 
                                ? 'bg-[#E68A00] text-white border-[#E68A00]' 
                                : 'bg-white/10 text-white/70 border-white/20 hover:border-[#E68A00] hover:text-[#E68A00]'
                            }`}
                            title="Save for Comparison"
                          >
                            <BookmarkCheck className="w-3.5 h-3.5" />
                          </button>
                          <div 
                            className="p-2 rounded-full bg-white text-black shadow-md hover:scale-110 transition-transform cursor-pointer"
                            title="Double-click to expand full room preview"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      {/* Subtle Room Recommendation at the bottom (Not in the center) */}
                      <div className="text-[11px] text-white/80 truncate flex items-center gap-1.5 pt-1.5 border-t border-white/10">
                        <Home className="w-3 h-3 text-[#E68A00] shrink-0" />
                        <span className="truncate">Recommended for: <strong className="text-white font-medium">{shade.bestRoomPlacement}</strong></span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* BOTTOM MINI INDEX DOCK */}
          <div className="relative z-30 flex items-center justify-center gap-1.5 overflow-x-auto py-2 scrollbar-none">
            {filteredShades.map((shade, idx) => (
              <button
                key={shade.id}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all rounded-full cursor-pointer shrink-0 ${
                  idx === currentIndex 
                    ? 'w-7 h-2 bg-[#E68A00] ring-2 ring-[#E68A00]/50 shadow-md' 
                    : 'w-2 h-2 bg-white/30 hover:bg-white/70'
                }`}
                title={`${shade.name} (${shade.code})`}
              />
            ))}
          </div>

        </div>
      ) : viewMode === 'fandeck' ? (
        /* ========================================================================= */
        /* MODE 2: COLOR BANDS STRIP VIEW                                            */
        /* ========================================================================= */
        <div className="w-full bg-[#090C15] rounded-3xl p-6 sm:p-8 border border-white/15 relative overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E68A00]" />
              <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                Coordinated Color Bands (Deep Accents to Airy Wall Tints)
              </span>
            </div>
            <span className="text-[11px] text-white/50 hidden sm:inline">
              Click any shade to see room tips and lighting preview
            </span>
          </div>

          {/* THREE MAIN COLOR FAMILIES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'blues', title: 'Coastal Blues & Mist (7366 – 7372)' },
              { id: 'neutrals', title: 'Warm Greiges & Earthy Whites (8461 – 8467, 4148)' },
              { id: 'roses', title: 'Warm Roses & Festive Blooms (0509, 8078 – 8084)' },
            ].map((band) => {
              const bandShades = ALL_COLOR_SHADES.filter((s) => s.family === band.id);
              return (
                <div key={band.id} className="bg-black/50 rounded-2xl p-3 border border-white/10 space-y-1">
                  <div className="text-xs font-bold text-[#E68A00] uppercase tracking-wide px-2 py-1 mb-2">
                    {band.title}
                  </div>
                  
                  <div className="space-y-1 rounded-xl overflow-hidden border border-white/10 p-1 bg-black/40">
                    {bandShades.map((shade) => {
                      const isSelected = selectedShade.id === shade.id;
                      const isSaved = savedShades.some((s) => s.id === shade.id);
                      return (
                        <div
                          key={shade.id}
                          onClick={() => {
                            setSelectedShade(shade);
                            setIsRoomModalOpen(true);
                          }}
                          className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer border transition-all group ${
                            isSelected 
                              ? 'border-[#E68A00] bg-white/10 ring-2 ring-[#E68A00]' 
                              : 'border-white/5 hover:border-[#E68A00] bg-black/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-md shadow-md border border-white/20 shrink-0 group-hover:scale-105 transition-transform" 
                              style={{ backgroundColor: shade.hex }}
                            />
                            <div>
                              <div className="text-xs font-bold text-white group-hover:text-[#E68A00] transition-colors">
                                {shade.name}
                              </div>
                              <div className="text-[11px] font-mono text-white/50">Shade {shade.code} &middot; {shade.toneDescription}</div>
                              <div className="text-[10px] flex items-center gap-1 mt-0.5">
                                <span className="text-white/40">Pairs with:</span>
                                <span className="font-bold font-mono" style={{ color: shade.matchingTrimHex }}>{shade.matchingTrimName}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleToggleSave(shade, e)}
                            className={`p-1.5 rounded-full transition-all text-xs ${
                              isSaved ? 'text-[#E68A00] bg-[#E68A00]/10' : 'text-white/40 hover:text-white'
                            }`}
                            title="Save Shade"
                          >
                            <BookmarkCheck className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* MODE 3: FLAT GRID VIEW                                                    */
        /* ========================================================================= */
        <div className="w-full bg-[#090C15] rounded-3xl p-6 sm:p-8 border border-white/15 relative overflow-hidden shadow-2xl">
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-[#E68A00]" />
              <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                Verified Indian Home Color Palette ({filteredShades.length} Shades)
              </span>
            </div>
            <span className="text-[11px] text-white/50 hidden sm:inline">
              Click any shade to open room visualizer
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 relative z-10">
            {filteredShades.map((shade) => {
              const isSelected = selectedShade.id === shade.id;

              return (
                <div
                  key={shade.id}
                  onClick={() => {
                    setSelectedShade(shade);
                    setIsRoomModalOpen(true);
                  }}
                  className={`group bg-black/60 rounded-xl border transition-all duration-200 overflow-hidden cursor-pointer flex flex-col ${
                    isSelected 
                      ? 'border-[#E68A00] ring-2 ring-[#E68A00] shadow-lg' 
                      : 'border-white/10 hover:border-[#E68A00] hover:shadow-md'
                  }`}
                >
                  <div 
                    className="relative aspect-square w-full transition-transform duration-300 overflow-hidden"
                    style={{ backgroundColor: shade.hex }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/20 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black border border-[#E68A00] shadow-md flex items-center justify-center">
                        <Check className="w-3 h-3 text-[#E68A00]" />
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-black/80 flex flex-col justify-between border-t border-white/5">
                    <div className="font-semibold text-xs text-white truncate group-hover:text-[#E68A00] transition-colors">
                      {shade.name}
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[11px] font-mono">
                      <span className="text-white/70">Shade {shade.code}</span>
                      <span 
                        className="text-[10px] font-bold truncate max-w-[80px] drop-shadow-xs" 
                        style={{ color: shade.matchingTrimHex }}
                        title={`Pairs with ${shade.matchingTrimName}`}
                      >
                        ● {shade.matchingTrimName.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* FULL ROOM VISUALIZATION MODAL */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div 
            className="bg-[#0D111D] text-white w-full max-w-4xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/60">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-xl border border-white/40 shadow-md" 
                  style={{ backgroundColor: selectedShade.hex }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#E68A00]">
                      Shade Code: {selectedShade.code}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                      {selectedShade.familyLabel}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-white">
                    {selectedShade.name} Room Preview
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsRoomModalOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Room Preview & Practical Home Tips */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#090C15]">
              
              {/* LIVE ROOM WALL PREVIEW */}
              <div 
                className="w-full h-72 sm:h-84 rounded-2xl border border-white/20 relative overflow-hidden flex flex-col justify-between p-6 transition-colors duration-700 shadow-2xl"
                style={{ backgroundColor: selectedShade.hex }}
              >
                {/* Lighting Shift Filter */}
                <div 
                  className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
                    roomLighting === 'daylight' 
                      ? 'bg-gradient-to-b from-white/20 via-transparent to-black/25' 
                      : roomLighting === 'warm'
                        ? 'bg-gradient-to-b from-amber-500/25 via-amber-900/15 to-black/35'
                        : 'bg-gradient-to-b from-blue-900/35 via-indigo-950/20 to-black/55'
                  }`}
                />

                {/* Architectural baseboard molding */}
                <div className="absolute top-0 left-0 right-0 h-3 bg-white/30 backdrop-blur-xs border-b border-black/10" />
                <div className="absolute bottom-0 left-0 right-0 h-9 bg-white/25 backdrop-blur-xs border-t border-black/10 flex items-center px-4">
                  <span className="text-[10px] font-mono text-black/75 uppercase font-bold">
                    Matching Door / Border Trim &bull; {selectedShade.matchingTrimName}
                  </span>
                </div>

                {/* Lighting Selector Controls */}
                <div className="flex items-center justify-between z-10">
                  <div className="bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs flex items-center gap-2">
                    <Sun className="w-3.5 h-3.5 text-[#E68A00]" />
                    <span className="font-semibold text-white">Lighting Preview:</span>
                    <div className="flex gap-1">
                      {[
                        { id: 'daylight', label: 'Daylight' },
                        { id: 'warm', label: 'Warm LED (Night)' },
                        { id: 'evening', label: 'Evening Ambient' },
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => setRoomLighting(mode.id as any)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                            roomLighting === mode.id ? 'bg-[#E68A00] text-white font-bold' : 'text-white/60 hover:text-white'
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyCode(selectedShade)}
                    className="bg-black/70 backdrop-blur-md hover:bg-black px-3.5 py-1.5 rounded-full border border-white/20 text-xs flex items-center gap-1.5 text-white transition-all cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-[#E68A00]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Shade Copied!' : `Copy Shade ${selectedShade.code}`}</span>
                  </button>
                </div>

                {/* Center Simple Description */}
                <div className="z-10 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/20 max-w-lg self-center text-center">
                  <div className="text-sm font-bold text-white mb-1">
                    {selectedShade.name} &bull; {selectedShade.toneDescription}
                  </div>
                  <p className="text-xs text-white/85 leading-relaxed">
                    {selectedShade.simpleDescription}
                  </p>
                </div>

                {/* Best Room Recommendation */}
                <div className="z-10 flex items-center gap-2 text-xs bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-white/90 max-w-fit mb-4">
                  <Home className="w-3.5 h-3.5 text-[#E68A00]" />
                  <span><strong>Best suited for:</strong> {selectedShade.bestRoomPlacement}</span>
                </div>
              </div>

              {/* THREE SIMPLE SPECIFICATION PANELS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Panel 1: Lighting & Feeling */}
                <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
                  <div className="text-xs font-bold text-[#E68A00] uppercase mb-1 flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5" />
                    Lighting Tips
                  </div>
                  <div className="text-sm font-bold text-white mb-1.5">
                    {selectedShade.toneType} Tone
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {selectedShade.recommendedLighting}
                  </p>
                </div>

                {/* Panel 2: Recommended Finishes */}
                <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
                  <div className="text-xs font-bold text-[#E68A00] uppercase mb-1 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    Available Finishes
                  </div>
                  <div className="text-sm font-bold text-white mb-1.5">
                    Popular in India:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedShade.finishOptions.map((fin, i) => (
                      <span key={i} className="text-[11px] bg-white/10 px-2.5 py-1 rounded-md text-white/90">
                        {fin}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Panel 3: Recommended Door / Ceiling Pair */}
                <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
                  <div className="text-xs font-bold text-[#E68A00] uppercase mb-1 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5" />
                    Matching Trim / Border
                  </div>
                  <div className="flex items-center gap-2.5 mt-2">
                    <div 
                      className="w-8 h-8 rounded-lg border border-white/40 shadow-sm shrink-0"
                      style={{ backgroundColor: selectedShade.matchingTrimHex }}
                    />
                    <div>
                      <div className="text-xs font-bold text-white">
                        {selectedShade.matchingTrimName}
                      </div>
                      <div className="text-[10px] text-white/50">
                        Use on Doors, Ceilings &amp; Mouldings
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-black/60">
              <div className="text-xs text-white/60">
                Color Code: <strong className="text-white">{selectedShade.code}</strong> &bull; Ask any paint dealer in India for this code
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleSave(selectedShade)}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <BookmarkCheck className="w-3.5 h-3.5 text-[#E68A00]" />
                  <span>{savedShades.some((s) => s.id === selectedShade.id) ? 'Saved' : 'Save Shade'}</span>
                </button>
                <button
                  onClick={() => setIsRoomModalOpen(false)}
                  className="px-5 py-2 rounded-full bg-[#E68A00] hover:bg-[#D97D00] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SAVED SHADES COMPARE DOCK */}
      {savedShades.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10 bg-black/40 p-4 sm:p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E68A00] animate-pulse" />
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Saved Shades ({savedShades.length}/3)
              </div>
              <div className="text-[11px] text-white/50">
                Compare your shortlisted colors side by side before ordering
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {savedShades.map((shade) => (
              <div 
                key={shade.id}
                onClick={() => {
                  setSelectedShade(shade);
                  setIsRoomModalOpen(true);
                }}
                className="flex items-center gap-2.5 bg-black/60 p-2 pr-3 rounded-xl border border-white/15 cursor-pointer hover:border-[#E68A00] transition-all group"
              >
                <div 
                  className="w-7 h-7 rounded-lg shadow-sm border border-white/20 group-hover:scale-105 transition-transform" 
                  style={{ backgroundColor: shade.hex }}
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-white group-hover:text-[#E68A00] transition-colors">{shade.name}</div>
                  <div className="text-[10px] font-mono text-white/50">Code {shade.code}</div>
                </div>
                <button
                  onClick={(e) => handleToggleSave(shade, e)}
                  className="ml-1 text-white/40 hover:text-white text-xs p-1"
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <button
              onClick={() => setSavedShades([])}
              className="text-[11px] text-white/40 hover:text-white transition-colors underline cursor-pointer px-2"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
