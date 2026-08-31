import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Calculator, 
  Users, 
  Droplets, 
  PiggyBank, 
  Leaf, 
  ArrowRight, 
  Home,
  Building2,
  Check
} from 'lucide-react';
import { trackCalculatorUse } from '../lib/analytics';

export const PricingCalculator: React.FC = () => {
  const { products, setCurrentView } = useStore();
  const { language, t, formatCurrency, formatNumber } = useLanguage();

  const [usageType, setUsageType] = useState<'home' | 'office'>('home');
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [cookingIncluded, setCookingIncluded] = useState<boolean>(true);
  const [selectedJarType, setSelectedJarType] = useState<'20L' | '5L'>('20L');

  // Dynamic Prices from store products
  const prod20L = products.find(p => p.id === 'prod-20l-jar' || p.category === 'water_jar');
  const prod5L = products.find(p => p.id === 'prod-5l-bottle' || p.category === 'water_bottle');
  const price20L = prod20L ? prod20L.price : 0;
  const price5L = prod5L ? prod5L.price : 0;

  // Math Calculations
  const dailyLitersPerPerson = usageType === 'home' 
    ? (cookingIncluded ? 3.5 : 2.0)
    : 1.5;

  const daysInMonth = usageType === 'home' ? 30 : 22;
  const totalMonthlyLiters = Math.round(peopleCount * dailyLitersPerPerson * daysInMonth);

  const bottleVolume = selectedJarType === '20L' ? 20 : 5;
  const totalBottlesPerMonth = Math.ceil(totalMonthlyLiters / bottleVolume);
  const weeklyBottles = Math.ceil(totalBottlesPerMonth / 4);

  const unitPrice = selectedJarType === '20L' ? price20L : price5L;
  const miladMonthlyCost = totalBottlesPerMonth * unitPrice;

  // Comparison: Single-use retail bottles cost ~18 BDT per Liter
  const retailBottlesCost = Math.round(totalMonthlyLiters * 18);
  const monthlySavings = Math.max(0, retailBottlesCost - miladMonthlyCost);
  const savingsPercent = Math.round((monthlySavings / retailBottlesCost) * 100);

  // Plastic bottles saved (500ml single-use bottles)
  const plasticBottlesSaved = Math.round(totalMonthlyLiters / 0.5);

  const handleSubscribeClick = () => {
    trackCalculatorUse(totalBottlesPerMonth, miladMonthlyCost, usageType);
    setCurrentView('subscriptions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-900 text-xs font-bold border border-sky-200">
            <Calculator className="w-3.5 h-3.5 text-sky-700" />
            <span>{t.calculator.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
            {t.calculator.title}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {t.calculator.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Controls Panel */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/90 space-y-6">
            
            {/* 1. Usage Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                {t.calculator.step1}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUsageType('home')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    usageType === 'home'
                      ? 'border-sky-600 bg-sky-50 text-sky-950 font-bold ring-1 ring-sky-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${usageType === 'home' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-extrabold">{t.calculator.homeType}</p>
                    <p className="text-[11px] text-slate-500">{t.calculator.homeTypeDesc}</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setUsageType('office')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    usageType === 'office'
                      ? 'border-sky-600 bg-sky-50 text-sky-950 font-bold ring-1 ring-sky-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${usageType === 'office' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-extrabold">{t.calculator.officeType}</p>
                    <p className="text-[11px] text-slate-500">{t.calculator.officeTypeDesc}</p>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. People Count Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t.calculator.step2}
                </label>
                <span className="text-xs font-black text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">
                  {formatNumber(peopleCount)} {t.calculator.persons}
                </span>
              </div>
              
              <input
                type="range"
                min="1"
                max={usageType === 'home' ? 12 : 50}
                value={peopleCount}
                onChange={(e) => setPeopleCount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />

              <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1">
                <span>{formatNumber(1)} {t.calculator.persons}</span>
                <span>{formatNumber(usageType === 'home' ? 6 : 25)} {t.calculator.persons}</span>
                <span>{formatNumber(usageType === 'home' ? 12 : 50)} {t.calculator.persons}</span>
              </div>
            </div>

            {/* 3. Bottle Size Choice */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                {t.calculator.step3}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedJarType('20L')}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    selectedJarType === '20L'
                      ? 'border-sky-600 bg-sky-50 text-sky-950 font-bold ring-1 ring-sky-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <p className="text-xs font-bold">{t.calculator.jar20LChoice}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedJarType('5L')}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    selectedJarType === '5L'
                      ? 'border-sky-600 bg-sky-50 text-sky-950 font-bold ring-1 ring-sky-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <p className="text-xs font-bold">{t.calculator.bottle5LChoice}</p>
                </button>
              </div>
            </div>

            {/* 4. Cooking water toggle for home */}
            {usageType === 'home' && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">{t.calculator.cookingToggle}</p>
                  <p className="text-[11px] text-slate-500">{t.calculator.cookingToggleDesc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCookingIncluded(!cookingIncluded)}
                  className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
                    cookingIncluded ? 'bg-sky-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                      cookingIncluded ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            )}

          </div>

          {/* Right Summary & Financial Output */}
          <div className="lg:col-span-6 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t.calculator.recommendedHeader}
              </span>
              <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
                {formatNumber(savingsPercent)}% {language === 'bn' ? 'সাশ্রয়' : 'Cheaper'}
              </span>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
                <p className="text-[11px] text-slate-400">{t.calculator.weeklySuggestion}</p>
                <p className="text-xl sm:text-2xl font-black text-white mt-1">
                  {formatNumber(weeklyBottles)} <span className="text-xs font-normal text-slate-400">{selectedJarType} / {language === 'bn' ? 'সপ্তাহ' : 'wk'}</span>
                </p>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
                <p className="text-[11px] text-slate-400">{t.calculator.monthlyTotalWater}</p>
                <p className="text-xl sm:text-2xl font-black text-sky-400 mt-1">
                  {formatNumber(totalMonthlyLiters)} <span className="text-xs font-normal text-slate-400">{language === 'bn' ? 'লিটার / মাস' : 'Liters / mo'}</span>
                </p>
              </div>
            </div>

            {/* Financial Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">{t.calculator.miladCost}</span>
                <span className="text-base font-black text-white">{formatCurrency(miladMonthlyCost)}</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-300">{t.calculator.monthlySavings}</p>
                  <p className="text-[11px] text-emerald-400/80">{t.calculator.savingsSubtext}</p>
                </div>
                <p className="text-xl sm:text-2xl font-black text-emerald-400">{formatCurrency(monthlySavings)}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-900/80 text-teal-300 flex items-center justify-center shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-teal-300">
                    {formatNumber(plasticBottlesSaved)} {language === 'bn' ? 'টি ৫০০ মিলি প্লাস্টিক বোতল বর্জন' : 'single-use bottles avoided'}
                  </p>
                  <p className="text-[11px] text-slate-400">{t.calculator.plasticSavedSubtext}</p>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={handleSubscribeClick}
              className="w-full py-4 px-6 rounded-2xl bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-slate-950 font-black text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-500/20"
            >
              <span>{t.calculator.subscribeBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};
