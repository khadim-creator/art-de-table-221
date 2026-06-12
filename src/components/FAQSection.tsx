import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIdx(prev => (prev === idx ? null : idx));
  };

  const faqs = [
    {
      q: "Quels sont vos délais réels de production au Sénégal ?",
      a: "Nos délais standards oscillent entre 7 et 10 jours ouvrés suivant la validation finale de vos maquettes visuelles et le paiement d'un acompte. Pour des dépannages de dernière minute (mariages, cérémonies urgentes), nous disposons d'un service express sous 3 à 5 jours selon la charge de l'atelier."
    },
    {
      q: "Comment puis-je vous transmettre mes logos et instructions de design ?",
      a: "Toutes les options d'upload et de personnalisation textuelle sont disponibles directement sur chaque fiche produit de notre boutique. Vous pouvez également cliquer sur notre bouton WhatsApp flottant pour communiquer en direct avec nos designers qui ajusteront vos maquettes gratuitement."
    },
    {
      q: "Puis-je me faire livrer dans l'ensemble des régions sénégalaises ?",
      a: "Absolument. Nous proposons le retrait gratuit en notre showroom (Dakar HLM), ainsi que la livraison à domicile sous 24h à Dakar (2 000 FCFA forfaitaire). Pour les régions (Thiès, Saint-Louis, Touba, Casamance, Mbour, Saly), nous expédions quotidiennement via des réseaux de GP professionnels assurant un transit ultra-sécurisé."
    },
    {
      q: "Quelles méthodes de paiements acceptez-vous sur le site ?",
      a: "Nous acceptons Wave, Orange Money d'une part, ou le Paiement Cash à la livraison à Dakar pour des commandes standards. Pour lancer la production personnalisée, un acompte forfaitaire symbolique pourra vous être demandé lors de l'échange de confirmation."
    },
    {
      q: "Proposez-vous des tarifs dégressifs pour de très grandes quantités ?",
      a: "Tout à fait ! Notre catalogue propose un panier d'achat standard, mais si vous organisez une grande réception ou êtes revendeur, nous vous invitons instamment à remplir notre formulaire 'Devis Sur-Mesure'. Vous recevrez notre proposition commerciale sous 2h par email et WhatsApp avec des remises allant jusqu'à 45%."
    }
  ];

  return (
    <section className="py-24 bg-[#FAF9F9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase font-semibold">
            Vos questions fréquentes
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2D2D] tracking-tight">
            FAQ & Renseignements
          </h2>
          <div className="h-0.5 w-16 bg-[#E8A5A5] mx-auto rounded" />
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            Trouvez les réponses immédiates à vos interrogations sur la personnalisation, les acomptes, les délais de livraison et le suivi de production.
          </p>
        </div>

        {/* Accordion Panel */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                id={`faq-item-${idx}`}
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300"
              >
                {/* Accordion Trigger Button */}
                <button
                  id={`faq-btn-${idx}`}
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between font-serif font-semibold text-sm sm:text-base text-[#2D2D2D] hover:text-[#E8A5A5] transition-colors focus:outline-none cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="p-1.5 bg-[#FDF2F2] rounded-full text-[#E8A5A5] transition-transform duration-300">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                {/* Collapsible Content */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? 'max-h-96 border-t border-gray-50' : 'max-h-0'
                  }`}
                >
                  <div className="p-6 text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
                    {faq.a}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
