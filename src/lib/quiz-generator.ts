import { ALPHABET_DATA } from '../data/alphabet';
import { DIGIT_DATA } from '../data/digits';
import {
  LearningEntry,
  QuizConfig,
  QuizOption,
  QuizQuestion,
  QuizQuestionType,
} from '../types';

/**
 * Modern Fisher-Yates shuffle that returns a new array.
 */
export function shuffleArray<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Returns eligible items for the specified domain and missed items filter.
 */
export function getEligibleEntries(
  config: QuizConfig,
  missedIds?: string[]
): LearningEntry[] {
  let pool: LearningEntry[] = [];

  if (config.domain === 'alphabet') {
    pool = [...ALPHABET_DATA];
  } else if (config.domain === 'digits') {
    pool = [...DIGIT_DATA];
  } else {
    // mixed
    pool = [...ALPHABET_DATA, ...DIGIT_DATA];
  }

  if (config.missedOnly && missedIds && missedIds.length > 0) {
    const missedSet = new Set(missedIds);
    const filtered = pool.filter((item) => missedSet.has(item.id));
    if (filtered.length > 0) {
      return filtered;
    }
  }

  return pool;
}

/**
 * Generates four distinct options from the pool including the correct entry.
 */
function generateFourOptions(
  correctEntry: LearningEntry,
  pool: LearningEntry[],
  valueSelector: (entry: LearningEntry) => { text: string; subtext?: string }
): QuizOption[] {
  const correctOptionValue = valueSelector(correctEntry);
  const correctOption: QuizOption = {
    id: correctEntry.id,
    text: correctOptionValue.text,
    subtext: correctOptionValue.subtext,
  };

  // Filter out the correct entry and make sure distractor texts are unique
  const availableDistractors = pool.filter(
    (e) => e.id !== correctEntry.id && valueSelector(e).text !== correctOption.text
  );

  const shuffledDistractors = shuffleArray(availableDistractors);
  // Pick up to 3 distinct distractors
  const chosenDistractors: QuizOption[] = [];
  const seenTexts = new Set<string>([correctOption.text]);

  for (const item of shuffledDistractors) {
    const val = valueSelector(item);
    if (!seenTexts.has(val.text)) {
      seenTexts.add(val.text);
      chosenDistractors.push({
        id: item.id,
        text: val.text,
        subtext: val.subtext,
      });
      if (chosenDistractors.length === 3) break;
    }
  }

  // Combine and shuffle the options
  return shuffleArray([correctOption, ...chosenDistractors]);
}

/**
 * Builds a single QuizQuestion based on the entry and question type.
 */
export function buildQuestion(
  entry: LearningEntry,
  alphabetPool: LearningEntry[],
  digitPool: LearningEntry[],
  forcedType?: QuizQuestionType
): QuizQuestion {
  let qType = forcedType;

  if (!qType) {
    if (entry.category === 'alphabet') {
      // 50% char_to_code, 50% code_to_char
      qType = Math.random() < 0.5 ? 'char_to_code' : 'code_to_char';
    } else {
      // 50% digit_to_written, 50% pronunciation_to_digit
      qType = Math.random() < 0.5 ? 'digit_to_written' : 'pronunciation_to_digit';
    }
  }

  const pool = entry.category === 'alphabet' ? alphabetPool : digitPool;

  switch (qType) {
    case 'char_to_code': {
      const options = generateFourOptions(entry, pool, (e) => ({
        text: e.codeWord,
      }));
      return {
        id: `q-${entry.id}-char-to-code-${Date.now()}-${Math.random()}`,
        type: 'char_to_code',
        prompt: `What is the NATO phonetic code word for ${entry.symbol}?`,
        contextSymbol: entry.symbol,
        options,
        correctAnswerId: entry.id,
        relatedEntryIds: [entry.id],
        explanation: `${entry.symbol} is transmitted as "${entry.codeWord}" in standard radiotelephony.`,
      };
    }

    case 'code_to_char': {
      const options = generateFourOptions(entry, pool, (e) => ({
        text: e.symbol,
      }));
      return {
        id: `q-${entry.id}-code-to-char-${Date.now()}-${Math.random()}`,
        type: 'code_to_char',
        prompt: `Which letter is represented by the code word "${entry.codeWord}"?`,
        contextSymbol: entry.codeWord,
        options,
        correctAnswerId: entry.id,
        relatedEntryIds: [entry.id],
        explanation: `"${entry.codeWord}" is the standard code word for letter ${entry.symbol}.`,
      };
    }

    case 'digit_to_written': {
      const options = generateFourOptions(entry, pool, (e) => ({
        text: e.codeWord,
      }));
      return {
        id: `q-${entry.id}-digit-written-${Date.now()}-${Math.random()}`,
        type: 'digit_to_written',
        prompt: `Which written word represents radio digit ${entry.symbol}?`,
        contextSymbol: entry.symbol,
        options,
        correctAnswerId: entry.id,
        relatedEntryIds: [entry.id],
        explanation: `Digit ${entry.symbol} is written as "${entry.codeWord}" and spoken as "${entry.pronunciationGuide}".`,
      };
    }

    case 'pronunciation_to_digit': {
      const options = generateFourOptions(entry, pool, (e) => ({
        text: e.symbol,
        subtext: e.codeWord,
      }));
      return {
        id: `q-${entry.id}-pronounce-digit-${Date.now()}-${Math.random()}`,
        type: 'pronunciation_to_digit',
        prompt: `Which digit has the radio pronunciation "${entry.pronunciationGuide}"?`,
        contextSymbol: entry.pronunciationGuide,
        options,
        correctAnswerId: entry.id,
        relatedEntryIds: [entry.id],
        explanation: `"${entry.pronunciationGuide}" is the radio phonetic pronunciation for digit ${entry.symbol} (${entry.codeWord}).`,
      };
    }
  }
}

/**
 * Generates a full quiz question session for the given config.
 */
export function generateQuiz(
  config: QuizConfig,
  missedIds?: string[]
): QuizQuestion[] {
  const eligible = getEligibleEntries(config, missedIds);
  if (eligible.length === 0) return [];

  const shuffledPool = shuffleArray(eligible);
  const targetCount = Math.min(config.questionCount, shuffledPool.length);
  const selectedEntries = shuffledPool.slice(0, targetCount);

  const alphabetPool = [...ALPHABET_DATA];
  const digitPool = [...DIGIT_DATA];

  return selectedEntries.map((entry) =>
    buildQuestion(entry, alphabetPool, digitPool)
  );
}
