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

const PRESET_MARIAGE = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=900';
const PRESET_BOUTEILLES = 'https://images.unsplash.com/photo-1549467657-39328fac558f?auto=format&fit=crop&q=80&w=900';
const PRESET_COSMETIQUE = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=900';
const PRESET_COMMERCIAL = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=900';
const PRESET_PACKAGING = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=900';

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

interface AdminMediaLibraryProps {
  onSelectImage?: (url: string) => void;
}

export const AdminMediaLibrary: React.FC<AdminMediaLibraryProps> = ({ onSelectImage }) => {
  const { 
    currentUser, 
    categories, 
    adminEditCategory, 
    siteSettings, 
    adminUpdateSiteSettings 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'library' | 'slider' | 'categories'>('slider');
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

  // 1. Fetch & Subscribe to Media (Purely local storage)
  useEffect(() => {
    const loadMedia = () => {
      const saved = localStorage.getItem('art_table_media_items');
      if (saved) {
        setMediaItems(JSON.parse(saved));
      } else {
        const presets: MediaItem[] = [
          { id: 'preset-mariage', name: 'Mariage Prestige Cover', url: PRESET_MARIAGE, createdAt: new Date().toISOString(), size: '180 KB' },
          { id: 'preset-jus', name: 'Bouteilles & Contenants', url: PRESET_BOUTEILLES, createdAt: new Date().toISOString(), size: '210 KB' },
          { id: 'preset-cosmetique', name: 'Pack Cosmétique Premium', url: PRESET_COSMETIQUE, createdAt: new Date().toISOString(), size: '165 KB' },
          { id: 'preset-pub', name: 'Objets Publicitaires Art de Table', url: PRESET_COMMERCIAL, createdAt: new Date().toISOString(), size: '190 KB' },
          { id: 'preset-sac', name: 'Sacs Boutiques & Accessoires', url: PRESET_PACKAGING, createdAt: new Date().toISOString(), size: '205 KB' },
          { id: 'unsplash-luxe-1', name: 'Unsplash Luxe Ribbon Box', url: 'https://images.unsplash.com/photo-1549463016-5b3221c4d6c5?auto=format&fit=crop&q=80&w=600', createdAt: new Date().toISOString(), size: '412 KB' },
          { id: 'unsplash-luxe-2', name: 'Unsplash Gourmet Pastry Packaging', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600', createdAt: new Date().toISOString(), size: '290 KB' }
        ];
        setMediaItems(presets);
        localStorage.setItem('art_table_media_items', JSON.stringify(presets));
        localStorage.setItem('art_table_demo_media_items', JSON.stringify(presets));
      }
    };

    loadMedia();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'art_table_media_items' && e.newValue) {
        try {
          setMediaItems(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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

        const currentRaw = localStorage.getItem('art_table_media_items');
        let current: MediaItem[] = [];
        if (currentRaw) {
          try { current = JSON.parse(currentRaw); } catch (e) {}
        } else {
          current = mediaItems;
        }

        const withNew: MediaItem = { ...newItem, id: `media-${Date.now()}-${Math.floor(Math.random()*1000)}` };
        const updated = [withNew, ...current];
        setMediaItems(updated);
        localStorage.setItem('art_table_media_items', JSON.stringify(updated));
        localStorage.setItem('art_table_demo_media_items', JSON.stringify(updated));
        window.dispatchEvent(new Event('art_table_sync'));
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

    const currentRaw = localStorage.getItem('art_table_media_items');
    let current: MediaItem[] = [];
    if (currentRaw) {
      try { current = JSON.parse(currentRaw); } catch (e) {}
    } else {
      current = mediaItems;
    }
    
    const updated = current.filter(item => item.id !== id);
    setMediaItems(updated);
    localStorage.setItem('art_table_media_items', JSON.stringify(updated));
    localStorage.setItem('art_table_demo_media_items', JSON.stringify(updated));
    window.dispatchEvent(new Event('art_table_sync'));
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
      const sanitizedSlides = sliderSlides.map((slide) => ({
        image: slide.image,
        artwork: slide.artwork || slide.image || '',
        title: slide.title || '',
        highlight: slide.highlight || '',
        subTitle: slide.subTitle || '',
        headlineTop: slide.headlineTop || '',
        headlineAccent: slide.headlineAccent || '',
        headlineBottom: slide.headlineBottom || '',
        body: slide.body || '',
        body2: slide.body2 || '',
        meta: slide.meta || '',
        btnText: slide.btnText || 'Commander',
        btnLink: slide.btnLink || 'https://wa.me/221778715875',
        features: Array.isArray(slide.features) ? slide.features : [],
        imagePosition: slide.imagePosition || 'center center',
        isPrecomposed: true
      }));
      await adminUpdateSiteSettings({
        ...siteSettings,
        slides: sanitizedSlides
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

  const openSlideImagePicker = (index: number) => {
    setPickerConfig({
      isOpen: true,
      title: `Choisir l'image de la bannière ${index + 1}`,
      onSelect: (url: string) => {
        handleUpdateSlideField(index, 'image', url);
        setPickerConfig(null);
      },
    });
  };

  const handleAddSlide = () => {
    const defaultSlide = {
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200",
      artwork: "",
      title: "Nouvelle bannière",
      highlight: "Art de Table",
      subTitle: "Ajoutez ici le texte de votre bannière et son appel à l’action.",
      headlineTop: "NOUVELLE",
      headlineAccent: "BANNIÈRE",
      body: "Ajoutez ici le texte de votre bannière et son appel à l’action.",
      body2: "",
      meta: "",
      btnText: "Commander",
      btnLink: "https://wa.me/221778715875",
      features: [],
      imagePosition: "center center",
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

  const tabs = [
    { id: 'slider', label: 'Bannières accueil' },
    { id: 'library', label: 'Médiathèque' },
    { id: 'categories', label: 'Catégories' },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id)}
            className={`rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-widest transition ${
              activeSubTab === tab.id
                ? 'bg-[#9B2C4A] text-white'
                : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'slider' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleAddSlide} className="rounded-xl bg-[#9B2C4A] px-4 py-2 text-xs font-semibold text-white">
              Ajouter une bannière
            </button>
            <button type="button" onClick={saveSliderCMS} className="rounded-xl bg-stone-900 px-4 py-2 text-xs font-semibold text-white">
              Enregistrer les bannières
            </button>
          </div>

          <div className="space-y-4">
            {sliderSlides.map((slide, index) => (
              <div key={`${slide.title}-${index}`} className="rounded-3xl border border-stone-200 bg-white p-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-stone-900 text-sm">Bannière {index + 1}</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleMoveSlide(index, 'up')} className="rounded-lg bg-stone-100 px-2 py-1 text-xs">↑</button>
                    <button type="button" onClick={() => handleMoveSlide(index, 'down')} className="rounded-lg bg-stone-100 px-2 py-1 text-xs">↓</button>
                    <button type="button" onClick={() => handleDeleteSlide(index)} className="rounded-lg bg-red-50 px-2 py-1 text-xs text-red-600">Suppr.</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="text-xs space-y-1 md:col-span-2">
                    <span className="block text-stone-500 font-semibold uppercase tracking-wider">Image de bannière</span>
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <div className="w-28 h-20 rounded-xl overflow-hidden border border-stone-200 bg-stone-50 shrink-0">
                        {slide.image ? (
                          <img src={slide.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">Aucune image</div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openSlideImagePicker(index)}
                          className="rounded-xl bg-[#9B2C4A] px-4 py-2 text-xs font-semibold text-white"
                        >
                          Choisir dans la médiathèque
                        </button>
                        <label className="rounded-xl border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-600 cursor-pointer hover:bg-stone-50 transition">
                          Importer une image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => {
                                const url = String(reader.result || '');
                                handleUpdateSlideField(index, 'image', url);
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <label className="text-xs space-y-1">
                    <span className="block text-stone-500 font-semibold uppercase tracking-wider">Bouton</span>
                    <input type="text" value={slide.btnText || ''} onChange={(e) => handleUpdateSlideField(index, 'btnText', e.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs" />
                  </label>
                  <label className="text-xs space-y-1">
                    <span className="block text-stone-500 font-semibold uppercase tracking-wider">Titre</span>
                    <input type="text" value={slide.title || ''} onChange={(e) => handleUpdateSlideField(index, 'title', e.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs" />
                  </label>
                  <label className="text-xs space-y-1">
                    <span className="block text-stone-500 font-semibold uppercase tracking-wider">Mise en avant</span>
                    <input type="text" value={slide.highlight || ''} onChange={(e) => handleUpdateSlideField(index, 'highlight', e.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs" />
                  </label>
                  <label className="text-xs space-y-1 md:col-span-2">
                    <span className="block text-stone-500 font-semibold uppercase tracking-wider">Sous-titre</span>
                    <textarea value={slide.subTitle || ''} onChange={(e) => handleUpdateSlideField(index, 'subTitle', e.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs min-h-20" />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'library' && (
        <div className="space-y-6">
          <div
            className={`rounded-2xl border border-dashed p-5 text-sm transition ${
              isDragging ? 'border-[#9B2C4A] bg-[#FDF0F3] text-[#8B3A52]' : 'border-stone-300 text-stone-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <p className="font-semibold text-stone-800">Ajouter des images à la médiathèque</p>
                <p className="text-xs text-stone-500">Glissez-déposez vos photos ou importez-les depuis votre galerie.</p>
              </div>
              <label className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#9B2C4A] px-4 py-2 text-xs font-semibold text-white cursor-pointer hover:opacity-90 transition">
                <Upload className="w-4 h-4" />
                Ajouter des photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          {filteredMedia.length === 0 ? (
            <div className="border border-dashed border-stone-800 rounded-2xl p-12 text-center text-stone-500 font-mono text-xs">
              <Image className="w-8 h-8 mx-auto mb-3 text-stone-600 animate-pulse" />
              Aucun fichier disponible dans la bibliothèque de l'Atelier.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMedia.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onSelectImage?.(item.url)}
                  className="group relative bg-[#111111] border border-stone-800 rounded-2xl overflow-hidden aspect-square cursor-pointer hover:border-[#D4AF37]/50 transition-all duration-300 shadow-lg"
                >
                  <img 
                    src={item.url} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-[#D4AF37] p-2.5 rounded-xl shadow-xl text-neutral-900 transform scale-90 group-hover:scale-100 transition-transform">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-[10px] text-stone-300 font-mono truncate">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCatId(cat.id)}
                className={`rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-widest transition ${
                  selectedCatId === cat.id ? 'bg-[#9B2C4A] text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="space-y-4 rounded-3xl border border-stone-200 bg-white p-5">
            <label className="block space-y-1 text-xs">
              <span className="font-semibold uppercase tracking-wider text-stone-500">Image catégorie</span>
              <input value={catImage} onChange={(e) => setCatImage(e.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs" />
            </label>
            <label className="block space-y-1 text-xs">
              <span className="font-semibold uppercase tracking-wider text-stone-500">Description</span>
              <textarea value={catDesc} onChange={(e) => setCatDesc(e.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs min-h-24" />
            </label>
            <button type="button" onClick={saveCategoryCMS} className="rounded-xl bg-stone-900 px-4 py-2 text-xs font-semibold text-white">
              Sauvegarder la catégorie
            </button>
          </div>
        </div>
      )}

      {pickerConfig?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-stone-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">{pickerConfig.title}</h3>
                <p className="text-xs text-stone-500">Clique sur une image pour la sélectionner pour la bannière.</p>
              </div>
              <button
                type="button"
                onClick={() => setPickerConfig(null)}
                className="rounded-full w-9 h-9 flex items-center justify-center bg-stone-100 text-stone-600 hover:bg-stone-200 transition"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {mediaItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      pickerConfig.onSelect(item.url);
                      setPickerConfig(null);
                    }}
                    className="group text-left rounded-2xl overflow-hidden border border-stone-200 hover:border-[#9B2C4A] transition shadow-sm"
                  >
                    <div className="aspect-square bg-stone-50 overflow-hidden">
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-stone-800 truncate">{item.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
