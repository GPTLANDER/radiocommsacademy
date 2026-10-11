# Radio Comms Academy

**Radio Comms Academy** is a futuristic, interactive educational web application designed for school students to master the NATO phonetic alphabet (A–Z) and radiotelephony digits (0–9). Built with a tactical communications console aesthetic, students step into the role of trainee radio operators, progressing from Recruit to Commander through structured learning modules, flashcards, knowledge quizzes, and teletype intercept decoding missions.

---

## 🎯 Features

1. **Mission Control Dashboard**:
   - Trainee rank ladder (Recruit, Cadet, Operator, Specialist, Commander).
   - Live telemetry status, audio-free visual signal waveform, and XP counter.
   - Comprehensive learning completion meter tracking all 36 canonical items.
   - 4 primary training mission cards with one-click launch.

2. **NATO Phonetic Alphabet Module (A–Z)**:
   - All 26 letters with official international spellings (strictly preserving `Alfa` and `Juliett`).
   - Focused study card displaying symbol, code word, pronunciation guide, and historical/operational tips.
   - Quick A–Z matrix navigation grid with real-time status indicators (Understood, Practice Queued, Unreviewed).
   - "Mark Understood" and "Needs Practice" tracking.

3. **Radio Digits Module (0–9)**:
   - All 10 digits with specialized radiotelephony written forms and pronunciation approximations (`Zero` [ZEE-roh], `One` [WUN], `Two` [TOO], `Three` [TREE], `Four` [FOW-er], `Five` [FIFE], `Six` [SIKS], `Seven` [SEV-en], `Eight` [AYT], `Nine` [NIN-er]).
   - Educational clarification note on operational variations across civil aviation and military standards.
   - 0–9 matrix selector.

4. **Flashcard Trainer**:
   - Filter decks by All (36), Alphabet (26), Digits (10), or Flagged for Practice.
   - Tactile card flip interaction (Space/Enter or click).
   - "Got It" and "Practise Again" response buttons.
   - Card shuffle and completion debriefing summary.

5. **Knowledge Check Quiz Engine**:
   - 4 distinct question formats:
     - Letter → Code Word (e.g. *What is the NATO phonetic code word for K?*)
     - Code Word → Letter (e.g. *Which letter is represented by "Bravo"?*)
     - Digit → Written Form (e.g. *Which written word represents radio digit 7?*)
     - Pronunciation → Digit (e.g. *Which digit is pronounced "NIN-er"?*)
   - Guaranteed 4 unique options with correct answer inclusion.
   - Configurable session lengths: 10 or 20 questions, mixed, alphabet-only, digits-only, or missed-only review.
   - Anti-duplicate submission protection and keyboard shortcuts (1–4 keys).
   - ARIA live region instant feedback with educational rationale.

6. **Radio Decoder Simulator**:
   - Interactive teletype transmission simulator.
   - **Decode Direction**: Character sequence (e.g. `K7M2`) → NATO code words (`Kilo Seven Mike Two`).
   - **Encode Direction**: Spoken code words (`Delta Four Golf`) → Character sequence (`D 4 G`).
   - 4 difficulty levels + on-demand randomized mission generator.
   - Quick-select token bank chips (ideal for mobile and younger learners) + manual typing input with smart normalization.
   - Step-by-step token authentication and explanation report.

7. **Gamification & Operator Progression**:
   - Transparent XP rules: 10 XP first-attempt correct, 5 XP retry, 10 XP flashcard completion bonus, 20 XP mission bonus.
   - 5 Trainee Ranks: Recruit (0 XP), Cadet (100 XP), Operator (250 XP), Specialist (500 XP), Commander (1,000 XP).
   - 5 Tactical Achievement Badges (First Transmission, Alphabet Explorer, Digit Decoder, Perfect Mission, Consistent Operator).
   - Anti-farming safeguards preventing duplicate XP awards.

8. **Settings & Local Storage**:
   - Motion toggle supporting OS `prefers-reduced-motion` and manual override.
   - Sound-free visual mode active by default.
   - Two-step confirmation dialog to safely reset all progress.
   - Versioned schema stored strictly in browser `localStorage`.

---

## 🛠️ Technology Stack

- **Framework**: React 18
- **Language**: TypeScript (strict mode)
- **Bundler**: Vite 5
- **Styling**: Tailwind CSS with custom radar palette and HUD tokens
- **Animations**: Framer Motion (respects `prefers-reduced-motion`)
- **Icons**: Lucide React
- **Confetti**: Canvas-Confetti
- **Testing**: Vitest, React Testing Library, `@testing-library/jest-dom`, jsdom
- **Hosting Target**: Cloudflare Pages via GitHub

---

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher (LTS recommended, tested on Node v25)
- **npm**: v9.0.0 or higher

---

## 🚀 Installation & Local Development

