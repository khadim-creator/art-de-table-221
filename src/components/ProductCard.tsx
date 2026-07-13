import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  idx: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, idx }) => {
  const { addToCart, selectedProductId } = useApp();
  const productPrice = Number.isFinite(product.price) ? product.price : 0;
  const minQty = Number.isFinite(product.minQty) ? product.minQty : 1;
  const productName = product.name || 'Produit';
  const productImage = Array.isArray(product.images) && product.images[0]
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600';
  const isSelected = selectedProductId === product.id;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, minQty, '', '', product.price);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={onClick}
      className={`group relative flex h-full transform-gpu cursor-pointer flex-col overflow-hidden rounded-[1.5rem] border bg-white shadow-sm transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(166,124,82,0.08)] ${
        isSelected ? 'border-[#A67C52]/35 ring-1 ring-[#A67C52]/20 shadow-[0_18px_45px_rgba(166,124,82,0.12)]' : 'border-white/80'
      }`}
    >
      {/* 1. IMAGE */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#FAF6F6]">
        <img
          src={productImage}
          alt={productName}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="absolute inset-0 h-full w-full transform-gpu object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/6 pointer-events-none" />

        {/* Min Qty badge */}
        <div className="absolute bottom-2 right-2 bg-white/92 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-mono tracking-wider text-[#8C6845] border border-[#A67C52]/10">
          Min. {minQty} pcs
        </div>

        <button
          id={`quick-add-btn-${product.id}`}
          onClick={handleQuickAdd}
          className="absolute inset-x-3 bottom-3 z-20 btn-primary h-11 px-4 text-[10px] uppercase tracking-[0.18em] whitespace-nowrap shadow-[0_12px_25px_rgba(140,104,69,0.18)] opacity-0 translate-y-4 pointer-events-none transition-[transform,opacity] duration-200 ease-out md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:pointer-events-auto"
        >
          <ShoppingCart className="icon-sm" />
          <span>Ajouter au panier</span>
        </button>
      </div>

      {/* 2. INFO ZONE */}
      <div className="flex h-[6.1rem] flex-none flex-col justify-between p-4 text-left sm:h-[6.4rem] sm:p-5">
        <div className="flex h-full flex-col justify-center gap-1">
          <h3
            className="min-w-0 truncate font-display italic text-[1.08rem] sm:text-[1.15rem] font-semibold leading-[1.05] tracking-[-0.02em] text-[#2A1B13] transition-colors group-hover:text-[#8C6845]"
            title={productName}
          >
            {productName}
          </h3>

          <div className="shrink-0">
            <span className="block text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.2em] text-[#8B6C52]">Prix</span>
            <span className="block whitespace-nowrap font-display italic text-[1.08rem] sm:text-[1.15rem] leading-none font-semibold text-[#8C6845]">
              {productPrice.toLocaleString()} <span className="text-[0.72em] font-sans font-medium tracking-[0.16em] text-[#A98B72]">FCFA</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
