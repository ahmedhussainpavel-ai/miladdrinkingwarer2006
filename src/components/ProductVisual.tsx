import React from 'react';
import { Droplet, ShieldCheck, Zap, Flame, Snowflake, Sparkles } from 'lucide-react';

interface ProductVisualProps {
  productId?: string;
  type?: string;
  name?: string;
  category?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProductVisual: React.FC<ProductVisualProps> = ({ 
  productId, 
  type,
  className = '',
}) => {
  const visualKey = productId || type || 'prod-20l-jar';

  if (visualKey === 'prod-20l-jar' || visualKey === 'jar_20l') {
    return (
      <div className={`relative flex items-center justify-center select-none py-2 ${className}`}>
        <svg viewBox="0 0 200 240" className="w-full h-full max-h-48 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="jarCapGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0369a1" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="jarBodyGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.85" />
              <stop offset="25%" stopColor="#e0f2fe" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.7" />
              <stop offset="75%" stopColor="#7dd3fc" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="labelGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f0f9ff" />
            </linearGradient>
            <filter id="jarShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0c4a6e" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Jar Base Pedestal Shadow */}
          <ellipse cx="100" cy="226" rx="56" ry="7" fill="#0f172a" fillOpacity="0.08" />

          {/* Top Sanitary Dust Seal Cap */}
          <rect x="86" y="10" width="28" height="12" rx="3" fill="url(#jarCapGrad)" stroke="#0284c7" strokeWidth="1" />
          <rect x="88" y="12" width="24" height="2" rx="1" fill="#ffffff" fillOpacity="0.6" />

          {/* Neck Ring */}
          <path d="M82 22 H118 L122 34 H78 Z" fill="url(#jarCapGrad)" />
          <line x1="78" y1="34" x2="122" y2="34" stroke="#075985" strokeWidth="1.5" />

          {/* 20L Polycarbonate Main Body */}
          <rect x="46" y="34" width="108" height="182" rx="20" fill="url(#jarBodyGrad)" stroke="#38bdf8" strokeWidth="1.5" filter="url(#jarShadow)" />

          {/* Structural Ring Ribs (Reinforced Grooves) */}
          <path d="M48 64 Q100 70 152 64" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.6" fill="none" />
          <path d="M48 100 Q100 106 152 100" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.5" fill="none" />
          <path d="M48 160 Q100 166 152 160" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.5" fill="none" />
          <path d="M48 196 Q100 202 152 196" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.6" fill="none" />

          {/* Specular Cylindrical Glass Highlight */}
          <rect x="54" y="44" width="10" height="162" rx="5" fill="#ffffff" fillOpacity="0.45" />

          {/* Milad Drinking Water Official Embossed Brand Label */}
          <g transform="translate(62, 102)">
            <rect width="76" height="52" rx="8" fill="url(#labelGrad)" stroke="#bae6fd" strokeWidth="1" />
            
            {/* Water Droplet Icon in Label */}
            <circle cx="38" cy="14" r="8" fill="#e0f2fe" />
            <path d="M38 8 C38 8 33 14 33 17 C33 19.7 35.2 22 38 22 C40.8 22 43 19.7 43 17 C43 14 38 8 38 8 Z" fill="#0284c7" />

            {/* Brand Typography */}
            <text x="38" y="29" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#0c4a6e" letterSpacing="0.5">MILAD WATER</text>
            <text x="38" y="36" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#0369a1">২০ লিটার পিওর জার</text>
            
            {/* BSTI BDS Certified Stamp */}
            <rect x="14" y="40" width="48" height="8" rx="3" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="0.5" />
            <text x="38" y="46" textAnchor="middle" fontSize="4.2" fontWeight="800" fill="#047857">BSTI BDS 1414 & RO-UV</text>
          </g>
        </svg>
      </div>
    );
  }

