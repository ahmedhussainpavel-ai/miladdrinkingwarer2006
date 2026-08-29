import React, { useState, useEffect } from 'react';
import { 
  Download, 
  X, 
  Sparkles, 
  Smartphone, 
  Share2, 
  PlusSquare, 
  CheckCircle2, 
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { MiladLogo } from './MiladLogo';
import { InstallAppModal } from './InstallAppModal';

const SNOOZE_KEY = 'milad_pwa_install_banner_dismissed_until';
const SNOOZE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  useEffect(() => {
    // 1. Check if running in standalone mode (already installed as PWA)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Check if user dismissed recently
    const dismissedUntil = localStorage.getItem(SNOOZE_KEY);
    if (dismissedUntil && parseInt(dismissedUntil, 10) > Date.now()) {
      return;
    }

    // 3. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 4. Capture beforeinstallprompt (Chrome / Android / Edge / Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show banner smoothly after brief delay
      setTimeout(() => {
        setIsVisible(true);
      }, 1500);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. Handle successful install
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // 6. For iOS Safari, show the banner if not standalone and not snoozed
    if (isIosDevice && !isStandalone) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2500);
      return () => clearTimeout(timer);
    }

    // Fallback: If on Android or other mobile where beforeinstallprompt might be delayed, show banner after 3 seconds
    const fallbackTimer = setTimeout(() => {
      if (!isStandalone) {
        setIsVisible(true);
      }
    }, 3500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setIsVisible(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('Install prompt error:', err);
        setGuideModalOpen(true);
      }
    } else {
      // If prompt isn't directly available (iOS, browser restrictions), open the helpful interactive guide
      setGuideModalOpen(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Snooze for 24 hours
    localStorage.setItem(SNOOZE_KEY, (Date.now() + SNOOZE_DURATION_MS).toString());
  };

  if (!isVisible || isInstalled) return null;

  return (
    <>
      <div 
        id="pwa-install-banner"
        className="fixed z-40 left-3 right-3 sm:left-auto sm:right-5 bottom-20 sm:bottom-6 sm:max-w-md animate-in slide-in-from-bottom-5 fade-in duration-300"
      >
        <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 sm:p-4 shadow-2xl border border-cyan-500/40 ring-1 ring-white/10">
          
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            
            {/* App Icon + Information */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1 shrink-0 shadow-md flex items-center justify-center">
                <MiladLogo size="sm" showText={false} />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-sm font-bold text-white">মিলাদ ড্রিংকিং ওয়াটার</h4>
                  <span className="text-[10px] px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 font-bold rounded-md border border-cyan-500/30">
                    App
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  হোম স্ক্রিনে সেভ করুন • দ্রুত ১-ট্যাপে অর্ডার
                </p>
              </div>
            </div>

            {/* Close / Snooze Button */}
            <button
              onClick={handleDismiss}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
              aria-label="Close install banner"
              title="পরে মনে করিয়ে দিন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Row */}
          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
            
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-cyan-300">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>লাইটওয়েট ও সুরক্ষিত</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                পরে
              </button>

              <button
                onClick={handleInstallClick}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-cyan-600/30 transition-all cursor-pointer"
              >
                {isIOS ? (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>কীভাবে ইন্সটল করবেন?</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>অ্যাপ ইন্সটল করুন (Install)</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Interactive Step-by-Step Guide Modal for all OS */}
      <InstallAppModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />
    </>
  );
};
