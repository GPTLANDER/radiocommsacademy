import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  Shuffle,
  CheckCircle,
  AlertCircle,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { ALPHABET_DATA } from '../../data/alphabet';
import { DIGIT_DATA } from '../../data/digits';
import { LearningEntry, SessionResult } from '../../types';
import { shuffleArray } from '../../lib/quiz-generator';
import { calculateAccuracy, BONUS_XP_FLASHCARD_SESSION } from '../../lib/scoring';
import { ProgressBar } from '../common/ProgressBar';

interface FlashcardSessionProps {
  learnedIds: Set<string>;
  needsPracticeIds: Set<string>;
  onMarkLearned: (id: string) => void;
  onMarkNeedsPractice: (id: string) => void;
  onSessionComplete: (result: SessionResult) => void;
}

export const FlashcardSession: React.FC<FlashcardSessionProps> = ({
  needsPracticeIds,
  onMarkLearned,
  onMarkNeedsPractice,
  onSessionComplete,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'alphabet' | 'digits' | 'needs_practice'>('all');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [sessionStartTime] = useState<number>(Date.now());
  const [gotItCount, setGotItCount] = useState<number>(0);
  const [practiceAgainCount, setPracticeAgainCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Build card deck based on selected filter
  const deck = useMemo<LearningEntry[]>(() => {
    let pool: LearningEntry[] = [];
    if (filterMode === 'alphabet') {
      pool = [...ALPHABET_DATA];
    } else if (filterMode === 'digits') {
      pool = [...DIGIT_DATA];
    } else if (filterMode === 'needs_practice') {
      const all = [...ALPHABET_DATA, ...DIGIT_DATA];
      pool = all.filter((item) => needsPracticeIds.has(item.id));
      if (pool.length === 0) {
        // Fallback if none flagged
        pool = [...all];
      }
    } else {
      pool = [...ALPHABET_DATA, ...DIGIT_DATA];
    }
    return pool;
  }, [filterMode, needsPracticeIds]);

  const [cards, setCards] = useState<LearningEntry[]>(() => deck);

  // Reset when filter mode changes
  const handleFilterChange = (mode: 'all' | 'alphabet' | 'digits' | 'needs_practice') => {
    setFilterMode(mode);
    let newDeck: LearningEntry[] = [];
    if (mode === 'alphabet') newDeck = [...ALPHABET_DATA];
    else if (mode === 'digits') newDeck = [...DIGIT_DATA];
    else if (mode === 'needs_practice') {
      const all = [...ALPHABET_DATA, ...DIGIT_DATA];
      newDeck = all.filter((item) => needsPracticeIds.has(item.id));
      if (newDeck.length === 0) newDeck = [...all];
    } else newDeck = [...ALPHABET_DATA, ...DIGIT_DATA];

    setCards(newDeck);
    setCurrentIndex(0);
    setIsFlipped(false);
    setGotItCount(0);
    setPracticeAgainCount(0);
    setIsCompleted(false);
  };

  const handleShuffle = () => {
    setCards(shuffleArray(cards));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const currentCard = cards[currentIndex];

  const handleNextCard = (gotIt: boolean) => {
    if (!currentCard) return;

    if (gotIt) {
      setGotItCount((c) => c + 1);
      onMarkLearned(currentCard.id);
    } else {
      setPracticeAgainCount((c) => c + 1);
      onMarkNeedsPractice(currentCard.id);
    }

    if (currentIndex < cards.length - 1) {
      setCurrentIndex((idx) => idx + 1);
      setIsFlipped(false);
    } else {
      // Completed session
      const finalGotIt = gotIt ? gotItCount + 1 : gotItCount;
      const total = cards.length;
      const accuracy = calculateAccuracy(finalGotIt, total);

      const result: SessionResult = {
        sessionId: `flashcard-${Date.now()}`,
        mode: 'flashcards',
        startedAt: sessionStartTime,
        completedAt: Date.now(),
        totalQuestions: total,
        correctCount: finalGotIt,
        accuracy,
        xpEarned: BONUS_XP_FLASHCARD_SESSION + finalGotIt * 5,
        missedEntryIds: Array.from(needsPracticeIds),
      };

      setIsCompleted(true);
      onSessionComplete(result);
    }
  };

  const handleRestart = () => {
    setCards(shuffleArray(deck));
    setCurrentIndex(0);
    setIsFlipped(false);
    setGotItCount(0);
    setPracticeAgainCount(0);
    setIsCompleted(false);
  };

  if (isCompleted) {
    const accuracy = calculateAccuracy(gotItCount, cards.length);
    return (
      <div className="hud-panel p-6 sm:p-8 bg-radar-surface border-2 border-radar-border max-w-xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-radar-cyan-dim border border-radar-cyan flex items-center justify-center text-radar-cyan mx-auto shadow-hud-cyan">
          <Layers className="w-8 h-8" aria-hidden="true" />
        </div>

        <div>
          <span className="text-xs font-tactical text-radar-cyan uppercase tracking-wider block">
            SESSION COMPLETE
          </span>
          <h2 className="text-2xl font-bold text-radar-text mt-1">
            Flashcard Drill Completed
          </h2>
          <p className="text-xs text-radar-muted mt-2">
            Items reviewed and updated in your tactical memory bank.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-tactical text-xs">
          <div className="bg-radar-surface2 p-3 rounded-lg border border-radar-border">
            <span className="text-radar-dim block">CARDS</span>
            <span className="text-xl font-bold text-radar-text font-mono mt-1 block">
              {cards.length}
            </span>
          </div>
          <div className="bg-radar-surface2 p-3 rounded-lg border border-radar-border">
            <span className="text-radar-dim block">GOT IT</span>
            <span className="text-xl font-bold text-radar-success font-mono mt-1 block">
              {gotItCount}
            </span>
          </div>
          <div className="bg-radar-surface2 p-3 rounded-lg border border-radar-border">
            <span className="text-radar-dim block">PRACTICE</span>
            <span className="text-xl font-bold text-radar-amber font-mono mt-1 block">
              {practiceAgainCount}
            </span>
          </div>
          <div className="bg-radar-surface2 p-3 rounded-lg border border-radar-border">
            <span className="text-radar-dim block">MASTERY</span>
            <span className="text-xl font-bold text-radar-cyan font-mono mt-1 block">
              {accuracy}%
            </span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 font-tactical text-xs">
          <button
            onClick={handleRestart}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-radar-surface2 hover:bg-radar-border text-radar-text border border-radar-border flex items-center justify-center gap-2 font-bold min-h-[44px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>REPEAT DRILL</span>
          </button>
          <button
            onClick={() => handleFilterChange('needs_practice')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-radar-cyan hover:bg-radar-cyan/90 text-radar-bg flex items-center justify-center gap-2 font-bold shadow-hud-cyan min-h-[44px]"
          >
            <span>REVIEW FLAGGED ITEMS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="hud-panel p-8 bg-radar-surface text-center">
        <p className="text-radar-muted">No flashcards available in this category.</p>
        <button
          onClick={() => handleFilterChange('all')}
          className="mt-4 px-4 py-2 bg-radar-cyan text-radar-bg rounded font-tactical text-xs"
        >
          View All Items
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Session Controls & Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-radar-surface2/60 p-3 rounded-lg border border-radar-border">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-tactical text-xs">
          <Filter className="w-3.5 h-3.5 text-radar-dim mr-1 hidden sm:block" />
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-2.5 py-1.5 rounded transition-colors ${
              filterMode === 'all'
                ? 'bg-radar-cyan text-radar-bg font-bold'
                : 'text-radar-muted hover:text-radar-text bg-radar-surface/60'
            }`}
          >
            All (36)
          </button>
          <button
            onClick={() => handleFilterChange('alphabet')}
            className={`px-2.5 py-1.5 rounded transition-colors ${
              filterMode === 'alphabet'
                ? 'bg-radar-cyan text-radar-bg font-bold'
                : 'text-radar-muted hover:text-radar-text bg-radar-surface/60'
            }`}
          >
            A–Z (26)
          </button>
          <button
            onClick={() => handleFilterChange('digits')}
            className={`px-2.5 py-1.5 rounded transition-colors ${
              filterMode === 'digits'
                ? 'bg-radar-cyan text-radar-bg font-bold'
                : 'text-radar-muted hover:text-radar-text bg-radar-surface/60'
            }`}
          >
            0–9 (10)
          </button>
          {needsPracticeIds.size > 0 && (
            <button
              onClick={() => handleFilterChange('needs_practice')}
              className={`px-2.5 py-1.5 rounded transition-colors flex items-center gap-1 ${
                filterMode === 'needs_practice'
                  ? 'bg-radar-amber text-radar-bg font-bold'
                  : 'text-radar-amber hover:text-radar-text bg-radar-surface/60 border border-radar-amber/40'
              }`}
            >
              <span>Practice ({needsPracticeIds.size})</span>
            </button>
          )}
        </div>

        <button
          onClick={handleShuffle}
          className="px-3 py-1.5 rounded bg-radar-surface hover:bg-radar-border text-radar-muted hover:text-radar-text border border-radar-border flex items-center gap-1.5 font-tactical text-xs"
          title="Shuffle card order"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Shuffle</span>
        </button>
      </div>

      {/* Progress Telemetry */}
      <ProgressBar
        value={progressPercent}
        label={`Card ${currentIndex + 1} of ${cards.length}`}
        subLabel={`${gotItCount} got it`}
        variant="cyan"
      />

      {/* Interactive Flashcard */}
      <div
        onClick={handleFlip}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleFlip();
          }
        }}
        tabIndex={0}
        role="button"
        aria-pressed={isFlipped}
        aria-label={`Flashcard: ${currentCard.symbol}. Click or press space to reveal answer.`}
        className="hud-panel p-8 sm:p-12 min-h-[300px] sm:min-h-[340px] flex flex-col items-center justify-center text-center cursor-pointer border-2 border-radar-cyan/40 hover:border-radar-cyan bg-radar-surface shadow-hud-cyan transition-all select-none group focus-visible:ring-2 focus-visible:ring-radar-cyan"
      >
        {!isFlipped ? (
          /* Question Side */
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <span className="text-xs font-tactical text-radar-muted uppercase tracking-widest block">
              TRANSMISSION PROMPT (CLICK TO REVEAL)
            </span>
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-radar-surface2/90 border-2 border-radar-cyan/60 flex items-center justify-center mx-auto shadow-hud-cyan group-hover:scale-105 transition-transform">
              <span className="text-6xl sm:text-7xl font-extrabold font-mono text-radar-cyan">
                {currentCard.symbol}
              </span>
            </div>
            <p className="text-xs text-radar-dim font-tactical">
              What is the international radio code word for this symbol?
            </p>
          </div>
        ) : (
          /* Answer Side */
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <span className="text-xs font-tactical text-radar-cyan uppercase tracking-widest block font-bold">
              CANONICAL RESPONSE
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-radar-text font-tactical tracking-wide">
              {currentCard.codeWord}
            </div>
            <div className="inline-block px-4 py-2 rounded-lg bg-radar-surface2 border border-radar-amber/40 text-radar-amber font-tactical text-sm">
              <span className="text-radar-muted">PRONUNCIATION: </span>
              <strong>{currentCard.pronunciationGuide}</strong>
            </div>
            {currentCard.tip && (
              <p className="text-xs text-radar-muted max-w-md mx-auto pt-2 leading-relaxed">
                {currentCard.tip}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Answer feedback buttons */}
      <div className="flex items-center justify-center gap-4 font-tactical text-xs">
        <button
          onClick={() => handleNextCard(false)}
          className="flex-1 max-w-xs py-3 px-4 rounded-lg bg-radar-surface2 hover:bg-radar-amber-dim text-radar-amber border border-radar-amber/40 flex items-center justify-center gap-2 font-bold transition-all min-h-[44px]"
        >
          <AlertCircle className="w-4 h-4" />
          <span>PRACTISE AGAIN</span>
        </button>

        <button
          onClick={() => handleNextCard(true)}
          className="flex-1 max-w-xs py-3 px-4 rounded-lg bg-radar-success hover:bg-radar-success/90 text-radar-bg flex items-center justify-center gap-2 font-bold transition-all shadow-hud-success min-h-[44px]"
        >
          <CheckCircle className="w-4 h-4" />
          <span>GOT IT</span>
        </button>
      </div>
    </div>
  );
};
