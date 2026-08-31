import React from 'react';
import { useStore, AppView } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Home, 
  Package, 
  CalendarClock, 
  User, 
  ShoppingCart,
  PhoneCall
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, cartTotal, setIsCartDrawerOpen } = useStore();
  const { t, formatCurrency, formatNumber } = useLanguage();

  const navItems: {
    id: AppView;
    title: string;
    icon: React.FC<{ className?: string }>;
    activeColor: string;
    activeBg: string;
  }[] = [
    {
      id: 'home',
      title: t.nav.home,
      icon: Home,
      activeColor: 'text-sky-600',
      activeBg: 'bg-sky-50'
    },
    {
      id: 'products',
      title: t.nav.products,
      icon: Package,
      activeColor: 'text-teal-600',
      activeBg: 'bg-teal-50'
    },
    {
      id: 'subscriptions',
      title: t.nav.subscriptions,
      icon: CalendarClock,
      activeColor: 'text-indigo-600',
      activeBg: 'bg-indigo-50'
    },
    {
      id: 'customer_portal',
      title: t.nav.dashboard,
      icon: User,
      activeColor: 'text-violet-600',
      activeBg: 'bg-violet-50'
    },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation Bar" 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(15,23,42,0.08)] pb-[max(env(safe-area-inset-bottom,0px),0.25rem)] select-none"
    >
      <div className="max-w-lg mx-auto px-3 h-16 flex items-center justify-between gap-1">
        
        {/* Core Iconic Navigation Tabs */}
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              aria-label={item.title}
              title={item.title}
              className={`relative flex-1 flex flex-col items-center justify-center h-12 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer ${
                isActive
                  ? `${item.activeBg} ${item.activeColor}`
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />

              {/* Active Indicator Micro-Pill */}
              {isActive && (
                <span className="absolute bottom-1 w-3 h-1 rounded-full bg-current" />
              )}
            </button>
          );
        })}

        {/* Dynamic Money & Cart Iconic Button */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          aria-label={t.cart.title}
          title={cartTotal.totalBottles > 0 ? `${formatCurrency(cartTotal.grandTotal)} (${formatNumber(cartTotal.totalBottles)} আইটেম)` : t.nav.cart}
          className={`relative flex items-center justify-center gap-1.5 px-3 h-11 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer shrink-0 ${
            cartTotal.totalBottles > 0
              ? 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white shadow-md shadow-sky-600/25'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/80'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <ShoppingCart className={`w-4.5 h-4.5 ${cartTotal.totalBottles > 0 ? 'text-white stroke-[2.2]' : 'text-slate-600 stroke-[1.8]'}`} />
            
            {/* Item Count Notification Badge */}
            {cartTotal.totalBottles > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-black h-4 min-w-4 px-1 rounded-full flex items-center justify-center shadow-xs border border-white">
                {formatNumber(cartTotal.totalBottles)}
              </span>
            )}
          </div>

          {/* Iconic Money Display (৳) */}
          <span className={`text-[12px] font-black tracking-tight tabular-nums ${cartTotal.totalBottles > 0 ? 'text-amber-200' : 'text-slate-800'}`}>
            {cartTotal.totalBottles > 0 ? formatCurrency(cartTotal.grandTotal) : '৳০'}
          </span>
        </button>

        {/* Emergency Delivery Hotline Call Pill */}
        <a
          href="tel:+8801711102448"
          aria-label={t.hero.emergencyDelivery}
          title={t.hero.emergencyDelivery}
          className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/20 active:scale-95 transition-all duration-200 cursor-pointer shrink-0 ml-0.5"
        >
          <PhoneCall className="w-4.5 h-4.5 animate-pulse stroke-[2.2]" />
        </a>

      </div>
    </nav>
  );
};
