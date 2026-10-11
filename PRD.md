# RADIO COMMS ACADEMY
## Product Requirements Document (PRD)

**Version:** 1.0  
**Status:** Ready for implementation  
**Product type:** Interactive educational web application  
**Primary audience:** Children and school students  
**Working title:** Radio Comms Academy  
**Experience:** Futuristic radio operator training simulator  
**Deployment target:** Cloudflare Pages via GitHub

---

## 1. Product Vision

Radio Comms Academy is an interactive learning website that helps students master the NATO phonetic alphabet (A–Z) and radio digit pronunciation (0–9) through visual learning, flashcards, quizzes, simulated radio missions, and progress tracking.

The application should feel like entering a modern communication operations centre. Students become trainee radio operators, learn the code system, complete increasingly challenging missions, and earn ranks as they improve.

The experience must be enjoyable for children without looking childish. Use an authentic technology-inspired interface with restrained futuristic details, clear typography, high readability, and responsive interactions.

### Core product principle

**Learn → Practise → Decode → Complete Missions → Track Progress**

The application must teach the content accurately before testing the learner.

## 2. Goals and Success Criteria

### Primary goals

1. Teach all 26 phonetic alphabet code words.
2. Teach all 10 radio digit names and pronunciation guides.
3. Provide a complete flashcard learning experience.
4. Offer quizzes with instant, informative feedback.
5. Simulate radio communication through text-based decoding challenges.
6. Track learning progress locally on the student's device.
7. Work on desktop, tablet, and mobile browsers.
8. Remain accessible, fast, and usable without audio or a network connection after initial loading.

### MVP acceptance targets

- All 36 learning items are present and correct.
- Every learning mode is usable from beginning to end.
- Every quiz question has a valid answer and appropriate feedback.
- Progress and settings persist after refreshing the page.
- The app has no authentication or backend dependency.
- No dead buttons, placeholder screens, or unfinished navigation.
- No horizontal overflow at supported mobile widths.
- Core learning flows work with a keyboard.
- Production build completes without TypeScript errors.

## 3. Target Users

### Primary users

- School students in approximately Grades 3–12.
- Children learning communication systems, coding concepts, or aviation basics.
- Students participating in STEM clubs, robotics clubs, or communication-themed activities.

### Secondary users

- Teachers conducting classroom activities.
- Parents helping children practise.
- Students revising independently.

### Assumptions

- Learners have basic reading ability or receive teacher assistance.
- No student account is required.
- Progress is personal to the browser and device.
- The interface must use straightforward English and short instructions.

## 4. Scope

### Included in MVP

- Dashboard and mission selection.
- Alphabet learning module.
- Radio digits learning module.
- Interactive flashcards.
- Multiple-choice quizzes.
- Reverse-recall questions.
- Text-only radio decoding missions.
- Instant feedback and score summaries.
- XP, progress indicators, and achievement badges.
- Local progress persistence.
- Responsive layouts.
- Accessibility and reduced-motion support.
- Deployment documentation.

### Explicitly excluded from MVP

- User accounts and authentication.
- Cloud synchronization.
- Server-side databases.
- Multiplayer and online leaderboards.
- Voice recording or speech recognition.
- Required audio playback.
- AI-generated questions or content.
- Paid features, advertising, and third-party tracking.
- Complex 3D scenes or heavy WebGL dependencies.

These features must not be introduced unless separately approved.

## 5. Content Specification

### 5.1 NATO phonetic alphabet

Use the following canonical entries. Preserve the spelling of **Alfa** and **Juliett**.

| Letter | Code word |
|---|---|
| A | Alfa |
| B | Bravo |
| C | Charlie |
| D | Delta |
| E | Echo |
| F | Foxtrot |
| G | Golf |
| H | Hotel |
| I | India |
| J | Juliett |
| K | Kilo |
| L | Lima |
| M | Mike |
| N | November |
| O | Oscar |
| P | Papa |
| Q | Quebec |
| R | Romeo |
| S | Sierra |
| T | Tango |
| U | Uniform |
| V | Victor |
| W | Whiskey |
| X | Xray |
| Y | Yankee |
| Z | Zulu |

### 5.2 Radio digits

| Digit | Written form | Learning pronunciation |
|---|---|---|
| 0 | Zero | ZEE-roh |
| 1 | One | WUN |
| 2 | Two | TOO |
| 3 | Three | TREE |
| 4 | Four | FOW-er |
| 5 | Five | FIFE |
| 6 | Six | SIKS |
| 7 | Seven | SEV-en |
| 8 | Eight | AYT |
| 9 | Nine | NIN-er |

Pronunciation spellings are simplified learning aids, not formal phonetic transcriptions. Explain that operational pronunciation can vary according to the applicable radio procedure.

