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
      className={`group relative flex h-full transform-gpu cursor-pointer flex-col overflow-hidden rounded-[0.5rem] border bg-white shadow-sm transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(166,124,82,0.08)] product-card-animate ${
        isSelected ? 'border-[#A67C52]/35 ring-1 ring-[#A67C52]/20 shadow-[0_18px_45px_rgba(166,124,82,0.12)]' : 'border-white/80'
      }`}
      style={{ animationDelay: `${idx * 0.03}s` }}
    >
      {/* 1. IMAGE */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#FAF6F6] sm:aspect-square">
        <img
          src={productImage}
          alt={productName}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="absolute inset-0 h-full w-full transform-gpu object-contain p-3 transition-transform duration-300 ease-out group-hover:scale-[1.02] sm:p-4"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/6 pointer-events-none" />

        <button
          id={`quick-add-btn-${product.id}`}
          onClick={handleQuickAdd}
          className="absolute bottom-3 right-3 z-20 hidden h-11 w-11 items-center justify-center rounded-full border border-[#A67C52]/25 bg-white text-[#8C6845] shadow-[0_12px_25px_rgba(140,104,69,0.16)] transition-[transform,opacity,background-color,border-color] duration-200 ease-out hover:border-[#8C6845] hover:bg-[#FFF9F4] md:inline-flex md:translate-y-4 md:opacity-0 md:pointer-events-none md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-hover:pointer-events-auto"
          aria-label={`Ajouter ${productName} au panier`}
        >
          <ShoppingCart className="h-5 w-5" />
        </button>
      </div>

      {/* 2. INFO ZONE */}
      <div className="flex min-h-[5.5rem] flex-none flex-col p-3.5 text-center sm:min-h-[6rem] sm:p-4">
        <div className="flex h-full flex-col items-center gap-2">
          <h3
            className="product-card-title min-w-0 max-w-full font-sans text-[0.98rem] font-semibold leading-[1.2] text-[#2A1B13] transition-colors group-hover:text-[#8C6845] sm:text-[1.05rem]"
            title={productName}
          >
            {productName}
          </h3>

          <div className="mt-auto flex w-full items-end justify-center gap-3">
            <div className="min-w-0 text-center">
              <span className="block text-[8px] sm:text-[9px] font-sans uppercase tracking-[0.2em] text-[#8B6C52]">Prix</span>
              <span className="mt-1 block whitespace-nowrap font-sans text-[1rem] sm:text-[1.12rem] leading-none font-semibold text-[#8C6845]">
              {productPrice.toLocaleString()} <span className="text-[0.72em] font-sans font-medium tracking-[0.16em] text-[#A98B72]">FCFA</span>
              </span>
            </div>

            <button
              onClick={handleQuickAdd}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#A67C52]/14 bg-[#FFF9F4] text-[#8C6845] shadow-sm transition hover:bg-[#FFF4EA] md:hidden"
              aria-label={`Ajouter ${productName} au panier`}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
