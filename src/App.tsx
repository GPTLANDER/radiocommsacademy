import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from './hooks/useProgress';
import { useReducedMotion } from './hooks/useReducedMotion';
import { LearningMode } from './types';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { AchievementToast } from './components/common/AchievementToast';
import { DashboardView } from './components/dashboard/DashboardView';
import { AlphabetView } from './components/learning/AlphabetView';
import { DigitsView } from './components/learning/DigitsView';
import { FlashcardSession } from './components/flashcards/FlashcardSession';
import { QuizSession } from './components/quiz/QuizSession';
import { DecoderSession } from './components/decoder/DecoderSession';
import { SettingsModal } from './components/settings/SettingsModal';

export const App: React.FC = () => {
  const {
    progress,
    rank,
    nextRankProgress,
    alphabetLearnedCount,
    digitsLearnedCount,
    totalLearnedCount,
    overallCompletionPercent,
    latestUnlockedAchievement,
    markEntryLearned,
    markEntryNeedsPractice,
    recordSessionCompletion,
    updateSettings,
    resetAllProgress,
    dismissAchievementAlert,
    addXP,
  } = useProgress();

  const [currentMode, setCurrentMode] = useState<LearningMode>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const reducedMotion = useReducedMotion(progress.settings.reducedMotion);

  const learnedIdsSet = new Set(progress.learnedEntryIds);
  const needsPracticeIdsSet = new Set(progress.needsPracticeEntryIds);

  const transitionVariants = {
    initial: { opacity: 0, y: reducedMotion ? 0 : 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: reducedMotion ? 0 : -8, transition: { duration: 0.15 } },
  };

  return (
    <div className="min-h-screen flex flex-col bg-radar-bg text-radar-text hud-grid selection:bg-radar-cyan selection:text-radar-bg">
      {/* Tactical Console Header */}
      <Header
        rank={rank}
        totalXP={progress.totalXP}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onNavigateHome={() => setCurrentMode('dashboard')}
      />

      {/* Main Navigation Bar */}
      <Navigation
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        needsPracticeCount={progress.needsPracticeEntryIds.length}
      />

      {/* Achievement Toast */}
      <AchievementToast
        achievement={latestUnlockedAchievement}
        onDismiss={dismissAchievementAlert}
        reducedMotion={reducedMotion}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8" id="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMode}
            variants={transitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {currentMode === 'dashboard' && (
              <DashboardView
                progress={progress}
                rank={rank}
                nextRankProgress={nextRankProgress}
                alphabetLearnedCount={alphabetLearnedCount}
                digitsLearnedCount={digitsLearnedCount}
                totalLearnedCount={totalLearnedCount}
                overallCompletionPercent={overallCompletionPercent}
                onNavigate={setCurrentMode}
              />
            )}

            {currentMode === 'alphabet' && (
              <AlphabetView
                learnedIds={learnedIdsSet}
                needsPracticeIds={needsPracticeIdsSet}
                onMarkLearned={markEntryLearned}
                onMarkNeedsPractice={markEntryNeedsPractice}
                onNavigate={setCurrentMode}
              />
            )}

            {currentMode === 'digits' && (
              <DigitsView
                learnedIds={learnedIdsSet}
                needsPracticeIds={needsPracticeIdsSet}
                onMarkLearned={markEntryLearned}
                onMarkNeedsPractice={markEntryNeedsPractice}
                onNavigate={setCurrentMode}
              />
            )}

            {currentMode === 'flashcards' && (
              <FlashcardSession
                learnedIds={learnedIdsSet}
                needsPracticeIds={needsPracticeIdsSet}
                onMarkLearned={markEntryLearned}
                onMarkNeedsPractice={markEntryNeedsPractice}
                onSessionComplete={recordSessionCompletion}
                onAddXP={addXP}
              />
            )}

            {currentMode === 'quiz' && (
              <QuizSession
                needsPracticeIds={needsPracticeIdsSet}
                onSessionComplete={recordSessionCompletion}
                onReturnDashboard={() => setCurrentMode('dashboard')}
              />
            )}

            {currentMode === 'decoder' && (
              <DecoderSession
                onSessionComplete={recordSessionCompletion}
                onReturnDashboard={() => setCurrentMode('dashboard')}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        settings={progress.settings}
        onUpdateSettings={updateSettings}
        onResetProgress={resetAllProgress}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Tactical Footer */}
      <footer className="border-t border-radar-border bg-radar-bg/90 py-4 px-4 sm:px-8 mt-auto text-xs font-tactical text-radar-dim">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="text-radar-muted font-bold">RADIO COMMS ACADEMY</span> &bull;
            <span> NATO Phonetic &amp; Radiotelephony Training Simulator</span>
          </div>
          <div className="flex items-center gap-4">
            <span>CLIENT-ONLY &bull; ZERO TRACKING</span>
            <span>STORAGE: LOCAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
