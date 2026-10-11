import React, { useState } from 'react';
import { BookOpen, Layers, HelpCircle } from 'lucide-react';
import { ALPHABET_DATA } from '../../data/alphabet';
import { LearningEntry, LearningMode } from '../../types';
import { EntryGrid } from './EntryGrid';
import { FocusedCard } from './FocusedCard';
import { ProgressBar } from '../common/ProgressBar';

interface AlphabetViewProps {
  learnedIds: Set<string>;
  needsPracticeIds: Set<string>;
  onMarkLearned: (id: string) => void;
  onMarkNeedsPractice: (id: string) => void;
  onNavigate: (mode: LearningMode) => void;
}

export const AlphabetView: React.FC<AlphabetViewProps> = ({
  learnedIds,
  needsPracticeIds,
  onMarkLearned,
  onMarkNeedsPractice,
  onNavigate,
}) => {
  const [selectedEntry, setSelectedEntry] = useState<LearningEntry>(ALPHABET_DATA[0]);

  const currentIndex = ALPHABET_DATA.findIndex((e) => e.id === selectedEntry.id);
  const learnedCount = ALPHABET_DATA.filter((e) => learnedIds.has(e.id)).length;
  const progressPercent = Math.round((learnedCount / ALPHABET_DATA.length) * 100);

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + ALPHABET_DATA.length) % ALPHABET_DATA.length;
    setSelectedEntry(ALPHABET_DATA[nextIdx]);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % ALPHABET_DATA.length;
    setSelectedEntry(ALPHABET_DATA[nextIdx]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Module Header Bar */}
      <div className="hud-panel p-4 bg-radar-surface border border-radar-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-radar-cyan" aria-hidden="true" />
            <h2 className="text-base font-bold text-radar-text font-tactical uppercase tracking-wider">
              NATO PHONETIC ALPHABET (26 LETTERS)
            </h2>
          </div>
          <p className="text-xs text-radar-muted mt-1">
            Standard International Radiotelephony Spelling Alphabet (ICAO/ITU/NATO).
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
        label="Alphabet Mastery"
        subLabel={`${learnedCount} of 26 letters marked understood`}
        variant="cyan"
      />

      {/* Large Focused Study Card */}
      <FocusedCard
        entry={selectedEntry}
        currentIndex={currentIndex}
        totalCount={ALPHABET_DATA.length}
        isLearned={learnedIds.has(selectedEntry.id)}
        needsPractice={needsPracticeIds.has(selectedEntry.id)}
        onPrev={handlePrev}
        onNext={handleNext}
        onMarkLearned={() => onMarkLearned(selectedEntry.id)}
        onMarkNeedsPractice={() => onMarkNeedsPractice(selectedEntry.id)}
      />

      {/* A-Z Quick Selector Matrix */}
      <div className="hud-panel p-5 bg-radar-surface border border-radar-border space-y-3">
        <div className="flex items-center justify-between text-xs font-tactical">
          <span className="text-radar-muted uppercase font-bold">
            QUICK MATRIX NAVIGATION (A–Z)
          </span>
          <span className="text-radar-dim">
            CLICK ANY LETTER TO INSPECT
          </span>
        </div>

        <EntryGrid
          entries={ALPHABET_DATA}
          selectedEntryId={selectedEntry.id}
          onSelectEntry={setSelectedEntry}
          learnedIds={learnedIds}
          needsPracticeIds={needsPracticeIds}
        />
      </div>
    </div>
  );
};
