import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
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
  ArrowRight
} from 'lucide-react';
import { generateOrderInvoicePDF } from '../lib/pdfGenerator';
import { Order, OrderStatus } from '../types';
import { ReferralProgramSection } from './ReferralProgramSection';

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
    showToast('success', 'ওয়ালেট রিচার্জ সম্পন্ন!', `৳${topupAmount} আপনার ওয়ালেটে যোগ হয়েছে।`);
  };

  const handleCopyBannerCode = () => {
    const code = user?.referralCode || 'MILAD-AHMED-88';
    navigator.clipboard.writeText(code);
    setCopiedCodeBanner(true);
    showToast('success', 'কোড কপি হয়েছে!', `${code} ক্লিপবোর্ডে কপি করা হয়েছে।`);
    setTimeout(() => setCopiedCodeBanner(false), 2000);
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 1;
      case 'confirmed': return 2;
      case 'sterilizing_bottling': return 3;
      case 'out_for_delivery': return 4;
      case 'delivered': return 5;
      default: return 1;
    }
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
                alt={user?.displayName || 'গ্রাহক'}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/20 shadow-2xs"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-cyan-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-2xs">
                {userInitial}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
                  {user?.displayName || 'সম্মানিত গ্রাহক'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 text-[10px] font-bold">
                  যাচাইকৃত গ্রাহক
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{user?.email || 'সিলেট ডেলিভারি হাব'} • {user?.phone || '০১৭xxxxxxxx'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowTopupModal(true)}
              className="px-4 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              <span>ওয়ালেট রিচার্জ (৳{user?.walletBalance || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('products')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-cyan-700" />
              <span>নতুন পানি অর্ডার</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Empty Jars Held */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2 relative">
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider">সংরক্ষিত খালি জার</span>
              <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700">
                <RotateCcw className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-heading">
                {user?.emptyJarsHeld.jar20L || 0}
              </span>
              <span className="text-xs text-slate-600 font-bold">টি ২০ লিটার জার</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              পরবর্তী অর্ডারে জামানত ছাড়া ১:১ বদলযোগ্য
            </p>
          </div>

          {/* Wallet Balance */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2 relative">
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider">ওয়ালেট ব্যালেন্স</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 font-heading">
                ৳{user?.walletBalance || 0}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              সাবস্ক্রিপশন ও অর্ডারে সরাসরি স্বয়ংক্রিয় পেমেন্ট
            </p>
          </div>

          {/* Active Subscriptions */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2 relative">
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider">সক্রিয় সাবস্ক্রিপশন</span>
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 font-heading">
                {activeSub ? (activeSub.status === 'active' ? 'চলমান' : 'স্থগিত') : 'নেই'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {activeSub ? `পরবর্তী ডেলিভারি: ${activeSub.nextDeliveryDate}` : 'কোনো নিয়মিত সাপ্তাহিক প্ল্যান নেই'}
            </p>
          </div>

          {/* Completed Orders */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2 relative">
            <div className="flex items-center justify-between text-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider">মোট সম্পন্ন অর্ডার</span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-heading">
                {userOrders.length}
              </span>
              <span className="text-xs text-slate-600 font-bold">টি ডেলিভারি</span>
            </div>
            <p className="text-[11px] text-slate-500">
              সর্বমোট নিরাপদ পানি সরবরাহ গ্রহণ
            </p>
          </div>

        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview' 
                ? 'bg-cyan-700 text-white shadow-2xs' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            সারসংক্ষেপ ও লাইভ ট্র্যাকিং
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'subscriptions' 
                ? 'bg-cyan-700 text-white shadow-2xs' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>আমার সাবস্ক্রিপশন</span>
            {userSubscriptions.length > 0 && (
              <span className="px-1.5 py-0.2 bg-white/20 text-white rounded-full text-[10px] font-bold">{userSubscriptions.length}</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'orders' 
                ? 'bg-cyan-700 text-white shadow-2xs' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>অর্ডার ইতিহাস ও ইনভয়েস</span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold">{userOrders.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'addresses' 
                ? 'bg-cyan-700 text-white shadow-2xs' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            ডেলিভারি ঠিকানা
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('referrals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'referrals' 
                ? 'bg-amber-500 text-slate-950 shadow-2xs font-extrabold' 
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>রেফার করুন ও ৫০ টাকা বোনাস পান</span>
          </button>
        </div>

        {/* Tab 1: Overview & Live Delivery Tracking */}
        {activeTab === 'overview' && (
          <div className="space-y-6">

            {/* Quick Referral Banner */}
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-7 text-white border border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>রেফারেল অফার</span>
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-extrabold text-white">
                  বন্ধুদের রেফার করে জিতে নিন ফ্রি ওয়ালেট ব্যালেন্স
                </h3>
                <p className="text-xs text-slate-300">
                  আপনার রেফারেল কোড ব্যবহার করে প্রথম অর্ডারে বন্ধু পাবেন ৫০ টাকা ছাড়, এবং ডেলিভারি সম্পন্ন হলে আপনার ওয়ালেটেও যোগ হবে ৫০ টাকা।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-300 tracking-wider">
                    {user?.referralCode || 'MILAD-AHMED-88'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyBannerCode}
                    className="text-slate-300 hover:text-white p-1 cursor-pointer"
                    title="কপি করুন"
                  >
                    {copiedCodeBanner ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('referrals')}
                  className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>রেফারেল হাব দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            {/* Live Delivery Stepper Card */}
            {activeOrder && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xs border border-slate-200 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider">
                      লাইভ ডেলিভারি স্ট্যাটাস ট্র্যাকার
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      মেমো #{activeOrder.invoiceNumber} ({activeOrder.items[0]?.name})
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => generateOrderInvoicePDF(activeOrder)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-700" />
                      <span>ইনভয়েস PDF ডাউনলোড</span>
                    </button>
                  </div>
                </div>

                {/* Stepper Graphic */}
                <div className="py-2">
                  <div className="grid grid-cols-5 gap-2 relative">
                    
                    {/* Connecting Bar */}
                    <div className="absolute top-4 left-6 right-6 h-1 bg-slate-200 -z-0">
                      <div 
                        className="h-full bg-cyan-700 transition-all duration-500"
                        style={{ width: `${((getStatusStepIndex(activeOrder.status) - 1) / 4) * 100}%` }}
                      />
                    </div>

                    {/* Step 1: Placed */}
                    <div className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        getStatusStepIndex(activeOrder.status) >= 1 ? 'bg-cyan-700 text-white ring-4 ring-cyan-100' : 'bg-slate-200 text-slate-500'
                      }`}>
                        ১
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 mt-2">অর্ডার গ্রহণ</p>
                      <p className="text-[9px] text-slate-400">নিশ্চিতকরণের অপেক্ষায়</p>
                    </div>

                    {/* Step 2: Confirmed */}
                    <div className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        getStatusStepIndex(activeOrder.status) >= 2 ? 'bg-cyan-700 text-white ring-4 ring-cyan-100' : 'bg-slate-200 text-slate-500'
                      }`}>
                        ২
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 mt-2">কনফার্মড</p>
                      <p className="text-[9px] text-slate-400">সিরিয়ালে অন্তর্ভুক্ত</p>
                    </div>

                    {/* Step 3: Sterilizing & Bottling */}
                    <div className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        getStatusStepIndex(activeOrder.status) >= 3 ? 'bg-cyan-700 text-white ring-4 ring-cyan-100' : 'bg-slate-200 text-slate-500'
                      }`}>
                        ৩
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 mt-2">রিফিল ও সিলিং</p>
                      <p className="text-[9px] text-slate-400">জীবাণুমুক্তকরণ সম্পন্ন</p>
                    </div>

                    {/* Step 4: Out for delivery */}
                    <div className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        getStatusStepIndex(activeOrder.status) >= 4 ? 'bg-cyan-700 text-white ring-4 ring-cyan-100 animate-pulse' : 'bg-slate-200 text-slate-500'
                      }`}>
                        ৪
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 mt-2">ভ্যানে অন-রুট</p>
                      <p className="text-[9px] text-slate-400">ডেলিভারির পথে</p>
                    </div>

                    {/* Step 5: Delivered */}
                    <div className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        getStatusStepIndex(activeOrder.status) >= 5 ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-slate-200 text-slate-500'
                      }`}>
                        ৫
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 mt-2">পৌঁছেছে</p>
                      <p className="text-[9px] text-slate-400">জার হস্তান্তর সম্পন্ন</p>
                    </div>

                  </div>
                </div>

                {/* Driver & Delivery Information Box */}
                {activeOrder.assignedDriver && (
                  <div className="p-4 bg-cyan-50/70 rounded-2xl border border-cyan-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-700 text-white flex items-center justify-center shadow-2xs">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          ডেলিভারি চালক: {activeOrder.assignedDriver.name}
                        </p>
                        <p className="text-[11px] text-slate-600">
                          যানবাহন নম্বর: {activeOrder.assignedDriver.vehicleNo} • এরিয়া: {activeOrder.deliveryZone}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`tel:${activeOrder.assignedDriver.phone}`}
                      className="px-4 py-2 rounded-xl bg-white text-cyan-800 border border-cyan-300 text-xs font-bold flex items-center gap-2 hover:bg-cyan-100/50 transition-colors self-start sm:self-auto"
                    >
                      <Phone className="w-3.5 h-3.5 text-cyan-700" />
                      <span>চালককে কল করুন ({activeOrder.assignedDriver.phone})</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Subscriptions Quick Card */}
            {activeSub && (
              <div className="bg-white rounded-3xl p-6 shadow-2xs border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-800 flex items-center justify-center font-bold">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{activeSub.planName}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        activeSub.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {activeSub.status === 'active' ? 'সক্রিয়' : 'স্থগিত'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {activeSub.quantityPerDelivery}টি {activeSub.bottleSize} প্রতি {activeSub.deliveryDays.join(' ও ')} • {activeSub.timeSlot}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => togglePauseSubscription(activeSub.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      activeSub.status === 'active'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {activeSub.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{activeSub.status === 'active' ? 'ডেলিভারি স্থগিত রাখুন' : 'ডেলিভারি পুনরায় চালু করুন'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('subscriptions')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-cyan-800 hover:bg-cyan-50 border border-cyan-200 cursor-pointer"
                  >
                    প্ল্যান ব্যবস্থাপনা
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Subscriptions Full Management */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">আপনার সাবস্ক্রিপশন তালিকা</h3>
              <button
                type="button"
                onClick={() => setCurrentView('subscriptions')}
                className="px-3.5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন সাবস্ক্রিপশন যুক্ত করুন</span>
              </button>
            </div>

            {userSubscriptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userSubscriptions.map((sub) => (
                  <div 
                    key={sub.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-800 uppercase tracking-wide">
                          {sub.frequency === 'weekly' ? 'সাপ্তাহিক প্ল্যান' : sub.frequency === 'biweekly' ? 'পাক্ষিক প্ল্যান' : 'মাসিক প্ল্যান'}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          sub.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                          sub.status === 'paused' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {sub.status === 'active' ? 'সক্রিয়' : sub.status === 'paused' ? 'স্থগিত' : 'বাতিল'}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900">{sub.planName}</h4>

                      <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-slate-500">পরিমাণ:</span>
                          <span className="font-semibold text-slate-900">{sub.quantityPerDelivery}টি {sub.bottleSize} জার</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">ডেলিভারি বার:</span>
                          <span className="font-semibold text-slate-900">{sub.deliveryDays.join(' ও ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">সময়:</span>
                          <span className="font-semibold text-slate-900">{sub.timeSlot}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">ঠিকানা:</span>
                          <span className="font-semibold text-slate-900 truncate max-w-[180px]">{sub.deliveryAddress.addressLine}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-200">
                          <span className="text-slate-500">মাসিক আনুমানিক বিল:</span>
                          <span className="font-bold text-cyan-800">৳{sub.monthlyEstimate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => togglePauseSubscription(sub.id)}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {sub.status === 'active' ? <Pause className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
                        <span>{sub.status === 'active' ? 'স্থগিত করুন' : 'চালু করুন'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => cancelSubscription(sub.id)}
                        className="py-2 px-3 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                      >
                        প্ল্যান বাতিল
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-800">কোনো নিয়মিত সাবস্ক্রিপশন পাওয়া যায়নি</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  প্রতি সপ্তাহে বা মাসে নির্দিষ্ট দিনে পানি পেতে একটি নিয়মিত প্যাকেজ সেট করুন।
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentView('subscriptions')}
                  className="px-5 py-2.5 rounded-xl bg-cyan-700 text-white text-xs font-bold hover:bg-cyan-800 shadow-2xs cursor-pointer"
                >
                  সাবস্ক্রিপশন প্যাকেজ তৈরি করুন
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Order History & Invoices */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">আপনার সম্পূর্ণ অর্ডার ও মেমোর ইতিহাস</h3>

            {/* Mobile Card List View (Phones) */}
            <div className="space-y-3 sm:hidden">
              {userOrders.map((ord) => (
                <div key={ord.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-cyan-800 text-sm">মেমো #{ord.invoiceNumber}</span>
                      <p className="text-[10px] text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString('bn-BD')}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                      ord.status === 'out_for_delivery' ? 'bg-cyan-100 text-cyan-800 animate-pulse' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {ord.status === 'delivered' ? 'ডেলিভারি সম্পন্ন' : ord.status === 'out_for_delivery' ? 'অন-রুট' : ord.status === 'pending' ? 'অপেক্ষমাণ' : 'প্রক্রিয়াধীন'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl space-y-1">
                    <p className="font-semibold text-slate-900">{ord.items.map(i => `${i.quantity}টি ${i.name}`).join(', ')}</p>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                      <span className="text-slate-500">মোট বিল: <strong className="text-slate-900 font-bold">৳{ord.totalAmount}</strong></span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.paymentStatus === 'paid' ? 'পরিশোধিত' : 'বকেয়া'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => generateOrderInvoicePDF(ord)}
                    className="w-full min-h-[44px] rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>ক্যাশ মেমো / ইনভয়েস PDF ডাউনলোড</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop / Tablet Table View */}
            <div className="hidden sm:block bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">ইনভয়েস / মেমো</th>
                      <th className="p-4">অর্ডারের ধরন</th>
                      <th className="p-4">পণ্যের বিবরণ</th>
                      <th className="p-4">মোট টাকা</th>
                      <th className="p-4">পেমেন্ট</th>
                      <th className="p-4">স্ট্যাটাস</th>
                      <th className="p-4 text-right">ডাউনলোড</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {userOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 font-bold text-slate-900">
                          #{ord.invoiceNumber}
                          <p className="text-[10px] text-slate-400 font-normal">
                            {new Date(ord.createdAt).toLocaleDateString('bn-BD')}
                          </p>
                        </td>
                        <td className="p-4 text-[11px] font-bold text-cyan-800">
                          {ord.type === 'event_bulk' ? 'ইভেন্ট বাল্ক' : ord.type === 'subscription_recurring' ? 'সাবস্ক্রিপশন' : 'এককালীন অর্ডার'}
                        </td>
                        <td className="p-4 text-slate-700 font-medium">
                          {ord.items.map(i => `${i.quantity}টি ${i.name}`).join(', ')}
                        </td>
                        <td className="p-4 font-bold text-slate-900">
                          ৳{ord.totalAmount}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.paymentStatus === 'paid' ? 'পরিশোধিত' : 'ক্যাশ অন ডেলিভারি'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                            ord.status === 'out_for_delivery' ? 'bg-cyan-100 text-cyan-800 animate-pulse' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {ord.status === 'delivered' ? 'পৌঁছেছে' : ord.status === 'out_for_delivery' ? 'অন-রুট' : ord.status === 'pending' ? 'অপেক্ষমাণ' : 'প্রক্রিয়াধীন'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => generateOrderInvoicePDF(ord)}
                            className="px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold flex items-center gap-1.5 ml-auto transition-colors cursor-pointer min-h-[36px]"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF মেমো</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Delivery Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">সংরক্ষিত ডেলিভারি ঠিকানা</h3>
              <button
                type="button"
                onClick={() => promptLocationPicker(() => {})}
                className="px-3.5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ম্যাপে নতুন ঠিকানা যুক্ত করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.savedAddresses.map((addr) => (
                <div 
                  key={addr.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-bold border border-cyan-200">
                      {addr.tag}
                    </span>
                    {user.savedAddresses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSavedAddress(addr.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                        aria-label="ঠিকানা মুছে ফেলুন"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{addr.recipientName}</h4>
                    <p className="text-xs text-slate-500">{addr.phone}</p>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {addr.addressLine} {addr.floorUnit && `(${addr.floorUnit})`}, {addr.area}, {addr.city} {addr.postalCode}
                  </p>

                  {addr.instructions && (
                    <p className="text-[11px] text-cyan-800 bg-cyan-50 p-2.5 rounded-xl border border-cyan-100 font-medium">
                      নির্দেশনা: {addr.instructions}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Referral Program & Friend Invites */}
        {activeTab === 'referrals' && (
          <ReferralProgramSection />
        )}

      </div>

      {/* Wallet Top-up Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">ওয়ালেট ব্যালেন্স রিচার্জ</h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowTopupModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase">টাকার পরিমাণ নির্বাচন করুন</label>
              <div className="grid grid-cols-4 gap-2">
                {[300, 500, 1000, 2000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopupAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      topupAmount === amt ? 'bg-cyan-700 text-white border-cyan-700' : 'border-slate-200 text-slate-700 hover:border-cyan-300'
                    }`}
                  >
                    ৳{amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">পেমেন্ট মাধ্যম</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPaymentProvider('bkash')}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs cursor-pointer ${
                    selectedPaymentProvider === 'bkash' ? 'border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-400' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  বিকাশ (bKash)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPaymentProvider('nagad')}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs cursor-pointer ${
                    selectedPaymentProvider === 'nagad' ? 'border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-400' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  নগদ (Nagad)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPaymentProvider('card')}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs cursor-pointer ${
                    selectedPaymentProvider === 'card' ? 'border-cyan-600 bg-cyan-50 text-cyan-800 ring-2 ring-cyan-500' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  কার্ড / নেটব্যাংকিং
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleWalletTopup}
              className="w-full py-3.5 rounded-2xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs shadow-2xs cursor-pointer"
            >
              ৳{topupAmount} ওয়ালেটে যুক্ত করুন
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
