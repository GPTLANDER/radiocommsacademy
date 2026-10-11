import React, { useState } from 'react';
import { Hash, Layers, HelpCircle } from 'lucide-react';
import { DIGIT_DATA } from '../../data/digits';
import { LearningEntry, LearningMode } from '../../types';
import { EntryGrid } from './EntryGrid';
import { FocusedCard } from './FocusedCard';
import { PronunciationNote } from './PronunciationNote';
import { ProgressBar } from '../common/ProgressBar';

interface DigitsViewProps {
  learnedIds: Set<string>;
  needsPracticeIds: Set<string>;
  onMarkLearned: (id: string) => void;
  onMarkNeedsPractice: (id: string) => void;
  onNavigate: (mode: LearningMode) => void;
}

export const DigitsView: React.FC<DigitsViewProps> = ({
  learnedIds,
  needsPracticeIds,
  onMarkLearned,
  onMarkNeedsPractice,
  onNavigate,
}) => {
  const [selectedEntry, setSelectedEntry] = useState<LearningEntry>(DIGIT_DATA[0]);

  const currentIndex = DIGIT_DATA.findIndex((e) => e.id === selectedEntry.id);
  const learnedCount = DIGIT_DATA.filter((e) => learnedIds.has(e.id)).length;
  const progressPercent = Math.round((learnedCount / DIGIT_DATA.length) * 100);

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + DIGIT_DATA.length) % DIGIT_DATA.length;
    setSelectedEntry(DIGIT_DATA[nextIdx]);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % DIGIT_DATA.length;
    setSelectedEntry(DIGIT_DATA[nextIdx]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Module Header Bar */}
      <div className="hud-panel p-4 bg-radar-surface border border-radar-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-radar-amber" aria-hidden="true" />
            <h2 className="text-base font-bold text-radar-text font-tactical uppercase tracking-wider">
              RADIO DIGITS (0–9) &amp; PRONUNCIATION
            </h2>
          </div>
          <p className="text-xs text-radar-muted mt-1">
            Specialized radiotelephony numerals designed to overcome noise and accent ambiguity.
          </p>
        </div>

        {/* Quick action shortcuts */}
        <div className="flex items-center gap-2 font-tactical text-xs">
          <button
            onClick={() => onNavigate('flashcards')}
            className="px-3 py-1.5 rounded bg-radar-surface2 hover:bg-radar-border text-radar-cyan border border-radar-cyan/30 flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Drill Cards</span>
          </button>
          <button
            onClick={() => onNavigate('quiz')}
            className="px-3 py-1.5 rounded bg-radar-surface2 hover:bg-radar-border text-radar-amber border border-radar-amber/30 flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Take Quiz</span>
          </button>
        </div>
      </div>

      {/* Progress Telemetry */}
      <ProgressBar
        value={progressPercent}
        label="Digit Mastery"
        subLabel={`${learnedCount} of 10 digits marked understood`}
        variant="amber"
      />

      {/* Large Focused Study Card */}
      <FocusedCard
        entry={selectedEntry}
        currentIndex={currentIndex}
        totalCount={DIGIT_DATA.length}
        isLearned={learnedIds.has(selectedEntry.id)}
        needsPractice={needsPracticeIds.has(selectedEntry.id)}
        onPrev={handlePrev}
        onNext={handleNext}
        onMarkLearned={() => onMarkLearned(selectedEntry.id)}
        onMarkNeedsPractice={() => onMarkNeedsPractice(selectedEntry.id)}
      />

      {/* Educational Pronunciation Clarification */}
      <PronunciationNote />

      {/* 0-9 Quick Selector Matrix */}
      <div className="hud-panel p-5 bg-radar-surface border border-radar-border space-y-3">
        <div className="flex items-center justify-between text-xs font-tactical">
          <span className="text-radar-muted uppercase font-bold">
            QUICK MATRIX NAVIGATION (0–9)
          </span>
          <span className="text-radar-dim">
            CLICK ANY DIGIT TO INSPECT
          </span>
        </div>

        <EntryGrid
          entries={DIGIT_DATA}
          selectedEntryId={selectedEntry.id}
          onSelectEntry={setSelectedEntry}
          learnedIds={learnedIds}
          needsPracticeIds={needsPracticeIds}
        />
      </div>
    </div>
  );
};
