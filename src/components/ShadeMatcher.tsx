import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  Upload, 
  Pipette, 
  Sparkles, 
  RefreshCw, 
  Check, 
  Copy, 
  ArrowRight, 
  AlertCircle, 
  Layers,
  CheckCircle2,
  X,
  Palette,
  SwitchCamera
} from 'lucide-react';
import { PaintProduct } from '../types';

interface ShadeMatcherProps {
  onSelectProductForCalculator?: (product: PaintProduct) => void;
}

interface DominantColor {
  hex: string;
  percentage: number;
}

interface MatchResult {
  shadeName: string;
  hex: string;
  rgb: string;
  undertone: string;
  recommendedFinish: string;
  recommendedRooms: string;
  matchingTrims: { name: string; hex: string; role: string }[];
}

const PRESET_PHOTOS = [
  {
    name: 'Terracotta Architectural Arch',
    url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    defaultHex: '#D96C4A',
  },
  {
    name: 'Kerala Botanical Verandah',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    defaultHex: '#F5EFE6',
  },
  {
    name: 'Serene Botanical Corner',
    url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    defaultHex: '#3F8F6B',
  },
];

// Helper: Convert RGB to Hex
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}

// Helper: Convert Hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export const ShadeMatcher: React.FC<ShadeMatcherProps> = ({
  onSelectProductForCalculator,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'camera' | 'samples'>('samples');
  const [imageSrc, setImageSrc] = useState<string>(PRESET_PHOTOS[0].url);
  const [sampledHex, setSampledHex] = useState<string>('#D96C4A');
  const [dominantColors, setDominantColors] = useState<DominantColor[]>([]);
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [copiedHex, setCopiedHex] = useState<boolean>(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  // Eyedropper Magnifier States
  const [isEyedropperActive, setIsEyedropperActive] = useState<boolean>(false);
  const [magnifierPos, setMagnifierPos] = useState<{ x: number; y: number } | null>(null);
  const [hoverColor, setHoverColor] = useState<string>('#D96C4A');

  // Camera stream refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Hidden Canvas for image color extraction
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Perform shade match computation (product-less)
  const computeShadeMatch = useCallback((hex: string) => {
    setIsMatching(true);
    const { r, g, b } = hexToRgb(hex);

    // Identify undertone & naming heuristics
    let shadeName = 'Custom Pure Tone';
    let undertone = 'Balanced Neutral';
    let recommendedFinish = 'Eggshell (Smooth & Washable)';
    let recommendedRooms = 'Living Room & Bedroom';

    if (r > 180 && g < 140 && b < 120) {
      shadeName = 'Terracotta Clay Heritage';
      undertone = 'Warm Earth & Ochre';
      recommendedFinish = 'Velvet Matte or Eggshell';
      recommendedRooms = 'Dining Accent Wall & Foyer';
    } else if (r > 210 && g > 200 && b > 180) {
      shadeName = 'Silk Linen White';
      undertone = 'Warm Ivory & Soft Neutral';
      recommendedFinish = 'Eggshell or Silk';
      recommendedRooms = 'All Living Spaces & Hallways';
    } else if (g > r && g > b) {
      shadeName = 'Botanical Meadow Sage';
      undertone = 'Organic Earth & Leaf';
      recommendedFinish = 'Eggshell or Matte';
      recommendedRooms = 'Master Bedroom & Study';
    } else if (b > r && b > g) {
      shadeName = 'Himalayan Twilight Blue';
      undertone = 'Cool Slate & Cobalt';
      recommendedFinish = 'Soft Glow or Satin';
      recommendedRooms = 'Living Feature Wall & Exterior Accent';
    } else if (r > 180 && g > 130 && b < 100) {
      shadeName = 'Golden Ochre Sandstone';
      undertone = 'Warm Amber Sandstone';
      recommendedFinish = 'Velvet Matte';
      recommendedRooms = 'South-Facing Verandahs & Dining';
    }

    const result: MatchResult = {
      shadeName,
      hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      undertone,
      recommendedFinish,
      recommendedRooms,
      matchingTrims: [
        { name: 'Pure Cornice White', hex: '#FAFAFA', role: 'Ceiling Trim' },
        { name: 'Warm Cream Linen', hex: '#F8F4EC', role: 'Surrounding Walls' },
        { name: 'Deep Teak Brown', hex: '#8B5A2B', role: 'Woodwork & Baseboard' },
      ],
    };

    setTimeout(() => {
      setMatchResult(result);
      setIsMatching(false);
    }, 200);
  }, []);

  // Extract dominant colors from loaded image
  const extractDominantColors = useCallback(() => {
    const img = imageRef.current;
    const canvas = imageCanvasRef.current;
    if (!img || !canvas || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = 120;
    canvas.height = 80;
    ctx.drawImage(img, 0, 0, 120, 80);

    try {
      const imageData = ctx.getImageData(0, 0, 120, 80);
      const data = imageData.data;
      const colorBuckets: { [key: string]: number } = {};

      for (let i = 0; i < data.length; i += 16) {
        const r = Math.round(data[i] / 24) * 24;
        const g = Math.round(data[i + 1] / 24) * 24;
        const b = Math.round(data[i + 2] / 24) * 24;
        const hex = rgbToHex(r, g, b);
        colorBuckets[hex] = (colorBuckets[hex] || 0) + 1;
      }

      const sorted = Object.entries(colorBuckets)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      const total = sorted.reduce((sum, [, count]) => sum + count, 0);
      const extracted = sorted.map(([hex, count]) => ({
        hex,
        percentage: Math.round((count / total) * 100),
      }));

      setDominantColors(extracted);
      if (extracted.length > 0) {
        setSampledHex(extracted[0].hex);
        computeShadeMatch(extracted[0].hex);
      }
    } catch {
      // CORS fallback
      computeShadeMatch(sampledHex);
    }
  }, [computeShadeMatch, sampledHex]);

  // Initial trigger
  useEffect(() => {
    computeShadeMatch(sampledHex);
  }, [computeShadeMatch, sampledHex]);

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacing, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setActiveMode('camera');
    } catch (err: any) {
      setCameraError('Camera access denied or unavailable in this browser.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 800;
    canvas.height = videoRef.current.videoHeight || 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setImageSrc(dataUrl);
      stopCamera();
      setActiveMode('upload');
      setTimeout(extractDominantColors, 150);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
          setActiveMode('upload');
          setTimeout(extractDominantColors, 150);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = imageRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    const canvas = imageCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    try {
      const pixel = ctx.getImageData(x * scaleX, y * scaleY, 1, 1).data;
      const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
      setSampledHex(hex);
      computeShadeMatch(hex);
    } catch {
      // Fallback
    }
  };

  const handleCopyHex = () => {
    navigator.clipboard.writeText(sampledHex);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Hidden processing canvas */}
      <canvas ref={imageCanvasRef} className="hidden" />

      {/* Top Mode Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E8E2D5]">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              stopCamera();
              setActiveMode('samples');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'samples'
                ? 'bg-[#243B7A] text-white shadow-xs'
                : 'bg-[#F8F4EC] text-[#1A1A1A]/75 hover:bg-[#FAF8F5]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Sample Rooms</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'upload'
                ? 'bg-[#243B7A] text-white shadow-xs'
                : 'bg-[#F8F4EC] text-[#1A1A1A]/75 hover:bg-[#FAF8F5]'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-[#E68A00]" />
            <span>Upload Photo</span>
          </button>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload} 
            className="hidden" 
          />

          <button
            onClick={() => {
              if (isCameraActive) stopCamera();
              else startCamera();
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isCameraActive
                ? 'bg-amber-600 text-white'
                : 'bg-[#F8F4EC] text-[#1A1A1A]/75 hover:bg-[#FAF8F5]'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-[#3F8F6B]" />
            <span>{isCameraActive ? 'Stop Camera' : 'Live Camera'}</span>
          </button>
        </div>

        {/* Eyedropper Guide Pill */}
        <div className="flex items-center gap-1.5 text-xs text-[#1A1A1A]/70">
          <Pipette className="w-3.5 h-3.5 text-[#243B7A]" />
          <span>Tap anywhere on photo to sample shade</span>
        </div>
      </div>

      {/* Main Grid: Photo Visualizer on Left + Shade Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image / Video Display (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-[#E8E2D5] bg-stone-900 min-h-[300px] flex items-center justify-center">
            
            {isCameraActive ? (
              <div className="relative w-full h-[360px]">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={captureCameraFrame}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full bg-white text-[#243B7A] font-bold text-xs shadow-xl flex items-center gap-2 hover:bg-stone-100 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>Snap Photo to Extract Shade</span>
                </button>
              </div>
            ) : (
              <div className="relative w-full">
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Color extraction source"
                  onLoad={extractDominantColors}
                  onClick={handleImageClick}
                  className="w-full h-[360px] object-cover cursor-crosshair select-none"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
                
                {/* Sampling Indicator Ring */}
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
                  <div 
                    className="w-3.5 h-3.5 rounded-full border border-white shrink-0 shadow-xs"
                    style={{ backgroundColor: sampledHex }}
                  />
                  <span>Selected: {sampledHex}</span>
                </div>
              </div>
            )}
          </div>

          {/* Sample Preset Photos Bar */}
          {activeMode === 'samples' && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-[#1A1A1A]/60 uppercase tracking-wider shrink-0 mr-1">
                Presets:
              </span>
              {PRESET_PHOTOS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setImageSrc(preset.url);
                    setSampledHex(preset.defaultHex);
                    computeShadeMatch(preset.defaultHex);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    imageSrc === preset.url
                      ? 'border-[#243B7A] bg-white shadow-2xs text-[#243B7A]'
                      : 'border-[#E8E2D5] bg-[#F8F4EC] text-[#1A1A1A]/70 hover:bg-white'
                  }`}
                >
                  <div 
                    className="w-2.5 h-2.5 rounded-full border border-black/10" 
                    style={{ backgroundColor: preset.defaultHex }}
                  />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Dominant Extracted Palette Strip */}
          {dominantColors.length > 0 && (
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D5] space-y-2">
              <div className="text-xs font-bold text-[#1A1A1A]/70 uppercase tracking-wider">
                Extracted Palette Colors
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {dominantColors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSampledHex(color.hex);
                      computeShadeMatch(color.hex);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      sampledHex === color.hex
                        ? 'border-[#243B7A] bg-white shadow-2xs ring-2 ring-[#243B7A]/20'
                        : 'border-[#E8E2D5] bg-white hover:border-[#243B7A]/40'
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded-md border border-black/10 shrink-0" 
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.hex}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Matched Shade Details (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {matchResult ? (
            <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E8E2D5] space-y-5 shadow-sm">
              
              {/* Primary Matched Shade Card */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#243B7A]">
                    Matched Wall Shade
                  </span>
                  <button
                    onClick={handleCopyHex}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1A1A1A]/70 hover:text-[#243B7A] transition-colors cursor-pointer"
                  >
                    {copiedHex ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Hex</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#E8E2D5] shadow-xs">
                  <div 
                    className="w-14 h-14 rounded-2xl border border-black/10 shadow-inner shrink-0" 
                    style={{ backgroundColor: matchResult.hex }}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-[#1A1A1A] truncate">
                      {matchResult.shadeName}
                    </h3>
                    <div className="text-xs font-mono text-[#1A1A1A]/70">
                      {matchResult.hex} • {matchResult.rgb}
                    </div>
                    <div className="text-[11px] font-semibold text-[#E68A00] mt-0.5">
                      {matchResult.undertone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Application & Finish */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-[#E8E2D5]">
                  <div className="text-[10px] font-semibold text-[#1A1A1A]/60 uppercase">Ideal Finish</div>
                  <div className="font-bold text-[#1A1A1A] mt-0.5">{matchResult.recommendedFinish}</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E8E2D5]">
                  <div className="text-[10px] font-semibold text-[#1A1A1A]/60 uppercase">Best For</div>
                  <div className="font-bold text-[#1A1A1A] mt-0.5">{matchResult.recommendedRooms}</div>
                </div>
              </div>

              {/* Matching Ceiling & Trim Whites */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#1A1A1A]/70 uppercase tracking-wider">
                  Harmonious Trim &amp; Ceiling Whites
                </div>
                <div className="space-y-2">
                  {matchResult.matchingTrims.map((trim, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E8E2D5] text-xs shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-6 h-6 rounded-lg border border-black/10 shrink-0" 
                          style={{ backgroundColor: trim.hex }}
                        />
                        <div>
                          <div className="font-bold text-[#1A1A1A]">{trim.name}</div>
                          <div className="text-[10px] text-[#1A1A1A]/60">{trim.role}</div>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-[#1A1A1A]/70 font-semibold">{trim.hex}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1-Click Action to Calculator */}
              <div className="pt-2">
                <a
                  href="#product-guides"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('product-guides')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#243B7A] text-white font-bold text-xs shadow-md hover:bg-[#1a2d61] transition-all cursor-pointer"
                >
                  <Palette className="w-4 h-4 text-[#E68A00]" />
                  <span>Calculate Paint for this Shade →</span>
                </a>
              </div>

            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-[#E8E2D5] text-center text-xs text-[#1A1A1A]/60">
              Analyzing photo shades...
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
