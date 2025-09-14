
/* eslint-disable react-refresh/only-export-components */
import { useLanguage } from '../contexts/LanguageContext';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useMemo } from 'react';

const PositionRow = ({ position }) => {
  const { t, currentLanguage } = useLanguage();
  const { removePosition, updatePosition, getTotalValue, positions } = usePortfolio();

  // Calculate if target sum is over 100%
  const targetSum = useMemo(() => positions.reduce((sum, pos) => sum + (parseFloat(pos.targetRatio) || 0), 0), [positions]);
  const showTargetError = targetSum > 100 && position.targetRatio > 0;

  const totalValue = getTotalValue();
  const currentPercentage = totalValue > 0 ? (position.currentValue / totalValue) * 100 : 0;
  const canRemove = positions.length > 1;

  const handleRemove = () => {
    if (canRemove) {
      removePosition(position.id);
    }
  };

  const handleChange = (field, value) => {
    // Allow empty string in input, but set to 0 in state if empty
    if (field === 'currentValue' || field === 'targetRatio') {
      // Accept '0' as valid, and only set to 0 if truly empty
      if (value === '') {
        updatePosition(position.id, field, 0);
      } else if (/^-?\d*\.?\d*$/.test(value)) {
        updatePosition(position.id, field, value);
      }
    } else {
      updatePosition(position.id, field, value);
    }
  };

  return (
    <div className="relative grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 items-end">
      {/* Remove button positioned absolutely in top right */}
      <button
        type="button"
        onClick={handleRemove}
        disabled={!canRemove}
        className={`absolute top-1.5 right-1.5 w-6 h-6 p-0 rounded-full flex items-center justify-center z-10 border border-gray-300 dark:border-gray-600 shadow-sm text-xs
          ${canRemove
            ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-400'
            : 'bg-gray-300 dark:bg-gray-600 text-gray-400 cursor-not-allowed'}
        `}
        aria-label={t('remove')}
        title={canRemove ? t('remove') : 'Cannot remove the last position'}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="col-span-12 md:col-span-3 space-y-2 pr-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('positionName')}
        </label>
        <input
          type="text"
          value={position.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., MSCI World"
          className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          required
        />
      </div>
      
      <div className="col-span-6 md:col-span-2 space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('currentValue')}
        </label>
        <input
          type="text"
          value={position.currentValue === 0 && position.currentValue !== '' ? '0' : position.currentValue}
          onChange={(e) => handleChange('currentValue', e.target.value)}
          inputMode="decimal"
          placeholder={currentLanguage === 'de' ? '0' : '0'}
          className="form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
        />
      </div>

      <div className="col-span-6 md:col-span-2 space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('currentPercent')}
        </label>
        <div className="form-input w-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 flex items-center justify-center font-medium border border-gray-300 dark:border-gray-600">
          {currentPercentage.toFixed(1)}%
        </div>
      </div>
      
      <div className="col-span-6 md:col-span-3 space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('targetRatio')}
        </label>
        <input
          type="text"
          value={position.targetRatio === 0 && position.targetRatio !== '' ? '0' : position.targetRatio}
          onChange={(e) => handleChange('targetRatio', e.target.value)}
          inputMode="decimal"
          placeholder="0.0"
          className={`form-input w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 ${showTargetError ? 'border-red-500 ring-2 ring-red-300' : ''}`}
          aria-invalid={showTargetError ? 'true' : undefined}
        />
        {showTargetError && (
          <div className="text-xs text-red-600 mt-1">Targets adding up higher than 100%</div>
        )}
      </div>
      
      <div className="col-span-6 md:col-span-2 space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('difference')}
        </label>
        <div className={`form-input w-full flex items-center justify-center font-medium border ${
          Math.abs(currentPercentage - position.targetRatio) < 0.1 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' 
            : currentPercentage < position.targetRatio 
              ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' 
              : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
        }`}>
          {(currentPercentage - position.targetRatio).toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export default PositionRow;
