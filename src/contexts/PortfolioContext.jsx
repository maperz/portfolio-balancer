/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const PortfolioContext = createContext();

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider = ({ children }) => {
  // Load positions from localStorage or use defaults
  const getInitialPositions = () => {
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
      rebalanceFrequency: 'monthly',
      planningPeriod: 12,
      periodUnit: 'months'
    };
  };

  const initialSettings = getInitialSettings();
  
  const [positions, setPositions] = useState(getInitialPositions());
  const [isAdvancedMode, setIsAdvancedMode] = useState(initialSettings.isAdvancedMode);
  const [monthlySavings, setMonthlySavings] = useState(initialSettings.monthlySavings);
  const [rebalanceFrequency, setRebalanceFrequency] = useState(initialSettings.rebalanceFrequency);
  const [planningPeriod, setPlanningPeriod] = useState(initialSettings.planningPeriod);
  const [periodUnit, setPeriodUnit] = useState(initialSettings.periodUnit);
  const [results, setResults] = useState(null);

  const getTotalValue = () => {
    return positions.reduce((sum, pos) => sum + (pos.currentValue || 0), 0);
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
        periodUnit
      };
      localStorage.setItem('portfolioBalancerSettings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  }, [isAdvancedMode, monthlySavings, rebalanceFrequency, planningPeriod, periodUnit]);

  const addPosition = (position = null) => {
    // Calculate remaining target percentage
    const currentTotalRatio = positions.reduce((sum, pos) => sum + (pos.targetRatio || 0), 0);
    const remainingRatio = Math.max(0, 100 - currentTotalRatio);
    
    const newPosition = position || {
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

  const removePosition = (id) => {
    setPositions(prev => prev.filter(pos => pos.id !== id));
  };

  const updatePosition = (id, field, value) => {
    setPositions(prev => 
      prev.map(pos => 
        pos.id === id 
          ? { 
              ...pos, 
              [field]: field === 'name' 
                ? value 
                : value === '' 
                  ? 0 
                  : parseFloat(value) || 0
            }
          : pos,
      ),
    );
  };

  const getAction = (difference) => {
    if (Math.abs(difference) < 0.01) {
      return { type: 'hold', amount: 0 };
    } else if (difference > 0) {
      return { type: 'buy', amount: Math.abs(difference) };
    } else {
      return { type: 'sell', amount: Math.abs(difference) };
    }
  };

  const calculateOptimizedStrategy = (totalMonths, monthlyAmount) => {
    const strategy = [];
    let currentPositions = [...positions];
    const totalCurrentValue = getTotalValue();
    
    for (let month = 1; month <= totalMonths; month++) {
      const currentTotal = currentPositions.reduce((sum, pos) => sum + pos.currentValue, 0);
      const newTotal = currentTotal + monthlyAmount;
      
      // Calculate target values
      const targets = positions.map(pos => ({
        ...pos,
        currentValue: currentPositions.find(cp => cp.id === pos.id)?.currentValue || 0,
        targetValue: (pos.targetRatio / 100) * newTotal,
      }));
      
      // Calculate differences and prioritize actions
      const actions = targets
        .map(target => ({
          ...target,
          difference: target.targetValue - target.currentValue,
        }))
        .filter(action => Math.abs(action.difference) > 0.01)
        .sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));
      
      // Apply monthly savings with optimized allocation
      let remainingAmount = monthlyAmount;
      const monthActions = [];
      
      // Prioritize positions that are most underweight
      const underweightActions = actions.filter(a => a.difference > 0);
      
      for (const action of underweightActions) {
        if (remainingAmount <= 0) break;
        
        const amountToInvest = Math.min(remainingAmount, action.difference);
        if (amountToInvest > 0.01) {
          monthActions.push({
            position: action.name,
            type: 'buy',
            amount: amountToInvest,
          });
          
          // Update current positions
          const posIndex = currentPositions.findIndex(p => p.id === action.id);
          if (posIndex !== -1) {
            currentPositions[posIndex].currentValue += amountToInvest;
          }
          
          remainingAmount -= amountToInvest;
        }
      }
      
      // If there's remaining amount and no underweight positions, distribute proportionally
      if (remainingAmount > 0.01) {
        const totalTargetRatio = positions.reduce((sum, pos) => sum + pos.targetRatio, 0);
        
        positions.forEach(pos => {
          const proportionalAmount = (pos.targetRatio / totalTargetRatio) * remainingAmount;
          if (proportionalAmount > 0.01) {
            monthActions.push({
              position: pos.name,
              type: 'buy',
              amount: proportionalAmount,
            });
            
            const posIndex = currentPositions.findIndex(p => p.id === pos.id);
            if (posIndex !== -1) {
              currentPositions[posIndex].currentValue += proportionalAmount;
            }
          }
        });
      }
      
      strategy.push({
        month,
        portfolioValue: currentPositions.reduce((sum, pos) => sum + pos.currentValue, 0),
        actions: monthActions,
      });
    }
    
    return strategy;
  };

  const calculateRebalancing = () => {
    // Validate positions - allow zero values but require valid names and non-negative numbers
    const validPositions = positions.filter(pos => 
      pos.name.trim() && 
      (pos.currentValue >= 0 || pos.currentValue === '') && 
      (pos.targetRatio >= 0 || pos.targetRatio === '')
    );

    if (validPositions.length === 0) {
      return { error: 'noPositions' };
    }

    // Calculate total current value
    const totalCurrentValue = getTotalValue();
    const totalMonths = periodUnit === 'years' ? planningPeriod * 12 : planningPeriod;
    
    // Calculate target total (current + savings if advanced mode)
    let targetTotal = totalCurrentValue;
    if (isAdvancedMode && monthlySavings > 0) {
      targetTotal += monthlySavings * totalMonths;
    }

    // Check if ratios add up to 100%
    const totalRatio = validPositions.reduce((sum, pos) => sum + pos.targetRatio, 0);
    const adjustedPositions = [...validPositions];
    
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

    // Calculate target values and differences
    const calculatedResults = adjustedPositions.map(position => {
      const targetValue = (position.targetRatio / 100) * targetTotal;
      const difference = targetValue - position.currentValue;
      const currentRatio = totalCurrentValue > 0 ? (position.currentValue / totalCurrentValue) * 100 : 0;
      
      return {
        ...position,
        targetValue,
        difference,
        currentRatio,
        action: getAction(difference),
      };
    });

    // Calculate optimized monthly strategy if in advanced mode
    let monthlyStrategy = [];
    if (isAdvancedMode && monthlySavings > 0) {
      monthlyStrategy = calculateOptimizedStrategy(totalMonths, monthlySavings);
    }

    const result = {
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

  const value = {
    positions,
    isAdvancedMode,
    monthlySavings,
    rebalanceFrequency,
    planningPeriod,
    periodUnit,
    results,
    getTotalValue,
    setIsAdvancedMode,
    setMonthlySavings,
    setRebalanceFrequency,
    setPlanningPeriod,
    setPeriodUnit,
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
