// Google Analytics 4 (GA4) Tracking Utility for Milad Drinking Water
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Default GA4 Measurement ID (can be overridden via environment variable)
export const GA_MEASUREMENT_ID = 
  import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

let isGAInitialized = false;

/**
 * Initialize Google Analytics 4 tracking script
 */
export const initGA = (measurementId: string = GA_MEASUREMENT_ID): void => {
  if (typeof window === 'undefined') return;
  if (isGAInitialized) return;

  // Ensure dataLayer exists
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag('js', new Date());

  // Only append actual script if a valid-format ID is present or configured
  if (measurementId && measurementId !== 'G-XXXXXXXXXX') {
    const existingScript = document.getElementById('ga4-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'ga4-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }

    gtag('config', measurementId, {
      send_page_view: false, // We handle manual SPA view tracking
      cookie_flags: 'SameSite=None;Secure',
    });
  }

  isGAInitialized = true;
};

/**
 * Track SPA Page View when navigation / tab changes
 */
export const trackPageView = (pageTitle: string, pagePath: string): void => {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: pageTitle,
      page_location: window.location.href,
      page_path: pagePath,
    });
  }
};

/**
 * Generic GA4 Event Tracker
 */
export const trackEvent = (eventName: string, params: Record<string, any> = {}): void => {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', eventName, {
      ...params,
      timestamp: new Date().toISOString(),
    });
  }
};

// ==========================================
// Specialized E-commerce & Conversion Events
// ==========================================

/**
 * Track Add to Cart event
 */
export const trackAddToCart = (product: {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  category?: string;
}): void => {
  trackEvent('add_to_cart', {
    currency: 'BDT',
    value: product.price * (product.quantity || 1),
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity || 1,
        item_category: product.category || 'Drinking Water',
      },
    ],
  });
};

/**
 * Track Checkout Initiation
 */
export const trackBeginCheckout = (value: number, itemCount: number, items: any[] = []): void => {
  trackEvent('begin_checkout', {
    currency: 'BDT',
    value: value,
    item_count: itemCount,
    items: items.map(item => ({
      item_id: item.product?.id || item.id,
      item_name: item.product?.name || item.name,
      price: item.product?.price || item.price,
      quantity: item.quantity || 1,
    })),
  });
};

/**
 * Track Order Completion / Purchase
 */
export const trackPurchase = (order: {
  orderId: string;
  value: number;
  paymentMethod: string;
  isSubscription?: boolean;
  deliveryArea?: string;
  items?: any[];
}): void => {
  trackEvent('purchase', {
    transaction_id: order.orderId,
    value: order.value,
    currency: 'BDT',
    payment_type: order.paymentMethod,
    is_subscription: order.isSubscription ? 1 : 0,
    delivery_area: order.deliveryArea || 'Sylhet',
    items: order.items?.map(i => ({
      item_id: i.productId || i.id,
      item_name: i.productName || i.name,
      quantity: i.quantity,
      price: i.price,
    })) || [],
  });
};

/**
 * Track WhatsApp Chat / Order button clicks
 */
export const trackWhatsAppClick = (source: string, intent?: string): void => {
  trackEvent('whatsapp_click', {
    click_source: source,
    intent: intent || 'order_inquiry',
    event_category: 'Lead Generation',
    event_label: 'WhatsApp Direct Chat',
  });
};

/**
 * Track Direct Hotline Phone Calls
 */
export const trackPhoneCall = (source: string, phoneNumber: string = '+8801711102448'): void => {
  trackEvent('phone_call_click', {
    click_source: source,
    phone_number: phoneNumber,
    event_category: 'Lead Generation',
  });
};

/**
 * Track PWA Mobile App Installation interactions
 */
export const trackPWAEvent = (action: 'banner_view' | 'banner_click' | 'app_installed' | 'guide_open'): void => {
  trackEvent('pwa_interaction', {
    pwa_action: action,
    event_category: 'App Engagement',
  });
};

/**
 * Track Water Calculator Interactions
 */
export const trackCalculatorUse = (jarCount: number, estimatedCost: number, cycle: string): void => {
  trackEvent('pricing_calculator_use', {
    jar_count: jarCount,
    estimated_cost: estimatedCost,
    billing_cycle: cycle,
  });
};

/**
 * Track Subscription Plan Inquiries / Selection
 */
export const trackSubscriptionSelect = (planName: string, monthlyPrice: number): void => {
  trackEvent('select_subscription_plan', {
    plan_name: planName,
    price: monthlyPrice,
    currency: 'BDT',
  });
};
