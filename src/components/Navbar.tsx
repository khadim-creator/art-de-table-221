import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, User, LogOut, Menu, X, Home, ShieldCheck, Search } from 'lucide-react';
import logoImg from '../assets/images/logo-adt.png';

const categories = [
  {
    label: 'Sacs & Emballages',
    slug: 'sacs-emballages-boutique',
    subcategories: [
      { label: 'Sacs papier', slug: 'sacs-papier' },
      { label: 'Sacs cadeaux', slug: 'sacs-cadeaux' },
      { label: 'Sacs personnalisés', slug: 'sacs-personnalises' },
    ],
  },
  {
    label: 'Emballages Alimentaires',
    slug: 'emballages-alimentaires',
    subcategories: [
      { label: 'Barquettes', slug: 'barquettes' },
      { label: 'Boîtes alimentaires', slug: 'boites-alimentaires' },
      { label: 'Consommables', slug: 'consommables' },
      { label: 'Accessoires', slug: 'accessoires-alimentaires' },
    ],
  },
  {
    label: 'Gobelets & Boissons',
    slug: 'gobelets-boissons',
    subcategories: [
      { label: 'Gobelets', slug: 'gobelets' },
      { label: 'Bouteilles', slug: 'bouteilles' },
      { label: 'Accessoires', slug: 'accessoires-boissons' },
    ],
  },
  {
    label: 'Bols & Pots',
    slug: 'bols-pots',
    subcategories: [
      { label: 'Bols', slug: 'bols' },
      { label: 'Pots', slug: 'pots' },
      { label: 'Couvercles', slug: 'couvercles' },
    ],
  },
  {
    label: 'Fast-food & Restauration',
    slug: 'fast-food-restauration',
    subcategories: [
      { label: 'Boîtes burger', slug: 'boites-burger' },
      { label: 'Boîtes sandwich', slug: 'boites-sandwich' },
      { label: 'Boîtes tacos', slug: 'boites-tacos' },
      { label: 'Boîtes pizza', slug: 'boites-pizza' },
    ],
  },
  {
    label: 'Pâtisserie & Boulangerie',
    slug: 'patisserie-boulangerie',
    subcategories: [
      { label: 'Boîtes gâteaux', slug: 'boites-gateaux' },
      { label: 'Boîtes cupcakes', slug: 'boites-cupcakes' },
      { label: 'Supports gâteaux', slug: 'supports-gateaux' },
    ],
  },
  {
    label: 'Bouteilles Personnalisées',
    slug: 'bouteilles-personnalisees',
    subcategories: [
      { label: 'Eau personnalisée', slug: 'eau-personnalisee' },
      { label: 'Jus personnalisés', slug: 'jus-personnalises' },
      { label: 'Étiquettes', slug: 'etiquettes-bouteilles' },
    ],
  },
  {
    label: 'Parfumerie & Cosmétique',
    slug: 'parfumerie-cosmetique',
    subcategories: [
      { label: 'Flacons', slug: 'flacons' },
      { label: 'Pots cosmétiques', slug: 'pots-cosmetiques' },
      { label: 'Packaging cosmétique', slug: 'packaging-cosmetique' },
    ],
  },
  {
    label: 'Étiquettes & Stickers',
    slug: 'etiquettes-stickers',
    subcategories: [
      { label: 'Étiquettes produits', slug: 'etiquettes-produits' },
      { label: 'Stickers', slug: 'stickers' },
    ],
  },
  {
    label: 'Événementiel',
    slug: 'evenementiel',
    subcategories: [
      { label: 'Mariage', slug: 'mariage' },
      { label: 'Baptême', slug: 'bapteme' },
      { label: 'Magal & Gamou', slug: 'magal-gamou' },
      { label: 'Anniversaire', slug: 'anniversaire' },
    ],
  },
  {
    label: 'Packaging Cadeaux',
    slug: 'packaging-cadeaux',
    subcategories: [
      { label: 'Coffrets', slug: 'coffrets' },
      { label: 'Accessoires cadeaux', slug: 'accessoires-cadeaux' },
    ],
  },
  {
    label: 'Articles Personnalisés',
    slug: 'articles-personnalises',
    subcategories: [
      { label: 'Vaisselle personnalisée', slug: 'vaisselle-personnalisee' },
      { label: 'Goodies', slug: 'goodies' },
      { label: 'Textile', slug: 'textile' },
    ],
  },
  {
    label: 'Solutions Impression',
    slug: 'solutions-impression',
    subcategories: [
      { label: 'Supports commerciaux', slug: 'supports-commerciaux' },
      { label: 'Affichage publicitaire', slug: 'affichage-publicitaire' },
      { label: 'Documents administratifs', slug: 'documents-administratifs' },
    ],
  },
  {
    label: 'Solutions Entreprises',
    slug: 'solutions-entreprises',
    subcategories: [
      { label: 'Packaging d\'entreprise', slug: 'packaging-entreprise' },
      { label: 'Communication visuelle', slug: 'communication-visuelle' },
      { label: 'Cadeaux d\'entreprise', slug: 'cadeaux-entreprise' },
    ],
  },
];

