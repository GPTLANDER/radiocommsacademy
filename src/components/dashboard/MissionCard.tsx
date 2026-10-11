import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

interface MissionCardProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  badgeText: string;
  progressValue: number;
  progressLabel?: string;
  actionText: string;
  onLaunch: () => void;
  accentColor?: 'cyan' | 'amber' | 'success';
}

export const MissionCard: React.FC<MissionCardProps> = ({
  title,
  subtitle,
  description,
  icon: Icon,
  badgeText,
  progressValue,
  progressLabel,
  actionText,
  onLaunch,
  accentColor = 'cyan',
}) => {
  const badgeStyle = {
    cyan: 'bg-radar-cyan-dim text-radar-cyan border-radar-cyan/30',
    amber: 'bg-radar-amber-dim text-radar-amber border-radar-amber/30',
    success: 'bg-radar-success-dim text-radar-success border-radar-success/30',
  }[accentColor];

  const buttonStyle = {
    cyan: 'bg-radar-surface2 hover:bg-radar-cyan hover:text-radar-bg text-radar-cyan border-radar-cyan/30 group-hover:border-radar-cyan',
    amber: 'bg-radar-surface2 hover:bg-radar-amber hover:text-radar-bg text-radar-amber border-radar-amber/30 group-hover:border-radar-amber',
    success: 'bg-radar-surface2 hover:bg-radar-success hover:text-radar-bg text-radar-success border-radar-success/30 group-hover:border-radar-success',
  }[accentColor];

  return (
    <div className="hud-panel p-5 bg-radar-surface border border-radar-border flex flex-col justify-between hover:border-radar-cyan/50 transition-all duration-200 group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-lg bg-radar-surface2 border border-radar-border text-radar-text group-hover:text-radar-cyan transition-colors">
              <Icon className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="font-tactical text-[11px] text-radar-muted uppercase tracking-wider block">
                {subtitle}
              </span>
              <h2 className="text-base font-bold text-radar-text group-hover:text-radar-cyan transition-colors">
                {title}
              </h2>
            </div>
          </div>
          <span
            className={`font-tactical text-[10px] uppercase px-2 py-0.5 rounded border font-semibold ${badgeStyle}`}
          >
            {badgeText}
          </span>
        </div>

        <p className="text-xs text-radar-muted leading-relaxed mb-4">
          {description}
        </p>
      </div>

      <div className="space-y-4 pt-2 border-t border-radar-border/40">
        <ProgressBar
          value={progressValue}
          label={progressLabel}
          variant={accentColor}
          showPercentage={true}
        />

        <button
          onClick={onLaunch}
          className={`w-full py-2.5 px-4 rounded-md font-tactical text-xs font-bold transition-all border flex items-center justify-center gap-2 min-h-[44px] ${buttonStyle}`}
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
