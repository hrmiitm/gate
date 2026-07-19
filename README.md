# GATE DA 2027 Prep Hub

A static, browser-local preparation workspace for GATE Data Science & Artificial Intelligence. Phase 1 contains complete Probability & Statistics and Linear Algebra tracks inside a visible six-month roadmap.

## What is included

- 14 theory modules with formula summaries, worked examples, and pitfalls
- 280 original practice questions with full solutions
- 14 topic tests, 2 subject tests, and a combined 40-question test
- GATE-accurate MCQ/MSQ/NAT marking
- Six-month planner, dashboard, bookmarks, mistake notebook, search, themes, and progress export/import
- No backend and no build step required to view the site

## Run locally

```bash
npm run serve
```

Open <http://localhost:4173>. Run content and scoring validation with:

```bash
npm test
```

`npm run generate` rebuilds module, question, test, and search JSON from the authored sources in `scripts/`.

## GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` validates the content and deploys the repository root whenever `main` is pushed. In the repository settings, set **Pages → Source** to **GitHub Actions** if it is not already selected.

All learner state is stored in browser `localStorage` under the `gateda:` namespace.
