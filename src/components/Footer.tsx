import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setView, setSelectedCategory } = useApp();

  return (
    <footer id="footer-section" className="border-t border-white/10 bg-[#8C6845] text-white font-sans">
      <div className="section-container pt-8 pb-20 md:pt-12 md:pb-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr] md:gap-12">
          <div className="space-y-4">
            <Logo size="lg" theme="light" variant="stacked" showTagline={true} />
            <div className="flex flex-wrap gap-2 justify-start">
              <a
                href="https://wa.me/221778715875?text=Bonjour%20Art%20de%20Table"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-white/20"
              >
                <MessageCircle className="icon-sm" />
                WhatsApp
              </a>
              <a
                href="https://www.tiktok.com/@art_de_table"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-white/20"
              >
                <svg
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.94 1.13 2.27 1.93 3.73 2.23v3.91c-1.32-.16-2.61-.66-3.7-1.42-.64-.45-1.2-1-1.64-1.63V15.5c.02 1.34-.33 2.68-1.02 3.82-.9 1.48-2.31 2.6-3.97 3.12-1.74.55-3.66.45-5.32-.29-1.92-.85-3.48-2.52-4.14-4.52C1.22 15.65.98 13.56 1.5 11.58c.61-2.29 2.16-4.29 4.31-5.31 1.4-.66 2.97-.93 4.51-.76v3.96c-.95-.14-1.93.04-2.77.53-1.04.62-1.75 1.74-1.91 2.95-.17 1.25.26 2.53 1.12 3.42.86.89 2.12 1.32 3.35 1.15 1.14-.15 2.17-.89 2.72-1.91.43-.8.59-1.73.57-2.65V.02z" />
                </svg>
                TikTok
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/90">
              Navigation
            </div>
            <div className="space-y-2 text-sm text-white/80 text-left">
              <button 
                onClick={() => { setSelectedCategory(null); setView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="block font-semibold transition hover:text-white"
              >
                Boutique
              </button>
              {/* Sub-categories */}
              <div className="pl-3 space-y-1.5 text-xs text-white/70 flex flex-col items-start border-l border-white/10 ml-1">
                <button 
                  onClick={() => { setSelectedCategory('sacs-emballages-boutique'); setView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="block transition hover:text-white"
                >
                  Sacs & Emballages
                </button>
                <button 
                  onClick={() => { setSelectedCategory('emballages-alimentaires'); setView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="block transition hover:text-white"
                >
                  Emballages Alimentaires
                </button>
                <button 
                  onClick={() => { setView('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="block transition hover:text-white"
                >
                  À propos de nous
                </button>
              </div>
              <button onClick={() => { setView('devis-request'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block pt-1 transition hover:text-white">
                Devis
              </button>
              <button onClick={() => { setView('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block transition hover:text-white">
                Contact
              </button>
              <button onClick={() => { setView('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="block transition hover:text-white">
                Politique de confidentialité
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/90">
              Contact
            </div>
            <div className="space-y-3 text-sm text-white/80">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 icon-sm shrink-0 text-white/80" />
                <span>Dakar, Sénégal</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="icon-sm shrink-0 text-white/80" />
                <a href="tel:+221778715875">+221 77 871 58 75</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="icon-sm shrink-0 text-white/80" />
                <a href="mailto:contact@artdetable.sn">contact@artdetable.sn</a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-8 flex flex-wrap items-center gap-3 border-t border-white/15 pt-4 text-[11px] text-white/80">
          <button onClick={() => setView('devis-request')} className="underline-offset-4 hover:underline">
            FAQ
          </button>
          <button onClick={() => setView('contact')} className="underline-offset-4 hover:underline">
            Contact
          </button>
          <button onClick={() => setView('privacy')} className="underline-offset-4 hover:underline">
            Politique de confidentialité
          </button>
          <button onClick={() => window.open('https://wa.me/221778715875', '_blank', 'noopener,noreferrer')} className="underline-offset-4 hover:underline">
            WhatsApp
          </button>
          <span className="ml-auto text-white/90">Website by Khadxm</span>
        </div>
      </div>
    </footer>
  );
};
