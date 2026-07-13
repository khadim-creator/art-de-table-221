import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import heroArtwork1 from '../assets/images/slider-01.png';
import heroArtwork2 from '../assets/images/slider-02.png';
import heroArtwork3 from '../assets/images/slider-03.png';

type HeroSlide = {
  artwork?: string;
  headlineTop: string;
  headlineAccent?: string;
  headlineBottom?: string;
  body: string;
  body2?: string;
  meta?: string;
  ctaText: string;
  ctaLink: string;
  features?: string[];
  image?: string;
};

const HERO_CTA_OVERRIDES = [
  {
    ctaText: 'Découvrir nos créations',
    ctaLink: 'catalog',
  },
  {
    ctaText: 'En savoir plus',
    ctaLink: 'quote',
  },
  {
    ctaText: 'Commander',
    ctaLink: 'https://wa.me/221778715875?text=Bonjour%20Art%20de%20Table%2C%20je%20souhaite%20passer%20commande.',
  },
] as const;

const fallbackSlides: HeroSlide[] = [
  {
    artwork: heroArtwork1,
    headlineTop: 'DONNEZ VIE À VOTRE',
    headlineAccent: 'communication.',
    body: 'Des supports élégants pour valoriser votre image de marque.',
    meta: 'Packaging - emballage - personnalisation · 77 871 58 75',
    ctaText: 'Découvrir nos créations',
    ctaLink: 'catalog',
    features: ['DESIGN PROFESSIONNEL', 'IMPRESSION HAUTE QUALITÉ', 'PERSONNALISATION SUR MESURE', 'LIVRAISON RAPIDE'],
  },
  {
    artwork: heroArtwork2,
    headlineTop: 'SUBLIMEZ',
    headlineAccent: 'vos produits',
    headlineBottom: 'ALIMENTAIRES.',
    body: 'Des emballages pratiques et personnalisables.',
    body2: '',
    ctaText: 'En savoir plus',
    ctaLink: 'quote',
    features: ['PROTECTION OPTIMALE', 'MATÉRIAUX DE QUALITÉ', 'PRÉSENTATION ÉLÉGANTE', 'PERSONNALISATION SUR MESURE'],
  },
  {
    artwork: heroArtwork3,
    headlineTop: 'TRANSFORMEZ',
    headlineBottom: 'CHAQUE ÉVÉNEMENT',
    headlineAccent: 'en souvenir inoubliable.',
    body: 'Des créations personnalisées pour vos événements.',
    body2: '',
    ctaText: 'Commander',
    ctaLink: 'https://wa.me/221778715875?text=Bonjour%20Art%20de%20Table%2C%20je%20souhaite%20passer%20commande.',
    features: ['BOUTEILLES D’EAU', 'COFFRETS CADEAUX', 'EMBALLAGES DE PRESTIGE', 'ACCESSOIRES ÉVÉNEMENTIELS'],
  },
];

const normalizeSlide = (slide: any, fallback: HeroSlide, artworkFallback?: string, index = 0): HeroSlide => {
  const ctaOverride = HERO_CTA_OVERRIDES[index] || HERO_CTA_OVERRIDES[HERO_CTA_OVERRIDES.length - 1];

  return {
    artwork: slide?.artwork || artworkFallback || fallback.artwork,
    headlineTop: slide?.headlineTop || slide?.title?.split('\n')?.[0] || fallback.headlineTop,
    headlineAccent: slide?.headlineAccent || slide?.highlight || fallback.headlineAccent,
    headlineBottom: slide?.headlineBottom || fallback.headlineBottom,
    body: slide?.body || slide?.subTitle || fallback.body,
    body2: slide?.body2 || fallback.body2,
    meta: slide?.meta || fallback.meta,
    ctaText: ctaOverride.ctaText,
    ctaLink: ctaOverride.ctaLink,
    features: Array.isArray(slide?.features) ? slide.features : fallback.features,
  };
};

