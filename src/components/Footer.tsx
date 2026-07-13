import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setView } = useApp();

  return (
    <footer id="footer-section" className="border-t border-white/10 bg-[linear-gradient(135deg,#A67C52_0%,#8C6845_100%)] text-white font-sans">
      <div className="section-container section-spacer">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo size="lg" theme="light" variant="stacked" showTagline={true} />
            <a
              href="https://wa.me/221778715875?text=Bonjour%20Art%20de%20Table"
              target="_blank"
              rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-white/20"
            >
              <MessageCircle className="icon-sm" />
              WhatsApp
            </a>
          </div>

          <div className="space-y-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/90">
              Navigation
            </div>
            <div className="space-y-2 text-sm text-white/80">
          <button onClick={() => setView('shop')} className="block transition hover:text-white">
                Boutique
              </button>
          <button onClick={() => setView('devis-request')} className="block transition hover:text-white">
                Devis
              </button>
              <button onClick={() => setView('contact')} className="block transition hover:text-white">
                Contact
              </button>
              <button onClick={() => setView('privacy')} className="block transition hover:text-white">
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

        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-white/15 pt-4 text-[11px] text-white/80">
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
