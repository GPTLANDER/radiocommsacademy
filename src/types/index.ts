export type LearningCategory = 'alphabet' | 'digit';

export interface LearningEntry {
  id: string;
  category: LearningCategory;
  symbol: string;
  displayName: string;
  codeWord: string;
  pronunciationGuide: string;
  sortOrder: number;
  tip?: string;
}

export type QuizQuestionType =
  | 'char_to_code'
  | 'code_to_char'
  | 'digit_to_written'
  | 'pronunciation_to_digit';

export interface QuizOption {
  id: string;
  text: string;
  subtext?: string;
}

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  contextSymbol?: string;
  options: QuizOption[];
  correctAnswerId: string;
  relatedEntryIds: string[];
  explanation: string;
}

export type QuizDomain = 'alphabet' | 'digits' | 'mixed';

export interface QuizConfig {
  domain: QuizDomain;
  questionCount: 10 | 20;
  missedOnly?: boolean;
}

export type LearningMode =
  | 'dashboard'
  | 'alphabet'
  | 'digits'
  | 'flashcards'
  | 'quiz'
  | 'decoder'
  | 'settings';

export type SessionMode =
  | 'alphabet_learn'
  | 'digits_learn'
  | 'flashcards'
  | 'quiz'
  | 'decoder';

export interface SessionResult {
  sessionId: string;
  mode: SessionMode;
  startedAt: number;
  completedAt: number;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  xpEarned: number;
  missedEntryIds: string[];
}

export interface LearnerSettings {
  reducedMotion: boolean | 'system';
  soundVisualOnly: boolean;
  displayDensity: 'comfortable' | 'compact';
}

export interface PersistentProgress {
  schemaVersion: number;
  totalXP: number;
  completedSessionCount: number;
  learnedEntryIds: string[];
  needsPracticeEntryIds: string[];
  bestScoresByMode: Record<string, number>;
  unlockedAchievementIds: string[];
  recentSessionSummaries: SessionResult[];
  settings: LearnerSettings;
}

export interface TraineeRank {
  id: string;
  title: string;
  minXp: number;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export type DecoderDirection = 'decode' | 'encode';

export interface DecoderMission {
  id: string;
  level: number;
  title: string;
  sequence: string; // e.g. "K7M2" or "BRAVO 4 NINER"
  direction: DecoderDirection;
  hint: string;
  targetTokens: string[]; // ['Kilo', 'Seven', 'Mike', 'Two'] or ['B', '4', '9']
  contextCallsign?: string;
}
