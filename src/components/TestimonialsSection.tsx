import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Quote, Star, ArrowLeft, ArrowRight } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = useApp();
  const [activeIdx, setActiveIdx] = useState(0);

  const prevTestimonial = () => {
    setActiveIdx(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setActiveIdx(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (testimonials.length === 0) return null;

  const current = testimonials[activeIdx];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      
      {/* Background Graphic Watermark */}
      <div className="absolute right-[-5%] top-[10%] opacity-5 pointer-events-none text-gray-450 z-0">
        <Quote className="w-96 h-96 transform rotate-180" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-12">
        
        {/* Section Header */}
        <div className="max-w-xl mx-auto space-y-3">
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase font-semibold">
            Témoignages de nos clients
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2D2D] tracking-tight">
            Des Moments Inoubliables
          </h2>
          <div className="h-0.5 w-16 bg-[#E8A5A5] mx-auto rounded" />
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            Découvrez la satisfaction de nos clients à Dakar et au Sénégal qui nous font confiance pour sublimer leurs événements de cœur et leurs lancements exclusifs.
          </p>
        </div>

        {/* Carousel Content Panel */}
        <div className="bg-[#FDF2F2] rounded-[2.5rem] p-8 sm:p-16 border border-[#E8A5A5]/10 max-w-4xl mx-auto relative shadow-sm">
          
          <div className="flex flex-col items-center space-y-6">
            
            {/* Elegant Quotation Mark */}
            <Quote className="w-12 h-12 text-[#E8A5A5] fill-[#E8A5A5]/5 opacity-80" />
            
            <p className="font-serif text-base sm:text-lg italic text-[#4A4A4A] leading-relaxed max-w-2xl font-light">
              "{current.comment}"
            </p>

            {/* Stars rating visual */}
            <div className="flex space-x-1 justify-center">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
              ))}
            </div>

            {/* Avatar & author meta details */}
            <div className="flex flex-col items-center space-y-2 pt-4">
              <img
                src={current.avatar}
                alt={current.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-full object-cover border-2 border-[#E8A5A5] shadow-md"
              />
              <div>
                <p className="font-serif text-sm font-bold text-[#2D2D2D]">{current.name}</p>
                <p className="font-mono text-[9px] tracking-wider uppercase text-gray-400 font-semibold">{current.role}</p>
              </div>
            </div>

          </div>

          {/* Stepper control buttons left-right absolute panels */}
          <div className="flex justify-center space-x-4 mt-8 sm:mt-0 sm:absolute sm:bottom-16 sm:right-16">
            <button
              id="testimonials-prev-btn"
              onClick={prevTestimonial}
              className="p-3.5 bg-white hover:bg-[#E8A5A5] text-gray-650 hover:text-white rounded-full transition-all cursor-pointer shadow-sm border border-gray-50 hover:border-[#E8A5A5]"
              title="Précédent"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              id="testimonials-next-btn"
              onClick={nextTestimonial}
              className="p-3.5 bg-white hover:bg-[#E8A5A5] text-gray-650 hover:text-white rounded-full transition-all cursor-pointer shadow-sm border border-gray-50 hover:border-[#E8A5A5]"
              title="Suivant"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
