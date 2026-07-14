import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Sparkles, Star, ShieldCheck, Truck, MessageCircle } from 'lucide-react';
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

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Qualité garantie' },
  { icon: Truck, label: 'Livraison rapide' },
  { icon: Sparkles, label: 'Sur mesure' },
];

const heroAnimationCss = `
  @keyframes heroRise {
    0% { opacity: 0; transform: translateY(26px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes heroRiseSlow {
    0% { opacity: 0; transform: translateY(40px) scale(0.96); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes heroSweep {
    0% { transform: translateX(-101%); opacity: 1; }
    55% { opacity: 1; }
    100% { transform: translateX(101%); opacity: 0; }
  }
  .hero-rise {
    opacity: 0;
    animation: heroRise 1.9s cubic-bezier(0.22, 0.61, 0.36, 1) both;
  }
  .hero-rise-slow {
    opacity: 0;
    animation: heroRiseSlow 2.6s cubic-bezier(0.22, 0.61, 0.36, 1) both;
  }
  .hero-overlay-sweep {
    background: linear-gradient(115deg, rgba(161,32,74,0.0) 0%, rgba(161,32,74,0.9) 42%, rgba(224,164,88,0.9) 58%, rgba(224,164,88,0.0) 100%);
    animation: heroSweep 1.8s cubic-bezier(0.76, 0, 0.24, 1) both;
  }
  @media (prefers-reduced-motion: reduce) {
    .hero-rise, .hero-rise-slow, .hero-overlay-sweep {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
`;

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
  const heroThemeClass =
    current === 0
      ? 'bg-[#F6E7D4]'
      : current === 1
        ? 'bg-[#F8DCE3]'
        : 'bg-[#E7D2A6]';

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

  const whatsappLink =
    'https://wa.me/221778715875?text=Bonjour%20Art%20de%20Table%2C%20je%20souhaite%20passer%20commande.';

  return (
    <section className="relative overflow-hidden bg-white">
      <style>{heroAnimationCss}</style>
      <div
        key={current}
        className={`home-hero hero-slide-enter relative isolate overflow-hidden border-y border-[#E7D9CF] ${heroThemeClass}`}
      >
        {/* slide transition overlay sweep */}
        <div aria-hidden="true" className="hero-overlay-sweep pointer-events-none absolute inset-0 z-40" />

        {/* soft ambient glows */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_82%_38%,rgba(166,124,82,0.16),transparent_46%)]" />
        <div className="absolute -left-24 top-1/2 z-0 h-72 w-72 -translate-y-1/2 rounded-full bg-[#A1204A]/5 blur-3xl" />

        <div className="section-container relative z-10 mx-auto grid h-full min-h-[300px] w-full max-w-7xl grid-cols-2 items-start gap-4 px-4 pb-6 pt-0 sm:min-h-[380px] sm:gap-6 sm:px-6 sm:pt-0 lg:min-h-[460px] lg:gap-10 lg:px-8 lg:pt-0">
          {/* ---------- Left: copy ---------- */}
          <div className="flex h-full w-full flex-col items-start justify-start gap-2.5 text-left sm:gap-3">
            {/* headline */}
            <div className="hero-rise w-full max-w-[34rem] space-y-1" style={{ animationDelay: '0.25s' }}>
              <h1 className="font-sans text-[clamp(1.5rem,4.8vw,3.6rem)] font-black leading-[0.94] text-[#A1204A]">
                {currentSlide.headlineTop}
              </h1>
              {currentSlide.headlineAccent ? (
                <p className="font-sans text-[clamp(1.05rem,3.4vw,2.2rem)] font-semibold leading-[1.05] text-[#8C6845]">
                  {currentSlide.headlineAccent}
                </p>
              ) : null}
              {currentSlide.headlineBottom ? (
                <h2 className="font-sans text-[clamp(0.95rem,3vw,1.85rem)] font-semibold leading-[1.05] text-[#A1204A]">
                  {currentSlide.headlineBottom}
                </h2>
              ) : null}
            </div>

            {/* body */}
            <p className="hero-rise max-w-[30rem] text-pretty text-[0.85rem] leading-6 text-[#4C3A42] sm:text-[1rem] sm:leading-7" style={{ animationDelay: '0.55s' }}>
              {currentSlide.body}{' '}
              {currentSlide.body2 ||
                'Des formats pensés pour vos tables, vos coffrets et vos événements, avec une finition propre et lisible.'}
            </p>

            {/* CTAs */}
            <div className="hero-rise flex w-full flex-col items-stretch gap-2.5 pt-1 sm:w-auto sm:flex-row sm:items-start sm:gap-3" style={{ animationDelay: '1.15s' }}>
              <button
                onClick={() => goToLink(currentSlide.ctaLink)}
                className="btn-primary group min-h-11 w-full justify-center px-6 text-[0.75rem] font-semibold uppercase tracking-[0.1em] shadow-[0_14px_34px_rgba(140,104,69,0.2)] sm:w-auto sm:text-[0.84rem]"
              >
                <span>{currentSlide.ctaText}</span>
                <ArrowRight className="icon-sm transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => goToLink(whatsappLink)}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#A1204A]/25 bg-transparent px-6 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-[#A1204A] transition-colors hover:bg-[#A1204A]/5 sm:w-auto sm:text-[0.84rem]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Commander sur WhatsApp</span>
              </button>
            </div>

            {/* trust row */}
            <div className="hero-rise flex flex-wrap items-center justify-start gap-x-4 gap-y-2 pt-1" style={{ animationDelay: '1.45s' }}>
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-[#E0A458] text-[#E0A458]" />
                  ))}
                </div>
                <span className="text-[0.66rem] font-medium text-[#5C4651]">Clients satisfaits</span>
              </div>
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-[#5C4651]">
                  <Icon className="h-3.5 w-3.5 text-[#8C6845]" />
                  <span className="text-[0.66rem] font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ---------- Right: artwork ---------- */}
          {currentSlide.artwork ? (
            <div className="relative z-20 flex h-full w-full items-start justify-center self-stretch">
              {/* product stage */}
              <div className="hero-rise-slow flex h-full w-full max-w-[34rem] items-start justify-center" style={{ animationDelay: '0.35s' }}>
                <img
                  src={currentSlide.artwork}
                  alt={currentSlide.headlineTop}
                  className="hero-artwork block h-full max-h-full w-full object-contain object-center"
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* ---------- Slide indicators ---------- */}
        {slides.length > 1 ? (
          <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Aller au slide ${index + 1}`}
                onClick={() => setCurrent(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === current ? 'w-6 bg-[#A1204A]' : 'w-1.5 bg-[#A1204A]/30 hover:bg-[#A1204A]/50'
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};
