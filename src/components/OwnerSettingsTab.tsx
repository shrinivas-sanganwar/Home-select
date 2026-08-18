import React, { useState } from 'react';
import { 
  SiteData, 
  PaintProduct 
} from '../types';
import { useRole } from '../context/RoleContext';
import { 
  Lock, 
  ShieldCheck, 
  KeyRound, 
  Save, 
  Download, 
  UploadCloud, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Sliders,
  Globe,
  Mail,
  Phone,
  Layers,
  FileCheck,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import { INITIAL_SITE_DATA, PAINT_PRODUCTS } from '../data/defaultContent';

interface OwnerSettingsTabProps {
  siteData: SiteData;
  onUpdateSiteData: (updatedSiteData: SiteData) => void;
  products: PaintProduct[];
  onUpdateProducts: (updatedProducts: PaintProduct[]) => void;
}

export const OwnerSettingsTab: React.FC<OwnerSettingsTabProps> = ({
  siteData,
  onUpdateSiteData,
  products,
  onUpdateProducts,
}) => {
  const {
    ownerPin,
    isOwnerVerified,
    isEditorsLocked,
    verifyOwnerPin,
    setOwnerVerified,
    updateOwnerPin,
    toggleEditorsLock,
  } = useRole();

  // Local PIN input state for unlocking
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showNewPinForm, setShowNewPinForm] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [newPinConfirm, setNewPinConfirm] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [pinChangeError, setPinChangeError] = useState('');

  // Branding & Site General Settings
  const [logoName, setLogoName] = useState(siteData.logoName || 'HomeSelect');
  const [tagline, setTagline] = useState(siteData.tagline || 'Helping you choose the right paint for every wall.');
  const [contactEmail, setContactEmail] = useState(siteData.footer.contactEmail || 'concierge@homeselect.in');
  const [contactPhone, setContactPhone] = useState(siteData.footer.contactPhone || '+91 1800-209-5678');
  const [copyrightText, setCopyrightText] = useState(siteData.footer.copyrightText || '© 2026 HomeSelect India Coatings Intelligence.');
  const [disclaimerText, setDisclaimerText] = useState(siteData.footer.disclaimerText || '');
  
  // Notification states
  const [saveNotice, setSaveNotice] = useState(false);
  const [backupNotice, setBackupNotice] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [restoreSuccess, setRestoreSuccess] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyOwnerPin(inputPin)) {
      setPinError(false);
      setInputPin('');
    } else {
      setPinError(true);
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError('');
    if (newPinInput.length < 4) {
      setPinChangeError('PIN must be at least 4 digits.');
      return;
    }
    if (newPinInput !== newPinConfirm) {
      setPinChangeError('PIN confirmation does not match.');
      return;
    }
    updateOwnerPin(newPinInput);
    setPinChangeSuccess(true);
    setShowNewPinForm(false);
    setNewPinInput('');
    setNewPinConfirm('');
    setTimeout(() => setPinChangeSuccess(false), 3000);
  };

  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SiteData = {
      ...siteData,
      logoName,
      tagline,
      footer: {
        ...siteData.footer,
        contactEmail,
        contactPhone,
        copyrightText,
        disclaimerText,
      },
    };
    onUpdateSiteData(updated);
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 2500);
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const backupPayload = {
      exportTimestamp: new Date().toISOString(),
      platform: 'HomeSelect Coatings Intelligence v4.0',
      siteData,
      products,
    };
    const jsonStr = JSON.stringify(backupPayload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `homeselect-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setBackupNotice(true);
    setTimeout(() => setBackupNotice(false), 3000);
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRestoreError(null);

    const fileSizeKB = (file.size / 1024).toFixed(1);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.siteData) {
          onUpdateSiteData(parsed.siteData);
        }
        let prodCount = 0;
        if (Array.isArray(parsed.products)) {
          onUpdateProducts(parsed.products);
          prodCount = parsed.products.length;
        }
        setRestoreSuccess(`Restored "${file.name}" (${fileSizeKB} KB) with ${prodCount} catalog items successfully.`);
        setTimeout(() => setRestoreSuccess(null), 4000);
      } catch (err) {
        setRestoreError('Invalid backup file format. Please provide a valid HomeSelect JSON export.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Factory Reset to Baseline Defaults
  const handleExecuteFactoryReset = () => {
    onUpdateSiteData(INITIAL_SITE_DATA);
    onUpdateProducts(PAINT_PRODUCTS);
    setShowResetModal(false);
    setRestoreSuccess('Catalog and website reset to Asian Paints official baseline.');
    setTimeout(() => setRestoreSuccess(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      
      {/* Top Banner */}
      <div className="bg-[#243B7A]/5 p-5 sm:p-6 rounded-3xl border border-[#E8E2D5] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#243B7A] text-white flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#E68A00]" />
              <span>Owner Access</span>
            </span>
          </div>
          <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">
            Owner Settings &amp; Security PIN
          </h3>
          <p className="text-xs text-[#1A1A1A]/70 max-w-2xl mt-1 leading-relaxed">
            Manage your owner PIN, lock editor modifications, update store details, and export catalog backups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isOwnerVerified ? (
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#3F8F6B]/15 text-[#3F8F6B] border border-[#3F8F6B]/30 font-bold text-xs">
              <CheckCircle className="w-4 h-4" />
              <span>Owner Verified</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#E68A00]/15 text-[#E68A00] border border-[#E68A00]/30 font-bold text-xs">
              <Lock className="w-4 h-4" />
              <span>PIN Required</span>
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      {saveNotice && (
        <div className="p-3.5 bg-[#3F8F6B]/10 text-[#3F8F6B] border border-[#3F8F6B]/30 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4" />
          <span>General settings and branding updated live across the entire website!</span>
        </div>
      )}

      {pinChangeSuccess && (
        <div className="p-3.5 bg-[#3F8F6B]/10 text-[#3F8F6B] border border-[#3F8F6B]/30 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4" />
          <span>Owner Master PIN successfully changed!</span>
        </div>
      )}

      {backupNotice && (
        <div className="p-3.5 bg-[#243B7A]/10 text-[#243B7A] border border-[#243B7A]/30 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4" />
          <span>Website JSON Backup downloaded successfully!</span>
        </div>
      )}

      {restoreSuccess && (
        <div className="p-3.5 bg-[#3F8F6B]/10 text-[#3F8F6B] border border-[#3F8F6B]/30 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4" />
          <span>Data backup successfully restored and live across the platform!</span>
        </div>
      )}

      {restoreError && (
        <div className="p-3.5 bg-red-500/10 text-red-700 border border-red-500/30 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <AlertTriangle className="w-4 h-4" />
          <span>{restoreError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SECTION 1: OWNER ACCESS CONTROL & EDITOR LOCK */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E8E2D5] shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#243B7A]/10 text-[#243B7A] flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1A1A1A]">Owner Access &amp; Editor Governance</h4>
                <p className="text-[11px] text-[#1A1A1A]/60">Control who can modify public content</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F8F4EC] text-[#5C6066]">
              Master Protection
            </span>
          </div>

          {/* Editor Freeze / Lock Control */}
          <div className="p-4 rounded-2xl bg-[#F8F4EC] border border-[#E8E2D5] flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[#1A1A1A]">Lock Editor Live Editing Mode</span>
                {isEditorsLocked ? (
                  <span className="text-[10px] bg-red-500/15 text-red-700 font-bold px-2 py-0.2 rounded-full">LOCKED</span>
                ) : (
                  <span className="text-[10px] bg-[#3F8F6B]/15 text-[#3F8F6B] font-bold px-2 py-0.2 rounded-full">UNLOCKED</span>
                )}
              </div>
              <p className="text-[11px] text-[#1A1A1A]/70 mt-0.5 leading-relaxed">
                When locked, content editors cannot make on-page live edits until the Owner unlocks it.
              </p>
            </div>
            <button
              onClick={toggleEditorsLock}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs whitespace-nowrap ${
                isEditorsLocked 
                  ? 'bg-[#3F8F6B] text-white hover:bg-[#327356]' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isEditorsLocked ? 'Unlock Editors' : 'Freeze Editors'}
            </button>
          </div>

          {/* Owner PIN Verification Box */}
          <div className="p-4 rounded-2xl bg-white border border-[#E8E2D5] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
                <KeyRound className="w-3.5 h-3.5 text-[#E68A00]" />
                <span>Owner Master PIN (Default: 8888)</span>
              </div>
              {isOwnerVerified ? (
                <button
                  onClick={() => setOwnerVerified(false)}
                  className="text-[11px] text-[#243B7A] font-bold hover:underline cursor-pointer"
                >
                  Lock Session
                </button>
              ) : null}
            </div>

            {!isOwnerVerified ? (
              <form onSubmit={handleVerifyPin} className="flex gap-2">
                <input
                  type="password"
                  value={inputPin}
                  onChange={(e) => {
                    setInputPin(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="Enter 4-digit Owner PIN..."
                  maxLength={6}
                  className="flex-1 px-3 py-2 text-xs bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl focus:outline-hidden focus:border-[#243B7A]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#243B7A] text-white rounded-xl text-xs font-bold hover:bg-[#1C2E60] transition-colors cursor-pointer"
                >
                  Verify
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between text-xs text-[#3F8F6B] font-bold">
                <span>✓ Owner session authenticated. Full governance active.</span>
                <button
                  type="button"
                  onClick={() => setShowNewPinForm(!showNewPinForm)}
                  className="text-[11px] text-[#243B7A] hover:underline cursor-pointer"
                >
                  {showNewPinForm ? 'Cancel' : 'Change Master PIN'}
                </button>
              </div>
            )}

            {pinError && (
              <p className="text-[11px] text-red-600 font-bold">
                Incorrect PIN. Default is 8888.
              </p>
            )}

            {showNewPinForm && (
              <form onSubmit={handleChangePin} className="p-3 bg-[#F8F4EC] rounded-xl border border-[#E8E2D5] space-y-2 mt-2">
                <p className="text-[11px] font-bold text-[#1A1A1A]">Set New Master PIN</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="password"
                    placeholder="New PIN (min 4 digits)"
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-[#E8E2D5] rounded-lg focus:outline-hidden"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New PIN"
                    value={newPinConfirm}
                    onChange={(e) => setNewPinConfirm(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-[#E8E2D5] rounded-lg focus:outline-hidden"
                  />
                </div>
                {pinChangeError && <p className="text-[10px] text-red-600">{pinChangeError}</p>}
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#3F8F6B] text-white rounded-lg text-xs font-bold hover:bg-[#327356] cursor-pointer"
                  >
                    Save New PIN
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* SECTION 2: BRANDING & CONTACT SETTINGS */}
        <form onSubmit={handleSaveGeneralSettings} className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E8E2D5] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E68A00]/10 text-[#E68A00] flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1A1A1A]">Website Identity &amp; Concierge</h4>
                <p className="text-[11px] text-[#1A1A1A]/60">Branding, hotline, and footer metadata</p>
              </div>
            </div>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-[#243B7A] text-white rounded-xl text-xs font-bold hover:bg-[#1C2E60] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Branding</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#1A1A1A]/80 mb-1">Platform Brand Name</label>
              <input
                type="text"
                value={logoName}
                onChange={(e) => setLogoName(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl focus:outline-hidden focus:border-[#243B7A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#1A1A1A]/80 mb-1">Concierge Hotline</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl focus:outline-hidden focus:border-[#243B7A]"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-[11px] font-bold text-[#1A1A1A]/80 mb-1">Brand Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl focus:outline-hidden focus:border-[#243B7A]"
            />
          </div>

          <div className="text-xs">
            <label className="block text-[11px] font-bold text-[#1A1A1A]/80 mb-1">Concierge Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl focus:outline-hidden focus:border-[#243B7A]"
            />
          </div>

          <div className="text-xs">
            <label className="block text-[11px] font-bold text-[#1A1A1A]/80 mb-1">Copyright Statement</label>
            <input
              type="text"
              value={copyrightText}
              onChange={(e) => setCopyrightText(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F4EC] border border-[#E8E2D5] rounded-xl focus:outline-hidden focus:border-[#243B7A]"
            />
          </div>
        </form>

      </div>

      {/* SECTION 3: FULL SYSTEM BACKUP, RESTORE & FACTORY RESET */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E8E2D5] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#3F8F6B]/10 text-[#3F8F6B] flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#1A1A1A]">Data Governance, Backup &amp; Recovery</h4>
              <p className="text-[11px] text-[#1A1A1A]/60">Export complete website JSON or restore configurations</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Card 1: Export Backup */}
          <div className="p-4 rounded-2xl bg-[#F8F4EC] border border-[#E8E2D5] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#1A1A1A]">
                <Download className="w-4 h-4 text-[#243B7A]" />
                <span>Export Website Backup</span>
              </div>
              <p className="text-[11px] text-[#1A1A1A]/70 mt-1 leading-relaxed">
                Download a JSON snapshot containing all CMS content, color palettes, and paint catalog specifications.
              </p>
            </div>
            <button
              onClick={handleExportBackup}
              className="w-full py-2 bg-[#243B7A] text-white rounded-xl text-xs font-bold hover:bg-[#1C2E60] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Card 2: Import Backup */}
          <div className="p-4 rounded-2xl bg-[#F8F4EC] border border-[#E8E2D5] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#1A1A1A]">
                <UploadCloud className="w-4 h-4 text-[#E68A00]" />
                <span>Restore Backup File</span>
              </div>
              <p className="text-[11px] text-[#1A1A1A]/70 mt-1 leading-relaxed">
                Upload a previously exported JSON backup to immediately restore all content and catalog definitions.
              </p>
            </div>
            <label className="w-full py-2 bg-[#E68A00] text-white rounded-xl text-xs font-bold hover:bg-[#CC7A00] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs text-center">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Backup JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>

          {/* Card 3: Factory Reset */}
          <div className="p-4 rounded-2xl bg-[#F8F4EC] border border-[#E8E2D5] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#D96C4A]">
                <RefreshCw className="w-4 h-4" />
                <span>Reset to Factory Defaults</span>
              </div>
              <p className="text-[11px] text-[#1A1A1A]/70 mt-1 leading-relaxed">
                Revert the entire website and paint catalog back to the official Asian Paints architectural baseline data.
              </p>
            </div>
            <button
              onClick={() => setShowResetModal(true)}
              className="w-full py-2 bg-white border border-[#D96C4A]/40 text-[#D96C4A] hover:bg-[#D96C4A]/10 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Factory Baseline</span>
            </button>
          </div>

        </div>

        {/* Restore Success Banner */}
        {restoreSuccess && (
          <div className="p-3.5 bg-[#3F8F6B]/15 border border-[#3F8F6B]/30 rounded-2xl flex items-center gap-2.5 text-xs text-[#3F8F6B] font-bold animate-fadeIn">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{restoreSuccess}</span>
          </div>
        )}

        {/* Restore Error Banner */}
        {restoreError && (
          <div className="p-3.5 bg-[#D96C4A]/15 border border-[#D96C4A]/30 rounded-2xl flex items-center gap-2.5 text-xs text-[#D96C4A] font-bold animate-fadeIn">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{restoreError}</span>
          </div>
        )}

      </div>

      {/* IN-APP FACTORY RESET CONFIRMATION MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-70 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#E8E2D5] space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-[#D96C4A]">
              <div className="w-10 h-10 rounded-full bg-[#D96C4A]/15 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-[#D96C4A]" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-[#1A1A1A]">Reset to Factory Baseline?</h3>
                <p className="text-xs text-[#1A1A1A]/60">Restores Asian Paints official catalog defaults.</p>
              </div>
            </div>

            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed bg-[#F8F4EC] p-3 rounded-2xl border border-[#E8E2D5]">
              This will overwrite current edits with the verified Asian Paints product library and website configuration.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 border border-[#E8E2D5] rounded-full text-xs font-bold text-[#1A1A1A]/70 hover:bg-[#F8F4EC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteFactoryReset}
                className="px-5 py-2 bg-[#D96C4A] text-white rounded-full text-xs font-bold hover:bg-[#B85435] transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Yes, Reset Baseline</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
