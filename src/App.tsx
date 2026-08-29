import React, { useEffect } from 'react';
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
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { currentView } = useStore();

  useEffect(() => {
    // Initialize Google Analytics on mount
    initGA();
  }, []);

  useEffect(() => {
    // Map view IDs to meaningful page titles for GA4 analytics
    const viewTitleMap: Record<string, string> = {
      home: 'Home | বিশুদ্ধ ড্রিংকিং ওয়াটার ফ্যাক্টরি',
      subscriptions: 'Monthly Plans & Subscriptions | মাসিক ওয়াটার প্যাকেজ',
      products: 'Products & Price Catalog | পণ্য তালিকা ও দরদাম',
      calculator: 'Water Cost Calculator | পানির খরচ ক্যালকুলেটর',
      events: 'Event & Bulk Water Booking | অনুষ্ঠান ও কর্পোরেট সাপ্লাই',
      quality: 'Purification & Quality Standards | পানির গুণগত মান ও টেস্ট রিপোর্ট',
      customer_portal: 'Customer Account Portal | কাস্টমার ড্যাশবোর্ড',
      admin_dashboard: 'Admin Control Center | অ্যাডমিন ড্যাশবোর্ড',
    };

    const title = viewTitleMap[currentView] || 'Milad Drinking Water';
    const path = currentView === 'home' ? '/' : `/${currentView}`;
    
    document.title = `${title} - Milad Drinking Water`;
    trackPageView(title, path);
  }, [currentView]);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Persistent Navigation */}
      <Navbar />

      {/* Main View Router with mobile bottom padding to prevent nav overlap */}
      <main className="flex-1 pb-20 lg:pb-0">
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

      {/* Mobile-First Fixed Bottom Navigation (phones & tablets) */}
      <MobileBottomNav />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </AuthProvider>
  );
}
