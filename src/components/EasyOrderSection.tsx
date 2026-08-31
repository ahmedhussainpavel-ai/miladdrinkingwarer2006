import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Droplet, 
  CheckCircle2, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Check, 
  Sparkles,
  ArrowRight,
  Clock,
  PhoneCall,
  Download,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createWhatsAppChatUrl } from '../lib/whatsapp';
import { generateOrderInvoicePDF } from '../lib/pdfGenerator';
import { trackPurchase, trackWhatsAppClick, trackPhoneCall } from '../lib/analytics';
import { Order } from '../types';

export const EasyOrderSection: React.FC = () => {
  const { products, createOrder, showToast, setCurrentView } = useStore();
  const { user, loginWithPhoneAndName } = useAuth();
  const { language, t, formatCurrency, formatNumber } = useLanguage();

  // Water Quantities
  const [jar20LQty, setJar20LQty] = useState<number>(2);
  const [hasEmptyJar, setHasEmptyJar] = useState<boolean>(true);
  const [bottle5LQty, setBottle5LQty] = useState<number>(0);
  const [pumpQty, setPumpQty] = useState<number>(0);

  // Customer Delivery Info (Sylhet)
  const [customerName, setCustomerName] = useState<string>(user?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState<string>(user?.phone || '');
  const [selectedArea, setSelectedArea] = useState<string>(language === 'bn' ? 'মিরবক্সটুলা' : 'Mirboxtula');
  const [addressDetails, setAddressDetails] = useState<string>('');
  const [timeSlotChoice, setTimeSlotChoice] = useState<'morning' | 'noon' | 'evening' | 'custom'>('morning');
  const [paymentOption, setPaymentOption] = useState<'cod' | 'bkash' | 'wallet'>('cod');
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderCompleted, setOrderCompleted] = useState<Order | null>(null);

  // Dynamic Pricing calculations from Admin-controlled products
  const prod20L = products.find(p => p.id === 'prod-20l-jar' || p.category === 'water_jar');
  const prod5L = products.find(p => p.id === 'prod-5l-bottle' || p.category === 'water_bottle');
  const prodPump = products.find(p => p.id === 'prod-electric-pump' || p.category === 'dispenser');

  const price20L = prod20L ? prod20L.price : 0;
  const depositPerJar = prod20L ? (prod20L.jarDeposit || 0) : 0;
  const price5L = prod5L ? prod5L.price : 0;
  const pricePump = prodPump ? prodPump.price : 0;

  const waterCost = (jar20LQty * price20L) + (bottle5LQty * price5L);
  const pumpCost = pumpQty * pricePump;
  const depositCost = !hasEmptyJar ? (jar20LQty * depositPerJar) : 0;
  const totalAmount = waterCost + pumpCost + depositCost;

  const totalItemsCount = jar20LQty + bottle5LQty + pumpQty;

  const sylhetAreasBn = [
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
    'রিকাবীবাজার',
    'মাইজগাঁও',
    'শাহপরান'
  ];

  const sylhetAreasEn = [
    'Mirboxtula',
    'Zindabazar',
    'Amberkhana',
    'Dargah Gate',
    'Chouhatta',
    'Shibganj',
    'Tilagarh',
    'Lamabazar',
    'Kumarpara',
    'Upashahar',
    'Subidbazar',
    'Madina Market',
    'South Surma',
    'Kodomtoli',
    'Pathantula',
    'Rikabibazar',
    'Maizgaon',
    'Shah Paran'
  ];

  const sylhetAreas = language === 'bn' ? sylhetAreasBn : sylhetAreasEn;

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (totalItemsCount === 0) {
      showToast(
        'error', 
        language === 'bn' ? 'পরিমাণ নির্বাচন করুন' : 'Select Quantity', 
        language === 'bn' ? 'কমপক্ষে ১টি ২০ লিটার জার বা বোতল নির্বাচন করুন।' : 'Please select at least 1 jar or item.'
      );
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 9) {
      showToast(
        'error', 
        language === 'bn' ? 'সঠিক ফোন নম্বর প্রয়োজন' : 'Valid Phone Required', 
        language === 'bn' ? 'অনুগ্রহ করে আপনার সচল মোবাইল নম্বর দিন।' : 'Please enter your active mobile number.'
      );
      return;
    }

    if (!addressDetails.trim()) {
      showToast(
        'error', 
        language === 'bn' ? 'ঠিকানা লিখুন' : 'Address Required', 
        language === 'bn' ? 'বাসা নম্বর, তলা বা রোডের নাম লিখুন।' : 'Please provide your house, road or floor details.'
      );
      return;
    }

    setIsSubmitting(true);

    const items = [];
    if (jar20LQty > 0) {
      items.push({
        productId: 'prod-20l-jar',
        name: language === 'bn' ? '২০ লিটার মিনারেল ওয়াটার জার' : '20L Mineral Water Jar',
        volume: '20L',
        quantity: jar20LQty,
        unitPrice: price20L,
        jarDepositPaid: !hasEmptyJar ? depositPerJar * jar20LQty : 0,
        emptyJarsToReturn: hasEmptyJar ? jar20LQty : 0,
        totalPrice: (price20L * jar20LQty) + (!hasEmptyJar ? depositPerJar * jar20LQty : 0)
      });
    }

    if (bottle5LQty > 0) {
      items.push({
        productId: 'prod-5l-bottle',
        name: language === 'bn' ? '৫ লিটার হ্যান্ডেল বোতল' : '5L Handle Water Bottle',
        volume: '5L',
        quantity: bottle5LQty,
        unitPrice: price5L,
        jarDepositPaid: 0,
        emptyJarsToReturn: 0,
        totalPrice: price5L * bottle5LQty
      });
    }

    if (pumpQty > 0) {
      items.push({
        productId: 'prod-electric-pump',
        name: language === 'bn' ? 'অটোমেটিক ইলেকট্রিক জার পাম্প' : 'Automatic Electric Jar Pump',
        volume: 'Universal',
        quantity: pumpQty,
        unitPrice: pricePump,
        jarDepositPaid: 0,
        emptyJarsToReturn: 0,
        totalPrice: pricePump * pumpQty
      });
    }

    const timeSlotLabel = t.timeSlots[timeSlotChoice];

    try {
      let activeUserId = user?.uid;
      let activeUserEmail = user?.email || '';

      // Auto create fresh customer account if not logged in
      if (!user && customerPhone) {
        try {
          const newProfile = await loginWithPhoneAndName(
            customerName.trim() || 'সম্মানিত গ্রাহক',
            customerPhone.trim(),
            selectedArea,
            addressDetails.trim()
          );
          activeUserId = newProfile.uid;
          activeUserEmail = newProfile.email;
        } catch (e) {
          console.warn('Auto signup notice:', e);
        }
      }

      const newOrder = await createOrder({
        userId: activeUserId || 'guest-' + Date.now(),
        customerName: customerName.trim() || (language === 'bn' ? 'সম্মানিত গ্রাহক' : 'Valued Customer'),
        customerPhone: customerPhone.trim(),
        customerEmail: activeUserEmail,
        type: 'one_time',
        items,
        subtotal: waterCost + pumpCost,
        depositTotal: depositCost,
        deliveryFee: 0,
        discount: 0,
        totalAmount,
        deliveryAddress: {
          id: 'addr-' + Date.now(),
          tag: 'Home',
          recipientName: customerName.trim() || (language === 'bn' ? 'সম্মানিত গ্রাহক' : 'Customer'),
          phone: customerPhone.trim(),
          addressLine: addressDetails.trim(),
          area: selectedArea,
          city: language === 'bn' ? 'সিলেট' : 'Sylhet',
          postalCode: '3100',
          lat: 24.8949,
          lng: 91.8687,
          isDefault: true
        },
        deliveryDate: 'Today',
        timeSlot: timeSlotLabel,
        deliveryZone: `${selectedArea} ${language === 'bn' ? 'ডেলিভারি হাব' : 'Delivery Hub'}`,
        paymentMethod: paymentOption,
        paymentStatus: paymentOption === 'wallet' ? 'paid' : 'unpaid',
        status: 'pending',
        emptyJarsReturnedCount: hasEmptyJar ? jar20LQty : 0
      });

      setOrderCompleted(newOrder);
      trackPurchase({
        orderId: newOrder.id,
        value: newOrder.totalAmount,
        paymentMethod: newOrder.paymentMethod,
        deliveryArea: newOrder.deliveryAddress.area,
        items: newOrder.items
      });

      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (err) {
        // ignore
      }

    } catch (error) {
      showToast('error', 'Error', 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (orderCompleted) {
      generateOrderInvoicePDF(orderCompleted);
    }
  };

  return (
    <section id="easy-order-section" className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-900 text-xs font-bold border border-sky-200">
            <Droplet className="w-3.5 h-3.5 text-sky-700" />
            <span>{t.easyOrder.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
            {t.easyOrder.title}
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            {t.easyOrder.subtitle}
          </p>
        </div>

        {orderCompleted ? (
          /* Order Success State */
          <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-emerald-200 shadow-sm text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {t.easyOrder.successTitle}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t.easyOrder.successMessage}
              </p>
            </div>

            {/* Invoice Pill */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 max-w-md mx-auto flex items-center justify-between text-left">
              <div>
                <p className="text-xs text-slate-500 font-semibold">{language === 'bn' ? 'ইনভয়েস নম্বর' : 'Invoice Number'}</p>
                <p className="text-sm font-extrabold text-slate-900">{orderCompleted.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-semibold">{language === 'bn' ? 'মোট প্রদেয়' : 'Total Amount'}</p>
                <p className="text-base font-black text-sky-700">{formatCurrency(orderCompleted.totalAmount)}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
              <button
                onClick={handleDownloadInvoice}
                className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-all"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>{language === 'bn' ? 'ইনভয়েস ডাউনলোড (PDF)' : 'Download PDF Invoice'}</span>
              </button>

              <button
                onClick={() => {
                  setOrderCompleted(null);
                  setCurrentView('customer_portal');
                }}
                className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-sky-700 hover:bg-sky-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
              >
                <span>{t.easyOrder.trackOrderBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          /* Main Easy Order Form */
          <form onSubmit={handleOrderSubmit} className="space-y-6">
            
            {/* Step 1: Water Selection */}
            <div className="bg-slate-50 rounded-3xl p-5 sm:p-7 border border-slate-200/90 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs flex items-center justify-center font-black">1</span>
                  <span>{t.easyOrder.step1Label}</span>
                </span>
                <span className="text-xs text-sky-800 font-bold bg-sky-100 px-2.5 py-1 rounded-full">
                  {t.freeDelivery}
                </span>
              </div>

              {/* 20L Main Refill Option */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900">{t.easyOrder.jar20LTitle}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{t.easyOrder.jar20LDesc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base sm:text-lg font-black text-sky-700">{formatCurrency(price20L)}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{t.perJar}</p>
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700">{language === 'bn' ? 'জারের সংখ্যা:' : 'Jar Count:'}</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setJar20LQty(Math.max(0, jar20LQty - 1))}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-black text-slate-900">
                      {formatNumber(jar20LQty)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setJar20LQty(jar20LQty + 1)}
                      className="w-8 h-8 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Empty Jar Exchange Switch */}
                {jar20LQty > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{t.easyOrder.exchangeToggleLabel}</span>
                      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setHasEmptyJar(true)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            hasEmptyJar ? 'bg-sky-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {language === 'bn' ? 'হ্যাঁ (৳০ জামানত)' : 'Yes (৳0 Deposit)'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setHasEmptyJar(false)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            !hasEmptyJar ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {language === 'bn' ? 'না (+৳২০০)' : 'No (+৳200)'}
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {hasEmptyJar ? t.easyOrder.exchangeDepositNote : (language === 'bn' ? 'নতুন জার নিলে ফেরতযোগ্য জামানত প্রতি জার ৳২০০ যুক্ত হবে।' : 'Refundable jar security deposit ৳200/jar added.')}
                    </p>
                  </div>
                )}
              </div>

              {/* 5L Option & Electric Pump Addon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 5L Handle Bottle */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-900">{t.easyOrder.bottle5LTitle}</h5>
                    <p className="text-[11px] text-teal-700 font-bold">{formatCurrency(price5L)} / {language === 'bn' ? 'বোতল' : 'bottle'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBottle5LQty(Math.max(0, bottle5LQty - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{formatNumber(bottle5LQty)}</span>
                    <button
                      type="button"
                      onClick={() => setBottle5LQty(bottle5LQty + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Electric Pump Addon */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-900">{t.easyOrder.pumpAddonTitle}</h5>
                    <p className="text-[11px] text-sky-700 font-bold">{formatCurrency(pricePump)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPumpQty(Math.max(0, pumpQty - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{formatNumber(pumpQty)}</span>
                    <button
                      type="button"
                      onClick={() => setPumpQty(pumpQty + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Step 2: Customer Delivery Address */}
            <div className="bg-slate-50 rounded-3xl p-5 sm:p-7 border border-slate-200/90 space-y-4">
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-200">
                <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs flex items-center justify-center font-black">2</span>
                <span>{t.easyOrder.step2Label}</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {language === 'bn' ? 'আপনার নাম' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t.easyOrder.namePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-xs sm:text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {language === 'bn' ? 'মোবাইল নম্বর (জরুরি)' : 'Phone Number (Required)'} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder={t.easyOrder.phonePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-xs sm:text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.easyOrder.areaLabel} *
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-xs sm:text-sm font-bold text-slate-800 cursor-pointer"
                >
                  {sylhetAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'bn' ? 'বিস্তারিত ঠিকানা (বাসা নং, রোড, তলা)' : 'Detailed Address (House, Road, Floor)'} *
                </label>
                <textarea
                  required
                  rows={2}
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  placeholder={t.easyOrder.addressPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-xs sm:text-sm font-medium resize-none"
                />
              </div>

            </div>

            {/* Step 3: Delivery Time & Payment */}
            <div className="bg-slate-50 rounded-3xl p-5 sm:p-7 border border-slate-200/90 space-y-4">
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-200">
                <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs flex items-center justify-center font-black">3</span>
                <span>{t.easyOrder.step3Label}</span>
              </span>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {t.easyOrder.timeSlotLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['morning', 'noon', 'evening', 'custom'] as const).map((slotKey) => (
                    <button
                      key={slotKey}
                      type="button"
                      onClick={() => setTimeSlotChoice(slotKey)}
                      className={`p-2.5 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer ${
                        timeSlotChoice === slotKey
                          ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {t.timeSlots[slotKey]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {t.easyOrder.paymentMethodLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentOption('cod')}
                    className={`p-3 rounded-2xl text-left border flex items-center gap-2.5 cursor-pointer transition-all ${
                      paymentOption === 'cod'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-500'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                      {paymentOption === 'cod' && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                    </div>
                    <span className="text-xs font-bold">{t.easyOrder.codLabel}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentOption('bkash')}
                    className={`p-3 rounded-2xl text-left border flex items-center gap-2.5 cursor-pointer transition-all ${
                      paymentOption === 'bkash'
                        ? 'bg-rose-50 border-rose-500 text-rose-950 font-bold ring-1 ring-rose-500'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                      {paymentOption === 'bkash' && <div className="w-2 h-2 rounded-full bg-rose-600" />}
                    </div>
                    <span className="text-xs font-bold">{t.easyOrder.bkashLabel}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentOption('wallet')}
                    className={`p-3 rounded-2xl text-left border flex items-center gap-2.5 cursor-pointer transition-all ${
                      paymentOption === 'wallet'
                        ? 'bg-sky-50 border-sky-500 text-sky-950 font-bold ring-1 ring-sky-500'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                      {paymentOption === 'wallet' && <div className="w-2 h-2 rounded-full bg-sky-600" />}
                    </div>
                    <span className="text-xs font-bold">{t.easyOrder.walletLabel}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Bill Summary & Confirmation CTA */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t.easyOrder.orderSummaryTitle}</span>
                <span className="text-xs font-bold text-emerald-400">{t.freeDelivery}</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>{t.easyOrder.waterCost} ({formatNumber(jar20LQty + bottle5LQty)} {language === 'bn' ? 'বোতল' : 'bottles'})</span>
                  <span className="font-bold text-white">{formatCurrency(waterCost)}</span>
                </div>
                {depositCost > 0 && (
                  <div className="flex justify-between text-amber-300">
                    <span>{t.easyOrder.jarDepositFee} ({formatNumber(jar20LQty)}x ৳২০০)</span>
                    <span className="font-bold">{formatCurrency(depositCost)}</span>
                  </div>
                )}
                {pumpCost > 0 && (
                  <div className="flex justify-between">
                    <span>{t.easyOrder.pumpCost}</span>
                    <span className="font-bold text-white">{formatCurrency(pumpCost)}</span>
                  </div>
                )}
                <div className="flex justify-between text-emerald-400">
                  <span>{t.deliveryFee}</span>
                  <span className="font-bold">{language === 'bn' ? 'ফ্রি (৳০)' : 'Free (৳0)'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">{t.easyOrder.netPayable}</p>
                  <p className="text-2xl font-black text-white">{formatCurrency(totalAmount)}</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || totalItemsCount === 0}
                  className="py-3.5 px-6 sm:px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-50 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>{t.loading}</span>
                  ) : (
                    <>
                      <span>{t.easyOrder.placeOrderBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>

          </form>
        )}

      </div>
    </section>
  );
};
