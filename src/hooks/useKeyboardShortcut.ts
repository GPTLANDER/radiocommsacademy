import { useEffect } from 'react';

/**
 * Hook for registering hotkeys (e.g. 1-4 for quiz options, Space for flip/next, Esc for back)
 */
export function useKeyboardShortcut(
  keyMap: Record<string, () => void>,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if focus is in an input or textarea
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const action = keyMap[key] || keyMap[e.key];

      if (action) {
        e.preventDefault();
        action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyMap, enabled]);
}
