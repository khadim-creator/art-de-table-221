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
    <section className="relative overflow-hidden -mt-px pt-0 pb-1 sm:pb-2">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.72),transparent_26%),radial-gradient(circle_at_86%_18%,rgba(155,44,74,0.09),transparent_28%),linear-gradient(180deg,#FFF8F9_0%,#FCE8EC_48%,#F8DCE3_100%)]" />

      <div className="section-container">
        <div className="hero-banner-card relative overflow-hidden rounded-[1.15rem] sm:rounded-[1.4rem] border border-white/70 bg-white/70 shadow-[0_18px_60px_rgba(155,44,74,0.12)] backdrop-blur-sm">
          <div className="relative min-h-[280px] sm:min-h-[345px] lg:min-h-[415px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.65),transparent_24%),radial-gradient(circle_at_80%_25%,rgba(220,95,132,0.14),transparent_20%)]" />

            <div key={current} className="hero-slide-enter relative z-10 flex min-h-[280px] items-center gap-3 px-4 py-2.5 sm:min-h-[345px] sm:gap-5 sm:px-6 sm:py-4 lg:min-h-[415px] lg:gap-8 lg:px-10 lg:py-5">
              <div className="min-w-0 basis-[58%] max-w-[560px]">
                <div className="space-y-2 sm:space-y-3">
                  <div className="space-y-0.5 sm:space-y-1">
                    <h1 className="font-display text-[clamp(2.25rem,7vw,5.85rem)] leading-[0.84] tracking-[-0.055em] text-[#A1204A]">
                      {currentSlide.headlineTop}
                    </h1>
                    {currentSlide.headlineAccent ? (
                      <p className="font-display italic text-[clamp(2rem,5.5vw,4.3rem)] leading-[0.88] text-[#D44B85]">
                        {currentSlide.headlineAccent}
                      </p>
                    ) : null}
                    {currentSlide.headlineBottom ? (
                      <h2 className="font-display text-[clamp(1.95rem,5.5vw,4.35rem)] leading-[0.88] tracking-[-0.055em] text-[#A1204A]">
                        {currentSlide.headlineBottom}
                      </h2>
                    ) : null}
                  </div>

                  <p className="max-w-[32rem] text-[1.04rem] sm:text-[1.12rem] leading-6 sm:leading-7 text-[#33252B]">
                    {currentSlide.body}
                  </p>

                  <button
                    onClick={() => goToLink(currentSlide.ctaLink)}
                    className="btn-primary self-start text-[0.8rem] sm:text-[0.92rem] font-semibold uppercase tracking-[0.12em]"
                  >
                    <span>{currentSlide.ctaText}</span>
                    <ArrowRight className="icon-sm" />
                  </button>
                </div>
              </div>

              <div className="relative flex basis-[44%] items-center justify-center self-stretch lg:justify-end">
                <div className="absolute inset-6 rounded-full bg-[#F4C8D4]/40 blur-3xl sm:inset-10" />
                {currentSlide.artwork ? (
                  <img
                    src={currentSlide.artwork}
                    alt=""
                    aria-hidden="true"
                    className="hero-artwork relative z-10 max-h-[165px] w-full max-w-[160px] object-contain drop-shadow-[0_22px_38px_rgba(155,44,74,0.12)] sm:max-h-[235px] sm:max-w-[285px] lg:max-h-[370px] lg:max-w-[445px] lg:translate-x-4"
                  />
                ) : null}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