// Quick-access categories shown in the desktop top bar (priorités marketing)
const QUICK_CATS = [
  { label: 'Packaging', slug: 'sacs-emballages-boutique' },
  { label: 'Événementiel', slug: 'evenementiel' },
  { label: 'Alimentaire', slug: 'emballages-alimentaires' },
  { label: 'Cadeaux', slug: 'packaging-cadeaux' },
  { label: 'Cosmétique', slug: 'parfumerie-cosmetique' },
  { label: 'Impression', slug: 'solutions-impression' },
];

export const Navbar: React.FC = () => {
  const { currentView, setView, cart, currentUser, logout, setSelectedCategory, selectedCategoryId, searchQuery, setSearchQuery } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [catBarVisible, setCatBarVisible] = useState(true);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => {
      const currentScrollY = window.scrollY;
      const previousScrollY = lastScrollYRef.current;
      const scrollDelta = currentScrollY - previousScrollY;
      const scrolled = currentScrollY > 10;

      setIsScrolled(scrolled);
      // Réduire le bandeau catégories après 120px de scroll
      setCatBarVisible(currentScrollY < 120);

      if (currentScrollY < 80 || scrollDelta < -6) {
        setIsHeaderHidden(false);
      } else if (currentScrollY > 140 && scrollDelta > 6) {
        setIsHeaderHidden(true);
      }

      lastScrollYRef.current = Math.max(currentScrollY, 0);
    };
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!categoryMenuRef.current) return;
      if (!categoryMenuRef.current.contains(event.target as Node)) {
        setCategoryMenuOpen(false);
      }
    };

    window.addEventListener('mousedown', onPointerDown);
    return () => window.removeEventListener('mousedown', onPointerDown);
  }, []);

  // Restore catBar when navigating to shop
  useEffect(() => {
    if (currentView === 'shop') {
      setCatBarVisible(true);
    }
    setIsHeaderHidden(false);
    lastScrollYRef.current = window.scrollY;
  }, [currentView]);

  const totalCartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  const goTo = (view: string) => {
    setMobileMenuOpen(false);
    if (view === 'contact') {
      setView('home');
      setTimeout(() => {
        const el = document.getElementById('footer-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 150);
    } else {
      setView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToCategory = (slug: string) => {
    setMobileMenuOpen(false);
    setCategoryMenuOpen(false);
    setSearchQuery('');
    setSelectedCategory(slug);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToHome = () => {
    setMobileMenuOpen(false);
    setCategoryMenuOpen(false);
    setSearchQuery('');
    setSelectedCategory(null);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Height of the navbar for offset calculations
  const navbarHeight = catBarVisible && currentView !== 'product-detail' ? 'h-12' : 'h-0';
  const showDesktopCategoryBar = currentView !== 'admin-dashboard';
  const hideHeader = isHeaderHidden && !mobileMenuOpen;

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-50 border-b border-[#A67C52]/14 bg-white backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform ${
          hideHeader
            ? '-translate-y-full shadow-none'
            : 'translate-y-0 shadow-[0_10px_30px_rgba(166,124,82,0.09)]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between gap-3 md:gap-5 transition-all duration-300 ${isScrolled ? 'h-[6.1rem] md:h-[6.9rem]' : 'h-[6.8rem] md:h-[7.6rem]'}`}>
            <button
              aria-label="Ouvrir le menu"
              className="md:hidden shrink-0 w-12 h-12 flex items-center justify-center text-[#6A5830] hover:text-[#8C6845] transition"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            <button onClick={() => goTo('home')} className="shrink-0 group" aria-label="Retour à l'accueil">
              <img
                src={logoImg}
                alt="Art de Table"
                className={`object-contain ${isScrolled ? 'h-[5.25rem] w-[5.25rem] md:h-[6.25rem] md:w-[6.25rem]' : 'h-[5.75rem] w-[5.75rem] md:h-[6.75rem] md:w-[6.75rem]'}`}
              />
            </button>

            <div ref={categoryMenuRef} className="hidden md:flex flex-1 max-w-3xl items-center gap-3">
              <div className="relative shrink-0">
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => setCategoryMenuOpen((open) => !open)}
                  className={`relative z-10 inline-flex h-[3.55rem] items-center gap-2 rounded-full border px-6 text-[16px] font-semibold transition ${
                    categoryMenuOpen
                      ? 'border-[#A67C52]/30 bg-[#FFF4EA] text-[#8C6845]'
                      : 'border-[#A67C52]/18 bg-[#FFF9F4] text-[#4B3A22] hover:bg-[#FFF4EA]'
                  }`}
                >
                  <Menu className="h-4 w-4" />
                  <span>Toutes les catégories</span>
                </button>

                <div
                  onMouseDown={(e) => e.stopPropagation()}
                  className={`absolute left-0 top-[calc(100%+0.75rem)] z-[60] w-[min(74rem,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] border border-[#A67C52]/15 bg-white shadow-[0_24px_80px_rgba(140,104,69,0.18)] transition-all duration-200 ${
                    categoryMenuOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
                  }`}
                >
                  <div className="grid gap-3 border-b border-[#A67C52]/10 bg-[linear-gradient(135deg,#1B1115_0%,#2A1B13_100%)] px-5 py-4 sm:px-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/70">Catalogue complet</p>
                      <h3 className="mt-1 font-sans text-[1.8rem] font-black leading-none text-white">
                        Catégories et sous-catégories
                      </h3>
                    </div>
                    <p className="max-w-2xl text-sm leading-relaxed text-white/72">
                      Accédez directement à chaque univers et à ses déclinaisons depuis la barre du haut.
                    </p>
                  </div>

                  <div className="max-h-[32rem] overflow-y-auto px-4 py-4 sm:px-5">
                    <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
                      {categories.map((cat) => (
                        <div key={cat.slug} className="rounded-[1.1rem] border border-white/8 bg-[#1B1115] p-5 shadow-[0_10px_30px_rgba(27,17,21,0.16)]">
                          <button
                            type="button"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={() => goToCategory(cat.slug)}
                            className={`relative z-10 flex w-full items-center justify-between gap-3 rounded-[0.9rem] px-4 py-3 text-left transition ${
                              selectedCategoryId === cat.slug
                                ? 'bg-[#A67C52] text-white'
                                : 'bg-white/6 text-white hover:bg-white/10'
                            }`}
                          >
                            <span className="text-[14px] font-semibold uppercase tracking-[0.16em]">{cat.label}</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Voir</span>
                          </button>

                          {cat.subcategories?.length ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {cat.subcategories.map((sub) => (
                                <button
                                  key={sub.slug}
                                  type="button"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onClick={() => goToCategory(sub.slug)}
                                  className={`relative z-10 rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition ${
                                    selectedCategoryId === sub.slug
                                      ? 'border-[#A67C52] bg-[#A67C52] text-white'
                                      : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
                                  }`}
                                >
                                  {sub.label}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative w-full">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8C6845]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSelectedCategory(null);
                    setSearchQuery(e.target.value);
                    setView('shop');
                  }}
                  onFocus={() => setView('shop')}
                  placeholder="Rechercher un produit, une catégorie..."
                  className="h-[3.25rem] w-full rounded-full border border-[#A67C52]/18 bg-white pl-11 pr-4 text-[15px] text-[#2A1B13] placeholder:text-stone-400 shadow-sm outline-none transition focus:border-[#A67C52]/35 focus:ring-2 focus:ring-[#A67C52]/10"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {currentUser ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setView('dashboard')}
                    className="hidden sm:flex items-center gap-1.5 h-[3.1rem] px-5 rounded-full bg-[#FFF9F4] border border-[#A67C52]/18 transition text-[14px] text-[#4B3A22] font-medium hover:bg-[#FFF4EA]"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden lg:inline">Mon compte</span>
                  </button>
                  {(currentUser?.isAdmin || currentUser?.email?.toLowerCase() === 'khadxxm05@gmail.com') && (
                    <button
                      onClick={() => setView('admin-dashboard')}
                      className="hidden sm:flex h-[3.1rem] w-[3.1rem] items-center justify-center rounded-full border border-[#A67C52]/18 bg-[#FFF9F4] text-[#4B3A22] hover:bg-[#FFF4EA] transition"
                      aria-label="Administration"
                    >
                      <ShieldCheck className="w-5 h-5" />
                    </button>
                  )}
                  <button onClick={logout} className="w-[3.1rem] h-[3.1rem] flex items-center justify-center text-[#4B3A22] hover:bg-[#FFF4EA] transition rounded-full">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setView('login')}
                  className="hidden sm:flex h-[3.1rem] w-[3.1rem] items-center justify-center rounded-full bg-[#FFF9F4] border border-[#A67C52]/18 transition text-[#4B3A22] hover:bg-[#FFF4EA]"
                  aria-label="Administration"
                >
                  <User className="w-5 h-5" />
                </button>
              )}

                <button
                onClick={() => setView('cart')}
                  className="relative flex h-[3.1rem] w-[3.1rem] items-center justify-center rounded-full bg-[#FFF9F4] border border-[#A67C52]/18 transition text-[#4B3A22] hover:bg-[#FFF4EA]"
                  aria-label="Panier"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#8B3A52] text-[11px] font-black leading-none text-white shadow-[0_6px_16px_rgba(139,58,82,0.4)]">
                      {totalCartCount}
                    </span>
                  )}
              </button>
            </div>
          </div>
        </div>

        <div
          className="hidden md:block overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: showDesktopCategoryBar && catBarVisible ? '56px' : '0px',
            opacity: showDesktopCategoryBar && catBarVisible ? 1 : 0,
          }}
        >
          <div style={{ background: 'linear-gradient(90deg, #8C6845 0%, #A67C52 100%)', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`flex items-center gap-1.5 transition-all duration-300 ${isScrolled ? 'h-10' : 'h-11'}`}>
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={goToHome}
                  className={`flex items-center gap-1.5 ${isScrolled ? 'h-9 px-3.5' : 'h-10 px-4'} text-[12px] font-semibold uppercase tracking-[0.18em] transition-all duration-200 whitespace-nowrap rounded-none border-b-2 ${
                    !selectedCategoryId && currentView === 'shop'
                      ? 'text-white border-white/80 bg-white/10'
                      : 'text-white/80 border-transparent hover:text-white hover:bg-white/10 hover:border-white/40'
                  }`}
                  id="nav-cat-accueil"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Accueil</span>
                </button>

                <div className="w-px h-5 bg-white/20 mx-1" />

                {QUICK_CATS.map(link => (
                  <button
                    key={link.label}
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => goToCategory(link.slug)}
                    className={`transition-all duration-200 whitespace-nowrap border-b-2 ${isScrolled ? 'h-9 px-3 text-[12px]' : 'h-10 px-3.5 text-[12px]'} font-semibold uppercase tracking-[0.14em] ${
                      selectedCategoryId === link.slug && currentView === 'shop'
                        ? 'text-white border-white/80 bg-white/10'
                        : 'text-white/80 border-transparent hover:text-white hover:bg-white/10 hover:border-white/40'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}

                <div className="ml-auto" />

                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => goTo('contact')}
                  className={`border-b-2 border-transparent whitespace-nowrap text-white/80 hover:text-white hover:bg-white/10 text-[12px] font-medium uppercase tracking-[0.14em] transition-all duration-200 ${isScrolled ? 'h-9 px-3.5' : 'h-10 px-4'}`}
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* OVERLAY MOBILE */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* DRAWER MOBILE */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white text-[#2D2D2D] z-50 md:hidden transform transition-transform duration-300 shadow-2xl overflow-y-auto ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header du drawer */}
          <div
            className="flex items-center justify-between p-5"
            style={{ background: 'linear-gradient(90deg, #FFFFFF 0%, #FFF9F4 100%)', borderBottom: '1px solid rgba(166,124,82,0.12)' }}
          >
          <div className="flex items-center gap-2.5">
            <img src={logoImg} alt="Art de Table" className="w-14 h-14 object-contain rounded-2xl bg-white p-1" />
          </div>
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setMobileMenuOpen(false)}
            className="w-9 h-9 flex items-center justify-center text-[#8C6845] hover:text-[#6F5337] transition rounded-full hover:bg-[#FFF4EA]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 pb-8">
          {/* Accueil */}
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={goToHome}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-[#8C6845] font-semibold hover:bg-[#FFF5EC] transition mb-2"
          >
            <Home className="w-4 h-4" />
            Accueil — Tout le catalogue
          </button>

          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-2 px-3">Catégories</p>
          <div className="flex flex-col gap-0.5">
            {categories.map(c => (
              <div key={c.slug} className="rounded-xl overflow-hidden">
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => goToCategory(c.slug)}
                  className={`w-full text-left px-3 py-2.5 text-sm font-medium transition ${
                    selectedCategoryId === c.slug
                      ? 'bg-[#A67C52] text-white'
                      : 'text-gray-700 hover:bg-[#FFF5EC] hover:text-[#8C6845]'
                  }`}
                >
                  {c.label}
                </button>
                {c.subcategories?.length ? (
                  <div className="px-3 pb-2 pt-0.5 flex flex-wrap gap-1.5">
                    {c.subcategories.map(sub => (
                      <span key={sub.slug} className="text-[10px] rounded-full bg-gray-50 text-gray-500 px-2 py-1">
                        {sub.label}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-4 pt-4 flex flex-col gap-1">
            <button
              onClick={() => goTo('about')}
              className="text-left px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              À propos
            </button>
            <button
              onClick={() => goTo('contact')}
              className="text-left px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              Contact
            </button>
            {currentUser ? (
              <>
                <button
                  onClick={() => { setView('dashboard'); setMobileMenuOpen(false); }}
                  className="text-left px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
                >
                  Mon compte
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="text-left px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <button
                onClick={() => { setView('login'); setMobileMenuOpen(false); }}
                className="mt-2 w-full h-11 text-white text-xs uppercase tracking-widest font-bold rounded-xl transition"
                style={{ background: 'linear-gradient(90deg, #8C6845, #A67C52)' }}
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
