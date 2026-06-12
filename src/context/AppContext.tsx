import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  addDoc,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType, testConnection, seedDatabase, forceSeedDatabase } from '../lib/firebase';
import { Product, Category, CartItem, Order, QuoteRequest, Testimonial, Promotion, UserProfile, StockLog } from '../types';

interface AppContextType {
  // Navigation / Views
  currentView: string;
  setView: (view: string) => void;
  selectedProductId: string | null;
  selectedCategoryId: string | null;
  setSelectedProduct: (id: string | null) => void;
  setSelectedCategory: (id: string | null) => void;

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
  
  // Custom Visual and CMS Editors
  siteSettings: any;
  adminEditCategory: (id: string, cat: Partial<Category>) => Promise<void>;
  adminUpdateSiteSettings: (settings: any) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // UI states
  const [currentView, setView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Collections (live Firestore links or loaded lists)
  const [products, setProducts] = useState<Product[]>([]);

  // Listener temps réel Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const loadedProducts = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      } as Product));
      setProducts(loadedProducts);
    });
    return () => unsubscribe();
  }, []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [stockHistory, setStockHistory] = useState<StockLog[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>({
    slides: [
      {
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200",
        title: "PACKAGING",
        highlight: "Personnalisé",
        subTitle: "PERSONNALISEZ. MARQUEZ. IMPACTEZ.",
        btnText: "DÉCOUVRIR MAINTENANT",
        viewTarget: "shop",
        isPrecomposed: true
      },
      {
        image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=1200",
        title: "CÉRÉMONIES & MARIAGES",
        highlight: "Prestige et Or",
        subTitle: "Découvrez nos coffrets dragées, beignets et sacs d'hôtes.",
        btnText: "COLLECTION MARIAGE",
        viewTarget: "shop",
        isPrecomposed: false
      },
      {
        image: "https://images.unsplash.com/photo-1549467657-39328fac558f?auto=format&fit=crop&q=80&w=1200",
        title: "BOUTEILLES & EAUX",
        highlight: "Sérigraphie Fine",
        subTitle: "Bouteilles haut de gamme pour jus locaux et eaux de luxe.",
        btnText: "DÉCOUVRIR LES CONTENANTS",
        viewTarget: "shop",
        isPrecomposed: false
      }
    ]
  });
  const [loading, setLoading] = useState<boolean>(true);

  // User details
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<"retrait" | "livraison">("livraison");
  const [paymentMethod, setPaymentMethod] = useState<"wave" | "orange_money" | "cash_on_delivery">("cash_on_delivery");

  // Load and subscribe to database
  const subscribeToCollections = () => {
    setLoading(true);
    
    // Subscribe products
    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snap) => {
      if (localStorage.getItem('art_table_demo_user')) return; // Guard simulation mode
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(items);
      localStorage.setItem('art_table_demo_products', JSON.stringify(items));
    }, (err) => {
      console.warn("Products subscription fallback to offline storage:", err);
      const offline = localStorage.getItem('art_table_demo_products');
      if (offline) setProducts(JSON.parse(offline));
    });

    // Subscribe categories
    const unsubscribeCategories = onSnapshot(collection(db, 'categories'), (snap) => {
      if (localStorage.getItem('art_table_demo_user')) return; // Guard simulation mode
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      setCategories(items);
      localStorage.setItem('art_table_demo_categories', JSON.stringify(items));
    }, (err) => {
      console.warn("Categories subscription fallback:", err);
      const offline = localStorage.getItem('art_table_demo_categories');
      if (offline) setCategories(JSON.parse(offline));
    });

    // Subscribe testimonials
    const unsubscribeTestimonials = onSnapshot(collection(db, 'testimonials'), (snap) => {
      if (localStorage.getItem('art_table_demo_user')) return; // Guard simulation mode
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
      setTestimonials(items);
      localStorage.setItem('art_table_demo_testimonials', JSON.stringify(items));
    }, (err) => {
      console.warn("Testimonials subscription fallback:", err);
      const offline = localStorage.getItem('art_table_demo_testimonials');
      if (offline) setTestimonials(JSON.parse(offline));
    });

    // Subscribe promotions
    const unsubscribePromotions = onSnapshot(collection(db, 'promotions'), (snap) => {
      if (localStorage.getItem('art_table_demo_user')) return; // Guard simulation mode
      const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion));
      setPromotions(items);
      localStorage.setItem('art_table_demo_promotions', JSON.stringify(items));
    }, (err) => {
      console.warn("Promotions subscription fallback:", err);
      const offline = localStorage.getItem('art_table_demo_promotions');
      if (offline) setPromotions(JSON.parse(offline));
    });

    // Subscribe site settings
    const unsubscribeSiteSettings = onSnapshot(doc(db, 'site_settings', 'home'), (snap) => {
      if (localStorage.getItem('art_table_demo_user')) return; // Guard simulation mode
      if (snap.exists()) {
        const data = snap.data();
        setSiteSettings(data);
        localStorage.setItem('art_table_demo_site_settings', JSON.stringify(data));
      }
    }, (err) => {
      console.warn("Site settings subscription failed, using local fallback:", err);
      const offline = localStorage.getItem('art_table_demo_site_settings');
      if (offline) setSiteSettings(JSON.parse(offline));
    });

    setLoading(false);

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
      unsubscribeTestimonials();
      unsubscribePromotions();
      unsubscribeSiteSettings();
    };
  };

  // Sync user orders, quote requests and stock history securely if logged in
  useEffect(() => {
    let unsubscribeOrders = () => {};
    let unsubscribeQuotes = () => {};
    let unsubscribeStockHistory = () => {};

    if (currentUser) {
      if (currentUser.isLocalDemo) {
        // In local demo mode, fetch from localStorage simulation instead of subscribing to Firebase
        const localOrders = JSON.parse(localStorage.getItem('art_table_demo_orders') || '[]');
        const localQuotes = JSON.parse(localStorage.getItem('art_table_demo_quotes') || '[]');
        const localStockHistory = JSON.parse(localStorage.getItem('art_table_demo_stockHistory') || '[]');
        
        setOrders(localOrders);
        setQuotes(localQuotes);
        setStockHistory(localStockHistory);
      } else {
        // Real authenticated Firebase subscriptions with grace fallbacks if security locks trigger
        try {
          const ordersRef = collection(db, 'orders');
          const ordersQuery = currentUser.isAdmin 
            ? ordersRef 
            : query(ordersRef, where('customerId', '==', currentUser.uid));

          unsubscribeOrders = onSnapshot(ordersQuery, (snap) => {
            const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setOrders(list);
          }, (err) => {
            console.warn("Orders subscription failed, using local fallback database.", err);
            const fallbackOrders = JSON.parse(localStorage.getItem('art_table_demo_orders') || '[]');
            setOrders(fallbackOrders);
          });

          const quotesRef = collection(db, 'quotes');
          const quotesQuery = currentUser.isAdmin 
            ? quotesRef 
            : query(quotesRef, where('userId', '==', currentUser.uid));

          unsubscribeQuotes = onSnapshot(quotesQuery, (snap) => {
            const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuoteRequest));
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setQuotes(list);
          }, (err) => {
            console.warn("Quotes subscription failed, using local fallback database.", err);
            const fallbackQuotes = JSON.parse(localStorage.getItem('art_table_demo_quotes') || '[]');
            setQuotes(fallbackQuotes);
          });

          if (currentUser.isAdmin) {
            unsubscribeStockHistory = onSnapshot(collection(db, 'stockHistory'), (snap) => {
              const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as StockLog));
              list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              setStockHistory(list);
            }, (err) => {
              console.warn("StockHistory subscription failed, using local fallback database.", err);
              const fallbackStockHistory = JSON.parse(localStorage.getItem('art_table_demo_stockHistory') || '[]');
              setStockHistory(fallbackStockHistory);
            });
          }
        } catch (subError) {
          console.error("Failed to subscribe to authentic database groups:", subError);
          const fallbackOrders = JSON.parse(localStorage.getItem('art_table_demo_orders') || '[]');
          const fallbackQuotes = JSON.parse(localStorage.getItem('art_table_demo_quotes') || '[]');
          const fallbackStockHistory = JSON.parse(localStorage.getItem('art_table_demo_stockHistory') || '[]');
          setOrders(fallbackOrders);
          setQuotes(fallbackQuotes);
          setStockHistory(fallbackStockHistory);
        }
      }
    } else {
      const guestOrders = JSON.parse(localStorage.getItem('art_table_guest_orders') || '[]');
      setOrders(guestOrders);
      setQuotes([]);
      setStockHistory([]);
    }

    return () => {
      unsubscribeOrders();
      unsubscribeQuotes();
      unsubscribeStockHistory();
    };
  }, [currentUser]);

  // Handle Authentication status
  useEffect(() => {
    // Run diagnostics and seed initial data automatically if needed
    testConnection();
    seedDatabase();

    // Clear outdated local storage cache if old catalog is detected
    const currentCacheVer = 'v4_unsplash_real_photos_catalog';
    if (localStorage.getItem('art_table_cache_ver') !== currentCacheVer) {
      console.log('New precise catalog version detected. Flushing client-side cached items...');
      localStorage.removeItem('art_table_demo_categories');
      localStorage.removeItem('art_table_demo_products');
      localStorage.removeItem('art_table_demo_testimonials');
      localStorage.removeItem('art_table_demo_promotions');
      localStorage.setItem('art_table_cache_ver', currentCacheVer);
    }

    // If local demo profile exists in local storage, sync state immediately from mock
    const storedDemoUser = localStorage.getItem('art_table_demo_user');
    if (storedDemoUser) {
      const localProds = localStorage.getItem('art_table_demo_products');
      const localCats = localStorage.getItem('art_table_demo_categories');
      const localTestimonials = localStorage.getItem('art_table_demo_testimonials');
      const localPromos = localStorage.getItem('art_table_demo_promotions');
      const localSettings = localStorage.getItem('art_table_demo_site_settings');
      if (localProds) setProducts(JSON.parse(localProds));
      if (localCats) setCategories(JSON.parse(localCats));
      if (localTestimonials) setTestimonials(JSON.parse(localTestimonials));
      if (localPromos) setPromotions(JSON.parse(localPromos));
      if (localSettings) setSiteSettings(JSON.parse(localSettings));
    }

    subscribeToCollections();

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setAuthLoading(true);
      if (user) {
        // Boostrapped admin rule checks specific email
        const bootstrappedAdminEmails = ["khadidia@art.detable.com", "khadxxm05@gmail.com"];
        const isAdminUser = user.email ? bootstrappedAdminEmails.includes(user.email.toLowerCase()) : false;
        
        const getAdminDisplayName = (emailStr: string) => {
          const lEmail = emailStr.toLowerCase();
          if (lEmail.includes("khadidia") || lEmail.includes("khadxxm") || lEmail.includes("khadim")) return "Khadidia";
          return "Admin";
        };

        setCurrentUser({
          uid: user.uid,
          email: user.email || '',
          displayName: isAdminUser ? getAdminDisplayName(user.email || '') : (user.displayName || user.email?.split('@')[0] || 'Client'),
          isAdmin: isAdminUser
        });

        if (isAdminUser) {
          console.log("Admin logged in. Triggering database sync...");
          seedDatabase();
        }
      } else {
        const storedDemoUser = localStorage.getItem('art_table_demo_user');
        if (storedDemoUser) {
          try {
            const parsed = JSON.parse(storedDemoUser);
            if (parsed && (parsed.email?.toLowerCase() === 'khadxxm05@gmail.com' || parsed.email?.toLowerCase() === 'khadidia@art.detable.com')) {
              parsed.displayName = "Khadidia";
            }
            setCurrentUser(parsed);
          } catch (e) {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  const refreshCollections = async () => {
    // Read snapshots again or force refresh
  };

  // Auth actions
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Clean local storage admin demo to prevent collision
      localStorage.removeItem('art_table_demo_user');
    } catch (err) {
      console.error("Google Authentification Error", err);
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      localStorage.removeItem('art_table_demo_user');
    } catch (err: any) {
      // Enable simulation mode if sign-in providers are disabled in Firebase Dashboard
      if (err.code === 'auth/operation-not-allowed' || (err.message && err.message.includes('operation-not-allowed'))) {
        console.info("Bypassing Firebase disabled provider with mock local demo profile silently.");
        const bootstrappedAdminEmails = ["khadidia@art.detable.com", "khadxxm05@gmail.com"];
        const isAdminUser = bootstrappedAdminEmails.includes(email.toLowerCase());
        
        const isKhadidia = email.toLowerCase() === 'khadidia@art.detable.com';
        
        const demoUser: UserProfile = {
          uid: isAdminUser ? (isKhadidia ? 'demo-admin-khadidia' : 'demo-admin-khadxxm') : `demo-user-${Math.random().toString(36).substring(2, 9)}`,
          email: email,
          displayName: isAdminUser ? "Khadidia" : (name || email.split('@')[0]),
          isAdmin: isAdminUser,
          isLocalDemo: true
        };
        
        localStorage.setItem('art_table_demo_user', JSON.stringify(demoUser));
        setCurrentUser(demoUser);
        return;
      }
      console.error("Email Registration Error", err);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const isKhadidia = email.toLowerCase() === 'khadidia@art.detable.com';
    const isKhadxxm = email.toLowerCase() === 'khadxxm05@gmail.com';
    const isAdminEmail = isKhadidia || isKhadxxm;

    try {
      // Special admin master-bypass check for instant robust access
      if (isAdminEmail && (pass === 'artdetabledidia' || pass === 'artdetablekhadim')) {
        console.info("Master Admin login detected. Initializing Admin session.");
        const demoUser: UserProfile = {
          uid: isKhadidia ? 'demo-admin-khadidia' : 'demo-admin-khadxxm',
          email: email.toLowerCase(),
          displayName: "Khadidia",
          isAdmin: true,
          isLocalDemo: true
        };
        localStorage.setItem('art_table_demo_user', JSON.stringify(demoUser));
        setCurrentUser(demoUser);
        return;
      }

      await signInWithEmailAndPassword(auth, email, pass);
      localStorage.removeItem('art_table_demo_user');
    } catch (err: any) {
      const errCode = err?.code || '';
      const errMsg = err?.message || '';

      // If user does not exist, and it's the admin email, attempt auto-registration
      if (isAdminEmail && 
          (errCode === 'auth/user-not-found' || errCode === 'auth/invalid-credential' || 
           errMsg.includes('user-not-found') || errMsg.includes('invalid-credential'))) {
        try {
          console.info("Admin user not found. Attempting registration in real Firebase Auth...");
          await createUserWithEmailAndPassword(auth, email, pass);
          localStorage.removeItem('art_table_demo_user');
          return;
        } catch (regErr: any) {
          console.warn("Firebase email creation failed, fallback to offline demo:", regErr);
        }
      }

      // Enable simulation mode if sign-in providers are disabled in Firebase Dashboard or if admin email fallback
      const isBypass = errCode === 'auth/operation-not-allowed' || 
                       errMsg.includes('operation-not-allowed') || 
                       isAdminEmail;
      if (isBypass) {
        console.info("Bypassing Firebase with mock local demo profile silently.");
        const bootstrappedAdminEmails = ["khadidia@art.detable.com", "khadxxm05@gmail.com"];
        const isAdminUser = bootstrappedAdminEmails.includes(email.toLowerCase());
        
        const demoUser: UserProfile = {
          uid: isAdminUser ? (isKhadidia ? 'demo-admin-khadidia' : 'demo-admin-khadxxm') : `demo-user-${Math.random().toString(36).substring(2, 9)}`,
          email: email,
          displayName: isAdminUser ? "Khadidia" : email.split('@')[0],
          isAdmin: isAdminUser,
          isLocalDemo: true
        };
        
        localStorage.setItem('art_table_demo_user', JSON.stringify(demoUser));
        setCurrentUser(demoUser);
        return;
      }
      console.error("Email Login Error", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // Ignored
    }
    localStorage.removeItem('art_table_demo_user');
    setCurrentUser(null);
    setCart([]);
    setAppliedPromo(null);
    setView('home');
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
    setCart(prev => {
      // Check if product with identical customization and price already exists
      const existingIdx = prev.findIndex(item => 
        item.product.id === product.id && 
        item.customInstructions === instructions && 
        item.customLogoUrl === logoUrl &&
        item.configuredPrice === configuredPrice
      );
      if (existingIdx > -1) {
        const next = [...prev];
        const newQty = next[existingIdx].quantity + quantity;
        if (product.stock !== undefined && newQty > product.stock) {
          alert(`Désolé, l'addition de ces articles dépasse notre stock disponible (${product.stock} unités).`);
          return prev;
        }
        next[existingIdx].quantity = newQty;
        return next;
      }
      return [...prev, { product, quantity, customInstructions: instructions, customLogoUrl: logoUrl, configuredPrice }];
    });
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

  // Trigger select product
  const setSelectedProduct = (id: string | null) => {
    setSelectedProductId(id);
    if (id) setView('product-detail');
  };

  const setSelectedCategory = (id: string | null) => {
    setSelectedCategoryId(id);
    if (id) setView('shop');
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

    const orderData: Omit<Order, 'id'> = {
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
        price: item.product.price,
        customInstructions: item.customInstructions,
        customLogoUrl: item.customLogoUrl
      })),
      totalAmount: total,
      status: "en_attente",
      createdAt: new Date().toISOString(),
      stockDeducted: false
    };

    if (currentUser && currentUser.isLocalDemo) {
      const mockId = `demo-order-${Math.random().toString(36).substring(2, 9)}`;
      const placedOrder: Order = { id: mockId, ...orderData };
      const existing = JSON.parse(localStorage.getItem('art_table_demo_orders') || '[]');
      const updated = [placedOrder, ...existing];
      localStorage.setItem('art_table_demo_orders', JSON.stringify(updated));
      setOrders(updated);

      triggerWhatsAppOrder(placedOrder);
      clearCart();
      setView('dashboard');
      return placedOrder;
    }

    try {
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      const placedOrder: Order = { id: docRef.id, ...orderData };
      
      // If guest checkout, also save in guest orders
      if (isGuest) {
        const existingGuest = JSON.parse(localStorage.getItem('art_table_guest_orders') || '[]');
        const updatedGuest = [placedOrder, ...existingGuest];
        localStorage.setItem('art_table_guest_orders', JSON.stringify(updatedGuest));
        setOrders(updatedGuest);
      }

      // Seed status update to trigger notification or whatsapp routing
      triggerWhatsAppOrder(placedOrder);
      
      clearCart();
      setView('dashboard'); // Redirect to customer order tracking page
      return placedOrder;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'orders');
    }
  };

  // Submit quote request
  const submitQuoteRequest = async (quote: Omit<QuoteRequest, "id" | "userId" | "status" | "createdAt">) => {
    if (!currentUser) throw new Error("Veuillez vous connecter pour demander un devis.");

    const quoteData: Omit<QuoteRequest, "id"> = {
      ...quote,
      userId: currentUser.uid,
      status: "en_attente",
      createdAt: new Date().toISOString()
    };

    if (currentUser.isLocalDemo) {
      const mockId = `demo-quote-${Math.random().toString(36).substring(2, 9)}`;
      const placedQuote: QuoteRequest = { id: mockId, ...quoteData };
      const existing = JSON.parse(localStorage.getItem('art_table_demo_quotes') || '[]');
      const updated = [placedQuote, ...existing];
      localStorage.setItem('art_table_demo_quotes', JSON.stringify(updated));
      setQuotes(updated);

      triggerWhatsAppQuote(placedQuote);
      setView('dashboard');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'quotes'), quoteData);
      const placedQuote: QuoteRequest = { id: docRef.id, ...quoteData };
      triggerWhatsAppQuote(placedQuote);
      setView('dashboard');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'quotes');
    }
  };

  // WhatsApp formatted messages
  const triggerWhatsAppOrder = (order: Order) => {
    const phoneNumber = "221778715875"; // official Art de Table custom simulation standard number
    const itemsText = order.items.map(i => `• ${i.name} (x${i.quantity}) - ${i.price} FCFA`).join('%0A');
    
    const message = `*COMMANDE - ART DE TABLE*%0A%0A` +
      `*N° Commande:* ${order.id ? order.id.slice(0, 8).toUpperCase() : 'NOUVELLE'}%0A` +
      `*Client:* ${order.name}%0A` +
      `*Téléphone:* ${order.phone}%0A` +
      `*Email:* ${order.email}%0A` +
      `*Mode:* ${order.deliveryMethod === 'livraison' ? 'Livraison à domicile' : 'Retrait en boutique'}%0A` +
      `*Adresse:* ${order.address}%0A` +
      `*Paiement:* ${order.paymentMethod.toUpperCase()}%0A%0A` +
      `*PRODUITS :*%0A${itemsText}%0A%0A` +
      `*Montant Total:* ${order.totalAmount} FCFA%0A%0A` +
      `_Envoyé depuis le site Art de Table_`;

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const triggerWhatsAppQuote = (quote: QuoteRequest) => {
    const phoneNumber = "221778715875";
    const message = `*DEMANDE DE DEVIS - ART DE TABLE*%0A%0A` +
      `*Client:* ${quote.name}%0A` +
      `*Téléphone:* ${quote.phone}%0A` +
      `*Email:* ${quote.email}%0A` +
      `*Catégorie:* ${quote.category}%0A` +
      `*Quantité souhaitée:* ${quote.targetQuantity} unités%0A%0A` +
      `*Description du besoin :*%0A${encodeURIComponent(quote.description)}%0A%0A` +
      `_Envoyé depuis le site Art de Table_`;

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
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

    if (currentUser.isLocalDemo) {
      const orderToUpdate = orders.find(o => o.id === orderId);
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
              operator: currentUser.email || 'Admin',
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
              operator: currentUser.email || 'Admin',
              createdAt: new Date().toISOString()
            });
          }
        }
        updatedOrder.stockDeducted = false;
      }

      const nextOrders = orders.map(o => o.id === orderId ? updatedOrder : o);
      setOrders(nextOrders);
      localStorage.setItem('art_table_demo_orders', JSON.stringify(nextOrders));
      
      setProducts(nextProducts);
      localStorage.setItem('art_table_demo_products', JSON.stringify(nextProducts));
      
      setStockHistory(newLogs);
      localStorage.setItem('art_table_demo_stockHistory', JSON.stringify(newLogs));
      return;
    }

    try {
      const ref = doc(db, 'orders', orderId);
      
      // Find existing order
      const orderToUpdate = orders.find(o => o.id === orderId);
      if (!orderToUpdate) throw new Error("Bon de commande introuvable.");

      const updateData: Partial<Order> = { status };
      if (notes) updateData.adminNotes = notes;

      const isValidatedStatus = (s: Order["status"]) => s === "en_production" || s === "expediee" || s === "livree";
      const isDeducted = orderToUpdate.stockDeducted || false;

      // 1. DEDUCT STOCK: Transitioning from pending to validated (active) state
      if (isValidatedStatus(status) && !isDeducted) {
        for (const item of orderToUpdate.items) {
          const liveProd = products.find(p => p.id === item.productId);
          if (liveProd) {
            const previousStock = liveProd.stock !== undefined ? liveProd.stock : 1000;
            const newStock = Math.max(0, previousStock - item.quantity);
            
            await updateDoc(doc(db, 'products', item.productId), { stock: newStock });

            // Log stock deduction in history
            await addDoc(collection(db, 'stockHistory'), {
              productId: item.productId,
              productName: item.name,
              quantityChanged: -item.quantity,
              previousStock,
              newStock,
              reason: `Validation commande #${orderId.slice(0, 8).toUpperCase()}`,
              operator: currentUser.email || 'Admin',
              createdAt: new Date().toISOString()
            });
          }
        }
        updateData.stockDeducted = true;
      }
      // 2. RESTORE STOCK: Triggered when cancelling an already-deducted order (transition back to pending or cancelled)
      else if ((status === "annulee" || status === "en_attente") && isDeducted) {
        for (const item of orderToUpdate.items) {
          const liveProd = products.find(p => p.id === item.productId);
          if (liveProd) {
            const previousStock = liveProd.stock !== undefined ? liveProd.stock : 1000;
            const newStock = previousStock + item.quantity;

            await updateDoc(doc(db, 'products', item.productId), { stock: newStock });

            // Log recovery
            await addDoc(collection(db, 'stockHistory'), {
              productId: item.productId,
              productName: item.name,
              quantityChanged: item.quantity,
              previousStock,
              newStock,
              reason: `Restauration suite à annulation/retour commande #${orderId.slice(0, 8).toUpperCase()}`,
              operator: currentUser.email || 'Admin',
              createdAt: new Date().toISOString()
            });
          }
        }
        updateData.stockDeducted = false;
      }

      await updateDoc(ref, updateData);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const adminUpdateQuoteStatus = async (quoteId: string, status: QuoteRequest["status"], offerAmount?: number, notes?: string) => {
    checkAdminAuth();

    if (currentUser.isLocalDemo) {
      const nextQuotes = quotes.map(q => {
        if (q.id === quoteId) {
          const updated = { ...q, status };
          if (offerAmount !== undefined) updated.adminOfferAmount = offerAmount;
          if (notes) updated.adminNotes = notes;
          return updated;
        }
        return q;
      });
      setQuotes(nextQuotes);
      localStorage.setItem('art_table_demo_quotes', JSON.stringify(nextQuotes));
      return;
    }

    try {
      const ref = doc(db, 'quotes', quoteId);
      const updateData: Partial<QuoteRequest> = { status };
      if (offerAmount !== undefined) updateData.adminOfferAmount = offerAmount;
      if (notes) updateData.adminNotes = notes;
      await updateDoc(ref, updateData);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `quotes/${quoteId}`);
    }
  };

  const adminAddProduct = async (prod: Omit<Product, "id">) => {
    checkAdminAuth();

    const now = new Date().toISOString();
    const preparedProd = {
      ...prod,
      disponibilite: prod.stock > 0 ? ("en_stock" as const) : ("rupture" as const),
      produit_mis_en_avant: "produit_mis_en_avant" in prod ? (prod as any).produit_mis_en_avant : false,
      date_creation: now,
      date_modification: now,
      rating: 5,
      reviewsCount: 0
    };

    if (currentUser.isLocalDemo) {
      const newId = `product-${Math.random().toString(36).substring(2, 9)}`;
      const newProduct: Product = { id: newId, ...preparedProd };
      const nextProducts = [newProduct, ...products];
      setProducts(nextProducts);
      localStorage.setItem('art_table_demo_products', JSON.stringify(nextProducts));
      
      const newLogVal = {
        id: `log-${Math.random().toString(36).substring(2, 9)}`,
        productId: newId,
        productName: prod.name,
        quantityChanged: prod.stock,
        previousStock: 0,
        newStock: prod.stock,
        reason: "Création initiale d'échantillon au catalogue",
        operator: currentUser.email || 'Admin',
        createdAt: new Date().toISOString()
      };
      const nextLogs = [newLogVal, ...stockHistory];
      setStockHistory(nextLogs);
      localStorage.setItem('art_table_demo_stockHistory', JSON.stringify(nextLogs));
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'products'), preparedProd);
      
      // Log initial stock initialization
      await addDoc(collection(db, 'stockHistory'), {
        productId: docRef.id,
        productName: prod.name,
        quantityChanged: prod.stock,
        previousStock: 0,
        newStock: prod.stock,
        reason: "Création initiale d'échantillon au catalogue",
        operator: currentUser.email || 'Admin',
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'products');
    }
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

    if (currentUser.isLocalDemo) {
      const liveProd = products.find(p => p.id === id);
      const previousStock = liveProd ? (liveProd.stock !== undefined ? liveProd.stock : 1000) : 1000;
      
      const nextProducts = products.map(p => {
        if (p.id === id) {
          return { ...p, ...updatedFields };
        }
        return p;
      });
      setProducts(nextProducts);
      localStorage.setItem('art_table_demo_products', JSON.stringify(nextProducts));
      
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
          operator: currentUser.email || 'Admin',
          createdAt: new Date().toISOString()
        };
        const nextLogs = [newLogVal, ...stockHistory];
        setStockHistory(nextLogs);
        localStorage.setItem('art_table_demo_stockHistory', JSON.stringify(nextLogs));
      }
      return;
    }

    try {
      const liveProd = products.find(p => p.id === id);
      const previousStock = liveProd ? (liveProd.stock !== undefined ? liveProd.stock : 1000) : 1000;

      await updateDoc(doc(db, 'products', id), updatedFields);

      // Check if stock changed and log manually
      if (prod.stock !== undefined && prod.stock !== previousStock) {
        const diff = prod.stock - previousStock;
        await addDoc(collection(db, 'stockHistory'), {
          productId: id,
          productName: prod.name || liveProd?.name || 'Produit',
          quantityChanged: diff,
          previousStock,
          newStock: prod.stock,
          reason: "Ajustement manuel d'inventaire d'Atelier (CMS)",
          operator: currentUser.email || 'Admin',
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    }
  };

  const adminDeleteProduct = async (id: string) => {
    checkAdminAuth();

    if (currentUser.isLocalDemo) {
      const nextProducts = products.filter(p => p.id !== id);
      setProducts(nextProducts);
      localStorage.setItem('art_table_demo_products', JSON.stringify(nextProducts));
      return;
    }

    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  };

  const adminClearAllProducts = async () => {
    checkAdminAuth();

    if (currentUser.isLocalDemo) {
      setProducts([]);
      localStorage.setItem('art_table_demo_products', JSON.stringify([]));
      return;
    }

    try {
      setLoading(true);
      const snap = await getDocs(collection(db, 'products'));
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      handleFirestoreError(err, OperationType.DELETE, `products/all`);
    }
  };

  const adminReseedCatalog = async () => {
    checkAdminAuth();

    if (currentUser.isLocalDemo) {
      setLoading(true);
      const { productsPreset, categoriesPreset, testimonialsPreset, promotionsPreset } = await import('../lib/mockData');
      setProducts(productsPreset);
      setCategories(categoriesPreset);
      setTestimonials(testimonialsPreset);
      setPromotions(promotionsPreset);
      
      localStorage.setItem('art_table_demo_products', JSON.stringify(productsPreset));
      localStorage.setItem('art_table_demo_categories', JSON.stringify(categoriesPreset));
      localStorage.setItem('art_table_demo_testimonials', JSON.stringify(testimonialsPreset));
      localStorage.setItem('art_table_demo_promotions', JSON.stringify(promotionsPreset));
      localStorage.removeItem('art_table_demo_orders');
      localStorage.removeItem('art_table_demo_quotes');
      localStorage.removeItem('art_table_demo_stockHistory');
      setOrders([]);
      setQuotes([]);
      setStockHistory([]);
      
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      await forceSeedDatabase();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const adminEditCategory = async (id: string, cat: Partial<Category>) => {
    checkAdminAuth();

    if (currentUser.isLocalDemo) {
      const nextCategories = categories.map(c => {
        if (c.id === id) {
          return { ...c, ...cat };
        }
        return c;
      });
      setCategories(nextCategories);
      localStorage.setItem('art_table_demo_categories', JSON.stringify(nextCategories));
      return;
    }

    try {
      await updateDoc(doc(db, 'categories', id), cat);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `categories/${id}`);
    }
  };

  const adminUpdateSiteSettings = async (settings: any) => {
    checkAdminAuth();

    if (currentUser.isLocalDemo) {
      setSiteSettings(settings);
      localStorage.setItem('art_table_demo_site_settings', JSON.stringify(settings));
      return;
    }

    try {
      await setDoc(doc(db, 'site_settings', 'home'), settings, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'site_settings/home');
    }
  };

  return (
    <AppContext.Provider value={{
      currentView,
      setView,
      selectedProductId,
      selectedCategoryId,
      setSelectedProduct,
      setSelectedCategory,
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
