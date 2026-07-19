> **Note to you, before you copy this anywhere:** everything below the `---` is written to be pasted directly into your coding agent (Claude Code, Cursor, etc.) as its build brief. I've already researched the GATE DA 2027 syllabus, exam pattern, and test-series landscape and baked the verified facts into Section 2, so your agent doesn't have to guess or hallucinate them — it just needs to verify, extend, and build. A few calls I made on your behalf are flagged inline with **[Assumption]** — edit those first if you want something different (tech stack, target exam date, question quotas), then hand the whole thing over.

---

# GATE DA 2027 Prep Hub — Website Build Specification
**Phase 1 scope: Linear Algebra + Probability & Statistics, built inside the shell of a full 6-month roadmap**

You are building a static, fully interactive exam-prep website for **GATE DA (Data Science & Artificial Intelligence) 2027**. This document is your complete brief. Read all of it before writing a line of code. Section 2 gives you verified, researched facts — treat them as ground truth, not something to re-derive from memory. Sections 3 onward tell you what to research yourself, what to build, and the bar it needs to clear.

This is a real study tool for a real, high-stakes exam. A beautiful site with one wrong formula or a mis-keyed answer is worse than no site at all — accuracy is not negotiable anywhere in this brief.

---

## 1. Mission & Non-Negotiables

Build a website a serious GATE DA aspirant would actually open every day for months — not a template with placeholder "coming soon" energy, but something that feels like it was built by someone who understands both the exam and how people actually study for it.

**Non-negotiable, in priority order:**
1. **Mathematical correctness.** Every formula, worked example, and answer key must be right. Self-check everything (Section 7).
2. **Depth over breadth, for the two live subjects.** Linear Algebra and Probability & Statistics must each feel *complete*, not a teaser.
3. **The 6-month plan exists in full**, even though only 2 of the syllabus's subject-tracks have content yet (Section 4 — this is the main design tension in this brief, and it's solved below, not skipped).
4. **Zero backend.** Static files only. All personalization (progress, test history, bookmarks) lives in the browser via `localStorage`.
5. **Built to be extended.** Adding Machine Learning or DBMS next month should mean "add a data folder," never "refactor the app."

**[Assumption]** Stack: plain HTML/CSS/JS, no required build step, deployable to GitHub Pages/Netlify/Vercel as-is. If you're a coding agent with a strong opinion (Astro, a static export from a framework, whatever) that's fine — the constraints above still apply: static output, no backend, nothing required to *view* it beyond a static file server. If you have a frontend-design skill or style guide available to you, use it for typography, spacing and color decisions instead of defaulting to generic templates.

---

## 2. Verified Ground Truth — Use This, Don't Re-Derive It

*(Researched from the official exam pattern, GATE DA-specific prep platforms, and PYQ archives. Treat as your baseline; Section 3 tells you what to still verify or expand yourself.)*

### 2.1 Exam snapshot

| | |
|---|---|
| Exam | GATE DA — Data Science & Artificial Intelligence |
| First conducted | 2024 — so **only three real PYQ papers exist**: 2024, 2025, 2026. Every "PYQ bank" you find online for DA is either these three papers repackaged, or cross-listed GATE CS/other-paper math questions. There is no deep PYQ archive yet — which is exactly why this site needs a large bank of original, GATE-calibrated questions, not just recycled PYQs. |
| GATE 2027 conducting institute | IIT Madras (GATE rotates conducting institute yearly). Notification expected ~July 2026 — i.e. **around now** — so it may already be public by the time you build this. Re-verify. |
| Expected exam window | February 2027 (unconfirmed until the official notification drops — treat exact dates as provisional) |
| Format | Computer-based test, 3 hours (180 minutes) |
| Total | 65 questions, 100 marks |
| General Aptitude | 10 questions, 15 marks — common to every GATE paper, out of scope for this build |
| Core subject | 55 questions, 85 marks |
| Question types | MCQ, MSQ, NAT — each can be worth 1 or 2 marks |
| MCQ marking | Correct: full marks. Wrong: **−1/3** for a 1-mark question, **−2/3** for a 2-mark question |
| MSQ marking | Correct (*all* correct options selected): full marks. Otherwise: 0. **No negative marking. No partial credit.** |
| NAT marking | Correct (within the authored tolerance): full marks. Otherwise: 0. **No negative marking.** |
| Unattempted | 0, no penalty, for every question type |
| The 7 core subjects | Probability & Statistics · Linear Algebra · Calculus & Optimization · Programming, Data Structures & Algorithms · Database Management & Warehousing · Machine Learning · Artificial Intelligence |
| Math's share of the paper | Probability + Linear Algebra + Calculus together are commonly estimated at roughly **34 of the 85 core marks (~40%)**. This is a community estimate from PYQ analysis, not an officially published weightage — GATE never publishes per-topic weightage. Say so on the site; don't present it as official. |

