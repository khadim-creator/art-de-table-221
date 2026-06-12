import React from 'react';
import { MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export const WhatsAppButton: React.FC = () => {
  const handleWhatsAppContact = () => {
    const phoneNumber = "221778715875"; // Professional simulation standard
    const text = encodeURIComponent("Bonjour Art de Table ! Je découvre vos somptueux packagings événementiels et j'aimerais avoir plus de renseignements sur la personnalisation sur-mesure.");
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  return (
    <motion.button
      id="whatsapp-floating-btn"
      onClick={handleWhatsAppContact}
      initial={{ scale: 0, y: 100 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 120,
        damping: 10,
        delay: 0.8
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-[0_8px_30px_rgb(37,211,102,0.4)] hover:shadow-[0_8px_30px_rgb(37,211,102,0.6)] transition-all duration-300 flex items-center justify-center cursor-pointer group"
      title="Contactez-nous sur WhatsApp"
    >
      <MessageSquare className="w-6 h-6 animate-pulse group-hover:scale-105" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 font-medium text-sm whitespace-nowrap">
        Besoin d'aide ? WhatsApp
      </span>
    </motion.button>
  );
};
