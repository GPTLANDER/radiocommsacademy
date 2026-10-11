import React from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { QuizQuestion } from '../../types';

interface AnswerFeedbackProps {
  question: QuizQuestion;
  selectedOptionId: string;
  isCorrect: boolean;
  onNext: () => void;
  isLastQuestion: boolean;
}

export const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({
  question,
  selectedOptionId,
  isCorrect,
  onNext,
  isLastQuestion,
}) => {
  const correctOption = question.options.find((o) => o.id === question.correctAnswerId);
  const selectedOption = question.options.find((o) => o.id === selectedOptionId);

  return (
    <div
      className={`hud-panel p-5 rounded-lg border-2 mt-4 animate-in fade-in zoom-in-95 duration-150 ${
        isCorrect
          ? 'bg-radar-success-dim/40 border-radar-success shadow-hud-success'
          : 'bg-radar-error-dim/40 border-radar-error'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-radar-success" aria-hidden="true" />
            ) : (
              <XCircle className="w-6 h-6 text-radar-error" aria-hidden="true" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`font-tactical text-xs font-bold uppercase tracking-wider ${
                  isCorrect ? 'text-radar-success' : 'text-radar-error'
                }`}
              >
                {isCorrect ? 'TRANSMISSION VERIFIED — CORRECT (+10 XP)' : 'SIGNAL MISMATCH — INCORRECT'}
              </span>
            </div>

            <p className="text-sm font-semibold text-radar-text mt-1">
              {isCorrect ? (
                <span>Correct! {correctOption?.text}</span>
              ) : (
                <span>
                  You selected "{selectedOption?.text}". Correct answer is "{correctOption?.text}".
                </span>
              )}
            </p>

            <p className="text-xs text-radar-muted mt-1 leading-relaxed">
              {question.explanation}
            </p>
          </div>
        </div>

        <button
          onClick={onNext}
          className="self-end sm:self-center px-5 py-2.5 rounded-lg bg-radar-cyan hover:bg-radar-cyan/90 text-radar-bg font-tactical text-xs font-bold flex items-center gap-2 shadow-hud-cyan transition-all min-h-[44px]"
        >
          <span>{isLastQuestion ? 'VIEW RESULTS' : 'NEXT QUESTION'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