  if (visualKey === 'prod-5l-bottle' || visualKey === 'bottle_5l') {
    return (
      <div className={`relative flex items-center justify-center select-none py-2 ${className}`}>
        <svg viewBox="0 0 180 220" className="w-full h-full max-h-48 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="b5Grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#99f6e4" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#ccfbf1" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0f766e" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="90" cy="208" rx="42" ry="6" fill="#0f172a" fillOpacity="0.08" />

          {/* Cap */}
          <rect x="76" y="16" width="28" height="12" rx="3" fill="#0f766e" />
          <rect x="80" y="28" width="20" height="8" fill="#14b8a6" />

          {/* Bottle Body */}
          <rect x="52" y="36" width="76" height="166" rx="16" fill="url(#b5Grad)" stroke="#5eead4" strokeWidth="1.5" />

          {/* Integrated Ergonomic Handle Cutout */}
          <rect x="94" y="58" width="16" height="50" rx="8" fill="#ffffff" stroke="#99f6e4" strokeWidth="1" fillOpacity="0.9" />

          {/* Specular Highlight */}
          <rect x="58" y="44" width="6" height="148" rx="3" fill="#ffffff" fillOpacity="0.5" />

          {/* Label */}
          <g transform="translate(60, 120)">
            <rect width="60" height="42" rx="6" fill="#ffffff" stroke="#99f6e4" strokeWidth="1" />
            <text x="30" y="14" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#134e4a">MILAD 5L</text>
            <text x="30" y="23" textAnchor="middle" fontSize="5" fontWeight="700" fill="#0f766e">ফ্যামিলি বোতল</text>
            <rect x="8" y="28" width="44" height="8" rx="2" fill="#f0fdfa" />
            <text x="30" y="34" textAnchor="middle" fontSize="4" fontWeight="800" fill="#0d9488">ইজি গ্রিপ হ্যান্ডেল</text>
          </g>
        </svg>
      </div>
    );
  }

  if (visualKey === 'prod-500ml-case' || visualKey === 'case_500ml') {
    return (
      <div className={`relative flex items-center justify-center select-none py-2 ${className}`}>
        <svg viewBox="0 0 200 200" className="w-full h-full max-h-48 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Box Shadow */}
          <ellipse cx="100" cy="180" rx="64" ry="8" fill="#0f172a" fillOpacity="0.08" />

          {/* Heavy Duty Mineral Water Case Box */}
          <rect x="36" y="50" width="128" height="120" rx="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <path d="M36 85 H164" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* Row of 500ml Mini Bottles peaking through translucent pack */}
          {[52, 74, 96, 118, 140].map((cx, i) => (
            <g key={i}>
              <rect x={cx - 5} y="32" width="10" height="6" rx="2" fill="#0284c7" />
              <rect x={cx - 7} y="38" width="14" height="42" rx="4" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1" fillOpacity="0.9" />
              <rect x={cx - 6} y="54" width="12" height="12" rx="1" fill="#ffffff" />
            </g>
          ))}

          {/* Box Brand Label */}
          <g transform="translate(48, 100)">
            <rect width="104" height="56" rx="8" fill="#ffffff" stroke="#93c5fd" strokeWidth="1" />
            <text x="52" y="16" textAnchor="middle" fontSize="8" fontWeight="900" fill="#0c4a6e">MILAD 500ml CASE</text>
            <text x="52" y="27" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#0284c7">২৪ পিস বোতল কেস (Case of 24)</text>
            <rect x="14" y="34" width="76" height="14" rx="4" fill="#eff6ff" />
            <text x="52" y="44" textAnchor="middle" fontSize="5" fontWeight="800" fill="#1d4ed8">ইভেন্ট, বিয়ে ও কনফারেন্স স্পেশাল</text>
          </g>
        </svg>
      </div>
    );
  }

