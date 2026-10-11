import { describe, it, expect } from 'vitest';
import {
  calculateAccuracy,
  getTraineeRank,
  getNextRankProgress,
  checkUnlockedAchievements,
  XP_FIRST_ATTEMPT,
  XP_RETRY_ATTEMPT,
  BONUS_XP_FLASHCARD_SESSION,
  BONUS_XP_MISSION_COMPLETION,
} from '../src/lib/scoring';
import { DEFAULT_PROGRESS } from '../src/lib/storage';

describe('Scoring & Gamification Logic', () => {
  describe('calculateAccuracy', () => {
    it('returns 0 safely when total questions is 0', () => {
      expect(calculateAccuracy(0, 0)).toBe(0);
      expect(calculateAccuracy(5, 0)).toBe(0);
    });

    it('returns 100 for all correct', () => {
      expect(calculateAccuracy(10, 10)).toBe(100);
    });

    it('returns rounded percentage for intermediate scores', () => {
      expect(calculateAccuracy(7, 10)).toBe(70);
      expect(calculateAccuracy(1, 3)).toBe(33);
      expect(calculateAccuracy(2, 3)).toBe(67);
    });
  });

  describe('Trainee Ranks', () => {
    it('determines Recruit for 0 XP', () => {
      expect(getTraineeRank(0).id).toBe('recruit');
      expect(getTraineeRank(50).id).toBe('recruit');
    });

    it('determines Cadet for 100 XP', () => {
      expect(getTraineeRank(100).id).toBe('cadet');
      expect(getTraineeRank(249).id).toBe('cadet');
    });

    it('determines Operator for 250 XP', () => {
      expect(getTraineeRank(250).id).toBe('operator');
    });

    it('determines Specialist for 500 XP', () => {
      expect(getTraineeRank(500).id).toBe('specialist');
    });

    it('determines Commander for 1000+ XP', () => {
      expect(getTraineeRank(1000).id).toBe('commander');
      expect(getTraineeRank(5000).id).toBe('commander');
    });

    it('calculates next rank progress percentage accurately', () => {
      const progress = getNextRankProgress(50); // Recruit (0-100)
      expect(progress.currentRank.id).toBe('recruit');
      expect(progress.nextRank?.id).toBe('cadet');
      expect(progress.progressPercent).toBe(50);
      expect(progress.xpNeeded).toBe(50);
    });
  });

  describe('Achievements', () => {
    it('unlocks first_transmission after a quiz', () => {
      const unlocked = checkUnlockedAchievements(DEFAULT_PROGRESS, {
        sessionId: 'test-1',
        mode: 'quiz',
        startedAt: 1000,
        completedAt: 2000,
        totalQuestions: 10,
        correctCount: 8,
        accuracy: 80,
        xpEarned: 80,
        missedEntryIds: [],
      });

      expect(unlocked).toContain('first_transmission');
    });

    it('unlocks perfect_mission when 100% accuracy achieved with at least 3 questions', () => {
      const unlocked = checkUnlockedAchievements(DEFAULT_PROGRESS, {
        sessionId: 'test-perf',
        mode: 'decoder',
        startedAt: 1000,
        completedAt: 2000,
        totalQuestions: 4,
        correctCount: 4,
        accuracy: 100,
        xpEarned: 60,
        missedEntryIds: [],
      });

      expect(unlocked).toContain('perfect_mission');
    });

    it('unlocks consistent_operator after 3 completed sessions', () => {
      const progress = {
        ...DEFAULT_PROGRESS,
        completedSessionCount: 3,
      };
      const unlocked = checkUnlockedAchievements(progress);
      expect(unlocked).toContain('consistent_operator');
    });
  });

  describe('XP Constants', () => {
    it('matches PRD specifications', () => {
      expect(XP_FIRST_ATTEMPT).toBe(10);
      expect(XP_RETRY_ATTEMPT).toBe(5);
      expect(BONUS_XP_FLASHCARD_SESSION).toBe(10);
      expect(BONUS_XP_MISSION_COMPLETION).toBe(20);
    });
  });
});
