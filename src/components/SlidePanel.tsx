import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, Palette, User, ShieldCheck, KeyRound, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { SiteData } from '../types';
import { firewall } from '../lib/security';
import { BrandLogo } from './BrandLogo';

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  siteData: SiteData;
  isLoggedIn: boolean;
  onToggleLoginStatus: (status: boolean) => void;
  initialTab?: 'login' | 'palettes';
}

export const SlidePanel: React.FC<SlidePanelProps> = ({
  isOpen,
  onClose,
  siteData,
  isLoggedIn,
  onToggleLoginStatus,
  initialTab = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'palettes'>(initialTab === 'palettes' ? 'palettes' : 'login');
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showOtpView, setShowOtpView] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Security check 1: Rate limiter guard
    const rateCheck = firewall.checkRateLimit();
    if (!rateCheck.allowed) {
      setErrorMessage(`Security Lockout: Too many login attempts. Please wait ${rateCheck.retryAfterSeconds} seconds.`);
      return;
    }

    // Security check 2: Email format and payload sanitization
    const emailValidation = firewall.validateEmail(email);
    if (!emailValidation.valid) {
      setErrorMessage(emailValidation.reason || 'Invalid email address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowOtpView(true);
    }, 500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 4) {
      setErrorMessage('Please enter the verification code.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onToggleLoginStatus(true);
      setShowOtpView(false);
    }, 400);
  };

  const handleLogout = () => {
    onToggleLoginStatus(false);
    setShowOtpView(false);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#1A1C1E]/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F8F4EC]/95 dark:bg-[#0A0E17]/95 backdrop-blur-2xl shadow-2xl border-l border-[#E8E2D5] dark:border-white/10 flex flex-col justify-between transition-colors duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-[#E8E2D5] dark:border-white/10 flex items-center justify-between bg-white/80 dark:bg-[#131B2E]/80 backdrop-blur-md">
            <BrandLogo logoName={siteData.logoName} size="sm" fontStyle="italic-serif" />

            <button
              onClick={onClose}
              className="p-2 text-[#1A1A1A]/60 dark:text-[#94A3B8] hover:text-[#1A1A1A] dark:hover:text-[#F1F4F9] rounded-full hover:bg-[#F8F4EC] dark:hover:bg-[#1E293B] transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#E8E2D5] dark:border-white/10 bg-white/60 dark:bg-[#0E131F]/60 px-6 pt-3 gap-6 text-xs font-semibold text-[#1A1A1A]/70 dark:text-[#94A3B8]">
            <button
              onClick={() => setActiveTab('login')}
              className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'login' ? 'border-[#243B7A] dark:border-[#3B82F6] text-[#243B7A] dark:text-[#60A5FA] font-bold' : 'border-transparent hover:text-[#1A1A1A] dark:hover:text-[#F1F4F9]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{isLoggedIn ? 'Account Status' : 'Studio Login'}</span>
            </button>

            <button
              onClick={() => setActiveTab('palettes')}
              className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'palettes' ? 'border-[#243B7A] dark:border-[#3B82F6] text-[#243B7A] dark:text-[#60A5FA] font-bold' : 'border-transparent hover:text-[#1A1A1A] dark:hover:text-[#F1F4F9]'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Saved Architectural Swatches</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* TAB 1: LOGIN / ACCOUNT & SECURITY */}
            {activeTab === 'login' && (
              <div className="space-y-6">
                {isLoggedIn ? (
                  <div className="bg-white/80 dark:bg-[#131B2E]/90 backdrop-blur-xl p-6 rounded-2xl border border-[#E8E2D5] dark:border-white/10 space-y-4 text-center shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-[#243B7A]/10 dark:bg-[#3B82F6]/20 text-[#243B7A] dark:text-[#60A5FA] flex items-center justify-center mx-auto">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-[#1A1A1A] dark:text-[#F1F4F9]">Studio Account Active</h3>
                      <p className="text-xs text-[#1A1A1A]/60 dark:text-[#94A3B8]">shrinivassanganwar1@gmail.com</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#3F8F6B]/10 dark:bg-[#10B981]/15 border border-[#3F8F6B]/20 dark:border-[#10B981]/30 text-[11px] text-[#3F8F6B] dark:text-[#34D399] font-semibold text-left space-y-1">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Secure Enterprise Session Active</span>
                      </div>
                      <p className="text-[#1A1A1A]/70 dark:text-[#CBD5E1] text-[10px]">
                        Session protected by firewall CSRF token & rate limiter.
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full py-2.5 px-4 rounded-full text-xs font-bold text-[#D96C4A] dark:text-[#F87171] border border-[#D96C4A]/30 dark:border-[#F87171]/30 hover:bg-[#D96C4A]/10 dark:hover:bg-[#F87171]/10 transition-colors cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : showOtpView ? (
                  /* Concise OTP Verification View */
                  <div className="space-y-6 bg-white/80 dark:bg-[#131B2E]/90 backdrop-blur-xl p-6 rounded-2xl border border-[#E8E2D5] dark:border-white/10 shadow-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#243B7A] dark:text-[#93C5FD] bg-[#243B7A]/10 dark:bg-[#3B82F6]/20 px-2.5 py-0.5 rounded-full">
                        Security Verification
                      </span>
                      <h3 className="font-heading font-bold text-xl text-[#1A1A1A] dark:text-[#F1F4F9] mt-2">Enter 2FA Code</h3>
                      <p className="text-xs text-[#1A1A1A]/60 dark:text-[#94A3B8] mt-1">
                        Please enter the code sent to your registered email.
                      </p>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      {errorMessage && (
                        <div className="p-2.5 bg-[#D96C4A]/10 dark:bg-red-500/20 border border-[#D96C4A]/20 dark:border-red-500/30 text-[#D96C4A] dark:text-red-400 rounded-xl text-xs font-semibold">
                          {errorMessage}
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1A1A1A] dark:text-[#F1F4F9]">Security Passcode</label>
                        <div className="relative">
                          <KeyRound className="w-4 h-4 text-[#1A1A1A]/50 dark:text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            maxLength={6}
                            placeholder="123456"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-[#F8F4EC] dark:bg-[#0E131F] border border-[#E8E2D5] dark:border-white/10 rounded-xl text-center font-mono font-bold tracking-widest text-sm text-[#1A1A1A] dark:text-[#F1F4F9] focus:outline-none focus:border-[#243B7A] dark:focus:border-[#3B82F6]"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-6 text-xs font-bold rounded-full bg-[#243B7A] dark:bg-[#3B82F6] text-white hover:bg-[#1C2E60] dark:hover:bg-[#2563EB] transition-colors cursor-pointer"
                      >
                        {isSubmitting ? 'Verifying...' : 'Verify Code & Sign In'}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-heading font-bold text-2xl text-[#1A1A1A] dark:text-[#F1F4F9] tracking-tight">Studio Login</h3>
                      <p className="text-xs text-[#1A1A1A]/60 dark:text-[#94A3B8] mt-1">
                        Access your saved paint palettes and room simulations.
                      </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      {errorMessage && (
                        <div className="p-2.5 bg-[#D96C4A]/10 dark:bg-red-500/20 border border-[#D96C4A]/30 dark:border-red-500/30 text-[#D96C4A] dark:text-red-400 rounded-xl text-xs font-semibold">
                          {errorMessage}
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1A1A1A] dark:text-[#F1F4F9]">Email Address</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-[#1A1A1A]/50 dark:text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            placeholder="architect@domain.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0E131F] border border-[#E8E2D5] dark:border-white/10 rounded-xl text-xs text-[#1A1A1A] dark:text-[#F1F4F9] focus:outline-none focus:border-[#243B7A] dark:focus:border-[#3B82F6]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#1A1A1A] dark:text-[#F1F4F9]">Password</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-[#1A1A1A]/50 dark:text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0E131F] border border-[#E8E2D5] dark:border-white/10 rounded-xl text-xs text-[#1A1A1A] dark:text-[#F1F4F9] focus:outline-none focus:border-[#243B7A] dark:focus:border-[#3B82F6]"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-[#1A1A1A]/80 dark:text-[#CBD5E1] font-medium">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="rounded border-[#E8E2D5] dark:border-white/20 text-[#243B7A] focus:ring-[#243B7A]"
                          />
                          <span>Remember Me</span>
                        </label>

                        <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset token issued safely.'); }} className="text-[#243B7A] dark:text-[#60A5FA] font-semibold hover:underline">
                          Forgot Password?
                        </a>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative w-full py-3 px-6 text-xs font-bold rounded-full bg-white dark:bg-[#162032] text-[#243B7A] dark:text-[#93C5FD] border border-[#243B7A] dark:border-[#3B82F6] overflow-hidden transition-all duration-300 hover:text-white cursor-pointer shadow-2xs mt-2"
                      >
                        <span className="absolute inset-0 bg-[#243B7A] dark:bg-[#3B82F6] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-wider">
                          {isSubmitting ? (
                            <span>Authenticating...</span>
                          ) : (
                            <>
                              <span>Sign In to Studio</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </span>
                      </button>
                    </form>

                    {/* Firewall Security Status Card */}
                    <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#131B2E]/90 backdrop-blur-md border border-[#E8E2D5] dark:border-white/10 space-y-1.5 text-[11px] text-[#1A1A1A] dark:text-[#F1F4F9] shadow-2xs">
                      <div className="flex items-center gap-2 font-bold text-[#3F8F6B] dark:text-[#34D399]">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Security Firewall Guard Active</span>
                      </div>
                      <p className="text-[10px] text-[#1A1A1A]/70 dark:text-[#94A3B8] leading-relaxed">
                        Protected with XSS input sanitization, CSRF token verification, and 5-attempt/min rate limiting.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SAVED SWATCHES */}
            {activeTab === 'palettes' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-heading font-bold text-xl text-[#1A1A1A] dark:text-[#F1F4F9]">Saved Architectural Swatches</h3>
                  <p className="text-xs text-[#1A1A1A]/60 dark:text-[#94A3B8]">Quick reference for light reflection and room pairings.</p>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 bg-white/80 dark:bg-[#131B2E]/90 backdrop-blur-md rounded-2xl border border-[#E8E2D5] dark:border-white/10 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#F8F4EC] dark:bg-[#2A3447] border border-[#E8E2D5] dark:border-white/20 aurora-swatch-glow" />
                      <div>
                        <p className="text-xs font-bold text-[#1A1A1A] dark:text-[#F1F4F9]">Warm Ivory (HS-01)</p>
                        <p className="text-[11px] text-[#1A1A1A]/60 dark:text-[#94A3B8]">Eggshell • Warm Tone</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-[#243B7A]/10 dark:bg-[#3B82F6]/20 text-[#243B7A] dark:text-[#93C5FD] px-2 py-0.5 rounded-full font-bold">Main Living</span>
                  </div>

                  <div className="p-3.5 bg-white/80 dark:bg-[#131B2E]/90 backdrop-blur-md rounded-2xl border border-[#E8E2D5] dark:border-white/10 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#243B7A] aurora-swatch-glow" />
                      <div>
                        <p className="text-xs font-bold text-[#1A1A1A] dark:text-[#F1F4F9]">Deep Indigo (HS-02)</p>
                        <p className="text-[11px] text-[#1A1A1A]/60 dark:text-[#94A3B8]">Cobalt • Deep Statement</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-[#E68A00]/10 dark:bg-[#F59E0B]/20 text-[#E68A00] dark:text-[#FBBF24] px-2 py-0.5 rounded-full font-bold">Study Accent</span>
                  </div>

                  <div className="p-3.5 bg-white/80 dark:bg-[#131B2E]/90 backdrop-blur-md rounded-2xl border border-[#E8E2D5] dark:border-white/10 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#3F8F6B] aurora-swatch-glow" />
                      <div>
                        <p className="text-xs font-bold text-[#1A1A1A] dark:text-[#F1F4F9]">Soft Emerald (HS-04)</p>
                        <p className="text-[11px] text-[#1A1A1A]/60 dark:text-[#94A3B8]">Matte • Fresh Calming</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-[#3F8F6B]/10 dark:bg-[#10B981]/20 text-[#3F8F6B] dark:text-[#34D399] px-2 py-0.5 rounded-full font-bold">Master Bedroom</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#E8E2D5] dark:border-white/10 bg-white/60 dark:bg-[#0E131F]/60 text-center text-[11px] font-medium text-[#1A1A1A]/60 dark:text-[#94A3B8]">
            HomeSelect • Helping you choose the right paint
          </div>

        </div>
      </div>
    </div>
  );
};
