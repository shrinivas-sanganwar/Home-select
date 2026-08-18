/**
 * HomeSelect — Helping you choose the right paint
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { ExploreProductsSection } from './components/ExploreProductsSection';
import { TransformationSection } from './components/TransformationSection';
import { ColoursOfIndiaInspirationSection } from './components/ColoursOfIndiaInspirationSection';
import { PaintCalculatorSection } from './components/PaintCalculatorSection';
import { Footer } from './components/Footer';
import { SlidePanel } from './components/SlidePanel';
import { AdminPortal } from './components/AdminPortal';
import { ARAssistanceModal } from './components/ARAssistanceModal';
import { RoleProvider } from './context/RoleContext';
import { ThemeProvider } from './context/ThemeContext';
import { INITIAL_SITE_DATA, PAINT_PRODUCTS } from './data/defaultContent';
import { SiteData, PaintProduct } from './types';

const STORAGE_KEY = 'homeselect_v4_site_data';
const PRODUCTS_STORAGE_KEY = 'homeselect_v4_catalog_products';

function MainAppContent() {
  // Load site data from localStorage or fallback to default INITIAL_SITE_DATA
  const [siteData, setSiteData] = useState<SiteData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore fallback
    }
    return INITIAL_SITE_DATA;
  });

  // Dynamic products list (Admin manageable)
  const [products, setProducts] = useState<PaintProduct[]>(() => {
    try {
      const savedProds = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (savedProds) {
        return JSON.parse(savedProds);
      }
    } catch {
      // Fallback
    }
    return PAINT_PRODUCTS;
  });

  // SlidePanel State (Login, Account, Saved Swatches)
  const [isSlidePanelOpen, setIsSlidePanelOpen] = useState(false);
  const [slidePanelTab, setSlidePanelTab] = useState<'login' | 'account' | 'swatches'>('login');

  // AR Assistance Modal State
  const [isARModalOpen, setIsARModalOpen] = useState(false);
  const [arSelectedProduct, setArSelectedProduct] = useState<PaintProduct | null>(null);

  // Secret Admin Portal State (CMS & Product Editor)
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<'cms' | 'products' | 'pricing' | 'audit'>('cms');

  // Calculator target product bridge
  const [selectedCalculatorProduct, setSelectedCalculatorProduct] = useState<PaintProduct | null>(null);

  // Active Navigation Section Tracking
  const [activeSectionId, setActiveSectionId] = useState<string>('hero');

  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Active Section Scroll Tracking Listener
  useEffect(() => {
    const sectionIds = [
      'hero',
      'explore-products',
      'transformation',
      'color-gallery',
      'product-guides',
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140; // Offset for sticky navbar

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSectionId(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut (Ctrl + Shift + A) & URL parameter (?admin=true) listener for owner Admin Console
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminPortalOpen(true);
      }
    };

    // Check URL parameters for ?admin=true
    if (window.location.search.includes('admin=true')) {
      setIsAdminPortalOpen(true);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (href: string) => {
    const targetId = href.replace('#', '');
    setActiveSectionId(targetId);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Sync site data (hero image, logo, tagline) to local storage
  const handleUpdateSiteData = (updatedData: SiteData) => {
    setSiteData(updatedData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    } catch {
      // Ignore
    }
  };

  // Sync products to local storage
  const handleUpdateProducts = (updatedProducts: PaintProduct[]) => {
    setProducts(updatedProducts);
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
    } catch (err) {
      console.error('Failed to sync updated catalog products to localStorage', err);
    }
  };

  const handleSelectProductForCalculator = (product: PaintProduct) => {
    setSelectedCalculatorProduct(product);
    const calcElement = document.getElementById('product-guides') || document.getElementById('calculator');
    if (calcElement) {
      calcElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAR = (product?: PaintProduct) => {
    if (product) {
      setArSelectedProduct(product);
    }
    setIsARModalOpen(true);
  };

  const handleOpenAdminWithTab = (tab: 'cms' | 'products' | 'pricing' | 'audit') => {
    setAdminInitialTab(tab);
    setIsAdminPortalOpen(true);
  };

  const handleOpenLogin = () => {
    setSlidePanelTab('login');
    setIsSlidePanelOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F4EC] dark:bg-[#0E131F] text-[#1A1A1A] dark:text-[#F1F4F9] flex flex-col font-sans selection:bg-[#243B7A] selection:text-white dark:selection:bg-[#3B82F6] dark:selection:text-white transition-colors duration-300 pb-14">
      
      {/* Navigation Header */}
      <Navbar
        logoName={siteData.logoName}
        navItems={INITIAL_SITE_DATA.navItems}
        loginButtonLabel={siteData.loginButtonLabel}
        onOpenLogin={handleOpenLogin}
        isLoggedIn={isLoggedIn}
        activeSectionId={activeSectionId}
        onNavClick={handleNavClick}
      />

      {/* Main Homepage Flow */}
      <main className="flex-1">
        
        {/* 1. Hero & Inspiration Section with Focal Room Showcases */}
        <HeroSection
          headline={siteData.hero.headline}
          subtitle={siteData.hero.subtitle}
          heroImageUrl={siteData.heroImageUrl}
          primaryButton={siteData.hero.primaryButton}
          secondaryButton={siteData.hero.secondaryButton}
          onNavClick={handleNavClick}
        />

        {/* 2. Core Feature Highlights (Plain, Friendly Benefits) */}
        <FeaturesSection
          headline={siteData.featuresHeadline}
          subtitle={siteData.featuresSubtitle}
          features={siteData.features}
        />

        {/* 3. Explore Products Catalog */}
        <ExploreProductsSection
          headline={siteData.explorerHeadline}
          subtitle={siteData.explorerSubtitle}
          products={products}
          onSelectForCalculator={handleSelectProductForCalculator}
          onOpenAR={handleOpenAR}
          onOpenLogin={handleOpenLogin}
          isLoggedIn={isLoggedIn}
        />

        {/* 4. Real Room Transformation (Before & After Split Slider) */}
        <TransformationSection />

        {/* 5. Color Gallery & Shade Matcher (3D Dome Gallery, Indian Palettes & Photo Shade Matcher) */}
        <ColoursOfIndiaInspirationSection />

        {/* 6. Wall-by-Wall Paint & Can Pack Calculator (Placed Last as Requested) */}
        <PaintCalculatorSection
          initialSelectedProduct={selectedCalculatorProduct}
          products={products}
        />

      </main>

      {/* Footer (includes Owner Studio access) */}
      <Footer
        logoName={siteData.logoName}
        tagline={siteData.tagline}
        onOpenLogin={handleOpenLogin}
        onOpenAdmin={() => handleOpenAdminWithTab('cms')}
      />

      {/* Right-Side Slide Panel (Login / Account & Saved Swatches) */}
      <SlidePanel
        isOpen={isSlidePanelOpen}
        onClose={() => setIsSlidePanelOpen(false)}
        siteData={siteData}
        isLoggedIn={isLoggedIn}
        onToggleLoginStatus={setIsLoggedIn}
        initialTab={slidePanelTab}
      />

      {/* On-Demand AR Assistance Pop-Up */}
      <ARAssistanceModal
        isOpen={isARModalOpen}
        onClose={() => setIsARModalOpen(false)}
        selectedProduct={arSelectedProduct}
      />

      {/* Secret Private Admin Portal with Role-Based Access Control */}
      <AdminPortal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
        products={products}
        onUpdateProducts={handleUpdateProducts}
        siteData={siteData}
        onUpdateSiteData={handleUpdateSiteData}
        initialTab={adminInitialTab}
        onSelectProductForCalculator={handleSelectProductForCalculator}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <RoleProvider>
        <MainAppContent />
      </RoleProvider>
    </ThemeProvider>
  );
}
