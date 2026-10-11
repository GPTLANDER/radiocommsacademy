import '@testing-library/jest-dom';

// Ensure localStorage mock is present in jsdom
if (typeof window !== 'undefined') {
  const store: Record<string, string> = {};
  const mockLocalStorage = {
    getItem: (key: string): string | null => store[key] || null,
    setItem: (key: string, val: string): void => {
      store[key] = String(val);
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      Object.keys(store).forEach((k) => delete store[k]);
    },
    key: (i: number): string | null => Object.keys(store)[i] || null,
    length: 0,
  };
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });

  // Mock matchMedia in jsdom with reduced-motion true to speed up test transitions
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
