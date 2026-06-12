import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  idx: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, idx }) => {
  // Favorite state backed by LocalStorage
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem('art_table_favorites');
      if (savedFavs) {
        const parsed = JSON.parse(savedFavs) as string[];
        setIsFavorite(parsed.includes(product.id));
      }
    } catch (e) {
      console.error(e);
    }
  }, [product.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card click
    try {
      const savedFavs = localStorage.getItem('art_table_favorites');
      let parsed: string[] = [];
      if (savedFavs) {
        parsed = JSON.parse(savedFavs) as string[];
      }
      if (parsed.includes(product.id)) {
        parsed = parsed.filter(id => id !== product.id);
        setIsFavorite(false);
      } else {
        parsed.push(product.id);
        setIsFavorite(true);
      }
      localStorage.setItem('art_table_favorites', JSON.stringify(parsed));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      id={`product-card-${product.id}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ 
        delay: idx * 0.03, 
        duration: 0.4, 
        ease: "easeOut" 
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-stone-100 flex flex-col justify-between relative shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* 1. PRODUCT PHOTO ZONE */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#FAF6F6] flex items-center justify-center">
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600'}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Soft elegant overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 pointer-events-none" />

        {/* 2. MINIMALIST BADGE "PERSONNALISABLE" & STOCK DETAILS */}
        {product.isCustomizable && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-[#E8A5A5] text-white text-[8px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-md shadow-sm">
              Personnalisable
            </div>
          </div>
        )}

        {/* Min Qty indicator badge bottom right */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-mono tracking-wider text-stone-600 border border-stone-100">
          Min. {product.minQty} pcs
        </div>
      </div>

      {/* 3. CARD INFORMATION ZONE */}
      <div className="p-4 flex-grow flex flex-col justify-between text-left">
        
        <div className="space-y-1">
          {/* Category */}
          <p className="text-[9px] font-mono uppercase tracking-widest text-[#C08A8A]">
            {product.category.replace(/-/g, ' ')}
          </p>

          {/* Product Name */}
          <h3 className="font-serif text-sm font-medium text-stone-900 group-hover:text-[#E8A5A5] transition-colors leading-tight line-clamp-2 min-h-[36px]">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-[11px] text-stone-500 font-light leading-relaxed line-clamp-1">
            {product.description}
          </p>
        </div>

        {/* 4. BUTTONS BAR */}
        <div className="mt-3 pt-3 border-t border-stone-50 flex flex-col space-y-2 mt-auto">
          
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-mono tracking-wider text-stone-400">PRIX DE RÉFÉRENCE</span>
            <span className="text-stone-900 font-serif text-xs font-semibold">
              {product.price.toLocaleString()} <span className="text-[8px] font-sans font-normal text-stone-500">FCFA</span>
            </span>
          </div>

          <div className="grid grid-cols-12 gap-2" onClick={(e) => e.stopPropagation()}>
            {/* ♡ Favoris Button */}
            <button
              id={`fav-btn-${product.id}`}
              onClick={toggleFavorite}
              className={`col-span-4 flex items-center justify-center py-2.5 rounded-lg border transition-colors ${
                isFavorite 
                  ? 'bg-[#FAF0F0] border-[#E8A5A5] text-[#C08A8A]' 
                  : 'bg-white border-stone-100 text-stone-400 hover:text-[#C08A8A] hover:bg-stone-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#C08A8A]' : ''}`} />
            </button>

            {/* Commencer devis Button */}
            <button
              id={`quote-btn-${product.id}`}
              onClick={onClick}
              className="col-span-8 flex items-center justify-center space-x-1 py-2.5 rounded-lg text-[10px] uppercase font-semibold tracking-wider bg-[#1A1A1A] hover:bg-[#E8A5A5] text-white transition-colors cursor-pointer"
            >
              <span>Personnaliser</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  );
};