### 5.3 Content integrity

- Keep learning content in a single typed data module.
- Never duplicate the alphabet or digit data across individual screens.
- Randomize question order without changing the source data.
- Validate that all 36 entries are unique and present.
- Do not silently replace official code-word spellings with alternative spellings.
- Separate display content from quiz-generation logic.

## 6. Information Architecture

The application contains the following primary screens.

### A. Mission Control — Dashboard

The landing screen should display:

- Application logo and title.
- A concise mission briefing.
- Overall learning completion.
- Current trainee rank and XP.
- Alphabet and digit module progress.
- Four primary mission cards:
  1. Alphabet Training
  2. Digit Training
  3. Knowledge Check
  4. Radio Decoder
- A Continue Training action.
- A reset-progress option in settings, with confirmation.

New learners should receive a clear Start Training action.

### B. Learn — Alphabet and Digits

Provide separate alphabet and digit learning views.

Features:

- Browse all entries in a grid or compact list.
- Select an entry to open its learning card.
- Show the character prominently.
- Reveal the corresponding code word or digit details.
- Show a short pronunciation guide for digits.
- Navigate to the previous or next item.
- Mark an item as understood or needing practice.
- Display completion status.
- Filter or select letters and digits.

On small screens, use a responsive grid and a focused learning card instead of squeezing all content into one view.

### C. Flashcard Trainer

A dedicated flashcard practice experience.

Required interactions:

1. Present a letter or digit.
2. Allow the learner to reveal the answer.
3. Show the correct code word or pronunciation.
4. Let the learner mark "Got it" or "Practise again".
5. Move to the next card.
6. Show the session summary when complete.

Include an optional shuffle control and a practice-missed-items mode.

The interface must never rely on color alone to communicate correctness or completion.

### D. Knowledge Check

Provide configurable quiz sessions.

Supported settings:

- Alphabet only.
- Digits only.
- Mixed alphabet and digits.
- Short practice: 10 questions.
- Full practice: 20 questions.
- Review missed questions.

Question formats:

1. Character to code word: "What is the code word for K?"
2. Code word to character: "Which letter is Kilo?"
3. Digit to written form: "Which word represents 7?"
4. Pronunciation recognition by text: "Which digit is pronounced NIN-er?"

Use four answer options where practical. Distractors must be valid, distinct entries from the same learning domain.

### E. Radio Decoder

Simulate radio message decoding using text only.

Example:

**Incoming transmission:** `K7M2`

The learner selects or enters the decoded form:

**Kilo – Seven – Mike – Two**

Provide two mission types:

- Decode: character sequence → code words.
- Encode: code words → character sequence.

Requirements:

- Generate valid messages from the canonical data.
- Start with short messages and increase difficulty.
- Provide a hint option.
- Provide a clear answer-checking action.
- Allow learners to retry.
- Display a completion summary.
- Explain each symbol in the answer review.

Use fictional training call signs and neutral examples. Do not imply that the app is connected to real emergency or military communication networks.

### F. Results and Progress

After each session, show:

- Questions completed.
- Correct answers.
- Accuracy percentage.
- XP earned.
- Items requiring more practice.
- A retry action.
- A return-to-dashboard action.

Track the learner's overall progress across sessions.

### G. Settings

Provide:

- Reduced-motion preference or a control that respects the operating system setting.
- Sound-free visual mode as the default.
- Text-size or display options if practical.
- Reset all progress with explicit confirmation.
- A brief privacy explanation.

Do not introduce unnecessary personal data collection.

## 7. Gamification

### XP system

Use a simple, transparent system:

- Correct first attempt: 10 XP.
- Correct answer after a retry: 5 XP.
- Completing a flashcard session: 10 bonus XP.
- Completing a mission: 20 bonus XP.

Award completion bonuses once per session. Prevent repeated submissions from awarding XP multiple times for the same answer.

### Trainee ranks

Use progression thresholds such as:

- Recruit: 0 XP
- Cadet: 100 XP
- Operator: 250 XP
- Specialist: 500 XP
- Commander: 1,000 XP

Rank labels are illustrative game mechanics, not real military qualifications.

### Achievements

Implement simple unlockable badges:

- First Transmission: complete the first quiz.
- Alphabet Explorer: learn all 26 letters.
- Digit Decoder: learn all 10 digits.
- Perfect Mission: score 100% on a mission.
- Consistent Operator: complete three practice sessions.

Only award achievements when their conditions are actually satisfied.

## 8. UI and Visual Design System

### Design direction

A futuristic communication operations centre, combining an aviation instrument panel with a modern educational game.

### Palette

- Background: near-black navy, approximately #080D18.
- Primary surface: #111B2C.
- Secondary surface: #18253A.
- Main text: #F3F6FC.
- Secondary text: #A9B6CA.
- Accent cyan: #35D9FF.
- Accent amber: #FFC857.
- Success: #35D39A.
- Error: #FF6B78.

