import React, { useState } from 'react';
import { X, ShieldCheck, Trash2, Sliders } from 'lucide-react';
import { LearnerSettings } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface SettingsModalProps {
  isOpen: boolean;
  settings: LearnerSettings;
  onUpdateSettings: (partial: Partial<LearnerSettings>) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onResetProgress,
  onClose,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-radar-bg/85 backdrop-blur-sm animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="hud-panel w-full max-w-lg bg-radar-surface border-2 border-radar-border shadow-2xl p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-radar-border">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-radar-cyan" aria-hidden="true" />
              <h2
                id="settings-title"
                className="text-base font-bold text-radar-text font-tactical uppercase tracking-wider"
              >
                ACADEMY SETTINGS &amp; CONTROLS
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-radar-dim hover:text-radar-text p-1 rounded focus-visible:ring-2 focus-visible:ring-radar-cyan"
              aria-label="Close settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preferences */}
          <div className="space-y-4 text-xs font-tactical">
            {/* Reduced motion */}
            <div className="p-3.5 rounded-lg bg-radar-surface2/60 border border-radar-border flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-radar-text block">
                  Motion &amp; Animations
                </span>
                <span className="text-radar-muted font-normal block mt-0.5">
                  Respects operating system reduce-motion setting or enables manual override.
                </span>
              </div>
              <select
                value={
                  settings.reducedMotion === 'system'
                    ? 'system'
                    : settings.reducedMotion
                    ? 'reduced'
                    : 'standard'
                }
                onChange={(e) => {
                  const val = e.target.value;
                  onUpdateSettings({
                    reducedMotion:
                      val === 'system' ? 'system' : val === 'reduced' ? true : false,
                  });
                }}
                className="px-3 py-1.5 bg-radar-surface border border-radar-border rounded text-radar-text font-tactical text-xs focus:outline-none focus:border-radar-cyan"
              >
                <option value="system">Follow System</option>
                <option value="reduced">Reduced Motion</option>
                <option value="standard">Full Motion</option>
              </select>
            </div>

            {/* Sound-free visual mode */}
            <div className="p-3.5 rounded-lg bg-radar-surface2/60 border border-radar-border flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-radar-text block">
                  Audio-Free Visual Operation
                </span>
                <span className="text-radar-muted font-normal block mt-0.5">
                  All signal transmissions, feedback, and telemetry operate strictly without sound requirements.
                </span>
              </div>
              <span className="px-2.5 py-1 rounded bg-radar-cyan-dim text-radar-cyan border border-radar-cyan/30 text-[11px] font-bold">
                ACTIVE
              </span>
            </div>

            {/* Privacy note */}
            <div className="p-3.5 rounded-lg bg-radar-surface2/40 border border-radar-border/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-radar-cyan shrink-0 mt-0.5" />
              <div className="leading-relaxed text-radar-muted">
                <span className="font-bold text-radar-text block mb-0.5">
                  Privacy &amp; Data Safeguards
                </span>
                Radio Comms Academy does not collect personal identifiers, logins, tracking cookies, or external analytics. All learner XP, ranks, and module progress are kept strictly inside your local browser storage.
              </div>
            </div>

            {/* Reset progress */}
            <div className="pt-2 border-t border-radar-border/80 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-radar-error block">
                  Reset Academy Progress
                </span>
                <span className="text-radar-dim font-normal block mt-0.5">
                  Clear all accumulated XP, trainee rank, and mastered items.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="px-3.5 py-2 rounded bg-radar-error-dim hover:bg-radar-error text-radar-error hover:text-radar-bg border border-radar-error/40 transition-colors font-bold flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-radar-cyan hover:bg-radar-cyan/90 text-radar-bg font-tactical text-xs font-bold shadow-hud-cyan transition-all"
            >
              DONE
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmReset}
        title="Confirm Total Progress Reset"
        message="Are you sure you want to reset all your Academy progress? This will permanently delete your earned XP, rank, unlocked achievements, and mastery history on this device."
        confirmLabel="Reset Everything"
        cancelLabel="Keep My Progress"
        isDestructive={true}
        onConfirm={() => {
          onResetProgress();
          setShowConfirmReset(false);
          onClose();
        }}
        onCancel={() => setShowConfirmReset(false)}
      />
    </>
  );
};
