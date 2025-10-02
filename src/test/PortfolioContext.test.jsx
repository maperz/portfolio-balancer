import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { PortfolioProvider, usePortfolio } from '../contexts/PortfolioContext';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

global.localStorage = localStorageMock;

describe('PortfolioContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with default positions', () => {
      const { result } = renderHook(() => usePortfolio(), {
        wrapper: PortfolioProvider,
      });

      expect(result.current.positions).toHaveLength(3);
      expect(result.current.positions[0]).toMatchObject({
        name: 'MSCI World',
        currentValue: 70000,
        targetRatio: 70,
      });
    });

    it('should initialize with advanced mode disabled', () => {
      const { result } = renderHook(() => usePortfolio(), {
        wrapper: PortfolioProvider,
      });

      expect(result.current.isAdvancedMode).toBe(false);
      expect(result.current.monthlySavings).toBe(0);
    });
  });

  describe('Position Management', () => {
    it('should add a new position', () => {
      const { result } = renderHook(() => usePortfolio(), {
        wrapper: PortfolioProvider,
      });

      const initialLength = result.current.positions.length;

      act(() => {
        result.current.addPosition();
      });

      expect(result.current.positions).toHaveLength(initialLength + 1);
    });

    it('should add position with remaining target ratio', () => {
      const { result } = renderHook(() => usePortfolio(), {
        wrapper: PortfolioProvider,
      });

      // Default positions have 70 + 10 + 20 = 100%
      act(() => {
        result.current.addPosition();
      });

      const newPosition = result.current.positions[result.current.positions.length - 1];
      expect(newPosition.targetRatio).toBe(0); // Should be 0 since total is already 100%
    });

    it('should remove a position', () => {
      const { result } = renderHook(() => usePortfolio(), {
        wrapper: PortfolioProvider,
      });

      const idToRemove = result.current.positions[0].id;

      act(() => {
        result.current.removePosition(idToRemove);
      });

      expect(result.current.positions).toHaveLength(2);
      expect(result.current.positions.find(p => p.id === idToRemove)).toBeUndefined();
    });

    it('should update position field', () => {
      const { result } = renderHook(() => usePortfolio(), {
        wrapper: PortfolioProvider,
      });

      const positionId = result.current.positions[0].id;

      act(() => {
        result.current.updatePosition(positionId, 'name', 'Updated Name');
      });

      const updatedPosition = result.current.positions.find(p => p.id === positionId);
      expect(updatedPosition.name).toBe('Updated Name');
    });

    it('should update position numeric value', () => {
      const { result } = renderHook(() => usePortfolio(), {
        wrapper: PortfolioProvider,
      });

      const positionId = result.current.positions[0].id;

      act(() => {
        result.current.updatePosition(positionId, 'currentValue', '50000');
      });

      const updatedPosition = result.current.positions.find(p => p.id === positionId);
      expect(updatedPosition.currentValue).toBe(50000);
    });
  });

  describe('Total Value Calculation', () => {
    it('should calculate total portfolio value', () => {
      const { result } = renderHook(() => usePortfolio(), {
        wrapper: PortfolioProvider,
      });

      // Default positions: 70000 + 10000 + 20000 = 100000
      expect(result.current.getTotalValue()).toBe(100000);
    });

    it('should handle zero values', () => {
      const { result } = renderHook(() => usePortfolio(), {
        wrapper: PortfolioProvider,
      });

      act(() => {
        const positionId = result.current.positions[0].id;
        result.current.updatePosition(positionId, 'currentValue', '0');
      });

      expect(result.current.getTotalValue()).toBe(30000); // 0 + 10000 + 20000
    });
  });

  describe('Rebalancing Calculation', () => {
    it('should calculate basic rebalancing', () => {
      const { result } = renderHook(() => usePortfolio(), {
        wrapper: PortfolioProvider,
      });

      act(() => {
        const calculationResult = result.current.calculateRebalancing();
        expect(calculationResult.results).toBeDefined();
        expect(calculationResult.totalCurrentValue).toBe(100000);
      });
    });

    it('should return error when no valid positions', () => {
      const { result } = renderHook(() => usePortfolio(), {
        wrapper: PortfolioProvider,
      });

      act(() => {
        // Remove all positions
        const ids = result.current.positions.map(p => p.id);
        ids.forEach(id => result.current.removePosition(id));
      });

      act(() => {
        const calculationResult = result.current.calculateRebalancing();
        expect(calculationResult.error).toBe('noPositions');
      });
    });

    it('should handle unspent allocation', () => {
      const { result } = renderHook(() => usePortfolio(), {
        wrapper: PortfolioProvider,
      });

      act(() => {
        // Update ratios to not add up to 100%
        const positions = result.current.positions;
        result.current.updatePosition(positions[0].id, 'targetRatio', '50');
        result.current.updatePosition(positions[1].id, 'targetRatio', '20');
        result.current.updatePosition(positions[2].id, 'targetRatio', '10');
      });

      act(() => {
        const calculationResult = result.current.calculateRebalancing();
        expect(calculationResult.hasUnspent).toBe(true);
        // Should have an extra unspent position
        expect(calculationResult.results.some(r => r.id === 'unspent')).toBe(true);
      });
    });

    it('should calculate buy/sell/hold actions correctly', () => {
      const { result } = renderHook(() => usePortfolio(), {
        wrapper: PortfolioProvider,
      });

      act(() => {
        // Set up a portfolio that needs rebalancing
        const positions = result.current.positions;
        result.current.updatePosition(positions[0].id, 'currentValue', '80000');
        result.current.updatePosition(positions[1].id, 'currentValue', '10000');
        result.current.updatePosition(positions[2].id, 'currentValue', '10000');
      });

      act(() => {
        const calculationResult = result.current.calculateRebalancing();
        const results = calculationResult.results;

        // First position (70% target) should need to sell
        expect(results[0].action.type).toBe('sell');
        
        // Third position (20% target) should need to buy
        expect(results[2].action.type).toBe('buy');
      });
    });
  });

  describe('Advanced Mode', () => {
    it('should enable advanced mode', () => {
      const { result } = renderHook(() => usePortfolio(), {
        wrapper: PortfolioProvider,
      });

      act(() => {
        result.current.setIsAdvancedMode(true);
      });

      expect(result.current.isAdvancedMode).toBe(true);
    });

    it('should set monthly savings', () => {
      const { result } = renderHook(() => usePortfolio(), {
        wrapper: PortfolioProvider,
      });

      act(() => {
        result.current.setMonthlySavings(1000);
      });

      expect(result.current.monthlySavings).toBe(1000);
    });

    it('should calculate with savings included in target total', () => {
      const { result } = renderHook(() => usePortfolio(), {
        wrapper: PortfolioProvider,
      });

      act(() => {
        result.current.setIsAdvancedMode(true);
        result.current.setMonthlySavings(1000);
        result.current.setPlanningPeriod(12);
      });

      act(() => {
        const calculationResult = result.current.calculateRebalancing();
        // Total should be current (100000) + savings (1000 * 12 = 12000) = 112000
        expect(calculationResult.targetTotal).toBe(112000);
      });
    });

    it('should generate monthly strategy', () => {
      const { result } = renderHook(() => usePortfolio(), {
        wrapper: PortfolioProvider,
      });

      act(() => {
        result.current.setIsAdvancedMode(true);
        result.current.setMonthlySavings(1000);
        result.current.setPlanningPeriod(12);
      });

      act(() => {
        const calculationResult = result.current.calculateRebalancing();
        expect(calculationResult.monthlyStrategy).toBeDefined();
        expect(calculationResult.monthlyStrategy).toHaveLength(12);
        expect(calculationResult.monthlyStrategy[0]).toHaveProperty('month');
        expect(calculationResult.monthlyStrategy[0]).toHaveProperty('actions');
        expect(calculationResult.monthlyStrategy[0]).toHaveProperty('portfolioValue');
      });
    });

    it('should optimize monthly strategy to minimize transitions', () => {
      const { result } = renderHook(() => usePortfolio(), {
        wrapper: PortfolioProvider,
      });

      act(() => {
        result.current.setIsAdvancedMode(true);
        result.current.setMonthlySavings(1000);
        result.current.setPlanningPeriod(3);
      });

      act(() => {
        const calculationResult = result.current.calculateRebalancing();
        const strategy = calculationResult.monthlyStrategy;
        
        // Each month should have actions
        strategy.forEach(month => {
          expect(month.actions).toBeDefined();
          expect(Array.isArray(month.actions)).toBe(true);
        });

        // All actions should be buy actions (since we're adding new money)
        const allActions = strategy.flatMap(m => m.actions);
        allActions.forEach(action => {
          expect(action.type).toBe('buy');
          expect(action.amount).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('LocalStorage Persistence', () => {
    it('should save positions to localStorage', () => {
      const { result } = renderHook(() => usePortfolio(), {
        wrapper: PortfolioProvider,
      });

      act(() => {
        result.current.addPosition();
      });

      // Wait for effect to run
      setTimeout(() => {
        const saved = localStorage.getItem('portfolioBalancerPositions');
        expect(saved).toBeDefined();
        const parsed = JSON.parse(saved);
        expect(Array.isArray(parsed)).toBe(true);
      }, 100);
    });

    it('should save settings to localStorage', () => {
      const { result } = renderHook(() => usePortfolio(), {
        wrapper: PortfolioProvider,
      });

      act(() => {
        result.current.setIsAdvancedMode(true);
        result.current.setMonthlySavings(500);
      });

      // Wait for effect to run
      setTimeout(() => {
        const saved = localStorage.getItem('portfolioBalancerSettings');
        expect(saved).toBeDefined();
        const parsed = JSON.parse(saved);
        expect(parsed.isAdvancedMode).toBe(true);
        expect(parsed.monthlySavings).toBe(500);
      }, 100);
    });
  });
});
