export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
  description: string;
  minQty: number;
  productionDelay: string;
  isCustomizable: boolean;
  stock: number;
  rating: number;
  reviewsCount: number;
  disponibilite: "en_stock" | "rupture";
  produit_mis_en_avant: boolean;
  date_creation: string;
  date_modification: string;
  videoUrl?: string;
  subcategory?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  subcategories?: string[];
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  customInstructions?: string;
  customLogoUrl?: string;
}

export interface Order {
  id: string;
  customerId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  deliveryMethod: "retrait" | "livraison";
  paymentMethod: "wave" | "orange_money" | "cash_on_delivery";
  items: OrderItem[];
  totalAmount: number;
  status: "en_attente" | "validation" | "production" | "impression" | "expedition" | "livre" | "annule" | "en_production" | "expediee" | "livree" | "annulee";
  createdAt: string;
  adminNotes?: string;
  stockDeducted?: boolean;
}

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  quantityChanged: number;
  previousStock: number;
  newStock: number;
  reason: string;
  operator: string;
  createdAt: string;
}

export interface QuoteRequest {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  description: string;
  targetQuantity: number;
  category: string;
  customLogoUrl?: string;
  status: "en_attente" | "approuve" | "refuse" | "modifie";
  adminOfferAmount?: number;
  adminNotes?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  avatar: string;
}

export interface Promotion {
  id: string;
  code: string;
  discountPercent: number;
  active: boolean;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customInstructions: string;
  customLogoUrl: string; // Base64 or uploaded URL representation for simulation
  configuredPrice?: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  phone?: string;
  address?: string;
  isLocalDemo?: boolean;
}
