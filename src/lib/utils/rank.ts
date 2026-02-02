/**
 * Rank Calculation Utility
 *
 * Poker-themed ranks based on total chips earned.
 * Ranks are determined by lifetime earnings (totalChipsEarned),
 * not current chip balance.
 */

export interface Rank {
  name: string;
  minChips: number;
  color: string;
  emoji: string;
}

export const RANKS: readonly Rank[] = [
  { name: 'Fish', minChips: 0, color: '#06b6d4', emoji: '🐟' },
  { name: 'Calling Station', minChips: 500, color: '#ec4899', emoji: '📞' },
  { name: 'ABC', minChips: 1000, color: '#fde047', emoji: '🎯' },
  { name: 'TAG Regular', minChips: 2000, color: '#a855f7', emoji: '🃏' },
  { name: 'Semi Pro', minChips: 5000, color: '#f97316', emoji: '🎰' },
  { name: 'Grinder', minChips: 10000, color: '#22c55e', emoji: '⚙️' },
  { name: 'Shark', minChips: 20000, color: '#3b82f6', emoji: '🦈' },
  { name: 'Pro', minChips: 50000, color: '#64748b', emoji: '💎' },
  { name: 'High Roller', minChips: 100000, color: '#ef4444', emoji: '🎲' },
  { name: 'Champion', minChips: 250000, color: '#ffffff', emoji: '🏆' },
  { name: 'Legend', minChips: 500000, color: '#84cc16', emoji: '👑' },
  { name: 'GOAT', minChips: 1000000, color: '#fbbf24', emoji: '🐐' },
] as const;

/**
 * Get the rank for a given total chips amount
 *
 * @param totalChipsEarned - Total lifetime chips earned
 * @returns The rank object for the user
 */
export function getRank(totalChipsEarned: number): Rank {
  // Validate input
  if (totalChipsEarned < 0) {
    return RANKS[0]; // Return Fish for invalid input
  }

  // Find the highest rank the user qualifies for
  // Iterate in reverse to find the first rank where chips >= minChips
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (totalChipsEarned >= RANKS[i].minChips) {
      return RANKS[i];
    }
  }

  return RANKS[0]; // Default to Fish
}

/**
 * Get the rank name for a given total chips amount
 *
 * @param totalChipsEarned - Total lifetime chips earned
 * @returns The rank name string
 */
export function getRankName(totalChipsEarned: number): string {
  return getRank(totalChipsEarned).name;
}

/**
 * Get the next rank the user needs to achieve
 *
 * @param totalChipsEarned - Total lifetime chips earned
 * @returns The next rank or null if at max rank
 */
export function getNextRank(totalChipsEarned: number): Rank | null {
  const currentRank = getRank(totalChipsEarned);
  const currentIndex = RANKS.findIndex(r => r.name === currentRank.name);

  if (currentIndex < RANKS.length - 1) {
    return RANKS[currentIndex + 1];
  }

  return null; // Already at GOAT
}

/**
 * Get progress percentage towards the next rank
 *
 * @param totalChipsEarned - Total lifetime chips earned
 * @returns Progress percentage (0-100)
 */
export function getProgressToNextRank(totalChipsEarned: number): number {
  const currentRank = getRank(totalChipsEarned);
  const nextRank = getNextRank(totalChipsEarned);

  if (!nextRank) {
    return 100; // Already at max rank
  }

  const chipsInCurrentTier = totalChipsEarned - currentRank.minChips;
  const tierRange = nextRank.minChips - currentRank.minChips;
  const progressPercent = (chipsInCurrentTier / tierRange) * 100;

  return Math.min(Math.max(progressPercent, 0), 100);
}

/**
 * Get progress towards the next rank
 *
 * @param totalChipsEarned - Total lifetime chips earned
 * @returns Progress object with current, next rank, and percentage
 */
export function getRankProgress(totalChipsEarned: number): {
  currentRank: Rank;
  nextRank: Rank | null;
  chipsToNextRank: number;
  progressPercent: number;
} {
  const currentRank = getRank(totalChipsEarned);
  const nextRank = getNextRank(totalChipsEarned);

  if (!nextRank) {
    return {
      currentRank,
      nextRank: null,
      chipsToNextRank: 0,
      progressPercent: 100,
    };
  }

  const chipsInCurrentTier = totalChipsEarned - currentRank.minChips;
  const tierRange = nextRank.minChips - currentRank.minChips;
  const progressPercent = Math.floor((chipsInCurrentTier / tierRange) * 100);

  return {
    currentRank,
    nextRank,
    chipsToNextRank: nextRank.minChips - totalChipsEarned,
    progressPercent: Math.min(progressPercent, 100),
  };
}
