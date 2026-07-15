import React, { useEffect } from 'react';
import { Award, Heart, CheckCircle2, Gem } from 'lucide-react';
import { QuoteRequestView } from './QuoteRequestView';

export const AboutView: React.FC = () => {
  useEffect(() => {
    document.title = "À propos de nous - Art de Table Sénégal";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Découvrez Art de Table : atelier premium de personnalisation événementielle, emballages de luxe et sacs personnalisés à Dakar, Sénégal.');
    }
  }, []);

  return (
    <main className="min-h-screen bg-transparent pt-6 md:pt-10 text-left">
      {/* Hero Section */}
      <section className="relative overflow-hidden section-spacer bg-white">
        <div className="section-container relative z-10">
          <div className="max-w-3xl space-y-6">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold py-1.5 px-4 bg-[#FDFBF7] rounded-full border border-[#F3E5AB]">
              Qui sommes-nous ?
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-[#2D2D2D] tracking-tight leading-tight">
              L'élégance au service de vos <span className="text-[#E8A5A5] italic">plus beaux moments</span>
            </h1>
            <p className="text-lg sm:text-xl font-light text-gray-500 leading-relaxed max-w-2xl">
              Chez Art de Table, nous transformons chaque événement en une expérience mémorable grâce à des créations personnalisées conçues avec passion, raffinement et souci du détail.
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full hidden lg:block opacity-10 bg-[radial-gradient(#E8A5A5_1px,transparent_1px)] [background-size:16px_16px]" />
      </section>

      {/* Storytelling & Quote Request Section */}
      <section className="section-spacer bg-white border-y border-gray-100">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Narrative */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2D2D]">
                Notre Histoire & Notre Savoir-Faire
              </h2>
              <div className="space-y-4 text-gray-500 font-light leading-relaxed text-sm sm:text-base">
                <p>
                  Art de Table accompagne particuliers, entreprises et organisateurs d'événements dans la création de packagings, cadeaux invités, objets publicitaires et accessoires personnalisés qui font la différence. Notre savoir-faire dakarois allie la tradition de l'accueil sénégalais (Teranga) au design haut de gamme international.
                </p>
                <p>
                  Qu'il s'agisse d'un mariage royal sur la corniche, d'un baptême intime ou du lancement d'une luxueuse marque de cosmétiques africaine, nous pensons chaque contenant comme un écrin d'émotions. Notre atelier utilise des technologies de dorure 3D de pointe associées à l'assemblage manuel minutieux effectué par des artisans locaux passionnés.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-gray-55/40 rounded-2xl border border-gray-100 text-left">
                  <div className="text-2xl font-serif font-black text-[#E8A5A5]">100%</div>
                  <div className="text-xs text-gray-400 font-mono tracking-wider uppercase mt-1">Personnalisable</div>
                </div>
                <div className="p-4 bg-gray-55/40 rounded-2xl border border-gray-100 text-left">
                  <div className="text-2xl font-serif font-black text-[#D4AF37]">110+</div>
                  <div className="text-xs text-gray-400 font-mono tracking-wider uppercase mt-1">Produits Nobles</div>
                </div>
              </div>
            </div>

            {/* Embedded Quote Request Form */}
            <div className="lg:h-full">
              <QuoteRequestView embedded />
            </div>

          </div>
        </div>
      </section>

      {/* Mission, Vision, Values Block */}
      <section className="section-spacer bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Mission Card */}
            <div className="bg-white p-8 rounded-3xl border border-gray-50 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#FDF2F2] flex items-center justify-center text-[#E8A5A5]">
                <Gem className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#2D2D2D]">Notre Mission</h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                Offrir des créations uniques qui captivent l'émotion de vos convives, valorisent vos marques corporatives et subliment vos précieux produits cosmétiques et d'apparat.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white p-8 rounded-3xl border border-gray-50 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#FDFBF7] flex items-center justify-center text-[#D4AF37]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#2D2D2D]">Notre Vision</h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                Devenir le premier atelier panafricain de personnalisation événementielle premium et écoresponsable, rayonnant depuis le Sénégal vers toute l'Afrique de l'Ouest.
              </p>
            </div>

            {/* Values Card */}
            <div className="bg-white p-8 rounded-3xl border border-gray-50 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#F3E5AB]/25 flex items-center justify-center text-yellow-600">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#2D2D2D]">Nos Valeurs</h3>
              <p className="text-sm text-gray-400 font-light leading-relaxed">
                <span className="font-semibold text-gray-600">Excellence</span>, <span className="font-semibold text-gray-600">Passion</span> de la finition, <span className="font-semibold text-gray-600">Authenticité</span> locale, <span className="font-semibold text-gray-600">Créativité</span> sans cesse renouvelée et sens inné de la <span className="font-semibold text-gray-600">Teranga</span>.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-spacer bg-white">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-serif font-bold text-[#2D2D2D]">Pourquoi Choisir la Maison Art de Table ?</h2>
            <p className="text-sm text-gray-400 font-light">
              Des gages d'excellence qui garantissent la sérénité et le succès de tous vos événements privés et corporatifs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="w-5 h-5 text-[#E8A5A5]" />
              </div>
              <div className="space-y-1 text-left">
                <h4 className="text-sm font-semibold text-[#2D2D2D]">Accompagnement de A à Z</h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  De la validation de vos maquettes graphiques à la production et livraison, nos conseillers artistiques vous guident.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="w-5 h-5 text-[#E8A5A5]" />
              </div>
              <div className="space-y-1 text-left">
                <h4 className="text-sm font-semibold text-[#2D2D2D]">Matériaux Écoresponsables Certifiés</h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Carton certifié FSC, encres végétales à base d'eau et emballages biosourcés pour respecter l'écologie.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="w-5 h-5 text-[#E8A5A5]" />
              </div>
              <div className="space-y-1 text-left">
                <h4 className="text-sm font-semibold text-[#2D2D2D]">Finition Dorure or & argent relief de précision</h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Des reliefs métalliques saisissants et reflets étincelants uniques produits directement à notre atelier de Dakar.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="w-5 h-5 text-[#E8A5A5]" />
              </div>
              <div className="space-y-1 text-left">
                <h4 className="text-sm font-semibold text-[#2D2D2D]">Service Client WhatsApp direct 7j/7</h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Un canal privilégié pour adapter vos commandes en temps réel, échanger des photos et valider vos BAT.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="w-5 h-5 text-[#E8A5A5]" />
              </div>
              <div className="space-y-1 text-left">
                <h4 className="text-sm font-semibold text-[#2D2D2D]">Livraison Sécurisée Dakar & Régions</h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Un réseau de transporteurs de confiance livre vos cartons précieux sans accroc partout au Sénégal et à l'export.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="w-5 h-5 text-[#E8A5A5]" />
              </div>
              <div className="space-y-1 text-left">
                <h4 className="text-sm font-semibold text-[#2D2D2D]">Flexibilité MOQ progressive</h4>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Nous accompagnons aussi bien les micro-marques et fêtes intimes dès 50 pièces que les grosses commandes industrielles.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
};
