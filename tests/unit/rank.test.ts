import { describe, it, expect } from 'vitest';
import { getRank, getRankName, getNextRank, getRankProgress, RANKS } from '@/lib/utils/rank';

describe('getRank', () => {
  describe('returns correct rank for chip thresholds', () => {
    it('returns Fish for 0 chips', () => {
      expect(getRank(0).name).toBe('Fish');
    });

    it('returns Fish for 999 chips', () => {
      expect(getRank(999).name).toBe('Fish');
    });

    it('returns Calling Station for 1000 chips', () => {
      expect(getRank(1000).name).toBe('Calling Station');
    });

    it('returns Calling Station for 4999 chips', () => {
      expect(getRank(4999).name).toBe('Calling Station');
    });

    it('returns TAG Regular for 5000 chips', () => {
      expect(getRank(5000).name).toBe('TAG Regular');
    });

    it('returns Semi-Pro for 15000 chips', () => {
      expect(getRank(15000).name).toBe('Semi-Pro');
    });

    it('returns Pro for 50000 chips', () => {
      expect(getRank(50000).name).toBe('Pro');
    });

    it('returns High Roller for 100000 chips', () => {
      expect(getRank(100000).name).toBe('High Roller');
    });

    it('returns Legend for 500000 chips', () => {
      expect(getRank(500000).name).toBe('Legend');
    });

    it('returns Legend for 1000000 chips', () => {
      expect(getRank(1000000).name).toBe('Legend');
    });
  });

  describe('rank properties', () => {
    it('returns rank object with color', () => {
      const rank = getRank(5000);
      expect(rank.color).toBe('#3b82f6');
    });

    it('returns rank object with emoji', () => {
      const rank = getRank(5000);
      expect(rank.emoji).toBe('🃏');
    });
  });

  describe('edge cases', () => {
    it('returns Fish for negative chips', () => {
      expect(getRank(-100).name).toBe('Fish');
    });
  });
});

describe('getRankName', () => {
  it('returns rank name string', () => {
    expect(getRankName(5000)).toBe('TAG Regular');
  });
});

describe('getNextRank', () => {
  it('returns next rank for Fish', () => {
    const nextRank = getNextRank(500);
    expect(nextRank?.name).toBe('Calling Station');
    expect(nextRank?.minChips).toBe(1000);
  });

  it('returns null for Legend (max rank)', () => {
    const nextRank = getNextRank(500000);
    expect(nextRank).toBeNull();
  });

  it('returns correct next rank at boundary', () => {
    const nextRank = getNextRank(999);
    expect(nextRank?.name).toBe('Calling Station');
  });
});

describe('getRankProgress', () => {
  it('calculates progress within a tier', () => {
    const progress = getRankProgress(500);
    expect(progress.currentRank.name).toBe('Fish');
    expect(progress.nextRank?.name).toBe('Calling Station');
    expect(progress.chipsToNextRank).toBe(500);
    expect(progress.progressPercent).toBe(50);
  });

  it('shows 0% progress at tier start', () => {
    const progress = getRankProgress(0);
    expect(progress.progressPercent).toBe(0);
    expect(progress.chipsToNextRank).toBe(1000);
  });

  it('shows 100% progress for Legend', () => {
    const progress = getRankProgress(600000);
    expect(progress.currentRank.name).toBe('Legend');
    expect(progress.nextRank).toBeNull();
    expect(progress.progressPercent).toBe(100);
    expect(progress.chipsToNextRank).toBe(0);
  });

  it('calculates progress for mid-tier correctly', () => {
    // At 2500 chips: Fish tier (0-1000)
    // Progress = (2500 - 1000) / (5000 - 1000) = 1500/4000 = 37.5%
    const progress = getRankProgress(2500);
    expect(progress.currentRank.name).toBe('Calling Station');
    expect(progress.progressPercent).toBe(37);
  });
});

describe('RANKS constant', () => {
  it('has 7 ranks', () => {
    expect(RANKS.length).toBe(7);
  });

  it('ranks are in ascending order by minChips', () => {
    for (let i = 1; i < RANKS.length; i++) {
      expect(RANKS[i].minChips).toBeGreaterThan(RANKS[i - 1].minChips);
    }
  });

  it('Fish is first rank with 0 minChips', () => {
    expect(RANKS[0].name).toBe('Fish');
    expect(RANKS[0].minChips).toBe(0);
  });

  it('Legend is last rank with 500000 minChips', () => {
    expect(RANKS[RANKS.length - 1].name).toBe('Legend');
    expect(RANKS[RANKS.length - 1].minChips).toBe(500000);
  });
});
