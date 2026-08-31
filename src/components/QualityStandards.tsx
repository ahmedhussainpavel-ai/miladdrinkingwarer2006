import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldCheck, 
  Award, 
  Droplet, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  FileText,
  Download
} from 'lucide-react';

export const QualityStandards: React.FC = () => {
  const { language, t, formatNumber } = useLanguage();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const labReportRows = [
    {
      parameter: language === 'bn' ? 'টিডিএস (Total Dissolved Solids)' : 'Total Dissolved Solids (TDS)',
      bsti: '< 1000 mg/L',
      milad: '28 - 35 mg/L',
      status: language === 'bn' ? 'অনুমোদিত ও সেরা স্বাদ' : 'Optimal Sweet Taste'
    },
    {
      parameter: language === 'bn' ? 'পিএইচ মান (pH Level)' : 'pH Balance Level',
      bsti: '6.5 - 8.5',
      milad: '7.4 (Balanced)',
      status: language === 'bn' ? 'পারফেক্ট অ্যালকালাইন' : 'Perfect Balanced'
    },
    {
      parameter: language === 'bn' ? 'আর্সেনিক ও সীসা (Heavy Metals)' : 'Arsenic & Lead (Heavy Metals)',
      bsti: '0.01 mg/L Max',
      milad: '0.000 mg/L (Nil)',
      status: language === 'bn' ? 'সম্পূর্ণ মুক্ত (100% Zero)' : '100% Undetectable'
    },
    {
      parameter: language === 'bn' ? 'ই-কোলাই ও কলিফর্ম ব্যাকটেরিয়া' : 'E. Coli & Coliform Bacteria',
      bsti: '0 / 100 ml',
      milad: '0 / 100 ml (Sterile)',
      status: language === 'bn' ? 'জীবাণুমুক্ত (UV & Ozone)' : 'Sterilized & Certified'
    },
    {
      parameter: language === 'bn' ? 'টার্বিডিটি বা ঘোলাটে ভাব' : 'Turbidity (NTU)',
      bsti: '< 5 NTU',
      milad: '< 0.2 NTU (Crystal)',
      status: language === 'bn' ? 'স্ফটিক স্বচ্ছ' : 'Crystal Clear'
    }
  ];

  const steps = [
    { title: t.quality.step1Title, desc: t.quality.step1Desc },
    { title: t.quality.step2Title, desc: t.quality.step2Desc },
    { title: t.quality.step3Title, desc: t.quality.step3Desc },
    { title: t.quality.step4Title, desc: t.quality.step4Desc },
    { title: t.quality.step5Title, desc: t.quality.step5Desc },
    { title: t.quality.step6Title, desc: t.quality.step6Desc },
    { title: t.quality.step7Title, desc: t.quality.step7Desc },
  ];

  const faqsBn = [
    {
      q: 'খালি জার বদল (১-টু-১ রিটার্ন) নিয়ম কী?',
      a: 'আপনি যখন রিফিল অর্ডার করবেন, আমাদের ডেলিভারি প্রতিনিধি আপনার ঠিকানায় সম্পূর্ণ সিলগালা বিশুদ্ধ পানির জার পৌঁছে দিয়ে আপনার আগের খালি জারটি সংগ্রহ করবেন। এতে আপনাকে জারের কোনো অতিরিক্ত জামানত দিতে হয় না, শুধু পানির নির্ধারিত মূল্য (৳৮০) প্রযোজ্য হয়।'
    },
    {
      q: 'নতুন গ্রাহকদের যাদের খালি জার নেই তাদের জামানত কত?',
      a: 'প্রথমবার অর্ডারে যদি আপনার কাছে কোনো খালি জার না থাকে, তবে প্রতি জার বাবদ একবারের জন্য ৳২০০ সিকিউরিটি ডিপোজিট রাখা হয়। পরবর্তীতে আপনি সার্ভিস বন্ধ করে জার ফেরত দিলে পুরো জামানত শতভাগ ফেরত পেয়ে যাবেন।'
    },
    {
      q: 'সাপ্তাহিক সাবস্ক্রিপশনের ডেলিভারি কি যেকোনো সময় পরিবর্তন বা সাময়িক বন্ধ করা যাবে?',
      a: 'হ্যাঁ, অবশ্যই! আপনার কাস্টমার ড্যাশবোর্ড থেকে এক ক্লিকেই সাবস্ক্রিপশন পজ (Pause) করতে পারবেন (যেমন ভ্রমণের সময়) অথবা ডেলিভারির দিন ও সময় কোনো অতিরিক্ত চার্জ ছাড়াই পরিবর্তন করতে পারবেন।'
    },
    {
      q: 'কারখানায় ২০ লিটার জার কীভাবে পরিষ্কার ও জীবাণুমুক্ত করা হয়?',
      a: 'প্রতিটি ব্যবহৃত জার কারখানায় আসার পর স্বয়ংক্রিয় ওয়াশিং প্লান্টে ফুড-গ্রেড ক্ষারীয় দ্রবণ দিয়ে ধৌতকরণ, হাই-প্রেশার রিভার্স অসমোসিস ওয়াটার রিঞ্জ এবং ওজোন স্টেরিলাইজেশন করা হয়।'
    }
  ];

  const faqsEn = [
    {
      q: 'How does empty jar exchange work on delivery?',
      a: 'When you order a refill jar, our delivery agent brings fresh sealed mineral water and collects your empty jar in exchange. You only pay the refill price of ৳80 with zero deposit required.'
    },
    {
      q: 'What is the deposit policy for first-time buyers with no empty jar?',
      a: 'First-time buyers with no empty jar pay a one-time refundable security deposit of ৳200 per jar. Whenever you return the jars in the future, the deposit is 100% refunded to your wallet or cash.'
    },
    {
      q: 'Can I pause or adjust my weekly subscription during holidays?',
      a: 'Yes, absolutely. You can easily pause or modify delivery days anytime directly from your customer portal with zero fees.'
    },
    {
      q: 'How are the 20L jars sanitized at the Mirboxtula factory?',
      a: 'Every returned jar undergoes a multistage automated sanitization process: hot chemical rinse, high-pressure RO spray, and closed-chamber ozone sterilizing before automated contact-free filling.'
    }
  ];

  const faqs = language === 'bn' ? faqsBn : faqsEn;

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-900 text-xs font-bold border border-sky-200">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-700" />
            <span>{t.quality.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
            {t.quality.title}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {t.quality.subtitle}
          </p>
        </div>

        {/* 4 Trust Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-xs font-black text-sky-900">{t.quality.bstiBadge}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{language === 'bn' ? 'জাতীয় মান নিয়ন্ত্রক' : 'National Standard'}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-xs font-black text-emerald-900">{t.quality.isoBadge}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{language === 'bn' ? 'মিরবক্সটুলা প্ল্যান্ট' : 'Mirboxtula Plant'}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-xs font-black text-sky-900">{t.quality.tdsBadge}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{language === 'bn' ? 'রিয়েল-টাইম টেস্টেড' : 'Real-time Tested'}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-xs font-black text-emerald-900">{t.quality.phBadge}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{language === 'bn' ? 'স্বাস্থ্যসম্মত ব্যালেন্স' : 'Health Balanced'}</p>
          </div>
        </div>

        {/* 7-Step Purification Pipeline */}
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900 text-center sm:text-left">
            {language === 'bn' ? '৭-ধাপের বৈজ্ঞানিক ফিল্ট্রেশন পাইপলাইন' : '7-Stage Scientific Purification Pipeline'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {steps.map((s, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex gap-3 items-start">
                <span className="w-6 h-6 rounded-lg bg-sky-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                  {formatNumber(idx + 1)}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{s.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lab Testing Comparison Table */}
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">{t.quality.labReportTitle}</h3>
              <p className="text-xs text-slate-500">{t.quality.labReportDesc}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0 self-start sm:self-auto">
              {language === 'bn' ? 'সর্বশেষ টেস্ট: আজ সকালে' : 'Latest Test: Today Morning'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="pb-3">{t.quality.parameterCol}</th>
                  <th className="pb-3">{t.quality.bstiStandardCol}</th>
                  <th className="pb-3">{t.quality.miladResultCol}</th>
                  <th className="pb-3 text-right">{t.quality.statusCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {labReportRows.map((row, i) => (
                  <tr key={i} className="hover:bg-white/60 transition-colors">
                    <td className="py-3 font-bold text-slate-900">{row.parameter}</td>
                    <td className="py-3 text-slate-600">{row.bsti}</td>
                    <td className="py-3 font-bold text-sky-700">{row.milad}</td>
                    <td className="py-3 text-right font-bold text-emerald-700">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900 text-center">
            {language === 'bn' ? 'সাধারণ জিজ্ঞাসাসমূহ (FAQ)' : 'Frequently Asked Questions'}
          </h3>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
