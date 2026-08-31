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
import { cacheProductCatalogForOffline, getCachedOfflineCatalog } from '../lib/useNetworkStatus';
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
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProductsToDefault: () => void;
  clearAllDemoData: () => void;
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
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
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
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('milad_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    const cachedOffline = getCachedOfflineCatalog();
    return cachedOffline || DEFAULT_PRODUCTS;
  });

  // Automatically cache product catalog for instant offline viewing
  useEffect(() => {
    localStorage.setItem('milad_products', JSON.stringify(products));
    cacheProductCatalogForOffline(products);
  }, [products]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('milad_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('milad_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('milad_subscriptions');
    return saved ? JSON.parse(saved) : [];
  });

  const [factoryInventory, setFactoryInventory] = useState<FactoryJarInventory>(() => {
    const saved = localStorage.getItem('milad_factory_inventory');
    return saved ? JSON.parse(saved) : DEFAULT_FACTORY_INVENTORY;
  });

  const [deliveryZones] = useState<DeliveryZone[]>(DEFAULT_DELIVERY_ZONES);
  const [reviews, setReviews] = useState<CustomerReview[]>(DEFAULT_REVIEWS);

  // Modals & UI
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

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

  useEffect(() => {
    localStorage.setItem('milad_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('milad_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('milad_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('milad_factory_inventory', JSON.stringify(factoryInventory));
  }, [factoryInventory]);

  // Product CRUD
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prodData,
      id: 'prod-' + Date.now()
    };
    setProducts(prev => [newProd, ...prev]);
    showToast('success', 'নতুন পণ্য যুক্ত হয়েছে', `"${newProd.name}" সফলভাবে যুক্ত হয়েছে।`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('success', 'মূল্য ও তথ্য আপডেট হয়েছে', 'পণ্যটির নতুন মূল্য বা তথ্য সংরক্ষিত হয়েছে।');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('info', 'পণ্য মুছে ফেলা হয়েছে', 'পণ্যটি ক্যাটালগ থেকে সরানো হয়েছে।');
  };

  const resetProductsToDefault = () => {
    setProducts(DEFAULT_PRODUCTS);
    localStorage.setItem('milad_products', JSON.stringify(DEFAULT_PRODUCTS));
    showToast('info', 'ডিফল্ট পণ্য তালিকা রিস্টোর করা হয়েছে', 'স্ট্যান্ডার্ড প্রোডাক্ট ও প্রাইস সেট করা হয়েছে।');
  };

  const clearAllDemoData = () => {
    localStorage.removeItem('milad_orders');
    localStorage.removeItem('milad_subscriptions');
    localStorage.removeItem('milad_cart');
    localStorage.removeItem('milad_factory_inventory');
    setOrders([]);
    setSubscriptions([]);
    setCart([]);
    setFactoryInventory(DEFAULT_FACTORY_INVENTORY);
    showToast('info', 'ডাটা রিসেট সম্পন্ন', 'সকল ডেমো অর্ডার এবং তথ্য মুছে ফ্রেশ করা হয়েছে।');
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
        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault,
        clearAllDemoData,
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
        isAuthModalOpen,
        setIsAuthModalOpen,
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
