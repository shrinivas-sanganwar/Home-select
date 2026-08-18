import React, { useState, useEffect } from 'react';
import { 
  SiteData, 
  PaintProduct, 
  IndianPalette, 
  TimelinePeriod, 
  InspirationRoom, 
  InnovationItem 
} from '../types';
import { 
  Sparkles, 
  Save, 
  CheckCircle, 
  Layers, 
  Palette, 
  Clock, 
  BookOpen, 
  Navigation, 
  Image, 
  Compass, 
  Lightbulb, 
  Plus, 
  Trash2, 
  Eye,
  Check
} from 'lucide-react';
import { useRole } from '../context/RoleContext';

interface CmsEditorTabProps {
  siteData: SiteData;
  onUpdateSiteData: (updatedSiteData: SiteData) => void;
}

export const CmsEditorTab: React.FC<CmsEditorTabProps> = ({ siteData, onUpdateSiteData }) => {
  const { currentRole } = useRole();
  const [activeSubTab, setActiveSubTab] = useState<'hero' | 'pillars' | 'doom-gallery' | 'timeline' | 'innovations-guides' | 'nav-footer'>('hero');
  const [formData, setFormData] = useState<SiteData>(siteData);
  const [saveNotice, setSaveNotice] = useState(false);

  useEffect(() => {
    setFormData(siteData);
  }, [siteData]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateSiteData(formData);
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Action */}
      <div className="bg-gradient-to-r from-[#E68A00]/10 via-[#243B7A]/5 to-[#3F8F6B]/5 p-5 rounded-2xl border border-[#E8E2D5] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E68A00] text-white uppercase tracking-wider">
              Whole Website CMS
            </span>
            <span className="text-xs text-[#1A1A1A]/50">&bull; Live Editorial Control</span>
          </div>
          <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">
            Complete Website Content &amp; Story Management
          </h3>
          <p className="text-xs text-[#1A1A1A]/70 max-w-2xl mt-1 leading-relaxed">
            Directly edit every single heading, cultural story in the Doom Gallery, architectural timeline era, and innovation card across the website. All changes update in real-time.
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          className="px-5 py-2.5 bg-[#3F8F6B] text-white rounded-xl text-xs font-bold hover:bg-[#327356] transition-colors flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Save className="w-4 h-4 text-white" />
          <span>Publish All Changes Live</span>
        </button>
      </div>

      {saveNotice && (
        <div className="p-3 px-5 bg-[#3F8F6B]/15 border border-[#3F8F6B]/40 rounded-xl text-xs font-bold text-[#3F8F6B] flex items-center gap-2 animate-fadeIn shadow-2xs">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Website content updated successfully! Live website reflects all new copy and stories.</span>
        </div>
      )}

      {/* Sub-Section Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-[#E8E2D5]">
        {[
          { id: 'hero', label: '🏛️ Hero & Branding', icon: Image },
          { id: 'pillars', label: '💎 Specification Pillars', icon: Layers },
          { id: 'doom-gallery', label: '🎨 Doom Gallery & Palettes', icon: Palette },
          { id: 'timeline', label: '⏳ Historical Eras Timeline', icon: Clock },
          { id: 'innovations-guides', label: '💡 Innovation Lab & Guides', icon: Lightbulb },
          { id: 'nav-footer', label: '🧭 Navigation & Footer', icon: Navigation },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-t-xl font-bold transition-all whitespace-nowrap cursor-pointer border-t border-x ${
              activeSubTab === tab.id
                ? 'bg-white text-[#243B7A] border-[#E8E2D5] border-b-transparent shadow-2xs -mb-px z-10'
                : 'bg-[#F8F4EC]/60 text-[#5C6066] border-transparent hover:bg-white/80 hover:text-[#1A1A1A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: HERO & BRANDING */}
      {activeSubTab === 'hero' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-2xs space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]">
            <h4 className="font-heading font-bold text-base text-[#1A1A1A]">
              Hero Presentation &amp; Core Branding
            </h4>
            <span className="text-[11px] text-[#1A1A1A]/50">First viewport seen by all visitors</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[#1A1A1A] block mb-1">Brand Name / Logo Text</label>
              <input
                type="text"
                value={formData.logoName}
                onChange={(e) => setFormData({ ...formData, logoName: e.target.value })}
                className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-bold text-sm text-[#243B7A]"
              />
            </div>

            <div>
              <label className="font-bold text-[#1A1A1A] block mb-1">Brand Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#1A1A1A] block mb-1">Hero Main Display Headline</label>
            <input
              type="text"
              value={formData.hero.headline}
              onChange={(e) => setFormData({
                ...formData,
                hero: { ...formData.hero, headline: e.target.value }
              })}
              className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-heading font-bold text-sm text-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="font-bold text-[#1A1A1A] block mb-1">Hero Subtitle / Description</label>
            <textarea
              rows={3}
              value={formData.hero.subtitle}
              onChange={(e) => setFormData({
                ...formData,
                hero: { ...formData.hero, subtitle: e.target.value }
              })}
              className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[#1A1A1A] block mb-1">Primary Button Label</label>
              <input
                type="text"
                value={formData.hero.primaryButton.label}
                onChange={(e) => setFormData({
                  ...formData,
                  hero: {
                    ...formData.hero,
                    primaryButton: { ...formData.hero.primaryButton, label: e.target.value }
                  }
                })}
                className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-[#1A1A1A] block mb-1">Secondary Button Label</label>
              <input
                type="text"
                value={formData.hero.secondaryButton.label}
                onChange={(e) => setFormData({
                  ...formData,
                  hero: {
                    ...formData.hero,
                    secondaryButton: { ...formData.hero.secondaryButton, label: e.target.value }
                  }
                })}
                className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#1A1A1A] block mb-1">Hero Featured Architectural Photo URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.heroImageUrl}
                onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
                className="flex-1 p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-mono text-[11px]"
              />
            </div>
            {formData.heroImageUrl && (
              <div className="mt-3 h-40 rounded-2xl overflow-hidden border border-[#E8E2D5] relative">
                <img
                  src={formData.heroImageUrl}
                  alt="Hero photo preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-2 right-3 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full font-bold">
                  Live Background Preview
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: SPECIFICATION PILLARS */}
      {activeSubTab === 'pillars' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-2xs space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]">
            <h4 className="font-heading font-bold text-base text-[#1A1A1A]">
              Architectural Specification Pillars (3 Features)
            </h4>
            <span className="text-[11px] text-[#1A1A1A]/50">Positioned immediately below Hero</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[#1A1A1A] block mb-1">Features Section Headline</label>
              <input
                type="text"
                value={formData.featuresHeadline}
                onChange={(e) => setFormData({ ...formData, featuresHeadline: e.target.value })}
                className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-[#1A1A1A] block mb-1">Features Section Subtitle</label>
              <input
                type="text"
                value={formData.featuresSubtitle}
                onChange={(e) => setFormData({ ...formData, featuresSubtitle: e.target.value })}
                className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <span className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A]/70 block">
              3 Feature Cards
            </span>
            {formData.features.map((feat, idx) => (
              <div key={feat.id} className="p-4 bg-[#F8F4EC] rounded-2xl border border-[#E8E2D5] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#243B7A]">Pillar #{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#1A1A1A]/60">Accent Color:</span>
                    <input
                      type="color"
                      value={feat.accentColor}
                      onChange={(e) => {
                        const updated = [...formData.features];
                        updated[idx].accentColor = e.target.value;
                        setFormData({ ...formData, features: updated });
                      }}
                      className="w-6 h-6 rounded cursor-pointer border-0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#1A1A1A]/60 block mb-1">Title</label>
                    <input
                      type="text"
                      value={feat.title}
                      onChange={(e) => {
                        const updated = [...formData.features];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, features: updated });
                      }}
                      className="w-full p-2 bg-white border border-[#E8E2D5] rounded-lg font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#1A1A1A]/60 block mb-1">Icon Name</label>
                    <input
                      type="text"
                      value={feat.iconName}
                      onChange={(e) => {
                        const updated = [...formData.features];
                        updated[idx].iconName = e.target.value;
                        setFormData({ ...formData, features: updated });
                      }}
                      className="w-full p-2 bg-white border border-[#E8E2D5] rounded-lg font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#1A1A1A]/60 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={feat.description}
                    onChange={(e) => {
                      const updated = [...formData.features];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, features: updated });
                    }}
                    className="w-full p-2 bg-white border border-[#E8E2D5] rounded-lg text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: DOOM GALLERY & COLOURS OF INDIA */}
      {activeSubTab === 'doom-gallery' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-2xs space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]">
            <div>
              <h4 className="font-heading font-bold text-base text-[#1A1A1A]">
                Colours of India &amp; 3D Doom Gallery Stories
              </h4>
              <p className="text-[11px] text-[#1A1A1A]/50">
                Manages regional cultural palettes, 3D dome swatches, and matching shade recommendations
              </p>
            </div>
            <span className="text-[10px] font-bold bg-[#E68A00]/15 text-[#E68A00] px-2.5 py-1 rounded-full uppercase">
              Doom Gallery Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[#1A1A1A] block mb-1">Doom Gallery Headline</label>
              <input
                type="text"
                value={formData.doomGalleryHeadline || 'Colours of India & 3D Doom Gallery'}
                onChange={(e) => setFormData({ ...formData, doomGalleryHeadline: e.target.value })}
                className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-[#1A1A1A] block mb-1">Doom Gallery Subtitle</label>
              <input
                type="text"
                value={formData.doomGallerySubtitle || 'Discover regional architectural color stories, cultural nuances, and explore 3D spherical shade domes.'}
                onChange={(e) => setFormData({ ...formData, doomGallerySubtitle: e.target.value })}
                className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <span className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A]/70 block">
              4 Regional Indian Palettes &amp; Matching Shade Rules
            </span>

            {(formData.palettes || []).map((pal, idx) => (
              <div key={pal.id} className="p-4 bg-[#F8F4EC] rounded-2xl border border-[#E8E2D5] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: pal.primaryHex }} />
                    <input
                      type="text"
                      value={pal.paletteTitle}
                      onChange={(e) => {
                        const updated = [...(formData.palettes || [])];
                        updated[idx].paletteTitle = e.target.value;
                        setFormData({ ...formData, palettes: updated });
                      }}
                      className="font-bold text-xs bg-white p-1.5 rounded-lg border border-[#E8E2D5] w-64"
                    />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#243B7A] text-white">
                    {pal.regionName}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#1A1A1A]/60 block mb-1">Cultural Narrative &amp; Story</label>
                  <textarea
                    rows={2}
                    value={pal.culturalStory}
                    onChange={(e) => {
                      const updated = [...(formData.palettes || [])];
                      updated[idx].culturalStory = e.target.value;
                      setFormData({ ...formData, palettes: updated });
                    }}
                    className="w-full p-2 bg-white border border-[#E8E2D5] rounded-lg text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#1A1A1A]/60 block mb-1">Recommended Room Suitability &amp; Placement</label>
                  <input
                    type="text"
                    value={pal.bestSuitedFor}
                    onChange={(e) => {
                      const updated = [...(formData.palettes || [])];
                      updated[idx].bestSuitedFor = e.target.value;
                      setFormData({ ...formData, palettes: updated });
                    }}
                    className="w-full p-2 bg-white border border-[#E8E2D5] rounded-lg text-xs"
                  />
                </div>

                {/* Color swatches in this palette */}
                <div className="pt-2 border-t border-[#E8E2D5]/70">
                  <span className="text-[10px] font-bold text-[#1A1A1A]/60 block mb-2">Palette Shades &amp; Codes:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {pal.colors.map((c, cIdx) => (
                      <div key={cIdx} className="p-2 bg-white rounded-xl border border-[#E8E2D5] space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-md border border-black/10 shrink-0" style={{ backgroundColor: c.hex }} />
                          <span className="font-bold text-[11px] truncate">{c.name}</span>
                        </div>
                        <p className="text-[10px] font-mono text-[#1A1A1A]/60">{c.code} &bull; LRV {c.lrv}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: HISTORICAL TIMELINE */}
      {activeSubTab === 'timeline' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-2xs space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]">
            <h4 className="font-heading font-bold text-base text-[#1A1A1A]">
              Paint Through Time (Historical Heritage Timeline)
            </h4>
            <span className="text-[11px] text-[#1A1A1A]/50">4 Classical Eras</span>
          </div>

          <div className="space-y-4">
            {(formData.timelines || []).map((era, idx) => (
              <div key={era.id} className="p-4 bg-[#F8F4EC] rounded-2xl border border-[#E8E2D5] space-y-3">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={era.title}
                    onChange={(e) => {
                      const updated = [...(formData.timelines || [])];
                      updated[idx].title = e.target.value;
                      setFormData({ ...formData, timelines: updated });
                    }}
                    className="font-bold text-xs bg-white p-2 rounded-lg border border-[#E8E2D5] flex-1 mr-3"
                  />
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#E68A00] text-white">
                    {era.era}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#1A1A1A]/60 block mb-1">Architectural Style</label>
                    <input
                      type="text"
                      value={era.architecturalStyle}
                      onChange={(e) => {
                        const updated = [...(formData.timelines || [])];
                        updated[idx].architecturalStyle = e.target.value;
                        setFormData({ ...formData, timelines: updated });
                      }}
                      className="w-full p-2 bg-white border border-[#E8E2D5] rounded-lg text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#1A1A1A]/60 block mb-1">Key Pigment Color Name</label>
                    <input
                      type="text"
                      value={era.keyColorName}
                      onChange={(e) => {
                        const updated = [...(formData.timelines || [])];
                        updated[idx].keyColorName = e.target.value;
                        setFormData({ ...formData, timelines: updated });
                      }}
                      className="w-full p-2 bg-white border border-[#E8E2D5] rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#1A1A1A]/60 block mb-1">Historical Pigment Story</label>
                  <textarea
                    rows={2}
                    value={era.historicalContext}
                    onChange={(e) => {
                      const updated = [...(formData.timelines || [])];
                      updated[idx].historicalContext = e.target.value;
                      setFormData({ ...formData, timelines: updated });
                    }}
                    className="w-full p-2 bg-white border border-[#E8E2D5] rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#1A1A1A]/60 block mb-1">Modern Architectural Translation</label>
                  <input
                    type="text"
                    value={era.modernApplication}
                    onChange={(e) => {
                      const updated = [...(formData.timelines || [])];
                      updated[idx].modernApplication = e.target.value;
                      setFormData({ ...formData, timelines: updated });
                    }}
                    className="w-full p-2 bg-white border border-[#E8E2D5] rounded-lg text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: INNOVATION LAB & GUIDES */}
      {activeSubTab === 'innovations-guides' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-2xs space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]">
            <h4 className="font-heading font-bold text-base text-[#1A1A1A]">
              Innovation Lab &amp; Room Selection Guides
            </h4>
            <span className="text-[11px] text-[#1A1A1A]/50">4 Breakthroughs &amp; Room Guidance</span>
          </div>

          <div className="space-y-4">
            <span className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A]/70 block">
              4 Paint Innovation Breakthroughs
            </span>

            {(formData.innovations || []).map((innov, idx) => (
              <div key={innov.id} className="p-4 bg-[#F8F4EC] rounded-2xl border border-[#E8E2D5] space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={innov.title}
                    onChange={(e) => {
                      const updated = [...(formData.innovations || [])];
                      updated[idx].title = e.target.value;
                      setFormData({ ...formData, innovations: updated });
                    }}
                    className="font-bold text-xs bg-white p-2 rounded-lg border border-[#E8E2D5] flex-1"
                  />
                  <input
                    type="text"
                    value={innov.badge}
                    onChange={(e) => {
                      const updated = [...(formData.innovations || [])];
                      updated[idx].badge = e.target.value;
                      setFormData({ ...formData, innovations: updated });
                    }}
                    className="text-[10px] font-bold px-2 py-1.5 bg-white border border-[#E8E2D5] rounded-lg w-32 text-center text-[#243B7A]"
                  />
                </div>

                <input
                  type="text"
                  value={innov.tagline}
                  onChange={(e) => {
                    const updated = [...(formData.innovations || [])];
                    updated[idx].tagline = e.target.value;
                    setFormData({ ...formData, innovations: updated });
                  }}
                  className="w-full p-2 bg-white border border-[#E8E2D5] rounded-lg text-xs font-semibold text-[#E68A00]"
                />

                <textarea
                  rows={2}
                  value={innov.description}
                  onChange={(e) => {
                    const updated = [...(formData.innovations || [])];
                    updated[idx].description = e.target.value;
                    setFormData({ ...formData, innovations: updated });
                  }}
                  className="w-full p-2 bg-white border border-[#E8E2D5] rounded-lg text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: NAVIGATION & FOOTER */}
      {activeSubTab === 'nav-footer' && (
        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-2xs space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]">
            <h4 className="font-heading font-bold text-base text-[#1A1A1A]">
              Navigation Links &amp; Footer Concierge
            </h4>
            <span className="text-[11px] text-[#1A1A1A]/50">Global header &amp; footer settings</span>
          </div>

          <div className="space-y-3">
            <span className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A]/70 block">
              Navbar Menu Links
            </span>
            <div className="space-y-2">
              {formData.navItems.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => {
                      const updated = [...formData.navItems];
                      updated[idx].label = e.target.value;
                      setFormData({ ...formData, navItems: updated });
                    }}
                    className="p-2 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-bold text-xs flex-1"
                  />
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => {
                      const updated = [...formData.navItems];
                      updated[idx].href = e.target.value;
                      setFormData({ ...formData, navItems: updated });
                    }}
                    className="p-2 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-mono text-xs flex-1 text-[#243B7A]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E8E2D5]">
            <div>
              <label className="font-bold text-[#1A1A1A] block mb-1">Concierge Email</label>
              <input
                type="email"
                value={formData.footer?.contactEmail || 'concierge@homeselect.in'}
                onChange={(e) => setFormData({
                  ...formData,
                  footer: {
                    contactEmail: e.target.value,
                    contactPhone: formData.footer?.contactPhone || '',
                    copyrightText: formData.footer?.copyrightText || '',
                    disclaimerText: formData.footer?.disclaimerText || '',
                  }
                })}
                className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-[#1A1A1A] block mb-1">Toll-Free Helpline</label>
              <input
                type="text"
                value={formData.footer?.contactPhone || '+91 1800-209-5678'}
                onChange={(e) => setFormData({
                  ...formData,
                  footer: {
                    contactEmail: formData.footer?.contactEmail || '',
                    contactPhone: e.target.value,
                    copyrightText: formData.footer?.copyrightText || '',
                    disclaimerText: formData.footer?.disclaimerText || '',
                  }
                })}
                className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#1A1A1A] block mb-1">Copyright Note</label>
            <input
              type="text"
              value={formData.footer?.copyrightText || '© 2026 HomeSelect India Coatings Intelligence.'}
              onChange={(e) => setFormData({
                ...formData,
                footer: {
                  contactEmail: formData.footer?.contactEmail || '',
                  contactPhone: formData.footer?.contactPhone || '',
                  copyrightText: e.target.value,
                  disclaimerText: formData.footer?.disclaimerText || '',
                }
              })}
              className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-[#1A1A1A] block mb-1">Architectural Technical Disclaimer</label>
            <textarea
              rows={2}
              value={formData.footer?.disclaimerText || ''}
              onChange={(e) => setFormData({
                ...formData,
                footer: {
                  contactEmail: formData.footer?.contactEmail || '',
                  contactPhone: formData.footer?.contactPhone || '',
                  copyrightText: formData.footer?.copyrightText || '',
                  disclaimerText: e.target.value,
                }
              })}
              className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl text-xs"
            />
          </div>
        </div>
      )}

      {/* Bottom Publish Button */}
      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E8E2D5]">
        <span className="text-xs text-[#1A1A1A]/60">
          Saved data is persistently stored in browser LocalStorage.
        </span>

        <button
          onClick={() => handleSave()}
          className="px-6 py-2.5 bg-[#243B7A] text-white rounded-full text-xs font-bold hover:bg-[#1C2E60] transition-colors flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Save className="w-4 h-4 text-[#E68A00]" />
          <span>Save &amp; Publish Website</span>
        </button>
      </div>

    </div>
  );
};
