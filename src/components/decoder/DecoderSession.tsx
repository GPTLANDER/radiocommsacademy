import React, { useState } from 'react';
import {
  Binary,
  RotateCcw,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  Award,
  Zap,
} from 'lucide-react';
import { PRESET_DECODER_MISSIONS } from '../../data/missions';
import { DecoderMission, SessionResult, DecoderDirection } from '../../types';
import {
  verifyDecoderAnswer,
  VerificationResult,
  generateRandomSequence,
} from '../../lib/validation';
import { ALPHABET_DATA } from '../../data/alphabet';
import { DIGIT_DATA } from '../../data/digits';
import { BONUS_XP_MISSION_COMPLETION } from '../../lib/scoring';
import { SignalWaveform } from '../common/SignalWaveform';

interface DecoderSessionProps {
  onSessionComplete: (result: SessionResult) => void;
  onReturnDashboard: () => void;
}

export const DecoderSession: React.FC<DecoderSessionProps> = ({
  onSessionComplete,
}) => {
  const [selectedMissionIndex, setSelectedMissionIndex] = useState<number>(0);
  const [currentMission, setCurrentMission] = useState<DecoderMission>(
    PRESET_DECODER_MISSIONS[0]
  );
  const [userInput, setUserInput] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const [missionComplete, setMissionComplete] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());

  // Available token bank for quick-click input (helpful for younger students and mobile)
  const tokenBank = currentMission.direction === 'decode'
    ? [...ALPHABET_DATA, ...DIGIT_DATA].map((e) => e.codeWord)
    : [...ALPHABET_DATA, ...DIGIT_DATA].map((e) => e.symbol);

  const handleSelectMission = (idx: number) => {
    const m = PRESET_DECODER_MISSIONS[idx];
    setSelectedMissionIndex(idx);
    setCurrentMission(m);
    setUserInput('');
    setShowHint(false);
    setVerification(null);
    setAttempts(0);
    setMissionComplete(false);
  };

  const handleGenerateRandom = (dir: DecoderDirection, length: number) => {
    const { sequence, decodedTokens } = generateRandomSequence(length);
    const customMission: DecoderMission = {
      id: `random-${Date.now()}`,
      level: length,
      title: `Tactical Intercept ${length}-Alpha`,
      direction: dir,
      sequence: dir === 'decode' ? sequence : decodedTokens.join(' '),
      targetTokens: dir === 'decode' ? decodedTokens : sequence.split(''),
      hint: dir === 'decode' ? `First item is ${decodedTokens[0]}` : `First symbol is ${sequence[0]}`,
      contextCallsign: `INTERCEPT SQUADRON ${length}`,
    };
    setCurrentMission(customMission);
    setUserInput('');
    setShowHint(false);
    setVerification(null);
    setAttempts(0);
    setMissionComplete(false);
  };

  const handleAppendToken = (tok: string) => {
    setUserInput((prev) => (prev ? `${prev.trim()} ${tok}` : tok));
  };

  const handleClearInput = () => {
    setUserInput('');
    setVerification(null);
  };

  const handleVerify = () => {
    if (!userInput.trim()) return;

    const result = verifyDecoderAnswer(
      userInput,
      currentMission.targetTokens,
      currentMission.direction
    );

    setVerification(result);
    setAttempts((a) => a + 1);

    if (result.isCompleteMatch) {
      setMissionComplete(true);
      const earnedXP = attempts === 0 ? BONUS_XP_MISSION_COMPLETION : 10;

      const session: SessionResult = {
        sessionId: `decoder-${Date.now()}`,
        mode: 'decoder',
        startedAt: startTime,
        completedAt: Date.now(),
        totalQuestions: currentMission.targetTokens.length,
        correctCount: currentMission.targetTokens.length,
        accuracy: result.accuracy,
        xpEarned: earnedXP,
        missedEntryIds: [],
      };

      onSessionComplete(session);
    }
  };

  const handleRetryMission = () => {
    setUserInput('');
    setVerification(null);
    setMissionComplete(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Tactical mission selector bar */}
      <div className="hud-panel p-4 bg-radar-surface border border-radar-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="font-tactical text-[11px] text-radar-cyan uppercase tracking-wider block font-bold">
            MISSION INTERCEPT CONSOLE
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-radar-muted font-tactical">PRESETS:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-tactical text-xs">
              {PRESET_DECODER_MISSIONS.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => handleSelectMission(idx)}
                  className={`px-2.5 py-1 rounded transition-colors font-semibold ${
                    selectedMissionIndex === idx && currentMission.id === m.id
                      ? 'bg-radar-cyan text-radar-bg'
                      : 'bg-radar-surface2 text-radar-muted hover:text-radar-text'
                  }`}
                >
                  L{m.level} {m.direction === 'decode' ? 'DEC' : 'ENC'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Custom Random Mission */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleGenerateRandom('decode', 4)}
            className="px-2.5 py-1 rounded bg-radar-surface2 hover:bg-radar-border text-radar-muted hover:text-radar-text text-xs font-tactical border border-radar-border"
          >
            + Random 4-Code
          </button>
          <button
            onClick={() => handleGenerateRandom('encode', 4)}
            className="px-2.5 py-1 rounded bg-radar-surface2 hover:bg-radar-border text-radar-muted hover:text-radar-text text-xs font-tactical border border-radar-border"
          >
            + Random Encode
          </button>
        </div>
      </div>

      {/* Main Terminal Screen */}
      <div className="hud-panel p-6 sm:p-8 bg-radar-surface border-2 border-radar-border shadow-2xl space-y-6 hud-bezel-top">
        {/* Terminal Header Telemetry */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-radar-border text-xs font-tactical">
          <div className="flex items-center gap-2">
            <Binary className="w-4 h-4 text-radar-cyan" />
            <span className="text-radar-cyan uppercase font-bold">
              {currentMission.title}
            </span>
            <span className="text-radar-dim">|</span>
            <span className="text-radar-amber font-mono font-semibold">
              DIFFICULTY LEVEL {currentMission.level}
            </span>
          </div>

          <SignalWaveform frequency="121.500 MHz" />
        </div>

        {/* Incoming Transmission Display */}
        <div className="bg-radar-bg p-5 sm:p-6 rounded-xl border-2 border-radar-border text-center space-y-2 relative overflow-hidden">
          <div className="text-[11px] font-tactical text-radar-muted uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-radar-cyan animate-pulse" />
            <span>TRANSMISSION RECEIVED &bull; {currentMission.contextCallsign || 'RELAY STATION'}</span>
          </div>

          <div className="font-mono text-3xl sm:text-4xl md:text-5xl font-extrabold text-radar-text tracking-widest py-2">
            {currentMission.sequence}
          </div>

          <div className="text-xs font-tactical text-radar-cyan">
            {currentMission.direction === 'decode'
              ? 'OBJECTIVE: Decode incoming character sequence into canonical NATO code words.'
              : 'OBJECTIVE: Encode incoming phonetic message into character/digit sequence.'}
          </div>
        </div>

        {/* Hint button & reveal */}
        <div className="flex items-center justify-between text-xs font-tactical">
          <button
            onClick={() => setShowHint((h) => !h)}
            className="text-radar-amber hover:text-radar-amber/80 flex items-center gap-1.5 p-1 rounded focus-visible:ring-1 focus-visible:ring-radar-cyan"
          >
            <Lightbulb className="w-4 h-4" />
            <span>{showHint ? 'HIDE HINT' : 'REQUEST HINT'}</span>
          </button>

          {showHint && (
            <span className="text-radar-amber font-mono bg-radar-surface2 px-2.5 py-1 rounded border border-radar-amber/30">
              {currentMission.hint}
            </span>
          )}
        </div>

        {/* Input area */}
        <div className="space-y-3">
          <label
            htmlFor="decoder-input"
            className="text-xs font-tactical text-radar-muted uppercase block font-semibold"
          >
            TRANSMISSION RESPONSE (SEPARATE TOKENS BY SPACES OR CLICK CHIPS BELOW)
          </label>
          <div className="relative">
            <input
              id="decoder-input"
              type="text"
              value={userInput}
              onChange={(e) => {
                setUserInput(e.target.value);
                setVerification(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleVerify();
                }
              }}
              placeholder={
                currentMission.direction === 'decode'
                  ? 'e.g. Kilo Seven Mike Two'
                  : 'e.g. K 7 M 2'
              }
              disabled={missionComplete}
              className="w-full px-4 py-3 bg-radar-surface2 border-2 border-radar-border focus:border-radar-cyan rounded-lg text-radar-text font-mono text-sm sm:text-base tracking-wider placeholder:text-radar-dim focus:outline-none transition-colors"
            />
            {userInput && !missionComplete && (
              <button
                onClick={handleClearInput}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-tactical text-radar-dim hover:text-radar-text px-2 py-1 bg-radar-surface rounded border border-radar-border"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Token Bank Chips */}
          {!missionComplete && (
            <div className="pt-2">
              <span className="text-[11px] font-tactical text-radar-dim block mb-1.5 uppercase">
                QUICK-SELECT TOKENS:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-radar-surface2/40 border border-radar-border/60 rounded-lg">
                {tokenBank.slice(0, 36).map((tok) => (
                  <button
                    key={tok}
                    onClick={() => handleAppendToken(tok)}
                    className="px-2.5 py-1 rounded bg-radar-surface hover:bg-radar-cyan hover:text-radar-bg text-radar-text font-tactical text-xs border border-radar-border transition-colors font-semibold"
                  >
                    {tok}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Verification Result Breakdown */}
        {verification && (
          <div
            className={`p-4 rounded-lg border-2 space-y-3 animate-in fade-in zoom-in-95 duration-150 ${
              verification.isCompleteMatch
                ? 'bg-radar-success-dim/40 border-radar-success shadow-hud-success'
                : 'bg-radar-error-dim/40 border-radar-error'
            }`}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {verification.isCompleteMatch ? (
                  <CheckCircle className="w-5 h-5 text-radar-success" />
                ) : (
                  <HelpCircle className="w-5 h-5 text-radar-error" />
                )}
                <span
                  className={`font-tactical text-xs font-bold uppercase tracking-wider ${
                    verification.isCompleteMatch
                      ? 'text-radar-success'
                      : 'text-radar-error'
                  }`}
                >
                  {verification.isCompleteMatch
                    ? 'TRANSMISSION AUTHENTICATED — COMPLETE'
                    : 'INTERCEPT ERROR — VERIFY TOKENS'}
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-radar-text">
                ACCURACY: {verification.accuracy}%
              </span>
            </div>

            {/* Step by step tokens verification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-tactical text-xs">
              {verification.tokens.map((tok, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded border flex items-center justify-between gap-2 ${
                    tok.isCorrect
                      ? 'bg-radar-surface/80 border-radar-success/50 text-radar-success'
                      : 'bg-radar-surface/80 border-radar-error/50 text-radar-error'
                  }`}
                >
                  <div>
                    <span className="font-bold font-mono">
                      Step {i + 1}: {tok.inputToken || 'MISSING'}
                    </span>
                    <span className="block text-[11px] text-radar-muted font-normal">
                      {tok.explanation}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase">
                    {tok.isCorrect ? 'VALID' : 'FAIL'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 font-tactical text-xs">
          {!missionComplete ? (
            <button
              onClick={handleVerify}
              disabled={!userInput.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-radar-cyan hover:bg-radar-cyan/90 disabled:opacity-50 text-radar-bg font-bold shadow-hud-cyan transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              <CheckCircle className="w-4 h-4" />
              <span>AUTHENTICATE TRANSMISSION</span>
            </button>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-radar-surface2 rounded-lg border border-radar-success/40">
              <div className="flex items-center gap-2 text-radar-success font-bold">
                <Award className="w-5 h-5" />
                <span>MISSION SUCCESS (+20 XP BONUS)</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleRetryMission}
                  className="px-4 py-2 rounded bg-radar-surface text-radar-text border border-radar-border flex items-center gap-1 font-bold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Repeat</span>
                </button>
                <button
                  onClick={() =>
                    handleSelectMission((selectedMissionIndex + 1) % PRESET_DECODER_MISSIONS.length)
                  }
                  className="px-4 py-2 rounded bg-radar-cyan text-radar-bg font-bold shadow-hud-cyan flex items-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Next Mission</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
