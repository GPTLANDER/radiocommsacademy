import { TRAINEE_RANKS, ACHIEVEMENTS } from '../data/achievements';
import { TraineeRank, PersistentProgress, SessionResult } from '../types';

export const XP_FIRST_ATTEMPT = 10;
export const XP_RETRY_ATTEMPT = 5;
export const BONUS_XP_FLASHCARD_SESSION = 10;
export const BONUS_XP_MISSION_COMPLETION = 20;

/**
 * Calculates accuracy percentage safely (returns 0 for 0 questions, avoids NaN or divide by zero).
 */
export function calculateAccuracy(correctCount: number, totalQuestions: number): number {
  if (totalQuestions <= 0) return 0;
  const ratio = (correctCount / totalQuestions) * 100;
  return Math.min(100, Math.max(0, Math.round(ratio)));
}

/**
 * Returns the trainee rank corresponding to current total XP.
 */
export function getTraineeRank(xp: number): TraineeRank {
  const safeXp = Math.max(0, xp);
  // Sort descending to find highest matched threshold
  const sorted = [...TRAINEE_RANKS].sort((a, b) => b.minXp - a.minXp);
  const matched = sorted.find((r) => safeXp >= r.minXp);
  return matched || TRAINEE_RANKS[0];
}

/**
 * Gets progress towards next rank.
 */
export function getNextRankProgress(xp: number): {
  currentRank: TraineeRank;
  nextRank: TraineeRank | null;
  progressPercent: number;
  xpNeeded: number;
} {
  const currentRank = getTraineeRank(xp);
  const sortedAsc = [...TRAINEE_RANKS].sort((a, b) => a.minXp - b.minXp);
  const currentIndex = sortedAsc.findIndex((r) => r.id === currentRank.id);
  const nextRank = currentIndex < sortedAsc.length - 1 ? sortedAsc[currentIndex + 1] : null;

  if (!nextRank) {
    return {
      currentRank,
      nextRank: null,
      progressPercent: 100,
      xpNeeded: 0,
    };
  }

  const range = nextRank.minXp - currentRank.minXp;
  const inRangeXp = Math.max(0, xp - currentRank.minXp);
  const percent = Math.min(100, Math.max(0, Math.round((inRangeXp / range) * 100)));
  const xpNeeded = Math.max(0, nextRank.minXp - xp);

  return {
    currentRank,
    nextRank,
    progressPercent: percent,
    xpNeeded,
  };
}

/**
 * Evaluates which achievements are unlocked based on current progress and newest session.
 */
export function checkUnlockedAchievements(
  currentProgress: PersistentProgress,
  latestSession?: SessionResult
): string[] {
  const newlyUnlocked: string[] = [];
  const currentUnlocked = new Set(currentProgress.unlockedAchievementIds);

  ACHIEVEMENTS.forEach((ach) => {
    if (currentUnlocked.has(ach.id)) return;

    let conditionMet = false;

    switch (ach.id) {
      case 'first_transmission':
        // complete first quiz
        conditionMet =
          latestSession?.mode === 'quiz' ||
          currentProgress.recentSessionSummaries.some((s) => s.mode === 'quiz');
        break;

      case 'alphabet_explorer':
        // learned all 26 alphabet letters
        conditionMet = currentProgress.learnedEntryIds.filter((id) =>
          id.startsWith('alpha-')
        ).length >= 26;
        break;

      case 'digit_decoder':
        // learned all 10 digits
        conditionMet = currentProgress.learnedEntryIds.filter((id) =>
          id.startsWith('digit-')
        ).length >= 10;
        break;

      case 'perfect_mission':
        // 100% on a mission or quiz with at least 5 questions
        conditionMet =
          (latestSession &&
            latestSession.totalQuestions >= 3 &&
            latestSession.accuracy === 100) ||
          currentProgress.recentSessionSummaries.some(
            (s) => s.totalQuestions >= 3 && s.accuracy === 100
          );
        break;

      case 'consistent_operator':
        // 3 completed practice sessions
        conditionMet = currentProgress.completedSessionCount >= 3;
        break;

      default:
        break;
    }

    if (conditionMet) {
      newlyUnlocked.push(ach.id);
    }
  });

  return newlyUnlocked;
}
