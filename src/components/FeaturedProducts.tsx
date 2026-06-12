import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';

export const FeaturedProducts: React.FC = () => {
  const { products, setSelectedProduct, setView } = useApp();

  // Filter top rated or simply slice first 6 popular items
  const popularProducts = products
    .filter(p => p.rating >= 4.8)
    .slice(0, 6);

  const handleProductClick = (id: string) => {
    setSelectedProduct(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-[#F9F6F6] border-t border-b border-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header section with classy alignments */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="space-y-2 text-left">
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#C9A84C] uppercase font-semibold">
              Notre Sélection exclusive
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#8B3A52] tracking-tight">
              Produits Populaires
            </h2>
            <div className="h-0.5 w-16 bg-[#F2A7BB] rounded" />
          </div>

          <button
            id="featured-see-all-btn"
            onClick={() => setView('shop')}
            className="group inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-[#8B3A52] hover:text-[#C9A84C] transition-colors"
          >
            <span>Découvrir toute la boutique</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Products Grid — 4 colonnes desktop, 2 colonnes mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {popularProducts.map((prod, idx) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onClick={() => handleProductClick(prod.id)}
              idx={idx}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
