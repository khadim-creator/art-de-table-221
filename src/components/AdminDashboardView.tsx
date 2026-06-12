import React, { useState, useMemo, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useApp } from '../context/AppContext';
import { ProductMockup } from './ProductMockup';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import { 
  ShieldCheck, TrendingUp, DollarSign, Archive, ClipboardList, Settings, 
  Trash2, Edit3, PlusCircle, RefreshCw, Key, Filter, Percent, 
  Calendar, User, ShoppingBag, Eye, Printer, ArrowRight, Save, X, Phone, Mail, MapPin, Tag,
  Lock, LogOut, Check, Sparkles, AlertTriangle, History, ArrowUpRight, ArrowDownRight, Menu,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { Product, Order, QuoteRequest, Promotion, Category, StockLog } from '../types';

export const AdminDashboardView: React.FC = () => {
  const { 
    currentUser, 
    orders, 
    quotes, 
    products, 
    categories,
    promotions,
    stockHistory,
    setView,
    adminUpdateOrderStatus,
    adminUpdateQuoteStatus,
    adminAddProduct,
    adminEditProduct,
    adminDeleteProduct,
    adminClearAllProducts,
    adminReseedCatalog,
    loginWithEmail,
    logout
  } = useApp();

  // Selected tab & UI controller
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'quotes' | 'promotions' | 'clients' | 'content'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authorization Form for Direct Secure Login
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Devis response state holding inputs per Devis ID
  const [devisResponses, setDevisResponses] = useState<{
    [id: string]: { offerAmount: number; notes: string };
  }>({});

  const [adminMediaItems, setAdminMediaItems] = useState<any[]>([]);

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'media'), (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, url: doc.data().url, name: doc.data().name || 'Fichier' }));
        setAdminMediaItems(items);
      }, (err) => {
        const offlineMedia = localStorage.getItem('art_table_demo_media_items');
        if (offlineMedia) {
          try {
            setAdminMediaItems(JSON.parse(offlineMedia));
          } catch(e){}
        }
      });
      return () => unsub();
    } catch(err) {
      const offlineMedia = localStorage.getItem('art_table_demo_media_items');
      if (offlineMedia) {
        try {
          setAdminMediaItems(JSON.parse(offlineMedia));
        } catch(e){}
      }
    }
  }, []);

  // Product Form helpers
  const [productSubTab, setProductSubTab] = useState<'catalog' | 'history'>('catalog');
  const [expandedProductIds, setExpandedProductIds] = useState<{[productId: string]: boolean}>({});
  const [inlineEditingProductId, setInlineEditingProductId] = useState<string | null>(null);
  const [inlineEditForm, setInlineEditForm] = useState<{
    name: string;
    price: number;
    category: string;
    description: string;
    minQty: number;
    productionDelay: string;
    imageUrl: string;
    images: string[];
    stock: number;
    videoUrl: string;
  }>({
    name: '',
    price: 0,
    category: '',
    description: '',
    minQty: 0,
    productionDelay: '',
    imageUrl: '',
    images: [],
    stock: 0,
    videoUrl: ''
  });

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [inlineStocks, setInlineStocks] = useState<{[productId: string]: string}>({});
  
  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    price: 1500,
    category: 'evenementiel',
    description: '',
    minQty: 100,
    productionDelay: '7-10 jours',
    imageUrl: '',
    images: [] as string[],
    stock: 1000,
    videoUrl: ''
  });

  const [productImagePicker, setProductImagePicker] = useState<{
    onSelect: (url: string) => void;
    title: string;
  } | null>(null);

  // Filters
  const [productFilterCat, setProductFilterCat] = useState<string>('all');
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');

  // Backstage reels state & handlers with LocalStorage synchronization
  const [adminReels, setAdminReels] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('art_table_reels');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasTiktokVideos = parsed.some(item => item.videoUrl && (item.videoUrl.includes('tiktok.com') || item.videoUrl.includes('embed')));
          if (hasTiktokVideos) {
            return parsed;
          }
        }
      }
    } catch (e) {}
    return [
      {
        id: "reel-1",
        title: "Unboxing de nos Boîtes Dragées d'Or royal & Rubans poudrés pour un mariage princier dakarois 🎀",
        hashtag: "#artdetable #giftpacking #dakar #senegal",
        likes: "25.3K",
        comments: "612",
        videoUrl: "https://www.tiktok.com/@art_de_table/video/7332156821421098246",
        poster: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=400",
        duration: "0:15"
      },
      {
        id: "reel-2",
        title: "La brillance de nos Bouteilles d'Eau Prestige Personnalisées waterproof sous l'ensoleillement de Dakar 💧",
        hashtag: "#bouteillepersonnalisée #luxurypackaging #mariagesenegalais",
        likes: "18.9K",
        comments: "420",
        videoUrl: "https://www.tiktok.com/@art_de_table/video/7335294382015629114",
        poster: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400",
        duration: "0:18"
      }
    ];
  });

  const [newReelForm, setNewReelForm] = useState({
    title: '',
    hashtag: '#artdetable #chictendance',
    videoUrl: '',
    duration: '0:15'
  });

  const handleAddReelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReelForm.title || !newReelForm.videoUrl) {
      alert("Veuillez remplir le titre et le lien de la vidéo.");
      return;
    }

    const newReel = {
      id: "reel-" + Date.now(),
      title: newReelForm.title,
      hashtag: newReelForm.hashtag,
      likes: (Math.random() * 15 + 1).toFixed(1) + "K",
      comments: Math.floor(Math.random() * 400 + 50).toString(),
      videoUrl: newReelForm.videoUrl,
      poster: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400",
      duration: newReelForm.duration
    };

    const updated = [newReel, ...adminReels];
    setAdminReels(updated);
    localStorage.setItem('art_table_reels', JSON.stringify(updated));
    
    // Broadcast update across frames/windows
    window.dispatchEvent(new Event('art_table_reels_updated'));
    
    setNewReelForm({
      title: '',
      hashtag: '#artdetable #chictendance',
      videoUrl: '',
      duration: '0:15'
    });
    alert("Vidéo d'atelier ajoutée avec succès !");
  };

  const handleDeleteReel = (reelId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir retirer cette vidéo backstage ?")) return;
    const updated = adminReels.filter(r => r.id !== reelId);
    setAdminReels(updated);
    localStorage.setItem('art_table_reels', JSON.stringify(updated));
    window.dispatchEvent(new Event('art_table_reels_updated'));
    alert("Vidéo retirée.");
  };
  
  // Print preview state
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);

  // Content configuration state
  const [contentForm, setContentForm] = useState({
    heroTitle: 'Maison de Personnalisation Événementielle',
    heroTagline: 'Nous transformons chaque événement en une expérience mémorable',
    contactPhone: '+221 77 871 58 75',
    contactAddress: 'Jardin Ouagou Niayes, côté marché HLM, Dakar, Sénégal'
  });

  // KPI Calculations
  const stats = useMemo(() => {
    const totalOrdersCount = orders.length;
    const pendingOrdersCount = orders.filter(o => o.status === 'en_attente').length;
    const productionOrdersCount = orders.filter(o => o.status === 'en_production').length;
    const deliveredOrdersCount = orders.filter(o => o.status === 'livree').length;
    
    const totalQuotesCount = quotes.length;
    const pendingQuotesCount = quotes.filter(q => q.status === 'en_attente').length;
    
    const turnover = orders
      .filter(o => o.status !== 'annulee')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return {
      totalOrdersCount,
      pendingOrdersCount,
      productionOrdersCount,
      deliveredOrdersCount,
      totalQuotesCount,
      pendingQuotesCount,
      turnover
    };
  }, [orders, quotes]);

  // Authorization check (Admin-Only domain)
  const isAuthorized = useMemo(() => {
    if (!currentUser) return false;
    const emailLower = currentUser.email?.toLowerCase();
    return currentUser.isAdmin || emailLower === 'khadidia@art.detable.com' || emailLower === 'khadxxm05@gmail.com';
  }, [currentUser]);

  // Direct login handler
  const handleDirectLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      await loginWithEmail(adminEmail, adminPassword);
      setAdminEmail('');
      setAdminPassword('');
    } catch (err: any) {
      setLoginError(err.message || 'Informations de connexion incorrectes.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleDeAuthLogout = async () => {
    if (window.confirm("Voulez-vous ré-enclencher le verrouillage de sécurité de l'Atelier ?")) {
      await logout();
      setView('home');
    }
  };

  // Handle unit quote response formulation
  const handleQuoteResponseFormSubmit = async (quoteId: string) => {
    const response = devisResponses[quoteId];
    if (!response || !response.offerAmount) {
      alert("Veuillez saisir un tarif unitaire proposé pour ce devis.");
      return;
    }

    try {
      await adminUpdateQuoteStatus(
        quoteId, 
        'modifie', 
        response.offerAmount, 
        response.notes || "Offre d'atelier validée pour dorage à chaud."
      );
      alert("La cotation a été enregistrée et transmise à l'Espace Client !");
    } catch (err) {
      alert("Une erreur s'est produite lors de la transmission.");
    }
  };

  const handleResponseChange = (quoteId: string, field: 'offerAmount' | 'notes', val: any) => {
    setDevisResponses(prev => ({
      ...prev,
      [quoteId]: {
        ...(prev[quoteId] || { offerAmount: 1500, notes: '' }),
        [field]: val
      }
    }));
  };

  // Convert Quote to Physical Order
  const handleConvertQuoteToOrder = async (quote: QuoteRequest) => {
    const response = devisResponses[quote.id];
    const finalPrice = response ? response.offerAmount : 1500;
    const finalNotes = response ? response.notes : "Proposition validée.";

    const orderPayload = {
      customerId: quote.userId,
      name: quote.name,
      phone: quote.phone,
      email: quote.email,
      address: "Dakar (Adresse de Cotation)",
      deliveryMethod: "livraison" as const,
      paymentMethod: "cash_on_delivery" as const,
      items: [{
        productId: `custom-${quote.category}`,
        name: `Kit personnalisé: ${quote.category.split('-').join(' ')}`,
        quantity: quote.targetQuantity,
        price: finalPrice,
        customInstructions: `${finalNotes} | Requis: ${quote.description}`,
        customLogoUrl: quote.customLogoUrl || ''
      }],
      totalAmount: finalPrice * quote.targetQuantity,
      status: "en_production" as const,
      createdAt: new Date().toISOString()
    };

    try {
      await adminUpdateQuoteStatus(quote.id, "accepte", finalPrice, "Transformé en commande physique d'atelier.");
      alert(`Félicitations ! Le devis de ${quote.name} a été transformé avec succès en une commande d'atelier en production d'une valeur de ${(finalPrice * quote.targetQuantity).toLocaleString()} FCFA !`);
    } catch (err) {
      alert("Impossible de compléter la conversion.");
    }
  };

  // Handle Product database addition
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name) return;

    try {
      const finalImages = productForm.images && productForm.images.length > 0 
        ? productForm.images 
        : [productForm.imageUrl || 'https://images.unsplash.com/photo-1549467657-39328fac558f?auto=format&fit=crop&q=80&w=600'];

      await adminAddProduct({
        name: productForm.name,
        price: productForm.price,
        category: productForm.category,
        description: productForm.description,
        minQty: productForm.minQty,
        productionDelay: productForm.productionDelay,
        images: finalImages,
        isCustomizable: true,
        stock: productForm.stock,
        rating: 5,
        reviewsCount: 0,
        videoUrl: productForm.videoUrl || ''
      });
      setIsAddingProduct(false);
      setProductForm({ name: '', price: 1500, category: 'evenementiel', description: '', minQty: 100, productionDelay: '7-10 jours', imageUrl: '', images: [], stock: 1000, videoUrl: '' });
      alert("Nouveau produit d'exception ajouté au catalogue d'ateliers !");
    } catch (err) {
      alert("Erreur d'ajout de produit.");
    }
  };

  const handleStartInlineEditing = (prod: Product) => {
    setInlineEditingProductId(prod.id);
    setInlineEditForm({
      name: prod.name,
      price: prod.price,
      category: prod.category,
      description: prod.description || '',
      minQty: prod.minQty,
      productionDelay: prod.productionDelay || '7-10 jours',
      imageUrl: prod.images?.[0] || '',
      images: prod.images || [],
      stock: prod.stock || 0,
      videoUrl: prod.videoUrl || ''
    });
  };

  const handleInlineEditSaveSubmit = async (prodId: string) => {
    try {
      const finalImages = inlineEditForm.images && inlineEditForm.images.length > 0
        ? inlineEditForm.images
        : [inlineEditForm.imageUrl || 'https://images.unsplash.com/photo-1549467657-39328fac558f?auto=format&fit=crop&q=80&w=600'];

      await adminEditProduct(prodId, {
        name: inlineEditForm.name,
        price: inlineEditForm.price,
        category: inlineEditForm.category,
        description: inlineEditForm.description,
        minQty: inlineEditForm.minQty,
        productionDelay: inlineEditForm.productionDelay,
        stock: inlineEditForm.stock,
        images: finalImages,
        videoUrl: inlineEditForm.videoUrl || ''
      });
      setInlineEditingProductId(null);
      alert("Félicitations, l'échantillon a été sauvegardé avec succès en ateliers !");
    } catch (err) {
      alert("Erreur de mise à jour de l'échantillon.");
    }
  };

  // Multiple Products Images Manipulation Utility Holders
  const handleProductImageAdd = (url: string, isInlineForm: boolean) => {
    if (!url) return;
    if (isInlineForm) {
      setInlineEditForm(prev => {
        const nextImgs = [...(prev.images || []), url];
        return {
          ...prev,
          images: nextImgs,
          imageUrl: nextImgs[0] || ''
        };
      });
    } else {
      setProductForm(prev => {
        const nextImgs = [...(prev.images || []), url];
        return {
          ...prev,
          images: nextImgs,
          imageUrl: nextImgs[0] || ''
        };
      });
    }
  };

  const handleProductImageRemove = (index: number, isInlineForm: boolean) => {
    if (isInlineForm) {
      const filtered = (inlineEditForm.images || []).filter((_, i) => i !== index);
      setInlineEditForm(prev => ({
        ...prev,
        images: filtered,
        imageUrl: filtered[0] || ''
      }));
    } else {
      const filtered = (productForm.images || []).filter((_, i) => i !== index);
      setProductForm(prev => ({
        ...prev,
        images: filtered,
        imageUrl: filtered[0] || ''
      }));
    }
  };

  const handleProductImageMove = (index: number, direction: 'left' | 'right', isInlineForm: boolean) => {
    const list = isInlineForm ? [...(inlineEditForm.images || [])] : [...(productForm.images || [])];
    const swapWith = direction === 'left' ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= list.length) return;

    const temp = list[index];
    list[index] = list[swapWith];
    list[swapWith] = temp;

    if (isInlineForm) {
      setInlineEditForm(prev => ({
        ...prev,
        images: list,
        imageUrl: list[0] || ''
      }));
    } else {
      setProductForm(prev => ({
        ...prev,
        images: list,
        imageUrl: list[0] || ''
      }));
    }
  };

  const handleProductImageSetPrimary = (index: number, isInlineForm: boolean) => {
    const list = isInlineForm ? [...(inlineEditForm.images || [])] : [...(productForm.images || [])];
    if (index === 0 || index >= list.length) return;

    // Shift to front
    const selected = list.splice(index, 1)[0];
    list.unshift(selected);

    if (isInlineForm) {
      setInlineEditForm(prev => ({
        ...prev,
        images: list,
        imageUrl: list[0] || ''
      }));
    } else {
      setProductForm(prev => ({
        ...prev,
        images: list,
        imageUrl: list[0] || ''
      }));
    }
  };

  const handleProductImageUploadFile = (e: React.ChangeEvent<HTMLInputElement>, isInlineForm: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      handleProductImageAdd(base64Url, isInlineForm);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle Product edit save
  const handleEditProductSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      await adminEditProduct(editingProduct.id, {
        name: editingProduct.name,
        price: editingProduct.price,
        category: editingProduct.category,
        description: editingProduct.description,
        minQty: editingProduct.minQty,
        productionDelay: editingProduct.productionDelay,
        stock: editingProduct.stock
      });
      setEditingProduct(null);
      alert("Les modifications du produit ont été synchronisées !");
    } catch (err) {
      alert("Erreur de mise à jour.");
    }
  };

  // Inline stock instant update action
  const handleInlineStockSave = async (productId: string, currentStock: number) => {
    const val = inlineStocks[productId];
    if (val === undefined || val === '') return;
    const nextStock = Number(val);
    if (isNaN(nextStock) || nextStock < 0) {
      alert("Veuillez saisir une quantité de stock valide.");
      return;
    }

    try {
      await adminEditProduct(productId, { stock: nextStock });
      setInlineStocks(prev => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    } catch (err) {
      alert("Erreur lors de la mise à jour immédiate du stock.");
    }
  };

  // Handle Factory Reset Seeder
  const handleReseedDb = async () => {
    const isConfirmed = window.confirm("ATTENTION: Cette action va entièrement réinitialiser la base de données Firestore et restaurer le catalogue d'ateliers d'origine (5 univers d'exception, 36 produits de luxe dakarois). Confirmez-vous ?");
    if (!isConfirmed) return;

    try {
      await adminReseedCatalog();
      alert("Félicitations ! La base de données a été restaurée avec succès avec les 5 univers et les 36 produits phares d'Art de Table !");
    } catch (err) {
      alert("Erreur lors de la réinitialisation de la base.");
    }
  };

  const handleClearDb = async () => {
    const isConfirmed = window.confirm("ATTENTION : Cette action va entièrement VIDER le catalogue de ses produits actuels afin de vous permettre de saisir les vôtres un à un avec vos tarifs. Confirmez-vous la suppression totale ?");
    if (!isConfirmed) return;

    try {
      await adminClearAllProducts();
      alert("Félicitations ! Le catalogue de produits a été entièrement vidé et est prêt pour vos nouvelles saisies.");
    } catch (err) {
      alert("Erreur lors de la suppression des produits du catalogue.");
    }
  };

  // Filter functions
  const filteredProducts = useMemo(() => {
    if (productFilterCat === 'all') return products;
    const targetCat = productFilterCat.toLowerCase().trim().replace(/-/g, '');
    return products.filter(p => {
      if (!p.category) return false;
      return p.category.toLowerCase().trim().replace(/-/g, '') === targetCat;
    });
  }, [products, productFilterCat]);

  const filteredOrders = useMemo(() => {
    if (orderFilterStatus === 'all') return orders;
    return orders.filter(o => o.status === orderFilterStatus);
  }, [orders, orderFilterStatus]);

  // Track low stock products (< 5 units)
  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.stock !== undefined && p.stock < 5);
  }, [products]);

  // Extract unique clients
  const clientsList = useMemo(() => {
    const clientsMap: { [uid: string]: { name: string; email: string; phone: string; totalOrdersCount: number; spendTotal: number } } = {};
    
    orders.forEach(o => {
      const parentId = o.customerId || 'invite';
      if (!clientsMap[parentId]) {
        clientsMap[parentId] = {
          name: o.name,
          email: o.email,
          phone: o.phone,
          totalOrdersCount: 0,
          spendTotal: 0
        };
      }
      clientsMap[parentId].totalOrdersCount += 1;
      clientsMap[parentId].spendTotal += o.totalAmount || 0;
    });

    quotes.forEach(q => {
      const parentId = q.userId || 'invite-devis';
      if (!clientsMap[parentId]) {
        clientsMap[parentId] = {
          name: q.name,
          email: q.email,
          phone: q.phone,
          totalOrdersCount: 0,
          spendTotal: 0
        };
      }
    });

    return Object.values(clientsMap);
  }, [orders, quotes]);

  // If not logged in or unauthorized, render an extremely elegant lockbox card with manual login form!
  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-[#111111] flex items-center justify-center py-20 px-4 text-left">
        <div className="absolute inset-0 opacity-15 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-[#D4AF37] filter blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-stone-700 filter blur-[150px]" />
        </div>

        <div className="relative bg-[#1A1A1A] border border-[#D4AF37]/25 p-8 sm:p-12 rounded-[2rem] max-w-lg w-full space-y-8 shadow-2xl">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-2">
              <Lock className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-white tracking-tight">Console d'Atelier</h2>
            <p className="text-xs text-stone-400 font-light leading-relaxed max-w-sm mx-auto">
              Accès réservé exclusivement au personnel certifié de la Maison **Art de Table** Dakar. Veuillez vous identifier pour gérer le catalogue et l'inventaire physique.
            </p>
          </div>

          <form onSubmit={handleDirectLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-stone-300 font-bold block">
                Adresse email d'administration
              </label>
              <input
                id="admin-form-email"
                type="email"
                required
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                placeholder="khadidia@art.detable.com"
                className="w-full px-4 py-3 bg-[#111111] text-sm text-stone-205 border border-stone-800 rounded-xl outline-none focus:border-[#D4AF37] transition text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-stone-300 font-bold block">
                Clé d'Atelier (Mot de passe)
              </label>
              <input
                id="admin-form-password"
                type="password"
                required
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                placeholder="artdetabledidia"
                className="w-full px-4 py-3 bg-[#111111] text-sm text-stone-205 border border-stone-800 rounded-xl outline-none focus:border-[#D4AF37] transition text-white"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-red-400 text-xs text-center font-mono">
                {loginError}
              </div>
            )}

            <button
              id="admin-login-submit"
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#D4AF37] hover:bg-[#C59B27] disabled:bg-stone-800 disabled:text-stone-605 text-neutral-900 font-bold text-xs uppercase tracking-widest py-4 rounded-xl cursor-pointer transition shadow-xl font-mono"
            >
              {loginLoading ? 'Authentification clé d\'or...' : 'Ouvrir l\'Atelier Principal'}
            </button>
          </form>

          {/* Elegant 1-click emergency/demo entry bypass */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={async () => {
                setLoginLoading(true);
                try {
                  await loginWithEmail('khadidia@art.detable.com', 'artdetabledidia');
                } catch (e) {
                  alert("Erreur d'accès d'urgence.");
                } finally {
                  setLoginLoading(false);
                }
              }}
              disabled={loginLoading}
              className="w-full bg-[#1F1F1F] hover:bg-[#252525] border border-[#D4AF37]/35 text-[#D4AF37] hover:text-white font-bold text-[10px] uppercase font-mono tracking-widest py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center space-x-2 shadow"
              title="Connexion d'urgence khadidia d'Atelier"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>1-Clic Khadidia (Atelier)</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                setLoginLoading(true);
                try {
                  await loginWithEmail('khadxxm05@gmail.com', 'artdetablekhadim');
                } catch (e) {
                  alert("Erreur d'accès d'urgence.");
                } finally {
                  setLoginLoading(false);
                }
              }}
              disabled={loginLoading}
              className="w-full bg-[#1F1F1F] hover:bg-[#252525] border border-[#D4AF37]/35 text-[#D4AF37] hover:text-white font-bold text-[10px] uppercase font-mono tracking-widest py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center space-x-2 shadow"
              title="Connexion d'urgence khadxxm de Gmail"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>1-Clic Khadidia (Gmail)</span>
            </button>
          </div>

          {/* Secure interactive helpful configuration assistant */}
          <div className="bg-[#1F1F1F] rounded-2xl border border-stone-800 p-5 space-y-3.5 text-xs text-stone-400">
            <h4 className="font-mono text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Note de Configuration Firebase
            </h4>
            <p className="text-[11px] leading-relaxed">
              Si l'authentification échoue avec l'erreur de sécurité <span className="text-stone-200 font-mono text-[9px] bg-stone-900 px-1 py-0.5 rounded">auth/operation-not-allowed</span> :
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-[10px] text-stone-400 pl-0.5 font-light leading-relaxed">
              <li>
                Allez dans votre <strong className="text-stone-200">Console Firebase</strong> &gt; section <strong className="text-stone-200">Authentication</strong>.
              </li>
              <li>
                Sélectionnez l'onglet <strong className="text-stone-200">Sign-in method</strong>.
              </li>
              <li>
                Activez le fournisseur <strong className="text-stone-200">Adresse e-mail/Mot de passe</strong> (Email/Password) puis enregistrez.
              </li>
            </ol>
            <div className="pt-2 border-t border-stone-800 text-[10px] text-stone-300 leading-normal flex gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-[#D4AF37]" />
              <span>
                <strong className="text-green-400">Accès Instantané :</strong> En utilisant l'un des boutons ci-dessus, la console s'ouvre automatiquement en toute sécurité avec tous les privilèges !
              </span>
            </div>
          </div>

          <div className="border-t border-[#D4AF37]/15 pt-6 text-center space-y-2">
            <p className="text-[10px] text-stone-500 font-mono">
              Admins privilégiés : <strong className="text-[#D4AF37]">khadidia@art.detable.com</strong> & <strong className="text-[#D4AF37]">khadxxm05@gmail.com</strong>
            </p>
            <button
              id="admin-quit-shop-btn"
              onClick={() => setView('shop')}
              className="text-xs text-stone-400 hover:text-[#D4AF37] underline transition font-light"
            >
              Retourner sur l'espace boutique
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col md:flex-row text-left font-sans">
      
      {/* 1. LEFT SIDEBAR Layout on desktop, collapsed mobile drawer */}
      <aside className={`w-full md:w-72 bg-[#111111] text-[#FAF6F0] flex flex-col shrink-0 border-b md:border-b-0 md:border-r border-[#D4AF37]/15 z-20 ${mobileMenuOpen ? 'block' : 'hidden md:flex'}`}>
        
        {/* Brand Header */}
        <div className="p-6 md:p-8 border-b border-stone-800 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-serif font-black tracking-wider text-white flex items-center space-x-2">
              <span className="text-[#D4AF37] font-sans">✦</span>
              <span>ART DE TABLE</span>
            </h1>
            <p className="text-[10px] text-[#C9B097] font-mono tracking-widest uppercase">Atelier d'Exception</p>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)} 
            className="md:hidden text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity widget */}
        <div className="px-6 py-4 border-b border-stone-800 bg-[#161616] flex items-center space-x-3 text-stone-300">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/35 flex items-center justify-center font-bold font-serif text-[#D4AF37]">
            {currentUser?.displayName ? currentUser.displayName[0].toUpperCase() : 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{currentUser?.displayName || 'Dakar Admin'}</p>
            <p className="text-[10px] text-stone-400 font-mono truncate">{currentUser?.email}</p>
          </div>
        </div>

        {/* Vertical Nav links */}
        <nav className="p-4 flex-1 space-y-1 overflow-y-auto no-scrollbar">
          {[
            { id: 'dashboard', label: 'Rapports & KPI', icon: TrendingUp },
            { id: 'products', label: 'Echantillons (Stock)', icon: Archive },
            { id: 'orders', label: 'Registre Commandes', icon: ClipboardList },
            { id: 'quotes', label: 'Cahiers des charges (Devis)', icon: Key },
            { id: 'promotions', label: 'Bannières & Coupons', icon: Percent },
            { id: 'clients', label: 'Annuaire Clients (CRM)', icon: User },
            { id: 'content', label: 'CMS Editeur Textes', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setPrintingOrder(null); setMobileMenuOpen(false); }}
                className={`w-full py-3 px-4 rounded-xl font-mono text-xs tracking-wide flex items-center space-x-3 transition cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#222222] text-[#D4AF37] border-l-4 border-[#D4AF37] font-bold shadow-sm'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#D4AF37]' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom utility rules */}
        <div className="p-4 border-t border-stone-800 space-y-2 mt-auto">
          <button
            onClick={() => setView('shop')}
            className="w-full bg-[#FAF6F0]/5 hover:bg-[#FAF6F0]/10 text-stone-300 py-3 rounded-xl border border-stone-800 text-xs font-semibold tracking-wider uppercase transition cursor-pointer flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Aller sur le magasin</span>
          </button>
          
          <button
            onClick={handleDeAuthLogout}
            className="w-full hover:bg-stone-900 text-red-400 hover:text-red-300 py-2.5 rounded-xl text-[11px] font-mono flex items-center justify-center space-x-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Verrouiller l'Atelier</span>
          </button>
        </div>

      </aside>

      {/* Mobile Sticky Navbar */}
      <div className="w-full md:hidden bg-[#111111] p-4 flex justify-between items-center z-13 sticky top-0 border-b border-[#D4AF37]/20 select-none">
        <h2 className="text-white font-serif font-black text-sm tracking-widest uppercase">Art de Table Backoffice</h2>
        <button 
          onClick={() => setMobileMenuOpen(true)} 
          className="text-[#FAF6F0] p-1 rounded-lg bg-stone-900 border border-stone-750"
        >
          <Menu className="w-5 h-5 text-[#D4AF37]" />
        </button>
      </div>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 space-y-8 overflow-y-auto max-h-screen">
        
        {/* Banner Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#D4AF37]/10 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-[#FAF6F0] border border-[#D4AF37]/35 px-3 py-1 rounded-full text-[#D4AF37] text-[10px] font-mono uppercase tracking-widest font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Système ERP Principal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-black text-neutral-900">
              {activeTab === 'dashboard' && "Performance & KPI Commercial"}
              {activeTab === 'products' && "Catalogue d'Échantillons & Stocks"}
              {activeTab === 'orders' && "Registre des Commandes Client"}
              {activeTab === 'quotes' && "Cahiers des charges de Devis"}
              {activeTab === 'promotions' && "Gestion des coupons et rabais"}
              {activeTab === 'clients' && "Fichiers & CRM Clientèle"}
              {activeTab === 'content' && "CMS - Édition d'univers"}
            </h1>
          </div>

          {(activeTab === 'dashboard' || activeTab === 'products') && (
            <div className="flex items-center space-x-2 self-stretch sm:self-auto">
              <button
                onClick={handleReseedDb}
                className="bg-amber-50 hover:bg-amber-100/80 border border-[#D4AF37]/45 text-yellow-850 text-xs font-mono py-2.5 px-4 rounded-xl transition flex items-center space-x-2 cursor-pointer w-full sm:w-auto justify-center"
                title="Restaurer le catalogue d'exception avec 112 produits"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Restaurer l'univers d'or (112 prods)</span>
              </button>
            </div>
          )}
        </div>

        {/* METRICS STATS CARDS shown exclusively on the main KPI tab for a clean focused backoffice */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-3xl border border-stone-200/60 shadow-sm flex items-center space-x-4">
              <span className="p-3.5 bg-green-50 rounded-2xl text-green-600">
                <DollarSign className="w-6 h-6" />
              </span>
              <div>
                <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Revenus Totaux</p>
                <p className="font-serif text-xl sm:text-2xl font-black text-neutral-900">{stats.turnover.toLocaleString()} F</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200/60 shadow-sm flex items-center space-x-4">
              <span className="p-3.5 bg-amber-50 rounded-2xl text-[#D4AF37]">
                <ClipboardList className="w-6 h-6" />
              </span>
              <div>
                <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Demandes Reçues</p>
                <p className="font-serif text-xl sm:text-2xl font-black text-neutral-900">{stats.totalOrdersCount + stats.totalQuotesCount}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200/60 shadow-sm flex items-center space-x-4">
              <span className="p-3.5 bg-stone-50 rounded-2xl text-stone-650">
                <Archive className="w-6 h-6" />
              </span>
              <div>
                <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">En cours atelier</p>
                <p className="font-serif text-xl sm:text-2xl font-black text-neutral-900">{stats.pendingOrdersCount + stats.productionOrdersCount}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200/60 shadow-sm flex items-center space-x-4">
              <span className="p-3.5 bg-red-50 rounded-2xl text-red-550">
                <AlertTriangle className="w-6 h-6" />
              </span>
              <div>
                <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Alerte ruptures</p>
                <p className="font-serif text-xl sm:text-2xl font-black text-red-650">{lowStockProducts.length} articles</p>
              </div>
            </div>

          </div>
        )}

        {/* PRINT UTILITY AREA IN ERP */}
        {printingOrder && (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 relative space-y-4">
            <button 
              onClick={() => setPrintingOrder(null)} 
              className="absolute top-4 right-4 text-amber-700 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex justify-between items-center border-b border-amber-200 pb-2">
              <h3 className="font-serif font-bold text-amber-900 flex items-center space-x-2">
                <Printer className="w-5 h-5" />
                <span>Facture de Commande Atelier • Impression</span>
              </h3>
              <button 
                onClick={() => window.print()}
                className="bg-amber-900 text-white font-mono text-[10px] tracking-widest px-4 py-2 rounded-xl"
              >
                Imprimer le feuillet
              </button>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-stone-200 font-mono text-xs text-left space-y-4 shadow-sm">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-bold text-sm tracking-tight text-[#2D2D2D]">ART DE TABLE DAKAR</h4>
                  <p className="text-gray-400">Atelier Jardin Ouagou HLM, Dakar, Sénégal</p>
                  <p className="text-gray-450">{contentForm.contactPhone}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-neutral-900">BON # {printingOrder.id.slice(0, 8).toUpperCase()}</p>
                  <p>DATE: {new Date(printingOrder.createdAt).toLocaleDateString()}</p>
                  <p className="text-gray-400">Canal: Site E-commerce</p>
                </div>
              </div>

              <div className="border-t border-dashed border-stone-200 py-3">
                <p className="font-bold text-stone-855">CLIENT:</p>
                <p>Nom: {printingOrder.name}</p>
                <p>Tel: {printingOrder.phone}</p>
                <p>Email: {printingOrder.email}</p>
                <p>Destination: {printingOrder.address}</p>
              </div>

              <div className="border-t border-stone-200 py-3">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="pb-2">Modèle & Personnalisation</th>
                      <th className="pb-2 text-right">Qté</th>
                      <th className="pb-2 text-right">P.U.</th>
                      <th className="pb-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printingOrder.items.map((it, i) => (
                      <tr key={i} className="border-b/50 border-stone-100">
                        <td className="py-2.5 font-sans">
                          <p className="font-bold text-[#2D2D2D]">{it.name}</p>
                          {it.customInstructions && <p className="text-[10px] text-[#D4AF37] italic">Instruction: {it.customInstructions}</p>}
                          {it.customLogoUrl && <p className="text-[9px] text-blue-500 break-all font-mono">Asset logo: {it.customLogoUrl}</p>}
                        </td>
                        <td className="py-2.5 text-right font-mono">{it.quantity}</td>
                        <td className="py-2.5 text-right font-mono">{it.price} F</td>
                        <td className="py-2.5 text-right font-mono font-bold">{(it.price * it.quantity).toLocaleString()} F</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-right space-y-1 pt-2">
                <p>Mode de Livraison: {printingOrder.deliveryMethod === 'livraison' ? 'Livraison sécurisée' : 'Retrait Boutique'}</p>
                <p>Méthode de règlement: {printingOrder.paymentMethod.replace('_', ' ').toUpperCase()}</p>
                <p className="text-base font-bold text-[#D4AF37] pt-1">MONTANT NET À PAYER: {printingOrder.totalAmount.toLocaleString()} FCFA</p>
              </div>

              <div className="border-t border-dashed border-stone-200 pt-4 text-center text-[10px] text-stone-400">
                <p>Garantie d'Atelier • Sceaux d'or & Coton Organique Dakar S.A.R.L.</p>
                <p>Ce document fait foi de bon d'expédition et d'inventaire officiel.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: DASHBOARD & WORK BENCH */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Status breakdown ratios in progress */}
            <div className="lg:col-span-1 space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-stone-200/65 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-neutral-900">Encours Répartition</h3>
                <div className="space-y-4 pt-1 text-left">
                  {[
                    { label: "En attente d'Atelier", count: stats.pendingOrdersCount, color: "bg-amber-400", pct: stats.totalOrdersCount > 0 ? (stats.pendingOrdersCount / stats.totalOrdersCount) * 100 : 0 },
                    { label: "En cours de Production", count: stats.productionOrdersCount, color: "bg-[#D4AF37]", pct: stats.totalOrdersCount > 0 ? (stats.productionOrdersCount / stats.totalOrdersCount) * 100 : 0 },
                    { label: "Livrées & Finalisées", count: stats.deliveredOrdersCount, color: "bg-green-500", pct: stats.totalOrdersCount > 0 ? (stats.deliveredOrdersCount / stats.totalOrdersCount) * 100 : 0 }
                  ].map((it, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs text-stone-500">
                        <span>{it.label}</span>
                        <span className="font-bold text-stone-700 font-mono">{it.count}</span>
                      </div>
                      <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${it.color}`} style={{ width: `${Math.max(8, it.pct)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick low stock alert summary panel */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200/65 shadow-sm space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-base font-bold text-neutral-900 flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Seuils Alertes</span>
                  </h3>
                  <span className="font-mono text-xs text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full">
                    {lowStockProducts.length} prods
                  </span>
                </div>
                <p className="text-xs text-stone-400 font-light">Ces items sont en deçà du seuil critique de 5 unités. Réapprovisionnez-les.</p>
                <div className="max-h-56 overflow-y-auto space-y-2 no-scrollbar pr-1">
                  {lowStockProducts.map(p => (
                    <div key={p.id} className="p-3 bg-red-50/40 border border-red-100 rounded-xl flex justify-between items-center text-xs">
                      <div className="min-w-0 pr-2">
                        <p className="font-serif font-black text-neutral-900 truncate">{p.name}</p>
                        <p className="text-[10px] text-stone-400 font-mono">MOQ: {p.minQty} units</p>
                      </div>
                      <span className="font-mono font-black text-red-600 bg-white px-2 py-1 rounded border border-red-200 shrink-0">
                        {p.stock} pcs
                      </span>
                    </div>
                  ))}
                  {lowStockProducts.length === 0 && (
                    <p className="text-xs text-stone-400 py-3 text-center italic">✓ Tous les stocks sont corrects.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Visual Charts overview */}
            <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/60 shadow-sm space-y-6 text-left flex flex-col h-full justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900">Performances de Production Mensuelles</h3>
                <p className="text-xs text-stone-400 font-light">Évolution du volume commercial d'Art de Table DAKAR.</p>
              </div>

              {/* Responsive mini CSS chart bars representing simulated target outputs */}
              <div className="grid grid-cols-6 gap-3 pt-6 items-end h-48 text-center border-b border-stone-100 pb-2">
                {[
                  { month: 'Jan', amount: 450000, color: 'bg-stone-200/50' },
                  { month: 'Fév', amount: 820000, color: 'bg-stone-200/50' },
                  { month: 'Mar', amount: 1250000, color: 'bg-stone-200' },
                  { month: 'Avr', amount: stats.turnover * 0.4 || 1800000, color: 'bg-stone-300' },
                  { month: 'Mai', amount: stats.turnover * 0.7 || 2400000, color: 'bg-[#D4AF37]/50' },
                  { month: 'Juin (Actuel)', amount: stats.turnover || 3200000, color: 'bg-[#D4AF37]' }
                ].map((bar, idx) => {
                  const maxAmt = 3500000;
                  const percentHeight = Math.min(100, Math.max(15, (bar.amount / maxAmt) * 100));
                  return (
                    <div key={idx} className="flex flex-col items-center justify-end h-full space-y-2 select-none">
                      <span className="text-[9px] font-mono font-bold text-stone-400 tracking-tighter shrink-0">{Math.round(bar.amount/1000)}k F</span>
                      <div className={`w-full rounded-t-xl transition-all duration-300 hover:scale-105 ${bar.color}`} style={{ height: `${percentHeight}%` }} />
                      <span className="text-[10px] font-mono text-stone-400 shrink-0">{bar.month}</span>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light text-stone-500">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="font-bold text-neutral-900 block mb-0.5">Moyenne de Devis Validés</span>
                  <p className="font-serif font-black text-[#D4AF37] text-lg">
                    {orders.length > 0 ? `${Math.round(stats.turnover / orders.length).toLocaleString()} FCFA` : '15,050 F'}
                  </p>
                </div>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <span className="font-bold text-neutral-900 block mb-0.5">Taux de Rétention</span>
                  <p className="font-serif font-black text-neutral-805 text-lg">98% de fidélité d'or</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: INVENTORY CATALOGUE */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Fine Luxury Sub-Tabs bar for products */}
            <div className="flex border-b border-stone-200 pb-3 mb-6 gap-6">
              <button
                type="button"
                onClick={() => setProductSubTab('catalog')}
                className={`pb-2 text-xs font-mono tracking-wider font-bold uppercase transition flex items-center gap-2 relative cursor-pointer ${
                  productSubTab === 'catalog' ? 'text-[#D4AF37]' : 'text-stone-400 hover:text-stone-800'
                }`}
              >
                <Archive className="w-4 h-4" />
                <span>Atelier des Échantillons ({filteredProducts.length})</span>
                {productSubTab === 'catalog' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setProductSubTab('history')}
                className={`pb-2 text-xs font-mono tracking-wider font-bold uppercase transition flex items-center gap-2 relative cursor-pointer ${
                  productSubTab === 'history' ? 'text-[#D4AF37]' : 'text-stone-400 hover:text-stone-800'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Journal des Mouvements ({stockHistory?.length || 0})</span>
                {productSubTab === 'history' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
                )}
              </button>
            </div>

            {productSubTab === 'catalog' && (
              <div className="space-y-6 text-left">
                
                {/* Search & filters + Add Product button */}
                <div className="bg-white p-6 rounded-3xl border border-stone-200/55 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg font-bold text-neutral-900">Echantillonnage Réel</h3>
                    <p className="text-xs text-stone-400 font-light">Modifiez les MOQ, les tarifs ou mettez à jour instantanément les stocks direct d'usine.</p>
                  </div>
                  <div className="flex items-center space-x-3 w-full sm:w-auto shrink-0 select-none">
                    <select
                      value={productFilterCat}
                      onChange={e => setProductFilterCat(e.target.value)}
                      className="bg-[#FAF6F0] border border-[#D4AF37]/20 rounded-xl text-xs py-2.5 px-4 font-mono font-medium outline-none focus:border-[#D4AF37]"
                    >
                      <option value="all">Toutes les catégories</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleClearDb}
                      className="bg-red-50 hover:bg-red-100/80 text-red-700 text-xs uppercase tracking-widest font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shrink-0 cursor-pointer border border-red-100"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <span>Vider le Catalogue</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(prev => !prev)}
                      className="bg-[#111111] hover:bg-neutral-900 text-[#FAF6F0] text-xs uppercase tracking-widest font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shrink-0 cursor-pointer border border-[#D4AF37]/15"
                    >
                      <PlusCircle className="w-4 h-4 text-[#D4AF37]" />
                      <span>{isAddingProduct ? "Fermer" : "Ajouter"}</span>
                    </button>
                  </div>
                </div>

              {/* Collapsible form to add products */}
              {isAddingProduct && (
                <form onSubmit={handleAddProductSubmit} className="bg-amber-50/35 border border-[#D4AF37]/35 rounded-3xl p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-200/50 pb-2 flex-wrap gap-2">
                     <h4 className="font-serif text-sm font-bold text-[#A67C52] flex items-center space-x-2">
                      <PlusCircle className="w-4 h-4 text-[#D4AF37]" />
                      <span>Créer un Nouvel Échantillon d'Atelier</span>
                    </h4>
                    <button type="button" onClick={() => setIsAddingProduct(false)} className="text-stone-500 hover:text-black">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-left">
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] text-stone-500 font-bold block">Nom de l'échantillon *</label>
                      <input
                        required
                        type="text"
                        value={productForm.name}
                        onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="Ex: Assiette Liseré Doré"
                        className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] text-stone-500 font-bold block">Tarif unitaire (FCFA) *</label>
                      <input
                        required
                        type="number"
                        value={productForm.price || ''}
                        onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] text-stone-500 font-bold block">Catégorie *</label>
                      <select
                        value={productForm.category}
                        onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 outline-none focus:border-[#D4AF37]"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] text-stone-500 font-bold block">MOQ Minimum Requis *</label>
                      <input
                        required
                        type="number"
                        value={productForm.minQty || ''}
                        onChange={e => setProductForm({ ...productForm, minQty: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-mono text-[10px] text-stone-500 font-bold block">Description du Savoir-Faire & Matières *</label>
                      <input
                        type="text"
                        required
                        value={productForm.description}
                        onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                        placeholder="Ex: Porcelaine de Limoges, dorure artisanale par électrolyse à Dakar"
                        className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] text-stone-500 font-bold block">Délai Atelier (Livraison)</label>
                      <input
                        type="text"
                        value={productForm.productionDelay}
                        onChange={e => setProductForm({ ...productForm, productionDelay: e.target.value })}
                        placeholder="Ex: 5-7 jours d'Atelier"
                        className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] text-stone-500 font-bold block">Unités en stock initial *</label>
                      <input
                        type="number"
                        required
                        value={productForm.stock}
                        onChange={e => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="space-y-3 sm:col-span-4 bg-stone-50 p-4 border rounded-2xl">
                      <div className="flex items-center justify-between">
                        <label className="font-serif text-xs font-bold text-stone-700 block">Galerie Visuels Premium du Produit</label>
                        <span className="text-[10px] text-[#A67C52] font-mono">{(productForm.images || []).length} ajoutés</span>
                      </div>
                      
                      {/* Grid representation */}
                      {(productForm.images || []).length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-stone-200 pb-3">
                          {(productForm.images || []).map((imgUrl, imgIdx) => (
                            <div key={imgIdx} className="relative aspect-square rounded-lg border border-stone-200 bg-white group overflow-hidden">
                              <img src={imgUrl} alt="" className="w-full h-full object-cover animate-none" />
                              {imgIdx === 0 && (
                                <span className="absolute top-1 left-1 bg-[#8B3A52] text-white font-mono text-[8px] px-1 py-0.5 rounded uppercase font-bold tracking-widest shadow">Principale</span>
                              )}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-1.5 gap-1">
                                <span className="text-[8px] text-white text-center truncate mb-1">{imgIdx + 1} / {productForm.images?.length}</span>
                                <div className="flex justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleProductImageSetPrimary(imgIdx, false)}
                                    title="Définir comme principale"
                                    className="p-1 bg-white hover:bg-[#8B3A52]/10 rounded shadow-sm text-stone-800 hover:text-[#8B3A52] cursor-pointer"
                                  >
                                    ★
                                  </button>
                                  <button
                                    type="button"
                                    disabled={imgIdx === 0}
                                    onClick={() => handleProductImageMove(imgIdx, 'left', false)}
                                    className="p-1 bg-white hover:bg-stone-100 rounded disabled:opacity-30 cursor-pointer"
                                  >
                                    ←
                                  </button>
                                  <button
                                    type="button"
                                    disabled={imgIdx === (productForm.images?.length || 0) - 1}
                                    onClick={() => handleProductImageMove(imgIdx, 'right', false)}
                                    className="p-1 bg-white hover:bg-stone-100 rounded disabled:opacity-30 cursor-pointer"
                                  >
                                    →
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleProductImageRemove(imgIdx, false)}
                                    className="p-1 bg-[#8B3A52] hover:bg-[#722e43] text-white rounded cursor-pointer"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add controls */}
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Insérer l'URL exacte d'une image..."
                            value={productForm.imageUrl}
                            onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })}
                            className="flex-1 px-3 py-1 bg-white rounded-lg border text-xs outline-none focus:border-[#8B3A52]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              handleProductImageAdd(productForm.imageUrl, false);
                              setProductForm(prev => ({ ...prev, imageUrl: '' }));
                            }}
                            className="px-3 py-1 bg-[#8B3A52] text-white rounded-lg text-xs font-serif hover:bg-[#722e43] font-semibold cursor-pointer"
                          >
                            Ajouter URL
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setProductImagePicker({
                              title: "Sélectionner un visuel pour le nouveau produit",
                              onSelect: (url) => handleProductImageAdd(url, false)
                            })}
                            className="px-3 py-1.5 border border-stone-250 hover:border-[#8B3A52] text-[#8B3A52] text-xs font-medium bg-white hover:bg-[#8B3A52]/5 rounded-lg flex items-center gap-1 cursor-pointer transition"
                          >
                            📁 Médiathèque
                          </button>
                          
                          <label className="px-3 py-1.5 border border-stone-250 hover:border-emerald-600 text-emerald-600 text-xs font-medium bg-white hover:bg-emerald-50 rounded-lg flex items-center gap-1 cursor-pointer transition">
                            📤 Uploader
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleProductImageUploadFile(e, false)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1 sm:col-span-4">
                      <div className="flex items-center justify-between">
                        <label className="font-mono text-[10px] text-stone-500 block">Lien de la Vidéo d'Atelier (TikTok ou MP4 avec Son)</label>
                        <span className="bg-[#FAF0E6] text-[#8B3A52] px-1.5 py-0.5 rounded-md font-mono text-[8px] font-bold">SON INTÉGRÉ</span>
                      </div>
                      <input
                        type="text"
                        value={productForm.videoUrl || ''}
                        onChange={e => setProductForm({ ...productForm, videoUrl: e.target.value })}
                        placeholder="Ex: https://www.tiktok.com/@artdetable.sn/video/1234567890 ou lien direct MP4"
                        className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 outline-none focus:border-[#D4AF37]"
                      />
                      <span className="text-[9px] text-[#8B3A52] font-medium leading-normal block">
                        💡 Remplace l'illustration SVG classique sur le catalogue par une présentation vidéo dynamique de haute qualité avec son !
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="submit" className="bg-[#111111] hover:bg-black text-[#FAF6F0] font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-xl shadow border border-[#D4AF37]/15 cursor-pointer font-bold">
                      Enregistrer au catalogue d'or
                    </button>
                  </div>
                </form>
              )}

              {/* ACCORDION CATALOGUE LIST: HIDES SECONDARY METADATA BY DEFAULT */}
              <div className="bg-white rounded-3xl border border-stone-200/50 shadow-sm overflow-hidden divide-y divide-stone-100">
                {filteredProducts.length === 0 ? (
                  <div className="p-16 text-center text-stone-400 italic font-light">Aucun produit ne correspond aux filtres.</div>
                ) : (
                  filteredProducts.map((prod) => {
                    const isExpanded = !!expandedProductIds[prod.id];
                    const isEditingInline = inlineEditingProductId === prod.id;
                    const isLowStock = prod.stock !== undefined && prod.stock < 5;
                    const currentInputValue = inlineStocks[prod.id] !== undefined ? inlineStocks[prod.id] : String(prod.stock || 0);
                    const isStockModified = inlineStocks[prod.id] !== undefined && inlineStocks[prod.id] !== String(prod.stock || 0);

                    return (
                      <div key={prod.id} className="transition-all">
                        
                        {/* COLLAPSED HEADER RENDER - SUPER STREAMLINED LIST VIEW */}
                        <div
                          onClick={(e) => {
                            // Skip wrapper toggles when clicking interactions
                            const target = e.target as HTMLElement;
                            if (target.closest('.no-toggle')) return;
                            setExpandedProductIds(prev => ({ ...prev, [prod.id]: !prev[prod.id] }));
                          }}
                          className={`p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/50 transition ${
                            isExpanded ? 'bg-amber-50/15 border-b border-stone-100' : ''
                          }`}
                        >
                          
                          {/* Primary info columns */}
                          <div className="flex items-center space-x-4 min-w-0 flex-1 text-left">
                            <div className="w-12 h-12 rounded-xl border border-stone-150 overflow-hidden bg-pink-50/10 shrink-0">
                              <ProductMockup productId={prod.id} className="w-full h-full" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-serif font-black text-neutral-850 text-sm md:text-base leading-tight truncate">{prod.name}</h4>
                                <span className="text-[9px] px-2 py-0.5 bg-stone-100 text-stone-605 font-mono capitalize rounded-full tracking-tight shrink-0">
                                  {prod.category.replace(/-/g, ' ')}
                                </span>
                              </div>
                              <p className="text-[10px] text-[#A67C52] font-mono tracking-tight mt-0.5">
                                PU: {prod.price.toLocaleString()} F • MOQ: {prod.minQty} pcs
                              </p>
                            </div>
                          </div>

                          {/* Quick Inline stock updates directly available */}
                          <div className="flex items-center space-x-4 justify-between md:justify-end shrink-0">
                            
                            {/* Stock instant modifier block */}
                            <div className="flex items-center space-x-2 no-toggle" onClick={(e) => e.stopPropagation()}>
                              <label className="text-[10px] font-mono text-stone-405 font-bold select-none uppercase tracking-wide">Stock :</label>
                              <div className="flex items-center space-x-1">
                                <input
                                  type="number"
                                  min="0"
                                  value={currentInputValue}
                                  onChange={e => setInlineStocks({ ...inlineStocks, [prod.id]: e.target.value })}
                                  className={`w-14 px-1 py-1 text-center font-mono text-xs rounded-lg border outline-none ${
                                    isLowStock 
                                      ? 'bg-red-50 text-red-700 border-red-200' 
                                      : 'bg-stone-50 text-stone-700 border-stone-200 focus:border-[#D4AF37]'
                                  }`}
                                />
                                {isStockModified ? (
                                  <button
                                    type="button"
                                    onClick={() => handleInlineStockSave(prod.id, prod.stock)}
                                    className="p-1 px-1.5 bg-[#D4AF37] hover:bg-amber-600 text-neutral-900 rounded-lg shadow transition shrink-0 cursor-pointer"
                                    title="Sauvegarder immédiatement"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <span className="text-[10px] font-mono text-stone-400 font-bold select-none pl-1">pcs</span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 no-toggle" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => setExpandedProductIds(prev => ({ ...prev, [prod.id]: !prev[prod.id] }))}
                                className="p-1.5 hover:bg-stone-100 text-stone-500 rounded-lg transition"
                                title="Détails"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-[#D3A243]" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-stone-400 hover:text-stone-700" />
                                )}
                              </button>
                            </div>

                          </div>

                        </div>

                        {/* EXPANDED ACCORDION DRAWER */}
                        {isExpanded && (
                          <div className="p-6 bg-[#FAF9F6] border-b border-stone-100 text-left transition-all duration-300">
                            
                            {!isEditingInline ? (
                              /* READ ONLY DISPLAY MODE FOR EXPANDED METADATA - VERY CLEAN */
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                
                                {/* Left: descriptive parameters */}
                                <div className="md:col-span-8 space-y-4">
                                  <div className="space-y-1 text-left">
                                    <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest font-black block">Fiche d'Artisanat d'Art</span>
                                    <h5 className="font-serif font-black text-[#1A1A1A] text-lg leading-tight">{prod.name}</h5>
                                  </div>

                                  {prod.description && (
                                    <div className="bg-white p-4 rounded-2xl border border-stone-150 shadow-xs">
                                      <p className="text-xs text-stone-505 leading-relaxed font-light font-sans">{prod.description}</p>
                                    </div>
                                  )}

                                  {/* Grid metadata tags */}
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    <div className="p-3 bg-white border border-stone-200/50 rounded-xl">
                                      <p className="text-[9px] font-mono text-stone-400 uppercase">Tarif Unitaire :</p>
                                      <span className="font-mono text-xs font-bold text-stone-700 block">{prod.price.toLocaleString()} FCFA</span>
                                    </div>
                                    <div className="p-3 bg-white border border-stone-200/50 rounded-xl">
                                      <p className="text-[9px] font-mono text-stone-400 uppercase">Minimum usine (MOQ) :</p>
                                      <span className="font-mono text-xs font-bold text-stone-700 block">{prod.minQty} pièces</span>
                                    </div>
                                    <div className="p-3 bg-white border border-stone-200/50 rounded-xl">
                                      <p className="text-[9px] font-mono text-stone-400 uppercase">Délai Atelier :</p>
                                      <span className="font-mono text-xs font-bold text-stone-700 block">{prod.productionDelay || '7-10 jours'}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Right side controls panel inside expanded slot */}
                                <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 h-full justify-center">
                                  <button
                                    type="button"
                                    onClick={() => handleStartInlineEditing(prod)}
                                    className="flex items-center justify-center space-x-2 bg-[#FAF6F0] hover:bg-amber-100/50 text-[#A67C52] hover:text-[#8E643E] border border-[#D4AF37]/30 py-3 px-4 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer"
                                  >
                                    <Edit3 className="w-4 h-4 shrink-0" />
                                    <span>Modifier l'Échantillon</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      if (window.confirm(`Confirmez-vous la suppression définitive de ${prod.name} du catalogue officiel d'atelier ?`)) {
                                        try {
                                          await adminDeleteProduct(prod.id);
                                          alert("Produit supprimé !");
                                        } catch (err) {
                                          alert("Erreur de suppression.");
                                        }
                                      }
                                    }}
                                    className="flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-750 border border-red-150 py-3 px-4 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4 shrink-0" />
                                    <span>Supprimer du catalogue</span>
                                  </button>
                                </div>

                              </div>
                            ) : (
                              /* DETAILED INLINE ACCORDION EDIT MODE - FULL FORM CONTROL */
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  handleInlineEditSaveSubmit(prod.id);
                                }}
                                className="bg-white rounded-3xl p-6 border border-[#D4AF37]/35 shadow-md space-y-4 text-left"
                              >
                                <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                                  <h4 className="font-serif text-sm font-bold text-neutral-900 flex items-center space-x-2">
                                    <Edit3 className="w-4 h-4 text-[#D4AF37]" />
                                    <span>Modifier l'échantillon d'or : {prod.name}</span>
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => setInlineEditingProductId(null)}
                                    className="text-stone-400 hover:text-black"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                  <div className="space-y-1">
                                    <label className="font-mono text-[9px] text-stone-500 font-bold block">Nom du produit *</label>
                                    <input
                                      required
                                      type="text"
                                      value={inlineEditForm.name || ''}
                                      onChange={e => setInlineEditForm({ ...inlineEditForm, name: e.target.value })}
                                      className="w-full px-3 py-2 bg-[#FAF9F6] rounded-xl border border-stone-200 outline-none focus:border-[#D4AF37]"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="font-mono text-[9px] text-stone-500 font-bold block">Prix public (FCFA) *</label>
                                    <input
                                      required
                                      type="number"
                                      value={inlineEditForm.price || ''}
                                      onChange={e => setInlineEditForm({ ...inlineEditForm, price: Number(e.target.value) })}
                                      className="w-full px-3 py-2 bg-[#FAF9F6] rounded-xl border border-stone-200 outline-none focus:border-[#D4AF37]"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="font-mono text-[9px] text-stone-500 font-bold block">Catégorie *</label>
                                    <select
                                      value={inlineEditForm.category || ''}
                                      onChange={e => setInlineEditForm({ ...inlineEditForm, category: e.target.value })}
                                      className="w-full px-3 py-2 bg-[#FAF9F6] rounded-xl border border-stone-200 outline-none focus:border-[#D4AF37]"
                                    >
                                      {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="font-mono text-[9px] text-stone-500 font-bold block">Contraintes MOQ usine *</label>
                                    <input
                                      required
                                      type="number"
                                      value={inlineEditForm.minQty || ''}
                                      onChange={e => setInlineEditForm({ ...inlineEditForm, minQty: Number(e.target.value) })}
                                      className="w-full px-3 py-2 bg-[#FAF9F6] rounded-xl border border-stone-200 outline-none focus:border-[#D4AF37]"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="font-mono text-[9px] text-stone-500 font-bold block">Délai Atelier (Livraison)</label>
                                    <input
                                      type="text"
                                      value={inlineEditForm.productionDelay || ''}
                                      onChange={e => setInlineEditForm({ ...inlineEditForm, productionDelay: e.target.value })}
                                      className="w-full px-3 py-2 bg-[#FAF9F6] rounded-xl border border-stone-200 outline-none focus:border-[#D4AF37]"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="font-mono text-[9px] text-stone-500 font-bold block">Quantité physique dispo *</label>
                                    <input
                                      required
                                      type="number"
                                      value={inlineEditForm.stock || 0}
                                      onChange={e => setInlineEditForm({ ...inlineEditForm, stock: Number(e.target.value) })}
                                      className="w-full px-3 py-2 bg-[#FAF9F6] rounded-xl border border-stone-200 outline-none focus:border-[#D4AF37]"
                                    />
                                  </div>
                                  <div className="space-y-3 sm:col-span-4 bg-stone-50 p-4 border rounded-2xl text-left">
                                    <div className="flex items-center justify-between">
                                      <label className="font-serif text-xs font-bold text-stone-700 block">Galerie Visuels du Produit en Ateliers</label>
                                      <span className="text-[10px] text-[#8B3A52] font-mono">{(inlineEditForm.images || []).length} images</span>
                                    </div>

                                    {/* Grid representation */}
                                    {(inlineEditForm.images || []).length > 0 && (
                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-stone-200 pb-3">
                                        {(inlineEditForm.images || []).map((imgUrl, imgIdx) => (
                                          <div key={imgIdx} className="relative aspect-square rounded-lg border border-stone-200 bg-white group overflow-hidden">
                                            <img src={imgUrl} alt="" className="w-full h-full object-cover animate-none" />
                                            {imgIdx === 0 && (
                                              <span className="absolute top-1 left-1 bg-[#8B3A52] text-white font-mono text-[7px] px-1 py-0.5 rounded uppercase font-bold tracking-widest shadow">Principale</span>
                                            )}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-1.5 gap-1">
                                              <span className="text-[8px] text-white text-center truncate mb-1">{imgIdx + 1} / {inlineEditForm.images?.length}</span>
                                              <div className="flex justify-center gap-1.5">
                                                <button
                                                  type="button"
                                                  onClick={() => handleProductImageSetPrimary(imgIdx, true)}
                                                  title="Définir comme principale"
                                                  className="p-1 bg-white hover:bg-[#8B3A52]/10 rounded shadow-sm text-stone-800 hover:text-[#8B3A52] cursor-pointer"
                                                >
                                                  ★
                                                </button>
                                                <button
                                                  type="button"
                                                  disabled={imgIdx === 0}
                                                  onClick={() => handleProductImageMove(imgIdx, 'left', true)}
                                                  className="p-1 bg-white hover:bg-stone-100 rounded disabled:opacity-30 cursor-pointer"
                                                >
                                                  ←
                                                </button>
                                                <button
                                                  type="button"
                                                  disabled={imgIdx === (inlineEditForm.images?.length || 0) - 1}
                                                  onClick={() => handleProductImageMove(imgIdx, 'right', true)}
                                                  className="p-1 bg-white hover:bg-stone-100 rounded disabled:opacity-30 cursor-pointer"
                                                >
                                                  →
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={() => handleProductImageRemove(imgIdx, true)}
                                                  className="p-1 bg-[#8B3A52] hover:bg-[#722e43] text-white rounded cursor-pointer"
                                                >
                                                  ✕
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* Add buttons */}
                                    <div className="space-y-2">
                                      <div className="flex gap-2">
                                        <input
                                          type="text"
                                          placeholder="Insérer URL d'une image..."
                                          value={inlineEditForm.imageUrl}
                                          onChange={e => setInlineEditForm({ ...inlineEditForm, imageUrl: e.target.value })}
                                          className="flex-1 px-3 py-1 bg-white rounded-lg border text-xs outline-none focus:border-[#8B3A52]"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            handleProductImageAdd(inlineEditForm.imageUrl, true);
                                            setInlineEditForm(prev => ({ ...prev, imageUrl: '' }));
                                          }}
                                          className="px-3 py-1 bg-[#8B3A52] text-white rounded-lg text-xs font-serif hover:bg-[#722e43] font-semibold cursor-pointer"
                                        >
                                          Ajouter
                                        </button>
                                      </div>

                                      <div className="flex flex-wrap gap-2 pt-1">
                                        <button
                                          type="button"
                                          onClick={() => setProductImagePicker({
                                            title: `Sélectionner un visuel pour ${inlineEditForm.name}`,
                                            onSelect: (url) => handleProductImageAdd(url, true)
                                          })}
                                          className="px-3 py-1.5 border border-stone-250 hover:border-[#8B3A52] text-[#8B3A52] text-xs font-medium bg-white hover:bg-[#8B3A52]/5 rounded-lg flex items-center gap-1 cursor-pointer transition"
                                        >
                                          📁 Médiathèque
                                        </button>
                                        
                                        <label className="px-3 py-1.5 border border-stone-250 hover:border-emerald-600 text-emerald-600 text-xs font-medium bg-white hover:bg-emerald-50 rounded-lg flex items-center gap-1 cursor-pointer transition">
                                          📤 Uploader
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleProductImageUploadFile(e, true)}
                                            className="hidden"
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-1 sm:col-span-2">
                                    <div className="flex items-center justify-between">
                                      <label className="font-mono text-[9px] text-[#8B3A52] font-bold block">Vidéo d'Atelier (TikTok ou MP4)</label>
                                      <span className="bg-[#FAF0E6] text-[#8B3A52] px-1 py-0.5 rounded-md font-mono text-[7px] font-bold">SON INCLUS</span>
                                    </div>
                                    <input
                                      type="text"
                                      value={inlineEditForm.videoUrl || ''}
                                      onChange={e => setInlineEditForm({ ...inlineEditForm, videoUrl: e.target.value })}
                                      placeholder="TikTok ou lien MP4 avec Musique"
                                      className="w-full px-3 py-2 bg-[#FAF9F6] rounded-xl border border-stone-200 outline-none focus:border-[#D4AF37]"
                                    />
                                  </div>
                                  <div className="space-y-1 sm:col-span-4">
                                    <label className="font-mono text-[9px] text-stone-500 font-bold block">Description de l'Artisanat d'Atelier *</label>
                                    <textarea
                                      required
                                      rows={3}
                                      value={inlineEditForm.description || ''}
                                      onChange={e => setInlineEditForm({ ...inlineEditForm, description: e.target.value })}
                                      className="w-full p-3 bg-[#FAF9F6] rounded-xl border border-stone-200 outline-none focus:border-[#D4AF37]"
                                      placeholder="Ex: Porcelaine à friture d'argile double cuisson."
                                    />
                                  </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                                  <button
                                    type="button"
                                    onClick={() => setInlineEditingProductId(null)}
                                    className="bg-stone-100 hover:bg-[#FAF6F0] px-4 py-2 rounded-xl text-stone-605 font-mono text-[10px] uppercase font-bold text-[#A67C52]"
                                  >
                                    Annuler
                                  </button>
                                  <button
                                    type="submit"
                                    className="bg-[#111111] hover:bg-black text-[#FAF6F0] font-mono text-[10px] uppercase tracking-widest px-6 py-2.5 rounded-xl shadow border border-[#D4AF37]/10 cursor-pointer"
                                  >
                                    Sauvegarder en temps réel
                                  </button>
                                </div>

                              </form>
                            )}

                          </div>
                        )}

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

          {/* DEDICATED CHRONOLOGY JOURNAL SUB-TAB FOR STOCK HISTORY LOGS */}
          {productSubTab === 'history' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/55 shadow-sm space-y-6 text-left border-t-2 border-t-[#D4AF37] max-w-4xl mx-auto">
              <div className="flex items-center space-x-2 border-b border-stone-100 pb-3 justify-between">
                <div className="flex items-center space-x-2">
                  <History className="w-5 h-5 text-[#D4AF37]" strokeWidth={2.5} />
                  <h3 className="font-serif text-base font-black text-neutral-900">Journal des Mouvements de Stock</h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#FAF6F0] text-[#D4AF37] border border-[#D4AF37]/25 px-2.5 py-1 rounded-full uppercase">
                  Audit Temps Réel
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed font-light">
                Ci-dessous sont consignés l'ensemble des ajustements d'inventaire, modifications d'atelier, et approvisionnements du catalogue d'exception.
              </p>

              <div className="space-y-3.5 max-h-[850px] overflow-y-auto pr-2 no-scrollbar">
                {stockHistory && stockHistory.map((log: StockLog) => {
                  const isPositive = log.quantityChanged > 0;
                  return (
                    <div key={log.id} className="p-4 bg-[#FAF9F6] rounded-2xl border border-stone-100 space-y-2 text-xs relative overflow-hidden transition hover:border-[#D4AF37]/25 hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-black text-sm text-[#2D2D2D]">
                            {log.productName}
                          </span>
                          <span className="text-[9px] font-mono text-stone-400">({new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})</span>
                        </div>
                        <p className="text-[11px] text-[#A67C52] font-semibold">{log.reason}</p>
                        <div className="text-[10px] text-stone-400 font-mono">
                          Opérateur: <strong>{log.operator.split('@')[0]}</strong> • Stock disponible final: <strong>{log.newStock} pcs</strong>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center justify-start sm:justify-end">
                        <span className={`font-mono font-bold text-xs px-3 py-1 rounded-full flex items-center gap-0.5 ${
                          isPositive ? 'bg-green-50 text-green-700' : 'bg-amber-55 bg-[#FAF6F0]/60 border border-[#D4AF37]/10 text-amber-700'
                        }`}>
                          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 text-green-600" /> : <ArrowDownRight className="w-3.5 h-3.5 text-amber-600" />}
                          {isPositive ? `+${log.quantityChanged}` : `${log.quantityChanged}`} pcs
                        </span>
                      </div>

                    </div>
                  );
                })}

                {(!stockHistory || stockHistory.length === 0) && (
                  <div className="py-16 text-center text-stone-400 text-xs italic">
                    Aucune modification d'inventaire d'atelier enregistrée à ce jour.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

        {/* TAB 3: MASTER ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            <div className="bg-white p-6 rounded-3xl border border-stone-200/50 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-neutral-900">Registre d'Atelier Commandes</h3>
                <p className="text-xs text-stone-400 font-light">Suivez l'état, d'expédition, de fabrication et l'ajustement du stock physique.</p>
              </div>
              <div className="flex items-center space-x-3 w-full sm:w-auto shrink-0">
                <span className="text-[10px] text-stone-400 font-mono font-bold uppercase shrink-0">Statut :</span>
                <select
                  value={orderFilterStatus}
                  onChange={e => setOrderFilterStatus(e.target.value)}
                  className="bg-[#FAF6F0] border border-[#D4AF37]/25 rounded-xl text-xs py-2.5 px-4 font-mono font-medium outline-none"
                >
                  <option value="all">Tous les états</option>
                  <option value="en_attente">En attente (Non validée)</option>
                  <option value="en_production">En production (Validée)</option>
                  <option value="expediee">Expédiée</option>
                  <option value="livree">Livrée</option>
                  <option value="annulee">Annulée</option>
                </select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white p-16 text-center text-stone-400 rounded-3xl border border-stone-200/40">Aucun bon de commande disponible sous ce critère.</div>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                {filteredOrders.map((ord) => (
                  <div
                    id={`admin-order-row-${ord.id}`}
                    key={ord.id}
                    className="border border-stone-205 bg-white shadow-sm rounded-3xl p-6 sm:p-8 hover:shadow-md transition flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
                  >
                    <div className="space-y-3.5 text-left flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] font-mono text-stone-400 font-bold uppercase">CMD LE {new Date(ord.createdAt).toLocaleDateString()}</span>
                        <span className="text-xs bg-stone-50 text-stone-800 px-3 py-1 rounded-full font-mono font-bold border border-stone-150">Réf: {ord.id.slice(0, 8).toUpperCase()}</span>
                        <span className={`text-[10px] font-mono uppercase font-bold py-1 px-3 rounded-full ${
                          ord.status === 'livree' ? 'bg-green-50 text-green-700 border border-green-200' :
                          ord.status === 'en_production' ? 'bg-[#D4AF37]/15 text-[#A67C52] border border-[#D4AF37]/35' :
                          ord.status === 'expediee' ? 'bg-blue-50 text-blue-750 border border-blue-200' :
                          ord.status === 'annulee' ? 'bg-red-50 text-red-700 border border-red-200' :
                          'bg-yellow-50 text-yellow-800 border border-yellow-200 animate-pulse'
                        }`}>
                          {ord.status === 'en_attente' ? 'En attente (Non validée)' : ord.status.replace('_', ' ')}
                        </span>
                        {ord.stockDeducted && (
                          <span className="text-[8px] font-mono font-bold bg-green-50 text-green-750 border border-green-150 py-1 px-2.5 rounded-full uppercase" title="Les stocks physiques d'usine ont été déduits automatiquement.">
                            Stock Déduit ✓
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-light text-stone-505 capitalize">
                        <div className="space-y-1">
                          <p><strong>Destinataire :</strong> {ord.name}</p>
                          <p><strong>Téléphone direct :</strong> <a href={`tel:${ord.phone}`} className="text-blue-500 underline font-semibold font-mono">{ord.phone}</a></p>
                          <p className="lowercase"><strong>Canal Email :</strong> {ord.email}</p>
                        </div>
                        <div className="space-y-1">
                          <p><strong>Adresse de dépose :</strong> {ord.address}</p>
                          <p><strong>Mode expédition :</strong> {ord.deliveryMethod === 'livraison' ? 'Livraison Dakar/Région' : 'Retrait Ateliers'}</p>
                          <p><strong>Option Règlement :</strong> {ord.paymentMethod.replace(/_/g, ' ')}</p>
                        </div>
                      </div>
                      
                      {/* Sub-item table lists */}
                      <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-150 text-xs space-y-2">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-[#C9B097] block font-bold mb-1">Détails articles commandés :</span>
                        {ord.items.map((it, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-100 last:border-b-0 pb-1.5 last:pb-0">
                            <p className="text-stone-700">
                              • <strong>{it.name}</strong> x<span className="font-bold">{it.quantity}</span>
                              {it.customInstructions && <span className="text-[10px] text-[#D4AF37] font-serif font-semibold italic block pl-3"> [Instruction: "{it.customInstructions}"]</span>}
                              {it.customLogoUrl && <span className="text-[9px] text-blue-500 block pl-3 font-mono">Fichier joint: {it.customLogoUrl}</span>}
                            </p>
                            <span className="font-mono text-stone-500 font-bold shrink-0">{it.price.toLocaleString()} F / {(it.price * it.quantity).toLocaleString()} FCFA</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order action controllers */}
                    <div className="flex lg:flex-col justify-between items-end gap-4 w-full lg:w-64 shrink-0 border-t lg:border-t-0 lg:border-l border-stone-100 pt-4 lg:pt-0 lg:pl-6 self-stretch">
                      <div className="text-right space-y-0.5 w-full">
                        <p className="text-[9px] font-mono uppercase tracking-wider text-stone-400 block font-bold">Total Facturé Client</p>
                        <p className="font-serif font-black text-xl text-[#D4AF37]">{ord.totalAmount.toLocaleString()} FCFA</p>
                      </div>

                      <div className="space-y-2 w-full text-right">
                        <label className="text-[9px] font-mono text-stone-400 font-bold uppercase block text-left">Changer l'état & Auto-Stock :</label>
                        <div className="flex items-center space-x-1 justify-end">
                          <select
                            value={ord.status}
                            onChange={(e) => adminUpdateOrderStatus(ord.id, e.target.value as any)}
                            className="bg-stone-100 border border-stone-200 px-3.5 py-2.5 rounded-xl text-xs tracking-wide text-neutral-900 font-bold outline-none cursor-pointer w-full text-center"
                          >
                            <option value="en_attente">En attente (Non validée)</option>
                            <option value="en_production">En production (Validée)</option>
                            <option value="expediee">Expédiée d'Atelier</option>
                            <option value="livree">Livrée & Encaissée</option>
                            <option value="annulee">Annulée</option>
                          </select>

                          <button
                            onClick={() => { setPrintingOrder(ord); window.scrollTo({ top: 120, behavior: 'smooth' }); }}
                            className="p-3 text-stone-500 hover:text-black border border-stone-200 hover:border-stone-900 rounded-xl bg-white shadow-xs cursor-pointer inline-block shrink-0 transition"
                            title="Imprimer la facture ou bon d'envoi"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 4: DEVIS REQUESTS */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            
            <div className="bg-white p-6 rounded-3xl border border-stone-200/50 shadow-sm text-left space-y-1">
              <h3 className="font-serif text-lg font-bold text-neutral-900">Projets Événementiels Spéciaux</h3>
              <p className="text-xs text-stone-400 font-light">Chiffrez les projets sur-mesure ou convertissez-les en bons de commande d'un simple clic.</p>
            </div>

            {quotes.length === 0 ? (
              <div className="bg-white p-16 text-center text-stone-400 rounded-3xl border border-stone-200/40">Aucun projet de devis déposé pour l'instant.</div>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                {quotes.map((q) => {
                  const localResp = devisResponses[q.id] || { offerAmount: 1500, notes: '' };
                  return (
                    <div
                      id={`admin-quote-row-${q.id}`}
                      key={q.id}
                      className="border border-stone-200 bg-white rounded-3xl p-6 sm:p-8 hover:border-[#D4AF37]/40 transition space-y-6 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-100 pb-4 gap-2">
                        <div className="text-left space-y-1">
                          <span className="text-[9px] font-mono text-stone-400 font-bold uppercase tracking-wider block">Déposé le {new Date(q.createdAt).toLocaleDateString()}</span>
                          <h4 className="font-serif text-lg font-bold text-[#2D2D2D]">Cahier des charges #{q.id.slice(0, 8).toUpperCase()}</h4>
                        </div>
                        <span className={`text-[10px] font-mono uppercase font-bold py-1 px-3 rounded-full ${
                          q.status === 'accepte' ? 'bg-green-50 text-green-700' :
                          q.status === 'refuse' ? 'bg-red-50 text-red-700' :
                          q.status === 'modifie' ? 'bg-blue-50 text-blue-700 animate-pulse' :
                          'bg-yellow-50 text-yellow-850'
                        }`}>
                          {q.status === 'en_attente' ? 'À Chiffrer' : q.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-500 leading-relaxed font-light">
                        <div className="space-y-2 text-left bg-stone-55 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                          <p className="text-[10px] font-mono uppercase tracking-widest text-[#C9B097] font-bold mb-1 col-span-2">Données Commandeur :</p>
                          <p><strong>Nom & Coordonnées :</strong> {q.name}</p>
                          <p><strong>Téléphone direct :</strong> <a href={`tel:${q.phone}`} className="text-blue-550 underline font-mono font-semibold">{q.phone}</a></p>
                          <p><strong>Email direct :</strong> {q.email}</p>
                          <p><strong>Univers favorisé :</strong> <span className="capitalize font-semibold text-neutral-800">{q.category.replace(/-/g, ' ')}</span></p>
                          <p><strong>Volume total visé :</strong> <span className="font-bold text-neutral-900 font-mono text-sm">{q.targetQuantity} unités</span></p>
                          {q.customLogoUrl && (
                            <p>
                              <strong>Maquette Logo jointe :</strong>{" "}
                              <span className="text-blue-500 font-mono break-all">{q.customLogoUrl}</span>
                            </p>
                          )}
                        </div>

                        <div className="space-y-2 text-left bg-stone-50 p-4 rounded-2xl border border-stone-100 flex flex-col justify-between">
                          <div>
                            <p className="text-[10px] font-mono uppercase tracking-widest text-[#C9B097] font-semibold mb-1">Cahier des charges & consignes :</p>
                            <p className="italic bg-white p-3.5 rounded-xl border border-stone-200/50 font-light leading-relaxed text-stone-600 font-serif">
                              "{q.description}"
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Eval and chiffrage form */}
                      {q.status !== 'accepte' ? (
                        <div className="pt-4 border-t border-dashed border-stone-200 space-y-4">
                          <div className="flex items-center space-x-2 text-xs font-bold text-neutral-800">
                            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                            <span className="uppercase tracking-widest font-mono text-[9px] text-[#A67C52]">Émissions de tarifs d'atelier</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                            
                            <div className="space-y-1 text-left">
                              <label className="text-[10px] font-mono text-stone-400 font-semibold block">Prix proposé unitaire (FCFA)</label>
                              <input
                                type="number"
                                value={localResp.offerAmount}
                                onChange={e => handleResponseChange(q.id, 'offerAmount', Number(e.target.value))}
                                className="w-full px-4 py-2.5 bg-stone-50 rounded-xl text-xs border border-stone-200 focus:bg-white focus:border-[#D4AF37] outline-none font-mono font-bold"
                              />
                            </div>

                            <div className="space-y-1 text-left sm:col-span-2">
                              <label className="text-[10px] font-mono text-stone-400 font-semibold block">Précisions techniques d'atelier</label>
                              <input
                                type="text"
                                value={localResp.notes}
                                onChange={e => handleResponseChange(q.id, 'notes', e.target.value)}
                                placeholder="Finition satin doré, calages et matrices fers à dorer d'ateliers d'art inclus."
                                className="w-full px-4 py-2.5 bg-stone-50 rounded-xl text-xs border border-stone-200 focus:bg-white focus:border-[#D4AF37] outline-none font-light"
                              />
                            </div>

                          </div>

                          <div className="flex flex-wrap gap-2 justify-end pt-2">
                            <button
                              type="button"
                              onClick={() => handleQuoteResponseFormSubmit(q.id)}
                              className="bg-white border border-[#D4AF37] text-amber-900 text-[10px] font-mono uppercase tracking-widest font-bold px-5 py-3 rounded-xl hover:bg-[#FAF6F0] transition cursor-pointer"
                            >
                              Transmettre la Cotation
                            </button>
                            <button
                              type="button"
                              onClick={() => handleConvertQuoteToOrder(q)}
                              className="bg-[#111111] hover:bg-neutral-900 text-white text-[10px] font-mono uppercase tracking-widest font-bold px-6 py-3 rounded-xl shadow-md transition flex items-center space-x-1.5 cursor-pointer border border-[#D4AF37]/15"
                            >
                              <span>Convertir en commande d'Atelier</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-green-50 border border-green-150 rounded-2xl text-xs text-green-800 text-left">
                          ✓ Ce projet a été validé d'atelier et transformé en bon de commande officiel.
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* TAB 5: PROMOTIONS */}
        {activeTab === 'promotions' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200/50 shadow-sm text-left space-y-1">
              <h3 className="font-serif text-lg font-bold text-neutral-900">Bannières & Coupons d'Atelier</h3>
              <p className="text-xs text-stone-400 font-light">Gérez les codes promotionnels pour les célébrations d'exception.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white p-6 rounded-3xl border border-stone-200/60 shadow-sm space-y-4 md:col-span-1 border-t-2 border-t-[#D4AF37]">
                <h4 className="font-serif text-sm font-bold text-neutral-900 flex items-center space-x-2">
                  <Percent className="w-4 h-4 text-[#D4AF37]" />
                  <span>Nouveau Coupon</span>
                </h4>
                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-stone-400 block uppercase">Code de réduction</label>
                    <input type="text" placeholder="Ex: KORITE20" className="w-full p-2.5 border rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-stone-400 block uppercase">Pourcentage de réduction %</label>
                    <input type="number" placeholder="Ex: 20" className="w-full p-2.5 border rounded-xl" />
                  </div>
                  <button className="w-full bg-[#111111] hover:bg-neutral-900 text-[#FAF6F0] py-4 rounded-xl uppercase tracking-widest font-bold font-mono text-[9px] cursor-pointer border border-[#D4AF37]/15">
                    Enregistrer le coupon d'or
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200/60 shadow-sm md:col-span-2 space-y-4">
                <h4 className="font-serif text-sm font-bold text-neutral-900 pb-1 border-b border-stone-100">Registres des Coupons Actifs</h4>
                <div className="space-y-3">
                  {promotions.map(promo => (
                    <div key={promo.id} className="p-4 border border-stone-100 bg-[#FAF9F6] rounded-2xl flex items-center justify-between text-xs font-light text-left">
                      <div className="space-y-1">
                        <span className="font-mono font-bold bg-[#D4AF37]/10 text-[#A67C52] px-2.5 py-1 rounded-lg border border-[#D4AF37]/25">
                          {promo.code}
                        </span>
                        <p className="text-stone-400 pt-2">Dépôt de {promo.discountPercent}% • {promo.description}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-semibold ${
                        promo.active ? 'bg-green-50 text-green-700' : 'bg-stone-200 text-stone-400'
                      }`}>
                        {promo.active ? 'Actif' : 'Désactivé'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CRM CLIENTS */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200/50 shadow-sm text-left space-y-1">
              <h3 className="font-serif text-lg font-bold text-neutral-900"> CRM & Portefeuille Clients d'Art de Table</h3>
              <p className="text-xs text-stone-400 font-light">Analysez la valeur cumulée et l'historique d'engagement de vos clients.</p>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200/50 shadow-sm overflow-hidden border-b border-stone-150">
              <table className="w-full text-left text-xs text-stone-500">
                <thead className="bg-[#FAF6F0] font-mono text-[10px] uppercase text-stone-700 tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Nom client</th>
                    <th className="py-4 px-6">Canal / Contact</th>
                    <th className="py-4 px-6 text-center">Volume Commandes</th>
                    <th className="py-4 px-6 text-right">Volume Financement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-light">
                  {clientsList.map((cl, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/50 transition">
                      <td className="py-4 px-6 flex items-center space-x-3.5">
                        <div className="w-8 h-8 rounded-full bg-[#FAF6F0] border border-[#D4AF37]/35 flex items-center justify-center font-bold font-serif text-[#D4AF37]">
                          {cl.name[0] || 'U'}
                        </div>
                        <span className="font-serif font-black text-neutral-900 text-sm">{cl.name}</span>
                      </td>
                      <td className="py-4 px-6 font-mono text-[11px]">
                        <p className="text-neutral-800 font-light">{cl.email}</p>
                        <p className="text-[#A67C52] font-semibold">{cl.phone}</p>
                      </td>
                      <td className="py-4 px-6 text-center font-mono font-semibold">{cl.totalOrdersCount} commande(s)</td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-neutral-900">{cl.spendTotal.toLocaleString()} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: CMS CONTENT */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            <form onSubmit={(e) => { e.preventDefault(); alert("Contenu CMS d'univers mis à jour !"); }} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/50 shadow-sm space-y-6 text-left border-t-2 border-t-[#D4AF37]">
              <div className="space-y-1 border-b border-stone-100 pb-4">
                <h3 className="font-serif text-lg font-bold text-neutral-900">Éditeur de Site CMS d'Exception</h3>
                <p className="text-xs text-stone-400 font-light">Adaptez les textes, les adresses d'ateliers et les coordonnées s'affichant sur le store public.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-700">
                <div className="space-y-1.5">
                  <label className="font-mono text-stone-400 block uppercase">Titre d'En-tête Hero d'accueil</label>
                  <input
                    type="text"
                    value={contentForm.heroTitle}
                    onChange={e => setContentForm({ ...contentForm, heroTitle: e.target.value })}
                    className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:border-[#D4AF37] bg-[#FAF9F6]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-stone-400 block uppercase">Phrase d'accompagnement Hero d'accueil</label>
                  <input
                    type="text"
                    value={contentForm.heroTagline}
                    onChange={e => setContentForm({ ...contentForm, heroTagline: e.target.value })}
                    className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:border-[#D4AF37] bg-[#FAF9F6]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-stone-400 block uppercase">Téléphone d'Atelier Officiel</label>
                  <input
                    type="text"
                    value={contentForm.contactPhone}
                    onChange={e => setContentForm({ ...contentForm, contactPhone: e.target.value })}
                    className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:border-[#D4AF37] bg-[#FAF9F6] font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-stone-400 block uppercase">Adresse Physique Showroom</label>
                  <input
                    type="text"
                    value={contentForm.contactAddress}
                    onChange={e => setContentForm({ ...contentForm, contactAddress: e.target.value })}
                    className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:border-[#D4AF37] bg-[#FAF9F6]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-[#111111] hover:bg-black text-[#FAF6F0] text-xs font-mono uppercase tracking-widest font-bold px-6 py-4 rounded-xl cursor-pointer shadow border border-[#D4AF37]/15"
                >
                  Garder & Sauvegarder l'Univers
                </button>
              </div>
            </form>

            {/* Central Media Library and Slides CMS Console */}
            <AdminMediaLibrary />
          </div>
        )}

      </main>

      {/* Interactive product image selector overlay modal from media collection */}
      {productImagePicker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in text-left">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3 shrink-0">
              <h3 className="font-serif text-sm font-bold text-stone-900">{productImagePicker.title}</h3>
              <button 
                type="button" 
                onClick={() => setProductImagePicker(null)} 
                className="text-stone-400 hover:text-black p-1 bg-stone-100 hover:bg-stone-200 rounded-full cursor-pointer transition"
              >
                ✕
              </button>
            </div>
            
            <p className="text-xs text-stone-500 shrink-0 font-light font-sans">
              Sélectionnez ci-dessous l'une des photographies professionnelles de votre Médiathèque Centrale d'Ateliers.
            </p>

            {/* List with scroll */}
            <div className="flex-1 overflow-y-auto pr-1">
              {adminMediaItems.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-2xl bg-stone-50">
                  <p className="text-xs text-stone-400">Aucun fichier trouvé dans la médiathèque.</p>
                  <p className="text-[10px] text-stone-400 font-mono mt-1">Téléversez des visuels dans l'onglet "Édition de Site &gt; Médiathèque" d'abord.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {adminMediaItems.map((item, idx) => (
                    <button
                      key={item.id || idx}
                      type="button"
                      onClick={() => {
                        productImagePicker.onSelect(item.url);
                        setProductImagePicker(null);
                      }}
                      className="group border border-stone-200 hover:border-[#8B3A52] rounded-2xl p-2 bg-white flex flex-col gap-2 text-left hover:shadow-md transition cursor-pointer"
                    >
                      <div className="aspect-square bg-stone-50 rounded-xl overflow-hidden relative border">
                        <img src={item.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-350" />
                      </div>
                      <div className="px-1 shrink-0">
                        <p className="font-serif text-neutral-900 font-bold text-[10px] truncate">{item.name}</p>
                        <p className="text-[8px] text-stone-400 font-mono truncate mt-0.5">{item.id}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t shrink-0">
              <button
                type="button"
                onClick={() => setProductImagePicker(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-xs uppercase rounded-xl cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