export const Hero: React.FC = () => {
  const { siteSettings, setView, setSelectedCategory } = useApp();
  const [current, setCurrent] = useState(0);

  const slides = useMemo(() => {
    const sourceSlides = Array.isArray(siteSettings?.slides) && siteSettings.slides.length > 0
      ? siteSettings.slides
      : fallbackSlides;

    return sourceSlides.slice(0, 3).map((slide: any, index: number) => {
      const fallback = fallbackSlides[index % fallbackSlides.length];
      const artworkFallback = index === 0 ? heroArtwork1 : index === 1 ? heroArtwork2 : index === 2 ? heroArtwork3 : undefined;
      return normalizeSlide(slide, fallback, artworkFallback, index);
    });
  }, [siteSettings?.slides]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[current] || fallbackSlides[0];

  const goToLink = (link: string) => {
    if (!link) return;
    if (link === 'catalog') {
      setSelectedCategory(null);
      setView('shop');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (link === 'quote') {
      setView('devis-request');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (link.startsWith('http')) {
      window.open(link, '_blank', 'noopener,noreferrer');
      return;
    }
    window.location.href = link;
  };

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="section-container">
        <div key={current} className="home-hero hero-slide-enter relative isolate overflow-hidden border-y border-[#E7D9CF] bg-[#FFF8F9]">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_78%_48%,rgba(166,124,82,0.12),transparent_42%)]" />

          <div className="relative z-10 grid min-h-[inherit] grid-cols-[0.95fr_1.05fr] items-start gap-2 px-4 py-8 sm:gap-5 sm:px-7 sm:py-10 lg:grid-cols-[0.88fr_1.12fr] lg:px-10 lg:py-10">
            <div className="max-w-[35rem] space-y-3 pt-2 sm:space-y-4 lg:pt-4">
              <div className="space-y-1.5">
                <h1 className="max-w-[14ch] font-sans text-[clamp(1.45rem,6.5vw,4.5rem)] font-black leading-[0.92] text-[#A1204A]">
                  {currentSlide.headlineTop}
                </h1>
                {currentSlide.headlineAccent ? (
                  <p className="max-w-[16ch] font-sans text-[clamp(1.05rem,4.7vw,2.9rem)] font-semibold leading-[1] text-[#8C6845]">
                    {currentSlide.headlineAccent}
                  </p>
                ) : null}
                {currentSlide.headlineBottom ? (
                  <h2 className="max-w-[17ch] font-sans text-[clamp(1rem,4.2vw,2.6rem)] font-semibold leading-[1.02] text-[#A1204A]">
                    {currentSlide.headlineBottom}
                  </h2>
                ) : null}
              </div>

              <p className="max-w-[30rem] text-[0.78rem] leading-5 text-[#4C3A42] sm:text-[1rem] sm:leading-7">
                {currentSlide.body}
              </p>

              <div className="flex flex-col items-start gap-2 pt-1 sm:flex-row sm:items-center sm:gap-4">
                <button
                  onClick={() => goToLink(currentSlide.ctaLink)}
                  className="btn-primary min-h-10 px-4 text-[0.68rem] font-semibold uppercase tracking-[0.1em] sm:min-h-11 sm:px-6 sm:text-[0.82rem]"
                >
                  <span>{currentSlide.ctaText}</span>
                  <ArrowRight className="icon-sm" />
                </button>
                {currentSlide.meta ? (
                  <div className="hidden max-w-[20rem] text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8C6845] sm:block sm:text-[10px]">
                    {currentSlide.meta}
                  </div>
                ) : null}
              </div>
            </div>

            {currentSlide.artwork ? (
              <div className="relative z-20 flex min-h-[210px] items-start justify-center pt-0 sm:min-h-[250px] lg:min-h-[390px]">
                <img
                  src={currentSlide.artwork}
                  alt=""
                  aria-hidden="true"
                  className="hero-artwork relative z-20 h-full max-h-[245px] w-full object-contain sm:max-h-[310px] lg:max-h-[440px]"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};
