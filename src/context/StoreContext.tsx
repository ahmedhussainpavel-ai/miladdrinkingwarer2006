import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  Subscription, 
  FactoryJarInventory, 
  DeliveryZone, 
  CustomerReview,
  Address,
  OrderStatus,
  OrderType
} from '../types';
import { 
  DEFAULT_PRODUCTS, 
  DEFAULT_FACTORY_INVENTORY, 
  DEFAULT_DELIVERY_ZONES, 
  DEFAULT_REVIEWS,
  DEFAULT_SAMPLE_ADDRESSES
} from '../lib/mockData';
import { db, collection, doc, setDoc, getDocs, updateDoc, onSnapshot } from '../lib/firebase';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

export type AppView = 
  | 'home'
  | 'products'
  | 'subscriptions'
  | 'calculator'
  | 'events'
  | 'quality'
  | 'customer_portal'
  | 'admin_dashboard'
  | 'architecture';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface StoreContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, exchangeEmptyJar?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  toggleCartJarExchange: (productId: string) => void;
  clearCart: () => void;
  cartTotal: {
    subtotal: number;
    depositTotal: number;
    deliveryFee: number;
    grandTotal: number;
    totalBottles: number;
    exchangeJarsCount: number;
  };
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, driver?: { name: string; phone: string; vehicleNo: string }) => Promise<void>;
  updateOrderWhatsAppStatus: (orderId: string, status: 'sent' | 'pending' | 'failed', failureReason?: string, triggerType?: string) => void;
  subscriptions: Subscription[];
  createSubscription: (subData: Omit<Subscription, 'id' | 'createdAt' | 'deliveriesCompleted'>) => Promise<Subscription>;
  togglePauseSubscription: (subId: string) => Promise<void>;
  cancelSubscription: (subId: string) => Promise<void>;
  factoryInventory: FactoryJarInventory;
  updateFactoryInventory: (updates: Partial<FactoryJarInventory>) => void;
  deliveryZones: DeliveryZone[];
  reviews: CustomerReview[];
  addReview: (review: Omit<CustomerReview, 'id' | 'date' | 'verified'>) => void;
  // Modals & UI states
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedProductForQuickView: Product | null;
  setSelectedProductForQuickView: (prod: Product | null) => void;
  locationModalOpen: boolean;
  setLocationModalOpen: (open: boolean) => void;
  locationCallback?: (address: Address) => void;
  promptLocationPicker: (callback: (address: Address) => void) => void;
  selectedOrderForInvoice: Order | null;
  setSelectedOrderForInvoice: (order: Order | null) => void;
  // Toasts
  toasts: Toast[];
  showToast: (type: Toast['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateWalletBalance, updateEmptyJars } = useAuth();

  const [currentView, setCurrentView] = useState<AppView>('home');
  const [products] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('milad_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('milad_orders');
    if (saved) return JSON.parse(saved);
    // Initial sample orders with varied WhatsApp communication statuses
    return [
      {
        id: 'ord-1001',
        invoiceNumber: 'MDW-2026-8841',
        userId: 'demo-customer-ahmed',
        customerName: 'আহমেদ হোসেন পাভেল',
        customerPhone: '+8801711102448',
        customerEmail: 'ahmedhussainpavel@gmail.com',
        type: 'subscription_delivery',
        items: [
          {
            productId: 'prod-20l-jar',
            name: '২০ লিটার মিনারেল ওয়াটার জার (20L Jar)',
            volume: '২০ লিটার',
            quantity: 2,
            unitPrice: 80,
            jarDepositPaid: 0,
            emptyJarsToReturn: 2,
            totalPrice: 160
          }
        ],
        subtotal: 160,
        depositTotal: 0,
        deliveryFee: 0,
        discount: 0,
        totalAmount: 160,
        deliveryAddress: DEFAULT_SAMPLE_ADDRESSES[0],
        deliveryDate: 'Today',
        timeSlot: 'সকাল ০৮:০০ - ১১:০০',
        deliveryZone: 'মিরবক্সটুলা ও জিন্দাবাজার জোন',
        paymentMethod: 'wallet',
        paymentStatus: 'paid',
        status: 'out_for_delivery',
        whatsappNotificationStatus: 'sent',
        whatsappLastSentAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        whatsappLastTrigger: 'OUT_FOR_DELIVERY',
        assignedDriver: {
          name: 'কবির হোসেন (Kabir)',
          phone: '+8801711102448',
          vehicleNo: 'সিলেট মেট্রো-ড ১১-২২৩৩'
        },
        emptyJarsReturnedCount: 2,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'ord-1002',
        invoiceNumber: 'MDW-2026-8842',
        userId: 'demo-customer-ahmed',
        customerName: 'আহমেদ হোসেন পাভেল',
        customerPhone: '+8801711102448',
        customerEmail: 'ahmedhussainpavel@gmail.com',
        type: 'one_time',
        items: [
          {
            productId: 'prod-electric-pump',
            name: 'অটোমেটিক ইলেকট্রিক জার পাম্প ডিসপেন্সার',
            volume: 'Universal',
            quantity: 1,
            unitPrice: 450,
            jarDepositPaid: 0,
            emptyJarsToReturn: 0,
            totalPrice: 450
          }
        ],
        subtotal: 450,
        depositTotal: 0,
        deliveryFee: 0,
        discount: 50,
        totalAmount: 400,
        deliveryAddress: DEFAULT_SAMPLE_ADDRESSES[0],
        deliveryDate: '২৪ আগস্ট ২০২৬',
        timeSlot: 'দুপুর ০২:০০ - ০৫:০০',
        deliveryZone: 'মিরবক্সটুলা ও জিন্দাবাজার জোন',
        paymentMethod: 'bkash',
        paymentStatus: 'paid',
        status: 'delivered',
        whatsappNotificationStatus: 'sent',
        whatsappLastSentAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        whatsappLastTrigger: 'DELIVERED',
        emptyJarsReturnedCount: 0,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: 'ord-1003',
        invoiceNumber: 'MDW-2026-8855',
        userId: 'cust-fintech-01',
        customerName: 'ডা. মাহফুজুর রহমান (পপুলার ডায়াগনস্টিক)',
        customerPhone: '+8801711102448',
        customerEmail: 'popular.sylhet@gmail.com',
        type: 'subscription_delivery',
        items: [
          {
            productId: 'prod-20l-jar',
            name: '২০ লিটার মিনারেল ওয়াটার জার',
            volume: '২০ লিটার',
            quantity: 8,
            unitPrice: 80,
            jarDepositPaid: 0,
            emptyJarsToReturn: 8,
            totalPrice: 640
          }
        ],
        subtotal: 640,
        depositTotal: 0,
        deliveryFee: 0,
        discount: 40,
        totalAmount: 600,
        deliveryAddress: {
          id: 'addr-zindabazar-corp',
          tag: 'Corporate Office',
          recipientName: 'ডা. মাহফুজুর রহমান',
          phone: '+8801711102448',
          addressLine: 'পপুলার সেন্টার, জেল রোড',
          floorUnit: 'লেভেল ৩',
          area: 'জিন্দাবাজার',
          city: 'সিলেট',
          postalCode: '৩১০০',
          lat: 24.8965,
          lng: 91.8710,
          isDefault: true
        },
        deliveryDate: 'Today',
        timeSlot: 'দুপুর ০২:০০ - ০৫:০০',
        deliveryZone: 'আম্বরখানা ও দরগাহ গেট জোন',
        paymentMethod: 'rocket',
        paymentStatus: 'paid',
        status: 'sterilizing_bottling',
        whatsappNotificationStatus: 'pending',
        emptyJarsReturnedCount: 8,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'ord-1004',
        invoiceNumber: 'MDW-2026-8860',
        userId: 'cust-grandsultan-01',
        customerName: 'হোটেল গ্র্যান্ড সুরমা',
        customerPhone: '+8801711102448',
        customerEmail: 'events@grandsurma.com',
        type: 'event_bulk',
        items: [
          {
            productId: 'prod-20l-jar',
            name: '২০ লিটার মিনারেল ওয়াটার জার',
            volume: '২০ লিটার',
            quantity: 25,
            unitPrice: 80,
            jarDepositPaid: 0,
            emptyJarsToReturn: 25,
            totalPrice: 2000
          }
        ],
        subtotal: 2000,
        depositTotal: 0,
        deliveryFee: 0,
        discount: 100,
        totalAmount: 1900,
        deliveryAddress: {
          id: 'addr-amberkhana-event',
          tag: 'Event Hall',
          recipientName: 'ম্যানেজার, হোটেল গ্র্যান্ড সুরমা',
          phone: '+8801711102448',
          addressLine: 'আম্বরখানা পয়েন্ট, সিলেট',
          floorUnit: 'ব্যাংকুয়েট হল',
          area: 'আম্বরখানা',
          city: 'সিলেট',
          postalCode: '৩১০০',
          lat: 24.9032,
          lng: 91.8680,
          isDefault: true
        },
        deliveryDate: 'Tomorrow',
        timeSlot: 'সকাল ০৮:০০ - ১১:০০',
        deliveryZone: 'আম্বরখানা ও দরগাহ গেট জোন',
        paymentMethod: 'cod',
        paymentStatus: 'unpaid',
        status: 'order_placed',
        whatsappNotificationStatus: 'failed',
        whatsappFailureReason: 'Gateway timeout / Invalid response',
        emptyJarsReturnedCount: 25,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('milad_subscriptions');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'sub-7701',
        userId: 'demo-customer-ahmed',
        customerName: 'আহমেদ হোসেন পাভেল',
        customerPhone: '+8801711102448',
        customerEmail: 'ahmedhussainpavel@gmail.com',
        planName: 'ফ্যামিলি হাইড্রেশন প্লাস (সপ্তাহে ২ দিন)',
        frequency: 'weekly_2x',
        bottleSize: '20L',
        quantityPerDelivery: 2,
        deliveryDays: ['সোমবার', 'বৃহস্পতিবার'],
        timeSlot: 'সকাল ০৮:০০ - ১১:০০',
        deliveryAddress: DEFAULT_SAMPLE_ADDRESSES[0],
        pricePerDelivery: 160,
        monthlyEstimate: 1280,
        paymentMethod: 'wallet',
        autoDeductWallet: true,
        status: 'active',
        startDate: '2026-08-01',
        nextDeliveryDate: 'বৃহস্পতিবার, ২৮ আগস্ট',
        deliveriesCompleted: 7,
        createdAt: '2026-08-01T10:00:00.000Z'
      }
    ];
  });

  const [factoryInventory, setFactoryInventory] = useState<FactoryJarInventory>(() => {
    const saved = localStorage.getItem('milad_factory_inventory');
    return saved ? JSON.parse(saved) : DEFAULT_FACTORY_INVENTORY;
  });

  const [deliveryZones] = useState<DeliveryZone[]>(DEFAULT_DELIVERY_ZONES);
  const [reviews, setReviews] = useState<CustomerReview[]>(DEFAULT_REVIEWS);

  // Modals
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductForQuickView, setSelectedProductForQuickView] = useState<Product | null>(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [locationCallback, setLocationCallback] = useState<((address: Address) => void) | undefined>(undefined);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to Local Storage
  useEffect(() => {
    localStorage.setItem('milad_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('milad_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('milad_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('milad_factory_inventory', JSON.stringify(factoryInventory));
  }, [factoryInventory]);

  const showToast = (type: Toast['type'], title: string, message: string) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1, exchangeEmptyJar: boolean = true) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, exchangeEmptyJar }];
    });
    showToast('success', 'Added to Order', `${quantity}x ${product.name} added to your cart.`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleCartJarExchange = (productId: string) => {
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, exchangeEmptyJar: !item.exchangeEmptyJar }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart totals calculation
  const cartTotal = React.useMemo(() => {
    let subtotal = 0;
    let depositTotal = 0;
    let totalBottles = 0;
    let exchangeJarsCount = 0;

    cart.forEach(item => {
      const lineSubtotal = item.product.price * item.quantity;
      subtotal += lineSubtotal;
      totalBottles += item.quantity;

      if (item.product.category === 'water_jar' || item.product.category === 'water_bottle') {
        if (!item.exchangeEmptyJar && item.product.jarDeposit > 0) {
          depositTotal += item.product.jarDeposit * item.quantity;
        } else if (item.exchangeEmptyJar) {
          exchangeJarsCount += item.quantity;
        }
      }
    });

    const deliveryFee = subtotal > 300 || cart.length === 0 ? 0 : 30;
    const grandTotal = subtotal + depositTotal + deliveryFee;

    return {
      subtotal,
      depositTotal,
      deliveryFee,
      grandTotal,
      totalBottles,
      exchangeJarsCount
    };
  }, [cart]);

  // Order management
  const createOrder = async (orderData: Omit<Order, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `MDW-${new Date().getFullYear()}-${randomCode}`;
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      invoiceNumber,
      whatsappNotificationStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Adjust user wallet if paid with wallet
    if (orderData.paymentMethod === 'wallet') {
      await updateWalletBalance(-newOrder.totalAmount);
    }

    // Update empty jar inventory state
    if (newOrder.emptyJarsReturnedCount > 0) {
      await updateEmptyJars(-newOrder.emptyJarsReturnedCount, 0);
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    showToast('success', 'Order Confirmed!', `Invoice #${invoiceNumber} created. Live tracking is active.`);
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, driver?: { name: string; phone: string; vehicleNo: string }) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            ...(driver ? { assignedDriver: driver } : {}),
            updatedAt: new Date().toISOString()
          };
        }
        return ord;
      })
    );
    showToast('info', 'Status Updated', `Order status changed to ${status.replace(/_/g, ' ').toUpperCase()}`);
  };

  const updateOrderWhatsAppStatus = (
    orderId: string, 
    status: 'sent' | 'pending' | 'failed', 
    failureReason?: string,
    triggerType?: string
  ) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            whatsappNotificationStatus: status,
            whatsappLastSentAt: status === 'sent' ? new Date().toISOString() : ord.whatsappLastSentAt,
            whatsappFailureReason: status === 'failed' ? failureReason : undefined,
            whatsappLastTrigger: triggerType || ord.whatsappLastTrigger,
            updatedAt: new Date().toISOString()
          };
        }
        return ord;
      })
    );
  };

  // Subscription management
  const createSubscription = async (subData: Omit<Subscription, 'id' | 'createdAt' | 'deliveriesCompleted'>): Promise<Subscription> => {
    const newSub: Subscription = {
      ...subData,
      id: 'sub-' + Date.now(),
      deliveriesCompleted: 0,
      createdAt: new Date().toISOString()
    };

    setSubscriptions(prev => [newSub, ...prev]);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (e) {
      // ignore
    }

    showToast('success', 'Subscription Activated!', `Scheduled for ${subData.deliveryDays.join(' & ')} delivery.`);
    return newSub;
  };

  const togglePauseSubscription = async (subId: string) => {
    setSubscriptions(prev =>
      prev.map(sub => {
        if (sub.id === subId) {
          const nextStatus = sub.status === 'active' ? 'paused' : 'active';
          showToast(
            'info',
            nextStatus === 'paused' ? 'Subscription Paused' : 'Subscription Resumed',
            nextStatus === 'paused' ? 'Deliveries are temporarily on hold.' : 'Deliveries will resume as scheduled.'
          );
          return { ...sub, status: nextStatus };
        }
        return sub;
      })
    );
  };

  const cancelSubscription = async (subId: string) => {
    setSubscriptions(prev =>
      prev.map(sub => (sub.id === subId ? { ...sub, status: 'cancelled' } : sub))
    );
    showToast('warning', 'Subscription Cancelled', 'Your recurring delivery plan has been stopped.');
  };

  const updateFactoryInventory = (updates: Partial<FactoryJarInventory>) => {
    setFactoryInventory(prev => ({ ...prev, ...updates }));
    showToast('success', 'Factory Log Updated', 'Jar inventory and production metrics saved.');
  };

  const addReview = (reviewData: Omit<CustomerReview, 'id' | 'date' | 'verified'>) => {
    const newRev: CustomerReview = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: 'Just now',
      verified: true
    };
    setReviews(prev => [newRev, ...prev]);
    showToast('success', 'Thank You!', 'Your review has been submitted.');
  };

  const promptLocationPicker = (callback: (address: Address) => void) => {
    setLocationCallback(() => callback);
    setLocationModalOpen(true);
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        products,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleCartJarExchange,
        clearCart,
        cartTotal,
        orders,
        createOrder,
        updateOrderStatus,
        updateOrderWhatsAppStatus,
        subscriptions,
        createSubscription,
        togglePauseSubscription,
        cancelSubscription,
        factoryInventory,
        updateFactoryInventory,
        deliveryZones,
        reviews,
        addReview,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProductForQuickView,
        setSelectedProductForQuickView,
        locationModalOpen,
        setLocationModalOpen,
        locationCallback,
        promptLocationPicker,
        selectedOrderForInvoice,
        setSelectedOrderForInvoice,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
