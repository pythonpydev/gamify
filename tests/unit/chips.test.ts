import { describe, it, expect } from 'vitest';
import { calculateChips, getMaxChipsForSession } from '@/lib/utils/chips';

describe('calculateChips', () => {
  describe('base chip calculation', () => {
    it('calculates base chips as floor((duration/25) * 100)', () => {
      const result = calculateChips(25, 3);
      expect(result.baseChips).toBe(100);
    });

    it('handles partial 25-minute blocks with proportional chips', () => {
      const result = calculateChips(24, 3);
      expect(result.baseChips).toBe(96); // floor((24/25) * 100) = 96
    });

    it('calculates correctly for 15 minute Quick Hand', () => {
      const result = calculateChips(15, 3);
      expect(result.baseChips).toBe(60); // floor((15/25) * 100) = 60
    });

    it('calculates correctly for 50 minute Deep Stack', () => {
      const result = calculateChips(50, 3);
      expect(result.baseChips).toBe(200);
    });
  });

  describe('quality bonus calculation', () => {
    it('calculates quality bonus as rating * 20', () => {
      const result = calculateChips(25, 3);
      expect(result.qualityBonus).toBe(60);
    });

    it('gives 20 chips for 1-star rating', () => {
      const result = calculateChips(25, 1);
      expect(result.qualityBonus).toBe(20);
    });

    it('gives 100 chips for 5-star rating', () => {
      const result = calculateChips(25, 5);
      expect(result.qualityBonus).toBe(100);
    });
  });

  describe('total chip calculation', () => {
    it('returns correct total for 15 min, 3 stars (120 chips)', () => {
      const result = calculateChips(15, 3);
      expect(result.totalChips).toBe(120);
    });

    it('returns correct total for 25 min, 4 stars (180 chips)', () => {
      const result = calculateChips(25, 4);
      expect(result.totalChips).toBe(180);
    });

    it('returns correct total for 25 min, 5 stars (200 chips)', () => {
      const result = calculateChips(25, 5);
      expect(result.totalChips).toBe(200);
    });

    it('returns correct total for 50 min, 3 stars (260 chips)', () => {
      const result = calculateChips(50, 3);
      expect(result.totalChips).toBe(260);
    });

    it('returns correct total for 50 min, 5 stars (300 chips)', () => {
      const result = calculateChips(50, 5);
      expect(result.totalChips).toBe(300);
    });
  });

  describe('edge cases', () => {
    it('returns 0 chips for sessions under 5 minutes', () => {
      const result = calculateChips(4, 5);
      expect(result.totalChips).toBe(0);
      expect(result.baseChips).toBe(0);
      expect(result.qualityBonus).toBe(0);
    });

    it('returns chips for sessions exactly 5 minutes', () => {
      const result = calculateChips(5, 3);
      // 5 min: floor((5/25)*100) = 20 base + 60 quality = 80 total
      expect(result.baseChips).toBe(20);
      expect(result.qualityBonus).toBe(60);
      expect(result.totalChips).toBe(80);
    });

    it('throws error for negative duration', () => {
      expect(() => calculateChips(-1, 3)).toThrow('Duration cannot be negative');
    });

    it('throws error for quality rating below 1', () => {
      expect(() => calculateChips(25, 0)).toThrow('Quality rating must be between 1 and 5');
    });

    it('throws error for quality rating above 5', () => {
      expect(() => calculateChips(25, 6)).toThrow('Quality rating must be between 1 and 5');
    });
  });
});

describe('getMaxChipsForSession', () => {
  it('returns max chips for QUICK_HAND (15 min, 5 stars = 160)', () => {
    expect(getMaxChipsForSession('QUICK_HAND')).toBe(160);
  });

  it('returns max chips for STANDARD (25 min, 5 stars = 200)', () => {
    expect(getMaxChipsForSession('STANDARD')).toBe(200);
  });

  it('returns max chips for DEEP_STACK (50 min, 5 stars = 300)', () => {
    expect(getMaxChipsForSession('DEEP_STACK')).toBe(300);
  });
});
