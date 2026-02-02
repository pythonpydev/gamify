import { describe, it, expect } from 'vitest';
import { getRank, getRankName, getNextRank, getRankProgress, RANKS } from '@/lib/utils/rank';

describe('getRank', () => {
  describe('returns correct rank for chip thresholds', () => {
    it('returns Fish for 0 chips', () => {
      expect(getRank(0).name).toBe('Fish');
    });

    it('returns Fish for 499 chips', () => {
      expect(getRank(499).name).toBe('Fish');
    });

    it('returns Calling Station for 500 chips', () => {
      expect(getRank(500).name).toBe('Calling Station');
    });

    it('returns Calling Station for 999 chips', () => {
      expect(getRank(999).name).toBe('Calling Station');
    });

    it('returns ABC for 1000 chips', () => {
      expect(getRank(1000).name).toBe('ABC');
    });

    it('returns TAG Regular for 2000 chips', () => {
      expect(getRank(2000).name).toBe('TAG Regular');
    });

    it('returns Semi Pro for 5000 chips', () => {
      expect(getRank(5000).name).toBe('Semi Pro');
    });

    it('returns Grinder for 10000 chips', () => {
      expect(getRank(10000).name).toBe('Grinder');
    });

    it('returns Shark for 20000 chips', () => {
      expect(getRank(20000).name).toBe('Shark');
    });

    it('returns Pro for 50000 chips', () => {
      expect(getRank(50000).name).toBe('Pro');
    });

    it('returns High Roller for 100000 chips', () => {
      expect(getRank(100000).name).toBe('High Roller');
    });

    it('returns Champion for 250000 chips', () => {
      expect(getRank(250000).name).toBe('Champion');
    });

    it('returns Legend for 500000 chips', () => {
      expect(getRank(500000).name).toBe('Legend');
    });

    it('returns GOAT for 1000000 chips', () => {
      expect(getRank(1000000).name).toBe('GOAT');
    });

    it('returns GOAT for chips beyond 1000000', () => {
      expect(getRank(2000000).name).toBe('GOAT');
    });
  });

  describe('rank properties', () => {
    it('returns rank object with color', () => {
      const rank = getRank(2000);
      expect(rank.color).toBe('#a855f7');
    });

    it('returns rank object with emoji', () => {
      const rank = getRank(2000);
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
    expect(getRankName(2000)).toBe('TAG Regular');
  });
});

describe('getNextRank', () => {
  it('returns next rank for Fish', () => {
    const nextRank = getNextRank(100);
    expect(nextRank?.name).toBe('Calling Station');
    expect(nextRank?.minChips).toBe(500);
  });

  it('returns null for GOAT (max rank)', () => {
    const nextRank = getNextRank(1000000);
    expect(nextRank).toBeNull();
  });

  it('returns correct next rank at boundary', () => {
    const nextRank = getNextRank(499);
    expect(nextRank?.name).toBe('Calling Station');
  });
});

describe('getRankProgress', () => {
  it('calculates progress within a tier', () => {
    const progress = getRankProgress(250);
    expect(progress.currentRank.name).toBe('Fish');
    expect(progress.nextRank?.name).toBe('Calling Station');
    expect(progress.chipsToNextRank).toBe(250);
    expect(progress.progressPercent).toBe(50);
  });

  it('shows 0% progress at tier start', () => {
    const progress = getRankProgress(0);
    expect(progress.progressPercent).toBe(0);
    expect(progress.chipsToNextRank).toBe(500);
  });

  it('shows 100% progress for GOAT', () => {
    const progress = getRankProgress(1500000);
    expect(progress.currentRank.name).toBe('GOAT');
    expect(progress.nextRank).toBeNull();
    expect(progress.progressPercent).toBe(100);
    expect(progress.chipsToNextRank).toBe(0);
  });

  it('calculates progress for mid-tier correctly', () => {
    // At 750 chips: Calling Station tier (500-1000)
    // Progress = (750 - 500) / (1000 - 500) = 250/500 = 50%
    const progress = getRankProgress(750);
    expect(progress.currentRank.name).toBe('Calling Station');
    expect(progress.progressPercent).toBe(50);
  });
});

describe('RANKS constant', () => {
  it('has 12 ranks', () => {
    expect(RANKS.length).toBe(12);
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

  it('GOAT is last rank with 1000000 minChips', () => {
    expect(RANKS[RANKS.length - 1].name).toBe('GOAT');
    expect(RANKS[RANKS.length - 1].minChips).toBe(1000000);
  });
});
