import React from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const { setView, setSelectedCategory } = useApp();

  const handleCategoryNav = (slug: string) => {
    setSelectedCategory(slug);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FAF7F5] text-stone-600 pt-20 pb-10 border-t-2 border-[#D4AF37]/25 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-5">
            <Logo size="sm" theme="light" />
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Maison sénégalaise d'exception spécialisée dans la création de packagings sur-mesure, cadeaux d'affaires d'excellence et ornements cérémoniels de grand standing.
            </p>
            <div className="flex space-x-3 pt-2">
              <span className="text-[10px] bg-[#E8A5A5]/10 text-[#8B3A52] px-3 py-1.5 rounded font-mono uppercase tracking-widest border border-[#E8A5A5]/20 font-bold">
                Prestige Sénégalais
              </span>
            </div>
          </div>

          {/* Column 2: Quick Universes */}
          <div className="space-y-5">
            <h4 className="font-serif text-sm font-black tracking-wider text-[#2D2D2D] uppercase border-b border-[#E8A5A5]/15 pb-2">
              Nos Univers
            </h4>
            <ul className="space-y-3.5 text-xs font-medium">
              <li>
                <button onClick={() => handleCategoryNav('evenementiel')} className="hover:text-[#8B3A52] text-stone-550 transition font-serif cursor-pointer">
                  Événementiel & Mariages
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('bouteilles-personnalisees')} className="hover:text-[#8B3A52] text-stone-550 transition font-serif cursor-pointer">
                  Bouteilles Personnalisées
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('parfumerie-cosmetique')} className="hover:text-[#8B3A52] text-stone-550 transition font-serif cursor-pointer">
                  Parfumerie & Cosmétique
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('sacs-emballages-boutique')} className="hover:text-[#8B3A52] text-stone-550 transition font-serif cursor-pointer">
                  Sacs & Emballages Boutique
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('emballages-alimentaires')} className="hover:text-[#8B3A52] text-stone-550 transition font-serif cursor-pointer">
                  Emballages Alimentaires
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('solutions-impression')} className="hover:text-[#8B3A52] text-stone-550 transition font-serif cursor-pointer">
                  Solutions d'Impression
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryNav('solutions-entreprises')} className="hover:text-[#8B3A52] text-stone-550 transition font-serif cursor-pointer">
                  Solutions Entreprises
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Custom Care */}
          <div className="space-y-5">
            <h4 className="font-serif text-sm font-black tracking-wider text-[#2D2D2D] uppercase border-b border-[#E8A5A5]/15 pb-2">
              Services Client
            </h4>
            <ul className="space-y-3.5 text-xs font-medium">
              <li>
                <button onClick={() => { setView('devis-request'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#8B3A52] text-left transition font-serif cursor-pointer">
                  Faire une demande de devis
                </button>
              </li>
              <li>
                <button onClick={() => { setView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#8B3A52] text-left transition font-serif cursor-pointer">
                  Consulter le Catalogue
                </button>
              </li>
              <li>
                <button onClick={() => { setView('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#8B3A52] text-left transition font-serif cursor-pointer">
                  Suivi de ma Commande
                </button>
              </li>
              <li>
                <button onClick={() => { setView('login'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#8B3A52] text-left transition font-serif cursor-pointer">
                  Créer un Compte Client
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="space-y-5">
            <h4 className="font-serif text-sm font-black tracking-wider text-[#2D2D2D] uppercase border-b border-[#E8A5A5]/15 pb-2">
              Maison Dakar
            </h4>
            <ul className="space-y-4 text-xs text-stone-600">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#8B3A52] shrink-0 mt-0.5" />
                <span className="font-light">Jardin Ouagou Niayes, côté marché HLM, en face de la Kaynaan, près de la salle de basket, Dakar, Sénégal</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="font-bold">+221 77 871 58 75</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#8B3A52] shrink-0" />
                <span className="font-medium hover:text-[#8B3A52] transition">contact@artdetable.sn</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="font-serif font-bold text-[#2D2D2D]">Ouvert Lundi au Dimanche</p>
                  <p className="text-[10px] text-stone-500 font-mono">De 9h30 à 20h00 non-stop</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Separator / Payment icons */}
        <div className="border-t border-[#E8A5A5]/15 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs">
          
          {/* Copyright description */}
          <div className="text-stone-500 font-light text-center sm:text-left mb-4 sm:mb-0">
            © {new Date().getFullYear()} Art de Table. Conçue pour briller au Sénégal.
          </div>

          {/* Social icons */}
          <div className="flex items-center space-x-3 mb-4 sm:mb-0 bg-[#E8A5A5]/5 px-4 py-2 rounded-full border border-[#E8A5A5]/10">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#8B3A52] font-bold font-sans">Suivez-nous :</span>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-[#8B3A52] transition">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V1H13a5 5 0 00-5 5v2H5v3h2v9h2c0-3 .1-11 .1-11z" />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-[#8B3A52] transition">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>

          </div>

          {/* Wave, Orange Money simulation visual badge list */}
          <div className="flex items-center space-x-4">
            <span className="text-[10px] text-stone-500 font-mono font-bold">PAIEMENTS SÉCURISÉS :</span>
            <div className="flex space-x-2">
              <span className="px-2.5 py-1 bg-blue-600/10 text-blue-750 border border-blue-500/15 rounded font-mono text-[9px] font-bold">
                WAVE
              </span>
              <span className="px-2.5 py-1 bg-orange-600/10 text-orange-750 border border-orange-500/15 rounded font-mono text-[9px] font-bold">
                ORANGE MONEY
              </span>
              <span className="px-2.5 py-1 bg-green-600/10 text-green-750 border border-green-500/15 rounded font-mono text-[9px] font-bold">
                LIVRAISON
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
