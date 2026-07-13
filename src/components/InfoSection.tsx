import React from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, Instagram, Facebook, ExternalLink, MessageCircle, ShoppingBag } from 'lucide-react';

export const InfoSection: React.FC = () => {
  const { setView } = useApp();

  return (
    <section className="section-spacer bg-[linear-gradient(180deg,#FFFDFD_0%,#FFF7F8_100%)] border-y border-pink-50">
      <div className="section-container">
        <div className="max-w-2xl mb-10">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#C9607A] font-semibold mb-2">Informations complémentaires</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1B1115]">Contact, réseaux et accès rapide</h2>
          <p className="mt-3 text-sm text-stone-500 leading-relaxed">
            Retrouvez ici les informations essentielles pour contacter l’atelier, suivre nos contenus et accéder rapidement au catalogue.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="card-premium p-6 sm:p-7 space-y-5 text-left">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FFF0F3] flex items-center justify-center text-[#C9607A]">
                <Phone className="icon-md" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#1B1115]">Coordonnées directes</h3>
                <p className="text-xs text-stone-500">Réponse rapide par téléphone et WhatsApp</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-stone-600">
              <p className="flex items-center gap-2"><Phone className="icon-sm text-[#C9607A]" /> +221 77 871 58 75</p>
              <p className="flex items-center gap-2"><MessageCircle className="icon-sm text-[#C9607A]" /> WhatsApp disponible sur le même numéro</p>
              <p className="flex items-center gap-2"><Mail className="icon-sm text-[#C9607A]" /> contact@artdetable.sn</p>
              <p className="flex items-start gap-2"><MapPin className="icon-sm text-[#C9607A] mt-0.5" /> Jardin Ouagou Niayes, côté marché HLM, Dakar, Sénégal</p>
            </div>
          </div>

          <div className="card-premium p-6 sm:p-7 space-y-5 text-left">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FFF0F3] flex items-center justify-center text-[#C9607A]">
                <ExternalLink className="icon-md" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#1B1115]">Réseaux sociaux</h3>
                <p className="text-xs text-stone-500">Présence de marque claire et cohérente</p>
              </div>
            </div>
            <div className="space-y-3">
              <a href="https://www.tiktok.com/@art_de_table" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-2xl border border-stone-100 px-4 py-3 hover:border-[#C9607A] hover:shadow-sm transition">
                <div>
                  <p className="text-sm font-semibold text-[#1B1115]">TikTok</p>
                  <p className="text-xs text-stone-500">@art_de_table</p>
                </div>
                <ExternalLink className="icon-sm text-[#C9607A]" />
              </a>
              <a href="https://www.instagram.com/artdetable221" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-2xl border border-stone-100 px-4 py-3 hover:border-[#C9607A] hover:shadow-sm transition">
                <div>
                  <p className="text-sm font-semibold text-[#1B1115]">Instagram</p>
                  <p className="text-xs text-stone-500">@artdetable221</p>
                </div>
                <Instagram className="icon-sm text-[#C9607A]" />
              </a>
              <a href="https://www.facebook.com/artdetable221" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-2xl border border-stone-100 px-4 py-3 hover:border-[#C9607A] hover:shadow-sm transition">
                <div>
                  <p className="text-sm font-semibold text-[#1B1115]">Facebook</p>
                  <p className="text-xs text-stone-500">Art de Table 221</p>
                </div>
                <Facebook className="icon-sm text-[#C9607A]" />
              </a>
            </div>
          </div>

          <div className="card-premium p-6 sm:p-7 bg-[#1B1115] text-white shadow-sm space-y-5 overflow-hidden relative border-none">
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#C9607A]/20 blur-3xl" />
            <div className="relative z-10 text-left">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#F8C9D7] font-semibold mb-2">Accès rapide</p>
              <h3 className="text-xl font-semibold">Catalogue, devis et commande</h3>
              <p className="mt-3 text-sm text-white/75 leading-relaxed">
                Explorez le catalogue, lancez un devis ou retrouvez l’univers qui vous correspond en quelques secondes.
              </p>
            </div>
            <div className="relative z-10 flex flex-col gap-3">
              <button onClick={() => setView('shop')} className="btn-secondary w-full bg-white text-[#1B1115] hover:bg-[#FAF6F0] hover:text-[#1B1115] border-transparent font-bold text-xs uppercase tracking-[0.25em]">
                <ShoppingBag className="icon-sm" />
                Voir les produits
              </button>
              <button onClick={() => setView('devis-request')} className="btn-secondary w-full border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white font-bold text-xs uppercase tracking-[0.25em]">
                Demander un devis
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
