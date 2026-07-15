import { Product, Category, Testimonial, Promotion } from '../types';
import { productsData } from './productsData';
import eventBannerImage from '../assets/images/event.webp';
import { getCategoryBannerSrc } from './categoryBannerImages';

const IMAGE_ACCESSOIRES = getCategoryBannerSrc('sacs-emballages-boutique');
const IMAGE_BOUTEILLES = getCategoryBannerSrc('bouteilles-personnalisees');
const IMAGE_COSMETIQUE = getCategoryBannerSrc('parfumerie-cosmetique');
const IMAGE_COMMERCIAL = getCategoryBannerSrc('solutions-entreprises');
const IMAGE_EVENT = eventBannerImage;

export const categoriesPreset: Category[] = [
  {
    id: "sacs-emballages-boutique",
    name: "Sacs & Emballages Boutique",
    slug: "sacs-emballages-boutique",
    description: "Sacs Kraft, sacs papier blanc, sacs papier luxe, sacs boutique, sacs cadeaux, sacs Crystal, pochettes cadeaux, tote bags, sacs personnalisés, sacs événementiels.",
    image: IMAGE_ACCESSOIRES,
    subcategories: [
      "Sacs Kraft",
      "Sacs papier blanc",
      "Sacs papier luxe",
      "Sacs boutique",
      "Sacs cadeaux",
      "Sacs Crystal",
      "Pochettes cadeaux",
      "Tote bags",
      "Sacs personnalisés",
      "Sacs événementiels"
    ]
  },
  {
    id: "emballages-alimentaires",
    name: "Emballages Alimentaires",
    slug: "emballages-alimentaires",
    description: "Barquettes Kraft/plastique/alu, boîtes repas, boîtes lunch, boîtes à emporter, papier kraft/cuisson/sandwich, serviettes, couverts jetables, gants.",
    image: getCategoryBannerSrc('emballages-alimentaires'),
    subcategories: [
      "Barquettes Kraft",
      "Barquettes plastiques",
      "Barquettes aluminium",
      "Barquettes avec couvercle",
      "Boîtes repas",
      "Boîtes lunch",
      "Boîtes à emporter",
      "Papier aluminium",
      "Papier film alimentaire",
      "Papier cuisson",
      "Papier kraft alimentaire",
      "Papier sandwich",
      "Papier burger",
      "Papier anti-graisse",
      "Serviettes",
      "Couverts jetables",
      "Cure-dents",
      "Gants alimentaires"
    ]
  },
  {
    id: "bols-saladiers-pots",
    name: "Bols, Saladiers & Pots",
    slug: "bols-saladiers-pots",
    description: "Bols Kraft, bols à salade, saladiers, pots à soupe, pots à glace, couvercles plats et couvercles dômes.",
    image: getCategoryBannerSrc('bols-saladiers-pots'),
    subcategories: [
      "Bols Kraft",
      "Bols à salade",
      "Saladiers",
      "Pots à soupe",
      "Pots à glace",
      "Pots alimentaires",
      "Couvercles plats",
      "Couvercles dômes"
    ]
  },
  {
    id: "fast-food-restauration",
    name: "Fast-food & Restauration",
    slug: "fast-food-restauration",
    description: "Boîtes à burger, boîtes à sandwich, boîtes à tacos, boîtes à pizza, emballages snack, emballages poulet frit.",
    image: getCategoryBannerSrc('fast-food-restauration'),
    subcategories: [
      "Boîtes à burger",
      "Boîtes à sandwich",
      "Boîtes à tacos",
      "Boîtes à pizza",
      "Emballages snack",
      "Emballages poulet frit"
    ]
  },
  {
    id: "patisserie-boulangerie",
    name: "Pâtisserie & Boulangerie",
    slug: "patisserie-boulangerie",
    description: "Boîtes à gâteaux, boîtes à cupcakes, supports à gâteaux, sachets pâtisserie, emballages pâtisserie, boîtes macarons.",
    image: getCategoryBannerSrc('patisserie-boulangerie'),
    subcategories: [
      "Boîtes à gâteaux",
      "Boîtes à cupcakes",
      "Supports à gâteaux",
      "Sachets pâtisserie",
      "Emballages pâtisserie",
      "Boîtes macarons"
    ]
  },
  {
    id: "bouteilles-personnalisees",
    name: "Bouteilles Personnalisées",
    slug: "bouteilles-personnalisees",
    description: "Bouteilles d'eau et jus personnalisées pour mariage, baptême, Magal, Gamou, anniversaire, entreprise ou formats sur-mesure.",
    image: IMAGE_BOUTEILLES,
    subcategories: [
      "Mariage",
      "Baptême",
      "Magal",
      "Gamou",
      "Anniversaire",
      "Entreprise",
      "Formats standards",
      "Formats sur mesure",
      "Étiquettes boissons",
      "Étiquettes bouteilles"
    ]
  },
  {
    id: "parfumerie-cosmetique",
    name: "Parfumerie & Cosmétique",
    slug: "parfumerie-cosmetique",
    description: "Flacons 30 ml à 500 ml avec spray/pompe/brume, roll-on, pots de crème/beurre/gommage, boîtes et étiquettes cosmétiques.",
    image: IMAGE_COSMETIQUE,
    subcategories: [
      "Flacons 30 ml",
      "Flacons 50 ml",
      "Flacons 100 ml",
      "Flacons 250 ml",
      "Flacons 500 ml",
      "Spray",
      "Pompe",
      "Brume",
      "Roll-on",
      "Pots de crème",
      "Pots de beurre corporel",
      "Pots de gommage",
      "Boîtes cosmétiques",
      "Étiquettes cosmétiques"
    ]
  },
  {
    id: "etiquettes-stickers",
    name: "Étiquettes & Stickers",
    slug: "etiquettes-stickers",
    description: "Étiquettes pour alimentation, boissons, cosmétiques, parfums, stickers personnalisés pro, autocollants et stickers logo.",
    image: IMAGE_COMMERCIAL,
    subcategories: [
      "Alimentaires",
      "Boissons",
      "Cosmétiques",
      "Parfums",
      "Stickers personnalisés",
      "Autocollants professionnels",
      "Stickers vitrine",
      "Stickers logo"
    ]
  },
  {
    id: "evenementiel",
    name: "Événementiel",
    slug: "evenementiel",
    description: "Étiquettes, bouteilles personnalisées et packaging raffiné pour vos mariages, baptêmes, Magal et anniversaires.",
    image: IMAGE_EVENT,
    subcategories: [
      "Étiquettes mariage",
      "Bouteilles personnalisées mariage",
      "Cadeaux invités mariage",
      "Mugs personnalisés mariage",
      "Sacs personnalisés mariage",
      "Étiquettes baptême",
      "Cadeaux invités baptême",
      "Packaging baptême",
      "Étiquettes personnalisées Magal",
      "Bouteilles personnalisées Magal",
      "Packaging religieux",
      "Étiquettes anniversaire",
      "Cadeaux personnalisés",
      "Packaging anniversaire"
    ]
  },
  {
    id: "packaging-cadeaux",
    name: "Packaging Cadeaux",
    slug: "packaging-cadeaux",
    description: "Coffrets cadeaux, boîtes cadeaux, rubans satin/gros-grain personnalisés, papier cadeau et pochettes cadeaux.",
    image: IMAGE_BOUTEILLES,
    subcategories: [
      "Coffrets cadeaux",
      "Boîtes cadeaux",
      "Rubans personnalisés",
      "Papier cadeau",
      "Pochettes cadeaux"
    ]
  },
  {
    id: "articles-personnalises",
    name: "Articles Personnalisés",
    slug: "articles-personnalises",
    description: "Mugs d'art, tasses, gourdes, stylos gravés, porte-clés, badges, T-shirts et polos brodés.",
    image: IMAGE_COMMERCIAL,
    subcategories: [
      "Mugs personnalisés",
      "Tasses personnalisées",
      "Gourdes personnalisées",
      "Porte-clés personnalisés",
      "Stylos personnalisés",
      "Badges personnalisés",
      "T-shirts personnalisés",
      "Casquettes personnalisées",
      "Polos personnalisés"
    ]
  },
  {
    id: "solutions-impression",
    name: "Solutions d'Impression",
    slug: "solutions-impression",
    description: "Impression offset/numérique : cartes de visite, flyers, affiches, roll-up, facturiers, enveloppes et chemises à rabat.",
    image: getCategoryBannerSrc('solutions-impression'),
    subcategories: [
      "Cartes de visite",
      "Flyers",
      "Dépliants",
      "Brochures",
      "Affiches",
      "Roll-up",
      "Kakémonos",
      "Bâches",
      "Facturiers",
      "Carnets",
      "Chemises à rabats",
      "Enveloppes",
      "Impression d'étiquettes",
      "Impression de stickers",
      "Impression sur mugs",
      "Impression sur bouteilles",
      "Impression sur sacs"
    ]
  },
  {
    id: "solutions-entreprises",
    name: "Solutions Entreprises",
    slug: "solutions-entreprises",
    description: "Identité visuelle de marque : emballages sur-mesure, enseignes, roll-up, signalétique d'atelier et goodies d'affaires.",
    image: IMAGE_COMMERCIAL,
    subcategories: [
      "Emballages personnalisés",
      "Sacs personnalisés",
      "Bouteilles personnalisées",
      "Enseignes",
      "Roll-up",
      "Kakémonos",
      "Signalétique",
      "Goodies",
      "Coffrets cadeaux",
      "Articles promotionnels"
    ]
  }
];

export const productsPreset: Product[] = productsData;

export const testimonialsPreset: Testimonial[] = [
  {
    id: "t1",
    name: "Client 01",
    role: "Événementiel",
    comment: "Excellent rendu.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "t2",
    name: "Client 02",
    role: "Marque",
    comment: "Très propre.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "t3",
    name: "Client 03",
    role: "Restauration",
    comment: "Commande simple.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
  }
];

export const promotionsPreset: Promotion[] = [
  {
    id: "p1",
    code: "TERANGA20",
    discountPercent: 20,
    active: true,
    description: "20% de remise exclusive sur l'univers événementiel pour votre premier devis"
  },
  {
    id: "p2",
    code: "KRAFT10",
    discountPercent: 10,
    active: true,
    description: "10% de remise sur toute la gamme d'emballages écologiques premium"
  }
];
