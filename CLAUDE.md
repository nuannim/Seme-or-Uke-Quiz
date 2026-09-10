# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

"Seme or Uke Quiz" — a Thai-language personality quiz web app (vanilla HTML/CSS/JS + Vite, no framework). Users answer 20 questions, watch a YouTube-embedded song during a simulated analysis progress bar, then get a Seme/Uke result with a shareable Canvas-generated story image (1080x1920).

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — build to `dist/` (gitignored; only needed for deployment, not for local editing)
- `npm run preview` — preview the production build

There is no automated test runner/lint config in this project (no Jest/Vitest/ESLint). "Tests" here are manual QA checklists — see Testing conventions below.

## Architecture

Single-page app with three sections toggled via CSS class (`.section.active`) in `index.html`: `#intro-section` → `#quiz-section` → `#result-section`. All logic lives in one file, `app.js` (no bundler-driven module split), styled by one `style.css`.

### Data loading (important quirk)

Quiz content is NOT imported as JS modules — it's fetched at runtime as JSON-shaped `.js` files from `public/data/` (`qna3.js`, `result.js`, `song.js`), parsed with `JSON.parse` after a manual comment-stripping step (see `cleanJson` in `app.js`). This is intentional (see `my-task.md`) so content can be edited without a rebuild. `vite.config.js` has a dev-server middleware that intercepts `data/qna.js`, `data/qna3.js`, `data/result.js`, `data/song.js` and serves them from `public/data/` with a `application/json` content-type.

Requests are cache-busted with `?_=${Date.now()}`. If fetch fails (e.g. opened via `file://`), `init()` in `app.js` falls back to a hardcoded copy of the full 20-question set embedded directly in the source — keep this fallback in sync if you edit `qna3.js`.

- `public/data/qna3.js` — **the active question set** (20 questions × 4 choices, each choice has `seme`/`uke` point weights). `qna.js`/`qna2.js` are earlier/legacy versions (3-choice), kept for reference but not loaded by the app.
- `public/data/result.js` — score-range → title/description bands (`min`/`max` percentage of Seme score).
- `public/data/song.js` — YouTube embed iframe HTML + title/artist/cover metadata for the analysis-screen soundtrack.

### Scoring

`showResults()` in `app.js` sums `seme`/`uke` points across `userAnswers`, computes `semePercentage = totalSeme / (totalSeme + totalUke) * 100`, then matches against `result.js` bands via `min <= round(percentage) <= max`.

### YouTube player flow

Two-stage gating (see `my-task.md` task 6) to satisfy YouTube's view-counting requirements: after the quiz, the embed is shown paused (user must click it directly, no autoplay, no miniplayer). On the next screen the miniplayer reappears and a transparent overlay (`.video-overlay`) blocks direct iframe interaction — clicking the miniplayer/cover instead redirects to the YouTube watch page (`redirectToYoutube()`).

### Result image export

`downloadResultImage()` renders a 1080x1920 canvas replicating the `.results-card` look (minus the song block) client-side for saving/sharing to social stories.

## Content/documentation layout

- `md/` — design references consulted when writing quiz content: `seme-uke-character.md` (character/trait notes used to write `qna3.js`), `color-theme.md` (Ponytail to Shushu palette used in `style.css`), `my-task.md` (running Thai-language task log/changelog from the project owner — useful history of *why* things are the way they are, e.g. why data is fetched as JSON instead of imported, why `dist/` exists).
- `readme.md` — user-facing project README (bilingual EN/TH).
- `GEMINI.md` — equivalent instructions file for Gemini CLI; largely mirrors project context above.

## Testing conventions

`test/` holds manual QA checklists, not executable tests (`analyze_scores.js`, `check_scores.js`, `check_fallback_scores.js` are one-off Node scripts for sanity-checking score math, not a suite). `test/gemini-test.md` is marked **read-only** — do not edit it.

When asked to write test cases:
- Read `test/gemini-test.md` first for the expected format.
- Create a new file named `testXX-yyyy-mm-dd.md` (XX = next sequential number, check existing files in `test/` first).
- Structure: H1 per section, H2 per test objective within that section, checklist items as `- [ ]`.
- These are checklists for the project owner to execute manually — do not perform the manual UI walkthrough steps yourself unless explicitly asked to.
