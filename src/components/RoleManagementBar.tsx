import React, { useState } from 'react';
import { useRole, ROLE_DEFINITIONS, UserRole } from '../context/RoleContext';
import { 
  Edit3, 
  FlaskConical, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Settings, 
  Check, 
  ShieldCheck,
  Lock
} from 'lucide-react';

interface RoleManagementBarProps {
  onOpenAdminPortal: (tab?: string) => void;
}

export const RoleManagementBar: React.FC<RoleManagementBarProps> = ({ onOpenAdminPortal }) => {
  const { 
    currentRole, 
    switchRole, 
    isEditorsLocked
  } = useRole();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const roleDef = ROLE_DEFINITIONS[currentRole];

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'content-editor':
        return <Edit3 className="w-3.5 h-3.5 text-[#E68A00]" />;
      case 'formulation-specialist':
        return <FlaskConical className="w-3.5 h-3.5 text-[#3F8F6B]" />;
      case 'homeowner':
        return <User className="w-3.5 h-3.5 text-[#5C6066]" />;
    }
  };

  if (isCollapsed) {
    return (
      <div className="fixed bottom-4 right-4 z-40 animate-fadeIn">
        <button
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#243B7A] text-white shadow-xl hover:bg-[#1C2E60] transition-all duration-200 border border-white/20 text-xs font-bold cursor-pointer"
          title="Expand Mode Bar"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3F8F6B] animate-pulse" />
            <span>Mode: {roleDef.badge}</span>
          </div>
          <ChevronUp className="w-3.5 h-3.5 text-white/80" />
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Mode & Live Edit Bar" className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-[calc(100%-2rem)] animate-fadeIn">
      <div className="bg-[#1A1A1A]/95 text-white backdrop-blur-md rounded-2xl sm:rounded-full px-4 sm:px-5 py-2 shadow-2xl border border-white/15 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        
        {/* Left: Active Mode & Dropdown Switcher */}
        <div className="relative flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#3F8F6B] animate-pulse" />
            <span className="text-[10px] text-white/60 uppercase font-bold tracking-wider hidden md:inline">
              Mode:
            </span>
          </div>

          {/* Mode Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors font-bold text-white border border-white/10 cursor-pointer"
            >
              {getRoleIcon(currentRole)}
              <span className="text-xs">{roleDef.badge}</span>
              <ChevronDown className={`w-3 h-3 text-white/70 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-72 sm:w-80 bg-white text-[#1A1A1A] rounded-2xl shadow-2xl border border-[#E8E2D5] p-2 z-50 animate-fadeIn space-y-1">
                <div className="px-3 py-1.5 border-b border-[#E8E2D5]/70 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#5C6066] uppercase tracking-wider">
                    Select Mode
                  </span>
                  <span className="text-[9px] text-[#243B7A] font-bold">
                    3 View &amp; Edit Modes
                  </span>
                </div>

                {(Object.keys(ROLE_DEFINITIONS) as UserRole[]).map((rKey) => {
                  const r = ROLE_DEFINITIONS[rKey];
                  const isSelected = currentRole === rKey;

                  return (
                    <button
                      key={rKey}
                      onClick={() => {
                        switchRole(rKey);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-start gap-2.5 cursor-pointer ${
                        isSelected 
                          ? 'bg-[#243B7A]/10 border border-[#243B7A]/30 text-[#243B7A]' 
                          : 'hover:bg-[#F8F4EC] text-[#1A1A1A]'
                      }`}
                    >
                      <div className="mt-0.5 p-1 rounded-md bg-white border border-[#E8E2D5] shrink-0">
                        {getRoleIcon(rKey)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{r.title}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#243B7A]" />}
                        </div>
                        <p className="text-[10px] text-[#5C6066] line-clamp-2 mt-0.5 leading-snug">
                          {r.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Owner Governance Indicator */}
          {isEditorsLocked ? (
            <div className="hidden sm:flex items-center gap-1 text-[10px] bg-red-500/20 text-red-300 px-2.5 py-1 rounded-full border border-red-500/30 font-bold">
              <Lock className="w-3 h-3" />
              <span>Owner Lock Active</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1 text-[10px] bg-[#3F8F6B]/20 text-emerald-300 px-2.5 py-1 rounded-full border border-[#3F8F6B]/30 font-bold">
              <ShieldCheck className="w-3 h-3" />
              <span>Owner Controlled</span>
            </div>
          )}
        </div>

        {/* Right: Settings & Owner Studio Button */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Owner Settings Access Button */}
          <button
            onClick={() => onOpenAdminPortal('settings')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all cursor-pointer"
            title="Open Owner Settings & PIN"
          >
            <Settings className="w-3.5 h-3.5 text-[#E68A00]" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Owner Management Studio */}
          <button
            onClick={() => onOpenAdminPortal('cms')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#243B7A] hover:bg-[#1C2E60] text-white font-bold text-xs border border-white/20 transition-all cursor-pointer shadow-xs"
            title="Open Management Studio"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#E68A00]" />
            <span>Owner Studio</span>
          </button>

          {/* Collapse Button */}
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 text-white/50 hover:text-white transition-colors cursor-pointer"
            title="Minimize Bar"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

      </div>
    </aside>
  );
};

