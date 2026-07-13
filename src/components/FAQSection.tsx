import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIdx(prev => (prev === idx ? null : idx));
  };

  const faqs = [
    {
      q: "Délais de production ?",
      a: "Le délai dépend du produit et du volume. Il est confirmé avant commande."
    },
    {
      q: "Comment commander ?",
      a: "Choisissez un produit, puis cliquez sur Commander pour finaliser sur WhatsApp."
    },
    {
      q: "Livraison ?",
      a: "Dakar et régions. Les options disponibles s'affichent avant validation."
    }
  ];

  return (
    <section className="section-spacer bg-[#FAF9F9]">
      <div className="section-container">
        <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase font-semibold">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2D2D] tracking-tight">
            Questions utiles
          </h2>
          <div className="h-0.5 w-16 bg-[#E8A5A5] mx-auto rounded" />
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
                    {isOpen ? <Minus className="icon-sm" /> : <Plus className="icon-sm" />}
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
      </div>
    </section>
  );
};
