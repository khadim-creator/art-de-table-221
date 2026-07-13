import React from 'react';

export const PrivacyPolicyView: React.FC = () => {
  return (
    <main className="min-h-screen bg-white pt-6 md:pt-10 text-left">
      <div className="section-container section-spacer">
        <div className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A67C52]">
              Politique de confidentialité
            </p>
            <h1 className="font-sans text-3xl sm:text-4xl font-black text-[#2D2D2D]">
              Protection de vos données
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-stone-600">
              Cette page explique comment Art de Table collecte, utilise et protège les informations que vous partagez sur le site.
            </p>
          </header>

          <section className="space-y-4 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-sans text-xl font-bold text-[#2D2D2D]">Données collectées</h2>
            <p className="text-sm leading-7 text-stone-600">
              Nous pouvons collecter votre nom, votre adresse email, votre numéro de téléphone, vos demandes de devis et les informations nécessaires au traitement de vos commandes.
            </p>
          </section>

          <section className="space-y-4 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-sans text-xl font-bold text-[#2D2D2D]">Utilisation des données</h2>
            <p className="text-sm leading-7 text-stone-600">
              Les données sont utilisées pour répondre à vos demandes, gérer vos commandes, améliorer l’expérience utilisateur et vous contacter au sujet de votre projet.
            </p>
          </section>

          <section className="space-y-4 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-sans text-xl font-bold text-[#2D2D2D]">Partage et sécurité</h2>
            <p className="text-sm leading-7 text-stone-600">
              Nous ne vendons pas vos données. Nous mettons en place des mesures raisonnables pour protéger vos informations, mais aucun système n’est totalement inviolable.
            </p>
          </section>

          <section className="space-y-4 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-sans text-xl font-bold text-[#2D2D2D]">Vos droits</h2>
            <p className="text-sm leading-7 text-stone-600">
              Vous pouvez demander l’accès, la rectification ou la suppression de vos données en nous contactant via les canaux affichés sur le site.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};
