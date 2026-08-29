import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { 
  User, 
  Wallet, 
  RotateCcw, 
  Calendar, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Download, 
  Plus, 
  Pause, 
  Play, 
  X, 
  Truck, 
  Phone,
  ShieldCheck,
  CreditCard,
  FileText,
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
  const { user, updateWalletBalance, removeSavedAddress, referrals } = useAuth();
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
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [copiedCodeBanner, setCopiedCodeBanner] = useState<boolean>(false);

  // Filter orders and subscriptions for this user
  const userOrders = orders.filter(o => o.userId === user?.uid || o.customerPhone === user?.phone);
  const userSubscriptions = subscriptions.filter(s => s.userId === user?.uid);

  const activeSub = userSubscriptions.find(s => s.status === 'active' || s.status === 'paused');
  const activeOrder = userOrders.find(o => o.status !== 'delivered' && o.status !== 'cancelled') || userOrders[0];

  const handleWalletTopup = async () => {
    if (topupAmount <= 0) return;
    await updateWalletBalance(topupAmount);
    setShowTopupModal(false);
    showToast('success', 'Wallet Credited!', `৳${topupAmount} added via ${selectedPaymentProvider.toUpperCase()}.`);
  };

  const handleCopyBannerCode = () => {
    const code = user?.referralCode || 'MILAD-AHMED-88';
    navigator.clipboard.writeText(code);
    setCopiedCodeBanner(true);
    showToast('success', 'Code Copied!', `${code} copied to clipboard.`);
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

  return (
    <div className="py-10 bg-slate-50/70 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src={user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
              alt={user?.displayName}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/20 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
                  {user?.displayName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-bold uppercase">
                  Verified Customer
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email} • {user?.phone || '+880 1712-345678'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTopupModal(true)}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-md shadow-cyan-600/20 transition-all flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              <span>Top-up Wallet (৳{user?.walletBalance || 0})</span>
            </button>

            <button
              onClick={() => setCurrentView('products')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-cyan-600" />
              <span>New Water Order</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Overview Cards with Vibrant Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Empty Jars Held - Ocean Aqua */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-500/15 via-teal-500/10 to-white border-2 border-cyan-300 shadow-sm space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-cyan-900">
              <span className="text-xs font-black uppercase tracking-wider">Empty Jars Held</span>
              <div className="p-2.5 rounded-2xl bg-cyan-600 text-white shadow-xs">
                <RotateCcw className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-cyan-950 font-heading">
                {user?.emptyJarsHeld.jar20L || 0}
              </span>
              <span className="text-xs text-cyan-800 font-bold">20L Polycarbonate Jars</span>
            </div>
            <p className="text-[11px] text-teal-700 font-extrabold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Ready for 1:1 free deposit exchange on next order.
            </p>
          </div>

          {/* Wallet Balance - Radiant Emerald */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-white border-2 border-emerald-300 shadow-sm space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-emerald-900">
              <span className="text-xs font-black uppercase tracking-wider">Wallet Balance</span>
              <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-xs">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-emerald-950 font-heading">
                ৳{user?.walletBalance || 0}
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 font-semibold">
              Auto-deducts on scheduled refills.
            </p>
          </div>

          {/* Active Subscriptions - Royal Indigo */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-500/15 via-blue-500/10 to-white border-2 border-indigo-300 shadow-sm space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-indigo-900">
              <span className="text-xs font-black uppercase tracking-wider">Subscription Plan</span>
              <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-xs">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-indigo-950 font-heading">
                {activeSub ? activeSub.bottleSize : 'None'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-extrabold uppercase">
                {activeSub ? activeSub.status : 'Inactive'}
              </span>
            </div>
            <p className="text-[11px] text-indigo-800 font-semibold truncate">
              {activeSub ? `Next: ${activeSub.nextDeliveryDate}` : 'No active recurring plan.'}
            </p>
          </div>

          {/* Completed Orders - Sunset Amber / Purple */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-500/15 via-pink-500/10 to-white border-2 border-purple-300 shadow-sm space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-purple-900">
              <span className="text-xs font-black uppercase tracking-wider">Completed Orders</span>
              <div className="p-2.5 rounded-2xl bg-purple-600 text-white shadow-xs">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-purple-950 font-heading">
                {userOrders.length}
              </span>
              <span className="text-xs text-purple-800 font-bold">Deliveries</span>
            </div>
            <p className="text-[11px] text-purple-700 font-extrabold">
              {(userOrders.length * 40)} Liters purified water consumed.
            </p>
          </div>

        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b-2 border-cyan-100 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'overview' 
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-600/25' 
                : 'text-slate-700 hover:bg-cyan-50'
            }`}
          >
            Overview & Live Delivery
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'subscriptions' 
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/25' 
                : 'text-slate-700 hover:bg-indigo-50'
            }`}
          >
            <span>My Subscriptions</span>
            {userSubscriptions.length > 0 && (
              <span className="px-1.5 py-0.2 bg-white/30 text-white rounded-full text-[10px] font-black">{userSubscriptions.length}</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'orders' 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25' 
                : 'text-slate-700 hover:bg-emerald-50'
            }`}
          >
            <span>Order History & Invoices</span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full text-[10px] font-black">{userOrders.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'addresses' 
                ? 'bg-gradient-to-r from-cyan-600 to-sky-700 text-white shadow-md' 
                : 'text-slate-700 hover:bg-cyan-50'
            }`}
          >
            Delivery Addresses
          </button>

          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'referrals' 
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/30 animate-pulse' 
                : 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 hover:from-amber-100 hover:to-orange-100 border border-amber-300'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Refer & Earn ৳50</span>
            <span className="px-2 py-0.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-[10px] font-black">
              NEW BONUS
            </span>
          </button>
        </div>

        {/* Tab 1: Overview & Live Delivery Tracking */}
        {activeTab === 'overview' && (
          <div className="space-y-6">

            {/* Quick Referral Banner */}
            <div className="bg-linear-to-r from-cyan-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-7 text-white border border-cyan-500/20 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 space-y-1.5 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>Give ৳50, Get ৳50</span>
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-extrabold text-white">
                  Earn Free Water Deliveries with Milad Referrals
                </h3>
                <p className="text-xs text-slate-300">
                  Friends get ৳50 off their first 20L delivery. You get ৳50 auto-credited to your Milad Wallet.
                </p>
              </div>

              <div className="relative z-10 flex flex-wrap items-center gap-2.5">
                <div className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 flex items-center gap-2">
                  <span className="text-xs font-mono font-extrabold text-cyan-300 tracking-wider">
                    {user?.referralCode || 'MILAD-AHMED-88'}
                  </span>
                  <button
                    onClick={handleCopyBannerCode}
                    className="text-slate-300 hover:text-white p-1"
                    title="Copy Code"
                  >
                    {copiedCodeBanner ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <button
                  onClick={() => setActiveTab('referrals')}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Open Referral Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            {/* Live Delivery Stepper Card */}
            {activeOrder && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider">
                      Live Delivery Tracker
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Invoice #{activeOrder.invoiceNumber} ({activeOrder.items[0]?.name})
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => generateOrderInvoicePDF(activeOrder)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Download PDF Invoice</span>
                    </button>
                  </div>
                </div>

                {/* Stepper Graphic */}
                <div className="py-2">
                  <div className="grid grid-cols-5 gap-2 relative">
                    
                    {/* Connecting Bar */}
                    <div className="absolute top-4 left-6 right-6 h-1 bg-slate-200 -z-0">
                      <div 
                        className="h-full bg-cyan-600 transition-all duration-500"
                        style={{ width: `${((getStatusStepIndex(activeOrder.status) - 1) / 4) * 100}%` }}
                      />
                    </div>

                    {/* Step 1: Placed */}
                    <div className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        getStatusStepIndex(activeOrder.status) >= 1 ? 'bg-cyan-600 text-white ring-4 ring-cyan-100' : 'bg-slate-200 text-slate-500'
                      }`}>
                        1
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 mt-2">Order Placed</p>
                      <p className="text-[9px] text-slate-400">Scheduled</p>
                    </div>

                    {/* Step 2: Confirmed */}
                    <div className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        getStatusStepIndex(activeOrder.status) >= 2 ? 'bg-cyan-600 text-white ring-4 ring-cyan-100' : 'bg-slate-200 text-slate-500'
                      }`}>
                        2
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 mt-2">Confirmed</p>
                      <p className="text-[9px] text-slate-400">Queue Active</p>
                    </div>

                    {/* Step 3: Sterilizing & Bottling */}
                    <div className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        getStatusStepIndex(activeOrder.status) >= 3 ? 'bg-cyan-600 text-white ring-4 ring-cyan-100' : 'bg-slate-200 text-slate-500'
                      }`}>
                        3
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 mt-2">Sterilized</p>
                      <p className="text-[9px] text-slate-400">RO + UV Rinse</p>
                    </div>

                    {/* Step 4: Out for delivery */}
                    <div className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        getStatusStepIndex(activeOrder.status) >= 4 ? 'bg-cyan-600 text-white ring-4 ring-cyan-100 animate-pulse' : 'bg-slate-200 text-slate-500'
                      }`}>
                        4
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 mt-2">On Route</p>
                      <p className="text-[9px] text-slate-400">Delivery Van</p>
                    </div>

                    {/* Step 5: Delivered */}
                    <div className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        getStatusStepIndex(activeOrder.status) >= 5 ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-slate-200 text-slate-500'
                      }`}>
                        5
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 mt-2">Delivered</p>
                      <p className="text-[9px] text-slate-400">Jars Swapped</p>
                    </div>

                  </div>
                </div>

                {/* Driver & Delivery Information Box */}
                {activeOrder.assignedDriver && (
                  <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-sm">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          Delivery Driver: {activeOrder.assignedDriver.name}
                        </p>
                        <p className="text-[11px] text-slate-600">
                          Vehicle: {activeOrder.assignedDriver.vehicleNo} • Zone: {activeOrder.deliveryZone}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`tel:${activeOrder.assignedDriver.phone}`}
                      className="px-4 py-2 rounded-xl bg-white text-cyan-800 border border-cyan-300 text-xs font-bold flex items-center gap-2 hover:bg-cyan-100/50 transition-colors self-start sm:self-auto"
                    >
                      <Phone className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Call Driver: {activeOrder.assignedDriver.phone}</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Subscriptions Quick Card */}
            {activeSub && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{activeSub.planName}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        activeSub.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {activeSub.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {activeSub.quantityPerDelivery}x {activeSub.bottleSize} every {activeSub.deliveryDays.join(' & ')} • {activeSub.timeSlot}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePauseSubscription(activeSub.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      activeSub.status === 'active'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {activeSub.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{activeSub.status === 'active' ? 'Pause Deliveries' : 'Resume Deliveries'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('subscriptions')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-cyan-700 hover:bg-cyan-50 border border-cyan-200"
                  >
                    Manage Plan
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
              <h3 className="text-lg font-bold text-slate-900">Your Water Delivery Subscriptions</h3>
              <button
                onClick={() => setCurrentView('subscriptions')}
                className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Subscription</span>
              </button>
            </div>

            {userSubscriptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userSubscriptions.map((sub) => (
                  <div 
                    key={sub.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-700 uppercase tracking-wide">
                          {sub.frequency.replace('_', ' ')}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          sub.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                          sub.status === 'paused' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {sub.status.toUpperCase()}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900">{sub.planName}</h4>

                      <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Volume:</span>
                          <span className="font-semibold text-slate-900">{sub.quantityPerDelivery}x {sub.bottleSize} Jars</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Schedule:</span>
                          <span className="font-semibold text-slate-900">{sub.deliveryDays.join(' & ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Time Window:</span>
                          <span className="font-semibold text-slate-900">{sub.timeSlot}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Delivery Address:</span>
                          <span className="font-semibold text-slate-900 truncate max-w-[180px]">{sub.deliveryAddress.addressLine}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-200">
                          <span className="text-slate-500">Estimated Monthly:</span>
                          <span className="font-bold text-cyan-700">৳{sub.monthlyEstimate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => togglePauseSubscription(sub.id)}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        {sub.status === 'active' ? <Pause className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
                        <span>{sub.status === 'active' ? 'Pause' : 'Resume'}</span>
                      </button>

                      <button
                        onClick={() => cancelSubscription(sub.id)}
                        className="py-2 px-3 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                      >
                        Cancel Plan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-800">No active subscriptions</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Set up a weekly recurring 20L delivery to save 20% and get automated refill deliveries.
                </p>
                <button
                  onClick={() => setCurrentView('subscriptions')}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 shadow-md shadow-cyan-600/20"
                >
                  Create Subscription Plan
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Order History & Invoices */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Your Complete Order History</h3>

            {/* Mobile Card List View (Phones) */}
            <div className="space-y-3 sm:hidden">
              {userOrders.map((ord) => (
                <div key={ord.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-cyan-800 text-sm">{ord.invoiceNumber}</span>
                      <p className="text-[10px] text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                      ord.status === 'out_for_delivery' ? 'bg-cyan-100 text-cyan-800 animate-pulse' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl space-y-1">
                    <p className="font-semibold text-slate-900">{ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</p>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500">মোট বিল: <strong className="text-slate-900 font-bold">৳{ord.totalAmount}</strong></span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.paymentMethod} • {ord.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <button
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
            <div className="hidden sm:block bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Invoice #</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Items / Volume</th>
                      <th className="p-4">Total (BDT)</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {userOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 font-bold text-slate-900">
                          {ord.invoiceNumber}
                          <p className="text-[10px] text-slate-400 font-normal">
                            {new Date(ord.createdAt).toLocaleDateString('en-GB')}
                          </p>
                        </td>
                        <td className="p-4 uppercase text-[10px] font-bold text-cyan-800">
                          {ord.type.replace('_', ' ')}
                        </td>
                        <td className="p-4 text-slate-700 font-medium">
                          {ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </td>
                        <td className="p-4 font-bold text-slate-900">
                          ৳{ord.totalAmount}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.paymentMethod} • {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                            ord.status === 'out_for_delivery' ? 'bg-cyan-100 text-cyan-800 animate-pulse' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {ord.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => generateOrderInvoicePDF(ord)}
                            className="px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold flex items-center gap-1.5 ml-auto transition-colors cursor-pointer min-h-[36px]"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
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
              <h3 className="text-lg font-bold text-slate-900">Saved Delivery Locations</h3>
              <button
                onClick={() => promptLocationPicker(() => {})}
                className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Pin New Location on Map</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.savedAddresses.map((addr) => (
                <div 
                  key={addr.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-bold border border-cyan-200">
                      {addr.tag}
                    </span>
                    {user.savedAddresses.length > 1 && (
                      <button
                        onClick={() => removeSavedAddress(addr.id)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                        aria-label="Remove Address"
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
                    <p className="text-[11px] text-cyan-700 bg-cyan-50 p-2.5 rounded-xl border border-cyan-100 font-medium">
                      Note: {addr.instructions}
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Top-up Milad Wallet</h3>
              </div>
              <button 
                onClick={() => setShowTopupModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-600 uppercase">Select Amount (BDT)</label>
              <div className="grid grid-cols-4 gap-2">
                {[300, 500, 1000, 2000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopupAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      topupAmount === amt ? 'bg-cyan-600 text-white border-cyan-600' : 'border-slate-200 text-slate-700 hover:border-cyan-300'
                    }`}
                  >
                    ৳{amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-600 uppercase">Payment Gateway</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPaymentProvider('bkash')}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs ${
                    selectedPaymentProvider === 'bkash' ? 'border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-400' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  bKash
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPaymentProvider('nagad')}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs ${
                    selectedPaymentProvider === 'nagad' ? 'border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-400' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  Nagad
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPaymentProvider('card')}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs ${
                    selectedPaymentProvider === 'card' ? 'border-cyan-500 bg-cyan-50 text-cyan-700 ring-2 ring-cyan-400' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  Card / NetBanking
                </button>
              </div>
            </div>

            <button
              onClick={handleWalletTopup}
              className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs shadow-lg shadow-cyan-600/20"
            >
              Confirm & Add ৳{topupAmount} to Wallet
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
