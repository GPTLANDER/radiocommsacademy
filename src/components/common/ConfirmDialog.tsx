import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the cancel button on open to avoid accidental confirmation
      cancelBtnRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onCancel();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-radar-bg/80 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-desc"
    >
      <div className="hud-panel w-full max-w-md bg-radar-surface p-6 border-2 border-radar-border shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg ${
              isDestructive
                ? 'bg-radar-error-dim text-radar-error'
                : 'bg-radar-amber-dim text-radar-amber'
            }`}
          >
            <AlertTriangle className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h2 id="dialog-title" className="text-lg font-bold text-radar-text font-tactical">
              {title}
            </h2>
            <p id="dialog-desc" className="mt-2 text-sm text-radar-muted leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-radar-dim hover:text-radar-text p-1 rounded focus-visible:ring-2 focus-visible:ring-radar-cyan"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3 font-tactical text-xs">
          <button
            ref={cancelBtnRef}
            onClick={onCancel}
            className="px-4 py-2.5 rounded bg-radar-surface2 hover:bg-radar-border text-radar-text border border-radar-border transition-colors font-medium"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
              isDestructive
                ? 'bg-radar-error hover:bg-radar-error/90 text-radar-bg'
                : 'bg-radar-cyan hover:bg-radar-cyan/90 text-radar-bg'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
