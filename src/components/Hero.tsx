import React from 'react';
import { useStore } from '../context/StoreContext';
import { MiladLogo } from './MiladLogo';
import { 
  Droplet, 
  ArrowRight, 
  CheckCircle2, 
  PhoneCall, 
  MapPin, 
  MessageSquare,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Check
} from 'lucide-react';
import { createWhatsAppChatUrl } from '../lib/whatsapp';
import { trackWhatsAppClick, trackPhoneCall } from '../lib/analytics';

export const Hero: React.FC = () => {
  const { setCurrentView } = useStore();

  const handleScrollToEasyOrder = () => {
    const el = document.getElementById('easy-order-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsAppQuickChat = () => {
    trackWhatsAppClick('hero_quick_chat', 'water_order');
    const url = createWhatsAppChatUrl(
      '+8801711102448',
      'আসসালামু আলাইকুম, আমি মিলাদ ড্রিংকিং ওয়াটার (মিরবক্সটুলা, সিলেট) থেকে খাবার পানি অর্ডার করতে চাই।'
    );
    window.open(url, '_blank');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/60 via-cyan-50/25 to-white pt-5 pb-10 sm:pt-12 sm:pb-16 border-b border-slate-100">
      {/* Background Soft Atmospheric Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 sm:h-96 bg-gradient-to-b from-cyan-400/15 via-sky-300/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-5 sm:space-y-7">
        
        {/* Top Trust Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/90 border border-cyan-200/80 shadow-xs text-[11px] sm:text-xs font-semibold text-cyan-900 animate-in fade-in">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span>সিলেট শহরের নিজস্ব ফ্যাক্টরি • মিরবক্সটুলা</span>
        </div>

        {/* Official Headline & Pitch */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-black text-slate-900 tracking-tight leading-snug sm:leading-[1.2]">
            বিশুদ্ধ খাবার পানি সরাসরি <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 via-teal-700 to-sky-700">
              আপনার বাসা ও অফিসে
            </span>
          </h1>
          <p className="text-xs sm:text-base text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
            মিরবক্সটুলা কারখানা থেকে ২০ লিটার রিফিল জার মাত্র <strong className="text-slate-900 font-bold">৳৮০</strong>। কোনো অগ্রিম টাকা ছাড়াই ক্যাশ অন ডেলিভারিতে দ্রুত পৌঁছে যাবে।
          </p>
        </div>

        {/* 3 Simple Badges (Mobile Friendly Grid) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-xl mx-auto">
          <div className="bg-white p-2.5 sm:p-4 rounded-2xl border border-cyan-100/80 shadow-xs flex flex-col items-center text-center transition-all hover:border-cyan-200 hover:shadow-sm">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-1">
              <Droplet className="w-4 h-4 sm:w-5 sm:h-5 fill-cyan-600/20" />
            </div>
            <span className="text-[11px] sm:text-sm font-extrabold text-slate-900">৳৮০ রিফিল</span>
            <span className="text-[9px] sm:text-xs text-slate-500 font-medium">২০ লিটার জার</span>
          </div>

          <div className="bg-white p-2.5 sm:p-4 rounded-2xl border border-emerald-100/80 shadow-xs flex flex-col items-center text-center transition-all hover:border-emerald-200 hover:shadow-sm">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[11px] sm:text-sm font-extrabold text-slate-900">ফ্রি ডেলিভারি</span>
            <span className="text-[9px] sm:text-xs text-slate-500 font-medium">সিলেট শহর জুড়ে</span>
          </div>

          <div className="bg-white p-2.5 sm:p-4 rounded-2xl border border-sky-100/80 shadow-xs flex flex-col items-center text-center transition-all hover:border-sky-200 hover:shadow-sm">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-1">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[11px] sm:text-sm font-extrabold text-slate-900">ক্যাশ ডেলিভারি</span>
            <span className="text-[9px] sm:text-xs text-slate-500 font-medium">পানি পেয়ে টাকা</span>
          </div>
        </div>

        {/* Big Action Buttons - Super Clear For Everyone */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-1 sm:pt-2 max-w-lg mx-auto">
          {/* Primary Quick Order Button */}
          <button
            onClick={handleScrollToEasyOrder}
            className="w-full sm:flex-1 py-3.5 sm:py-4 px-5 sm:px-6 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 active:scale-[0.98] text-white font-extrabold text-sm sm:text-base shadow-md shadow-cyan-700/25 hover:shadow-cyan-700/40 flex items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <Droplet className="w-4 h-4 sm:w-5 sm:h-5 fill-white animate-bounce" />
            <span>সহজে পানি অর্ডার করুন</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Quick Call Button */}
          <a
            href="tel:+8801711102448"
            onClick={() => trackPhoneCall('hero_call_button', '+8801711102448')}
            className="w-full sm:w-auto py-3.5 sm:py-4 px-4 sm:px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs sm:text-base shadow-sm shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>০১৭১১-১০২৪৪৮</span>
          </a>

          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppQuickChat}
            className="w-full sm:w-auto py-3.5 sm:py-4 px-4 rounded-2xl bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            <span>হোয়াটসঅ্যাপ</span>
          </button>
        </div>

        {/* 3-Step Simple Guide for Non-Tech Users */}
        <div className="pt-4 border-t border-slate-200/60 max-w-2xl mx-auto">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            সহজ ৩টি ধাপে পানি নেওয়ার নিয়ম
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-slate-200/60 text-xs">
              <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center shrink-0 text-[11px]">১</span>
              <span className="text-slate-700 font-medium">কয় জার পানি লাগবে বাছুন</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-slate-200/60 text-xs">
              <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center shrink-0 text-[11px]">২</span>
              <span className="text-slate-700 font-medium">নাম ও বাসার ঠিকানা দিন</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-slate-200/60 text-xs">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">৩</span>
              <span className="text-slate-700 font-medium">পানি পেয়ে টাকা দিন</span>
            </div>
          </div>
        </div>

        {/* Reassurance Footer */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-cyan-600 shrink-0" />
          <span>বিএসটিআই মানসম্মত ৭-ধাপ বিশিষ্ট RO + UV পিউরিফাইড মিষ্টি খাবার পানি</span>
        </div>

      </div>
    </section>
  );
};

