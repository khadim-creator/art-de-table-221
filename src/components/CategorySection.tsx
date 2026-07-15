import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { productMatchesCategoryToken } from '../lib/catalogNavigation';
import { getCategoryBannerSrc } from '../lib/categoryBannerImages';
import { CategoryBannerImage } from './CategoryBannerImage';

export const CategorySection: React.FC = () => {
  const { categories, products, setSelectedCategory, setView } = useApp();

  const displayCategories = useMemo(() => {
    return categories
      .map((cat) => {
        const count = products.filter((product) => productMatchesCategoryToken(product, cat.id, categories)).length;
        return { ...cat, count };
      })
      .filter((cat) => cat.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [categories, products]);

  const go = (slug: string) => {
    setSelectedCategory(slug);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="section-spacer">
      <div className="section-container">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {displayCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => go(cat.id)}
              className="group relative overflow-hidden rounded-[1.4rem] border border-white/70 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(84,26,42,0.08)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {/* Sharp image with better clarity */}
                <CategoryBannerImage
                  src={getCategoryBannerSrc(cat.id)}
                  alt={cat.name}
                />

                {/* Image wrapper for hover effect */}
                <div className="absolute inset-0 group-hover:scale-[1.03] transition-transform duration-500 ease-out" />

                {/* Count badge - enhanced visibility */}
                <div className="absolute left-3 top-3 rounded-full bg-white shadow-md px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#9B2C4A] z-10">
                  {cat.count} {cat.count > 1 ? 'articles' : 'article'}
                </div>

                {/* Gradient overlay for better text contrast */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/75 via-black/45 to-transparent" />

                {/* Category text with enhanced contrast */}
                <div className="absolute inset-x-0 bottom-0 p-3 z-20">
                  <div className="space-y-1">
                    <div className="text-[8px] font-mono uppercase tracking-[0.25em] text-white/95 font-semibold">
                      Catégorie
                    </div>
                    <div className="flex items-end justify-between gap-2">
                      <div className="min-w-0 text-sm font-sans font-bold leading-tight text-white drop-shadow-md">
                        {cat.name}
                      </div>
                      <span className="text-white font-bold text-lg leading-none group-hover:translate-x-1 transition-transform inline-block flex-shrink-0">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
