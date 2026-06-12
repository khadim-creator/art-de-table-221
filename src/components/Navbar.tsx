import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, User, LogOut, Menu, X, Search, ChevronDown } from 'lucide-react';
import logoImg from '../assets/images/logo.jpg';

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
export const Navbar: React.FC = () => {
  const { currentView, setView, cart, currentUser, logout, setSelectedCategory } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const totalCartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  const goTo = (view: string) => {
    setMobileMenuOpen(false);
    setCatMenuOpen(false);
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
    setCatMenuOpen(false);
    setSelectedCategory(slug);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">

            {/* Mobile hamburger */}
            <button className="md:hidden shrink-0 w-9 h-9 flex items-center justify-center text-gray-600" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>

            {/* LOGO */}
            <button onClick={() => goTo('home')} className="flex items-center gap-2.5 shrink-0">
              <img src={logoImg} alt="Art de Table" className="w-10 h-10 md:w-14 md:h-14 object-contain" />
              <div className="flex flex-col leading-none">
                <span className="font-serif font-black text-base md:text-xl text-[#1B1115]">
                  Art de Table
                </span>
                <span className="hidden md:block text-[9px] tracking-[0.15em] text-gray-400 uppercase mt-0.5">
                  Packaging · Emballage · Personnalisation
                </span>
              </div>
            </button>

            {/* BARRE DE RECHERCHE centrée */}
            <div className="hidden md:flex flex-1 max-w-lg relative mx-4">
              <input
                type="text"
                placeholder="Rechercher un produit, une catégorie..."
                onFocus={() => { setView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-full h-10 pl-4 pr-12 rounded-full border border-gray-200 bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:border-[#C9607A] focus:bg-white transition"
              />
              <button className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center bg-[#C9607A] rounded-full hover:bg-[#b3536b] transition">
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* ACTIONS DROITE */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button className="md:hidden w-9 h-9 flex items-center justify-center text-gray-600" onClick={() => goTo('shop')}>
                <Search className="w-4 h-4" />
              </button>

              {currentUser ? (
                <div className="flex items-center gap-1">
                  <button onClick={() => setView('dashboard')} className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-full hover:bg-gray-100 transition text-sm text-gray-700 font-medium">
                    <User className="w-4 h-4" />
                    <span className="hidden lg:inline">Mon compte</span>
                  </button>
                  {(currentUser?.isAdmin || currentUser?.email?.toLowerCase() === 'khadxxm05@gmail.com') && (
                    <button onClick={() => setView('admin-dashboard')} className="hidden sm:flex h-9 px-3 rounded-full border border-amber-400 text-amber-600 text-xs font-bold hover:bg-amber-50 transition">
                      Admin
                    </button>
                  )}
                  <button onClick={logout} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-500 transition">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setView('login')} className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-full hover:bg-gray-100 transition text-sm text-gray-700 font-medium">
                  <User className="w-4 h-4" />
                  <span className="hidden lg:inline">Connexion</span>
                </button>
              )}

              <button onClick={() => setView('cart')} className="relative flex items-center gap-1.5 h-9 px-3 rounded-full hover:bg-gray-100 transition text-sm text-gray-700 font-medium">
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Panier</span>
                {totalCartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:static sm:inline-flex items-center justify-center bg-[#C9607A] text-white text-[9px] font-bold rounded-full w-4 h-4">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* BANDEAU ROSE CATÉGORIES */}
        <div className="hidden md:block bg-[#C9607A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-11 gap-1">

              {/* Menu Toutes */}
              <div className="relative" onMouseLeave={() => setCatMenuOpen(false)}>
                <button
                  onMouseEnter={() => setCatMenuOpen(true)}
                  onClick={() => setCatMenuOpen(v => !v)}
                  className="flex items-center gap-2 h-11 px-4 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition"
                >
                  <Menu className="w-4 h-4" />
                  <span>Toutes</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {catMenuOpen && (
                  <div className="absolute top-full left-0 bg-white shadow-xl rounded-b-xl w-56 py-2 z-50 border-t-2 border-[#C9607A]">
                    {categories.map(c => (
                      <button key={c.slug} onClick={() => goToCategory(c.slug)}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#FFF5F6] hover:text-[#C9607A] transition">
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-px h-5 bg-white/30" />

              {[
                { label: 'Packaging', slug: 'sacs-emballages-boutique' },
                { label: 'Événementiel', slug: 'evenementiel' },
                { label: 'Objets Publicitaires', slug: 'packaging-cadeaux' },
                { label: 'Cadeaux Personnalisés', slug: 'parfumerie-cosmetique' },
                { label: 'Emballages Alimentaires', slug: 'emballages-alimentaires' },
              ].map(link => (
                <button key={link.label} onClick={() => goToCategory(link.slug)}
                  className="h-11 px-3 text-white/90 hover:text-white hover:bg-white/10 text-xs font-medium uppercase tracking-wide transition whitespace-nowrap">
                  {link.label}
                </button>
              ))}

              <button onClick={() => goTo('contact')}
                className="h-11 px-3 text-white/90 hover:text-white hover:bg-white/10 text-xs font-medium uppercase tracking-wide transition whitespace-nowrap">
                Contact
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* OVERLAY MOBILE */}
      <div className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)} />

      {/* DRAWER MOBILE */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white z-50 md:hidden transform transition-transform duration-300 shadow-2xl overflow-y-auto ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 bg-[#C9607A]">
          <img src={logoImg} alt="Art de Table" className="w-8 h-8 object-contain" />
          <span className="text-white font-bold uppercase tracking-widest text-sm">Menu</span>
          <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-3 px-2">Catégories</p>
          <div className="flex flex-col gap-1">
            {categories.map(c => (
              <button key={c.slug} onClick={() => goToCategory(c.slug)}
                className="text-left px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-[#FFF5F6] hover:text-[#C9607A] transition font-medium">
                {c.label}
              </button>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 flex flex-col gap-1">
            <button onClick={() => goTo('about')} className="text-left px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">À propos</button>
            <button onClick={() => goTo('contact')} className="text-left px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">Contact</button>
            {currentUser ? (
              <>
                <button onClick={() => { setView('dashboard'); setMobileMenuOpen(false); }}
                  className="text-left px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">Mon compte</button>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="text-left px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition">Déconnexion</button>
              </>
            ) : (
              <button onClick={() => { setView('login'); setMobileMenuOpen(false); }}
                className="mt-2 w-full h-10 bg-[#C9607A] text-white text-xs uppercase tracking-widest font-bold rounded-lg">
                Se connecter
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}