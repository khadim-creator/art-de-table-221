import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

type VariantTone = {
  name: string;
  color: string;
  label: string;
};

const DEFAULT_VARIANTS: VariantTone[] = [
  { name: 'Kraft', color: '#C8A97E', label: 'Kraft' },
  { name: 'Rose', color: '#E8A8B7', label: 'Rose' },
  { name: 'Doré', color: '#C9A84C', label: 'Doré' },
];

const CATEGORY_VARIANTS: Record<string, VariantTone[]> = {
  'sacs-emballages-boutique': [
    { name: 'Kraft', color: '#C8A97E', label: 'Kraft' },
    { name: 'Ivoire', color: '#F1E2D2', label: 'Ivoire' },
    { name: 'Bordeaux', color: '#8C6845', label: 'Bordeaux' },
  ],
  'emballages-alimentaires': [
    { name: 'Kraft', color: '#C8A97E', label: 'Kraft' },
    { name: 'Crème', color: '#F2E6D8', label: 'Crème' },
    { name: 'Chocolat', color: '#5B4638', label: 'Chocolat' },
  ],
  'gobelets-boissons': [
    { name: 'Bleu', color: '#8DBFD3', label: 'Bleu' },
    { name: 'Rose', color: '#E8A8B7', label: 'Rose' },
    { name: 'Doré', color: '#D6B35A', label: 'Doré' },
  ],
  'fast-food-restauration': [
    { name: 'Kraft', color: '#C8A97E', label: 'Kraft' },
    { name: 'Blanc', color: '#F3F1EC', label: 'Blanc' },
    { name: 'Noir', color: '#3F342E', label: 'Noir' },
  ],
  'parfumerie-cosmetique': [
    { name: 'Poudré', color: '#D8B4C0', label: 'Poudré' },
    { name: 'Or pâle', color: '#C9A84C', label: 'Or pâle' },
    { name: 'Ivoire', color: '#F5EADF', label: 'Ivoire' },
  ],
  'solutions-impression': [
    { name: 'Blanc', color: '#FFFFFF', label: 'Blanc' },
    { name: 'Anthracite', color: '#4A4A4A', label: 'Anthracite' },
    { name: 'Doré', color: '#D0A84B', label: 'Doré' },
  ],
  'articles-personnalises': [
    { name: 'Rose', color: '#E7A1B4', label: 'Rose' },
    { name: 'Bordeaux', color: '#8B3A52', label: 'Bordeaux' },
    { name: 'Doré', color: '#C9A84C', label: 'Doré' },
  ],
  'packaging-cadeaux': [
    { name: 'Rose poudré', color: '#E8B7C5', label: 'Rose poudré' },
    { name: 'Ivoire', color: '#F2E7DC', label: 'Ivoire' },
    { name: 'Doré', color: '#C9A84C', label: 'Doré' },
  ],
  'evenementiel': [
    { name: 'Rose', color: '#E8A8B7', label: 'Rose' },
    { name: 'Doré', color: '#C9A84C', label: 'Doré' },
    { name: 'Bordeaux', color: '#8B3A52', label: 'Bordeaux' },
  ],
  'solutions-entreprises': [
    { name: 'Bleu nuit', color: '#465A7B', label: 'Bleu nuit' },
    { name: 'Doré', color: '#C9A84C', label: 'Doré' },
    { name: 'Blanc', color: '#F4EFE7', label: 'Blanc' },
  ],
};

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
  const colorVariants = CATEGORY_VARIANTS[product.category] || DEFAULT_VARIANTS;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, minQty, '', '', product.price);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={onClick}
      className={`group relative flex h-full transform-gpu cursor-pointer flex-col overflow-hidden rounded-[0.5rem] border bg-white shadow-sm transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(166,124,82,0.08)] ${
        isSelected ? 'border-[#A67C52]/35 ring-1 ring-[#A67C52]/20 shadow-[0_18px_45px_rgba(166,124,82,0.12)]' : 'border-white/80'
      }`}
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

        {/* Min Qty badge */}
        <div className="absolute bottom-2 right-2 rounded-full border border-[#A67C52]/10 bg-white/92 px-2.5 py-1 text-[9px] font-sans font-semibold tracking-wide text-[#8C6845] backdrop-blur-sm">
          Min. {minQty} pcs
        </div>

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
      <div className="flex min-h-[7.4rem] flex-none flex-col p-3.5 text-center sm:min-h-[7.9rem] sm:p-4">
        <div className="flex h-full flex-col items-center gap-2">
          <h3
            className="product-card-title min-w-0 max-w-full font-sans text-[0.98rem] font-semibold leading-[1.2] text-[#2A1B13] transition-colors group-hover:text-[#8C6845] sm:text-[1.05rem]"
            title={productName}
          >
            {productName}
          </h3>

          <div className="flex flex-col items-center gap-1">
            <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#8B6C52]">
              Variantes
            </span>
            <div className="flex items-center justify-center gap-1.5">
              {colorVariants.map((variant) => (
                <span
                  key={variant.name}
                  className="h-3.5 w-3.5 rounded-full border border-white shadow-[0_0_0_1px_rgba(166,124,82,0.18)]"
                  style={{ backgroundColor: variant.color }}
                  title={variant.label}
                  aria-label={variant.label}
                />
              ))}
            </div>
          </div>

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
