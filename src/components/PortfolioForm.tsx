
import { useLanguage } from '../contexts/LanguageContext';
import { usePortfolio } from '../contexts/PortfolioContext';
import PositionRow from './PositionRow';
import AdvancedSettings from './AdvancedSettings';

const PortfolioForm = () => {
  const { t } = useLanguage();
  const { 
    positions, 
    isAdvancedMode, 
    addPosition, 
    calculateRebalancing, 
  } = usePortfolio();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateRebalancing();
  };

  const handleAddPosition = () => {
    addPosition();
  };

  return (
    <div className="card p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Positions Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('positions')}
            </h3>
            <button
              type="button"
              onClick={handleAddPosition}
              className="btn btn-secondary btn-small"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('addPosition')}
            </button>
          </div>
          
          <div className="space-y-4">
            {positions.map((position) => (
              <PositionRow key={position.id} position={position} />
            ))}
          </div>
        </div>

        {/* Advanced Settings */}
        {isAdvancedMode && <AdvancedSettings />}

        {/* Calculate Button */}
        <div className="flex justify-center pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            className="btn btn-primary"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {t('calculate')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PortfolioForm;
