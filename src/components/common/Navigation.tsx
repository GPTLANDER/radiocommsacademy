import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Hash,
  Layers,
  HelpCircle,
  Binary,
} from 'lucide-react';
import { LearningMode } from '../../types';

interface NavigationProps {
  currentMode: LearningMode;
  onSelectMode: (mode: LearningMode) => void;
  needsPracticeCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentMode,
  onSelectMode,
  needsPracticeCount,
}) => {
  const navItems = [
    {
      mode: 'dashboard' as LearningMode,
      label: 'Mission Control',
      shortLabel: 'Ops',
      icon: LayoutDashboard,
    },
    {
      mode: 'alphabet' as LearningMode,
      label: 'Alphabet A–Z',
      shortLabel: 'A–Z',
      icon: BookOpen,
    },
    {
      mode: 'digits' as LearningMode,
      label: 'Digits 0–9',
      shortLabel: '0–9',
      icon: Hash,
    },
    {
      mode: 'flashcards' as LearningMode,
      label: 'Flashcards',
      shortLabel: 'Cards',
      icon: Layers,
      badge: needsPracticeCount > 0 ? needsPracticeCount : undefined,
    },
    {
      mode: 'quiz' as LearningMode,
      label: 'Knowledge Check',
      shortLabel: 'Quiz',
      icon: HelpCircle,
    },
    {
      mode: 'decoder' as LearningMode,
      label: 'Radio Decoder',
      shortLabel: 'Decoder',
      icon: Binary,
    },
  ];

  return (
    <nav
      className="bg-radar-surface/90 border-b border-radar-border px-2 sm:px-6 sticky top-16 z-30 backdrop-blur"
      aria-label="Academy Main Navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar py-1 gap-1 sm:gap-2">
        {navItems.map((item) => {
          const isActive = currentMode === item.mode;
          const Icon = item.icon;

          return (
            <button
              key={item.mode}
              onClick={() => onSelectMode(item.mode)}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:py-2.5 rounded-md font-tactical text-xs font-semibold whitespace-nowrap transition-all min-h-[44px] ${
                isActive
                  ? 'bg-radar-surface2 text-radar-cyan border border-radar-cyan/40 shadow-hud-cyan'
                  : 'text-radar-muted hover:text-radar-text hover:bg-radar-surface2/50 border border-transparent'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? 'text-radar-cyan' : 'text-radar-dim'}`}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">{item.label}</span>
              <span className="inline sm:hidden" aria-hidden="true">{item.shortLabel}</span>

              {item.badge !== undefined && (
                <span
                  className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-radar-amber-dim text-radar-amber border border-radar-amber/40 font-mono"
                  title={`${item.badge} items marked for practice`}
                >
                  {item.badge}
                </span>
              )}

              {isActive && (
                <span
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-radar-cyan rounded-full"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
