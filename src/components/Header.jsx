
import { useLanguage } from '../contexts/LanguageContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { t, currentLanguage, switchLanguage } = useLanguage();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {t('title')}
          </h1>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <div className="flex gap-2">
              <button
                onClick={() => switchLanguage('en')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  currentLanguage === 'en'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => switchLanguage('de')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  currentLanguage === 'de'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                aria-label="Switch to German"
              >
                DE
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
