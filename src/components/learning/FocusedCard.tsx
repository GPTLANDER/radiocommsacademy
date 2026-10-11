import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { LearningEntry } from '../../types';

interface FocusedCardProps {
  entry: LearningEntry;
  currentIndex: number;
  totalCount: number;
  isLearned: boolean;
  needsPractice: boolean;
  onPrev: () => void;
  onNext: () => void;
  onMarkLearned: () => void;
  onMarkNeedsPractice: () => void;
}

export const FocusedCard: React.FC<FocusedCardProps> = ({
  entry,
  currentIndex,
  totalCount,
  isLearned,
  needsPractice,
  onPrev,
  onNext,
  onMarkLearned,
  onMarkNeedsPractice,
}) => {
  return (
    <div className="hud-panel p-6 sm:p-8 bg-radar-surface border-2 border-radar-border shadow-xl">
      {/* Header bar with index counter */}
      <div className="flex items-center justify-between pb-4 border-b border-radar-border text-xs font-tactical">
        <div className="flex items-center gap-2">
          <span className="text-radar-cyan uppercase font-bold">
            {entry.category === 'alphabet' ? 'NATO LETTER SPEC' : 'RADIO DIGIT SPEC'}
          </span>
          <span className="text-radar-dim">|</span>
          <span className="text-radar-muted font-mono">
            ITEM {currentIndex + 1} OF {totalCount}
          </span>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          {isLearned ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-radar-success-dim text-radar-success border border-radar-success/40">
              <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
              UNDERSTOOD
            </span>
          ) : needsPractice ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-radar-amber-dim text-radar-amber border border-radar-amber/40">
              <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
              PRACTICE QUEUED
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs text-radar-dim bg-radar-surface2 border border-radar-border">
              UNREVIEWED
            </span>
          )}
        </div>
      </div>

      {/* Main card body */}
      <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Giant tactile character emblem */}
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-radar-surface2/80 border-2 border-radar-cyan/50 flex flex-col items-center justify-center shadow-hud-cyan relative group">
          <span className="text-6xl sm:text-7xl font-extrabold font-mono text-radar-cyan tracking-wider">
            {entry.symbol}
          </span>
          <span className="absolute bottom-2 text-[10px] font-tactical text-radar-muted uppercase">
            CALL IDENTIFIER
          </span>
        </div>

        {/* Tactical pronunciation details */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div>
            <span className="text-xs font-tactical text-radar-muted uppercase tracking-wider block">
              CANONICAL CODE WORD
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-radar-text font-tactical tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-radar-text via-radar-cyan to-radar-text">
              {entry.codeWord}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-radar-surface2 border border-radar-border font-tactical text-xs text-radar-amber">
              <Volume2 className="w-4 h-4 text-radar-amber" aria-hidden="true" />
              <span className="text-radar-muted">PRONUNCIATION:</span>
              <strong className="tracking-wider">{entry.pronunciationGuide}</strong>
            </span>
          </div>

          {entry.tip && (
            <div className="p-3 rounded-lg bg-radar-surface2/50 border border-radar-border/80 text-xs text-radar-muted flex items-start gap-2 mt-2">
              <Sparkles className="w-4 h-4 text-radar-cyan shrink-0 mt-0.5" aria-hidden="true" />
              <p className="leading-relaxed">{entry.tip}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation and state controls */}
      <div className="pt-6 border-t border-radar-border flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Prev / Next controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={onPrev}
            className="px-3.5 py-2 rounded-lg bg-radar-surface2 hover:bg-radar-border text-radar-text border border-radar-border flex items-center gap-1.5 font-tactical text-xs font-semibold transition-colors min-h-[44px]"
            aria-label="Previous item"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>PREV</span>
          </button>
          <button
            onClick={onNext}
            className="px-3.5 py-2 rounded-lg bg-radar-surface2 hover:bg-radar-border text-radar-text border border-radar-border flex items-center gap-1.5 font-tactical text-xs font-semibold transition-colors min-h-[44px]"
            aria-label="Next item"
          >
            <span>NEXT</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mark actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onMarkNeedsPractice}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-tactical text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all min-h-[44px] ${
              needsPractice
                ? 'bg-radar-amber text-radar-bg border-radar-amber shadow-hud-amber font-bold'
                : 'bg-radar-surface2 hover:bg-radar-amber-dim text-radar-amber border-radar-amber/40'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>NEEDS PRACTICE</span>
          </button>

          <button
            onClick={onMarkLearned}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-tactical text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all min-h-[44px] ${
              isLearned
                ? 'bg-radar-success text-radar-bg border-radar-success shadow-hud-success font-bold'
                : 'bg-radar-surface2 hover:bg-radar-success-dim text-radar-success border-radar-success/40'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>MARK UNDERSTOOD</span>
          </button>
        </div>
      </div>
    </div>
  );
};
