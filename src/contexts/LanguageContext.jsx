/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import enTranslations from '../locales/en.json';
import deTranslations from '../locales/de.json';

// Initialize i18next
i18n.init({
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  resources: {
    en: {
      translation: enTranslations,
    },
    de: {
      translation: deTranslations,
    },
  },
});

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Initialize with saved language or browser preference
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('portfolioBalancerLanguage');
      const browserLang = navigator.language.split('-')[0];
      
      if (savedLang && (savedLang === 'en' || savedLang === 'de')) {
        return savedLang;
      } else if (browserLang === 'de') {
        return 'de';
      }
    }
    return 'en';
  });

  useEffect(() => {
    // Update i18next and save preferences when language changes
    i18n.changeLanguage(currentLanguage);
    document.documentElement.lang = currentLanguage;
    localStorage.setItem('portfolioBalancerLanguage', currentLanguage);
  }, [currentLanguage]);

  const t = (key, options = {}) => {
    return i18n.t(key, options);
  };

  const switchLanguage = (lang) => {
    if (lang === 'en' || lang === 'de') {
      setCurrentLanguage(lang);
    }
  };

  const formatCurrency = (amount, showSign = false) => {
    const formatter = new Intl.NumberFormat(currentLanguage === 'de' ? 'de-DE' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    if (showSign && amount > 0) {
      return '+' + formatter.format(amount);
    }
    
    return formatter.format(amount);
  };

  const value = {
    currentLanguage,
    t,
    switchLanguage,
    formatCurrency,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
