
import { useLanguage } from '../contexts/LanguageContext';
import { usePortfolio } from '../contexts/PortfolioContext';

const ModeToggle = () => {
  const { t } = useLanguage();
  const { isAdvancedMode, setIsAdvancedMode } = usePortfolio();

  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-1 shadow-sm">
        <button
          onClick={() => setIsAdvancedMode(false)}
          className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
            !isAdvancedMode
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {t('basicMode')}
        </button>
        <button
          onClick={() => setIsAdvancedMode(true)}
          className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
            isAdvancedMode
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {t('advancedMode')}
        </button>
      </div>
    </div>
  );
};

export default ModeToggle;
