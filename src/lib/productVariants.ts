export type VariantTone = {
  name: string;
  color: string;
  label: string;
  isMulti?: boolean;
};

export const ALL_COLORS_VARIANT: VariantTone = {
  name: 'Toutes les couleurs',
  color: 'conic-gradient(from 0deg, #E8A8B7, #C9A84C, #8DBFD3, #C8A97E, #8B3A52, #E8A8B7)',
  label: 'Toutes les couleurs',
  isMulti: true,
};

export const DEFAULT_VARIANTS: VariantTone[] = [
  { name: 'Kraft', color: '#C8A97E', label: 'Kraft' },
  { name: 'Rose', color: '#E8A8B7', label: 'Rose' },
  { name: 'Doré', color: '#C9A84C', label: 'Doré' },
];

export const CATEGORY_VARIANTS: Record<string, VariantTone[]> = {
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
  'gobelets-emballages-boissons': [
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

export const getProductVariants = (category: string): VariantTone[] => {
  const base = CATEGORY_VARIANTS[category] || DEFAULT_VARIANTS;
  return [...base, ALL_COLORS_VARIANT];
};
