import React, { useState } from 'react';
import { 
  Pipette, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Copy, 
  RefreshCw, 
  Sliders, 
  Layers, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sun,
  Palette
} from 'lucide-react';
import { PaintProduct } from '../types';

interface HexScannerTesterProps {
  onSelectProductForCalculator?: (product: PaintProduct) => void;
  onClose?: () => void;
}

interface MatchResult {
  success: boolean;
  scannedHex: string;
  scannedRgb: { r: number; g: number; b: number };
  computedLRV: number;
  primaryMatch: {
    id: string;
    name: string;
    hex: string;
    productFamily: string;
    category: string;
    finish: string;
    pricePerLiter: number;
    lrv: number;
    tag: string;
    matchConfidencePercent: number;
    distance: number;
  };
  closeAlternatives: Array<{
    id: string;
    name: string;
    hex: string;
    productFamily: string;
    category: string;
    finish: string;
    pricePerLiter: number;
    lrv: number;
    tag: string;
    matchConfidencePercent: number;
    distance: number;
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

const PRESET_SCANNED_SAMPLES = [
  { name: 'Heritage Terracotta Brick', hex: '#D96C4A', source: 'Architectural Brick Photo' },
  { name: 'Colonial Indigo Door', hex: '#345570', source: 'Instagram Decor Post' },
  { name: 'Warm Cream Silk Saree', hex: '#F3EDE0', source: 'Fabric Sample Scan' },
  { name: 'Kerala Rain Forest Leaf', hex: '#265C45', source: 'Nature Camera Scan' },
  { name: 'Jodhpur Marigold Wall', hex: '#E59235', source: 'Travel Photo Reference' }
];

export const HexScannerTester: React.FC<HexScannerTesterProps> = ({
  onSelectProductForCalculator
}) => {
  const [inputHex, setInputHex] = useState('#D96C4A');
  const [activeAppId, setActiveAppId] = useState('hex-scanner');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchData, setMatchData] = useState<MatchResult | null>(null);
  const [harmoniesData, setHarmoniesData] = useState<HarmoniesResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'match' | 'harmonies' | 'api-logs'>('match');

  // Trigger test matching call against our actual server endpoint
  const runColorMatch = async (hexToTest = inputHex) => {
    setIsLoading(true);
    setError(null);
    try {
      // Clean hex
      let cleanHex = hexToTest.trim();
      if (!cleanHex.startsWith('#')) {
        cleanHex = '#' + cleanHex;
      }

      // Call the match endpoint with X-App-ID header
      const res = await fetch('/api/v1/scanner/match-hex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-ID': activeAppId,
          'X-App-Version': '1.0.0'
        },
        body: JSON.stringify({ hex: cleanHex })
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || `HTTP error ${res.status}`);
      }

      const data: MatchResult = await res.json();
      setMatchData(data);

      // Also query harmonies endpoint
      const harmRes = await fetch('/api/v1/scanner/harmonies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-ID': activeAppId,
          'X-App-Version': '1.0.0'
        },
        body: JSON.stringify({ hex: cleanHex })
      });
      if (harmRes.ok) {
        const harmData: HarmoniesResult = await harmRes.json();
        setHarmoniesData(harmData);
      }
    } catch (err: any) {
      console.error('Hex match tester error:', err);
      setError(err?.message || 'Failed to match color against database');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-stone-900 text-stone-100 rounded-2xl border border-stone-800 p-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Pipette className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">HexScanner ↔ Paint Catalog Bridge Sandbox</h3>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                Live Prototype
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Test how scanned HEX pigments from your camera/photo app match with the Indian architectural paint database.
            </p>
          </div>
        </div>

        {/* Client Header Switcher */}
        <div className="flex items-center gap-2 bg-stone-950 border border-stone-800 rounded-lg p-1 text-xs">
          <span className="text-stone-500 pl-2">Header:</span>
          <button
            onClick={() => setActiveAppId('hex-scanner')}
            className={`px-2.5 py-1 rounded transition-all ${
              activeAppId === 'hex-scanner' 
                ? 'bg-amber-500/20 text-amber-300 font-medium border border-amber-500/40' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            X-App-ID: "hex-scanner"
          </button>
          <button
            onClick={() => setActiveAppId('paint-store')}
            className={`px-2.5 py-1 rounded transition-all ${
              activeAppId === 'paint-store' 
                ? 'bg-amber-500/20 text-amber-300 font-medium border border-amber-500/40' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            "paint-store"
          </button>
        </div>
      </div>

      {/* Interactive Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
        {/* Left Column: Color Picker & Preset Samples */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-4 space-y-3">
            <label className="text-xs font-medium text-stone-400 uppercase tracking-wider block">
              Simulated Scanned HEX Code
            </label>
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl border-2 border-stone-700 shadow-inner flex-shrink-0 transition-colors"
                style={{ backgroundColor: inputHex }}
              />
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputHex}
                  onChange={(e) => setInputHex(e.target.value)}
                  placeholder="#D96C4A"
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-sm font-mono text-white uppercase focus:outline-none focus:border-amber-500"
                />
              </div>
              <input
                type="color"
                value={inputHex.startsWith('#') && inputHex.length === 7 ? inputHex : '#D96C4A'}
                onChange={(e) => {
                  setInputHex(e.target.value);
                  runColorMatch(e.target.value);
                }}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                title="Open Color Wheel"
              />
            </div>

            <button
              onClick={() => runColorMatch(inputHex)}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-lg text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Matching Against Database...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Match Color With Paint Catalog
                </>
              )}
            </button>
          </div>

          {/* Quick Presets from Camera/Photo simulations */}
          <div className="bg-stone-950/40 border border-stone-800/80 rounded-xl p-4">
            <span className="text-xs font-medium text-stone-400 block mb-2">
              Or Pick Scanned Sample from Photo/Camera:
            </span>
            <div className="space-y-1.5">
              {PRESET_SCANNED_SAMPLES.map((sample) => (
                <button
                  key={sample.hex}
                  onClick={() => {
                    setInputHex(sample.hex);
                    runColorMatch(sample.hex);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-stone-800/60 border border-transparent hover:border-stone-700/50 text-left transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-4 h-4 rounded-full border border-stone-600 shadow-sm flex-shrink-0"
                      style={{ backgroundColor: sample.hex }}
                    />
                    <div>
                      <div className="text-xs font-medium text-stone-200 group-hover:text-amber-300">
                        {sample.name}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        {sample.source}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-stone-400">
                    {sample.hex}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Matched Results & Analytics */}
        <div className="lg:col-span-7">
          {error && (
            <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!matchData && !isLoading && !error && (
            <div className="h-full min-h-[260px] border border-dashed border-stone-800 rounded-xl flex flex-col items-center justify-center p-6 text-center text-stone-500">
              <Palette className="w-10 h-10 stroke-1 mb-2 text-stone-600" />
              <p className="text-sm font-medium text-stone-400">Ready to Match Color</p>
              <p className="text-xs max-w-sm mt-1">
                Enter a hex or click one of the photo samples above to query the CIELAB matching engine and extract catalog paint shades.
              </p>
            </div>
          )}

          {matchData && (
            <div className="space-y-4">
              {/* Primary Match Card */}
              <div className="bg-gradient-to-br from-stone-900 to-stone-950 border border-amber-500/30 rounded-xl p-4 shadow-lg relative overflow-hidden">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40 inline-block mb-1">
                      Exact / Closest Catalog Match
                    </span>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      {matchData.primaryMatch.name}
                      <span className="text-xs font-normal text-stone-400 font-mono">
                        ({matchData.primaryMatch.hex})
                      </span>
                    </h4>
                    <p className="text-xs text-stone-400">
                      Product: <strong className="text-stone-200">{matchData.primaryMatch.productFamily}</strong> • Finish: <span className="text-stone-300">{matchData.primaryMatch.finish}</span>
                    </p>
                  </div>

                  {/* Confidence Badge */}
                  <div className="text-right">
                    <div className="text-2xl font-black text-amber-400">
                      {matchData.primaryMatch.matchConfidencePercent}%
                    </div>
                    <span className="text-[10px] text-stone-400 uppercase tracking-tight">
                      Delta-E Match Score
                    </span>
                  </div>
                </div>

                {/* Swatch Color Visual Comparison */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-stone-950 rounded-lg border border-stone-800 my-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-400 block font-medium">Scanned Source Pigment</span>
                    <div 
                      className="h-10 rounded-md border border-stone-700 shadow-inner flex items-center justify-center text-xs font-mono font-bold text-white shadow-sm"
                      style={{ backgroundColor: matchData.scannedHex }}
                    >
                      <span className="bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
                        {matchData.scannedHex}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-400 block font-medium">Matched Asian Paints Swatch</span>
                    <div 
                      className="h-10 rounded-md border border-stone-700 shadow-inner flex items-center justify-center text-xs font-mono font-bold text-white shadow-sm"
                      style={{ backgroundColor: matchData.primaryMatch.hex }}
                    >
                      <span className="bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
                        {matchData.primaryMatch.hex}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metric Pills */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                  <div className="p-2 bg-stone-950/60 rounded border border-stone-800">
                    <div className="text-stone-500 text-[10px]">Finish Type</div>
                    <div className="font-semibold text-stone-200">{matchData.primaryMatch.finish}</div>
                  </div>
                  <div className="p-2 bg-stone-950/60 rounded border border-stone-800">
                    <div className="text-stone-500 text-[10px]">Approx. Price</div>
                    <div className="font-semibold text-amber-300">₹{matchData.primaryMatch.pricePerLiter}/L</div>
                  </div>
                  <div className="p-2 bg-stone-950/60 rounded border border-stone-800">
                    <div className="text-stone-500 text-[10px]">Match Accuracy</div>
                    <div className="font-semibold text-emerald-400">{matchData.primaryMatch.matchConfidencePercent}%</div>
                  </div>
                </div>

                <div className="text-[11px] text-stone-400 flex items-center justify-between border-t border-stone-800/80 pt-2.5">
                  <span>Primer Base: <strong className="text-stone-300">{matchData.recommendedUndercoat}</strong></span>
                  
                  <button
                    onClick={() => {
                      // Construct a dummy PaintProduct format
                      const mockProduct: any = {
                        id: matchData.primaryMatch.id,
                        name: matchData.primaryMatch.name,
                        category: matchData.primaryMatch.category || 'interior',
                        finish: matchData.primaryMatch.finish || 'Eggshell',
                        lrv: matchData.computedLRV,
                        washabilityScore: 9,
                        vocLevel: 'Zero VOC (< 5g/L)',
                        coverageSqFtPerLiter: 140,
                        priceTier: 'Luxury',
                        estimatedPricePerLiter: matchData.primaryMatch.pricePerLiter,
                        hexCode: matchData.primaryMatch.hex,
                        description: `Matched shade for ${matchData.primaryMatch.name} (${matchData.primaryMatch.productFamily}).`,
                        keyFeatures: ['Matched from Hex Scanner', 'High scrub resistance'],
                        recommendedRooms: ['Living Room', 'Bedrooms']
                      };
                      if (onSelectProductForCalculator) {
                        onSelectProductForCalculator(mockProduct);
                      }
                    }}
                    className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium"
                  >
                    <span>Send to Paint Calculator</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Close Alternatives */}
              {matchData.closeAlternatives && matchData.closeAlternatives.length > 0 && (
                <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl space-y-2">
                  <span className="text-[11px] font-semibold text-stone-400 block uppercase tracking-wide">
                    Alternative Subtle Variations in Catalog:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {matchData.closeAlternatives.map((alt) => (
                      <button
                        key={alt.id}
                        onClick={() => {
                          setInputHex(alt.hex);
                          runColorMatch(alt.hex);
                        }}
                        className="p-2 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-left transition-all flex items-center gap-2 group"
                      >
                        <span 
                          className="w-5 h-5 rounded-md border border-stone-700 flex-shrink-0 shadow-xs"
                          style={{ backgroundColor: alt.hex }}
                        />
                        <div className="overflow-hidden">
                          <div className="text-xs font-medium text-stone-300 group-hover:text-amber-300 truncate">
                            {alt.name}
                          </div>
                          <div className="text-[10px] text-stone-500">
                            {alt.matchConfidencePercent}% match
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Complementary & Trim Harmonies */}
              {harmoniesData?.harmonies && (
                <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide">
                      Architectural Harmony & Trim Suggestions:
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">/api/v1/scanner/harmonies</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-stone-900 rounded border border-stone-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-4 h-4 rounded-full border border-stone-700" 
                          style={{ backgroundColor: harmoniesData.harmonies.complementary.hex }}
                        />
                        <div>
                          <div className="text-stone-300 font-medium">Complementary Accent</div>
                          <div className="text-[10px] text-stone-500 font-mono">{harmoniesData.harmonies.complementary.hex}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-amber-400 font-medium">
                        {harmoniesData.harmonies.complementary.nearestCatalogShade?.name}
                      </span>
                    </div>

                    {harmoniesData.harmonies.recommendedTrims.map((trim, idx) => (
                      <div key={idx} className="p-2 bg-stone-900 rounded border border-stone-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-4 h-4 rounded-full border border-stone-700" 
                            style={{ backgroundColor: trim.hex }}
                          />
                          <div>
                            <div className="text-stone-300 font-medium">{trim.name}</div>
                            <div className="text-[10px] text-stone-500">{trim.role}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-stone-400">{trim.hex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Integration Code Snippet Helper */}
      <div className="mt-6 pt-4 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            Copy this JavaScript snippet into your <strong>Hex Scanner App</strong> to test live data communication:
          </span>
        </div>
        <button
          onClick={() => {
            const snippet = `const matchColor = async (hexCode) => {
  const res = await fetch('${window.location.origin}/api/v1/scanner/match-hex', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-App-ID': 'hex-scanner' },
    body: JSON.stringify({ hex: hexCode })
  });
  return await res.json();
};`;
            handleCopy(snippet);
          }}
          className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg flex items-center gap-1.5 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Snippet!' : 'Copy Scanner Fetch Snippet'}</span>
        </button>
      </div>
    </div>
  );
};