Use these as initial design tokens and verify contrast before finalizing them.

### Visual language

- Fine instrument-panel borders.
- Subtle grid patterns and restrained HUD details.
- Compact status labels.
- Large, legible letters and digits.
- Progress rings or simple progress bars.
- Mission status indicators.
- Small, purposeful Framer Motion transitions.
- Clear focus and selected states.

### Avoid

- Excessive neon glow.
- Flashing lights or rapidly animated backgrounds.
- Overly complex 3D effects.
- Generic SaaS dashboard aesthetics.
- Oversized decorative cards.
- Excessive rounded corners.
- Text-heavy walls of instructions.
- Animation that delays learning interactions.

### Responsive behavior

Desktop:
- Sidebar or top navigation.
- Main content area with mission cards and progress.
- Focused training workspace.

Tablet:
- Collapsible navigation.
- Two-column layouts where suitable.

Mobile:
- Compact header.
- Single-column mission layout.
- Touch-friendly controls.
- No hover-only interactions.
- Persistent, accessible navigation.
- Quiz answers displayed in a comfortable vertical arrangement.

## 9. Technology Architecture

### Required stack

- React
- TypeScript with strict mode
- Vite
- Tailwind CSS
- Framer Motion
- Browser localStorage

Use compatible, stable package versions at implementation time. Do not install libraries that are unnecessary for the MVP.

### Architecture principles

- Client-side application only.
- Reusable UI components.
- Centralized content data.
- Typed quiz questions and session state.
- A dedicated progress-storage utility.
- Deterministic score calculation.
- No backend API calls.
- No required third-party runtime services.
- Graceful handling of missing or invalid localStorage data.

### Suggested project structure

radio-comms-academy/
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── components/
│   │   ├── AppShell.tsx
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   ├── MissionCard.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Flashcard.tsx
│   │   ├── QuizQuestion.tsx
│   │   ├── AnswerFeedback.tsx
│   │   ├── RadioMessage.tsx
│   │   ├── ResultsSummary.tsx
│   │   └── ConfirmDialog.tsx
│   ├── data/
│   │   ├── alphabet.ts
│   │   ├── digits.ts
│   │   ├── achievements.ts
│   │   └── missions.ts
│   ├── features/
│   │   ├── dashboard/
│   │   ├── learning/
│   │   ├── flashcards/
│   │   ├── quiz/
│   │   ├── decoder/
│   │   └── progress/
│   ├── hooks/
│   │   ├── useProgress.ts
│   │   └── useReducedMotion.ts
│   ├── lib/
│   │   ├── storage.ts
│   │   ├── quiz-generator.ts
│   │   ├── scoring.ts
│   │   └── validation.ts
│   ├── types/
│   │   └── index.ts
│   ├── styles/
│   │   └── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── tests/
│   ├── content.test.ts
│   ├── quiz-generator.test.ts
│   ├── scoring.test.ts
│   └── storage.test.ts
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── PRD.md

This structure is a target, not a requirement to create empty files. Implement complete modules and avoid unnecessary abstraction.

## 10. Data Models

### Learning entry

Each entry should contain:

- id
- category: alphabet or digit
- symbol
- displayName
- codeWord, where applicable
- pronunciationGuide, where applicable
- sortOrder

### Quiz question

Each question should contain:

- id
- type
- prompt
- options
- correctAnswerId
- relatedEntryIds
- explanation

Question generation must guarantee that the correct answer is included and options are unique.

### Session result

Each completed session should contain:

- sessionId
- mode
- startedAt
- completedAt
- totalQuestions
- correctCount
- accuracy
- xpEarned
- missedEntryIds

### Persistent progress

Store a versioned object containing:

- schemaVersion
- totalXP
- completedSessionCount
- learnedEntryIds
- needsPracticeEntryIds
- bestScoresByMode
- unlockedAchievementIds
- recentSessionSummaries
- settings

Do not store names, email addresses, dates of birth, or other personal information.

## 11. State and Storage

Use localStorage under a namespaced key such as:

radio-comms-academy:progress:v1

Requirements:

- Load and validate persisted data at application startup.
- Provide safe defaults when no saved progress exists.
- Handle malformed JSON without crashing.
- Handle storage access failures gracefully.
- Save meaningful progress changes.
- Avoid writing to localStorage on every animation frame or keystroke.
- Version the storage schema.
- Provide a reset option with confirmation.
- Keep current quiz answers and completed session state consistent.
- Never count the same answer submission twice.

Progress is browser-specific and is not guaranteed to survive clearing site data or changing devices. Explain this to learners in plain language.

## 12. Accessibility

