import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Product, Category, CartItem, Order, QuoteRequest, Testimonial, Promotion, UserProfile, StockLog } from '../types';
import { productsPreset, categoriesPreset, testimonialsPreset, promotionsPreset } from '../lib/mockData';
import eventBannerImage from '../assets/images/event.webp';
import { getCategoryBannerSrc } from '../lib/categoryBannerImages';
import heroArtwork1 from '../assets/images/slider-01.png';
import heroArtwork2 from '../assets/images/slider-02.png';
import heroArtwork3 from '../assets/images/slider-03.png';
import heroSlider1 from '../assets/images/hero-slider-1.jpg';
import heroSlider2 from '../assets/images/hero-slider-2.jpg';
import heroSlider3 from '../assets/images/hero-slider-3.jpeg';
import {
  buildCatalogQueryString,
  CatalogSortBy,
  hasCatalogQueryState,
  readCatalogQueryState,
  resolveCategoryToken,
} from '../lib/catalogNavigation';

const ART_TABLE_SYNC_EVENT = 'art_table_sync';
const SHARED_COLLECTIONS = {
  products: 'products',
  categories: 'categories',
  testimonials: 'testimonials',
  promotions: 'promotions',
  siteSettings: 'siteSettings',
};

const SITE_SETTINGS_DOC = doc(db, SHARED_COLLECTIONS.siteSettings, 'main');

const DEFAULT_SITE_SETTINGS = {
  slides: [
    {
      image: heroSlider2,
      artwork: heroArtwork1,
      title: 'DONNEZ VIE À VOTRE communication.',
      highlight: 'Design professionnel',
      subTitle: 'Des supports élégants pour valoriser votre image de marque.',
      headlineTop: 'DONNEZ VIE À VOTRE',
      headlineAccent: 'communication.',
      body: 'Des supports élégants pour valoriser votre image de marque.',
      body2: '',
      meta: 'Packaging - emballage - personnalisation · 77 871 58 75',
      btnText: 'Découvrir nos créations',
      btnLink: 'catalog',
      features: ['DESIGN PROFESSIONNEL', 'IMPRESSION HAUTE QUALITÉ', 'PERSONNALISATION SUR MESURE', 'LIVRAISON RAPIDE'],
      imagePosition: '72% center',
      isPrecomposed: true
    },
    {
      image: heroSlider1,
      artwork: heroArtwork2,
      title: 'SUBLIMEZ vos produits ALIMENTAIRES.',
      highlight: 'Emballages premium',
      subTitle: 'Des emballages pratiques et personnalisables.',
      headlineTop: 'SUBLIMEZ',
      headlineAccent: 'vos produits',
      headlineBottom: 'ALIMENTAIRES.',
      body: 'Des emballages pratiques et personnalisables.',
      body2: '',
      meta: '',
      btnText: 'En savoir plus',
      btnLink: 'quote',
      features: ['PROTECTION OPTIMALE', 'MATÉRIAUX DE QUALITÉ', 'PRÉSENTATION ÉLÉGANTE', 'PERSONNALISATION SUR MESURE'],
      imagePosition: '58% center',
      isPrecomposed: true
    },
    {
      image: heroSlider3,
      artwork: heroArtwork3,
      title: 'TRANSFORMEZ CHAQUE ÉVÉNEMENT en souvenir inoubliable.',
      highlight: 'Événementiel',
      subTitle: 'Des créations personnalisées pour vos événements.',
      headlineTop: 'TRANSFORMEZ',
      headlineBottom: 'CHAQUE ÉVÉNEMENT',
      headlineAccent: 'en souvenir inoubliable.',
      body: 'Des créations personnalisées pour vos événements.',
      body2: '',
      meta: '',
      btnText: 'Commander',
      btnLink: 'https://wa.me/221778715875?text=Bonjour%20Art%20de%20Table%2C%20je%20souhaite%20passer%20commande.',
      features: ['BOUTEILLES D’EAU', 'COFFRETS CADEAUX', 'EMBALLAGES DE PRESTIGE', 'ACCESSOIRES ÉVÉNEMENTIELS'],
      imagePosition: '60% center',
      isPrecomposed: true
    }
  ]
};

const normalizeCategories = (items: Category[]) =>
  items.map((cat) => ({
    ...cat,
    image: cat.image || (cat.id === 'evenementiel' || cat.slug === 'evenementiel'
      ? eventBannerImage
      : getCategoryBannerSrc(cat.id)),
  }));

interface AppContextType {
  // Navigation / Views
  currentView: string;
  setView: (view: string) => void;
  selectedProductId: string | null;
  selectedCategoryId: string | null;
  setSelectedProduct: (id: string | null) => void;
  setSelectedCategory: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  catalogSortBy: CatalogSortBy;
  setCatalogSortBy: (sort: CatalogSortBy) => void;
  catalogMinQtyOnly: boolean;
  setCatalogMinQtyOnly: (value: boolean) => void;

  // Real Database Collections
  products: Product[];
  categories: Category[];
  testimonials: Testimonial[];
  promotions: Promotion[];
  orders: Order[];
  quotes: QuoteRequest[];
  stockHistory: StockLog[];
  
  // Loading & Diagnostics
  loading: boolean;
  refreshCollections: () => Promise<void>;

  // Authentication
  currentUser: UserProfile | null;
  authLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;

  // Cart Logic
  cart: CartItem[];
  cartActivity: { id: number; item: CartItem; addedQuantity: number } | null;
  dismissCartActivity: () => void;
  addToCart: (product: Product, quantity: number, instructions: string, logoUrl: string, configuredPrice?: number) => void;
  removeFromCart: (productId: string, instructions: string) => void;
  updateCartQuantity: (productId: string, instructions: string, quantity: number) => void;
  clearCart: () => void;
  appliedPromo: Promotion | null;
  applyPromoCode: (code: string) => boolean;
  removePromo: () => void;
  cartTotals: {
    subtotal: number;
    delivery: number;
    discount: number;
    total: number;
  };

