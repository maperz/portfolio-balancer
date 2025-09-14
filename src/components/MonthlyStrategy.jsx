import { usePortfolio } from '../contexts/PortfolioContext';
import { useLanguage } from '../contexts/LanguageContext';

export const MonthlyStrategy = () => {
  const { results, isAdvancedMode, monthlySavings } = usePortfolio();
  const { t } = useLanguage();

  if (!isAdvancedMode || !monthlySavings || !results?.monthlyStrategy?.length) {
    return null;
  }

  const { monthlyStrategy } = results;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('optimizedStrategy')}
      </h3>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {monthlyStrategy.map((monthData) => (
          <div
            key={monthData.month}
            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {t('month')} {monthData.month}
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('portfolioValue')}: €{monthData.portfolioValue.toLocaleString('de-DE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </div>
            
            {monthData.actions.length > 0 ? (
              <div className="space-y-2">
                {monthData.actions.map((action, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-2 rounded ${
                      action.type === 'buy'
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                        : 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
                    }`}
                  >
                    <span className="font-medium">{action.position}</span>
                    <span>
                      {t(action.type)} €{action.amount.toLocaleString('de-DE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-sm italic">
                {t('hold')} - {t('noActionsNeeded')}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>{t('strategyNote')}:</strong> {t('strategyDescription')}
        </p>
      </div>
    </div>
  );
};
