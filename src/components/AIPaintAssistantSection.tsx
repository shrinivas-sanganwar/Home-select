import React, { useState } from 'react';
import { Sparkles, Camera, Upload, CheckCircle2, RefreshCw, Sun, Moon } from 'lucide-react';

interface AIPaintAssistantProps {
  onOpenAR?: () => void;
}

export const AIPaintAssistantSection: React.FC<AIPaintAssistantProps> = ({ onOpenAR }) => {
  const [selectedRoomPreset, setSelectedRoomPreset] = useState<number>(0);
  const [lightingCondition, setLightingCondition] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const roomPresets = [
    {
      title: 'South-Facing Living Lounge',
      imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      matches: [
        { name: 'Warm Ivory', hex: '#F8F4EC', lrv: 89, finish: 'Velvet Eggshell', code: 'HS-01' },
        { name: 'Rich Saffron Accent', hex: '#E68A00', lrv: 48, finish: 'Satin Enamel', code: 'HS-03' },
        { name: 'Heritage Teak', hex: '#B8860B', lrv: 32, finish: 'Wood Stain', code: 'HS-TK' },
      ],
      aiAdvice: 'Warm ivory absorbs high noon glare while rich saffron accents anchor architectural pillars.',
    },
    {
      title: 'East-Facing Quiet Bedroom',
      imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
      matches: [
        { name: 'Soft Emerald', hex: '#3F8F6B', lrv: 34, finish: 'Pure Matte', code: 'HS-04' },
        { name: 'Coir Linen', hex: '#F4EFE6', lrv: 86, finish: 'Breathable Silicate', code: 'HS-KL04' },
        { name: 'Mountain Fog', hex: '#C2C9D1', lrv: 68, finish: 'Eggshell', code: 'HS-HM01' },
      ],
      aiAdvice: 'Soft emerald leverages cool morning sunlight to create a tranquil, biological sleep environment.',
    },
  ];

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 600);
  };

  const currentPreset = roomPresets[selectedRoomPreset];

  return (
    <section 
      id="ai-assistant" 
      className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-[#E8E2D5]"
    >
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E2D5] text-xs font-semibold text-[#7C3AED]">
          <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span>AI Room Color Harmonizer</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
          AI Paint Assistant
        </h2>
        <p className="text-base sm:text-lg text-[#1A1A1A]/70 font-normal leading-relaxed">
          Select or simulate room lighting to instantly extract undertones and receive AI-balanced paint recommendations.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E2D5] p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Interactive Room Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-[#E8E2D5] shadow-inner h-[280px] sm:h-[360px]">
            <img
              src={currentPreset.imageUrl}
              alt={currentPreset.title}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isAnalyzing ? 'blur-xs scale-105' : 'blur-none scale-100'
              }`}
              referrerPolicy="no-referrer"
            />

            {/* Lighting Overlay Simulation */}
            <div 
              className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                lightingCondition === 'morning' 
                  ? 'bg-amber-100/10' 
                  : lightingCondition === 'afternoon' 
                  ? 'bg-yellow-200/15' 
                  : 'bg-indigo-900/20'
              }`} 
            />

            {/* Top Badge */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#E68A00]" />
              <span>Simulated Room Analysis</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2">
            {roomPresets.map((pr, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedRoomPreset(idx);
                  handleRunAnalysis();
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedRoomPreset === idx
                    ? 'bg-[#243B7A] text-white border-[#243B7A]'
                    : 'bg-[#F8F4EC] text-[#1A1A1A] border-[#E8E2D5]'
                }`}
              >
                {pr.title}
              </button>
            ))}
          </div>
        </div>

        {/* Right AI Match Output Panel */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED]">
                Lighting Simulation Mode
              </span>
              <h3 className="text-xl font-bold text-[#1A1A1A]">
                {currentPreset.title}
              </h3>
            </div>

            {/* Lighting Selector Pills */}
            <div className="flex items-center gap-1 bg-[#F8F4EC] p-1 rounded-full border border-[#E8E2D5]">
              <button
                onClick={() => { setLightingCondition('morning'); handleRunAnalysis(); }}
                className={`p-1.5 rounded-full text-xs ${lightingCondition === 'morning' ? 'bg-white shadow-2xs text-[#E68A00]' : 'text-[#1A1A1A]/50'}`}
                title="Morning Sunlight"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => { setLightingCondition('afternoon'); handleRunAnalysis(); }}
                className={`p-1.5 rounded-full text-xs ${lightingCondition === 'afternoon' ? 'bg-white shadow-2xs text-[#E68A00]' : 'text-[#1A1A1A]/50'}`}
                title="Afternoon Glare"
              >
                <Sun className="w-3.5 h-3.5 stroke-2" />
              </button>

              <button
                onClick={() => { setLightingCondition('evening'); handleRunAnalysis(); }}
                className={`p-1.5 rounded-full text-xs ${lightingCondition === 'evening' ? 'bg-white shadow-2xs text-[#7C3AED]' : 'text-[#1A1A1A]/50'}`}
                title="Dusk Incandescent"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* AI Color Swatches */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
              AI Harmonic Paint Recommendations
            </h4>

            <div className="space-y-2">
              {currentPreset.matches.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F4EC] border border-[#E8E2D5]">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full border border-black/10 shadow-2xs shrink-0" 
                      style={{ backgroundColor: m.hex }}
                    />
                    <div>
                      <strong className="text-xs font-bold text-[#1A1A1A] block">{m.name}</strong>
                      <span className="text-[10px] text-[#1A1A1A]/60">{m.finish} • Code: {m.code}</span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-[#243B7A] bg-white px-2.5 py-1 rounded-full border border-[#E8E2D5]">
                    Catalog Match
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Rationale Note */}
          <div className="p-4 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-xs text-[#1A1A1A] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#7C3AED]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Undertone Harmony Note</span>
            </div>
            <p className="text-[#1A1A1A]/80 leading-relaxed">
              {currentPreset.aiAdvice}
            </p>
          </div>

          {/* Contextual AR Trigger Pop-up Button */}
          {onOpenAR && (
            <button
              onClick={onOpenAR}
              className="w-full py-3 px-6 rounded-full bg-[#7C3AED] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#6D28D9] transition-all cursor-pointer shadow-md uppercase tracking-wider"
            >
              <Camera className="w-4 h-4" />
              <span>Launch AR Room Visualization Pop-Up</span>
            </button>
          )}

        </div>

      </div>
    </section>
  );
};
