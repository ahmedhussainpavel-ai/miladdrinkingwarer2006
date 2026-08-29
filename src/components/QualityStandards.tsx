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
  Quote,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const QualityStandards: React.FC = () => {
  const { reviews } = useStore();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [simulatedTDS, setSimulatedTDS] = useState<number>(28);

  const filtrationSteps = [
    {
      step: '০১',
      title: 'মাল্টিমিডিয়া স্যান্ড ফিল্ট্রেশন',
      desc: 'উচ্চ ঘনত্বের সিলিকা কোয়ার্টজ ও অ্যান্ট্রাসাইট স্তরের মাধ্যমে পানিতে থাকা অদৃশ্য ধূলিকণা, কাদা ও ভৌত ভাসমান অপদ্রব্য ২০ মাইক্রন পর্যন্ত দূর করা হয়।'
    },
    {
      step: '০২',
      title: 'অ্যাক্টিভেটেড কার্বন অ্যাডসর্পশন',
      desc: 'উচ্চমানের নারিকেলের খোসা থেকে প্রস্তুত কার্বনের সাহায্যে পানির ক্লোরিন, দুর্গন্ধ, ক্ষতিকর জৈব রাসায়নিক উপাদান ও অতিরিক্ত গন্ধ সম্পূর্ণ শুষে নেওয়া হয়।'
    },
    {
      step: '০৩',
      title: 'ডুয়াল মাইক্রন কার্টিজ পলিশিং',
      desc: '৫-মাইক্রন ও ১-মাইক্রন বিশিষ্ট উচ্চ ঘনত্বের পলিপ্রোপাইলিন ফিল্টারের মাধ্যমে সূক্ষ্মতম বালুকণা আটকে আরও স্বচ্ছ ও মসৃণ পানি নিশ্চিত করা হয়।'
    },
    {
      step: '০৪',
      title: 'হাই-প্রেসার রিভার্স অসমোসিস (RO)',
      desc: '০.০০০১ মাইক্রন মেমব্রেনের ভেতর দিয়ে উচ্চ চাপে পানি প্রবাহিত করে ৯৯.৯% ভারী ধাতু (আর্সেনিক, সীসা), মাত্রাতিরিক্ত লবণাক্ততা ও নাইট্রেট দূর করা হয়।'
    },
    {
      step: '০৫',
      title: 'মিনারেল ব্যালেন্স ও পিএইচ নিয়ন্ত্রণ',
      desc: 'মানবদেহের জন্য অতীব জরুরি ক্যালসিয়াম (Ca), ম্যাগনেসিয়াম (Mg) ও পটাসিয়াম (K) সুষম মাত্রায় যোগ করে পানির পিএইচ (pH) ৭.২ থেকে ৭.৬ এ ব্যালেন্স রাখা হয়।'
    },
    {
      step: '০৬',
      title: 'আল্ট্রাভায়োলেট (UV) রশ্মি জীবাণুমুক্তকরণ',
      desc: '২৫৪ ন্যানোমিটার তরঙ্গদৈর্ঘ্যের সি-ব্যান্ড ইউভি ল্যাম্পের মাধ্যমে কোনো প্রকার রাসায়নিক ছাড়াই ব্যাকটেরিয়া, ভাইরাস ও মাইক্রোবায়াল সিস্ট ধ্বংস করা হয়।'
    },
    {
      step: '০৭',
      title: 'ওজোন (Ozone) নির্বীজন ও অটো-বটলিং',
      desc: 'খাদ্য-গ্রেড জারে ওজোন গ্যাসের মাধ্যমে চূড়ান্ত জীবাণুমুক্ত করে স্পর্শহীন ভ্যাকুয়াম চেম্বারে ক্যাপ সিলিং করা হয়, যা পানিকে দীর্ঘ সময় তাজা ও সুস্বাদু রাখে।'
    }
  ];

  const faqs = [
    {
      q: 'খালি জার বদল (১-টু-১ রিটার্ন) নিয়ম কী?',
      a: 'আপনি যখন রিফিল অর্ডার করবেন, আমাদের ডেলিভারি প্রতিনিধি আপনার ঠিকানায় সম্পূর্ণ সিলগালা বিশুদ্ধ পানির জার পৌঁছে দিয়ে আপনার আগের খালি জারটি সংগ্রহ করবেন। এতে আপনাকে জারের কোনো অতিরিক্ত জামানত দিতে হয় না, শুধু পানির নির্ধারিত মূল্য (৳৮০) প্রযোজ্য হয়।'
    },
    {
      q: 'নতুন গ্রাহকদের যাদের খালি জার নেই তাদের জামানত কত?',
      a: 'প্রথমবার অর্ডারে যদি আপনার কাছে কোনো খালি জার না থাকে, তবে প্রতি জার বাবদ একবারের জন্য ৳২৫০ সিকিউরিটি ডিপোজিট রাখা হয়। পরবর্তীতে আপনি সার্ভিস বন্ধ করে জার ফেরত দিলে পুরো জামানত শতভাগ ফেরত পেয়ে যাবেন।'
    },
    {
      q: 'সাপ্তাহিক সাবস্ক্রিপশনের ডেলিভারি কি যেকোনো সময় পরিবর্তন বা সাময়িক বন্ধ করা যাবে?',
      a: 'হ্যাঁ, অবশ্যই! আপনার কাস্টমার ড্যাশবোর্ড থেকে এক ক্লিকেই সাবস্ক্রিপশন পজ (Pause) করতে পারবেন (যেমন ভ্রমণের সময়) অথবা ডেলিভারির দিন ও সময় কোনো অতিরিক্ত চার্জ ছাড়াই পরিবর্তন করতে পারবেন।'
    },
    {
      q: 'কারখানায় ২০ লিটার জার কীভাবে পরিষ্কার ও জীবাণুমুক্ত করা হয়?',
      a: 'প্রতিটি ব্যবহৃত জার কারখানায় আসার পর ৫-ধাপের স্বয়ংক্রিয় রোবটিক মেশিনে উচ্চ তাপমাত্রার ক্ষারীয় ওয়াশ, রিভার্স অসমোসিস ওয়াটার রিঞ্জ, ফুড-গ্রেড ওজোন স্প্রে এবং সম্পূর্ণ স্পর্শহীন ক্লিনরুমে ফিলিং করা হয়।'
    },
    {
      q: 'লিফট ছাড়া বহুতল ভবনে কি ডেলিভারি দেওয়া হয়?',
      a: 'হ্যাঁ, আমাদের অভিজ্ঞ ডেলিভারি টিম আপনার ফ্ল্যাটের দরজায় পানি পৌঁছে দিতে প্রতিশ্রুতিবদ্ধ। অর্ডার করার সময় অনুগ্রহ করে আপনার তলা নম্বর ও বিশেষ নির্দেশনা লিখে রাখুন।'
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        
        {/* Quality Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-100 text-cyan-900 text-xs font-bold mb-3 border border-cyan-200">
            <ShieldCheck className="w-4 h-4 text-cyan-700" />
            <span>বিএসটিআই মান ও ৭-ধাপের ফিল্ট্রেশন</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            আন্তর্জাতিক মানের ৭-ধাপের বিশুদ্ধকরণ প্রযুক্তি
          </h2>
          <p className="text-slate-600 text-xs sm:text-base mt-2.5 max-w-2xl mx-auto leading-relaxed">
            বিশ্ব স্বাস্থ্য সংস্থা (WHO) এবং বাংলাদেশ স্ট্যান্ডার্ডস অ্যান্ড টেস্টিং ইনস্টিটিউশন (BSTI) মানদণ্ড অনুযায়ী প্রস্তুত শতভাগ নিরাপদ ও সুস্বাদু খাবার পানি।
          </p>
        </div>

        {/* 7-Stage Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filtrationSteps.map((step, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 hover:border-cyan-400 hover:bg-cyan-50/20 transition-all space-y-3 group shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black font-heading text-cyan-700 group-hover:scale-105 transition-transform">
                  {step.step}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-cyan-900 transition-colors">
                {step.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}

          {/* Cleanroom Showcase Card */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col justify-between border border-slate-800 shadow-md">
            <div>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                স্বয়ংক্রিয় ফিলিং লাইন
              </span>
              <h3 className="text-lg sm:text-xl font-black font-heading mt-3 text-white">ক্লাস ১০,০০০ ক্লিনরুম প্রসেস</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                পজিটিভ প্রেসার হেপা ফিল্টারযুক্ত ক্লিনরুমের কারণে বাইরের কোনো ধূলিকণা বা জীবাণু পানির সংস্পর্শে আসতে পারে না।
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-300 font-bold">
              <span>আইএসও মানসম্মত</span>
              <span>১০০% স্পর্শহীন রিফিল</span>
            </div>
          </div>
        </div>

        {/* Live TDS & Mineral Meter Simulator */}
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-6 space-y-3">
              <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider">
                বিশুদ্ধতার পরিমাপক
              </span>
              <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
                টিডিএস (TDS) ও খনিজ পরিমাপক সিমুলেটর
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                টিডিএস (Total Dissolved Solids) দিয়ে পানিতে দ্রবীভূত খনিজের পরিমাপ নির্ণয় করা হয়। বিশ্ব স্বাস্থ্য সংস্থার মতে খাবার পানির জন্য ২০ থেকে ৫০ পিপিএম হলো সবচেয়ে আদর্শ ও মিষ্টি মান।
              </p>

              {/* Slider simulation */}
              <div className="pt-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>পানির উৎস পরীক্ষা করুন:</span>
                  <span className="text-cyan-800 font-black">{simulatedTDS} PPM</span>
                </div>
                <input 
                  type="range"
                  min="10"
                  max="450"
                  value={simulatedTDS}
                  onChange={(e) => setSimulatedTDS(parseInt(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-medium">
                  <span>মিলাদ ওয়াটার (২৮ PPM)</span>
                  <span>সাধারণ ফিল্টার (১৫০ PPM)</span>
                  <span>সাপ্লাইয়ের পানি (৩৫০+ PPM)</span>
                </div>
              </div>
            </div>

            {/* TDS Result Display Box */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-center text-center space-y-3">
              <div className="inline-flex items-center justify-center gap-2">
                <Activity className="w-5 h-5 text-cyan-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">ল্যাব টেস্ট ফলাফল</span>
              </div>
              <div className="text-4xl font-black text-cyan-700 font-heading">
                {simulatedTDS} <span className="text-base text-slate-500 font-normal">PPM</span>
              </div>
              <p className="text-xs font-bold text-slate-800">
                {simulatedTDS <= 45 ? 'মিলাদ ফ্যাক্টরি স্ট্যান্ডার্ড: প্রিমিয়াম বিশুদ্ধ, খনিজসমৃদ্ধ ও শতভাগ নিরাপদ' :
                 simulatedTDS <= 150 ? '⚠️ সাধারণ ফিল্টার পানি: খাওয়ার উপযোগী তবে খনিজের তারতম্য রয়েছে' :
                 '❌ অপরিশোধিত পানি: আর্সেনিক, অতিরিক্ত আয়রন ও ব্যাকটেরিয়ার ঝুঁকি রয়েছে'}
              </p>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-[11px]">
                <div>
                  <p className="text-slate-400">পিএইচ মাত্রা</p>
                  <p className="font-bold text-slate-800">৭.৪ (ব্যালেন্সড)</p>
                </div>
                <div>
                  <p className="text-slate-400">ই-কোলাই জীবাণু</p>
                  <p className="font-bold text-emerald-600">০.০০ (সম্পূর্ণ মুক্ত)</p>
                </div>
                <div>
                  <p className="text-slate-400">আর্সেনিক / সীসা</p>
                  <p className="font-bold text-emerald-600">শূন্য (মুক্ত)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
              সিলেটের সম্মানিত গ্রাহকদের মতামত
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              আমাদের নিয়মিত গ্রাহক, কর্পোরেট অফিস ও ডায়াগনস্টিক সেন্টারের বিশ্বস্ত প্রতিক্রিয়া।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {reviews.map((rev) => (
              <div 
                key={rev.id}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900 font-bold">
                      {rev.userType === 'Family Subscriber' ? 'ফ্যামিলি গ্রাহক' :
                       rev.userType === 'Corporate' ? 'কর্পোরেট' :
                       rev.userType === 'Event Organizer' ? 'ইভেন্ট' : 'ভেরিফাইড গ্রাহক'}
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
            <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
              সাধারণ জিজ্ঞাসা (FAQ)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              ডেলিভারি, জার জামানত ও পানি অর্ডার সংক্রান্ত যেকোনো প্রশ্নের উত্তর।
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="pr-2">{faq.q}</span>
                  {activeFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-cyan-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {activeFaq === idx && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/60">
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

