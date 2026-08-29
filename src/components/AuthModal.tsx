import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { MiladLogo } from './MiladLogo';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  LogIn, 
  ArrowRight,
  UserCheck,
  Building2
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'customer' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'customer'
}) => {
  const { user, signInWithGoogle, loginWithPhoneAndName, loginAsDemoUser, signOut } = useAuth();
  const { showToast, setCurrentView } = useStore();

  const [authMode, setAuthMode] = useState<'phone' | 'google' | 'demo'>('phone');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('মিরবক্সটুলা');
  const [addressLine, setAddressLine] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      showToast('error', 'ফোন নম্বর প্রয়োজন', 'অনুগ্রহ করে আপনার মোবাইল নম্বরটি লিখুন।');
      return;
    }

    setIsSubmitting(true);
    try {
      await loginWithPhoneAndName(
        name.trim() || 'সম্মানিত গ্রাহক',
        phone.trim(),
        area,
        addressLine.trim()
      );
      showToast('success', 'লগইন সফল!', `স্বাগতম ${name || 'গ্রাহক'}! আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।`);
      onClose();
    } catch (err: any) {
      showToast('error', 'লগইন ব্যর্থ', err?.message || 'অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      showToast('success', 'গুগল সাইন-ইন সফল!', 'মিলাদ ড্রিংকিং ওয়াটারে আপনাকে স্বাগতম।');
      onClose();
    } catch (err: any) {
      showToast('error', 'গুগল সাইন-ইন বাতিল', 'গুগল অথেন্টিকেশন সম্পন্ন হয়নি।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (role: 'customer' | 'admin') => {
    loginAsDemoUser(role);
    if (role === 'admin') {
      setCurrentView('admin_dashboard');
      showToast('info', 'এডমিন মোড সক্রিয়', 'ফ্যাক্টরি অ্যাডমিন কন্ট্রোল প্যানেলে প্রবেশ করেছেন।');
    } else {
      showToast('success', 'গ্রাহক অ্যাকাউন্ট সক্রিয়', 'কাস্টমার ড্যাশবোর্ডে প্রবেশ করেছেন।');
    }
    onClose();
  };

  const handleLogout = async () => {
    await signOut();
    showToast('info', 'লগআউট সম্পন্ন', 'সফলভাবে লগআউট হয়েছেন।');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-sky-50 via-cyan-50 to-teal-50 p-6 border-b border-cyan-100 flex items-center justify-between">
          <MiladLogo size="sm" showSubtitle={false} />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {user ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-cyan-700 text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md">
                {user.displayName?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{user.displayName}</h3>
                <p className="text-xs text-slate-500">{user.phone || user.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{user.role === 'admin' ? 'এডমিন (ফ্যাক্টরি ইনচার্জ)' : 'সম্মানিত গ্রাহক'}</span>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => {
                    setCurrentView(user.role === 'admin' ? 'admin_dashboard' : 'customer_portal');
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all"
                >
                  ড্যাশবোর্ডে যান
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all"
                >
                  লগআউট
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Heading */}
              <div className="text-center space-y-1">
                <h2 className="text-xl font-heading font-extrabold text-slate-900">
                  লগইন বা একাউন্ট খুলুন
                </h2>
                <p className="text-xs text-slate-500">
                  পানি অর্ডার ট্র্যাক করতে ও নিয়মিত ডেলিভারি পেতে একাউন্ট করুন
                </p>
              </div>

              {/* Mode Switch Tabs */}
              <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
                <button
                  onClick={() => setAuthMode('phone')}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    authMode === 'phone' ? 'bg-white text-cyan-900 shadow-xs' : 'hover:text-slate-900'
                  }`}
                >
                  মোবাইল নম্বর দিয়ে
                </button>
                <button
                  onClick={() => setAuthMode('google')}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    authMode === 'google' ? 'bg-white text-cyan-900 shadow-xs' : 'hover:text-slate-900'
                  }`}
                >
                  গুগল সাইন-ইন
                </button>
                <button
                  onClick={() => setAuthMode('demo')}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    authMode === 'demo' ? 'bg-white text-cyan-900 shadow-xs' : 'hover:text-slate-900'
                  }`}
                >
                  টেস্ট মোড
                </button>
              </div>

              {/* Tab 1: Phone / Name Form */}
              {authMode === 'phone' && (
                <form onSubmit={handlePhoneSubmit} className="space-y-3.5 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      আপনার নাম <span className="text-slate-400 font-normal">(ঐচ্ছিক)</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="যেমন: আহমেদ হোসেন"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      মোবাইল নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="০১৭১১-১০২৪৪৮"
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">সিলেটের এলাকা</label>
                      <select
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="w-full px-2.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:border-cyan-500 outline-hidden"
                      >
                        <option value="মিরবক্সটুলা">মিরবক্সটুলা</option>
                        <option value="জিন্দাবাজার">জিন্দাবাজার</option>
                        <option value="আম্বরখানা">আম্বরখানা</option>
                        <option value="শিবগঞ্জ">শিবগঞ্জ</option>
                        <option value="উপশহর">উপশহর</option>
                        <option value="মদিনা মার্কেট">মদিনা মার্কেট</option>
                        <option value="দক্ষিণ সুরমা">দক্ষিণ সুরমা</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">বাসা/রোড নম্বর</label>
                      <input
                        type="text"
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        placeholder="বাড়ি ১২, রোড ৩"
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-cyan-500 outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-cyan-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{isSubmitting ? 'প্রক্রিয়াধীন...' : 'লগইন / একাউন্ট তৈরি করুন'}</span>
                  </button>
                </form>
              )}

              {/* Tab 2: Google Sign In */}
              {authMode === 'google' && (
                <div className="space-y-4 py-3 text-center">
                  <p className="text-xs text-slate-600">
                    গুগল একাউন্ট দিয়ে এক ক্লিকেই সম্পূর্ণ নিরাপদে সাইন-ইন করুন:
                  </p>

                  <button
                    onClick={handleGoogleLogin}
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:border-cyan-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2.5 shadow-xs transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Google দিয়ে সাইন-ইন করুন</span>
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>১০০% নিরাপদ ও এনক্রিপ্টেড ডাটা</span>
                  </div>
                </div>
              )}

              {/* Tab 3: Demo / Test Access */}
              {authMode === 'demo' && (
                <div className="space-y-3 py-2">
                  <p className="text-xs text-slate-600 text-center">
                    দ্রুত ফিচার পরীক্ষা করার জন্য নিচের যেকোনো একটিতে ক্লিক করুন:
                  </p>

                  <div className="grid grid-cols-1 gap-2.5">
                    <button
                      onClick={() => handleDemoLogin('customer')}
                      className="p-3 rounded-2xl border border-cyan-200 bg-cyan-50/70 hover:bg-cyan-100/70 text-left transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center">
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-cyan-950">কাস্টমার মোড টেস্ট</p>
                          <p className="text-[10px] text-slate-500">অর্ডার হিস্ট্রি, ওয়ালেট ও রিফিল জার ট্র্যাক</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-cyan-700 transition-transform group-hover:translate-x-1" />
                    </button>

                    <button
                      onClick={() => handleDemoLogin('admin')}
                      className="p-3 rounded-2xl border border-slate-300 bg-slate-900 text-white hover:bg-slate-800 text-left transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">ফ্যাক্টরি এডমিন প্যানেল</p>
                          <p className="text-[10px] text-slate-400">অর্ডার ম্যানেজমেন্ট, ড্রাইভার ও হোয়াটসঅ্যাপ নোটিফিকেশন</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-emerald-400 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
