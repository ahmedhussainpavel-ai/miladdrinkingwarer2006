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
  RotateCcw
} from 'lucide-react';
import { createWhatsAppChatUrl } from '../lib/whatsapp';

export const Hero: React.FC = () => {
  const { setCurrentView } = useStore();

  const handleScrollToEasyOrder = () => {
    const el = document.getElementById('easy-order-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsAppQuickChat = () => {
    const url = createWhatsAppChatUrl(
      '+8801711102448',
      'আসসালামু আলাইকুম, আমি মিলাদ ড্রিংকিং ওয়াটার (মিরবক্সটুলা, সিলেট) থেকে খাবার পানি অর্ডার করতে চাই।'
    );
    window.open(url, '_blank');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-cyan-50/40 to-white pt-6 pb-10 sm:py-12 border-b border-slate-100">
      {/* Background Soft Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-cyan-400/10 via-sky-300/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
        
        {/* Official Logo */}
        <div className="flex flex-col items-center justify-center pt-2">
          <div className="relative group cursor-pointer" onClick={handleScrollToEasyOrder}>
            <div className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <MiladLogo size="2xl" showText={false} className="w-full h-full justify-center" />
            </div>
            <span className="mt-1 inline-block bg-cyan-700 text-white text-[10px] sm:text-xs font-bold px-3 py-0.5 rounded-full shadow-xs whitespace-nowrap">
              মিরবক্সটুলা, সিলেট
            </span>
          </div>

          <div className="mt-4">
            <h1 className="text-2xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight leading-tight">
              মিলাদ ড্রিংকিং ওয়াটার
            </h1>
            <p className="text-xs sm:text-sm font-bold text-cyan-800 tracking-wider uppercase mt-0.5">
              MILAD DRINKING WATER • 100% PURE MINERAL WATER
            </p>
          </div>
        </div>

        {/* Short & Sweet Pitch */}
        <div className="max-w-xl mx-auto space-y-2">
          <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
            সিলেট শহরের বাসা, অফিস ও দোকানে ১০০% বিশুদ্ধ ও মিষ্টি মিনারেল পানির দ্রুত ডেলিভারি। <br className="hidden sm:inline" />
            <strong className="text-cyan-900 font-bold">২০ লিটার রিফিল জার মাত্র ৳৮০</strong> (খালি জার থাকলে জামানত ছাড়াই বদল)।
          </p>
        </div>

        {/* 3 Simple Badges (Mobile Friendly Grid) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-lg mx-auto">
          <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-cyan-100 shadow-xs flex flex-col items-center text-center">
            <Droplet className="w-5 h-5 text-cyan-600 mb-1" />
            <span className="text-[11px] sm:text-xs font-extrabold text-slate-900">৳৮০ রিফিল জার</span>
            <span className="text-[9px] sm:text-[10px] text-slate-500">20L Mineral Jar</span>
          </div>

          <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-cyan-100 shadow-xs flex flex-col items-center text-center">
            <Truck className="w-5 h-5 text-emerald-600 mb-1" />
            <span className="text-[11px] sm:text-xs font-extrabold text-slate-900">ফ্রি ডেলিভারি</span>
            <span className="text-[9px] sm:text-[10px] text-slate-500">সিলেট শহর জুড়ে</span>
          </div>

          <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-cyan-100 shadow-xs flex flex-col items-center text-center">
            <RotateCcw className="w-5 h-5 text-indigo-600 mb-1" />
            <span className="text-[11px] sm:text-xs font-extrabold text-slate-900">ক্যাশ অন ডেলিভারি</span>
            <span className="text-[9px] sm:text-[10px] text-slate-500">হাতে পেয়ে টাকা</span>
          </div>
        </div>

        {/* Mobile-First Big Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
          {/* Primary Order Button */}
          <button
            onClick={handleScrollToEasyOrder}
            className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-cyan-600 hover:bg-cyan-500 active:scale-98 text-white font-black text-sm sm:text-base shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Droplet className="w-5 h-5 fill-white" />
            <span>💧 সহজে পানি অর্ডার করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Call Button */}
          <a
            href="tel:+8801711102448"
            className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-extrabold text-sm sm:text-base shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>01711-102448 (সরাসরি কল)</span>
          </a>

          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppQuickChat}
            className="w-full sm:w-auto py-3.5 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            <span>হোয়াটসঅ্যাপ</span>
          </button>
        </div>

        {/* Quality note */}
        <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 pt-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
            ৭-ধাপ বিশিষ্ট RO + UV ওজোন প্রযুক্তি
          </span>
          <span>•</span>
          <span>টিডিএস &lt; ৩৫ PPM</span>
        </div>

      </div>
    </section>
  );
};
