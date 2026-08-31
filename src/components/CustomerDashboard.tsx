import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Wallet, 
  RotateCcw, 
  Calendar, 
  Package, 
  CheckCircle2, 
  Download, 
  Plus, 
  Pause, 
  Play, 
  X, 
  Truck, 
  Phone,
  Gift,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  Clock,
  Droplets,
  AlertCircle,
  MapPin,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';
import { generateOrderInvoicePDF } from '../lib/pdfGenerator';
import { Order, OrderStatus } from '../types';
import { ReferralProgramSection } from './ReferralProgramSection';

// --- Visual Progress Stepper Component ---
interface OrderProgressStepperProps {
  order: Order;
  language: 'bn' | 'en';
  formatDate: (dateStr: string) => string;
}

const OrderProgressStepper: React.FC<OrderProgressStepperProps> = ({ order, language, formatDate }) => {
  const isBn = language === 'bn';

  // Determine current step index (1-based: 1=Pending, 2=Preparing, 3=Out for Delivery, 4=Delivered)
  let activeStep = 1;
  if (order.status === 'cancelled') {
    activeStep = 0;
  } else if (order.status === 'pending') {
    activeStep = 1;
  } else if (order.status === 'confirmed' || order.status === 'sterilizing_bottling') {
    activeStep = 2;
  } else if (order.status === 'out_for_delivery') {
    activeStep = 3;
  } else if (order.status === 'delivered') {
    activeStep = 4;
  }

  const steps = [
    {
      step: 1,
      title: isBn ? 'অর্ডার গৃহীত' : 'Order Placed',
      desc: isBn ? 'অপেক্ষমাণ ও যাচাই' : 'Pending Verification',
      icon: Clock,
      statusKey: 'pending'
    },
    {
      step: 2,
      title: isBn ? 'প্রস্তুতকরণ' : 'Preparing & Bottling',
      desc: isBn ? 'ফিল্টারিং ও কোয়ালিটি চেক' : 'Sterilization & Filling',
      icon: Droplets,
      statusKey: 'sterilizing_bottling'
    },
    {
      step: 3,
      title: isBn ? 'ডেলিভারির পথে' : 'Out for Delivery',
      desc: isBn ? 'ডেলিভারি ভ্যানে অন-রুট' : 'On the Way',
      icon: Truck,
      statusKey: 'out_for_delivery'
    },
    {
      step: 4,
      title: isBn ? 'ডেলিভারি সম্পন্ন' : 'Delivered',
      desc: isBn ? 'সফলভাবে পৌঁছেছে' : 'Order Completed',
      icon: CheckCircle2,
      statusKey: 'delivered'
    }
  ];

  // Cancelled Order Banner
  if (order.status === 'cancelled') {
    return (
      <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800">
        <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
          <AlertCircle className="w-4 h-4 text-rose-600" />
        </div>
        <div className="text-xs">
          <p className="font-extrabold text-rose-900">
            {isBn ? 'এই অর্ডারটি বাতিল করা হয়েছে' : 'This order was cancelled'}
          </p>
          <p className="text-rose-700 mt-0.5">
            {isBn ? 'যেকোনো প্রয়োজনে আমাদের কাস্টমার সার্ভিসে যোগাযোগ করুন।' : 'Contact customer support if you have any questions.'}
          </p>
        </div>
      </div>
    );
  }

  // Calculate percentage width for the progress connecting bar
  const progressPercent = 
    activeStep === 1 ? 0 :
    activeStep === 2 ? 33.33 :
    activeStep === 3 ? 66.66 : 100;

  // Real-time descriptive message for current status
  const getStatusNarrative = () => {
    switch (order.status) {
      case 'pending':
        return isBn 
          ? 'আপনার অর্ডারটি সার্ভারে গ্রহণ করা হয়েছে। শিগগিরই ফ্যাক্টরি থেকে প্রস্তুত শুরু হবে।'
          : 'Order received and waiting for factory line confirmation.';
      case 'confirmed':
      case 'sterilizing_bottling':
        return isBn
          ? 'পানির কোয়ালিটি (TDS ও pH) পরীক্ষা শেষে ২০ লিটার জার জীবাণুমুক্ত করে সিল করা হচ্ছে।'
          : 'Pure water sterilization, automated bottling, and seal quality checks in progress.';
      case 'out_for_delivery':
        return isBn
          ? 'ডেলিভারি ভ্যানে লোড করে আপনার ঠিকানার উদ্দেশ্যে রওনা দেওয়া হয়েছে।'
          : 'Water jars dispatched on delivery vehicle and heading towards your location.';
      case 'delivered':
        return isBn
          ? 'অর্ডারটি সফলভাবে আপনার ঠিকানায় পৌঁছে দেওয়া হয়েছে। বিশুদ্ধ পানি উপভোগ করুন!'
          : 'Delivered safely to your address. Enjoy pure mineral water!';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Visual Stepper Bar */}
      <div className="relative">
        {/* Background Connecting Line */}
        <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-slate-100 -z-0 rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-sky-500 via-sky-600 to-emerald-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-2 relative z-10">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCompleted = activeStep > s.step || (activeStep === 4 && s.step === 4);
            const isCurrent = activeStep === s.step && activeStep !== 4;
            const isUpcoming = activeStep < s.step;

            return (
              <div 
                key={s.step} 
                className={`flex sm:flex-col items-center sm:text-center gap-3 sm:gap-1.5 p-2 sm:p-0 rounded-2xl transition-all ${
                  isCurrent ? 'bg-sky-50/70 sm:bg-transparent border border-sky-200 sm:border-0' : ''
                }`}
              >
                {/* Node Icon Circle */}
                <div 
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-bold transition-all shadow-xs ${
                    isCompleted 
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20 ring-2 ring-emerald-100'
                      : isCurrent
                      ? 'bg-sky-600 text-white ring-4 ring-sky-200 shadow-sky-600/30 animate-pulse'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted && s.step !== 4 ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Step Text Info */}
                <div className="min-w-0 flex-1 sm:flex-initial">
                  <div className="flex items-center sm:justify-center gap-1.5">
                    <p className={`text-xs font-bold truncate ${
                      isCompleted ? 'text-emerald-900' : isCurrent ? 'text-sky-900 font-extrabold' : 'text-slate-500'
                    }`}>
                      {s.title}
                    </p>
                    {isCurrent && (
                      <span className="inline-block px-1.5 py-0.2 rounded-full text-[9px] font-black bg-sky-600 text-white uppercase tracking-wider">
                        {isBn ? 'চলমান' : 'Live'}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Status Insight & Delivery Details Strip */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 to-sky-50/50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <div className={`w-2 h-2 rounded-full shrink-0 ${
            order.status === 'delivered' ? 'bg-emerald-500' : 'bg-sky-500 animate-ping'
          }`} />
          <p className="text-[11px] sm:text-xs font-medium text-slate-700 leading-snug">
            {getStatusNarrative()}
          </p>
        </div>

        {/* Driver contact if out for delivery */}
        {order.assignedDriver && (
          <div className="flex items-center gap-2 shrink-0 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <Truck className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-[11px] font-bold text-slate-800">{order.assignedDriver.name}</span>
            <a 
              href={`tel:${order.assignedDriver.phone}`}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px] transition-colors"
            >
              <Phone className="w-2.5 h-2.5" />
              <span>{isBn ? 'কল' : 'Call'}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export const CustomerDashboard: React.FC = () => {
  const { user, updateWalletBalance, removeSavedAddress } = useAuth();
  const { 
    orders, 
    subscriptions, 
    togglePauseSubscription, 
    cancelSubscription,
    promptLocationPicker, 
    setCurrentView,
    showToast
  } = useStore();
  const { language, t, formatCurrency, formatNumber, formatDate, translateStatus } = useLanguage();

  const [activeTab, setActiveTab] = useState<'overview' | 'subscriptions' | 'orders' | 'addresses' | 'referrals'>('overview');
  const [topupAmount, setTopupAmount] = useState<number>(500);
  const [showTopupModal, setShowTopupModal] = useState<boolean>(false);
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<'bkash' | 'nagad' | 'card'>('bkash');
  const [copiedCodeBanner, setCopiedCodeBanner] = useState<boolean>(false);

  // Filter orders and subscriptions for this user
  const userOrders = orders.filter(o => o.userId === user?.uid || (user?.phone && o.customerPhone === user.phone));
  const userSubscriptions = subscriptions.filter(s => s.userId === user?.uid);

  const activeSub = userSubscriptions.find(s => s.status === 'active' || s.status === 'paused');
  const activeOrder = userOrders.find(o => o.status !== 'delivered' && o.status !== 'cancelled') || userOrders[0];

  const handleWalletTopup = async () => {
    if (topupAmount <= 0) return;
    await updateWalletBalance(topupAmount);
    setShowTopupModal(false);
    showToast(
      'success', 
      language === 'bn' ? 'ওয়ালেট রিচার্জ সম্পন্ন!' : 'Wallet Top-Up Successful!', 
      language === 'bn' ? `${formatCurrency(topupAmount)} আপনার ওয়ালেটে যোগ হয়েছে।` : `${formatCurrency(topupAmount)} added to your wallet balance.`
    );
  };

  const handleCopyBannerCode = () => {
    const code = user?.referralCode || 'MILAD-SYLHET-50';
    navigator.clipboard.writeText(code);
    setCopiedCodeBanner(true);
    showToast(
      'success', 
      language === 'bn' ? 'কোড কপি হয়েছে!' : 'Code Copied!', 
      `${code}`
    );
    setTimeout(() => setCopiedCodeBanner(false), 2000);
  };

  const userInitial = user?.displayName ? user.displayName.trim().charAt(0).toUpperCase() : 'M';

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Profile Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user?.displayName || 'Customer'}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-sky-500/20 shadow-2xs"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-sky-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-2xs">
                {userInitial}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
                  {user?.displayName || (language === 'bn' ? 'সম্মানিত গ্রাহক' : 'Valued Customer')}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {t.verified}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {user?.phone || user?.email || '+880 1711-102448'} • {t.mirboxtula}
              </p>
            </div>
          </div>

          {/* Quick Metrics (Wallet & Empty Jars) */}
          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold">{t.dashboard.walletBalance}</p>
                <p className="text-lg font-black text-slate-900">{formatCurrency(user?.walletBalance || 0)}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowTopupModal(true)}
                className="ml-2 px-3 py-1.5 rounded-xl bg-white border border-sky-200 hover:bg-sky-600 hover:text-white text-sky-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                + {language === 'bn' ? 'রিচার্জ' : 'Top Up'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold">{t.dashboard.jarsAtHome}</p>
                <p className="text-lg font-black text-slate-900">{formatNumber(user?.emptyJarsHeld?.jar20L || 2)} {language === 'bn' ? 'টি' : 'jars'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
          {[
            { id: 'overview', label: t.dashboard.tabOverview },
            { id: 'subscriptions', label: t.dashboard.tabSubscriptions },
            { id: 'orders', label: t.dashboard.tabOrders },
            { id: 'addresses', label: t.dashboard.tabAddresses },
            { id: 'referrals', label: t.dashboard.tabReferrals },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-sky-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Active Order Live Tracker */}
            {activeOrder && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-sky-600" />
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                        {t.dashboard.liveDeliveryTracking} (#{activeOrder.invoiceNumber})
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {formatDate(activeOrder.createdAt)} • {activeOrder.timeSlot}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    activeOrder.status === 'delivered' 
                      ? 'bg-emerald-100 text-emerald-800'
                      : activeOrder.status === 'cancelled'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-sky-100 text-sky-900'
                  }`}>
                    {translateStatus(activeOrder.status)}
                  </span>
                </div>

                {/* Visual Progress Stepper */}
                <div className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-100">
                  <OrderProgressStepper 
                    order={activeOrder} 
                    language={language} 
                    formatDate={formatDate} 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-slate-400 font-semibold">{language === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Address'}</p>
                    <p className="font-bold text-slate-800 mt-0.5 truncate">{activeOrder.deliveryAddress.addressLine}, {activeOrder.deliveryAddress.area}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-slate-400 font-semibold">{language === 'bn' ? 'ডেলিভারি সময়' : 'Time Slot'}</p>
                    <p className="font-bold text-slate-800 mt-0.5">{activeOrder.timeSlot}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 font-semibold">{language === 'bn' ? 'মোট প্রদেয়' : 'Total Payable'}</p>
                      <p className="font-black text-slate-900 text-sm">{formatCurrency(activeOrder.totalAmount)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => generateOrderInvoicePDF(activeOrder)}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
                      title={t.dashboard.invoiceBtn}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* Active Subscription Status */}
            {activeSub ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      {t.dashboard.activeSubscription}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    activeSub.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {activeSub.status === 'active' ? t.active : t.paused}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{activeSub.planName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {activeSub.deliveryDays.join(', ')} • {activeSub.timeSlot}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => togglePauseSubscription(activeSub.id)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      {activeSub.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{activeSub.status === 'active' ? (language === 'bn' ? 'সাময়িক বন্ধ করুন' : 'Pause Plan') : (language === 'bn' ? 'চালু করুন' : 'Resume Plan')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => cancelSubscription(activeSub.id)}
                      className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 cursor-pointer"
                    >
                      {language === 'bn' ? 'বাতিল' : 'Cancel'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 text-center space-y-3">
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {language === 'bn' ? 'আপনার কোনো সক্রিয় মাসিক সাবস্ক্রিপশন নেই।' : 'You do not have any active subscriptions yet.'}
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentView('subscriptions')}
                  className="py-2.5 px-5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold cursor-pointer"
                >
                  {language === 'bn' ? 'মাসিক প্যাকেজ দেখুন' : 'Explore Monthly Plans'}
                </button>
              </div>
            )}

            {/* Referrals Banner in Overview */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/30 text-sky-300 border border-sky-400/30">
                  {t.referrals.badge}
                </span>
                <h4 className="text-base font-extrabold mt-1">{t.referrals.title}</h4>
                <p className="text-xs text-slate-300 max-w-md mt-0.5">{t.referrals.subtitle}</p>
              </div>

              <button
                type="button"
                onClick={handleCopyBannerCode}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white text-slate-900 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-xs"
              >
                {copiedCodeBanner ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-sky-600" />}
                <span>{user?.referralCode || 'MILAD-SYLHET-50'}</span>
              </button>
            </div>

          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-5">
            {userOrders.length > 0 ? (
              userOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-5">
                  
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-black text-sm">
                        #{order.invoiceNumber ? order.invoiceNumber.slice(-4) : 'ORD'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-base">#{order.invoiceNumber}</span>
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                            order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.paymentStatus === 'paid' ? (language === 'bn' ? 'পরিশোধিত' : 'Paid') : (language === 'bn' ? 'বকেয়া' : 'Unpaid')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                          <span>{formatDate(order.createdAt)}</span>
                          <span>•</span>
                          <span>{order.timeSlot}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="text-right">
                        <p className="text-[11px] text-slate-400 font-semibold">{language === 'bn' ? 'মোট বিল' : 'Total'}</p>
                        <p className="font-black text-slate-900 text-base">{formatCurrency(order.totalAmount)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                        order.status === 'delivered' 
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}>
                        {translateStatus(order.status)}
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Stepper */}
                  <div className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-sky-600" />
                        <span>{language === 'bn' ? 'রিয়েল-টাইম অর্ডার অগ্রগতি' : 'Real-Time Order Progress'}</span>
                      </h4>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {language === 'bn' ? 'লাইভ ট্র্যাকিং' : 'Live Tracking'}
                      </span>
                    </div>
                    <OrderProgressStepper 
                      order={order} 
                      language={language} 
                      formatDate={formatDate} 
                    />
                  </div>

                  {/* Items List */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      {language === 'bn' ? 'অর্ডারকৃত আইটেমসমূহ' : 'Ordered Items'}
                    </p>
                    <div className="divide-y divide-slate-200/60">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between py-1.5 text-xs">
                          <span className="font-medium text-slate-700">
                            {item.name} <span className="text-slate-400 font-bold">x {formatNumber(item.quantity)}</span>
                          </span>
                          <span className="font-bold text-slate-900">{formatCurrency(item.totalPrice)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer with Address & Invoice Button */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <p className="text-xs truncate max-w-md">
                        <span className="font-bold text-slate-800">{order.deliveryAddress.recipientName}: </span>
                        {order.deliveryAddress.addressLine}, {order.deliveryAddress.area}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => generateOrderInvoicePDF(order)}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors self-end sm:self-auto"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.dashboard.invoiceBtn}</span>
                    </button>
                  </div>

                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center text-xs text-slate-500">
                {t.dashboard.noOrdersFound}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Subscriptions */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-4">
            {userSubscriptions.length > 0 ? (
              userSubscriptions.map((sub) => (
                <div key={sub.id} className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="text-sm font-extrabold text-slate-900">{sub.planName}</h4>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {sub.status === 'active' ? t.active : t.paused}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{sub.deliveryDays.join(', ')} • {sub.timeSlot}</p>
                  <p className="text-xs font-bold text-slate-900">{formatCurrency(sub.monthlyEstimate)} / {language === 'bn' ? 'মাসিক' : 'Month'}</p>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
                <p className="text-xs text-slate-500">{language === 'bn' ? 'কোনো সাবস্ক্রিপশন পাওয়া যায়নি।' : 'No subscriptions found.'}</p>
                <button
                  type="button"
                  onClick={() => setCurrentView('subscriptions')}
                  className="px-4 py-2 rounded-xl bg-sky-700 text-white text-xs font-bold cursor-pointer"
                >
                  {language === 'bn' ? 'সাবস্ক্রিপশন শুরু করুন' : 'Start Subscription'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-slate-900">{t.dashboard.tabAddresses}</h3>
              <button
                type="button"
                onClick={() => promptLocationPicker(() => {})}
                className="px-3 py-1.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.dashboard.addAddressBtn}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(user?.savedAddresses || []).map((addr) => (
                <div key={addr.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">{addr.tag}</span>
                    <button
                      type="button"
                      onClick={() => removeSavedAddress(addr.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs font-bold text-slate-900">{addr.recipientName} ({addr.phone})</p>
                  <p className="text-xs text-slate-600">{addr.addressLine}, {addr.area}, {addr.city}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Referrals */}
        {activeTab === 'referrals' && (
          <ReferralProgramSection />
        )}

      </div>

      {/* Top-up Wallet Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">{t.dashboard.topUpWallet}</h3>
              <button onClick={() => setShowTopupModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Amount Options */}
            <div className="grid grid-cols-3 gap-2">
              {[200, 500, 1000].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTopupAmount(amt)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    topupAmount === amt
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {formatCurrency(amt)}
                </button>
              ))}
            </div>

            <input
              type="number"
              value={topupAmount}
              onChange={(e) => setTopupAmount(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:border-sky-500"
            />

            <button
              type="button"
              onClick={handleWalletTopup}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm cursor-pointer shadow-xs transition-all"
            >
              {language === 'bn' ? `${formatCurrency(topupAmount)} রিচার্জ নিশ্চিত করুন` : `Confirm Recharge ${formatCurrency(topupAmount)}`}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
