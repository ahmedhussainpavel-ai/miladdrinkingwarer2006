import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  Check, 
  Sparkles, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  RotateCcw, 
  ArrowRight,
  Droplet,
  Truck,
  Plus
} from 'lucide-react';
import { SubscriptionFrequency, PaymentMethod } from '../types';
import { trackSubscriptionSelect, trackPurchase } from '../lib/analytics';

export const SubscriptionBuilder: React.FC = () => {
  const { user } = useAuth();
  const { createSubscription, setCurrentView, promptLocationPicker } = useStore();

  const [frequency, setFrequency] = useState<SubscriptionFrequency>('weekly_2x');
  const [bottleSize, setBottleSize] = useState<'20L' | '5L' | 'Mixed'>('20L');
  const [quantityPerDelivery, setQuantityPerDelivery] = useState<number>(2);
  const [selectedDays, setSelectedDays] = useState<string[]>(['সোমবার', 'বৃহস্পতিবার']);
  const [timeSlot, setTimeSlot] = useState<string>('সকাল ০৮:০০ - বেলা ১১:০০');
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wallet');
  const [autoDeductWallet, setAutoDeductWallet] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const availableDays = [
    { key: 'শনিবার', label: 'শনি' },
    { key: 'রবিবার', label: 'রবি' },
    { key: 'সোমবার', label: 'সোম' },
    { key: 'মঙ্গলবার', label: 'মঙ্গল' },
    { key: 'বুধবার', label: 'বুধ' },
    { key: 'বৃহস্পতিবার', label: 'বৃহ' },
    { key: 'শুক্রবার', label: 'শুক্র' }
  ];

  const timeSlots = [
    'সকাল ০৮:০০ - বেলা ১১:০০',
    'দুপুর ০২:০০ - বিকাল ০৫:০০',
    'সন্ধ্যা ০৬:০০ - রাত ০৯:০০'
  ];

  const addresses = user?.savedAddresses || [];
  const currentAddress = addresses[selectedAddressIndex] || addresses[0];

  const unitPrice = bottleSize === '20L' ? 80 : 35;
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
    if (!currentAddress) {
      promptLocationPicker(() => {});
      return;
    }
    setSubmitting(true);
    try {
      const planTitle = `মিলাদ ${bottleSize === '20L' ? '২০ লিটার' : '৫ লিটার'} রেগুলার প্যাকেজ (${frequency === 'weekly_1x' ? 'সপ্তাহে ১ দিন' : frequency === 'weekly_2x' ? 'সপ্তাহে ২ দিন' : 'সপ্তাহে ৩ দিন'})`;
      await createSubscription({
        userId: user?.uid || 'demo-user',
        customerName: user?.displayName || 'সম্মানিত গ্রাহক',
        customerPhone: user?.phone || '+8801711102448',
        customerEmail: user?.email || 'customer@miladwater.com',
        planName: planTitle,
        frequency,
        bottleSize,
        quantityPerDelivery,
        deliveryDays: selectedDays,
        timeSlot,
        deliveryAddress: currentAddress,
        pricePerDelivery,
        monthlyEstimate,
        paymentMethod,
        autoDeductWallet,
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        nextDeliveryDate: `${selectedDays[0]}, আসন্ন`
      });

      trackSubscriptionSelect(planTitle, monthlyEstimate);
      trackPurchase({
        orderId: `sub-${Date.now()}`,
        value: monthlyEstimate,
        paymentMethod,
        isSubscription: true,
        deliveryArea: currentAddress.area,
        items: [{
          id: `plan-${bottleSize}`,
          name: planTitle,
          quantity: 1,
          price: monthlyEstimate,
        }],
      });

      setCurrentView('customer_portal');
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-100 text-cyan-900 text-xs font-bold mb-3 border border-cyan-200">
            <Calendar className="w-4 h-4 text-cyan-700" />
            <span>স্বয়ংক্রিয় মাসিক ও সাপ্তাহিক ওয়াটার সাবস্ক্রিপশন</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            পানি ফুরিয়ে যাওয়ার ঝামেলা চিরতরে শেষ
          </h2>
          <p className="text-slate-600 text-xs sm:text-base mt-2.5 max-w-2xl mx-auto leading-relaxed">
            আপনার সুবিধাজনক দিন ও সময় নির্ধারণ করে রাখুন। নির্দিষ্ট দিনে আমাদের ডেলিভারি টিম স্বয়ংক্রিয়ভাবে সিলগালা জার পৌঁছে দিয়ে খালি জার বদল করে নিয়ে যাবে।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Main Wizard Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/90 space-y-7">
            
            {/* Step 1: Frequency Package */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">১</span>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">ডেলিভারির ফ্রিকোয়েন্সি নির্বাচন করুন</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => { setFrequency('weekly_1x'); setSelectedDays(['সোমবার']); }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    frequency === 'weekly_1x'
                      ? 'border-cyan-600 bg-cyan-50/80 ring-2 ring-cyan-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-[11px] font-black text-cyan-800 uppercase">সাপ্তাহিক ১ দিন</p>
                  <p className="text-sm font-black text-slate-900 mt-1">সপ্তাহে ১ বার</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">ছোট পরিবার ও ব্যাচেলরদের জন্য</p>
                </button>

                <button
                  type="button"
                  onClick={() => { setFrequency('weekly_2x'); setSelectedDays(['সোমবার', 'বৃহস্পতিবার']); }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    frequency === 'weekly_2x'
                      ? 'border-cyan-600 bg-cyan-50/80 ring-2 ring-cyan-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black uppercase shadow-xs">
                    জনপ্রিয়
                  </span>
                  <p className="text-[11px] font-black text-cyan-800 uppercase">সাপ্তাহিক ২ দিন</p>
                  <p className="text-sm font-black text-slate-900 mt-1">সপ্তাহে ২ বার</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">৪-৬ জনের পরিবারের জন্য সেরা</p>
                </button>

                <button
                  type="button"
                  onClick={() => { setFrequency('weekly_3x'); setSelectedDays(['শনিবার', 'সোমবার', 'বুধবার']); }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    frequency === 'weekly_3x'
                      ? 'border-cyan-600 bg-cyan-50/80 ring-2 ring-cyan-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-[11px] font-black text-cyan-800 uppercase">সাপ্তাহিক ৩ দিন / অফিস</p>
                  <p className="text-sm font-black text-slate-900 mt-1">সপ্তাহে ৩ বার</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">কর্পোরেট অফিস ও যৌথ পরিবারের জন্য</p>
                </button>
              </div>
            </div>

            {/* Step 2: Bottle Type & Jars per delivery */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">২</span>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">বোতলের ধরন ও পরিমাণ নির্বাচন করুন</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setBottleSize('20L')}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                    bottleSize === '20L'
                      ? 'border-cyan-600 bg-cyan-50/80 text-cyan-950 ring-2 ring-cyan-500/20 shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                    20L
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-extrabold text-slate-900">২০ লিটার রিফিল জার</p>
                    <p className="text-[11px] text-cyan-800 font-bold">৳৮০ / রিফিল</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setBottleSize('5L')}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                    bottleSize === '5L'
                      ? 'border-cyan-600 bg-cyan-50/80 text-cyan-950 ring-2 ring-cyan-500/20 shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                    5L
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-extrabold text-slate-900">৫ লিটার হ্যান্ডেল বোতল</p>
                    <p className="text-[11px] text-teal-800 font-bold">৳৩৫ / বোতল</p>
                  </div>
                </button>
              </div>

              {/* Quantity Selector */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-700">প্রতি ডেলিভারিতে বোতল সংখ্যা:</span>
                  <span className="px-3 py-1 bg-cyan-700 text-white rounded-full text-xs font-black">
                    {quantityPerDelivery}টি {bottleSize === '20L' ? '২০ লিটার জার' : '৫ লিটার বোতল'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuantityPerDelivery(num)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        quantityPerDelivery === num
                          ? 'bg-cyan-700 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-cyan-400'
                      }`}
                    >
                      {num}টি
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Days & Time Slot */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">৩</span>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">ডেলিভারির বার ও সময়সূচী</h3>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-600 mb-2">পছন্দের ডেলিভারির দিনগুলো বেছে নিন:</p>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {availableDays.map(day => {
                    const isSelected = selectedDays.includes(day.key);
                    return (
                      <button
                        key={day.key}
                        type="button"
                        onClick={() => toggleDay(day.key)}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-700 text-white shadow-xs font-black'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">পছন্দের ডেলিভারি সময়:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`p-3 rounded-xl text-xs font-bold border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        timeSlot === slot
                          ? 'border-cyan-600 bg-cyan-50 text-cyan-950 shadow-2xs'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Clock className="w-4 h-4 text-cyan-600 shrink-0" />
                      <span className="truncate">{slot}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Delivery Address */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">৪</span>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">ডেলিভারির ঠিকানা</h3>
                </div>
                <button
                  type="button"
                  onClick={() => promptLocationPicker(() => {})}
                  className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ম্যাপে নতুন ঠিকানা চিহ্নিত করুন</span>
                </button>
              </div>

              {addresses.length > 0 ? (
                <div className="space-y-2">
                  {addresses.map((addr, idx) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressIndex(idx)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                        selectedAddressIndex === idx
                          ? 'border-cyan-600 bg-cyan-50/70 ring-1 ring-cyan-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${selectedAddressIndex === idx ? 'text-cyan-600' : 'text-slate-400'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900">{addr.tag}</span>
                          <span className="text-xs text-slate-600 font-medium">{addr.recipientName} ({addr.phone})</span>
                        </div>
                        <p className="text-xs text-slate-600 truncate mt-0.5">{addr.addressLine}, {addr.area}, {addr.city}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => promptLocationPicker(() => {})}
                  className="w-full p-4 border-2 border-dashed border-cyan-300 rounded-2xl text-center text-cyan-700 font-bold text-xs hover:bg-cyan-50 cursor-pointer"
                >
                  + ম্যাপে ক্লিক করে আপনার ডেলিভারি ঠিকানা যুক্ত করুন
                </button>
              )}
            </div>

          </div>

          {/* Right Summary & Checkout Column */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 sticky top-24 border border-slate-800">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                  সাবস্ক্রিপশন সারসংক্ষেপ
                </span>
                <h3 className="text-lg sm:text-xl font-heading font-extrabold text-white mt-1">
                  {quantityPerDelivery}টি {bottleSize === '20L' ? '২০L জার' : '৫L বোতল'} ({selectedDays.join(' ও ')})
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                সক্রিয় প্যাকেজ
              </span>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>প্রতি ডেলিভারির মূল্য ({quantityPerDelivery}টি @ ৳{unitPrice}):</span>
                <span className="font-bold text-white">৳{pricePerDelivery}</span>
              </div>
              <div className="flex justify-between">
                <span>মাসে মোট নির্ধারিত ডেলিভারি:</span>
                <span className="font-bold text-white">{deliveriesPerMonth} বার</span>
              </div>
              <div className="flex justify-between">
                <span>সিলেট শহরে হোম ডেলিভারি:</span>
                <span className="font-bold text-emerald-400">সম্পূর্ণ ফ্রি</span>
              </div>
              <div className="flex justify-between">
                <span>খালি জার জমা দিয়ে রিফিল বদল:</span>
                <span className="font-bold text-cyan-300">৳০ জামানত</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">মাসিক আনুমানিক বিল:</span>
                <span className="text-2xl font-black text-cyan-300 font-heading">
                  ৳{monthlyEstimate.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Method Selector for Subscription */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                পেমেন্ট পদ্ধতি
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    paymentMethod === 'wallet'
                      ? 'border-cyan-400 bg-cyan-950 text-white font-bold'
                      : 'border-slate-800 bg-slate-800/50 text-slate-400'
                  }`}
                >
                  <p className="text-xs font-bold">মিলাদ ওয়ালেট</p>
                  <p className="text-[10px] text-cyan-400 font-normal">ব্যালেন্স: ৳{user?.walletBalance || 0}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-cyan-400 bg-cyan-950 text-white font-bold'
                      : 'border-slate-800 bg-slate-800/50 text-slate-400'
                  }`}
                >
                  <p className="text-xs font-bold">ক্যাশ অন ডেলিভারি</p>
                  <p className="text-[10px] text-slate-400 font-normal">পানি পেয়ে ক্যাশ / বিকাশ</p>
                </button>
              </div>
            </div>

            {/* Guarantees */}
            <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/60 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>যেকোনো সময় ড্যাশবোর্ড থেকে পজ বা বাতিল করার সুবিধা</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>দরজায় নতুন সিলগালা জার দিয়ে খালি জার স্বয়ংক্রিয়ভাবে বদল</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              disabled={submitting}
              onClick={handleCreateSubscription}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>{submitting ? 'প্যাকেজ সেটআপ হচ্ছে...' : 'মাসিক সাবস্ক্রিপশন সক্রিয় করুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};
