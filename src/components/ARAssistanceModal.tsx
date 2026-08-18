import React, { useState } from 'react';
import { X, Sparkles, Camera, Eye, Sun, Layers, RotateCcw, Check } from 'lucide-react';
import { PaintProduct } from '../types';

interface ARAssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct?: PaintProduct | null;
}

export const ARAssistanceModal: React.FC<ARAssistanceModalProps> = ({
  isOpen,
  onClose,
  selectedProduct,
}) => {
  const [wallColor, setWallColor] = useState<string>(selectedProduct?.hexCode || '#243B7A');
  const [wallName, setWallName] = useState<string>(selectedProduct?.name || 'Deep Indigo');
  const [roomType, setRoomType] = useState<'living' | 'bedroom' | 'kitchen'>('living');
  const [lighting, setLighting] = useState<'natural' | 'warm' | 'cool'>('natural');

  if (!isOpen) return null;

  const roomImages = {
    living: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
    bedroom: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=80',
    kitchen: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
  };

  const sampleShades = [
    { name: 'Warm Ivory', hex: '#F8F4EC' },
    { name: 'Deep Indigo', hex: '#243B7A' },
    { name: 'Soft Emerald', hex: '#3F8F6B' },
    { name: 'Saffron Accent', hex: '#E68A00' },
    { name: 'Coir Linen', hex: '#F4EFE6' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-[#F8F4EC] rounded-3xl border border-[#E8E2D5] max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col my-auto">
        
        {/* Header */}
        <div className="p-5 bg-white border-b border-[#E8E2D5] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">AR Wall Visualization Assistant</h3>
              <p className="text-xs text-[#1A1A1A]/60">Live augmented reality wall shade simulation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#1A1A1A]/60 hover:text-[#1A1A1A] rounded-full hover:bg-[#F8F4EC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Simulated AR Canvas Viewport */}
          <div className="relative rounded-2xl overflow-hidden border border-[#E8E2D5] shadow-inner h-[280px] sm:h-[340px] bg-black">
            <img
              src={roomImages[roomType]}
              alt="AR Room Simulation"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Tinted Overlay layer simulating wall color in AR */}
            <div
              className="absolute inset-0 mix-blend-multiply opacity-50 transition-colors duration-500 pointer-events-none"
              style={{ backgroundColor: wallColor }}
            />

            {/* Lighting modifier */}
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                lighting === 'warm'
                  ? 'bg-amber-300/15'
                  : lighting === 'cool'
                  ? 'bg-blue-300/15'
                  : 'bg-transparent'
              }`}
            />

            {/* AR Overlay HUD Indicators */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-[#3F8F6B] animate-pulse" />
              <span>AR Tracking Locked: {wallName}</span>
            </div>

            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-[#1A1A1A] px-3 py-1.5 rounded-full text-xs font-bold border border-[#E8E2D5] shadow-xs flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#243B7A]" />
              <span>Live Surface Blend: 89% LRV</span>
            </div>
          </div>

          {/* AR Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Color Swatch Picker */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8E2D5] space-y-2">
              <label className="text-xs font-bold text-[#1A1A1A] block">Select Paint Shade to Simulate</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {sampleShades.map((sh, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setWallColor(sh.hex);
                      setWallName(sh.name);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      wallColor === sh.hex
                        ? 'border-[#243B7A] bg-[#243B7A]/10 text-[#243B7A] font-bold'
                        : 'border-[#E8E2D5] bg-[#F8F4EC] text-[#1A1A1A]/70'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: sh.hex }} />
                    <span>{sh.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lighting & Room Controls */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8E2D5] space-y-2">
              <label className="text-xs font-bold text-[#1A1A1A] block">Room Lighting Environment</label>
              <div className="flex gap-2 pt-1">
                {(['natural', 'warm', 'cool'] as const).map((lt) => (
                  <button
                    key={lt}
                    onClick={() => setLighting(lt)}
                    className={`flex-1 py-1.5 text-xs font-bold capitalize rounded-full border cursor-pointer transition-colors ${
                      lighting === lt
                        ? 'bg-[#243B7A] text-white border-[#243B7A]'
                        : 'bg-[#F8F4EC] text-[#1A1A1A]/70 border-[#E8E2D5]'
                    }`}
                  >
                    {lt} Light
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E8E2D5] flex items-center justify-between text-xs">
          <span className="text-[#1A1A1A]/60 font-medium">HomeSelect AR Vision Engine • Real-time Surface Rendering</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#243B7A] text-white rounded-full font-bold hover:bg-[#1C2E60] transition-colors cursor-pointer"
          >
            Done Previewing
          </button>
        </div>

      </div>
    </div>
  );
};
