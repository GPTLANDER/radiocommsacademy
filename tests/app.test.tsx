import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { App } from '../src/App';
import { STORAGE_KEY } from '../src/lib/storage';

describe('App Integration & End-to-End Scenarios', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const getNav = () => screen.getByRole('navigation', { name: /Academy Main Navigation/i });

  it('renders mission control dashboard for a new trainee', () => {
    render(<App />);

    expect(screen.getAllByText(/RADIO COMMS ACADEMY/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Welcome to Radio Comms Academy, Trainee/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ENTER ALPHABET OPS/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ENTER DIGIT OPS/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /START KNOWLEDGE CHECK/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /LAUNCH DECODER SIM/i })).toBeInTheDocument();
  });

  it('navigates to Alphabet training and marks items understood', async () => {
    render(<App />);

    // Click Alphabet nav tab
    const nav = getNav();
    const alphabetTab = within(nav).getByRole('button', { name: /Alphabet/i });
    fireEvent.click(alphabetTab);

    // Verify Alphabet view is active
    await waitFor(() => {
      expect(screen.getByText(/NATO PHONETIC ALPHABET \(26 LETTERS\)/i)).toBeInTheDocument();
    });
    expect(screen.getAllByText('Alfa').length).toBeGreaterThan(0);

    // Mark Understood
    const markBtn = screen.getByRole('button', { name: /MARK UNDERSTOOD/i });
    fireEvent.click(markBtn);

    // Verify it updates status
    await waitFor(() => {
      expect(screen.getAllByText(/UNDERSTOOD/i).length).toBeGreaterThan(0);
    });

    // Check localStorage was updated
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
    expect(saved.learnedEntryIds).toContain('alpha-a');
  });

  it('navigates to Digit training and displays pronunciation guide', async () => {
    render(<App />);

    const nav = getNav();
    const digitsTab = within(nav).getByRole('button', { name: /Digits/i });
    fireEvent.click(digitsTab);

    await waitFor(() => {
      expect(screen.getByText(/RADIO DIGITS \(0–9\) & PRONUNCIATION/i)).toBeInTheDocument();
    });
    expect(screen.getAllByText('Zero').length).toBeGreaterThan(0);
    expect(screen.getByText(/ZEE-roh/i)).toBeInTheDocument();
  });

  it('interacts with flashcards trainer and flips card', async () => {
    render(<App />);

    const nav = getNav();
    const cardsTab = within(nav).getByRole('button', { name: /Flashcards/i });
    fireEvent.click(cardsTab);

    await waitFor(() => {
      expect(screen.getByText(/TRANSMISSION PROMPT/i)).toBeInTheDocument();
    });

    // Click flashcard to flip
    const card = screen.getByRole('button', { name: /Flashcard:/i });
    fireEvent.click(card);

    // Verify back of card is shown
    await waitFor(() => {
      expect(screen.getByText(/CANONICAL RESPONSE/i)).toBeInTheDocument();
    });

    // Click "GOT IT"
    const gotItBtn = screen.getByRole('button', { name: /GOT IT/i });
    fireEvent.click(gotItBtn);

    // Card advances
    expect(screen.getByText(/TRANSMISSION PROMPT/i)).toBeInTheDocument();
  });

  it('allows typing flashcard answers, cross-checks case-insensitively, and awards points', async () => {
    render(<App />);

    const nav = getNav();
    const cardsTab = within(nav).getByRole('button', { name: /Flashcards/i });
    fireEvent.click(cardsTab);

    await waitFor(() => {
      expect(screen.getByText(/TRANSMISSION PROMPT/i)).toBeInTheDocument();
    });

    // Find input and type answer in lowercase ('alfa')
    const input = screen.getByPlaceholderText(/e\.g\. alfa/i);
    fireEvent.change(input, { target: { value: 'alfa' } });

    // Submit via CHECK button
    const checkBtn = screen.getByRole('button', { name: /^CHECK$/i });
    fireEvent.click(checkBtn);

    // Verify cross-check was successful and XP awarded
    await waitFor(() => {
      expect(screen.getByText(/VERIFIED MATCH — CORRECT!/i)).toBeInTheDocument();
      expect(screen.getByText(/\+10 XP/i)).toBeInTheDocument();
      expect(screen.getByText(/CANONICAL RESPONSE/i)).toBeInTheDocument();
    });

    // Verify it automatically advances to the next flashcard
    await waitFor(
      () => {
        expect(screen.getByText(/Card 2 of 36/i)).toBeInTheDocument();
      },
      { timeout: 2500 }
    );
  });

  it('takes a knowledge check quiz and receives feedback', async () => {
    render(<App />);

    const nav = getNav();
    const quizTab = within(nav).getByRole('button', { name: /Knowledge Check/i });
    fireEvent.click(quizTab);

    await waitFor(() => {
      expect(screen.getByText(/PROCEDURAL EVALUATION/i)).toBeInTheDocument();
    });

    // Start quiz
    const startBtn = screen.getByRole('button', { name: /START KNOWLEDGE CHECK/i });
    fireEvent.click(startBtn);

    // A question prompt is displayed
    await waitFor(() => {
      expect(screen.getByText(/QUESTION 1 OF/i)).toBeInTheDocument();
    });

    // Select first option
    const optionButtons = screen.getAllByRole('button').filter((b) =>
      b.className.includes('rounded-xl')
    );
    expect(optionButtons.length).toBe(4);
    fireEvent.click(optionButtons[0]);

    // Feedback is shown
    await waitFor(() => {
      expect(
        screen.getByText(/TRANSMISSION VERIFIED|SIGNAL MISMATCH/i)
      ).toBeInTheDocument();
    });

    // Duplicate clicks should not fail or re-award
    fireEvent.click(optionButtons[0]);
    expect(
      screen.getByText(/TRANSMISSION VERIFIED|SIGNAL MISMATCH/i)
    ).toBeInTheDocument();
  });

  it('runs radio decoder mission and verifies answer', async () => {
    render(<App />);

    const nav = getNav();
    const decoderTab = within(nav).getByRole('button', { name: /Radio Decoder/i });
    fireEvent.click(decoderTab);

    await waitFor(() => {
      expect(screen.getByText(/MISSION INTERCEPT CONSOLE/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/TRANSMISSION RECEIVED/i)).toBeInTheDocument();

    // Mission 1 is A3 (direction: decode -> 'Alfa Three')
    const input = screen.getByPlaceholderText(/e\.g\. Kilo Seven Mike Two/i);
    fireEvent.change(input, { target: { value: 'Alfa Three' } });

    const authBtn = screen.getByRole('button', { name: /AUTHENTICATE TRANSMISSION/i });
    fireEvent.click(authBtn);

    await waitFor(() => {
      expect(screen.getByText(/TRANSMISSION AUTHENTICATED/i)).toBeInTheDocument();
      expect(screen.getByText(/MISSION SUCCESS/i)).toBeInTheDocument();
    });
  });

  it('opens settings and resets progress', async () => {
    // Seed some progress first
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        totalXP: 450,
        completedSessionCount: 3,
        learnedEntryIds: ['alpha-a'],
        needsPracticeEntryIds: [],
        bestScoresByMode: {},
        unlockedAchievementIds: [],
        recentSessionSummaries: [],
        settings: {
          reducedMotion: 'system',
          soundVisualOnly: true,
          displayDensity: 'comfortable',
        },
      })
    );

    render(<App />);

    // Total XP in header and stats should show 450
    expect(screen.getAllByText('450').length).toBeGreaterThan(0);

    // Open settings
    const settingsBtn = screen.getByRole('button', { name: /Open Academy Settings/i });
    fireEvent.click(settingsBtn);

    expect(screen.getByText(/ACADEMY SETTINGS & CONTROLS/i)).toBeInTheDocument();

    // Click Reset All
    const resetBtn = screen.getByRole('button', { name: /Reset All/i });
    fireEvent.click(resetBtn);

    // Confirm dialog appears
    expect(screen.getByText(/Confirm Total Progress Reset/i)).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: /Reset Everything/i });
    fireEvent.click(confirmBtn);

    // Progress reset to 0
    await waitFor(() => {
      expect(screen.getAllByText('0').length).toBeGreaterThan(0);
    });
  });
});
