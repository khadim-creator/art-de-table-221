import React from 'react';
import { ContactSection } from './ContactSection';

export const ContactView: React.FC = () => {
  return (
    <main className="min-h-screen bg-transparent pt-16 md:pt-20">
      <div className="bg-[linear-gradient(180deg,#FFF8F9_0%,#FFFDFD_100%)] border-b border-pink-50 py-14 md:py-20">
        <div className="section-container text-center space-y-4">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#C9607A] font-semibold">Contact</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B1115] leading-tight">
            Parlons de votre projet
          </h1>
          <p className="text-sm sm:text-base text-stone-500 max-w-2xl mx-auto leading-relaxed">
            Utilisez ce formulaire pour joindre l’atelier, demander un devis ou partager les détails de votre besoin.
          </p>
        </div>
      </div>
      <ContactSection />
    </main>
  );
};
