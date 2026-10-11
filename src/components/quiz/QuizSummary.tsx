import React from 'react';
import { Award, RotateCcw, LayoutDashboard, Target, Zap, AlertTriangle } from 'lucide-react';
import { SessionResult, LearningEntry } from '../../types';
import { ALPHABET_DATA } from '../../data/alphabet';
import { DIGIT_DATA } from '../../data/digits';

interface QuizSummaryProps {
  result: SessionResult;
  onRetry: () => void;
  onReturnDashboard: () => void;
}

export const QuizSummary: React.FC<QuizSummaryProps> = ({
  result,
  onRetry,
  onReturnDashboard,
}) => {
  const allEntries: LearningEntry[] = [...ALPHABET_DATA, ...DIGIT_DATA];
  const missedEntries = allEntries.filter((item) =>
    result.missedEntryIds.includes(item.id)
  );

  return (
    <div className="hud-panel p-6 sm:p-8 bg-radar-surface border-2 border-radar-border max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-radar-cyan-dim border border-radar-cyan flex items-center justify-center text-radar-cyan mx-auto shadow-hud-cyan">
          <Award className="w-8 h-8" aria-hidden="true" />
        </div>
        <span className="font-tactical text-xs text-radar-cyan uppercase tracking-wider block font-bold">
          DEBRIEFING COMPLETE
        </span>
        <h2 className="text-2xl font-bold text-radar-text">
          Knowledge Check Completed
        </h2>
        <p className="text-xs text-radar-muted">
          Your transmission score and mastery telemetry have been logged.
        </p>
      </div>

      {/* Primary score metrics */}
      <div className="grid grid-cols-3 gap-3 font-tactical text-xs">
        <div className="bg-radar-surface2 p-3 rounded-lg border border-radar-border text-center">
          <span className="text-radar-dim flex items-center justify-center gap-1">
            <Target className="w-3.5 h-3.5 text-radar-cyan" />
            ACCURACY
          </span>
          <span className="text-2xl font-bold text-radar-cyan font-mono mt-1 block">
            {result.accuracy}%
          </span>
        </div>

        <div className="bg-radar-surface2 p-3 rounded-lg border border-radar-border text-center">
          <span className="text-radar-dim flex items-center justify-center gap-1">
            <Award className="w-3.5 h-3.5 text-radar-success" />
            CORRECT
          </span>
          <span className="text-2xl font-bold text-radar-success font-mono mt-1 block">
            {result.correctCount} / {result.totalQuestions}
          </span>
        </div>

        <div className="bg-radar-surface2 p-3 rounded-lg border border-radar-border text-center">
          <span className="text-radar-dim flex items-center justify-center gap-1">
            <Zap className="w-3.5 h-3.5 text-radar-amber" />
            XP EARNED
          </span>
          <span className="text-2xl font-bold text-radar-amber font-mono mt-1 block">
            +{result.xpEarned}
          </span>
        </div>
      </div>

      {/* Missed questions breakdown if any */}
      {missedEntries.length > 0 && (
        <div className="p-4 rounded-lg bg-radar-surface2/60 border border-radar-amber/40 space-y-3">
          <div className="flex items-center gap-2 text-xs font-tactical text-radar-amber font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>ITEMS QUEUED FOR PRACTICE ({missedEntries.length})</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {missedEntries.map((item) => (
              <div
                key={item.id}
                className="p-2 rounded bg-radar-surface border border-radar-border flex items-center justify-between text-xs font-tactical"
              >
                <span className="font-bold text-radar-cyan">{item.symbol}</span>
                <span className="text-radar-muted truncate">{item.codeWord}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 font-tactical text-xs">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-radar-surface2 hover:bg-radar-border text-radar-text border border-radar-border flex items-center justify-center gap-2 font-bold min-h-[44px]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>RETRY CHECK</span>
        </button>

        <button
          onClick={onReturnDashboard}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-radar-cyan hover:bg-radar-cyan/90 text-radar-bg flex items-center justify-center gap-2 font-bold shadow-hud-cyan min-h-[44px]"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>RETURN TO MISSION CONTROL</span>
        </button>
      </div>
    </div>
  );
};
