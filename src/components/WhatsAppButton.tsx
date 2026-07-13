import React from 'react';
import { ArrowUp } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      id="back-to-top-floating-btn"
      onClick={handleScrollToTop}
      aria-label="Revenir en haut de la page"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#8C6845] px-4 py-3 text-white shadow-[0_12px_32px_rgba(140,104,69,0.32)] transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      title="Retour en haut"
    >
      <ArrowUp className="w-5 h-5" />
      <span className="sr-only">Haut de page</span>
    </button>
  );
};
