import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePortfolio } from '../contexts/PortfolioContext';

const Results = () => {
  const { t, formatCurrency } = useLanguage();
  const { results, isAdvancedMode } = usePortfolio();

  // Scroll to results when they appear
  useEffect(() => {
    if (results) {
      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [results]);

  if (!results) {
    return null;
  }

  if (results.error) {
    return (
      <div id="results-section" className="card p-6 fade-in">
        <div className="alert alert-warning">
          {t(results.error)}
        </div>
      </div>
    );
  }

  const getActionText = (action) => {
    if (action.type === 'hold') {
      return <span className="text-gray-500">{t('hold')}</span>;
    } else if (action.type === 'buy') {
      return (
        <span className="text-success-600 font-medium">
          {t('buy')} {formatCurrency(action.amount)}
        </span>
      );
    } else if (action.type === 'sell') {
      return (
        <span className="text-error-600 font-medium">
          {t('sell')} {formatCurrency(action.amount)}
        </span>
      );
    }
    return '';
  };

  const getDifferenceColor = (difference) => {
    if (Math.abs(difference) < 0.01) {
      return 'text-gray-500';
    }
    return difference > 0 ? 'text-success-600' : 'text-error-600';
  };

  return (
    <div id="results-section" className="space-y-6 fade-in">
      {/* Warning for unspent */}
      {results.hasUnspent && (
        <div className="alert alert-warning">
          {t('ratiosNotValid')}
        </div>
      )}

      {/* Portfolio Summary */}
      <div className="summary-card">
        {isAdvancedMode && (
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded text-xs font-semibold" title="Savings Mode distributes your monthly savings over the planning period for optimal rebalancing.">
              Savings Mode
            </span>
            <span className="text-xs text-gray-500" title="In Savings Mode, new savings are allocated each month in addition to rebalancing.">
              <svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01" /></svg>
            </span>
          </div>
        )}
        <div className="summary-title">{t('portfolioSummary')}</div>
        <div className="summary-value">
          {formatCurrency(results.totalCurrentValue)}
        </div>
        {results.targetTotal !== results.totalCurrentValue && (
          <div className="mt-2 text-sm text-gray-600">
            {t('withSavings')}: {formatCurrency(results.targetTotal)}
          </div>
        )}
        {results.monthsUntilRebalance > 0 && (
          <div className="mt-1 text-sm text-gray-600">
            {t('monthsUntilRebalance')}: {results.monthsUntilRebalance}
          </div>
        )}
      </div>

      {/* Results Table */}
      {/* Minor explanation between summary and table */}
      <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        {isAdvancedMode
          ? 'Below you see how your monthly savings and rebalancing are distributed for each position.'
          : 'Below you see the rebalancing actions needed to match your target allocation.'}
      </div>
      <div className="card overflow-hidden">
     
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('rebalancingActions')}
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="results-table">
            <thead>
              <tr>
                <th>{t('positionName')}</th>
                <th>{t('currentValue')}</th>
                <th>{t('targetRatio')}</th>
                <th>{t('targetValue')}</th>
                {isAdvancedMode && <th title="Amount allocated from new monthly savings">{t('fromSavings')}</th>}
                {isAdvancedMode && <th title="Amount rebalanced from existing positions">{t('fromRebalancing')}</th>}
                <th>{t('action')}</th>
              </tr>
            </thead>
            <tbody>
              {results.results.map((result, index) => {
                const isUnspent = result.id === 'unspent';
                const displayName = isUnspent ? t('unspent') : result.name;
                
                return (
                  <tr key={result.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="font-medium">
                      {displayName}
                    </td>
                    <td>{result.currentValue}</td>
                    <td>{result.targetRatio.toFixed(1)}%</td>
                    <td>{result.targetValue}</td>
                    {isAdvancedMode && (
                      <td className="text-blue-700 dark:text-blue-300">
                        {result.fromSavings}
                      </td>
                    )}
                    {isAdvancedMode && (
                      <td className="text-purple-700 dark:text-purple-300">
                        {result.fromRebalancing}
                      </td>
                    )}
                    <td>{getActionText(result.action, isUnspent)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Results;
