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
import { motion } from 'motion/react';

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
    <section className="py-16 bg-gradient-to-b from-white via-slate-50 to-cyan-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-3">
            <Calculator className="w-3.5 h-3.5 text-cyan-600" />
            <span>Interactive Water Requirement & ROI Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            How Much Water Does Your Space Need?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Calculate your monthly water volume, compare refill savings against commercial PET bottles, and discover how our circular jar system eliminates single-use plastic.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-6">
            
            {/* Setting: Usage Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                1. Select Location / Environment
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setUsageType('home')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    usageType === 'home'
                      ? 'border-cyan-500 bg-cyan-50/70 text-cyan-900 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${usageType === 'home' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Residential</p>
                    <p className="text-[11px] text-slate-500">Home & Apartment</p>
                  </div>
                </button>

                <button
                  onClick={() => setUsageType('office')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    usageType === 'office'
                      ? 'border-cyan-500 bg-cyan-50/70 text-cyan-900 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${usageType === 'office' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Commercial</p>
                    <p className="text-[11px] text-slate-500">Office & Studio</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Slider: Number of People */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-cyan-600" />
                  <span>2. Number of Family Members / Staff</span>
                </label>
                <span className="px-3 py-1 bg-cyan-100 text-cyan-900 font-extrabold text-sm rounded-full">
                  {peopleCount} People
                </span>
              </div>
              <input
                type="range"
                min="1"
                max={usageType === 'home' ? 12 : 50}
                value={peopleCount}
                onChange={(e) => setPeopleCount(parseInt(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                <span>1 Person</span>
                <span>{usageType === 'home' ? '6 People' : '25 People'}</span>
                <span>{usageType === 'home' ? '12 People' : '50+ People'}</span>
              </div>
            </div>

            {/* Jar Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                3. Preferred Bottle Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedJarType('20L')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    selectedJarType === '20L'
                      ? 'border-cyan-500 bg-cyan-50/70 text-cyan-900 ring-2 ring-cyan-500/20'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-xs">
                    20L
                  </div>
                  <div>
                    <p className="text-xs font-bold">20L Standard Jar</p>
                    <p className="text-[10px] text-slate-500">৳80 / Refill (Best Value)</p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedJarType('5L')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    selectedJarType === '5L'
                      ? 'border-cyan-500 bg-cyan-50/70 text-cyan-900 ring-2 ring-cyan-500/20'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-xs">
                    5L
                  </div>
                  <div>
                    <p className="text-xs font-bold">5L Compact Bottle</p>
                    <p className="text-[10px] text-slate-500">৳35 / Bottle (Easy Pour)</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Toggle: Cooking & Tea */}
            {usageType === 'home' && (
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div>
                  <p className="text-xs font-bold text-slate-800">Include Pure Water for Cooking & Tea?</p>
                  <p className="text-[11px] text-slate-500">Recommended for toxin-free family meals (adds ~1.5L/day/person)</p>
                </div>
                <button
                  onClick={() => setCookingIncluded(!cookingIncluded)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    cookingIncluded ? 'bg-cyan-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      cookingIncluded ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )}

          </div>

          {/* Results & Recommendation Card */}
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            
            {/* Water Wave Glow Background */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    Recommended Monthly Plan
                  </span>
                  <h3 className="text-2xl font-extrabold font-heading text-white mt-0.5">
                    {weeklyBottles} × {selectedJarType} Jars / Week
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">Total Monthly Volume</p>
                  <p className="text-xl font-bold text-cyan-300">{totalMonthlyLiters} Liters</p>
                </div>
              </div>

              {/* Cost & Savings Highlights */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 backdrop-blur-md">
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    Milad Factory Cost
                  </p>
                  <p className="text-2xl font-extrabold text-white mt-1">
                    ৳{miladMonthlyCost.toLocaleString()}
                    <span className="text-xs font-normal text-slate-400"> /mo</span>
                  </p>
                  <p className="text-[10px] text-cyan-400 mt-1">
                    ≈ ৳{Math.round(miladMonthlyCost / totalBottlesPerMonth)} per delivery
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-950/80 to-teal-900/80 rounded-2xl p-4 border border-emerald-700/50 backdrop-blur-md">
                  <p className="text-xs text-emerald-300 flex items-center gap-1">
                    <PiggyBank className="w-3.5 h-3.5 text-emerald-400" />
                    You Save Every Month
                  </p>
                  <p className="text-2xl font-extrabold text-emerald-300 mt-1">
                    ৳{monthlySavings.toLocaleString()}
                    <span className="text-xs font-bold text-emerald-400"> ({savingsPercent}%)</span>
                  </p>
                  <p className="text-[10px] text-emerald-200/80 mt-1">
                    vs single-use branded bottles
                  </p>
                </div>
              </div>

              {/* Environmental Impact Pill */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-800/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-cyan-200">
                    Saves {plasticBottlesSaved.toLocaleString()} Single-Use Plastic Bottles / Month
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Our 20L food-grade polycarbonate jars are sterilized and reused 50+ times in a closed-loop system.
                  </p>
                </div>
              </div>

              {/* Subscription Benefits */}
              <div className="space-y-2 pt-1 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Free automated delivery on chosen days (e.g. Mon & Thu)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Zero deposit fee on 1-to-1 empty jar exchange</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Pause, resume, or modify delivery frequency anytime</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => setCurrentView('subscriptions')}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start This {selectedJarType} Subscription (৳{miladMonthlyCost}/mo)</span>
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
