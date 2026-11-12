# Embedded Systems Exam Reviewer

A complete, student-friendly exam reviewer for Embedded Systems. It is a working React + TypeScript application with a light dashboard-style interface, one combined 30-item exam, automatic scoring, answer review, study mode, progress saving, polished animations, and responsive layouts.

## Live demo

**https://knznywr-dev.github.io/Embedded-quiz/**

The site is built and deployed automatically by GitHub Actions on every push to `main` (see `.github/workflows/deploy.yml`).

## Quick start

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). Production builds target the GitHub Pages subpath `/Embedded-quiz/`.

To create and preview a production build:

```bash
npm run build
npm run preview
```

## Features

### Exam

- One combined examination containing all 30 items: 20 multiple-choice questions (Items 1–20) followed by 10 identification items (Items 21–30).
- One question at a time, with four randomized choices for the multiple-choice items and a Word Bank reference beside the identification items.
- Previous, Next, grouped item-number navigation, answered/unanswered indicators, and a live overall progress bar with per-section counts.
- Answers save automatically and can be changed before submission.
- Submission requires confirmation and cannot be submitted twice.
- A single combined score out of 30, with correct, incorrect, and unanswered counts.
- Percentage and a simple performance indicator.

### Results and review

- Combined final score out of 30, plus a Section A (multiple choice, 20) and Section B (identification, 10) breakdown.
- Animated score ring, staged review cards, and a confetti burst for results of 75% or higher.
- Answer review for all 30 items with the original question or description, selected answer, correct answer, and explanation.
- Section badges, plus green, red, and neutral-gray states for correct, incorrect, and unanswered items.
- Filter for incorrect and unanswered items.
- Links to Study Mode and the optional Word Bank practice page.
- Retake without deleting saved attempt history.
- Recent attempt history on the dashboard.
- Explicit "Clear saved results" action with confirmation.

### Study mode

- Reviews all 30 items, multiple choice and identification.
- Shows the correct answer and an explanation for each item.
- Grouped item navigation and a progress indicator.
- Switch freely between Study Mode and Exam Mode.
- Study Mode never changes an exam attempt.

### Identification with Word Bank

- Optional standalone **Word Bank Practice** page with its own local score out of 10.
- Exact heading: `B. IDENTIFICATION WITH WORD BANK (Items 21–30)`.
- Exact supplied directions and all 10 Word Bank terms in two columns.
- Ten scored items numbered 21–30, with one description per Word Bank term.
- Each term is used exactly once as the verified answer key.
- Answers are case-insensitive and checked out of 10.
- Per-item feedback, corrections, and explanations appear after **Check Answers**.
- Identification answers and checked state are saved in the browser.
- These same 10 items also count toward the combined exam score.

### Animations and polish

- Page transitions, question transitions, and staggered card entrances.
- Hover-lift cards, button micro-interactions, animated logo, shimmering progress bars, and a ring-draw score animation.
- Confetti on results of 75% or higher.
- All motion respects `prefers-reduced-motion`.

### Data and accessibility

- Progress and history are stored in `localStorage`; no account or backend is needed.
- Responsive from 320 px phones through desktop.
- Keyboard support: `A`–`D` selects an answer in the exam, `←`/`→` changes questions in exam and study mode, and dialogs support Escape and focus trapping.
- Visible focus states, semantic headings, radio-group semantics, and reduced-motion support.

## Content sources

- Multiple-choice content: `src/data/questions.ts`
  - The supplied question wording and correct answers are preserved exactly.
  - Three distractors and a short explanation were written for each item to support the interactive reviewer.
- Identification content: `src/data/identification.ts`
  - Contains the exact heading, directions, and 10 Word Bank terms.
  - Provides ten reviewer-authored descriptions, verifies each answer key against the Word Bank, and uses every term exactly once.

### Editing the identification items

Edit `src/data/identification.ts`. Each item pairs a description with the verified Word Bank term:

```ts
{
  id: 21,
  description: 'Description of the term.',
  acceptedAnswers: ['Compilation'],
  explanation: 'Optional explanation.',
}
```

Rules:

1. Keep exactly ten items, numbered 21–30.
2. Keep exactly 10 Word Bank terms.
3. Use a term from the Word Bank as the accepted answer.
4. Use every Word Bank term exactly once.
5. The ten identification items count toward the combined 30-item exam score; the standalone Word Bank practice page is scored separately.

## Saved data

The app uses these browser storage keys:

- `embedded-reviewer:attempt:v1` — the current attempt and saved answers.
- `embedded-reviewer:history:v1` — up to 25 submitted results.
- `embedded-reviewer:identification:v1` — identification answers and checked state.

Clearing browser data for the site removes saved progress. The dashboard also provides a confirmed **Clear saved results** action.

## Quality checks

```bash
npm run test:run   # 43 automated tests
npm run lint
npm run build
```

Automated coverage includes:

- Exact content audit for all 20 questions and all 20 supplied answers.
- Exact Word Bank order, heading, directions, ten items, and configured status.
- Description and verified answer coverage for every Identification item, with each term used exactly once.
- Four-choice uniqueness and answer inclusion for every question.
- Randomization checks, including a guard against a fixed correct-answer position.
- Combined and per-section scoring test cases:
  - All 30 correct → 30/30 (100%)
  - 10 MCQ correct + 10 identification correct → 20/30 (67%)
  - 15 MCQ correct + 3 wrong + 5 identification correct → 20/30 (67%), with the rest unanswered
  - All unanswered → 0/30 (0%)
  - Identification practice: 10 correct → 10/10 (100%), 8 correct + 1 incorrect + 1 unanswered → 8/10 (80%)
- Full UI flows for starting, selecting, changing answers, navigating across both sections, confirmation, combined submission, results, retake, study mode, and the ten-item Word Bank practice page.
- Local storage save/resume behavior for multiple-choice and identification answers in the same attempt.

Browser QA was also run at 320, 390, 768, 1024, and 1440 px widths with no horizontal overflow and no console errors.

## Project structure

```
src/
  components/      Shared header, footer, dialog, score ring, progress bar
  data/            Authoritative question, answer, and Word Bank content
  lib/             Attempt storage, combined exam steps, scoring, formatting, shuffle helpers
  pages/           Dashboard, Exam, Results, Study, Identification
  test/            Content, scoring, attempt, and UI tests
  App.tsx          Navigation, combined submission, history, and clear-results flow
```

## Limitations

- The ten identification descriptions and explanations were written for this reviewer to complete the Word Bank section; they are supporting review content rather than supplied exam wording.
- Results and history are local to the browser; there is no server, login, or cross-device sync.
- Distractors and explanations are supporting review content, not part of the supplied answer key. The supplied questions and answers remain the source of truth.
