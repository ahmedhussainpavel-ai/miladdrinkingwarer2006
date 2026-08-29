import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  CheckCircle2, 
  Share2, 
  PlusSquare, 
  X, 
  Sparkles,
  Zap,
  Layers,
  ArrowRight,
  Tablet
} from 'lucide-react';
import { MiladLogo } from './MiladLogo';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIosDevice = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    setIsIOS(isIosDevice);

    // Detect Android
    const isAndroidDevice = /android/.test(window.navigator.userAgent.toLowerCase());
    setIsAndroid(isAndroidDevice);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Capture beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-cyan-600 via-sky-600 to-cyan-700 p-5 sm:p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-2">
            <div className="p-2 bg-white rounded-2xl shadow-lg">
              <MiladLogo size="lg" showText={false} />
            </div>
          </div>

          <h3 className="text-xl font-heading font-black">
            📱 মিলাদ ওয়াটার মোবাইল অ্যাপ (PWA / APK)
          </h3>
          <p className="text-xs text-cyan-100 mt-1 max-w-sm mx-auto font-medium">
            যেকোনো অ্যান্ড্রয়েড ফোন, আইফোন, ট্যাব বা কম্পিউটারে ১-ক্লিকে ইন্সটল করুন
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Status / 1-Click Install Action */}
          {isInstalled ? (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm text-emerald-900">অ্যাপটি আপনার ডিভাইসে ইন্সটল করা আছে!</p>
                <p className="text-xs text-emerald-700">আপনি সরাসরি আপনার হোম স্ক্রিন থেকে দ্রুত অর্ডার করতে পারেন।</p>
              </div>
            </div>
          ) : deferredPrompt ? (
            <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-200 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-cyan-900 font-extrabold text-sm sm:text-base">
                <Sparkles className="w-5 h-5 text-cyan-600 animate-bounce" />
                <span>আপনার ফোনে সরাসরি অ্যাপ ইন্সটল করতে প্রস্তুত!</span>
              </div>
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-6 rounded-2xl bg-cyan-600 hover:bg-cyan-500 active:scale-98 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>১-ক্লিকে অ্যাপ ইন্সটল করুন (Install App)</span>
              </button>
            </div>
          ) : null}

          {/* Device Specific Guidelines */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-cyan-600" />
              <span>সহজ ইন্সটলেশন নির্দেশিকা:</span>
            </h4>

            {/* Android Instruction */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Android ফোন (Chrome/Samsung/Brave)</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">APK এর মত হোম স্ক্রিনে</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ১. ব্রাউজারের উপরে বা নিচে <strong>থ্রি-ডট (⋮)</strong> মেনুতে চাপুন।<br />
                ২. <strong>"Install app"</strong> বা <strong>"Add to Home screen"</strong> (হোম স্ক্রিনে যোগ করুন) সিলেক্ট করুন।
              </p>
            </div>

            {/* iPhone / iPad Instruction */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Tablet className="w-4 h-4 text-sky-600" />
                  <span>iPhone / iPad (Safari)</span>
                </span>
                <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">iOS সাপোর্টেড</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed flex items-center flex-wrap gap-1">
                ১. নিচে <strong>Share</strong> বাটনে (<Share2 className="w-3.5 h-3.5 inline text-sky-600" />) চাপুন।<br />
                ২. স্ক্রল করে <strong>"Add to Home Screen"</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-sky-600" />) সিলেক্ট করুন।
              </p>
            </div>

            {/* PC / Desktop Instruction */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-slate-600" />
                  <span>কম্পিউটার ও ল্যাপটপ (Chrome/Edge)</span>
                </span>
                <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full font-bold">Desktop App</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ব্রাউজারের অ্যাড্রেস বারের ডান পাশে থাকা <strong>ইন্সটল আইকন (⊕)</strong> ক্লিক করে সরাসরি ডেস্কটপ অ্যাপ হিসেবে সেভ করুন।
              </p>
            </div>
          </div>

          {/* App Key Highlights */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800">অতি দ্রুত লোডিং</p>
              <p className="text-[9px] text-slate-500">মেমোরি খরচ নেই</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <Layers className="w-4 h-4 text-cyan-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800">সব স্ক্রিনে পারফেক্ট</p>
              <p className="text-[9px] text-slate-500">ফোন, ট্যাব ও পিসি</p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800">অফলাইন সাপোর্ট</p>
              <p className="text-[9px] text-slate-500">স্মার্ট ক্যাশিং</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            বুঝেছি, বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
