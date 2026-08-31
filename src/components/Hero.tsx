import React from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Droplet, 
  ArrowRight, 
  PhoneCall, 
  MessageSquare,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { createWhatsAppChatUrl } from '../lib/whatsapp';
import { trackWhatsAppClick, trackPhoneCall } from '../lib/analytics';

export const Hero: React.FC = () => {
  const { setCurrentView } = useStore();
  const { language, t, formatCurrency, formatNumber } = useLanguage();

  const handleScrollToEasyOrder = () => {
    const el = document.getElementById('easy-order-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsAppQuickChat = () => {
    trackWhatsAppClick('hero_quick_chat', 'water_order');
    const msg = language === 'bn'
      ? 'আসসালামু আলাইকুম, আমি মিলাদ ড্রিংকিং ওয়াটার (মিরবক্সটুলা, সিলেট) থেকে খাবার পানি অর্ডার করতে চাই।'
      : 'Hello, I would like to place an order for Milad Drinking Water in Sylhet.';
    const url = createWhatsAppChatUrl('+8801711102448', msg);
    window.open(url, '_blank');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-slate-50 to-white pt-6 pb-12 sm:pt-14 sm:pb-20 border-b border-slate-200/80">
      
      {/* Visual Atmospheric Subtle Arc */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 bg-sky-200/20 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6 sm:space-y-8">
        
        {/* Top Trust Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sky-200 shadow-2xs text-xs font-bold text-sky-900 animate-in fade-in">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span>{t.hero.badge}</span>
        </div>

        {/* Official Headline & Pitch */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-black text-slate-900 tracking-tight leading-tight sm:leading-[1.2]">
            {t.hero.titleLine1} <br className="hidden sm:inline" />
            <span className="text-sky-700">
              {t.hero.titleLine2}
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-xl mx-auto">
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col items-center text-center transition-all hover:border-sky-300">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-1.5">
              <Droplet className="w-4 h-4 sm:w-5 sm:h-5 fill-sky-600/20" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900">{t.hero.statRefill}</span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium">{t.hero.statRefillSub}</span>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col items-center text-center transition-all hover:border-emerald-300">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1.5">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900">{t.hero.statDelivery}</span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium">{t.hero.statDeliverySub}</span>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col items-center text-center transition-all hover:border-sky-300">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-1.5">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900">{t.hero.statPayment}</span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium">{t.hero.statPaymentSub}</span>
          </div>
        </div>

        {/* Clear Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1 max-w-lg mx-auto">
          {/* Primary Quick Order Button */}
          <button
            onClick={handleScrollToEasyOrder}
            className="w-full sm:flex-1 py-3.5 sm:py-4 px-6 rounded-2xl bg-sky-700 hover:bg-sky-800 active:scale-[0.98] text-white font-extrabold text-sm sm:text-base shadow-md shadow-sky-900/15 flex items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <Droplet className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
            <span>{t.hero.btnOrder}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Quick Call Button */}
          <a
            href="tel:+8801711102448"
            onClick={() => trackPhoneCall('hero_call_button', '+8801711102448')}
            className="w-full sm:w-auto py-3.5 sm:py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t.hero.btnCall}</span>
          </a>

          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppQuickChat}
            className="w-full sm:w-auto py-3.5 sm:py-4 px-4 rounded-2xl bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            <span>{t.hero.btnWhatsApp}</span>
          </button>
        </div>

        {/* 3-Step Simple Guide */}
        <div className="pt-5 border-t border-slate-200 max-w-2xl mx-auto">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            {language === 'bn' ? 'সহজ ৩টি ধাপে পানি নেওয়ার নিয়ম' : 'How it works in 3 easy steps'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/80 text-xs shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0 text-xs">
                {formatNumber(1)}
              </span>
              <div>
                <p className="font-bold text-slate-900">{t.hero.step1Title}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">{t.hero.step1Desc}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/80 text-xs shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0 text-xs">
                {formatNumber(2)}
              </span>
              <div>
                <p className="font-bold text-slate-900">{t.hero.step2Title}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">{t.hero.step2Desc}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/80 text-xs shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                {formatNumber(3)}
              </span>
              <div>
                <p className="font-bold text-slate-900">{t.hero.step3Title}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">{t.hero.step3Desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reassurance Footer */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-600 font-medium">
          <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
          <span>{t.hero.bstiReassurance}</span>
        </div>

      </div>
    </section>
  );
};
