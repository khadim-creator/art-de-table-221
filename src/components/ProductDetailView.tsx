import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, ShoppingCart, MessageCircle, Upload } from 'lucide-react';
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
  const { selectedProductId, products, addToCart, triggerWhatsAppOrder, setSelectedProduct } = useApp();
  
  const product = useMemo(() => products.find(p => p.id === selectedProductId), [products, selectedProductId]);
  
  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);
  }, [products, product]);

  // States
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [qty, setQty] = useState(product?.minQty || 1);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [customText, setCustomText] = useState('');

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, qty, customText, logoFile ? URL.createObjectURL(logoFile) : '', undefined);
  };

  const handleContact = () => {
    triggerWhatsAppOrder(`Intéressé par: ${product.name} - Quantité: ${qty}`);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <button onClick={() => setSelectedProduct(null)} className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-black transition">
          <ChevronLeft className="w-4 h-4" /> Retour
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

          {/* GALERIE PHOTOS */}
          <div>
            <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square mb-4">
              <img src={product.images?.[galleryIndex] || 'https://via.placeholder.com/500'} alt={product.name}
                className="w-full h-full object-cover" />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setGalleryIndex(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${i === galleryIndex ? 'border-[#C9607A]' : 'border-gray-200'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFOS + PERSONALISATION */}
          <div className="flex flex-col justify-between">

            {/* Infos basiques */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1B1115] mb-2">{product.name}</h1>
              <p className="text-lg font-bold text-[#C9607A] mb-4">
                {product.price.toLocaleString()} FCFA
              </p>
              <p className="text-sm text-gray-600 mb-6">
                <span className="font-semibold">MOQ :</span> {product.minQty} unités
              </p>

              {/* Quantité */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Quantité</label>
                <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                  <button onClick={() => setQty(Math.max(product.minQty, qty - 1))} className="px-3 py-2 text-gray-600">−</button>
                  <input type="number" value={qty} onChange={(e) => setQty(Math.max(product.minQty, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-0 outline-none" />
                  <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-gray-600">+</button>
                </div>
              </div>

              {/* PERSONNALISATION */}
              <div className="space-y-4 mb-8">
                
                {/* Couleur */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Couleur</label>
                  <div className="flex gap-2 flex-wrap">
                    {COLOR_SWATCHES.map(color => (
                      <button key={color.hex} onClick={() => setSelectedColor(color.hex)}
                        className={`w-10 h-10 rounded-full border-2 transition ${selectedColor === color.hex ? 'border-[#1B1115]' : 'border-gray-300'}`}
                        style={{ backgroundColor: color.hex }} title={color.name} />
                    ))}
                  </div>
                </div>

                {/* Logo */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Logo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#C9607A] transition">
                    <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                      className="hidden" id="logo-upload" />
                    <label htmlFor="logo-upload" className="flex flex-col items-center cursor-pointer">
                      <Upload className="w-5 h-5 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-600">{logoFile ? logoFile.name : 'Cliquez pour uploader votre logo'}</span>
                    </label>
                  </div>
                </div>

                {/* Texte personnalisé */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Texte personnalisé</label>
                  <input type="text" value={customText} onChange={(e) => setCustomText(e.target.value)} placeholder="Ex: Mon Entreprise 2026"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#C9607A]" />
                </div>

              </div>
            </div>

            {/* BOUTONS ACTION */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <button onClick={handleAddToCart}
                className="flex-1 bg-[#1B1115] hover:bg-[#C9607A] text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Ajouter au panier
              </button>
              <button onClick={handleContact}
                className="flex-1 border-2 border-[#C9607A] text-[#C9607A] hover:bg-[#C9607A] hover:text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" /> Contacter
              </button>
            </div>

          </div>

        </div>

        {/* PRODUITS SIMILAIRES */}
        {similarProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-100 pt-12">
            <h2 className="text-xl font-bold text-[#1B1115] mb-6">Produits similaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarProducts.map(p => (
                <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p.id)} idx={0} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};