Target WCAG 2.2 AA where applicable.

- Use semantic HTML and meaningful headings.
- Ensure complete keyboard navigation.
- Show a clear visible focus indicator.
- Provide adequate text and control contrast.
- Use buttons for actions and links for navigation.
- Provide accessible labels for controls.
- Announce quiz feedback through an appropriate live region.
- Do not rely on color alone for correctness.
- Respect prefers-reduced-motion.
- Avoid flashing effects and unnecessary movement.
- Ensure controls have comfortable touch targets.
- Keep text readable when enlarged.
- Provide useful error messages.
- Make focus behavior predictable after answering or changing screens.
- Avoid time limits in the default quiz experience.

## 13. Security and Privacy

- No authentication or backend.
- No external analytics by default.
- No tracking cookies.
- No collection of personally identifiable student data.
- Do not use dangerouslySetInnerHTML for ordinary content.
- Render user-entered decoder answers as text.
- Validate and bound user inputs.
- Do not trust persisted localStorage values without validation.
- Keep dependencies minimal and audit them before deployment.

## 14. Testing Strategy

### Content tests

- Exactly 26 unique letters and 10 unique digits.
- Correct canonical alphabet spellings.
- Correct digit names and pronunciation guides.
- No missing or duplicate IDs.

### Quiz tests

- Every question has a correct answer.
- Every option list contains unique answers.
- Every correct answer is included among the options.
- Distractors are valid.
- Score calculation handles zero questions safely.
- Retries and answer submissions cannot duplicate XP.

### Storage tests

- Empty storage loads defaults.
- Valid progress restores correctly.
- Malformed JSON falls back safely.
- Unsupported schema versions are handled safely.
- Reset removes application progress.
- Storage exceptions do not crash the application.

### End-to-end scenarios

1. A new learner starts at the dashboard.
2. Learner completes alphabet training.
3. Learner completes digit training.
4. Learner answers a mixed quiz.
5. Learner receives immediate feedback.
6. Learner completes a radio decoding mission.
7. Results and XP are displayed correctly.
8. Refreshing the page preserves progress.
9. Resetting progress returns the learner to the initial state.
10. The full flow works on mobile and with a keyboard.

## 15. Performance and Quality

- Lazy-load routes or larger features if justified.
- Avoid heavy WebGL and 3D dependencies.
- Minimize layout shifts.
- Use CSS for simple HUD and grid effects.
- Keep animation short and purposeful.
- Provide a functional interface even if motion is disabled.
- Optimize the production bundle.
- Test the production build, not just the development server.

Targets:
- Lighthouse Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

Treat these as verification targets, not guaranteed scores.

## 16. Deployment

### Preferred deployment: Cloudflare Pages via GitHub

1. Create the React + TypeScript + Vite project.
2. Install dependencies and configure Tailwind CSS.
3. Implement the full application.
4. Run linting, type checks, unit tests, and production build.
5. Verify the built site locally.
6. Initialize a Git repository.
7. Push the project to a GitHub repository.
8. In Cloudflare Pages, create a project connected to the repository.
9. Configure:
   - Framework preset: Vite
   - Build command: npm run build
   - Build output directory: dist
   - Node.js version: a supported LTS version
10. Deploy and test the production URL.
11. Configure a custom domain if required.

If client-side routing is used, configure fallback behavior so refreshing a nested route serves the application entry point. Verify this on the actual deployment platform.

### Required package scripts

- dev
- build
- preview
- lint
- typecheck
- test

Use a lockfile and commit it to Git.

## 17. Definition of Done

The MVP is complete only when:

- All content is implemented.
- Every navigation destination works.
- All learning modes are functional.
- Quizzes provide accurate feedback and scores.
- Radio decoding supports both directions.
- XP, achievements, and progress work as specified.
- Progress persists locally and can be reset.
- The interface is responsive and keyboard accessible.
- Reduced-motion preferences are respected.
- Automated tests pass.
- Production build succeeds.
- README includes installation, testing, build, and deployment instructions.
- No placeholder content or dead controls remain.

## 18. Implementation Order

Phase 1 — Foundation:
Project setup, tokens, content data, app shell, navigation.

Phase 2 — Learning:
Alphabet module, digit module, flashcard trainer.

Phase 3 — Assessment:
Quiz generator, question interface, answer feedback, results.

Phase 4 — Missions:
Radio decoder, difficulty progression, mission completion.

Phase 5 — Persistence:
XP, achievements, local progress, reset and recovery behavior.

Phase 6 — Quality:
Responsive testing, accessibility, automated tests, performance.

Phase 7 — Release:
Production build, README, GitHub, Cloudflare Pages deployment.

**Final principle:** Ship one polished, complete learning experience. Do not sacrifice functionality or accessibility for decorative effects.