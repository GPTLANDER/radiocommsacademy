import React from 'react';

interface SignalWaveformProps {
  active?: boolean;
  frequency?: string;
  className?: string;
}

export const SignalWaveform: React.FC<SignalWaveformProps> = ({
  active = true,
  frequency = '121.500 MHz',
  className = '',
}) => {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded bg-radar-surface2/60 border border-radar-border font-tactical text-xs ${className}`}
      aria-label={`Radio carrier frequency ${frequency}, visual signal active`}
    >
      <div className="flex items-center gap-0.5 h-4" aria-hidden="true">
        <span
          className={`w-1 rounded-full bg-radar-cyan transition-all duration-300 ${
            active ? 'h-3 animate-pulse' : 'h-1.5 opacity-40'
          }`}
        />
        <span
          className={`w-1 rounded-full bg-radar-cyan transition-all duration-300 ${
            active ? 'h-4 animate-pulse-subtle' : 'h-2 opacity-40'
          }`}
        />
        <span
          className={`w-1 rounded-full bg-radar-cyan transition-all duration-300 ${
            active ? 'h-2.5' : 'h-1.5 opacity-40'
          }`}
        />
        <span
          className={`w-1 rounded-full bg-radar-cyan transition-all duration-300 ${
            active ? 'h-3.5 animate-pulse' : 'h-2 opacity-40'
          }`}
        />
      </div>
      <span className="text-radar-muted uppercase">FREQ:</span>
      <span className="text-radar-cyan font-semibold">{frequency}</span>
    </div>
  );
};
