import { useLanguage } from '../contexts/LanguageContext';

type Language = 'en' | 'de';

const LanguageToggle = () => {
  const { currentLanguage, switchLanguage } = useLanguage();

  const getLanguageIcon = (lang: Language) => {
    switch (lang) {
    case 'en':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      );
    case 'de':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      );
    default:
      return null;
    }
  };

  const getLanguageLabel = (lang: Language) => {
    switch (lang) {
    case 'en':
      return 'English';
    case 'de':
      return 'Deutsch';
    default:
      return '';
    }
  };

  const toggleLanguage = () => {
    const newLang: Language = currentLanguage === 'en' ? 'de' : 'en';
    switchLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
      title={`Switch to ${currentLanguage === 'en' ? 'Deutsch' : 'English'}`}
      aria-label={`Current language: ${getLanguageLabel(currentLanguage)}. Switch to ${currentLanguage === 'en' ? 'Deutsch' : 'English'}`}
    >
      {getLanguageIcon(currentLanguage)}
      <span className="text-sm font-medium hidden sm:inline">{getLanguageLabel(currentLanguage)}</span>
    </button>
  );
};

export default LanguageToggle;