  // Orders and Checkout
  deliveryMethod: "retrait" | "livraison";
  setDeliveryMethod: (method: "retrait" | "livraison") => void;
  paymentMethod: "wave" | "orange_money" | "cash_on_delivery";
  setPaymentMethod: (method: "wave" | "orange_money" | "cash_on_delivery") => void;
  placeOrder: (shippingDetails: { name: string; phone: string; address: string; email: string }) => Promise<Order>;
  
  // Devis (Quotes) Request
  submitQuoteRequest: (quote: Omit<QuoteRequest, "id" | "userId" | "status" | "createdAt">) => Promise<void>;

  // WhatsApp Order Integration
  triggerWhatsAppOrder: (order: Order) => void;
  triggerWhatsAppQuote: (quote: QuoteRequest) => void;

  // Admin DB Write Functions (Allows Admin Dashboard live product & status updates)
  adminUpdateOrderStatus: (orderId: string, status: Order["status"], notes?: string) => Promise<void>;
  adminUpdateQuoteStatus: (quoteId: string, status: QuoteRequest["status"], offerAmount?: number, notes?: string) => Promise<void>;
  adminAddProduct: (prod: Omit<Product, "id">) => Promise<void>;
  adminEditProduct: (id: string, prod: Partial<Product>) => Promise<void>;
  adminDeleteProduct: (id: string) => Promise<void>;
  adminClearAllProducts: () => Promise<void>;
  adminReseedCatalog: () => Promise<void>;
  adminImportBackup: (backup: {
    products?: Product[];
    categories?: Category[];
    testimonials?: Testimonial[];
    promotions?: Promotion[];
    siteSettings?: any;
    orders?: Order[];
    quotes?: QuoteRequest[];
    stockHistory?: StockLog[];
    mediaItems?: any[];
    registeredUsers?: any[];
    reels?: any[];
  }) => Promise<void>;
  
  // Custom Visual and CMS Editors
  siteSettings: any;
  adminEditCategory: (id: string, cat: Partial<Category>) => Promise<void>;
  adminUpdateSiteSettings: (settings: any) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialCatalogQuery = typeof window !== 'undefined'
    ? readCatalogQueryState(window.location.search)
    : readCatalogQueryState('');

  const hasInitialCatalogQuery = hasCatalogQueryState(initialCatalogQuery);

  // UI states
  const [currentView, setCurrentView] = useState<string>(hasInitialCatalogQuery ? 'shop' : 'home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialCatalogQuery.category);
  const [searchQueryState, setSearchQueryState] = useState<string>(initialCatalogQuery.q);
  const [catalogSortByState, setCatalogSortByState] = useState<CatalogSortBy>(initialCatalogQuery.sort);
  const [catalogMinQtyOnlyState, setCatalogMinQtyOnlyState] = useState<boolean>(initialCatalogQuery.minQtyOnly);

  // Shared collections come from Firestore so admin and client stay in sync.
  const [products, setProducts] = useState<Product[]>(productsPreset);
  const [categories, setCategories] = useState<Category[]>(categoriesPreset);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(testimonialsPreset);
  const [promotions, setPromotions] = useState<Promotion[]>(promotionsPreset);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [stockHistory, setStockHistory] = useState<StockLog[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);

  // User details
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartActivity, setCartActivity] = useState<{ id: number; item: CartItem; addedQuantity: number } | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<"retrait" | "livraison">("livraison");
  const [paymentMethod, setPaymentMethod] = useState<"wave" | "orange_money" | "cash_on_delivery">("cash_on_delivery");
  const navActionRef = useRef<'push' | 'replace' | null>(null);
  const skipUrlSyncRef = useRef(false);

  const emitSyncEvent = () => {
    window.dispatchEvent(new Event(ART_TABLE_SYNC_EVENT));
  };

  const safeParse = <T,>(raw: string | null, fallback: T): T => {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  };

  const syncPrivateCollectionsFromStorage = () => {
    const allOrders = safeParse<Order[]>(localStorage.getItem('art_table_orders'), []);
    const allQuotes = safeParse<QuoteRequest[]>(localStorage.getItem('art_table_quotes'), []);
    const allStockHistory = safeParse<StockLog[]>(localStorage.getItem('art_table_stock_history'), []);

    if (currentUser) {
      if (currentUser.isAdmin) {
        setOrders(allOrders);
        setQuotes(allQuotes);
        setStockHistory(allStockHistory);
      } else {
        setOrders(allOrders.filter(o => o.customerId === currentUser.uid));
        setQuotes(allQuotes.filter(q => q.userId === currentUser.uid));
        setStockHistory([]);
      }
    } else {
      setOrders(safeParse<Order[]>(localStorage.getItem('art_table_guest_orders'), []));
      setQuotes([]);
      setStockHistory([]);
    }
  };

  const refreshCollections = async () => {
    syncPrivateCollectionsFromStorage();
  };

  const setView = (view: string) => {
    setCurrentView(view);
  };

  useEffect(() => {
    syncPrivateCollectionsFromStorage();
  }, [currentUser]);

