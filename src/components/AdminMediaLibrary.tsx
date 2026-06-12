import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Image, 
  Upload, 
  Trash2, 
  Search, 
  Check, 
  Copy, 
  Plus, 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Grid, 
  Layers, 
  Edit3, 
  Link2,
  FileImage,
  Sparkles
} from 'lucide-react';

import mariagePrestige from '../assets/images/mariage_prestige_1780566116217.png';
import bouteillesJus from '../assets/images/bouteilles_jus_1780566133711.png';
import packCosmetique from '../assets/images/pack_cosmetique_1780566149588.png';
import objetsPublicitaires from '../assets/images/objets_publicitaires_1780566164378.png';
import accessoiresPack from '../assets/images/accessoires_pack_1780566177329.png';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  type?: string;
  size?: string;
}

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

export const AdminMediaLibrary: React.FC = () => {
  const { 
    currentUser, 
    categories, 
    adminEditCategory, 
    siteSettings, 
    adminUpdateSiteSettings 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'library' | 'slider' | 'categories'>('library');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // States for Slider Settings
  const [sliderSlides, setSliderSlides] = useState<any[]>([]);
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);

  // States for Category CMS
  const [selectedCatId, setSelectedCatId] = useState<string | null>(categories[0]?.id || null);
  const [catImage, setCatImage] = useState<string>('');
  const [catDesc, setCatDesc] = useState<string>('');

  // Media Picker overlay for setting image fields
  const [pickerConfig, setPickerConfig] = useState<{
    isOpen: boolean;
    onSelect: (url: string) => void;
    title: string;
  } | null>(null);

  // 1. Fetch & Subscribe to Media
  useEffect(() => {
    if (localStorage.getItem('art_table_demo_user')) {
      // Offline Simulation Mode
      const offlineMedia = localStorage.getItem('art_table_demo_media_items');
      if (offlineMedia) {
        setMediaItems(JSON.parse(offlineMedia));
      } else {
        const presets: MediaItem[] = [
          { id: 'preset-mariage', name: 'Mariage Prestige Cover', url: mariagePrestige, createdAt: new Date().toISOString(), size: '180 KB' },
          { id: 'preset-jus', name: 'Bouteilles & Contenants', url: bouteillesJus, createdAt: new Date().toISOString(), size: '210 KB' },
          { id: 'preset-cosmetique', name: 'Pack Cosmétique Premium', url: packCosmetique, createdAt: new Date().toISOString(), size: '165 KB' },
          { id: 'preset-pub', name: 'Objets Publicitaires Art de Table', url: objetsPublicitaires, createdAt: new Date().toISOString(), size: '190 KB' },
          { id: 'preset-sac', name: 'Sacs Boutiques & Accessoires', url: accessoiresPack, createdAt: new Date().toISOString(), size: '205 KB' },
          { id: 'unsplash-luxe-1', name: 'Unsplash Luxe Ribbon Box', url: 'https://images.unsplash.com/photo-1549463016-5b3221c4d6c5?auto=format&fit=crop&q=80&w=600', createdAt: new Date().toISOString(), size: '412 KB' },
          { id: 'unsplash-luxe-2', name: 'Unsplash Gourmet Pastry Packaging', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600', createdAt: new Date().toISOString(), size: '290 KB' }
        ];
        setMediaItems(presets);
        localStorage.setItem('art_table_demo_media_items', JSON.stringify(presets));
      }
    } else {
      // Live Firebase Subscription
      const unsubscribe = onSnapshot(collection(db, 'media_items'), (snap) => {
        if (snap.empty) {
          // Auto-seed media library if completely empty in Firestore
          const presets: MediaItem[] = [
            { id: 'preset-mariage', name: 'Mariage Prestige Cover', url: mariagePrestige, createdAt: new Date().toISOString(), size: '180 KB' },
            { id: 'preset-jus', name: 'Bouteilles & Contenants', url: bouteillesJus, createdAt: new Date().toISOString(), size: '210 KB' },
            { id: 'preset-cosmetique', name: 'Pack Cosmétique Premium', url: packCosmetique, createdAt: new Date().toISOString(), size: '165 KB' },
            { id: 'preset-pub', name: 'Objets Publicitaires Art de Table', url: objetsPublicitaires, createdAt: new Date().toISOString(), size: '190 KB' },
            { id: 'preset-sac', name: 'Sacs Boutiques & Accessoires', url: accessoiresPack, createdAt: new Date().toISOString(), size: '205 KB' }
          ];
          presets.forEach(p => {
            addDoc(collection(db, 'media_items'), p).catch(err => console.log('Auto-seed media item skipped:', err));
          });
        }
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as MediaItem));
        setMediaItems(items);
        localStorage.setItem('art_table_demo_media_items', JSON.stringify(items));
      }, (err) => {
        console.warn("Media collection subscription failed, using offline backup:", err);
        const offlineMedia = localStorage.getItem('art_table_demo_media_items');
        if (offlineMedia) setMediaItems(JSON.parse(offlineMedia));
      });
      return () => unsubscribe();
    }
  }, []);

  // 2. Initialize Slider settings from Context
  useEffect(() => {
    if (siteSettings && siteSettings.slides) {
      setSliderSlides(siteSettings.slides);
    }
  }, [siteSettings]);

  // Load current selected category CMS values
  useEffect(() => {
    if (selectedCatId) {
      const cat = categories.find(c => c.id === selectedCatId);
      if (cat) {
        setCatImage(cat.image || '');
        setCatDesc(cat.description || '');
      }
    }
  }, [selectedCatId, categories]);

  // 3. Image File Upload conversion to Base64
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>, fromDrag = false) => {
    let files: FileList | null = null;
    if (fromDrag) {
      const de = e as React.DragEvent<HTMLDivElement>;
      de.preventDefault();
      files = de.dataTransfer.files;
    } else {
      const ce = e as React.ChangeEvent<HTMLInputElement>;
      files = ce.target.files;
    }

    if (!files || files.length === 0) return;
    setLoading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // File size formatting helper
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Url = event.target?.result as string;
        const newItem: Omit<MediaItem, 'id'> = {
          name: file.name.replace(/\.[^/.]+$/, "").substring(0, 40),
          url: base64Url,
          createdAt: new Date().toISOString(),
          size: sizeStr
        };

        if (localStorage.getItem('art_table_demo_user')) {
          const stored = localStorage.getItem('art_table_demo_media_items');
          const current: MediaItem[] = stored ? JSON.parse(stored) : [];
          const withNew: MediaItem = { ...newItem, id: `media-${Date.now()}-${Math.floor(Math.random()*1000)}` };
          const updated = [withNew, ...current];
          setMediaItems(updated);
          localStorage.setItem('art_table_demo_media_items', JSON.stringify(updated));
        } else {
          try {
            await addDoc(collection(db, 'media_items'), newItem);
          } catch (err) {
            console.error("Firebase Media Item upload failed:", err);
          }
        }
      };
      reader.readAsDataURL(file);
    }
    setLoading(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e, true);
  };

  // 4. Delete Media Item
  const handleDeleteMedia = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette image de la médiathèque ? Les contenus qui l'utilisent perdront leur lien si vous ne les remplacez pas.")) return;

    if (localStorage.getItem('art_table_demo_user')) {
      const updated = mediaItems.filter(item => item.id !== id);
      setMediaItems(updated);
      localStorage.setItem('art_table_demo_media_items', JSON.stringify(updated));
    } else {
      try {
        await deleteDoc(doc(db, 'media_items', id));
      } catch (err) {
        console.error("Failed to delete media item from DB:", err);
      }
    }
  };

  // 5. Copy URL clipboard helper with feedback
  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 6. Save CMS Slideshow to Firebase/Context
  const saveSliderCMS = async () => {
    try {
      await adminUpdateSiteSettings({
        ...siteSettings,
        slides: sliderSlides
      });
      alert("✅ Le carrousel d'accueil premium a été enregistré avec succès et répercuté en temps réel !");
      setEditingSlideIndex(null);
    } catch (err) {
      alert("Une erreur s'est produite lors de l'enregistrement du carrousel.");
    }
  };

  // 7. Save Category cover & details
  const saveCategoryCMS = async () => {
    if (!selectedCatId) return;
    try {
      await adminEditCategory(selectedCatId, {
        image: catImage,
        description: catDesc
      });
      alert("✅ Les détails visuels et descriptifs de l'univers de catégorie ont été mis à jour avec succès !");
    } catch (err) {
      alert("Impossible de modifier la catégorie.");
    }
  };

  // Slider controls helpers
  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const nextList = [...sliderSlides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= nextList.length) return;

    const currentSlide = nextList[index];
    nextList[index] = nextList[targetIndex];
    nextList[targetIndex] = currentSlide;
    setSliderSlides(nextList);
  };

  const handleUpdateSlideField = (index: number, field: string, value: any) => {
    const nextList = sliderSlides.map((slide, i) => {
      if (i === index) {
        return { ...slide, [field]: value };
      }
      return slide;
    });
    setSliderSlides(nextList);
  };

  const handleAddSlide = () => {
    const defaultSlide = {
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200",
      title: "NOUVEAU CRÉNEAU",
      highlight: "Atelier Art de table",
      subTitle: "Commandez vos packagings hauts de gamme en quelques étapes simples.",
      btnText: "VOIR LES PRODUITS",
      viewTarget: "shop",
      isPrecomposed: false
    };
    setSliderSlides([...sliderSlides, defaultSlide]);
    setEditingSlideIndex(sliderSlides.length);
  };

  const handleDeleteSlide = (index: number) => {
    if (!window.confirm("Supprimer cette diapositive du carrousel principal ?")) return;
    const nextList = sliderSlides.filter((_, i) => i !== index);
    setSliderSlides(nextList);
    if (editingSlideIndex === index) {
      setEditingSlideIndex(null);
    } else if (editingSlideIndex !== null && editingSlideIndex > index) {
      setEditingSlideIndex(editingSlideIndex - 1);
    }
  };

  // Filter media library items by search query
  const filteredMedia = mediaItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6" id="cms-brand-media-console">
      {/* CMS Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h2 className="text-2xl font-serif text-stone-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#8B3A52]" />
            Console CMS & Médiathèque
          </h2>
          <p className="text-stone-500 text-sm font-sans mt-1">
            Gérez la totalité des visuels, bannières, sliders d'accueil et photos d'ateliers en temps réel, sans développeur.
          </p>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex bg-stone-150 p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => setActiveSubTab('library')}
            id="subtab-media-library"
            className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition ${
              activeSubTab === 'library' 
                ? 'bg-white text-[#8B3A52] shadow-sm font-semibold' 
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <Grid className="w-4 h-4 inline-block mr-1.5 align-text-bottom" />
            Médiathèque
          </button>
          <button
            onClick={() => setActiveSubTab('slider')}
            id="subtab-homepage-slider"
            className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition ${
              activeSubTab === 'slider' 
                ? 'bg-white text-[#8B3A52] shadow-sm font-semibold' 
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <Layers className="w-4 h-4 inline-block mr-1.5 align-text-bottom" />
            Slider d'Accueil
          </button>
          <button
            onClick={() => setActiveSubTab('categories')}
            id="subtab-categories-cms"
            className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition ${
              activeSubTab === 'categories' 
                ? 'bg-white text-[#8B3A52] shadow-sm font-semibold' 
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <Edit3 className="w-4 h-4 inline-block mr-1.5 align-text-bottom" />
            Catégories
          </button>
        </div>
      </div>

      {/* ================== SUBTAB 1: MEDIA LIBRARY ================== */}
      {activeSubTab === 'library' && (
        <div className="mt-6 space-y-6">
          {/* Upload Area */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition flex flex-col items-center justify-center cursor-pointer ${
              isDragging 
                ? 'border-[#8B3A52] bg-[#8B3A52]/5 text-[#8B3A52]' 
                : 'border-stone-300 hover:border-[#8B3A52]/50 hover:bg-stone-100 text-stone-500'
            }`}
          >
            <input 
              type="file" 
              multiple 
              onChange={handleFileUpload} 
              accept="image/*"
              className="hidden" 
              id="media-uploader-input"
            />
            <label htmlFor="media-uploader-input" className="cursor-pointer flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#8B3A52]/10 text-[#8B3A52] flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 animate-pulse" />
              </div>
              <p className="font-serif text-stone-900 font-semibold mb-1">Déposer des fichiers ici, ou cliquer pour parcourir</p>
              <p className="text-stone-400 text-xs font-sans">Images PNG, JPEG, WEBP ou SVG. S'intègrent automatiquement.</p>
            </label>
          </div>

          {/* Search bar & Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Rechercher une image par nom..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-stone-250 rounded-xl focus:outline-none focus:border-[#8B3A52] font-sans"
                />
              </div>
              <p className="text-stone-500 text-xs font-mono">{filteredMedia.length} images répertoriées</p>
            </div>

            {/* Media Items Grid */}
            {filteredMedia.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-stone-200 bg-white rounded-xl">
                <Image className="w-12 h-12 text-stone-300 mx-auto mb-2" />
                <p className="text-stone-500 font-serif">Aucune image ne correspond à votre recherche.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredMedia.map((item) => (
                  <div 
                    key={item.id} 
                    id={`media-item-${item.id}`}
                    className="group bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-md transition relative flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-square bg-stone-100 flex items-center justify-center overflow-hidden border-b border-stone-150 relative">
                      <img 
                        src={item.url} 
                        alt={item.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleCopyUrl(item.id, item.url)}
                          title="Copier le lien"
                          className="p-2 bg-white hover:bg-stone-100 text-stone-800 hover:text-stone-900 rounded-lg cursor-pointer shadow-sm transition"
                        >
                          {copiedId === item.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteMedia(item.id)}
                          title="Supprimer définitivement"
                          className="p-2 bg-[#8B3A52] hover:bg-[#722e43] text-white rounded-lg cursor-pointer shadow-sm transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {/* Metadata */}
                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <p className="text-stone-850 font-medium font-serif text-sm truncate" title={item.name}>
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-stone-400 font-mono">
                        <span>{item.size || 'Base64'}</span>
                        <span>{new Date(item.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================== SUBTAB 2: HOMEPAGE CAROUSEL CMS ================== */}
      {activeSubTab === 'slider' && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-stone-150">
            <div>
              <h3 className="text-lg font-serif text-stone-900">Diaporamas et Écrans d'En-tête</h3>
              <p className="text-stone-500 text-xs font-sans">Réorganisez, ajoutez ou modifiez les bannières géantes de la page d'accueil d'un simple geste.</p>
            </div>
            <button
              onClick={handleAddSlide}
              className="px-4 py-2 bg-[#8B3A52] hover:bg-[#722e43] text-white text-xs font-medium rounded-xl shadow-sm transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter une Diapositive
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List of Slides */}
            <div className="lg:col-span-1 space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {sliderSlides.map((slide, index) => (
                <div 
                  key={index}
                  className={`p-3 border rounded-xl flex items-center justify-between gap-3 bg-white transition ${
                    editingSlideIndex === index 
                      ? 'border-[#8B3A52] ring-1 ring-[#8B3A52]/20 shadow-sm' 
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={slide.image} 
                      alt="" 
                      className="w-14 h-10 object-cover rounded bg-stone-100"
                    />
                    <div>
                      <p className="text-xs text-stone-400 font-mono">Diapo #{index + 1}</p>
                      <h4 className="text-sm font-serif font-semibold text-stone-850 truncate max-w-[120px]">
                        {slide.title || 'Sans titre'}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleMoveSlide(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 hover:bg-stone-100 text-stone-500 hover:text-stone-900 rounded disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 rotate-90" />
                    </button>
                    <button
                      onClick={() => handleMoveSlide(index, 'down')}
                      disabled={index === sliderSlides.length - 1}
                      className="p-1.5 hover:bg-stone-100 text-stone-500 hover:text-stone-900 rounded disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 -rotate-90" />
                    </button>
                    <button
                      onClick={() => setEditingSlideIndex(index)}
                      className="p-1.5 hover:bg-[#8B3A52]/10 text-stone-600 hover:text-[#8B3A52] rounded cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSlide(index)}
                      className="p-1.5 hover:bg-red-50 text-stone-500 hover:text-red-600 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Slide Editor Panel */}
            <div className="lg:col-span-2">
              {editingSlideIndex === null ? (
                <div className="h-full min-h-[220px] flex flex-col items-center justify-center p-6 bg-white border border-stone-200 rounded-xl text-center">
                  <Layers className="w-10 h-10 text-stone-300 mb-2" />
                  <p className="text-stone-500 text-sm font-serif">Sélectionnez une diapositive à gauche pour en modifier le contenu ou le design.</p>
                </div>
              ) : (
                <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4 shadow-sm relative">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm font-serif font-semibold text-[#8B3A52]">Configuration de la Diapo #{editingSlideIndex + 1}</span>
                    <button 
                      onClick={() => setEditingSlideIndex(null)}
                      className="text-stone-400 hover:text-stone-700 text-xs cursor-pointer"
                    >
                      Masquer
                    </button>
                  </div>

                  {/* Fields form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-serif text-stone-700 mb-1">TITRE PRINCIPAL (Haut)</label>
                      <input
                        type="text"
                        value={sliderSlides[editingSlideIndex]?.title || ''}
                        onChange={(e) => handleUpdateSlideField(editingSlideIndex, 'title', e.target.value)}
                        className="w-full text-xs font-serif border border-stone-200 bg-stone-50 rounded-lg p-2 focus:ring-[#8B3A52] focus:border-[#8B3A52]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-serif text-stone-700 mb-1">ACCENT SURBRÉS (Milieu)</label>
                      <input
                        type="text"
                        value={sliderSlides[editingSlideIndex]?.highlight || ''}
                        onChange={(e) => handleUpdateSlideField(editingSlideIndex, 'highlight', e.target.value)}
                        className="w-full text-xs font-serif border border-stone-200 bg-stone-50 rounded-lg p-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-serif text-stone-700 mb-1">SOUS-TITRE DESCRIPTION</label>
                    <input
                      type="text"
                      value={sliderSlides[editingSlideIndex]?.subTitle || ''}
                      onChange={(e) => handleUpdateSlideField(editingSlideIndex, 'subTitle', e.target.value)}
                      className="w-full text-xs border border-stone-200 bg-stone-50 rounded-lg p-2 font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-serif text-stone-700 mb-1">TEXTE DU BOUTON</label>
                      <input
                        type="text"
                        value={sliderSlides[editingSlideIndex]?.btnText || ''}
                        onChange={(e) => handleUpdateSlideField(editingSlideIndex, 'btnText', e.target.value)}
                        className="w-full text-xs border border-stone-200 bg-stone-50 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-serif text-stone-700 mb-1">EFFET LAYOUT SOMBRE EN-TÊTE</label>
                      <select
                        value={sliderSlides[editingSlideIndex]?.isPrecomposed ? 'true' : 'false'}
                        onChange={(e) => handleUpdateSlideField(editingSlideIndex, 'isPrecomposed', e.target.value === 'true')}
                        className="w-full text-xs border border-stone-200 bg-stone-50 p-2 rounded-lg"
                      >
                        <option value="true">Actif (Mode Centré Noir Premium)</option>
                        <option value="false">Inactif (Mode Slide Standard Clarifié)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-serif text-stone-700 mb-1">URL DE L'IMAGE DE FOND</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={sliderSlides[editingSlideIndex]?.image || ''}
                        onChange={(e) => handleUpdateSlideField(editingSlideIndex, 'image', e.target.value)}
                        className="flex-1 text-xs border border-stone-200 bg-stone-50 rounded-lg p-2"
                        placeholder="Insérez une URL ou sélectionnez dans la médiathèque"
                      />
                      <button
                        type="button"
                        onClick={() => setPickerConfig({
                          isOpen: true,
                          title: "Sélectionner l'image de fond du Slider",
                          onSelect: (url) => handleUpdateSlideField(editingSlideIndex, 'image', url)
                        })}
                        className="px-3 py-1.5 border border-stone-250 hover:border-[#8B3A52] text-[#8B3A52] text-xs font-medium bg-stone-50 hover:bg-[#8B3A52]/5 rounded-lg flex items-center gap-1 cursor-pointer transition.duration-200"
                      >
                        <FileImage className="w-3.5 h-3.5" />
                        Choisir...
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Preview inside Editor */}
                  <div className="pt-2">
                    <p className="text-[10px] text-stone-400 font-serif mb-1 uppercase">Aperçu en Diapo Directe</p>
                    <div className="relative h-24 rounded-lg overflow-hidden border border-stone-200">
                      <img 
                        src={sliderSlides[editingSlideIndex]?.image} 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center p-3 text-white">
                        <div>
                          <p className="text-[9px] font-mono tracking-widest font-semibold text-[#FFD700]">{sliderSlides[editingSlideIndex]?.title}</p>
                          <h4 className="text-sm font-serif font-bold">{sliderSlides[editingSlideIndex]?.highlight}</h4>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end">
            <button
              onClick={saveSliderCMS}
              className="px-6 py-2.5 bg-[#8B3A52] hover:bg-[#722e43] text-white text-sm font-medium rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Enregistrer les Modifications du Carrousel
            </button>
          </div>
        </div>
      )}

      {/* =================== SUBTAB 3: CATEGORIES COVER CMS ================== */}
      {activeSubTab === 'categories' && (
        <div className="mt-6 space-y-6">
          <div className="pb-2 border-b border-stone-150">
            <h3 className="text-lg font-serif text-stone-900">Visuels d'Univers de Catégories</h3>
            <p className="text-stone-500 text-xs font-sans">Attribuez des photos d'ateliers réelles ou bannières de collection de luxe aux catégories de produits.</p>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-5">
            {/* Horizontal Picker */}
            <div>
              <label className="block text-xs font-serif text-stone-700 mb-2 uppercase tracking-wider">Univers de Catégorie à Éditer</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCatId(cat.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer border transition ${
                      selectedCatId === cat.id
                        ? 'bg-[#8B3A52]/10 border-[#8B3A52] text-[#8B3A52] shadow-sm font-semibold'
                        : 'bg-white border-stone-200 text-stone-600 hover:border-stone-350 hover:bg-stone-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {selectedCatId && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Form column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-serif text-stone-700 mb-1">IMAGE BANNIÈRE / UNIVERSE IMAGE</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={catImage}
                        onChange={(e) => setCatImage(e.target.value)}
                        className="flex-1 text-xs border border-stone-200 bg-stone-50 rounded-lg p-2"
                        placeholder="Insérez l'URL ou sélectionnez dans la médiathèque"
                      />
                      <button
                        type="button"
                        onClick={() => setPickerConfig({
                          isOpen: true,
                          title: "Sélectionner la photo d'univers de catégorie",
                          onSelect: (url) => setCatImage(url)
                        })}
                        className="px-3 py-1.5 border border-stone-250 hover:border-[#8B3A52] text-[#8B3A52] text-xs font-medium bg-stone-50 hover:bg-[#8B3A52]/5 rounded-lg flex items-center gap-1 cursor-pointer transition"
                      >
                        <FileImage className="w-3.5 h-3.5" />
                        Choisir...
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-serif text-stone-700 mb-1">DESCRIPTION DE L'UNIVERS (Slogan publicitaire)</label>
                    <textarea
                      rows={4}
                      value={catDesc}
                      onChange={(e) => setCatDesc(e.target.value)}
                      className="w-full text-xs border border-stone-200 bg-stone-50 rounded-lg p-2.5 font-sans"
                      placeholder="Indiquez une description luxueuse et attractive pour cet univers de packaging de prestige..."
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={saveCategoryCMS}
                      className="px-5 py-2 bg-[#8B3A52] hover:bg-[#722e43] text-white text-xs font-medium rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Mettre à Jour cette Catégorie
                    </button>
                  </div>
                </div>

                {/* Preview column */}
                <div className="border border-stone-200 rounded-xl p-4 bg-stone-50 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] text-stone-400 font-serif tracking-wider uppercase mb-2">Rendu dans le Catalogue Client</p>
                    {catImage ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-stone-200 shadow-inner bg-white">
                        <img 
                          src={catImage} 
                          alt="" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                          <h4 className="text-white font-serif font-bold text-base uppercase tracking-wider">{categories.find(c => c.id === selectedCatId)?.name}</h4>
                          <p className="text-stone-300 text-[10px] line-clamp-1 mt-0.5">{catDesc || "Aucune description renseignée."}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video rounded-lg border border-dashed border-stone-300 bg-white flex flex-col items-center justify-center text-stone-400 text-xs font-serif">
                        <Image className="w-8 h-8 mb-1" />
                        Aucune image attribuée
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-400 font-sans mt-3 italic">
                    💡 En changeant le visuel de la catégorie, l'image correspondante est immédiatement mise à jour sur la page d'accueil ainsi que sur le filtre du catalogue public.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== CENTRAL IMAGE PICKER MODAL (OVERLAY) ===================== */}
      {pickerConfig && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-white">
              <h4 className="font-serif text-stone-900 font-semibold">{pickerConfig.title}</h4>
              <button 
                onClick={() => setPickerConfig(null)}
                className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 flex items-center justify-center cursor-pointer transition.duration-200"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-stone-100 border-b border-stone-200 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filtrer la médiathèque..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-stone-250 rounded-lg focus:outline-none"
                />
              </div>
              <p className="text-stone-400 text-xs font-mono">{filteredMedia.length} images</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 max-h-[50vh]">
              {filteredMedia.length === 0 ? (
                <div className="text-center py-12">
                  <Image className="w-12 h-12 text-stone-300 mx-auto mb-2" />
                  <p className="text-stone-500 font-serif text-sm">Médiathèque vide ou filtre incorrect.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredMedia.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => {
                        pickerConfig.onSelect(item.url);
                        setPickerConfig(null);
                      }}
                      className="group border border-stone-200 rounded-xl overflow-hidden bg-white hover:border-[#8B3A52] hover:shadow-sm cursor-pointer transition relative flex flex-col"
                    >
                      <div className="aspect-square bg-stone-100 relative overflow-hidden">
                        <img 
                          src={item.url} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <div className="absolute inset-0 bg-[#8B3A52]/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <span className="bg-white text-[#8B3A52] text-xs font-serif font-bold px-3 py-1.5 rounded-lg shadow">Sélectionner</span>
                        </div>
                      </div>
                      <div className="p-2 border-t">
                        <p className="text-[11px] font-serif font-semibold text-stone-850 truncate">{item.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-stone-200 bg-white flex justify-between items-center text-xs text-stone-500">
              <p className="font-sans">Choisissez un élément en cliquant dessus pour fermer l'overlay.</p>
              <button 
                onClick={() => setPickerConfig(null)}
                className="px-4 py-1.5 border hover:bg-stone-50 rounded-lg shadow-sm font-medium cursor-pointer"
              >
                Annuler
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