  if (visualKey === 'prod-electric-pump' || visualKey === 'pump_electric') {
    return (
      <div className={`relative flex items-center justify-center select-none py-2 ${className}`}>
        <svg viewBox="0 0 180 220" className="w-full h-full max-h-48 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="90" cy="204" rx="36" ry="6" fill="#0f172a" fillOpacity="0.08" />

          {/* Matte Dark Pump Cylindrical Body */}
          <rect x="66" y="50" width="48" height="140" rx="18" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />

          {/* Metallic Stainless Steel Curved Spout */}
          <path d="M66 85 H36 C30 85 26 90 26 96 V115" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
          <circle cx="26" cy="116" r="2.5" fill="#38bdf8" />

          {/* LED Touch Power Sensor Button */}
          <circle cx="90" cy="80" r="12" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <path d="M90 73 V81" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          <path d="M84 76 A7 7 0 1 0 96 76" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* USB-C Label */}
          <g transform="translate(72, 140)">
            <rect width="36" height="24" rx="4" fill="#1e293b" />
            <text x="18" y="10" textAnchor="middle" fontSize="4.5" fontWeight="900" fill="#ffffff">USB-C PUMP</text>
            <text x="18" y="18" textAnchor="middle" fontSize="3.8" fontWeight="700" fill="#38bdf8">ওয়ান-টাচ</text>
          </g>
        </svg>
      </div>
    );
  }

  if (visualKey === 'prod-ceramic-dispenser' || visualKey === 'dispenser_ceramic') {
    return (
      <div className={`relative flex items-center justify-center select-none py-2 ${className}`}>
        <svg viewBox="0 0 180 220" className="w-full h-full max-h-48 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="90" cy="208" rx="46" ry="6" fill="#0f172a" fillOpacity="0.08" />

          {/* Wooden Tripod Legs */}
          <line x1="58" y1="130" x2="42" y2="204" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
          <line x1="90" y1="130" x2="90" y2="204" stroke="#92400e" strokeWidth="5" strokeLinecap="round" />
          <line x1="122" y1="130" x2="138" y2="204" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />

          {/* Handcrafted Terracotta Clay Pot */}
          <ellipse cx="90" cy="100" rx="48" ry="42" fill="#b45309" stroke="#92400e" strokeWidth="2" />
          <ellipse cx="90" cy="62" rx="34" ry="8" fill="#d97706" />

          {/* Brass Chrome Tap */}
          <rect x="134" y="108" width="16" height="6" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
          <circle cx="146" cy="104" r="3" fill="#b45309" />

          {/* Label */}
          <rect x="66" y="88" width="48" height="24" rx="4" fill="#78350f" fillOpacity="0.8" />
          <text x="90" y="99" textAnchor="middle" fontSize="5" fontWeight="900" fill="#fef3c7">মাটির পট</text>
          <text x="90" y="107" textAnchor="middle" fontSize="4" fontWeight="700" fill="#fde68a">প্রাকৃতিক শীতল পানি</text>
        </svg>
      </div>
    );
  }

  // Hot & Cold Commercial Dispenser
  return (
    <div className={`relative flex items-center justify-center select-none py-2 ${className}`}>
      <svg viewBox="0 0 180 230" className="w-full h-full max-h-48 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="90" cy="216" rx="44" ry="6" fill="#0f172a" fillOpacity="0.08" />

        {/* Freestanding Cooler Cabinet */}
        <rect x="52" y="30" width="76" height="180" rx="12" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />

        {/* Top Jar Receiving Collar */}
        <rect x="74" y="20" width="32" height="12" rx="4" fill="#94a3b8" />

        {/* Dispensing Niche */}
        <rect x="60" y="52" width="60" height="48" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />

        {/* Hot Tap (Red) & Cold Tap (Blue) */}
        <circle cx="76" cy="68" r="6" fill="#ef4444" />
        <rect x="74" y="74" width="4" height="8" rx="2" fill="#94a3b8" />

        <circle cx="104" cy="68" r="6" fill="#0284c7" />
        <rect x="102" y="74" width="4" height="8" rx="2" fill="#94a3b8" />

        {/* Indicator LEDs & Storage Door */}
        <rect x="60" y="112" width="60" height="86" rx="6" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
        <text x="90" y="148" textAnchor="middle" fontSize="5.5" fontWeight="900" fill="#334155">HOT & COLD</text>
        <text x="90" y="158" textAnchor="middle" fontSize="4.5" fontWeight="700" fill="#64748b">হেভি ডিউটি কম্প্রেসার</text>
      </svg>
    </div>
  );
};

