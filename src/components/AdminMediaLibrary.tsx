import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Image, Check } from 'lucide-react';

interface AdminMediaLibraryProps {
  onSelectImage?: (url: string) => void;
}

export const AdminMediaLibrary: React.FC<AdminMediaLibraryProps> = ({ onSelectImage }) => {
  const [mediaItems, setMediaItems] = useState<any[]>([]);

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'media'), (snapshot) => {
        const items = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          url: doc.data().url, 
          name: doc.data().name || 'Fichier d\'exception' 
        }));
        setMediaItems(items);
        localStorage.setItem('art_table_demo_media_items', JSON.stringify(items));
      }, (err) => {
        const offlineMedia = localStorage.getItem('art_table_demo_media_items');
        if (offlineMedia) setMediaItems(JSON.parse(offlineMedia));
      });
      return () => unsub();
    } catch(err) {
      const offlineMedia = localStorage.getItem('art_table_demo_media_items');
      if (offlineMedia) {
        try { setMediaItems(JSON.parse(offlineMedia)); } catch(e){}
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      {mediaItems.length === 0 ? (
        <div className="border border-dashed border-stone-800 rounded-2xl p-12 text-center text-stone-500 font-mono text-xs">
          <Image className="w-8 h-8 mx-auto mb-3 text-stone-600 animate-pulse" />
          Aucun fichier disponible dans la bibliothèque de l'Atelier.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {mediaItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelectImage && onSelectImage(item.url)}
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
  );
};
