import { pageUrl, renderMath } from './app.js';
import { loadModule, loadQuestions } from './content.js';
import { questionCard, bindQuestionCards } from './question-ui.js';

async function render() {
  const params = new URLSearchParams(location.search);
  const subject = params.get('subject');
  const number = Number(params.get('module'));
  if (!['linear-algebra', 'probability-statistics'].includes(subject) || number < 1 || number > 7) throw new Error('Choose a valid module.');
  const [module, questions] = await Promise.all([loadModule(subject, number), loadQuestions(subject, number)]);
  document.title = `${module.title} · GATE DA Prep Hub`;
  const app = document.querySelector('#moduleApp');
  app.innerHTML = `<div class="module-shell"><article class="module-content">
    <span class="eyebrow">${module.subjectTitle} · Module ${number} of 7</span><h1>${module.title}</h1><p class="lede">${module.introduction}</p>
    <div class="button-row"><a class="button" href="#practice">Start practice</a><a class="button secondary" href="${pageUrl(`test-center/runner.html?test=topic-${subject}-${number}&mode=practice`)}">Take topic test</a></div>
    <section class="theory-section" id="theory"><span class="eyebrow">01 · Build the idea</span><h2>Understand it cleanly</h2>${module.theory.map((paragraph) => `<p>${paragraph}</p>`).join('')}<p class="notice"><strong>Why GATE tests this:</strong> ${module.whyGate}</p></section>
    <section class="theory-section" id="formulas"><span class="eyebrow">02 · Revision box</span><h2>Core formulas & facts</h2><div class="formula-box">${module.formulas.map((formula) => `<p>\\[${formula}\\]</p>`).join('')}</div></section>
    <section class="theory-section" id="examples"><span class="eyebrow">03 · Follow the reasoning</span><h2>Worked examples</h2>${module.examples.map((example, index) => `<article class="example"><h3>Example ${index + 1} · ${example.title}</h3><p>${example.problem}</p><p><strong>Reasoning.</strong> ${example.solution}</p></article>`).join('')}</section>
    <section class="theory-section" id="pitfalls"><span class="eyebrow">04 · Protect your marks</span><h2>Common pitfalls</h2><div class="pitfalls"><ul>${module.pitfalls.map((pitfall) => `<li>${pitfall}</li>`).join('')}</ul></div></section>
    <section class="theory-section" id="practice"><span class="eyebrow">05 · Make it stick</span><h2>Practice set</h2><p class="muted">20 original questions · Foundation → GATE-standard → Challenge</p><div class="question-grid">${questions.map((question, index) => questionCard(question, { index })).join('')}</div></section>
  </article><aside class="module-nav" aria-label="On this page"><a href="#theory">Theory</a><a href="#formulas">Formulas</a><a href="#examples">Examples</a><a href="#pitfalls">Pitfalls</a><a href="#practice">Practice</a></aside></div>`;
  bindQuestionCards(app, questions);
  renderMath(app);
}

render().catch((error) => { document.querySelector('#moduleApp').innerHTML = `<div class="empty-state"><h2>Module unavailable</h2><p>${error.message}</p></div>`; });

