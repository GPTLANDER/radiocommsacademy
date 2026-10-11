import React, { useState, useEffect } from 'react';
import { Play, Settings2, HelpCircle } from 'lucide-react';
import { QuizConfig, QuizQuestion, SessionResult } from '../../types';
import { generateQuiz } from '../../lib/quiz-generator';
import { calculateAccuracy, XP_FIRST_ATTEMPT } from '../../lib/scoring';
import { AnswerFeedback } from './AnswerFeedback';
import { QuizSummary } from './QuizSummary';
import { ProgressBar } from '../common/ProgressBar';

interface QuizSessionProps {
  needsPracticeIds: Set<string>;
  onSessionComplete: (result: SessionResult) => void;
  onReturnDashboard: () => void;
}

export const QuizSession: React.FC<QuizSessionProps> = ({
  needsPracticeIds,
  onSessionComplete,
  onReturnDashboard,
}) => {
  // Session configuration state
  const [config, setConfig] = useState<QuizConfig>({
    domain: 'mixed',
    questionCount: 10,
    missedOnly: false,
  });
  const [isActive, setIsActive] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [missedEntryIds, setMissedEntryIds] = useState<string[]>([]);
  const [earnedXP, setEarnedXP] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [completedResult, setCompletedResult] = useState<SessionResult | null>(null);

  const startQuiz = () => {
    const list = generateQuiz(config, Array.from(needsPracticeIds));
    if (list.length === 0) return;

    setQuestions(list);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setMissedEntryIds([]);
    setEarnedXP(0);
    setStartTime(Date.now());
    setCompletedResult(null);
    setIsActive(true);
  };

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = React.useCallback(
    (optionId: string) => {
      if (isAnswered || !currentQuestion) return; // Prevent duplicate submissions

      setSelectedOptionId(optionId);
      setIsAnswered(true);

      const isCorrect = optionId === currentQuestion.correctAnswerId;
      if (isCorrect) {
        setCorrectCount((c) => c + 1);
        setEarnedXP((xp) => xp + XP_FIRST_ATTEMPT);
      } else {
        // Record missed entries
        setMissedEntryIds((prev) => [
          ...prev,
          ...currentQuestion.relatedEntryIds.filter((id) => !prev.includes(id)),
        ]);
      }
    },
    [isAnswered, currentQuestion]
  );

  // Keyboard shortcut support (1-4 for options)
  useEffect(() => {
    if (!isActive || isAnswered || !currentQuestion) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const num = parseInt(key, 10);
      if (num >= 1 && num <= currentQuestion.options.length) {
        e.preventDefault();
        handleSelectOption(currentQuestion.options[num - 1].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, isAnswered, currentQuestion, handleSelectOption]);

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      // Session finished
      const total = questions.length;
      const finalAccuracy = calculateAccuracy(correctCount, total);
      const result: SessionResult = {
        sessionId: `quiz-${Date.now()}`,
        mode: 'quiz',
        startedAt: startTime,
        completedAt: Date.now(),
        totalQuestions: total,
        correctCount,
        accuracy: finalAccuracy,
        xpEarned: earnedXP,
        missedEntryIds,
      };

      setCompletedResult(result);
      onSessionComplete(result);
    }
  };

  // Render completed view
  if (completedResult) {
    return (
      <QuizSummary
        result={completedResult}
        onRetry={startQuiz}
        onReturnDashboard={onReturnDashboard}
      />
    );
  }

  // Render setup config view
  if (!isActive) {
    return (
      <div className="hud-panel p-6 sm:p-8 bg-radar-surface border-2 border-radar-border max-w-xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-xl bg-radar-cyan-dim border border-radar-cyan flex items-center justify-center text-radar-cyan mx-auto shadow-hud-cyan">
            <HelpCircle className="w-7 h-7" aria-hidden="true" />
          </div>
          <span className="font-tactical text-xs text-radar-cyan uppercase tracking-wider block font-bold">
            PROCEDURAL EVALUATION
          </span>
          <h2 className="text-2xl font-bold text-radar-text">Knowledge Check</h2>
          <p className="text-xs text-radar-muted">
            Configure your procedural exam parameters below and engage transmission verification.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          {/* Domain selector */}
          <div>
            <label className="text-xs font-tactical text-radar-muted uppercase block mb-2 font-semibold">
              Training Domain
            </label>
            <div className="grid grid-cols-3 gap-2 font-tactical text-xs">
              {(['mixed', 'alphabet', 'digits'] as const).map((dom) => (
                <button
                  key={dom}
                  type="button"
                  onClick={() => setConfig((c) => ({ ...c, domain: dom, missedOnly: false }))}
                  className={`py-2.5 px-3 rounded-lg border font-semibold capitalize transition-all min-h-[44px] ${
                    config.domain === dom && !config.missedOnly
                      ? 'bg-radar-cyan text-radar-bg border-radar-cyan shadow-hud-cyan'
                      : 'bg-radar-surface2 text-radar-muted hover:text-radar-text border-radar-border'
                  }`}
                >
                  {dom === 'mixed' ? 'Mixed Comms' : dom}
                </button>
              ))}
            </div>
          </div>

          {/* Question count selector */}
          <div>
            <label className="text-xs font-tactical text-radar-muted uppercase block mb-2 font-semibold">
              Session Length
            </label>
            <div className="grid grid-cols-2 gap-2 font-tactical text-xs">
              {([10, 20] as const).map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setConfig((c) => ({ ...c, questionCount: cnt }))}
                  className={`py-2.5 px-3 rounded-lg border font-semibold transition-all min-h-[44px] ${
                    config.questionCount === cnt
                      ? 'bg-radar-amber text-radar-bg border-radar-amber shadow-hud-amber'
                      : 'bg-radar-surface2 text-radar-muted hover:text-radar-text border-radar-border'
                  }`}
                >
                  {cnt} Questions ({cnt === 10 ? 'Short' : 'Standard'})
                </button>
              ))}
            </div>
          </div>

          {/* Missed only filter if applicable */}
          {needsPracticeIds.size > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() =>
                  setConfig((c) => ({ ...c, missedOnly: !c.missedOnly }))
                }
                className={`w-full py-2.5 px-3 rounded-lg border font-tactical text-xs font-semibold flex items-center justify-center gap-2 transition-all min-h-[44px] ${
                  config.missedOnly
                    ? 'bg-radar-amber text-radar-bg border-radar-amber shadow-hud-amber'
                    : 'bg-radar-surface2/60 text-radar-amber border-radar-amber/40 hover:bg-radar-surface2'
                }`}
              >
                <span>Filter to {needsPracticeIds.size} Flagged Practice Items Only</span>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={startQuiz}
          className="w-full py-3 rounded-lg bg-radar-cyan hover:bg-radar-cyan/90 text-radar-bg font-tactical text-xs font-bold shadow-hud-cyan transition-all flex items-center justify-center gap-2 min-h-[44px]"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>START KNOWLEDGE CHECK</span>
        </button>
      </div>
    );
  }

  // Active quiz question rendering
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* HUD Header */}
      <div className="flex items-center justify-between pb-2 border-b border-radar-border text-xs font-tactical">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-radar-cyan" />
          <span className="text-radar-cyan uppercase font-bold">
            QUESTION {currentIndex + 1} OF {questions.length}
          </span>
        </div>
        <div className="text-radar-muted font-mono">
          SCORE: <strong className="text-radar-success">{correctCount}</strong> | XP: <strong className="text-radar-amber">+{earnedXP}</strong>
        </div>
      </div>

      <ProgressBar
        value={progressPercent}
        variant="cyan"
        showPercentage={false}
      />

      {/* Main Question Card */}
      <div className="hud-panel p-6 sm:p-8 bg-radar-surface border-2 border-radar-border shadow-xl space-y-6">
        <div className="text-center space-y-3">
          <span className="text-xs font-tactical text-radar-muted uppercase tracking-widest block">
            SIGNAL PROMPT
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-radar-text leading-snug">
            {currentQuestion.prompt}
          </h3>

          {currentQuestion.contextSymbol && (
            <div className="inline-block p-4 rounded-xl bg-radar-surface2/80 border border-radar-cyan/50 font-mono text-4xl sm:text-5xl font-extrabold text-radar-cyan shadow-hud-cyan">
              {currentQuestion.contextSymbol}
            </div>
          )}
        </div>

        {/* 4 Answer Option Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrectOption = option.id === currentQuestion.correctAnswerId;

            let buttonClass = 'bg-radar-surface2 hover:bg-radar-surface2/80 text-radar-text border-radar-border hover:border-radar-cyan/50';

            if (isAnswered) {
              if (isCorrectOption) {
                buttonClass = 'bg-radar-success-dim text-radar-success border-radar-success shadow-hud-success font-bold';
              } else if (isSelected) {
                buttonClass = 'bg-radar-error-dim text-radar-error border-radar-error font-bold';
              } else {
                buttonClass = 'bg-radar-surface2/40 text-radar-dim border-radar-border/40 opacity-60';
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                disabled={isAnswered}
                className={`p-4 rounded-xl border text-left flex items-center justify-between gap-3 font-tactical text-sm transition-all min-h-[56px] focus-visible:ring-2 focus-visible:ring-radar-cyan ${buttonClass}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-radar-bg/60 border border-radar-border flex items-center justify-center text-xs font-mono text-radar-muted shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold block">{option.text}</span>
                    {option.subtext && (
                      <span className="text-xs text-radar-muted font-normal block">
                        {option.subtext}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback Section */}
        {isAnswered && (
          <AnswerFeedback
            question={currentQuestion}
            selectedOptionId={selectedOptionId || ''}
            isCorrect={selectedOptionId === currentQuestion.correctAnswerId}
            onNext={handleNextQuestion}
            isLastQuestion={currentIndex === questions.length - 1}
          />
        )}
      </div>
    </div>
  );
};
