import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
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
