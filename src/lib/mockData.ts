import { Product, Category, Testimonial, Promotion } from '../types';
import mariagePrestige from '../assets/images/mariage_prestige_1780566116217.png';
import bouteillesJus from '../assets/images/bouteilles_jus_1780566133711.png';
import packCosmetique from '../assets/images/pack_cosmetique_1780566149588.png';
import objetsPublicitaires from '../assets/images/objets_publicitaires_1780566164378.png';
import accessoiresPack from '../assets/images/accessoires_pack_1780566177329.png';
import { productsData } from './productsData';

export const categoriesPreset: Category[] = [
  {
    id: "sacs-emballages-boutique",
    name: "Sacs & Emballages Boutique",
    slug: "sacs-emballages-boutique",
    description: "Sacs Kraft, sacs papier blanc, sacs papier luxe, sacs boutique, sacs cadeaux, sacs Crystal, pochettes cadeaux, tote bags, sacs personnalisés, sacs événementiels.",
    image: accessoiresPack,
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
    image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&q=80&w=600",
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
    id: "gobelets-emballages-boissons",
    name: "Gobelets & Emballages Boissons",
    slug: "gobelets-emballages-boissons",
    description: "Gobelets kraft, gobelets carton toutes tailles (200 ml à 500 ml), couvercles, pailles, bouteilles d'eau/jus personnalisées.",
    image: "https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?auto=format&fit=crop&q=80&w=600",
    subcategories: [
      "Gobelets 200 ml",
      "Gobelets 250 ml",
      "Gobelets 300 ml",
      "Gobelets 350 ml",
      "Gobelets 500 ml",
      "Gobelets Kraft",
      "Couvercles",
      "Pailles",
      "Bouteilles d'eau",
      "Bouteilles de jus",
      "Bouteilles personnalisées"
    ]
  },
  {
    id: "bols-saladiers-pots",
    name: "Bols, Saladiers & Pots",
    slug: "bols-saladiers-pots",
    description: "Bols Kraft, bols à salade, saladiers, pots à soupe, pots à glace, couvercles plats et couvercles dômes.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600",
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
    image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=600",
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
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600",
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
    image: bouteillesJus,
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
    image: packCosmetique,
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
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600",
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
    image: mariagePrestige,
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
    image: "https://images.unsplash.com/photo-1549467657-39328fac558f?auto=format&fit=crop&q=80&w=600",
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
    image: objetsPublicitaires,
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
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600",
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
    image: objetsPublicitaires,
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
    name: "Mariama Diallo",
    role: "Mariée Prestige (Dakar)",
    comment: "Art de Table a transformé mon événement ! Les sacs d'invités marbrés or rose et les boîtes dragées d'or étaient de la pure poésie artisanale pour nos tables d'honneur.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "t2",
    name: "Awa Ndiaye",
    role: "Fondatrice de Kelia Organics",
    comment: "Nous achetons tout notre packaging professionnel de savonnerie et pots de crème chez Art de Table. Impression relief en dorure parfaite et finition poudrée d'exception.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "t3",
    name: "Cheikh Tidiane Sow",
    role: "Directeur de Restauration Prestige, Almadies",
    comment: "Nos boîtes burgers et gobelets kraft personnalisés proviennent d'Art de Table. Le support WhatsApp est exemplaire et la qualité d'impression reflète notre statut.",
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
