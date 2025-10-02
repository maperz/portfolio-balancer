import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Position {
  id: number | string;
  name: string;
  currentValue: number | string;
  targetRatio: number | string;
}

export interface Action {
  type: 'buy' | 'sell' | 'hold';
  amount: number;
}

interface MonthAction {
  position: string;
  type: 'buy';
  amount: number;
}

export interface MonthlyStrategyItem {
  month: number;
  portfolioValue: number;
  actions: MonthAction[];
}

export interface CalculatedResult extends Position {
  targetValue: number;
  difference: number;
  fromSavings: number;
  fromRebalancing: number;
  currentRatio: number;
  action: Action;
}

export interface Results {
  results: CalculatedResult[];
  totalCurrentValue: number;
  targetTotal: number;
  totalMonths: number;
  hasUnspent: boolean;
  monthlyStrategy: MonthlyStrategyItem[];
}

export interface ErrorResult {
  error: string;
}

type RebalanceFrequency = 'monthly' | 'quarterly' | 'yearly';

interface PortfolioContextValue {
  positions: Position[];
  isAdvancedMode: boolean;
  monthlySavings: number;
  rebalanceFrequency: RebalanceFrequency;
  planningPeriod: number;
  results: Results | null;
  getTotalValue: () => number;
  setIsAdvancedMode: (value: boolean) => void;
  setMonthlySavings: (value: number) => void;
  setRebalanceFrequency: (value: RebalanceFrequency) => void;
  setPlanningPeriod: (value: number) => void;
  addPosition: (position?: Position | null) => void;
  removePosition: (id: number | string) => void;
  updatePosition: (id: number | string, field: string, value: string | number) => void;
  calculateRebalancing: () => Results | ErrorResult;
}

const PortfolioContext = createContext<PortfolioContextValue | undefined>(undefined);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

interface PortfolioProviderProps {
  children: ReactNode;
}

