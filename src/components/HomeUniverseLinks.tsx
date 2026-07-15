import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Sparkles, Printer, Box } from 'lucide-react';

export const HomeUniverseLinks: React.FC = () => {
  const { setView, setSelectedCategory } = useApp();

  const universes = [
    {
      title: "Emballage & Packaging",
      desc: "Sacs kraft, emballages boutique et boîtes cadeaux personnalisés pour sublimer vos ventes.",
      icon: Box,
      slug: "sacs-emballages-boutique",
      color: "bg-[#FFF9F4]/90 text-[#8C6845] border-[#A67C52]/20 hover:border-[#8C6845]/40"
    },
    {
      title: "Événementiel Prestige",
      desc: "Coffrets d'exception, cadeaux d'invités et accessoires raffinés pour mariages et cérémonies.",
      icon: Sparkles,
      slug: "evenementiel",
      color: "bg-[#FDF0F3]/90 text-[#E8A5A5] border-[#E8A5A5]/25 hover:border-[#E8A5A5]/50"
    },
    {
      title: "Impression Sur-Mesure",
      desc: "Boîtes personnalisées, étiquettes autocollantes et solutions d'impression de haute précision.",
      icon: Printer,
      slug: "solutions-impression",
      color: "bg-[#F5F8F6]/90 text-[#4A7856] border-[#4A7856]/20 hover:border-[#4A7856]/40"
    }
  ];

  return (
    <section className="py-10 bg-stone-50/50 border-y border-[#A67C52]/10">
      <div className="section-container">
        <div className="mb-8 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#A67C52] font-black">
              Nos Univers Phares
            </span>
            <h2 className="font-display italic text-[clamp(1.8rem,4vw,3rem)] leading-none text-[#2A1B13]">
              Créations &amp; Personnalisation
            </h2>
          </div>
          <button 
            onClick={() => { setSelectedCategory(null); setView('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="group flex items-center justify-center gap-1.5 text-xs font-semibold text-[#8C6845] hover:text-[#2A1B13] transition self-center md:self-auto"
          >
            <span>Découvrir notre histoire (À propos)</span>
            <ArrowRight className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {universes.map((univ) => {
            const Icon = univ.icon;
            return (
              <div 
                key={univ.slug}
                onClick={() => { setSelectedCategory(univ.slug); setView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`group relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${univ.color}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="p-3 rounded-xl bg-white/80 border border-current/10">
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-bold text-[#2A1B13]">
                  {univ.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-stone-500">
                  {univ.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
