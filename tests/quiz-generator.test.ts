import { describe, it, expect } from 'vitest';
import { generateQuiz, buildQuestion } from '../src/lib/quiz-generator';
import { ALPHABET_DATA } from '../src/data/alphabet';
import { DIGIT_DATA } from '../src/data/digits';

describe('Quiz Generator Logic', () => {
  it('generates 10 questions for a short alphabet quiz', () => {
    const questions = generateQuiz({ domain: 'alphabet', questionCount: 10 });
    expect(questions).toHaveLength(10);
  });

  it('generates 20 questions for a full alphabet quiz', () => {
    const questions = generateQuiz({ domain: 'alphabet', questionCount: 20 });
    expect(questions).toHaveLength(20);
  });

  it('caps question count to 10 when domain is digits', () => {
    // Only 10 digits exist
    const questions = generateQuiz({ domain: 'digits', questionCount: 20 });
    expect(questions).toHaveLength(10);
  });

  it('generates questions where every question has 4 unique options including the correct answer', () => {
    const questions = generateQuiz({ domain: 'mixed', questionCount: 20 });

    questions.forEach((q) => {
      // Must have at least 4 options (or all available if pool < 4)
      expect(q.options.length).toBeGreaterThanOrEqual(4);

      // Options must have unique texts
      const texts = q.options.map((o) => o.text);
      const uniqueTexts = new Set(texts);
      expect(uniqueTexts.size).toBe(q.options.length);

      // Correct answer must be among the options
      const correctOption = q.options.find((o) => o.id === q.correctAnswerId);
      expect(correctOption).toBeDefined();

      // Explanation must exist
      expect(q.explanation.length).toBeGreaterThan(0);
    });
  });

  it('builds valid char_to_code questions', () => {
    const kEntry = ALPHABET_DATA.find((e) => e.symbol === 'K')!;
    const q = buildQuestion(kEntry, [...ALPHABET_DATA], [...DIGIT_DATA], 'char_to_code');

    expect(q.type).toBe('char_to_code');
    expect(q.prompt).toContain('K');
    expect(q.correctAnswerId).toBe(kEntry.id);
    const correctOpt = q.options.find((o) => o.id === kEntry.id);
    expect(correctOpt?.text).toBe('Kilo');
  });

  it('builds valid code_to_char questions', () => {
    const bEntry = ALPHABET_DATA.find((e) => e.symbol === 'B')!;
    const q = buildQuestion(bEntry, [...ALPHABET_DATA], [...DIGIT_DATA], 'code_to_char');

    expect(q.type).toBe('code_to_char');
    expect(q.prompt).toContain('Bravo');
    expect(q.correctAnswerId).toBe(bEntry.id);
    const correctOpt = q.options.find((o) => o.id === bEntry.id);
    expect(correctOpt?.text).toBe('B');
  });

  it('builds valid pronunciation_to_digit questions', () => {
    const digit9 = DIGIT_DATA.find((e) => e.symbol === '9')!;
    const q = buildQuestion(digit9, [...ALPHABET_DATA], [...DIGIT_DATA], 'pronunciation_to_digit');

    expect(q.type).toBe('pronunciation_to_digit');
    expect(q.prompt).toContain('NIN-er');
    expect(q.correctAnswerId).toBe(digit9.id);
    const correctOpt = q.options.find((o) => o.id === digit9.id);
    expect(correctOpt?.text).toBe('9');
  });
});
