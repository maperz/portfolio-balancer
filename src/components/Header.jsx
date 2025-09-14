
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
            
            <div>
              <select
                value={currentLanguage}
                onChange={e => switchLanguage(e.target.value)}
                className="px-4 py-2 rounded-lg font-medium transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-400 appearance-none"
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
