import React, { useState } from 'react';
import { 
  WifiOff, 
  Wifi, 
  RefreshCw, 
  CheckCircle2, 
  Package, 
  X, 
  ShieldCheck, 
  Zap,
  Info
} from 'lucide-react';
import { useNetworkStatus } from '../lib/useNetworkStatus';
import { useLanguage } from '../context/LanguageContext';

export const OfflineNoticeBanner: React.FC = () => {
  const { isOnline, isOffline, wasOffline, checkConnection, cachedProductCount } = useNetworkStatus();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [isRetrying, setIsRetrying] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [retryFeedback, setRetryFeedback] = useState<string | null>(null);

  const handleManualRetry = async () => {
    setIsRetrying(true);
    setRetryFeedback(null);
    try {
      const online = await checkConnection();
      if (online) {
        setRetryFeedback(isBn ? 'সংযোগ পুনরুদ্ধার হয়েছে!' : 'Connection restored!');
      } else {
        setRetryFeedback(isBn ? 'এখনও সংযোগ পাওয়া যায়নি। অফলাইন ক্যাটালগ সক্রিয় আছে।' : 'Still offline. Offline catalog remains active.');
      }
    } catch {
      setRetryFeedback(isBn ? 'সংযোগ পরীক্ষা ব্যর্থ হয়েছে।' : 'Connection test failed.');
    } finally {
      setIsRetrying(false);
      setTimeout(() => setRetryFeedback(null), 4000);
    }
  };

  // 1. Reconnected Notification Toast (when user was offline and comes back online)
  if (isOnline && wasOffline) {
    return (
      <aside 
        aria-label={isBn ? 'ইন্টারনেট পুনঃসংযোগ বিজ্ঞপ্তি' : 'Internet connection restored notification'}
        className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-3 fade-in duration-300 max-w-sm"
      >
        <div className="bg-emerald-900/95 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-500/40 backdrop-blur-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/30 flex items-center justify-center shrink-0">
              <Wifi className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-100">
                {isBn ? 'ইন্টারনেট সংযোগ পুনরুদ্ধার হয়েছে' : 'You are back online'}
              </p>
              <p className="text-[11px] text-emerald-300/90">
                {isBn ? 'লাইভ অর্ডার ও সাবস্ক্রিপশন সুবিধা সক্রিয়।' : 'Live ordering and syncing are active.'}
              </p>
            </div>
          </div>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        </div>
      </aside>
    );
  }

  // 2. Offline Notice Banner
  if (!isOffline || isDismissed) {
    return null;
  }

  return (
    <aside 
      aria-label={isBn ? 'অফলাইন মোড বিজ্ঞপ্তি' : 'Offline mode notice'}
      className="sticky top-16 z-30 w-full bg-gradient-to-r from-amber-600 via-amber-700 to-sky-800 text-white shadow-md border-b border-amber-400/30"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          
          {/* Main Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0 shadow-xs border border-white/20">
              <WifiOff className="w-4 h-4 text-amber-200 animate-pulse" />
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-xs sm:text-sm text-white">
                  {isBn ? 'অফলাইন মোড সক্রিয় (Offline Mode)' : 'Offline Mode Active'}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-amber-100 border border-white/20">
                  <Package className="w-3 h-3 text-cyan-200" />
                  <span>{isBn ? `${cachedProductCount || 6}টি পণ্য ক্যাশড` : `${cachedProductCount || 6} Products Cached`}</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-100/90 truncate sm:whitespace-normal">
                {isBn 
                  ? 'ইন্টারনেট ছাড়াই সকল পানির জার, বোতল ও ডিসপেনসার ক্যাটালগ দ্রুত ব্রাউজ করতে পারবেন।'
                  : 'Product catalog is cached. You can browse water jars, bottles, and dispensers seamlessly offline.'}
              </p>
            </div>
          </div>

          {/* Action & Feedback */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            {retryFeedback && (
              <span className="text-[11px] font-bold text-amber-200 animate-fade-in truncate max-w-[180px] sm:max-w-xs">
                {retryFeedback}
              </span>
            )}

            <button
              onClick={handleManualRetry}
              disabled={isRetrying}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-amber-50 active:scale-95 text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-75"
              title={isBn ? 'সংযোগ আবার পরীক্ষা করুন' : 'Test network connection'}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-700 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isBn ? (isRetrying ? 'যাচাই হচ্ছে...' : 'পুনরায় চেষ্টা') : (isRetrying ? 'Testing...' : 'Retry')}</span>
            </button>

            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Dismiss offline banner"
              title={isBn ? 'লুকান' : 'Dismiss'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </aside>
  );
};
