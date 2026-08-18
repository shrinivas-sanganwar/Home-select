import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  Upload, 
  Pipette, 
  Sparkles, 
  RefreshCw, 
  Image as ImageIcon, 
  Check, 
  Copy, 
  ArrowRight, 
  AlertCircle, 
  Sun, 
  Layers,
  CheckCircle2,
  X,
  Palette,
  SwitchCamera,
  Paintbrush,
  Calculator,
  Eye
} from 'lucide-react';
import { PaintProduct } from '../types';

interface SimilarColorFinderProps {
  onSelectProductForCalculator?: (product: PaintProduct) => void;
  onApplyToVisualizer?: (hex: string, name: string) => void;
}

interface DominantColor {
  hex: string;
  percentage: number;
}

interface MatchResult {
  success: boolean;
  scannedHex: string;
  primaryMatch: {
    id: string;
    name: string;
    hex: string;
    productFamily: string;
    category: string;
    finish: string;
    pricePerLiter: number;
    tag: string;
    matchConfidencePercent: number;
  };
  closeAlternatives: Array<{
    id: string;
    name: string;
    hex: string;
    productFamily: string;
    category: string;
    finish: string;
    pricePerLiter: number;
    matchConfidencePercent: number;
  }>;
  recommendedUndercoat: string;
}

interface HarmoniesResult {
  success: boolean;
  baseHex: string;
  harmonies: {
    complementary: {
      hex: string;
      nearestCatalogShade: any;
    };
    recommendedTrims: Array<{
      name: string;
      hex: string;
      role: string;
    }>;
  };
}

// Sample architectural photos to immediately test scanning with 1-click
const SAMPLE_TEST_PHOTOS = [
  {
    title: 'Warm Terracotta Wall',
    tag: 'Living Room Inspiration',
    url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    defaultHex: '#D96C4A'
  },
  {
    title: 'Coastal Blue Lounge',
    tag: 'Modern Interior',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    defaultHex: '#385E7B'
  },
  {
    title: 'Forest Green Verandah',
    tag: 'Balcony & Bedroom',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    defaultHex: '#3F8F6B'
  }
];

