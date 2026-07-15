import React, { useMemo, useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Info,
  ChevronDown,
  Home,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { productMatchesCategoryToken, resolveCategoryToken } from '../lib/catalogNavigation';
import { getCategoryBannerSrc } from '../lib/categoryBannerImages';
import { EXCLUDED_CATEGORY_IDS } from '../constants/categories';

export const ShopView: React.FC = () => {
  const { 
    products, 
    categories, 
    selectedCategoryId, 
    searchQuery,
    setSelectedCategory, 
    setSelectedProduct,
    setView,
  } = useApp();

  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [catBarCollapsed, setCatBarCollapsed] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const INITIAL_LOAD = 8;
  const LOAD_MORE = 8;

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(INITIAL_LOAD);
  }, [selectedCategoryId]);

  // Expand category bar when category changes
  useEffect(() => {
    setCatBarCollapsed(false);
  }, [selectedCategoryId]);

  // Filter and Sort Products logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => product && typeof product.category === 'string')
      .filter((product) => {
        if (!selectedCategoryId) {
          return !EXCLUDED_CATEGORY_IDS.includes(product.category);
        }
        return productMatchesCategoryToken(product, selectedCategoryId, categories);
      })
      .filter((product) => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return true;
        return [product.name, product.description, product.subcategory, product.category]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q));
      });
  }, [products, categories, selectedCategoryId, searchQuery]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const hasMore = visibleCount < filteredProducts.length;

  const handleProductCardClick = (id: string) => {
    setSelectedProduct(id);
    setView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll active pill into view on mobile
  useEffect(() => {
    if (selectedCategoryId && scrollContainerRef.current) {
      const activeEl = document.getElementById(`pill-${selectedCategoryId}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedCategoryId]);

  // Current selected category label
  const activeCatLabel = useMemo(() => {
    if (!selectedCategoryId) return 'Tout le catalogue';
    const resolvedCategoryId = resolveCategoryToken(selectedCategoryId, categories);
    const cat = categories.find(c => c.id === resolvedCategoryId) || categories.find(c =>
      c.id.toLowerCase().replace(/-/g, '') === selectedCategoryId.toLowerCase().replace(/-/g, '')
    );
    return cat?.name || selectedCategoryId;
  }, [selectedCategoryId, categories]);

  const activeCategory = useMemo(() => {
    if (!selectedCategoryId) return null;
    return categories.find(c => c.id === resolveCategoryToken(selectedCategoryId, categories))
      || categories.find(c =>
        c.id.toLowerCase().replace(/-/g, '') === selectedCategoryId.toLowerCase().replace(/-/g, '')
      )
      || null;
  }, [selectedCategoryId, categories]);
  // Categories with products (excluding Gobelets & Boissons)
  const catsWithProducts = useMemo(() => {
    const filtered = categories.filter(cat =>
      !EXCLUDED_CATEGORY_IDS.includes(cat.id) &&
      products.some(product => productMatchesCategoryToken(product, cat.id, categories))
    );
    // Sort so that 'evenementiel' is first
    return [...filtered].sort((a, b) => {
      if (a.id === 'evenementiel') return -1;
      if (b.id === 'evenementiel') return 1;
      return 0;
    });
  }, [categories, products]);
  // SEO optimization: Dynamically update document title and meta description based on selected category
  useEffect(() => {
    const siteName = "Art de Table";
    if (activeCategory) {
      document.title = `${activeCategory.name} - ${siteName} Sénégal`;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        let customDesc = `Découvrez notre collection de ${activeCategory.name} chez Art de Table. Packagings et produits personnalisés premium à Dakar.`;
        if (activeCategory.id === 'evenementiel') {
          customDesc = `Événementiel Premium : Coffrets de prestige, cadeaux d'invités et accessoires de luxe personnalisés à Dakar pour mariages et réceptions.`;
        } else if (activeCategory.id === 'solutions-impression') {
          customDesc = `Solutions d'Impression haut de gamme : Boîtes, étiquettes autocollantes et supports publicitaires imprimés sur-mesure à Dakar.`;
        } else if (activeCategory.id === 'sacs-emballages-boutique') {
          customDesc = `Emballages et Sacs Boutique personnalisés en Kraft, luxe et satin. Sublimez vos colis clients avec un packaging haut de gamme.`;
        }
        metaDesc.setAttribute('content', customDesc);
      }
    } else {
      document.title = `Boutique & Catalogue Emballages Premium - ${siteName}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Explorez la boutique Art de Table : sacs en papier, emballages alimentaires, bols, pots, boîtes personnalisées et solutions de packaging de luxe.');
      }
    }
  }, [activeCategory]);

  const breadcrumbJsonLd = useMemo(() => {
    const items = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://artdetable.sn/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Boutique",
        "item": "https://artdetable.sn/#shop"
      }
    ];

    if (activeCategory) {
      items.push({
        "@type": "ListItem",
        "position": 3,
        "name": activeCategory.name,
        "item": `https://artdetable.sn/#shop?category=${activeCategory.slug}`
      });
    }

    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items
    });
  }, [activeCategory]);

  return (
    <main className="min-h-screen font-sans text-stone-800 bg-white">
      <div className={selectedCategoryId ? 'section-container pt-0 pb-12 md:pb-20' : 'section-container pt-2 pb-12 md:pt-3 md:pb-20'}>
        <script type="application/ld+json">
          {breadcrumbJsonLd}
        </script>

        {activeCategory && (
          <div className="-mx-4 mb-5 overflow-hidden rounded-b-[1.75rem] rounded-t-none border-x-0 border-t-0 border-b border-white/70 bg-white/85 shadow-[0_10px_28px_rgba(166,124,82,0.10)] sm:-mx-6 lg:-mx-8">
            <div className="relative h-[144px] sm:h-[160px] lg:h-[172px] overflow-hidden bg-[#F4E2D1]">
              <img
                src={getCategoryBannerSrc(activeCategory.id)}
                alt={activeCategory.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        )}

        {/* Breadcrumb path */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500 mb-6 pt-2 select-none border-b border-gray-100 pb-2.5">
          <button onClick={() => { setSelectedCategory(null); setView('home'); }} className="hover:text-[#8C6845] transition">
            Accueil
          </button>
          <span className="text-stone-300 font-mono text-[9px]">&gt;</span>
          <button onClick={() => { setSelectedCategory(null); setView('shop'); }} className={selectedCategoryId ? "hover:text-[#8C6845] transition" : "text-[#8C6845] font-semibold"}>
            Boutique
          </button>
          {activeCategory && (
            <>
              <span className="text-stone-300 font-mono text-[9px]">&gt;</span>
              <span className="text-[#8C6845] font-semibold">
                {activeCategory.name}
              </span>
            </>
          )}
        </div>

        {!selectedCategoryId && (
          <div className="text-center space-y-2 mb-4 md:mb-5">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#A67C52]/70 font-bold block">
              ART DE TABLE • L'ÉLÉGANCE SUR MESURE
            </span>
            <h1 className="font-display italic text-[clamp(2.2rem,4.8vw,4.8rem)] leading-[0.9] text-[#1E1E1E] tracking-[-0.04em]">
              Notre Catalogue
            </h1>
            <p className="text-sm sm:text-base text-stone-500 font-light max-w-md mx-auto leading-relaxed">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} — Cliquez pour personnaliser avec votre logo et couleurs
            </p>
          </div>
        )}

        {/* ── BANDEAU CATÉGORIES MOBILE (Pills sticky collapsible) ── */}
        {/* NOTE: Sur desktop le bandeau est dans la Navbar. Sur mobile il est ici. */}
        <div className="md:hidden mb-4">
          {/* Barre avec toggle collapse */}
          <div
            className="rounded-2xl overflow-hidden transition-all duration-350"
            style={{
              background: catBarCollapsed
                ? 'transparent'
                : 'linear-gradient(90deg, #8C6845 0%, #A67C52 100%)',
              boxShadow: catBarCollapsed ? 'none' : '0 4px 20px rgba(166,124,82,0.25)',
            }}
          >
            {/* Toggle header */}
            <button
              onClick={() => setCatBarCollapsed(!catBarCollapsed)}
              className="w-full flex items-center justify-between px-4 py-3 transition"
              style={{ color: catBarCollapsed ? '#8C6845' : 'white' }}
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {catBarCollapsed ? `Catégorie : ${activeCatLabel}` : 'Filtrer par catégorie'}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${catBarCollapsed ? '' : 'rotate-180'}`}
              />
            </button>

            {/* Pills container — collapsible */}
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: catBarCollapsed ? '0px' : '120px', opacity: catBarCollapsed ? 0 : 1 }}
            >
              <div
                ref={scrollContainerRef}
                className="flex items-center gap-1.5 overflow-x-auto scrollbar-none px-3 pb-3 pt-1"
              >
                {/* Tout voir */}
                <button
                  id="pill-all"
                  onClick={() => { setSelectedCategory(null); setCatBarCollapsed(true); }}
                  className={`flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition duration-200 ${
                    !selectedCategoryId
                      ? 'bg-white text-[#8C6845] shadow-sm'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Home className="w-3 h-3 inline mr-1" />
                  Tout
                </button>

                {catsWithProducts.map((cat) => {
                  const count = products.filter(p => productMatchesCategoryToken(p, cat.id, categories)).length;
                  return (
                    <button
                      key={cat.id}
                      id={`pill-${cat.id}`}
                      onClick={() => { setSelectedCategory(cat.id); setCatBarCollapsed(true); }}
                      className={`flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition duration-200 whitespace-nowrap ${
                        selectedCategoryId === cat.id
                          ? 'bg-white text-[#8C6845] shadow-sm'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {cat.name.split(' &')[0]}
                      <span className="ml-1 opacity-70 text-[10px]">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chip active category + clear — visible quand collapsed et catégorie sélectionnée */}
          {catBarCollapsed && selectedCategoryId && (
            <div className="flex items-center gap-2 mt-2 px-1">
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: '#A67C52', color: 'white' }}
              >
                <span>{activeCatLabel}</span>
                <button
                  onClick={() => { setSelectedCategory(null); }}
                  className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── PRODUCTS GRID ── */}
        <div className="space-y-10">

          {filteredProducts.length === 0 ? (
            <div className="bg-white/80 rounded-3xl border border-stone-100 p-12 text-center space-y-4 max-w-xl mx-auto shadow-sm">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto" style={{ background: '#FBF0E7', color: '#A67C52' }}>
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#1E1E1E]">Aucun produit trouvé</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 leading-relaxed">
                  Notre équipe de designers réalise également vos formats sur-mesure ! Contactez-nous pour d'autres options.
                </p>
              </div>
              <button
                onClick={() => window.open(`https://wa.me/221778715875?text=${encodeURIComponent("Bonjour Art de Table, je recherche un produit personnalisé qui n'est pas dans votre catalogue.")}`, '_blank', 'noopener,noreferrer')}
                className="inline-flex text-white text-[10px] font-semibold uppercase tracking-widest px-5 py-3 rounded-xl transition duration-300 cursor-pointer shadow-sm hover:opacity-90"
                style={{ background: 'linear-gradient(90deg, #8C6845, #A67C52)' }}
              >
                Commander sur-mesure
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5">
                {displayedProducts.map((prod, idx) => (
                  <div key={prod.id} className="h-full">
                    <ProductCard
                      product={prod}
                      onClick={() => handleProductCardClick(prod.id)}
                      idx={idx}
                    />
                  </div>
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <button
                    id="shop-load-more-btn"
                    onClick={() => setVisibleCount(prev => prev + LOAD_MORE)}
                    className="btn-secondary px-8 h-12 text-xs font-bold uppercase tracking-widest shadow-sm hover:shadow-md"
                  >
                    <span>Voir plus de produits</span>
                    <ChevronDown className="icon-sm" />
                  </button>
                </div>
              )}
              {!hasMore && filteredProducts.length > 0 && (
                <p className="text-center text-[10px] font-mono text-stone-400 pt-2">
                  {filteredProducts.length} produits — fin du catalogue
                </p>
              )}
            </>
          )}
        </div>

      </div>
    </main>
  );
};
