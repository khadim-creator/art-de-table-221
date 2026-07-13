import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import quoteCardImage from '../assets/images/art_de_table_brochure_1780829818884.png';

export const FeaturedProducts: React.FC = () => {
  const { products, setSelectedProduct, setView } = useApp();

  const feed = products
    .filter(p => p && typeof p.id === 'string' && typeof p.name === 'string')
    .sort((a, b) => {
      const featuredScore = Number(!!(b as any).produit_mis_en_avant) - Number(!!(a as any).produit_mis_en_avant);
      if (featuredScore !== 0) return featuredScore;
      return (b.rating - a.rating) || (b.reviewsCount - a.reviewsCount);
    })
    .slice(0, 12);

  return (
    <section className="section-spacer">
      <div className="section-container">
        <div className="mb-1.5 sm:mb-2 flex items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display italic text-[clamp(2.65rem,5vw,5.2rem)] leading-[0.82] tracking-[-0.065em] text-[#1B1115]">
              Découvrez notre sélection
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {feed.map((prod, idx) => (
            <div key={prod.id} className="h-full">
              <ProductCard
                product={prod}
                onClick={() => setSelectedProduct(prod.id)}
                idx={idx}
              />
            </div>
          ))}
        </div>

        <section className="mt-8 overflow-hidden rounded-[1.35rem] border border-[#A67C52]/18 bg-white shadow-sm md:mt-10">
          <div className="grid items-stretch md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[210px] overflow-hidden bg-[#F7E8DB] md:min-h-[260px]">
              <img
                src={quoteCardImage}
                alt="Présentation demande de devis Art de Table"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(42,27,19,0.1)_0%,rgba(42,27,19,0.36)_100%)]" />
            </div>

            <div className="flex flex-col justify-center p-6 text-left sm:p-8 lg:p-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#A67C52]">
                Projet special
              </p>
              <h2 className="mt-3 font-display text-[clamp(2rem,4vw,4rem)] font-semibold italic leading-[0.9] text-[#2A1B13]">
                Un format qui n&apos;est pas dans le catalogue ?
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-500">
                Envoyez les quantités, la finition souhaitée et vos inspirations. L&apos;atelier prépare une proposition claire pour votre packaging, événement ou support personnalisé.
              </p>
              <button
                onClick={() => {
                  setView('devis-request');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-primary mt-6 h-11 w-fit px-6 text-[10px] tracking-[0.18em]"
              >
                <span>Demander un devis</span>
                <ArrowRight className="icon-sm" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};