### 2.2 Linear Algebra — official syllabus topics

Vector spaces and subspaces · Linear dependence and independence · Matrices — general properties · Special matrices: projection, orthogonal, idempotent, and partition matrices · Quadratic forms · Systems of linear equations and their solutions · Gaussian elimination · Eigenvalues and eigenvectors · Determinant · Rank and nullity · Projections · LU decomposition · Singular Value Decomposition (SVD).

Commonly cited weight: **~8–12 marks** (a community estimate, not official). SVD, eigenvalues/eigenvectors, and rank/nullity are consistently flagged as the highest-yield topics because they recur in the Machine Learning section too (PCA, low-rank approximation) — make that connection explicit in the theory content.

### 2.3 Probability & Statistics — official syllabus topics

Counting (permutations and combinations) · Probability axioms, sample space, events · Independent events and mutually exclusive events · Marginal, conditional, and joint probability · Bayes' theorem · Conditional expectation and conditional variance · Mean, median, mode, standard deviation · Correlation and covariance · Random variables — discrete and continuous, PMF and PDF · Discrete distributions: Uniform, Bernoulli, Binomial, Poisson · Continuous distributions: Uniform, Exponential, Normal, Standard Normal, t-distribution, Chi-squared · Cumulative distribution functions, conditional PDFs · Central Limit Theorem · Confidence intervals · Hypothesis testing: z-test, t-test, chi-squared test.

**Correction note:** some prep blogs list Poisson under "continuous distributions" — that's a mathematical error, Poisson is discrete. Don't propagate it.

Commonly cited weight: consistently flagged as the single highest-weighted section in the paper (estimates range roughly **19–30% of total marks** depending on source and year analyzed). Bayes' theorem specifically is flagged everywhere as the highest-yield individual topic.

### 2.4 What "good" test-series content looks like (structural reference, not content to copy)

GATE DA-specific prep platforms exist (e.g. The ML Hub, PiyushWairale/PiyushAI, GO Classes, PracticePaper.in, AspirantMitraa, GATE Overflow for cross-listed math). A structure worth emulating, seen across them:
- **Topic-wise tests** — granular, one per module, 10–15 questions
- **Subject-wise tests** — once a full subject is done, 25–40 questions
- **Daily practice problems** — a small, fixed number of fresh questions delivered per day (commonly 5), building exam-day speed as a daily habit rather than a big weekly grind
- **Full-length mocks** replicating the real 65-question/3-hour/negative-marking format (out of scope until more subjects exist — Section 4)

**Do not scrape or reproduce paid/proprietary test-series questions or explanations.** Studying their public marketing pages for format, phrasing style, and difficulty calibration is fine. Copying their question text, options, or explanations is not — legally, and because it genuinely isn't better than writing it properly yourself. Official GATE PYQs (2024/2025/2026) are the one category of "someone else's question" to use directly, since the conducting institute releases them publicly for aspirants — just label each one clearly (Section 13).

---

## 3. Research You Should Still Do

Section 2 is a solid foundation, not a substitute for your own verification. Before generating content:

1. **Confirm the syllabus hasn't shifted.** Search "GATE DA 2027 official syllabus" / check the current conducting institute's GATE site (IIT Madras, for 2027). If the notification has dropped, use the official PDF over any blog.
2. **Collect the actual official PYQs** for Linear Algebra and Probability & Statistics from the 2024, 2025, and 2026 DA papers. Read each one, solve it yourself, and write your own full explanation — don't paraphrase someone else's solution. Tag each with its real year and question number.
3. **Skim 2–3 of the DA-specific platforms named in 2.4** to calibrate question phrasing, difficulty, and the kind of "trap" options a well-written MCQ uses — then write original questions in that calibrated style.
4. **If your tooling has no live web/browser access**, don't block on this — build from Section 2, and clearly flag in `RESEARCH_NOTES.md` (below) which facts you couldn't independently re-verify, so the user knows what to double-check before publishing.
5. **Write up findings in `RESEARCH_NOTES.md`** before writing any UI code: confirmed syllabus, the list of official PYQs collected (year + number + topic), and anything that changed vs. Section 2. This is a checkpoint deliverable, not busywork — it's what makes the rest of the build fast and correct instead of improvised.

