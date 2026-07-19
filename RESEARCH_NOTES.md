# GATE DA Prep Hub — Research Checkpoint

Last verified: **19 July 2026**

## Official status

- I could not locate a live official GATE 2027 website or notification on 19 July 2026. The PRD's claims that IIT Madras will conduct GATE 2027 and that the exam will be held on 1 February 2027 therefore remain **provisional**. The product labels the date as a planning target, not a confirmed exam date.
- The latest published official baseline is GATE 2026, organized by IIT Guwahati. Its [DA syllabus and paper listing](https://gate2026.iitg.ac.in/exam-papers-and-syllabus.html) confirms the seven core DA subject groups used in the PRD.
- The official [question-paper pattern](https://gate2026.iitg.ac.in/question-paper-pattern.html) confirms a 3-hour CBT, 15 General Aptitude marks, 85 DA subject marks, and MCQ/MSQ/NAT questions. MCQ penalties are one-third of the question's marks; MSQ and NAT have no negative marking; MSQ has no partial credit.
- The official GATE 2026 DA syllabus matches the Linear Algebra and Probability & Statistics topics listed in the PRD. In particular, Poisson is a discrete distribution.

## Official papers reviewed

The papers and final keys were obtained from the conducting institutes' archives through the official [GATE 2026 downloads](https://gate2026.iitg.ac.in/download.html) and [2026 master-paper page](https://gate2026.iitg.ac.in/QPs-answer-keys.html).

### 2024 (IISc Bengaluru)

- Probability & Statistics: Q12, Q24, Q27, Q34, Q36, Q56–Q59, Q62, Q64–Q65
- Linear Algebra: Q13, Q35, Q47–Q49, Q61
- Official paper: <https://gate2026.iitg.ac.in/doc/download/2024/DA24S1.pdf>
- Official final key: <https://gate2026.iitg.ac.in/doc/download/2024/DAFinalAnswerKey.pdf>

### 2025 (IIT Roorkee)

- Probability & Statistics: Q11, Q19–Q21, Q31, Q36, Q39–Q40, Q45, Q54, Q61
- Linear Algebra: Q12–Q13, Q25, Q28, Q37–Q38, Q50, Q52, Q60
- Official paper: <https://gate2026.iitg.ac.in/doc/download/2025/DA2025.pdf>
- Official final key: <https://gate2026.iitg.ac.in/doc/download/2025_Key/DA_Keys.pdf>

### 2026 (IIT Guwahati)

- Probability & Statistics: Q19–Q20, Q28, Q33–Q34, Q44–Q45, Q53–Q54, Q57, Q62–Q64
- Linear Algebra: Q11, Q21–Q22, Q46, Q52, Q65
- Official paper: <https://gate2026.iitg.ac.in/doc/download/2026/QPs/DA.pdf>
- Official final key: <https://gate2026.iitg.ac.in/doc/download/2026/Keys/DA_Keys.pdf>

Questions that primarily test Machine Learning while incidentally using probability or linear algebra are not automatically treated as Phase-1 math PYQs. They can be cross-linked later when the ML track is unlocked. Before verbatim publication, each selected PYQ must be checked against the rendered paper (especially questions containing figures or dense matrix notation), solved independently, and matched against the final key.

## Content and product decisions

- Community weightage estimates are presented only as estimates; GATE does not publish topic-wise weightage.
- The app's default target date is `2027-02-01`, explicitly marked provisional and centralized in planner config.
- All non-PYQ practice questions and explanations are original. No paid test-series content is reproduced.
- Official PYQs are tracked separately from the minimum quota of 20 original questions per module.
- The initial release uses KaTeX from a CDN. The app remains static and needs no build step.

## QA rules carried into implementation

1. Validate every question record against the schema and verify unique IDs.
2. Recompute generated numeric answers independently in a QA script.
3. Assert the exact MCQ penalty and all-or-nothing MSQ/NAT rules in automated tests.
4. Keep provisional 2027 facts visibly labeled until an official notification is available.
5. Re-check official question numbering and transcription before labeling any record `official-pyq-*`.
