import { usePortfolio } from '../contexts/PortfolioContext';
import { useLanguage } from '../contexts/LanguageContext';

export const PlanningControls = () => {
  const { 
    planningPeriod, 
    periodUnit, 
    setPlanningPeriod, 
    setPeriodUnit,
    isAdvancedMode 
  } = usePortfolio();
  const { t } = useLanguage();

  if (!isAdvancedMode) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('planningPeriod')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('duration')}
          </label>
          <input
            type="number"
            min="1"
            max={periodUnit === 'years' ? 10 : 120}
            value={planningPeriod}
            onChange={(e) => setPlanningPeriod(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('unit')}
          </label>
          <select
            value={periodUnit}
            onChange={(e) => setPeriodUnit(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="months">{t('months')}</option>
            <option value="years">{t('years')}</option>
          </select>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 dark:bg-blue-900/20 rounded-lg border border-gray-200 dark:border-blue-800">
        <p className="text-sm text-gray-700 dark:text-blue-300">
          {t('planningDescription', {
            period: planningPeriod,
            unit: t(periodUnit),
            totalMonths: periodUnit === 'years' ? planningPeriod * 12 : planningPeriod
          })}
        </p>
      </div>
    </div>
  );
};