---

## 4. Scope: What's Live Now vs. What's Locked

This is the central design problem of this brief, and here's the resolution: **build the full 6-month roadmap now, but only two of its subject-tracks carry real content.**

**Live (build completely, to the full spec in this document):**
- Linear Algebra — all 7 modules (Section 6)
- Probability & Statistics — all 7 modules (Section 6)
- The full 6-month day-wise planner shell, covering the entire syllabus timeline
- The test engine, progress dashboard, formula sheet, and search — built generically enough to already work for these two subjects

**Locked (visible on the roadmap, clearly marked, zero content required):**
- Calculus & Optimization, Programming/DSA, Database Management & Warehousing, Machine Learning, Artificial Intelligence, General Aptitude

Locked subjects should appear as real entries in the navigation and the planner — greyed out, tagged "Coming soon," non-clickable or landing on a short "not yet available" state — so the roadmap always reads as complete and intentional, never like a broken link or an afterthought. Section 14 covers exactly how new subjects slot in later without touching the engine.

---

## 5. Site Map

| Page | Purpose |
|---|---|
| `/` (Home / Dashboard) | Days-to-exam countdown, today's planner task, overall + Phase-1 progress, streak, quick links |
| `/planner` | Full 6-month calendar: live days interactive, locked weeks shown as collapsed placeholders |
| `/subjects/linear-algebra` | LA hub: 7 modules with per-module progress, link to the LA subject test |
| `/subjects/probability-statistics` | Stats hub: same pattern |
| `/subjects/{subject}/{module}` | **One shared template**, rendered per module: theory brief → worked examples → practice set → topic-test link |
| `/practice` | Full question-bank browser: filter by subject, topic, difficulty, type; solve in isolation |
| `/test-center` | List of all available tests (topic / subject / combined) with past-attempt history |
| `/test-center/runner` | The actual test-taking runner — one generic engine, driven by test config (Section 9) |
| `/formula-sheet` | Every formula from both subjects, one scrollable/printable page, organized by module |
| `/about` | What's built vs. locked, sources for syllabus/pattern, how progress storage works, export/import progress |

---

## 6. The 14 Content Modules

Group the syllabus topics from Section 2 into 7 teaching modules per subject — this grouping is what both the question organization and the day-wise planner are built around.

**Linear Algebra**
1. Vector spaces, subspaces, linear (in)dependence, basis & dimension
2. Matrices — general properties + the special-matrix family (projection, orthogonal, idempotent, partition)
3. Systems of linear equations, Gaussian elimination, rank & nullity
4. Determinants
5. Eigenvalues, eigenvectors & diagonalization
6. Quadratic forms
7. LU decomposition & Singular Value Decomposition — explicitly tie SVD to its PCA / low-rank-approximation relevance, since that's what makes it a recurring GATE DA favorite

**Probability & Statistics**
1. Counting & probability foundations — permutations/combinations, axioms, sample space, events, independence, mutual exclusivity
2. Conditional probability, joint/marginal distributions, Bayes' theorem
3. Random variables & discrete distributions — PMF, Uniform, Bernoulli, Binomial, Poisson
4. Continuous distributions & CDFs — Uniform, Exponential, Normal, Standard Normal, t, Chi-squared, conditional PDFs
5. Descriptive statistics & moments — mean/median/mode/SD, correlation, covariance, conditional expectation/variance
6. Central Limit Theorem & sampling distributions
7. Statistical inference — confidence intervals, z-test, t-test, chi-squared test

### Per-module requirements (applies to all 14)

