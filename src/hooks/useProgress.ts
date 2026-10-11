import { useState, useEffect, useCallback } from 'react';
import {
  PersistentProgress,
  SessionResult,
  LearnerSettings,
  Achievement,
} from '../types';
import {
  loadProgress,
  saveProgress,
  resetProgress,
  DEFAULT_PROGRESS,
} from '../lib/storage';
import {
  checkUnlockedAchievements,
  getTraineeRank,
  getNextRankProgress,
} from '../lib/scoring';
import { ACHIEVEMENTS } from '../data/achievements';

export function useProgress() {
  const [progress, setProgress] = useState<PersistentProgress>(() => loadProgress());
  const [latestUnlockedAchievement, setLatestUnlockedAchievement] = useState<Achievement | null>(null);

  // Sync state changes with localStorage
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const addXP = useCallback((amount: number) => {
    if (amount <= 0) return;
    setProgress((prev) => {
      const newXP = prev.totalXP + amount;
      const updated: PersistentProgress = {
        ...prev,
        totalXP: newXP,
      };
      // Check if rank or XP unlocked achievements
      const newlyUnlockedIds = checkUnlockedAchievements(updated);
      if (newlyUnlockedIds.length > 0) {
        updated.unlockedAchievementIds = [
          ...prev.unlockedAchievementIds,
          ...newlyUnlockedIds,
        ];
        const ach = ACHIEVEMENTS.find((a) => a.id === newlyUnlockedIds[0]);
        if (ach) setLatestUnlockedAchievement(ach);
      }
      return updated;
    });
  }, []);

  const markEntryLearned = useCallback((id: string) => {
    setProgress((prev) => {
      const learned = new Set(prev.learnedEntryIds);
      learned.add(id);
      const needsPractice = new Set(prev.needsPracticeEntryIds);
      needsPractice.delete(id);

      const updated: PersistentProgress = {
        ...prev,
        learnedEntryIds: Array.from(learned),
        needsPracticeEntryIds: Array.from(needsPractice),
      };

      const newlyUnlockedIds = checkUnlockedAchievements(updated);
      if (newlyUnlockedIds.length > 0) {
        updated.unlockedAchievementIds = [
          ...prev.unlockedAchievementIds,
          ...newlyUnlockedIds,
        ];
        const ach = ACHIEVEMENTS.find((a) => a.id === newlyUnlockedIds[0]);
        if (ach) setLatestUnlockedAchievement(ach);
      }

      return updated;
    });
  }, []);

  const markEntryNeedsPractice = useCallback((id: string) => {
    setProgress((prev) => {
      const needsPractice = new Set(prev.needsPracticeEntryIds);
      needsPractice.add(id);
      const learned = new Set(prev.learnedEntryIds);
      learned.delete(id);

      return {
        ...prev,
        learnedEntryIds: Array.from(learned),
        needsPracticeEntryIds: Array.from(needsPractice),
      };
    });
  }, []);

  const recordSessionCompletion = useCallback((session: SessionResult) => {
    setProgress((prev) => {
      const newXP = prev.totalXP + session.xpEarned;
      const newSessionCount = prev.completedSessionCount + 1;
      const updatedBestScores = { ...prev.bestScoresByMode };

      const currentBest = updatedBestScores[session.mode] || 0;
      if (session.accuracy > currentBest) {
        updatedBestScores[session.mode] = session.accuracy;
      }

      // Add missed items to needsPractice
      const needsPractice = new Set(prev.needsPracticeEntryIds);
      session.missedEntryIds.forEach((id) => needsPractice.add(id));

      const updated: PersistentProgress = {
        ...prev,
        totalXP: newXP,
        completedSessionCount: newSessionCount,
        needsPracticeEntryIds: Array.from(needsPractice),
        bestScoresByMode: updatedBestScores,
        recentSessionSummaries: [session, ...prev.recentSessionSummaries],
      };

      const newlyUnlockedIds = checkUnlockedAchievements(updated, session);
      if (newlyUnlockedIds.length > 0) {
        updated.unlockedAchievementIds = [
          ...prev.unlockedAchievementIds,
          ...newlyUnlockedIds,
        ];
        const ach = ACHIEVEMENTS.find((a) => a.id === newlyUnlockedIds[0]);
        if (ach) setLatestUnlockedAchievement(ach);
      }

      return updated;
    });
  }, []);

  const updateSettings = useCallback((partial: Partial<LearnerSettings>) => {
    setProgress((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...partial,
      },
    }));
  }, []);

  const resetAllProgress = useCallback(() => {
    resetProgress();
    setProgress({ ...DEFAULT_PROGRESS });
    setLatestUnlockedAchievement(null);
  }, []);

  const dismissAchievementAlert = useCallback(() => {
    setLatestUnlockedAchievement(null);
  }, []);

  // Computed metrics
  const rank = getTraineeRank(progress.totalXP);
  const nextRankProgress = getNextRankProgress(progress.totalXP);
  const alphabetLearnedCount = progress.learnedEntryIds.filter((id) =>
    id.startsWith('alpha-')
  ).length;
  const digitsLearnedCount = progress.learnedEntryIds.filter((id) =>
    id.startsWith('digit-')
  ).length;
  const totalLearnedCount = alphabetLearnedCount + digitsLearnedCount;
  const overallCompletionPercent = Math.round((totalLearnedCount / 36) * 100);

  return {
    progress,
    rank,
    nextRankProgress,
    alphabetLearnedCount,
    digitsLearnedCount,
    totalLearnedCount,
    overallCompletionPercent,
    latestUnlockedAchievement,
    addXP,
    markEntryLearned,
    markEntryNeedsPractice,
    recordSessionCompletion,
    updateSettings,
    resetAllProgress,
    dismissAchievementAlert,
  };
}
