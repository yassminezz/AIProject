import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Hand, MousePointerClick } from 'lucide-react';
import { Language } from '../types.ts';
import { translations } from '../utils/translations.ts';

interface TutorialOverlayProps {
  step: 'upload' | 'viewing';
  onComplete: () => void;
  language: Language;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ step, onComplete, language }) => {
  const t = translations[language].tutorial;
  const isRtl = language === 'ar';

  const content = step === 'upload' 
    ? {
        title: t.uploadTitle,
        text: t.uploadText,
        icon: <MousePointerClick className="h-12 w-12 text-primary mb-4" />
      }
    : {
        title: t.viewTitle,
        text: t.viewText,
        icon: <Hand className="h-12 w-12 text-secondary-dark mb-4 animate-pulse" />
      };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center px-4"
        onClick={onComplete}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary" />
          <button 
            onClick={onComplete}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rtl:right-auto rtl:left-4"
            aria-label="Close tutorial"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              {content.icon}
            </div>
            
            <h3 className="text-2xl font-bold text-dark mb-3">
              {content.title}
            </h3>
            
            <p className="text-gray-600 leading-relaxed mb-8">
              {content.text}
            </p>

            <button 
              onClick={onComplete}
              className="w-full bg-primary-dark hover:bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transform transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              {t.gotIt}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TutorialOverlay;