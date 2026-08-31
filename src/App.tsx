import React, { useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { initGA, trackPageView } from './lib/analytics';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EasyOrderSection } from './components/EasyOrderSection';
import { PricingCalculator } from './components/PricingCalculator';
import { ProductCatalog } from './components/ProductCatalog';
import { SubscriptionBuilder } from './components/SubscriptionBuilder';
import { EventOrderForm } from './components/EventOrderForm';
import { QualityStandards } from './components/QualityStandards';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { LocationPickerModal } from './components/LocationPickerModal';
import { NotificationToast } from './components/NotificationToast';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { OfflineNoticeBanner } from './components/OfflineNoticeBanner';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { currentView } = useStore();
  const { language, t } = useLanguage();

  useEffect(() => {
    // Initialize Google Analytics on mount
    initGA();
  }, []);

  useEffect(() => {
    // Map view IDs to meaningful page titles for GA4 analytics & Document Title
    const viewTitleMapBn: Record<string, string> = {
      home: `${t.appName} | বিশুদ্ধ খাবার পানি ফ্যাক্টরি ও অনলাইন ডেলিভারি`,
      subscriptions: `মাসিক প্যাকেজ ও সাবস্ক্রিপশন | ${t.appName}`,
      products: `পণ্য ও এক্সেসরিজ তালিকা | ${t.appName}`,
      calculator: `পানি খরচ ও সাশ্রয় ক্যালকুলেটর | ${t.appName}`,
      events: `অনুষ্ঠান ও কর্পোরেট পানি বুকিং | ${t.appName}`,
      quality: `৭-ধাপ ফিল্ট্রেশন ও ল্যাব টেস্ট রিপোর্ট | ${t.appName}`,
      customer_portal: `কাস্টমার ড্যাশবোর্ড ও অর্ডার হিস্ট্রি | ${t.appName}`,
      admin_dashboard: `ফ্যাক্টরি অ্যাডমিন কন্ট্রোল প্যানেল | ${t.appName}`,
    };

    const viewTitleMapEn: Record<string, string> = {
      home: `${t.appName} | Pure Mineral Water Factory & Delivery in Sylhet`,
      subscriptions: `Monthly Water Subscription Plans | ${t.appName}`,
      products: `Products & Accessories Catalog | ${t.appName}`,
      calculator: `Water Consumption & Savings Calculator | ${t.appName}`,
      events: `Bulk Water Booking for Events | ${t.appName}`,
      quality: `7-Stage Purification & Lab Reports | ${t.appName}`,
      customer_portal: `Customer Dashboard & Orders | ${t.appName}`,
      admin_dashboard: `Factory Operations & Dispatch Console | ${t.appName}`,
    };

    const activeMap = language === 'bn' ? viewTitleMapBn : viewTitleMapEn;
    const title = activeMap[currentView] || t.appName;
    const path = currentView === 'home' ? '/' : `/${currentView}`;
    
    document.title = title;
    trackPageView(title, path);
  }, [currentView, language, t]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Persistent Top Navigation Bar */}
      <Navbar />

      {/* Global Offline Status Banner */}
      <OfflineNoticeBanner />

      {/* Main View Router */}
      <main className="flex-1 pb-24 sm:pb-28 lg:pb-0">
        {currentView === 'home' && (
          <>
            <Hero />
            <EasyOrderSection />
            <PricingCalculator />
            <ProductCatalog />
            <SubscriptionBuilder />
            <QualityStandards />
            <EventOrderForm />
          </>
        )}

        {currentView === 'subscriptions' && (
          <div className="py-6">
            <SubscriptionBuilder />
            <PricingCalculator />
          </div>
        )}

        {currentView === 'products' && (
          <div className="py-6">
            <ProductCatalog />
            <PricingCalculator />
          </div>
        )}

        {currentView === 'calculator' && (
          <div className="py-6">
            <PricingCalculator />
            <SubscriptionBuilder />
          </div>
        )}

        {currentView === 'events' && (
          <div className="py-6">
            <EventOrderForm />
            <QualityStandards />
          </div>
        )}

        {currentView === 'quality' && (
          <div className="py-6">
            <QualityStandards />
          </div>
        )}

        {currentView === 'customer_portal' && (
          <CustomerDashboard />
        )}

        {currentView === 'admin_dashboard' && (
          <AdminDashboard />
        )}
      </main>

      {/* Global Modals, Drawers & PWA Install Banner */}
      <CartDrawer />
      <CheckoutModal />
      <LocationPickerModal />
      <NotificationToast />
      <PWAInstallBanner />

      {/* Mobile-First Fixed Bottom Navigation */}
      <MobileBottomNav />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <StoreProvider>
          <AppContent />
        </StoreProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

