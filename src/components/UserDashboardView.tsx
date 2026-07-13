import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, ClipboardList, TrendingUp, Inbox, ShieldAlert, BadgeInfo, CheckCircle, Mail, Phone, Calendar } from 'lucide-react';

export const UserDashboardView: React.FC = () => {
  const { 
    currentUser, 
    orders, 
    quotes, 
    setView, 
    triggerWhatsAppOrder 
  } = useApp();

  // Écouteur automatique pour rafraîchir l'interface client lors des modifications de l'admin
  useEffect(() => {
    const handleCatalogRefresh = () => {
      // Si tes données proviennent d'un contexte global ou d'une fonction de rechargement :
      // exemple: refreshData();
      
      // Si tu as besoin de forcer React à rafraîchir l'affichage local :
      window.location.reload(); 
    };

    window.addEventListener('catalog_updated', handleCatalogRefresh);
    return () => window.removeEventListener('catalog_updated', handleCatalogRefresh);
  }, []);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-6 md:pt-10 text-left px-4">
        <div className="text-center space-y-4 max-w-sm">
          <ShieldAlert className="w-12 h-12 text-[#E8A5A5] mx-auto animate-bounce" />
          <h2 className="font-serif text-xl font-bold text-[#2D2D2D]">Accès réservé aux abonnés</h2>
          <p className="text-xs text-gray-500 font-light leading-relaxed">
            Pour suivre l'état de fabrication de vos packagings de luxe et interagir avec les devis de nos ateliers sénégalais, veuillez vous connecter.
          </p>
          <button
            id="dashboard-login-btn"
            onClick={() => setView('login')}
            className="btn-primary w-full h-12 uppercase tracking-widest text-xs"
          >
            Se Connecter / S'inscrire
          </button>
        </div>
      </div>
    );
  }

  // Helper colors for order statuses
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en_attente':
        return <span className="px-2.5 py-1 text-[9px] font-mono uppercase bg-yellow-50 text-yellow-600 border border-yellow-100 rounded-full font-bold">En attente</span>;
      case 'en_production':
        return <span className="px-2.5 py-1 text-[9px] font-mono uppercase bg-blue-50 text-blue-600 border border-blue-100 rounded-full font-bold">En production</span>;
      case 'expediee':
        return <span className="px-2.5 py-1 text-[9px] font-mono uppercase bg-purple-50 text-purple-600 border border-purple-100 rounded-full font-bold">Expédiée</span>;
      case 'livree':
        return <span className="px-2.5 py-1 text-[9px] font-mono uppercase bg-green-50 text-green-600 border border-green-100 rounded-full font-bold">Livrée</span>;
      case 'annulee':
        return <span className="px-2.5 py-1 text-[9px] font-mono uppercase bg-red-50 text-red-600 border border-red-100 rounded-full font-bold">Annulée</span>;
      
      // Quotes spec status
      case 'approuve':
        return <span className="px-2.5 py-1 text-[9px] font-mono uppercase bg-green-50 text-green-600 border border-green-100 rounded-full font-bold">Approuvé</span>;
      case 'refuse':
        return <span className="px-2.5 py-1 text-[9px] font-mono uppercase bg-red-50 text-red-600 border border-red-100 rounded-full font-bold">Refusé</span>;
      case 'modifie':
        return <span className="px-2.5 py-1 text-[9px] font-mono uppercase bg-amber-50 text-amber-600 border border-amber-100 rounded-full font-bold">Tarif Ajusté</span>;
      default:
        return <span className="px-2.5 py-1 text-[9px] font-mono uppercase bg-gray-50 text-gray-500 border border-gray-150 rounded-full font-bold">{status}</span>;
    }
  };

  const handlePayDevisWhatsApp = (quote: any) => {
    const phoneNumber = "221778715875";
    const text = `*REGLEMENT DEVIS - ART DE TABLE*%0A%0A` +
      `*Client:* ${quote.name}%0A` +
      `*ID Projet:* ${quote.id.slice(0, 8).toUpperCase()}%0A` +
      `*Cible:* ${quote.targetQuantity} unités%0A` +
      `*Montant validé par l'Atelier:* ${quote.adminOfferAmount} FCFA%0A%0A` +
      `_Je souhaite de ce pas valider et régler l'acompte Wave/Orange Money de ce devis._`;
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-transparent text-left">
      <div className="section-container section-spacer space-y-12">
        
        {/* Intro */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-8">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2D2D]">
              Bienvenue, {currentUser.displayName} !
            </h1>
            <p className="text-xs text-gray-400 font-light flex items-center space-x-1.5">
              <span>{currentUser.email}</span>
              <span className="text-gray-200">|</span>
              <span>Espace Client Sécurisé de Dakar</span>
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              id="dashboard-shop-redirect-btn"
              onClick={() => setView('shop')}
              className="btn-secondary px-6 h-10 text-xs uppercase tracking-widest font-semibold"
            >
              Parcourir la Boutique
            </button>
            {(currentUser.isAdmin || currentUser.email?.toLowerCase() === 'khadidia@art.detable.com' || currentUser.email?.toLowerCase() === 'khadxxm05@gmail.com') && (
              <button
                id="dashboard-admin-redirect-btn"
                onClick={() => setView('admin-dashboard')}
                className="btn-primary bg-[#D4AF37] hover:bg-[#c39e2c] border-transparent text-white px-6 h-10 text-xs uppercase tracking-widest font-semibold shadow-lg shadow-[#D4AF37]/15"
              >
                Accéder au Dashboard Admin
              </button>
            )}
          </div>
        </div>

        {/* Info Grid split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN 1: Profile & Counters (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Profile detail card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-5">
              <div className="flex items-center space-x-4">
                <span className="p-4 bg-[#FDF2F2] rounded-2xl text-[#E8A5A5]">
                  <User className="icon-md" />
                </span>
                <div>
                  <h3 className="font-serif text-base font-bold text-[#2D2D2D]">{currentUser.displayName}</h3>
                  <p className="text-[10px] font-mono text-gray-400">FICHE CONTACT VERIFIÉE</p>
                </div>
              </div>

              <div className="border-t border-gray-50 pt-4 space-y-3.5 text-xs font-light text-gray-500">
                <div className="flex items-center space-x-2">
                  <Mail className="icon-sm text-gray-400" />
                  <span>{currentUser.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="icon-sm text-gray-400" />
                  <span>+221 (Dakar Bureau de Cérémonies)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="icon-sm text-gray-400" />
                  <span>Inscrit sur le store national</span>
                </div>
              </div>
            </div>

            {/* Live Stats summary counters */}
            <div className="bg-gradient-to-br from-[#2D2D2D] to-black text-white rounded-3xl p-6 border border-white/5 space-y-5 shadow-xl">
              <h3 className="font-serif text-sm font-semibold tracking-wider text-white uppercase border-b border-white/5 pb-2">
                Tableau de Synthèse
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[9px] font-mono text-gray-400 uppercase">Commandes</p>
                  <p className="font-serif text-2xl font-bold text-[#E8A5A5]">{orders.length}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[9px] font-mono text-gray-400 uppercase">Devis d'Atelier</p>
                  <p className="font-serif text-2xl font-bold text-[#D4AF37]">{quotes.length}</p>
                </div>
              </div>
            </div>

          </div>

          {/* COLUMN 2: Orders & Quotes History Panels (8 Columns) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. PRODUCT ORDERS BLOCK */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
              <h2 className="font-serif text-lg font-bold text-[#2D2D2D] border-b border-gray-50 pb-4 flex items-center space-x-2">
                <ClipboardList className="icon-md text-[#E8A5A5]" />
                <span>Suivi de vos commandes physiques</span>
              </h2>

              {orders.length === 0 ? (
                <div className="py-12 text-center text-gray-400 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto text-gray-450 border">
                    <Inbox className="icon-md" />
                  </div>
                  <p className="text-xs font-light">Aucune commande enregistrée à cette adresse.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((ord) => (
                    <div
                      id={`dashboard-order-${ord.id}`}
                      key={ord.id}
                      className="border border-gray-105 rounded-2xl p-5 hover:border-[#E8A5A5] transition space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-50 pb-3 gap-3">
                        <div>
                          <p className="text-[10px] font-mono font-bold text-gray-400">COMMANDÉ LE {new Date(ord.createdAt).toLocaleDateString('fr-FR')}</p>
                          <h4 className="font-serif text-sm font-bold text-[#2D2D2D]">
                            Code Réf: {ord.id.toUpperCase().slice(0, 8)}
                          </h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(ord.status)}
                        </div>
                      </div>

                      {/* Items details */}
                      <div className="space-y-2">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-gray-600 font-light text-left">
                            <span>• {it.name} <span className="font-bold text-[#2D2D2D]">x{it.quantity}</span></span>
                            <span className="font-mono text-gray-500 font-medium">{(it.price * it.quantity).toLocaleString()} F</span>
                          </div>
                        ))}
                      </div>

                      {/* Summary actions footer */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-gray-50 pt-3 gap-4">
                        <div className="text-left">
                          <p className="text-[9px] text-gray-400 font-mono">LIVRÉ À L'ADRESSE: {ord.address}</p>
                          <p className="text-xs font-bold text-[#20ba59]">Total final: {ord.totalAmount.toLocaleString()} FCFA</p>
                        </div>
                        <button
                          id={`order-retry-wa-${ord.id}`}
                          onClick={() => triggerWhatsAppOrder(ord)}
                          className="btn-secondary px-4.5 py-2 text-xs font-semibold hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition flex items-center space-x-1.5 text-[#4A4A4A]"
                        >
                          <span>Renvoyer requête WhatsApp</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* 2. CUSTOM DEVIS QUOTE BLOCK */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
              <h2 className="font-serif text-lg font-bold text-[#2D2D2D] border-b border-gray-50 pb-4 flex items-center space-x-2">
                <TrendingUp className="icon-md text-[#D4AF37]" />
                <span>Mes demandes de Devis en cours</span>
              </h2>

              {quotes.length === 0 ? (
                <div className="py-12 text-center text-gray-400 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto text-gray-450 border">
                    <Inbox className="icon-md" />
                  </div>
                  <p className="text-xs font-light">Vous n'avez pas de demande de devis en cours d'évaluation.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {quotes.map((q) => (
                    <div
                      id={`dashboard-quote-${q.id}`}
                      key={q.id}
                      className="border border-gray-100 rounded-2xl p-5 hover:border-[#D4AF37]/35 transition space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-50 pb-3 gap-2">
                        <div>
                          <p className="text-[10px] font-mono font-bold text-gray-400">DÉPOSÉ LE {new Date(q.createdAt).toLocaleDateString('fr-FR')}</p>
                          <h4 className="font-serif text-sm font-bold text-[#2D2D2D]">
                            Cahier des charges #{q.id.toUpperCase().slice(0, 8)}
                          </h4>
                        </div>
                        <div>{getStatusBadge(q.status)}</div>
                      </div>

                      {/* Specs */}
                      <div className="space-y-1.5 text-xs text-gray-600 font-light text-left leading-relaxed">
                        <p><strong>Univers:</strong> {q.category.split('-').join(' ')}</p>
                        <p><strong>Volume visé:</strong> {q.targetQuantity} pièces personnalisées</p>
                        <p><strong>Votre expression de besoin:</strong> "{q.description}"</p>
                      </div>

                      {/* Admin response annotation */}
                      {(q.status === 'approuve' || q.status === 'modifie' || q.adminNotes) && (
                        <div className="p-4 bg-[#FDF2F2] rounded-xl border border-[#E8A5A5]/10 space-y-2 text-xs">
                          {q.adminOfferAmount && (
                            <p className="font-bold text-[#E8A5A5] font-serif text-sm">
                              👉 Prix de l'offre validé par le showroom : {q.adminOfferAmount.toLocaleString()} FCFA
                            </p>
                          )}
                          {q.adminNotes && (
                            <p className="text-gray-500 font-light">
                              📝 <strong>Note du coordinateur d'atelier :</strong> "{q.adminNotes}"
                            </p>
                          )}
                          
                          {/* If status lets them pay */}
                          {(q.status === 'approuve' || q.status === 'modifie') && (
                            <div className="pt-2">
                              <button
                                id={`quote-pay-wa-${q.id}`}
                                onClick={() => handlePayDevisWhatsApp(q)}
                                className="btn-primary text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 flex items-center space-x-2"
                              >
                                <CheckCircle className="icon-sm text-[#25D366]" />
                                <span>Agréer & Commander via WhatsApp</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </main>
  );
};
