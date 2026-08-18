import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteData, PaintProduct, IndianPalette, TimelinePeriod, InspirationRoom, InnovationItem } from '../types';

export type UserRole = 'content-editor' | 'formulation-specialist' | 'homeowner';

export interface RolePermissions {
  canEditHero: boolean;
  canEditPillars: boolean;
  canEditCatalog: boolean;
  canExtractTDS: boolean;
  canEditPalettesAndDoom: boolean;
  canEditTimeline: boolean;
  canEditGuidesAndInnovations: boolean;
  canEditNavigationAndFooter: boolean;
  canLiveEditOnPage: boolean;
}

export const ROLE_DEFINITIONS: Record<UserRole, {
  title: string;
  badge: string;
  color: string;
  description: string;
  iconName: string;
  permissions: RolePermissions;
}> = {
  'content-editor': {
    title: 'Content Editor (Live Mode)',
    badge: '✍️ Editor Mode',
    color: '#E68A00',
    description: 'Edit copy, headlines, Doom Gallery palettes, timeline eras, guides, and visual content directly on the page.',
    iconName: 'Edit3',
    permissions: {
      canEditHero: true,
      canEditPillars: true,
      canEditCatalog: true,
      canExtractTDS: true,
      canEditPalettesAndDoom: true,
      canEditTimeline: true,
      canEditGuidesAndInnovations: true,
      canEditNavigationAndFooter: true,
      canLiveEditOnPage: true,
    },
  },
  'formulation-specialist': {
    title: 'Paint Formulation Specialist',
    badge: '🧪 Formulation Lead',
    color: '#3F8F6B',
    description: 'Manage coating formulations, pricing tiers, coverage specs, washability ratings, and Smart PDF TDS extraction.',
    iconName: 'FlaskConical',
    permissions: {
      canEditHero: false,
      canEditPillars: false,
      canEditCatalog: true,
      canExtractTDS: true,
      canEditPalettesAndDoom: false,
      canEditTimeline: false,
      canEditGuidesAndInnovations: false,
      canEditNavigationAndFooter: false,
      canLiveEditOnPage: false,
    },
  },
  'homeowner': {
    title: 'Customer View (Public Mode)',
    badge: '👤 Customer View',
    color: '#5C6066',
    description: 'Clean visitor experience without editing overlays: explore paints, 3D Doom Gallery, and compare formulations.',
    iconName: 'User',
    permissions: {
      canEditHero: false,
      canEditPillars: false,
      canEditCatalog: false,
      canExtractTDS: false,
      canEditPalettesAndDoom: false,
      canEditTimeline: false,
      canEditGuidesAndInnovations: false,
      canEditNavigationAndFooter: false,
      canLiveEditOnPage: false,
    },
  },
};

export type EditableSectionKey = 
  | 'hero' 
  | 'features' 
  | 'explorer' 
  | 'palettes' 
  | 'timeline' 
  | 'guides' 
  | 'innovations' 
  | 'footer' 
  | 'branding';

