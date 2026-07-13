import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { productMatchesCategoryToken } from '../lib/catalogNavigation';
import { getCategoryBannerSrc } from '../lib/categoryBannerImages';

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
                <img
                  src={getCategoryBannerSrc(cat.id)}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9B2C4A] shadow-sm">
                  {cat.count}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <div className="rounded-[1rem] bg-black/28 px-3 py-2.5 shadow-sm">
                    <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/85">
                      Catégorie
                    </div>
                    <div className="mt-0.5 flex items-end justify-between gap-3">
                      <div className="min-w-0 text-sm font-sans font-medium leading-tight !text-white">
                        {cat.name}
                      </div>
                      <span className="text-white/90 font-bold text-base leading-none group-hover:translate-x-1 transition-transform inline-block">
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
