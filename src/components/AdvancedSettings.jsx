
import { useLanguage } from '../contexts/LanguageContext';
import { usePortfolio } from '../contexts/PortfolioContext';

const AdvancedSettings = () => {
  const { t, currentLanguage } = useLanguage();
  const { 
    monthlySavings, 
    planningPeriod,
    setMonthlySavings, 
    setPlanningPeriod,
  } = usePortfolio();

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('savingsSettings')}
      </h3>
      <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        <span className="inline-block mr-2" title="Savings Mode lets you plan how much to save and for how many months. The app will optimize the allocation.">
          <svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01" /></svg>
        </span>
        Enter your planned monthly savings and the number of months you want to save for.
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className="flex-1 space-y-2">
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
            placeholder={currentLanguage === 'de' ? '0' : '0'}
            className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          />
        </div>
        <div className="flex-1 space-y-2">
          <label htmlFor="planning-period" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('months')}
          </label>
          <input
            type="text"
            id="planning-period"
            value={planningPeriod === 0 ? '' : planningPeriod}
            onChange={e => {
              const val = e.target.value;
              if (val === '' || /^\d+$/.test(val)) setPlanningPeriod(val === '' ? 0 : Number(val));
            }}
            onBlur={e => {
              if (e.target.value === '') setPlanningPeriod(0);
            }}
            min="0"
            className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
