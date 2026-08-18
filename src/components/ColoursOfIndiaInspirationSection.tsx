import React, { useState } from 'react';
import { IndianPalette, InspirationRoom } from '../types';
import { INDIAN_PALETTES, INSPIRATION_ROOMS } from '../data/defaultContent';
import { Compass, Sparkles, Home, Camera, Search, Rotate3d, Pipette, Zap } from 'lucide-react';
import { ColorShadeDomeGallery } from './ColorShadeDomeGallery';
import { GeminiStarLatticeGallery } from './GeminiStarLatticeGallery';
import { ShadeMatcher } from './ShadeMatcher';

export const ColoursOfIndiaInspirationSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lattice' | 'dome' | 'matcher' | 'regional' | 'rooms' | 'search'>('lattice');
  const [selectedPalette, setSelectedPalette] = useState<IndianPalette>(INDIAN_PALETTES[0]);
  const [selectedRoom, setSelectedRoom] = useState<InspirationRoom>(INSPIRATION_ROOMS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <section 
      id="color-gallery" 
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8E2D5] dark:border-white/10 scroll-mt-16"
    >
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#162032]/80 border border-[#E8E2D5] dark:border-white/10 text-xs font-bold text-[#E68A00] dark:text-[#F59E0B] shadow-2xs backdrop-blur-md">
          <Rotate3d className="w-4 h-4 text-[#E68A00] dark:text-[#F59E0B]" />
          <span>Color Gallery &amp; Shade Matcher</span>
        </div>

        <h2 className="font-heading font-black text-3xl sm:text-5xl tracking-tight text-[#1A1A1A] dark:text-[#F1F4F9]">
          Explore Shades &amp; Match Any Color
        </h2>
        <p className="text-base sm:text-lg text-[#1A1A1A]/70 dark:text-[#CBD5E1] leading-relaxed">
          Browse interactive 3D shade domes, curated Indian heritage palettes, or upload any photo to extract the exact wall color and harmonizing trim whites.
        </p>
      </div>

      {/* Main Feature Tabs */}
      <div className="flex justify-center mb-10">
        <div className="bg-white/90 dark:bg-[#162032]/90 backdrop-blur-md p-1.5 rounded-full border border-[#E8E2D5] dark:border-white/10 inline-flex flex-wrap justify-center gap-1.5 text-xs font-bold shadow-2xs">
          <button
            onClick={() => setActiveTab('lattice')}
            className={`px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'lattice'
                ? 'bg-[#243B7A] dark:bg-[#3B82F6] text-white shadow-xs'
                : 'text-[#1A1A1A]/70 dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F1F4F9]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <span>Rotating Star Lattice</span>
          </button>

          <button
            onClick={() => setActiveTab('dome')}
            className={`px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dome'
                ? 'bg-[#E68A00] text-white shadow-xs'
                : 'text-[#1A1A1A]/70 dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F1F4F9]'
            }`}
          >
            <Rotate3d className="w-4 h-4" />
            <span>3D Dome Gallery</span>
          </button>

          <button
            onClick={() => setActiveTab('matcher')}
            className={`px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'matcher'
                ? 'bg-[#243B7A] dark:bg-[#3B82F6] text-white shadow-xs'
                : 'text-[#1A1A1A]/70 dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F1F4F9]'
            }`}
          >
            <Pipette className="w-3.5 h-3.5 text-[#E68A00] dark:text-[#F59E0B]" />
            <span>Shade Matcher from Photo</span>
          </button>

          <button
            onClick={() => setActiveTab('regional')}
            className={`px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'regional'
                ? 'bg-[#243B7A] dark:bg-[#3B82F6] text-white shadow-xs'
                : 'text-[#1A1A1A]/70 dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F1F4F9]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Regional Palettes</span>
          </button>

          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rooms'
                ? 'bg-[#243B7A] dark:bg-[#3B82F6] text-white shadow-xs'
                : 'text-[#1A1A1A]/70 dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F1F4F9]'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-[#D96C4A]" />
            <span>Room Inspiration</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'search'
                ? 'bg-[#243B7A] dark:bg-[#3B82F6] text-white shadow-xs'
                : 'text-[#1A1A1A]/70 dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F1F4F9]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Shades</span>
          </button>
        </div>
      </div>

      {/* TAB 1: GEMINI STAR LATTICE GALLERY */}
      {activeTab === 'lattice' && (
        <div className="rounded-3xl shadow-xl">
          <GeminiStarLatticeGallery />
        </div>
      )}

      {/* TAB 2: 3D DOME GALLERY */}
      {activeTab === 'dome' && (
        <div className="bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-xl rounded-3xl border border-[#E8E2D5] dark:border-white/10 p-4 sm:p-8 shadow-xl">
          <ColorShadeDomeGallery />
        </div>
      )}

      {/* TAB 2: SHADE MATCHER (PRODUCT-LESS COLOR EXTRACTION) */}
      {activeTab === 'matcher' && (
        <div className="bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-xl rounded-3xl border border-[#E8E2D5] dark:border-white/10 p-6 sm:p-10 shadow-xl">
          <div className="max-w-2xl mb-8 space-y-2">
            <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-[#F1F4F9]">
              Extract &amp; Match Exact Wall Shades
            </h3>
            <p className="text-xs sm:text-sm text-[#1A1A1A]/70 dark:text-[#CBD5E1]">
              Upload any photo of a wall, fabric, or furniture piece. Our shade matcher extracts the authentic tone, hex code, recommended room finish, and harmonizing trim whites.
            </p>
          </div>
          <ShadeMatcher />
        </div>
      )}

      {/* TAB 3: REGIONAL PALETTES */}
      {activeTab === 'regional' && (
        <div className="bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-xl rounded-3xl border border-[#E8E2D5] dark:border-white/10 p-6 sm:p-10 shadow-xl space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {INDIAN_PALETTES.map((pal) => (
              <div
                key={pal.id}
                onClick={() => setSelectedPalette(pal)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedPalette.id === pal.id
                    ? 'border-[#243B7A] dark:border-[#60A5FA] bg-[#FAF8F5] dark:bg-[#1E293B] shadow-xs'
                    : 'border-[#E8E2D5] dark:border-white/10 bg-white/70 dark:bg-[#162032]/70 hover:border-[#243B7A]/40 dark:hover:border-[#60A5FA]/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0" 
                    style={{ backgroundColor: pal.primaryHex }}
                  />
                  <h4 className="font-bold text-sm text-[#1A1A1A] dark:text-[#F1F4F9]">{pal.paletteTitle}</h4>
                </div>
                <p className="text-xs text-[#1A1A1A]/70 dark:text-[#94A3B8] line-clamp-2">{pal.culturalStory}</p>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF8F5] dark:bg-[#0E131F] border border-[#E8E2D5] dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base text-[#1A1A1A] dark:text-[#F1F4F9]">{selectedPalette.paletteTitle} Colors</h4>
              <span className="text-xs font-semibold text-[#243B7A] dark:text-[#60A5FA]">{selectedPalette.bestSuitedFor}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {selectedPalette.colors.map((c, i) => (
                <div key={i} className="p-3 bg-white dark:bg-[#162032] rounded-xl border border-[#E8E2D5] dark:border-white/10 shadow-2xs space-y-2">
                  <div 
                    className="w-full h-14 rounded-lg border border-black/10 dark:border-white/10 shadow-xs" 
                    style={{ backgroundColor: c.hex }}
                  />
                  <div className="font-bold text-xs text-[#1A1A1A] dark:text-[#F1F4F9] truncate">{c.name}</div>
                  <div className="text-[10px] text-[#1A1A1A]/60 dark:text-[#94A3B8]">{c.undertone}</div>
                  <div className="text-[10px] font-mono font-semibold text-[#243B7A] dark:text-[#60A5FA]">{c.hex}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ROOM INSPIRATION */}
      {activeTab === 'rooms' && (
        <div className="bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-xl rounded-3xl border border-[#E8E2D5] dark:border-white/10 p-6 sm:p-10 shadow-xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl overflow-hidden border border-[#E8E2D5] dark:border-white/10 bg-stone-900 h-[320px]">
              <img 
                src={selectedRoom.roomImageUrl} 
                alt={selectedRoom.roomName} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] dark:bg-[#1E293B] text-xs font-bold text-[#243B7A] dark:text-[#60A5FA] border border-[#E8E2D5] dark:border-white/10">
                {selectedRoom.roomCategory}
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] dark:text-[#F1F4F9]">{selectedRoom.roomName}</h3>
              <p className="text-xs sm:text-sm text-[#1A1A1A]/75 dark:text-[#CBD5E1]">{selectedRoom.description}</p>
              
              <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#0E131F] border border-[#E8E2D5] dark:border-white/10 space-y-2">
                <div className="text-xs font-bold uppercase text-[#1A1A1A]/70 dark:text-[#94A3B8]">Recommended Wall Color</div>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg border border-black/10 dark:border-white/10 shadow-xs" 
                    style={{ backgroundColor: selectedRoom.primaryColor.hex }}
                  />
                  <div>
                    <div className="font-bold text-xs text-[#1A1A1A] dark:text-[#F1F4F9]">{selectedRoom.primaryColor.name}</div>
                    <div className="text-[10px] font-mono text-[#243B7A] dark:text-[#60A5FA]">{selectedRoom.primaryColor.hex}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SEARCH SHADES */}
      {activeTab === 'search' && (
        <div className="bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-xl rounded-3xl border border-[#E8E2D5] dark:border-white/10 p-6 sm:p-10 shadow-xl max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-bold text-xl text-[#1A1A1A] dark:text-[#F1F4F9]">Search Curated Shades</h3>
            <p className="text-xs text-[#1A1A1A]/70 dark:text-[#CBD5E1]">
              Type any color name or shade tone (e.g., "Ivory", "Terracotta", "Sage", "Indigo").
            </p>
          </div>

          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40 dark:text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by shade name or tone..."
              className="w-full pl-12 pr-4 py-3.5 bg-[#FAF8F5] dark:bg-[#0E131F] border border-[#E8E2D5] dark:border-white/15 rounded-2xl text-sm text-[#1A1A1A] dark:text-[#F1F4F9] focus:outline-none focus:border-[#243B7A] dark:focus:border-[#60A5FA]"
            />
          </div>

          <div className="p-4 bg-[#FAF8F5] dark:bg-[#0E131F] rounded-2xl border border-[#E8E2D5] dark:border-white/10 text-xs text-[#1A1A1A]/80 dark:text-[#CBD5E1] text-center">
            {searchQuery.trim() ? (
              <p>Showing shade matches for "<strong>{searchQuery}</strong>". Explore corresponding finishes in our product catalog.</p>
            ) : (
              <p>Popular Searches: <em>Silk Linen Ivory, Jaipur Terracotta, Himalayan Sage, Udaipur Mist White</em></p>
            )}
          </div>
        </div>
      )}

    </section>
  );
};
