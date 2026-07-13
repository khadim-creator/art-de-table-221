const defaultBannerImage = new URL('../assets/images/category-banners/evenementiel.png', import.meta.url).href;

const bannerFiles: Record<string, string> = {
  'sacs-emballages-boutique': new URL('../assets/images/category-banners/sacs-emballages-boutique.png', import.meta.url).href,
  'emballages-alimentaires': new URL('../assets/images/category-banners/emballages-alimentaires.png', import.meta.url).href,
  'gobelets-emballages-boissons': new URL('../assets/images/category-banners/gobelets-emballages-boissons.png', import.meta.url).href,
  'bols-saladiers-pots': new URL('../assets/images/category-banners/bols-saladiers-pots.png', import.meta.url).href,
  'fast-food-restauration': new URL('../assets/images/category-banners/fast-food-restauration.png', import.meta.url).href,
  'patisserie-boulangerie': new URL('../assets/images/category-banners/patisserie-boulangerie.png', import.meta.url).href,
  'bouteilles-personnalisees': new URL('../assets/images/category-banners/bouteilles-personnalisees.png', import.meta.url).href,
  'parfumerie-cosmetique': new URL('../assets/images/category-banners/parfumerie-cosmetique.png', import.meta.url).href,
  'etiquettes-stickers': new URL('../assets/images/category-banners/etiquettes-stickers.png', import.meta.url).href,
  evenementiel: defaultBannerImage,
  'packaging-cadeaux': new URL('../assets/images/category-banners/packaging-cadeaux.png', import.meta.url).href,
  'articles-personnalises': new URL('../assets/images/category-banners/articles-personnalises.png', import.meta.url).href,
  'solutions-impression': new URL('../assets/images/category-banners/solutions-impression.png', import.meta.url).href,
  'solutions-entreprises': new URL('../assets/images/category-banners/solutions-entreprises.png', import.meta.url).href,
};

export const getCategoryBannerSrc = (categoryId: string) => {
  return bannerFiles[categoryId] || defaultBannerImage;
};
