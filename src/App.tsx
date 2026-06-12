import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Footer } from './components/Footer';

// Pages / Views
import { HomeView } from './components/HomeView';

import { ShopView } from './components/ShopView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartView } from './components/CartView';
import { QuoteRequestView } from './components/QuoteRequestView';
import { UserDashboardView } from './components/UserDashboardView';
import { LoginView } from './components/LoginView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AboutView } from './components/AboutView';

const NavigationRouterContent: React.FC = () => {
  const { currentView } = useApp();

  const handleRenderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <ShopView />;
      case 'about':
        return <AboutView />;
      case 'product-detail':
        return <ProductDetailView />;
      case 'cart':
        return <CartView />;
      case 'devis-request':
        return <QuoteRequestView />;
      case 'dashboard':
        return <UserDashboardView />;
      case 'login':
        return <LoginView />;
      case 'admin-dashboard':
        return <AdminDashboardView />;
      default:
        return (
          <div className="min-h-screen flex items-center justify-center pt-32">
            <p className="text-gray-500 font-serif">Page Introuvable</p>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#FFF8F9] font-sans antialiased text-[#2D2D2D]">
      {/* Absolute top navbar */}
      <Navbar />

      {/* Main route layout container */}
      <div className="flex-grow">
        {handleRenderActiveView()}
      </div>

      {/* Persistent floating helper buttons */}
      <WhatsAppButton />

      {/* Corporate Dakar footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <NavigationRouterContent />
    </AppProvider>
  );
}
