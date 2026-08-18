import React, { useState } from 'react';
import { PaintProduct } from '../types';
import { PAINT_PRODUCTS } from '../data/defaultContent';
import { 
  SlidersHorizontal, 
  Check, 
  Droplets, 
  Calculator, 
  Wrench, 
  Paintbrush, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Building2,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExploreProductsProps {
  headline?: string;
  subtitle?: string;
  products?: PaintProduct[];
  onSelectForCalculator?: (product: PaintProduct) => void;
  onOpenAR?: (product?: PaintProduct) => void;
  onOpenLogin?: () => void;
  isLoggedIn?: boolean;
}

export const ExploreProductsSection: React.FC<ExploreProductsProps> = ({
  headline = 'Product Gallery',
  subtitle = 'Click any paint to view specifications, washability, coverage, and application guide.',
  products,
  onSelectForCalculator,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFinish, setSelectedFinish] = useState<string>('all');
  const [activeModalProduct, setActiveModalProduct] = useState<PaintProduct | null>(null);
  const [modalActiveTab, setModalActiveTab] = useState<'overview' | 'prep' | 'application' | 'specs'>('overview');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const productList = products || PAINT_PRODUCTS;

  const categories = [
    { id: 'all', label: 'All Paints' },
    { id: 'interior', label: 'Interior Walls' },
    { id: 'exterior', label: 'Exterior Walls' },
    { id: 'enamel', label: 'Wood & Metal' },
    { id: 'primer', label: 'Wall Primers' },
    { id: 'texture', label: 'Texture Plasters' },
  ];

  const filteredProducts = productList.filter((prod) => {
    const matchesCat = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesFinish = selectedFinish === 'all' || prod.finish.toLowerCase().includes(selectedFinish.toLowerCase());
    return matchesCat && matchesFinish;
  });

  const handleOpenProductModal = (
    product: PaintProduct, 
    initialTab: 'overview' | 'prep' | 'application' | 'specs' = 'overview'
  ) => {
    setActiveModalProduct(product);
    setModalActiveTab(initialTab);
    setDownloadSuccess(null);
  };

  const handleDownloadMsds = (product: PaintProduct) => {
    setDownloadSuccess(`MSDS sheet for ${product.name} downloaded.`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <section 
      id="explore-products" 
      className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8E2D5] dark:border-white/10 scroll-mt-16"
    >
      {/* Simple Section Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
        <h2 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight text-[#1A1A1A] dark:text-[#F1F4F9]">
          {headline}
        </h2>
        <p className="text-sm sm:text-base text-[#1A1A1A]/70 dark:text-[#94A3B8] font-normal">
          {subtitle}
        </p>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/80 dark:bg-[#162032]/80 backdrop-blur-md p-3 rounded-2xl border border-[#E8E2D5] dark:border-white/10 shadow-2xs">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isCatActive
                    ? 'text-white shadow-xs'
                    : 'bg-transparent text-[#1A1A1A]/70 dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F1F4F9] hover:bg-[#F8F4EC] dark:hover:bg-[#1E293B]'
                }`}
              >
                {isCatActive && (
                  <motion.div
                    layoutId="activeCatFilterPill"
                    className="absolute inset-0 bg-[#243B7A] dark:bg-[#3B82F6] rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Finish Filter Dropdown */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#1A1A1A] dark:text-[#F1F4F9] w-full md:w-auto justify-end">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#E68A00] dark:text-[#F59E0B]" />
          <span className="font-bold">Finish:</span>
          <select
            value={selectedFinish}
            onChange={(e) => setSelectedFinish(e.target.value)}
            className="bg-[#F8F4EC] dark:bg-[#0E131F] border border-[#E8E2D5] dark:border-white/10 rounded-full px-3 py-1 text-xs text-[#1A1A1A] dark:text-[#F1F4F9] font-semibold focus:outline-none focus:border-[#243B7A] dark:focus:border-[#60A5FA] cursor-pointer"
          >
            <option value="all">All Finishes</option>
            <option value="Eggshell">Eggshell</option>
            <option value="Matte">Matte</option>
            <option value="Soft Glow">Soft Glow</option>
            <option value="Semi-Gloss">Semi-Gloss</option>
            <option value="High Gloss">High Gloss</option>
          </select>
        </div>
      </div>

      {/* Clean, Photo-First Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            onClick={() => handleOpenProductModal(product, 'overview')}
            className="group bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-xl rounded-3xl border border-[#E8E2D5] dark:border-white/10 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-[#243B7A]/40 dark:hover:border-[#60A5FA]/40 transition-all duration-300 cursor-pointer"
          >
            {/* Top: Product Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100 dark:bg-stone-900">
              <img
                src={product.imageUrl || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              
              {/* Category & Finish Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-md text-[#243B7A] dark:text-[#93C5FD] border border-[#E8E2D5] dark:border-white/10 uppercase tracking-wider shadow-xs">
                  {product.finish}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/10 uppercase tracking-wider">
                  {product.priceTier}
                </span>
              </div>

              {/* Color Swatch Accent */}
              <div 
                className="absolute bottom-3 right-3 w-8 h-8 rounded-full border-2 border-white dark:border-[#131B2E] shadow-md flex items-center justify-center text-[9px] font-bold text-black/80 font-mono"
                style={{ backgroundColor: product.hexCode }}
                title={`LRV: ${product.lrv}%`}
              >
                {product.lrv}%
              </div>
            </div>

            {/* Bottom: Product Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base sm:text-lg text-[#1A1A1A] dark:text-[#F1F4F9] group-hover:text-[#243B7A] dark:group-hover:text-[#60A5FA] transition-colors">
                    {product.name}
                  </h3>
                  {product.estimatedPricePerLiter && (
                    <span className="text-xs font-bold text-[#243B7A] dark:text-[#93C5FD] shrink-0 bg-[#F8F4EC] dark:bg-[#0E131F] px-2 py-0.5 rounded-full border border-[#E8E2D5] dark:border-white/10">
                      ₹{product.estimatedPricePerLiter}/L
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-[#1A1A1A]/70 dark:text-[#94A3B8] line-clamp-2 mt-1.5 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Simple Action Bar */}
              <div className="pt-3 border-t border-[#E8E2D5]/70 dark:border-white/10 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#243B7A] dark:text-[#60A5FA] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>

                {onSelectForCalculator && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectForCalculator(product);
                    }}
                    className="px-3 py-1 rounded-full bg-[#F8F4EC] dark:bg-[#0E131F] hover:bg-[#E68A00] hover:text-white dark:hover:bg-[#F59E0B] dark:hover:text-black text-[#1A1A1A] dark:text-[#CBD5E1] text-[11px] font-bold flex items-center gap-1 border border-[#E8E2D5] dark:border-white/10 transition-colors cursor-pointer"
                    title="Calculate paint needed"
                  >
                    <Calculator className="w-3 h-3" />
                    <span>Calculate</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expanded Product Details Modal */}
      <AnimatePresence>
        {activeModalProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#F8F4EC] dark:bg-[#0E131F] rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-[#E8E2D5] dark:border-white/15 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalProduct(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white dark:bg-[#162032] border border-[#E8E2D5] dark:border-white/10 flex items-center justify-center text-[#1A1A1A] dark:text-[#F1F4F9] hover:bg-[#243B7A] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-4 pr-10">
                <div 
                  className="w-12 h-12 rounded-2xl border border-black/10 dark:border-white/10 shadow-md flex items-center justify-center shrink-0"
                  style={{ backgroundColor: activeModalProduct.hexCode }}
                >
                  <span className="text-xs font-mono font-bold text-black/70">
                    {activeModalProduct.lrv}%
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#E68A00] dark:text-[#F59E0B] uppercase tracking-wider">
                    {activeModalProduct.finish} Finish &bull; {activeModalProduct.priceTier}
                  </span>
                  <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-[#F1F4F9]">
                    {activeModalProduct.name}
                  </h3>
                  {activeModalProduct.estimatedPricePerLiter && (
                    <p className="text-xs font-semibold text-[#243B7A] dark:text-[#93C5FD]">
                      ₹{activeModalProduct.estimatedPricePerLiter} per liter (approx.)
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Tabs */}
              <div className="flex items-center gap-2 border-b border-[#E8E2D5] dark:border-white/10 pb-2 flex-wrap">
                <button
                  onClick={() => setModalActiveTab('overview')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    modalActiveTab === 'overview'
                      ? 'bg-[#243B7A] dark:bg-[#3B82F6] text-white shadow-xs'
                      : 'bg-white dark:bg-[#162032] text-[#1A1A1A]/70 dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F1F4F9]'
                  }`}
                >
                  Specs &amp; Features
                </button>
                <button
                  onClick={() => setModalActiveTab('prep')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    modalActiveTab === 'prep'
                      ? 'bg-[#243B7A] dark:bg-[#3B82F6] text-white shadow-xs'
                      : 'bg-white dark:bg-[#162032] text-[#1A1A1A]/70 dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F1F4F9]'
                  }`}
                >
                  Surface Preparation
                </button>
                <button
                  onClick={() => setModalActiveTab('application')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    modalActiveTab === 'application'
                      ? 'bg-[#243B7A] dark:bg-[#3B82F6] text-white shadow-xs'
                      : 'bg-white dark:bg-[#162032] text-[#1A1A1A]/70 dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F1F4F9]'
                  }`}
                >
                  Application Guide
                </button>
                <button
                  onClick={() => setModalActiveTab('specs')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    modalActiveTab === 'specs'
                      ? 'bg-[#7C3AED] dark:bg-[#8B5CF6] text-white shadow-xs'
                      : 'bg-[#7C3AED]/10 dark:bg-[#8B5CF6]/20 text-[#7C3AED] dark:text-[#C4B5FD]'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Technical Specs</span>
                </button>
              </div>

              {/* Notification Banner */}
              {downloadSuccess && (
                <div className="p-3 bg-[#3F8F6B]/15 border border-[#3F8F6B]/30 rounded-2xl flex items-center gap-2 text-xs font-bold text-[#3F8F6B]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{downloadSuccess}</span>
                </div>
              )}

              {/* TAB 1: OVERVIEW & SPECS */}
              {modalActiveTab === 'overview' && (
                <div className="space-y-4">
                  <p className="text-xs text-[#1A1A1A]/80 dark:text-[#CBD5E1] leading-relaxed">
                    {activeModalProduct.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-white dark:bg-[#162032] rounded-2xl border border-[#E8E2D5] dark:border-white/10">
                    <div className="text-center">
                      <span className="text-xs font-bold text-[#243B7A] dark:text-[#60A5FA] block">{activeModalProduct.washabilityScore}/10</span>
                      <span className="text-[10px] text-[#1A1A1A]/60 dark:text-[#94A3B8]">Washability</span>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-bold text-[#3F8F6B] block">{activeModalProduct.coverageSqFtPerLiter} sq.ft</span>
                      <span className="text-[10px] text-[#1A1A1A]/60 dark:text-[#94A3B8]">Coverage / L</span>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-bold text-[#E68A00] dark:text-[#F59E0B] block">{activeModalProduct.vocLevel}</span>
                      <span className="text-[10px] text-[#1A1A1A]/60 dark:text-[#94A3B8]">Odor &amp; VOC</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F1F4F9]">
                      Key Features
                    </h4>
                    <ul className="space-y-1.5 text-xs text-[#1A1A1A]/80 dark:text-[#CBD5E1]">
                      {activeModalProduct.keyFeatures.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#3F8F6B] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-[#F1F4F9]">
                      Recommended Rooms
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeModalProduct.recommendedRooms.map((rm, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full bg-white dark:bg-[#162032] border border-[#E8E2D5] dark:border-white/10 text-xs font-semibold text-[#243B7A] dark:text-[#93C5FD]">
                          {rm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SURFACE PREPARATION */}
              {modalActiveTab === 'prep' && (
                <div className="space-y-4">
                  <p className="text-xs text-[#1A1A1A]/70 dark:text-[#94A3B8]">
                    Proper surface preparation ensures smooth application, long durability, and strong adhesion.
                  </p>

                  <div className="space-y-2.5">
                    {activeModalProduct.surfacePreparationSteps?.map((step) => (
                      <div key={step.step} className="p-3 bg-white dark:bg-[#162032] rounded-2xl border border-[#E8E2D5] dark:border-white/10 flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#243B7A] dark:bg-[#3B82F6] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {step.step}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-[#1A1A1A] dark:text-[#F1F4F9] mb-0.5">{step.title}</h5>
                          <p className="text-xs text-[#1A1A1A]/70 dark:text-[#94A3B8] leading-relaxed">{step.instruction}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: APPLICATION GUIDE */}
              {modalActiveTab === 'application' && activeModalProduct.applicationGuide && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white dark:bg-[#162032] rounded-2xl border border-[#E8E2D5] dark:border-white/10 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#243B7A] dark:text-[#60A5FA] block">Water Dilution</span>
                      <p className="text-xs font-semibold text-[#1A1A1A] dark:text-[#F1F4F9]">{activeModalProduct.applicationGuide.dilutionRatio}</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-[#162032] rounded-2xl border border-[#E8E2D5] dark:border-white/10 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#243B7A] dark:text-[#60A5FA] block">Recommended Primer</span>
                      <p className="text-xs font-semibold text-[#1A1A1A] dark:text-[#F1F4F9]">{activeModalProduct.applicationGuide.primerRecommended}</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-[#162032] rounded-2xl border border-[#E8E2D5] dark:border-white/10 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#E68A00] dark:text-[#F59E0B] block">Drying Time</span>
                      <p className="text-xs font-semibold text-[#1A1A1A] dark:text-[#F1F4F9]">{activeModalProduct.applicationGuide.dryingTime}</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-[#162032] rounded-2xl border border-[#E8E2D5] dark:border-white/10 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#E68A00] dark:text-[#F59E0B] block">Recoat Interval</span>
                      <p className="text-xs font-semibold text-[#1A1A1A] dark:text-[#F1F4F9]">{activeModalProduct.applicationGuide.recoatTime}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-[#162032] rounded-2xl border border-[#E8E2D5] dark:border-white/10 space-y-2">
                    <h5 className="text-xs font-bold text-[#1A1A1A] dark:text-[#F1F4F9] flex items-center gap-1.5">
                      <Paintbrush className="w-3.5 h-3.5 text-[#243B7A] dark:text-[#60A5FA]" />
                      <span>Recommended Tools</span>
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {activeModalProduct.applicationGuide.recommendedTools.map((tool, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-full bg-[#F8F4EC] dark:bg-[#0E131F] text-xs text-[#1A1A1A] dark:text-[#F1F4F9] border border-[#E8E2D5] dark:border-white/10 font-medium">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TECHNICAL SPECS */}
              {modalActiveTab === 'specs' && activeModalProduct.architecturalSpecs && (
                <div className="space-y-4">
                  <div className="p-3 bg-white dark:bg-[#162032] rounded-2xl border border-[#E8E2D5] dark:border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#E8E2D5]/60 dark:border-white/10">
                      <span className="text-[#1A1A1A]/60 dark:text-[#94A3B8]">Product Code</span>
                      <span className="font-mono font-bold text-[#1A1A1A] dark:text-[#F1F4F9]">{activeModalProduct.architecturalSpecs.productCode}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E8E2D5]/60 dark:border-white/10">
                      <span className="text-[#1A1A1A]/60 dark:text-[#94A3B8]">Composition</span>
                      <span className="font-medium text-[#1A1A1A] dark:text-[#F1F4F9] max-w-[260px] text-right">{activeModalProduct.architecturalSpecs.chemicalComposition}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E8E2D5]/60 dark:border-white/10">
                      <span className="text-[#1A1A1A]/60 dark:text-[#94A3B8]">Solids by Volume</span>
                      <span className="font-bold text-[#1A1A1A] dark:text-[#F1F4F9]">{activeModalProduct.architecturalSpecs.solidsByVolume}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#1A1A1A]/60 dark:text-[#94A3B8]">VOC Exact Level</span>
                      <span className="font-bold text-[#3F8F6B]">{activeModalProduct.architecturalSpecs.vocContentExact}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadMsds(activeModalProduct)}
                    className="w-full py-2.5 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Download Safety Data Sheet (MSDS)
                  </button>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[#E8E2D5] dark:border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setActiveModalProduct(null)}
                  className="px-4 py-2 rounded-full border border-[#E8E2D5] dark:border-white/10 text-xs font-bold text-[#1A1A1A] dark:text-[#F1F4F9] hover:bg-[#EAE6DF]/60 transition-colors cursor-pointer"
                >
                  Close
                </button>

                {onSelectForCalculator && (
                  <button
                    onClick={() => {
                      const prod = activeModalProduct;
                      setActiveModalProduct(null);
                      onSelectForCalculator(prod);
                    }}
                    className="px-4 py-2 rounded-full bg-[#243B7A] hover:bg-[#1E2B6C] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Calculate Paint for Room</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
