import { useState, useEffect } from 'react';

/**
 * Hook to detect if reduced motion is requested either by OS or user setting.
 */
export function useReducedMotion(userPreference: boolean | 'system' = 'system'): boolean {
  const [systemPrefersReduced, setSystemPrefersReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handler = (e: MediaQueryListEvent) => {
      setSystemPrefersReduced(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  if (userPreference === true) return true;
  if (userPreference === false) return false;
  return systemPrefersReduced;
}
