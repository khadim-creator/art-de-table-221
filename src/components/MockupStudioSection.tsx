import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductMockup } from './ProductMockups';
import { 
  Sparkles, Check, FileText, ArrowRight, Clock, Box, ShoppingBag, Gift,
  PenTool, Palette, Type, HelpCircle, Star, Award
} from 'lucide-react';

export const MockupStudioSection: React.FC = () => {
  const { products, categories, setSelectedProduct, setView } = useApp();

  // Selected Category slug inside the Mockup Studio
  const studioCategories = useMemo(() => {
    return [
      { slug: 'evenementiel', name: 'Événementiel 🎀', desc: 'Sacs & boîtages d\'apparats' },
      { slug: 'bouteilles-personnalisees', name: 'Bouteilles Personnalisées 🍾', desc: 'Écrins de jus précieux' },
      { slug: 'parfumerie-cosmetique', name: 'Cosmétique & Parfum 💄', desc: 'Pots de crèmes & flacons' },
      { slug: 'articles-personnalises', name: 'Support Publicitaire 📢', desc: 'Goodies, mugs & carnets' },
      { slug: 'packaging-cadeaux', name: 'Packaging Cadeaux 🎗️', desc: 'Rubans satinés & coffrets' }
    ];
  }, []);

  const [activeTab, setActiveTab] = useState(studioCategories[0].slug);

  // Filter products for the active tab
  const tabProducts = useMemo(() => {
    const targetTab = activeTab.toLowerCase().trim().replace(/-/g, '');
    return products.filter(p => {
      if (!p.category) return false;
      return p.category.toLowerCase().trim().replace(/-/g, '') === targetTab;
    });
  }, [products, activeTab]);

  // Active product inside the preview zone
  const [activeProductId, setActiveProductId] = useState<string>('');

  // Fallback if none or category changes
  const selectedProduct = useMemo(() => {
    const found = tabProducts.find(p => p.id === activeProductId);
    if (found) return found;
    if (tabProducts.length > 0) return tabProducts[0];
    return null;
  }, [tabProducts, activeProductId]);

  // Text customization simulation state
  const [customText, setCustomText] = useState('Mame & Diop');
  const [selectedVibe, setSelectedVibe] = useState('Symphonie Rose');
  const [quantity, setQuantity] = useState<number>(100);

  const handleProductSelect = (id: string) => {
    setActiveProductId(id);
  };

  const handleLaunchQuote = () => {
    if (!selectedProduct) return;
    setSelectedProduct(selectedProduct.id);
    setView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-gradient-to-br from-[#FAF9F9] via-[#FFFFFF] to-[#FFF5F7] border-t border-b border-pink-100/30 relative overflow-hidden">
      
      {/* Background ambient vector blurs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#F2A7BB]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#8B3A52]/10 to-[#C9A84C]/10 px-4 py-1.5 rounded-full border border-pink-100/40">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C] animate-pulse" />
            <span className="font-mono text-[9px] tracking-[0.25em] text-[#8B3A52] uppercase font-bold">
              Atelier Maquettes Interactives 3D
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl sm:text-5xl font-serif font-black text-[#8B3A52] tracking-tight">
            Studio Numérique de Personnalisation
          </h2>
          <div className="h-0.5 w-24 bg-gradient-to-r from-[#F2A7BB] via-[#C9A84C] to-[#8B3A52] mx-auto rounded" />
          <p className="text-sm md:text-base text-gray-500 font-light leading-relaxed max-w-2xl mx-auto">
            Visualisez instantanément nos 36 catégories de packagings de luxe avec des maquettes vectorielles d'une précision chirurgicale, façonnées sous l'identité prestigieuse d'Art de Table. Modifiez et projetez vos envies.
          </p>
        </div>

        {/* Categories Tab Navigation */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2 scrollbar-none">
          <div className="bg-white p-1.5 rounded-full shadow-md border border-[#FAF7F5] flex space-x-1 whitespace-nowrap">
            {studioCategories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => {
                  setActiveTab(cat.slug);
                  // Reset select state for new tab
                  setActiveProductId('');
                }}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === cat.slug
                    ? 'bg-[#8B3A52] text-white shadow-md'
                    : 'text-gray-500 hover:text-[#8B3A52] hover:bg-pink-50/50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main interactive grid */}
        {selectedProduct && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* COLUMN LEFT: Thumbnail List (3 Cols on large screens) */}
            <div className="lg:col-span-3 flex flex-col justify-start space-y-3 order-2 lg:order-1">
              <div className="text-left mb-2 pl-1">
                <h4 className="text-[10px] font-mono tracking-widest uppercase text-gray-400 font-bold">
                  CONTENANTS & ACCESSOIRES ({tabProducts.length})
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-pink-100">
                {tabProducts.map((prod) => {
                  const isCur = prod.id === selectedProduct.id;
                  return (
                    <button
                      key={prod.id}
                      onClick={() => handleProductSelect(prod.id)}
                      className={`group p-3 rounded-2xl border text-left flex items-center space-x-3 transition-all duration-300 ${
                        isCur
                          ? 'bg-gradient-to-r from-pink-50/60 to-white border-[#C9A84C] shadow-md ring-1 ring-[#C9A84C]/30'
                          : 'bg-white border-gray-100 hover:border-[#F2A7BB] hover:shadow-sm'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 bg-[#FFF5F7] shrink-0">
                        <ProductMockup productId={prod.id} className="w-full h-full transform group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className={`text-xs font-serif font-black ${isCur ? 'text-[#8B3A52]' : 'text-[#2D2D2D]'} truncate leading-snug`}>
                          {prod.name}
                        </h5>
                        <p className="text-[9px] text-gray-400 truncate mt-0.5">
                          Min. {prod.minQty} pcs • {prod.productionDelay}
                        </p>
                      </div>
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isCur ? 'bg-[#C9A84C] scale-125' : 'bg-transparent'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COLUMN CENTER: The Live 3D Vector Viewer (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col order-1 lg:order-2">
              <div className="bg-white rounded-[2rem] border border-[#FAF7F5] p-5 shadow-lg flex-grow flex flex-col justify-between relative overflow-hidden" 
                   style={{
                     backgroundImage: 'radial-gradient(rgba(139, 58, 82, 0.02) 1.5px, transparent 1.5px)',
                     backgroundSize: '16px 16px'
                   }}>
                
                {/* Vintage Frame borders */}
                <div className="absolute inset-4 pointer-events-none border border-[#C9A84C]/10 rounded-[1.5rem]" />

                {/* Top status bar */}
                <div className="flex justify-between items-center z-10 px-2 py-1">
                  <span className="font-mono text-[9px] tracking-widest text-[#C9A84C] uppercase font-bold flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Live Render</span>
                  </span>
                  
                  <span className="bg-[#FAF7F5] px-2.5 py-0.5 rounded-md text-[8px] font-mono tracking-wider text-gray-400">
                    ID: {selectedProduct.id.split('-').slice(-2).join('_').toUpperCase()}
                  </span>
                </div>

                {/* Big Interactive Mockup Render Canvas */}
                <div className="my-6 aspect-square w-full max-w-[290px] mx-auto rounded-[1.5rem] bg-gradient-to-br from-pink-50/15 via-[#FFFFFF] to-rose-50/5 p-4 flex items-center justify-center relative shadow-inner group border border-dashed border-gray-100">
                  <div className="w-full h-full transform transition-all duration-750 group-hover:scale-105 group-hover:rotate-y-3">
                    <ProductMockup productId={selectedProduct.id} className="w-full h-full" />
                  </div>

                  {/* Watermark brand text overlay */}
                  <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-[8px] font-mono tracking-widest text-gray-400 pointer-events-none opacity-50">
                    <span>© ART DE TABLE</span>
                    <span>DAKAR LABS</span>
                  </div>
                </div>

                {/* Simulated Custom Ribbon overlay badge matching input */}
                <div className="bg-gradient-to-r from-[#FFF5F7] to-[#FAF7F5] rounded-2xl p-4 border border-[#F2A7BB]/10 text-center">
                  <span className="font-sans text-[10px] font-bold text-[#8B3A52] tracking-wide inline-block mb-1">
                    📖 Simulation d'Ennoblis
                  </span>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Type className="w-3.5 h-3.5 text-[#C9A84C]" />
                      <span className="text-[10px] font-mono text-gray-500 truncate max-w-[120px]">
                        "{customText || 'Aucun texte'}"
                      </span>
                    </div>
                    <div className="w-px h-3 bg-gray-200" />
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full border border-gray-100" style={{
                        backgroundColor: 
                          selectedVibe === 'Symphonie Rose' ? '#F2A7BB' : 
                          selectedVibe === 'Opéra Bordeaux' ? '#8B3A52' : '#C9A84C'
                      }} />
                      <span className="text-[10px] font-sans text-gray-500 font-medium">
                        {selectedVibe}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* COLUMN RIGHT: Interactive Control and Information (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-6 order-3">
              
              <div className="bg-white rounded-[2rem] border border-[#FAF7F5] p-6 shadow-md text-left flex-grow flex flex-col justify-between space-y-6">
                
                {/* Meta Header */}
                <div className="space-y-2">
                  <span className="text-[10px] font-serif italic text-[#C9A84C] block">
                    Collection de Luxe d'Afrique de l'Ouest
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#8B3A52] tracking-tight leading-snug">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Interactive Customizer controls */}
                <div className="pt-4 border-t border-gray-50 space-y-4">
                  
                  {/* Text Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-450 text-gray-400 font-bold block">
                      Saisir le texte ou monogramme (Ex : prénoms)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={24}
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="Ex: Mame & Diop, Baptême..."
                        className="w-full px-3 py-2 bg-[#FAF7F5] rounded-xl text-xs sm:text-sm border border-transparent focus:border-[#F2A7BB] focus:bg-white outline-none transition"
                      />
                      <PenTool className="w-3.5 h-3.5 text-[#C9A84C] absolute right-3.5 top-3" />
                    </div>
                  </div>

                  {/* Harmony Theme selection */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-450 text-gray-400 font-bold block">
                      Palette d'harmonie du marquage
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { name: 'Symphonie Rose', color: '#F2A7BB', border: 'border-[#F2A7BB]/30' },
                        { name: 'Opéra Bordeaux', color: '#8B3A52', border: 'border-[#8B3A52]/30' },
                        { name: 'Éclat Doré', color: '#C9A84C', border: 'border-[#C9A84C]/30' }
                      ].map((vibe) => (
                        <button
                          key={vibe.name}
                          onClick={() => setSelectedVibe(vibe.name)}
                          className={`p-2 rounded-xl border text-[9px] font-sans font-semibold transition-all flex flex-col items-center gap-1.5 ${
                            selectedVibe === vibe.name
                              ? 'bg-gradient-to-b from-pink-50/50 to-white ring-1 ring-[#C9A84C] border-transparent font-bold text-[#8B3A52]'
                              : 'bg-[#FAF7F5] border-transparent text-gray-500 hover:bg-gray-100/50'
                          }`}
                        >
                          <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: vibe.color }} />
                          <span>{vibe.name.split(' ')[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold">
                      <span>Quantité souhaitée</span>
                      <span className="text-[#8B3A52] font-sans font-bold">{quantity} pièces</span>
                    </div>
                    <input
                      type="range"
                      min={selectedProduct.minQty}
                      max={1200}
                      step={50}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full accent-[#8B3A52] cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] text-gray-400 font-mono">
                      <span>Min. {selectedProduct.minQty} pcs</span>
                      <span>1200+ pcs</span>
                    </div>
                  </div>

                </div>

                {/* Key Product specs */}
                <div className="pt-4 border-t border-gray-50 grid grid-cols-2 gap-4">
                  <div className="flex items-start space-x-2 text-left">
                    <Clock className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9px] font-mono uppercase tracking-wider text-gray-400 leading-none">PRÉPARATION</p>
                      <p className="text-xs font-semibold text-gray-700 mt-0.5">{selectedProduct.productionDelay}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 text-left">
                    <Box className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9px] font-mono uppercase tracking-wider text-gray-400 leading-none">PRIX ESTIMÉ</p>
                      <p className="text-xs font-serif font-bold text-[#8B3A52] mt-0.5">
                        {(selectedProduct.price * quantity).toLocaleString()} <span className="text-[9px] font-sans font-normal text-gray-500">FCFA</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Primary Button action */}
                <button
                  id="studio-customize-action-btn"
                  onClick={handleLaunchQuote}
                  className="w-full py-3.5 bg-[#8B3A52] border border-[#8B3A52] text-white hover:bg-[#C9A84C] hover:border-[#C9A84C] shadow-lg rounded-2xl text-xs sm:text-sm font-semibold tracking-wider uppercase transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Palette className="w-4 h-4" />
                  <span>Personnaliser & Commander</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>

              {/* Delivery Trust Badges */}
              <div className="bg-white/50 backdrop-blur border border-[#FAF7F5] rounded-2xl p-4 flex items-center justify-around text-center gap-3">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-[#C9A84C]" />
                  <span className="text-[10px] font-sans font-bold text-[#2D2D2D] uppercase tracking-wide">Impression d'Art Aligné</span>
                </div>
                <div className="w-px h-4 bg-gray-200" />
                <div className="flex items-center space-x-2">
                  <span className="text-xs">🇸🇳</span>
                  <span className="text-[10px] font-sans font-bold text-[#2D2D2D] uppercase tracking-wide">Dakar & Régions</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
