export type ButtonHoverTheme = 'saffron' | 'indigo' | 'emerald' | 'purple' | 'coral' | 'teal';

export interface ActionButton {
  id: string;
  label: string;
  theme: ButtonHoverTheme;
  linkAction: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  isActive?: boolean;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  accentColor: string;
}

export interface SurfacePrepStep {
  step: number;
  title: string;
  instruction: string;
}

export interface ApplicationGuide {
  dilutionRatio: string;
  dryingTime: string;
  recoatTime: string;
  recommendedTools: string[];
  primerRecommended: string;
  coatsRecommended: number;
}

export interface ArchitecturalSpecSheet {
  productCode: string;
  chemicalComposition: string;
  resinType: string;
  solidsByVolume: string;
  flashPoint: string;
  theoreticalCoverage: string;
  recommendedDftPerCoat: string; // Dry Film Thickness
  recommendedWftPerCoat: string; // Wet Film Thickness
  vocContentExact: string;
  fireSafetyRating: string;
  potLifeHours?: string;
  msdsDocumentUrl?: string;
  complianceStandards: string[];
}

export interface PaintProduct {
  id: string;
  name: string;
  category: 'interior' | 'exterior' | 'enamel' | 'primer' | 'texture';
  finish: 'Matte' | 'Eggshell' | 'Satin' | 'Soft Glow' | 'Semi-Gloss' | 'High Gloss';
  lrv: number;
  washabilityScore: number; // out of 10
  vocLevel: string; // e.g., "Zero VOC (< 5g/L)"
  coverageSqFtPerLiter: number;
  priceTier: 'Value' | 'Standard' | 'Premium' | 'Luxury' | 'Luxury Ultra';
  estimatedPricePerLiter?: number;
  hexCode: string;
  imageUrl?: string;
  description: string;
  keyFeatures: string[];
  recommendedRooms: string[];
  surfacePreparationSteps?: SurfacePrepStep[];
  applicationGuide?: ApplicationGuide;
  architecturalSpecs?: ArchitecturalSpecSheet;
}

export interface IndianPalette {
  id: string;
  regionName: string;
  paletteTitle: string;
  culturalStory: string;
  primaryHex: string;
  accentHexes: string[];
  colors: {
    name: string;
    hex: string;
    lrv: number;
    code: string;
    undertone: string;
  }[];
  bestSuitedFor: string;
}

export interface TimelinePeriod {
  id: string;
  era: string;
  title: string;
  architecturalStyle: string;
  keyColorName: string;
  hex: string;
  historicalContext: string;
  modernApplication: string;
}

export interface InspirationRoom {
  id: string;
  roomType: string;
  title: string;
  imageUrl: string;
  recommendedColors: {
    name: string;
    hex: string;
    code: string;
    role: 'Wall' | 'Accent' | 'Trim';
  }[];
  paintFinish: string;
  suggestedProduct: string;
  budgetAlternative: string;
  premiumChoice: string;
  lightOrientationAdvice: string;
}

export interface InnovationItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  badge: string;
  accentColor: string;
}

export interface SiteData {
  logoName: string;
  tagline: string;
  heroImageUrl: string;
  navItems: NavItem[];
  loginButtonLabel: string;
  hero: {
    headline: string;
    subtitle: string;
    primaryButton: ActionButton;
    secondaryButton: ActionButton;
  };
  featuresHeadline: string;
  featuresSubtitle: string;
  features: FeatureItem[];
  explorerHeadline: string;
  explorerSubtitle: string;
  doomGalleryHeadline?: string;
  doomGallerySubtitle?: string;
  guidesHeadline?: string;
  guidesSubtitle?: string;
  palettes?: IndianPalette[];
  timelines?: TimelinePeriod[];
  inspirationRooms?: InspirationRoom[];
  innovations?: InnovationItem[];
  footer?: {
    contactEmail: string;
    contactPhone: string;
    copyrightText: string;
    disclaimerText: string;
  };
}
