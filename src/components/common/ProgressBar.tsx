import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  subLabel?: string;
  variant?: 'cyan' | 'amber' | 'success';
  showPercentage?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  subLabel,
  variant = 'cyan',
  showPercentage = true,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const variantColor = {
    cyan: 'bg-radar-cyan shadow-hud-cyan',
    amber: 'bg-radar-amber shadow-hud-amber',
    success: 'bg-radar-success shadow-hud-success',
  }[variant];

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1 text-xs font-tactical">
          <span className="text-radar-muted font-medium flex items-center gap-2">
            {label}
            {subLabel && <span className="text-radar-dim">({subLabel})</span>}
          </span>
          {showPercentage && (
            <span className="text-radar-text font-semibold">{clamped}%</span>
          )}
        </div>
      )}
      <div
        className="w-full h-2.5 bg-radar-surface2 rounded-full overflow-hidden border border-radar-border/80"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${variantColor}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
