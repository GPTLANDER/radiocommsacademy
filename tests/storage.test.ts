import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadProgress,
  saveProgress,
  resetProgress,
  STORAGE_KEY,
  DEFAULT_PROGRESS,
  CURRENT_SCHEMA_VERSION,
} from '../src/lib/storage';
import { PersistentProgress } from '../src/types';

describe('Storage Persistence Module', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('loads default progress when localStorage is empty', () => {
    const progress = loadProgress();
    expect(progress.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(progress.totalXP).toBe(0);
    expect(progress.learnedEntryIds).toEqual([]);
  });

  it('saves and reloads valid progress', () => {
    const updated: PersistentProgress = {
      ...DEFAULT_PROGRESS,
      totalXP: 350,
      completedSessionCount: 4,
      learnedEntryIds: ['alpha-a', 'alpha-b'],
      unlockedAchievementIds: ['first_transmission'],
    };

    const saved = saveProgress(updated);
    expect(saved).toBe(true);

    const reloaded = loadProgress();
    expect(reloaded.totalXP).toBe(350);
    expect(reloaded.completedSessionCount).toBe(4);
    expect(reloaded.learnedEntryIds).toEqual(['alpha-a', 'alpha-b']);
    expect(reloaded.unlockedAchievementIds).toEqual(['first_transmission']);
  });

  it('recovers gracefully from malformed JSON without crashing', () => {
    window.localStorage.setItem(STORAGE_KEY, '{invalid-json-data');
    const progress = loadProgress();
    expect(progress).toBeDefined();
    expect(progress.totalXP).toBe(0);
  });

  it('recovers safely from invalid types in stored data', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 'not-a-number',
        totalXP: 'million',
      })
    );
    const progress = loadProgress();
    expect(progress).toBeDefined();
    expect(progress.totalXP).toBe(0);
  });

  it('clears progress when resetProgress is invoked', () => {
    saveProgress({
      ...DEFAULT_PROGRESS,
      totalXP: 500,
    });
    expect(loadProgress().totalXP).toBe(500);

    const resetSuccess = resetProgress();
    expect(resetSuccess).toBe(true);

    const fresh = loadProgress();
    expect(fresh.totalXP).toBe(0);
  });
});
