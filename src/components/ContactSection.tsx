import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      alert("Veuillez remplir les champs obligatoires (Nom, Téléphone, Message).");
      return;
    }
    // Simulate API posting
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 5000);
  };

  return (
    <section className="section-spacer bg-white relative">
      <div className="section-container">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase font-semibold">
            Parlons de vos idées
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2D2D] tracking-tight">
            Contactez notre Showroom
          </h2>
          <div className="h-0.5 w-16 bg-[#E8A5A5] mx-auto rounded" />
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            Une question ou besoin d'assistance ? Écrivez-nous directement ou venez nous rendre visite dans notre showroom de prestige côté marché HLM.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#FDF2F2] p-8 rounded-3xl border border-[#E8A5A5]/10 space-y-6">
              <h3 className="font-serif text-lg font-bold text-[#2D2D2D]">Coordonnées de l'Atelier</h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Notre équipe de designers et d'artisans d'excellence vous accueille du Lundi au Dimanche de 09h30 à 20h00 non-stop.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-4">
                  <span className="p-3 bg-white rounded-2xl text-[#E8A5A5] shadow-sm">
                    <Phone className="icon-md" />
                  </span>
                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Téléphone direct</h4>
                    <p className="text-sm font-semibold text-[#2D2D2D]">+221 77 871 58 75</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="p-3 bg-white rounded-2xl text-[#D4AF37] shadow-sm">
                    <Mail className="icon-md" />
                  </span>
                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Courriel électronique</h4>
                    <p className="text-sm font-semibold text-[#2D2D2D]">contact@artdetable.sn</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="p-3 bg-white rounded-2xl text-[#E8A5A5] shadow-sm">
                    <MapPin className="icon-md" />
                  </span>
                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Showroom Dakar</h4>
                    <p className="text-xs font-semibold text-[#2D2D2D] md:break-words">Jardin Ouagou Niayes, côté marché HLM, en face de la Kaynaan, près de la salle de basket</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated mini map */}
            <div className="bg-gray-50 h-[180px] rounded-3xl overflow-hidden relative shadow-inner border border-gray-100 flex items-center justify-center">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#E8A5A5_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              <div className="text-center z-10 space-y-1 p-4">
                <MapPin className="w-8 h-8 text-[#E8A5A5] mx-auto animate-bounce" />
                <p className="text-xs font-serif font-bold text-[#2D2D2D]">Maison Art de Table</p>
                <p className="text-[9px] text-gray-400">Côté Marché HLM, Dakar, Sénégal</p>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
            {submitted ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-fade-in">
                <CheckCircle2 className="w-16 h-16 text-[#25D366] animate-bounce" />
                <h3 className="font-serif text-xl font-bold text-[#2D2D2D]">Message envoyé avec succès !</h3>
                <p className="text-xs text-gray-500 font-light text-center max-w-sm leading-relaxed">
                  Merci de l'intérêt que vous portez à Art de Table. Un de nos coordinateurs design de l'atelier de Dakar va vous recontacter par téléphone d'ici 2 heures au maximum.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1 text-left">
                    <label className="form-label">
                      Votre Nom Complet *
                    </label>
                    <input
                      id="contact-name-input"
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Fatou Diome"
                      className="form-input"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="form-label">
                      Téléphone Portable *
                    </label>
                    <input
                      id="contact-phone-input"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Ex: +221 77 123 45 67"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1 text-left">
                    <label className="form-label">
                      Adresse Courriel
                    </label>
                    <input
                      id="contact-email-input"
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Ex: fatou@gmail.com"
                      className="form-input"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="form-label">
                      Sujet de discussion
                    </label>
                    <input
                      id="contact-subject-input"
                      type="text"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Ex: Conseils pour baptême"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="form-label">
                    Description de votre projet de packaging *
                  </label>
                  <textarea
                    id="contact-message-input"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Écrivez-nous en décrivant votre événement, le type de cadeaux que vous désirez emballer, la date prévue, etc..."
                    className="form-textarea"
                  />
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  className="btn-primary w-full h-12 uppercase tracking-widest text-sm flex items-center justify-center space-x-2.5"
                >
                  <span>Envoyer ma demande d'échange</span>
                  <Send className="icon-sm" />
                </button>

              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
