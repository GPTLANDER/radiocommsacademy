import React from 'react';
import { Radio, Settings, Shield } from 'lucide-react';
import { TraineeRank } from '../../types';
import { SignalWaveform } from './SignalWaveform';

interface HeaderProps {
  rank: TraineeRank;
  totalXP: number;
  onOpenSettings: () => void;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  rank,
  totalXP,
  onOpenSettings,
  onNavigateHome,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-radar-bg/95 backdrop-blur border-b border-radar-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-left group focus-visible:ring-2 focus-visible:ring-radar-cyan rounded p-1"
          aria-label="Radio Comms Academy Home"
        >
          <div className="w-10 h-10 rounded-lg bg-radar-surface border border-radar-cyan/40 flex items-center justify-center text-radar-cyan group-hover:border-radar-cyan group-hover:shadow-hud-cyan transition-all">
            <Radio className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base tracking-wide text-radar-text group-hover:text-radar-cyan transition-colors">
                RADIO COMMS ACADEMY
              </span>
              <span className="hidden sm:inline-block text-[10px] font-tactical px-1.5 py-0.5 rounded bg-radar-cyan-dim text-radar-cyan border border-radar-cyan/30">
                OPS-CONSOLE
              </span>
            </div>
            <div className="text-xs text-radar-muted font-tactical hidden sm:block">
              NATO PHONETIC &amp; DIGIT SIMULATOR
            </div>
          </div>
        </button>

        {/* Tactical status telemetry */}
        <div className="hidden md:flex items-center gap-3">
          <SignalWaveform frequency="121.500 MHz" />
        </div>

        {/* Trainee status & Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Rank Badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-radar-surface border border-radar-amber/40 text-radar-amber font-tactical text-xs"
            title={`Current Rank: ${rank.title} (${rank.description})`}
          >
            <Shield className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="font-semibold uppercase tracking-wider">{rank.title}</span>
          </div>

          {/* XP Counter */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-radar-surface border border-radar-border text-xs font-tactical"
            title="Total Experience Points"
          >
            <span className="text-radar-muted">XP:</span>
            <span className="text-radar-cyan font-bold font-mono">{totalXP}</span>
          </div>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded bg-radar-surface hover:bg-radar-surface2 border border-radar-border text-radar-muted hover:text-radar-text transition-colors focus-visible:ring-2 focus-visible:ring-radar-cyan"
            aria-label="Open Academy Settings"
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};
