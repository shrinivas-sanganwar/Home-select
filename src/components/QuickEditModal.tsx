import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, CheckCircle, Image, Layers, Palette, Clock, BookOpen, Navigation, FileText, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useRole, EditableSectionKey } from '../context/RoleContext';
import { SiteData, PaintProduct, IndianPalette, TimelinePeriod, InspirationRoom, InnovationItem } from '../types';

interface QuickEditModalProps {
  siteData: SiteData;
  onUpdateSiteData: (updatedSiteData: SiteData) => void;
  products: PaintProduct[];
  onUpdateProducts: (updatedProducts: PaintProduct[]) => void;
}

export const QuickEditModal: React.FC<QuickEditModalProps> = ({
  siteData,
  onUpdateSiteData,
  products,
  onUpdateProducts,
}) => {
  const { activeQuickEditSection, closeQuickEdit, currentRole } = useRole();
  const [formData, setFormData] = useState<SiteData>(siteData);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    setFormData(siteData);
  }, [siteData, activeQuickEditSection]);

  if (!activeQuickEditSection) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteData(formData);
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      closeQuickEdit();
    }, 900);
  };

  const getSectionTitle = (section: EditableSectionKey) => {
    switch (section) {
      case 'hero':
        return 'Edit Hero & Main Presentation';
      case 'branding':
        return 'Edit Brand Name & Core Taglines';
      case 'features':
        return 'Edit Architectural Specification Pillars';
      case 'explorer':
        return 'Edit Explore Catalog Section Headers';
      case 'palettes':
        return 'Edit Colours of India & Doom Gallery Palettes';
      case 'timeline':
        return 'Edit Paint Through Time (Historical Timeline)';
      case 'guides':
        return 'Edit Architectural Room Guides & Lighting Advice';
      case 'innovations':
        return 'Edit Paint Technology & Innovation Breakthroughs';
      case 'footer':
        return 'Edit Navigation Links & Footer Concierge';
      default:
        return 'Edit Website Section';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#E8E2D5] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        
        {/* Modal Header */}
        <div className="p-5 bg-[#F8F4EC] border-b border-[#E8E2D5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#243B7A] text-white">
              <Sparkles className="w-4 h-4 text-[#E68A00]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-[#1A1A1A]">
                  {getSectionTitle(activeQuickEditSection)}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E68A00]/15 text-[#E68A00] uppercase tracking-wider">
                  Live Visual Edit
                </span>
              </div>
              <p className="text-[11px] text-[#1A1A1A]/60">
                Logged in as <strong className="capitalize">{currentRole.replace('-', ' ')}</strong> &bull; Changes update website instantly
              </p>
            </div>
          </div>

          <button
            onClick={closeQuickEdit}
            className="p-2 text-[#1A1A1A]/50 hover:text-[#1A1A1A] hover:bg-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="bg-[#3F8F6B] text-white p-3 px-6 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Updates saved and published live to the website!</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          
          {/* SECTION: HERO */}
          {activeQuickEditSection === 'hero' && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Hero Main Headline</label>
                <input
                  type="text"
                  required
                  value={formData.hero.headline}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, headline: e.target.value }
                  })}
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-heading font-bold text-sm text-[#1A1A1A] focus:outline-none focus:border-[#243B7A]"
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
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#243B7A] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Primary CTA Button Label</label>
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
                    className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl text-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Secondary CTA Button Label</label>
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
                    className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl text-[#1A1A1A]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Hero Background Image URL</label>
                <input
                  type="url"
                  value={formData.heroImageUrl}
                  onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-mono text-[11px] text-[#1A1A1A]"
                />
                {formData.heroImageUrl && (
                  <div className="mt-2 h-32 rounded-xl overflow-hidden border border-[#E8E2D5]">
                    <img
                      src={formData.heroImageUrl}
                      alt="Hero preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION: BRANDING */}
          {activeQuickEditSection === 'branding' && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Brand / Platform Logo Name</label>
                <input
                  type="text"
                  required
                  value={formData.logoName}
                  onChange={(e) => setFormData({ ...formData, logoName: e.target.value })}
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-bold text-sm text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl text-[#1A1A1A]"
                />
              </div>
            </div>
          )}

          {/* SECTION: FEATURES */}
          {activeQuickEditSection === 'features' && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Section Headline</label>
                <input
                  type="text"
                  value={formData.featuresHeadline}
                  onChange={(e) => setFormData({ ...formData, featuresHeadline: e.target.value })}
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Section Subtitle</label>
                <input
                  type="text"
                  value={formData.featuresSubtitle}
                  onChange={(e) => setFormData({ ...formData, featuresSubtitle: e.target.value })}
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl"
                />
              </div>

              <div className="space-y-3 pt-2">
                <span className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A]/70 block">
                  3 Architectural Pillars
                </span>
                {formData.features.map((feat, idx) => (
                  <div key={feat.id} className="p-3.5 bg-[#F8F4EC] rounded-xl border border-[#E8E2D5] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#243B7A]">Pillar #{idx + 1}</span>
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
                    <input
                      type="text"
                      value={feat.title}
                      onChange={(e) => {
                        const updated = [...formData.features];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, features: updated });
                      }}
                      placeholder="Pillar Title"
                      className="w-full p-2 bg-white border border-[#E8E2D5] rounded-lg font-semibold"
                    />
                    <textarea
                      rows={2}
                      value={feat.description}
                      onChange={(e) => {
                        const updated = [...formData.features];
                        updated[idx].description = e.target.value;
                        setFormData({ ...formData, features: updated });
                      }}
                      placeholder="Pillar Description"
                      className="w-full p-2 bg-white border border-[#E8E2D5] rounded-lg text-[11px]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: EXPLORER */}
          {activeQuickEditSection === 'explorer' && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Catalog Section Title</label>
                <input
                  type="text"
                  value={formData.explorerHeadline}
                  onChange={(e) => setFormData({ ...formData, explorerHeadline: e.target.value })}
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Catalog Subtitle</label>
                <textarea
                  rows={2}
                  value={formData.explorerSubtitle}
                  onChange={(e) => setFormData({ ...formData, explorerSubtitle: e.target.value })}
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl"
                />
              </div>

              <div className="p-3 bg-[#243B7A]/5 border border-[#243B7A]/20 rounded-xl text-[11px] text-[#243B7A] flex items-center justify-between">
                <span>To edit individual paint products, prices, or extract new TDS sheets, use the central Admin Portal.</span>
              </div>
            </div>
          )}

          {/* SECTION: PALETTES / DOOM GALLERY */}
          {activeQuickEditSection === 'palettes' && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Doom Gallery Section Headline</label>
                <input
                  type="text"
                  value={formData.doomGalleryHeadline || 'Colours of India & 3D Doom Gallery'}
                  onChange={(e) => setFormData({ ...formData, doomGalleryHeadline: e.target.value })}
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Doom Gallery Subtitle</label>
                <textarea
                  rows={2}
                  value={formData.doomGallerySubtitle || 'Discover regional architectural color stories, cultural nuances, and explore 3D spherical shade domes.'}
                  onChange={(e) => setFormData({ ...formData, doomGallerySubtitle: e.target.value })}
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <span className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A]/70 block">
                  Regional Indian Palettes &amp; Stories
                </span>
                {(formData.palettes || []).map((pal, idx) => (
                  <div key={pal.id} className="p-3.5 bg-[#F8F4EC] rounded-xl border border-[#E8E2D5] space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={pal.paletteTitle}
                        onChange={(e) => {
                          const updated = [...(formData.palettes || [])];
                          updated[idx].paletteTitle = e.target.value;
                          setFormData({ ...formData, palettes: updated });
                        }}
                        className="font-bold text-xs bg-white p-1.5 rounded border border-[#E8E2D5] flex-1 mr-2"
                      />
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#243B7A] text-white">
                        {pal.regionName}
                      </span>
                    </div>

                    <textarea
                      rows={2}
                      value={pal.culturalStory}
                      onChange={(e) => {
                        const updated = [...(formData.palettes || [])];
                        updated[idx].culturalStory = e.target.value;
                        setFormData({ ...formData, palettes: updated });
                      }}
                      className="w-full p-2 bg-white border border-[#E8E2D5] rounded-lg text-[11px]"
                    />

                    <div>
                      <span className="text-[10px] text-[#1A1A1A]/60 block mb-1 font-semibold">Best Suited For:</span>
                      <input
                        type="text"
                        value={pal.bestSuitedFor}
                        onChange={(e) => {
                          const updated = [...(formData.palettes || [])];
                          updated[idx].bestSuitedFor = e.target.value;
                          setFormData({ ...formData, palettes: updated });
                        }}
                        className="w-full p-1.5 bg-white border border-[#E8E2D5] rounded text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: TIMELINE */}
          {activeQuickEditSection === 'timeline' && (
            <div className="space-y-4">
              <span className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A]/70 block">
                Historical Paint Eras &amp; Architectural Context
              </span>
              {(formData.timelines || []).map((era, idx) => (
                <div key={era.id} className="p-3.5 bg-[#F8F4EC] rounded-xl border border-[#E8E2D5] space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={era.title}
                      onChange={(e) => {
                        const updated = [...(formData.timelines || [])];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, timelines: updated });
                      }}
                      className="font-bold text-xs bg-white p-1.5 rounded border border-[#E8E2D5] flex-1 mr-2"
                    />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E68A00] text-white">
                      {era.era}
                    </span>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#1A1A1A]/60 block font-semibold">Historical Pigment Context</label>
                    <textarea
                      rows={2}
                      value={era.historicalContext}
                      onChange={(e) => {
                        const updated = [...(formData.timelines || [])];
                        updated[idx].historicalContext = e.target.value;
                        setFormData({ ...formData, timelines: updated });
                      }}
                      className="w-full p-2 bg-white border border-[#E8E2D5] rounded-lg text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#1A1A1A]/60 block font-semibold">Modern Coating Translation</label>
                    <input
                      type="text"
                      value={era.modernApplication}
                      onChange={(e) => {
                        const updated = [...(formData.timelines || [])];
                        updated[idx].modernApplication = e.target.value;
                        setFormData({ ...formData, timelines: updated });
                      }}
                      className="w-full p-1.5 bg-white border border-[#E8E2D5] rounded text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SECTION: GUIDES */}
          {activeQuickEditSection === 'guides' && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Guides Section Headline</label>
                <input
                  type="text"
                  value={formData.guidesHeadline || 'Architectural Selection Guides & Estimators'}
                  onChange={(e) => setFormData({ ...formData, guidesHeadline: e.target.value })}
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Guides Subtitle</label>
                <textarea
                  rows={2}
                  value={formData.guidesSubtitle || 'Master lighting orientations, finish textures, washability indexes, and precise project quantity planning.'}
                  onChange={(e) => setFormData({ ...formData, guidesSubtitle: e.target.value })}
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <span className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A]/70 block">
                  Room Inspiration Guidance
                </span>
                {(formData.inspirationRooms || []).map((room, idx) => (
                  <div key={room.id} className="p-3.5 bg-[#F8F4EC] rounded-xl border border-[#E8E2D5] space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={room.title}
                        onChange={(e) => {
                          const updated = [...(formData.inspirationRooms || [])];
                          updated[idx].title = e.target.value;
                          setFormData({ ...formData, inspirationRooms: updated });
                        }}
                        className="font-bold text-xs bg-white p-1.5 rounded border border-[#E8E2D5] flex-1 mr-2"
                      />
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#3F8F6B] text-white">
                        {room.roomType}
                      </span>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#1A1A1A]/60 block font-semibold">Natural Lighting &amp; Orientation Advice</label>
                      <input
                        type="text"
                        value={room.lightOrientationAdvice}
                        onChange={(e) => {
                          const updated = [...(formData.inspirationRooms || [])];
                          updated[idx].lightOrientationAdvice = e.target.value;
                          setFormData({ ...formData, inspirationRooms: updated });
                        }}
                        className="w-full p-1.5 bg-white border border-[#E8E2D5] rounded text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: INNOVATIONS */}
          {activeQuickEditSection === 'innovations' && (
            <div className="space-y-3">
              <span className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A]/70 block">
                4 Paint Technology Innovation Pillars
              </span>
              {(formData.innovations || []).map((innov, idx) => (
                <div key={innov.id} className="p-3.5 bg-[#F8F4EC] rounded-xl border border-[#E8E2D5] space-y-2">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={innov.title}
                      onChange={(e) => {
                        const updated = [...(formData.innovations || [])];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, innovations: updated });
                      }}
                      className="font-bold text-xs bg-white p-1.5 rounded border border-[#E8E2D5] flex-1 mr-2"
                    />
                    <input
                      type="text"
                      value={innov.badge}
                      onChange={(e) => {
                        const updated = [...(formData.innovations || [])];
                        updated[idx].badge = e.target.value;
                        setFormData({ ...formData, innovations: updated });
                      }}
                      className="text-[10px] font-bold px-2 py-1 bg-white border border-[#E8E2D5] rounded w-28 text-center"
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
                    placeholder="Innovation Tagline"
                    className="w-full p-1.5 bg-white border border-[#E8E2D5] rounded text-[11px] font-medium"
                  />

                  <textarea
                    rows={2}
                    value={innov.description}
                    onChange={(e) => {
                      const updated = [...(formData.innovations || [])];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, innovations: updated });
                    }}
                    className="w-full p-2 bg-white border border-[#E8E2D5] rounded-lg text-[11px]"
                  />
                </div>
              ))}
            </div>
          )}

          {/* SECTION: FOOTER */}
          {activeQuickEditSection === 'footer' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Concierge Toll-Free Helpline</label>
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
                    className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl"
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
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">TDS Architectural Disclaimer</label>
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
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-[#E8E2D5] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={closeQuickEdit}
              className="px-4 py-2 border border-[#E8E2D5] text-[#1A1A1A]/70 rounded-full font-bold hover:bg-[#F8F4EC] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#243B7A] text-white rounded-full font-bold shadow-md hover:bg-[#1C2E60] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#E68A00]" />
              <span>Save &amp; Publish Changes</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