1. **Clone or enter the project repository**:
   ```bash
   cd radio-comms-academy
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🧪 Testing

Radio Comms Academy includes a comprehensive test suite testing data integrity, quiz generation, scoring, storage resilience, decoder validation, and React end-to-end user workflows.

Run all tests:
```bash
npm run test
```

Run TypeScript type check:
```bash
npm run typecheck
```

Run code linter:
```bash
npm run lint
```

---

## 📦 Production Build

To build the optimized static production bundle:
```bash
npm run build
```
The output files will be written to the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

---

## 🌐 Cloudflare Pages Deployment Guide

Radio Comms Academy is ready for instant deployment to Cloudflare Pages via GitHub.

### Step 1: Initialize Git and Commit
```bash
git init
git add .
git commit -m "feat: complete production release of Radio Comms Academy"
```

### Step 2: Push to GitHub
```bash
git branch -M main
git remote add origin https://github.com/GPTLANDER/radiocommsacademy.git
git push -u origin main
```

### Step 3: Connect to Cloudflare Pages
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your GitHub repository **`radiocommsacademy`**.
4. In the **Build configuration** screen, set:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (or leave blank)
5. Under **Environment variables**, set (optional):
   - `NODE_VERSION`: `20`
6. Click **Save and Deploy**.
7. Cloudflare Pages will build the site and deploy it to a live `*.pages.dev` domain.

---

## 💾 Progress Storage & Schema Behavior

All trainee progress is stored in the browser's `localStorage` under the namespaced key:
```
radio-comms-academy:progress:v1
```

### Resilience Features:
- **Automatic Fallback**: If localStorage is disabled, private, or throws an error, the application falls back safely to in-memory state without crashing.
- **Corrupted Data Recovery**: Malformed JSON or mutated fields are detected by the schema guard (`isValidProgress`) and gracefully reset to safe defaults.
- **Data Capping**: Recent completed session summaries are capped at 20 entries to prevent localStorage bloat.
- **Reset Confirmation**: Two-step accessible dialog ensures learners do not accidentally erase their hard-earned XP and badges.

---

## 🔒 Privacy & Student Protection

Radio Comms Academy is built specifically for classroom and student safety:
- **No Accounts or Logins**: Students do not sign in or provide email addresses.
- **Zero Telemetry or Analytics**: No tracking cookies, advertising scripts, or remote beaconing.
- **Device-Local Data**: All scores and ranks remain exclusively on the student's browser.
- **Audio-Free Visual Operation**: Operates silently with high-contrast visual signal waveforms, ensuring accessibility in quiet classrooms or environments without headsets.

---

## 📁 Project Structure

```
radio-comms-academy/
├── public/
│   ├── favicon.svg            # Futuristic radar beacon icon
│   ├── robots.txt             # Search engine crawler permissions
│   └── _headers               # Cloudflare Pages security headers
├── src/
│   ├── types/
│   │   └── index.ts           # Shared TypeScript interfaces & types
│   ├── data/
│   │   ├── alphabet.ts        # 26 canonical NATO phonetic alphabet entries
│   │   ├── digits.ts          # 10 canonical radio digits & pronunciation guides
│   │   ├── achievements.ts    # Trainee ranks and achievement criteria
│   │   └── missions.ts        # Preset decoder mission scenarios
│   ├── lib/
│   │   ├── storage.ts         # Resilient storage manager
│   │   ├── quiz-generator.ts  # Unique 4-option question generator
│   │   ├── scoring.ts         # XP calculation, ranks, and anti-farming logic
│   │   └── validation.ts      # Input tokenization and verification
│   ├── hooks/
│   │   ├── useProgress.ts     # Persistent state & learner profile hook
│   │   ├── useReducedMotion.ts# Reduced motion preference listener
│   │   └── useKeyboardShortcut.ts # Console hotkeys listener
│   ├── components/
│   │   ├── common/            # Header, Navigation, ProgressBar, SignalWaveform, ConfirmDialog, AchievementToast
│   │   ├── dashboard/         # MissionBriefing, MissionCard, TraineeStats, DashboardView
│   │   ├── learning/          # EntryGrid, FocusedCard, PronunciationNote, AlphabetView, DigitsView
│   │   ├── flashcards/        # FlashcardSession
│   │   ├── quiz/              # QuizSession, AnswerFeedback, QuizSummary
│   │   ├── decoder/           # DecoderSession
│   │   └── settings/          # SettingsModal
│   ├── styles/
│   │   └── index.css          # Tailwind CSS & futuristic HUD styling
│   ├── App.tsx                # Main application component
│   └── main.tsx               # DOM entrypoint
├── tests/
│   ├── setup.ts               # Test environment setup
│   ├── content.test.ts        # Data integrity tests
│   ├── quiz-generator.test.ts # Quiz generation tests
│   ├── scoring.test.ts        # Scoring & rank tests
│   ├── storage.test.ts        # Storage & corruption recovery tests
│   ├── validation.test.ts     # Decoder token validation tests
│   └── app.test.tsx           # React integration & E2E tests
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 🔧 Troubleshooting

- **Page reloads reset progress**: Ensure your browser is not set to clear site data on exit, and private/incognito mode is not clearing storage on tab close.
- **Shortcuts not triggering**: Make sure an input or text box is not actively focused. Click anywhere on the background to unfocus and use hotkeys.
- **Animations feel slow or disabled**: Check your operating system's "Reduce motion" setting, or toggle "Motion & Animations" to "Full Motion" in Academy Settings.
