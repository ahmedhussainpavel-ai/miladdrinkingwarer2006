import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Calculator, 
  Users, 
  Droplets, 
  PiggyBank, 
  Leaf, 
  Check, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  Building2,
  Home
} from 'lucide-react';
import { trackCalculatorUse } from '../lib/analytics';

export const PricingCalculator: React.FC = () => {
  const { setCurrentView } = useStore();

  const [usageType, setUsageType] = useState<'home' | 'office'>('home');
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [cookingIncluded, setCookingIncluded] = useState<boolean>(true);
  const [selectedJarType, setSelectedJarType] = useState<'20L' | '5L'>('20L');

  // Math Calculations
  // Home consumption: drinking (2L/person/day) + cooking (1.5L/person/day if enabled) = 3.5L or 2L
  // Office consumption: drinking (1.5L/person/day) for 22 working days
  const dailyLitersPerPerson = usageType === 'home' 
    ? (cookingIncluded ? 3.5 : 2.0)
    : 1.5;

  const daysInMonth = usageType === 'home' ? 30 : 22;
  const totalMonthlyLiters = Math.round(peopleCount * dailyLitersPerPerson * daysInMonth);

  const bottleVolume = selectedJarType === '20L' ? 20 : 5;
  const totalBottlesPerMonth = Math.ceil(totalMonthlyLiters / bottleVolume);
  const weeklyBottles = Math.ceil(totalBottlesPerMonth / 4);

  // Price calculation: 20L = 80 BDT, 5L = 35 BDT
  const unitPrice = selectedJarType === '20L' ? 80 : 35;
  const miladMonthlyCost = totalBottlesPerMonth * unitPrice;

  // Comparison: Single-use retail bottles cost ~20 BDT per Liter (e.g. 30 BDT for 1.5L)
  const retailBottlesCost = Math.round(totalMonthlyLiters * 18);
  const monthlySavings = Math.max(0, retailBottlesCost - miladMonthlyCost);
  const savingsPercent = Math.round((monthlySavings / retailBottlesCost) * 100);

  // Plastic saved (equivalent in 500ml disposable bottles)
  const plasticBottlesSaved = Math.round(totalMonthlyLiters / 0.5);

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-100 text-cyan-900 text-xs font-bold mb-3 border border-cyan-200">
            <Calculator className="w-4 h-4 text-cyan-700" />
            <span>পানি খরচ ও সাশ্রয় ক্যালকুলেটর</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            আপনার পরিবার বা প্রতিষ্ঠানের জন্য কতটুকু পানি প্রয়োজন?
          </h2>
          <p className="text-slate-600 text-xs sm:text-base mt-2.5 max-w-2xl mx-auto leading-relaxed">
            দৈনিক প্রয়োজনীয় পানির পরিমাণ নির্ধারণ করুন এবং দেখুন সাধারণ বোতলজাত পানির তুলনায় মিলাদ ওয়াটার রিফিলে প্রতি মাসে কত টাকা ও পরিবেশ সাশ্রয় হয়।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Controls Panel */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/90 space-y-6">
            
            {/* Setting: Usage Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                ১. ব্যবহারের স্থান নির্বাচন করুন
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUsageType('home')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    usageType === 'home'
                      ? 'border-cyan-600 bg-cyan-50 text-cyan-950 font-bold ring-2 ring-cyan-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${usageType === 'home' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold">বাসা ও পরিবার</p>
                    <p className="text-[11px] text-slate-500">বাসা-বাড়ি ও ফ্ল্যাট</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setUsageType('office')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    usageType === 'office'
                      ? 'border-cyan-600 bg-cyan-50 text-cyan-950 font-bold ring-2 ring-cyan-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${usageType === 'office' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold">অফিস ও প্রতিষ্ঠান</p>
                    <p className="text-[11px] text-slate-500">দোকান, শোরুম ও অফিস</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Slider: Number of People */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-cyan-600" />
                  <span>২. পরিবারের সদস্য অথবা কর্মকর্তা সংখ্যা</span>
                </label>
                <span className="px-3 py-1 bg-cyan-100 text-cyan-950 font-extrabold text-sm rounded-full">
                  {peopleCount} জন
                </span>
              </div>
              <input
                type="range"
                min="1"
                max={usageType === 'home' ? 15 : 60}
                value={peopleCount}
                onChange={(e) => setPeopleCount(parseInt(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 font-medium">
                <span>১ জন</span>
                <span>{usageType === 'home' ? '৭ জন' : '৩০ জন'}</span>
                <span>{usageType === 'home' ? '১৫ জন' : '৬০+ জন'}</span>
              </div>
            </div>

            {/* Jar Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                ৩. পছন্দের বোতল সাইজ
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedJarType('20L')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    selectedJarType === '20L'
                      ? 'border-cyan-600 bg-cyan-50 text-cyan-950 ring-2 ring-cyan-500/20 shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                    20L
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">২০ লিটার রিফিল জার</p>
                    <p className="text-[11px] text-cyan-800 font-bold">৳৮০ / জার (সর্বাধিক সাশ্রয়ী)</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedJarType('5L')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    selectedJarType === '5L'
                      ? 'border-cyan-600 bg-cyan-50 text-cyan-950 ring-2 ring-cyan-500/20 shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                    5L
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">৫ লিটার হ্যান্ডেল বোতল</p>
                    <p className="text-[11px] text-teal-800 font-bold">৳৩৫ / বোতল (সহজে বহনযোগ্য)</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Toggle: Cooking & Tea */}
            {usageType === 'home' && (
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <p className="text-xs font-extrabold text-slate-800">রান্না ও চা-কফির জন্য বিশুদ্ধ পানি?</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">স্বাস্থ্যকর খাবারের জন্য সুপারিশকৃত (দৈনিক জনপ্রতি +১.৫ লিটার)</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCookingIncluded(!cookingIncluded)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    cookingIncluded ? 'bg-cyan-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      cookingIncluded ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )}

          </div>

          {/* Results & Recommendation Card */}
          <div className="lg:col-span-6 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
            
            {/* Subtle Gradient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                    প্রস্তাবিত সাপ্তাহিক ডেলিভারি
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white mt-1">
                    সপ্তাহে {weeklyBottles}টি করে {selectedJarType === '20L' ? '২০ লিটার' : '৫ লিটার'} বোতল
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">মাসিক মোট পানি</p>
                  <p className="text-lg sm:text-xl font-black text-cyan-300">{totalMonthlyLiters} লিটার</p>
                </div>
              </div>

              {/* Cost & Savings Highlights */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80">
                  <p className="text-xs text-slate-300 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    মিলাদ ফ্যাক্টরি খরচ
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-white mt-1">
                    ৳{miladMonthlyCost.toLocaleString()}
                    <span className="text-xs font-normal text-slate-400"> /মাস</span>
                  </p>
                  <p className="text-[10px] text-cyan-300 mt-1 font-semibold">
                    ≈ প্রতি জার মাত্র ৳{unitPrice}
                  </p>
                </div>

                <div className="bg-emerald-950/70 rounded-2xl p-4 border border-emerald-700/60">
                  <p className="text-xs text-emerald-300 flex items-center gap-1">
                    <PiggyBank className="w-3.5 h-3.5 text-emerald-400" />
                    আপনার মাসিক সাশ্রয়
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-emerald-300 mt-1">
                    ৳{monthlySavings.toLocaleString()}
                    <span className="text-xs font-bold text-emerald-400"> ({savingsPercent}%)</span>
                  </p>
                  <p className="text-[10px] text-emerald-200/80 mt-1 font-medium">
                    সাধারণ বোতলজাত পানির চেয়ে
                  </p>
                </div>
              </div>

              {/* Environmental Impact Pill */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-cyan-800/50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <p className="font-extrabold text-cyan-200">
                    প্রতি মাসে {plasticBottlesSaved.toLocaleString()}টি প্লাস্টিক বোতল বর্জন
                  </p>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    মিলাদ ওয়াটারের ফুড-গ্রেড জার ৫০ বারেরও বেশি সম্পূর্ণ জীবাণুমুক্ত করে সার্কুলার পদ্ধতিতে পরিবেশ রক্ষা করে।
                  </p>
                </div>
              </div>

              {/* Subscription Benefits */}
              <div className="space-y-2 pt-1 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>সিলেট শহরের যেকোনো এলাকায় ফ্রি হোম ডেলিভারি</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>খালি জার জমা দিয়ে ০ জামানতে সরাসরি রিফিল বদল</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>কাস্টমার ড্যাশবোর্ড থেকে যেকোনো সময় সাবস্ক্রিপশন চালু/বন্ধ করার সুবিধা</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    trackCalculatorUse(totalBottlesPerMonth, miladMonthlyCost, `${selectedJarType} মাসিক প্যাকেজ (${usageType})`);
                    setCurrentView('subscriptions');
                  }}
                  className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>এই প্যাকেজটি সাবস্ক্রাইব করুন (৳{miladMonthlyCost}/মাস)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

