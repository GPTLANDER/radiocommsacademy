import { describe, it, expect } from 'vitest';
import {
  tokenizeInput,
  verifyDecoderAnswer,
  generateRandomSequence,
  isFlashcardAnswerCorrect,
} from '../src/lib/validation';

describe('Decoder Input Validation & Verification', () => {
  it('tokenizes multi-spaced, hyphens, and punctuation correctly', () => {
    expect(tokenizeInput('  Kilo - Seven , Mike   Two ')).toEqual([
      'Kilo',
      'Seven',
      'Mike',
      'Two',
    ]);
    expect(tokenizeInput('A-1-B-2')).toEqual(['A', '1', 'B', '2']);
  });

  it('verifies correct decode direction case-insensitively', () => {
    const targetTokens = ['Kilo', 'Seven', 'Mike', 'Two'];
    const result = verifyDecoderAnswer('kilo seven mike two', targetTokens, 'decode');

    expect(result.isCompleteMatch).toBe(true);
    expect(result.accuracy).toBe(100);
    expect(result.tokens).toHaveLength(4);
    result.tokens.forEach((t) => expect(t.isCorrect).toBe(true));
  });

  it('detects mismatched tokens in decode direction', () => {
    const targetTokens = ['Kilo', 'Seven', 'Mike', 'Two'];
    const result = verifyDecoderAnswer('kilo six mike two', targetTokens, 'decode');

    expect(result.isCompleteMatch).toBe(false);
    expect(result.tokens[1].isCorrect).toBe(false);
    expect(result.tokens[1].inputToken).toBe('six');
    expect(result.tokens[1].expectedToken).toBe('Seven');
  });

  it('verifies encode direction case-insensitively', () => {
    const targetTokens = ['K', '7', 'M', '2'];
    const result = verifyDecoderAnswer('k 7 m 2', targetTokens, 'encode');

    expect(result.isCompleteMatch).toBe(true);
    expect(result.accuracy).toBe(100);
    result.tokens.forEach((t) => expect(t.isCorrect).toBe(true));
  });

  it('penalizes extra input tokens', () => {
    const targetTokens = ['K', '7'];
    const result = verifyDecoderAnswer('K 7 X 9', targetTokens, 'encode');

    expect(result.isCompleteMatch).toBe(false);
    expect(result.accuracy).toBeLessThan(100);
  });

  it('generates random training sequences of requested length', () => {
    const seq3 = generateRandomSequence(3);
    expect(seq3.sequence).toHaveLength(3);
    expect(seq3.decodedTokens).toHaveLength(3);

    const seq5 = generateRandomSequence(5);
    expect(seq5.sequence).toHaveLength(5);
    expect(seq5.decodedTokens).toHaveLength(5);
  });

  describe('isFlashcardAnswerCorrect', () => {
    const entryA = {
      id: 'alpha-a',
      category: 'alphabet' as const,
      symbol: 'A',
      displayName: 'A',
      codeWord: 'Alfa',
      pronunciationGuide: 'AL-fah',
      sortOrder: 1,
    };

    const entry3 = {
      id: 'digit-3',
      category: 'digit' as const,
      symbol: '3',
      displayName: '3',
      codeWord: 'Three',
      pronunciationGuide: 'TREE',
      sortOrder: 4,
    };

    it('matches alphabet code words case-insensitively with whitespace handling', () => {
      expect(isFlashcardAnswerCorrect('alfa', entryA)).toBe(true);
      expect(isFlashcardAnswerCorrect('ALFA', entryA)).toBe(true);
      expect(isFlashcardAnswerCorrect('  Alfa  ', entryA)).toBe(true);
      expect(isFlashcardAnswerCorrect('alpha', entryA)).toBe(true); // phonetic variant
      expect(isFlashcardAnswerCorrect('bravo', entryA)).toBe(false);
      expect(isFlashcardAnswerCorrect('', entryA)).toBe(false);
    });

    it('matches digit answers across written forms, pronunciation guides, and numerals', () => {
      expect(isFlashcardAnswerCorrect('three', entry3)).toBe(true);
      expect(isFlashcardAnswerCorrect('THREE', entry3)).toBe(true);
      expect(isFlashcardAnswerCorrect('tree', entry3)).toBe(true); // radio pronunciation
      expect(isFlashcardAnswerCorrect('TREE', entry3)).toBe(true);
      expect(isFlashcardAnswerCorrect('3', entry3)).toBe(true);
      expect(isFlashcardAnswerCorrect('four', entry3)).toBe(false);
    });
  });
});

