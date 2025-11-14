import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, GraduationCap, ChevronDown } from 'lucide-react';
import { Language } from '../types.ts';
import { translations } from '../utils/translations.ts';

interface HeaderProps {
  onLogoClick: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, language, setLanguage }) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const t = translations[language];

  const selectLang = (lang: Language) => {
    setLanguage(lang);
    setIsLangOpen(false);
  };

  const getLangLabel = (lang: Language) => {
    switch(lang) {
      case 'fr': return 'FR';
      case 'en': return 'EN';
      case 'ar': return 'AR';
      default: return 'FR';
    }
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={onLogoClick}
        >
          <GraduationCap className="h-8 w-8 text-primary group-hover:text-primary-dark transition-colors rtl:flip" />
          <span className="text-xl font-extrabold text-primary group-hover:text-primary-dark tracking-tighter transition-colors">Nodqra</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 text-gray-600 text-sm font-medium cursor-pointer hover:text-primary transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>{getLangLabel(language)}</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-50 rtl:right-auto rtl:left-0"
                >
                  <button onClick={() => selectLang('fr')} className="block w-full text-left rtl:text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">FR Français</button>
                  <button onClick={() => selectLang('en')} className="block w-full text-left rtl:text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">EN English</button>
                  <button onClick={() => selectLang('ar')} className="block w-full text-left rtl:text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary font-sans">AR العربية</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="bg-primary-dark hover:bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/20">
            {t.header.connect}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;