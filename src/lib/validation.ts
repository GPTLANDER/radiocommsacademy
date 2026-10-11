import { ALPHABET_DATA } from '../data/alphabet';
import { DIGIT_DATA } from '../data/digits';
import { DecoderDirection, LearningEntry } from '../types';

// Map single symbol (uppercase) to code word
export const SYMBOL_TO_CODEWORD: Record<string, string> = {};
// Map lowercase code word to symbol (uppercase)
export const CODEWORD_TO_SYMBOL: Record<string, string> = {};
// Map lowercase code word to canonical code word (e.g. 'alfa' -> 'Alfa')
export const NORMALIZED_CODEWORDS: Record<string, string> = {};

[...ALPHABET_DATA, ...DIGIT_DATA].forEach((entry) => {
  const sym = entry.symbol.toUpperCase();
  const word = entry.codeWord;
  SYMBOL_TO_CODEWORD[sym] = word;
  CODEWORD_TO_SYMBOL[word.toLowerCase()] = sym;
  NORMALIZED_CODEWORDS[word.toLowerCase()] = word;
});

// Also support common digit variations: "9" spoken as "niner"
CODEWORD_TO_SYMBOL['niner'] = '9';
NORMALIZED_CODEWORDS['niner'] = 'Nine';

/**
 * Normalizes user input string: splits on whitespace, hyphens, dashes, commas, periods.
 */
export function tokenizeInput(raw: string): string[] {
  return raw
    .trim()
    .split(/[\s\-–—,./\\]+/)
    .filter((tok) => tok.length > 0);
}

export interface VerificationTokenResult {
  inputToken: string;
  expectedToken: string;
  isCorrect: boolean;
  explanation: string;
}

export interface VerificationResult {
  isCompleteMatch: boolean;
  accuracy: number;
  tokens: VerificationTokenResult[];
}

/**
 * Validates a decoder answer against target tokens.
 */
export function verifyDecoderAnswer(
  userInput: string,
  targetTokens: string[],
  direction: DecoderDirection
): VerificationResult {
  const inputTokens = tokenizeInput(userInput);

  const results: VerificationTokenResult[] = targetTokens.map((target, idx) => {
    const inputToken = inputTokens[idx] || '';

    if (direction === 'decode') {
      // Expecting code words (e.g., 'Kilo', 'Seven')
      const targetCanonical = target.toLowerCase();
      const inputCanonical = inputToken.toLowerCase();
      const isCorrect = inputCanonical === targetCanonical;

      return {
        inputToken,
        expectedToken: target,
        isCorrect,
        explanation: isCorrect
          ? `Correct: "${target}"`
          : inputToken
          ? `Expected "${target}", received "${inputToken}"`
          : `Missing expected code word "${target}"`,
      };
    } else {
      // Expecting symbols/digits (e.g., 'K', '7')
      const targetSym = target.toUpperCase();
      const inputSym = inputToken.toUpperCase();
      const isCorrect = inputSym === targetSym;

      return {
        inputToken,
        expectedToken: target,
        isCorrect,
        explanation: isCorrect
          ? `Correct: "${target}"`
          : inputToken
          ? `Expected "${target}", received "${inputToken}"`
          : `Missing symbol "${target}"`,
      };
    }
  });

  const correctCount = results.filter((r) => r.isCorrect).length;
  // Extra user tokens beyond expected count are penalized
  const extraTokensCount = Math.max(0, inputTokens.length - targetTokens.length);
  const totalCount = targetTokens.length + extraTokensCount;
  const isCompleteMatch = correctCount === targetTokens.length && extraTokensCount === 0;
  const accuracy = Math.round((correctCount / totalCount) * 100);

  return {
    isCompleteMatch,
    accuracy,
    tokens: results,
  };
}

/**
 * Generates a random training transmission code given character length.
 */
export function generateRandomSequence(length: number): {
  sequence: string;
  decodedTokens: string[];
} {
  const allEntries: LearningEntry[] = [...ALPHABET_DATA, ...DIGIT_DATA];
  const chosen: LearningEntry[] = [];

  for (let i = 0; i < length; i++) {
    const rand = allEntries[Math.floor(Math.random() * allEntries.length)];
    chosen.push(rand);
  }

  return {
    sequence: chosen.map((c) => c.symbol).join(''),
    decodedTokens: chosen.map((c) => c.codeWord),
  };
}
