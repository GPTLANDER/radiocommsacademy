import React from 'react';
import { Compass, Award, ArrowRight, Zap, Target } from 'lucide-react';
import { TraineeRank, PersistentProgress } from '../../types';
import { ProgressBar } from '../common/ProgressBar';

interface MissionBriefingProps {
  rank: TraineeRank;
  nextRankProgress: {
    progressPercent: number;
    xpNeeded: number;
  };
  progress: PersistentProgress;
  totalLearnedCount: number;
  overallCompletionPercent: number;
  onContinueTraining: () => void;
}

export const MissionBriefing: React.FC<MissionBriefingProps> = ({
  rank,
  nextRankProgress,
  progress,
  totalLearnedCount,
  overallCompletionPercent,
  onContinueTraining,
}) => {
  const isNewLearner = progress.totalXP === 0 && progress.completedSessionCount === 0;

  return (
    <section className="hud-panel p-5 sm:p-6 hud-bezel-top bg-radar-surface border border-radar-border shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Briefing Text */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-radar-cyan-dim text-radar-cyan border border-radar-cyan/30">
              <Compass className="w-4 h-4" aria-hidden="true" />
            </span>
            <span className="font-tactical text-xs text-radar-cyan uppercase tracking-wider font-bold">
              {isNewLearner ? 'OPERATIONS ONBOARDING' : 'OPERATIONS BRIEFING'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-radar-text tracking-tight">
            {isNewLearner
              ? 'Welcome to Radio Comms Academy, Trainee.'
              : `Standing by, ${rank.title}. Transmission lines active.`}
          </h1>

          <p className="text-sm text-radar-muted max-w-2xl leading-relaxed">
            {isNewLearner
              ? 'In international aviation and maritime operations, crackling radio frequencies demand unmistakable clarity. Master the canonical 26-letter NATO phonetic alphabet and 10 radio digits to earn your operator credentials.'
              : 'Maintain procedural precision across tactical channels. Continue training to refine your speed, decode intercept missions, and achieve Commander rank.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onContinueTraining}
              className="px-5 py-2.5 rounded-lg bg-radar-cyan hover:bg-radar-cyan/90 text-radar-bg font-tactical text-xs font-bold transition-all shadow-hud-cyan flex items-center gap-2 group min-h-[44px]"
            >
              <span>{isNewLearner ? 'START TRAINING' : 'CONTINUE TRAINING'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Telemetry Summary Card */}
        <div className="w-full lg:w-80 bg-radar-surface2/60 border border-radar-border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center text-xs font-tactical">
            <span className="text-radar-muted uppercase">TRAINEE STATUS:</span>
            <span className="text-radar-amber font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {rank.title}
            </span>
          </div>

          <ProgressBar
            value={overallCompletionPercent}
            label="Total Mastery"
            subLabel={`${totalLearnedCount}/36 items`}
            variant="cyan"
          />

          <ProgressBar
            value={nextRankProgress.progressPercent}
            label="Rank Progression"
            subLabel={nextRankProgress.xpNeeded > 0 ? `${nextRankProgress.xpNeeded} XP to Next Rank` : 'Max Rank Reached'}
            variant="amber"
          />

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-radar-border/60 text-xs font-tactical">
            <div className="bg-radar-surface/80 p-2 rounded border border-radar-border/40">
              <div className="text-radar-dim flex items-center gap-1">
                <Zap className="w-3 h-3 text-radar-cyan" />
                TOTAL XP
              </div>
              <div className="text-base font-bold text-radar-text mt-0.5 font-mono">
                {progress.totalXP}
              </div>
            </div>
            <div className="bg-radar-surface/80 p-2 rounded border border-radar-border/40">
              <div className="text-radar-dim flex items-center gap-1">
                <Target className="w-3 h-3 text-radar-success" />
                SESSIONS
              </div>
              <div className="text-base font-bold text-radar-text mt-0.5 font-mono">
                {progress.completedSessionCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
