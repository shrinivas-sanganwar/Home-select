import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  DollarSign, 
  Plus, 
  Trash2, 
  Save, 
  RefreshCw, 
  Layers, 
  Sliders, 
  CheckCircle, 
  Image, 
  Sparkles, 
  FileText, 
  UploadCloud, 
  FileCheck, 
  Check, 
  ArrowRight, 
  Loader2, 
  FileDown, 
  BookOpen, 
  Info, 
  Edit3, 
  FlaskConical, 
  User, 
  ChevronDown,
  AlertTriangle,
  ShieldCheck,
  ArrowLeft,
  Settings,
  Pipette
} from 'lucide-react';
import { PaintProduct, SiteData } from '../types';
import { useRole, ROLE_DEFINITIONS, UserRole } from '../context/RoleContext';
import { CmsEditorTab } from './CmsEditorTab';
import { OwnerSettingsTab } from './OwnerSettingsTab';
import { SimilarColorFinder } from './SimilarColorFinder';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  products: PaintProduct[];
  onUpdateProducts: (updatedProducts: PaintProduct[]) => void;
  siteData?: SiteData;
  onUpdateSiteData?: (updatedSiteData: SiteData) => void;
  initialTab?: 'cms' | 'settings' | 'smart-extractor' | 'prices' | 'products' | 'daily-inspiration' | 'hex-tester';
  onSelectProductForCalculator?: (product: PaintProduct) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProducts,
  siteData,
  onUpdateSiteData,
  initialTab = 'cms',
  onSelectProductForCalculator,
}) => {
  const { currentRole, switchRole, permissions } = useRole();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'cms' | 'settings' | 'smart-extractor' | 'prices' | 'products' | 'daily-inspiration' | 'hex-tester'>(initialTab);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Sync initial tab when changed from props
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Editing buffer for products and hero image URL
  const [editableProducts, setEditableProducts] = useState<PaintProduct[]>(products);
  const [heroImgUrlInput, setHeroImgUrlInput] = useState<string>(siteData?.heroImageUrl || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [addedProductNotice, setAddedProductNotice] = useState<string | null>(null);

  // Smart PDF / TDS Extraction State
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState<string>('');
  const [extractedData, setExtractedData] = useState<any | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileMeta, setUploadedFileMeta] = useState<{ name: string; size: string; status: 'uploading' | 'ready' | 'error' } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  // Catalog search and filter
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<'all' | 'interior' | 'exterior' | 'enamel' | 'primer' | 'texture'>('all');

  // Deletion and Editing Modal States (replaces blocked browser confirm dialog)
  const [productToDelete, setProductToDelete] = useState<PaintProduct | null>(null);
  const [editingProduct, setEditingProduct] = useState<PaintProduct | null>(null);
  const [toastNotification, setToastNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastNotification({ type, text });
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Inspiration Presets Gallery
  const dailyPresets = [
    {
      title: 'Jaipur Royal Ivory & Cobalt Archway',
      url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      description: 'Sophisticated warm neutral canvas paired with deep architectural indigo.',
    },
    {
      title: 'Minimalist Bengaluru Penthouse Lounge',
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      description: 'Clean Scandinavian-inspired warm stone walls with soft indoor botanical shadows.',
    },
    {
      title: 'Sunlit Goan Veranda & Architrave',
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
      description: 'Terracotta and warm saffron tones reflecting high-LRV natural daylight.',
    },
    {
      title: 'Kerala Lakefront Luxury Villa Living',
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      description: 'Lush tropical emerald backdrop with micro-shield moisture-resistant walls.',
    },
    {
      title: 'Modern Himalayan Pine & Oak Residence',
      url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80',
      description: 'Rich organic wood accents with eggshell velvet wall coat.',
    },
  ];

  // Sample Asian Paints Official Technical Spec Sheets
  const sampleAsianPaintsTDS = [
    {
      id: 'glitz',
      name: 'Asian Paints Royale Glitz Luxury Interior Emulsion (TDS 2025)',
      type: 'TDS Spec Sheet PDF',
      badge: 'Luxury Velvet',
      summary: 'Teflon Surface Protector, Ultra-Rich Sheen, Zero VOC (< 1g/L), 145 sq.ft/L',
      content: `ASIAN PAINTS TECHNICAL DATA SHEET - ROYALE GLITZ LUXURY EMULSION
Product Code: RG-2025-IN
Category: Interior Wall Architectural Coating
Resin Base: Cross-linking 100% Pure Acrylic Polymer with Teflon Surface Protector
Finish: Rich Velvet Sheen (60° Head Sheen: 15-20 units)
Light Reflectance Value (LRV): 82%
Theoretical Coverage: 140 - 150 sq.ft/Litre for 1 coat
Washability & Scrub Resistance: Exceeds 20,000 scrub cycles (ASTM D2486)
VOC Content: Zero VOC (< 1g/Litre) Green Assure compliant
Drying Time: 30 minutes touch dry, 4 hours recoat interval
Recommended Dilution: 40 - 45% by volume with potable municipal water
Recommended Substrates: High-end Living Rooms, Master Bedrooms, Dining Halls, Pooja Rooms
Warranty: 7-Year Performance Assurance against peeling, flaking, and fungal growth.`
    },
    {
      id: 'protek',
      name: 'Asian Paints Apex Ultima Protek Duralife Exterior (PIS Rev 4)',
      type: 'Product Information Sheet',
      badge: '15-Yr Weatherproof',
      summary: 'Nano-silicone matrix, 2mm structural crack bridging, 110 sq.ft/L',
      content: `ASIAN PAINTS PRODUCT INFORMATION SHEET - APEX ULTIMA PROTEK DURALIFE
Product Code: AUP-DURA-2025
Category: Exterior Facade & Structural Waterproofing System
Resin System: Fiber-reinforced Nano-Silicone Elastomeric Acrylic
Finish: Matte Architectural Sheen
Light Reflectance Value (LRV): 74%
Theoretical Coverage: 105 - 115 sq.ft/Litre per coat
Dirt Pick-Up Resistance: Extreme DPUR nano-crosslinked surface
Washability / Weatherability: > 2000 hours Accelerated Weather-ometer UV testing
VOC Level: Low VOC (< 25 g/L)
Drying Time: 45 minutes surface dry, 4 - 6 hours between coats
Dilution: 35 - 40% with clean water
Recommended Coated Areas: Exterior building facades, seaside villas, boundary walls, terraces
Warranty: 15-Year Performance & Waterproofing Guarantee.`
    },
    {
      id: 'smartcare',
      name: 'Asian Paints SmartCare Damp Block 2K (Material Certificate)',
      type: 'Material Safety & Waterproofing Cert',
      badge: 'Waterproofing Barrier',
      summary: 'Polymer cementitious coating, 4-bar negative hydrostatic pressure',
      content: `ASIAN PAINTS MATERIAL CERTIFICATE & TECHNICAL SPECIFICATION - SMARTCARE DAMP BLOCK 2K
Product Code: SC-DB2K-CERT
Category: Waterproofing & Structural Damp Proofing
Composition: Two-component Polymer Modified Cementitious Elastomeric Slurry
Finish: Smooth Matte Barrier
Light Reflectance Value (LRV): 70%
Coverage: 80 - 90 sq.ft/kg (2 coats)
Hydrostatic Pressure Resistance: Resists up to 4 bar positive & negative water head pressure
VOC: Zero VOC (< 1 g/L) Eco-friendly
Curing & Recoat: 4 hours between coats, 7 days full hydration cure
Recommended Areas: Internal damp walls, basements, sunken bathroom slabs, retaining walls
Warranty: 5-Year Waterproofing Warranty.`
    },
    {
      id: 'apcolite',
      name: 'Asian Paints Apcolite Premium Satin Emulsion (TDS 2025)',
      type: 'TDS Specification Sheet',
      badge: 'Stain Guard Satin',
      summary: 'Stain Guard, fungal defense, 135 sq.ft/L, high washability',
      content: `ASIAN PAINTS TECHNICAL DATA SHEET - APCOLITE PREMIUM SATIN EMULSION
Product Code: AP-SATIN-2025
Category: Interior Satin Wall Coating
Resin: Advanced Styrene Acrylic Copolymer with Stain Guard Additives
Finish: Satin Sheen (10 - 15 units at 60°)
Light Reflectance Value (LRV): 78%
Theoretical Coverage: 130 - 140 sq.ft/Litre per coat
Washability: High washability > 10,000 scrub cycles
VOC Level: Low VOC (< 30 g/L)
Drying Time: 30 minutes touch, 4 hours recoat
Recommended Rooms: High-traffic hallways, children bedrooms, dining spaces, living rooms
Warranty: 3-Year Performance Assurance.`
    }
  ];

  // New product form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<PaintProduct['category']>('interior');
  const [newProductFinish, setNewProductFinish] = useState<PaintProduct['finish']>('Eggshell');
  const [newProductPriceTier, setNewProductPriceTier] = useState<PaintProduct['priceTier']>('Premium');
  const [newProductLRV, setNewProductLRV] = useState(70);
  const [newProductVOC, setNewProductVOC] = useState('Zero VOC (< 1g/L)');
  const [newProductCoverage, setNewProductCoverage] = useState(130);
  const [newProductWashability, setNewProductWashability] = useState(9.5);
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductFeatures, setNewProductFeatures] = useState<string[]>([]);
  const [newProductRooms, setNewProductRooms] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = adminEmail.trim().toLowerCase();
    if (!cleanEmail.includes('@')) {
      setErrorMessage('Invalid admin email format.');
      return;
    }

    if (adminPassword.length >= 6) {
      setIsAdminAuthenticated(true);
      setEditableProducts(products);
    } else {
      setErrorMessage('Invalid Master Security Passcode. Password must be at least 6 characters.');
    }
  };

  const handlePriceChange = (id: string, newPriceTier: PaintProduct['priceTier']) => {
    setEditableProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, priceTier: newPriceTier } : p))
    );
  };

  const handleVocChange = (id: string, newVoc: string) => {
    setEditableProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, vocLevel: newVoc } : p))
    );
  };

  const handleWashabilityChange = (id: string, score: number) => {
    setEditableProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, washabilityScore: Math.min(10, Math.max(0, score)) } : p))
    );
  };

  const handleSaveChanges = () => {
    onUpdateProducts(editableProducts);
    if (siteData && onUpdateSiteData && heroImgUrlInput.trim()) {
      onUpdateSiteData({
        ...siteData,
        heroImageUrl: heroImgUrlInput.trim(),
      });
    }
    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
    }, 2500);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Perform AI / TDS Extraction via server API
  const performExtraction = async (payload: { fileBase64?: string; mimeType?: string; textContent?: string; fileName: string; fileSize?: string }) => {
    setIsExtracting(true);
    setExtractionError(null);
    setExtractionProgress('Uploading and parsing Asian Paints Technical Spec Sheet...');
    setUploadedFileMeta({
      name: payload.fileName,
      size: payload.fileSize || 'Document File',
      status: 'uploading'
    });

    try {
      setTimeout(() => {
        setExtractionProgress('Extracting resin matrix, sheen level, coverage & VOC parameters...');
      }, 500);

      const response = await fetch('/api/extract-paint-tds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Extraction server responded with HTTP ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.data) {
        setExtractedData(result.data);
        setUploadedFileName(payload.fileName);
        setUploadedFileMeta({
          name: payload.fileName,
          size: payload.fileSize || 'Verified TDS',
          status: 'ready'
        });
        setExtractionProgress('');
        showToast(`Specifications extracted successfully from ${payload.fileName}!`);
      } else {
        throw new Error(result.error || 'Unable to parse document metrics.');
      }
    } catch (err: any) {
      console.error('Extraction failed:', err);
      setExtractionError(err?.message || 'Failed to extract specifications from document.');
      setUploadedFileMeta({
        name: payload.fileName,
        size: payload.fileSize || '',
        status: 'error'
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    const formattedSize = formatFileSize(file.size);
    setUploadedFileName(file.name);
    setUploadedFileMeta({
      name: file.name,
      size: formattedSize,
      status: 'uploading'
    });

    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        performExtraction({ textContent: text, fileName: file.name, fileSize: formattedSize });
      };
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = (e.target?.result as string).split(',')[1];
        performExtraction({
          fileBase64: base64String,
          mimeType: file.type || 'application/pdf',
          fileName: file.name,
          fileSize: formattedSize
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Local Hero Room Image upload
  const handleHeroImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formattedSize = formatFileSize(file.size);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setHeroImgUrlInput(dataUrl);
        if (siteData && onUpdateSiteData) {
          onUpdateSiteData({
            ...siteData,
            heroImageUrl: dataUrl,
          });
        }
        showToast(`Hero room photo "${file.name}" (${formattedSize}) uploaded & applied!`);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleExtractSample = (sample: typeof sampleAsianPaintsTDS[0]) => {
    setUploadedFileName(sample.name);
    performExtraction({
      textContent: sample.content,
      fileName: sample.name,
      fileSize: 'Verified Asian Paints TDS'
    });
  };

  const handleApplyExtractedToCatalog = () => {
    if (!extractedData) return;

    const newProd: PaintProduct = {
      id: `prod-extracted-${Date.now()}`,
      name: extractedData.name || 'Asian Paints Architectural Coating',
      category: extractedData.category || 'interior',
      finish: extractedData.finish || 'Eggshell',
      lrv: extractedData.lrv || 75,
      washabilityScore: extractedData.washabilityScore || 9.5,
      vocLevel: extractedData.vocLevel || 'Zero VOC (< 1g/L)',
      coverageSqFtPerLiter: extractedData.coverageSqFtPerLiter || 130,
      priceTier: extractedData.priceTier || 'Premium',
      hexCode: extractedData.hexCode || '#F4EFEA',
      description: extractedData.description || 'Formulated with advanced resin technology for long-lasting color fidelity and architectural protection.',
      keyFeatures: extractedData.keyFeatures || ['Advanced Resin Technology', 'High Scrub Resistance', 'Green Assure Compliant'],
      recommendedRooms: extractedData.recommendedRooms || ['Living Room', 'Master Bedroom'],
    };

    const updated = [newProd, ...editableProducts];
    setEditableProducts(updated);
    onUpdateProducts(updated);
    
    setAddedProductNotice(newProd.name);
    showToast(`"${newProd.name}" added to live catalog!`);
    setTimeout(() => setAddedProductNotice(null), 3500);
  };

  const handleOpenAddModalWithExtracted = () => {
    if (extractedData) {
      setNewProductName(extractedData.name || '');
      setNewProductCategory(extractedData.category || 'interior');
      setNewProductFinish(extractedData.finish || 'Eggshell');
      setNewProductPriceTier(extractedData.priceTier || 'Premium');
      setNewProductLRV(extractedData.lrv || 75);
      setNewProductVOC(extractedData.vocLevel || 'Zero VOC (< 1g/L)');
      setNewProductCoverage(extractedData.coverageSqFtPerLiter || 130);
      setNewProductWashability(extractedData.washabilityScore || 9.5);
      setNewProductDesc(extractedData.description || '');
      setNewProductFeatures(extractedData.keyFeatures || []);
      setNewProductRooms(extractedData.recommendedRooms || []);
    }
    setShowAddModal(true);
  };

  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const newProd: PaintProduct = {
      id: `prod-custom-${Date.now()}`,
      name: newProductName.trim(),
      category: newProductCategory,
      finish: newProductFinish,
      lrv: newProductLRV,
      washabilityScore: newProductWashability,
      vocLevel: newProductVOC,
      coverageSqFtPerLiter: newProductCoverage,
      priceTier: newProductPriceTier,
      hexCode: '#F4EFEA',
      description: newProductDesc || 'Formulated with advanced resin technology for long-lasting color fidelity and architectural protection.',
      keyFeatures: newProductFeatures.length > 0 ? newProductFeatures : ['Scrub Resistant', 'Green Assure Compliant', 'Anti-fungal formula'],
      recommendedRooms: newProductRooms.length > 0 ? newProductRooms : ['Living Room', 'Bedroom'],
    };

    const updated = [newProd, ...editableProducts];
    setEditableProducts(updated);
    onUpdateProducts(updated);
    setNewProductName('');
    setShowAddModal(false);
    showToast(`"${newProd.name}" saved to live catalog!`);
  };

  // Safe In-App Product Deletion (Works reliably across all browsers and iframes)
  const handleExecuteDeleteProduct = () => {
    if (!productToDelete) return;
    const prodName = productToDelete.name;
    const updated = editableProducts.filter(p => p.id !== productToDelete.id);
    setEditableProducts(updated);
    onUpdateProducts(updated);
    setProductToDelete(null);
    showToast(`"${prodName}" was removed from the catalog.`);
  };

  // Save changes from Edit Product Modal
  const handleSaveEditedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const updated = editableProducts.map(p => p.id === editingProduct.id ? editingProduct : p);
    setEditableProducts(updated);
    onUpdateProducts(updated);
    const savedName = editingProduct.name;
    setEditingProduct(null);
    showToast(`Updated "${savedName}" specifications successfully.`);
  };

  const roleDef = ROLE_DEFINITIONS[currentRole];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden w-screen h-screen min-h-screen bg-[#F8F4EC] dark:bg-[#0A0E17] flex flex-col animate-fadeIn transition-colors duration-300">
      <div className="w-full h-full flex flex-col overflow-hidden bg-[#F8F4EC] dark:bg-[#0A0E17]">
        
        {/* Top Header with Role Switcher & Back Button */}
        <div className="px-6 py-4 bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-xl border-b border-[#E8E2D5] dark:border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#F8F4EC] dark:bg-[#162032] hover:bg-[#E8E2D5] dark:hover:bg-[#1E293B] text-[#1A1A1A] dark:text-[#F1F4F9] transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="Return to Website"
            >
              <ArrowLeft className="w-4 h-4 text-[#243B7A] dark:text-[#60A5FA]" />
              <span className="hidden sm:inline">Exit Studio</span>
            </button>
            <div className="h-6 w-px bg-[#E8E2D5] dark:bg-white/10" />
            <div className="w-9 h-9 rounded-xl bg-[#243B7A] text-white flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#E68A00] dark:text-[#F59E0B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-lg text-[#1A1A1A] dark:text-[#F1F4F9]">Owner Studio</h2>
                <span className="text-[10px] bg-[#243B7A] text-white font-bold px-2.5 py-0.5 rounded-full">
                  Admin &amp; Specifications
                </span>
              </div>
              <p className="text-xs text-[#1A1A1A]/60 dark:text-[#94A3B8]">
                Manage website content, paint specifications, TDS documents, and settings
              </p>
            </div>
          </div>

          {/* Mode Indicator & Exit Button */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F8F4EC] dark:bg-[#162032] hover:bg-[#E8E2D5] dark:hover:bg-[#1E293B] border border-[#E8E2D5] dark:border-white/10 text-xs font-bold text-[#243B7A] dark:text-[#93C5FD] transition-colors cursor-pointer shadow-2xs"
              >
                <span>{roleDef.badge}</span>
                <ChevronDown className="w-3 h-3 text-[#5C6066] dark:text-[#94A3B8]" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#131B2E] rounded-2xl shadow-xl border border-[#E8E2D5] dark:border-white/10 p-1.5 z-50 animate-fadeIn space-y-1">
                  <div className="px-3 py-1 text-[10px] font-bold text-[#5C6066] dark:text-[#94A3B8] uppercase">Switch Active Mode</div>
                  {(Object.keys(ROLE_DEFINITIONS) as UserRole[]).map((rKey) => (
                    <button
                      key={rKey}
                      onClick={() => {
                        switchRole(rKey);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                        currentRole === rKey ? 'bg-[#243B7A]/10 dark:bg-[#3B82F6]/20 text-[#243B7A] dark:text-[#60A5FA]' : 'hover:bg-[#F8F4EC] dark:hover:bg-[#1E293B] text-[#1A1A1A] dark:text-[#F1F4F9]'
                      }`}
                    >
                      <span>{ROLE_DEFINITIONS[rKey].title}</span>
                      {currentRole === rKey && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#243B7A] text-white rounded-xl text-xs font-bold hover:bg-[#1C2E60] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Back to Website</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          
          {/* Main Navigation Tabs */}
          <div className="bg-white/80 dark:bg-[#131B2E]/80 backdrop-blur-md px-6 py-3 border-b border-[#E8E2D5] dark:border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex gap-2 text-xs font-semibold overflow-x-auto pb-0.5">
              
              {/* Owner Settings Tab */}
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-xl border transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'settings' 
                    ? 'bg-[#243B7A] text-white border-[#243B7A] shadow-xs' 
                    : 'bg-[#F8F4EC] dark:bg-[#0E131F] text-[#1A1A1A]/70 dark:text-[#94A3B8] border-[#E8E2D5] dark:border-white/10 hover:border-[#243B7A] dark:hover:border-[#3B82F6]'
                }`}
              >
                <Settings className="w-3.5 h-3.5 text-[#E68A00]" />
                <span>Owner Settings</span>
              </button>

              {/* Whole Website CMS Tab */}
              <button
                onClick={() => setActiveTab('cms')}
                className={`px-4 py-2 rounded-xl border transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'cms' 
                    ? 'bg-[#E68A00] text-white border-[#E68A00] shadow-xs' 
                    : 'bg-[#F8F4EC] dark:bg-[#0E131F] text-[#1A1A1A]/70 dark:text-[#94A3B8] border-[#E8E2D5] dark:border-white/10 hover:border-[#E68A00]'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Website Content</span>
              </button>

              {/* Smart PDF TDS Extractor */}
              <button
                onClick={() => setActiveTab('smart-extractor')}
                className={`px-4 py-2 rounded-xl border transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'smart-extractor' 
                    ? 'bg-[#3F8F6B] text-white border-[#3F8F6B] shadow-xs' 
                    : 'bg-[#F8F4EC] dark:bg-[#0E131F] text-[#1A1A1A]/70 dark:text-[#94A3B8] border-[#E8E2D5] dark:border-white/10 hover:border-[#3F8F6B]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>TDS Document Extractor</span>
              </button>

              {/* Color Extractor & Similar Color Finder (HexScanner Engine) */}
              <button
                onClick={() => setActiveTab('hex-tester')}
                className={`px-4 py-2 rounded-xl border transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'hex-tester' 
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs font-bold' 
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800/40 hover:border-amber-500'
                }`}
              >
                <Pipette className="w-3.5 h-3.5 text-amber-500" />
                <span>Color Extractor & Similar Finder</span>
              </button>

              {/* Catalog Products */}
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 rounded-xl border transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'products' ? 'bg-[#243B7A] text-white border-[#243B7A]' : 'bg-[#F8F4EC] dark:bg-[#0E131F] text-[#1A1A1A]/70 dark:text-[#94A3B8] border-[#E8E2D5] dark:border-white/10'
                }`}
              >
                Catalog Products ({editableProducts.length})
              </button>

              {/* Price & Formulations */}
              <button
                onClick={() => setActiveTab('prices')}
                className={`px-4 py-2 rounded-xl border transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'prices' ? 'bg-[#243B7A] text-white border-[#243B7A]' : 'bg-[#F8F4EC] dark:bg-[#0E131F] text-[#1A1A1A]/70 dark:text-[#94A3B8] border-[#E8E2D5] dark:border-white/10'
                }`}
              >
                Price Tiers
              </button>

              {/* Daily Inspiration */}
              <button
                onClick={() => setActiveTab('daily-inspiration')}
                className={`px-4 py-2 rounded-xl border transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'daily-inspiration' ? 'bg-[#243B7A] text-white border-[#243B7A]' : 'bg-[#F8F4EC] dark:bg-[#0E131F] text-[#1A1A1A]/70 dark:text-[#94A3B8] border-[#E8E2D5] dark:border-white/10'
                }`}
              >
                <Image className="w-3.5 h-3.5" />
                <span>Hero Background</span>
              </button>
            </div>

            {/* Quick Action in Header */}
            {activeTab === 'products' || activeTab === 'prices' ? (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-[#E68A00] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#C97800] transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            ) : null}
          </div>

          {saveSuccessNotice && (
            <div className="bg-[#3F8F6B]/15 border-b border-[#3F8F6B]/30 px-6 py-2.5 text-xs font-bold text-[#3F8F6B] flex items-center gap-2 animate-fadeIn">
              <CheckCircle className="w-4 h-4" />
              <span>Live catalog updated successfully! All website pricing & formulations reflect these changes instantly.</span>
            </div>
          )}

          {/* TAB CONTAINER */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8">

            {/* TAB: OWNER SETTINGS */}
            {activeTab === 'settings' && siteData && onUpdateSiteData && (
              <OwnerSettingsTab
                siteData={siteData}
                onUpdateSiteData={onUpdateSiteData}
                products={editableProducts}
                onUpdateProducts={(prods) => {
                  setEditableProducts(prods);
                  onUpdateProducts(prods);
                }}
              />
            )}

            {/* TAB: WHOLE WEBSITE CMS */}
            {activeTab === 'cms' && siteData && onUpdateSiteData && (
              <CmsEditorTab 
                siteData={siteData} 
                onUpdateSiteData={onUpdateSiteData} 
              />
            )}

            {/* TAB: COLOR EXTRACTOR & SIMILAR COLOR FINDER (HEX SCANNER BRIDGE) */}
            {activeTab === 'hex-tester' && (
              <SimilarColorFinder 
                onSelectProductForCalculator={(product) => {
                  if (onSelectProductForCalculator) {
                    onSelectProductForCalculator(product);
                  }
                  onClose();
                }}
                onApplyToVisualizer={(hex) => {
                  const heroEl = document.getElementById('hero');
                  if (heroEl) {
                    heroEl.scrollIntoView({ behavior: 'smooth' });
                  }
                  onClose();
                }}
              />
            )}

            {/* TAB: SMART PDF / TDS EXTRACTOR */}
            {activeTab === 'smart-extractor' && (
              <div className="space-y-6">
                
                {/* Intro Card */}
                <div className="bg-gradient-to-r from-[#243B7A]/5 via-[#E68A00]/5 to-[#3F8F6B]/5 p-5 rounded-2xl border border-[#E8E2D5] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E68A00]/15 text-[#E68A00] text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Asian Paints Document Intelligence Engine</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#1A1A1A]/50 bg-white px-2.5 py-1 rounded-md border border-[#E8E2D5]">
                      Supported: PDF &bull; PNG &bull; JPG &bull; Spec TXT
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">
                    Automated Product Information Sheet (PIS) &amp; TDS Extractor
                  </h3>
                  <p className="text-xs text-[#1A1A1A]/70 leading-relaxed max-w-3xl">
                    Upload official Asian Paints Product Information Sheets, Material Safety Data Sheets (MSDS), or Technical Spec PDFs. The extractor reads theoretical coverage, resin type, sheen units, VOC metrics, washability scores, and drying times in seconds.
                  </p>
                </div>

                {/* Extraction Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left 5 Cols: Upload Area + Sample Test Sheets */}
                  <div className="lg:col-span-5 space-y-4">
                    
                    {/* Drag & Drop File Upload Zone */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleFileUpload(e.dataTransfer.files[0]);
                        }
                      }}
                      className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center space-y-3 relative ${
                        dragOver 
                          ? 'border-[#E68A00] bg-[#E68A00]/5' 
                          : 'border-[#E8E2D5] bg-white hover:border-[#243B7A]/50'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#243B7A]/10 text-[#243B7A] flex items-center justify-center mx-auto shadow-2xs">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1A1A1A]">
                          Drag &amp; Drop Asian Paints PDF / TDS Certificate
                        </p>
                        <p className="text-[11px] text-[#1A1A1A]/50 mt-0.5">
                          or browse from your device
                        </p>
                      </div>

                      <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#243B7A] text-white rounded-xl text-xs font-bold hover:bg-[#1C2E60] transition-colors cursor-pointer shadow-xs">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Select Document File</span>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.txt"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileUpload(e.target.files[0]);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Quick Test Preloaded Sheets */}
                    <div className="bg-white p-4 rounded-2xl border border-[#E8E2D5] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-[#E68A00]" />
                          <span>Quick Test With Official Asian Paints TDS</span>
                        </div>
                        <span className="text-[10px] text-[#1A1A1A]/50 font-mono">1-Click Demo</span>
                      </div>
                      <p className="text-[11px] text-[#1A1A1A]/60">
                        Click any verified document below to test auto-extraction instantly:
                      </p>

                      <div className="space-y-2">
                        {sampleAsianPaintsTDS.map((sample) => (
                          <div
                            key={sample.id}
                            onClick={() => handleExtractSample(sample)}
                            className="p-3 rounded-xl border border-[#E8E2D5] hover:border-[#E68A00] hover:bg-[#F8F4EC] transition-all cursor-pointer group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-[#1A1A1A] group-hover:text-[#E68A00] transition-colors line-clamp-1">
                                {sample.name}
                              </span>
                              <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#E68A00]/10 text-[#E68A00] shrink-0 ml-1">
                                {sample.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#1A1A1A]/60 mt-1 line-clamp-1">
                              {sample.summary}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right 7 Cols: Extraction Review */}
                  <div className="lg:col-span-7 space-y-4">
                    
                    {/* Extracting Indicator */}
                    {isExtracting && (
                      <div className="bg-white p-8 rounded-2xl border border-[#E68A00]/40 shadow-md text-center space-y-4 animate-fadeIn">
                        <div className="w-12 h-12 rounded-full bg-[#E68A00]/10 text-[#E68A00] flex items-center justify-center mx-auto animate-spin">
                          <Loader2 className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-heading font-bold text-sm text-[#1A1A1A]">
                            Parsing Document Specifications...
                          </h4>
                          <p className="text-xs text-[#E68A00] font-medium animate-pulse">
                            {extractionProgress}
                          </p>
                        </div>
                        <div className="w-full bg-[#F8F4EC] rounded-full h-1.5 overflow-hidden">
                          <div className="bg-[#E68A00] h-full rounded-full w-3/4 animate-pulse" />
                        </div>
                      </div>
                    )}

                    {/* Error Notice */}
                    {extractionError && (
                      <div className="p-4 bg-[#D96C4A]/10 border border-[#D96C4A]/30 text-[#D96C4A] rounded-2xl text-xs space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Extraction Notice</span>
                        </div>
                        <p>{extractionError}</p>
                      </div>
                    )}

                    {/* Extracted Specifications Review Card */}
                    {extractedData && !isExtracting && (
                      <div className="bg-white rounded-2xl border border-[#3F8F6B]/40 shadow-sm overflow-hidden animate-fadeIn space-y-0">
                        
                        <div className="p-4 bg-[#3F8F6B]/10 border-b border-[#3F8F6B]/20 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileCheck className="w-4 h-4 text-[#3F8F6B]" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#1A1A1A]">Extracted Product Specifications</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3F8F6B] text-white">
                                  Ready to Add
                                </span>
                              </div>
                              <span className="text-[11px] text-[#1A1A1A]/60">Source: {uploadedFileName || 'Asian Paints Spec Sheet'}</span>
                            </div>
                          </div>

                          <button
                            onClick={handleApplyExtractedToCatalog}
                            className="px-4 py-1.5 bg-[#3F8F6B] text-white rounded-xl text-xs font-bold hover:bg-[#327356] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Live Catalog</span>
                          </button>
                        </div>

                        <div className="p-5 space-y-4 text-xs">
                          <div className="space-y-1 pb-3 border-b border-[#E8E2D5]">
                            <span className="text-[10px] uppercase font-bold text-[#1A1A1A]/50">Product Name</span>
                            <h4 className="font-heading font-bold text-base text-[#1A1A1A]">
                              {extractedData.name}
                            </h4>
                            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                              {extractedData.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            <div className="bg-[#F8F4EC] p-2.5 rounded-xl border border-[#E8E2D5]">
                              <span className="text-[10px] text-[#1A1A1A]/50 block font-semibold">Category &amp; Finish</span>
                              <span className="font-bold text-xs text-[#243B7A] capitalize">
                                {extractedData.category} &bull; {extractedData.finish}
                              </span>
                            </div>

                            <div className="bg-[#F8F4EC] p-2.5 rounded-xl border border-[#E8E2D5]">
                              <span className="text-[10px] text-[#1A1A1A]/50 block font-semibold">Coverage</span>
                              <span className="font-bold font-mono text-xs text-[#1A1A1A]">
                                {extractedData.coverageSqFtPerLiter} sq.ft / Litre
                              </span>
                            </div>

                            <div className="bg-[#F8F4EC] p-2.5 rounded-xl border border-[#E8E2D5]">
                              <span className="text-[10px] text-[#1A1A1A]/50 block font-semibold">Washability</span>
                              <span className="font-bold font-mono text-xs text-[#3F8F6B]">
                                {extractedData.washabilityScore} / 10
                              </span>
                            </div>

                            <div className="bg-[#F8F4EC] p-2.5 rounded-xl border border-[#E8E2D5]">
                              <span className="text-[10px] text-[#1A1A1A]/50 block font-semibold">VOC Rating</span>
                              <span className="font-bold text-xs text-[#1A1A1A]">
                                {extractedData.vocLevel}
                              </span>
                            </div>
                          </div>

                          {extractedData.keyFeatures && (
                            <div className="space-y-1.5">
                              <span className="text-[10px] uppercase font-bold text-[#1A1A1A]/50">Key Coating Formulations</span>
                              <div className="flex flex-wrap gap-1.5">
                                {extractedData.keyFeatures.map((feat: string, idx: number) => (
                                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-[#E8E2D5] text-[11px] text-[#1A1A1A]/80 font-medium">
                                    &bull; {feat}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#E8E2D5]">
                            <button
                              onClick={handleOpenAddModalWithExtracted}
                              className="text-xs text-[#243B7A] font-bold hover:underline cursor-pointer"
                            >
                              Edit fields before adding &rarr;
                            </button>

                            <button
                              onClick={handleApplyExtractedToCatalog}
                              className="px-5 py-2 bg-[#243B7A] text-white rounded-xl text-xs font-bold hover:bg-[#1C2E60] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Confirm &amp; Add to Catalog</span>
                            </button>
                          </div>

                        </div>
                      </div>
                    )}

                    {!extractedData && !isExtracting && (
                      <div className="bg-white p-8 rounded-2xl border border-[#E8E2D5] text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#F8F4EC] text-[#1A1A1A]/40 flex items-center justify-center mx-auto">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-heading font-bold text-sm text-[#1A1A1A]">No Document Selected</h4>
                          <p className="text-xs text-[#1A1A1A]/60 max-w-sm mx-auto">
                            Upload an Asian Paints PDF or select a quick test sheet on the left to see the structured paint specifications appear here.
                          </p>
                        </div>
                      </div>
                    )}

                  </div>

                </div>

              </div>
            )}

            {/* TAB: PRICE TIERS */}
            {activeTab === 'prices' && (
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-2xl border border-[#E8E2D5] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-[#1A1A1A]">Bi-Weekly Pricing &amp; Technical Specs Table</p>
                    <p className="text-[#1A1A1A]/60">Directly modify price tiers, VOC specifications, and washability scores.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono bg-[#F8F4EC] px-3 py-1 rounded-full border border-[#E8E2D5] font-bold text-[#243B7A]">
                      {editableProducts.length} Active Items
                    </span>
                    <button
                      onClick={handleSaveChanges}
                      className="px-4 py-1.5 bg-[#243B7A] text-white rounded-xl font-bold hover:bg-[#1C2E60] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save All Specs</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#1A1A1A]">
                      <thead className="bg-[#F8F4EC] border-b border-[#E8E2D5] font-bold text-[11px] uppercase tracking-wider text-[#1A1A1A]/70">
                        <tr>
                          <th className="p-3.5">Product Name</th>
                          <th className="p-3.5">Category</th>
                          <th className="p-3.5">Price Tier</th>
                          <th className="p-3.5">VOC Level Specification</th>
                          <th className="p-3.5">Washability</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E2D5]">
                        {editableProducts.map(prod => (
                          <tr key={prod.id} className="hover:bg-[#F8F4EC]/50 transition-colors">
                            <td className="p-3.5 font-bold">
                              <div>{prod.name}</div>
                              <span className="text-[10px] text-[#1A1A1A]/50 font-normal">{prod.finish} Sheen</span>
                            </td>
                            <td className="p-3.5 capitalize text-[#1A1A1A]/70">{prod.category}</td>
                            <td className="p-3.5">
                              <select
                                value={prod.priceTier}
                                onChange={e => handlePriceChange(prod.id, e.target.value as PaintProduct['priceTier'])}
                                className="bg-[#F8F4EC] border border-[#E8E2D5] rounded-lg p-1.5 font-bold text-xs focus:outline-none focus:border-[#243B7A]"
                              >
                                <option value="Value">Value</option>
                                <option value="Standard">Standard</option>
                                <option value="Premium">Premium</option>
                                <option value="Luxury Ultra">Luxury Ultra</option>
                              </select>
                            </td>
                            <td className="p-3.5">
                              <input
                                type="text"
                                value={prod.vocLevel}
                                onChange={e => handleVocChange(prod.id, e.target.value)}
                                className="bg-[#F8F4EC] border border-[#E8E2D5] rounded-lg px-2 py-1 text-xs font-mono w-44 focus:outline-none focus:border-[#243B7A]"
                              />
                            </td>
                            <td className="p-3.5 font-mono font-bold">
                              <input
                                type="number"
                                step="0.1"
                                max="10"
                                min="0"
                                value={prod.washabilityScore}
                                onChange={e => handleWashabilityChange(prod.id, parseFloat(e.target.value))}
                                className="bg-[#F8F4EC] border border-[#E8E2D5] rounded-lg px-2 py-1 text-xs font-mono w-16 focus:outline-none"
                              />
                              <span className="text-[#1A1A1A]/50 text-[10px]"> /10</span>
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingProduct({ ...prod })}
                                  className="text-[#243B7A] hover:bg-[#243B7A]/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                                  title="Edit full product details"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setProductToDelete(prod)}
                                  className="text-[#D96C4A] hover:bg-[#D96C4A]/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                                  title="Remove Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CATALOG PRODUCTS */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                
                {/* Search & Filter Bar */}
                <div className="bg-white p-4 rounded-2xl border border-[#E8E2D5] flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                  <div className="flex-1 min-w-[240px]">
                    <input
                      type="text"
                      placeholder="Search products by name, sheen, or description..."
                      value={catalogSearchQuery}
                      onChange={(e) => setCatalogSearchQuery(e.target.value)}
                      className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl text-xs focus:outline-none focus:border-[#243B7A]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                    {(['all', 'interior', 'exterior', 'enamel', 'primer', 'texture'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCatalogCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-colors cursor-pointer ${
                          catalogCategoryFilter === cat
                            ? 'bg-[#243B7A] text-white'
                            : 'bg-[#F8F4EC] text-[#1A1A1A]/70 hover:bg-[#E8E2D5]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-[#E68A00] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#C97800] transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Paint</span>
                  </button>
                </div>

                {/* Filtered Product Grid */}
                {(() => {
                  const filtered = editableProducts.filter(prod => {
                    const matchesCategory = catalogCategoryFilter === 'all' || prod.category === catalogCategoryFilter;
                    const matchesQuery = !catalogSearchQuery.trim() || 
                      prod.name.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
                      prod.finish.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
                      prod.description.toLowerCase().includes(catalogSearchQuery.toLowerCase());
                    return matchesCategory && matchesQuery;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="bg-white p-10 rounded-2xl border border-[#E8E2D5] text-center space-y-3">
                        <p className="text-sm font-bold text-[#1A1A1A]">No paint products found</p>
                        <p className="text-xs text-[#1A1A1A]/60">Try changing your search term or filter.</p>
                        <button
                          onClick={() => { setCatalogSearchQuery(''); setCatalogCategoryFilter('all'); }}
                          className="text-xs text-[#243B7A] font-bold hover:underline cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filtered.map(prod => (
                        <div key={prod.id} className="bg-white p-5 rounded-2xl border border-[#E8E2D5] space-y-3 relative shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#243B7A]/10 text-[#243B7A] px-2.5 py-0.5 rounded-full">
                                {prod.category} • {prod.finish}
                              </span>
                              <span className="text-xs font-bold text-[#E68A00] bg-[#E68A00]/10 px-2 py-0.5 rounded-md">
                                {prod.priceTier}
                              </span>
                            </div>

                            <h4 className="font-heading font-bold text-base text-[#1A1A1A] line-clamp-1">{prod.name}</h4>
                            <p className="text-xs text-[#1A1A1A]/60 line-clamp-2 leading-relaxed">{prod.description}</p>
                          </div>

                          <div className="space-y-3 pt-2 border-t border-[#E8E2D5]/70">
                            <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-[#1A1A1A]/70 text-center bg-[#F8F4EC] p-2 rounded-xl">
                              <div>
                                <span className="block text-[#1A1A1A]/40 font-sans text-[9px]">LRV</span>
                                <span className="font-bold">{prod.lrv}%</span>
                              </div>
                              <div className="border-x border-[#E8E2D5]">
                                <span className="block text-[#1A1A1A]/40 font-sans text-[9px]">Coverage</span>
                                <span className="font-bold">{prod.coverageSqFtPerLiter} sqft/L</span>
                              </div>
                              <div>
                                <span className="block text-[#1A1A1A]/40 font-sans text-[9px]">Washability</span>
                                <span className="font-bold text-[#3F8F6B]">{prod.washabilityScore}/10</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <button
                                onClick={() => setEditingProduct({ ...prod })}
                                className="flex-1 py-1.5 px-3 rounded-xl bg-[#F8F4EC] hover:bg-[#E8E2D5] text-[#243B7A] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit Specs</span>
                              </button>

                              <button
                                onClick={() => setProductToDelete(prod)}
                                className="p-2 rounded-xl text-[#D96C4A] hover:bg-[#D96C4A]/10 transition-colors cursor-pointer"
                                title="Delete product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

              </div>
            )}

            {/* TAB: HERO IMAGE */}
            {activeTab === 'daily-inspiration' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] space-y-5 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-heading font-bold text-base text-[#1A1A1A] flex items-center gap-2">
                        <Image className="w-4 h-4 text-[#E68A00]" />
                        <span>Daily Hero Room Inspiration Background</span>
                      </h3>
                      <p className="text-xs text-[#1A1A1A]/60 mt-0.5">
                        Change the featured interior photo that visitors see every day. Select from curated presets or upload a photo directly.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#3F8F6B] bg-[#3F8F6B]/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Live on Homepage</span>
                    </span>
                  </div>

                  {/* Image Upload & URL Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Option A: Direct Device Upload */}
                    <div className="p-4 bg-[#F8F4EC] rounded-2xl border border-[#E8E2D5] space-y-2">
                      <label className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                        <UploadCloud className="w-4 h-4 text-[#243B7A]" />
                        <span>Upload Photo from Computer/Phone</span>
                      </label>
                      <p className="text-[11px] text-[#1A1A1A]/60">
                        Supports JPG, PNG, WebP interior &amp; exterior photography
                      </p>
                      <label className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-[#243B7A] text-white rounded-xl text-xs font-bold hover:bg-[#1C2E60] transition-colors cursor-pointer shadow-xs">
                        <Image className="w-3.5 h-3.5" />
                        <span>Choose Local Image File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleHeroImageFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Option B: Custom Web URL */}
                    <div className="p-4 bg-[#F8F4EC] rounded-2xl border border-[#E8E2D5] space-y-2">
                      <label className="text-xs font-bold text-[#1A1A1A] block">Paste Custom Image Web URL</label>
                      <p className="text-[11px] text-[#1A1A1A]/60">
                        Direct web links (Unsplash, CDN, cloud storage)
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={heroImgUrlInput}
                          onChange={(e) => setHeroImgUrlInput(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="flex-1 p-2 bg-white border border-[#E8E2D5] rounded-xl text-xs font-mono focus:outline-none focus:border-[#243B7A]"
                        />
                        <button
                          type="button"
                          onClick={handleSaveChanges}
                          className="px-4 py-2 bg-[#243B7A] text-white rounded-xl text-xs font-bold hover:bg-[#1C2E60] transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Live Hero Room Frame Preview */}
                  <div className="relative rounded-2xl overflow-hidden border border-[#E8E2D5] h-60 bg-black/5 shadow-inner">
                    <img
                      src={heroImgUrlInput}
                      alt="Daily inspiration preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 text-white text-xs font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#E68A00]" />
                      <span>Live Homepage Visual Background Frame</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-heading font-bold text-sm text-[#1A1A1A]">Curated Daily Room Presets</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dailyPresets.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setHeroImgUrlInput(preset.url);
                          if (siteData && onUpdateSiteData) {
                            onUpdateSiteData({
                              ...siteData,
                              heroImageUrl: preset.url,
                            });
                          }
                          showToast(`Preset "${preset.title}" selected!`);
                        }}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex gap-3 bg-white ${
                          heroImgUrlInput === preset.url 
                            ? 'border-[#243B7A] ring-2 ring-[#243B7A]/20 shadow-md' 
                            : 'border-[#E8E2D5] hover:border-[#243B7A]/50'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.title}
                          className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex flex-col justify-between py-0.5">
                          <div>
                            <h5 className="font-bold text-xs text-[#1A1A1A] line-clamp-1">{preset.title}</h5>
                            <p className="text-[11px] text-[#1A1A1A]/60 line-clamp-2 mt-0.5">{preset.description}</p>
                          </div>
                          <span className="text-[10px] font-bold text-[#E68A00]">
                            {heroImgUrlInput === preset.url ? '✓ Active on Website' : 'Click to Set'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Bar */}
          <div className="p-4 bg-white border-t border-[#E8E2D5] text-xs text-[#1A1A1A]/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3F8F6B] animate-pulse" />
              <span>Paint Specification CMS &amp; Document Intelligence Active</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#243B7A] text-white rounded-full font-bold hover:bg-[#1C2E60] transition-colors cursor-pointer"
            >
              Return to Website
            </button>
          </div>

        </div>

      </div>

      {/* Floating Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-70 animate-bounce">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-bold ${
            toastNotification.type === 'success'
              ? 'bg-[#3F8F6B] text-white border-[#3F8F6B]'
              : 'bg-[#D96C4A] text-white border-[#D96C4A]'
          }`}>
            <CheckCircle className="w-4 h-4" />
            <span>{toastNotification.text}</span>
          </div>
        </div>
      )}

      {/* IN-APP DELETE PRODUCT CONFIRMATION MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-70 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#E8E2D5] space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-[#D96C4A]">
              <div className="w-10 h-10 rounded-full bg-[#D96C4A]/15 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-[#D96C4A]" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-[#1A1A1A]">Remove Product from Catalog?</h3>
                <p className="text-xs text-[#1A1A1A]/60">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-4 bg-[#F8F4EC] rounded-2xl border border-[#E8E2D5] space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#1A1A1A]">{productToDelete.name}</span>
                <span className="text-[#E68A00]">{productToDelete.priceTier}</span>
              </div>
              <p className="text-[11px] text-[#1A1A1A]/60 line-clamp-2">{productToDelete.description}</p>
              <div className="text-[10px] font-mono text-[#1A1A1A]/50 pt-1">
                Category: {productToDelete.category} &bull; Finish: {productToDelete.finish}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 border border-[#E8E2D5] rounded-full text-xs font-bold text-[#1A1A1A]/70 hover:bg-[#F8F4EC] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDeleteProduct}
                className="px-5 py-2 bg-[#D96C4A] text-white rounded-full text-xs font-bold hover:bg-[#B85435] transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Remove Product</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT SPECIFICATIONS MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-70 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-[#E8E2D5] space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#1A1A1A] flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#243B7A]" />
                  <span>Edit Product Specifications</span>
                </h3>
                <p className="text-xs text-[#1A1A1A]/60 mt-0.5">Modify technical metrics, coverage &amp; pricing</p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 text-[#1A1A1A]/50 hover:text-[#1A1A1A] rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Product Title</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-bold focus:outline-none focus:border-[#243B7A]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as PaintProduct['category'] })}
                    className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl focus:outline-none focus:border-[#243B7A]"
                  >
                    <option value="interior">Interior Wall</option>
                    <option value="exterior">Exterior Wall</option>
                    <option value="enamel">Enamel / Wood &amp; Metal</option>
                    <option value="primer">Primer &amp; Undercoat</option>
                    <option value="texture">Texture / Royale Play</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Finish Sheen</label>
                  <select
                    value={editingProduct.finish}
                    onChange={(e) => setEditingProduct({ ...editingProduct, finish: e.target.value as PaintProduct['finish'] })}
                    className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl focus:outline-none focus:border-[#243B7A]"
                  >
                    <option value="Matte">Matte</option>
                    <option value="Eggshell">Eggshell</option>
                    <option value="Satin">Satin</option>
                    <option value="Semi-Gloss">Semi-Gloss</option>
                    <option value="Gloss">High Gloss</option>
                    <option value="Soft Glow">Soft Glow</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Price Tier</label>
                  <select
                    value={editingProduct.priceTier}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceTier: e.target.value as PaintProduct['priceTier'] })}
                    className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-bold text-[#E68A00] focus:outline-none focus:border-[#243B7A]"
                  >
                    <option value="Value">Value</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    <option value="Luxury Ultra">Luxury Ultra</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Coverage (sq.ft / Liter)</label>
                  <input
                    type="number"
                    value={editingProduct.coverageSqFtPerLiter}
                    onChange={(e) => setEditingProduct({ ...editingProduct, coverageSqFtPerLiter: parseInt(e.target.value) || 120 })}
                    className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-mono focus:outline-none focus:border-[#243B7A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">LRV %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingProduct.lrv}
                    onChange={(e) => setEditingProduct({ ...editingProduct, lrv: parseInt(e.target.value) || 70 })}
                    className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-mono focus:outline-none focus:border-[#243B7A]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">Washability (0-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={editingProduct.washabilityScore}
                    onChange={(e) => setEditingProduct({ ...editingProduct, washabilityScore: parseFloat(e.target.value) || 9.0 })}
                    className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-mono focus:outline-none focus:border-[#243B7A]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1A1A1A] block mb-1">VOC Rating</label>
                  <input
                    type="text"
                    value={editingProduct.vocLevel}
                    onChange={(e) => setEditingProduct({ ...editingProduct, vocLevel: e.target.value })}
                    className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl font-mono text-[11px] focus:outline-none focus:border-[#243B7A]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1A1A1A] block mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-2.5 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl focus:outline-none focus:border-[#243B7A] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D5]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-[#E8E2D5] rounded-full text-xs font-bold text-[#1A1A1A]/70 hover:bg-[#F8F4EC] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#243B7A] text-white rounded-full text-xs font-bold shadow-xs hover:bg-[#1C2E60] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Product Updates</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-[#E8E2D5] space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">Add New Paint Formulation</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-[#1A1A1A]/50 hover:text-[#1A1A1A] rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-[#E68A00]/10 border border-[#E68A00]/30 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E68A00] flex-shrink-0" />
                <span className="text-[#1A1A1A]/80">Have an Asian Paints TDS or Material Spec PDF?</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setActiveTab('smart-extractor');
                }}
                className="text-xs font-bold text-[#E68A00] hover:underline cursor-pointer"
              >
                Auto-Extract PDF &rarr;
              </button>
            </div>

            <form onSubmit={handleAddNewProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asian Paints Royale Glitz Luxury Emulsion"
                  value={newProductName}
                  onChange={e => setNewProductName(e.target.value)}
                  className="w-full p-2.5 border border-[#E8E2D5] rounded-xl focus:outline-none focus:border-[#243B7A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={newProductCategory}
                    onChange={e => setNewProductCategory(e.target.value as PaintProduct['category'])}
                    className="w-full p-2.5 border border-[#E8E2D5] rounded-xl"
                  >
                    <option value="interior">Interior</option>
                    <option value="exterior">Exterior</option>
                    <option value="enamel">Enamel</option>
                    <option value="primer">Primer</option>
                    <option value="texture">Texture</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Finish / Sheen</label>
                  <select
                    value={newProductFinish}
                    onChange={e => setNewProductFinish(e.target.value as PaintProduct['finish'])}
                    className="w-full p-2.5 border border-[#E8E2D5] rounded-xl"
                  >
                    <option value="Matte">Matte</option>
                    <option value="Eggshell">Eggshell</option>
                    <option value="Satin">Satin</option>
                    <option value="Semi-Gloss">Semi-Gloss</option>
                    <option value="High Gloss">High Gloss</option>
                    <option value="Soft Glow">Soft Glow</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Price Tier</label>
                  <select
                    value={newProductPriceTier}
                    onChange={e => setNewProductPriceTier(e.target.value as PaintProduct['priceTier'])}
                    className="w-full p-2.5 border border-[#E8E2D5] rounded-xl"
                  >
                    <option value="Value">Value</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    <option value="Luxury Ultra">Luxury Ultra</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Theoretical Coverage (sq.ft / L)</label>
                  <input
                    type="number"
                    value={newProductCoverage}
                    onChange={e => setNewProductCoverage(parseInt(e.target.value) || 120)}
                    className="w-full p-2.5 border border-[#E8E2D5] rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">VOC Specification</label>
                  <input
                    type="text"
                    value={newProductVOC}
                    onChange={e => setNewProductVOC(e.target.value)}
                    className="w-full p-2.5 border border-[#E8E2D5] rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Washability Rating (0 - 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={newProductWashability}
                    onChange={e => setNewProductWashability(parseFloat(e.target.value) || 9.0)}
                    className="w-full p-2.5 border border-[#E8E2D5] rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#E8E2D5] rounded-full font-bold text-[#1A1A1A]/70 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#243B7A] text-white rounded-full font-bold shadow-xs hover:bg-[#1C2E60] transition-colors cursor-pointer"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
