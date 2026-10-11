import React from 'react';
import { Info } from 'lucide-react';
import { PRONUNCIATION_DISCLAIMER } from '../../data/digits';

export const PronunciationNote: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`hud-panel p-3.5 bg-radar-surface2/50 border border-radar-border/80 rounded-lg flex items-start gap-3 text-xs text-radar-muted ${className}`}
      role="note"
    >
      <div className="p-1 rounded bg-radar-cyan-dim text-radar-cyan mt-0.5">
        <Info className="w-4 h-4" aria-hidden="true" />
      </div>
      <p className="leading-relaxed">
        {PRONUNCIATION_DISCLAIMER}
      </p>
    </div>
  );
};
