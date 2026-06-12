import React from 'react';
import { Award, Compass, Heart, Leaf, Shield, CheckCircle2, Factory, Gem, Sparkles } from 'lucide-react';
import { TestimonialsSection } from './TestimonialsSection';

export const AboutView: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#FAF9F9] pt-32 text-left">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-b from-[#FAF9F9] via-white to-[#FAF9F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

      {/* Storytelling & Dakar Teranga Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

            {/* Right Side Craft Banner */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-video lg:aspect-auto lg:h-[420px] shadow-lg border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800" 
                alt="Atelier d'art de table dorure de boites dragées dakar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-8">
                <div className="text-white space-y-1">
                  <p className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">L'Atelier d'Artisans</p>
                  <h3 className="font-serif text-lg font-bold">Nouage manuel de rubans de satin or à Dakar</h3>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Mission, Vision, Values Block */}
      <section className="py-20 bg-[#FAF9F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Workshop Gallery Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold flex items-center justify-center space-x-1">
              <Factory className="w-4 h-4" />
              <span>Galerie Ateliers</span>
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#2D2D2D]">Immersion au Cœur de l'Excellence</h2>
            <p className="text-xs text-gray-400 font-light">
              Découvrez les coulisses de fabrication de vos dômes, écussons, flacons sérum et coffrets d'affaires de luxe.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="group relative rounded-3xl overflow-hidden aspect-square shadow-sm bg-white">
              <img 
                src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=400" 
                alt="Dorure à chaud sous presse à dakar"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white text-xs font-mono uppercase tracking-wider">Presse de dorure or</span>
              </div>
            </div>

            <div className="group relative rounded-3xl overflow-hidden aspect-square shadow-sm bg-white">
              <img 
                src="https://images.unsplash.com/photo-1549467657-39328fac558f?auto=format&fit=crop&q=80&w=400" 
                alt="Découpe laser cartonnages"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white text-xs font-mono uppercase tracking-wider">Matrice de Découpe Laser</span>
              </div>
            </div>

            <div className="group relative rounded-3xl overflow-hidden aspect-square shadow-sm bg-white">
              <img 
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400" 
                alt="Détails flacon parfum africain"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white text-xs font-mono uppercase tracking-wider">Verrerie Fine Parfumée</span>
              </div>
            </div>

            <div className="group relative rounded-3xl overflow-hidden aspect-square shadow-sm bg-white">
              <img 
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400" 
                alt="Cosmetiques d'Afrique de l'Ouest"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white text-xs font-mono uppercase tracking-wider">Conditionnement de luxe</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials at the bottom for commercial traction */}
      <TestimonialsSection />
    </main>
  );
};