  useEffect(() => {
    if (!selectedCategoryId || categories.length === 0) return;
    const resolvedCategoryId = resolveCategoryToken(selectedCategoryId, categories);
    if (resolvedCategoryId && resolvedCategoryId !== selectedCategoryId) {
      setSelectedCategoryId(resolvedCategoryId);
    }
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const applyUrlState = () => {
      const nextState = readCatalogQueryState(window.location.search);
      skipUrlSyncRef.current = true;
      navActionRef.current = null;
      setSelectedCategoryId(nextState.category);
      setSearchQueryState(nextState.q);
      setCatalogSortByState(nextState.sort);
      setCatalogMinQtyOnlyState(nextState.minQtyOnly);
      setCurrentView(hasCatalogQueryState(nextState) ? 'shop' : 'home');
    };

    const onPopState = () => {
      applyUrlState();
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (skipUrlSyncRef.current) {
      skipUrlSyncRef.current = false;
      return;
    }

    const nextQuery = buildCatalogQueryString({
      category: selectedCategoryId,
      q: searchQueryState,
      sort: catalogSortByState,
      minQtyOnly: catalogMinQtyOnlyState,
    });

    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}${window.location.hash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextUrl === currentUrl) return;

    const historyState = {
      view: currentView,
      category: selectedCategoryId,
      q: searchQueryState,
      sort: catalogSortByState,
      minQtyOnly: catalogMinQtyOnlyState,
    };

    if (navActionRef.current === 'replace') {
      window.history.replaceState(historyState, '', nextUrl);
    } else {
      window.history.pushState(historyState, '', nextUrl);
    }
    navActionRef.current = null;
  }, [currentView, selectedCategoryId, searchQueryState, catalogSortByState, catalogMinQtyOnlyState]);

