import { describe, it, expect } from 'vitest';

describe('Portfolio Calculations', () => {
  describe('Action Determination', () => {
    const getAction = (difference) => {
      if (Math.abs(difference) < 0.01) {
        return { type: 'hold', amount: 0 };
      } else if (difference > 0) {
        return { type: 'buy', amount: Math.abs(difference) };
      } else {
        return { type: 'sell', amount: Math.abs(difference) };
      }
    };

    it('should return hold action for small differences', () => {
      const action = getAction(0.005);
      expect(action.type).toBe('hold');
      expect(action.amount).toBe(0);
    });

    it('should return buy action for positive differences', () => {
      const action = getAction(1000);
      expect(action.type).toBe('buy');
      expect(action.amount).toBe(1000);
    });

    it('should return sell action for negative differences', () => {
      const action = getAction(-1000);
      expect(action.type).toBe('sell');
      expect(action.amount).toBe(1000);
    });
  });

  describe('Target Value Calculations', () => {
    it('should calculate target value correctly', () => {
      const targetRatio = 70; // 70%
      const totalValue = 100000;
      const targetValue = (targetRatio / 100) * totalValue;
      
      expect(targetValue).toBe(70000);
    });

    it('should calculate difference correctly', () => {
      const targetValue = 70000;
      const currentValue = 65000;
      const difference = targetValue - currentValue;
      
      expect(difference).toBe(5000);
    });

    it('should handle zero current value', () => {
      const targetRatio = 50;
      const totalValue = 100000;
      const currentValue = 0;
      const targetValue = (targetRatio / 100) * totalValue;
      const difference = targetValue - currentValue;
      
      expect(targetValue).toBe(50000);
      expect(difference).toBe(50000);
    });
  });

  describe('Ratio Calculations', () => {
    it('should calculate current ratio correctly', () => {
      const currentValue = 70000;
      const totalValue = 100000;
      const currentRatio = (currentValue / totalValue) * 100;
      
      expect(currentRatio).toBe(70);
    });

    it('should handle zero total value', () => {
      const currentValue = 0;
      const totalValue = 0;
      const currentRatio = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
      
      expect(currentRatio).toBe(0);
    });
  });

  describe('Savings Integration', () => {
    it('should calculate target total with savings', () => {
      const currentTotal = 100000;
      const monthlySavings = 1000;
      const months = 12;
      const targetTotal = currentTotal + (monthlySavings * months);
      
      expect(targetTotal).toBe(112000);
    });

    it('should handle zero savings', () => {
      const currentTotal = 100000;
      const monthlySavings = 0;
      const months = 12;
      const targetTotal = currentTotal + (monthlySavings * months);
      
      expect(targetTotal).toBe(100000);
    });
  });

  describe('Unspent Calculation', () => {
    it('should detect when ratios do not sum to 100%', () => {
      const ratios = [50, 30, 10]; // Sum = 90%
      const totalRatio = ratios.reduce((sum, r) => sum + r, 0);
      const hasUnspent = Math.abs(totalRatio - 100) > 0.01;
      
      expect(hasUnspent).toBe(true);
      expect(100 - totalRatio).toBe(10);
    });

    it('should not detect unspent when ratios sum to 100%', () => {
      const ratios = [70, 20, 10]; // Sum = 100%
      const totalRatio = ratios.reduce((sum, r) => sum + r, 0);
      const hasUnspent = Math.abs(totalRatio - 100) > 0.01;
      
      expect(hasUnspent).toBe(false);
    });
  });
});
