import { describe, it, expect } from 'vitest';
import { ALPHABET_DATA } from '../src/data/alphabet';
import { DIGIT_DATA } from '../src/data/digits';

describe('Canonical Content Data Integrity', () => {
  it('contains exactly 26 alphabet letters', () => {
    expect(ALPHABET_DATA).toHaveLength(26);
  });

  it('contains exactly 10 radio digits', () => {
    expect(DIGIT_DATA).toHaveLength(10);
  });

  it('has unique IDs across all 36 items', () => {
    const allIds = [...ALPHABET_DATA, ...DIGIT_DATA].map((i) => i.id);
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(36);
  });

  it('has unique symbols across all 36 items', () => {
    const allSymbols = [...ALPHABET_DATA, ...DIGIT_DATA].map((i) => i.symbol);
    const uniqueSymbols = new Set(allSymbols);
    expect(uniqueSymbols.size).toBe(36);
  });

  it('strictly preserves the canonical spellings Alfa and Juliett', () => {
    const alfa = ALPHABET_DATA.find((e) => e.symbol === 'A');
    expect(alfa?.codeWord).toBe('Alfa');

    const juliett = ALPHABET_DATA.find((e) => e.symbol === 'J');
    expect(juliett?.codeWord).toBe('Juliett');
  });

  it('matches all specified radio digit written forms and pronunciation guides', () => {
    const expected = [
      { digit: '0', word: 'Zero', pron: 'ZEE-roh' },
      { digit: '1', word: 'One', pron: 'WUN' },
      { digit: '2', word: 'Two', pron: 'TOO' },
      { digit: '3', word: 'Three', pron: 'TREE' },
      { digit: '4', word: 'Four', pron: 'FOW-er' },
      { digit: '5', word: 'Five', pron: 'FIFE' },
      { digit: '6', word: 'Six', pron: 'SIKS' },
      { digit: '7', word: 'Seven', pron: 'SEV-en' },
      { digit: '8', word: 'Eight', pron: 'AYT' },
      { digit: '9', word: 'Nine', pron: 'NIN-er' },
    ];

    expected.forEach(({ digit, word, pron }) => {
      const entry = DIGIT_DATA.find((e) => e.symbol === digit);
      expect(entry).toBeDefined();
      expect(entry?.codeWord).toBe(word);
      expect(entry?.pronunciationGuide).toBe(pron);
    });
  });
});
