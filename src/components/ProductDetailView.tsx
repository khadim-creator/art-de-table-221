import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Upload, ArrowLeft, MessageCircle, Pipette } from 'lucide-react';
import { ProductCard } from './ProductCard';

const COLOR_SWATCHES = [
  { name: 'Blanc', hex: '#FFFFFF' },
  { name: 'Noir', hex: '#1C1C1C' },
  { name: 'Rose', hex: '#FDF1F1' },
  { name: 'Or', hex: '#E5C158' },
  { name: 'Kraft', hex: '#D2B48C' },
  { name: 'Vert', hex: '#A8B196' },
  { name: 'Bleu', hex: '#1A2F4C' },
  { name: 'Bourgogne', hex: '#7A1C2E' },
];

export const ProductDetailView: React.FC = () => {
  const { selectedProductId, products, addToCart, setSelectedProduct, setView } = useApp();
  
  const product = useMemo(() => products.find(p => p.id === selectedProductId), [products, selectedProductId]);
  
  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);
  }, [products, product]);

  const [galleryIndex, setGalleryIndex] = useState(0);
  const [qty, setQty] = useState(product?.minQty || 1);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [colorInput, setColorInput] = useState('#FFFFFF');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [customText, setCustomText] = useState('');

  useEffect(() => {
    setGalleryIndex(0);
    setQty(product?.minQty || 1);
    setSelectedColor('#FFFFFF');
    setColorInput('#FFFFFF');
    setLogoFile(null);
    setCustomText('');
  }, [product?.id, product?.minQty]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [product?.id]);

  if (!product) return null;

  const handleAddToCart = () => {
    const instructions = [
      customText.trim() ? `Texte: ${customText.trim()}` : '',
      selectedColor ? `Couleur: ${selectedColor}` : '',
    ].filter(Boolean).join(' | ');

    addToCart(product, qty, instructions, logoFile ? URL.createObjectURL(logoFile) : '', undefined);
  };

  const handleContact = () => {
    const message = [
      'DEMANDE PRODUIT - ART DE TABLE',
      '',
      `Produit: ${product.name}`,
      `Quantité: ${qty}`,
      `Couleur: ${selectedColor}`,
      customText.trim() ? `Texte: ${customText.trim()}` : null,
      logoFile ? `Logo: ${logoFile.name}` : null,
      '',
      'Je souhaite être conseillé pour cette commande.'
    ].filter(Boolean).join('\n');

    window.open(`https://wa.me/221778715875?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const handleBack = () => {
    setSelectedProduct(null);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(160deg, #FDF0F3 0%, #FFF5F7 35%, #FCE8EE 65%, #FFF2F5 100%)',
      }}
    >
      <div className="section-container py-5 md:py-8">

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-4 inline-flex items-center gap-2 text-sm text-stone-600 hover:text-[#9B2C4A] transition-colors font-medium group"
        >
          <ArrowLeft className="icon-sm group-hover:-translate-x-1 transition-transform" />
          Retour au catalogue
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[1.02fr_0.98fr] gap-6 md:gap-10">

          {/* GALERIE PHOTOS */}
          <div className="relative">
            <div className="bg-white rounded-2xl overflow-hidden aspect-square mb-3 border border-stone-100 shadow-sm">
              <img
                src={product.images?.[galleryIndex] || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800'}
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryIndex(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                      i === galleryIndex ? 'border-[#9B2C4A] shadow-sm' : 'border-gray-200 hover:border-[#9B2C4A]/40'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFOS + PERSONALISATION */}
          <div className="flex flex-col md:pl-2">

            {/* Category breadcrumb */}
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#8C6845]/70 mb-2">
              {product.category.replace(/-/g, ' ')}
            </p>

            <h1 className="text-2xl md:text-3xl font-bold text-[#1B1115] mb-2 font-serif leading-tight">
              {product.name}
            </h1>

            <div className="mb-1 text-center md:text-left">
              <p className="font-display italic text-3xl md:text-4xl font-semibold leading-none text-[#8C6845]">
                {product.price.toLocaleString()}
              </p>
              <p className="text-xs tracking-[0.22em] uppercase text-[#A98B72] mt-1">
                FCFA
              </p>
            </div>
            <p className="text-xs text-stone-500 mb-5">
              <span className="font-semibold text-stone-700">MOQ :</span> {product.minQty} unités minimum
            </p>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-stone-600 mb-5 leading-relaxed border-l-2 border-[#A67C52]/20 pl-3">
                {product.description}
              </p>
            )}

            {/* Quantité */}
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2 text-stone-800">Quantité</label>
              <div className="flex items-center border border-gray-200 rounded-xl w-fit overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setQty(Math.max(product.minQty, qty - 1))}
                  className="px-4 py-2.5 text-stone-600 hover:bg-gray-50 hover:text-[#9B2C4A] transition text-lg font-light"
                >
                  −
                </button>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(Math.max(product.minQty, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border-0 outline-none text-sm font-semibold"
                />
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-4 py-2.5 text-stone-600 hover:bg-gray-50 hover:text-[#9B2C4A] transition text-lg font-light"
                >
                  +
                </button>
              </div>
            </div>

            {/* PERSONNALISATION */}
            <div className="space-y-4 mb-6">
              
              {/* Couleur */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-stone-800">Couleur</label>
                <div className="rounded-2xl border border-[#A67C52]/14 bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="product-color-picker"
                      className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#A67C52]/18 shadow-sm"
                      style={{ backgroundColor: selectedColor }}
                      aria-label="Choisir une couleur"
                    >
                      <Pipette className="h-4 w-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]" />
                    </label>
                    <input
                      id="product-color-picker"
                      type="color"
                      value={selectedColor}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        setSelectedColor(value);
                        setColorInput(value);
                      }}
                      className="sr-only"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8C6845]">
                        Toutes les variantes
                      </span>
                      <input
                        type="text"
                        value={colorInput}
                        onChange={(e) => {
                          const value = e.target.value.trim().toUpperCase();
                          if (!/^#[0-9A-F]{0,6}$/.test(value)) return;
                          setColorInput(value);
                          if (/^#[0-9A-F]{6}$/.test(value)) setSelectedColor(value);
                        }}
                        onBlur={() => {
                          if (!/^#[0-9A-F]{6}$/.test(colorInput)) setColorInput(selectedColor);
                        }}
                        className="mt-1 h-10 w-full rounded-xl border border-stone-200 bg-[#FFF9F4] px-3 text-sm font-semibold text-[#2A1B13] outline-none transition focus:border-[#A67C52]/50 focus:ring-2 focus:ring-[#A67C52]/10"
                        aria-label="Code couleur hexadécimal"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                  {COLOR_SWATCHES.map(color => (
                    <button
                      key={color.hex}
                      onClick={() => {
                        setSelectedColor(color.hex);
                        setColorInput(color.hex);
                      }}
                        className={`h-8 w-8 rounded-full border-2 transition-all duration-150 hover:scale-105 ${
                        selectedColor === color.hex
                          ? 'border-[#9B2C4A] ring-2 ring-[#9B2C4A]/20 scale-110'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                  </div>
                </div>
              </div>

              {/* Logo */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-stone-800">Logo</label>
                <div className="border-2 border-dashed border-stone-200 rounded-xl p-5 text-center cursor-pointer hover:border-[#9B2C4A] transition group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="flex flex-col items-center cursor-pointer">
                    <Upload className="w-5 h-5 text-stone-400 group-hover:text-[#9B2C4A] mb-1.5 transition-colors" />
                    <span className="text-xs text-stone-500 group-hover:text-stone-700 transition-colors">
                      {logoFile ? logoFile.name : 'Cliquez pour uploader votre logo (PNG, SVG)'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Texte personnalisé */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-stone-800">Texte personnalisé</label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Ex: Mon Entreprise 2026"
                  className="form-input"
                />
              </div>

            </div>

            {/* BOUTONS ACTION */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                onClick={handleAddToCart}
                className="btn-primary flex-1 h-12 text-sm font-bold gap-2"
              >
                <ShoppingCart className="icon-sm" />
                Ajouter
              </button>
              <button
                onClick={handleContact}
                className="btn-secondary flex-1 h-12 text-sm font-bold gap-2"
              >
                <MessageCircle className="icon-sm" />
                Commander
              </button>
            </div>

          </div>

        </div>

        {/* PRODUITS SIMILAIRES */}
        {similarProducts.length > 0 && (
          <div className="mt-16 border-t border-[#9B2C4A]/10 pt-12">
            <h2 className="text-xl font-bold text-[#1B1115] mb-6 font-serif">Produits similaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onClick={() => {
                    setSelectedProduct(p.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  idx={0}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
