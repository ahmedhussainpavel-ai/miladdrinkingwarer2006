import React, { useState, useRef, useEffect } from 'react';
import { useStore, AppView } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { MiladLogo } from './MiladLogo';
import { AuthModal } from './AuthModal';
import { 
  Droplet, 
  ShoppingCart, 
  User, 
  ShieldCheck, 
  Layers, 
  Menu, 
  X, 
  Calendar, 
  Calculator, 
  Sparkles, 
  Package, 
  LogOut,
  Wallet,
  RotateCcw,
  MapPin,
  MessageSquare,
  PhoneCall,
  ChevronDown,
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';
import { createWhatsAppChatUrl } from '../lib/whatsapp';
import { trackWhatsAppClick, trackPhoneCall } from '../lib/analytics';

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView, cartTotal, setIsCartDrawerOpen } = useStore();
  const { user, signOut, loginAsDemoUser } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryNavItems: { label: string; view: AppView }[] = [
    { label: 'হোম', view: 'home' },
    { label: 'পণ্য তালিকা', view: 'products' },
    { label: 'মাসিক প্যাকেজ', view: 'subscriptions' },
    { label: 'ক্যালকুলেটর', view: 'calculator' },
  ];

  const secondaryNavItems: { label: string; view: AppView; icon: any; badge?: string; desc?: string }[] = [
    { 
      label: 'অনুষ্ঠান ও কর্পোরেট অর্ডার', 
      view: 'events', 
      icon: Sparkles,
      desc: 'বিয়ে, সেমিনার ও পার্টির জন্য স্পেশাল সাপ্লাই'
    },
    { 
      label: 'ল্যাব টেস্ট ও বিশুদ্ধতা', 
      view: 'quality', 
      icon: ShieldCheck,
      desc: 'বিএসটিআই মান ও ৭-ধাপের ফিল্ট্রেশন রিপোর্ট' 
    },
    { 
      label: 'রেফার বোনাস (৳৫০)', 
      view: 'customer_portal', 
      icon: Sparkles, 
      badge: 'বোনাস',
      desc: 'বন্ধুদের রেফার করে ওয়ালেট ব্যালেন্স জিতুন'
    },
    { 
      label: 'ফ্যাক্টরি এডমিন প্যানেল', 
      view: 'admin_dashboard', 
      icon: Layers,
      desc: 'ম্যানেজমেন্ট, ডেলিভারি ও ইনভয়েস কনসোল'
    },
  ];

  const userInitial = user?.displayName ? user.displayName.trim().charAt(0).toUpperCase() : 'U';

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        
        {/* Main Clean Navigation Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15 sm:h-17 gap-2 sm:gap-4">
            
            {/* Brand Logo & Name (Left) */}
            <div 
              onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
              className="cursor-pointer group select-none shrink-0 transition-opacity hover:opacity-90 flex items-center"
            >
              <div className="hidden sm:block">
                <MiladLogo size="md" />
              </div>
              <div className="sm:hidden">
                <MiladLogo size="sm" />
              </div>
            </div>

            {/* Desktop Clean Menu (Center) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {primaryNavItems.map((item) => {
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => setCurrentView(item.view)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all relative cursor-pointer ${
                      isActive
                        ? 'text-cyan-900 bg-cyan-50/90 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-cyan-600 rounded-full"></span>
                    )}
                  </button>
                );
              })}

              {/* More Menu Dropdown */}
              <div className="relative" ref={moreMenuRef}>
                <button
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    moreDropdownOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>অন্যান্য সেবা</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180 text-slate-700' : ''}`} />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {secondaryNavItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          onClick={() => {
                            if (item.view === 'admin_dashboard') {
                              loginAsDemoUser('admin');
                            }
                            setCurrentView(item.view);
                            setMoreDropdownOpen(false);
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-start gap-3 transition-colors cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-cyan-50 group-hover:bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-slate-800 group-hover:text-cyan-900">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            {item.desc && (
                              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                                {item.desc}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>

            {/* Right Action Hub */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Shopping Cart Trigger */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative p-2 sm:p-2.5 rounded-xl text-slate-700 bg-slate-50 hover:bg-cyan-50 hover:text-cyan-800 border border-slate-200/80 transition-all flex items-center gap-1.5 cursor-pointer group shrink-0"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-4.5 h-4.5 text-slate-600 group-hover:text-cyan-700 transition-colors" />
                {cartTotal.totalBottles > 0 ? (
                  <>
                    <span className="hidden xl:inline text-xs font-bold text-slate-900">
                      ৳{cartTotal.grandTotal}
                    </span>
                    <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-extrabold h-4.5 min-w-4.5 px-1 rounded-full flex items-center justify-center shadow-xs">
                      {cartTotal.totalBottles}
                    </span>
                  </>
                ) : null}
              </button>

              {/* User Account / Profile */}
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <div>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-xl border border-slate-200 hover:border-cyan-400 bg-slate-50 hover:bg-white transition-all cursor-pointer shrink-0"
                      aria-label="User profile menu"
                    >
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName}
                          className="w-7 h-7 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-cyan-700 text-white text-xs font-bold flex items-center justify-center">
                          {userInitial}
                        </div>
                      )}
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block mr-0.5" />
                    </button>

                    {/* Dropdown Profile Menu */}
                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-68 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                        
                        {/* User Info Header */}
                        <div className="p-3 bg-slate-50/90 rounded-xl mb-2 border border-slate-200/60">
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] font-semibold text-slate-500">অ্যাকাউন্ট</p>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800">
                              {user.role === 'admin' ? 'এডমিন' : 'গ্রাহক'}
                            </span>
                          </div>
                          <p className="text-sm font-extrabold text-slate-900 truncate mt-0.5">{user.displayName}</p>
                          <p className="text-[11px] text-slate-500 truncate">{user.phone || user.email}</p>
                          
                          <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <Wallet className="w-3.5 h-3.5 text-cyan-600" />
                              <span>ওয়ালেট: <strong className="text-slate-900">৳{user.walletBalance}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <RotateCcw className="w-3.5 h-3.5 text-teal-600" />
                              <span>জার: <strong className="text-teal-700">{user.emptyJarsHeld?.jar20L || 0}টি</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Customer Portal Link */}
                        <button
                          onClick={() => {
                            setCurrentView('customer_portal');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-cyan-50 hover:text-cyan-900 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <User className="w-4 h-4 text-cyan-600" />
                            <span>আমার ড্যাশবোর্ড ও অর্ডার</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>

                        {/* Admin Dashboard Entry */}
                        <button
                          onClick={() => {
                            loginAsDemoUser('admin');
                            setCurrentView('admin_dashboard');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Layers className="w-4 h-4 text-amber-500" />
                            <span>ফ্যাক্টরি এডমিন প্যানেল</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>

                        <div className="my-1 border-t border-slate-100"></div>

                        {/* Sign Out */}
                        <button
                          onClick={() => {
                            signOut();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>লগআউট (Sign Out)</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0"
                  >
                    <User className="w-3.5 h-3.5 text-slate-600" />
                    <span>লগইন</span>
                  </button>
                )}
              </div>

              {/* Mobile Menu Trigger (Hamburger) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-800" />}
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Slide-Down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-150">
            
            {/* Navigation Links Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {primaryNavItems.map((item) => {
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => {
                      setCurrentView(item.view);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-cyan-50 text-cyan-900 border border-cyan-200'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                  </button>
                );
              })}
            </div>

            {/* Secondary Services in Mobile */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 px-1 uppercase tracking-wider">অন্যান্য সেবা</p>
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.view === 'admin_dashboard') {
                        loginAsDemoUser('admin');
                      }
                      setCurrentView(item.view);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-cyan-600" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                        {item.badge}
                      </span>
                    ) : (
                      <ArrowRight className="w-3 h-3 text-slate-300" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Auth Button */}
            <div className="pt-2 border-t border-slate-100">
              {user ? (
                <button
                  onClick={() => {
                    setCurrentView('customer_portal');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-700 text-white text-xs font-bold flex items-center justify-center">
                      {userInitial}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-900">{user.displayName}</p>
                      <p className="text-[11px] text-cyan-700 font-medium">ওয়ালেট: ৳{user.walletBalance}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>লগইন বা একাউন্ট খুলুন</span>
                </button>
              )}
            </div>

            {/* Hotline in Mobile Drawer */}
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <a
                href="tel:+8801711102448"
                onClick={() => trackPhoneCall('navbar_drawer', '+8801711102448')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                <span>০১৭১১-১০২৪৪৮</span>
              </a>
              <a
                href="https://wa.me/8801711102448"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-teal-600 text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-white" />
                <span>হোয়াটসঅ্যাপ</span>
              </a>
            </div>

          </div>
        )}
      </header>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};
