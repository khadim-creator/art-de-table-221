import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, User, LogOut, Menu, X, Home, ShieldCheck, Store, Search } from 'lucide-react';
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
    setSelectedCategory(slug);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToHome = () => {
    setMobileMenuOpen(false);
    setSelectedCategory(null);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b border-[#A67C52]/14 bg-white shadow-[0_10px_30px_rgba(166,124,82,0.09)] backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 md:gap-5 h-[6.2rem] md:h-[6.8rem]">
            <button
              aria-label="Ouvrir le menu"
              className="md:hidden shrink-0 w-11 h-11 flex items-center justify-center text-[#6A5830] hover:text-[#8C6845] transition"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="hidden md:flex flex-1 items-center gap-3 min-w-0">
              <div className="relative w-full max-w-[26rem]">
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
                  className="h-[3.1rem] w-full rounded-none border border-[#A67C52]/18 bg-white pl-11 pr-4 text-[15px] text-[#2A1B13] placeholder:text-stone-400 shadow-sm outline-none transition focus:border-[#A67C52]/35 focus:ring-2 focus:ring-[#A67C52]/10"
                  aria-label="Recherche"
                />
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1 sm:gap-2 shrink-0">
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

            <button onClick={() => goTo('home')} className="shrink-0 group ml-auto" aria-label="Retour à l'accueil">
              <img
                src={logoImg}
                alt="Art de Table"
                className="h-[4.9rem] w-[4.9rem] object-contain md:h-[6.3rem] md:w-[6.3rem]"
              />
            </button>

          </div>
        </div>
      </header>

      <nav className="fixed top-[6.2rem] left-0 right-0 z-40 hidden md:block border-b border-[#A67C52]/14 bg-[#8C6845]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 overflow-visible whitespace-nowrap py-2 scrollbar-none">
            <button
              type="button"
              onClick={goToHome}
              className={`flex h-10 shrink-0 items-center gap-1.5 rounded-none border-b-2 px-3 text-[12px] font-semibold uppercase tracking-[0.18em] transition-all duration-200 ${
                !selectedCategoryId && currentView === 'shop'
                  ? 'text-white border-white/80 bg-white/10'
                  : 'text-white/80 border-transparent hover:text-white hover:bg-white/10 hover:border-white/40'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Accueil</span>
            </button>

            <span className="h-4 w-px shrink-0 bg-white/20" />

            <div className="relative group shrink-0">
              <button
                type="button"
                className="flex h-10 items-center gap-1.5 rounded-none border-b-2 border-transparent px-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/85 transition-all duration-200 hover:bg-white/10 hover:text-white hover:border-white/40"
              >
                <Menu className="h-3.5 w-3.5" />
                <span>Catalogue complet</span>
              </button>

              <div className="pointer-events-none absolute left-0 top-full z-[60] mt-0.5 w-[min(78rem,calc(100vw-2rem))] translate-y-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                <div className="max-h-[calc(100vh-9rem)] overflow-y-auto border border-[#A67C52]/15 bg-white shadow-[0_24px_60px_rgba(140,104,69,0.16)]">
                  <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {categories.map((category) => (
                      <div key={category.slug} className="border-b border-[#A67C52]/10 pb-3 last:border-b-0 lg:border-b-0 lg:pb-0">
                        <button
                          type="button"
                          onClick={() => goToCategory(category.slug)}
                          className="text-left text-sm font-semibold uppercase tracking-[0.14em] text-[#2A1B13] hover:text-[#8C6845]"
                        >
                          {category.label}
                        </button>
                        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-[#6A5830]">
                          {category.subcategories.map((sub, index) => (
                            <React.Fragment key={sub.slug}>
                              <button
                                type="button"
                                onClick={() => goToCategory(sub.slug)}
                                className="hover:text-[#8C6845]"
                              >
                                {sub.label}
                              </button>
                              {index < category.subcategories.length - 1 ? <span className="text-[#A67C52]/50">|</span> : null}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <span className="h-4 w-px shrink-0 bg-white/20" />

            {QUICK_CATS.map((link, index) => (
              <React.Fragment key={link.slug}>
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => goToCategory(link.slug)}
                  className={`flex h-10 shrink-0 items-center rounded-none border-b-2 px-3 text-[12px] font-semibold uppercase tracking-[0.14em] transition-all duration-200 ${
                    selectedCategoryId === link.slug && currentView === 'shop'
                      ? 'text-white border-white/80 bg-white/10'
                      : 'text-white/80 border-transparent hover:text-white hover:bg-white/10 hover:border-white/40'
                  }`}
                >
                  {link.label}
                </button>
                {index < QUICK_CATS.length - 1 ? <span className="h-4 w-px shrink-0 bg-white/20" /> : null}
              </React.Fragment>
            ))}

            <span className="ml-auto" />

            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => goTo('contact')}
              className="flex h-10 shrink-0 items-center rounded-none border-b-2 border-transparent px-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white hover:border-white/40"
            >
              Contact
            </button>
          </div>
        </div>
      </nav>

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
            className="w-full flex items-center gap-3 px-3 py-3 rounded-none text-sm text-[#8C6845] font-semibold hover:bg-[#FFF5EC] transition mb-2"
          >
            <Home className="w-4 h-4" />
            Accueil — Tout le catalogue
          </button>

          <div className="flex flex-col gap-1">
            {categories.map(c => (
              <div key={c.slug} className="overflow-hidden rounded-none">
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
                  <div className="px-3 pb-2 pt-1 flex flex-wrap gap-x-2 gap-y-1 text-[10px] text-gray-500">
                    {c.subcategories.map((sub, index) => (
                      <React.Fragment key={sub.slug}>
                        <button
                          type="button"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={() => goToCategory(sub.slug)}
                          className="hover:text-[#8C6845]"
                        >
                          {sub.label}
                        </button>
                        {index < c.subcategories.length - 1 ? <span className="text-gray-300">|</span> : null}
                      </React.Fragment>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-4 pt-4 flex flex-col gap-1">
            <button
              onClick={() => goTo('about')}
              className="text-left px-3 py-2.5 rounded-none text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              À propos
            </button>
            <button
              onClick={() => goTo('contact')}
              className="text-left px-3 py-2.5 rounded-none text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              Contact
            </button>
            {currentUser ? (
              <>
                <button
                  onClick={() => { setView('dashboard'); setMobileMenuOpen(false); }}
                  className="text-left px-3 py-2.5 rounded-none text-sm text-gray-600 hover:bg-gray-50 transition"
                >
                  Mon compte
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="text-left px-3 py-2.5 rounded-none text-sm text-red-500 hover:bg-red-50 transition"
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

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-[#A67C52]/14 bg-white/96 backdrop-blur">
        <div className="grid grid-cols-3">
          <button
            type="button"
            onClick={() => goTo('shop')}
            className="flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6A5830]"
            aria-label="Boutique"
          >
            <Store className="h-5 w-5" />
            <span>Boutique</span>
          </button>
          <button
            type="button"
            onClick={() => (currentUser ? setView('dashboard') : setView('login'))}
            className="flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6A5830]"
            aria-label="Connexion"
          >
            <User className="h-5 w-5" />
            <span>Connexion</span>
          </button>
          <button
            type="button"
            onClick={() => setView('cart')}
            className="relative flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6A5830]"
            aria-label="Panier"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Panier</span>
            {totalCartCount > 0 && (
              <span className="absolute right-[28%] top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-none border border-white bg-[#8B3A52] px-1 text-[10px] font-black leading-none text-white">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