  useEffect(() => {
    setLoading(false);
    setAuthLoading(false);

    const handleStorageChange = (e: StorageEvent) => {
      try {
        if (e.key === 'art_table_current_user') {
          setCurrentUser(e.newValue ? JSON.parse(e.newValue) : null);
          return;
        }
        syncPrivateCollectionsFromStorage();
      } catch (err) {
        console.error("Storage synchronization error", err);
      }
    };

    const handleInternalSync = () => {
      try {
        syncPrivateCollectionsFromStorage();
      } catch (err) {
        console.error("Internal synchronization error", err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(ART_TABLE_SYNC_EVENT, handleInternalSync);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(ART_TABLE_SYNC_EVENT, handleInternalSync);
    };
  }, [currentUser]);

  useEffect(() => {
    let unsubProducts = () => {};
    let unsubCategories = () => {};
    let unsubTestimonials = () => {};
    let unsubPromotions = () => {};
    let unsubSiteSettings = () => {};
    let cancelled = false;

    const toList = <T extends Record<string, any>>(snapshot: any): T[] => {
      return snapshot.docs.map((snap: any) => ({ id: snap.id, ...snap.data() } as T));
    };

    const initSharedCollections = async () => {
      try {
        const siteSnap = await getDoc(SITE_SETTINGS_DOC);
        if (!siteSnap.exists()) {
          await setDoc(SITE_SETTINGS_DOC, DEFAULT_SITE_SETTINGS);
        }
      } catch (err) {
        console.warn('Site settings bootstrap skipped or failed:', err);
      }

      if (cancelled) return;

      unsubProducts = onSnapshot(collection(db, SHARED_COLLECTIONS.products), (snap) => {
        setProducts(snap.empty ? productsPreset : toList<Product>(snap));
      }, (err) => console.error('products snapshot error', err));

      unsubCategories = onSnapshot(collection(db, SHARED_COLLECTIONS.categories), (snap) => {
        setCategories(snap.empty ? categoriesPreset : normalizeCategories(toList<Category>(snap)));
      }, (err) => console.error('categories snapshot error', err));

      unsubTestimonials = onSnapshot(collection(db, SHARED_COLLECTIONS.testimonials), (snap) => {
        setTestimonials(snap.empty ? testimonialsPreset : toList<Testimonial>(snap));
      }, (err) => console.error('testimonials snapshot error', err));

      unsubPromotions = onSnapshot(collection(db, SHARED_COLLECTIONS.promotions), (snap) => {
        setPromotions(snap.empty ? promotionsPreset : toList<Promotion>(snap));
      }, (err) => console.error('promotions snapshot error', err));

      unsubSiteSettings = onSnapshot(SITE_SETTINGS_DOC, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setSiteSettings({
            ...DEFAULT_SITE_SETTINGS,
            ...data,
            slides: Array.isArray(data?.slides) && data.slides.length > 0
              ? data.slides.map((slide: any, index: number) => ({
                  image: slide?.image || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].image,
                  title: slide?.title || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].title,
                  highlight: slide?.highlight || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].highlight,
                  subTitle: slide?.subTitle || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].subTitle,
                  headlineTop: slide?.headlineTop || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].headlineTop,
                  headlineAccent: slide?.headlineAccent || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].headlineAccent,
                  headlineBottom: slide?.headlineBottom || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].headlineBottom,
                  body: slide?.body || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].body,
                  body2: slide?.body2 || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].body2,
                  meta: slide?.meta || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].meta,
                  btnText: slide?.btnText || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].btnText,
                  btnLink: slide?.btnLink || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].btnLink,
                  features: Array.isArray(slide?.features) && slide.features.length > 0
                    ? slide.features
                    : DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].features,
                  imagePosition: slide?.imagePosition || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].imagePosition,
                  isPrecomposed: true,
                }))
              : DEFAULT_SITE_SETTINGS.slides
          });
        } else {
          setSiteSettings(DEFAULT_SITE_SETTINGS);
        }
      }, (err) => console.error('siteSettings snapshot error', err));
    };

    initSharedCollections();

    setLoading(false);

    return () => {
      cancelled = true;
      unsubProducts();
      unsubCategories();
      unsubTestimonials();
      unsubPromotions();
      unsubSiteSettings();
    };
  }, []);

  // Auth actions (Purely local storage)
  const loginWithGoogle = async () => {
    const guestUser: UserProfile = {
      uid: `google-user-${Math.random().toString(36).substring(2, 9)}`,
      email: 'client.google@art.detable.com',
      displayName: 'Client Google',
      isAdmin: false
    };
    localStorage.setItem('art_table_current_user', JSON.stringify(guestUser));
    setCurrentUser(guestUser);
    emitSyncEvent();
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    const isKhadidia = email.toLowerCase() === 'khadidia@art.detable.com';
    const isKhadxxm = email.toLowerCase() === 'khadxxm05@gmail.com';
    const isAdminEmail = isKhadidia || isKhadxxm;

    const usersRaw = localStorage.getItem('art_table_registered_users');
    const users = usersRaw ? JSON.parse(usersRaw) : [];

    if (users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("Cet email est déjà utilisé.");
    }

    const newUser = {
      uid: `user-${Math.random().toString(36).substring(2, 11)}`,
      email: email.toLowerCase(),
      password: pass,
      displayName: name || email.split('@')[0],
      isAdmin: isAdminEmail
    };

    users.push(newUser);
    localStorage.setItem('art_table_registered_users', JSON.stringify(users));

    const userProfile: UserProfile = {
      uid: newUser.uid,
      email: newUser.email,
      displayName: newUser.displayName,
      isAdmin: newUser.isAdmin
    };
    localStorage.setItem('art_table_current_user', JSON.stringify(userProfile));
    setCurrentUser(userProfile);
    emitSyncEvent();
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const isKhadidia = email.toLowerCase() === 'khadidia@art.detable.com';
    const isKhadxxm = email.toLowerCase() === 'khadxxm05@gmail.com';
    const isAdminEmail = isKhadidia || isKhadxxm;

    if (isAdminEmail && (pass === 'artdetabledidia' || pass === 'artdetablekhadim')) {
      console.info("Master Admin login detected. Initializing Admin session.");
      const adminUser: UserProfile = {
        uid: isKhadidia ? 'admin-khadidia' : 'admin-khadxxm',
        email: email.toLowerCase(),
        displayName: "Khadidia",
        isAdmin: true
      };
      localStorage.setItem('art_table_current_user', JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      emitSyncEvent();
      return;
    }

    const usersRaw = localStorage.getItem('art_table_registered_users');
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const foundUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);

    if (foundUser) {
      const userProfile: UserProfile = {
        uid: foundUser.uid,
        email: foundUser.email,
        displayName: foundUser.displayName,
        isAdmin: foundUser.isAdmin
      };
      localStorage.setItem('art_table_current_user', JSON.stringify(userProfile));
      setCurrentUser(userProfile);
      emitSyncEvent();
      return;
    }

    if (isAdminEmail) {
      const adminUser: UserProfile = {
        uid: isKhadidia ? 'admin-khadidia' : 'admin-khadxxm',
        email: email.toLowerCase(),
        displayName: "Khadidia",
        isAdmin: true
      };
      localStorage.setItem('art_table_current_user', JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      emitSyncEvent();
      return;
    }

    throw new Error("Identifiants incorrects.");
  };

  const logout = async () => {
    localStorage.removeItem('art_table_current_user');
    setCurrentUser(null);
    setCart([]);
    setAppliedPromo(null);
    setView('home');
    emitSyncEvent();
  };

  // Cart functions with real-time stock bounds
  const addToCart = (product: Product, quantity: number, instructions: string, logoUrl: string, configuredPrice?: number) => {
    if (product.stock !== undefined && product.stock <= 0) {
      alert("Désolé, cet article est actuellement en rupture de stock.");
      return;
    }
    if (product.stock !== undefined && quantity > product.stock) {
      alert(`Désolé, le stock physique restant est de ${product.stock} unités.`);
      return;
    }
    const existingItem = cart.find(item =>
      item.product.id === product.id &&
      item.customInstructions === instructions &&
      item.customLogoUrl === logoUrl &&
      item.configuredPrice === configuredPrice
    );

    if (existingItem && product.stock !== undefined && existingItem.quantity + quantity > product.stock) {
      alert(`Désolé, l'addition de ces articles dépasse notre stock disponible (${product.stock} unités).`);
      return;
    }

    const activityItem: CartItem = {
      product,
      quantity: existingItem ? existingItem.quantity + quantity : quantity,
      customInstructions: instructions,
      customLogoUrl: logoUrl,
      configuredPrice,
    };

    setCart(prev => {
      const existingIdx = prev.findIndex(item =>
        item.product.id === product.id &&
        item.customInstructions === instructions &&
        item.customLogoUrl === logoUrl &&
        item.configuredPrice === configuredPrice
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = { ...next[existingIdx], quantity: next[existingIdx].quantity + quantity };
        return next;
      }

      return [...prev, activityItem];
    });
    setCartActivity({ id: Date.now(), item: activityItem, addedQuantity: quantity });
  };

  const dismissCartActivity = () => {
    setCartActivity(null);
  };

  const removeFromCart = (productId: string, instructions: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.customInstructions === instructions)));
  };

  const updateCartQuantity = (productId: string, instructions: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, instructions);
      return;
    }
    const existingItem = cart.find(item => item.product.id === productId && item.customInstructions === instructions);
    if (existingItem && existingItem.product.stock !== undefined && quantity > existingItem.product.stock) {
      alert(`Le stock physique maximal disponible est de ${existingItem.product.stock} unités.`);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId && item.customInstructions === instructions 
        ? { ...item, quantity } 
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
    setCartActivity(null);
  };

  const applyPromoCode = (code: string): boolean => {
    const promo = promotions.find(p => p.code.toUpperCase() === code.toUpperCase() && p.active);
    if (promo) {
      setAppliedPromo(promo);
      return true;
    }
    return false;
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  // Calculated Cart Totals
  const getSubtotal = () => cart.reduce((acc, item) => acc + ((item.configuredPrice ?? item.product.price) * item.quantity), 0);
  const getDiscount = (sub: number) => appliedPromo ? (sub * appliedPromo.discountPercent) / 100 : 0;
  const getDeliveryFee = () => deliveryMethod === "livraison" ? 2000 : 0; // standard Dakar flat rate 2000 FCFA

  const subtotal = getSubtotal();
  const discount = getDiscount(subtotal);
  const delivery = getDeliveryFee();
  const total = subtotal - discount + delivery;

  const cartTotals = {
    subtotal,
    delivery,
    discount,
    total
  };

  const openWhatsAppMessage = (message: string) => {
    const phoneNumber = '221778715875';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Trigger select product
  const setSelectedProduct = (id: string | null) => {
    setSelectedProductId(id);
    if (id) setView('product-detail');
  };

  const setSelectedCategory = (id: string | null) => {
    navActionRef.current = 'push';
    setSelectedCategoryId(id);
    if (id) setView('shop');
  };

  const setSearchQuery = (q: string) => {
    navActionRef.current = 'replace';
    setSearchQueryState(q);
  };

  const setCatalogSortBy = (sort: CatalogSortBy) => {
    navActionRef.current = 'push';
    setCatalogSortByState(sort);
  };

  const setCatalogMinQtyOnly = (value: boolean) => {
    navActionRef.current = 'push';
    setCatalogMinQtyOnlyState(value);
  };

  // Checkouts with real-time stock pre-check
  const placeOrder = async (shippingDetails: { name: string; phone: string; address: string; email: string }) => {
    if (cart.length === 0) throw new Error("Votre panier est vide.");

    // Pre-check stock on checkout to verify availability
    for (const item of cart) {
      const pLive = products.find(p => p.id === item.product.id);
      if (pLive && pLive.stock !== undefined && pLive.stock < item.quantity) {
        throw new Error(`Le stock pour "${item.product.name}" est insuffisant (restant: ${pLive.stock} pièces). Veuillez ajuster votre panier.`);
      }
    }

    const total = cartTotals.total;
    const isGuest = !currentUser;
    const customerId = currentUser ? currentUser.uid : `guest-${Math.random().toString(36).substring(2, 11)}`;

    const orderData: Order = {
      id: `order-${Math.random().toString(36).substring(2, 9)}`,
      customerId: customerId,
      name: shippingDetails.name,
      phone: shippingDetails.phone,
      email: shippingDetails.email || `${customerId}@guest.art.detable.com`,
      address: shippingDetails.address,
      deliveryMethod,
      paymentMethod,
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.configuredPrice ?? item.product.price,
        customInstructions: item.customInstructions,
        customLogoUrl: item.customLogoUrl
      })),
      totalAmount: total,
      status: "en_attente",
      createdAt: new Date().toISOString(),
      stockDeducted: false
    };

    const existing = JSON.parse(localStorage.getItem('art_table_orders') || '[]');
    const updated = [orderData, ...existing];
    localStorage.setItem('art_table_orders', JSON.stringify(updated));
    
    if (currentUser) {
      setOrders(updated.filter(o => o.customerId === currentUser.uid || currentUser.isAdmin));
    } else {
      const existingGuest = JSON.parse(localStorage.getItem('art_table_guest_orders') || '[]');
      const updatedGuest = [orderData, ...existingGuest];
      localStorage.setItem('art_table_guest_orders', JSON.stringify(updatedGuest));
      setOrders(updatedGuest);
    }
    emitSyncEvent();

    triggerWhatsAppOrder(orderData);
    clearCart();
    return orderData;
  };

  // Submit quote request
  const submitQuoteRequest = async (quote: Omit<QuoteRequest, "id" | "userId" | "status" | "createdAt">) => {
    if (!currentUser) throw new Error("Veuillez vous connecter pour demander un devis.");

    const quoteId = `quote-${Math.random().toString(36).substring(2, 9)}`;
    const quoteData: QuoteRequest = {
      ...quote,
      id: quoteId,
      userId: currentUser.uid,
      status: "en_attente",
      createdAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('art_table_quotes') || '[]');
    const updated = [quoteData, ...existing];
    localStorage.setItem('art_table_quotes', JSON.stringify(updated));
    setQuotes(updated.filter(q => q.userId === currentUser.uid || currentUser.isAdmin));
    emitSyncEvent();

    triggerWhatsAppQuote(quoteData);
    setView('home');
  };

  // WhatsApp formatted messages
  const triggerWhatsAppOrder = (order: Order) => {
    const itemsText = order.items.map(i => `• ${i.name} (x${i.quantity}) - ${i.price} FCFA`).join('\n');
    const message = `COMMANDE - ART DE TABLE\n\n` +
      `N° Commande: ${order.id ? order.id.slice(0, 8).toUpperCase() : 'NOUVELLE'}\n` +
      `Client: ${order.name}\n` +
      `Téléphone: ${order.phone}\n` +
      `Email: ${order.email}\n` +
      `Mode: ${order.deliveryMethod === 'livraison' ? 'Livraison à domicile' : 'Retrait en boutique'}\n` +
      `Adresse: ${order.address}\n` +
      `Paiement: ${order.paymentMethod.toUpperCase()}\n\n` +
      `PRODUITS:\n${itemsText}\n\n` +
      `Montant Total: ${order.totalAmount} FCFA\n\n` +
      `Envoyé depuis le site Art de Table`;

    openWhatsAppMessage(message);
  };

  const triggerWhatsAppQuote = (quote: QuoteRequest) => {
    const message = `DEMANDE DE DEVIS - ART DE TABLE\n\n` +
      `Client: ${quote.name}\n` +
      `Téléphone: ${quote.phone}\n` +
      `Email: ${quote.email}\n` +
      `Catégorie: ${quote.category}\n` +
      `Quantité souhaitée: ${quote.targetQuantity} unités\n\n` +
      `Description du besoin:\n${quote.description}\n\n` +
      `Envoyé depuis le site Art de Table`;

    openWhatsAppMessage(message);
  };

  // Helper to verify admin access for all administrative operations
  const checkAdminAuth = () => {
    const isUserAdmin = currentUser?.isAdmin || 
      currentUser?.email?.toLowerCase() === 'khadidia@art.detable.com' || 
      currentUser?.email?.toLowerCase() === 'khadxxm05@gmail.com';
    if (!isUserAdmin) throw new Error("Action non autorisée.");
  };

  // Administration tasks with automatic stock and accountability logging
  const adminUpdateOrderStatus = async (orderId: string, status: Order["status"], notes?: string) => {
    checkAdminAuth();

    const allOrdersRaw = localStorage.getItem('art_table_orders') || '[]';
    const allOrders: Order[] = JSON.parse(allOrdersRaw);
    const orderToUpdate = allOrders.find(o => o.id === orderId);
    if (!orderToUpdate) throw new Error("Bon de commande introuvable.");

    const updatedOrder = { ...orderToUpdate, status };
    if (notes) updatedOrder.adminNotes = notes;

    const isValidatedStatus = (s: Order["status"]) => s === "en_production" || s === "expediee" || s === "livree";
    const isDeducted = orderToUpdate.stockDeducted || false;

    let nextProducts = [...products];
    let newLogs = [...stockHistory];

    if (isValidatedStatus(status) && !isDeducted) {
      for (const item of orderToUpdate.items) {
        const liveProdIdx = nextProducts.findIndex(p => p.id === item.productId);
        if (liveProdIdx > -1) {
          const liveProd = nextProducts[liveProdIdx];
          const previousStock = liveProd.stock !== undefined ? liveProd.stock : 1000;
          const newStock = Math.max(0, previousStock - item.quantity);
          nextProducts[liveProdIdx] = { ...liveProd, stock: newStock };
          
          newLogs.unshift({
            id: `log-${Math.random().toString(36).substring(2,9)}`,
            productId: item.productId,
            productName: item.name,
            quantityChanged: -item.quantity,
            previousStock,
            newStock,
            reason: `Validation commande #${orderId.slice(0, 8).toUpperCase()}`,
            operator: currentUser?.email || 'Admin',
            createdAt: new Date().toISOString()
          });
        }
      }
      updatedOrder.stockDeducted = true;
    } else if ((status === "annulee" || status === "en_attente") && isDeducted) {
      for (const item of orderToUpdate.items) {
        const liveProdIdx = nextProducts.findIndex(p => p.id === item.productId);
        if (liveProdIdx > -1) {
          const liveProd = nextProducts[liveProdIdx];
          const previousStock = liveProd.stock !== undefined ? liveProd.stock : 1000;
          const newStock = previousStock + item.quantity;
          nextProducts[liveProdIdx] = { ...liveProd, stock: newStock };

          newLogs.unshift({
            id: `log-${Math.random().toString(36).substring(2,9)}`,
            productId: item.productId,
            productName: item.name,
            quantityChanged: item.quantity,
            previousStock,
            newStock,
            reason: `Restauration suite à annulation/retour commande #${orderId.slice(0, 8).toUpperCase()}`,
            operator: currentUser?.email || 'Admin',
            createdAt: new Date().toISOString()
          });
        }
      }
      updatedOrder.stockDeducted = false;
    }

    const nextOrders = allOrders.map(o => o.id === orderId ? updatedOrder : o);
    localStorage.setItem('art_table_orders', JSON.stringify(nextOrders));
    setOrders(currentUser?.isAdmin ? nextOrders : nextOrders.filter(o => o.customerId === currentUser?.uid));

    await Promise.all(nextProducts.map((product) => setDoc(doc(db, SHARED_COLLECTIONS.products, product.id), product)));
    setProducts(nextProducts);
    setStockHistory(newLogs);
    localStorage.setItem('art_table_stock_history', JSON.stringify(newLogs));
    emitSyncEvent();
  };

  const adminUpdateQuoteStatus = async (quoteId: string, status: QuoteRequest["status"], offerAmount?: number, notes?: string) => {
    checkAdminAuth();

    const allQuotesRaw = localStorage.getItem('art_table_quotes') || '[]';
    const allQuotes: QuoteRequest[] = JSON.parse(allQuotesRaw);

    const nextQuotes = allQuotes.map(q => {
      if (q.id === quoteId) {
        const updated = { ...q, status };
        if (offerAmount !== undefined) updated.adminOfferAmount = offerAmount;
        if (notes) updated.adminNotes = notes;
        return updated;
      }
      return q;
    });

    localStorage.setItem('art_table_quotes', JSON.stringify(nextQuotes));
    setQuotes(currentUser?.isAdmin ? nextQuotes : nextQuotes.filter(q => q.userId === currentUser?.uid));
    emitSyncEvent();
  };

  const adminAddProduct = async (prod: Omit<Product, "id">) => {
    checkAdminAuth();

    const now = new Date().toISOString();
    const newId = `product-${Math.random().toString(36).substring(2, 9)}`;
    const preparedProd: Product = {
      ...prod,
      id: newId,
      disponibilite: prod.stock > 0 ? "en_stock" : "rupture",
      produit_mis_en_avant: "produit_mis_en_avant" in prod ? (prod as any).produit_mis_en_avant : false,
      date_creation: now,
      date_modification: now,
      rating: 5,
      reviewsCount: 0
    };

    const nextProducts = [preparedProd, ...products];
    await setDoc(doc(db, SHARED_COLLECTIONS.products, newId), preparedProd);
    setProducts(nextProducts);
    
    const newLogVal = {
      id: `log-${Math.random().toString(36).substring(2, 9)}`,
      productId: newId,
      productName: prod.name,
      quantityChanged: prod.stock,
      previousStock: 0,
      newStock: prod.stock,
      reason: "Création initiale d'échantillon au catalogue",
      operator: currentUser?.email || 'Admin',
      createdAt: now
    };
    const nextLogs = [newLogVal, ...stockHistory];
    setStockHistory(nextLogs);
    localStorage.setItem('art_table_stock_history', JSON.stringify(nextLogs));
    emitSyncEvent();
  };

  const adminEditProduct = async (id: string, prod: Partial<Product>) => {
    checkAdminAuth();

    const now = new Date().toISOString();
    const updatedFields: Partial<Product> = {
      ...prod,
      date_modification: now
    };
    if (prod.stock !== undefined) {
      updatedFields.disponibilite = prod.stock > 0 ? "en_stock" : "rupture";
    }

    const liveProd = products.find(p => p.id === id);
    const previousStock = liveProd ? (liveProd.stock !== undefined ? liveProd.stock : 1000) : 1000;
    
    const nextProducts = products.map(p => {
      if (p.id === id) {
        return { ...p, ...updatedFields };
      }
      return p;
    });
    await setDoc(doc(db, SHARED_COLLECTIONS.products, id), { ...liveProd, ...updatedFields, id });
    setProducts(nextProducts);
    
    if (prod.stock !== undefined && prod.stock !== previousStock) {
      const diff = prod.stock - previousStock;
      const newLogVal = {
        id: `log-${Math.random().toString(36).substring(2, 9)}`,
        productId: id,
        productName: prod.name || liveProd?.name || 'Produit',
        quantityChanged: diff,
        previousStock,
        newStock: prod.stock,
        reason: "Ajustement manuel d'inventaire d'Atelier (CMS)",
        operator: currentUser?.email || 'Admin',
        createdAt: now
      };
      const nextLogs = [newLogVal, ...stockHistory];
      setStockHistory(nextLogs);
      localStorage.setItem('art_table_stock_history', JSON.stringify(nextLogs));
    }
    emitSyncEvent();
  };

  const adminDeleteProduct = async (id: string) => {
    checkAdminAuth();

    const nextProducts = products.filter(p => p.id !== id);
    await deleteDoc(doc(db, SHARED_COLLECTIONS.products, id));
    setProducts(nextProducts);
    emitSyncEvent();
  };

  const adminClearAllProducts = async () => {
    checkAdminAuth();

    const allProducts = await getDocs(collection(db, SHARED_COLLECTIONS.products));
    const batch = writeBatch(db);
    allProducts.docs.forEach((snapDoc) => batch.delete(snapDoc.ref));
    await batch.commit();
    setProducts([]);
    emitSyncEvent();
  };

  const adminReseedCatalog = async () => {
    checkAdminAuth();

    setLoading(true);

    const batch = writeBatch(db);
    const existingProducts = await getDocs(collection(db, SHARED_COLLECTIONS.products));
    existingProducts.docs.forEach((snapDoc) => batch.delete(snapDoc.ref));
    const existingCategories = await getDocs(collection(db, SHARED_COLLECTIONS.categories));
    existingCategories.docs.forEach((snapDoc) => batch.delete(snapDoc.ref));
    const existingTestimonials = await getDocs(collection(db, SHARED_COLLECTIONS.testimonials));
    existingTestimonials.docs.forEach((snapDoc) => batch.delete(snapDoc.ref));
    const existingPromotions = await getDocs(collection(db, SHARED_COLLECTIONS.promotions));
    existingPromotions.docs.forEach((snapDoc) => batch.delete(snapDoc.ref));
    productsPreset.forEach((prod) => batch.set(doc(db, SHARED_COLLECTIONS.products, prod.id), prod));
    categoriesPreset.forEach((cat) => batch.set(doc(db, SHARED_COLLECTIONS.categories, cat.id), cat));
    testimonialsPreset.forEach((test) => batch.set(doc(db, SHARED_COLLECTIONS.testimonials, test.id), test));
    promotionsPreset.forEach((promo) => batch.set(doc(db, SHARED_COLLECTIONS.promotions, promo.id), promo));
    batch.set(SITE_SETTINGS_DOC, DEFAULT_SITE_SETTINGS);
    await batch.commit();

    setProducts(productsPreset);
    setCategories(normalizeCategories(categoriesPreset));
    setTestimonials(testimonialsPreset);
    setPromotions(promotionsPreset);
    setSiteSettings(DEFAULT_SITE_SETTINGS);

    localStorage.removeItem('art_table_orders');
    localStorage.removeItem('art_table_quotes');
    localStorage.removeItem('art_table_stock_history');
    
    setOrders([]);
    setQuotes([]);
    setStockHistory([]);
    
    setLoading(false);
    emitSyncEvent();
  };

  const adminEditCategory = async (id: string, cat: Partial<Category>) => {
    checkAdminAuth();

    const nextCategories = categories.map(c => {
      if (c.id === id) {
        return { ...c, ...cat, image: id === 'evenementiel' ? eventBannerImage : (cat.image ?? c.image ?? getCategoryBannerSrc(id)) };
      }
      return c;
    });
    await setDoc(doc(db, SHARED_COLLECTIONS.categories, id), {
      ...categories.find(c => c.id === id),
      ...cat,
      image: id === 'evenementiel' ? eventBannerImage : (cat.image ?? getCategoryBannerSrc(id)),
      id
    });
    setCategories(nextCategories);
    emitSyncEvent();
  };

  const adminUpdateSiteSettings = async (settings: any) => {
    checkAdminAuth();

    setSiteSettings(settings);
    await setDoc(SITE_SETTINGS_DOC, settings);
    emitSyncEvent();
  };

  const replaceFirestoreCollection = async <T extends { id: string }>(collectionName: string, items: T[]) => {
    const existing = await getDocs(collection(db, collectionName));
    const batch = writeBatch(db);
    existing.docs.forEach((snapDoc) => batch.delete(snapDoc.ref));
    items.forEach((item) => batch.set(doc(db, collectionName, item.id), item));
    await batch.commit();
  };

  const adminImportBackup = async (backup: {
    products?: Product[];
    categories?: Category[];
    testimonials?: Testimonial[];
    promotions?: Promotion[];
    siteSettings?: any;
    orders?: Order[];
    quotes?: QuoteRequest[];
    stockHistory?: StockLog[];
    mediaItems?: any[];
    registeredUsers?: any[];
    reels?: any[];
  }) => {
    checkAdminAuth();

    if (Object.prototype.hasOwnProperty.call(backup, 'products') && Array.isArray(backup.products)) {
      await replaceFirestoreCollection('products', backup.products);
      setProducts(backup.products);
    }
    if (Object.prototype.hasOwnProperty.call(backup, 'categories') && Array.isArray(backup.categories)) {
      await replaceFirestoreCollection('categories', backup.categories);
      setCategories(backup.categories);
    }
    if (Object.prototype.hasOwnProperty.call(backup, 'testimonials') && Array.isArray(backup.testimonials)) {
      await replaceFirestoreCollection('testimonials', backup.testimonials);
      setTestimonials(backup.testimonials);
    }
    if (Object.prototype.hasOwnProperty.call(backup, 'promotions') && Array.isArray(backup.promotions)) {
      await replaceFirestoreCollection('promotions', backup.promotions);
      setPromotions(backup.promotions);
    }
    if (Object.prototype.hasOwnProperty.call(backup, 'siteSettings') && backup.siteSettings) {
      const normalizedSiteSettings = {
        ...DEFAULT_SITE_SETTINGS,
        ...backup.siteSettings,
        slides: Array.isArray(backup.siteSettings?.slides) && backup.siteSettings.slides.length > 0
            ? backup.siteSettings.slides.map((slide: any, index: number) => ({
              image: slide?.image || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].image,
              title: slide?.title || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].title,
              highlight: slide?.highlight || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].highlight,
              subTitle: slide?.subTitle || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].subTitle,
              headlineTop: slide?.headlineTop || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].headlineTop,
              headlineAccent: slide?.headlineAccent || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].headlineAccent,
              headlineBottom: slide?.headlineBottom || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].headlineBottom,
              body: slide?.body || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].body,
              body2: slide?.body2 || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].body2,
              meta: slide?.meta || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].meta,
              btnText: slide?.btnText || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].btnText,
              btnLink: slide?.btnLink || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].btnLink,
              features: Array.isArray(slide?.features) && slide.features.length > 0
                ? slide.features
                : DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].features,
              imagePosition: slide?.imagePosition || DEFAULT_SITE_SETTINGS.slides[index % DEFAULT_SITE_SETTINGS.slides.length].imagePosition,
              isPrecomposed: true,
            }))
          : DEFAULT_SITE_SETTINGS.slides
      };
      await setDoc(SITE_SETTINGS_DOC, normalizedSiteSettings);
      setSiteSettings(normalizedSiteSettings);
    }

    if (Object.prototype.hasOwnProperty.call(backup, 'orders') && Array.isArray(backup.orders)) {
      localStorage.setItem('art_table_orders', JSON.stringify(backup.orders));
    }
    if (Object.prototype.hasOwnProperty.call(backup, 'quotes') && Array.isArray(backup.quotes)) {
      localStorage.setItem('art_table_quotes', JSON.stringify(backup.quotes));
    }
    if (Object.prototype.hasOwnProperty.call(backup, 'stockHistory') && Array.isArray(backup.stockHistory)) {
      localStorage.setItem('art_table_stock_history', JSON.stringify(backup.stockHistory));
    }
    if (Object.prototype.hasOwnProperty.call(backup, 'mediaItems') && Array.isArray(backup.mediaItems)) {
      localStorage.setItem('art_table_media_items', JSON.stringify(backup.mediaItems));
      localStorage.setItem('art_table_demo_media_items', JSON.stringify(backup.mediaItems));
    }
    if (Object.prototype.hasOwnProperty.call(backup, 'registeredUsers') && Array.isArray(backup.registeredUsers)) {
      localStorage.setItem('art_table_registered_users', JSON.stringify(backup.registeredUsers));
    }
    if (Object.prototype.hasOwnProperty.call(backup, 'reels') && Array.isArray(backup.reels)) {
      localStorage.setItem('art_table_reels', JSON.stringify(backup.reels));
    }

    syncPrivateCollectionsFromStorage();
    emitSyncEvent();
  };

  return (
    <AppContext.Provider value={{
      currentView,
      setView,
      selectedProductId,
      selectedCategoryId,
      setSelectedProduct,
      setSelectedCategory,
      searchQuery: searchQueryState,
      setSearchQuery,
      catalogSortBy: catalogSortByState,
      setCatalogSortBy,
      catalogMinQtyOnly: catalogMinQtyOnlyState,
      setCatalogMinQtyOnly,
      products,
      categories,
      testimonials,
      promotions,
      orders,
      quotes,
      stockHistory,
      loading,
      refreshCollections,
      currentUser,
      authLoading,
      loginWithGoogle,
      registerWithEmail,
      loginWithEmail,
      logout,
      cart,
      cartActivity,
      dismissCartActivity,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      appliedPromo,
      applyPromoCode,
      removePromo,
      cartTotals,
      deliveryMethod,
      setDeliveryMethod,
      paymentMethod,
      setPaymentMethod,
      placeOrder,
      submitQuoteRequest,
      triggerWhatsAppOrder,
      triggerWhatsAppQuote,
      adminUpdateOrderStatus,
      adminUpdateQuoteStatus,
      adminAddProduct,
      adminEditProduct,
      adminDeleteProduct,
      adminClearAllProducts,
      adminReseedCatalog,
      adminImportBackup,
      siteSettings,
      adminEditCategory,
      adminUpdateSiteSettings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
};
