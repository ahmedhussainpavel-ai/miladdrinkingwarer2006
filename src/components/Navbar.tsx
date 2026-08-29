import React, { useState, useRef, useEffect } from 'react';
import { useStore, AppView } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { MiladLogo } from './MiladLogo';
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
  Smartphone,
  Download
} from 'lucide-react';
import { createWhatsAppChatUrl } from '../lib/whatsapp';
import { InstallAppModal } from './InstallAppModal';

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView, cartTotal, setIsCartDrawerOpen } = useStore();
  const { user, signInWithGoogle, signOut, loginAsDemoUser } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);
  
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

  const handleWhatsAppQuickChat = () => {
    const url = createWhatsAppChatUrl(
      '+8801711102448',
      'আসসালামু আলাইকুম, আমি মিলাদ ড্রিংকিং ওয়াটার (মিরবক্সটুলা, সিলেট) থেকে পানি অর্ডার করতে চাই।'
    );
    window.open(url, '_blank');
  };

  const handleQuickOrderClick = () => {
    if (currentView === 'home') {
      const el = document.getElementById('easy-order-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    setCurrentView('products');
  };

  const primaryNavItems: { label: string; view: AppView; icon: any }[] = [
    { label: 'হোম', view: 'home', icon: Droplet },
    { label: 'পণ্য ও অর্ডার', view: 'products', icon: Package },
    { label: 'সাবস্ক্রিপশন', view: 'subscriptions', icon: Calendar },
    { label: 'ক্যালকুলেটর', view: 'calculator', icon: Calculator },
  ];

  const secondaryNavItems: { label: string; view: AppView; icon: any; badge?: string }[] = [
    { label: 'অনুষ্ঠান ও বাল্ক অর্ডার', view: 'events', icon: Sparkles },
    { label: 'কারখানা ও বিশুদ্ধতা', view: 'quality', icon: ShieldCheck },
    { label: 'রেফার প্রোগ্রাম (৳৫০ বোনাস)', view: 'customer_portal', icon: Sparkles, badge: 'বোনাস' },
    { label: 'সিস্টেম আর্কিটেকচার', view: 'architecture', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-xs">
      
      {/* Top Essential Contact Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Plant location & Quality */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1 font-bold text-cyan-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>মিলাদ ড্রিংকিং ওয়াটার</span>
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-300">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>মিরবক্সটুলা, সিলেট</span>
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline text-cyan-300 text-[11px]">
              TDS &lt; ৩৫ PPM | RO + UV পিউরিফিকেশন
            </span>
          </div>

          {/* Quick Hotlines */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <a 
              href="tel:+8801711102448" 
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-xs cursor-pointer"
            >
              <PhoneCall className="w-3 h-3" />
              <span>01711-102448</span>
            </a>

            <button
              onClick={handleWhatsAppQuickChat}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-emerald-400" />
              <span className="hidden sm:inline">হোয়াটসঅ্যাপ</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Clean Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo (Left) */}
          <div 
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
            className="cursor-pointer group select-none shrink-0"
          >
            <MiladLogo size="md" compactText={true} />
          </div>

          {/* Desktop Clean Menu (Center) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {primaryNavItems.map((item) => {
              const isActive = currentView === item.view;
              const Icon = item.icon;
              return (
                <button
                  key={item.view}
                  onClick={() => setCurrentView(item.view)}
                  className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'text-cyan-900 bg-cyan-50 border border-cyan-200 shadow-xs'
                      : 'text-slate-700 hover:text-cyan-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* More Menu Dropdown */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  moreDropdownOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>আরও সেবা</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={() => {
                          setCurrentView(item.view);
                          setMoreDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-cyan-50 hover:text-cyan-900 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-cyan-600" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Hub */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* App / APK Install Button (Mobile & Desktop) */}
            <button
              onClick={() => setInstallModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 text-xs font-bold transition-all cursor-pointer"
              title="মোবাইল বা পিসিতে অ্যাপ ইন্সটল করুন"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-600" />
              <span>অ্যাপ (PWA/APK)</span>
            </button>

            {/* Quick Order CTA (Desktop/Tablet) */}
            <button
              onClick={handleQuickOrderClick}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs xl:text-sm shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Droplet className="w-4 h-4 fill-white" />
              <span>অর্ডার করুন</span>
            </button>

            {/* Portal Switcher Pill: গ্রাহক vs এডমিন */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setCurrentView('customer_portal')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  currentView === 'customer_portal'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-cyan-800'
                }`}
                title="গ্রাহকের ড্যাশবোর্ড"
              >
                <User className="w-3.5 h-3.5" />
                <span>গ্রাহক</span>
              </button>
              
              <button
                onClick={() => {
                  loginAsDemoUser('admin');
                  setCurrentView('admin_dashboard');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  currentView === 'admin_dashboard'
                    ? 'bg-slate-900 text-cyan-300 shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                title="ফ্যাক্টরি এডমিন প্যানেল"
              >
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                <span>এডমিন</span>
              </button>
            </div>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 bg-white hover:bg-cyan-50 hover:text-cyan-700 border border-slate-200 hover:border-cyan-300 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <ShoppingCart className="w-4.5 h-4.5 text-cyan-700" />
              {cartTotal.totalBottles > 0 && (
                <>
                  <span className="hidden xl:inline text-xs font-extrabold text-cyan-950">
                    ৳{cartTotal.grandTotal}
                  </span>
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-extrabold h-4.5 min-w-4.5 px-1 rounded-full flex items-center justify-center shadow-md">
                    {cartTotal.totalBottles}
                  </span>
                </>
              )}
            </button>

            {/* User Profile / Login */}
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-xl border border-slate-200 hover:border-cyan-300 bg-white cursor-pointer"
                  >
                    <img
                      src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={user.displayName}
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                    <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block mr-1" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-3 bg-slate-50 rounded-xl mb-2 border border-slate-200/60">
                        <p className="text-xs text-slate-500 font-medium">লগইন রয়েছেন</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.displayName}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        
                        <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-slate-700">
                            <Wallet className="w-3.5 h-3.5 text-cyan-600" />
                            <span>ওয়ালেট: <strong className="text-slate-900">৳{user.walletBalance}</strong></span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-700">
                            <RotateCcw className="w-3.5 h-3.5 text-cyan-600" />
                            <span>জার: <strong className="text-cyan-700">{user.emptyJarsHeld.jar20L}টি</strong></span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setCurrentView('customer_portal');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-cyan-700 rounded-lg flex items-center gap-2 cursor-pointer"
                      >
                        <User className="w-4 h-4 text-cyan-600" />
                        <span>গ্রাহক পোর্টাল ও অর্ডার হিস্ট্রি</span>
                      </button>

                      <button
                        onClick={() => {
                          loginAsDemoUser('admin');
                          setCurrentView('admin_dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-cyan-700 rounded-lg flex items-center gap-2 cursor-pointer"
                      >
                        <Layers className="w-4 h-4 text-amber-500" />
                        <span>ফ্যাক্টরি এডমিন প্যানেল</span>
                      </button>

                      <div className="my-1 border-t border-slate-100"></div>

                      <button
                        onClick={() => {
                          signOut();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>লগআউট (Sign Out)</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => signInWithGoogle()}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">লগইন</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Trigger (Hamburger) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Slide-Down Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-150">
          
          {/* Portal Switch Bar */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => { setCurrentView('customer_portal'); setMobileMenuOpen(false); }}
              className={`p-2 rounded-xl text-xs font-bold text-center border cursor-pointer ${
                currentView === 'customer_portal' ? 'bg-cyan-50 border-cyan-300 text-cyan-800' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              👤 গ্রাহক পোর্টাল
            </button>
            <button
              onClick={() => { loginAsDemoUser('admin'); setCurrentView('admin_dashboard'); setMobileMenuOpen(false); }}
              className={`p-2 rounded-xl text-xs font-bold text-center border cursor-pointer ${
                currentView === 'admin_dashboard' ? 'bg-slate-900 border-slate-800 text-cyan-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              🏢 এডমিন ড্যাশবোর্ড
            </button>
          </div>

          <div className="space-y-1">
            {/* Quick Order Button in Drawer */}
            <button
              onClick={() => { 
                handleQuickOrderClick();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-black bg-sky-600 text-white cursor-pointer"
            >
              <Droplet className="w-4 h-4 fill-white" />
              <span>💧 দ্রুত পানি অর্ডার করুন</span>
            </button>

            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.view}
                  onClick={() => { setCurrentView(item.view); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                    currentView === item.view ? 'bg-cyan-50 text-cyan-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-600" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="my-1 border-t border-slate-100"></div>

            {/* Install App Link */}
            <button
              onClick={() => { setInstallModalOpen(true); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-cyan-900 bg-cyan-50 border border-cyan-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-cyan-700" />
                <span>📱 ফোনে অ্যাপ ইন্সটল করুন (PWA/APK)</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-md bg-cyan-600 text-white text-[9px]">
                Install
              </span>
            </button>

            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => { setCurrentView(item.view); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* APK / PWA Install Guide & Trigger Modal */}
      <InstallAppModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
      />
    </header>
  );
};
