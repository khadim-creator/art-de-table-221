import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
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

  let headlineTop = slide?.headlineTop || slide?.title?.split('\n')?.[0] || fallback.headlineTop;
  let headlineAccent = slide?.headlineAccent || slide?.highlight || fallback.headlineAccent;
  let headlineBottom = slide?.headlineBottom || fallback.headlineBottom;
  let body = slide?.body || slide?.subTitle || fallback.body;

  // Intercept and sanitize any occurrence of "emballages premium" or "emballage premium" from database
  const sanitizeText = (text: string, fallbackText: string) => {
    if (!text) return text;
    if (/emballages?\s+premium/i.test(text)) {
      return fallbackText;
    }
    return text;
  };

  headlineAccent = sanitizeText(headlineAccent, 'contenant & packaging');
  headlineBottom = sanitizeText(headlineBottom, 'ALIMENTAIRES');
  if (body) {
    body = body.replace(/emballages?\s+premium/gi, 'contenant & packaging');
  }

  return {
    artwork: slide?.artwork || artworkFallback || fallback.artwork,
    headlineTop,
    headlineAccent,
    headlineBottom,
    body,
    body2: slide?.body2 || fallback.body2,
    meta: slide?.meta || fallback.meta,
    ctaText: ctaOverride.ctaText,
    ctaLink: ctaOverride.ctaLink,
    features: Array.isArray(slide?.features) ? slide.features : fallback.features,
  };
};


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

        <div className="section-container relative z-10 mx-auto grid h-full w-full max-w-7xl grid-cols-2 items-center gap-3 px-4 py-2 sm:gap-5 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
          {/* ---------- Column 1: Text & CTAs (Left Side) ---------- */}
          <div className="flex h-full w-full flex-col justify-center gap-3 text-left lg:col-span-8 lg:grid lg:grid-cols-12 lg:gap-6">
            
            {/* Headline and Description */}
            <div className="flex flex-col justify-center gap-1.5 lg:col-span-7">
              {/* headline */}
              <div className="hero-rise w-full space-y-0.5" style={{ animationDelay: '0.2s' }}>
                <h1 className="font-sans text-[clamp(1.15rem,3.8vw,2.5rem)] font-black leading-[1.05] text-[#A1204A]">
                  {currentSlide.headlineTop}
                </h1>
                {currentSlide.headlineAccent ? (
                  <p className="font-sans text-[clamp(0.95rem,3vw,2rem)] font-semibold leading-[1.05] text-[#8C6845]">
                    {currentSlide.headlineAccent}
                  </p>
                ) : null}
                {currentSlide.headlineBottom ? (
                  <h2 className="font-sans text-[clamp(0.85rem,2.8vw,1.75rem)] font-semibold leading-[1.05] text-[#A1204A]">
                    {currentSlide.headlineBottom}
                  </h2>
                ) : null}
              </div>

              {/* body */}
              <p className="hero-rise text-pretty text-[0.76rem] leading-normal text-[#4C3A42] sm:text-[0.88rem] sm:leading-relaxed" style={{ animationDelay: '0.4s' }}>
                {currentSlide.body}{' '}
                <span className="hidden xs:inline">
                  {currentSlide.body2 || 'Des formats pensés pour vos tables, vos coffrets et vos événements.'}
                </span>
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col justify-center lg:col-span-5">
              <div className="hero-rise flex flex-row flex-wrap items-center gap-2 w-full sm:flex-col sm:items-stretch sm:gap-3" style={{ animationDelay: '0.6s' }}>
                <button
                  onClick={() => goToLink(currentSlide.ctaLink)}
                  className="btn-primary group min-h-[38px] px-3.5 text-[10px] font-semibold uppercase tracking-[0.05em] shadow-[0_10px_24px_rgba(140,104,69,0.15)] sm:min-h-11 sm:px-5 sm:text-[0.78rem] sm:w-full sm:justify-center flex-1 text-center justify-center"
                >
                  <span>{currentSlide.ctaText}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
                </button>
                <button
                  onClick={() => goToLink(whatsappLink)}
                  className="flex min-h-[38px] items-center justify-center gap-1.5 rounded-full border-2 border-[#A1204A]/60 bg-white/95 px-3.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-[#A1204A] transition-colors hover:bg-[#A1204A]/5 sm:min-h-11 sm:px-5 sm:text-[0.78rem] sm:w-full flex-1 text-center justify-center shadow-sm"
                >
                  <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>
                    <span className="inline lg:hidden">WhatsApp</span>
                    <span className="hidden lg:inline">Commander sur WhatsApp</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* ---------- Column 2: Artwork (Right Side) ---------- */}
          {currentSlide.artwork ? (
            <div className="relative z-20 flex h-full w-full items-center justify-center lg:col-span-4">
              <div className="hero-rise-slow flex h-full w-full items-center justify-center" style={{ animationDelay: '0.35s' }}>
                <img
                  src={currentSlide.artwork}
                  alt={currentSlide.headlineTop}
                  className="hero-artwork block h-full max-h-[250px] xs:max-h-[280px] sm:max-h-[300px] lg:max-h-[380px] w-full max-w-full object-contain object-center scale-105 xs:scale-110 sm:scale-100"
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* ---------- Slide counter ---------- */}
        {slides.length > 1 ? (
          <div className="absolute bottom-3 right-4 z-30 flex items-center gap-1.5 sm:right-6 lg:right-8">
            {slides.map((_, index) => (
              <React.Fragment key={index}>
                {index > 0 ? (
                  <span
                    aria-hidden="true"
                    className={`h-px w-4 transition-all sm:w-6 ${
                      index === current || index - 1 === current ? 'bg-[#A1204A]' : 'bg-[#A1204A]/25'
                    }`}
                  />
                ) : null}
                <button
                  type="button"
                  aria-label={`Aller au slide ${index + 1}`}
                  onClick={() => setCurrent(index)}
                  className={`font-sans text-[10px] font-bold tabular-nums tracking-[0.1em] transition-all sm:text-[12px] ${
                    index === current ? 'text-[#A1204A]' : 'text-[#A1204A]/35 hover:text-[#A1204A]/60'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')}
                </button>
              </React.Fragment>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};
