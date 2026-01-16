/**
 * Chip Calculation Utility
 *
 * Formula:
 *   baseChips = floor((durationMins / 25) * 100)
 *   qualityBonus = qualityRating * 20
 *   totalChips = baseChips + qualityBonus
 *
 * Edge cases:
 *   - Sessions < 5 minutes earn 0 chips (per FR-015)
 *   - Abandoned sessions earn 0 chips regardless of time
 *
 * Examples:
 *   - 15 min, 3 stars: floor((15/25)*100) + 3*20 = 60 + 60 = 120 chips
 *   - 25 min, 5 stars: floor((25/25)*100) + 5*20 = 100 + 100 = 200 chips
 *   - 50 min, 3 stars: floor((50/25)*100) + 3*20 = 200 + 60 = 260 chips
 */

export interface ChipCalculationResult {
  baseChips: number;
  qualityBonus: number;
  totalChips: number;
}

/**
 * Calculate chips earned for a completed session
 *
 * @param durationMins - Actual duration of the session in minutes
 * @param qualityRating - User's self-rated quality (1-5)
 * @returns Chip breakdown with base, bonus, and total
 */
export function calculateChips(
  durationMins: number,
  qualityRating: number
): ChipCalculationResult {
  // Validate inputs
  if (durationMins < 0) {
    throw new Error('Duration cannot be negative');
  }
  if (qualityRating < 1 || qualityRating > 5) {
    throw new Error('Quality rating must be between 1 and 5');
  }

  // Sessions under 5 minutes earn no chips
  if (durationMins < 5) {
    return {
      baseChips: 0,
      qualityBonus: 0,
      totalChips: 0,
    };
  }

  // Calculate base chips: floor((duration / 25) * 100)
  const baseChips = Math.floor((durationMins / 25) * 100);

  // Calculate quality bonus: rating * 20
  const qualityBonus = qualityRating * 20;

  return {
    baseChips,
    qualityBonus,
    totalChips: baseChips + qualityBonus,
  };
}

/**
 * Get the maximum chips possible for a session type
 *
 * @param sessionType - The session type
 * @returns Maximum chips with 5-star rating
 */
export function getMaxChipsForSession(
  sessionType: 'QUICK_HAND' | 'STANDARD' | 'DEEP_STACK'
): number {
  const durations = {
    QUICK_HAND: 15,
    STANDARD: 25,
    DEEP_STACK: 50,
  };

  const result = calculateChips(durations[sessionType], 5);
  return result.totalChips;
}
