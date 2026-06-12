import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import bannerImg from '../assets/images/regenerated_image_1780829791725.png';
import mariageImg from '../assets/images/mariage_prestige_1780566116217.png';
import bouteillesImg from '../assets/images/bouteilles_jus_1780566133711.png';

const slides = [
  { image: '/slider-1.jpg', title: "", subtitle: "transformez chaque evenement.", btn: "Découvrir la boutique", view: "shop" },
  { image: '/slider-2.jpg', title: "", subtitle: "sublimez vos produits alimentaires.", btn: "Collection mariage", view: "shop" },
  { image: '/slider-3.jpg', title: "", subtitle: "donnez vie a votre communication.", btn: "Voir les contenants", view: "shop" },
];

export const Hero: React.FC = () => {
  const { setView } = useApp();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const t = setInterval(() => advance((n: number) => (n + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const advance = (fn: (n: number) => number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => { setCurrent(fn); setAnimating(false); }, 300);
  };

  const slide = slides[current];

  return (
    <section
      className="relative w-full overflow-hidden bg-gray-900"
      style={{ marginTop: '0', height: '200vh', minHeight: '500px', maxHeight: '200vh' }}
    >
      {slides.map((s, i) => (
        <img key={i} src={s.image} alt={s.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

      <div className={`absolute inset-0 flex items-center transition-all duration-300 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <div className="max-w-md space-y-3">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white leading-snug">{slide.title}</h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed hidden sm:block">{slide.subtitle}</p>
            <button
              onClick={() => { setView(slide.view as any); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 bg-[#C9607A] hover:bg-white hover:text-[#C9607A] text-white px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-lg"
            >
              {slide.btn} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <button onClick={() => advance((n: number) => (n - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition">
        <ChevronLeft className="w-4 h-4 text-gray-800" />
      </button>
      <button onClick={() => advance((n: number) => (n + 1) % slides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition">
        <ChevronRight className="w-4 h-4 text-gray-800" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'bg-white w-5 h-2' : 'bg-white/50 w-2 h-2'}`} />
        ))}
      </div>
    </section>
  );
};