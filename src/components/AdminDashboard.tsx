import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { MiladLogo } from './MiladLogo';
import { 
  Layers, 
  Activity, 
  RotateCcw, 
  Truck, 
  Users, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Download, 
  Search, 
  Edit3, 
  TrendingUp, 
  ShieldAlert, 
  Send, 
  Droplet, 
  PackageCheck, 
  MessageSquare, 
  PhoneCall, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  Check, 
  CheckCheck, 
  AlertCircle, 
  AlertTriangle, 
  RefreshCw, 
  Info, 
  Phone, 
  MapPin, 
  UserCheck,
  Plus,
  Trash2,
  Save,
  Tag,
  Sliders,
  X,
  Database
} from 'lucide-react';
import { generateOrderInvoicePDF } from '../lib/pdfGenerator';
import { 
  formatBangladeshiPhone, 
  createWhatsAppChatUrl, 
  sendWhatsAppMessage 
} from '../lib/whatsapp';
import { 
  generateOrderPlacedTemplate, 
  generateDriverDispatchTemplate, 
  generateInvoicePdfTemplate,
  generateSubscriptionReminderTemplate 
} from '../lib/whatsappTemplates';
import { Order, OrderStatus, Product, WhatsAppNotificationStatus } from '../types';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProductsToDefault,
    clearAllDemoData,
    orders, 
    subscriptions, 
    factoryInventory, 
    updateFactoryInventory, 
    deliveryZones, 
    updateOrderStatus,
    updateOrderWhatsAppStatus,
    showToast
  } = useStore();

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'products' | 'jars' | 'routes' | 'crm'>('overview');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [whatsAppFilter, setWhatsAppFilter] = useState<'all' | 'sent' | 'pending' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Product Management State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDeposit, setEditDeposit] = useState<number>(0);
  const [editName, setEditName] = useState<string>('');
  const [editSubtitle, setEditSubtitle] = useState<string>('');
  const [editInStock, setEditInStock] = useState<boolean>(true);

  // New Product Modal State
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductSubtitle, setNewProductSubtitle] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<'water_jar' | 'water_bottle' | 'dispenser' | 'accessories'>('water_jar');
  const [newProductVolume, setNewProductVolume] = useState('20L');
  const [newProductPrice, setNewProductPrice] = useState<number>(0);
  const [newProductDeposit, setNewProductDeposit] = useState<number>(0);
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductUnit, setNewProductUnit] = useState('জার');

  // Quick Pricing Batch inputs
  const [batch20LPrice, setBatch20LPrice] = useState<number>(() => products.find(p => p.id === 'prod-20l-jar')?.price || 0);
  const [batch20LDeposit, setBatch20LDeposit] = useState<number>(() => products.find(p => p.id === 'prod-20l-jar')?.jarDeposit || 0);
  const [batch5LPrice, setBatch5LPrice] = useState<number>(() => products.find(p => p.id === 'prod-5l-bottle')?.price || 0);
  const [batchPumpPrice, setBatchPumpPrice] = useState<number>(() => products.find(p => p.id === 'prod-electric-pump')?.price || 0);

  // Reset Confirmation State
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Factory Stock Edit State
  const [isEditingFactoryStock, setIsEditingFactoryStock] = useState(false);
  const [stockTotalJars, setStockTotalJars] = useState(factoryInventory.total20LJars);
  const [stockSterilized, setStockSterilized] = useState(factoryInventory.jarsInFactorySterilized);
  const [stockBottling, setStockBottling] = useState(factoryInventory.jarsInBottlingLine);
  const [stockCirculation, setStockCirculation] = useState(factoryInventory.jarsInCirculationWithCustomers);
  const [stockWaterTds, setStockWaterTds] = useState(factoryInventory.currentWaterTDS);
  const [stockWaterPh, setStockWaterPh] = useState(factoryInventory.currentWaterPH);

  // WhatsApp Preview / Trigger State
  const [selectedOrderForWhatsApp, setSelectedOrderForWhatsApp] = useState<Order | null>(null);
  const [whatsAppTriggerType, setWhatsAppTriggerType] = useState<'ORDER_PLACED' | 'OUT_FOR_DELIVERY' | 'DELIVERED'>('ORDER_PLACED');
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [retryingOrderId, setRetryingOrderId] = useState<string | null>(null);
  const [whatsAppSuccessMessage, setWhatsAppSuccessMessage] = useState<string | null>(null);

  // 100% Genuine and Fresh Stats
  const totalWaterDispatched = factoryInventory.todayProductionLiters;
  const activeSubsCount = subscriptions.filter(s => s.status === 'active').length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed');
  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid' || o.status === 'delivered').reduce((acc, o) => acc + o.totalAmount, 0);

  // WhatsApp Operational Metrics
  const totalOrdersCount = orders.length;
  const sentCount = orders.filter(o => o.whatsappNotificationStatus === 'sent').length;
  const pendingCount = orders.filter(o => !o.whatsappNotificationStatus || o.whatsappNotificationStatus === 'pending').length;
  const failedCount = orders.filter(o => o.whatsappNotificationStatus === 'failed').length;
  const dispatchRate = totalOrdersCount > 0 ? Math.round((sentCount / totalOrdersCount) * 100) : 100;

  // Filtered Orders
  const filteredOrders = orders.filter(ord => {
    const matchesFilter = orderFilter === 'all' ? true : ord.status === orderFilter;
    const currentWaStatus = ord.whatsappNotificationStatus || 'pending';
    const matchesWhatsApp = whatsAppFilter === 'all' ? true : currentWaStatus === whatsAppFilter;
    const matchesSearch = searchQuery === '' ? true :
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.deliveryZone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerPhone.includes(searchQuery);
    return matchesFilter && matchesWhatsApp && matchesSearch;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    const targetOrder = orders.find(o => o.id === orderId);
    
    if (targetOrder) {
      if (newStatus === 'out_for_delivery') {
        showToast('info', 'ডেলিভারিতে বের হয়েছে', `স্ট্যাটাস পরিবর্তন হয়েছে। গ্রাহককে ড্রাইভারের তথ্য হোয়াটসঅ্যাপে পাঠাতে পারেন।`);
      } else if (newStatus === 'delivered') {
        showToast('success', 'ডেলিভারি সম্পন্ন', `অর্ডার সফলভাবে ডেলিভারি হয়েছে! ডিজিটাল ক্যাশমেমো প্রস্তুত।`);
      }
    }
  };

  const handleAssignDriver = async (orderId: string, zoneId: string) => {
    const zone = deliveryZones.find(z => z.id === zoneId);
    if (zone) {
      await updateOrderStatus(orderId, 'out_for_delivery', {
        name: zone.driverName,
        phone: zone.driverPhone,
        vehicleNo: zone.vehicleNo
      });
      showToast('success', 'ড্রাইভার নির্ধারিত হয়েছে', `${zone.driverName} (${zone.name}) কে এসাইন করা হয়েছে।`);
    }
  };

  const handleSendAutomatedWhatsApp = async (order: Order, type: 'ORDER_PLACED' | 'OUT_FOR_DELIVERY' | 'DELIVERED') => {
    setIsSendingWhatsApp(true);
    let msgBody = '';
    if (type === 'ORDER_PLACED') {
      msgBody = generateOrderPlacedTemplate(order);
    } else if (type === 'OUT_FOR_DELIVERY') {
      msgBody = generateDriverDispatchTemplate(order);
    } else if (type === 'DELIVERED') {
      msgBody = generateInvoicePdfTemplate(order);
    }

    try {
      const result = await sendWhatsAppMessage({
        to: order.customerPhone,
        message: msgBody,
        referenceId: order.id
      });

      if (result.success) {
        updateOrderWhatsAppStatus(order.id, 'sent', undefined, type);
        showToast('success', 'হোয়াটসঅ্যাপ পাঠানো হয়েছে!', `+${result.recipient} নাম্বারে সফলভাবে মেসেজ গেছে।`);
        setWhatsAppSuccessMessage(`+${result.recipient} নাম্বারে মেসেজ পাঠানো হয়েছে।`);
        setTimeout(() => {
          setSelectedOrderForWhatsApp(null);
          setWhatsAppSuccessMessage(null);
        }, 1800);
      } else {
        updateOrderWhatsAppStatus(order.id, 'failed', result.error || 'Gateway dispatch failed', type);
        showToast('error', 'হোয়াটসঅ্যাপ সমস্যা', result.error || 'মেসেজ পাঠানো সম্ভব হয়নি');
      }
    } catch (err: any) {
      updateOrderWhatsAppStatus(order.id, 'failed', err?.message || 'Network exception', type);
      showToast('error', 'হোয়াটসঅ্যাপ এরর', err?.message || 'Check UltraMsg token');
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  // Quick single-click retry for failed/pending notifications
  const handleQuickRetry = async (order: Order) => {
    setRetryingOrderId(order.id);
    let type: 'ORDER_PLACED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' = 'ORDER_PLACED';
    if (order.status === 'out_for_delivery') {
      type = 'OUT_FOR_DELIVERY';
    } else if (order.status === 'delivered') {
      type = 'DELIVERED';
    }

    let msgBody = '';
    if (type === 'ORDER_PLACED') {
      msgBody = generateOrderPlacedTemplate(order);
    } else if (type === 'OUT_FOR_DELIVERY') {
      msgBody = generateDriverDispatchTemplate(order);
    } else if (type === 'DELIVERED') {
      msgBody = generateInvoicePdfTemplate(order);
    }

    try {
      const result = await sendWhatsAppMessage({
        to: order.customerPhone,
        message: msgBody,
        referenceId: order.id
      });

      if (result.success) {
        updateOrderWhatsAppStatus(order.id, 'sent', undefined, type);
        showToast('success', 'হোয়াটসঅ্যাপ রিট্রাই সফল!', `+${result.recipient} নাম্বারে পুনরায় পাঠানো হয়েছে।`);
      } else {
        updateOrderWhatsAppStatus(order.id, 'failed', result.error || 'Retry attempt failed', type);
        showToast('error', 'রিট্রাই ব্যর্থ হয়েছে', result.error || 'Gateway returned failure');
      }
    } catch (err: any) {
      updateOrderWhatsAppStatus(order.id, 'failed', err?.message || 'Retry network exception', type);
      showToast('error', 'রিট্রাই সমস্যা', err?.message);
    } finally {
      setRetryingOrderId(null);
    }
  };

  // Retry all failed notifications in one click
  const handleRetryAllFailed = async () => {
    const failedOrders = orders.filter(o => o.whatsappNotificationStatus === 'failed');
    if (failedOrders.length === 0) return;
    
    showToast('info', 'ব্যাচ রিট্রাই শুরু হয়েছে', `${failedOrders.length}টি ফেইল্ড মেসেজ রিট্রাই করা হচ্ছে...`);
    for (const ord of failedOrders) {
      await handleQuickRetry(ord);
    }
  };

  // Start editing a product inline
  const handleStartEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setEditPrice(p.price);
    setEditDeposit(p.jarDeposit || 0);
    setEditName(p.name);
    setEditSubtitle(p.subTitle || '');
    setEditInStock(p.inStock);
  };

  // Save inline product edit
  const handleSaveProductEdit = (id: string) => {
    updateProduct(id, {
      name: editName,
      subTitle: editSubtitle,
      price: Number(editPrice) || 0,
      jarDeposit: Number(editDeposit) || 0,
      inStock: editInStock
    });
    setEditingProductId(null);
    showToast('success', 'পণ্য আপডেট হয়েছে', 'মূল্য ও তথ্যের পরিবর্তন সফলভাবে সংরক্ষিত হয়েছে।');
  };

  // Delete product
  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে "${name}" পণ্যটি তালিকা থেকে মুছে ফেলতে চান?`)) {
      deleteProduct(id);
      showToast('info', 'পণ্য ডিলিট হয়েছে', `"${name}" পণ্যটি ক্যাটালগ থেকে মুছে ফেলা হয়েছে।`);
    }
  };

  // Add new product
  const handleAddNewProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) {
      showToast('error', 'পণ্যের নাম লিখুন', 'পণ্যের শিরোনাম দেওয়া বাধ্যতামূলক।');
      return;
    }

    addProduct({
      name: newProductName.trim(),
      subTitle: newProductSubtitle.trim() || undefined,
      description: newProductDesc.trim() || 'উচ্চমানের পরিশোধিত মিনারেল পানি',
      category: newProductCategory,
      volume: newProductVolume,
      price: Number(newProductPrice) || 0,
      jarDeposit: Number(newProductDeposit) || 0,
      inStock: true,
      unit: newProductUnit,
      features: ['বিশুদ্ধ ও নিরাপদ', 'সিলেট শহরে হোম ডেলিভারি'],
      iconName: newProductCategory === 'water_jar' ? 'Droplets' : newProductCategory === 'water_bottle' ? 'Wine' : 'Sparkles'
    });

    setIsAddProductModalOpen(false);
    setNewProductName('');
    setNewProductSubtitle('');
    setNewProductPrice(0);
    setNewProductDeposit(0);
    setNewProductDesc('');
    showToast('success', 'নতুন পণ্য যুক্ত হয়েছে', `"${newProductName}" সফলভাবে ক্যাটালগে যুক্ত হয়েছে।`);
  };

  // Apply batch pricing
  const handleApplyBatchPricing = () => {
    const p20 = products.find(p => p.id === 'prod-20l-jar' || p.category === 'water_jar');
    const p5 = products.find(p => p.id === 'prod-5l-bottle' || p.category === 'water_bottle');
    const pPump = products.find(p => p.id === 'prod-electric-pump' || p.category === 'dispenser');

    if (p20) {
      updateProduct(p20.id, {
        price: Number(batch20LPrice) || 0,
        jarDeposit: Number(batch20LDeposit) || 0
      });
    }
    if (p5) {
      updateProduct(p5.id, {
        price: Number(batch5LPrice) || 0
      });
    }
    if (pPump) {
      updateProduct(pPump.id, {
        price: Number(batchPumpPrice) || 0
      });
    }

    showToast('success', 'মূল্যতালিকা আপডেট হয়েছে', 'সকল পণ্যের নতুন রেট ও জামানত সিস্টেমজুড়ে আপডেট হয়েছে।');
  };

  // Save Factory Stock
  const handleSaveFactoryStock = () => {
    updateFactoryInventory({
      total20LJars: Number(stockTotalJars) || 0,
      jarsInFactorySterilized: Number(stockSterilized) || 0,
      jarsInBottlingLine: Number(stockBottling) || 0,
      jarsInCirculationWithCustomers: Number(stockCirculation) || 0,
      currentWaterTDS: Number(stockWaterTds) || 0,
      currentWaterPH: Number(stockWaterPh) || 7.0
    });
    setIsEditingFactoryStock(false);
    showToast('success', 'স্টক ডাটা সংরক্ষিত', 'ফ্যাক্টরি ইনভেন্টরি ও পানির মান সফলভাবে আপডেট হয়েছে।');
  };

  // Fresh reset action
  const handleConfirmClearAllDemoData = () => {
    clearAllDemoData();
    setIsResetConfirmOpen(false);
    showToast('info', 'সম্পূর্ণ ডাটা ফ্রেশ হয়েছে', 'সকল ডেমো অর্ডার, ব্যালেন্স ও হিস্টোরি শূন্য (০) করা হয়েছে। আপনি এখন সম্পূর্ণ নতুনভাবে পণ্য ও অর্ডার নিয়ন্ত্রণ করতে পারবেন।');
  };

  return (
    <div className="py-8 bg-slate-900 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <MiladLogo size="lg" showText={false} />
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-bold mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>ফ্যাক্টরি ও ডেলিভারি কন্ট্রোল প্যানেল (Sylhet Hub)</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
                মিলাদ ড্রিংকিং ওয়াটার — এডমিন ড্যাশবোর্ড
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                মিরবক্সটুলা প্ল্যান্ট, সিলেট • রিয়েল-টাইম অর্ডার ম্যানেজমেন্ট ও হোয়াটসঅ্যাপ নোটিফিকেশন
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700 text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold">পানির বিশুদ্ধতা</p>
              <p className="text-sm font-bold text-emerald-400 flex items-center justify-end gap-1">
                <Droplet className="w-3.5 h-3.5 fill-emerald-400" />
                <span>{factoryInventory.currentWaterTDS} PPM (pH {factoryInventory.currentWaterPH})</span>
              </p>
            </div>

            <div className="bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700 text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold">ডেলিভারি ভ্যান</p>
              <p className="text-sm font-bold text-cyan-400 flex items-center justify-end gap-1">
                <Truck className="w-3.5 h-3.5" />
                <span>{factoryInventory.activeVehiclesOnRoad}টি সিলেটে সচল</span>
              </p>
            </div>
          </div>
        </div>

        {/* 4 Operations KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-3xl bg-slate-800/90 border border-slate-700/80 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>আজকের পরিশোধিত পানি</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </p>
            <p className="text-3xl font-black text-white font-heading">
              {totalWaterDispatched.toLocaleString()} <span className="text-base text-slate-400 font-normal">লিটার</span>
            </p>
            <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> বোতলজাতকরণ চলমান
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-800/90 border border-slate-700/80 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>মোট নিয়মিত গ্রাহক</span>
              <Users className="w-4 h-4 text-sky-400" />
            </p>
            <p className="text-3xl font-black text-white font-heading">
              {activeSubsCount.toLocaleString()} <span className="text-base text-slate-400 font-normal">জন</span>
            </p>
            <p className="text-[11px] text-slate-400">
              মাসিক ও সাপ্তাহিক সাবস্ক্রিপশন
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-800/90 border border-slate-700/80 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>গ্রাহকদের কাছে খালি জার</span>
              <RotateCcw className="w-4 h-4 text-cyan-400" />
            </p>
            <p className="text-3xl font-black text-cyan-300 font-heading">
              {factoryInventory.jarsInCirculationWithCustomers.toLocaleString()} <span className="text-base text-slate-400 font-normal">টি</span>
            </p>
            <p className="text-[11px] text-slate-400">
              {factoryInventory.jarsInFactorySterilized}টি কারখানায় জীবাণুমুক্ত রেডি
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-800/90 border border-slate-700/80 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>মোট অর্জিত রেভিনিউ</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </p>
            <p className="text-3xl font-black text-emerald-400 font-heading">
              ৳{totalRevenue.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400">
              ক্যাশ, বিকাশ ও ব্যাংক পেমেন্ট
            </p>
          </div>

        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveAdminTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeAdminTab === 'overview' ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              📋 অর্ডার ও ডেলিভারি তালিকা ({orders.length})
            </button>

            <button
              onClick={() => setActiveAdminTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeAdminTab === 'products' ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              🏷️ পণ্য ও মূল্য কন্ট্রোল ({products.length})
            </button>

            <button
              onClick={() => setActiveAdminTab('jars')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeAdminTab === 'jars' ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              🔄 খালি জার ও কারখানা স্টক
            </button>

            <button
              onClick={() => setActiveAdminTab('routes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeAdminTab === 'routes' ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              🚚 ডেলিভারি রুট ও ড্রাইভার ({deliveryZones.length})
            </button>

            <button
              onClick={() => setActiveAdminTab('crm')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeAdminTab === 'crm' ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              👥 গ্রাহক লেজার ও ফোন বুক
            </button>
          </div>

          {/* Clear / Fresh State Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-300 text-xs font-bold transition-all cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-rose-400" />
              <span>সম্পূর্ণ ফ্রেশ ডাটা রিসেট</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Dispatch & Orders Management Queue */}
        {activeAdminTab === 'overview' && (
          <div className="space-y-6">
            
            {/* WhatsApp Operations & Notification Communications Monitor */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border border-slate-700/80 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <MessageSquare className="w-5 h-5 fill-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>হোয়াটসঅ্যাপ নোটিফিকেশন কন্ট্রোল মনিটর</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono">
                        UltraMsg গেটওয়ে সচল
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      অর্ডার কনফার্মেশন, ড্রাইভার এসাইন ও ডেলিভারির ক্যাশমেমো স্বয়ংক্রিয়ভাবে গ্রাহকের হোয়াটসঅ্যাপে যায়।
                    </p>
                  </div>
                </div>

                {failedCount > 0 && (
                  <button
                    onClick={handleRetryAllFailed}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>ব্যর্থ মেসেজগুলো আবার পাঠান ({failedCount})</span>
                  </button>
                )}
              </div>

              {/* 4 Status KPI Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {/* 1. Sent */}
                <button
                  onClick={() => setWhatsAppFilter(whatsAppFilter === 'sent' ? 'all' : 'sent')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    whatsAppFilter === 'sent' 
                      ? 'bg-emerald-950/90 border-emerald-500 shadow-md' 
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
                    <span className="flex items-center gap-1">
                      <CheckCheck className="w-4 h-4" />
                      <span>সফলভাবে গেছে</span>
                    </span>
                    <span className="text-base font-extrabold">{sentCount}টি</span>
                  </div>
                  <p className="text-[10px] text-slate-400">গ্রাহক মেসেজ পেয়েছেন</p>
                </button>

                {/* 2. Pending */}
                <button
                  onClick={() => setWhatsAppFilter(whatsAppFilter === 'pending' ? 'all' : 'pending')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    whatsAppFilter === 'pending' 
                      ? 'bg-amber-950/90 border-amber-500 shadow-md' 
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 animate-pulse" />
                      <span>অপেক্ষমান</span>
                    </span>
                    <span className="text-base font-extrabold">{pendingCount}টি</span>
                  </div>
                  <p className="text-[10px] text-slate-400">পাঠানোর জন্য প্রস্তুত</p>
                </button>

                {/* 3. Failed */}
                <button
                  onClick={() => setWhatsAppFilter(whatsAppFilter === 'failed' ? 'all' : 'failed')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    whatsAppFilter === 'failed' 
                      ? 'bg-rose-950/90 border-rose-500 shadow-md' 
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-rose-400 font-bold mb-1">
                    <span className="flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>ব্যর্থ হয়েছে</span>
                    </span>
                    <span className="text-base font-extrabold">{failedCount}টি</span>
                  </div>
                  <p className="text-[10px] text-slate-400">পুনরায় পাঠানো প্রয়োজন</p>
                </button>

                {/* 4. Delivery Success Rate */}
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
                  <div className="flex items-center justify-between text-cyan-400 font-bold mb-1">
                    <span>নোটিফিকেশন রেট</span>
                    <span className="text-base font-extrabold">{dispatchRate}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${dispatchRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="গ্রাহকের নাম, মেমো নং, ফোন নাম্বার বা এলাকা লিখে খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Order Status Filters */}
                <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-800/80 rounded-xl border border-slate-700 text-xs">
                  {[
                    { key: 'all', label: 'সব অর্ডার' },
                    { key: 'pending', label: 'নতুন অর্ডার' },
                    { key: 'confirmed', label: 'কনফার্মড' },
                    { key: 'out_for_delivery', label: 'ডেলিভারিতে' },
                    { key: 'delivered', label: 'সম্পন্ন' }
                  ].map((st) => (
                    <button
                      key={st.key}
                      onClick={() => setOrderFilter(st.key)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        orderFilter === st.key ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                {/* WhatsApp Status Quick Filter */}
                <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700 text-xs">
                  <span className="px-2 text-[10px] text-slate-400 font-bold uppercase">হোয়াটসঅ্যাপ:</span>
                  {[
                    { key: 'all', label: 'সব' },
                    { key: 'sent', label: 'গেছে' },
                    { key: 'pending', label: 'পেন্ডিং' },
                    { key: 'failed', label: 'ফেইল্ড' }
                  ].map((waSt) => (
                    <button
                      key={waSt.key}
                      onClick={() => setWhatsAppFilter(waSt.key as any)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        whatsAppFilter === waSt.key
                          ? waSt.key === 'sent' 
                            ? 'bg-emerald-600 text-white' 
                            : waSt.key === 'failed' 
                            ? 'bg-rose-600 text-white'
                            : waSt.key === 'pending'
                            ? 'bg-amber-600 text-white'
                            : 'bg-cyan-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {waSt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Order Cards List (Phones & Tablets) */}
            <div className="space-y-4 lg:hidden">
              {filteredOrders.map((ord) => {
                const waChatUrl = createWhatsAppChatUrl(
                  ord.customerPhone,
                  `আসসালামু আলাইকুম ${ord.customerName}, মিলাদ ড্রিংকিং ওয়াটার (মিরবক্সটুলা, সিলেট) থেকে আপনার অর্ডার #${ord.invoiceNumber} প্রসঙ্গে যোগাযোগ করা হচ্ছে।`
                );
                const currentWaStatus = ord.whatsappNotificationStatus || 'pending';

                return (
                  <div key={ord.id} className="bg-slate-800 rounded-2xl p-4 border border-slate-700/80 space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-black text-cyan-400 text-sm">{ord.invoiceNumber}</span>
                        <p className="text-[10px] text-slate-400">
                          {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(ord.createdAt).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-emerald-400">৳{ord.totalAmount}</span>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">
                          {ord.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : ord.paymentMethod}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{ord.customerName}</span>
                        <a href={`tel:${ord.customerPhone}`} className="text-cyan-300 font-mono flex items-center gap-1 hover:underline">
                          <Phone className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{ord.customerPhone}</span>
                        </a>
                      </div>
                      <p className="text-slate-300 font-medium">{ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</p>
                      <p className="text-slate-400 text-[11px] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>{ord.deliveryZone} ({ord.shippingAddress})</span>
                      </p>
                    </div>

                    {/* Quick Status and Driver Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1 font-bold">অর্ডার স্ট্যাটাস:</label>
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                          className="w-full min-h-[40px] px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-600 font-bold text-cyan-300 focus:outline-none cursor-pointer"
                        >
                          <option value="pending">⏳ নতুন অর্ডার (Pending)</option>
                          <option value="confirmed">👍 কনফার্মড (Confirmed)</option>
                          <option value="sterilizing_bottling">💧 বোতলজাত হচ্ছে (Bottling)</option>
                          <option value="out_for_delivery">🚚 ডেলিভারিতে বের হয়েছে</option>
                          <option value="delivered">✅ ডেলিভারি সম্পন্ন (Delivered)</option>
                          <option value="cancelled">❌ বাতিল (Cancelled)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1 font-bold">ড্রাইভার এসাইন:</label>
                        {ord.assignedDriver ? (
                          <div className="min-h-[40px] px-2.5 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-800 text-emerald-300 flex items-center gap-1 font-bold">
                            <Truck className="w-3.5 h-3.5" />
                            <span>{ord.assignedDriver.name} ({ord.assignedDriver.vehicleNo})</span>
                          </div>
                        ) : (
                          <select
                            onChange={(e) => handleAssignDriver(ord.id, e.target.value)}
                            defaultValue=""
                            className="w-full min-h-[40px] px-2 py-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-200 cursor-pointer"
                          >
                            <option value="" disabled>ড্রাইভার নির্বাচন করুন...</option>
                            {deliveryZones.map(z => (
                              <option key={z.id} value={z.id}>{z.name} — {z.driverName}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>

                    {/* Quick WhatsApp & Call Action Toolbar */}
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-700/60">
                      <a
                        href={`tel:${ord.customerPhone}`}
                        className="flex-1 min-h-[40px] rounded-xl bg-slate-700 hover:bg-slate-600 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Phone className="w-4 h-4" />
                        <span>কল দিন</span>
                      </a>

                      <a
                        href={waChatUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-h-[40px] rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <MessageSquare className="w-4 h-4 fill-white" />
                        <span>হোয়াটসঅ্যাপ</span>
                      </a>

                      <button
                        onClick={() => {
                          setSelectedOrderForWhatsApp(ord);
                          if (ord.status === 'out_for_delivery') {
                            setWhatsAppTriggerType('OUT_FOR_DELIVERY');
                          } else if (ord.status === 'delivered') {
                            setWhatsAppTriggerType('DELIVERED');
                          } else {
                            setWhatsAppTriggerType('ORDER_PLACED');
                          }
                        }}
                        className="min-h-[40px] px-3 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                        title="অটোমেটেড মেসেজ"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">মেসেজ</span>
                      </button>

                      <button
                        onClick={() => generateOrderInvoicePDF(ord)}
                        className="min-h-[40px] px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-cyan-300 flex items-center justify-center cursor-pointer"
                        title="মেমো PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Orders Table */}
            <div className="hidden lg:block bg-slate-800/80 rounded-3xl overflow-hidden border border-slate-700/80">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-700">
                    <tr>
                      <th className="p-4">মেমো নং ও সময়</th>
                      <th className="p-4">গ্রাহকের নাম ও ফোন</th>
                      <th className="p-4">পণ্যের বিবরণ</th>
                      <th className="p-4">এলাকা ও ঠিকানা</th>
                      <th className="p-4">বিল ও পেমেন্ট</th>
                      <th className="p-4">বর্তমান অবস্থা</th>
                      <th className="p-4">ড্রাইভার নিয়োগ</th>
                      <th className="p-4">হোয়াটসঅ্যাপ স্ট্যাটাস</th>
                      <th className="p-4">গ্রাহক যোগাযোগ</th>
                      <th className="p-4 text-right">মেমো প্রিন্ট</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredOrders.map((ord) => {
                      const waChatUrl = createWhatsAppChatUrl(
                        ord.customerPhone,
                        `আসসালামু আলাইকুম ${ord.customerName}, মিলাদ ড্রিংকিং ওয়াটার (মিরবক্সটুলা, সিলেট) থেকে আপনার অর্ডার #${ord.invoiceNumber} প্রসঙ্গে যোগাযোগ করা হচ্ছে।`
                      );
                      const currentWaStatus = ord.whatsappNotificationStatus || 'pending';

                      return (
                      <tr key={ord.id} className="hover:bg-slate-750/50 transition-colors">
                        <td className="p-4">
                          <span className="font-black text-cyan-400 text-sm">{ord.invoiceNumber}</span>
                          <p className="text-[10px] text-slate-400">{new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </td>

                        <td className="p-4">
                          <p className="font-bold text-white text-sm">{ord.customerName}</p>
                          <a href={`tel:${ord.customerPhone}`} className="text-[11px] text-cyan-300 font-mono flex items-center gap-1 hover:underline">
                            <Phone className="w-3 h-3 text-cyan-400" />
                            <span>{ord.customerPhone}</span>
                          </a>
                        </td>

                        <td className="p-4">
                          <p className="text-slate-200 font-bold">{ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</p>
                          {ord.emptyJarsReturnedCount > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">
                              {ord.emptyJarsReturnedCount}টি খালি জার বদল
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          <p className="font-bold text-slate-200 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span>{ord.deliveryZone}</span>
                          </p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[150px]" title={ord.shippingAddress}>
                            {ord.shippingAddress}
                          </p>
                        </td>

                        <td className="p-4">
                          <p className="font-black text-emerald-400 text-sm">৳{ord.totalAmount}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">
                            {ord.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : ord.paymentMethod}
                          </p>
                        </td>

                        <td className="p-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-600 text-xs font-bold text-cyan-300 focus:outline-none cursor-pointer"
                          >
                            <option value="pending">⏳ নতুন অর্ডার (Pending)</option>
                            <option value="confirmed">👍 কনফার্মড (Confirmed)</option>
                            <option value="sterilizing_bottling">💧 বোতলজাত হচ্ছে (Bottling)</option>
                            <option value="out_for_delivery">🚚 ডেলিভারিতে বের হয়েছে</option>
                            <option value="delivered">✅ ডেলিভারি সম্পন্ন (Delivered)</option>
                            <option value="cancelled">❌ বাতিল (Cancelled)</option>
                          </select>
                        </td>

                        <td className="p-4">
                          {ord.assignedDriver ? (
                            <div className="text-[11px]">
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <Truck className="w-3 h-3" /> {ord.assignedDriver.name}
                              </span>
                              <span className="text-slate-400 text-[10px]">{ord.assignedDriver.vehicleNo}</span>
                            </div>
                          ) : (
                            <select
                              onChange={(e) => handleAssignDriver(ord.id, e.target.value)}
                              defaultValue=""
                              className="px-2 py-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-[11px] text-cyan-200 cursor-pointer"
                            >
                              <option value="" disabled>ড্রাইভার নির্বাচন করুন...</option>
                              {deliveryZones.map(z => (
                                <option key={z.id} value={z.id}>{z.name} — {z.driverName}</option>
                              ))}
                            </select>
                          )}
                        </td>

                        {/* WhatsApp Notification Status Visual Indicator */}
                        <td className="p-4">
                          {currentWaStatus === 'sent' && (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold text-[11px] shadow-xs">
                                <CheckCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>গেছে (Sent)</span>
                              </span>
                              <p className="text-[10px] text-slate-400 font-mono">
                                {ord.whatsappLastSentAt 
                                  ? new Date(ord.whatsappLastSentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  : 'সফল'}
                              </p>
                            </div>
                          )}

                          {currentWaStatus === 'pending' && (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-500/50 text-amber-300 font-bold text-[11px]">
                                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                                <span>পেন্ডিং</span>
                              </span>
                              <p className="text-[10px] text-slate-400">পাঠাতে ক্লিক করুন</p>
                            </div>
                          )}

                          {currentWaStatus === 'failed' && (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-rose-950/90 border border-rose-500/60 text-rose-300 font-bold text-[11px]">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                <span>ব্যর্থ</span>
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  disabled={retryingOrderId === ord.id}
                                  onClick={() => handleQuickRetry(ord)}
                                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-rose-900 hover:bg-rose-800 border border-rose-700 text-rose-100 text-[10px] font-bold transition-all disabled:opacity-50 cursor-pointer"
                                  title="পুনরায় চেষ্টা করুন"
                                >
                                  <RefreshCw className={`w-2.5 h-2.5 ${retryingOrderId === ord.id ? 'animate-spin' : ''}`} />
                                  <span>রিট্রাই</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* WhatsApp Notification & Click-to-Chat Suite */}
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            {/* 1. Direct Call */}
                            <a
                              href={`tel:${ord.customerPhone}`}
                              className="p-1.5 px-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-emerald-300 font-bold text-[11px] flex items-center gap-1 transition-all"
                              title="সরাসরি কল দিন"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">কল</span>
                            </a>

                            {/* 2. Direct WhatsApp Chat */}
                            <a
                              href={waChatUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-xs"
                              title="সরাসরি হোয়াটসঅ্যাপে চ্যাট করুন"
                            >
                              <MessageSquare className="w-3.5 h-3.5 fill-white" />
                              <span className="hidden sm:inline">চ্যাট</span>
                            </a>

                            {/* 3. Automated Template Trigger Button */}
                            <button
                              onClick={() => {
                                setSelectedOrderForWhatsApp(ord);
                                if (ord.status === 'out_for_delivery') {
                                  setWhatsAppTriggerType('OUT_FOR_DELIVERY');
                                } else if (ord.status === 'delivered') {
                                  setWhatsAppTriggerType('DELIVERED');
                                } else {
                                  setWhatsAppTriggerType('ORDER_PLACED');
                                }
                              }}
                              className="p-1.5 px-2.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                              title="অটোমেটেড এসএমএস পাঠান"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>মেসেজ</span>
                            </button>
                          </div>
                        </td>

                        <td className="p-4 text-right">
                          <button
                            onClick={() => generateOrderInvoicePDF(ord)}
                            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-cyan-300 transition-colors cursor-pointer"
                            title="ইনভয়েস ক্যাশমেমো ডাউনলোড করুন"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Products & Pricing Controller */}
        {activeAdminTab === 'products' && (
          <div className="space-y-6">
            
            {/* Quick Batch Pricing Adjustment Card */}
            <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span>দ্রুত মূল্য নির্ধারণ ও জামানত কন্ট্রোল (Quick Pricing Update)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    মূল পণ্যগুলোর রিফিল মূল্য ও খালি জারের সিকিউরিটি জামানত এক ক্লিকে আপডেট করুন।
                  </p>
                </div>
                <button
                  onClick={handleApplyBatchPricing}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>মূল্য তালিকা সেভ করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-2">
                  <label className="text-[11px] font-bold uppercase text-slate-400">২০ লিটার জার রিফিল মূল্য (৳)</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-cyan-400">৳</span>
                    <input 
                      type="number"
                      min="0"
                      value={batch20LPrice}
                      onChange={(e) => setBatch20LPrice(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-sm font-black text-white focus:outline-hidden focus:border-cyan-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">বর্তমান: ৳{products.find(p => p.id === 'prod-20l-jar')?.price || 0}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-2">
                  <label className="text-[11px] font-bold uppercase text-slate-400">২০ লিটার জারের সিকিউরিটি জামানত (৳)</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-cyan-400">৳</span>
                    <input 
                      type="number"
                      min="0"
                      value={batch20LDeposit}
                      onChange={(e) => setBatch20LDeposit(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-sm font-black text-white focus:outline-hidden focus:border-cyan-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">নতুন জার নিলে প্রযোজ্য: ৳{products.find(p => p.id === 'prod-20l-jar')?.jarDeposit || 0}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-2">
                  <label className="text-[11px] font-bold uppercase text-slate-400">৫ লিটার মিনারেল বোতল (৳)</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-cyan-400">৳</span>
                    <input 
                      type="number"
                      min="0"
                      value={batch5LPrice}
                      onChange={(e) => setBatch5LPrice(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-sm font-black text-white focus:outline-hidden focus:border-cyan-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">বর্তমান: ৳{products.find(p => p.id === 'prod-5l-bottle')?.price || 0}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-2">
                  <label className="text-[11px] font-bold uppercase text-slate-400">ইলেকট্রিক অটো পাম্প (৳)</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-cyan-400">৳</span>
                    <input 
                      type="number"
                      min="0"
                      value={batchPumpPrice}
                      onChange={(e) => setBatchPumpPrice(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-sm font-black text-white focus:outline-hidden focus:border-cyan-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">বর্তমান: ৳{products.find(p => p.id === 'prod-electric-pump')?.price || 0}</p>
                </div>
              </div>
            </div>

            {/* Products Full Catalog Table */}
            <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Tag className="w-4 h-4 text-cyan-400" />
                    <span>ক্যাটালগে থাকা সমস্ত পণ্যের তালিকা ({products.length})</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    প্রতিটি পণ্যের নাম, রিফিল মূল্য, সিকিউরিটি জামানত ও স্টক স্ট্যাটাস পরিচালনা করুন।
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => resetProductsToDefault()}
                    className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    ডিফল্ট পণ্য রিসেট
                  </button>
                  <button
                    onClick={() => setIsAddProductModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ নতুন পণ্য যুক্ত করুন</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-700">
                    <tr>
                      <th className="p-3">পণ্য ও বিবরণ</th>
                      <th className="p-3">ক্যাটাগরি</th>
                      <th className="p-3">পরিমাণ / ভলিউম</th>
                      <th className="p-3">রিফিল মূল্য (৳)</th>
                      <th className="p-3">সিকিউরিটি জামানত (৳)</th>
                      <th className="p-3">স্টক স্ট্যাটাস</th>
                      <th className="p-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {products.map((prod) => {
                      const isEditing = editingProductId === prod.id;
                      return (
                        <tr key={prod.id} className="hover:bg-slate-750/70 transition-colors">
                          
                          {/* Name & Title */}
                          <td className="p-3">
                            {isEditing ? (
                              <div className="space-y-1.5 max-w-xs">
                                <input
                                  type="text"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2.5 py-1 text-xs text-white font-bold"
                                  placeholder="পণ্যের নাম"
                                />
                                <input
                                  type="text"
                                  value={editSubtitle}
                                  onChange={(e) => setEditSubtitle(e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2.5 py-1 text-[11px] text-slate-300"
                                  placeholder="সাব-টাইটেল"
                                />
                              </div>
                            ) : (
                              <div>
                                <p className="font-bold text-white text-sm">{prod.name}</p>
                                {prod.subTitle && <p className="text-[11px] text-slate-400">{prod.subTitle}</p>}
                                <p className="text-[10px] text-slate-500 font-mono">ID: {prod.id}</p>
                              </div>
                            )}
                          </td>

                          {/* Category */}
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-slate-700/80 text-cyan-300 text-[10px] font-bold uppercase">
                              {prod.category === 'water_jar' ? '২০ লিটার জার' : prod.category === 'water_bottle' ? 'পেট বোতল' : prod.category === 'dispenser' ? 'ডিসপেন্সার / পাম্প' : 'অন্যান্য'}
                            </span>
                          </td>

                          {/* Volume */}
                          <td className="p-3 font-mono font-bold text-slate-300">
                            {prod.volume}
                          </td>

                          {/* Price */}
                          <td className="p-3">
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <span className="text-cyan-400 font-bold">৳</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(Number(e.target.value))}
                                  className="w-20 bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-xs text-emerald-400 font-bold"
                                />
                              </div>
                            ) : (
                              <span className="font-black text-emerald-400 text-sm">
                                ৳{prod.price}
                              </span>
                            )}
                          </td>

                          {/* Jar Deposit */}
                          <td className="p-3">
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <span className="text-cyan-400 font-bold">৳</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={editDeposit}
                                  onChange={(e) => setEditDeposit(Number(e.target.value))}
                                  className="w-20 bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-xs text-cyan-400 font-bold"
                                />
                              </div>
                            ) : (
                              <span className="font-bold text-cyan-400">
                                {prod.jarDeposit ? `৳${prod.jarDeposit}` : '—'}
                              </span>
                            )}
                          </td>

                          {/* Stock Status */}
                          <td className="p-3">
                            {isEditing ? (
                              <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                                <input
                                  type="checkbox"
                                  checked={editInStock}
                                  onChange={(e) => setEditInStock(e.target.checked)}
                                  className="w-4 h-4 text-cyan-500 rounded-sm"
                                />
                                <span className={editInStock ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                                  {editInStock ? 'স্টকে আছে' : 'স্টক শেষ'}
                                </span>
                              </label>
                            ) : (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                prod.inStock ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                              }`}>
                                {prod.inStock ? 'স্টকে আছে' : 'স্টক আউট'}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-3 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleSaveProductEdit(prod.id)}
                                  className="p-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>সেভ</span>
                                </button>
                                <button
                                  onClick={() => setEditingProductId(null)}
                                  className="p-1.5 px-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs transition-all cursor-pointer"
                                >
                                  বাতিল
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleStartEditProduct(prod)}
                                  className="p-1.5 px-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-cyan-300 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                                  title="মূল্য ও তথ্য এডিট করুন"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>এডিট</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                  className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-400 transition-colors cursor-pointer"
                                  title="পণ্য মুছে ফেলুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Empty Jar Inventory Balance */}
        {activeAdminTab === 'jars' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-700 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <RotateCcw className="w-5 h-5 text-cyan-400" />
                    <span>২০ লিটার পলিকার্বনেট জার হিসাব ও ফ্যাক্টরি স্টক</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    কারখানার মোট জার সম্পদ, গ্রাহকদের কাছে থাকা খালি জার এবং রিফিলের লাইভ হিসাব।
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsEditingFactoryStock(!isEditingFactoryStock);
                      setStockTotalJars(factoryInventory.total20LJars);
                      setStockSterilized(factoryInventory.jarsInFactorySterilized);
                      setStockBottling(factoryInventory.jarsInBottlingLine);
                      setStockCirculation(factoryInventory.jarsInCirculationWithCustomers);
                      setStockWaterTds(factoryInventory.currentWaterTDS);
                      setStockWaterPh(factoryInventory.currentWaterPH);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs cursor-pointer shadow-md"
                  >
                    {isEditingFactoryStock ? 'এডিট বাতিল' : '✏️ স্টক এডিট করুন'}
                  </button>
                  <button
                    onClick={() => {
                      updateFactoryInventory({
                        jarsInFactorySterilized: factoryInventory.jarsInFactorySterilized + 500,
                        todayProductionLiters: factoryInventory.todayProductionLiters + 10000
                      });
                      showToast('success', 'উৎপাদন যোগ হয়েছে', 'নতুন ৫০০টি জার পরিশোধিত স্টকে যোগ করা হয়েছে।');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs cursor-pointer shadow-md"
                  >
                    + নতুন ৫০০টি জার রিফিল রেকর্ড
                  </button>
                </div>
              </div>

              {/* Jar Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 text-center">
                  <p className="text-[10px] font-bold uppercase text-slate-400">মোট জার সম্পদ</p>
                  <p className="text-2xl font-black text-white mt-1">{factoryInventory.total20LJars.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">ফুড-গ্রেড পিসি জার</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 text-center">
                  <p className="text-[10px] font-bold uppercase text-emerald-300">জীবাণুমুক্ত রেডি জার</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1">{factoryInventory.jarsInFactorySterilized.toLocaleString()}</p>
                  <p className="text-[10px] text-emerald-200 mt-0.5">ডেলিভারির জন্য প্রস্তুত</p>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/50 text-center">
                  <p className="text-[10px] font-bold uppercase text-cyan-300">বোতলজাত লাইনে</p>
                  <p className="text-2xl font-black text-cyan-400 mt-1">{factoryInventory.jarsInBottlingLine.toLocaleString()}</p>
                  <p className="text-[10px] text-cyan-200 mt-0.5">RO ফিলিং চলছে</p>
                </div>

                <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-800/50 text-center">
                  <p className="text-[10px] font-bold uppercase text-sky-300">গ্রাহকদের কাছে আছে</p>
                  <p className="text-2xl font-black text-sky-400 mt-1">{factoryInventory.jarsInCirculationWithCustomers.toLocaleString()}</p>
                  <p className="text-[10px] text-sky-200 mt-0.5">সিলেট শহরের বিভিন্ন এলাকায়</p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/50 text-center">
                  <p className="text-[10px] font-bold uppercase text-rose-300">বাতিল / রিসাইকেল</p>
                  <p className="text-2xl font-black text-rose-400 mt-1">{factoryInventory.damagedOrRecycledJars}</p>
                  <p className="text-[10px] text-rose-200 mt-0.5">স্ক্র্যাপ হিসেবে বাতিল</p>
                </div>

              </div>

              {/* Editable Factory Stock Form */}
              {isEditingFactoryStock && (
                <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-800/60 space-y-4">
                  <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    <span>ফ্যাক্টরি ইনভেন্টরি ও কোয়ালিটি প্যারামিটার পরিবর্তন করুন</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-slate-400 font-bold block mb-1">মোট ২০ লিটার জার সংখ্যা</label>
                      <input 
                        type="number"
                        min="0"
                        value={stockTotalJars}
                        onChange={(e) => setStockTotalJars(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-bold block mb-1">জীবাণুমুক্ত রেডি জার</label>
                      <input 
                        type="number"
                        min="0"
                        value={stockSterilized}
                        onChange={(e) => setStockSterilized(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-bold block mb-1">বোতলজাত লাইনে</label>
                      <input 
                        type="number"
                        min="0"
                        value={stockBottling}
                        onChange={(e) => setStockBottling(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-bold block mb-1">গ্রাহকদের কাছে খালি জার</label>
                      <input 
                        type="number"
                        min="0"
                        value={stockCirculation}
                        onChange={(e) => setStockCirculation(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-bold block mb-1">লাইভ ওয়াটার TDS (ppm)</label>
                      <input 
                        type="number"
                        min="0"
                        value={stockWaterTds}
                        onChange={(e) => setStockWaterTds(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-bold block mb-1">লাইভ ওয়াটার pH লেভেল</label>
                      <input 
                        type="number"
                        step="0.1"
                        min="0"
                        max="14"
                        value={stockWaterPh}
                        onChange={(e) => setStockWaterPh(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsEditingFactoryStock(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                    >
                      বাতিল
                    </button>
                    <button
                      onClick={handleSaveFactoryStock}
                      className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs cursor-pointer shadow-md"
                    >
                      সংরক্ষণ করুন
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Tab 4: Delivery Routes & Fleet Planner */}
        {activeAdminTab === 'routes' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deliveryZones.map((zone) => (
                <div 
                  key={zone.id}
                  className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-cyan-400 uppercase tracking-wide">
                      {zone.code}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      zone.status === 'on_route' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {zone.status === 'on_route' ? 'রাস্তায় আছে' : 'স্ট্যান্ডবাই'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white">{zone.name}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">চালক: {zone.driverName} ({zone.driverPhone})</p>
                    <p className="text-[11px] text-slate-400">গাড়ির নাম্বার: {zone.vehicleNo}</p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-2xl border border-slate-700/80 flex justify-between items-center text-xs">
                    <div>
                      <p className="text-slate-400">বর্তমান লোড</p>
                      <p className="font-bold text-white">{zone.activeOrders}টি অর্ডার</p>
                    </div>
                    <div>
                      <p className="text-slate-400">গাড়ির ধারণক্ষমতা</p>
                      <p className="font-bold text-cyan-400">{zone.capacityJars} জার</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const manifestMsg = `🚐 *মিলাদ ওয়াটার - রুট শিডিউল (${zone.name})*\nচালক: ${zone.driverName}\nগাড়ি: ${zone.vehicleNo}\nমোট ডেলিভারি: ${zone.activeOrders}টি অর্ডার\nসব জারের সিল ঠিক রেখে কাস্টমারকে দিন।`;
                      window.open(createWhatsAppChatUrl(zone.driverPhone, manifestMsg), '_blank');
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-white" />
                    <span>চালকের হোয়াটসঅ্যাপে শিডিউল পাঠান</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Customer CRM & Empty Jar Ledger */}
        {activeAdminTab === 'crm' && (
          <div className="space-y-4">
            <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">গ্রাহক ফোনবুক ও খালি জারের ব্যালেন্স</h3>
                  <p className="text-xs text-slate-400">
                    অর্ডার ও সাবস্ক্রিপশন করা গ্রাহকদের লাইভ লেজার এবং সরাসরি হোয়াটসঅ্যাপ কানেক্ট।
                  </p>
                </div>
                <div className="text-xs text-slate-400">
                  মোট নিবন্ধিত গ্রাহক: <span className="font-bold text-cyan-400">{orders.length > 0 ? Array.from(new Set(orders.map(o => o.customerPhone))).length : 0}</span> জন
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-700">
                    <tr>
                      <th className="p-3">গ্রাহকের নাম</th>
                      <th className="p-3">ফোন ও ঠিকানা</th>
                      <th className="p-3">মোট অর্ডার</th>
                      <th className="p-3">খালি জারের হিসাব</th>
                      <th className="p-3">সিলেটের এলাকা</th>
                      <th className="p-3 text-right">হোয়াটসঅ্যাপ চ্যাট</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {/* Extract unique customers dynamically from orders */}
                    {Array.from(new Map(orders.map(o => [o.customerPhone, o])).values()).map((ord: Order, idx: number) => {
                      const custOrders = orders.filter(o => o.customerPhone === ord.customerPhone);
                      const totalJarsOrdered = custOrders.reduce((acc, o) => acc + o.items.reduce((sum, item) => sum + (item.name.includes('জার') || item.volume === '20L' ? item.quantity : item.quantity), 0), 0);
                      const waLink = createWhatsAppChatUrl(ord.customerPhone, `আসসালামু আলাইকুম ${ord.customerName}, মিলাদ ড্রিংকিং ওয়াটার (মিরবক্সটুলা, সিলেট) থেকে আপনার পানির সেবার বিষয়ে যোগাযোগ করা হচ্ছে।`);
                      
                      return (
                        <tr key={idx} className="hover:bg-slate-750">
                          <td className="p-3 font-bold text-white text-sm">{ord.customerName}</td>
                          <td className="p-3 text-slate-300 font-mono">{ord.customerPhone}</td>
                          <td className="p-3 font-bold text-emerald-400">{custOrders.length}টি অর্ডার</td>
                          <td className="p-3 font-black text-cyan-400">{totalJarsOrdered}টি আইটেম</td>
                          <td className="p-3 text-slate-300">{ord.deliveryAddress?.addressLine || ord.deliveryZone || 'সিলেট'}</td>
                          <td className="p-3 text-right">
                            <a 
                              href={waLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5 fill-white" />
                              <span>হোয়াটসঅ্যাপ চ্যাট</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          কোন গ্রাহকের ডাটা নেই। গ্রাহক নতুন অর্ডার অথবা সাইনআপ করলে স্বয়ংক্রিয়ভাবে এখানে যুক্ত হবে।
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Add New Product Modal */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>নতুন পণ্য যুক্ত করুন</span>
              </h3>
              <button 
                onClick={() => setIsAddProductModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">পণ্যের নাম *</label>
                <input 
                  type="text"
                  required
                  placeholder="যেমন: ২০ লিটার পরিশোধিত জার পানি"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">সাব-টাইটেল / সংক্ষিপ্ত বিবরণ</label>
                  <input 
                    type="text"
                    placeholder="যেমন: RO + UV রিফিল"
                    value={newProductSubtitle}
                    onChange={(e) => setNewProductSubtitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">ক্যাটাগরি</label>
                  <select
                    value={newProductCategory}
                    onChange={(e: any) => setNewProductCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-hidden focus:border-cyan-500"
                  >
                    <option value="water_jar">২০ লিটার জার</option>
                    <option value="water_bottle">পেট বোতল (৫ লিটার / ১.৫ লিটার)</option>
                    <option value="dispenser">ডিসপেন্সার / পাম্প</option>
                    <option value="accessories">অন্যান্য এক্সেসরিজ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">ভলিউম</label>
                  <input 
                    type="text"
                    placeholder="20L"
                    value={newProductVolume}
                    onChange={(e) => setNewProductVolume(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">রিফিল মূল্য (৳) *</label>
                  <input 
                    type="number"
                    min="0"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">জামানত (৳)</label>
                  <input 
                    type="number"
                    min="0"
                    value={newProductDeposit}
                    onChange={(e) => setNewProductDeposit(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-cyan-400 font-bold focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">বিস্তারিত বিবরণ</label>
                <textarea 
                  rows={2}
                  placeholder="উৎকৃষ্ট ও সুপেয় মিনারেল পানি..."
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-md cursor-pointer"
                >
                  পণ্য সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear Demo Data Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="bg-slate-900 border border-rose-800/80 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-950/80 border border-rose-800 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">সম্পূর্ণ ডাটা ফ্রেশ রিসেট করবেন?</h3>
                <p className="text-[11px] text-rose-300">Clean Slate & Fresh Start</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              এটি নিশ্চিত করলে সকল ডেমো অর্ডার তালিকা, ডেমো সাবস্ক্রিপশন, ব্যালেন্স এবং পূর্বের হিস্টোরি সম্পূর্ণ মুছে ফেলে সিস্টেমকে একটি একদম ফ্রেশ অবস্থায় নিয়ে আসা হবে। এডমিন নিজেই পরে রিয়েল তথ্য ও মূল্য এন্ট্রি করতে পারবেন।
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                বাতিল
              </button>
              <button
                onClick={handleConfirmClearAllDemoData}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-950 cursor-pointer"
              >
                হ্যাঁ, সম্পূর্ণ ফ্রেশ রিসেট করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive WhatsApp Dispatch & Template Preview Modal */}
      {selectedOrderForWhatsApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl relative">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <MessageSquare className="w-5 h-5 fill-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>হোয়াটসঅ্যাপ মেসেজ পাঠানো</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    প্রাপক: <span className="font-bold text-emerald-400">{selectedOrderForWhatsApp.customerName}</span> (+{formatBangladeshiPhone(selectedOrderForWhatsApp.customerPhone)})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderForWhatsApp(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Template Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                টেমপ্লেট নির্বাচন করুন:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { type: 'ORDER_PLACED' as const, label: '১. অর্ডার কনফার্মেশন' },
                  { type: 'OUT_FOR_DELIVERY' as const, label: '২. চালক ও গাড়ি তথ্য' },
                  { type: 'DELIVERED' as const, label: '৩. ক্যাশমেমো ও ধন্যবাদ' }
                ].map((tpl) => (
                  <button
                    key={tpl.type}
                    onClick={() => setWhatsAppTriggerType(tpl.type)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      whatsAppTriggerType === tpl.type
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Body Live Preview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>মেসেজের পূর্বরূপ (UltraMsg ফরম্যাট)</span>
                <span className="text-emerald-400 font-mono">Format: 8801XXXXXXXXX</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed selection:bg-emerald-900 selection:text-white">
                {whatsAppTriggerType === 'ORDER_PLACED' && generateOrderPlacedTemplate(selectedOrderForWhatsApp)}
                {whatsAppTriggerType === 'OUT_FOR_DELIVERY' && generateDriverDispatchTemplate(selectedOrderForWhatsApp)}
                {whatsAppTriggerType === 'DELIVERED' && generateInvoicePdfTemplate(selectedOrderForWhatsApp)}
              </div>
            </div>

            {/* Success Message Alert */}
            {whatsAppSuccessMessage && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{whatsAppSuccessMessage}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <a
                href={createWhatsAppChatUrl(
                  selectedOrderForWhatsApp.customerPhone,
                  whatsAppTriggerType === 'ORDER_PLACED'
                    ? generateOrderPlacedTemplate(selectedOrderForWhatsApp)
                    : whatsAppTriggerType === 'OUT_FOR_DELIVERY'
                    ? generateDriverDispatchTemplate(selectedOrderForWhatsApp)
                    : generateInvoicePdfTemplate(selectedOrderForWhatsApp)
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>হোয়াটসঅ্যাপ ওয়েব ওপেন করুন</span>
              </a>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedOrderForWhatsApp(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  disabled={isSendingWhatsApp}
                  onClick={() => handleSendAutomatedWhatsApp(selectedOrderForWhatsApp, whatsAppTriggerType)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 disabled:opacity-50 cursor-pointer"
                >
                  {isSendingWhatsApp ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>মেসেজ পাঠানো হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>সরাসরি মেসেজ পাঠান</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
