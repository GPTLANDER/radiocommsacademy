import React from 'react';
import { Shield, Award, CheckCircle2, Lock, Radio, BookOpen, Hash, CheckCircle } from 'lucide-react';
import { PersistentProgress, TraineeRank } from '../../types';
import { TRAINEE_RANKS, ACHIEVEMENTS } from '../../data/achievements';

interface TraineeStatsProps {
  progress: PersistentProgress;
  currentRank: TraineeRank;
}

export const TraineeStats: React.FC<TraineeStatsProps> = ({
  progress,
  currentRank,
}) => {
  const unlockedSet = new Set(progress.unlockedAchievementIds);

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'Radio':
        return Radio;
      case 'BookOpen':
        return BookOpen;
      case 'Hash':
        return Hash;
      case 'Award':
        return Award;
      default:
        return CheckCircle;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Trainee Rank Progression Ladder */}
      <div className="hud-panel p-5 bg-radar-surface border border-radar-border">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-radar-border">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-radar-amber" aria-hidden="true" />
            <h3 className="text-sm font-bold text-radar-text font-tactical uppercase">
              OPERATOR RANK LADDER
            </h3>
          </div>
          <span className="text-xs font-tactical text-radar-muted">
            CURRENT: <strong className="text-radar-amber">{currentRank.title}</strong>
          </span>
        </div>

        <div className="space-y-3">
          {TRAINEE_RANKS.map((r, idx) => {
            const isEarned = progress.totalXP >= r.minXp;
            const isCurrent = currentRank.id === r.id;

            return (
              <div
                key={r.id}
                className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                  isCurrent
                    ? 'bg-radar-surface2 border-radar-amber/60 shadow-hud-amber'
                    : isEarned
                    ? 'bg-radar-surface2/40 border-radar-border text-radar-muted'
                    : 'bg-radar-bg/40 border-radar-border/40 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-tactical text-xs font-bold ${
                      isEarned
                        ? 'bg-radar-amber text-radar-bg'
                        : 'bg-radar-surface2 text-radar-dim border border-radar-border'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-radar-text font-tactical">
                        {r.title}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-tactical px-1.5 py-0.2 rounded bg-radar-amber/20 text-radar-amber border border-radar-amber/40">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-radar-muted mt-0.5">{r.description}</p>
                  </div>
                </div>

                <div className="text-right font-tactical text-xs font-mono">
                  <span className={isEarned ? 'text-radar-cyan font-bold' : 'text-radar-dim'}>
                    {r.minXp} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Medals Showcase */}
      <div className="hud-panel p-5 bg-radar-surface border border-radar-border">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-radar-border">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-radar-cyan" aria-hidden="true" />
            <h3 className="text-sm font-bold text-radar-text font-tactical uppercase">
              TACTICAL ACHIEVEMENTS ({progress.unlockedAchievementIds.length}/{ACHIEVEMENTS.length})
            </h3>
          </div>
          <span className="text-xs font-tactical text-radar-cyan font-semibold">
            {Math.round((progress.unlockedAchievementIds.length / ACHIEVEMENTS.length) * 100)}% UNLOCKED
          </span>
        </div>

        <div className="space-y-3">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedSet.has(ach.id);
            const Icon = getAchievementIcon(ach.iconName);

            return (
              <div
                key={ach.id}
                className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                  isUnlocked
                    ? 'bg-radar-surface2/60 border-radar-cyan/40 shadow-hud-cyan'
                    : 'bg-radar-bg/40 border-radar-border/40 opacity-70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isUnlocked
                        ? 'bg-radar-cyan-dim text-radar-cyan border border-radar-cyan/40'
                        : 'bg-radar-surface2 text-radar-dim border border-radar-border'
                    }`}
                  >
                    {isUnlocked ? (
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Lock className="w-5 h-5" aria-hidden="true" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-radar-text">
                        {ach.title}
                      </span>
                      {isUnlocked && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-radar-success" aria-hidden="true" />
                      )}
                    </div>
                    <p className="text-xs text-radar-muted mt-0.5">{ach.description}</p>
                  </div>
                </div>

                <div className="font-tactical text-[11px] uppercase whitespace-nowrap">
                  {isUnlocked ? (
                    <span className="text-radar-success font-semibold">UNLOCKED</span>
                  ) : (
                    <span className="text-radar-dim">LOCKED</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