export const SimilarColorFinder: React.FC<SimilarColorFinderProps> = ({
  onSelectProductForCalculator,
  onApplyToVisualizer
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(SAMPLE_TEST_PHOTOS[0].url);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Eyedropper & Sampling State
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [selectedHex, setSelectedHex] = useState<string>('#D96C4A');
  const [magnifierPos, setMagnifierPos] = useState<{ x: number; y: number; px: number; py: number } | null>(null);
  const [dominantColors, setDominantColors] = useState<DominantColor[]>([]);

  // Match & Harmonies API state
  const [isLoadingMatch, setIsLoadingMatch] = useState(false);
  const [matchData, setMatchData] = useState<MatchResult | null>(null);
  const [harmoniesData, setHarmoniesData] = useState<HarmoniesResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // 1. Helper: Convert RGB to HEX
  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
  };

  // 2. Extract Top Dominant Colors from canvas using quantization
  const extractDominantPalette = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    try {
      const sampleStep = Math.max(1, Math.floor(Math.min(width, height) / 80));
      const imageData = ctx.getImageData(0, 0, width, height).data;
      const colorBuckets: { [bucketKey: string]: { r: number; g: number; b: number; count: number } } = {};
      let totalSamples = 0;

      for (let y = 0; y < height; y += sampleStep) {
        for (let x = 0; x < width; x += sampleStep) {
          const idx = (y * width + x) * 4;
          const r = imageData[idx];
          const g = imageData[idx + 1];
          const b = imageData[idx + 2];
          const a = imageData[idx + 3];

          if (a < 128) continue;
          
          const bucketKey = `${Math.floor(r / 32) * 32}-${Math.floor(g / 32) * 32}-${Math.floor(b / 32) * 32}`;
          if (!colorBuckets[bucketKey]) {
            colorBuckets[bucketKey] = { r, g, b, count: 1 };
          } else {
            colorBuckets[bucketKey].r += r;
            colorBuckets[bucketKey].g += g;
            colorBuckets[bucketKey].b += b;
            colorBuckets[bucketKey].count += 1;
          }
          totalSamples++;
        }
      }

      const sortedBuckets = Object.values(colorBuckets)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const dominant = sortedBuckets.map(bucket => {
        const avgR = Math.round(bucket.r / bucket.count);
        const avgG = Math.round(bucket.g / bucket.count);
        const avgB = Math.round(bucket.b / bucket.count);
        return {
          hex: rgbToHex(avgR, avgG, avgB),
          percentage: totalSamples > 0 ? Math.round((bucket.count / totalSamples) * 100) : 20
        };
      });

      setDominantColors(dominant);
    } catch (e) {
      console.warn('Palette note:', e);
    }
  };

  // 3. Draw Image onto Canvas and compute initial palette
  const renderImageToCanvas = useCallback((src: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const maxWidth = 900;
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      extractDominantPalette(ctx, canvas.width, canvas.height);
    };
    img.src = src;
  }, []);

  // 4. API Query: Match Color against Paint Database
  const executeMatch = async (hexCode: string) => {
    setSelectedHex(hexCode.toUpperCase());
    setIsLoadingMatch(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/v1/scanner/match-hex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-ID': 'hex-scanner',
          'X-App-Version': '1.0.0'
        },
        body: JSON.stringify({ hex: hexCode })
      });

      if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.error || 'Failed to match color');
      }

      const data: MatchResult = await res.json();
      setMatchData(data);

      // Fetch recommended matching ceiling/trim whites
      const harmRes = await fetch('/api/v1/scanner/harmonies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-ID': 'hex-scanner'
        },
        body: JSON.stringify({ hex: hexCode })
      });

      if (harmRes.ok) {
        const harmData: HarmoniesResult = await harmRes.json();
        setHarmoniesData(harmData);
      }
    } catch (err: any) {
      console.error('Color match error:', err);
      setErrorMessage('Could not find paint shade match. Please try another color.');
    } finally {
      setIsLoadingMatch(false);
    }
  };

  useEffect(() => {
    if (imageSrc) {
      renderImageToCanvas(imageSrc);
      executeMatch(selectedHex);
    }
  }, [imageSrc]);

  // 5. Canvas Pixel Sampling (Eyedropper)
  const sampleColorAtPoint = (clientX: number, clientY: number, commit = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((clientY - rect.top) / rect.height) * canvas.height);

    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
      setMagnifierPos(null);
      return;
    }

    try {
      const p = ctx.getImageData(Math.max(0, x - 1), Math.max(0, y - 1), 3, 3).data;
      let totalR = 0, totalG = 0, totalB = 0, count = 0;
      for (let i = 0; i < p.length; i += 4) {
        totalR += p[i];
        totalG += p[i + 1];
        totalB += p[i + 2];
        count++;
      }

      const hex = rgbToHex(totalR / count, totalG / count, totalB / count);
      setHoveredColor(hex);
      setMagnifierPos({ x: clientX - rect.left, y: clientY - rect.top, px: x, py: y });

      if (commit) {
        executeMatch(hex);
      }
    } catch (e) {
      // ignore
    }
  };

  // 6. Camera Live Capture Support
  const startCamera = async (facing: 'environment' | 'user' = cameraFacingMode) => {
    setCameraError(null);
    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Camera access unavailable. You can easily upload any photo from your phone or gallery.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhotoFromCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setImageSrc(dataUrl);
    stopCamera();
  };

  const toggleCameraFacing = () => {
    const nextMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
    setCameraFacingMode(nextMode);
    startCamera(nextMode);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xl text-[#1A1A1A] space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200 mb-2">
            <Pipette className="w-3.5 h-3.5 text-amber-600" />
            <span>Instant Photo Color Matcher</span>
          </div>
          <h3 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
            Find the Real Paint Shade from Any Photo
          </h3>
          <p className="text-sm text-[#1A1A1A]/60 mt-1 max-w-xl">
            Upload a Pinterest photo, take a picture of a wall or fabric, and tap any color to find its closest Asian Paints shade.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          {!isCameraActive ? (
            <button
              onClick={() => startCamera('environment')}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-[#1A1A1A] rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs border border-stone-200"
            >
              <Camera className="w-4 h-4 text-amber-600" />
              <span>Take Photo</span>
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-red-200"
            >
              <X className="w-4 h-4" />
              <span>Close Camera</span>
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {cameraError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* 2-COLUMN STAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Photo Canvas with Tap-to-Sample Eyedropper */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-stone-50 rounded-2xl border border-stone-200 relative overflow-hidden flex items-center justify-center min-h-[380px] sm:min-h-[420px] select-none shadow-inner">
            
            {/* Live Camera Feed */}
            {isCameraActive ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full max-h-[380px] object-contain rounded-xl border border-stone-300"
                />
                
                <div className="absolute bottom-6 flex items-center gap-3 bg-black/80 backdrop-blur-md p-2 rounded-full border border-white/20">
                  <button
                    onClick={toggleCameraFacing}
                    className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Switch Camera"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>
                  <button
                    onClick={capturePhotoFromCamera}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-full text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Click Photo to Match</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Photo Canvas */
              <div className="relative w-full flex items-center justify-center p-3">
                <canvas
                  ref={canvasRef}
                  onMouseMove={(e) => sampleColorAtPoint(e.clientX, e.clientY, false)}
                  onMouseLeave={() => setMagnifierPos(null)}
                  onClick={(e) => sampleColorAtPoint(e.clientX, e.clientY, true)}
                  onTouchStart={(e) => {
                    if (e.touches[0]) sampleColorAtPoint(e.touches[0].clientX, e.touches[0].clientY, true);
                  }}
                  className="max-h-[390px] w-auto max-w-full object-contain cursor-crosshair rounded-xl shadow-md border border-stone-200"
                />

                {/* Eyedropper Magnifier Ring */}
                {magnifierPos && hoveredColor && (
                  <div
                    className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-30 transition-transform duration-75"
                    style={{ left: magnifierPos.x, top: magnifierPos.y }}
                  >
                    <div className="w-16 h-16 rounded-full border-3 border-white shadow-2xl overflow-hidden relative bg-black/40 flex items-center justify-center backdrop-blur-xs">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-white shadow-inner"
                        style={{ backgroundColor: hoveredColor }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Instruction Tip */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-200 text-xs font-semibold text-[#1A1A1A] flex items-center gap-1.5 shadow-xs pointer-events-none">
              <Pipette className="w-3.5 h-3.5 text-amber-600" />
              <span>Tap anywhere on the photo to pick a shade</span>
            </div>
          </div>

          {/* Quick Preset Rooms */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2.5">
            <span className="text-xs font-bold text-[#1A1A1A]/70 uppercase tracking-wider block">
              Or Try Sample Rooms:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SAMPLE_TEST_PHOTOS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setImageSrc(sample.url);
                    setSelectedHex(sample.defaultHex);
                    executeMatch(sample.defaultHex);
                  }}
                  className="flex items-center gap-3 p-2 rounded-xl bg-white border border-stone-200 hover:border-amber-400 text-left transition-all group cursor-pointer shadow-xs"
                >
                  <img
                    src={sample.url}
                    alt={sample.title}
                    className="w-11 h-11 rounded-lg object-cover border border-stone-200 flex-shrink-0"
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-[#1A1A1A] group-hover:text-amber-600 truncate">
                      {sample.title}
                    </div>
                    <div className="text-[11px] text-[#1A1A1A]/50 truncate">
                      {sample.tag}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Extracted Colors */}
          {dominantColors.length > 0 && (
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A1A1A]/70 uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-600" />
                  Main Colors Found in Photo
                </span>
                <span className="text-[11px] text-[#1A1A1A]/50">Tap any box to match</span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {dominantColors.map((col, idx) => (
                  <button
                    key={idx}
                    onClick={() => executeMatch(col.hex)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer group ${
                      selectedHex === col.hex 
                        ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-500/20' 
                        : 'bg-white border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div 
                      className="w-full h-8 rounded-lg border border-stone-200 shadow-xs mb-1.5 transition-transform group-hover:scale-105"
                      style={{ backgroundColor: col.hex }}
                    />
                    <div className="text-[11px] font-semibold text-[#1A1A1A] truncate">
                      {col.percentage}% of room
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Friendly Result Card */}
        <div className="lg:col-span-5 space-y-4">
          
          {isLoadingMatch && (
            <div className="h-64 border border-stone-200 bg-stone-50 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-amber-600 mb-3" />
              <p className="text-sm font-bold text-[#1A1A1A]">Finding Nearest Paint Shade...</p>
              <p className="text-xs text-[#1A1A1A]/60 mt-1">Comparing against Asian Paints shade formulations.</p>
            </div>
          )}

          {errorMessage && !isLoadingMatch && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {matchData && !isLoadingMatch && (
            <div className="space-y-4">
              
              {/* PRIMARY MATCH CARD */}
              <div className="bg-white border-2 border-amber-500/30 rounded-3xl p-6 shadow-xl relative space-y-5">
                
                {/* Header: Shade Name & Quality */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 inline-block mb-1.5">
                      Closest Catalog Match
                    </span>
                    <h4 className="text-2xl font-black text-[#1A1A1A] tracking-tight">
                      {matchData.primaryMatch.name}
                    </h4>
                    <p className="text-xs text-[#1A1A1A]/70 mt-0.5 font-medium">
                      {matchData.primaryMatch.productFamily} &bull; {matchData.primaryMatch.finish} Sheen
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-amber-600">
                      {matchData.primaryMatch.matchConfidencePercent}%
                    </div>
                    <span className="text-[10px] text-[#1A1A1A]/60 uppercase font-bold">
                      Match Accuracy
                    </span>
                  </div>
                </div>

                {/* Visual Swatch Comparison */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="space-y-1 text-center">
                    <span className="text-[11px] text-[#1A1A1A]/60 font-semibold block">Picked from Photo</span>
                    <div 
                      className="h-14 rounded-xl border border-stone-300 shadow-inner flex items-center justify-center text-xs font-mono font-bold text-white shadow-xs"
                      style={{ backgroundColor: matchData.scannedHex }}
                    >
                      <span className="bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                        {matchData.scannedHex}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-center">
                    <span className="text-[11px] text-[#1A1A1A]/60 font-semibold block">Asian Paints Shade</span>
                    <div 
                      className="h-14 rounded-xl border border-stone-300 shadow-inner flex items-center justify-center text-xs font-mono font-bold text-white shadow-xs"
                      style={{ backgroundColor: matchData.primaryMatch.hex }}
                    >
                      <span className="bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                        {matchData.primaryMatch.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Friendly Info Grid (No LRV or Delta-E math) */}
                <div className="grid grid-cols-2 gap-2.5 text-center text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-[#1A1A1A]/50 text-[10px] font-bold uppercase">Estimated Price</div>
                    <div className="text-base font-black text-amber-600 mt-0.5">₹{matchData.primaryMatch.pricePerLiter} / Litre</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="text-[#1A1A1A]/50 text-[10px] font-bold uppercase">Recommended Primer</div>
                    <div className="text-xs font-bold text-[#1A1A1A] mt-1 truncate">{matchData.recommendedUndercoat}</div>
                  </div>
                </div>

                {/* Direct 1-Click Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={() => {
                      const mockProduct: any = {
                        id: matchData.primaryMatch.id,
                        name: matchData.primaryMatch.name,
                        category: matchData.primaryMatch.category || 'interior',
                        finish: matchData.primaryMatch.finish || 'Eggshell',
                        washabilityScore: 9,
                        vocLevel: 'Zero VOC (< 5g/L)',
                        coverageSqFtPerLiter: 140,
                        priceTier: 'Luxury',
                        estimatedPricePerLiter: matchData.primaryMatch.pricePerLiter,
                        hexCode: matchData.primaryMatch.hex,
                        description: `Matched shade from Reference Color Extractor: ${matchData.primaryMatch.name} (${matchData.primaryMatch.productFamily}).`,
                        keyFeatures: ['Matched via Photo Scanner', 'Authentic Asian Paints Formulation'],
                        recommendedRooms: ['Living Room', 'Bedrooms']
                      };
                      if (onSelectProductForCalculator) {
                        onSelectProductForCalculator(mockProduct);
                      }
                    }}
                    className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Calculate Paint Liters & Can Packs</span>
                  </button>

                  {onApplyToVisualizer && (
                    <button
                      onClick={() => onApplyToVisualizer(matchData.primaryMatch.hex, matchData.primaryMatch.name)}
                      className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-[#1A1A1A] font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-stone-200"
                    >
                      <Eye className="w-4 h-4 text-amber-600" />
                      <span>Preview Shade on Wall Simulator</span>
                    </button>
                  )}
                </div>

              </div>

              {/* Similar Alternative Shades */}
              {matchData.closeAlternatives && matchData.closeAlternatives.length > 0 && (
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2.5">
                  <span className="text-xs font-bold text-[#1A1A1A]/70 block uppercase tracking-wider">
                    Similar Subtle Shades to Compare:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {matchData.closeAlternatives.map((alt) => (
                      <button
                        key={alt.id}
                        onClick={() => executeMatch(alt.hex)}
                        className="p-2 rounded-xl bg-white border border-stone-200 hover:border-amber-400 text-left transition-all flex items-center gap-2.5 group cursor-pointer shadow-2xs"
                      >
                        <span 
                          className="w-6 h-6 rounded-lg border border-stone-300 flex-shrink-0 shadow-2xs"
                          style={{ backgroundColor: alt.hex }}
                        />
                        <div className="overflow-hidden">
                          <div className="text-xs font-bold text-[#1A1A1A] group-hover:text-amber-600 truncate">
                            {alt.name}
                          </div>
                          <div className="text-[10px] text-[#1A1A1A]/50">
                            {alt.matchConfidencePercent}% match
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Ceiling & Trim Whites */}
              {harmoniesData?.harmonies?.recommendedTrims && (
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2.5">
                  <span className="text-xs font-bold text-[#1A1A1A]/70 block uppercase tracking-wider">
                    Matching Ceiling & Border Whites:
                  </span>
                  <div className="space-y-2">
                    {harmoniesData.harmonies.recommendedTrims.map((trim, idx) => (
                      <div 
                        key={idx}
                        className="p-2.5 bg-white rounded-xl border border-stone-200 flex items-center justify-between text-xs shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span 
                            className="w-6 h-6 rounded-lg border border-stone-300 shadow-2xs"
                            style={{ backgroundColor: trim.hex }}
                          />
                          <div>
                            <div className="font-bold text-[#1A1A1A]">{trim.name}</div>
                            <div className="text-[10px] text-[#1A1A1A]/50">{trim.role}</div>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Matching White
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
