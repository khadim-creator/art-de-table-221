import React, { useEffect } from 'react';
import { ArrowRight, ShoppingBag, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartActivityToast: React.FC = () => {
  const { cart, cartActivity, cartTotals, dismissCartActivity, setView } = useApp();

  useEffect(() => {
    if (!cartActivity) return;

    const timer = window.setTimeout(() => {
      dismissCartActivity();
    }, 5200);

    return () => window.clearTimeout(timer);
  }, [cartActivity, dismissCartActivity]);

  if (!cartActivity) return null;

  const product = cartActivity.item.product;
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=500';
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <aside
      key={cartActivity.id}
      className="fixed right-3 top-28 z-[60] w-[min(22rem,calc(100vw-1.5rem))] translate-x-0 rounded-[1.15rem] border border-[#A67C52]/18 bg-white/96 p-3 text-left shadow-[0_18px_55px_rgba(42,27,19,0.16)] backdrop-blur-md transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] sm:right-5"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#FAF4EF]">
          <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#A67C52]">
              Ajouté au panier
            </p>
            <button
              type="button"
              onClick={dismissCartActivity}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-[#FAF4EF] hover:text-[#8C6845]"
              aria-label="Fermer le suivi panier"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <h3 className="mt-1 truncate font-display text-[1.05rem] font-semibold italic leading-tight text-[#2A1B13]">
            {product.name}
          </h3>
          <p className="mt-1 text-[11px] text-stone-500">
            +{cartActivity.addedQuantity} unité{cartActivity.addedQuantity > 1 ? 's' : ''} · {itemCount} article{itemCount > 1 ? 's' : ''} en cours
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl bg-[#FAF4EF] px-3 py-2">
        <div className="flex items-center gap-2 text-[#8C6845]">
          <ShoppingBag className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Suivi courses</span>
        </div>
        <span className="font-display text-sm font-semibold italic text-[#2A1B13]">
          {cartTotals.total.toLocaleString()} FCFA
        </span>
      </div>

      <button
        type="button"
        onClick={() => {
          dismissCartActivity();
          setView('cart');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#A67C52] px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-transform duration-150 active:scale-[0.98]"
      >
        Voir mon panier
        <ArrowRight className="h-4 w-4" />
      </button>
    </aside>
  );
};
