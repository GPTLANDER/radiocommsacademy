import { PersistentProgress, LearnerSettings } from '../types';

export const STORAGE_KEY = 'radio-comms-academy:progress:v1';
export const CURRENT_SCHEMA_VERSION = 1;

export const DEFAULT_SETTINGS: LearnerSettings = {
  reducedMotion: 'system',
  soundVisualOnly: true,
  displayDensity: 'comfortable',
};

export const DEFAULT_PROGRESS: PersistentProgress = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  totalXP: 0,
  completedSessionCount: 0,
  learnedEntryIds: [],
  needsPracticeEntryIds: [],
  bestScoresByMode: {},
  unlockedAchievementIds: [],
  recentSessionSummaries: [],
  settings: DEFAULT_SETTINGS,
};

/**
 * Validates whether an unknown object roughly conforms to PersistentProgress.
 */
export function isValidProgress(data: unknown): data is PersistentProgress {
  if (!data || typeof data !== 'object') return false;
  const p = data as Record<string, unknown>;

  if (typeof p.schemaVersion !== 'number') return false;
  if (typeof p.totalXP !== 'number' || isNaN(p.totalXP) || p.totalXP < 0) return false;
  if (typeof p.completedSessionCount !== 'number' || isNaN(p.completedSessionCount)) return false;
  if (!Array.isArray(p.learnedEntryIds)) return false;
  if (!Array.isArray(p.needsPracticeEntryIds)) return false;
  if (!Array.isArray(p.unlockedAchievementIds)) return false;
  if (!Array.isArray(p.recentSessionSummaries)) return false;
  if (typeof p.bestScoresByMode !== 'object' || p.bestScoresByMode === null) return false;
  if (typeof p.settings !== 'object' || p.settings === null) return false;

  return true;
}

/**
 * Loads and validates persisted progress from localStorage with safe fallback.
 */
export function loadProgress(): PersistentProgress {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { ...DEFAULT_PROGRESS };
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_PROGRESS };
    }

    const parsed = JSON.parse(raw);
    if (isValidProgress(parsed) && parsed.schemaVersion === CURRENT_SCHEMA_VERSION) {
      return parsed;
    }

    // Attempt migration or safe fallback if version mismatch or structure invalid
    return {
      ...DEFAULT_PROGRESS,
      totalXP: typeof parsed?.totalXP === 'number' ? Math.max(0, parsed.totalXP) : 0,
      learnedEntryIds: Array.isArray(parsed?.learnedEntryIds) ? parsed.learnedEntryIds : [],
      needsPracticeEntryIds: Array.isArray(parsed?.needsPracticeEntryIds) ? parsed.needsPracticeEntryIds : [],
      unlockedAchievementIds: Array.isArray(parsed?.unlockedAchievementIds) ? parsed.unlockedAchievementIds : [],
    };
  } catch (error) {
    // Malformed JSON or localStorage access restricted
    console.warn('Failed to read stored progress, falling back to defaults:', error);
    return { ...DEFAULT_PROGRESS };
  }
}

/**
 * Persists progress safely to localStorage.
 */
export function saveProgress(progress: PersistentProgress): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const cleanProgress: PersistentProgress = {
      ...progress,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      // Cap stored recent summaries to last 20 to preserve storage space
      recentSessionSummaries: progress.recentSessionSummaries.slice(0, 20),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanProgress));
    return true;
  } catch (error) {
    console.error('Failed to save progress to localStorage:', error);
    return false;
  }
}

/**
 * Clears saved application progress from localStorage.
 */
export function resetProgress(): boolean {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to clear stored progress:', error);
    return false;
  }
}
