import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartActivityToast } from './components/CartActivityToast';
import { HomeUniverseLinks } from './components/HomeUniverseLinks';

import { HomeView } from './components/HomeView';

const safeLazy = (importFn: () => Promise<any>) => {
  return lazy(() =>
    importFn().catch((err) => {
      console.warn("Dynamic import failed, reloading page...", err);
      window.location.reload();
      return { default: () => null };
    })
  );
};

const ShopView = safeLazy(() => import('./components/ShopView').then((m) => ({ default: m.ShopView })));
const ProductDetailView = safeLazy(() => import('./components/ProductDetailView').then((m) => ({ default: m.ProductDetailView })));
const CartView = safeLazy(() => import('./components/CartView').then((m) => ({ default: m.CartView })));
const QuoteRequestView = safeLazy(() => import('./components/QuoteRequestView').then((m) => ({ default: m.QuoteRequestView })));
const UserDashboardView = safeLazy(() => import('./components/UserDashboardView').then((m) => ({ default: m.UserDashboardView })));
const LoginView = safeLazy(() => import('./components/LoginView').then((m) => ({ default: m.LoginView })));
const AdminDashboardView = safeLazy(() => import('./components/AdminDashboardView').then((m) => ({ default: m.AdminDashboardView })));
const AboutView = safeLazy(() => import('./components/AboutView').then((m) => ({ default: m.AboutView })));
const PrivacyPolicyView = safeLazy(() => import('./components/PrivacyPolicyView').then((m) => ({ default: m.PrivacyPolicyView })));

const NavigationRouterContent: React.FC = () => {
  const { currentView } = useApp();
  const isPublicView = currentView !== 'admin-dashboard' && currentView !== 'login';

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
      case 'privacy':
        return <PrivacyPolicyView />;
      default:
        return (
          <div className="min-h-screen flex items-center justify-center pt-6 md:pt-10">
            <p className="text-gray-500 font-serif">Page Introuvable</p>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-transparent font-sans antialiased text-[#2D2D2D]">
      {/* Absolute top navbar */}
      <Navbar />

      {/* Main route layout container */}
      <Suspense
        fallback={
          <main className="min-h-[60vh] flex items-center justify-center px-4 pt-6 md:pt-10">
            <div className="rounded-3xl border border-[#D4AF37]/20 bg-white/80 px-6 py-5 text-sm text-stone-500 shadow-sm backdrop-blur">
              Chargement de l'expérience Art de Table...
            </div>
          </main>
        }
      >
        <div key={currentView} className="flex-grow pt-[6.2rem] md:pt-[7.55rem] pb-0 page-fade-in">
          {handleRenderActiveView()}
        </div>
      </Suspense>

      {/* Persistent floating helper buttons */}
      <CartActivityToast />

      {/* Pre-footer targeted SEO category links */}
      {isPublicView && <HomeUniverseLinks />}

      {/* Corporate Dakar footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <NavigationRouterContent />
      </ErrorBoundary>
    </AppProvider>
  );
}