interface RoleContextType {
  currentRole: UserRole;
  isLiveEditMode: boolean;
  activeQuickEditSection: EditableSectionKey | null;
  permissions: RolePermissions;
  isOwnerVerified: boolean;
  isEditorsLocked: boolean;
  ownerPin: string;
  verifyOwnerPin: (pin: string) => boolean;
  setOwnerVerified: (verified: boolean) => void;
  updateOwnerPin: (newPin: string) => void;
  toggleEditorsLock: () => void;
  switchRole: (newRole: UserRole) => void;
  toggleLiveEditMode: (forceState?: boolean) => void;
  openQuickEdit: (section: EditableSectionKey) => void;
  closeQuickEdit: () => void;
  hasPermission: (permissionKey: keyof RolePermissions) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const ROLE_STORAGE_KEY = 'homeselect_v4_active_role';
const LIVE_EDIT_STORAGE_KEY = 'homeselect_v4_live_edit_mode';
const OWNER_PIN_STORAGE_KEY = 'homeselect_v4_owner_pin';
const EDITORS_LOCKED_STORAGE_KEY = 'homeselect_v4_editors_locked';

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(ROLE_STORAGE_KEY);
      if (saved && (saved in ROLE_DEFINITIONS)) return saved as UserRole;
    } catch {
      // Ignore
    }
    return 'content-editor';
  });

  const [ownerPin, setOwnerPin] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(OWNER_PIN_STORAGE_KEY);
      if (saved) return saved;
    } catch {}
    return '8888';
  });

  const [isOwnerVerified, setIsOwnerVerified] = useState<boolean>(true);

  const [isEditorsLocked, setIsEditorsLocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(EDITORS_LOCKED_STORAGE_KEY);
      if (saved !== null) return saved === 'true';
    } catch {}
    return false;
  });

  const [isLiveEditMode, setIsLiveEditMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LIVE_EDIT_STORAGE_KEY);
      if (saved !== null) return saved === 'true';
    } catch {
      // Ignore
    }
    return true;
  });

  const [activeQuickEditSection, setActiveQuickEditSection] = useState<EditableSectionKey | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, currentRole);
    } catch {}
  }, [currentRole]);

  useEffect(() => {
    try {
      localStorage.setItem(OWNER_PIN_STORAGE_KEY, ownerPin);
    } catch {}
  }, [ownerPin]);

  useEffect(() => {
    try {
      localStorage.setItem(EDITORS_LOCKED_STORAGE_KEY, String(isEditorsLocked));
    } catch {}
  }, [isEditorsLocked]);

  useEffect(() => {
    try {
      localStorage.setItem(LIVE_EDIT_STORAGE_KEY, String(isLiveEditMode));
    } catch {}
  }, [isLiveEditMode]);

  const verifyOwnerPin = (pin: string): boolean => {
    if (pin.trim() === ownerPin.trim()) {
      setIsOwnerVerified(true);
      return true;
    }
    return false;
  };

  const updateOwnerPin = (newPin: string) => {
    if (newPin.trim().length >= 4) {
      setOwnerPin(newPin.trim());
    }
  };

  const toggleEditorsLock = () => {
    setIsEditorsLocked(prev => {
      const next = !prev;
      if (next && !isOwnerVerified) {
        setIsLiveEditMode(false);
      }
      return next;
    });
  };

  const permissions = ROLE_DEFINITIONS[currentRole].permissions;

  const switchRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'homeowner') {
      setIsLiveEditMode(false);
      setActiveQuickEditSection(null);
    } else if (newRole === 'content-editor') {
      setIsLiveEditMode(!isEditorsLocked || isOwnerVerified);
    }
  };

  const toggleLiveEditMode = (forceState?: boolean) => {
    if (!permissions.canLiveEditOnPage || (isEditorsLocked && !isOwnerVerified)) {
      setIsLiveEditMode(false);
      return;
    }
    setIsLiveEditMode(prev => forceState !== undefined ? forceState : !prev);
  };

  const openQuickEdit = (section: EditableSectionKey) => {
    if (!permissions.canLiveEditOnPage || (isEditorsLocked && !isOwnerVerified)) return;
    setActiveQuickEditSection(section);
  };

  const closeQuickEdit = () => {
    setActiveQuickEditSection(null);
  };

  const hasPermission = (permissionKey: keyof RolePermissions): boolean => {
    if (isEditorsLocked && !isOwnerVerified && permissionKey === 'canLiveEditOnPage') {
      return false;
    }
    return !!permissions[permissionKey];
  };

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        isLiveEditMode,
        activeQuickEditSection,
        permissions,
        isOwnerVerified,
        isEditorsLocked,
        ownerPin,
        verifyOwnerPin,
        setOwnerVerified: setIsOwnerVerified,
        updateOwnerPin,
        toggleEditorsLock,
        switchRole,
        toggleLiveEditMode,
        openQuickEdit,
        closeQuickEdit,
        hasPermission,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

