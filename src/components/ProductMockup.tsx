import React from 'react';
import { productsData } from '../lib/productsData';
import { InteractiveMockupRenderer } from './InteractiveMockupRenderer';

interface ProductMockupProps {
  productId: string;
  className?: string;
  isDetailed?: boolean;
}

const genericToProductMap: Record<string, string> = {
  kraft_rose: 'sac-marbre-prestige',
  mini_white: 'mini-beignets-honneur',
  marble: 'sac-marbre-prestige',
  transparent: 'boite-beignet-crystal',
  tote: 'sac-marbre-prestige',
  water: 'bouteille-eau-perso',
  glass_juice: 'bouteille-jus-verre',
  plastic_juice: 'bouteille-jus-verre',
  large_label: 'bouteille-jus-verre',
  small_label: 'bouteille-jus-verre',
  stickers_sheet: 'etiquette-boisson-waterproof',
  pot_soap: 'pot-creme-or-poudre',
  cosmetic_jar: 'pot-creme-or-poudre',
  pump_bottle: 'flacon-spray-elegant',
  cosmetic_box: 'boite-cosmetique-luxueuse',
  perfume_box: 'boite-cosmetique-luxueuse',
  cylinders: 'pot-creme-or-poudre',
  perforated: 'sticker-dorure-or',
  business: 'carte-visite-prestige-dorure',
  flyer: 'faire-part-prestige-or',
  selfie_frame: 'faire-part-prestige-or',
  mug: 'mug-celadon-prestige',
  mousepad: 'carnet-signature-cuir',
  goodies_flatlay: 'coffret-signature-vip',
  textile_tshirt: 'textile-casquette-polo-perso',
  stamp: 'sticker-dorure-or',
  accessories_grid: 'etiquette-boisson-waterproof',
  sharpie: 'sticker-dorure-or',
  silk_paper: 'papier-soie-luxueux',
  rolls_fan: 'ruban-satin-imp',
  grosgrain: 'ruban-satin-imp',
  loose_coils: 'ruban-satin-imp',
};

export const ProductMockup: React.FC<ProductMockupProps> = ({ productId, className = "w-full h-full", isDetailed = false }) => {
  const resolvedId = genericToProductMap[productId] || productId;
  const product = productsData.find(p => p.id === resolvedId);

  // Determine mockup type based on categories & id patterns
  const getMockupType = (): string => {
    const id = (resolvedId || '').toLowerCase();
    const cat = (product?.category || '').toLowerCase();

    if (id.includes('sac') || id.includes('tote') || cat.includes('boutique')) return 'sac';
    if (id.includes('bouteille') || id.includes('eau') || id.includes('jus') || cat.includes('boissons') || cat.includes('bouteilles')) return 'bouteille';
    if (id.includes('pot') || id.includes('flacon') || id.includes('cream') || id.includes('savon') || cat.includes('cosmetique')) return 'pot';
    if (id.includes('ruban') || id.includes('satin')) return 'ruban';
    if (id.includes('mug') || id.includes('gobelet')) return 'mug';
    if (id.includes('carte') || id.includes('flyer') || id.includes('etiquette') || id.includes('sticker') || cat.includes('stickers') || cat.includes('impression')) return 'carte';
    if (id.includes('cristal') || id.includes('transparent') || id.includes('dragee') || id.includes('beignet')) return 'boite-transparent';
    return 'boite'; // Default box shape
  };

  const getProductColor = (): string => {
    const id = (resolvedId || '').toLowerCase();
    if (id.includes('rose') || id.includes('marbre') || id.includes('dragee')) return '#FDF1F1'; // Soft luxury rose
    if (id.includes('kraft')) return '#D2B48C'; // Kraft light brown
    if (id.includes('or') || id.includes('prestige') || id.includes('elite')) return '#E5C158'; // Gold
    if (id.includes('dark') || id.includes('noir') || id.includes('vip')) return '#1C1C1C'; // Velvet Black
    return '#FFFFFF'; // Clean slate white
  };

  const getSecondaryColor = (): string => {
    const id = (resolvedId || '').toLowerCase();
    if (id.includes('dark') || id.includes('noir')) return '#C9A84C'; // gold ribbon on black
    return '#E5C158'; // gold thread/handles
  };

  return (
    <div className={`relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#FAF8F8] to-[#FCF4F5] p-3 rounded-2xl ${className}`}>
      <InteractiveMockupRenderer 
        type={getMockupType()}
        color={getProductColor()}
        secondaryColor={getSecondaryColor()}
        text={product?.name ? product.name.split(' ')[0] + ' Elegant' : 'ART DE TABLE'}
        textColor="#1E1E1E"
        textSize={9}
      />
    </div>
  );
};
