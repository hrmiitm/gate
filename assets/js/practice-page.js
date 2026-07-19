import { renderMath } from './app.js';
import { loadAllQuestions } from './content.js';
import { questionCard, bindQuestionCards } from './question-ui.js';
import { Storage } from './storage.js';

let all = [];
const state = { subject: 'all', module: 'all', difficulty: 'all', type: 'all', view: 'all', query: '' };

function filtered() {
  const bookmarks = Storage.get('bookmarks', []), mistakes = Storage.get('mistakes', []);
  return all.filter((question) => (state.subject === 'all' || question.subject === state.subject)
    && (state.module === 'all' || question.module === Number(state.module))
    && (state.difficulty === 'all' || question.difficulty === state.difficulty)
    && (state.type === 'all' || question.type === state.type)
    && (state.view !== 'bookmarks' || bookmarks.includes(question.id))
    && (state.view !== 'mistakes' || mistakes.includes(question.id))
    && (!state.query || `${question.question_latex} ${question.topic}`.toLowerCase().includes(state.query)));
}

function drawQuestions() {
  const items = filtered();
  const target = document.querySelector('#questionResults');
  document.querySelector('#resultCount').textContent = `${items.length} question${items.length === 1 ? '' : 's'}`;
  target.innerHTML = items.length ? items.slice(0, 60).map((question) => questionCard(question)).join('') : '<div class="empty-state">No questions match these filters.</div>';
  bindQuestionCards(target, items);
  renderMath(target);
}

async function render() {
  all = await loadAllQuestions();
  const topics = [...new Set(all.map((question) => `${question.module}`))];
  const app = document.querySelector('#practiceApp');
  app.innerHTML = `<span class="eyebrow">${all.length} original questions</span><h1>Practice with intent.</h1><p class="lede">Filter down to the exact weakness you want to train. Every miss is automatically added to Revise Later.</p><div class="filters"><input id="bankSearch" type="search" placeholder="Search question text or topic"><select data-filter="subject"><option value="all">Both subjects</option><option value="probability-statistics">Probability & Statistics</option><option value="linear-algebra">Linear Algebra</option></select><select data-filter="module"><option value="all">All modules</option>${topics.map((module) => `<option value="${module}">Module ${module}</option>`).join('')}</select><select data-filter="difficulty"><option value="all">All difficulties</option><option value="foundation">Foundation</option><option value="gate-standard">GATE-standard</option><option value="challenge">Challenge</option></select><select data-filter="type"><option value="all">All types</option><option>MCQ</option><option>MSQ</option><option>NAT</option></select><select data-filter="view"><option value="all">All questions</option><option value="bookmarks">Bookmarks</option><option value="mistakes">Revise Later</option></select></div><div class="results-bar" id="resultCount"></div><div class="question-grid" id="questionResults"></div>`;
  app.querySelector('#bankSearch').addEventListener('input', (event) => { state.query = event.target.value.trim().toLowerCase(); drawQuestions(); });
  app.querySelectorAll('[data-filter]').forEach((select) => select.addEventListener('change', () => { state[select.dataset.filter] = select.value; drawQuestions(); }));
  drawQuestions();
}
render();

