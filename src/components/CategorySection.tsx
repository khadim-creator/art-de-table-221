import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, Sparkles, Truck, Headphones } from 'lucide-react';
import mariagePrestige from '../assets/images/mariage_prestige_1780566116217.png';
import bouteillesJus from '../assets/images/bouteilles_jus_1780566133711.png';
import regeneratedImage1 from '../assets/images/regenerated_image_1781085027764.png';
import regeneratedImage2 from '../assets/images/regenerated_image_1781085031932.avif';
import regeneratedImage3 from '../assets/images/regenerated_image_1781085032914.webp';
import regeneratedImage4 from '../assets/images/regenerated_image_1781085033548.avif';

// Fallback images map for dynamic categories
const categoryImages: Record<string, string> = {
  'sacs-emballages-boutique': regeneratedImage1,
  'solutions-impression': regeneratedImage2,
  'packaging-cadeaux': regeneratedImage3,
  'bouteilles-personnalisees': bouteillesJus,
  'patisserie-boulangerie': regeneratedImage4,
  'evenementiel': mariagePrestige,
};

const trust = [
  { icon: Award, title: 'Qualité Premium', desc: 'Matériaux haut de gamme pour un rendu exceptionnel.' },
  { icon: Sparkles, title: 'Personnalisation', desc: 'Votre marque, votre style, votre identité.' },
  { icon: Truck, title: 'Livraison Rapide', desc: 'Livraison partout au Sénégal.' },
  { icon: Headphones, title: 'Support 7j/7', desc: 'Notre équipe à votre écoute.' },
];

export const CategorySection: React.FC = () => {
  const { categories, setSelectedCategory, setView } = useApp();

  // Only show categories that have at least one product
  const displayCategories = categories.filter(cat => {
    const targetId = cat.id.toLowerCase().trim().replace(/-/g, '');
    return true; // show all categories from Firestore
  }).slice(0, 6); // max 6 categories displayed

  const go = (slug: string) => {
    setSelectedCategory(slug);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryImage = (catId: string): string => {
    const normalizedId = catId.toLowerCase().trim();
    // Try matching keys in the fallback map
    if (categoryImages[normalizedId]) return categoryImages[normalizedId];
    // Try partial match
    const key = Object.keys(categoryImages).find(k => normalizedId.includes(k) || k.includes(normalizedId));
    if (key) return categoryImages[key];
    // Default fallback
    return mariagePrestige;
  };

  return (
    <section className="bg-[#FFF8F9] py-12 border-t border-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9607A] font-semibold mb-1">Nos univers</p>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1B1115]">Découvrez nos catégories</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-5 mb-12">
          {displayCategories.map(cat => (
            <div key={cat.id} onClick={() => go(cat.id)}
              className="group cursor-pointer rounded-xl overflow-hidden border border-gray-100 bg-white hover:shadow-md transition-all duration-300">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={getCategoryImage(cat.id)} alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="px-3 py-2.5 flex items-center justify-between bg-white">
                <h3 className="text-xs sm:text-sm font-semibold text-[#1B1115] leading-tight">{cat.name}</h3>
                <span className="text-[#C9607A] font-bold text-base leading-none group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-pink-100 pt-8 grid grid-cols-2 md:grid-cols-4 gap-5">
          {trust.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFF0F3] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-[#C9607A]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1B1115] uppercase tracking-wide">{title}</h4>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
