import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Calendar, 
  Check, 
  Sparkles, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  Droplet,
  Truck,
  Plus
} from 'lucide-react';
import { SubscriptionFrequency, PaymentMethod } from '../types';
import { trackSubscriptionSelect, trackPurchase } from '../lib/analytics';

export const SubscriptionBuilder: React.FC = () => {
  const { user } = useAuth();
  const { products, createSubscription, setCurrentView, promptLocationPicker, setIsAuthModalOpen, showToast } = useStore();
  const { language, t, formatCurrency, formatNumber, translateDay } = useLanguage();

  const [frequency, setFrequency] = useState<SubscriptionFrequency>('weekly_2x');
  const [bottleSize, setBottleSize] = useState<'20L' | '5L' | 'Mixed'>('20L');
  const [quantityPerDelivery, setQuantityPerDelivery] = useState<number>(2);
  const [selectedDays, setSelectedDays] = useState<string[]>(['Monday', 'Thursday']);
  const [timeSlotKey, setTimeSlotKey] = useState<'morning' | 'noon' | 'evening'>('morning');
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wallet');
  const [autoDeductWallet, setAutoDeductWallet] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const availableDays = [
    { key: 'Saturday', bn: 'শনি', en: 'Sat' },
    { key: 'Sunday', bn: 'রবি', en: 'Sun' },
    { key: 'Monday', bn: 'সোম', en: 'Mon' },
    { key: 'Tuesday', bn: 'মঙ্গল', en: 'Tue' },
    { key: 'Wednesday', bn: 'বুধ', en: 'Wed' },
    { key: 'Thursday', bn: 'বৃহ', en: 'Thu' },
    { key: 'Friday', bn: 'শুক্র', en: 'Fri' }
  ];

  const addresses = user?.savedAddresses || [];
  const currentAddress = addresses[selectedAddressIndex] || addresses[0];

  // Dynamic pricing from products
  const prod20L = products.find(p => p.id === 'prod-20l-jar' || p.category === 'water_jar');
  const prod5L = products.find(p => p.id === 'prod-5l-bottle' || p.category === 'water_bottle');
  const price20L = prod20L ? prod20L.price : 0;
  const price5L = prod5L ? prod5L.price : 0;

  const unitPrice = bottleSize === '20L' ? price20L : price5L;
  const pricePerDelivery = unitPrice * quantityPerDelivery;
  
  // Monthly calculations
  const deliveriesPerMonth = frequency === 'weekly_1x' ? 4 
    : frequency === 'weekly_2x' ? 8 
    : frequency === 'weekly_3x' ? 12 
    : 24;

  const monthlyEstimate = pricePerDelivery * deliveriesPerMonth;

  const toggleDay = (dayKey: string) => {
    if (selectedDays.includes(dayKey)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter(d => d !== dayKey));
      }
    } else {
      setSelectedDays([...selectedDays, dayKey]);
    }
  };

  const handleCreateSubscription = async () => {
    if (!user) {
      showToast('info', language === 'bn' ? 'একাউন্ট প্রয়োজন' : 'Account Required', language === 'bn' ? 'সাবস্ক্রিপশন চালু করতে অনুগ্রহ করে সাইন আপ বা লগইন করুন।' : 'Please sign in or register to activate your water subscription.');
      setIsAuthModalOpen(true);
      return;
    }
    if (!currentAddress) {
      promptLocationPicker(() => {});
      return;
    }
    setSubmitting(true);
    try {
      const planTitle = language === 'bn' 
        ? `মিলাদ ${bottleSize === '20L' ? '২০ লিটার' : '৫ লিটার'} রেগুলার প্যাকেজ`
        : `Milad ${bottleSize} Hydration Plan`;

      const resolvedDays = selectedDays.map(d => translateDay(d));

      await createSubscription({
        userId: user?.uid || 'demo-user',
        customerName: user?.displayName || (language === 'bn' ? 'সম্মানিত গ্রাহক' : 'Customer'),
        customerPhone: user?.phone || '+8801711102448',
        customerEmail: user?.email || 'customer@miladwater.com',
        planName: planTitle,
        frequency,
        bottleSize,
        quantityPerDelivery,
        deliveryDays: resolvedDays,
        timeSlot: t.timeSlots[timeSlotKey],
        deliveryAddress: currentAddress,
        pricePerDelivery,
        monthlyEstimate,
        paymentMethod,
        autoDeductWallet,
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        nextDeliveryDate: `${resolvedDays[0] || (language === 'bn' ? 'আগামীকাল' : 'Tomorrow')}`
      });

      trackSubscriptionSelect(planTitle, monthlyEstimate);
      setCurrentView('customer_portal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-900 text-xs font-bold border border-sky-200">
            <Calendar className="w-3.5 h-3.5 text-sky-700" />
            <span>{t.subscriptions.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
            {t.subscriptions.title}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {t.subscriptions.subtitle}
          </p>
        </div>

        {/* 3 Preset Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          
          {/* Plan 1: Family Plan */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs hover:border-sky-300 transition-all flex flex-col justify-between relative group">
            <div className="absolute top-4 right-4">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-100 text-sky-800">
                {t.subscriptions.popularBadge}
              </span>
            </div>
            <div>
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4">
                <Droplet className="w-5 h-5 fill-sky-600/20" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">{t.subscriptions.planFamilyTitle}</h3>
              <p className="text-xs text-slate-500 mb-4">{t.subscriptions.planFamilyDesc}</p>
              
              <div className="space-y-2 mb-6 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'bn' ? 'সপ্তাহে ২টি ২০ লিটার জার' : '2 x 20L Jars per week'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'bn' ? 'সোম ও বৃহস্পতিবার ফ্রি ডেলিভারি' : 'Mon & Thu free delivery'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'bn' ? 'জরুরি প্রয়োজনে ইনস্ট্যান্ট রিফিল' : 'Emergency instant refill backup'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold">{t.subscriptions.monthlyEstimate}</p>
                <p className="text-xl font-black text-slate-900">{formatCurrency(640)}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFrequency('weekly_2x');
                  setQuantityPerDelivery(2);
                  setSelectedDays(['Monday', 'Thursday']);
                }}
                className="py-2.5 px-4 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                {language === 'bn' ? 'বেছে নিন' : 'Select'}
              </button>
            </div>
          </div>

          {/* Plan 2: Office Plan */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs hover:border-sky-300 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">{t.subscriptions.planOfficeTitle}</h3>
              <p className="text-xs text-slate-500 mb-4">{t.subscriptions.planOfficeDesc}</p>
              
              <div className="space-y-2 mb-6 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'bn' ? 'সপ্তাহে ৩ দিন ডেলিভারি' : '3 Deliveries per week'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'bn' ? 'প্রতি চালানে ৩টি জার (মোট ১২টি/মাস)' : '3 Jars per delivery (12/month)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'bn' ? 'মাসিক করপোরেট ইনভয়েস সুবিধা' : 'Monthly corporate GST invoice'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold">{t.subscriptions.monthlyEstimate}</p>
                <p className="text-xl font-black text-slate-900">{formatCurrency(960)}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFrequency('weekly_3x');
                  setQuantityPerDelivery(3);
                  setSelectedDays(['Saturday', 'Monday', 'Wednesday']);
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                {language === 'bn' ? 'বেছে নিন' : 'Select'}
              </button>
            </div>
          </div>

          {/* Plan 3: Custom Builder */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs hover:border-sky-300 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">{t.subscriptions.planCustomTitle}</h3>
              <p className="text-xs text-slate-500 mb-4">{t.subscriptions.planCustomDesc}</p>
              
              <div className="space-y-2 mb-6 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'bn' ? 'নিজের সুবিধামতো দিন নির্বাচন' : 'Pick your own schedule'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'bn' ? '২০ লিটার বা ৫ লিটার বোতল মিক্স' : '20L or 5L bottle volume'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'bn' ? 'যেকোনো সময় স্থগিত বা পরিবর্তন' : 'Pause or alter anytime'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400 font-semibold">{language === 'bn' ? 'কাস্টম প্যাকেজ' : 'Flexible'}</p>
                <p className="text-base font-extrabold text-slate-900">{language === 'bn' ? 'ফ্লেক্সিবল' : 'On-Demand'}</p>
              </div>
              <a
                href="#custom-subscription-builder"
                className="py-2.5 px-4 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 text-xs font-bold cursor-pointer transition-colors"
              >
                {language === 'bn' ? 'তৈরি করুন' : 'Configure'}
              </a>
            </div>
          </div>

        </div>

        {/* Interactive Custom Configuration Box */}
        <div id="custom-subscription-builder" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-extrabold text-slate-900 pb-3 border-b border-slate-100">
            {language === 'bn' ? 'কাস্টম সাবস্ক্রিপশন কনফিগারেশন' : 'Configure Custom Subscription'}
          </h3>

          {/* Days Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              {t.subscriptions.chooseDays}
            </label>
            <div className="flex flex-wrap gap-2">
              {availableDays.map(d => {
                const isSelected = selectedDays.includes(d.key);
                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => toggleDay(d.key)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {language === 'bn' ? d.bn : d.en}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slot Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              {t.subscriptions.chooseTime}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(['morning', 'noon', 'evening'] as const).map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimeSlotKey(slot)}
                  className={`p-3 rounded-2xl text-xs font-bold border text-left cursor-pointer transition-all ${
                    timeSlotKey === slot
                      ? 'bg-sky-50 border-sky-500 text-sky-950 ring-1 ring-sky-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {t.timeSlots[slot]}
                </button>
              ))}
            </div>
          </div>

          {/* Summary & Activation Strip */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400 font-semibold">{t.subscriptions.monthlyEstimate}</p>
              <p className="text-2xl font-black text-white">{formatCurrency(monthlyEstimate)}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{t.subscriptions.pauseResumeInfo}</p>
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={handleCreateSubscription}
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-slate-950 font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              {submitting ? <span>{t.loading}</span> : (
                <>
                  <span>{t.subscriptions.activateBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
