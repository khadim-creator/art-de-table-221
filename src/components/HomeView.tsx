import React from 'react';
import { Hero } from './Hero';
import { FeaturedProducts } from './FeaturedProducts';

export const HomeView: React.FC = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeaturedProducts />
    </main>
  );
};
