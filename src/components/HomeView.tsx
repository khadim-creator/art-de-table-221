import React from 'react';
import { Hero } from './Hero';
import { CategorySection } from './CategorySection';
import { FeaturedProducts } from './FeaturedProducts';
import { TestimonialsSection } from './TestimonialsSection';
import { FAQSection } from './FAQSection';
import { ContactSection } from './ContactSection';

export const HomeView: React.FC = () => {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
    </main>
  );
};