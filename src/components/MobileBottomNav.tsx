import React from 'react';
import { useStore, AppView } from '../context/StoreContext';
import { 
  Home, 
  Package, 
  Calendar, 
  User, 
  ShoppingCart,
  PhoneCall
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, cartTotal, setIsCartDrawerOpen } = useStore();

  const navItems: { label: string; view: AppView; icon: React.FC<{ className?: string }> }[] = [
    { label: 'হোম', view: 'home', icon: Home },
    { label: 'পণ্য ও অর্ডার', view: 'products', icon: Package },
    { label: 'সাবস্ক্রিপশন', view: 'subscriptions', icon: Calendar },
    { label: 'গ্রাহক ড্যাশবোর্ড', view: 'customer_portal', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl py-1 px-2 safe-area-pb">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          const Icon = item.icon;

          return (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all active:scale-95 cursor-pointer ${
                isActive
                  ? 'text-cyan-700 font-black'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-cyan-100 text-cyan-800' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] sm:text-[11px] leading-none whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Floating Cart Button in Bottom Nav */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 text-slate-600 hover:text-cyan-700 rounded-xl transition-all active:scale-95 cursor-pointer relative"
          aria-label="শপিং কার্ট দেখুন"
        >
          <div className="relative p-1">
            <ShoppingCart className="w-5 h-5 text-cyan-700" />
            {cartTotal.totalBottles > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-600 text-white text-[10px] font-extrabold h-4.5 min-w-4.5 px-1 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {cartTotal.totalBottles}
              </span>
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] leading-none font-bold text-slate-700">
            {cartTotal.totalBottles > 0 ? `৳${cartTotal.grandTotal}` : 'কার্ট'}
          </span>
        </button>

        {/* Quick Call Action for Emergency Drinking Water */}
        <a
          href="tel:+8801711102448"
          className="min-h-[48px] px-2 flex flex-col items-center justify-center gap-0.5 text-emerald-700 active:scale-95 cursor-pointer"
          title="জরুরী পানি কল"
        >
          <div className="p-1 rounded-xl bg-emerald-100 text-emerald-700">
            <PhoneCall className="w-5 h-5" />
          </div>
          <span className="text-[10px] leading-none font-bold">কল দিন</span>
        </a>
      </div>
    </div>
  );
};
