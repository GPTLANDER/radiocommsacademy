import React, { useEffect } from 'react';
import { Award, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Achievement } from '../../types';

interface AchievementToastProps {
  achievement: Achievement | null;
  onDismiss: () => void;
  reducedMotion?: boolean;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  onDismiss,
  reducedMotion = false,
}) => {
  useEffect(() => {
    if (achievement) {
      if (!reducedMotion) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.15 },
            colors: ['#35D9FF', '#FFC857', '#35D39A'],
          });
        } catch {
          // Ignore if canvas is unsupported
        }
      }

      const timer = setTimeout(() => {
        onDismiss();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onDismiss, reducedMotion]);

  if (!achievement) return null;

  return (
    <div
      className="fixed top-20 right-4 z-50 max-w-sm w-full bg-radar-surface border-2 border-radar-amber shadow-hud-amber rounded-lg p-4 animate-in slide-in-from-top-4 duration-300"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-lg bg-radar-amber/20 text-radar-amber border border-radar-amber/40">
          <Award className="w-6 h-6 animate-pulse" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-tactical text-[10px] uppercase text-radar-amber font-bold tracking-wider">
            ACHIEVEMENT UNLOCKED
          </div>
          <div className="font-bold text-radar-text text-sm truncate mt-0.5">
            {achievement.title}
          </div>
          <div className="text-xs text-radar-muted mt-1 leading-snug">
            {achievement.description}
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-radar-dim hover:text-radar-text p-1 rounded focus-visible:ring-1 focus-visible:ring-radar-cyan"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
