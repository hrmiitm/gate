import { fetchJSON, renderMath, pageUrl, toast } from './app.js';
import { loadAllQuestions } from './content.js';
import { Storage } from './storage.js';
import { answerLabel, answerIsCorrect, isAttempted, questionCard, readAnswer, renderInputs } from './question-ui.js';
import { scoreTest } from './quiz-engine.js';

const params = new URLSearchParams(location.search);
const testId = params.get('test');
const mode = params.get('mode') === 'practice' ? 'practice' : 'exam';
let test, questions, current = 0, answers = {}, startedAt, timer;

function saveCurrent() {
  const card = document.querySelector('.runner-question');
  if (card) answers[questions[current].id] = readAnswer(card, questions[current]);
}

function renderQuestion() {
  const question = questions[current];
  const target = document.querySelector('#runnerQuestion');
  target.innerHTML = `<article class="card runner-question" data-question-id="${question.id}"><span class="eyebrow">Question ${current + 1} of ${questions.length} · ${question.type} · ${question.marks} mark${question.marks > 1 ? 's' : ''}</span><div class="question-text">${question.question_latex}</div>${renderInputs(question, `runner-${question.id}`, answers[question.id])}<div class="question-actions">${mode === 'practice' ? '<button class="button small" id="practiceCheck">Check & explain</button>' : ''}<button class="button ghost small" id="clearAnswer">Clear response</button></div><div class="solution" id="practiceSolution" hidden></div></article><div class="question-actions"><button class="button ghost" id="previousQuestion" ${current === 0 ? 'disabled' : ''}>← Previous</button>${current === questions.length - 1 ? '<button class="button" id="submitTest">Submit test</button>' : '<button class="button" id="nextQuestion">Save & next →</button>'}</div>`;
  document.querySelectorAll('[data-palette]').forEach((button, index) => { button.classList.toggle('current', index === current); button.classList.toggle('answered', isAttempted(questions[index], answers[questions[index].id])); });
  target.querySelector('#previousQuestion')?.addEventListener('click', () => { saveCurrent(); current -= 1; renderQuestion(); });
  target.querySelector('#nextQuestion')?.addEventListener('click', () => { saveCurrent(); current += 1; renderQuestion(); });
  target.querySelector('#submitTest')?.addEventListener('click', submit);
  target.querySelector('#clearAnswer')?.addEventListener('click', () => { answers[question.id] = question.type === 'NAT' ? '' : []; renderQuestion(); });
  target.querySelector('#practiceCheck')?.addEventListener('click', () => {
    saveCurrent(); const answer = answers[question.id]; if (!isAttempted(question, answer)) { toast('Answer the question first'); return; }
    const correct = answerIsCorrect(question, answer); const solution = target.querySelector('#practiceSolution');
    solution.hidden = false; solution.innerHTML = `<span class="eyebrow">${correct ? 'Correct' : `Answer · ${answerLabel(question)}`}</span><p>${question.solution_latex}</p><p class="muted"><strong>Watch for:</strong> ${question.common_mistake}</p>`;
    if (!correct) { const mistakes = Storage.get('mistakes', []); if (!mistakes.includes(question.id)) Storage.set('mistakes', [...mistakes, question.id]); }
    renderMath(solution);
  });
  renderMath(target);
}

function startTimer() {
  if (mode !== 'exam') { document.querySelector('#timer').textContent = 'Untimed practice'; return; }
  const deadline = startedAt + test.minutes * 60000;
  const tick = () => { const left = Math.max(0, deadline - Date.now()); const minutes = Math.floor(left / 60000), seconds = Math.floor(left % 60000 / 1000); const node = document.querySelector('#timer'); if (!node) return; node.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; node.classList.toggle('urgent', left < 300000); if (left <= 0) submit(); };
  tick(); timer = setInterval(tick, 1000);
}

function submit() {
  saveCurrent(); clearInterval(timer);
  const result = scoreTest(questions, answers);
  const elapsedSeconds = Math.round((Date.now() - startedAt) / 1000);
  const attempts = Storage.get('attempts', {});
  const attempt = { at: new Date().toISOString(), score: result.score, possible: result.possible, accuracy: result.accuracy, elapsedSeconds, answers };
  attempts[test.id] = [...(attempts[test.id] || []), attempt]; Storage.set('attempts', attempts);
  const mistakes = Storage.get('mistakes', []); result.rows.filter((row) => row.status === 'wrong').forEach((row) => { if (!mistakes.includes(row.question.id)) mistakes.push(row.question.id); }); Storage.set('mistakes', mistakes);
  document.querySelector('#runnerApp').innerHTML = `<span class="eyebrow">Attempt complete</span><h1>${test.title}</h1><div class="score-hero"><strong>${result.score.toFixed(2)}</strong><span>out of ${result.possible}<br>${Math.round(result.accuracy)}% accuracy · ${result.attempted}/${questions.length} attempted</span></div><div class="button-row"><a class="button" href="${pageUrl('test-center/index.html')}">Back to Test Center</a><a class="button secondary" href="${location.href}">Retake</a></div><div class="section-heading"><h2>Topic breakdown</h2></div><div class="card"><table class="breakdown-table"><thead><tr><th>Topic</th><th>Score</th><th>Accuracy</th></tr></thead><tbody>${result.byTopic.map((row) => `<tr><td>${row.topic}</td><td>${row.score.toFixed(2)} / ${row.possible}</td><td>${Math.round(row.correct / row.total * 100)}%</td></tr>`).join('')}</tbody></table></div><div class="section-heading"><h2>Full review</h2></div><div class="question-grid">${result.rows.map((row, index) => `<div><span class="tag ${row.status === 'correct' ? 'live' : ''}">${row.status} · ${row.earned.toFixed(2)} marks</span>${questionCard(row.question, { index, interactive: false, showSolution: true })}</div>`).join('')}</div>`;
  renderMath(document.querySelector('#runnerApp'));
}

async function init() {
  const [tests, allQuestions] = await Promise.all([fetchJSON('tests/index.json'), loadAllQuestions()]);
  test = tests.find((item) => item.id === testId); if (!test) throw new Error('Test not found.');
  const map = new Map(allQuestions.map((question) => [question.id, question])); questions = test.questionIds.map((id) => map.get(id)).filter(Boolean); if (!questions.length) throw new Error('This test has no questions.');
  startedAt = Date.now(); document.title = `${test.title} · Test Runner`;
  document.querySelector('#runnerApp').innerHTML = `<div class="runner-header"><div><span class="eyebrow">${mode} mode</span><h2>${test.title}</h2></div><div class="timer" id="timer"></div></div><div class="runner-layout"><div id="runnerQuestion"></div><aside class="question-palette card"><h3>Question palette</h3><div class="palette-grid">${questions.map((_, index) => `<button data-palette="${index}" aria-label="Go to question ${index + 1}">${index + 1}</button>`).join('')}</div><p class="muted"><small>Outlined: current · Green: answered</small></p><button class="button small" id="sideSubmit">Submit test</button></aside></div>`;
  document.querySelectorAll('[data-palette]').forEach((button) => button.addEventListener('click', () => { saveCurrent(); current = Number(button.dataset.palette); renderQuestion(); })); document.querySelector('#sideSubmit').addEventListener('click', submit);
  renderQuestion(); startTimer();
}
init().catch((error) => { document.querySelector('#runnerApp').innerHTML = `<div class="empty-state"><h2>Could not open test</h2><p>${error.message}</p></div>`; });