export const PortfolioProvider = ({ children }: PortfolioProviderProps) => {
  // Load positions from localStorage or use defaults
  const getInitialPositions = (): Position[] => {
    try {
      const savedPositions = localStorage.getItem('portfolioBalancerPositions');
      if (savedPositions) {
        const parsedPositions = JSON.parse(savedPositions);
        // Validate that it's an array with valid structure
        if (Array.isArray(parsedPositions) && parsedPositions.length > 0) {
          return parsedPositions;
        }
      }
    } catch (error) {
      console.warn('Failed to load saved positions:', error);
    }
    
    // Default positions if nothing saved or error loading
    return [
      { id: 1, name: 'MSCI World', currentValue: 70000, targetRatio: 70 },
      { id: 2, name: 'Gold', currentValue: 10000, targetRatio: 10 },
      { id: 3, name: 'Bank', currentValue: 20000, targetRatio: 20 },
    ];
  };

  // Load other settings from localStorage
  const getInitialSettings = () => {
    try {
      const savedSettings = localStorage.getItem('portfolioBalancerSettings');
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    } catch (error) {
      console.warn('Failed to load saved settings:', error);
    }
    
    return {
      isAdvancedMode: false,
      monthlySavings: 0,
      rebalanceFrequency: 'monthly' as RebalanceFrequency,
      planningPeriod: 12,
      periodUnit: 'months',
    };
  };

  const initialSettings = getInitialSettings();
  
  const [positions, setPositions] = useState<Position[]>(getInitialPositions());
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(initialSettings.isAdvancedMode);
  const [monthlySavings, setMonthlySavings] = useState<number>(initialSettings.monthlySavings);
  const [rebalanceFrequency, setRebalanceFrequency] = useState<RebalanceFrequency>(initialSettings.rebalanceFrequency);
  const [planningPeriod, setPlanningPeriod] = useState<number>(initialSettings.planningPeriod);
  const [results, setResults] = useState<Results | null>(null);

  // Clear results when switching between advanced and simple mode
  useEffect(() => {
    setResults(null);
  }, [isAdvancedMode]);

  const getTotalValue = () => {
    return positions.reduce((sum, pos) => sum + (Number(pos.currentValue) || 0), 0);
  };

  // Save positions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('portfolioBalancerPositions', JSON.stringify(positions));
    } catch (error) {
      console.warn('Failed to save positions:', error);
    }
  }, [positions]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      const settings = {
        isAdvancedMode,
        monthlySavings,
        rebalanceFrequency,
        planningPeriod,
      };
      localStorage.setItem('portfolioBalancerSettings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  }, [isAdvancedMode, monthlySavings, rebalanceFrequency, planningPeriod]);

  const addPosition = (position: Position | null = null) => {
    // Calculate remaining target percentage
    const currentTotalRatio = positions.reduce((sum, pos) => sum + (Number(pos.targetRatio) || 0), 0);
    const remainingRatio = Math.max(0, 100 - currentTotalRatio);
    
    const newPosition: Position = position || {
      id: Date.now() + Math.random(), // Ensure unique ID
      name: '',
      currentValue: 0,
      targetRatio: remainingRatio, // Auto-set to remaining percentage
    };
    
    if (!position) {
      newPosition.id = Date.now() + Math.random();
    }
    
    setPositions(prev => [...prev, newPosition]);
  };

  const removePosition = (id: number | string) => {
    setPositions(prev => prev.filter(pos => pos.id !== id));
  };

  const updatePosition = (id: number | string, field: string, value: string | number) => {
    setPositions(prev => 
      prev.map(pos => 
        pos.id === id 
          ? { 
            ...pos, 
            [field]: field === 'name' 
              ? value 
              : value === '' 
                ? 0 
                : parseFloat(String(value)) || 0,
          }
          : pos,
      ),
    );
  };

  const getAction = (difference: number): Action => {
    if (Math.abs(difference) < 0.01) {
      return { type: 'hold', amount: 0 };
    } else if (difference > 0) {
      return { type: 'buy', amount: Math.abs(difference) };
    } else {
      return { type: 'sell', amount: Math.abs(difference) };
    }
  };

  // New strategy: minimize number of position transitions (one position per month gets the full saving)
  const calculateOptimizedStrategy = (totalMonths: number, monthlyAmount: number): MonthlyStrategyItem[] => {
    const strategy: MonthlyStrategyItem[] = [];
    const currentPositions = [...positions];
    const totalCurrentValue = getTotalValue();
    const totalSavings = monthlyAmount * totalMonths;
    const finalTotal = totalCurrentValue + totalSavings;
    // Calculate the final target value for each position
    const finalTargets = positions.map(pos => ({
      ...pos,
      finalTargetValue: (Number(pos.targetRatio) / 100) * finalTotal,
    }));

    // Calculate the total amount needed for each position to reach its final target
    const neededAmounts = finalTargets.map((pos, i) => ({
      id: pos.id,
      name: pos.name,
      needed: pos.finalTargetValue - (Number(currentPositions[i]?.currentValue) || 0),
    }));

    for (let month = 1; month <= totalMonths; month++) {
      const monthActions: MonthAction[] = [];
      let remainingThisMonth = monthlyAmount;
      // Always pick the position with the largest remaining need
      while (remainingThisMonth > 0.01) {
        // Find the position with the largest remaining need
        const idx = neededAmounts.reduce((maxIdx, n, i, arr) => (n.needed > arr[maxIdx].needed ? i : maxIdx), 0);
        const n = neededAmounts[idx];
        if (n.needed <= 0.01) {
          break;
        }
        const toInvest = Math.min(n.needed, remainingThisMonth);
        if (toInvest > 0.01) {
          monthActions.push({
            position: n.name,
            type: 'buy',
            amount: toInvest,
          });
          // Update currentPositions
          const posIndex = currentPositions.findIndex(p => p.id === n.id);
          if (posIndex !== -1) {
            const currentVal = Number(currentPositions[posIndex].currentValue) || 0;
            currentPositions[posIndex].currentValue = currentVal + toInvest;
          }
          // Update remaining needed
          neededAmounts[idx].needed -= toInvest;
          remainingThisMonth -= toInvest;
        } else {
          break;
        }
      }
      strategy.push({
        month,
        portfolioValue: currentPositions.reduce((sum, pos) => sum + (Number(pos.currentValue) || 0), 0),
        actions: monthActions,
      });
    }
    return strategy;
  };

  const calculateRebalancing = (): Results | ErrorResult => {
    // Validate positions - allow zero values but require valid names and non-negative numbers
    const validPositions = positions.filter(pos => 
      pos.name.trim() && 
      (Number(pos.currentValue) >= 0 || pos.currentValue === '') && 
      (Number(pos.targetRatio) >= 0 || pos.targetRatio === ''),
    );

    if (validPositions.length === 0) {
      return { error: 'noPositions' };
    }

    // Calculate total current value
    const totalCurrentValue = getTotalValue();
    const totalMonths = planningPeriod;
    
    // Calculate target total (current + savings if advanced mode)
    let targetTotal = totalCurrentValue;
    if (isAdvancedMode && monthlySavings > 0) {
      targetTotal += monthlySavings * totalMonths;
    }

    // Check if ratios add up to 100%
    const totalRatio = validPositions.reduce((sum, pos) => sum + Number(pos.targetRatio), 0);
    const adjustedPositions: Position[] = [...validPositions];
    
    const hasUnspent = Math.abs(totalRatio - 100) > 0.01;
    if (hasUnspent) {
      const unspentRatio = 100 - totalRatio;
      adjustedPositions.push({
        id: 'unspent',
        name: 'unspent', // This will be translated in the component
        currentValue: 0,
        targetRatio: unspentRatio,
      });
    }

    // Calculate target values and differences, and split difference into rebalancing and new income

    // Calculate optimized monthly strategy if in advanced mode
    let monthlyStrategy: MonthlyStrategyItem[] = [];
    const savingsByPosition: Record<string, number> = {};
    if (isAdvancedMode && monthlySavings > 0 && planningPeriod > 0) {
      monthlyStrategy = calculateOptimizedStrategy(totalMonths, monthlySavings);

      monthlyStrategy.forEach(month => {
        month.actions.forEach(action => {
          if (action.type === 'buy') {
            if (!savingsByPosition[action.position]) {
              savingsByPosition[action.position] = 0;
            }
            savingsByPosition[action.position] += action.amount;
          }
        });
      });
    }

    const calculatedResults: CalculatedResult[] = adjustedPositions.map(position => {
      const targetValue = (Number(position.targetRatio) / 100) * targetTotal;
      const difference = targetValue - Number(position.currentValue);
      const currentRatio = totalCurrentValue > 0 ? (Number(position.currentValue) / totalCurrentValue) * 100 : 0;
      // Portion of targetValue that comes from new income (savings) - actual from monthly strategy
      const fromSavings = isAdvancedMode && monthlySavings > 0
        ? (savingsByPosition[position.name] || 0)
        : 0;
      // Portion that comes from rebalancing (difference minus new income)
      const fromRebalancing = difference - fromSavings;
      return {
        ...position,
        targetValue,
        difference,
        fromSavings,
        fromRebalancing,
        currentRatio,
        action: getAction(difference),
      };
    });


    const result: Results = {
      results: calculatedResults,
      totalCurrentValue,
      targetTotal,
      totalMonths,
      hasUnspent,
      monthlyStrategy,
    };

    setResults(result);
    return result;
  };

  const value: PortfolioContextValue = {
    positions,
    isAdvancedMode,
    monthlySavings,
    rebalanceFrequency,
    planningPeriod,
    results,
    getTotalValue,
    setIsAdvancedMode,
    setMonthlySavings,
    setRebalanceFrequency,
    setPlanningPeriod,
    addPosition,
    removePosition,
    updatePosition,
    calculateRebalancing,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
