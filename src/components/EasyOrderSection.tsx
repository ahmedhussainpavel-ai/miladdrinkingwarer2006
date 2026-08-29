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
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createWhatsAppChatUrl } from '../lib/whatsapp';
import { generateOrderInvoicePDF } from '../lib/pdfGenerator';
import { trackPurchase, trackWhatsAppClick, trackPhoneCall } from '../lib/analytics';
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
  const [showOtherProducts, setShowOtherProducts] = useState<boolean>(false);

  // Customer Delivery Info (Sylhet)
  const [customerName, setCustomerName] = useState<string>(user?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState<string>(user?.phone || '');
  const [selectedArea, setSelectedArea] = useState<string>('মিরবক্সটুলা');
  const [addressDetails, setAddressDetails] = useState<string>('');
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
      showToast('error', 'মোবাইল নম্বর দিন', 'সঠিক মোবাইল নম্বর লিখুন (যেমন: 01711102448)।');
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

      // Track in GA4
      trackPurchase({
        orderId: newOrder.id || newOrder.invoiceNumber,
        value: totalAmount,
        paymentMethod: paymentOption,
        isSubscription: false,
        deliveryArea: selectedArea,
        items: itemsList,
      });

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

💵 মোট বিল: ৳${totalAmount} (ক্যাশ অন ডেলিভারি)
⏱️ ডেলিভারি: ${deliverySpeed === 'express' ? 'জরুরী ১ ঘণ্টার মধ্যে' : 'আজকের মধ্যেই'}

দয়া করে দ্রুত পানি পাঠানোর ব্যবস্থা করুন। ধন্যবাদ!`;

    trackWhatsAppClick('easy_order_section', 'instant_cart_summary');
    const waUrl = createWhatsAppChatUrl('+8801711102448', msg);
    window.open(waUrl, '_blank');
  };

  return (
    <section id="easy-order-section" className="py-10 sm:py-16 bg-gradient-to-b from-white via-cyan-50/20 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100/80 border border-cyan-200 text-cyan-900 text-xs sm:text-sm font-bold">
            <Sparkles className="w-4 h-4 text-cyan-700 animate-pulse" />
            <span>সিলেট শহরে দ্রুততম ১-২ ঘণ্টার মধ্যে হোম ডেলিভারি</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight">
            সহজ ৩টি ধাপে <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 via-teal-700 to-sky-700">খাবার পানি</span> অর্ডার করুন
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            কোনো জটিলতা নেই! নিচে সংখ্যা ঠিক করে আপনার ফোন নম্বর ও ঠিকানা দিলেই কারখানা থেকে ডেলিভারি বয় পানি নিয়ে পৌঁছাবে।
          </p>

          {/* Direct Support Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="tel:+8801711102448"
              onClick={() => trackPhoneCall('easy_order_direct_call', '+8801711102448')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>ফোনে কথা বলে অর্ডার: ০১৭১১-১০২৪৪৮</span>
            </a>

            <button
              onClick={handleDirectWhatsAppOrder}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-emerald-600 text-emerald-600" />
              <span>হোয়াটসঅ্যাপে পাঠান</span>
            </button>
          </div>
        </div>

        {/* If Order Placed Success View */}
        {orderCompleted ? (
          <div className="p-6 sm:p-10 rounded-3xl bg-white border-2 border-emerald-400 shadow-xl space-y-6 text-center animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                অর্ডার সফলভাবে গৃহীত হয়েছে ✅
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                ধন্যবাদ, {orderCompleted.customerName}!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                আপনার পানির অর্ডারটি (#<strong>{orderCompleted.invoiceNumber}</strong>) মিরবক্সটুলা কারখানা থেকে প্রস্তুত করা হচ্ছে। ডেলিভারি বয় আপনার সাথে মোবাইলে যোগাযোগ করবে।
              </p>
            </div>

            {/* Quick Summary Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-lg mx-auto text-xs space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-200 font-medium">
                <span className="text-slate-500">গ্রাহকের নাম ও ফোন:</span>
                <span className="text-slate-900 font-bold">{orderCompleted.customerName} ({orderCompleted.customerPhone})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 font-medium">
                <span className="text-slate-500">ডেলিভারি ঠিকানা:</span>
                <span className="text-slate-900 font-bold text-right">{orderCompleted.deliveryAddress.addressLine}, {orderCompleted.deliveryAddress.area}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 font-medium">
                <span className="text-slate-500">অর্ডারকৃত পণ্য:</span>
                <span className="text-slate-900 font-bold text-right">{orderCompleted.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold text-sm sm:text-base text-cyan-900">
                <span>মোট বিল (পানি বুঝে পেয়ে দিন):</span>
                <span className="text-emerald-700 font-black">৳{orderCompleted.totalAmount}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => generateOrderInvoicePDF(orderCompleted)}
                className="px-5 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
              >
                📄 ইনভয়েস / মেমো ডাউনলোড
              </button>

              <button
                onClick={() => {
                  setOrderCompleted(null);
                  setJar20LQty(2);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-all cursor-pointer"
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
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md shadow-slate-900/5 space-y-4">
                
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                    ১
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      কত জার পানি লাগবে বেছে নিন
                    </h3>
                    <p className="text-xs text-slate-500">
                      নিচের বাটনে চাপ দিয়ে সরাসরি সংখ্যা ঠিক করুন
                    </p>
                  </div>
                </div>

                {/* 20L Jar Selector (Primary Feature) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-50/80 via-sky-50/40 to-white border-2 border-cyan-300 space-y-4">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/20 shrink-0">
                        <Droplet className="w-6 h-6 fill-white" />
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900">
                          ২০ লিটার মিনারেল ওয়াটার জার
                        </h4>
                        <p className="text-xs font-bold text-cyan-800">
                          রিফিল মূল্য: ৳৮০ প্রতি জার (ফ্রি ডেলিভারি)
                        </p>
                      </div>
                    </div>

                    {/* Stepper Buttons */}
                    <div className="flex items-center self-start sm:self-auto gap-2 bg-white px-2 py-1.5 rounded-xl border border-cyan-300 shadow-xs">
                      <button
                        type="button"
                        onClick={() => setJar20LQty(Math.max(0, jar20LQty - 1))}
                        className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center font-extrabold text-lg transition-colors cursor-pointer"
                        title="কমান"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-black text-xl text-cyan-950">
                        {jar20LQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setJar20LQty(jar20LQty + 1)}
                        className="w-9 h-9 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center font-extrabold text-lg transition-colors shadow-xs cursor-pointer"
                        title="বাড়ান"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* One-Tap Quick Presets for Effortless Use */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                      দ্রুত সংখ্যা বাছুন (Quick Selection):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 5, 10].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setJar20LQty(num)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            jar20LQty === num
                              ? 'bg-cyan-700 text-white shadow-xs scale-105'
                              : 'bg-white text-slate-700 border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50'
                          }`}
                        >
                          {num}টি জার
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Empty Jar Exchange Toggle */}
                  {jar20LQty > 0 && (
                    <div className="pt-3 border-t border-cyan-200/80">
                      <p className="text-xs font-bold text-slate-800 mb-2">
                        আপনার কাছে কি খালি জার আছে?
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setHasEmptyJar(true)}
                          className={`p-3 rounded-xl border text-left font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                            hasEmptyJar 
                              ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950 shadow-xs' 
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${hasEmptyJar ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-400'}`}>
                            {hasEmptyJar && <Check className="w-3 h-3" />}
                          </span>
                          <div>
                            <span className="block font-bold">হ্যাঁ, খালি জার বদল করব</span>
                            <span className="text-[11px] font-normal text-emerald-700">কোনো জামানত লাগবে না (৳০)</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setHasEmptyJar(false)}
                          className={`p-3 rounded-xl border text-left font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                            !hasEmptyJar 
                              ? 'bg-amber-50/90 border-amber-500 text-amber-950 shadow-xs' 
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${!hasEmptyJar ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-400'}`}>
                            {!hasEmptyJar && <Check className="w-3 h-3" />}
                          </span>
                          <div>
                            <span className="block font-bold">না, নতুন জার কিনব</span>
                            <span className="text-[11px] font-normal text-amber-700">+৳২৫০ প্রতি জার জামানত</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Collapsible/Expandable Other Products */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowOtherProducts(!showOtherProducts)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                      <span>অন্যান্য পণ্য যোগ করতে চান? (৫ লিটার, ৫০০ মিলি, ইলেকট্রিক পাম্প)</span>
                    </span>
                    {showOtherProducts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showOtherProducts && (
                    <div className="space-y-2 mt-2 pt-2 border-t border-slate-100 animate-in fade-in">
                      
                      {/* 5L Bottle */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">৫ লিটার ফ্যামিলি বোতল</h5>
                          <p className="text-[11px] text-slate-500">৳৩৫ প্রতি বোতল</p>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                          <button
                            type="button"
                            onClick={() => setBottle5LQty(Math.max(0, bottle5LQty - 1))}
                            className="w-7 h-7 rounded bg-white text-slate-700 flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-bold text-xs">{bottle5LQty}</span>
                          <button
                            type="button"
                            onClick={() => setBottle5LQty(bottle5LQty + 1)}
                            className="w-7 h-7 rounded bg-cyan-600 text-white flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* 500ml Case */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">৫০০ মিলি বোতল (২৪ পিস কেস)</h5>
                          <p className="text-[11px] text-slate-500">৳৩৬০ প্রতি কেস (মেহমান ও ইভেন্টের জন্য)</p>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                          <button
                            type="button"
                            onClick={() => setCase500mlQty(Math.max(0, case500mlQty - 1))}
                            className="w-7 h-7 rounded bg-white text-slate-700 flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-bold text-xs">{case500mlQty}</span>
                          <button
                            type="button"
                            onClick={() => setCase500mlQty(case500mlQty + 1)}
                            className="w-7 h-7 rounded bg-cyan-600 text-white flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Electric Pump */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">অটোমেটিক ইলেকট্রিক রিচার্জেবল পাম্প</h5>
                          <p className="text-[11px] text-slate-500">৳৪৫০ (সহজে পানি ঢালার ডিসপেন্সার)</p>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                          <button
                            type="button"
                            onClick={() => setPumpQty(Math.max(0, pumpQty - 1))}
                            className="w-7 h-7 rounded bg-white text-slate-700 flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-bold text-xs">{pumpQty}</span>
                          <button
                            type="button"
                            onClick={() => setPumpQty(pumpQty + 1)}
                            className="w-7 h-7 rounded bg-cyan-600 text-white flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                    </div>
                  )}
                </div>

              </div>

              {/* STEP 2: আপনার নাম, মোবাইল ও সিলেটের ঠিকানা */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md shadow-slate-900/5 space-y-4">
                
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                    ২
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      আপনার নাম, মোবাইল ও ঠিকানা দিন
                    </h3>
                    <p className="text-xs text-slate-500">
                      সিলেটের যে ঠিকানায় ডেলিভারি বয় পানি পৌঁছে দেবে
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <span>আপনার নাম</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="যেমন: আহমেদ হোসেন"
                      className="w-full px-3.5 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-sm font-medium transition-all"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <span>মোবাইল নম্বর</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="01711102448"
                      className="w-full px-3.5 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-sm font-bold text-slate-900 transition-all"
                      required
                    />
                  </div>

                  {/* Sylhet Area Dropdown */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <span>সিলেটের এলাকা বাছুন</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-sm font-bold text-slate-900 bg-white transition-all cursor-pointer"
                    >
                      {sylhetAreas.map((ar) => (
                        <option key={ar} value={ar}>{ar}</option>
                      ))}
                    </select>
                  </div>

                  {/* Address Details */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <span>বাসা / রোড / ফ্ল্যাট বিস্তারিত</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressDetails}
                      onChange={(e) => setAddressDetails(e.target.value)}
                      placeholder="যেমন: বাড়ি ১২, রোড ৩, মিরবক্সটুলা (৪র্থ তলা)"
                      className="w-full px-3.5 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-sm font-medium transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Delivery Timing Options */}
                <div className="pt-2">
                  <label className="font-bold text-xs text-slate-700 block mb-2">
                    কখন ডেলিভারি চান?
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setDeliverySpeed('express')}
                      className={`p-2.5 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                        deliverySpeed === 'express' 
                          ? 'bg-cyan-50 border-cyan-500 text-cyan-900 shadow-xs' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="block text-cyan-700 font-bold">⚡ জরুরী</span>
                      <span className="text-[10px] font-medium text-slate-500">১ ঘণ্টার মধ্যে</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliverySpeed('today')}
                      className={`p-2.5 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                        deliverySpeed === 'today' 
                          ? 'bg-cyan-50 border-cyan-500 text-cyan-900 shadow-xs' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="block text-slate-800 font-bold">আজকের মধ্যে</span>
                      <span className="text-[10px] font-medium text-slate-500">সকাল - রাত ৮টা</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliverySpeed('tomorrow')}
                      className={`p-2.5 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                        deliverySpeed === 'tomorrow' 
                          ? 'bg-cyan-50 border-cyan-500 text-cyan-900 shadow-xs' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="block text-slate-800 font-bold">আগামীকাল</span>
                      <span className="text-[10px] font-medium text-slate-500">সকাল শিডিউল</span>
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
                  <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                    ৩
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      বিল ও অর্ডার নিশ্চিতকরণ
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
                        ২০ লিটার জার x {jar20LQty} {hasEmptyJar ? '(খালি জার বদল)' : '(নতুন জার জামানত)'}
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

                {/* Grand Total Display */}
                <div className="p-4 rounded-2xl bg-cyan-50/80 border border-cyan-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-cyan-800 font-bold block">মোট পরিশোধযোগ্য টাকা:</span>
                    <span className="text-2xl sm:text-3xl font-black text-cyan-950">৳{totalAmount}</span>
                  </div>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-600 text-white font-bold shadow-xs">
                    ক্যাশ অন ডেলিভারি
                  </span>
                </div>

                {/* Main Action 1: Instant Submit Order */}
                <button
                  type="button"
                  disabled={isSubmitting || totalItemsCount === 0}
                  onClick={() => handlePlaceQuickOrder()}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-500 hover:to-cyan-600 text-white font-black text-base shadow-lg shadow-emerald-700/25 hover:shadow-emerald-700/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>{isSubmitting ? 'অর্ডার জমা হচ্ছে...' : '🟢 সরাসরি অর্ডার কনফার্ম করুন'}</span>
                </button>

                {/* Secondary Option: Direct WhatsApp Order */}
                <button
                  type="button"
                  onClick={handleDirectWhatsAppOrder}
                  className="w-full py-3 rounded-2xl bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                  <span>হোয়াটসঅ্যাপে অর্ডার পাঠান (+8801711102448)</span>
                </button>

                {/* Factory Reassurance */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
                  <p className="flex items-center gap-1.5 font-bold text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>কারখানা: মিরবক্সটুলা, সিলেট, বাংলাদেশ</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-500">
                    <Phone className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>হটলাইন: 01711-102448 | miladdrinkingwater@gmail.com</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>১০০% বিএসটিআই অনুমোদিত বিশুদ্ধ মিষ্টি খাবার পানি</span>
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};

