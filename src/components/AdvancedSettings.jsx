
import { useLanguage } from '../contexts/LanguageContext';
import { usePortfolio } from '../contexts/PortfolioContext';

const AdvancedSettings = () => {
  const { t, currentLanguage } = useLanguage();
  const { 
    monthlySavings, 
    rebalanceFrequency, 
    setMonthlySavings, 
    setRebalanceFrequency, 
  } = usePortfolio();

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('savingsSettings')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="monthly-savings" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('monthlySavings')}
          </label>
          <input
            type="number"
            id="monthly-savings"
            value={monthlySavings || ''}
            onChange={(e) => setMonthlySavings(parseFloat(e.target.value) || 0)}
            step="0.01"
            min="0"
            placeholder={currentLanguage === 'de' ? '0,00' : '0.00'}
            className="form-input bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="rebalance-frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('rebalanceFrequency')}
          </label>
          <select
            id="rebalance-frequency"
            value={rebalanceFrequency}
            onChange={(e) => setRebalanceFrequency(e.target.value)}
            className="form-select bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          >
            <option value="monthly">{t('monthly')}</option>
            <option value="quarterly">{t('quarterly')}</option>
            <option value="yearly">{t('yearly')}</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
