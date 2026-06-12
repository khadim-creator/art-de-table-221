import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Search, 
  SlidersHorizontal, 
  Info,
  Layers, 
  CheckCircle2, 
  ChevronRight,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { ProductCard } from './ProductCard';

export const ShopView: React.FC = () => {
  const { 
    products, 
    categories, 
    selectedCategoryId, 
    setSelectedCategory, 
    setSelectedProduct,
    setView 
  } = useApp();

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [minQtyOnly, setMinQtyOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('popular'); // popular, price-asc, price-desc
  const [visibleCount, setVisibleCount] = useState<number>(16);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const INITIAL_LOAD = 16;
  const LOAD_MORE = 16;

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(INITIAL_LOAD);
  }, [selectedCategoryId, searchQuery, minQtyOnly, sortBy]);

  // Filter and Sort Products logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategoryId) {
      const targetId = selectedCategoryId.toLowerCase().trim().replace(/-/g, '');
      list = list.filter(p => {
        if (!p.category) return false;
        const prodCatId = p.category.toLowerCase().trim().replace(/-/g, '');
        return prodCatId === targetId;
      });
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q))
      );
    }

    // Min Quantity filter (Low MOQ <= 100)
    if (minQtyOnly) {
      list = list.filter(p => p.minQty <= 100);
    }

    // Sort mapping
    if (sortBy === 'popular') {
      list.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
    } else if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, selectedCategoryId, searchQuery, minQtyOnly, sortBy]);

  // Displayed products - slice based on visible count
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const hasMore = visibleCount < filteredProducts.length;

  const handleProductCardClick = (id: string) => {
    setSelectedProduct(id);
    setView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to selected active category pill on mobile
  useEffect(() => {
    if (selectedCategoryId && scrollContainerRef.current) {
      const activeEl = document.getElementById(`pill-${selectedCategoryId}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedCategoryId]);

  return (
    <main className="min-h-screen bg-[#FFF8F8] pt-24 md:pt-32 pb-24 font-sans text-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BOUTIQUE HEADER (Extremely minimal and elegant) */}
        <div className="text-center space-y-3 mb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D78D9B] font-bold block">
            ART DE TABLE • L'ÉLÉGANCE SUR MESURE
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif text-[#1E1E1E] font-medium tracking-tight">
            Sélectionnez un modèle à personnaliser
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light max-w-md mx-auto leading-relaxed">
            Cliquez directement sur l'emballage de votre choix pour y appliquer votre propre logo, couleurs et texte.
          </p>
        </div>

        {/* CENTERED CATEGORY PILLS BAR */}
        <div className="mb-10 p-1 bg-[#FAF1F1]/60 rounded-2xl border border-rose-100/30 max-w-3xl mx-auto">
          <div 
            ref={scrollContainerRef}
            className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-1 px-1 justify-start sm:justify-center select-none"
          >
            <button
              id="pill-all"
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition duration-300 cursor-pointer ${
                !selectedCategoryId 
                  ? 'bg-[#8B3A52] text-white shadow-sm' 
                  : 'bg-transparent text-stone-600 hover:bg-[#8B3A52]/10 hover:text-[#8B3A52]'
              }`}
            >
              Tout voir ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter(p => {
                if (!p.category) return false;
                return p.category.toLowerCase().trim().replace(/-/g, '') === cat.id.toLowerCase().trim().replace(/-/g, '');
              }).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat.id}
                  id={`pill-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition duration-300 cursor-pointer flex items-center space-x-1.5 ${
                    selectedCategoryId === cat.id 
                      ? 'bg-[#8B3A52] text-white shadow-sm' 
                      : 'bg-transparent text-stone-600 hover:bg-[#8B3A52]/10 hover:text-[#8B3A52]'
                  }`}
                >
                  <span>{cat.name.split(' &')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MINIMAL SEARCH COMPONENT (Centered, thin, luxury styling) */}
        <div className="max-w-md mx-auto mb-12 relative">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            id="shop-search-input"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher un modèle d'emballage (Ex: sac, kraft, boite...)"
            className="w-full pl-10 pr-4 bg-white/80 border border-stone-200 focus:border-[#8B3A52] rounded-xl outline-none text-xs h-10 font-light shadow-sm transition-colors text-center"
          />
        </div>

        {/* FULL WIDTH GORGEOUS PRODUCTS CATALOG GRID */}
        <div className="space-y-12">
          
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-100 p-12 text-center space-y-4 max-w-xl mx-auto shadow-sm">
              <div className="w-12 h-12 bg-[#FAF1F1] rounded-full flex items-center justify-center mx-auto text-[#8B3A52]">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#1E1E1E]">Aucun produit trouvé</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 leading-relaxed">
                  Notre équipe de designers réalise également vos formats sur-mesure ! Contactez-nous pour d'autres options.
                </p>
              </div>
              <button
                onClick={() => window.open(`https://wa.me/221773010505?text=Bonjour+Art+de+Table,+je+recherche+un+produit+personnalisé+qui+n'est+pas+dans+votre+catalogue.`)}
                className="inline-flex bg-[#1E1E1E] hover:bg-[#8B3A52] text-white text-[10px] font-semibold uppercase tracking-widest px-5 py-3 rounded-xl transition duration-300 cursor-pointer shadow-sm"
              >
                Conception sur-mesure WhatsApp
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              {displayedProducts.map((prod, idx) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onClick={() => handleProductCardClick(prod.id)}
                  idx={idx}
                />
              ))}
            </div>
          )}

          {/* Infinite scroll "Voir plus" button — fluid, no page reload */}
          {hasMore && (
            <div className="flex justify-center pt-6">
              <button
                id="shop-load-more-btn"
                onClick={() => setVisibleCount(prev => prev + LOAD_MORE)}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white border-2 border-[#8B3A52]/20 hover:border-[#8B3A52] text-[#8B3A52] hover:bg-[#FAF1F1] rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
              >
                <span>Voir plus de produits</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
          {!hasMore && filteredProducts.length > 0 && (
            <p className="text-center text-[10px] font-mono text-stone-400 pt-4">
              {filteredProducts.length} produits chargés — fin du catalogue
            </p>
          )}

        </div>

      </div>
    </main>
  );
};
