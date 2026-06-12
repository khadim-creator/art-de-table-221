import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, FileText, CheckCircle2, User, AlertCircle, Sparkles } from 'lucide-react';

export const QuoteRequestView: React.FC = () => {
  const { submitQuoteRequest, currentUser, setView, categories } = useApp();

  const [formData, setFormData] = useState({
    name: currentUser?.displayName || '',
    phone: '',
    email: currentUser?.email || '',
    description: '',
    targetQuantity: 100,
    category: 'evenementiel',
    customLogoUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync profile details if logged in
  React.useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.displayName,
        email: currentUser.email
      }));
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setView('login');
      return;
    }

    if (!formData.name || !formData.phone || !formData.description) {
      alert("Veuillez remplir les champs obligatoires (Nom, Téléphone, Message de projet).");
      return;
    }

    try {
      setLoading(true);
      await submitQuoteRequest({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        description: formData.description,
        targetQuantity: Number(formData.targetQuantity),
        category: formData.category,
        customLogoUrl: formData.customLogoUrl || 'Sans logo'
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData(prev => ({
          ...prev,
          description: '',
          targetQuantity: 100,
          customLogoUrl: ''
        }));
      }, 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F9] pt-32 pb-24 text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title area */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase font-semibold">
            Service Devis Sur-Mesure
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2D2D] tracking-tight">
            Demande de Cotation Prestige
          </h2>
          <div className="h-0.5 w-16 bg-[#E8A5A5] mx-auto rounded" />
          <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
            Vous organisez un grand mariage, un baptême somptueux ou un événement d'entreprise à Dakar ? Confiez-nous vos volumes et recevez une offre sur-mesure sous 2h par email et WhatsApp.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-gray-150 shadow-sm">
          {success ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-fade-in text-center">
              <CheckCircle2 className="w-16 h-16 text-[#25D366] animate-bounce" />
              <h3 className="font-serif text-2xl font-bold text-[#2D2D2D]">Demande de Devis Envoyée !</h3>
              <p className="text-xs text-gray-500 font-light max-w-md leading-relaxed">
                Votre demande de cotation sur-mesure a bien été enregistrée dans nos registres d'atelier. Un message a également été préparé pour WhatsApp pour une confirmation instantanée.
              </p>
              <div className="pt-4 flex space-x-4">
                <button
                  id="quote-success-dashboard-btn"
                  onClick={() => setView('dashboard')}
                  className="bg-[#2D2D2D] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold px-6 py-3.5 rounded-xl transition"
                >
                  Suivre dans mon Espace
                </button>
                <button
                  id="quote-success-shop-btn"
                  onClick={() => setView('shop')}
                  className="bg-gray-100 hover:bg-gray-200 text-[#4A4A4A] text-xs uppercase tracking-widest font-semibold px-6 py-3.5 rounded-xl transition"
                >
                  Poursuivre mes Achats
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {!currentUser && (
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-xs text-amber-800 flex items-start space-x-3 text-left">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">Connexion Client Obligatoire</p>
                    <p className="font-light">
                      Pour soumettre et suivre l'avancement de votre devis officiel, vous devez posséder un compte client Art de Table.
                    </p>
                    <button
                      id="quote-login-btn"
                      type="button"
                      onClick={() => setView('login')}
                      className="text-[#E8A5A5] font-bold underline hover:text-[#d38585] block pt-1"
                    >
                      Se connecter ou s'inscrire en 1 clic
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-[#2D2D2D] font-bold block">
                    Votre Nom Complet *
                  </label>
                  <input
                    id="quote-name-input"
                    type="text"
                    required
                    disabled={!currentUser}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Penda Ndiaye"
                    className="w-full px-4 py-4 bg-gray-50 rounded-xl text-base border border-transparent focus:border-[#E8A5A5] focus:bg-white outline-none transition disabled:opacity-50 h-[48px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-[#2D2D2D] font-bold block">
                    Téléphone Portable Sénégalais *
                  </label>
                  <input
                    id="quote-phone-input"
                    type="tel"
                    required
                    disabled={!currentUser}
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ex: +221 77 123 45 67"
                    className="w-full px-4 py-4 bg-gray-50 rounded-xl text-base border border-transparent focus:border-[#E8A5A5] focus:bg-white outline-none transition disabled:opacity-50 h-[48px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-[#2D2D2D] font-bold block">
                    Catégorie Principale
                  </label>
                  <select
                    id="quote-category-select"
                    disabled={!currentUser}
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-xs sm:text-sm border border-transparent focus:border-[#E8A5A5] focus:bg-white outline-none transition disabled:opacity-50 text-[#4A4A4A] h-[48px]"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id || cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-[#2D2D2D] font-bold block">
                    Quantité cible estimée *
                  </label>
                  <input
                    id="quote-qty-input"
                    type="number"
                    required
                    disabled={!currentUser}
                    min="10"
                    value={formData.targetQuantity}
                    onChange={e => setFormData({ ...formData, targetQuantity: Number(e.target.value) })}
                    placeholder="Ex: 500"
                    className="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-xs sm:text-sm border border-transparent focus:border-[#E8A5A5] focus:bg-white outline-none transition disabled:opacity-50 h-[48px] font-mono"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-[9px] font-mono uppercase tracking-widest text-[#2D2D2D] font-bold block">
                    Url Fichier Logo d'Inspiration
                  </label>
                  <input
                    id="quote-logo-input"
                    type="text"
                    disabled={!currentUser}
                    value={formData.customLogoUrl}
                    onChange={e => setFormData({ ...formData, customLogoUrl: e.target.value })}
                    placeholder="Lien Dropbox, Drive ou Pinterest"
                    className="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-xs sm:text-sm border border-transparent focus:border-[#E8A5A5] focus:bg-white outline-none transition disabled:opacity-50 h-[48px]"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[9px] font-mono uppercase tracking-widest text-[#2D2D2D] font-bold block">
                  Description détaillée de votre besoin de dorage ou contenant *
                </label>
                <textarea
                   id="quote-desc-input"
                   rows={5}
                   required
                   disabled={!currentUser}
                   value={formData.description}
                   onChange={e => setFormData({ ...formData, description: e.target.value })}
                   placeholder="Expliquez-nous en détail votre projet : type d'ornement (ex: ruban de satin corail avec lettrage blanc poudré), les formats attendus pour chaque boîte, les dates de livraison impératives à Dakar..."
                   className="w-full px-4 py-4 bg-gray-50 rounded-xl text-base border border-transparent focus:border-[#E8A5A5] focus:bg-white outline-none transition disabled:opacity-50 resize-none font-light leading-relaxed"
                />
              </div>

              <button
                id="quote-submit-btn"
                type="submit"
                disabled={loading || !currentUser}
                className="w-full bg-[#2D2D2D] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold py-4 rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer shadow-lg hover:shadow-black/10 disabled:opacity-50"
              >
                {loading ? (
                  <span>Transmission de votre cahier des charges...</span>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Transmettre mon Projet & WhatsApp</span>
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </main>
  );
};
