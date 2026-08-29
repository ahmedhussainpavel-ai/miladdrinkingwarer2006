import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  Droplet, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Star,
  Quote
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const QualityStandards: React.FC = () => {
  const { reviews } = useStore();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [simulatedTDS, setSimulatedTDS] = useState<number>(28);

  const filtrationSteps = [
    {
      step: '01',
      title: 'Multimedia Sand Filtration',
      desc: 'High-density quartz sand and anthracite beds remove suspended particles, clay, and physical turbidity down to 20 microns.'
    },
    {
      step: '02',
      title: 'Activated Carbon Adsorption',
      desc: 'High-iodine virgin coconut shell carbon removes residual chlorine, unpleasant tastes, organic chemicals, and volatile compounds.'
    },
    {
      step: '03',
      title: 'Dual Micron Cartridge Polishing',
      desc: 'High-efficiency 5-micron and 1-micron spun polypropylene filters trap microscopic particulate matter and protect RO membranes.'
    },
    {
      step: '04',
      title: 'High-Pressure Reverse Osmosis',
      desc: '0.0001-micron semi-permeable membranes filter out 99.9% of dissolved heavy metals (arsenic, lead), excess sodium, and nitrates.'
    },
    {
      step: '05',
      title: 'Mineral Remineralization & pH Balance',
      desc: 'Enriched with precise, health-optimized balances of Calcium (Ca2+), Magnesium (Mg2+), and Potassium (K+) to maintain optimal pH 7.2–7.6.'
    },
    {
      step: '06',
      title: 'UV Germicidal Irradiation',
      desc: 'C-band ultraviolet lamps (254nm wavelength) destroy DNA structures of bacteria, viruses, and microbial cysts without chemical residues.'
    },
    {
      step: '07',
      title: 'Ozone Sterilization & Bottling',
      desc: 'Dissolved medical-grade ozone (O3) sanitizes the food-grade jar interior during automated sterile bottling, reverting to pure oxygen within 12 hours.'
    }
  ];

  const faqs = [
    {
      q: 'How does the 1-to-1 Empty Jar Return system work?',
      a: 'When you place a refill order or have a scheduled subscription delivery, our delivery driver brings fresh, factory-sterilized 20L jars and collects your empty polycarbonate jars on a 1-to-1 basis. You pay only the water refill price (৳80) with zero new jar security deposit.'
    },
    {
      q: 'What is the security deposit for new customers without empty jars?',
      a: 'If you do not currently have empty 20L polycarbonate jars to exchange, a refundable security deposit of ৳250 per jar is added on your first order. This deposit is 100% refundable anytime you return the jars and discontinue service.'
    },
    {
      q: 'Can I pause or change my weekly subscription delivery days?',
      a: 'Yes, absolutely! From your Customer Dashboard, you can pause your subscription with one click (e.g. while traveling), resume anytime, or change your preferred delivery days and time slots without any penalty or administrative fees.'
    },
    {
      q: 'How are the 20L jars cleaned and sanitized at the factory?',
      a: 'Every returned jar undergoes a rigorous 5-step automated robotic wash: high-pressure internal hot alkaline detergent wash, disinfectant rinse, reverse osmosis water pre-rinse, final ozonated sterilizing rinse, and contactless cleanroom filling.'
    },
    {
      q: 'Do you deliver to upper floor apartments without elevators?',
      a: 'Yes, our dedicated logistics personnel are trained to deliver jars directly to your apartment doorstep. Please specify your floor number in the delivery instructions.'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Quality Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
            <span>Factory Purity & Standards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            The 7-Stage Purification Technology
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Engineered to exceed WHO (World Health Organization) and BSTI standards for bottled drinking water.
          </p>
        </div>

        {/* 7-Stage Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtrationSteps.map((step, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-cyan-300 hover:bg-cyan-50/30 transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-extrabold font-heading text-cyan-600 group-hover:scale-110 transition-transform">
                  {step.step}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-800 transition-colors">
                {step.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}

          {/* Cleanroom Showcase Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-900 via-sky-900 to-slate-900 text-white flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                Automated Cleanroom
              </span>
              <h3 className="text-xl font-bold font-heading mt-3">Class 10,000 Bottling Line</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Positive-pressure HEPA filtered cleanroom prevents airborne contaminants from ever coming into contact with your drinking water.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs text-cyan-300 font-semibold">
              <span>ISO 22000 Certified</span>
              <span>100% Hands-Free</span>
            </div>
          </div>
        </div>

        {/* Live TDS & Mineral Meter Simulator */}
        <div className="bg-gradient-to-r from-sky-50 via-cyan-50 to-blue-50 rounded-3xl p-8 border border-cyan-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-3">
              <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider">
                Water Purity Benchmarking
              </span>
              <h3 className="text-2xl font-heading font-extrabold text-slate-900">
                Total Dissolved Solids (TDS) Interactive Meter
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                TDS measures mineral ions, salts, and dissolved particles in parts per million (PPM). WHO defines ideal drinking water between 20 to 100 PPM with alkaline balance.
              </p>

              {/* Slider simulation */}
              <div className="pt-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Simulate Source:</span>
                  <span className="text-cyan-700 font-extrabold">{simulatedTDS} PPM</span>
                </div>
                <input 
                  type="range"
                  min="10"
                  max="450"
                  value={simulatedTDS}
                  onChange={(e) => setSimulatedTDS(parseInt(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Milad Water (28 PPM)</span>
                  <span>Filtered Tap (150 PPM)</span>
                  <span>Unfiltered Tap (350+ PPM)</span>
                </div>
              </div>
            </div>

            {/* TDS Result Display Box */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 shadow-md border border-cyan-100 flex flex-col justify-center text-center space-y-3">
              <div className="inline-flex items-center justify-center gap-2">
                <Activity className="w-5 h-5 text-cyan-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Reading Result</span>
              </div>
              <div className="text-4xl font-extrabold text-cyan-700 font-heading">
                {simulatedTDS} <span className="text-base text-slate-500 font-normal">PPM</span>
              </div>
              <p className="text-xs font-bold text-slate-800">
                {simulatedTDS <= 45 ? '💎 Milad Factory Standard: Ultra-Pure, Mineral-Balanced & Soft' :
                 simulatedTDS <= 150 ? '⚠️ Standard Filtered Water: Acceptable but contains higher mineral variance' :
                 '❌ Unfiltered Tap Water: High heavy metals, chlorine, and sediment risk'}
              </p>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                <div>
                  <p className="text-slate-400">pH Level</p>
                  <p className="font-bold text-slate-800">7.4 (Optimal)</p>
                </div>
                <div>
                  <p className="text-slate-400">E. Coli & Coliform</p>
                  <p className="font-bold text-emerald-600">0.00 / 100ml</p>
                </div>
                <div>
                  <p className="text-slate-400">Lead / Arsenic</p>
                  <p className="font-bold text-emerald-600">Undetected (Nil)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-heading font-extrabold text-slate-900">
              Trusted by 12,000+ Homes, Offices & Events
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Read real feedback from our verified daily subscribers and corporate clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div 
                key={rev.id}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold">
                      {rev.userType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{rev.customerName}</h4>
                    <p className="text-[10px] text-slate-500">{rev.location}</p>
                  </div>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-heading font-extrabold text-slate-900">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Everything you need to know about deliveries, jar deposits, and water quality.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-white"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {activeFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-cyan-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {activeFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
