import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { LearningEntry } from '../../types';

interface EntryGridProps {
  entries: readonly LearningEntry[];
  selectedEntryId: string;
  onSelectEntry: (entry: LearningEntry) => void;
  learnedIds: Set<string>;
  needsPracticeIds: Set<string>;
}

export const EntryGrid: React.FC<EntryGridProps> = ({
  entries,
  selectedEntryId,
  onSelectEntry,
  learnedIds,
  needsPracticeIds,
}) => {
  return (
    <div
      className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-9 gap-2"
      role="listbox"
      aria-label="Learning Items Selector"
    >
      {entries.map((item) => {
        const isSelected = item.id === selectedEntryId;
        const isLearned = learnedIds.has(item.id);
        const needsPractice = needsPracticeIds.has(item.id);

        let borderState = 'border-radar-border hover:border-radar-border/80';
        let bgState = 'bg-radar-surface';

        if (isSelected) {
          borderState = 'border-radar-cyan shadow-hud-cyan ring-1 ring-radar-cyan';
          bgState = 'bg-radar-surface2';
        } else if (needsPractice) {
          borderState = 'border-radar-amber/60 hover:border-radar-amber';
          bgState = 'bg-radar-surface2/60';
        } else if (isLearned) {
          borderState = 'border-radar-success/50 hover:border-radar-success';
          bgState = 'bg-radar-surface/90';
        }

        return (
          <button
            key={item.id}
            onClick={() => onSelectEntry(item)}
            className={`p-2.5 rounded-lg border flex flex-col items-center justify-center transition-all relative group text-center min-h-[60px] ${borderState} ${bgState}`}
            role="option"
            aria-selected={isSelected}
            aria-label={`${item.symbol} - ${item.codeWord}. ${
              isLearned
                ? 'Understood'
                : needsPractice
                ? 'Needs Practice'
                : 'Not reviewed'
            }`}
          >
            {/* Status Indicator Icon */}
            <div className="absolute top-1 right-1">
              {isLearned && (
                <Check className="w-3 h-3 text-radar-success" aria-hidden="true" />
              )}
              {needsPractice && (
                <AlertCircle className="w-3 h-3 text-radar-amber" aria-hidden="true" />
              )}
            </div>

            <span className="text-lg font-bold font-mono text-radar-text group-hover:text-radar-cyan transition-colors">
              {item.symbol}
            </span>
            <span className="text-[10px] font-tactical text-radar-muted truncate w-full mt-0.5">
              {item.codeWord}
            </span>
          </button>
        );
      })}
    </div>
  );
};
