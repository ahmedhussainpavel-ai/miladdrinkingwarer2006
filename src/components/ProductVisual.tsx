import React from 'react';
import { Droplet, Sparkles, Zap, Flame, Snowflake, ShieldCheck } from 'lucide-react';
import { MiladLogo } from './MiladLogo';

interface ProductVisualProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProductVisual: React.FC<ProductVisualProps> = ({ 
  productId, 
  className = '',
  size = 'md' 
}) => {
  // Render specific clean vector graphic based on product
  switch (productId) {
    case 'prod-20l-jar':
      return (
        <div className={`relative flex items-center justify-center select-none ${className}`}>
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-sky-400/10 to-transparent rounded-full blur-xl transform scale-90" />
          
          {/* 20L Water Jar Vector Illustration */}
          <div className="relative flex flex-col items-center">
            {/* Top Cap & Neck */}
            <div className="w-10 h-3 bg-cyan-700 rounded-t-md shadow-xs flex items-center justify-center border-b border-cyan-800">
              <div className="w-8 h-1 bg-cyan-400/60 rounded-full" />
            </div>
            <div className="w-14 h-4 bg-cyan-600/90 rounded-t-lg border-x-2 border-cyan-500/40" />

            {/* Jar Shoulder & Handle */}
            <div className="relative w-36 h-48 bg-gradient-to-b from-cyan-400/80 via-sky-500/75 to-cyan-600/90 rounded-3xl border-2 border-cyan-300/80 shadow-2xl overflow-hidden backdrop-blur-xs flex flex-col items-center justify-between p-3">
              {/* Internal Ribs / Grooves */}
              <div className="absolute inset-x-3 top-6 h-0.5 bg-white/40 rounded-full" />
              <div className="absolute inset-x-3 top-14 h-0.5 bg-white/40 rounded-full" />
              <div className="absolute inset-x-3 top-22 h-0.5 bg-white/40 rounded-full" />
              <div className="absolute inset-x-3 bottom-10 h-0.5 bg-white/40 rounded-full" />
              
              {/* Glass Reflection Highlight */}
              <div className="absolute left-2.5 inset-y-3 w-3 bg-gradient-to-r from-white/60 to-transparent rounded-full blur-[1px]" />
              
              {/* Official Brand Label on Bottle */}
              <div className="relative z-10 my-auto bg-white/95 rounded-2xl p-2.5 shadow-lg border border-cyan-200 text-center w-full max-w-[110px] transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-cyan-600 fill-cyan-500" />
                  <span className="text-[10px] font-black text-cyan-950 tracking-tight">MILAD</span>
                </div>
                <div className="text-[7.5px] font-extrabold text-cyan-800 tracking-wider uppercase mt-0.5">
                  PURE MINERAL
                </div>
                <div className="text-[9px] font-black text-slate-800 mt-0.5">
                  ২০ লিটার জার
                </div>
                <div className="mt-1 pt-1 border-t border-cyan-100 flex items-center justify-center gap-1 text-[7px] font-bold text-emerald-700">
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                  <span>BSTI & RO-UV</span>
                </div>
              </div>

              {/* Water Level Shimmer */}
              <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-cyan-700/50 to-transparent flex items-center justify-center">
                <div className="w-16 h-1 bg-cyan-200/50 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Jar Base */}
            <div className="w-32 h-2.5 bg-cyan-800/80 rounded-b-xl shadow-md border-t border-cyan-600/50" />
          </div>
        </div>
      );

    case 'prod-5l-bottle':
      return (
        <div className={`relative flex items-center justify-center select-none ${className}`}>
          <div className="relative flex flex-col items-center">
            {/* Cap */}
            <div className="w-8 h-3 bg-teal-700 rounded-t-sm shadow-xs" />
            <div className="w-10 h-3 bg-teal-600 rounded-t-md" />

            {/* 5L Body with Handle */}
            <div className="relative w-28 h-40 bg-gradient-to-b from-teal-400/80 via-cyan-500/75 to-teal-600/90 rounded-2xl border-2 border-teal-300/80 shadow-xl overflow-hidden flex flex-col items-center justify-center p-2.5">
              {/* Handle Hole */}
              <div className="absolute right-2 top-4 w-5 h-12 bg-white/20 rounded-full border border-white/40" />
              
              {/* Reflection */}
              <div className="absolute left-2 inset-y-2 w-2 bg-white/50 rounded-full blur-[1px]" />
              
              {/* Label */}
              <div className="relative z-10 bg-white/95 rounded-xl p-2 shadow-md border border-teal-200 text-center w-full max-w-[85px]">
                <div className="text-[9px] font-black text-teal-950">MILAD 5L</div>
                <div className="text-[8px] font-bold text-slate-700 mt-0.5">ফ্যামিলি বোতল</div>
                <div className="text-[6.5px] text-teal-700 font-bold mt-0.5">ইজি গ্রিপ হ্যান্ডেল</div>
              </div>
            </div>

            {/* Base */}
            <div className="w-26 h-2 bg-teal-800 rounded-b-lg shadow-sm" />
          </div>
        </div>
      );

    case 'prod-500ml-case':
      return (
        <div className={`relative flex items-center justify-center select-none ${className}`}>
          {/* 500ml 24 Pcs Case Box Representation */}
          <div className="relative w-44 h-36 bg-gradient-to-br from-slate-100 via-cyan-50 to-slate-200 rounded-2xl border-2 border-cyan-300/90 shadow-xl p-3 flex flex-col justify-between">
            {/* Bottles Grid Header */}
            <div className="flex items-center justify-between border-b border-cyan-200/80 pb-1.5">
              <span className="text-[10px] font-black text-cyan-900">২৪ পিস কেস (Case of 24)</span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-600 text-white text-[8px] font-black">500ml x 24</span>
            </div>

            {/* 6 Mini Bottles Preview in Row */}
            <div className="flex items-center justify-center gap-1.5 py-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-2 h-1 bg-cyan-700 rounded-t-xs" />
                  <div className="w-4 h-12 bg-gradient-to-b from-cyan-300 to-cyan-500 rounded-md border border-cyan-200/70 shadow-xs flex items-center justify-center">
                    <div className="w-2.5 h-3 bg-white/90 rounded-[2px]" />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Tag */}
            <div className="bg-cyan-600/10 rounded-lg p-1 text-center">
              <span className="text-[9px] font-bold text-cyan-900">ইভেন্ট ও কনফারেন্স স্পেশাল প্যাক</span>
            </div>
          </div>
        </div>
      );

    case 'prod-electric-pump':
      return (
        <div className={`relative flex items-center justify-center select-none ${className}`}>
          <div className="relative flex flex-col items-center">
            {/* Spout & Body of Electric Pump */}
            <div className="relative w-24 h-32 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 rounded-3xl border-2 border-slate-700 shadow-2xl p-2.5 flex flex-col items-center justify-between">
              
              {/* Spout Tube */}
              <div className="absolute -left-6 top-6 w-8 h-3 bg-slate-300 rounded-l-full border border-slate-400 shadow-md flex items-center">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full ml-1" />
              </div>

              {/* LED Power Ring */}
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/40">
                <Zap className="w-4 h-4 text-cyan-300" />
              </div>

              {/* Status Info */}
              <div className="text-center">
                <div className="text-[9px] font-black text-white">USB-C PUMP</div>
                <div className="text-[7.5px] font-bold text-cyan-400 mt-0.5">ওয়ান-টাচ ডিসপেন্সার</div>
              </div>

              {/* Base Mount Ring */}
              <div className="w-16 h-2 bg-slate-700 rounded-full" />
            </div>
          </div>
        </div>
      );

    case 'prod-ceramic-dispenser':
      return (
        <div className={`relative flex items-center justify-center select-none ${className}`}>
          <div className="relative flex flex-col items-center">
            {/* Clay Pot */}
            <div className="w-32 h-28 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-full border-2 border-amber-600/80 shadow-xl flex flex-col items-center justify-center p-2 relative overflow-hidden">
              <div className="absolute inset-x-2 top-4 h-1 bg-amber-500/30 rounded-full" />
              
              {/* Brass Tap */}
              <div className="absolute -right-3 bottom-6 w-5 h-3 bg-amber-400 rounded-r-md border border-amber-300 shadow-sm" />

              <div className="text-center bg-amber-950/60 backdrop-blur-xs rounded-xl p-1.5 border border-amber-600/40">
                <span className="text-[9px] font-black text-amber-200 block">মাটির সিরামিক পট</span>
                <span className="text-[7.5px] text-amber-300 block">প্রাকৃতিক ঠাণ্ডা পানি</span>
              </div>
            </div>

            {/* Wooden Tripod Stand */}
            <div className="w-28 flex justify-between px-2 -mt-2">
              <div className="w-3 h-14 bg-amber-950 rounded-b-md shadow-md transform -rotate-12 origin-top" />
              <div className="w-3 h-14 bg-amber-900 rounded-b-md shadow-md" />
              <div className="w-3 h-14 bg-amber-950 rounded-b-md shadow-md transform rotate-12 origin-top" />
            </div>
          </div>
        </div>
      );

    case 'prod-hot-cold-dispenser':
      return (
        <div className={`relative flex items-center justify-center select-none ${className}`}>
          <div className="w-32 h-44 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 rounded-2xl border-2 border-slate-300 shadow-2xl p-2.5 flex flex-col justify-between">
            {/* Top Bottle Inverted Port */}
            <div className="w-12 h-3 bg-slate-400 rounded-t-lg mx-auto shadow-inner" />

            {/* Faucets (Hot & Cold) */}
            <div className="bg-white rounded-xl p-2 border border-slate-200 shadow-sm flex items-center justify-around">
              {/* Hot Tap */}
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
                  <Flame className="w-2.5 h-2.5" />
                </div>
                <span className="text-[7px] font-black text-rose-700 mt-0.5">গরম ৯০°</span>
              </div>

              {/* Cold Tap */}
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-xs">
                  <Snowflake className="w-2.5 h-2.5" />
                </div>
                <span className="text-[7px] font-black text-cyan-700 mt-0.5">ঠাণ্ডা ৫°</span>
              </div>
            </div>

            {/* Storage Cabinet Door */}
            <div className="bg-slate-50 rounded-xl p-2 border border-slate-200 text-center">
              <span className="text-[8px] font-black text-slate-800 block">কমার্শিয়াল ডিসপেনসার</span>
              <span className="text-[7px] text-slate-500 block">হেভি ডিউটি কম্প্রেসার</span>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className={`relative flex items-center justify-center select-none ${className}`}>
          <div className="w-24 h-32 bg-cyan-500/20 rounded-2xl border border-cyan-400 flex items-center justify-center">
            <Droplet className="w-8 h-8 text-cyan-600" />
          </div>
        </div>
      );
  }
};
