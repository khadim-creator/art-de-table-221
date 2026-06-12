import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, AlertCircle, Sparkles, CheckCircle2, ShoppingCart, User, Landmark, HelpCircle } from 'lucide-react';
import { ProductMockup } from './ProductMockup';

export const CartView: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartTotals, 
    applyPromoCode, 
    appliedPromo, 
    removePromo, 
    deliveryMethod, 
    setDeliveryMethod, 
    paymentMethod, 
    setPaymentMethod,
    placeOrder,
    currentUser,
    setView
  } = useApp();

  // Coupon promo state
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState(false);
  const [promoSuccess, setPromoSuccess] = useState(false);

  // Shipping form state
  const [shippingDetails, setShippingDetails] = useState({
    name: currentUser?.displayName || '',
    phone: '',
    email: currentUser?.email || '',
    address: ''
  });

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Auto populate on current user update
  React.useEffect(() => {
    if (currentUser) {
      setShippingDetails(prev => ({
        ...prev,
        name: currentUser.displayName,
        email: currentUser.email
      }));
    }
  }, [currentUser]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    
    const matched = applyPromoCode(promoInput);
    if (matched) {
      setPromoSuccess(true);
      setPromoError(false);
    } else {
      setPromoSuccess(false);
      setPromoError(true);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    if (!currentUser) {
      setView('login');
      return;
    }

    if (!shippingDetails.name || !shippingDetails.phone || !shippingDetails.address) {
      alert("Veuillez remplir les informations obligatoires de livraison (Nom, Téléphone, Adresse).");
      return;
    }

    try {
      setCheckoutLoading(true);
      await placeOrder(shippingDetails);
    } catch (err) {
      console.error(err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAF9F9] pt-32 pb-24 flex items-center justify-center text-left">
        <div className="max-w-md w-full mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 bg-[#FDF2F2] rounded-full flex items-center justify-center mx-auto text-[#E8A5A5] border border-[#E8A5A5]/10 animate-pulse">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-[#2D2D2D]">Votre Panier est vide</h2>
            <p className="text-xs sm:text-sm text-gray-400 font-light max-w-sm mx-auto">
              Retrouvez nos magnifiques boîtes, flacons, sacs de luxe et étiquettes et créez votre personnalisation sur-mesure dès maintenant.
            </p>
          </div>
          <button
            id="empty-cart-back-btn"
            onClick={() => setView('shop')}
            className="inline-flex bg-[#2D2D2D] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold px-8 py-3.5 rounded-full shadow transition"
          >
            Découvrir le Catalogue
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F9] pt-32 pb-24 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2D2D]">Votre Panier de Personnalisation</h1>
          <p className="text-xs text-gray-500 font-light mt-1">
            Gérez vos contenants personnalisés, appliquez vos remises, et complétez votre commande vers WhatsApp et nos registres d'entrepôt Dakar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Column 1: Items List (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Scrollable list frame */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-6">
              
              {cart.map((item, idx) => (
                <div
                  id={`cart-item-${item.product.id}-${idx}`}
                  key={`${item.product.id}-${idx}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-100 last:border-b-0 last:pb-0 gap-4"
                >
                  <div className="flex items-center space-x-4">
                    {/* Item Image */}
                    <div className="w-14 h-14 rounded-xl border overflow-hidden bg-pink-50/10 shrink-0">
                      <ProductMockup
                        productId={item.product.id}
                        className="w-full h-full"
                      />
                    </div>

                    {/* Metadata tags, instructions, and name */}
                    <div className="space-y-1 text-left">
                      <span className="text-[8px] font-mono tracking-widest uppercase text-gray-400">
                        {item.product.category.split('-').join(' ')}
                      </span>
                      <h3 className="font-serif text-sm font-bold text-[#2D2D2D] leading-none">
                        {item.product.name}
                      </h3>
                      
                      {item.customInstructions && (
                        <p className="text-[10px] text-gray-400 font-light max-w-sm line-clamp-1 italic">
                          Consigne: "{item.customInstructions}"
                        </p>
                      )}
                      {item.customLogoUrl && (
                        <span className="inline-block text-[9px] font-mono bg-[#E8A5A5]/10 text-[#E8A5A5] px-2 py-0.5 rounded">
                          {item.customLogoUrl}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity adjustment & Delete */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
                    
                    <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.customInstructions, item.quantity - 10)}
                        className="w-7 h-7 text-[#E8A5A5] font-mono font-bold flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-bold text-[#2D2D2D]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.customInstructions, item.quantity + 10)}
                        className="w-7 h-7 text-[#E8A5A5] font-mono font-bold flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-405 font-mono">SOUS-TOTAL</p>
                      <p className="text-[#2D2D2D] font-serif font-bold text-sm">
                        {(item.quantity * item.product.price).toLocaleString()} FCFA
                      </p>
                    </div>

                    <button
                      id={`cart-delete-${item.product.id}-${idx}`}
                      onClick={() => removeFromCart(item.product.id, item.customInstructions)}
                      className="text-gray-450 hover:text-red-500 transition p-2 cursor-pointer"
                      title="Retirer du panier"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              ))}

            </div>

            {/* Promotion code interface */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="font-serif text-sm font-bold text-[#2D2D2D] flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Utiliser un Code de Promotion (Coupon)</span>
              </h3>
              
              {appliedPromo ? (
                <div className="bg-green-50 p-4 rounded-xl border border-green-150 flex items-center justify-between animate-fade-in text-xs text-green-800">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#25D366]" />
                    <div>
                      <p className="font-bold">Coupon appliqué : {appliedPromo.code}</p>
                      <p className="font-light text-[11px]">{appliedPromo.description}</p>
                    </div>
                  </div>
                  <button
                    id="cart-remove-promo-btn"
                    onClick={removePromo}
                    className="text-xs uppercase font-mono font-bold text-red-500 hover:underline"
                  >
                    Retirer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex space-x-3 items-center">
                  <input
                    id="cart-promo-input"
                    type="text"
                    value={promoInput}
                    onChange={e => setPromoInput(e.target.value)}
                    placeholder="Ex: TERANGA15, SOUMAY20..."
                    className="flex-1 px-4 py-4 bg-gray-50 rounded-xl text-base border border-transparent focus:border-[#E8A5A5] outline-none transition uppercase font-mono h-12"
                  />
                  <button
                    id="cart-apply-promo-btn"
                    type="submit"
                    className="bg-[#2D2D2D] hover:bg-black text-white px-6 h-12 rounded-xl text-xs uppercase tracking-widest font-semibold transition cursor-pointer"
                  >
                    Valider
                  </button>
                </form>
              )}

              {promoError && (
                <p className="text-[11px] text-red-500 font-light flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Code invalide, expiré ou inactif.</span>
                </p>
              )}
            </div>

          </div>

          {/* Column 2: Order Shipping Details Form (5 Columns) */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-6">
            
            <form onSubmit={handleOrderSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
              <h2 className="font-serif text-lg font-bold text-[#2D2D2D] border-b border-gray-50 pb-4">
                Informations de Commande
              </h2>

              {/* Delivery method selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold block">
                  Mode de livraison
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    id="delivery-method-pickup"
                    type="button"
                    onClick={() => setDeliveryMethod("retrait")}
                    className={`p-4 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      deliveryMethod === "retrait"
                        ? 'border-[#E8A5A5] bg-[#FDF2F2]/50 text-[#E8A5A5] font-bold'
                        : 'border-gray-200 text-[#4A4A4A] hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xs">Retrait Showroom</span>
                    <span className="text-[9px] font-mono font-normal">Gratuit - Showroom HLM</span>
                  </button>

                  <button
                    id="delivery-method-shipping"
                    type="button"
                    onClick={() => setDeliveryMethod("livraison")}
                    className={`p-4 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      deliveryMethod === "livraison"
                        ? 'border-[#E8A5A5] bg-[#FDF2F2]/50 text-[#E8A5A5] font-bold'
                        : 'border-gray-200 text-[#4A4A4A] hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xs">Livraison à Domicile</span>
                    <span className="text-[9px] font-mono font-normal">Dakar - 2 000 FCFA</span>
                  </button>
                </div>
              </div>

              {/* Shipping fields */}
              <div className="space-y-4 pt-2">
                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-gray-400 font-bold block">
                    Nom Complet du destinataire *
                  </label>
                  <input
                    id="shipping-name-input"
                    type="text"
                    required
                    value={shippingDetails.name}
                    onChange={e => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                    placeholder="Ex: Seynabou Sow"
                    className="w-full px-4 py-4 bg-gray-50 rounded-xl text-base border border-transparent focus:border-[#E8A5A5] focus:bg-white outline-none transition h-12"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-gray-400 font-bold block">
                    Numéro de Téléphone sénégalais *
                  </label>
                  <input
                    id="shipping-phone-input"
                    type="tel"
                    required
                    value={shippingDetails.phone}
                    onChange={e => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                    placeholder="Ex: 77 123 45 67"
                    className="w-full px-4 py-4 bg-gray-50 rounded-xl text-base border border-transparent focus:border-[#E8A5A5] focus:bg-white outline-none transition h-12"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-gray-400 font-bold block">
                    Adresse de livraison complète *
                  </label>
                  <input
                    id="shipping-address-input"
                    type="text"
                    required
                    value={shippingDetails.address}
                    onChange={e => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                    placeholder="Ex: Dakar, Point E, Rue de la Résidence, Villa 12"
                    className="w-full px-4 py-4 bg-gray-50 rounded-xl text-base border border-transparent focus:border-[#E8A5A5] focus:bg-white outline-none transition h-12"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-gray-400 font-bold block">
                    Adresse Courriel (Email)
                  </label>
                  <input
                    id="shipping-email-input"
                    type="email"
                    value={shippingDetails.email}
                    onChange={e => setShippingDetails({ ...shippingDetails, email: e.target.value })}
                    placeholder="Ex: seynabou@gmail.com"
                    className="w-full px-4 py-4 bg-gray-50 rounded-xl text-base border border-transparent focus:border-[#E8A5A5] focus:bg-white outline-none transition h-12"
                  />
                </div>
              </div>

              {/* Payment Selectors */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold block">
                  Méthode de paiement locale
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    id="payment-method-wave"
                    type="button"
                    onClick={() => setPaymentMethod("wave")}
                    className={`px-2 py-3.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      paymentMethod === "wave"
                        ? 'border-blue-500 bg-blue-50 text-blue-600 font-bold'
                        : 'border-gray-200 text-[#4A4A4A] hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-[10px] font-bold font-mono tracking-wider">WAVE</span>
                  </button>

                  <button
                    id="payment-method-orange"
                    type="button"
                    onClick={() => setPaymentMethod("orange_money")}
                    className={`px-2 py-3.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      paymentMethod === "orange_money"
                        ? 'border-orange-500 bg-orange-50 text-orange-600 font-bold'
                        : 'border-gray-200 text-[#4A4A4A] hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-[10px] font-bold font-mono tracking-wider">O. MONEY</span>
                  </button>

                  <button
                    id="payment-method-cod"
                    type="button"
                    onClick={() => setPaymentMethod("cash_on_delivery")}
                    className={`px-2 py-3.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      paymentMethod === "cash_on_delivery"
                        ? 'border-green-500 bg-green-50 text-green-600 font-bold'
                        : 'border-gray-200 text-[#4A4A4A] hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-[10px] font-bold font-mono tracking-wider">À LIVRER</span>
                  </button>
                </div>
              </div>

              {/* Totals panel list */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-light">Sous-total :</span>
                  <span className="font-mono font-bold text-[#2D2D2D]">
                    {cartTotals.subtotal.toLocaleString()} FCFA
                  </span>
                </div>
                
                {cartTotals.discount > 0 && (
                  <div className="flex justify-between items-center text-xs text-green-650 font-bold">
                    <span>Remise coupon :</span>
                    <span className="font-mono">
                      -{cartTotals.discount.toLocaleString()} FCFA
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-light">Livraison Dakar :</span>
                  <span className="font-mono font-bold text-[#2D2D2D]">
                    {cartTotals.delivery === 0 ? 'Gratuit (Retrait)' : `${cartTotals.delivery.toLocaleString()} FCFA`}
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-dashed border-gray-100 pt-3">
                  <span className="font-serif text-sm sm:text-base font-bold text-[#2D2D2D]">Montant Total :</span>
                  <span className="font-serif text-lg sm:text-xl font-bold text-[#E8A5A5]">
                    {cartTotals.total.toLocaleString()} FCFA
                  </span>
                </div>
              </div>

              {/* Checkout actions */}
              <div className="pt-2">
                <button
                  id="cart-submit-order-btn"
                  type="submit"
                  disabled={checkoutLoading}
                  className="w-full bg-[#E8A5A5] hover:bg-[#de9393] text-white text-xs uppercase tracking-widest font-semibold h-12 rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-sm"
                >
                  {checkoutLoading ? (
                    <span>Veuillez patienter... Enregistrement</span>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Passer ma commande via WhatsApp</span>
                    </>
                  )}
                </button>
                
                {!currentUser && (
                  <div className="text-center pt-4">
                    <button
                      type="button"
                      onClick={() => setView('login')}
                      className="text-[11px] uppercase tracking-wider text-stone-500 hover:text-[#E8A5A5] transition-colors"
                    >
                      Pour suivre vos commandes sur-mesure, connectez-vous ici
                    </button>
                  </div>
                )}
              </div>

            </form>

          </div>

        </div>

      </div>
    </main>
  );
};
