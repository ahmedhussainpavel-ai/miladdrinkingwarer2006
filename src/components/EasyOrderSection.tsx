import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { 
  Droplet, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Check, 
  Sparkles,
  ArrowRight,
  Clock,
  Send,
  PhoneCall,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createWhatsAppChatUrl } from '../lib/whatsapp';
import { generateOrderInvoicePDF } from '../lib/pdfGenerator';
import { Order } from '../types';

export const EasyOrderSection: React.FC = () => {
  const { products, createOrder, showToast, setCurrentView } = useStore();
  const { user } = useAuth();

  // Water Quantities
  const [jar20LQty, setJar20LQty] = useState<number>(2);
  const [hasEmptyJar, setHasEmptyJar] = useState<boolean>(true);
  const [bottle5LQty, setBottle5LQty] = useState<number>(0);
  const [case500mlQty, setCase500mlQty] = useState<number>(0);
  const [pumpQty, setPumpQty] = useState<number>(0);

  // Customer Delivery Info (Sylhet)
  const [customerName, setCustomerName] = useState<string>(user?.displayName || 'আহমেদ হোসেন');
  const [customerPhone, setCustomerPhone] = useState<string>(user?.phone || '01711102448');
  const [selectedArea, setSelectedArea] = useState<string>('মিরবক্সটুলা');
  const [addressDetails, setAddressDetails] = useState<string>('বাড়ি নম্বর ১২, রোড ৩, মিরবক্সটুলা, সিলেট');
  const [deliverySpeed, setDeliverySpeed] = useState<'express' | 'today' | 'tomorrow'>('express');
  const [paymentOption, setPaymentOption] = useState<'cod' | 'bkash'>('cod');
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderCompleted, setOrderCompleted] = useState<Order | null>(null);

  // Pricing calculations
  const price20L = 80;
  const depositPerJar = 250;
  const price5L = 35;
  const price500ml = 360;
  const pricePump = 450;

  const waterCost = (jar20LQty * price20L) + (bottle5LQty * price5L) + (case500mlQty * price500ml) + (pumpQty * pricePump);
  const depositCost = !hasEmptyJar ? (jar20LQty * depositPerJar) : 0;
  const totalAmount = waterCost + depositCost;

  const totalItemsCount = jar20LQty + bottle5LQty + case500mlQty + pumpQty;

  const sylhetAreas = [
    'মিরবক্সটুলা',
    'জিন্দাবাজার',
    'আম্বরখানা',
    'দরগাহ গেট',
    'চৌহাট্টা',
    'শিবগঞ্জ',
    'টিলাগড়',
    'লামাবাজার',
    'কুমারপাড়া',
    'উপশহর',
    'সুবিদবাজার',
    'মদিনা মার্কেট',
    'দক্ষিণ সুরমা',
    'কদমতলী',
    'পাঠানটুলা',
    'মেজরটিলা',
    'অন্যান্য (সিলেট শহর)'
  ];

  const handlePlaceQuickOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (totalItemsCount === 0) {
      showToast('error', 'পণ্য নির্বাচন করুন', 'অনুগ্রহ করে অন্তত ১টি পানির জার বা বোতল যোগ করুন।');
      return;
    }

    if (!customerName.trim()) {
      showToast('error', 'নাম লিখুন', 'আপনার নাম লিখুন যাতে ডেলিভারি দিতে সহজ হয়।');
      return;
    }

    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      showToast('error', 'মোবাইল নম্বর দিন', 'সঠিক ১১ সংখ্যার মোবাইল নম্বর লিখুন (যেমন: 01711102448)।');
      return;
    }

    if (!addressDetails.trim()) {
      showToast('error', 'ঠিকানা দিন', 'আপনার বাসা বা অফিসের সম্পূর্ণ ঠিকানা লিখুন।');
      return;
    }

    setIsSubmitting(true);

    try {
      const itemsList = [];
      if (jar20LQty > 0) {
        itemsList.push({
          productId: 'prod-20l-jar',
          name: '২০ লিটার মিনারেল ওয়াটার জার',
          volume: '২০ লিটার',
          quantity: jar20LQty,
          unitPrice: price20L,
          jarDepositPaid: depositCost,
          emptyJarsToReturn: hasEmptyJar ? jar20LQty : 0,
          totalPrice: (price20L * jar20LQty) + depositCost
        });
      }
      if (bottle5LQty > 0) {
        itemsList.push({
          productId: 'prod-5l-bottle',
          name: '৫ লিটার ফ্যামিলি বোতল',
          volume: '৫ লিটার',
          quantity: bottle5LQty,
          unitPrice: price5L,
          jarDepositPaid: 0,
          emptyJarsToReturn: 0,
          totalPrice: price5L * bottle5LQty
        });
      }
      if (case500mlQty > 0) {
        itemsList.push({
          productId: 'prod-500ml-case',
          name: '৫০০ মিলি বোতল (২৪ পিস কেস)',
          volume: '১২ লিটার (২৪ পিস)',
          quantity: case500mlQty,
          unitPrice: price500ml,
          jarDepositPaid: 0,
          emptyJarsToReturn: 0,
          totalPrice: price500ml * case500mlQty
        });
      }
      if (pumpQty > 0) {
        itemsList.push({
          productId: 'prod-electric-pump',
          name: 'অটোমেটিক ইলেকট্রিক জার পাম্প',
          volume: 'ডিভাইস',
          quantity: pumpQty,
          unitPrice: pricePump,
          jarDepositPaid: 0,
          emptyJarsToReturn: 0,
          totalPrice: pricePump * pumpQty
        });
      }

      const orderPayload = {
        userId: user?.uid || 'guest-sylhet',
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: user?.email || 'miladdrinkingwater@gmail.com',
        type: 'one_time' as const,
        items: itemsList,
        subtotal: waterCost,
        depositTotal: depositCost,
        deliveryFee: 0,
        discount: 0,
        totalAmount: totalAmount,
        deliveryAddress: {
          id: `addr-${Date.now()}`,
          tag: 'ডেলিভারি ঠিকানা',
          recipientName: customerName.trim(),
          phone: customerPhone.trim(),
          addressLine: addressDetails.trim(),
          area: selectedArea,
          city: 'সিলেট',
          postalCode: '৩১০০',
          isDefault: true,
          instructions: deliverySpeed === 'express' ? 'জরুরী ১ ঘণ্টার মধ্যে ডেলিভারি' : 'স্বাভাবিক ডেলিভারি'
        },
        deliveryDate: new Date().toISOString().split('T')[0],
        timeSlot: deliverySpeed === 'express' ? '১ ঘণ্টার মধ্যে (Express)' : 'আজকের মধ্যেই (সকাল ৯টা - রাত ৮টা)',
        deliveryZone: `${selectedArea} জোন (সিলেট)`,
        paymentMethod: paymentOption,
        paymentStatus: 'unpaid' as const,
        status: 'confirmed' as const,
        emptyJarsReturnedCount: hasEmptyJar ? jar20LQty : 0
      };

      const newOrder = await createOrder(orderPayload);
      setOrderCompleted(newOrder);

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      showToast('success', 'অর্ডার সফল হয়েছে!', `ইনভয়েস #${newOrder.invoiceNumber}। কিছুক্ষণের মধ্যেই ডেলিভারি ভ্যান রওনা হবে।`);
    } catch (err: any) {
      showToast('error', 'অর্ডারে সমস্যা', 'দয়া করে আবার চেষ্টা করুন বা সরাসরি কল দিন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct WhatsApp Message Order Generator
  const handleDirectWhatsAppOrder = () => {
    if (totalItemsCount === 0) {
      showToast('error', 'পণ্য নির্বাচন করুন', 'অনুগ্রহ করে অন্তত ১টি পানির জার সিলেক্ট করুন।');
      return;
    }

    const itemsSummary = [
      jar20LQty > 0 ? `• ২০ লিটার জার: ${jar20LQty}টি (${hasEmptyJar ? 'খালি জার বদল' : 'নতুন জার লাগবে'})` : '',
      bottle5LQty > 0 ? `• ৫ লিটার বোতল: ${bottle5LQty}টি` : '',
      case500mlQty > 0 ? `• ৫০০ মিলি কেস: ${case500mlQty}টি` : '',
      pumpQty > 0 ? `• ইলেকট্রিক পাম্প: ${pumpQty}টি` : ''
    ].filter(Boolean).join('\n');

    const msg = `আসসালামু আলাইকুম, আমি মিলাদ ড্রিংকিং ওয়াটার অর্ডার করতে চাই:
----------------------------------
👤 নাম: ${customerName || 'গ্রাহক'}
📱 মোবাইল: ${customerPhone || '01711102448'}
📍 এলাকা: ${selectedArea}, সিলেট
🏠 বিস্তারিত ঠিকানা: ${addressDetails || 'মিরবক্সটুলা, সিলেট'}

🛒 অর্ডার বিবরণ:
${itemsSummary}

💵 মোট টাকা: ৳${totalAmount}
⏱️ ডেলিভারি: ${deliverySpeed === 'express' ? 'জরুরী ১ ঘণ্টার মধ্যে' : 'আজকের মধ্যেই'}

দয়া করে দ্রুত পানি পাঠানোর ব্যবস্থা করুন। ধন্যবাদ!`;

    const waUrl = createWhatsAppChatUrl('+8801711102448', msg);
    window.open(waUrl, '_blank');
  };

  return (
    <div id="easy-order-section" className="py-8 sm:py-12 bg-gradient-to-b from-sky-50 via-white to-cyan-50/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-600/10 border border-cyan-500/30 text-cyan-800 text-xs sm:text-sm font-extrabold">
            <Sparkles className="w-4 h-4 text-cyan-600 animate-pulse" />
            <span>সিলেট শহরে দ্রুততম ১-২ ঘণ্টার মধ্যে হোম ও অফিস ডেলিভারি</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight">
            সহজ ৩ ধাপে <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-700">বিশুদ্ধ খাবার পানি</span> অর্ডার করুন
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            কোনো জটিলতা ছাড়াই মাত্র কয়েকটি ক্লিকে বাসা, অফিস বা দোকানের জন্য অর্ডার দিন। কারখানা: <strong>মিরবক্সটুলা, সিলেট</strong>।
          </p>

          {/* Quick Call & WhatsApp Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="tel:+8801711102448"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>সরাসরি কল দিন: 01711-102448</span>
            </a>

            <button
              onClick={handleDirectWhatsAppOrder}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-800/20 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>হোয়াটসঅ্যাপে অর্ডার করুন</span>
            </button>
          </div>
        </div>

        {/* If Order Placed Success View */}
        {orderCompleted ? (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-emerald-400 shadow-xl space-y-6 text-center animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                অর্ডার সফলভাবে গৃহীত হয়েছে ✅
              </span>
              <h3 className="text-2xl font-bold text-slate-900">
                ধন্যবাদ, {orderCompleted.customerName}!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                আপনার পানির অর্ডারটি (#<strong>{orderCompleted.invoiceNumber}</strong>) মিরবক্সটুলা কারখানা থেকে প্রস্তুত করা হচ্ছে। কিছুক্ষণের মধ্যেই ডেলিভারি ভ্যান আপনার ঠিকানায় পৌঁছাবে।
              </p>
            </div>

            {/* Quick Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-lg mx-auto text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200 font-medium">
                <span className="text-slate-500">গ্রাহক ও মোবাইল:</span>
                <span className="text-slate-900 font-bold">{orderCompleted.customerName} ({orderCompleted.customerPhone})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 font-medium">
                <span className="text-slate-500">ডেলিভারি ঠিকানা:</span>
                <span className="text-slate-900 font-bold text-right">{orderCompleted.deliveryAddress.addressLine}, {orderCompleted.deliveryAddress.area}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 font-medium">
                <span className="text-slate-500">অর্ডার বিবরণ:</span>
                <span className="text-slate-900 font-bold">{orderCompleted.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</span>
              </div>
              <div className="flex justify-between py-1 font-bold text-base text-cyan-800">
                <span>মোট পরিশোধযোগ্য টাকা:</span>
                <span>৳{orderCompleted.totalAmount} ({orderCompleted.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : 'বিকাশ'})</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => generateOrderInvoicePDF(orderCompleted)}
                className="px-5 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                📄 রসিদ / মেমো ডাউনলোড করুন
              </button>

              <button
                onClick={() => {
                  setOrderCompleted(null);
                  setJar20LQty(2);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                🔄 নতুন আরেকটি অর্ডার করুন
              </button>
            </div>
          </div>
        ) : (

          /* Main 3-Step Interactive Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Steps Column (Left 7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* STEP 1: পানির পরিমাণ নির্বাচন */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-cyan-100 shadow-lg shadow-cyan-900/5 space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <span className="w-8 h-8 rounded-full bg-cyan-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-cyan-600/30">
                    ১
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      কত জার পানি লাগবে বেছে নিন
                    </h3>
                    <p className="text-xs text-slate-500">
                      প্লাস (+) এবং মাইনাস (-) বোতাম চেপে সহজে সংখ্যা ঠিক করুন
                    </p>
                  </div>
                </div>

                {/* 20L Jar Selector (Primary) */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-50/80 via-sky-50/50 to-white border-2 border-cyan-400 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center text-white shadow-md">
                        <Droplet className="w-7 h-7 fill-white" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                          ২০ লিটার মিনারেল ওয়াটার জার
                        </h4>
                        <p className="text-xs font-bold text-cyan-800">
                          রিফিল মূল্য: ৳৮০ প্রতি জার
                        </p>
                      </div>
                    </div>

                    {/* Counter Buttons */}
                    <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-xl border border-cyan-300 shadow-xs">
                      <button
                        type="button"
                        onClick={() => setJar20LQty(Math.max(0, jar20LQty - 1))}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center font-extrabold text-base transition-colors cursor-pointer"
                        title="কমান"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-extrabold text-lg text-cyan-900">
                        {jar20LQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setJar20LQty(jar20LQty + 1)}
                        className="w-8 h-8 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center font-extrabold text-base transition-colors cursor-pointer"
                        title="বাড়ান"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Empty Jar Exchange Toggle */}
                  {jar20LQty > 0 && (
                    <div className="pt-2 border-t border-cyan-200/60">
                      <p className="text-xs font-bold text-slate-700 mb-2">
                        আপনার কাছে কি খালি জার আছে?
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setHasEmptyJar(true)}
                          className={`p-2.5 rounded-xl border font-bold flex items-center gap-2 transition-all cursor-pointer ${
                            hasEmptyJar 
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs' 
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center border ${hasEmptyJar ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-400'}`}>
                            {hasEmptyJar && <Check className="w-3 h-3" />}
                          </span>
                          <span>হ্যাঁ, খালি জার বদলে নেব (৳০ জামানত)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setHasEmptyJar(false)}
                          className={`p-2.5 rounded-xl border font-bold flex items-center gap-2 transition-all cursor-pointer ${
                            !hasEmptyJar 
                              ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-xs' 
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center border ${!hasEmptyJar ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-400'}`}>
                            {!hasEmptyJar && <Check className="w-3 h-3" />}
                          </span>
                          <span>না, নতুন জার কিনব (+৳২৫০ জামানত)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Items (5L, 500ml, Dispenser) */}
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    অন্যান্য প্রয়োজনীয় পণ্য যোগ করতে পারেন:
                  </p>

                  {/* 5L Bottle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">৫ লিটার ফ্যামিলি বোতল</h5>
                      <p className="text-[11px] text-slate-500">৳৩৫ প্রতি বোতল</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-300">
                      <button
                        type="button"
                        onClick={() => setBottle5LQty(Math.max(0, bottle5LQty - 1))}
                        className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-xs">{bottle5LQty}</span>
                      <button
                        type="button"
                        onClick={() => setBottle5LQty(bottle5LQty + 1)}
                        className="w-6 h-6 rounded bg-cyan-600 text-white flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* 500ml Case */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">৫০০ মিলি বোতল (২৪ পিস কেস)</h5>
                      <p className="text-[11px] text-slate-500">৳৩৬০ প্রতি কেস (মেহমান ও ইভেন্টের জন্য)</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-300">
                      <button
                        type="button"
                        onClick={() => setCase500mlQty(Math.max(0, case500mlQty - 1))}
                        className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-xs">{case500mlQty}</span>
                      <button
                        type="button"
                        onClick={() => setCase500mlQty(case500mlQty + 1)}
                        className="w-6 h-6 rounded bg-cyan-600 text-white flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Electric Pump */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">অটোমেটিক ইলেকট্রিক রিচার্জেবল পাম্প</h5>
                      <p className="text-[11px] text-slate-500">৳৪৫০ (সহজে পানি ঢালার ডিসপেন্সার)</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-300">
                      <button
                        type="button"
                        onClick={() => setPumpQty(Math.max(0, pumpQty - 1))}
                        className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-xs">{pumpQty}</span>
                      <button
                        type="button"
                        onClick={() => setPumpQty(pumpQty + 1)}
                        className="w-6 h-6 rounded bg-cyan-600 text-white flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 2: আপনার নাম, মোবাইল ও সিলেটের ঠিকানা */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-cyan-100 shadow-lg shadow-cyan-900/5 space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <span className="w-8 h-8 rounded-full bg-cyan-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-cyan-600/30">
                    ২
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      আপনার নাম, মোবাইল ও ঠিকানা দিন
                    </h3>
                    <p className="text-xs text-slate-500">
                      সিলেটের যে ঠিকানায় পানি পৌঁছে দিতে হবে
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">
                      আপনার পুরো নাম <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="যেমন: আহমেদ হোসেন"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 text-xs font-medium"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">
                      মোবাইল নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="01711102448"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 text-xs font-bold text-slate-900"
                      required
                    />
                  </div>

                  {/* Sylhet Area Dropdown */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">
                      সিলেটের এলাকা বেছে নিন <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 text-xs font-bold text-slate-900 bg-white"
                    >
                      {sylhetAreas.map((ar) => (
                        <option key={ar} value={ar}>{ar}</option>
                      ))}
                    </select>
                  </div>

                  {/* Address Details */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">
                      বাড়ি নম্বর / রোড / ফ্ল্যাট বিস্তারিত <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressDetails}
                      onChange={(e) => setAddressDetails(e.target.value)}
                      placeholder="যেমন: বাড়ি ১২, রোড ৩, মিরবক্সটুলা (৪র্থ তলা)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-cyan-500 text-xs font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Delivery Timing Options */}
                <div className="pt-2">
                  <label className="font-bold text-xs text-slate-700 block mb-1.5">
                    কখন ডেলিভারি চান?
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setDeliverySpeed('express')}
                      className={`p-2 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                        deliverySpeed === 'express' 
                          ? 'bg-cyan-50 border-cyan-500 text-cyan-900 shadow-xs' 
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="block text-cyan-700">⚡ জরুরী</span>
                      <span className="text-[10px] font-normal">১ ঘণ্টার মধ্যে</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliverySpeed('today')}
                      className={`p-2 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                        deliverySpeed === 'today' 
                          ? 'bg-cyan-50 border-cyan-500 text-cyan-900 shadow-xs' 
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="block text-slate-800">আজকের মধ্যে</span>
                      <span className="text-[10px] font-normal">সকাল - রাত ৮টা</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliverySpeed('tomorrow')}
                      className={`p-2 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                        deliverySpeed === 'tomorrow' 
                          ? 'bg-cyan-50 border-cyan-500 text-cyan-900 shadow-xs' 
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="block text-slate-800">আগামীকাল</span>
                      <span className="text-[10px] font-normal">সকাল শিডিউল</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Order Summary & Final Confirmation Column (Right 5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* STEP 3: অর্ডার কনফার্মেশন ও বিল */}
              <div className="sticky top-24 p-5 sm:p-6 rounded-3xl bg-white border-2 border-cyan-500 shadow-xl shadow-cyan-900/10 space-y-5">
                
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <span className="w-8 h-8 rounded-full bg-cyan-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                    ৩
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      অর্ডার নিশ্চিত করুন
                    </h3>
                    <p className="text-xs text-slate-500">
                      পানি হাতে পাওয়ার পর টাকা পরিশোধ করবেন
                    </p>
                  </div>
                </div>

                {/* Items Breakdown */}
                <div className="space-y-2 text-xs border-b border-slate-100 pb-4">
                  {jar20LQty > 0 && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-700 font-medium">
                        ২০ লিটার জার x {jar20LQty} {hasEmptyJar ? '(খালি জার বদল)' : '(নতুন জার)'}
                      </span>
                      <span className="font-bold text-slate-900">
                        ৳{(price20L * jar20LQty) + depositCost}
                      </span>
                    </div>
                  )}

                  {bottle5LQty > 0 && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-700 font-medium">৫ লিটার বোতল x {bottle5LQty}</span>
                      <span className="font-bold text-slate-900">৳{price5L * bottle5LQty}</span>
                    </div>
                  )}

                  {case500mlQty > 0 && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-700 font-medium">৫০০ মিলি কেস x {case500mlQty}</span>
                      <span className="font-bold text-slate-900">৳{price500ml * case500mlQty}</span>
                    </div>
                  )}

                  {pumpQty > 0 && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-700 font-medium">ইলেকট্রিক পাম্প x {pumpQty}</span>
                      <span className="font-bold text-slate-900">৳{pricePump * pumpQty}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-1 text-emerald-700 font-bold">
                    <span>ডেলিভারি চার্জ (সিলেট শহর):</span>
                    <span>ফ্রি (৳০)</span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-cyan-800 font-bold block">মোট পরিশোধযোগ্য বিল:</span>
                    <span className="text-2xl font-black text-cyan-900">৳{totalAmount}</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold">
                    ক্যাশ অন ডেলিভারি
                  </span>
                </div>

                {/* Main Action 1: One Click Confirm Button */}
                <button
                  type="button"
                  disabled={isSubmitting || totalItemsCount === 0}
                  onClick={() => handlePlaceQuickOrder()}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-500 hover:to-cyan-600 text-white font-extrabold text-base shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                  <span>{isSubmitting ? 'অর্ডার জমা হচ্ছে...' : '🟢 এখনই অর্ডার কনফার্ম করুন'}</span>
                </button>

                {/* Secondary Option: Direct WhatsApp Order */}
                <button
                  type="button"
                  onClick={handleDirectWhatsAppOrder}
                  className="w-full py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                  <span>হোয়াটসঅ্যাপে এই অর্ডারটি পাঠান (+8801711102448)</span>
                </button>

                {/* Company Address & Hotline reassurance */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <p className="flex items-center gap-1.5 font-bold text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>কারখানা: মিরবক্সটুলা, সিলেট, বাংলাদেশ</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-500">
                    <Phone className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>হেল্পলাইন: +8801711102448 | miladdrinkingwater@gmail.com</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>১০০% বিএসটিআই ও আইএসও অনুমোদিত বিশুদ্ধ খাবার পানি</span>
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