**Theory brief** — concise, not a textbook chapter:
- Plain-language setup/definition
- A boxed formula/theorem summary (this is what students screenshot and revise from later)
- 3–4 fully worked examples with complete reasoning, not just the final answer
- A "Common pitfalls" callout: 3–5 specific traps (e.g. confusing eigenvalues with singular values; algebraic vs. geometric multiplicity; forcing a Poisson approximation where it doesn't apply), phrased in your own words
- One line on *why GATE tests this* / where else in the syllabus it resurfaces (e.g. "this is exactly what PCA does in the ML section")
- Voice: write like a sharp, encouraging mentor talking directly to the student — not a dry textbook paraphrase

**Practice set:**
- **Minimum 20 original questions per module, target 30+.**
- Difficulty split, roughly: 35% Foundation (direct definition/formula application) · 45% GATE-Standard (matches real exam difficulty, usually needs two ideas combined or careful reading) · 20% Challenge (harder than a typical PYQ, for students aiming for a top rank)
- Type mix: predominantly MCQ and NAT, with MSQ used only where multiple options are genuinely, defensibly correct — don't force an MSQ where a clean MCQ is more honest
- Every question: full step-by-step solution (not just the final answer), correct marks value (1 or 2), difficulty tag, type tag, and a source tag (`original` or `official-pyq-{year}`)
- Include every official PYQ (2024/2025/2026) relevant to that module, clearly tagged as such, on top of the original questions above

**Topic test:** 10–12 questions, mixed types, ~15–20 minutes, GATE-accurate marking (Section 9).

---

## 7. Practice Question Bank — Schema & Quality Bar

Store questions as data (JSON), not hardcoded into page markup — this is what makes 400+ questions maintainable and what makes adding a 15th module later trivial.

Illustrative shape (strip comments in real data files):

```json
{
  "id": "la-05-eigen-014",
  "subject": "linear-algebra",
  "module": 5,
  "topic": "Eigenvalues & eigenvectors",
  "type": "MCQ",
  "marks": 2,
  "difficulty": "gate-standard",
  "source": "original",
  "question_latex": "...",
  "options": ["...", "...", "...", "..."],
  "correct": ["B"],
  "nat_answer": null,
  "solution_latex": "...",
  "common_mistake": "..."
}
```

Field notes: `type` is one of `MCQ | MSQ | NAT` (omit `options` for NAT); `correct` is an array so MSQ can hold multiple right answers; `difficulty` is one of `foundation | gate-standard | challenge`; `source` is `original` or `official-pyq-{year}`; `nat_answer` holds `{value, tolerance}` and only applies to NAT questions.

**Quality bar, checked before anything ships:**
- No two questions in the same module are near-duplicates (same setup, numbers swapped) — vary the underlying idea, not just the numbers
- Every NAT question's tolerance is wide enough for legitimate rounding, narrow enough to reject a wrong method
- Every MSQ has a genuine, defensible set of correct options — re-read it as a skeptic before finalizing
- **Self-check pass:** before marking a module "done," re-derive the answer to every question independently and confirm it matches the stored `correct` / `nat_answer`. This is the single most important quality gate in this entire brief — an answer-key error is a real harm to someone using this to prepare for a real exam.

---

## 8. The 6-Month Day-Wise Planner

**[Assumption]** `START_DATE` defaults to today; `TARGET_EXAM_DATE` defaults to **1 Feb 2027** (adjust once the official date is confirmed). Both should be simple config values, not hardcoded through the app — the whole calendar recomputes from them.

**Weekly rhythm (default, editable):** 5 focused study days, 1 practice/test-heavy day, 1 lighter revision-or-rest day. Don't build a plan with zero rest days — it won't survive contact with six real months.

**Pacing algorithm for the live portion (Phase 1 — Linear Algebra + Statistics):**
- ~3 days per module as a baseline (1 concept day, 1 worked-examples-and-easy-practice day, 1 harder-practice day), stretching to 4 days for the heaviest modules (Bayes' theorem, hypothesis testing, eigenvalues, SVD)
- A topic-test day immediately after each module
- Recommended subject order and rough pacing, based on common GATE DA prep advice: **Probability & Statistics first** (~5–6 weeks — it's the highest-weighted and most "learn once, use everywhere" section), **then Linear Algebra** (~3–4 weeks)
- A subject-test day after all 7 modules of a subject are complete
- A combined Linear-Algebra-+-Statistics cumulative test at the end of Phase 1
- This gives roughly **9–10 weeks of live, fully interactive calendar days** — compute the exact day count from the actual module/question content you generate, don't hand-wave it

**The remaining ~16–17 weeks** (Calculus, Programming/DSA, DBMS, ML, AI, GA, final revision, and mock-test weeks) render as collapsed, labeled, locked blocks in the same calendar UI — so the roadmap always looks like a complete 6-month plan, just with two tracks already lit up.

**Each live day shows:** date, day number, module/topic, a short concrete task list (e.g. "Read: Bayes' theorem theory (15 min) · Solve: 15 Foundation + 10 GATE-standard questions · Review any mistakes"), an estimated time, and a checkbox — persisted, so a refresh doesn't lose progress. Test days link straight into the Test Center entry for that specific test.

**Dashboard should surface:** overall 6-month completion %, Phase-1 (LA + Stats) completion % — this one should be able to hit 100% — current streak, days remaining to the exam, and a per-module mastery heatmap (green/yellow/red, driven by topic-test performance).

---

## 9. Test Center & GATE-Accurate Marking Engine

Build **one generic test-running engine**, parameterized by a test config (question-ID list + time limit + label) — not a separate implementation per test.

**Tests to generate:**
- 14 topic tests (one per module, Section 6)
- 2 subject tests: full Linear Algebra (25–30 Q, ~45 min), full Probability & Statistics (25–30 Q, ~45 min)
- 1 combined test: Linear Algebra + Statistics together (35–40 Q, ~60 min) — the closest thing to a "math-portion mock" until more subjects exist
- *Not* a full 65-question mock yet — that needs all 7 subjects. Architect the test config so adding one later is just a new JSON file.

**Marking simulation must exactly match Section 2.1:** MCQ +1/−1/3 or +2/−2/3, MSQ full-marks-or-zero with no negative marking and no partial credit, NAT full-marks-or-zero with no negative marking, 0 for unattempted — across the board.

**Two modes:**
- **Practice mode** — untimed, instant feedback and explanation after each question
- **Exam mode** — timed, no feedback until final submission, auto-submits at the time limit — mirrors real exam pressure

**After submission:** total score, topic-wise breakdown, accuracy %, time spent, comparison against previous attempts at the same test (stored locally), and full worked solutions for *every* question — including the ones answered correctly, so a student can check whether they got the right answer for the right reason.

**Mistake notebook:** any question answered wrong, or manually flagged, is added to a persistent "Revise Later" list — filterable by subject/topic, with a "mark as mastered" action to clear it. This is the spaced-revision mechanism for the whole site; make it easy to get into and out of.

---

## 10. Interactivity, UX & Accessibility

- **Math rendering:** KaTeX via CDN. Nothing should ever render as a raw LaTeX string.
- **Two themes:** light and dark, both genuinely readable for dense math content, not just an inverted stylesheet.
- **Global search** across theory content and questions.
- **Bookmarking** on any question or theory section.
- **Mobile-first, truly responsive** down to ~360px — a large share of GATE aspirants study primarily on a phone; this isn't a nice-to-have.
- **Export/import progress as JSON** — since there's no login, this is the only way someone can back up progress or move to a new device. Put the button somewhere findable (`/about` at minimum).
- **Accessibility basics:** semantic HTML throughout, sufficient color contrast in both themes, a quiz fully operable by keyboard, alt text on any diagrams.

---

## 11. Visual Design Direction

Avoid the generic AI-generated-website look — purple gradient hero banners, emoji-heavy section headers, stock card grids with drop shadows on everything. This is a tool someone will spend hundreds of hours inside; design it like a well-made reference or documentation site, not a marketing landing page: calm, high-signal, low-noise.

- A considered, restrained type scale that clearly distinguishes body text from formula blocks and from UI chrome
- One deliberate accent color for interactive/progress elements; neutral, non-decorative use of color everywhere else
- Animation and micro-interactions should communicate state (a test countdown, a streak, a progress bar, a completion check) — not decorate
- If you have access to a design-system or frontend-design skill/guide, use it for the actual typography, spacing, and palette decisions instead of defaulting to generic templates

---

## 12. Technical Architecture

**[Assumption — change if you strongly prefer otherwise]** Static HTML/CSS/JS, no required build step, no backend, no database. Deployable by pointing any static host (GitHub Pages, Netlify, Vercel) at the output folder.

- **Content as data:** one JSON file per module for questions, one for theory/examples metadata. Module pages are **one shared template**, rendered from that JSON — never 14 hand-authored near-duplicate HTML files.
- **Storage:** `localStorage`, namespaced keys (e.g. `gateda:progress:{date}`, `gateda:test-attempt:{testId}`, `gateda:mistakes`) — document the schema so future content additions don't collide with it.
- **Performance:** lazy-load each module's question JSON rather than one giant bundle; no heavy frameworks needed for what this site actually does.

Suggested structure:
```
/
  index.html                     Home / dashboard
  planner.html
  subjects/
    linear-algebra/index.html
    probability-statistics/index.html
    module.html                  shared template, ?subject=&module=
  practice/index.html
  test-center/index.html
  test-center/runner.html        ?test={id}
  formula-sheet.html
  about.html
  assets/
    css/styles.css
    js/{app, quiz-engine, planner-engine, storage, katex-render}.js
  data/
    syllabus.json                full 7-subject roadmap, incl. locked ones
    linear-algebra/module-{1-7}.json
    linear-algebra/questions/module-{1-7}.json
    probability-statistics/module-{1-7}.json
    probability-statistics/questions/module-{1-7}.json
    tests/{topic,subject,combined}.json
    planner/calendar-config.json
  RESEARCH_NOTES.md
```

---

## 13. Content Integrity & IP Guardrails

- Cite the official syllabus/pattern source on the `/about` page.
- Official PYQs (2024/2025/2026): reproduce with clear labels ("Official GATE DA 2025 — Q31"), sourced from the conducting institute's own archives or well-established free aggregators — not paywalled platforms.
- Everything else — every theory explanation, every original question, every common-mistake note — must be written fresh. Studying a paid test series' public pages for calibration is fine; copying its question text or explanations is not.
- Label community-estimated weightages as estimates, never as official figures.
- Every formula and worked solution gets the self-check pass from Section 7 before it ships.

---

## 14. Extensibility Contract

Adding a new subject later (Machine Learning, say) should require exactly:
1. A new `data/machine-learning/` folder (module + question JSON, following the Section 7 schema)
2. A new `subjects/machine-learning/index.html` entry point (reusing the same shared module template)
3. An appended entry in `data/syllabus.json`
4. The planner engine turning that subject's locked calendar block into live days automatically

No changes to `quiz-engine.js`, `planner-engine.js`, or `storage.js` should ever be required just to add content. If your build makes this hard, that's a sign the architecture needs to be more data-driven, not that this contract should be dropped.

---

## 15. Suggested Build Order

This is a substantial build — treat it as a multi-session project and work through it in order, rather than trying to do everything at once:

1. Research checkpoint → `RESEARCH_NOTES.md`
2. Finalize JSON schemas (questions, theory, tests, planner/calendar)
3. Shared UI shell: nav, theming, KaTeX pipeline, storage helpers
4. Content: all 7 Linear Algebra modules (theory + examples + ≥20 questions + topic test, each)
5. Content: all 7 Probability & Statistics modules (same bar)
6. Subject tests (LA, Stats) + the combined test
7. The 6-month planner (full calendar, including locked future weeks)
8. Dashboard, progress analytics, mistake notebook
9. Formula sheet, search, and a polish pass
10. QA against Section 16 — fix every gap before calling it done

---

## 16. Definition of Done

- [ ] All 14 modules have a theory brief, ≥3 worked examples, and ≥20 practice questions each, every one with a full solution
- [ ] Every question tagged with subject / module / type / difficulty / marks / source
- [ ] All relevant official 2024/2025/2026 PYQs for LA and Stats are included and clearly labeled
- [ ] 14 topic tests + 2 subject tests + 1 combined test all exist and run correctly
- [ ] Marking simulation exactly matches Section 2.1 (MCQ −1/3 / −2/3, MSQ/NAT no negative marking, no partial credit on MSQ)
- [ ] The full 6-month calendar renders end-to-end; Phase-1 days are fully interactive; every other subject shows as a clearly labeled locked placeholder
- [ ] Progress, test attempts, bookmarks, and the mistake notebook all persist through a page refresh
- [ ] Export/import progress as JSON works
- [ ] Fully usable from ~360px mobile width up
- [ ] Opens correctly from a plain static file server — no backend, no build step required to *view* it
- [ ] Math renders everywhere — no visible raw LaTeX
- [ ] No fabricated syllabus content anywhere; sources noted on `/about`
- [ ] Both light and dark themes are genuinely readable, not just inverted