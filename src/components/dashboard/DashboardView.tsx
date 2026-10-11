import React from 'react';
import { BookOpen, Hash, HelpCircle, Binary } from 'lucide-react';
import { PersistentProgress, TraineeRank, LearningMode } from '../../types';
import { MissionBriefing } from './MissionBriefing';
import { MissionCard } from './MissionCard';
import { TraineeStats } from './TraineeStats';

interface DashboardViewProps {
  progress: PersistentProgress;
  rank: TraineeRank;
  nextRankProgress: {
    progressPercent: number;
    xpNeeded: number;
  };
  alphabetLearnedCount: number;
  digitsLearnedCount: number;
  totalLearnedCount: number;
  overallCompletionPercent: number;
  onNavigate: (mode: LearningMode) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  progress,
  rank,
  nextRankProgress,
  alphabetLearnedCount,
  digitsLearnedCount,
  totalLearnedCount,
  overallCompletionPercent,
  onNavigate,
}) => {
  const alphabetPercent = Math.round((alphabetLearnedCount / 26) * 100);
  const digitsPercent = Math.round((digitsLearnedCount / 10) * 100);
  const quizAccuracy = progress.bestScoresByMode['quiz'] || 0;
  const decoderAccuracy = progress.bestScoresByMode['decoder'] || 0;

  // Determine smart "Continue Training" destination:
  // If alphabet not complete -> alphabet
  // Else if digits not complete -> digits
  // Else -> quiz or decoder
  const getContinueDestination = (): LearningMode => {
    if (alphabetLearnedCount < 26) return 'alphabet';
    if (digitsLearnedCount < 10) return 'digits';
    if (progress.completedSessionCount < 3) return 'quiz';
    return 'decoder';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Operations Briefing Banner */}
      <MissionBriefing
        rank={rank}
        nextRankProgress={nextRankProgress}
        progress={progress}
        totalLearnedCount={totalLearnedCount}
        overallCompletionPercent={overallCompletionPercent}
        onContinueTraining={() => onNavigate(getContinueDestination())}
      />

      {/* 4 Primary Training Pathways */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-tactical text-radar-cyan uppercase tracking-wider block font-bold">
              PRIMARY DIRECTIVES
            </span>
            <h2 className="text-lg font-bold text-radar-text font-tactical">
              TRAINING MISSIONS &amp; EVALUATION
            </h2>
          </div>
          <span className="text-xs font-tactical text-radar-muted hidden sm:inline">
            SELECT A TRACK TO BEGIN
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Track 1: Alphabet */}
          <MissionCard
            id="alphabet-track"
            title="Alphabet Training"
            subtitle="NATO A–Z"
            description="Master all 26 canonical international code words from Alfa to Zulu with accurate spellings."
            icon={BookOpen}
            badgeText={`${alphabetLearnedCount}/26 MASTERED`}
            progressValue={alphabetPercent}
            progressLabel="Alphabet Progress"
            actionText="ENTER ALPHABET OPS"
            onLaunch={() => onNavigate('alphabet')}
            accentColor="cyan"
          />

          {/* Track 2: Digits */}
          <MissionCard
            id="digits-track"
            title="Digit Training"
            subtitle="NUMERALS 0–9"
            description="Learn specialized radio numerals (Wun, Tree, Fife, Niner) designed to cut through channel static."
            icon={Hash}
            badgeText={`${digitsLearnedCount}/10 MASTERED`}
            progressValue={digitsPercent}
            progressLabel="Digits Progress"
            actionText="ENTER DIGIT OPS"
            onLaunch={() => onNavigate('digits')}
            accentColor="amber"
          />

          {/* Track 3: Knowledge Check */}
          <MissionCard
            id="quiz-track"
            title="Knowledge Check"
            subtitle="PROCEDURAL EXAM"
            description="Configurable multiple-choice tests evaluating character-to-code, reverse recall, and pronunciation."
            icon={HelpCircle}
            badgeText={quizAccuracy > 0 ? `BEST ${quizAccuracy}%` : 'READY'}
            progressValue={quizAccuracy}
            progressLabel="Best Quiz Accuracy"
            actionText="START KNOWLEDGE CHECK"
            onLaunch={() => onNavigate('quiz')}
            accentColor="cyan"
          />

          {/* Track 4: Radio Decoder */}
          <MissionCard
            id="decoder-track"
            title="Radio Decoder"
            subtitle="TRANSMISSION SIM"
            description="Interactive teletype simulator: decode incoming radio strings and encode outbound tactical messages."
            icon={Binary}
            badgeText={decoderAccuracy > 0 ? `BEST ${decoderAccuracy}%` : 'ACTIVE'}
            progressValue={decoderAccuracy}
            progressLabel="Decoder High Score"
            actionText="LAUNCH DECODER SIM"
            onLaunch={() => onNavigate('decoder')}
            accentColor="success"
          />
        </div>
      </div>

      {/* Trainee Stats: Rank Ladder & Badges */}
      <TraineeStats progress={progress} currentRank={rank} />
    </div>
  );
};
