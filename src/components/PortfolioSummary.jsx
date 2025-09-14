import { usePortfolio } from '../contexts/PortfolioContext';
import { useLanguage } from '../contexts/LanguageContext';

export const PortfolioSummary = () => {
  const { getTotalValue, positions } = usePortfolio();
  const { t } = useLanguage();

  const totalValue = getTotalValue();
  const totalTargetRatio = positions.reduce((sum, pos) => sum + (pos.targetRatio || 0), 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('portfolioSummary')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-blue-900/20 rounded-lg p-4 border border-gray-200 dark:border-blue-800">
          <div className="text-sm font-medium text-gray-600 dark:text-blue-400">
            {t('totalValue')}
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-blue-100">
            {totalValue.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-green-900/20 rounded-lg p-4 border border-gray-200 dark:border-green-800">
          <div className="text-sm font-medium text-gray-600 dark:text-green-400">
            {t('positionsCount')}
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-green-100">
            {positions.length}
          </div>
        </div>
        
        <div className={`rounded-lg p-4 border ${
          Math.abs(totalTargetRatio - 100) < 0.01 
            ? 'bg-gray-50 dark:bg-green-900/20 border-gray-200 dark:border-green-800' 
            : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        }`}>
          <div className={`text-sm font-medium ${
            Math.abs(totalTargetRatio - 100) < 0.01 
              ? 'text-gray-600 dark:text-green-400' 
              : 'text-yellow-700 dark:text-yellow-400'
          }`}>
            {t('totalAllocation')}
          </div>
          <div className={`text-2xl font-bold ${
            Math.abs(totalTargetRatio - 100) < 0.01 
              ? 'text-gray-900 dark:text-green-100' 
              : 'text-yellow-800 dark:text-yellow-100'
          }`}>
            {totalTargetRatio.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};
